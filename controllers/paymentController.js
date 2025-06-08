// controllers/paymentController.js
const Payment = require('../models/Payment');

// Tenant makes a payment
exports.makePayment = async (req, res, next) => {
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
      status: 'completed', // you may want to add logic to handle 'pending' or 'failed'
      // date will default to Date.now automatically
    });

    await payment.save();

    res.status(201).json({ message: 'Payment successful', payment });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payment history (all roles)
exports.getPayments = async (req, res , next) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let payments;

    if (role === 'admin') {
      payments = await Payment.find()
        .populate('user', 'name email')
        .populate('society', 'name')
        .sort({ date: -1 });
    } else {
      payments = await Payment.find({ user: userId })
        .populate('society', 'name')
        .sort({ date: -1 });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


