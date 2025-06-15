const express = require('express');
const router = express.Router();

const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { verifyTenantAssigned } = require('../middleware/roleAccessGuard');

// 🔐 Middleware to enforce auth + tenant role + flat assignment
router.use(authMiddleware);
router.use(roleMiddleware('tenant'));
router.use(verifyTenantAssigned);

// 🏠 Flat Info
router.get('/my-flat', tenantController.getMyFlat);

// 💰 Rent & Maintenance
router.get('/rent-history', tenantController.getRentHistory);
router.get('/current-rent', tenantController.getCurrentRent);
router.patch('/rent/:rentId/pay', tenantController.payRent);
router.get('/maintenance-due', tenantController.getUnpaidMaintenance);
router.patch('/maintenance/:maintenanceId/pay', tenantController.payMaintenance);
router.patch('/profile', tenantController.updateMyProfile);

// 🛠 Complaints
router.post('/complaints', tenantController.fileComplaint);
router.get('/complaints', tenantController.getMyComplaints);

// 📣 Announcements
router.get('/announcements', tenantController.getAnnouncements);

// 📊 Dashboard
router.get('/dashboard/overview', tenantController.getTenantDashboard);

module.exports = router;
