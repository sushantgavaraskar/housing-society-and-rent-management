const Flat = require('../models/Flat');
const Complaint = require('../models/Complaint');
const OwnershipRequest = require('../models/OwnershipRequest');
const Rent = require('../models/Rent');
const User = require('../models/User');
const Maintenance = require('../models/Maintenance');
const formatResponse = require('../utils/responseFormatter');

// 1. Get all flats owned by logged-in owner
exports.getMyFlats = async (req, res, next) => {
  try {
    const flats = await Flat.find({ owner: req.user._id })
      .populate('building')
      .populate('tenant');

    res.status(200).json(formatResponse({
      message: 'Flats retrieved',
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
      message: 'Flat info retrieved',
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
      message: 'Ownership request submitted',
      data: request
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
      message: 'Rent history retrieved',
      data: rents
    }));
  } catch (err) {
    next(err);
  }
};

// 5. File complaint
exports.fileComplaint = async (req, res, next) => {
  try {
    const { flatId, category, subject, description } = req.body;

    const flat = await Flat.findOne({ _id: flatId, owner: req.user._id });
    if (!flat) {
      return res.status(403).json(formatResponse({
        success: false,
        message: 'Unauthorized access to flat',
        statusCode: 403
      }));
    }

    const complaint = await Complaint.create({
      raisedBy: req.user._id,
      userRole: 'owner',
      flat: flatId,
      building: flat.building,
      society: flat.society,
      category,
      subject,
      description,
    });

    res.status(201).json(formatResponse({
      message: 'Complaint submitted',
      data: complaint
    }));
  } catch (err) {
    next(err);
  }
};

// 6. View own complaints
exports.getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ raisedBy: req.user._id, userRole: 'owner' })
      .populate('flat')
      .populate('building');

    res.status(200).json(formatResponse({
      message: 'Complaints retrieved',
      data: complaints
    }));
  } catch (err) {
    next(err);
  }
};

// 7. Dashboard summary
exports.getOwnerDashboard = async (req, res, next) => {
  try {
    const flats = await Flat.find({ owner: req.user._id });
    const flatIds = flats.map(f => f._id);

    const rentCount = await Rent.countDocuments({ flat: { $in: flatIds } });
    const complaintCount = await Complaint.countDocuments({ raisedBy: req.user._id, userRole: 'owner' });

    res.status(200).json(formatResponse({
      message: 'Dashboard data retrieved',
      data: {
        totalFlatsOwned: flats.length,
        rentPaymentsMade: rentCount,
        complaintsFiled: complaintCount
      }
    }));
  } catch (err) {
    next(err);
  }
};

// 8. View unpaid maintenance bills for owner flats
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
      message: 'Unpaid maintenance retrieved',
      data: maintenance
    }));
  } catch (err) {
    next(err);
  }
};

// 9. Pay maintenance for owner flats
exports.payMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findById(req.params.maintenanceId).populate('flat');

    if (!maintenance) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'Maintenance not found',
        statusCode: 404
      }));
    }

    const isOwnedByUser = maintenance.flat.owner.toString() === req.user._id.toString();
    const isVacantOrOwnerOccupied = !maintenance.flat.tenant;

    if (!isOwnedByUser || !isVacantOrOwnerOccupied) {
      return res.status(403).json(formatResponse({
        success: false,
        message: 'Unauthorized: not owner-occupied or already rented',
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

// 10. Assign tenant to flat
exports.assignTenantToMyFlat = async (req, res, next) => {
  try {
    const { flatId, tenantId } = req.body;

    const flat = await Flat.findOne({ _id: flatId, owner: req.user._id }).populate('society');
    if (!flat) {
      return res.status(403).json(formatResponse({
        success: false,
        message: 'Unauthorized or flat not found',
        statusCode: 403
      }));
    }

    const tenant = await User.findById(tenantId);
    if (!tenant || tenant.role !== 'tenant') {
      return res.status(400).json(formatResponse({
        success: false,
        message: 'Invalid tenant user',
        statusCode: 400
      }));
    }

    flat.tenant = tenant._id;
    flat.isRented = true;
    flat.occupancyStatus = 'occupied';
    await flat.save();

    if (!tenant.society) {
      tenant.society = flat.society._id;
      await tenant.save();
    }

    res.status(200).json(formatResponse({
      message: 'Tenant assigned successfully',
      data: flat
    }));
  } catch (err) {
    next(err);
  }
};
