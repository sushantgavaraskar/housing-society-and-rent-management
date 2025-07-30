// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Role constants
const ROLES = ['admin', 'owner', 'tenant'];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\S+@\S+\.\S+$/,
      'Please provide a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please set a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Hide in queries by default
  },
  role: {
    type: String,
    enum: ROLES,
    default: 'tenant',
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 15,
  },
  profilePic: {
    type: String, // URL to profile image (optional)
    default: '',
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if changed

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
