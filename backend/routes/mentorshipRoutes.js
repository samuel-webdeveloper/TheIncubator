import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createRequest,
  getRequestsForMentor,
  getRequestsByMentee,
  updateRequestStatus,
  deleteRequest,
  getRequestsByMentor,
} from '../controllers/mentorshipController.js';

const router = express.Router();

// Mentee creates request
router.post('/', protect, createRequest);

// Mentee views their requests
router.get('/mentee', protect, getRequestsByMentee);

// Mentor views incoming requests
router.get('/mentor', protect, getRequestsForMentor);

// Mentor accepts/rejects request
router.put('/:id/status', protect, updateRequestStatus);

// Mentee cancel request
router.delete('/:id', protect, deleteRequest);

// Mentor: View requests they initiated
router.get('/mentor/sent', protect, getRequestsByMentor);

export default router;
