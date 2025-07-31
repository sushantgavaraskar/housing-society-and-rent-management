// models/Rent.js

const mongoose = require('mongoose');

const rentSchema = new mongoose.Schema({
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flat',
    required: [true, 'Flat reference is required'],
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
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tenant reference is required'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner reference is required'],
  },
  billingMonth: {
    type: String,
    required: [true, 'Billing month is required'],
    match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'Format must be YYYY-MM'],
    // Example: "2025-06"
  },
  amount: {
    type: Number,
    required: [true, 'Rent amount is required'],
    min: 0,
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid', 'overdue'],
    default: 'unpaid',
  },
  paidOn: {
    type: Date,
    default: null,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online', 'bank-transfer', 'upi'],
    default: 'online',
  },
  transactionId: {
    type: String,
    default: null,
  },
  dueDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
rentSchema.index({ billingMonth: 1, status: 1 });
rentSchema.index({ tenant: 1, status: 1 });
rentSchema.index({ owner: 1, status: 1 });
rentSchema.index({ society: 1, billingMonth: 1 });
rentSchema.index({ dueDate: 1, status: 1 });

module.exports = mongoose.model('Rent', rentSchema);
