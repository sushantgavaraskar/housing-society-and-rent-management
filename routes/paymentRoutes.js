// routes/paymentRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    payRent,
    payMaintenance,
    getTransactions
} = require('../controllers/paymentController');

const router = express.Router();

router.post('/rent', protect, payRent);
router.post('/maintenance', protect, payMaintenance);
router.get('/', protect, getTransactions);

module.exports = router;
