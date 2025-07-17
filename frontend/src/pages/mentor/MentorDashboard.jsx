import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from '../../axiosInstance';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.2 }
  })
};

const listVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const MentorDashboard = () => {
  const { user } = useContext(AppContext);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [acceptedMentees, setAcceptedMentees] = useState(0);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const today = new Date();

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const requestsRes = await axios.get('/api/requests/mentor', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allRequests = requestsRes.data || [];
      setPendingRequests(allRequests.filter(r => r.status === 'pending').length);
      setAcceptedMentees(allRequests.filter(r => r.status === 'accepted').length);

      const sessionsRes = await axios.get('/api/sessions', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sessions = sessionsRes.data || [];
      const upcoming = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return session.status === 'scheduled' && sessionDate >= today;
      });

      upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
      setUpcomingSessions(upcoming);
    } catch (error) {
      console.error('❌ Dashboard fetch error:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <motion.div
      className="p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={containerVariants} className="mb-6">
        <h2 className="text-2xl font-bold text-primary">
          Welcome back, {user?.name || 'Mentor'}! 👋
        </h2>
        <p className="text-gray-600 mt-1">
          Here's a quick overview of your mentorship activities.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[{
          title: 'Pending Requests',
          count: pendingRequests,
          color: 'text-primary'
        }, {
          title: 'Accepted Mentees',
          count: acceptedMentees,
          color: 'text-green-600'
        }, {
          title: 'Upcoming Sessions',
          count: upcomingSessions.length,
          color: 'text-blue-500'
        }].map((card, i) => (
          <motion.div
            key={card.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all"
          >
            <h3 className="text-gray-700 font-semibold text-lg mb-1">{card.title}</h3>
            <p className={`text-2xl font-bold ${card.color}`}>{card.count}</p>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Sessions */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow"
        variants={containerVariants}
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Upcoming Sessions</h3>
        {upcomingSessions.length === 0 ? (
          <motion.p className="text-gray-500" variants={listVariants}>
            No upcoming sessions yet.
          </motion.p>
        ) : (
          <motion.ul className="space-y-4" initial="hidden" animate="visible">
            {upcomingSessions.slice(0, 3).map((session, i) => (
              <motion.li
                key={session._id}
                className="border p-3 rounded"
                variants={listVariants}
                custom={i}
              >
                <p className="text-sm text-gray-700">
                  <strong>Mentee:</strong> {session.mentee?.name || 'Unknown'} <br />
                  <strong>Email:</strong> {session.mentee?.email} <br />
                  <strong>Date:</strong> {session.date?.split('T')[0]} <br />
                  <strong>Time:</strong> {session.time}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MentorDashboard;
