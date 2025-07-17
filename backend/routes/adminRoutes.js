import express from 'express';
import {
  createUser,
  updateUserRole,
  getAllUsers,
  getAllMentors,
  getAllSessions,
  getAcceptedMatches,
  manuallyAssignMentor,
  deleteUser,
  deleteMatch,
  getUserById,
  createMatchedSession, 
} from '../controllers/adminController.js';

import { protect, isAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';


const router = express.Router();

// All routes below require protect + admin access
router.use(protect, isAdmin);

// Routes
router.post('/users', upload.single('image'), createUser);
router.get('/users', getAllUsers);
router.get('/mentors', getAllMentors);
router.put('/users/:id/role', updateUserRole);
router.get('/sessions', getAllSessions);
router.get('/matches', getAcceptedMatches);
router.post('/matches', manuallyAssignMentor);
router.delete('/users/:id', deleteUser);
router.delete('/matches/:id', deleteMatch);


router.get('/users/:id', getUserById);
router.post('/match-session', protect, isAdmin, createMatchedSession);

export default router;
