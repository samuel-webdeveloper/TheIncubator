// sessionController.js
import Session from '../models/Session.js';
import Mentor from '../models/mentorModel.js';
import User from '../models/User.js';
import sendEmail from '../config/sendEmail.js';

// Mentee books a session
export const bookSession = async (req, res) => {
  try {
    const { mentor, date, time } = req.body;

    if (!mentor || !date || !time) {
      return res.status(400).json({ message: 'Mentor, date, and time are required' });
    }

    const session = await Session.create({
      mentor,
      mentee: req.user.id,
      date,
      time,
    });

    // Get mentor email
    const mentorData = await Mentor.findById(mentor);
    if (mentorData?.email) {
      const formattedDate = new Date(date).toDateString();
      const subject = 'New Session Booking Request';
      const html = `
        <p>Hello ${mentorData.name},</p>
        <p>You have a new session request from <strong>${req.user.name}</strong>.</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p>Please log in to your dashboard to accept or decline the session.</p>
        <br />
        <p>Best regards,<br/>TheIncubator Team</p>
      `;
      await sendEmail(mentorData.email, subject, html);
    }

    res.status(201).json({
      message: 'Session booked successfully',
      data: session,
    });
  } catch (error) {
    console.error('Booking Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Admin creates a session manually (e.g. from AdminMatches.jsx)
export const adminCreateSession = async (req, res) => {
  try {
    const { mentor, mentee, date, time } = req.body;

    if (!mentor || !mentee || !date || !time) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const session = await Session.create({
      mentor,
      mentee,
      date,
      time,
      status: 'Accepted',
    });

    // Fetch mentor and mentee data
    const mentorData = await Mentor.findById(mentor);
    const menteeData = await User.findById(mentee);

    const formattedDate = new Date(date).toDateString();

    if (mentorData?.email) {
      const subject = 'New Session Created';
      const html = `
        <p>Hello ${mentorData.name},</p>
        <p>A session has been scheduled for you with <strong>${menteeData?.name}</strong>.</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${time}</p>
        <br />
        <p>Best regards,<br/>TheIncubator Team</p>
      `;
      await sendEmail(mentorData.email, subject, html);
    }

    if (menteeData?.email) {
      const subject = 'Your Session Has Been Scheduled';
      const html = `
        <p>Hello ${menteeData.name},</p>
        <p>A session has been scheduled for you with <strong>${mentorData?.name}</strong>.</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${time}</p>
        <br />
        <p>Best regards,<br/>TheIncubator Team</p>
      `;
      await sendEmail(menteeData.email, subject, html);
    }

    res.status(201).json({ message: 'Session created and emails sent', session });
  } catch (error) {
    console.error('Admin Session Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get sessions for mentor or mentee
export const getMySessions = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'mentor') filter.mentor = req.user.id;
    else if (req.user.role === 'mentee') filter.mentee = req.user.id;

    filter.status = { $ne: 'Cancelled' };

    const sessions = await Session.find(filter)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email');

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mentor updates session status (accept/decline)
export const updateSessionStatus = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('mentee', 'name email')
      .populate('mentor', 'name email');

    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.mentor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    session.status = req.body.status;
    await session.save();

    // Notify mentee when accepted
    if (session.status === 'Accepted' && session.mentee.email) {
      const formattedDate = new Date(session.date).toDateString();
      const subject = 'Your Session Has Been Accepted';
      const html = `
        <p>Hello ${session.mentee.name},</p>
        <p>Your session with <strong>${session.mentor.name}</strong> has been accepted.</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${session.time}</p>
        <br />
        <p>Best of luck with your session!<br/>TheIncubator Team</p>
      `;
      await sendEmail(session.mentee.email, subject, html);
    }

    res.status(200).json({
      message: `Session marked as ${session.status}`,
      data: session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get session details
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email');

    if (!session) return res.status(404).json({ message: 'Session not found' });

    const isMentor = session.mentor._id.toString() === req.user.id;
    const isMentee = session.mentee._id.toString() === req.user.id;

    if (req.user.role !== 'admin' && !isMentor && !isMentee) {
      return res.status(403).json({ message: 'Not authorized to view this session' });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark session as complete
export const markSessionComplete = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.status = 'Completed';
    await session.save();

    res.status(200).json({ message: 'Session marked as completed', session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit feedback
export const submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment || comment.trim().length < 3) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.mentee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to give feedback for this session' });
    }

    session.feedback = { rating, comment };
    await session.save();

    res.status(200).json({ message: 'Feedback submitted successfully', session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
