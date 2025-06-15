const Complaint = require('../models/Complaint');
const Flat = require('../models/Flat');
const formatResponse = require('../utils/responseFormatter');

// Get all complaints (for admin)
exports.getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate('raisedBy', 'name email role')
      .populate('flat')
      .populate('building')
      .populate('society');

    res.status(200).json(formatResponse({
      message: 'All complaints retrieved',
      data: complaints
    }));
  } catch (err) {
    next(err);
  }
};

// Get single complaint by ID
exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('raisedBy', 'name email role')
      .populate('flat')
      .populate('building')
      .populate('society');

    if (!complaint) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'Complaint not found',
        statusCode: 404
      }));
    }

    res.status(200).json(formatResponse({
      message: 'Complaint retrieved',
      data: complaint
    }));
  } catch (err) {
    next(err);
  }
};

// Update complaint status (Admin)
exports.updateComplaint = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'Complaint not found',
        statusCode: 404
      }));
    }

    complaint.status = status || complaint.status;
    complaint.adminNote = adminNote || complaint.adminNote;
    complaint.resolvedBy = req.user._id;
    complaint.resolvedOn = new Date();

    await complaint.save();

    res.status(200).json(formatResponse({
      message: 'Complaint updated successfully',
      data: complaint
    }));
  } catch (err) {
    next(err);
  }
};

// Get complaints by current user (if needed here too)
exports.getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ raisedBy: req.user._id })
      .populate('flat')
      .populate('building')
      .populate('society');

    res.status(200).json(formatResponse({
      message: 'My complaints retrieved',
      data: complaints
    }));
  } catch (err) {
    next(err);
  }
};

// File a new complaint
exports.createComplaint = async (req, res, next) => {
  try {
    const { flatId, category, subject, description } = req.body;

    const flat = await Flat.findById(flatId).populate('building').populate('society');
    if (!flat) {
      return res.status(400).json(formatResponse({
        success: false,
        message: 'Flat not found',
        statusCode: 400
      }));
    }

    const complaint = await Complaint.create({
      raisedBy: req.user._id,
      userRole: req.user.role,
      flat: flat._id,
      building: flat.building._id,
      society: flat.society._id,
      category,
      subject,
      description
    });

    res.status(201).json(formatResponse({
      message: 'Complaint created',
      data: complaint
    }));
  } catch (err) {
    next(err);
  }
};
