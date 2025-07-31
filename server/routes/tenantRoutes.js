const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { verifyTenantAssigned } = require('../middleware/roleAccessGuard'); // ✅ FIXED: Destructure the function
const paginationMiddleware = require('../middleware/paginationMiddleware');
const validate = require('../middleware/validate');
const { rentPaymentValidator } = require('../validators/tenantValidator');

// ✅ FIXED: Remove global assignment middleware, apply selectively
router.use(authMiddleware);
router.use(roleMiddleware('tenant'));

// Routes that DON'T require flat assignment
router.get('/dashboard/overview', tenantController.getTenantDashboard);
router.patch('/profile', tenantController.updateMyProfile);

// Routes that DO require flat assignment
router.get('/my-flat', verifyTenantAssigned, tenantController.getMyFlat);
router.get('/rent-history', verifyTenantAssigned, tenantController.getRentHistory);
router.patch('/rent/:rentId/pay', verifyTenantAssigned, rentPaymentValidator, validate, tenantController.payRent);
router.get('/maintenance-due', verifyTenantAssigned, tenantController.getUnpaidMaintenance);
router.patch('/maintenance/:maintenanceId/pay', verifyTenantAssigned, validate, tenantController.payMaintenance);
router.get('/announcements', tenantController.getRelevantAnnouncements);
router.get('/rent/due', tenantController.getRentDue);

module.exports = router;
