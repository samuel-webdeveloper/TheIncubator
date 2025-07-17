import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from '../../axiosInstance';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const MyRequests = () => {
  const { mentors } = useContext(AppContext);
  const [requests, setRequests] = useState([]);
  const [actionRequestId, setActionRequestId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get('/api/requests/mentee', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setRequests(data);
      } catch (error) {
        toast.error('Failed to load mentorship requests');
        console.error(error.response?.data || error.message);
      }
    };

    fetchRequests();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-500';
      case 'accepted':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-600';
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.delete(`/api/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setRequests((prev) => prev.filter((r) => r._id !== id));
      toast.success('Request cancelled successfully');
      setActionRequestId(null);
    } catch (error) {
      console.error('Cancel error:', error.response?.data || error.message);
      toast.error('Failed to cancel request');
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-semibold text-primary">My Mentorship Requests</h1>

      <div className="grid gap-4">
        {requests.map((req, index) => {
          const mentor = mentors.find((m) => m._id === req.mentor?._id);

          return (
            <motion.div
              key={req._id}
              className="bg-white p-4 rounded-xl shadow border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">{req.message}</p>
                  <p className="text-sm text-gray-500">Mentor: {mentor?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-400">Requested Slot: {req.slot}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${getStatusColor(req.status)}`}>
                    {req.status}
                  </p>
                  <button
                    onClick={() =>
                      setActionRequestId(actionRequestId === req._id ? null : req._id)
                    }
                    className="text-primary underline text-sm mt-1"
                  >
                    {actionRequestId === req._id ? 'Hide Actions' : 'Manage'}
                  </button>
                </div>
              </div>

              {actionRequestId === req._id && (
                <motion.div
                  className="mt-3 flex gap-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => handleCancel(req._id)}
                    className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm hover:bg-red-200"
                  >
                    Cancel Request
                  </button>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MyRequests;
