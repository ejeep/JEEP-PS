const Jeep = require("../models/jeepData");

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
  const { plateNumber, model, route, routeDirection } = req.body;

  // Basic validation
  if (!plateNumber || !model || !route || !routeDirection) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if the plateNumber already exists
    const existingJeep = await Jeep.findOne({ plateNumber });
    if (existingJeep) {
      return res.status(400).json({ message: "Plate number already exists." });
    }

    // Create and save the new jeep
    const newJeep = new Jeep({ plateNumber, model, route, routeDirection });
    await newJeep.save();
    res.status(201).json(newJeep);
  } catch (error) {
    console.error("Error creating jeep:", error);
    res.status(500).json({ message: "Server error. Unable to create jeep." });
  }
};

// Update an existing jeep
// Update Jeep data, including the assigned driver
exports.updateJeep = async (req, res) => {
  const { route, routeDirection, assignedDriver } = req.body;

  try {
    const updatedJeep = await Jeep.findOneAndUpdate(
      { plateNumber: req.params.plateNumber },
      { route, routeDirection, assignedDriver },
      { new: true, runValidators: true }
    );

    if (!updatedJeep) {
      return res.status(404).json({ message: "Jeep not found." });
    }

    res.status(200).json(updatedJeep);
  } catch (error) {
    console.error("Error updating jeep:", error);
    res.status(500).json({ message: "Server error. Unable to update jeep." });
  }
};

// Update jeep status from Arduino
exports.updateJeepStatus = async (req, res) => {
  const { plateNumber, status } = req.body;

  // Basic validation
  if (!plateNumber || !status) {
    return res.status(400).json({ message: "Plate number and status are required." });
  }

  try {
    // Find the jeep by plate number and update the status
    const updatedJeep = await Jeep.findOneAndUpdate(
      { plateNumber },
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedJeep) {
      return res.status(404).json({ message: "Jeep not found." });
    }

    res.status(200).json(updatedJeep);
  } catch (error) {
    console.error("Error updating jeep status:", error);
    res.status(500).json({ message: "Server error. Unable to update jeep status." });
  }
};

// Delete a jeep
exports.deleteJeep = async (req, res) => {
  try {
    const deletedJeep = await Jeep.findOneAndDelete({ plateNumber: req.params.plateNumber });

    if (!deletedJeep) {
      return res.status(404).json({ message: "Jeep not found." });
    }

    res.status(200).json({ message: "Jeep deleted successfully." });
  } catch (error) {
    console.error("Error deleting jeep:", error);
    res.status(500).json({ message: "Server error. Unable to delete jeep." });
  }
};
