// models/Location.js
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  jeepLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  commuterLocation: {
    lat: { type: Number },
    lng: { type: Number },
  },
  timestamp: { type: Date, default: Date.now },
  eta: { type: Number }, // ETA in minutes
});

module.exports = mongoose.model('Location', LocationSchema);
