// routes/ownershipRequestRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/ownershipRequestController');
const { protect } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

// Admin routes
router.get('/', protect, roleMiddleware(['admin']), controller.getOwnershipRequests);
router.patch('/:requestId', protect, roleMiddleware(['admin']), controller.reviewOwnershipRequest);

module.exports = router;
