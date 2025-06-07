// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['rent', 'maintenance'], required: true },
    amount: { type: Number, required: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // propertyId or maintenanceId
    paymentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
