require('dotenv').config();

module.exports = {
    BROKER_URL: process.env.MQTT_BROKER || 'mqtt://localhost:1883',
    TOPICS: {
        ROUTE_LOCATION: 'route/+/location',
        ROUTE_STATUS: 'route/+/status'
    }
};