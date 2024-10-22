const { validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const Driver = require("../models/driverData"); 
const Counter = require('../models/counter'); 

// Multer file storage configuration (remains the same)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/documents"); // Save files in the 'uploads/documents' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Name file with timestamp
  },
});

// Multer upload middleware (remains the same)
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit files to 2MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png) and PDFs are allowed!"));
    }
  },
}).fields([
  { name: "licenseCopy", maxCount: 1 },
  { name: "idCopy", maxCount: 1 },
  { name: "proofOfResidency", maxCount: 1 },
  { name: "insuranceCertificate", maxCount: 1 },
]);

// Controller to create a new driver (remains the same)
const createDriver = async (req, res) => {
  try {
    // Initialize documents object
    const documents = {
      licenseCopy: req.files?.licenseCopy ? req.files.licenseCopy[0].path : null,
      idCopy: req.files?.idCopy ? req.files.idCopy[0].path : null,
      proofOfResidency: req.files?.proofOfResidency ? req.files.proofOfResidency[0].path : null,
      insuranceCertificate: req.files?.insuranceCertificate ? req.files.insuranceCertificate[0].path : null,
    };

    // Validate required fields
    if (!req.body.name || !req.body.licenseNo || !req.body.contact || !req.body.address || !documents.licenseCopy || !documents.idCopy) {
      return res.status(400).json({
        success: false,
        message: 'All fields including licenseCopy and idCopy are required.',
      });
    }

    // Create new driver instance
    const newDriver = new Driver({
      name: req.body.name,
      licenseNo: req.body.licenseNo,
      contact: req.body.contact,
      address: req.body.address,
      documents, // Use the constructed documents object
      status: req.body.status || 'Active',
    });

    // Save the new driver
    const savedDriver = await newDriver.save();
    return res.status(201).json({
      success: true,
      data: savedDriver,
    });
  } catch (error) {
    console.error('Error creating driver:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating driver',
      error: error.message,
    });
  }
};


// Controller to update a driver by ID
const updateDriver = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name, licenseNo, contact, address, status } = req.body;

    // Check if the driver exists
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Update driver information
    driver.name = name || driver.name;
    driver.licenseNo = licenseNo || driver.licenseNo;
    driver.contact = contact || driver.contact;
    driver.address = address || driver.address;
    driver.status = status || driver.status;

    // Update documents if new ones are uploaded
    if (req.files) {
      driver.documents.licenseCopy = req.files.licenseCopy
        ? req.files.licenseCopy[0].path
        : driver.documents.licenseCopy;
      driver.documents.idCopy = req.files.idCopy
        ? req.files.idCopy[0].path
        : driver.documents.idCopy;
      driver.documents.proofOfResidency = req.files.proofOfResidency
        ? req.files.proofOfResidency[0].path
        : driver.documents.proofOfResidency;
      driver.documents.insuranceCertificate = req.files.insuranceCertificate
        ? req.files.insuranceCertificate[0].path
        : driver.documents.insuranceCertificate;
    }

    // Save updated driver to the database
    const updatedDriver = await driver.save();

    res
      .status(200)
      .json({ message: "Driver updated successfully!", driver: updatedDriver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to delete a driver by ID
const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the driver exists
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Delete the driver
    await Driver.findByIdAndDelete(id);
    res.status(200).json({ message: "Driver deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all drivers or a specific driver by ID
const getDrivers = async (req, res) => {
  try {
    if (req.params.id) {
      // Fetch a specific driver by ID
      const driver = await Driver.findById(req.params.id);
      if (!driver) {
        return res.status(404).json({ error: "Driver not found" });
      }
      return res.status(200).json(driver);
    } else {
      // Fetch all drivers
      const drivers = await Driver.find();
      return res.status(200).json(drivers);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Multer error handling middleware (remains the same)
const multerErrorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.message });
  } else if (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDriver,
  updateDriver,
  deleteDriver,
  getDrivers,
  upload,
  multerErrorHandler,
};
