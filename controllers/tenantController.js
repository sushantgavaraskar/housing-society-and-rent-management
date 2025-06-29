const Flat = require('../models/Flat');
const Complaint = require('../models/Complaint');
const Maintenance = require('../models/Maintenance');
const Rent = require('../models/Rent');
const Announcement = require('../models/Announcement');
const formatResponse = require('../utils/responseFormatter');

// 1. Get assigned flat
exports.getMyFlat = async (req, res, next) => {
  try {
    const flat = await Flat.findOne({ tenant: req.user._id })
      .populate('building')
      .populate('owner');

    if (!flat) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'Flat not assigned',
        statusCode: 404
      }));
    }

    res.status(200).json(formatResponse({
      message: 'Assigned flat retrieved',
      data: flat
    }));
  } catch (err) {
    next(err);
  }
};

// 2. Rent history
exports.getRentHistory = async (req, res, next) => {
  try {
    const rents = await Rent.find({ tenant: req.user._id })
      .populate('flat');

    res.status(200).json(formatResponse({
      message: 'Rent history retrieved',
      data: rents
    }));
  } catch (err) {
    next(err);
  }
};

// 3. Pay rent
const { payRent } = require('../services/paymentService');

exports.payRent = async (req, res, next) => {
  try {
    const result = await payRent({
      rentId: req.params.rentId,
      userId: req.user._id
    });

    res.status(200).json(formatResponse({
      message: 'Rent paid successfully',
      data: result
    }));
  } catch (err) {
    next(err);
  }
};


// 4. File complaint
const { createComplaint } = require('../services/complaintService');

exports.fileComplaint = async (req, res, next) => {
  try {
    const { flatId, category, subject, description } = req.body;
    const complaint = await createComplaint({
      raisedBy: req.user._id,
      userRole: 'tenant',
      flatId,
      category,
      subject,
      description
    });

    res.status(201).json(formatResponse({
      message: 'Complaint filed',
      data: complaint
    }));
  } catch (err) {
    next(err);
  }
};

// 5. View own complaints
exports.getMyComplaints = async (req, res, next) => {
  try {
    const { page, limit, skip } = require('../utils/pagination').paginateQuery(req);
    const [complaints, total] = await Promise.all([
      Complaint.find({ raisedBy: req.user._id, userRole: 'tenant' })
        .populate('flat building').skip(skip).limit(limit),
      Complaint.countDocuments({ raisedBy: req.user._id, userRole: 'tenant' })
    ]);

    res.status(200).json(formatResponse({
      message: 'Complaints retrieved',
      data: complaints,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    }));
  } catch (err) {
    next(err);
  }
};


// 6. View announcements
exports.getRelevantAnnouncements = async (req, res, next) => {
  try {
    const flat = await Flat.findOne({ tenant: req.user._id });
    if (!flat) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'No assigned flat found',
        statusCode: 404
      }));
    }

    const announcements = await Announcement.find({
      society: flat.society,
      $or: [
        { audience: 'all' },
        { audience: 'tenants' },
        { building: null },
        { building: flat.building },
      
        { validTill: null },
        { validTill: { $gte: new Date() } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(formatResponse({
      message: 'Announcements retrieved',
      data: announcements
    }));
  } catch (err) {
    next(err);
  }
};

// 7. View unpaid maintenance
exports.getUnpaidMaintenance = async (req, res, next) => {
  try {
    const flat = await Flat.findOne({ tenant: req.user._id });
    if (!flat) {
      return res.status(403).json(formatResponse({
        success: false,
        message: 'Unauthorized',
        statusCode: 403
      }));
    }

    const maintenance = await Maintenance.find({
      flat: flat._id,
      isPaid: false
    }).sort({ billingMonth: -1 });

    res.status(200).json(formatResponse({
      message: 'Unpaid maintenance retrieved',
      data: maintenance
    }));
  } catch (err) {
    next(err);
  }
};

// 8. Pay maintenance
const { payMaintenance } = require('../services/paymentService');

exports.payMaintenance = async (req, res, next) => {
  try {
    const result = await payMaintenance({
      maintenanceId: req.params.maintenanceId,
      userId: req.user._id,
      role: 'tenant'
    });

    res.status(200).json(formatResponse({
      message: 'Maintenance paid successfully',
      data: result
    }));
  } catch (err) {
    next(err);
  }
};

// 9. Dashboard overview
exports.getTenantDashboard = async (req, res, next) => {
  try {
    const rentCount = await Rent.countDocuments({ tenant: req.user._id });
    const complaintCount = await Complaint.countDocuments({ raisedBy: req.user._id, userRole: 'tenant' });
    const unpaidMaintenance = await Maintenance.countDocuments({ isPaid: false, flat: (await Flat.findOne({ tenant: req.user._id }))._id });

    res.status(200).json(formatResponse({
      message: 'Dashboard retrieved',
      data: {
        rentPayments: rentCount,
        complaintsFiled: complaintCount,
        unpaidMaintenanceCount: unpaidMaintenance
      }
    }));
  } catch (err) {
    next(err);
  }
};

// 2.5. Get current month's rent (if exists)
exports.getCurrentRent = async (req, res, next) => {
  try {
    const flat = await Flat.findOne({ tenant: req.user._id });
    if (!flat) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'Flat not assigned',
        statusCode: 404
      }));
    }

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const rent = await Rent.findOne({
      flat: flat._id,
      tenant: req.user._id,
      billingMonth: currentMonth,
    });

    if (!rent) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'No rent record found for this month',
        statusCode: 404
      }));
    }

    res.status(200).json(formatResponse({
      message: 'Current month rent retrieved',
      data: rent
    }));
  } catch (err) {
    next(err);
  }
};
exports.updateMyProfile = async (req, res, next) => {
  try {
    const { name, phone, profilePic } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json(formatResponse({ success: false, message: 'User not found' }));

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profilePic) user.profilePic = profilePic;

    await user.save();

    res.status(200).json(formatResponse({
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePic: user.profilePic
      }
    }));
  } catch (err) {
    next(err);
  }
};

