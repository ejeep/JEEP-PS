// models/Location.js
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({

  commuterLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  // timestamp: { type: Date, default: Date.now },

});

module.exports = mongoose.model('commuterLocation', LocationSchema);
