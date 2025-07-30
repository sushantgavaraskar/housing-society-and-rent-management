// services/ownershipService.js
const OwnershipRequest = require('../models/OwnershipRequest');
const Flat = require('../models/Flat');
const User = require('../models/User');

exports.reviewOwnershipRequest = async ({ requestId, status, note, reviewerId }) => {
  const request = await OwnershipRequest.findById(requestId);
  if (!request) throw new Error('Ownership request not found');

  request.status = status;
  request.adminNote = note;
  request.reviewedBy = reviewerId;
  request.reviewedOn = new Date();
  await request.save();

  if (status === 'approved') {
    // Check if a user with the new owner's email already exists
    let newOwner = await User.findOne({ email: request.newOwnerEmail });
    
    if (!newOwner) {
      // Create a new user with the details from the request
      newOwner = await User.create({
        name: request.newOwnerName,
        email: request.newOwnerEmail,
        phone: request.newOwnerPhone,
        role: 'owner',
        password: 'tempPassword123', // This should be changed by the user on first login
        isActive: true
      });
    } else {
      // Update existing user's details if needed
      newOwner.name = request.newOwnerName;
      newOwner.phone = request.newOwnerPhone;
      newOwner.role = 'owner';
      await newOwner.save();
    }

    // Update the flat's owner to the new owner
    await Flat.findByIdAndUpdate(request.flat, { owner: newOwner._id });
  }

  return request;
};
