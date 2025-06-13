const Flat = require('../models/Flat');
const Rent = require('../models/Rent');
const Complaint = require('../models/Complaint');
const Announcement = require('../models/Announcement');
const Maintenance = require('../models/Maintenance');
// 1. Get the flat assigned to the tenant
exports.getMyFlat = async (req, res, next) => {
  try {
    const flat = await Flat.findOne({ tenant: req.user._id })
      .populate('building', 'name')
      .populate('society', 'name');
    
    if (!flat) {
      return res.status(404).json({ message: 'No flat assigned.' });
    }

    res.status(200).json(flat);
  } catch (error) {
    next(error);
  }
};

// 2. Rent history
exports.getRentHistory = async (req, res, next) => {
  try {
    const rents = await Rent.find({ tenant: req.user._id })
      .sort({ billingMonth: -1 })
      .populate('flat', 'flatNumber')
      .populate('owner', 'name email');

    res.status(200).json(rents);
  } catch (error) {
    next(error);
  }
};

// 3. File a complaint
exports.fileComplaint = async (req, res, next) => {
  try {
    const { category, subject, description } = req.body;

    const flat = await Flat.findOne({ tenant: req.user._id });
    if (!flat) {
      return res.status(400).json({ message: 'No flat assigned.' });
    }

    const complaint = await Complaint.create({
      raisedBy: req.user._id,
      userRole: 'tenant',
      flat: flat._id,
      building: flat.building,
      society: flat.society,
      category,
      subject,
      description
    });

    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};

// 4. View tenant's submitted complaints
exports.getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ raisedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    next(error);
  }
};

// 5. Get announcements (filtered by society or building)
exports.getAnnouncements = async (req, res, next) => {
  try {
    const flat = await Flat.findOne({ tenant: req.user._id });
    if (!flat) return res.status(400).json({ message: 'Flat not found.' });

    const announcements = await Announcement.find({
      $or: [
        { targetSociety: flat.society },
        { targetBuilding: flat.building }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(announcements);
  } catch (error) {
    next(error);
  }
};

// 6. Dashboard summary (total rent paid, complaints filed, etc.)
exports.getTenantDashboard = async (req, res, next) => {
  try {
    const flat = await Flat.findOne({ tenant: req.user._id });
    const rentCount = await Rent.countDocuments({ tenant: req.user._id });
    const complaintCount = await Complaint.countDocuments({ raisedBy: req.user._id, userRole: 'tenant' });

    res.status(200).json({
      flatAssigned: !!flat,
      totalRentsPaid: rentCount,
      complaintsFiled: complaintCount,
    });
  } catch (error) {
    next(error);
  }
};
// 7. Get current unpaid rent
exports.getCurrentRent = async (req, res, next) => {
  try {
    const rent = await Rent.findOne({
      tenant: req.user._id,
      isPaid: false
    }).sort({ billingMonth: -1 }).populate('flat');

    if (!rent) {
      return res.status(200).json({ message: 'No unpaid rent found' });
    }

    res.status(200).json(rent);
  } catch (error) {
    next(error);
  }
};

// 8. Simulate rent payment
exports.payRent = async (req, res, next) => {
  try {
    const rent = await Rent.findOne({
      _id: req.params.rentId,
      tenant: req.user._id
    });

    if (!rent) return res.status(404).json({ message: 'Rent record not found' });
    if (rent.isPaid) return res.status(400).json({ message: 'Rent already paid' });

    rent.isPaid = true;
    rent.paidAt = new Date();
    await rent.save();

    res.status(200).json({ message: 'Rent marked as paid', rent });
  } catch (error) {
    next(error);
  }
};

// 9. View unpaid maintenance bills
exports.getUnpaidMaintenance = async (req, res, next) => {
  try {
    const flat = await Flat.findOne({ tenant: req.user._id });
    if (!flat) return res.status(400).json({ message: 'No assigned flat' });

    const maintenance = await Maintenance.find({
      flat: flat._id,
      isPaid: false
    }).sort({ billingMonth: -1 });

    res.status(200).json(maintenance);
  } catch (error) {
    next(error);
  }
};

// 10. Pay maintenance
exports.payMaintenance = async (req, res, next) => {
  try {
    const flat = await Flat.findOne({ tenant: req.user._id });
    if (!flat) return res.status(400).json({ message: 'No assigned flat' });

    const maintenance = await Maintenance.findOne({
      _id: req.params.maintenanceId,
      flat: flat._id
    });

    if (!maintenance) return res.status(404).json({ message: 'Maintenance record not found' });
    if (maintenance.isPaid) return res.status(400).json({ message: 'Already paid' });

    maintenance.isPaid = true;
    maintenance.paidAt = new Date();
    await maintenance.save();

    res.status(200).json({ message: 'Maintenance marked as paid', maintenance });
  } catch (error) {
    next(error);
  }
};