const { body, param, query } = require('express-validator');

// Society validators
const societyCreateValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Society name must be between 2 and 100 characters'),
  body('registrationNumber')
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Registration number must be between 5 and 50 characters'),
  body('address')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),
  body('maintenancePolicy')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Maintenance policy must not exceed 1000 characters')
];

const societyUpdateValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid society ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Society name must be between 2 and 100 characters'),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),
  body('maintenancePolicy')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Maintenance policy must not exceed 1000 characters')
];

// Building validators
const buildingCreateValidator = [
  body('societyId')
    .isMongoId()
    .withMessage('Invalid society ID'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Building name must be between 2 and 100 characters'),
  body('totalFloors')
    .isInt({ min: 1, max: 100 })
    .withMessage('Total floors must be between 1 and 100'),
  body('totalFlats')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Total flats must be between 1 and 1000'),
  body('addressLabel')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address label must not exceed 200 characters')
];

const buildingUpdateValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid building ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Building name must be between 2 and 100 characters'),
  body('totalFloors')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Total floors must be between 1 and 100'),
  body('totalFlats')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Total flats must be between 1 and 1000'),
  body('addressLabel')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address label must not exceed 200 characters')
];

// Flat validators
const flatCreateValidator = [
  body('buildingId')
    .isMongoId()
    .withMessage('Invalid building ID'),
  body('totalFlats')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Total flats must be between 1 and 1000')
];

const flatAssignOwnerValidator = [
  param('flatId')
    .isMongoId()
    .withMessage('Invalid flat ID'),
  body('ownerId')
    .isMongoId()
    .withMessage('Invalid owner ID')
];

// Complaint validators
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

// Announcement validators
const announcementCreateValidator = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Announcement title must be between 5 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Announcement content must be between 10 and 2000 characters'),
  body('societyId')
    .isMongoId()
    .withMessage('Invalid society ID'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority level')
];

// Ownership request validators
const ownershipRequestReviewValidator = [
  body('requestId')
    .isMongoId()
    .withMessage('Invalid ownership request ID'),
  body('status')
    .isIn(['approved', 'rejected'])
    .withMessage('Invalid status'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Admin note must not exceed 500 characters')
];

// Reminder validators
const reminderValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

// Society note validator
const societyNoteValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid society ID'),
  body('note')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Note must be between 1 and 1000 characters')
];

// Query validators
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

// User update validator
const userUpdateValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Invalid phone number format'),
  body('role')
    .optional()
    .isIn(['admin', 'owner', 'tenant'])
    .withMessage('Invalid role'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

module.exports = {
  societyCreateValidator,
  societyUpdateValidator,
  buildingCreateValidator,
  buildingUpdateValidator,
  flatCreateValidator,
  flatAssignOwnerValidator,
  complaintStatusUpdateValidator,
  announcementCreateValidator,
  ownershipRequestReviewValidator,
  reminderValidator,
  societyNoteValidator,
  complaintsQueryValidator,
  userUpdateValidator
}; 