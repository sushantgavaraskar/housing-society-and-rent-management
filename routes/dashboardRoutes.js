const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getOwnerDashboard,
    getTenantDashboard,
    getAdminDashboard
} = require('../controllers/dashboardController');

router.get('/owner', protect, getOwnerDashboard);
router.get('/tenant', protect, getTenantDashboard);
router.get('/admin', protect, getAdminDashboard);

module.exports = router;
