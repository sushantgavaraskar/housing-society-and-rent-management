const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  type: { type: String, enum: ['rent', 'maintenance'] },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
