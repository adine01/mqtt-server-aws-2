import app from './src/app.js';
import config from './src/config/server.js';

const server = app.listen(config.PORT, '0.0.0.0', () => {
    console.log(`🚀 Route-Based Bus Tracker Server running on http://0.0.0.0:${config.PORT}`);
    console.log(`📊 Health check: http://0.0.0.0:${config.PORT}/health`);
    console.log(`🚍 All routes: http://0.0.0.0:${config.PORT}/routes`);
    console.log(`🚌 Route data: http://0.0.0.0:${config.PORT}/routes/{routeNo}`);
    console.log(`👥 Passengers: http://0.0.0.0:${config.PORT}/passengers`);
    console.log(`📋 Available routes: http://0.0.0.0:${config.PORT}/available-routes`);
    console.log(`🔌 WebSocket available for real-time updates`);
});

export default server;