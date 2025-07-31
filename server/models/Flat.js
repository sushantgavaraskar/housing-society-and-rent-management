// models/Flat.js

const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
  flatNumber: {
    type: String,
    required: [true, 'Flat number is required'],
    trim: true,
    index: true,
  },
  floor: {
    type: Number,
    required: [true, 'Floor number is required'],
    min: 0,
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: [true, 'Building reference is required'],
  },
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: [true, 'Society reference is required'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  isRented: {
    type: Boolean,
    default: false,
  },
  occupancyStatus: {
    type: String,
    enum: ['vacant', 'occupied-owner', 'occupied-tenant'],
    default: 'vacant',
  },
  rentAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to update occupancyStatus based on owner/tenant
flatSchema.pre('save', function(next) {
  if (this.tenant) {
    this.occupancyStatus = 'occupied-tenant';
    this.isRented = true;
  } else if (this.owner) {
    this.occupancyStatus = 'occupied-owner';
    this.isRented = false;
  } else {
    this.occupancyStatus = 'vacant';
    this.isRented = false;
  }
  next();
});

// Indexes
flatSchema.index({ owner: 1 });
flatSchema.index({ tenant: 1 });
flatSchema.index({ society: 1 });
flatSchema.index({ building: 1 });
flatSchema.index({ building: 1, flatNumber: 1 }); // Compound index for common query pattern

module.exports = mongoose.model('Flat', flatSchema);
