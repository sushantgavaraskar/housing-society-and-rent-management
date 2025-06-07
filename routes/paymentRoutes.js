const express = require('express');
const router = express.Router();
const {
  makePayment,
  getPayments,
} = require('../controllers/paymentController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/pay', authenticateUser, authorise('tenant'), makePayment);
//router.post('/maintenance', authenticateUser, makePayment);
router.get('/', authenticateUser, getPayments);

module.exports = router;
