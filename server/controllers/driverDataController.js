const { validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const Driver = require("../models/driverData");
const Counter = require("../models/counter");
const fs = require("fs");

// Secure file storage
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads/documents";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR); // Ensure directory exists
  },
  filename: (req, file, cb) => {
    const safeFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    cb(null, `${Date.now()}_${safeFileName}`);
  },
});

// Multer upload configuration with stricter file validation
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG images, and PDF files are allowed!"));
    }
  },
}).fields([
  { name: "licenseCopy", maxCount: 1 },
  { name: "idCopy", maxCount: 1 },
  { name: "proofOfResidency", maxCount: 1 },
  { name: "insuranceCertificate", maxCount: 1 },
]);

// Create driver controller
const createDriver = async (req, res) => {
  try {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Documents object construction
    const documents = {
      licenseCopy: req.files?.licenseCopy ? req.files.licenseCopy[0].path : null,
      idCopy: req.files?.idCopy ? req.files.idCopy[0].path : null,
      proofOfResidency: req.files?.proofOfResidency ? req.files.proofOfResidency[0].path : null,
      insuranceCertificate: req.files?.insuranceCertificate ? req.files.insuranceCertificate[0].path : null,
    };

    // Ensure mandatory documents are uploaded
    if (!documents.licenseCopy || !documents.idCopy) {
      return res.status(400).json({
        success: false,
        message: "License copy and ID copy are required.",
      });
    }

    // Create a new driver instance
    const newDriver = new Driver({
      name: req.body.name,
      licenseNo: req.body.licenseNo,
      contact: req.body.contact,
      address: req.body.address,
      documents,
      status: req.body.status || "Active",
    });

    // Save driver to database
    const savedDriver = await newDriver.save();

    res.status(201).json({
      success: true,
      data: savedDriver,
    });
  } catch (error) {
    console.error("Error creating driver:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while creating driver.",
    });
  }
};

// Update driver controller
const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Fetch driver
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    // Update driver fields
    driver.name = req.body.name || driver.name;
    driver.licenseNo = req.body.licenseNo || driver.licenseNo;
    driver.contact = req.body.contact || driver.contact;
    driver.address = req.body.address || driver.address;
    driver.status = req.body.status || driver.status;

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

    // Save updated driver
    const updatedDriver = await driver.save();
    res.status(200).json({
      success: true,
      message: "Driver updated successfully!",
      data: updatedDriver,
    });
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating driver.",
    });
  }
};

// Delete driver controller
const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch and delete driver
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    // Delete associated files
    Object.values(driver.documents).forEach((filePath) => {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Driver.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Driver deleted successfully!" });
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting driver.",
    });
  }
};

// Get drivers controller
const getDrivers = async (req, res) => {
  try {
    if (req.params.id) {
      const driver = await Driver.findById(req.params.id);
      if (!driver) {
        return res.status(404).json({ success: false, message: "Driver not found" });
      }
      res.status(200).json({ success: true, data: driver });
    } else {
      const drivers = await Driver.find();
      res.status(200).json({ success: true, data: drivers });
    }
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching drivers.",
    });
  }
};

// Multer error handling middleware
const multerErrorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: error.message });
  } else if (error) {
    return res.status(500).json({ success: false, message: error.message });
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
