# 🚌 MQTT Bus Tracking Server

A real-time bus tracking system built with Node.js, MQTT, and WebSockets that enables live location tracking for multiple bus routes with passenger subscription capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [WebSocket Events](#-websocket-events)
- [MQTT Topics](#-mqtt-topics)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **Real-time Location Tracking**: Live GPS tracking of buses using MQTT protocol
- **Multi-route Support**: Track multiple bus routes simultaneously
- **Passenger Subscriptions**: Passengers can subscribe to specific routes via WebSockets
- **Driver Status Management**: Online/offline status tracking for drivers
- **Automatic Cleanup**: Removes inactive drivers and routes automatically
- **RESTful API**: Complete REST API for route and passenger management
- **Health Monitoring**: Built-in health checks and system status monitoring
- **ES6 Modules**: Modern JavaScript with ES6 import/export syntax

## 🏗️ Architecture

```
┌─────────────────┐    MQTT      ┌─────────────────┐    WebSocket     ┌─────────────────┐
│   Driver Apps   │ ───────────► │   Server API    │ ───────────────► │ Passenger Apps  │
│   (Flutter)     │              │   (Node.js)     │                  │   (Web/Mobile)  │
└─────────────────┘              └─────────────────┘                  └─────────────────┘
                                          │
                                          ▼
                                 ┌─────────────────┐
                                 │   MQTT Broker   │
                                 │   (Mosquitto)   │
                                 └─────────────────┘
```

### Components

- **MQTT Service**: Handles incoming location data from bus drivers
- **WebSocket Service**: Real-time communication with passenger applications
- **Location Service**: Processes and validates location updates
- **Route Model**: In-memory storage for active routes and drivers
- **Passenger Model**: Manages WebSocket client subscriptions

## 🔧 Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **MQTT Broker** (Mosquitto recommended)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd test-mqtt-app/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

4. **Start MQTT Broker** (if not already running)
   ```bash
   # Using Docker
   docker run -it -p 1883:1883 -p 9001:9001 eclipse-mosquitto

   # Or install locally on Ubuntu/Debian
   sudo apt-get install mosquitto mosquitto-clients
   sudo systemctl start mosquitto
   ```

5. **Start the server**
   ```bash
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the server root:

```env
# Server Configuration
PORT=8080
NODE_ENV=development
CORS_ORIGIN=*

# MQTT Configuration
MQTT_BROKER=mqtt://localhost:1883

# Service Configuration
CLEANUP_INTERVAL=300000    # 5 minutes (ms)
OFFLINE_THRESHOLD=600000   # 10 minutes (ms)
```

### Available Routes

Configure available routes in [`src/utils/constants.js`](src/utils/constants.js):

```javascript
AVAILABLE_ROUTES: ["99", "240", "EX01", "187"]
```

## 📖 Usage

### Starting the Server

```bash
# Production
npm start

# Development with auto-reload
npm run dev
```

The server will start on `http://localhost:8080` by default.

### Health Check

Visit `http://localhost:8080/health` to verify the server is running:

```json
{
  "status": "OK",
  "message": "Route-Based Bus Tracker API is running!",
  "timestamp": "2025-01-08T10:30:00.000Z",
  "mqttConnected": true,
  "passengerClients": 0,
  "activeRoutes": 0,
  "availableRoutes": ["99", "240", "EX01", "187"]
}
```

## 🌐 API Endpoints

### Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |
| `GET` | `/routes` | Get all active routes with drivers |
| `GET` | `/routes/:routeNo` | Get specific route data |
| `GET` | `/available-routes` | Get list of available routes |
| `GET` | `/passengers` | Get connected passenger information |

### Example Responses

**GET `/routes`**
```json
{
  "success": true,
  "availableRoutes": ["99", "240", "EX01", "187"],
  "activeRoutes": [
    {
      "routeNo": "99",
      "activeDrivers": 2,
      "lastUpdate": "2025-01-08T10:30:00.000Z",
      "drivers": [
        {
          "driverId": "driver123",
          "driverName": "John Doe",
          "lat": 6.9271,
          "lng": 79.8612,
          "speed": 25.5,
          "lastSeen": "2025-01-08T10:29:45.000Z"
        }
      ]
    }
  ],
  "count": 1
}
```

**GET `/routes/99`**
```json
{
  "success": true,
  "data": {
    "routeNo": "99",
    "activeDrivers": 1,
    "lastUpdate": "2025-01-08T10:30:00.000Z",
    "drivers": [
      {
        "driverId": "driver123",
        "driverName": "John Doe",
        "lat": 6.9271,
        "lng": 79.8612,
        "speed": 25.5,
        "heading": 45,
        "accuracy": 10,
        "lastSeen": "2025-01-08T10:29:45.000Z"
      }
    ]
  }
}
```

## 🔌 WebSocket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `subscribe_route` | `{routeNo: "99"}` | Subscribe to route updates |
| `unsubscribe_route` | `{routeNo: "99"}` | Unsubscribe from route |

### Server → Client

| Event | Description |
|-------|-------------|
| `connection_status` | Connection confirmation with available routes |
| `route_location_update` | Real-time location updates for subscribed routes |
| `subscription_confirmed` | Confirmation of subscription changes |
| `new_route_available` | Notification when new route becomes active |
| `route_inactive` | Notification when route becomes inactive |

### Example WebSocket Usage

```javascript
const socket = io('http://localhost:8080');

// Subscribe to route updates
socket.emit('subscribe_route', { routeNo: '99' });

// Listen for location updates
socket.on('route_location_update', (data) => {
  console.log('Location update:', data);
  // {
  //   routeNo: "99",
  //   driverId: "driver123",
  //   driverName: "John Doe",
  //   lat: 6.9271,
  //   lng: 79.8612,
  //   speed: 25.5,
  //   receivedAt: "2025-01-08T10:30:00.000Z",
  //   messageType: "location"
  // }
});
```

## 📡 MQTT Topics

The server subscribes to the following MQTT topics:

| Topic Pattern | Purpose | Example |
|---------------|---------|---------|
| `route/+/location` | Location updates from drivers | `route/99/location` |
| `route/+/status` | Driver status updates | `route/99/status` |

### MQTT Message Format

**Location Update** (`route/99/location`):
```json
{
  "driverId": "driver123",
  "driverName": "John Doe",
  "lat": 6.9271,
  "lng": 79.8612,
  "speed": 25.5,
  "heading": 45,
  "accuracy": 10,
  "timestamp": "2025-01-08T10:30:00.000Z"
}
```

**Status Update** (`route/99/status`):
```json
{
  "driverId": "driver123",
  "driverName": "John Doe",
  "status": "online"  // or "offline"
}
```

## 📁 Project Structure

```
server/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── config/
│   │   ├── mqtt.js           # MQTT broker configuration
│   │   └── server.js         # Server configuration
│   ├── controllers/
│   │   ├── healthController.js
│   │   ├── passengerController.js
│   │   └── routeController.js
│   ├── middleware/
│   │   ├── cors.js           # CORS middleware
│   │   └── errorHandler.js   # Global error handler
│   ├── models/
│   │   ├── PassengerModel.js # In-memory passenger management
│   │   └── RouteModel.js     # In-memory route management
│   ├── routes/
│   │   ├── index.js          # Route aggregator
│   │   ├── passengerRoutes.js
│   │   └── routeRoutes.js
│   ├── services/
│   │   ├── locationService.js # Location data processing
│   │   ├── mqttService.js    # MQTT client management
│   │   └── socketService.js  # WebSocket management
│   └── utils/
│       ├── constants.js      # Application constants
│       └── logger.js         # Logging utility
├── .env                      # Environment variables
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
└── server.js                # Application entry point
```

## 🛠️ Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (placeholder)
```

### Adding New Features

1. **New Routes**: Add controllers in `src/controllers/`
2. **New Services**: Add services in `src/services/`
3. **New Models**: Add models in `src/models/`
4. **MQTT Topics**: Update `src/config/mqtt.js`
5. **Constants**: Update `src/utils/constants.js`

### Debugging

Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## 🚀 Deployment

### Docker Deployment

1. **Create Dockerfile**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

2. **Build and run**:
```bash
docker build -t bus-tracker-server .
docker run -p 8080:8080 --env-file .env bus-tracker-server
```

### AWS/Cloud Deployment

1. Set environment variables in your cloud platform
2. Ensure MQTT broker is accessible
3. Configure security groups/firewall for ports 8080 and 1883
4. Use a process manager like PM2 for production

### Environment Setup for Production

```env
NODE_ENV=production
PORT=8080
MQTT_BROKER=mqtt://your-mqtt-broker:1883
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the [API documentation](#-api-endpoints)
- Review the [WebSocket events](#-websocket-events)

---

**BuilT using Node.js, MQTT, and WebSockets**
