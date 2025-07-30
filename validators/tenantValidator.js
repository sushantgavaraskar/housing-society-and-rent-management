const { body, param, query } = require('express-validator');

// Complaint validators
const complaintCreateValidator = [
  body('category')
    .isIn(['plumbing', 'electrical', 'security', 'cleanliness', 'other'])
    .withMessage('Invalid complaint category'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters')
];

// Rent payment validator
const rentPaymentValidator = [
  param('rentId')
    .isMongoId()
    .withMessage('Invalid rent ID'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Payment amount must be a positive number'),
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'bank_transfer', 'online'])
    .withMessage('Invalid payment method')
];

// Maintenance payment validator
const maintenancePaymentValidator = [
  param('maintenanceId')
    .isMongoId()
    .withMessage('Invalid maintenance ID'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Payment amount must be a positive number'),
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'bank_transfer', 'online'])
    .withMessage('Invalid payment method')
];

// Profile update validator
const profileUpdateValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Invalid phone number format'),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters')
];

// Query validators
const complaintsQueryValidator = [
  query('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved', 'rejected'])
    .withMessage('Invalid status filter'),
  query('category')
    .optional()
    .isIn(['plumbing', 'electrical', 'security', 'cleanliness', 'other'])
    .withMessage('Invalid category filter'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

const announcementsQueryValidator = [
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority filter'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

module.exports = {
  complaintCreateValidator,
  rentPaymentValidator,
  maintenancePaymentValidator,
  profileUpdateValidator,
  complaintsQueryValidator,
  announcementsQueryValidator
}; 