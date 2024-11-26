const mongoose = require("mongoose");
const { Schema } = mongoose;

const jeepSchema = new Schema({
  jeepID: {
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
  route: {
    type: String,
    required: true,
    trim: true,
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
      validator: (times) => times.every((time) => /^\d{1,2}:\d{2}(?:\s?[APap][Mm])?$/.test(time)),
      message: "Time must be in HH:mm format (e.g., '5:00 AM').",
    },
  },
}, { timestamps: true });

const Jeep = mongoose.model("Jeep", jeepSchema);
module.exports = Jeep;
