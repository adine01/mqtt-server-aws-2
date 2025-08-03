const express = require('express');
const http = require('http');
const corsMiddleware = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const mqttService = require('./services/mqttService');
const socketService = require('./services/socketService');

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
app.get('/available-routes', require('./controllers/routeController').getAvailableRoutes);

// Error handling
app.use(errorHandler);

module.exports = server;