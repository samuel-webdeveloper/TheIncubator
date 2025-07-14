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
} from '../controllers/adminController.js';

import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js'; 

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

const router = express.Router();

router.use(protect, adminOnly);

// ✅ Enable image upload on user creation
router.post('/users', upload.single('image'), createUser);

router.get('/users', getAllUsers);
router.get('/mentors', getAllMentors); 
router.put('/users/:id/role', updateUserRole);
router.get('/sessions', getAllSessions);
router.get('/matches', getAcceptedMatches);
router.post('/matches', manuallyAssignMentor);
router.delete('/users/:id', deleteUser);
router.delete('/matches/:id', deleteMatch);



export default router;
