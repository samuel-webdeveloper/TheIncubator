import React, { useEffect, useState } from 'react';
import FeedbackModal from './FeedbackModal';
import axios from '../../axiosInstance';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const MySessions = () => {
  const [filter, setFilter] = useState('all');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  const today = new Date();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await axios.get('/api/sessions', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSessions(data || []);
      } catch (error) {
        toast.error('Failed to load sessions');
        console.error(error.response?.data || error.message);
      }
    };

    fetchSessions();
  }, []);

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const filteredSessions = sortedSessions.filter((session) => {
    const sessionDate = new Date(session.date);
    if (filter === 'upcoming') return sessionDate >= today;
    if (filter === 'past') return sessionDate < today;
    return true;
  });

  const openFeedbackModal = (session) => setSelectedSession(session);
  const closeModal = () => setSelectedSession(null);

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-2xl font-semibold text-primary mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        My Sessions
      </motion.h2>

      {/* Filter Buttons */}
      <motion.div
        className="flex gap-4 mb-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {['all', 'upcoming', 'past'].map((f) => (
          <motion.button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Session Cards */}
      {filteredSessions.length === 0 ? (
        <motion.p
          className="text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No sessions found for selected filter.
        </motion.p>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence>
            {filteredSessions.map((session) => {
              const sessionDate = new Date(session.date);
              const isPast = session.status === 'completed' || sessionDate < today;
              const hasFeedback = session.feedback && session.feedback.rating;

              return (
                <motion.div
                  key={session._id}
                  className="border border-primary rounded-lg p-4 bg-white shadow hover:shadow-md transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {session.mentor?.name || 'Mentor'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {session.mentor?.speciality || ''}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        session.status === 'Scheduled'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    📅 {session.date?.slice(0, 10)} — 🕒 {session.time}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {session.status === 'Scheduled' && sessionDate >= today && (
                      <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">
                        Join Session
                      </button>
                    )}

                    <button className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition">
                      View Details
                    </button>

                    {isPast && !hasFeedback && (
                      <button
                        onClick={() => openFeedbackModal(session)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Give Feedback
                      </button>
                    )}

                    {isPast && hasFeedback && (
                      <p className="text-green-700 text-sm mt-1">
                        ✅ Feedback submitted: {session.feedback.rating} ⭐
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Feedback Modal */}
      {selectedSession && (
        <FeedbackModal
          session={selectedSession}
          onClose={closeModal}
          onSubmitted={closeModal}
        />
      )}
    </motion.div>
  );
};

export default MySessions;
