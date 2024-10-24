const mongoose = require("mongoose");

const VehicleReportSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true, // Plate number must be provided
  },
  status: {
    type: String,
    required: true,
    enum: ["Waiting", "Under Maintenance", "En Route"], // Define the different statuses
  },
  seatAvailability: {
    type: String,
    required: true,
    enum: ["Available Seats", "Full", "Few Seats Left"], // Customize based on your seating system
  },
  routeDirection: {
    type: String,
    required: true,
    enum: ["North Bound", "South Bound"], // Customize for your route directions
  },
  isRead: {
    type: Boolean,
    default: false, // Set default as false (not read)
  },
  reportDate: {
    type: Date,
    default: Date.now, // Automatically set the date when the report is created
  },
});

// Creating the model from the schema
const VehicleReport = mongoose.model("VehicleReport", VehicleReportSchema);

module.exports = VehicleReport;
