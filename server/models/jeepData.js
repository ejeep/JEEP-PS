// models/jeepModel.js
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
}, { timestamps: true });


const Jeep = mongoose.model("Jeep", jeepSchema);
module.exports = Jeep;
