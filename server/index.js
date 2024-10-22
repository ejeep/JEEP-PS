const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const driverData = require('./routes/driverDataRoutes');
const jeepData = require('./routes/jeepDataRoutes')

const PORT = 3004;

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use('/driver-data', driverData);
app.use('/jeep-data', jeepData)

// Database connection
mongoose.connect('mongodb://localhost:27017/Jeep-PS', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
