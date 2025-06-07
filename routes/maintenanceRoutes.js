const express = require('express');
const router = express.Router();
const {
  createMaintenance,
  getMyMaintenance,
  updateMaintenanceStatus,
} = require('../controllers/maintenanceController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, authorizeRoles('admin'), createMaintenance);
router.get('/my', authenticateUser, authorizeRoles('tenant'), getMyMaintenance);
router.put('/:id/status', authenticateUser, authorizeRoles('admin'), updateMaintenanceStatus);

module.exports = router;
