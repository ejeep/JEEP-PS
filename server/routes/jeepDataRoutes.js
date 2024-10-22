// routes/jeepRoutes.js
const express = require("express");
const router = express.Router();
const jeepController = require("../controllers/jeepDataController");

// Route to get all jeeps
router.get("/jeeps", jeepController.getAllJeeps);

// Route to create a new jeep
router.post("/addVehicle", jeepController.createJeep);

// Route to update an existing jeep by plate number
router.put("/updateVehicle/:plateNumber", jeepController.updateJeep);

// Route to delete a jeep by plate number
router.delete("/deleteVehicle/:plateNumber", jeepController.deleteJeep);

module.exports = router;
