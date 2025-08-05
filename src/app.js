import express from 'express';
import http from 'http';
import corsMiddleware from './middleware/cors.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';
import mqttService from './services/mqttService.js';
import socketService from './services/socketService.js';
import { getAvailableRoutes } from './controllers/routeController.js';

const app = express();
const server = http.createServer(app);

// Initialize services
mqttService.connect();
socketService.initialize(server);

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use('/', routes);

// Add available routes endpoint at root level
app.get('/available-routes', getAvailableRoutes);

// Error handling
app.use(errorHandler);

export default server;