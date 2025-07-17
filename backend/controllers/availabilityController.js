import Availability from '../models/Availability.js';

// ✅ Create or update mentor availability
export const setAvailability = async (req, res) => {
  const mentorId = req.user.id;

  try {
    const existing = await Availability.findOne({ mentor: mentorId });

    if (existing) {
      existing.slots = req.body.slots;
      await existing.save();
      return res.status(200).json({ message: 'Availability updated', data: existing });
    }

    const newAvailability = await Availability.create({
      mentor: mentorId,
      slots: req.body.slots,
    });

    res.status(201).json({ message: 'Availability created', data: newAvailability });
  } catch (error) {
    res.status(500).json({ message: 'Failed to set availability', error: error.message });
  }
};

// ✅ Get availability for logged-in mentor
export const getMyAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne({ mentor: req.user.id });

    if (!availability) {
      return res.status(404).json({ message: 'No availability found' });
    }

    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get availability', error: error.message });
  }
};

// ✅ Get availability by mentor ID (for mentees viewing mentor detail)
export const getAvailabilityByMentorId = async (req, res) => {
  try {
    const availability = await Availability.findOne({ mentor: req.params.mentorId });

    if (!availability) {
      
      return res.status(200).json({ slots: [] });
    }

    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Update mentor availability
export const updateAvailability = async (req, res) => {
  const mentorId = req.user.id;
  const incomingSlots = req.body.slots;

  try {
    if (!Array.isArray(incomingSlots)) {
      return res.status(400).json({ message: 'Slots must be an array' });
    }

    // Validate format
    for (const slot of incomingSlots) {
      if (!slot.day || !Array.isArray(slot.times)) {
        return res.status(400).json({ message: 'Each slot must include a day and times array' });
      }

      for (const time of slot.times) {
        if (!time.start || !time.end) {
          return res.status(400).json({ message: 'Each time must include start and end' });
        }
      }
    }

    let updated = await Availability.findOneAndUpdate(
      { mentor: mentorId },
      { slots: incomingSlots },
      { new: true, runValidators: true }
    );

    if (!updated) {
      updated = await Availability.create({
        mentor: mentorId,
        slots: incomingSlots,
      });
    }

    res.status(200).json({ message: 'Availability updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update availability', error: error.message });
  }
};

// ✅ Delete mentor's availability
export const deleteAvailability = async (req, res) => {
  try {
    const deleted = await Availability.findOneAndDelete({ mentor: req.user.id });

    if (!deleted) {
      return res.status(404).json({ message: 'No availability found to delete' });
    }

    res.status(200).json({ message: 'Availability deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete availability', error: error.message });
  }
};
