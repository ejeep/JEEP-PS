const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import the auto-increment plugin

const driverSchema = new mongoose.Schema({
  driverID: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  licenseNo: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
    match: [/^\d{10,11}$/, 'Please enter a valid contact number.'],
  },
  address: {
    type: String,
    required: true,
  },
  documents: {
    licenseCopy: {
      type: String,
      required: true,
    },
    idCopy: {
      type: String,
      required: true,
    },
  },
  documentMetadata: {
    fileSize: {
      type: Number,
    },
    fileFormat: {
      type: String,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active',
  },
  licenseExpiryDate: {   // New field for license expiry date
    type: Date,
    required: true,  // Mark this field as required if you want to ensure that it is provided
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add auto-increment functionality to the driverID field
driverSchema.plugin(AutoIncrement, { inc_field: 'driverID' });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
