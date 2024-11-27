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
  const { plateNumber, model, route, routeDirection, timeSchedule } = req.body;

  // Basic validation
  if (!plateNumber || !model || !route || !routeDirection || !timeSchedule) {
    return res
      .status(400)
      .json({ message: "All fields are required, including timeSchedule." });
  }

  try {
    // Check if the plateNumber already exists
    const existingJeep = await Jeep.findOne({ plateNumber });
    if (existingJeep) {
      return res.status(400).json({ message: "Plate number already exists." });
    }

    // Create and save the new jeep
    const newJeep = new Jeep({
      plateNumber,
      model,
      route,
      routeDirection,
      timeSchedule,
    });
    await newJeep.save();
    res.status(201).json(newJeep);
  } catch (error) {
    console.error("Error creating jeep:", error);
    res.status(500).json({ message: "Server error. Unable to create jeep." });
  }
};

// Update an existing jeep
// Update Jeep data, including the assigned driver and time schedule
exports.updateJeep = async (req, res) => {
  const { route, routeDirection, assignedDriver, timeSchedule } = req.body;

  try {
    // Fetch the jeep first to check if it already has a schedule
    const jeep = await Jeep.findOne({ plateNumber: req.params.plateNumber });

    // If no jeep is found, return an error
    if (!jeep) {
      return res.status(404).json({ message: "Jeep not found." });
    }

    // If the jeep has no timeSchedule (it's null or an empty array), ensure timeSchedule is provided
    if (!jeep.timeSchedule || jeep.timeSchedule.length === 0) {
      if (!timeSchedule || timeSchedule.length === 0) {
        return res
          .status(400)
          .json({
            message:
              "Schedule cannot be empty when assigning for the first time.",
          });
      }
    }

    // If the jeep already has a timeSchedule, we allow clearing it (setting to an empty array)
    // Proceed with the update logic, including the cleared schedule if applicable
    const updatedJeep = await Jeep.findOneAndUpdate(
      { plateNumber: req.params.plateNumber },
      { route, routeDirection, assignedDriver, timeSchedule },
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
  try {
    const deletedJeep = await Jeep.findOneAndDelete({
      plateNumber: req.params.plateNumber,
    });

    if (!deletedJeep) {
      return res.status(404).json({ message: "Jeep not found." });
    }

    res.status(200).json({ message: "Jeep deleted successfully." });
  } catch (error) {
    console.error("Error deleting jeep:", error);
    res.status(500).json({ message: "Server error. Unable to delete jeep." });
  }
};
