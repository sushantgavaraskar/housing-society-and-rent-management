// controllers/complaintController.js

const {
  createComplaint,
  getComplaintsByUser,
  getAllComplaints,
  updateComplaintStatus
} = require('../services/complaintService');
const formatResponse = require('../utils/responseFormatter');
const { asyncHandler } = require('../middleware/errorHandler');

// For tenant or owner complaint creation
exports.createComplaint = asyncHandler(async (req, res) => {
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
});

// For fetching user’s own complaints
exports.getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await getComplaintsByUser(req.user._id, req.user.role);
  res.json(formatResponse({
    message: 'Your complaints',
    data: complaints
  }));
});

// controllers/complaintController.js
const { getAllComplaints } = require('../services/complaintService');
const formatResponse = require('../utils/responseFormatter');

exports.getAllComplaints = async (req, res, next) => {
  try {
    const { page, limit, status, category } = req.query;

    const { complaints, total } = await getAllComplaints({ page, limit, status, category });

    res.json(formatResponse({
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



// Admin: update complaint status
exports.updateComplaintStatus = asyncHandler(async (req, res) => {
  const { complaintId, status, adminNote } = req.body;

  const complaint = await updateComplaintStatus({
    complaintId,
    status,
    adminNote,
    resolvedBy: req.user._id
  });

  res.json(formatResponse({
    message: 'Complaint updated',
    data: complaint
  }));
});
