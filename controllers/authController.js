// controllers/authController.js
const {
  loginUser,
  registerUser,
  generateTokenCookie,
  changePassword,
  validateToken
} = require('../services/authService');
const formatResponse = require('../utils/responseFormatter');
const { asyncHandler } = require('../middleware/errorHandler');
const User = require('../models/User');

// REGISTER
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  const user = await registerUser({ name, email, password, phone, role });

  generateTokenCookie(res, user._id);

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
  const user = await loginUser({ email, password });

  generateTokenCookie(res, user._id);

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
    expires: new Date(0)
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
  await changePassword({
    userId: req.user._id,
    currentPassword,
    newPassword
  });

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
    const decoded = validateToken(token);
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
