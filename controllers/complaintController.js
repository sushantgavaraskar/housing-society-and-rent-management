// controllers/complaintController.js

const Complaint = require('../models/Complaint');
const Flat = require('../models/Flat');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all complaints in the society (admin)
// @route   GET /api/complaints/all
exports.getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({})
      .populate('raisedBy', 'name email role')
      .populate('flat', 'flatNumber')
      .populate('building', 'name')
      .populate('society', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaints for a specific building (admin or owner)
// @route   GET /api/complaints/building/:buildingId
exports.getComplaintsByBuilding = async (req, res, next) => {
  try {
    const { buildingId } = req.params;

    const complaints = await Complaint.find({ building: buildingId })
      .populate('raisedBy', 'name email role')
      .populate('flat', 'flatNumber')
      .populate('building', 'name')
      .populate('society', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark complaint as resolved (admin/owner)
// @route   PUT /api/complaints/:id/resolve
exports.resolveComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = 'resolved';
    await complaint.save();

    // Notify the user via email
    await complaint.populate('raisedBy', 'email name');
    await sendEmail(
      complaint.raisedBy.email,
      'Your Complaint has been Resolved',
      `Hi ${complaint.raisedBy.name},\n\nYour complaint titled "${complaint.title}" has been resolved.\n\nThank you for your patience.\n\n- Housing Society Management`
    );


    res.status(200).json({ message: 'Complaint marked as resolved', complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a complaint (admin only)
// @route   DELETE /api/complaints/:id
exports.deleteComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.remove();
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    next(error);
  }
};
