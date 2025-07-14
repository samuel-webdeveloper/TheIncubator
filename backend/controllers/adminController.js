import User from '../models/User.js';
import bcrypt from 'bcrypt';
import MentorshipRequest from '../models/MentorshipRequest.js';
import Session from '../models/Session.js';
import imagekit from '../config/imageKit.js';
import path from 'path';

// @desc    Admin creates a new user
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    let imageUrl = '';

    // Upload profile image ONLY if role is mentor and file is present
    if (req.file && role === 'mentor') {
      const ext = path.extname(req.file.originalname); // e.g., .jpg, .png
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer, // buffer because multer stores it in memory
        fileName: `mentor-${Date.now()}${ext}`,
        folder: '/mentorship/mentors',
      });

      imageUrl = uploadedImage.url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      image: imageUrl, // save image only if mentor
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin updates a user's role
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) return res.status(400).json({ message: 'New role is required' });

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin fetches all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin fetches all mentors
export const getAllMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('-password');
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin deletes a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin deletes a match by ID
export const deleteMatch = async (req, res) => {
  try {
    const match = await MentorshipRequest.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    await match.deleteOne(); // Or match.remove() if using older Mongoose
    res.status(200).json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc Admin views accepted matches (with optional filters)
export const getAcceptedMatches = async (req, res) => {
  try {
    const { mentor, mentee, status } = req.query;
    const query = {};
    query.status = status || 'accepted';

    if (mentor) query.mentor = mentor;
    if (mentee) query.mentee = mentee;

    const matches = await MentorshipRequest.find(query)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email');

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin views all sessions (with optional filters)
export const getAllSessions = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const query = {};

    if (status) query.status = status;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sessions = await Session.find(query)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email');

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin manually assigns a mentor to a mentee
export const manuallyAssignMentor = async (req, res) => {
  const { mentorId, menteeId, message } = req.body;

  if (!mentorId || !menteeId) {
    return res.status(400).json({ message: 'Mentor ID and Mentee ID are required' });
  }

  try {
    const existing = await MentorshipRequest.findOne({ mentor: mentorId, mentee: menteeId });
    if (existing) {
      return res.status(400).json({ message: 'Mentorship already exists between these users' });
    }

    const newRequest = await MentorshipRequest.create({
      mentor: mentorId,
      mentee: menteeId,
      message: message || 'Assigned by admin',
      status: 'accepted',
    });

    // ✅ Re-fetch with .populate
    const populated = await MentorshipRequest.findById(newRequest._id)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email');

    res.status(201).json({
      message: 'Mentor successfully assigned to mentee',
      match: populated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
import User from '../models/User.js';

// @desc    Admin creates a new user (mentor, mentee, or admin)
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // For now: store password as plain text (NOTE: Replace with bcrypt in production)
    const user = await User.create({
      name,
      email,
      password,  // plain text for now
      role,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin updates a user's role
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) return res.status(400).json({ message: 'New role is required' });

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin fetches all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/