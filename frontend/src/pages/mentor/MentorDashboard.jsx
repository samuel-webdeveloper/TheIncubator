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
  const [mentees, setMentees] = useState([]);
  const [selectedMenteeId, setSelectedMenteeId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const today = new Date();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchDashboardData = async () => {
    try {
      const requestsRes = await axios.get('/api/requests/mentor', { headers });
      const allRequests = requestsRes.data || [];

      setPendingRequests(allRequests.filter(r => r.status === 'pending').length);
      setAcceptedMentees(allRequests.filter(r => r.status === 'accepted').length);

      const sessionsRes = await axios.get('/api/sessions', { headers });
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

  const fetchMentees = async () => {
    try {
      const res = await axios.get('/api/users?role=mentee', { headers });
      setMentees(res.data || []);
    } catch (error) {
      console.error('❌ Failed to fetch mentees:', error);
      toast.error('Failed to load mentees');
    }
  };

  const handleRequestSubmit = async () => {
    if (!selectedMenteeId) {
      return toast.warning('Please select a mentee');
    }

    try {
      await axios.post(
        '/api/requests/send',
        { menteeId: selectedMenteeId },
        { headers }
      );
      toast.success('Mentorship request sent!');
      setShowForm(false);
      setSelectedMenteeId('');
      fetchDashboardData(); // Refresh dashboard stats
    } catch (error) {
      console.error('❌ Request failed:', error);
      toast.error(error.response?.data?.message || 'Request failed');
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchMentees();
  }, []);

  return (
    <motion.div className="p-6" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Header */}
      <motion.div variants={containerVariants} className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Welcome back, {user?.name || 'Mentor'}! 👋</h2>
          <p className="text-gray-600 mt-1">Here's a quick overview of your mentorship activities.</p>
        </div>
        <button
          className="mt-4 sm:mt-0 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
          onClick={() => setShowForm(true)}
        >
          Request Mentorship
        </button>
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
      <motion.div className="bg-white p-6 rounded-lg shadow" variants={containerVariants}>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Upcoming Sessions</h3>
        {upcomingSessions.length === 0 ? (
          <motion.p className="text-gray-500" variants={listVariants}>No upcoming sessions yet.</motion.p>
        ) : (
          <motion.ul className="space-y-4" initial="hidden" animate="visible">
            {upcomingSessions.slice(0, 3).map((session, i) => (
              <motion.li key={session._id} className="border p-3 rounded" variants={listVariants} custom={i}>
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

      {/* Request Mentorship Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Request Mentorship</h3>
            <select
              value={selectedMenteeId}
              onChange={(e) => setSelectedMenteeId(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">-- Select Mentee --</option>
              {mentees.map(mentee => (
                <option key={mentee._id} value={mentee._id}>{mentee.name} ({mentee.email})</option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleRequestSubmit} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">Send</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MentorDashboard;
