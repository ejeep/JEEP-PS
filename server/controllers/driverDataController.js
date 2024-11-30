const { validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const Driver = require("../models/driverData");
const fs = require("fs");

// Constants
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads/documents";
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Utility Function: Create Upload Directory if not exists
const ensureUploadDirExists = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDirExists();
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const safeFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    cb(null, `${Date.now()}_${safeFileName}`);
  },
});

// Multer Upload Configuration
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and PDF files are allowed!"));
    }
  },
}).fields([
  { name: "licenseCopy", maxCount: 1 },
  { name: "idCopy", maxCount: 1 },
]);

// Utility Function: Delete Files
const deleteFiles = (filePaths) => {
  filePaths.forEach((filePath) => {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
};

// Create Driver
const createDriver = async (req, res) => {
  try {
    // Validate Input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Construct Documents Object
    const documents = {
      licenseCopy: req.files?.licenseCopy?.[0]?.path || null,
      idCopy: req.files?.idCopy?.[0]?.path || null,
    };

    // Ensure Mandatory Files
    if (!documents.licenseCopy || !documents.idCopy) {
      return res.status(400).json({
        success: false,
        message: "License copy and ID copy are required.",
      });
    }

    // Create Driver
    const newDriver = new Driver({
      name: req.body.name,
      licenseNo: req.body.licenseNo,
      contact: req.body.contact,
      address: req.body.address,
      documents,
      status: req.body.status || "Active",
    });

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

// Update Driver
const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Find Driver
    const driver = await Driver.findById(id);
    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    // Update Fields
    driver.name = req.body.name || driver.name;
    driver.licenseNo = req.body.licenseNo || driver.licenseNo;
    driver.contact = req.body.contact || driver.contact;
    driver.address = req.body.address || driver.address;
    driver.status = req.body.status || driver.status;

    // Update Documents
    const updatedDocs = req.files || {};
    Object.keys(updatedDocs).forEach((key) => {
      if (updatedDocs[key]) {
        const filePath = updatedDocs[key][0].path;
        deleteFiles([driver.documents[key]]);
        driver.documents[key] = filePath;
      }
    });

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

// Delete Driver
const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findById(id);
    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    deleteFiles(Object.values(driver.documents));

    await Driver.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Driver deleted successfully!" });
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting driver.",
    });
  }
};

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



// Multer Error Handling Middleware
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
