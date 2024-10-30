const Location = require('../models/gpsData');

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
async function getCommuterLocation() {
  // Replace with actual logic to get commuter's location from your system/database
  return { lat: 12.345678, lng: 98.765432 };
}

exports.updateLocation = async (req, res) => {
  const { jeepLocation, timestamp } = req.body;

  try {
    // Fetch commuter's location
    const commuterLocation = await getCommuterLocation();

    // Calculate distance and ETA
    const distance = haversineDistance(
      jeepLocation.lat,
      jeepLocation.lng,
      commuterLocation.lat,
      commuterLocation.lng
    );
    const speed = 10; // Average speed in m/s
    const eta = (distance / speed) / 60; // ETA in minutes

    // Save data to MongoDB
    const newLocation = new Location({
      jeepLocation,
      commuterLocation,
      timestamp: new Date(parseInt(timestamp)),
      eta
    });
    await newLocation.save();

    res.status(201).json({ message: 'Location and ETA saved successfully', eta });
  } catch (error) {
    console.error('Error saving location data:', error);
    res.status(500).json({ error: 'Failed to save location data' });
  }
};
