const mqttService = require('../services/mqttService');
const passengerModel = require('../models/PassengerModel');
const routeModel = require('../models/RouteModel');
const { AVAILABLE_ROUTES } = require('../utils/constants');

const getHealth = (req, res) => {
    res.json({
        status: 'OK',
        message: 'Route-Based Bus Tracker API is running!',
        timestamp: new Date().toISOString(),
        mqttConnected: mqttService.isClientConnected(),
        passengerClients: passengerModel.getClientCount(),
        activeRoutes: routeModel.getRouteCount(),
        availableRoutes: AVAILABLE_ROUTES
    });
};

module.exports = {
    getHealth
};