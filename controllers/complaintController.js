// controllers/complaintController.js

const {
  createComplaint,
  getComplaintsByUser,
  getAllComplaints,
  updateComplaintStatus
} = require('../services/complaintService');

const formatResponse = require('../utils/responseFormatter');

// 1. Create a complaint (Tenant or Owner)
exports.createComplaint = async (req, res, next) => {
  try {
    const { flatId, category, subject, description } = req.body;

    const complaint = await createComplaint({
      raisedBy: req.user._id,
      userRole: req.user.role,
      flatId,
      category,
      subject,
      description
    });

    res.status(201).json(formatResponse({
      message: 'Complaint created successfully',
      data: complaint
    }));
  } catch (err) {
    next(err);
  }
};

// 2. Get all complaints raised by logged-in user
exports.getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await getComplaintsByUser(req.user._id, req.user.role);

    res.status(200).json(formatResponse({
      message: 'Your complaints',
      data: complaints
    }));
  } catch (err) {
    next(err);
  }
};

// 3. Get all complaints (Admin only, with pagination and filters)
exports.getAllComplaints = async (req, res, next) => {
  try {
    const { page, limit, status, category } = req.query;

    const { complaints, total } = await getAllComplaints({
      page,
      limit,
      status,
      category
    });

    res.status(200).json(formatResponse({
      message: 'Complaints retrieved',
      data: complaints,
      pagination: {
        total,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        pages: Math.ceil(total / (limit || 10))
      }
    }));
  } catch (err) {
    next(err);
  }
};

// 4. Update complaint status (Admin only)
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { complaintId, status, adminNote } = req.body;

    const complaint = await updateComplaintStatus({
      complaintId,
      status,
      adminNote,
      resolvedBy: req.user._id
    });

    res.status(200).json(formatResponse({
      message: 'Complaint updated',
      data: complaint
    }));
  } catch (err) {
    next(err);
  }
};
