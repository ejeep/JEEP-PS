const TravelLog = require('../models/travelLogs');

// Controller to create a new travel log
exports.createTravelLog = async (req, res) => {
  const { jeepID, route, departureTime, location, status, seatAvailability } = req.body;

  try {
    const newLog = new TravelLog({
      jeepID,
      route,
      departureTime,
      location,
      status,
      seatAvailability,
    });

    await newLog.save();
    res.status(200).json({ message: 'Travel log created successfully', newLog });
  } catch (error) {
    console.error('Error saving travel log:', error);
    res.status(500).json({ message: 'Failed to create travel log', error });
  }
};

// Controller to get all travel logs
exports.getTravelLogs = async (req, res) => {
  try {
    const logs = await TravelLog.find();
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching travel logs:', error);
    res.status(500).json({ message: 'Failed to retrieve travel logs', error });
  }
};
