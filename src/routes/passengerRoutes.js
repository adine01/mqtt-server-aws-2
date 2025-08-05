import express from 'express';
import { getPassengers } from '../controllers/passengerController.js';

const router = express.Router();

// Get connected passengers info
router.get('/', getPassengers);

export default router;