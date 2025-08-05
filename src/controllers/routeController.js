import routeModel from '../models/RouteModel.js';
import constants from '../utils/constants.js';

const { AVAILABLE_ROUTES } = constants;

const getAllRoutes = (req, res) => {
    const activeRoutes = routeModel.getAllRoutes();

    res.json({
        success: true,
        availableRoutes: AVAILABLE_ROUTES,
        activeRoutes: activeRoutes,
        count: activeRoutes.length
    });
};

const getRouteById = (req, res) => {
    const { routeNo } = req.params;
    const routeData = routeModel.getRoute(routeNo);

    if (routeData) {
        const response = {
            routeNo,
            activeDrivers: routeData.drivers.size,
            lastUpdate: routeData.lastUpdate,
            drivers: Array.from(routeData.drivers.entries()).map(([driverId, driverData]) => ({
                driverId,
                driverName: driverData.driverName,
                lat: driverData.lat,
                lng: driverData.lng,
                speed: driverData.speed,
                heading: driverData.heading,
                accuracy: driverData.accuracy,
                lastSeen: driverData.receivedAt
            }))
        };

        res.json({
            success: true,
            data: response
        });
    } else {
        res.status(404).json({
            success: false,
            message: `No active drivers found for route ${routeNo}`
        });
    }
};

const getAvailableRoutes = (req, res) => {
    res.json({
        success: true,
        routes: AVAILABLE_ROUTES,
        count: AVAILABLE_ROUTES.length
    });
};

export {
    getAllRoutes,
    getRouteById,
    getAvailableRoutes
};