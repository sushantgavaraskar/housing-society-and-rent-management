// models/OwnershipRequest.js

const mongoose = require('mongoose');

const ownershipRequestSchema = new mongoose.Schema({
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flat',
    required: [true, 'Flat reference is required'],
  },
  currentOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Current owner reference is required'],
  },
  newOwnerName: {
    type: String,
    required: [true, 'New owner name is required'],
    trim: true,
  },
  newOwnerEmail: {
    type: String,
    required: [true, 'New owner email is required'],
    trim: true,
    lowercase: true,
  },
  newOwnerPhone: {
    type: String,
    required: [true, 'New owner phone number is required'],
    trim: true,
  },
  reason: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Admin
    default: null,
  },
  reviewedOn: {
    type: Date,
    default: null,
  },
  adminNote: {
    type: String,
    trim: true,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('OwnershipRequest', ownershipRequestSchema);
