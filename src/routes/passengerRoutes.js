const express = require('express');
const passengerController = require('../controllers/passengerController');

const router = express.Router();

// Get connected passengers info
router.get('/', passengerController.getPassengers);

module.exports = router;