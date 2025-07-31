
const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const paginationMiddleware = require('../middleware/paginationMiddleware');
const validate = require('../middleware/validate');
const { 
  complaintCreateValidator, 
  complaintStatusUpdateValidator, 
  complaintsQueryValidator 
} = require('../validators/complaintValidator');

// ✅ FIXED: Consolidate all complaint routes with proper role-based access
router.use(authMiddleware);

// POST /api/complaints/ - Create a new complaint (Owner or Tenant)
router.post('/', roleMiddleware(['owner', 'tenant']), complaintCreateValidator, validate, complaintController.createComplaint);

// GET /api/complaints/my - Get complaints filed by the logged-in user (Owner or Tenant)
router.get('/my', roleMiddleware(['owner', 'tenant']), paginationMiddleware, complaintController.getMyComplaints);

// GET /api/complaints/ - Get ALL complaints (Admin only)
router.get('/', roleMiddleware('admin'), complaintsQueryValidator, validate, paginationMiddleware, complaintController.getAllComplaints);

// PATCH /api/complaints/:id - Update complaint status (Admin only)
router.patch('/:id', roleMiddleware('admin'), complaintStatusUpdateValidator, validate, complaintController.updateComplaintStatus);

module.exports = router;