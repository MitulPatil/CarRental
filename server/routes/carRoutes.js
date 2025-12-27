import express from 'express';
import { getAllCars, getCarById } from '../controllers/carController.js';

const carRouter = express.Router();

// Public routes - no authentication required
carRouter.get('/all', getAllCars);
carRouter.get('/:id', getCarById);

export default carRouter;
