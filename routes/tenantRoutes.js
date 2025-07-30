const express = require('express');
const router = express.Router();

const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { verifyTenantAssigned } = require('../middleware/roleAccessGuard');
const validate = require('../middleware/validate');

const { rentPaymentValidator, maintenancePaymentValidator, profileUpdateValidator, announcementsQueryValidator } = require('../validators/tenantValidator');

// 🔐 Middleware to enforce auth + tenant role + flat assignment
router.use(authMiddleware);
router.use(roleMiddleware('tenant'));
router.use(verifyTenantAssigned);

// 🏠 Flat Info
router.get('/my-flat', tenantController.getMyFlat);

// 💰 Rent & Maintenance
router.get('/rent-history', tenantController.getRentHistory);
router.get('/current-rent', tenantController.getCurrentRent);
router.patch('/rent/:rentId/pay', rentPaymentValidator, validate, tenantController.payRent);
router.get('/maintenance-due', tenantController.getUnpaidMaintenance);
router.patch('/maintenance/:maintenanceId/pay', maintenancePaymentValidator, validate, tenantController.payMaintenance);
router.patch('/profile', profileUpdateValidator, validate, tenantController.updateMyProfile);

// 📣 Announcements
router.get('/announcements', announcementsQueryValidator, validate, tenantController.getRelevantAnnouncements);

// 📊 Dashboard
router.get('/dashboard/overview', tenantController.getTenantDashboard);

module.exports = router;
