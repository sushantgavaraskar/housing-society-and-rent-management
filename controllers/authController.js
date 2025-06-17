// controllers/authController.js

const {
  loginUser,
  registerUser,
  generateTokenCookie,
  changePassword,
  validateToken
} = require('../services/authService');

const formatResponse = require('../utils/formatResponse');
const User = require('../models/User');

// 1. Register a new user
exports.registerUser = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

// 2. Login a user
exports.loginUser = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

// 3. Logout user
exports.logoutUser = async (req, res, next) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0)
    });

    res.status(200).json(formatResponse({
      message: 'Logged out successfully'
    }));
  } catch (err) {
    next(err);
  }
};

// 4. Get current logged-in user
exports.getMe = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

// 5. Change user password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await changePassword({
      userId: req.user._id,
      currentPassword,
      newPassword
    });

    res.status(200).json(formatResponse({
      message: 'Password updated successfully'
    }));
  } catch (err) {
    next(err);
  }
};

// 6. Validate token status
exports.tokenStatus = async (req, res, next) => {
  try {
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

    const decoded = validateToken(token);

    res.status(200).json(formatResponse({
      message: 'Token is valid',
      data: { userId: decoded.id }
    }));
  } catch (err) {
    return res.status(401).json(formatResponse({
      success: false,
      message: 'Invalid token',
      statusCode: 401
    }));
  }
};
