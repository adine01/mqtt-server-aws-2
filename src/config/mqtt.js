import dotenv from 'dotenv';
dotenv.config();

export default {
    BROKER_URL: process.env.MQTT_BROKER || 'mqtt://localhost:1883',
    OPTIONS: {
        keepalive: 60,           // 60-second keepalive
        connectTimeout: 30000,   // 30-second connection timeout
        reconnectPeriod: 5000,   // 5-second reconnect attempts
        clean: true,             // Clean session
        clientId: `bus-server-${Date.now()}` // Unique client ID
    },
    TOPICS: {
        ROUTE_LOCATION: 'route/+/location',
        ROUTE_STATUS: 'route/+/status'
    }
};