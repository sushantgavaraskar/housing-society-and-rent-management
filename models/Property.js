const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
    address: { type: String, required: true },
    rentAmount: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isRented: { type: Boolean, default: false },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
