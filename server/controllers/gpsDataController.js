const Location = require('../models/gpsData');
const CommuterLocation = require('../models/commuterLocation');

// Utility function for Haversine distance calculation
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = lat1 * (Math.PI / 180);
  const phi2 = lat2 * (Math.PI / 180);
  const deltaPhi = (lat2 - lat1) * (Math.PI / 180);
  const deltaLambda = (lon2 - lon1) * (Math.PI / 180);

  const a = Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

// Placeholder function to get commuter location from your system
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

    const { jeepID, jeepLocation, speed, seatAvailability, status, direction, condition, timestamp } = req.body;

    // Validate input
    if (!jeepID || !jeepLocation || !jeepLocation.lat || !jeepLocation.lng || speed === undefined || seatAvailability === undefined || !status || !direction || !condition) {
      return res.status(400).json({ message: "jeepID, latitude, longitude, speed, seatAvailability, status, direction, and condition are required." });
    }

    // Validate speed
    if (speed < 0) {
      return res.status(400).json({ message: "Speed cannot be negative." });
    }

    const locationData = new Location({
      jeepID,
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

// Retrieve a location by ID
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id); // Fetch location by ID
    if (!location) {
      return res.status(404).json({ message: 'Location not found.' });
    }
    res.status(200).json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({
      message: 'Failed to fetch location data.',
      error: error.message,
    });
  }
};

// Update a location entry (no plateNumber)
exports.updateLocation = async (req, res) => {
  const { jeepID } = req.params;
  const { jeepLocation, speed, seatAvailability, status, direction, condition } = req.body;

  try {
    const location = await Location.findOneAndUpdate(
      { jeepID }, // Find by jeepID
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
