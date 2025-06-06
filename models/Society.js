const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Society', societySchema);
