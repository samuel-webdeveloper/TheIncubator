import express from 'express';
import { login, getMe, updateProfile, changePassword, getAllMentees } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Auth routes
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/mentees', protect, getAllMentees);


export default router;
