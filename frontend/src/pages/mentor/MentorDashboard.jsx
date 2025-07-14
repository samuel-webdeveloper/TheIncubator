/*
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const MentorDashboard = () => {
  const { user } = useContext(AppContext);

  useEffect(() => {
    console.log("📘 MentorDashboard rendered");
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">
          Welcome back, {user?.name || 'Mentor'}! 👋
        </h2>
        <p className="text-gray-600 mt-1">
          Here's a quick overview of your mentorship activities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all">
          <h3 className="text-gray-700 font-semibold text-lg mb-1">Pending Requests</h3>
          <p className="text-2xl font-bold text-primary">5</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all">
          <h3 className="text-gray-700 font-semibold text-lg mb-1">Accepted Mentees</h3>
          <p className="text-2xl font-bold text-green-600">2</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all">
          <h3 className="text-gray-700 font-semibold text-lg mb-1">Upcoming Sessions</h3>
          <p className="text-2xl font-bold text-blue-500">3</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Upcoming Sessions</h3>
        <p className="text-gray-500">This section will display upcoming sessions when integrated with backend.</p>
      </div>
    </div>
  );
};

export default MentorDashboard;
*/





import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from '../../axiosInstance';
import { toast } from 'react-toastify';

const MentorDashboard = () => {
  const { user } = useContext(AppContext);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [acceptedMentees, setAcceptedMentees] = useState(0);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  const today = new Date();

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      // 1. Fetch mentorship requests
      const requestsRes = await axios.get('/api/requests/mentor', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allRequests = requestsRes.data || [];

      setPendingRequests(allRequests.filter(r => r.status === 'pending').length);
      setAcceptedMentees(allRequests.filter(r => r.status === 'accepted').length);

      // 2. Fetch sessions
      const sessionsRes = await axios.get('/api/sessions', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sessions = sessionsRes.data || [];

      const upcoming = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return session.status === 'scheduled' && sessionDate >= today;
      });

      // Sort sessions by date
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
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">
          Welcome back, {user?.name || 'Mentor'}! 👋
        </h2>
        <p className="text-gray-600 mt-1">
          Here's a quick overview of your mentorship activities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all">
          <h3 className="text-gray-700 font-semibold text-lg mb-1">Pending Requests</h3>
          <p className="text-2xl font-bold text-primary">{pendingRequests}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all">
          <h3 className="text-gray-700 font-semibold text-lg mb-1">Accepted Mentees</h3>
          <p className="text-2xl font-bold text-green-600">{acceptedMentees}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all">
          <h3 className="text-gray-700 font-semibold text-lg mb-1">Upcoming Sessions</h3>
          <p className="text-2xl font-bold text-blue-500">{upcomingSessions.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Upcoming Sessions</h3>
        {upcomingSessions.length === 0 ? (
          <p className="text-gray-500">No upcoming sessions yet.</p>
        ) : (
          <ul className="space-y-4">
            {upcomingSessions.slice(0, 3).map((session) => (
              <li key={session._id} className="border p-3 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Mentee:</strong> {session.mentee?.name || 'Unknown'} <br />
                  <strong>Email:</strong> {session.mentee?.email} <br />
                  <strong>Date:</strong> {session.date?.split('T')[0]} <br />
                  <strong>Time:</strong> {session.time}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
