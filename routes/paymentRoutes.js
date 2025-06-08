const express = require('express');
const router = express.Router();
const { makePayment, getPayments } = require('../controllers/paymentController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/pay', authenticateUser, authorizeRoles('tenant'), makePayment);
router.get('/my', authenticateUser, getPayments);

module.exports = router;
