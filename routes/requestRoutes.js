const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    createRequest,
    getMyRequests,
    getSocietyRequests,
    updateRequestStatus
} = require('../controllers/requestController');

const router = express.Router();

router.post('/', protect, createRequest); // Tenant creates request
router.get('/my', protect, getMyRequests); // Tenant views their requests
router.get('/society/:societyId', protect, getSocietyRequests); // Admin views all for a society
router.put('/:id/status', protect, updateRequestStatus); // Admin updates request

module.exports = router;
