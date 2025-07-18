import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from '../../axiosInstance';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const MentorDetail = () => {
  const { id } = useParams();
  const { mentors } = useContext(AppContext);
  const navigate = useNavigate();

  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState({ day: '', start: '', end: '' });
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  const [feedback, setFeedback] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [showAllFeedback, setShowAllFeedback] = useState(false);

  const mentor = mentors.find((m) => m._id === id);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data } = await axios.get(`/api/availability/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const slots = Array.isArray(data?.slots) ? data.slots : [];
        setAvailability(slots);

        if (slots.length === 0) {
          toast.info('This mentor has not set any availability yet.');
        }
      } catch (error) {
        toast.dismiss('availability-error');
        toast.error('Unable to load availability. Please try again later.', {
          toastId: 'availability-error',
        });
        setAvailability([]);
      } finally {
        setLoadingAvailability(false);
      }
    };

    if (id) fetchAvailability();
  }, [id]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data } = await axios.get(`/api/feedback/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFeedback(data);
      } catch (error) {
        console.error('Feedback fetch error:', error.response?.data || error.message);
      } finally {
        setLoadingFeedback(false);
      }
    };

    if (id) fetchFeedback();
  }, [id]);

  const handleRequest = async () => {
    if (!selectedSlot.day || !selectedSlot.start) {
      return toast.error('Please select a day and time slot');
    }

    try {
      const slotString = `${selectedSlot.day} @ ${selectedSlot.start} - ${selectedSlot.end}`;
      const message = `Requesting session for ${slotString}`;

      await axios.post(
        '/api/requests',
        { mentorId: id, message, slot: slotString },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      toast.success('Mentorship request sent successfully');
    } catch (error) {
      toast.error('Failed to send mentorship request');
    }
  };

  if (!mentor) {
    return <p className="text-center text-red-600 mt-10">Mentor not found.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto px-4 py-10"
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row gap-8 bg-white shadow-lg rounded-lg p-6"
      >
        <motion.img
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          src={mentor.image || '/default-avatar.png'}
          alt={mentor.name}
          className="w-full md:w-72 h-72 object-cover rounded-lg"
        />

        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold text-primary">{mentor.name}</h2>
          <p className="text-gray-600">{mentor.specialty || 'Specialty not provided'}</p>
          <p className="text-sm text-gray-500">Experience: {mentor.experience || 'N/A'}</p>
          <p className="text-sm text-gray-500">Address: {mentor.address || 'Not provided'}</p>

          {mentor.bio && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-1">About</h4>
              <p className="text-gray-700">{mentor.bio}</p>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-2 mt-4">Available Slots:</h4>
            {loadingAvailability ? (
              <p className="text-sm text-gray-500">Loading availability...</p>
            ) : availability.length === 0 ? (
              <p className="text-sm text-gray-500">No slots available.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availability.map((slot) =>
                  slot.times.map((time, idx) => {
                    const isSelected =
                      selectedSlot.day === slot.day && selectedSlot.start === time.start;

                    return (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        key={`${slot.day}-${idx}`}
                        onClick={() =>
                          setSelectedSlot({ day: slot.day, start: time.start, end: time.end })
                        }
                        className={`px-3 py-1 rounded-full text-sm border transition-all ${
                          isSelected
                            ? 'bg-primary text-white border-primary'
                            : 'bg-gray-100 text-gray-700 hover:bg-primary hover:text-white hover:border-primary'
                        }`}
                      >
                        {slot.day} @ {time.start} - {time.end}
                      </motion.button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleRequest}
              disabled={!selectedSlot.day || !selectedSlot.start}
              className={`px-6 py-2 rounded text-white transition-all ${
                !selectedSlot.day || !selectedSlot.start
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              Send Mentorship Request
            </motion.button>

            <button onClick={() => navigate(-1)} className="text-sm text-gray-500 underline">
              ← Go Back
            </button>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-2">Mentee Feedback</h4>
            {loadingFeedback ? (
              <p className="text-sm text-gray-500">Loading feedback...</p>
            ) : feedback.length === 0 ? (
              <p className="text-sm text-gray-500">No feedback yet</p>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                className="space-y-4"
              >
                {(showAllFeedback ? feedback : feedback.slice(0, 3)).map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 p-4 rounded-md shadow-sm border"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-primary">{item.from.name}</p>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={i < item.rating ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {item.comment && (
                      <p className="text-sm mt-2 text-gray-700">{item.comment}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Session on {new Date(item.session?.date).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}

                {feedback.length > 3 && (
                  <button
                    onClick={() => setShowAllFeedback((prev) => !prev)}
                    className="mt-2 text-sm text-blue-600 underline hover:text-blue-800"
                  >
                    {showAllFeedback ? 'Show Less' : 'Show All Feedback'}
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MentorDetail;
