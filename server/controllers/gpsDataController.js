const Location = require("../models/gpsData");
const CommuterLocation = require("../models/commuterLocation");
const Jeep = require("../models/jeepData"); // Jeep model

// Function to calculate distance using Haversine Formula
const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371e3; // Earth radius in meters
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);
  const deltaLat = toRad(coords2.latitude - coords1.latitude);
  const deltaLng = toRad(coords2.longitude - coords1.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const calculateETA = (distance, speed) => {
  if (speed <= 0) return Infinity; // Handle edge case of no movement
  return (distance / speed) / 60; // Return ETA in minutes
};

exports.commuterLocation = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    const { commuterLocation, commuterId } = req.body;

    // Ensure commuterLocation exists in the request body
    if (
      !commuterLocation ||
      commuterLocation.latitude === undefined ||
      commuterLocation.longitude === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Longitude and Latitude are required." });
    }

    // Find the commuter by commuterId, if provided, or create a new commuter if not
    let existingCommuter;

    if (commuterId) {
      existingCommuter = await CommuterLocation.findById(commuterId); // Find the commuter by ID
    }

    if (existingCommuter) {
      // Update the existing commuter's location
      existingCommuter.commuterLocation.latitude = commuterLocation.latitude;
      existingCommuter.commuterLocation.longitude = commuterLocation.longitude;
      existingCommuter.commuterLocation.timestamp = new Date(); // Update the timestamp

      await existingCommuter.save(); // Save the updated commuter location
      res
        .status(200)
        .json({ message: "Commuter location updated successfully." });
    } else {
      // If the commuter does not exist, create a new commuter location
      const newLocation = new CommuterLocation({
        commuterLocation: {
          latitude: commuterLocation.latitude,
          longitude: commuterLocation.longitude,
          timestamp: new Date(), // Set the current timestamp
        },
      });

      await newLocation.save(); // Save the new commuter location
      res
        .status(201)
        .json({ message: "New commuter location saved successfully." });
    }
  } catch (error) {
    console.error("Error saving or updating location:", error);
    res.status(500).json({ message: "Error saving or updating location." });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const {
      arduinoID,
      jeepLocation,
      speed,
      seatAvailability,
      status,
      direction,
      condition,
      timestamp,
    } = req.body;

    // Validate input
    if (!arduinoID || !jeepLocation || !jeepLocation.lat || !jeepLocation.lng || speed === undefined) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Retrieve commuter location (for example, the first commuter in your database)
    const commuter = await CommuterLocation.findOne();
    if (!commuter) {
      return res.status(404).json({ message: "No commuter location available." });
    }

    const commuterCoords = commuter.commuterLocation;
    const jeepCoords = { latitude: jeepLocation.lat, longitude: jeepLocation.lng };

    // Calculate distance and ETA
    const distance = haversineDistance(commuterCoords, jeepCoords); // Distance in meters
    const eta = calculateETA(distance, speed); // ETA in minutes

    // Save or update location logic (existing functionality remains)

    // Include ETA in the response
    res.status(201).json({
      message: "Location created successfully.",
      data: {
        arduinoID,
        jeepLocation,
        speed,
        eta: `${eta.toFixed(2)} minutes`,
      },
    });
  } catch (error) {
    console.error("Error processing location:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


// Retrieve all location entries
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    const commuter = await CommuterLocation.findOne();

    if (!commuter) {
      return res
        .status(404)
        .json({ message: "No commuter location available." });
    }

    const commuterCoords = commuter.commuterLocation;

    const updatedLocations = locations.map((location) => {
      const jeepCoords = {
        latitude: location.jeepLocation.lat,
        longitude: location.jeepLocation.lng,
      };
      const distance = haversineDistance(commuterCoords, jeepCoords);
      const eta = calculateETA(distance, location.speed);

      return {
        ...location.toObject(),
        eta: `${eta.toFixed(2)} minutes`,
      };
    });

    res.status(200).json(updatedLocations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Failed to fetch location data." });
  }
};

exports.getCommuterLocation = async (req, res) => {
  try {
    const commuterLocation = await CommuterLocation.find(); // Fetch all locations
    res.status(200).json(commuterLocation);
  } catch (error) {
    console.error("Error fetching commuter location:", error);
    res.status(500).json({
      message: "Failed to fetch location data.",
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
      return res.status(404).json({ message: "Jeep not found" });
    }

    // Find the GPS data entry by arduinoID
    const gpsLocation = await Location.findOne({ arduinoID });

    if (!gpsLocation) {
      return res
        .status(404)
        .json({ message: "GPS data not found for this Arduino setup" });
    }

    // Assign the jeep's plateNumber to the GPS location (Arduino setup)
    gpsLocation.plateNumber = jeep.plateNumber; // or jeep.vehicleID depending on how you choose to associate it

    // Save the updated GPSLocation document
    await gpsLocation.save();

    return res
      .status(200)
      .json({ message: "Jeep successfully assigned to Arduino setup" });
  } catch (error) {
    console.error("Error assigning jeep:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a location entry (no plateNumber)
exports.updateLocation = async (req, res) => {
  const { arduinoID } = req.params;
  const {
    jeepLocation,
    speed,
    seatAvailability,
    status,
    direction,
    condition,
  } = req.body;

  try {
    const location = await Location.findOneAndUpdate(
      { arduinoID }, // Find by arduinoID
      { jeepLocation, speed, seatAvailability, status, direction, condition }, // Update fields
      { new: true } // Return the updated document
    );

    if (!location) {
      return res.status(404).json({ message: "Location not found." });
    }

    res
      .status(200)
      .json({ message: "Location updated successfully.", location });
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
    console.error("Error fetching commuter location:", error);
    res.status(500).json({
      message: "Failed to fetch location data.",
      error: error.message,
    });
  }
};

exports.deleteLocation = async (req, res) => {
  const { arduinoID } = req.params; // The unique Arduino ID of the location to delete

  try {
    const location = await Location.findOneAndDelete({ arduinoID });

    if (!location) {
      return res.status(404).json({ message: "Location not found." });
    }

    res.status(200).json({ message: "Location deleted successfully." });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ message: "Failed to delete location." });
  }
};
