const express = require('express');
const router = express.Router();
const {
  createProperty,
  assignTenant,
  getMyProperties,
} = require('../controllers/propertyController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, authorizeRoles('owner'), createProperty);
router.put('/:id/rent', authenticateUser, authorizeRoles('owner'), assignTenant);
router.get('/my', authenticateUser, authorizeRoles('owner'), getMyProperties);

module.exports = router;
