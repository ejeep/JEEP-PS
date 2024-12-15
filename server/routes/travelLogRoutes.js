const express = require("express");
const router = express.Router();
const travelLogController = require("../controllers/travelLogController");

// Route to fetch all travel logs
router.get("/logs", travelLogController.getAllTravelLogs);

// Route to create or update travel logs
router.post("/logs", travelLogController.createOrUpdateTravelLog);

// Route to fetch logs for today
router.get("/today", travelLogController.getLogsForToday);

// Route to get total travel duration for a specific arduinoID
router.get("/duration/:arduinoID", travelLogController.getTotalDuration);

// Route to get logs for a specific arduinoID within a date range (optional feature)
// router.get("/logs/:arduinoID", travelLogController.getLogsForArduinoID);

module.exports = router;
