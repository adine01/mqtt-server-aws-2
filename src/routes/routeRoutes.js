import express from 'express';
import { getAllRoutes, getRouteById } from '../controllers/routeController.js';

const router = express.Router();

// Get all routes
router.get('/', getAllRoutes);

// Get specific route data
router.get('/:routeNo', getRouteById);

export default router;