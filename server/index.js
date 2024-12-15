const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { sha256 } = require('js-sha256'); // Password hashing library
const crypto = require('crypto'); // Node.js crypto module for salt generation

const driverData = require('./routes/driverDataRoutes');
const jeepData = require('./routes/jeepDataRoutes');
const locationRoutes = require('./routes/gpsDataRoutes');
const travelLogRoutes = require('./routes/travelLogRoutes');
const userRoutes = require('./routes/userRoutes')

const app = express();

// Environment Variables
const PORT = process.env.PORT || 3004;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Jeep-PS';
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:3000','https://jeep-ps.vercel.app']; // Specify allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy does not allow access from this origin.'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/driver-data', driverData);
app.use('/jeep-data', jeepData);
app.use('/gps', locationRoutes);
app.use('/travel', travelLogRoutes);
app.use('/users', userRoutes)

// Arduino-friendly endpoint for testing connection
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Server is reachable', serverURL: SERVER_URL });
});

// Health Check
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});

// MongoDB Connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB. Retrying...', err);
    setTimeout(connectToDatabase, 5000); // Retry after 5 seconds
  }
};

connectToDatabase();


// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on ${SERVER_URL}`);
});
