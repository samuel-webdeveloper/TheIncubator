import MentorshipRequest from '../models/MentorshipRequest.js';

// Mentee: Create a mentorship request
export const createRequest = async (req, res) => {
  try {
    const { mentorId, message } = req.body;

    // Validate input
    if (!mentorId || !message) {
      return res.status(400).json({ message: 'Mentor ID and message are required' });
    }

    // Prevent duplicate pending request
    const existing = await MentorshipRequest.findOne({
      mentor: mentorId,
      mentee: req.user.id,
      status: 'pending',
    });

    if (existing) {
      return res.status(400).json({ message: 'You already have a pending request with this mentor' });
    }

    const newRequest = await MentorshipRequest.create({
      mentee: req.user.id,
      mentor: mentorId,
      message,
    });

    res.status(201).json({ message: 'Request sent successfully', data: newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mentor: View all requests addressed to them
export const getRequestsForMentor = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ mentor: req.user.id }).populate('mentee', 'name email');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mentee: View all requests sent
export const getRequestsByMentee = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ mentee: req.user.id }).populate('mentor', 'name email');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mentor: Accept or reject request
export const updateRequestStatus = async (req, res) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id);

    if (!request || request.mentor.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Request not found or unauthorized' });
    }

    request.status = req.body.status;
    await request.save();

    res.status(200).json({ message: `Request ${request.status}`, data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
