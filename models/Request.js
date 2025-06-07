const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    title: { type: String, required: true },                // e.g., "Leaking tap"
    description: { type: String },                          // Optional details
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved'],
        default: 'pending'
    },
    flat: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin/staff
    feedback: { type: String },
    resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
