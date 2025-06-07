// controllers/paymentController.js
const Payment = require('../models/paymentModel');

// Tenant makes a payment
const makePayment = async (req, res) => {
  try {
    const { amount, paymentType, societyId } = req.body;
    const userId = req.user._id;

    if (!amount || !paymentType || !societyId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const payment = new Payment({
      user: userId,
      society: societyId,
      amount,
      paymentType,
      status: 'completed',
    });

    await payment.save();

    res.status(201).json({ message: 'Payment successful', payment });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payment history (all roles)
const getPayments = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let payments;
    if (role === 'admin') {
      payments = await Payment.find().populate('user', 'name email').populate('society', 'name');
    } else {
      payments = await Payment.find({ user: userId }).populate('society', 'name');
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { makePayment, getPayments };
