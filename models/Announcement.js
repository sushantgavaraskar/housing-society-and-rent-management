// models/Announcement.js

const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Announcement message is required'],
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Admin
    required: [true, 'Admin reference is required'],
  },
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: [true, 'Target society is required'],
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    default: null, // If null, applies to whole society
  },
  audience: {
    type: String,
    enum: ['all', 'owners', 'tenants'],
    default: 'all',
  },
  validTill: {
    type: Date,
    default: null, // Optional expiry
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Announcement', announcementSchema);
