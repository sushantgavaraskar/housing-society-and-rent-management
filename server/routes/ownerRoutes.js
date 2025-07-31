const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { verifyOwnerAssigned } = require('../middleware/roleAccessGuard'); // ✅ FIXED: Destructure the function
const paginationMiddleware = require('../middleware/paginationMiddleware');
const validate = require('../middleware/validate');
const { maintenancePaymentValidator, profileUpdateValidator } = require('../validators/ownerValidator');

// ✅ FIXED: Remove global assignment middleware, apply selectively
router.use(authMiddleware);
router.use(roleMiddleware('owner'));

// Routes that DON'T require flat assignment
router.get('/dashboard/overview', ownerController.getOwnerDashboard);
router.get('/flats', ownerController.getMyFlats);

// Routes that DO require flat assignment
router.get('/flats/:id/society', verifyOwnerAssigned, ownerController.getFlatSocietyInfo);
router.get('/maintenance-due', verifyOwnerAssigned, ownerController.getUnpaidMaintenance);
router.patch('/maintenance/:maintenanceId/pay', verifyOwnerAssigned, maintenancePaymentValidator, validate, ownerController.payMaintenance);
router.get('/rent-history', verifyOwnerAssigned, ownerController.getRentHistory);

// === OWNERSHIP REQUESTS ===
router.post('/ownership-requests', ownerController.submitOwnershipRequest);
router.get('/ownership-requests/my', ownerController.getMyOwnershipRequests);

module.exports = router;
