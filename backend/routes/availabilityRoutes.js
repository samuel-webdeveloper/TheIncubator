import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; 
import {
  setAvailability, 
  getMyAvailability,
  updateAvailability,
  deleteAvailability,
  getAvailabilityByMentorId
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

// GET availability for a specific mentor
router.get('/:mentorId', getAvailabilityByMentorId);

export default router;
