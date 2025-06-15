// services/ownershipService.js
const OwnershipRequest = require('../models/OwnershipRequest');
const Flat = require('../models/Flat');

exports.reviewOwnershipRequest = async ({ requestId, status, note, reviewerId }) => {
  const request = await OwnershipRequest.findById(requestId);
  if (!request) throw new Error('Ownership request not found');

  request.status = status;
  request.adminNote = note;
  request.reviewedBy = reviewerId;
  request.reviewedOn = new Date();
  await request.save();

  if (status === 'approved') {
    await Flat.findByIdAndUpdate(request.flat, { owner: request.currentOwner });
  }

  return request;
};
