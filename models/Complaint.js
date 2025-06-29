// models/Complaint.js

const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User who raised the complaint is required'],
  },
  userRole: {
    type: String,
    enum: ['owner', 'tenant'],
    required: true,
  },
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flat',
    required: true,
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true,
  },
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true,
  },
  category: {
    type: String,
    enum: ['plumbing', 'electrical', 'security', 'cleanliness', 'other'],
    default: 'other',
  },
  subject: {
    type: String,
    required: [true, 'Complaint subject is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'rejected'],
    default: 'open',
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  resolvedOn: {
    type: Date,
    default: null,
  },
  adminNote: {
    type: String,
    trim: true,
    default: "",
  },
}, {
  timestamps: true,
});
complaintSchema.index({ raisedBy: 1 });
complaintSchema.index({ flat: 1 });
complaintSchema.index({ society: 1 });


module.exports = mongoose.model('Complaint', complaintSchema);
