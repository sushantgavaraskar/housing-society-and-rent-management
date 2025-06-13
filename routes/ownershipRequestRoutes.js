// routes/ownershipRequestRoutes.js

const express = require('express');
const router = express.Router();
const ownershipRequestController = require('../controllers/ownershipRequestController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Owner creates and views their requests
router.post('/', authMiddleware, roleMiddleware(['owner']), ownershipRequestController.createOwnershipRequest);
router.get('/my-requests', authMiddleware, roleMiddleware(['owner']), ownershipRequestController.getMyOwnershipRequests);

// Admin views and updates requests
router.get('/admin', authMiddleware, roleMiddleware(['admin']), ownershipRequestController.getAllOwnershipRequests);
router.put('/admin/:id', authMiddleware, roleMiddleware(['admin']), ownershipRequestController.updateOwnershipRequestStatus);

module.exports = router;
