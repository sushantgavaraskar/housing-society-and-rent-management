const Flat = require('../models/Flat');
const Complaint = require('../models/Complaint');
const Maintenance = require('../models/Maintenance');
const Rent = require('../models/Rent');
const Announcement = require('../models/Announcement');
const User = require('../models/User');
const formatResponse = require('../utils/responseFormatter');
const DashboardService = require('../services/dashboardService');
const FlatService = require('../services/flatService');

// 1. Get assigned flat
exports.getMyFlat = async (req, res, next) => {
  try {
    const flat = await FlatService.getUserFlat(req.user._id);

    res.status(200).json(formatResponse({
      message: 'Assigned flat retrieved successfully',
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
      message: 'Rent history retrieved successfully',
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

// 4. View unpaid maintenance
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
      message: 'Unpaid maintenance retrieved successfully',
      data: maintenance
    }));
  } catch (err) {
    next(err);
  }
};

// 5. Pay maintenance
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

// 6. Dashboard overview
exports.getTenantDashboard = async (req, res, next) => {
  try {
    const dashboardData = await DashboardService.getTenantDashboard(req.user._id);

    res.status(200).json(formatResponse({
      message: 'Tenant dashboard data retrieved successfully',
      data: dashboardData
    }));
  } catch (err) {
    next(err);
  }
};

// 7. Get current month's rent (if exists)
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
      message: 'Current month rent retrieved successfully',
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
    if (!user) return res.status(404).json(formatResponse({
      success: false,
      message: 'User not found',
      statusCode: 404
    }));

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

// 📣 Announcements
exports.getRelevantAnnouncements = async (req, res, next) => {
  try {
    const { priority, page = 1, limit = 10 } = req.query;
    
    const flat = await Flat.findOne({ tenant: req.user._id });
    if (!flat) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'No assigned flat found',
        statusCode: 404
      }));
    }

    const filter = { society: flat.society };
    if (priority) filter.priority = priority;

    const skip = (page - 1) * limit;
    const [announcements, total] = await Promise.all([
      Announcement.find(filter)
        .populate('society', 'name')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Announcement.countDocuments(filter)
    ]);

    res.json(formatResponse({
      message: 'Relevant announcements retrieved successfully',
      data: announcements,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (err) {
    next(err);
  }
};

exports.getRentDue = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'User not found',
        statusCode: 404
      }));
    }
    
    const flat = await Flat.findOne({ tenant: req.user._id });
    if (!flat) {
      return res.status(403).json(formatResponse({
        success: false,
        message: 'Tenant not assigned to any flat',
        statusCode: 403
      }));
    }
    
    // Get unpaid rent for the tenant
    const unpaidRent = await Rent.find({
      flat: flat._id,
      tenant: req.user._id,
      status: 'unpaid'
    }).sort({ dueDate: 1 });
    
    res.json(formatResponse({
      message: 'Rent due retrieved successfully',
      data: unpaidRent
    }));
  } catch (err) {
    next(err);
  }
};

