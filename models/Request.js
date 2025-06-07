const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society' },
    description: String,
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  });

module.exports = mongoose.model('Request', requestSchema);
