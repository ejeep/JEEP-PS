// models/Location.js
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  jeepID: { type: String, required: true }, // Unique ID for the Jeep
  jeepLocation: {
    lat: { type: Number, required: true },  // Latitude
    lng: { type: Number, required: true }   // Longitude
  },
  timestamp: { type: Date, default: Date.now } // Timestamp for the location data
});

module.exports = mongoose.model('Location', LocationSchema);
