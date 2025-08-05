import routeModel from '../models/RouteModel.js';
import socketService from './socketService.js';
import logger from '../utils/logger.js';
import constants from '../utils/constants.js';

const { CLEANUP_INTERVAL, OFFLINE_THRESHOLD } = constants;

class LocationService {
    constructor() {
        this.startCleanupInterval();
    }

    handleLocationUpdate(routeNo, message) {
        const locationData = JSON.parse(message.toString());

        const enrichedData = {
            ...locationData,
            routeNo: routeNo,
            receivedAt: new Date().toISOString(),
            messageType: 'location'
        };

        // Initialize route if doesn't exist
        const isNewRoute = routeModel.addRoute(routeNo);
        if (isNewRoute) {
            logger.route(`New route detected: ${routeNo} - notifying all clients`);
            socketService.broadcastNewRoute(routeNo);
        }

        // Add/update driver
        const isNewDriver = routeModel.addDriver(routeNo, locationData.driverId, enrichedData);
        const routeData = routeModel.getRoute(routeNo);

        logger.route(`Updated location for route ${routeNo}, driver ${locationData.driverName || locationData.driverId} (${routeData.drivers.size} active drivers)`);

        if (isNewDriver) {
            logger.route(`New driver joined route ${routeNo}: ${locationData.driverName || locationData.driverId}`);
        }

        // Broadcast to passengers
        socketService.broadcastToRoute(routeNo, enrichedData);
    }

    handleStatusUpdate(routeNo, message) {
        const statusData = JSON.parse(message.toString());

        logger.route(`Status update for route ${routeNo}, driver ${statusData.driverName || statusData.driverId}: ${statusData.status}`);

        // Handle driver going offline
        if (statusData.status === 'offline') {
            const result = routeModel.removeDriver(routeNo, statusData.driverId);
            
            if (result.routeEmpty) {
                logger.route(`Route ${routeNo} removed - no active drivers`);
                socketService.broadcastRouteInactive(routeNo);
            }
        }

        // Broadcast status to subscribers
        socketService.broadcastToRoute(routeNo, {
            routeNo: routeNo,
            messageType: 'status',
            ...statusData,
            receivedAt: new Date().toISOString()
        });
    }

    startCleanupInterval() {
        setInterval(() => {
            this.cleanupOfflineDrivers();
        }, CLEANUP_INTERVAL);
    }

    cleanupOfflineDrivers() {
        const now = new Date();

        routeModel.getActiveRoutes().forEach(routeNo => {
            const routeData = routeModel.getRoute(routeNo);
            const driversToRemove = [];

            routeData.drivers.forEach((driverData, driverId) => {
                const lastSeen = new Date(driverData.receivedAt);
                if (now - lastSeen > OFFLINE_THRESHOLD) {
                    driversToRemove.push(driverId);
                }
            });

            driversToRemove.forEach(driverId => {
                const result = routeModel.removeDriver(routeNo, driverId);
                logger.route(`Removed offline driver ${driverId} from route ${routeNo}`);
                
                if (result.routeEmpty) {
                    logger.route(`Route ${routeNo} removed - no active drivers`);
                    socketService.broadcastRouteInactive(routeNo);
                }
            });
        });
    }
}

export default new LocationService();