// routes/mentorRoutes.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @desc    Public - Get all mentors
// @route   GET /api/mentors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('-password');
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
