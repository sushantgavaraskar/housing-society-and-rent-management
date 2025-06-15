const { body } = require('express-validator');

exports.assignOwnerValidator = [
  body('ownerId').notEmpty().withMessage('Owner ID is required'),
];

exports.assignTenantValidator = [
  body('tenantId').notEmpty().withMessage('Tenant ID is required'),
];