import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  setAvailability, 
  getMyAvailability,
  updateAvailability,
  deleteAvailability
} from '../controllers/availabilityController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// POST or PUT - Create or update
router.post('/', setAvailability);

// GET - Get availability
router.get('/', getMyAvailability);

// PUT - Update availability
router.put('/', updateAvailability);

// DELETE - Delete availability
router.delete('/', deleteAvailability);

export default router;
