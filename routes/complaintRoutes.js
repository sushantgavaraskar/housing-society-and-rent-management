
  // routes/complaintRoutes.js

const express = require('express');
const router = express.Router();

const { createComplaint, getMyComplaints, getAllComplaints, updateComplaintStatus } = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const { complaintCreateValidator, complaintStatusUpdateValidator, complaintsQueryValidator } = require('../validators/complaintValidator');

router.use(authMiddleware);

// POST /api/complaints/ - Create a new complaint (Owner or Tenant)
router.post('/', roleMiddleware(['owner', 'tenant']), complaintCreateValidator, validate, createComplaint);

// GET /api/complaints/my - Get complaints filed by the logged-in user
router.get('/my', getMyComplaints);

// GET /api/complaints/ - Get all complaints (Admin only)
router.get('/', roleMiddleware('admin'), complaintsQueryValidator, validate, getAllComplaints);

// PATCH /api/complaints/:id/status - Update complaint status (Admin only)
router.patch('/:id/status', roleMiddleware('admin'), complaintStatusUpdateValidator, validate, updateComplaintStatus);

module.exports = router;