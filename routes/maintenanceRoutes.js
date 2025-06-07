const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    createMaintenance,
    getMaintenanceByTenant,
    updatePaymentStatus
} = require('../controllers/maintenanceController');

const router = express.Router();

router.post('/', protect, createMaintenance); // Admin use
router.get('/my', protect, getMaintenanceByTenant); // Tenant use
router.put('/:id/status', protect, updatePaymentStatus); // Update paid/late

module.exports = router;
