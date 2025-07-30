const { body, param } = require('express-validator');

// Announcement creation validator (Admin only)
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

// Announcement update validator (Admin only)
const announcementUpdateValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid announcement ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Announcement title must be between 5 and 200 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Announcement content must be between 10 and 2000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority level')
];

module.exports = {
  announcementCreateValidator,
  announcementUpdateValidator
}; 