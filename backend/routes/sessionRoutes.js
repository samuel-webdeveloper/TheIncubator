import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; 
import {
  bookSession,
  getMySessions,
  updateSessionStatus,
  getSessionById,
  markSessionComplete,
  submitFeedback,
} from '../controllers/sessionController.js';

const router = express.Router();

// Mentee books a session
router.post('/', protect, bookSession);

// Mentor or mentee gets all their sessions
router.get('/', protect, getMySessions);

// Get session by ID
router.get('/:id', protect, getSessionById);

// Mentor updates session status (e.g., completed/cancelled)
router.put('/:id', protect, updateSessionStatus);

// Submit feedback (mentee only)
router.put('/:id/feedback', protect, submitFeedback);

// Admin marks session as complete
router.put('/sessions/:id/complete', markSessionComplete);

export default router;



