const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const driverData = require('./routes/driverDataRoutes');
const jeepData = require('./routes/jeepDataRoutes');
const locationRoutes = require('./routes/gpsDataRoutes');

const PORT = process.env.PORT || 80;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Jeep-PS';
const SERVER_URL = process.env.SERVER_URL || `https://c1bb-110-54-154-44.ngrok-free.app`; // Server URL configuration
// const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`; // Server URL configuration

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow any origin to access the server (use with caution in production)
}));
app.use(express.json());

// Routes
app.use('/driver-data', driverData);
app.use('/jeep-data', jeepData);
app.use('/gps', locationRoutes);

// Arduino-friendly endpoint for testing connection
app.get('/ping', (req, res) => {
  res.json({ message: 'Server is reachable', serverURL: SERVER_URL });
});

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});
app.get("/", (req, res) => {
  res.send("Hello, world!");
});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${SERVER_URL}`);
});
