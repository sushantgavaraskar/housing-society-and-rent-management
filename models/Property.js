const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: String,
  address: String,
  rentAmount: Number,
  society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

module.exports = mongoose.model('Property', propertySchema);
