// services/authService.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Flat = require('../models/Flat');

// Generate a signed JWT and return cookie options
exports.generateTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

// Validate user login
exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }

  // ✅ FIXED: Remove restrictive flat assignment validation
  // Allow users to log in regardless of flat assignment status
  // Flat assignment validation should be done at the business logic level, not during login

  return user;
};

// Register new user
exports.registerUser = async ({ name, email, password, phone, role = 'tenant' }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email is already registered');

  const user = await User.create({ name, email, password, phone, role });
  return user;
};

// Change password
exports.changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user || !(await user.comparePassword(currentPassword))) {
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
};

// Token check
exports.validateToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
