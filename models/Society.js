// models/Society.js

const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Society name is required'],
    trim: true,
  },
  address: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true,
  },
  totalBuildings: {
    type: Number,
    default: 0,
    min: 0,
  },
  maintenancePolicy: {
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly'],
      default: 'monthly',
    },
    amountPerFlat: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Admin user is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Society', societySchema);
