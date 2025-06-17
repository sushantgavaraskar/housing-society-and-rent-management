
  // routes/complaintRoutes.js

const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.patch('/complaint' , roleMiddleware(['tenant', 'owner']), complaintController.createComplaint);

// Admin-only routes
router.get('/all', roleMiddleware('admin'), complaintController.getAllComplaints);
router.delete('/:id', roleMiddleware('owner'), complaintController.getMyComplaints);

router.patch('/:id/status', roleMiddleware('admin'), complaintController.updateComplaintStatus);

module.exports = router;