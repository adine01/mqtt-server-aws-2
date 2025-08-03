const express = require('express');
const routeRoutes = require('./routeRoutes');
const passengerRoutes = require('./passengerRoutes');
const healthController = require('../controllers/healthController');

const router = express.Router();

// Health check
router.get('/health', healthController.getHealth);

// Route-related endpoints
router.use('/routes', routeRoutes);
router.use('/available-routes', routeRoutes);

// Passenger-related endpoints
router.use('/passengers', passengerRoutes);

module.exports = router;