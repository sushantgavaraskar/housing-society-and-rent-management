const { body, param, query } = require('express-validator');

// Complaint creation validator (for owners and tenants)
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
    .withMessage('Description must be between 10 and 1000 characters'),
  body('flatId')
    .optional()
    .isMongoId()
    .withMessage('Invalid flat ID')
];

// Complaint status update validator (admin only)
const complaintStatusUpdateValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid complaint ID'),
  body('status')
    .isIn(['open', 'in-progress', 'resolved', 'rejected'])
    .withMessage('Invalid complaint status'),
  body('adminNote')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Admin note must not exceed 500 characters')
];

// Query validators for filtering complaints
const complaintsQueryValidator = [
  query('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved', 'rejected'])
    .withMessage('Invalid status filter'),
  query('society')
    .optional()
    .isMongoId()
    .withMessage('Invalid society ID'),
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
  complaintCreateValidator,
  complaintStatusUpdateValidator,
  complaintsQueryValidator
}; 