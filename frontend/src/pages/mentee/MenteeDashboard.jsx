// src/pages/mentee/MenteeDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const MenteeDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    requests: 0,
  });

  const [loading, setLoading] = useState(true);
  const [nextSession, setNextSession] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('token');

        const [sessionsRes, requestsRes] = await Promise.all([
          axios.get('/api/sessions', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/api/requests/mentee', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const sessions = sessionsRes.data;
        const requests = requestsRes.data;

        const upcomingSessions = sessions
          .filter((s) => s.status === 'accepted' && new Date(s.date) > new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        const upcoming = upcomingSessions.length;
        const completed = sessions.filter((s) => s.status === 'completed').length;

        setStats({
          upcoming,
          completed,
          requests: requests.length,
        });

        if (upcomingSessions.length > 0) {
          setNextSession(upcomingSessions[0]);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error.response?.data || error.message);
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1
        className="text-2xl font-semibold text-primary"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Welcome Back 👋
      </motion.h1>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {['upcoming', 'requests', 'completed'].map((key, i) => (
          <motion.div
            key={key}
            className="bg-white shadow-md p-6 rounded-xl border border-gray-100"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-gray-600 text-sm capitalize">
              {key === 'upcoming' ? 'Upcoming Sessions' :
               key === 'requests' ? 'Mentorship Requests' :
               'Completed Sessions'}
            </p>
            <p className="text-2xl font-bold text-primary">
              {loading ? '...' : stats[key]}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Next Session */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Next Upcoming Session</h2>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          {loading ? (
            <p className="text-sm text-gray-500">Loading session...</p>
          ) : nextSession ? (
            <div>
              <p className="text-gray-700 font-medium">
                With <span className="text-primary">{nextSession.mentor?.name || 'Mentor'}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(nextSession.date).toLocaleDateString()} at{' '}
                {new Date(nextSession.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No upcoming sessions scheduled yet.</p>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mentee/dashboard/mentors')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
          >
            Book a Mentor
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mentee/dashboard/my-requests')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            View Requests
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MenteeDashboard;
