const express = require('express');
const router = express.Router();
const travelLogController = require('../controllers/travelLogController');

// Route to create a travel log
router.post('/create', travelLogController.createTravelLog);

// Route to get all travel logs
router.get('/logs', travelLogController.getTravelLogs);

module.exports = router;
