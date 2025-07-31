const Flat = require('../models/Flat');
const Complaint = require('../models/Complaint');
const OwnershipRequest = require('../models/OwnershipRequest');
const Rent = require('../models/Rent');
const User = require('../models/User');
const Maintenance = require('../models/Maintenance');
const formatResponse = require('../utils/responseFormatter');
const DashboardService = require('../services/dashboardService');
const FlatService = require('../services/flatService');

// 1. Get all flats owned by logged-in owner
exports.getMyFlats = async (req, res, next) => {
  try {
    const flats = await FlatService.getFlatsByOwner(req.user._id);

    res.status(200).json(formatResponse({
      message: 'Flats retrieved successfully',
      data: flats
    }));
  } catch (err) {
    next(err);
  }
};

// 2. View society/building info of a specific flat
exports.getFlatSocietyInfo = async (req, res, next) => {
  try {
    const flat = await Flat.findOne({ _id: req.params.id, owner: req.user._id })
      .populate('building')
      .populate('society');

    if (!flat) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'Flat not found or unauthorized',
        statusCode: 404
      }));
    }

    res.status(200).json(formatResponse({
      message: 'Flat info retrieved successfully',
      data: {
        building: flat.building,
        society: flat.society
      }
    }));
  } catch (err) {
    next(err);
  }
};

// 3. Submit ownership transfer request
exports.submitOwnershipRequest = async (req, res, next) => {
  try {
    const { flatId, newOwnerName, newOwnerEmail, newOwnerPhone, reason } = req.body;

    const flat = await Flat.findById(flatId);
    if (!flat || flat.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json(formatResponse({
        success: false,
        message: 'Unauthorized for this flat',
        statusCode: 403
      }));
    }

    const request = await OwnershipRequest.create({
      flat: flatId,
      currentOwner: req.user._id,
      newOwnerName,
      newOwnerEmail,
      newOwnerPhone,
      reason,
    });

    res.status(201).json(formatResponse({
      message: 'Ownership request submitted successfully',
      data: request
    }));
  } catch (err) {
    next(err);
  }
};

// Get my ownership requests
exports.getMyOwnershipRequests = async (req, res, next) => {
  try {
    const requests = await OwnershipRequest.find({ 
      currentOwner: req.user._id 
    }).populate('flat');

    res.status(200).json(formatResponse({
      message: 'Ownership requests retrieved successfully',
      data: requests
    }));
  } catch (err) {
    next(err);
  }
};

// 4. Rent payment history
exports.getRentHistory = async (req, res, next) => {
  try {
    const rents = await Rent.find({ owner: req.user._id })
      .populate('flat')
      .populate('tenant');

    res.status(200).json(formatResponse({
      message: 'Rent history retrieved successfully',
      data: rents
    }));
  } catch (err) {
    next(err);
  }
};

// 5. Dashboard summary
exports.getOwnerDashboard = async (req, res, next) => {
  try {
    const dashboardData = await DashboardService.getOwnerDashboard(req.user._id);

    res.status(200).json(formatResponse({
      message: 'Owner dashboard data retrieved successfully',
      data: dashboardData
    }));
  } catch (err) {
    next(err);
  }
};

// 6. View unpaid maintenance bills for owner flats
exports.getUnpaidMaintenance = async (req, res, next) => {
  try {
    const flats = await Flat.find({
      owner: req.user._id,
      $or: [{ tenant: null }, { tenant: { $exists: false } }]
    });

    const flatIds = flats.map(f => f._id);

    const maintenance = await Maintenance.find({
      flat: { $in: flatIds },
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

// 7. Pay maintenance for owner flats
const { payMaintenance } = require('../services/paymentService');

exports.payMaintenance = async (req, res, next) => {
  try {
    const result = await payMaintenance({
      maintenanceId: req.params.maintenanceId,
      userId: req.user._id,
      role: 'owner'
    });

    res.status(200).json(formatResponse({
      message: 'Maintenance paid successfully',
      data: result
    }));
  } catch (err) {
    next(err);
  }
};

// 8. Assign tenant to flat
exports.assignTenantToMyFlat = async (req, res, next) => {
  try {
    const { tenantId } = req.body;
    const flat = await FlatService.assignTenantToFlat(req.params.id, tenantId, req.user._id);

    res.status(200).json(formatResponse({
      message: 'Tenant assigned successfully',
      data: flat
    }));
  } catch (err) {
    next(err);
  }
};

exports.removeTenantFromMyFlat = async (req, res, next) => {
  try {
    const flat = await FlatService.removeTenantFromFlat(req.params.flatId, req.user._id);

    res.json(formatResponse({
      message: 'Tenant removed successfully',
      data: flat
    }));
  } catch (err) {
    next(err);
  }
};

exports.updateTenantForMyFlat = async (req, res, next) => {
  try {
    const { newTenantId } = req.body;
    const flat = await FlatService.assignTenantToFlat(req.params.flatId, newTenantId, req.user._id);

    res.status(200).json(formatResponse({
      message: 'Tenant updated successfully',
      data: flat
    }));
  } catch (err) {
    next(err);
  }
};
