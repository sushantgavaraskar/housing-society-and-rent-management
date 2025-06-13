// routes/complaintRoutes.js

const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Admin-only routes
router.get('/all', roleMiddleware('admin'), complaintController.getAllComplaints);
router.delete('/:id', roleMiddleware('admin'), complaintController.deleteComplaint);

// Admin or Owner can fetch complaints by building and resolve
router.get('/building/:buildingId', roleMiddleware(['admin', 'owner']), complaintController.getComplaintsByBuilding);
router.put('/:id/resolve', roleMiddleware(['admin', 'owner']), complaintController.resolveComplaint);

module.exports = router;
