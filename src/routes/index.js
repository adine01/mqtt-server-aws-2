import express from 'express';
import routeRoutes from './routeRoutes.js';
import passengerRoutes from './passengerRoutes.js';
import { getHealth } from '../controllers/healthController.js';

const router = express.Router();

// Health check
router.get('/health', getHealth);

// Route-related endpoints
router.use('/routes', routeRoutes);
router.use('/available-routes', routeRoutes);

// Passenger-related endpoints
router.use('/passengers', passengerRoutes);

export default router;