// controllers/ownershipRequestController.js

const OwnershipRequest = require('../models/OwnershipRequest');
const Flat = require('../models/Flat');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Owner submits a request to transfer ownership
exports.createOwnershipRequest = async (req, res, next) => {
  try {
    const { flat, newOwnerName, newOwnerEmail, newOwnerPhone, reason } = req.body;

    const flatExists = await Flat.findById(flat);
    if (!flatExists || !flatExists.owner.equals(req.user._id)) {
      return res.status(400).json({ message: 'Invalid flat or permission denied.' });
    }

    const request = await OwnershipRequest.create({
      flat,
      currentOwner: req.user._id,
      newOwnerName,
      newOwnerEmail,
      newOwnerPhone,
      reason,
    });

    // Send confirmation email to the owner
    await sendEmail(
      req.user.email,
      'Ownership Transfer Request Submitted',
      `Hi ${req.user.name},\n\nYour ownership transfer request for Flat ${flatExists.flatNumber} has been submitted.\n\nWe will notify you once it's reviewed.\n\n- Housing Society Admin`
    );

    res.status(201).json({ message: 'Ownership transfer request submitted.', data: request });
  } catch (err) {
    next(err);
  }
};

// Admin fetches all ownership requests
exports.getAllOwnershipRequests = async (req, res, next) => {
  try {
    const requests = await OwnershipRequest.find()
      .populate('flat', 'flatNumber')
      .populate('currentOwner', 'name email');

    res.status(200).json({ count: requests.length, requests });
  } catch (err) {
    next(err);
  }
};

// Admin approves or rejects ownership request
exports.updateOwnershipRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const request = await OwnershipRequest.findById(id).populate('flat');
    if (!request) {
      return res.status(404).json({ message: 'Ownership request not found' });
    }

    request.status = status;
    request.adminNote = adminNote || '';
    request.reviewedBy = req.user._id;
    request.reviewedOn = new Date();
    await request.save();

    // If approved, reset flat ownership and tenancy
    if (status === 'approved') {
      const flat = await Flat.findById(request.flat._id);
      flat.owner = null;
      flat.tenant = null;
      flat.isRented = false;
      flat.occupancyStatus = 'vacant';
      await flat.save();
    }

    // Notify the owner via email
    const owner = await User.findById(request.currentOwner);
    await sendEmail(
      owner.email,
      `Ownership Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      `Hi ${owner.name},\n\nYour ownership request for Flat ${request.flat.flatNumber} has been ${status}.\n\nAdmin Note: ${adminNote || 'No additional notes'}\n\n- Housing Society Admin`
    );

    res.status(200).json({ message: `Request ${status} successfully.`, request });
  } catch (err) {
    next(err);
  }
};

// Owner fetches their ownership requests
exports.getMyOwnershipRequests = async (req, res, next) => {
  try {
    const requests = await OwnershipRequest.find({ currentOwner: req.user._id })
      .populate('flat', 'flatNumber');

    res.status(200).json({ count: requests.length, requests });
  } catch (err) {
    next(err);
  }
};
