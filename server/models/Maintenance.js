// models/Maintenance.js

const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
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
  billingMonth: {
    type: String,
    required: [true, 'Billing month is required'],
    match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'Format must be YYYY-MM'],
    // Example: "2025-06"
  },
  amount: {
    type: Number,
    required: [true, 'Maintenance amount is required'],
    min: 0,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidOn: {
    type: Date,
    default: null,
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Typically an Admin
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
