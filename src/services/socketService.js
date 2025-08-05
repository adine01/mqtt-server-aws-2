import { Server } from 'socket.io';
import passengerModel from '../models/PassengerModel.js';
import routeModel from '../models/RouteModel.js';
import logger from '../utils/logger.js';
import constants from '../utils/constants.js';

const { AVAILABLE_ROUTES } = constants;

class SocketService {
    constructor() {
        this.io = null;
    }

    initialize(server) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.setupEventHandlers();
        return this.io;
    }

    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            logger.socket(`Passenger client connected: ${socket.id}`);

            // Store client connection
            passengerModel.addClient(socket.id, { socket });

            this.handleRouteSubscription(socket);
            this.handleRouteUnsubscription(socket);
            this.handleDisconnection(socket);
            this.sendConnectionStatus(socket);
        });
    }

    handleRouteSubscription(socket) {
        socket.on('subscribe_route', (data) => {
            const { routeNo } = data;
            
            const wasNew = passengerModel.subscribeToRoute(socket.id, routeNo);
            
            if (!wasNew) {
                logger.passenger(`Client ${socket.id} already subscribed to route ${routeNo} - skipping`);
                return;
            }

            logger.passenger(`Client ${socket.id} subscribed to route ${routeNo}`);

            // Send current route data if available
            const currentRouteData = routeModel.getRoute(routeNo);
            if (currentRouteData && currentRouteData.drivers.size > 0) {
                currentRouteData.drivers.forEach((driverData, driverId) => {
                    socket.emit('route_location_update', {
                        routeNo: routeNo,
                        driverId: driverId,
                        ...driverData
                    });
                });
            }

            socket.emit('subscription_confirmed', { routeNo, status: 'subscribed' });
        });
    }

    handleRouteUnsubscription(socket) {
        socket.on('unsubscribe_route', (data) => {
            const { routeNo } = data;
            logger.passenger(`Client ${socket.id} unsubscribed from route ${routeNo}`);

            passengerModel.unsubscribeFromRoute(socket.id, routeNo);
            socket.emit('subscription_confirmed', { routeNo, status: 'unsubscribed' });
        });
    }

    handleDisconnection(socket) {
        socket.on('disconnect', () => {
            logger.socket(`Passenger client disconnected: ${socket.id}`);
            passengerModel.removeClient(socket.id);
        });
    }

    sendConnectionStatus(socket) {
        socket.emit('connection_status', {
            status: 'connected',
            clientId: socket.id,
            availableRoutes: AVAILABLE_ROUTES,
            activeRoutes: routeModel.getActiveRoutes()
        });
    }

    broadcastToRoute(routeNo, data) {
        const subscribers = passengerModel.getSubscribersForRoute(routeNo);
        
        subscribers.forEach(({ socket }) => {
            socket.emit('route_location_update', data);
        });

        if (subscribers.length > 0) {
            logger.passenger(`Broadcasted ${data.messageType} for route ${routeNo} to ${subscribers.length} passenger(s)`);
        }
    }

    broadcastNewRoute(routeNo) {
        this.io.emit('new_route_available', { routeNo });
    }

    broadcastRouteInactive(routeNo) {
        this.io.emit('route_inactive', { routeNo });
    }
}

export default new SocketService();