const mongoose = require('mongoose');
const { Schema } = mongoose;

const jeepSchema = new Schema({
  vehicleID: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    default: () => new mongoose.Types.ObjectId(), // Auto-generate if not provided
  },
  plateNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  routeDirection: {
    type: String,
    enum: ["North Bound", "South Bound"],
    required: true,
  },

  assignedDriver: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Waiting", "En Route"],
    default: "Waiting",
    required: true,
  },
  timeSchedule: {
    type: [String], // Array of strings in HH:mm format
    required: true,
    validate: {
      validator: (times) => times === null || times.every((time) => /^\d{1,2}:\d{2}\s?[APap][Mm]$/.test(time)), // Enforces AM/PM format
      message: "Time must be in HH:mm AM/PM format (e.g., '5:00 AM').",
    },
  },
  locationHistory: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Location' } // Reference to Location
  ],
  latestLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }, // Latest location reference
}, { timestamps: true });

const Jeep = mongoose.model("Jeep", jeepSchema);
module.exports = Jeep;
