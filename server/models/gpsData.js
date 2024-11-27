const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  jeepID: { type: String, required: true }, // Unique ID for the Jeep
  jeepLocation: {
    lat: { type: Number, required: true }, // Latitude
    lng: { type: Number, required: true }, // Longitude
  },
  speed: { type: Number, required: true }, // Speed of the vehicle in m/s
  seatAvailability: { type: Number, required: true }, // Available seats on the jeep
  status: {
    type: String,
    enum: ['waiting', 'en route'], // Status options: 'waiting' or 'en route'
    required: true,
  },
  direction: {
    type: String,
    enum: ['north bound', 'south bound'], // Direction options: 'north bound' or 'south bound'
    required: true,
  },
  condition: {
    type: String,
    enum: ['maintenance', 'good', 'broken'], // Condition options: 'maintenance', 'good', 'broken'
    required: true,
  },
  timestamp: { type: Date, default: Date.now }, // Timestamp for the location data
});

module.exports = mongoose.model('Location', LocationSchema);
