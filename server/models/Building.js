// models/Building.js

const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Building name is required'],
    trim: true,
  },
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: [true, 'Society reference is required'],
  },
  totalFloors: {
    type: Number,
    required: [true, 'Total number of floors is required'],
    min: [1, 'There must be at least 1 floor'],
  },
  totalFlats: {
    type: Number,
    required: [true, 'Total number of flats is required'],
    min: [1, 'There must be at least 1 flat'],
  },
  addressLabel: {
    type: String,
    trim: true,
    default: '',
    // Optional label if address differs from society (e.g., "Wing B, Gate 2")
  },
}, {
  timestamps: true,
});

// ✅ FIXED: Removed problematic pre-save hook
// Flat creation will be handled in the service layer after building is saved

module.exports = mongoose.model('Building', buildingSchema);
