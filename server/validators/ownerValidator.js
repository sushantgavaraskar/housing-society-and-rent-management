const { body, param, query } = require('express-validator');

// Ownership request validators
const ownershipRequestValidator = [
  body('flatId')
    .isMongoId()
    .withMessage('Invalid flat ID'),
  body('newOwnerName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('New owner name must be between 2 and 100 characters'),
  body('newOwnerEmail')
    .isEmail()
    .withMessage('Invalid new owner email'),
  body('newOwnerPhone')
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Invalid new owner phone number format'),
  body('reason')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Reason must be between 10 and 1000 characters'),
  body('documents')
    .optional()
    .isArray()
    .withMessage('Documents must be an array'),
  body('documents.*')
    .optional()
    .isString()
    .withMessage('Each document must be a string')
];

// Tenant assignment validators
const assignTenantValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid flat ID'),
  body('tenantId')
    .isMongoId()
    .withMessage('Invalid tenant ID'),
  body('rentAmount')
    .isFloat({ min: 0 })
    .withMessage('Rent amount must be a positive number'),
  body('rentDueDate')
    .isInt({ min: 1, max: 31 })
    .withMessage('Rent due date must be between 1 and 31'),
  body('agreementStartDate')
    .isISO8601()
    .withMessage('Invalid agreement start date'),
  body('agreementEndDate')
    .isISO8601()
    .withMessage('Invalid agreement end date')
];

const updateTenantValidator = [
  param('flatId')
    .isMongoId()
    .withMessage('Invalid flat ID'),
  body('tenantId')
    .optional()
    .isMongoId()
    .withMessage('Invalid tenant ID'),
  body('rentAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Rent amount must be a positive number'),
  body('rentDueDate')
    .optional()
    .isInt({ min: 1, max: 31 })
    .withMessage('Rent due date must be between 1 and 31'),
  body('agreementEndDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid agreement end date')
];

// Complaint validators
const complaintCreateValidator = [
  body('flatId')
    .isMongoId()
    .withMessage('Invalid flat ID'),
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

module.exports = {
  ownershipRequestValidator,
  assignTenantValidator,
  updateTenantValidator,
  complaintCreateValidator,
  maintenancePaymentValidator,
  profileUpdateValidator,
  complaintsQueryValidator
}; 