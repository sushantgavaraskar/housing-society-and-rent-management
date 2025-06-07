const express = require('express');
const router = express.Router();
const {
  makePayment,
  getPayments,
} = require('../controllers/paymentController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/rent', authenticateUser, makePayment);
router.post('/maintenance', authenticateUser, makePayment);
router.get('/', authenticateUser, getPayments);

module.exports = router;
