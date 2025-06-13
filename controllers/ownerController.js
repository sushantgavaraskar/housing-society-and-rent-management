// controllers/ownerController.js

const Flat = require('../models/Flat');
const Complaint = require('../models/Complaint');
const OwnershipRequest = require('../models/OwnershipRequest');
const Rent = require('../models/Rent');
const User = require('../models/User');
const Society = require('../models/Society');

// 1. Get all flats owned by logged-in owner
exports.getMyFlats = async (req, res) => {
  try {
    const flats = await Flat.find({ owner: req.user._id })
      .populate('building')
      .populate('tenant');

    res.status(200).json({ flats });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch flats', error: err.message });
  }
};

// 2. View society/building info of a specific flat (new)
exports.getFlatSocietyInfo = async (req, res) => {
  try {
    const flat = await Flat.findOne({ _id: req.params.id, owner: req.user._id })
      .populate('building')
      .populate('society');

    if (!flat) {
      return res.status(404).json({ message: 'Flat not found or unauthorized' });
    }

    res.status(200).json({ building: flat.building, society: flat.society });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch info', error: err.message });
  }
};

// 3. Submit ownership transfer request
exports.submitOwnershipRequest = async (req, res) => {
  try {
    const { flatId, newOwnerName, newOwnerEmail, newOwnerPhone, reason } = req.body;

    const flat = await Flat.findById(flatId);
    if (!flat || flat.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to request ownership for this flat' });
    }

    const request = await OwnershipRequest.create({
      flat: flatId,
      currentOwner: req.user._id,
      newOwnerName,
      newOwnerEmail,
      newOwnerPhone,
      reason,
    });

    res.status(201).json({ message: 'Ownership request submitted', request });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit request', error: err.message });
  }
};

// 4. Rent payment history
exports.getRentHistory = async (req, res) => {
  try {
    const rents = await Rent.find({ owner: req.user._id })
      .populate('flat')
      .populate('tenant');

    res.status(200).json({ rents });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch rent history', error: err.message });
  }
};

// 5. File complaint
exports.fileComplaint = async (req, res) => {
  try {
    const { flatId, category, subject, description } = req.body;

    const flat = await Flat.findOne({ _id: flatId, owner: req.user._id });
    if (!flat) {
      return res.status(403).json({ message: 'Unauthorized access to flat' });
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

    res.status(201).json({ message: 'Complaint submitted', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit complaint', error: err.message });
  }
};

// 6. View own complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ raisedBy: req.user._id, userRole: 'owner' })
      .populate('flat')
      .populate('building');

    res.status(200).json({ complaints });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: err.message });
  }
};

// 7. Dashboard summary (new)
exports.getOwnerDashboard = async (req, res) => {
  try {
    const flats = await Flat.find({ owner: req.user._id });
    const flatIds = flats.map(f => f._id);

    const rentCount = await Rent.countDocuments({ flat: { $in: flatIds } });
    const complaintCount = await Complaint.countDocuments({ raisedBy: req.user._id, userRole: 'owner' });

    res.status(200).json({
      totalFlatsOwned: flats.length,
      rentPaymentsMade: rentCount,
      complaintsFiled: complaintCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard info', error: err.message });
  }
};
// View unpaid maintenance bills for owner-occupied or unrented flats
exports.getUnpaidMaintenance = async (req, res) => {
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

    res.status(200).json(maintenance);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch maintenance dues', error: err.message });
  }
};

// Pay maintenance for owner-occupied/unrented flat
exports.payMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.maintenanceId).populate('flat');

    if (!maintenance) return res.status(404).json({ message: 'Maintenance not found' });

    const isOwnedByUser = maintenance.flat.owner.toString() === req.user._id.toString();
    const isVacantOrOwnerOccupied = !maintenance.flat.tenant;

    if (!isOwnedByUser || !isVacantOrOwnerOccupied) {
      return res.status(403).json({ message: 'Unauthorized: Flat is not owner-occupied or already rented' });
    }

    if (maintenance.isPaid) return res.status(400).json({ message: 'Maintenance already paid' });

    maintenance.isPaid = true;
    maintenance.paidAt = new Date();
    await maintenance.save();

    res.status(200).json({ message: 'Maintenance paid successfully', maintenance });
  } catch (err) {
    res.status(500).json({ message: 'Failed to process payment', error: err.message });
  }
};

// ✅ NEW: Assign tenant to a flat owned by logged-in owner
exports.assignTenantToMyFlat = async (req, res) => {
  try {
    const { flatId, tenantId } = req.body;

    const flat = await Flat.findOne({ _id: flatId, owner: req.user._id }).populate('society');
    if (!flat) {
      return res.status(403).json({ message: 'You do not own this flat or flat not found' });
    }

    const tenant = await User.findById(tenantId);
    if (!tenant || tenant.role !== 'tenant') {
      return res.status(400).json({ message: 'Invalid tenant user' });
    }

    // Assign tenant to flat
    flat.tenant = tenant._id;
    flat.isRented = true;
    flat.occupancyStatus = 'occupied';
    await flat.save();

    // Assign society to tenant if not already linked
    if (!tenant.society) {
      tenant.society = flat.society._id;
      await tenant.save();
    }

    res.status(200).json({ message: 'Tenant assigned successfully', flat });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign tenant', error: err.message });
  }
};
