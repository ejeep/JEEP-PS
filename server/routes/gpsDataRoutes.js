const express = require('express');
const router = express.Router();
const locationController = require('../controllers/gpsDataController');

// router.get('/location', locationController.getLocation);

router.post('/commuter-location', locationController.commuterLocation);
router.post('/jeep-location', locationController.createLocation);
router.get('/locations', locationController.getAllLocations);
router.get('/display-commuter-location', locationController.getCommuterLocation);
router.put('/assign-vehicle/:arduinoID', locationController.assignJeepToArduino);

module.exports = router;
