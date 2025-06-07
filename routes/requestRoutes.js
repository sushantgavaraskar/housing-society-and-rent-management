const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getRequestsBySociety,
  updateRequestStatus,
  getAllComplaintsGroupedBySociety
} = require('../controllers/requestController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, authorizeRoles('tenant'), createRequest);
router.get('/my', authenticateUser, authorizeRoles('tenant'), getMyRequests);
router.get('/society/:id', authenticateUser, authorizeRoles('admin'), getRequestsBySociety);
router.put('/:id/status', authenticateUser, authorizeRoles('admin'), updateRequestStatus);

module.exports = router;
