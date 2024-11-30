const mongoose = require('mongoose');

const travelLogSchema = new mongoose.Schema({
  jeepID: { type: String, required: true },
  route: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  status: { type: String, required: true }, // 'on time', 'delayed', etc.
  seatAvailability: { type: Number, required: true },
});

const TravelLog = mongoose.model('TravelLog', travelLogSchema);

module.exports = TravelLog;
