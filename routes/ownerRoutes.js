const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { verifyOwnerAssigned } = require('../middleware/roleAccessGuard');
const ownerController = require('../controllers/ownerController');

// 🔐 Authenticate → Confirm Role → Confirm Assignment
router.use(authMiddleware);
router.use(roleMiddleware('owner'));
router.use(verifyOwnerAssigned);

// 📦 Flat Management
router.get('/flats', ownerController.getMyFlats);
router.get('/flats/:id/society', ownerController.getFlatSocietyInfo);

// 📨 Ownership Requests
router.post('/ownership-request', ownerController.submitOwnershipRequest);
router.patch('/flats/:id/assign-tenant', ownerController.assignTenantToMyFlat);

// 💰 Rent & Maintenance
router.get('/rent-history', ownerController.getRentHistory);
router.get('/maintenance-due', ownerController.getUnpaidMaintenance);
router.patch('/maintenance/:maintenanceId/pay', ownerController.payMaintenance);
router.patch('/flats/:flatId/remove-tenant', ownerController.removeTenantFromMyFlat);
router.patch('/flats/:flatId/update-tenant', ownerController.updateTenantForMyFlat);

// 🛠 Complaints
router.post('/complaints', ownerController.fileComplaint);
router.get('/complaints', ownerController.getMyComplaints);

// 📊 Dashboard
router.get('/dashboard/overview', ownerController.getOwnerDashboard);

module.exports = router;
