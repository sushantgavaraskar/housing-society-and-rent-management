// controllers/ownershipRequestController.js

const { reviewOwnershipRequest } = require('../services/ownershipService');
const OwnershipRequest = require('../models/OwnershipRequest');
const formatResponse = require('../utils/responseFormatter');
const { asyncHandler } = require('../middleware/errorHandler');

// Admin: list all ownership requests
exports.getOwnershipRequests = async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = {};
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const requests = await OwnershipRequest.find(query)
    .populate('currentOwner flat')
    .skip(skip)
    .limit(parseInt(limit));

  const total = await OwnershipRequest.countDocuments(query);

  res.json(formatResponse({
    message: 'Ownership requests retrieved',
    data: requests,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  }));
};


// Admin: review/approve/reject ownership request
exports.reviewOwnershipRequest = asyncHandler(async (req, res) => {
  const { requestId, status, note } = req.body;

  const updatedRequest = await reviewOwnershipRequest({
    requestId,
    status,
    note,
    reviewerId: req.user._id
  });

  res.json(formatResponse({
    message: `Ownership request ${status}`,
    data: updatedRequest
  }));
});
