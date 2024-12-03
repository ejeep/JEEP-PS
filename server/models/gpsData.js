const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  arduinoID: { type: String, required: true }, // Unique ID for the Jeep
  plateNumber: { type: String, ref: "Jeep", required: false },
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
    enum: [, 'good', 'breakdown'], // Condition options: 'maintenance', 'good', 'broken'
    required: true,
  },
  timestamp: { type: Date, default: Date.now }, // Timestamp for the location data
});

module.exports = mongoose.model('Location', LocationSchema);
