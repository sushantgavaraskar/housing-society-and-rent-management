const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Flat = require('../models/Flat');
const { generateToken } = require('../utils/generateToken');
const { asyncHandler } = require('../middleware/errorHandler');

// REGISTER USER (admin, owner, tenant)
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role = 'tenant' } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('Email is already registered');
  }

  const user = await User.create({ name, email, password, phone, role });

  const token = generateToken(res, user._id);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    }
  });
});

// LOGIN
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // 🔐 Enforce owner/tenant assignment before access
  if (user.role === 'owner') {
    const flat = await Flat.findOne({ owner: user._id });
    if (!flat) {
      res.status(403);
      throw new Error('Owner is not registered or assigned yet.');
    }
  }

  if (user.role === 'tenant') {
    const flat = await Flat.findOne({ tenant: user._id });
    if (!flat) {
      res.status(403);
      throw new Error('Tenant is not assigned to any flat yet.');
    }
  }

  const token = generateToken(res, user._id);

  res.status(200).json({
    message: 'Login successful',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    }
  });
});

// LOGOUT
exports.logoutUser = asyncHandler(async (req, res) => {
  res
    .cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    })
    .status(200)
    .json({ message: 'Logged out successfully' });
});

// GET CURRENT USER
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    society: user.society || null,
  });
});

// CHANGE PASSWORD
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user || !(await user.comparePassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
});

// TOKEN STATUS
exports.tokenStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token || (req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]);
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ valid: true, userId: decoded.id });
  } catch {
    return res.status(401).json({ valid: false });
  }
});
