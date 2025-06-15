// controllers/authController.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Flat = require('../models/Flat');
const generateToken = require('../utils/generateToken');
const { asyncHandler } = require('../middleware/errorHandler');
const formatResponse = require('../utils/responseFormatter');

// REGISTER USER
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role = 'tenant' } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json(formatResponse({
      success: false,
      message: 'Email is already registered',
      statusCode: 400
    }));
  }

  const user = await User.create({ name, email, password, phone, role });

  generateToken(res, user._id);

  res.status(201).json(formatResponse({
    message: 'User registered successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  }));
});

// LOGIN
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json(formatResponse({
      success: false,
      message: 'Invalid email or password',
      statusCode: 401
    }));
  }

  if (user.role === 'owner') {
    const flat = await Flat.findOne({ owner: user._id });
    if (!flat) {
      return res.status(403).json(formatResponse({
        success: false,
        message: 'Owner is not assigned to any flat yet',
        statusCode: 403
      }));
    }
  }

  if (user.role === 'tenant') {
    const flat = await Flat.findOne({ tenant: user._id });
    if (!flat) {
      return res.status(403).json(formatResponse({
        success: false,
        message: 'Tenant is not assigned to any flat yet',
        statusCode: 403
      }));
    }
  }

  generateToken(res, user._id);

  res.status(200).json(formatResponse({
    message: 'Login successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  }));
});

// LOGOUT
exports.logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json(formatResponse({
    message: 'Logged out successfully'
  }));
});

// GET CURRENT USER
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    return res.status(404).json(formatResponse({
      success: false,
      message: 'User not found',
      statusCode: 404
    }));
  }

  res.status(200).json(formatResponse({
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      society: user.society || null
    }
  }));
});

// CHANGE PASSWORD
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user || !(await user.comparePassword(currentPassword))) {
    return res.status(401).json(formatResponse({
      success: false,
      message: 'Current password is incorrect',
      statusCode: 401
    }));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json(formatResponse({
    message: 'Password updated successfully'
  }));
});

// TOKEN STATUS
exports.tokenStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token || (
    req.headers.authorization?.startsWith('Bearer') &&
    req.headers.authorization.split(' ')[1]
  );

  if (!token) {
    return res.status(401).json(formatResponse({
      success: false,
      message: 'Token missing',
      statusCode: 401
    }));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json(formatResponse({
      message: 'Token is valid',
      data: { userId: decoded.id }
    }));
  } catch {
    return res.status(401).json(formatResponse({
      success: false,
      message: 'Invalid token',
      statusCode: 401
    }));
  }
});
