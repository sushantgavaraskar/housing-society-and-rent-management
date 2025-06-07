const express = require('express');
const router = express.Router();
const {
  ownerDashboard,
  tenantDashboard,
  adminDashboard,
} = require('../controllers/dashboardController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/owner', authenticateUser, authorizeRoles('owner'), ownerDashboard);
router.get('/tenant', authenticateUser, authorizeRoles('tenant'), tenantDashboard);
router.get('/admin', authenticateUser, authorizeRoles('admin'), adminDashboard);

module.exports = router;
