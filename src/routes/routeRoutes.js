const express = require('express');
const routeController = require('../controllers/routeController');

const router = express.Router();

// Get all routes
router.get('/', routeController.getAllRoutes);

// Get specific route data
router.get('/:routeNo', routeController.getRouteById);

module.exports = router;