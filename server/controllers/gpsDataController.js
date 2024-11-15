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
    const newLocation = new CommuterLocation({  commuterLocation: {
      latitude: commuterLocation.latitude,
      longitude: commuterLocation.longitude,
      timestamp: new Date(), // Set the current timestamp
    }, });
    await newLocation.save();

    res.status(201).json({ message: "Location saved successfully." });
  } catch (error) {
    console.error("Error saving location:", error);
    res.status(500).json({ message: "Error saving location." });
  }
};
exports.createLocation = async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const { jeepID, jeepLocation, timestamp } = req.body;

    // Validate required fields
    if (!jeepID || !jeepLocation || !jeepLocation.lat || !jeepLocation.lng) {
      return res.status(400).json({ message: "jeepID, latitude, and longitude are required." });
    }

    // Create a new location record
    const locationData = new Location({
      jeepID,
      jeepLocation,
      timestamp: timestamp ? new Date(timestamp) : Date.now() // Ensure timestamp is a Date object
    });

    // Save the location to the database
    await locationData.save();

    return res.status(201).json({ message: "Location updated successfully.", data: locationData });
  } catch (error) {
    console.error("Error updating location:", error);
    return res.status(500).json({ message: "Internal server error." });
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

// Update a location entry
exports.updateLocation = async (req, res) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLocation) {
      return res.status(404).json({ message: 'Location not found.' });
    }
    res.status(200).json({
      message: 'Location data updated successfully!',
      data: updatedLocation,
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({
      message: 'Failed to update location data.',
      error: error.message,
    });
  }
};

// Delete a location entry
exports.deleteLocation = async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id); // Delete location by ID
    if (!deletedLocation) {
      return res.status(404).json({ message: 'Location not found.' });
    }
    res.status(200).json({ message: 'Location deleted successfully!' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({
      message: 'Failed to delete location data.',
      error: error.message,
    });
  }
};

// exports.updateLocation = async (req, res) => {
//   const { jeepLocation, timestamp } = req.body;

//   try {
//     // Fetch commuter's location
//     const commuterLocation = await getCommuterLocation();

//     // Calculate distance and ETA
//     const distance = haversineDistance(
//       jeepLocation.lat,
//       jeepLocation.lng,
//       commuterLocation.lat,
//       commuterLocation.lng
//     );
//     const speed = 10; // Average speed in m/s
//     const eta = (distance / speed) / 60; // ETA in minutes

//     // Save data to MongoDB
//     const newLocation = new Location({
//       jeepLocation,
//       commuterLocation,
//       timestamp: new Date(parseInt(timestamp)),
//       eta
//     });
//     await newLocation.save();

//     res.status(201).json({ message: 'Location and ETA saved successfully', eta });
//   } catch (error) {
//     console.error('Error saving location data:', error);
//     res.status(500).json({ error: 'Failed to save location data' });
//   }
// };
