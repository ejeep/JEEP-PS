// controllers/jeepController.js
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
    const newJeep = new Jeep({ plateNumber, model, route, routeDirection });
    await newJeep.save();
    res.status(201).json(newJeep);
  } catch (error) {
    console.error("Error creating jeep:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Plate number must be unique." });
    }
    res.status(500).json({ message: "Server error. Unable to create jeep." });
  }
};

// Update an existing jeep
// Update Jeep data, including the assigned driver
exports.updateJeep = async (req, res) => {
  const { route, routeDirection, assignedDriver } = req.body; // Include assignedDriver in the request body

  try {
    const updatedJeep = await Jeep.findOneAndUpdate(
      { plateNumber: req.params.plateNumber },
      { route, routeDirection, assignedDriver }, // Add assignedDriver to the update object
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
  const { plateNumber, status } = req.body; // Expecting plateNumber and new status in the request body

  // Basic validation
  if (!plateNumber || !status) {
    return res.status(400).json({ message: "Plate number and status are required." });
  }

  try {
    // Find the jeep by plate number and update the status
    const updatedJeep = await Jeep.findOneAndUpdate(
      { plateNumber: plateNumber },
      { status: status }, // Update the status
      { new: true, runValidators: true } // Return updated document and run validation
    );

    // Check if the jeep was found and updated
    if (!updatedJeep) {
      return res.status(404).json({ message: "Jeep not found." });
    }

    // Send back the updated jeep data
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
