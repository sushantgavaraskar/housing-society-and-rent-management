const OwnershipRequest = require('../models/OwnershipRequest');
const Flat = require('../models/Flat');
const formatResponse = require('../utils/responseFormatter');

// Submit ownership request
exports.submitOwnershipRequest = async (req, res, next) => {
  try {
    const { flatId, newOwnerName, newOwnerEmail, newOwnerPhone, reason } = req.body;

    const flat = await Flat.findById(flatId);
    if (!flat || flat.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json(formatResponse({
        success: false,
        message: 'Unauthorized request',
        statusCode: 403
      }));
    }

    const request = await OwnershipRequest.create({
      flat: flatId,
      currentOwner: req.user._id,
      newOwnerName,
      newOwnerEmail,
      newOwnerPhone,
      reason,
    });

    res.status(201).json(formatResponse({
      message: 'Ownership request submitted',
      data: request
    }));
  } catch (err) {
    next(err);
  }
};

// Get ownership requests submitted by owner
exports.getMyOwnershipRequests = async (req, res, next) => {
  try {
    const requests = await OwnershipRequest.find({ currentOwner: req.user._id })
      .populate('flat');

    res.status(200).json(formatResponse({
      message: 'Your ownership requests retrieved',
      data: requests
    }));
  } catch (err) {
    next(err);
  }
};

// Get all ownership requests (admin use)
exports.getAllOwnershipRequests = async (req, res, next) => {
  try {
    const requests = await OwnershipRequest.find()
      .populate('flat')
      .populate('currentOwner', 'name email');

    res.status(200).json(formatResponse({
      message: 'All ownership requests retrieved',
      data: requests
    }));
  } catch (err) {
    next(err);
  }
};

// Review ownership request (admin)
exports.reviewOwnershipRequest = async (req, res, next) => {
  try {
    const { requestId, status, note } = req.body;

    const request = await OwnershipRequest.findById(requestId);
    if (!request) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'Request not found',
        statusCode: 404
      }));
    }

    request.status = status;
    request.adminNote = note;
    request.reviewedBy = req.user._id;
    request.reviewedOn = new Date();
    await request.save();

    if (status === 'approved') {
      await Flat.findByIdAndUpdate(request.flat, {
        owner: request.currentOwner
      });
    }

    res.status(200).json(formatResponse({
      message: `Ownership request ${status}`,
      data: request
    }));
  } catch (err) {
    next(err);
  }
};
