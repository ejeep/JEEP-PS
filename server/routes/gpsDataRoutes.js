const express = require('express');
const router = express.Router();
const locationController = require('../controllers/gpsDataController');

// router.get('/location', locationController.getLocation);

router.post('/commuter-location', locationController.commuterLocation);
router.post('/jeep-location', locationController.createLocation);
router.get('/locations', locationController.getAllLocations);
router.put('/assign-vehicle/:jeepID', locationController.updateLocation);

module.exports = router;
