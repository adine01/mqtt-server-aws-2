import mqttService from '../services/mqttService.js';
import passengerModel from '../models/PassengerModel.js';
import routeModel from '../models/RouteModel.js';
import constants from '../utils/constants.js';

const { AVAILABLE_ROUTES } = constants;

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

export {
    getHealth
};