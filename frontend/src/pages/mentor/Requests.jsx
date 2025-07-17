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

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get('/api/requests/mentor', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRequests(data || []);
      setFiltered(data || []);
    } catch (error) {
      toast.error('Failed to load mentorship requests');
      console.error('❌ Fetch error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    let result = [...requests];

    if (filterStatus !== 'all') {
      result = result.filter((r) => r.status === filterStatus);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFiltered(result);
  }, [filterStatus, sortOrder, requests]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `/api/requests/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const updated = requests.map((req) =>
        req._id === id ? { ...req, status: newStatus } : req
      );
      setRequests(updated);
      toast.success(`Request ${newStatus === 'accepted' ? 'accepted' : 'declined'} ✅`);
    } catch (error) {
      toast.error('Failed to update request');
      console.error('❌ Update error:', error.response?.data || error.message);
    }
  };

  return (
    <motion.div
      className="p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-2xl font-bold text-primary mb-4">Mentorship Requests</h2>

      {/* Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div>
          <label className="text-sm font-medium mr-2">Filter by status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mr-2">Sort by date:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <motion.p className="text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Loading...
        </motion.p>
      ) : filtered.length === 0 ? (
        <motion.p className="text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          No mentorship requests matching this filter.
        </motion.p>
      ) : (
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {filtered.map((req, i) => (
            <motion.div
              key={req._id}
              className="bg-white shadow-md p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              variants={cardVariants}
              custom={i}
            >
              <div>
                <h3 className="font-semibold text-lg">{req.mentee?.name || 'Unnamed Mentee'}</h3>
                <p className="text-sm text-gray-600">{req.mentee?.email}</p>
                <p className="text-sm text-gray-700 mt-1">
                  <strong>Requested Slot:</strong> {req.slot || '—'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Submitted: {new Date(req.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                {req.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => updateStatus(req._id, 'accepted')}
                      className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(req._id, 'declined')}
                      className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      req.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Requests;
