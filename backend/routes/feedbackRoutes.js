import express from 'express';
import { createFeedback, getFeedbackForUser } from '../controllers/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Create feedback
router.post('/', protect, createFeedback);

// View feedback for a specific user (mentor or mentee)
router.get('/:userId', protect, getFeedbackForUser);

export default router;
