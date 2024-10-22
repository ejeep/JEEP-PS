// models/jeepModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const jeepSchema = new Schema({
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
    enum: ["North Bound", "South Bound"], // Limiting the route direction to specific categories
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
    default: "Waiting", // Default status is "Waiting"
    required: true,
  },
}, { timestamps: true });

const Jeep = mongoose.model("Jeep", jeepSchema);
module.exports = Jeep;
