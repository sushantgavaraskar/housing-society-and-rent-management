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
    required: [true, 'Owner user reference is required'],
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
}, {
  timestamps: true,
});
flatSchema.index({ tenant: 1 });
flatSchema.index({ society: 1 });
flatSchema.index({ building: 1 });

module.exports = mongoose.model('Flat', flatSchema);
