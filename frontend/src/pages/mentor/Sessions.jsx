import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../axiosInstance';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1 }
  })
};

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');
  const [selectedDate, setSelectedDate] = useState('');

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
        console.error('Fetch error:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const today = new Date();

  const filteredSessions = sessions
    .filter((session) => {
      const sessionDate = new Date(session.date);
      if (filter === 'upcoming') {
        return sessionDate >= today && session.status === 'scheduled';
      } else {
        return sessionDate < today || session.status !== 'scheduled';
      }
    })
    .filter((session) => {
      return selectedDate ? session.date.slice(0, 10) === selectedDate : true;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const updateSessionStatus = async (id, status) => {
    try {
      await axios.put(
        `/api/sessions/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSessions((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status } : s))
      );
      toast.success(
        status === 'completed' ? '✅ Session completed' : '❌ Session cancelled'
      );
    } catch (error) {
      toast.error('Failed to update session status');
      console.error('Update error:', error.response?.data || error.message);
    }
  };

  return (
    <motion.div
      className="p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-2xl font-bold text-primary mb-6">Your Sessions</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-full ${
              filter === 'upcoming' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-full ${
              filter === 'past' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Past
          </button>
        </div>

        <div className="ml-auto">
          <label className="text-sm font-medium text-gray-600 mr-2">Filter by Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Session List */}
      {loading ? (
        <motion.p className="text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Loading sessions...
        </motion.p>
      ) : filteredSessions.length === 0 ? (
        <motion.p className="text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          No {filter} sessions found.
        </motion.p>
      ) : (
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {filteredSessions.map((session, i) => (
            <motion.div
              key={session._id}
              className="bg-white shadow-md p-4 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-4"
              variants={cardVariants}
              custom={i}
            >
              <div>
                <h3 className="font-semibold text-lg">{session.mentee?.name || 'Unnamed Mentee'}</h3>
                <p className="text-sm text-gray-600">{session.mentee?.email}</p>
                <p className="text-sm mt-1">
                  <strong>Date:</strong> {session.date?.slice(0, 10)} <br />
                  <strong>Time:</strong> {session.time}
                </p>
              </div>

              <div className="flex flex-col md:items-end gap-2">
                <span
                  className={`px-3 py-1 rounded text-xs font-medium w-fit ${
                    session.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : session.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </span>

                {session.status === 'scheduled' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateSessionStatus(session._id, 'completed')}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => updateSessionStatus(session._id, 'cancelled')}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sessions;
