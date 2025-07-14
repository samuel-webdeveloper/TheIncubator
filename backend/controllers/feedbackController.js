import Feedback from '../models/Feedback.js';
import Session from '../models/Session.js';

// Create Feedback
export const createFeedback = async (req, res) => {
  try {
    const { sessionId, to, rating, comment } = req.body;

    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Prevent duplicate feedback
    const existing = await Feedback.findOne({ session: sessionId, from: req.user._id });
    if (existing) return res.status(400).json({ message: 'Feedback already submitted' });

    const feedback = await Feedback.create({
      session: sessionId,
      from: req.user._id,
      to,
      rating,
      comment,
    });

    res.status(201).json({ message: 'Feedback submitted', data: feedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all feedback for a user
export const getFeedbackForUser = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ to: req.params.userId })
      .populate('from', 'name email')
      .populate('session', 'date time');
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
