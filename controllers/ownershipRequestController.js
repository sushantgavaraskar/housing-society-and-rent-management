// controllers/ownershipRequestController.js

const { reviewOwnershipRequest } = require('../services/ownershipService');
const OwnershipRequest = require('../models/OwnershipRequest');
const formatResponse = require('../utils/responseFormatter');


// Admin: list all ownership requests
exports.getOwnershipRequests = async (req, res, next) => {
  try {
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
  }catch (err) {
    next(err);
  }
};


// Admin: review/approve/reject ownership request
exports.reviewOwnershipRequest = async (req, res, next) => {
  try{
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
  }catch(err){
    next(error)
  }
};
