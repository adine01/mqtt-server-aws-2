const mqtt = require('mqtt');
const config = require('../config/mqtt');
const logger = require('../utils/logger');
const locationService = require('./locationService');

class MQTTService {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    connect() {
        this.client = mqtt.connect(config.BROKER_URL);

        this.client.on('connect', () => {
            logger.success('Connected to MQTT broker');
            this.isConnected = true;
            this.subscribeToTopics();
        });

        this.client.on('message', (topic, message) => {
            this.handleMessage(topic, message);
        });

        this.client.on('error', (error) => {
            logger.error('MQTT connection error:', error);
            this.isConnected = false;
        });

        return this.client;
    }

    subscribeToTopics() {
        // Subscribe to all route location updates
        this.client.subscribe(config.TOPICS.ROUTE_LOCATION, (err) => {
            if (err) {
                logger.error('Failed to subscribe to route locations:', err);
            } else {
                logger.mqtt('Subscribed to route/+/location');
            }
        });

        // Subscribe to route status updates
        this.client.subscribe(config.TOPICS.ROUTE_STATUS, (err) => {
            if (err) {
                logger.error('Failed to subscribe to route status:', err);
            } else {
                logger.mqtt('Subscribed to route/+/status');
            }
        });
    }

    handleMessage(topic, message) {
        try {
            logger.mqtt(`Received message on topic: ${topic}`);

            const topicParts = topic.split('/');
            const routeNo = topicParts[1];
            const messageType = topicParts[2];

            if (messageType === 'location') {
                locationService.handleLocationUpdate(routeNo, message);
            } else if (messageType === 'status') {
                locationService.handleStatusUpdate(routeNo, message);
            }
        } catch (error) {
            logger.error('Error processing MQTT message:', error);
        }
    }

    isClientConnected() {
        return this.isConnected && this.client && this.client.connected;
    }
}

module.exports = new MQTTService();