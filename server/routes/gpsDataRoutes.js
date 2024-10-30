const express = require('express');
const router = express.Router();
const locationController = require('../controllers/gpsDataController');

router.get('/location', locationController.getLocation);

router.post('/update-location', locationController.updateLocation);

module.exports = router;
