const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  commuterId: { type: Number, unique: true }, // Incrementing ID for each commuter
  commuterLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
});

// Counter Schema for Incrementing commuterId
const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', CounterSchema);

// Pre-save middleware to auto-increment commuterId
LocationSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'commuterId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.commuterId = counter.seq;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('CommuterLocation', LocationSchema);
