const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const driverData = require('./routes/driverDataRoutes');
const jeepData = require('./routes/jeepDataRoutes');
const locationRoutes = require('./routes/gpsDataRoutes');

const PORT = process.env.PORT || 3004; // Use PORT from .env or default to 3004
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Jeep-PS'; // Use MongoDB URI from .env or default

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/driver-data', driverData);
app.use('/jeep-data', jeepData);
app.use('/gps', locationRoutes);

// Database connection
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

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
