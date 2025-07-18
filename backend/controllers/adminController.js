import User from '../models/User.js';
import bcrypt from 'bcrypt';
import MentorshipRequest from '../models/MentorshipRequest.js';
import Availability from '../models/Availability.js';
import Session from '../models/Session.js';
import imagekit from '../config/imageKit.js';
import path from 'path';
import sendEmail from '../config/sendEmail.js';

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
      const ext = path.extname(req.file.originalname); 
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer, 
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
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password');
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

    await match.deleteOne(); 
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
  const { mentorId, menteeId, message, slot } = req.body;

  if (!mentorId || !menteeId || !slot) {
    return res.status(400).json({ message: 'Mentor ID, Mentee ID, and Slot are required' });
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
      slot,
    });

    const populated = await MentorshipRequest.findById(newRequest._id)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email');

    // ✅ Send email notifications
    const formattedSlot = `${slot.day}, ${slot.startTime} - ${slot.endTime}`;

    const mentorSubject = 'You have been assigned a new mentee';
    const menteeSubject = 'You have been assigned a mentor';

    const mentorHtml = `
      <p>Hello ${populated.mentor.name},</p>
      <p>You have been matched with a mentee: <strong>${populated.mentee.name}</strong>.</p>
      <p><strong>Session Slot:</strong> ${formattedSlot}</p>
      <p>Please log in to your dashboard to review the match and session details.</p>
      <br/>
      <p>Best regards,<br/>TheIncubator Team</p>
    `;

    const menteeHtml = `
      <p>Hello ${populated.mentee.name},</p>
      <p>You have been matched with a mentor: <strong>${populated.mentor.name}</strong>.</p>
      <p><strong>Session Slot:</strong> ${formattedSlot}</p>
      <p>Please log in to your dashboard to prepare for your session.</p>
      <br/>
      <p>Best regards,<br/>TheIncubator Team</p>
    `;

    await sendEmail(populated.mentor.email, mentorSubject, mentorHtml);
    await sendEmail(populated.mentee.email, menteeSubject, menteeHtml);

    res.status(201).json({
      message: 'Mentor successfully assigned to mentee and emails sent',
      match: populated,
    });
  } catch (error) {
    console.error('Manual Assignment Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin gets a single user by ID (with availability if mentor)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let availability = [];

    // Only fetch availability if user is a mentor
    if (user.role === 'mentor') {
      const availDoc = await Availability.findOne({ mentor: user._id });
      availability = availDoc?.slots || [];
    }

    res.status(200).json({ ...user.toObject(), availability });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load user with availability' });
  }
};

// Creating matched session
export const createMatchedSession = async (req, res) => {
  try {
    const { mentorId, menteeId, date, time, topic } = req.body;

    // Validate input
    if (!mentorId || !menteeId || !date || !time || !topic) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create the session
    const session = await Session.create({
      mentor: mentorId,
      mentee: menteeId,
      date,
      time,
      topic,
      status: 'accepted', // since admin is confirming
      createdByAdmin: true,
    });

    // Fetch mentor and mentee details
    const mentor = await User.findById(mentorId);
    const mentee = await User.findById(menteeId);

    // Send email to mentor
    await sendEmail(
      mentor.email,
      'New Mentorship Session Assigned',
      `<p>Hello ${mentor.name},</p>
      <p>A mentorship session has been assigned to you by TheIncubator admin:</p>
      <ul>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Topic:</strong> ${topic}</li>
        <li><strong>Mentee:</strong> ${mentee.name}</li>
      </ul>
      <p>Please log in to view the details.</p>`
    );

    // Send email to mentee
    await sendEmail(
      mentee.email,
      'New Mentorship Session Assigned',
      `<p>Hello ${mentee.name},</p>
      <p>A mentorship session has been assigned to you by TheIncubator admin:</p>
      <ul>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Topic:</strong> ${topic}</li>
        <li><strong>Mentor:</strong> ${mentor.name}</li>
      </ul>
      <p>Please log in to view the details.</p>`
    );

    res.status(201).json({ message: 'Session created and emails sent successfully', session });
  } catch (error) {
    console.error('Error creating session or sending email:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
};

