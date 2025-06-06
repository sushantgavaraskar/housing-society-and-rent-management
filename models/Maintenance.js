const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    flat: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true }, // Example: 'June 2025'
    status: { type: String, enum: ['unpaid', 'paid', 'late'], default: 'unpaid' },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
