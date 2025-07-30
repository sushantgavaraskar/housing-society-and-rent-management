// controllers/complaintController.js

const Complaint = require('../models/Complaint');
const Flat = require('../models/Flat');
const formatResponse = require('../utils/responseFormatter');
const { createComplaint: createComplaintService, updateComplaintStatus: updateComplaintStatusService, getAllComplaints: getAllComplaintsService } = require('../services/complaintService');

// Create a new complaint (Owner or Tenant)
exports.createComplaint = async (req, res, next) => {
  try {
    const { category, subject, description, flatId } = req.body;
    
    // If flatId is provided, validate it belongs to the user
    let flat = null;
    if (flatId) {
      flat = await Flat.findOne({
        _id: flatId,
        $or: [
          { owner: req.user._id },
          { tenant: req.user._id }
        ]
      });
      
      if (!flat) {
        return res.status(403).json(formatResponse({
          success: false,
          message: 'Flat not found or you do not have access to it',
          statusCode: 403
        }));
      }
    } else {
      // If no flatId provided, find the user's flat
      flat = await Flat.findOne({
        $or: [
          { owner: req.user._id },
          { tenant: req.user._id }
        ]
      });
      
      if (!flat) {
        return res.status(404).json(formatResponse({
          success: false,
          message: 'No flat assigned to you',
          statusCode: 404
        }));
      }
    }

    const complaint = await createComplaintService({
      raisedBy: req.user._id,
      userRole: req.user.role,
      flatId: flat._id,
      category,
      subject,
      description
    });

    res.status(201).json(formatResponse({
      message: 'Complaint submitted successfully',
      data: complaint
    }));
  } catch (err) {
    next(err);
  }
};

// Get complaints filed by the logged-in user
exports.getMyComplaints = async (req, res, next) => {
  try {
    const { page, limit, skip } = req.pagination || { page: 1, limit: 10, skip: 0 };
    const { status, category } = req.query;

    const filter = { raisedBy: req.user._id };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate('flat', 'flatNumber')
        .populate('building', 'name')
        .populate('society', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Complaint.countDocuments(filter)
    ]);

    res.json(formatResponse({
      message: 'Complaints retrieved successfully',
      data: complaints,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (err) {
    next(err);
  }
};

// Get all complaints (Admin only)
exports.getAllComplaints = async (req, res, next) => {
  try {
    const { page, limit, skip } = req.pagination || { page: 1, limit: 10, skip: 0 };
    const { status, society, category } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (society) filter.society = society;
    if (category) filter.category = category;

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate('raisedBy', 'name email')
        .populate('flat', 'flatNumber')
        .populate('building', 'name')
        .populate('society', 'name')
        .populate('resolvedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Complaint.countDocuments(filter)
    ]);

    res.json(formatResponse({
      message: 'All complaints retrieved successfully',
      data: complaints,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (err) {
    next(err);
  }
};

// Update complaint status (Admin only)
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const complaint = await updateComplaintStatusService({
      complaintId: id,
      status,
      adminNote,
      resolvedBy: req.user._id
    });

    res.json(formatResponse({
      message: 'Complaint status updated successfully',
      data: complaint
    }));
  } catch (err) {
    next(err);
  }
};
