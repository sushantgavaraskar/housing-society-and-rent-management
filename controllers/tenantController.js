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
exports.payRent = async (req, res, next) => {
  try {
    const rent = await Rent.findById(req.params.rentId).populate('tenant');
    if (!rent || rent.tenant._id.toString() !== req.user._id.toString()) {
      return res.status(403).json(formatResponse({
        success: false,
        message: 'Unauthorized rent payment attempt',
        statusCode: 403
      }));
    }

    if (rent.isPaid) {
      return res.status(400).json(formatResponse({
        success: false,
        message: 'Rent already paid',
        statusCode: 400
      }));
    }

    rent.isPaid = true;
    rent.paidAt = new Date();
    await rent.save();

    res.status(200).json(formatResponse({
      message: 'Rent paid successfully',
      data: rent
    }));
  } catch (err) {
    next(err);
  }
};

// 4. File complaint
exports.fileComplaint = async (req, res, next) => {
  try {
    const { flatId, category, subject, description } = req.body;

    const flat = await Flat.findOne({ _id: flatId, tenant: req.user._id });
    if (!flat) {
      return res.status(403).json(formatResponse({
        success: false,
        message: 'Unauthorized access to flat',
        statusCode: 403
      }));
    }

    const complaint = await Complaint.create({
      raisedBy: req.user._id,
      userRole: 'tenant',
      flat: flat._id,
      building: flat.building,
      society: flat.society,
      category,
      subject,
      description,
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
    const complaints = await Complaint.find({
      raisedBy: req.user._id,
      userRole: 'tenant'
    }).populate('flat').populate('building');

    res.status(200).json(formatResponse({
      message: 'Complaints retrieved',
      data: complaints
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
        { building: flat.building }
      ],
      $or: [
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
exports.payMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findById(req.params.maintenanceId).populate('flat');
    if (!maintenance || maintenance.flat.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json(formatResponse({
        success: false,
        message: 'Unauthorized or not found',
        statusCode: 403
      }));
    }

    if (maintenance.isPaid) {
      return res.status(400).json(formatResponse({
        success: false,
        message: 'Already paid',
        statusCode: 400
      }));
    }

    maintenance.isPaid = true;
    maintenance.paidAt = new Date();
    await maintenance.save();

    res.status(200).json(formatResponse({
      message: 'Maintenance paid successfully',
      data: maintenance
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
