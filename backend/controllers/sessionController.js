import Session from '../models/Session.js';

// Mentee books a session
export const bookSession = async (req, res) => {
  try {
    const { mentor, scheduledTime } = req.body;

    const session = await Session.create({
      mentor,
      mentee: req.user.id,
      scheduledTime,
    });

    res.status(201).json({
      message: 'Session booked successfully',
      data: session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mentor or Mentee gets all their sessions
export const getMySessions = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'mentor') {
      filter.mentor = req.user.id;
    } else if (req.user.role === 'mentee') {
      filter.mentee = req.user.id;
    }

    const sessions = await Session.find(filter)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email');

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mentor updates session status
export const updateSessionStatus = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Only mentor can update
    if (session.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    session.status = req.body.status;
    await session.save();

    res.status(200).json({
      message: `Session marked as ${session.status}`,
      data: session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get session by ID
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check access
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

// Mark session complete by ID
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
