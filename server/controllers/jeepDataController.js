const Jeep = require("../models/jeepData");
const Location = require("../models/gpsData");

// Fetch all jeeps
exports.getAllJeeps = async (req, res) => {
  try {
    const jeeps = await Jeep.find();
    res.status(200).json(jeeps);
  } catch (error) {
    console.error("Error fetching jeeps:", error);
    res.status(500).json({ message: "Server error. Unable to fetch jeeps." });
  }
};

// Create a new jeep
exports.createJeep = async (req, res) => {
  const { plateNumber, model, routeDirection } = req.body;

  if (!plateNumber || !model || !routeDirection) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingJeep = await Jeep.findOne({ plateNumber });
    if (existingJeep) {
      return res.status(400).json({ message: "Plate number already exists." });
    }

    const newJeep = new Jeep({ plateNumber, model, routeDirection });
    await newJeep.save(); // Triggers the pre-save hook
    res.status(201).json(newJeep);
  } catch (error) {
    console.error("Error creating jeep:", error);
    res.status(500).json({ message: "Server error. Unable to create jeep." });
  }
};

// Update an existing jeep
// Update Jeep data, including the assigned driver and time schedule
exports.updateJeep = async (req, res) => {
  const { routeDirection, assignedDriver, timeSchedule } = req.body;

  try {
    // Fetch the jeep to check if it exists
    const jeep = await Jeep.findOne({ plateNumber: req.params.plateNumber });

    // If no jeep is found, return an error
    if (!jeep) {
      return res.status(404).json({ message: "Jeep not found." });
    }

    // If the timeSchedule field is included in the request, validate it
    if (
      timeSchedule !== undefined &&
      (!jeep.timeSchedule || jeep.timeSchedule.length === 0) &&
      (!timeSchedule || timeSchedule.length === 0)
    ) {
      return res.status(400).json({
        message: "Schedule cannot be empty when assigning for the first time.",
      });
    }

    // Prepare the update object
    const updateData = {};

    if (routeDirection) updateData.routeDirection = routeDirection;

    // Handle assignedDriver explicitly, allowing it to be cleared
    if (assignedDriver !== undefined) {
      updateData.assignedDriver = assignedDriver === "" ? null : assignedDriver;
    }

    if (timeSchedule !== undefined) updateData.timeSchedule = timeSchedule;

    // Proceed with the update logic
    const updatedJeep = await Jeep.findOneAndUpdate(
      { plateNumber: req.params.plateNumber },
      updateData,
      { new: true, runValidators: true }
    );

    // Return the updated jeep data as a response
    res.status(200).json(updatedJeep);
  } catch (error) {
    console.error("Error updating jeep:", error);
    res.status(500).json({ message: "Server error. Unable to update jeep." });
  }
};

const addLocationToJeep = async (req, res) => {
  const {
    jeepID,
    lat,
    lng,
    speed,
    seatAvailability,
    status,
    direction,
    condition,
  } = req.body;

  try {
    // First, create a new location document
    const newLocation = new Location({
      jeepLocation: { lat, lng },
      speed,
      seatAvailability,
      status,
      direction,
      condition,
    });

    await newLocation.save(); // Save the location

    // Now, update the Jeep with the new location
    const jeep = await Jeep.findById(jeepID);

    if (!jeep) {
      return res.status(404).json({ message: "Jeep not found" });
    }

    // Add the new location to locationHistory and/or set it as the latestLocation
    jeep.locationHistory.push(newLocation._id); // Push to history
    jeep.latestLocation = newLocation._id; // Set latest location

    await jeep.save(); // Save the jeep with the updated location data

    res.status(201).json(newLocation); // Return the new location data
  } catch (error) {
    console.error("Error adding location to jeep:", error);
    res.status(500).json({ message: "Error adding location data to jeep" });
  }
};

// Delete a jeep
exports.deleteJeep = async (req, res) => {
  const { plateNumber } = req.params;

  try {
    // Find and delete the Jeep
    const deletedJeep = await Jeep.findOneAndDelete({ plateNumber });
    if (!deletedJeep) {
      return res.status(404).json({ message: 'Jeep not found' });
    }

    // Find the Location entry with the matching plateNumber and clear it
    await Location.updateOne({ plateNumber }, { $unset: { plateNumber: "" } });

    res.status(200).json({ message: 'Jeep deleted and plate number cleared' });
  } catch (error) {
    console.error('Error deleting Jeep:', error);
    res.status(500).json({ message: 'Error deleting Jeep' });
  }
};
