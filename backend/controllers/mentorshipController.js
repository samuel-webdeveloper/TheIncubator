// mentorshipController.js
import MentorshipRequest from '../models/MentorshipRequest.js';
import Session from '../models/Session.js';

// Mentee: Create a mentorship request
export const createRequest = async (req, res) => {
  try {
    const { mentorId, message, slot } = req.body;

    if (!mentorId || !message || !slot) {
      return res.status(400).json({ message: 'Mentor ID, message, and slot are required' });
    }

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
      slot,
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

    const newStatus = req.body.status;

    if (!['accepted', 'rejected'].includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    request.status = newStatus;
    await request.save();

    if (newStatus === 'accepted') {
      if (!request.slot) {
        return res.status(400).json({ message: 'No time slot provided on the request' });
      }

      const [dayPart, timePart] = request.slot.split('@').map((s) => s.trim());
      const startTime = timePart.split('-')[0].trim();

      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDayIndex = weekdays.indexOf(dayPart);
      const now = new Date();
      const diff = (targetDayIndex + 7 - now.getDay()) % 7 || 7;

      const appointmentDate = new Date(now);
      appointmentDate.setDate(now.getDate() + diff);
      const [hour, minute] = startTime.split(':').map(Number);
      appointmentDate.setHours(hour, minute, 0, 0);

      const session = await Session.create({
        mentor: request.mentor,
        mentee: request.mentee,
        date: appointmentDate.toISOString(),
        time: startTime,
      });

      return res.status(200).json({
        message: 'Request accepted and session created ✅',
        request,
        session,
      });
    }

    res.status(200).json({ message: `Request ${newStatus}`, request });
  } catch (error) {
    console.error('❌ updateRequestStatus error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Mentee: Cancel a mentorship request and mark session as cancelled
export const deleteRequest = async (req, res) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id);

    if (!request || request.mentee.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Request not found or unauthorized' });
    }

    request.status = 'cancelled';
    await request.save();

    if (request.status === 'accepted' && request.slot) {
      const [dayPart, timePart] = request.slot.split('@').map((s) => s.trim());
      const startTime = timePart.split('-')[0].trim();

      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDayIndex = weekdays.indexOf(dayPart);
      const now = new Date();
      const diff = (targetDayIndex + 7 - now.getDay()) % 7 || 7;

      const sessionDate = new Date(now);
      sessionDate.setDate(now.getDate() + diff);
      const [hour, minute] = startTime.split(':').map(Number);
      sessionDate.setHours(hour, minute, 0, 0);

      const session = await Session.findOne({
        mentor: request.mentor,
        mentee: request.mentee,
        time: startTime,
      });

      if (session) {
        session.status = 'Cancelled';
        await session.save();
      }
    }

    res.status(200).json({ message: 'Request cancelled successfully' });
  } catch (error) {
    console.error('❌ deleteRequest error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

