import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../axiosInstance';

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await axios.get('/api/admin/sessions', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSessions(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load sessions');
      }
    };

    fetchSessions();
  }, []);

  const markCompleted = async (id) => {
    try {
      await axios.put(
        `/api/sessions/${id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSessions((prev) =>
        prev.map((session) =>
          session._id === id ? { ...session, status: 'Completed' } : session
        )
      );
      toast.success('Session marked as completed ✅');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update session status');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">All Mentorship Sessions</h2>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-left text-sm text-gray-600 uppercase">
            <tr>
              <th className="p-4">Mentor</th>
              <th className="p-4">Mentee</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session._id} className="border-t text-sm">
                <td className="p-4">{session.mentor?.name || '—'}</td>
                <td className="p-4">{session.mentee?.name || '—'}</td>
                <td className="p-4">{new Date(session.date).toLocaleDateString()}</td>
                <td className="p-4">{session.time || '—'}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      session.status === 'Completed'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {session.status}
                  </span>
                </td>
                <td className="p-4">
                  {session.status !== 'Completed' && (
                    <button
                      onClick={() => markCompleted(session._id)}
                      className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark text-xs"
                    >
                      Mark as Done
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No sessions available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSessions;
