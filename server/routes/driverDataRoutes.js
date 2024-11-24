const express = require('express');
const { body } = require('express-validator');
const { createDriver,getDrivers,updateDriver, deleteDriver,  upload, multerErrorHandler } = require('../controllers/driverDataController'); // Import the required functions

const router = express.Router();

// Driver data validation rules
const validateDriver = [
  body('name').isString().trim().notEmpty().withMessage('Name is required.'),
  body('licenseNo').isString().trim().notEmpty().withMessage('License number is required.'),
  body('contact').isString().isLength({ min: 10, max: 11 }).withMessage('Contact must be 10 or 11 digits long.'),
  body('address').isString().trim().notEmpty().withMessage('Address is required.'),
];

// Create a new driver route
router.post(
  '/add-drivers',
  upload,           // Multer middleware for handling file uploads
  validateDriver,   // Validation rules
  createDriver      // Controller function to create driver
);

router.get('/drivers/:id?', getDrivers);
router.put('/update-driver/:id', upload, updateDriver);
router.delete('/delete-driver/:id', deleteDriver);

// Error handler for Multer file upload errors
router.use(multerErrorHandler);

module.exports = router;
