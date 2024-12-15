const mongoose = require("mongoose");

const TravelLogSchema = new mongoose.Schema({
  arduinoID: { type: String, required: true }, // Unique Arduino ID
  plateNumber: { type: String, required: true }, // Plate number of the jeep
  jeepLocation: {
    lat: { type: Number, required: true }, // Latitude
    lng: { type: Number, required: true }  // Longitude
  },
  speed: { type: Number, required: true }, // Speed of the jeep
  seatAvailability: { type: Number, required: true }, // Seat availability
  status: { type: String, required: true }, // Status of the jeep (waiting, en route, etc.)
  direction: { type: String, required: true }, // Direction of travel (e.g., north bound)
  condition: { type: String, required: true }, // Condition of the jeep
  timestamp: { type: Date, required: true }, // Timestamp of the location update
  eta: { type: String }, // Estimated time of arrival (optional)
  startTime: { type: Date }, // Timestamp when status changes to "en route"
  endTime: { type: Date }, // Timestamp when status changes to "waiting"
  travelDuration: { type: Number } // Duration in seconds between "en route" and "waiting"
});

module.exports = mongoose.model("TravelLog", TravelLogSchema);
