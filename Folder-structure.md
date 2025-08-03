
## Folder Structure
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   ├── routes/
│   ├── models/
│   ├── utils/
│   └── app.js
├── .env
├── .env.example
├── server.js
└── package.json
```

## File Breakdown

**Environment Configuration:**
- `.env` - Your actual environment variables
- `.env.example` - Template showing required variables
- `src/config/` - Configuration files (database, MQTT, server settings)

**Core Application:**
- `server.js` - Entry point, just starts the server
- `src/app.js` - Express app setup and middleware configuration

**Controllers:** (Handle request/response logic)
- `src/controllers/routeController.js` - All route-related endpoints
- `src/controllers/passengerController.js` - Passenger-related endpoints
- `src/controllers/healthController.js` - Health check endpoint

**Services:** (Business logic)
- `src/services/mqttService.js` - MQTT client setup and message handling
- `src/services/socketService.js` - WebSocket connection management
- `src/services/locationService.js` - Location data management and cleanup

**Routes:** (API route definitions)
- `src/routes/index.js` - Main router
- `src/routes/routeRoutes.js` - Route-related endpoints
- `src/routes/passengerRoutes.js` - Passenger endpoints

**Models/Storage:** (Data structures)
- `src/models/RouteModel.js` - Route data structure and methods
- `src/models/PassengerModel.js` - Passenger client management

**Utilities:**
- `src/utils/logger.js` - Logging utility
- `src/utils/constants.js` - Constants like AVAILABLE_ROUTES
- `src/utils/helpers.js` - Helper functions

**Middleware:**
- `src/middleware/cors.js` - CORS configuration
- `src/middleware/errorHandler.js` - Error handling middleware