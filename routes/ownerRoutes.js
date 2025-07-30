const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { verifyOwnerAssigned } = require('../middleware/roleAccessGuard');
const ownerController = require('../controllers/ownerController');
const validate = require('../middleware/validate');

const { ownershipRequestValidator, assignTenantValidator, updateTenantValidator, maintenancePaymentValidator, profileUpdateValidator } = require('../validators/ownerValidator');

// 🔐 Authenticate → Confirm Role → Confirm Assignment
router.use(authMiddleware);
router.use(roleMiddleware('owner'));
router.use(verifyOwnerAssigned);

// 📦 Flat Management
router.get('/flats', ownerController.getMyFlats);
router.get('/flats/:id/society', ownerController.getFlatSocietyInfo);

// 📨 Ownership Requests
router.post('/ownership-request', ownershipRequestValidator, validate, ownerController.submitOwnershipRequest);
router.patch('/flats/:id/assign-tenant', assignTenantValidator, validate, ownerController.assignTenantToMyFlat);
router.patch('/flats/:flatId/update-tenant', updateTenantValidator, validate, ownerController.updateTenantForMyFlat);
router.patch('/flats/:flatId/remove-tenant', ownerController.removeTenantFromMyFlat);

// 💰 Rent & Maintenance
router.get('/rent-history', ownerController.getRentHistory);
router.get('/maintenance-due', ownerController.getUnpaidMaintenance);
router.patch('/maintenance/:maintenanceId/pay', maintenancePaymentValidator, validate, ownerController.payMaintenance);

// 📊 Dashboard
router.get('/dashboard/overview', ownerController.getOwnerDashboard);

module.exports = router;
