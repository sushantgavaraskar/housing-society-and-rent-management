const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society' },
    month: String,
    amount: Number,
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
