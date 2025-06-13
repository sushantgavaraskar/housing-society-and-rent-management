const Society = require('../models/Society');
const Building = require('../models/Building');
const Flat = require('../models/Flat');
const User = require('../models/User');
const Maintenance = require('../models/Maintenance');
const OwnershipRequest = require('../models/OwnershipRequest');
const Announcement = require('../models/Announcement');
const Complaint = require('../models/Complaint');
const Rent = require('../models/Rent');
const { sendEmail } = require('../utils/sendEmail');

// EXISTING & IMPROVED APIs ...

exports.getMySocieties = async (req, res, next) => {
  try {
    const societies = await Society.find({ admin: req.user._id });
    res.json(societies);
  } catch (err) {
    next(err);
  }
};

exports.createBuilding = async (req, res, next) => {
  try {
    const { societyId, name, totalFloors, totalFlats, addressLabel } = req.body;
    const society = await Society.findById(societyId);
    if (!society) return res.status(404).json({ message: 'Society not found' });

    const building = await Building.create({ name, totalFloors, totalFlats, addressLabel, society: societyId });
    society.totalBuildings += 1;
    await society.save();
    res.status(201).json(building);
  } catch (err) {
    next(err);
  }
};

exports.deleteBuilding = async (req, res, next) => {
  try {
    const building = await Building.findByIdAndDelete(req.params.id);
    if (!building) return res.status(404).json({ message: 'Building not found' });
    res.json({ message: 'Building deleted' });
  } catch (err) {
    next(err);
  }
};

// FLAT OWNERSHIP/TENANT MANAGEMENT

exports.assignFlatOwner = async (req, res, next) => {
  try {
    const { ownerId } = req.body;
    const flat = await Flat.findById(req.params.flatId).populate('society');
    const owner = await User.findById(ownerId);

    if (!flat || !owner || owner.role !== 'owner') {
      return res.status(400).json({ message: 'Invalid flat or owner' });
    }

    flat.owner = owner._id;
    await flat.save();

    // ✅ Assign society to owner if not already set
    if (!owner.society) {
      owner.society = flat.society._id;
      await owner.save();
    }

    res.json({ message: 'Owner assigned successfully', flat });
  } catch (err) {
    next(err);
  }
};


exports.removeFlatOwner = async (req, res, next) => {
  try {
    const flat = await Flat.findById(req.params.flatId);
    if (!flat) return res.status(404).json({ message: 'Flat not found' });

    flat.owner = null;
    await flat.save();
    res.json({ message: 'Owner removed successfully' });
  } catch (err) {
    next(err);
  }
};

// 


exports.removeFlatTenant = async (req, res, next) => {
  try {
    const flat = await Flat.findById(req.params.flatId);
    if (!flat) return res.status(404).json({ message: 'Flat not found' });

    flat.tenant = null;
    flat.isRented = false;
    flat.occupancyStatus = 'vacant';
    await flat.save();
    res.json({ message: 'Tenant removed' });
  } catch (err) {
    next(err);
  }
};

// MAINTENANCE

exports.generateMaintenance = async (req, res, next) => {
  try {
    const { societyId, billingMonth } = req.body;
    const society = await Society.findById(societyId);
    if (!society) return res.status(404).json({ message: 'Society not found' });

    const flats = await Flat.find({ society: societyId });
    const amount = society.maintenancePolicy.amountPerFlat;

    const records = await Maintenance.insertMany(flats.map(flat => ({
      flat: flat._id,
      building: flat.building,
      society: flat.society,
      billingMonth,
      amount,
      generatedBy: req.user._id,
    })));

    res.status(201).json({ message: 'Maintenance generated', records });
  } catch (err) {
    next(err);
  }
};

exports.getMaintenanceStatus = async (req, res, next) => {
  try {
    const { filterBy, id } = req.query; // filterBy: society | flat | user
    let query = {};

    if (filterBy === 'society') query.society = id;
    else if (filterBy === 'flat') query.flat = id;
    else if (filterBy === 'user') {
      const flats = await Flat.find({ $or: [{ owner: id }, { tenant: id }] }, '_id');
      query.flat = { $in: flats.map(f => f._id) };
    }

    const records = await Maintenance.find(query)
      .populate('flat', 'flatNumber')
      .populate('building', 'name');

    res.json({ count: records.length, records });
  } catch (err) {
    next(err);
  }
};

// RENT HISTORY

exports.getRentHistory = async (req, res, next) => {
  try {
    const rentRecords = await Rent.find().populate('flat', 'flatNumber').populate('tenant', 'name email');
    res.json({ count: rentRecords.length, rentRecords });
  } catch (err) {
    next(err);
  }
};

// OWNERSHIP REQUESTS

exports.getOwnershipRequests = async (req, res, next) => {
  try {
    const requests = await OwnershipRequest.find({ status: 'pending' }).populate('flat currentOwner');
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

exports.reviewOwnershipRequest = async (req, res, next) => {
  try {
    const { requestId, status, note } = req.body;
    const request = await OwnershipRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    request.reviewedBy = req.user._id;
    request.reviewedOn = new Date();
    request.adminNote = note;
    await request.save();

    if (status === 'approved') {
      await Flat.findByIdAndUpdate(request.flat, { owner: request.currentOwner });
    }

    res.json({ message: 'Request reviewed', request });
  } catch (err) {
    next(err);
  }
};

// ANNOUNCEMENTS

exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, society, building, audience, validTill } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      createdBy: req.user._id,
      society,
      building: building || null,
      audience,
      validTill: validTill || null,
    });

    res.status(201).json(announcement);
  } catch (err) {
    next(err);
  }
};

// COMPLAINTS

exports.getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({}).populate('raisedBy flat building society');
    res.json(complaints);
  } catch (err) {
    next(err);
  }
};

exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { complaintId, status, adminNote } = req.body;
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    complaint.adminNote = adminNote || '';
    complaint.resolvedBy = req.user._id;
    complaint.resolvedOn = new Date();
    await complaint.save();

    res.json({ message: 'Complaint updated', complaint });
  } catch (err) {
    next(err);
  }
};

// DASHBOARD

exports.getAdminDashboard = async (req, res, next) => {
  try {
    const totalFlats = await Flat.countDocuments();
    const totalTenants = await User.countDocuments({ role: 'tenant' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalPendingComplaints = await Complaint.countDocuments({ status: 'pending' });

    res.json({
      totalFlats,
      totalTenants,
      totalOwners,
      totalPendingComplaints,
    });
  } catch (err) {
    next(err);
  }
};

// AGREEMENTS VIEW

exports.getAllAgreements = async (req, res, next) => {
  try {
    // Future scope: rent/ownership documents if uploaded via upload system
    res.status(501).json({ message: 'Agreement system not implemented yet' });
  } catch (err) {
    next(err);
  }
};

// ADMIN NOTES

exports.addSocietyNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    const society = await Society.findById(req.params.id);
    if (!society) return res.status(404).json({ message: 'Society not found' });

    society.adminNote = note;
    await society.save();
    res.json({ message: 'Note added' });
  } catch (err) {
    next(err);
  }
};

// EMAIL REMINDER

exports.sendReminderToUser = async (req, res, next) => {
  try {
    const { userId, subject, message } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await sendEmail(user.email, subject, message);
    res.json({ message: 'Reminder sent' });
  } catch (err) {
    next(err);
  }
};
