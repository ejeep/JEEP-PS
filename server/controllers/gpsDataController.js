const Location = require('../models/gpsData');
const CommuterLocation = require('../models/commuterLocation');
const Jeep = require('../models/jeepData'); // Jeep model

exports.commuterLocation = async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const { commuterLocation } = req.body;
    if (commuterLocation.longitude === undefined || commuterLocation.latitude === undefined) {
      return res.status(400).json({ message: "Longitude and Latitude are required." });
    }
    const newLocation = new CommuterLocation({  
      commuterLocation: {
        latitude: commuterLocation.latitude,
        longitude: commuterLocation.longitude,
        timestamp: new Date(), // Set the current timestamp
      }, 
    });
    await newLocation.save();

    res.status(201).json({ message: "Location saved successfully." });
  } catch (error) {
    console.error("Error saving location:", error);
    res.status(500).json({ message: "Error saving location." });
  }
};

// Create Location (for Jeep)
exports.createLocation = async (req, res) => {
  try {
    console.log(req.body); // Log the incoming request body for debugging

    const { arduinoID, jeepLocation, speed, seatAvailability, status, direction, condition, timestamp } = req.body;

    // Validate input, excluding plateNumber
    if (!arduinoID || !jeepLocation || !jeepLocation.lat || !jeepLocation.lng || speed === undefined || seatAvailability === undefined || !status || !direction || !condition) {
      return res.status(400).json({ message: "arduinoID, latitude, longitude, speed, seatAvailability, status, direction, and condition are required." });
    }

    // Validate speed
    if (speed < 0) {
      return res.status(400).json({ message: "Speed cannot be negative." });
    }

    const locationData = new Location({
      arduinoID,
      jeepLocation,
      speed,
      seatAvailability,
      status,
      direction,
      condition,
      timestamp: timestamp ? new Date(timestamp) : Date.now()
    });

    await locationData.save();
    res.status(201).json({ message: "Location saved successfully.", data: locationData });
  } catch (error) {
    console.error("Error saving location:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


// Retrieve all location entries
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find(); // Fetch all locations
    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      message: 'Failed to fetch location data.',
      error: error.message,
    });
  }
};

exports.getCommuterLocation = async (req, res) => {
  try {
    const commuterLocation = await CommuterLocation.find(); // Fetch all locations
    res.status(200).json(commuterLocation);
  } catch (error) {
    console.error('Error fetching commuter location:', error);
    res.status(500).json({
      message: 'Failed to fetch location data.',
      error: error.message,
    });
  }
};

exports.assignJeepToArduino = async (req, res) => {
  const { arduinoID } = req.params; // The unique Arduino ID (e.g., SIM card number)
  const { plateNumber } = req.body; // Jeep's plate number (or vehicleID)

  try {
    // Find the Jeep using the plateNumber or vehicleID
    const jeep = await Jeep.findOne({
      $or: [{ plateNumber }, { vehicleID: plateNumber }],
    });

    if (!jeep) {
      return res.status(404).json({ message: 'Jeep not found' });
    }

    // Find the GPS data entry by arduinoID
    const gpsLocation = await Location.findOne({ arduinoID });

    if (!gpsLocation) {
      return res.status(404).json({ message: 'GPS data not found for this Arduino setup' });
    }

    // Assign the jeep's plateNumber to the GPS location (Arduino setup)
    gpsLocation.plateNumber = jeep.plateNumber; // or jeep.vehicleID depending on how you choose to associate it

    // Save the updated GPSLocation document
    await gpsLocation.save();

    return res.status(200).json({ message: 'Jeep successfully assigned to Arduino setup' });
  } catch (error) {
    console.error('Error assigning jeep:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Update a location entry (no plateNumber)
exports.updateLocation = async (req, res) => {
  const { arduinoID } = req.params;
  const { jeepLocation, speed, seatAvailability, status, direction, condition } = req.body;

  try {
    const location = await Location.findOneAndUpdate(
      { arduinoID }, // Find by arduinoID
      { jeepLocation, speed, seatAvailability, status, direction, condition }, // Update fields
      { new: true } // Return the updated document
    );

    if (!location) {
      return res.status(404).json({ message: "Location not found." });
    }

    res.status(200).json({ message: "Location updated successfully.", location });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: "Failed to update location." });
  }
};


exports.getCommuterLocation = async (req, res) => {
  try {
    const commuterLocation = await CommuterLocation.find(); // Fetch all locations
    res.status(200).json(commuterLocation);
  } catch (error) {
    console.error('Error fetching commuter location:', error);
    res.status(500).json({
      message: 'Failed to fetch location data.',
      error: error.message,
    });
  }
};
