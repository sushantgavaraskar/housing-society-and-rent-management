// middleware/errorHandler.js

const formatResponse = require('../utils/responseFormatter');

const errorHandler = (error, req, res, next) => {
  console.error('❌ Error:', error);

  // Handle custom error classes
  if (error.statusCode) {
    return res.status(error.statusCode).json(formatResponse({
      success: false,
      message: error.message,
      statusCode: error.statusCode
    }));
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    return res.status(400).json(formatResponse({
      success: false,
      message: 'Validation failed',
      errors: messages,
      statusCode: 400
    }));
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (error.name === 'CastError') {
    return res.status(400).json(formatResponse({
      success: false,
      message: 'Invalid ID format',
      statusCode: 400
    }));
  }

  // Handle duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(409).json(formatResponse({
      success: false,
      message: `${field} already exists`,
      statusCode: 409
    }));
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json(formatResponse({
      success: false,
      message: 'Invalid token',
      statusCode: 401
    }));
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json(formatResponse({
      success: false,
      message: 'Token expired',
      statusCode: 401
    }));
  }

  // Default error response
  res.status(500).json(formatResponse({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    statusCode: 500
  }));
};

module.exports = errorHandler;