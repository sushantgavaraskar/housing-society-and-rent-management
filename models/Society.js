const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
    name: String,
    location: String,
  });
  

module.exports = mongoose.model('Society', societySchema);
