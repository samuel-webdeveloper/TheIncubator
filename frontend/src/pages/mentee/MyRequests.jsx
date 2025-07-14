/*// src/pages/mentee/MyRequests.jsx
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const MyRequests = () => {
  const { mentors } = useContext(AppContext);

  // Sample request list referencing mentors from context
  const requests = [
    {
      id: 1,
      mentorId: 0, // index of the mentor in the array
      topic: 'Frontend Development',
      date: '2025-07-05',
      status: 'Pending',
    },
    {
      id: 2,
      mentorId: 2,
      topic: 'Career Guidance',
      date: '2025-06-29',
      status: 'Accepted',
    },
  ];

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-primary">My Mentorship Requests</h1>

      <div className="grid gap-4">
        {requests.map((req) => {
          const mentor = mentors[req.mentorId];

          return (
            <div key={req.id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">{req.topic}</p>
                  <p className="text-sm text-gray-500">Mentor: {mentor?.name}</p>
                  <p className="text-sm text-gray-400">Date: {req.date}</p>
                </div>
                <p className={`text-sm font-bold ${getStatusColor(req.status)}`}>
                  {req.status}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRequests;
*/




import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';

const MyRequests = () => {
  const { mentors } = useContext(AppContext);
  const [actionRequestId, setActionRequestId] = useState(null);

  const [requests, setRequests] = useState([
    {
      id: 1,
      mentorId: 0,
      topic: 'Frontend Development',
      date: '2025-07-05',
      status: 'Pending',
    },
    {
      id: 2,
      mentorId: 2,
      topic: 'Career Guidance',
      date: '2025-06-29',
      status: 'Accepted',
    },
  ]);

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

  const handleCancel = (id) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: 'Cancelled' } : req
    );
    setRequests(updated);
    setActionRequestId(null);
  };

  const handleReschedule = (id) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, date: '2025-07-15', status: 'Rescheduled' } : req
    );
    setRequests(updated);
    setActionRequestId(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-primary">My Mentorship Requests</h1>

      <div className="grid gap-4">
        {requests.map((req) => {
          const mentor = mentors[req.mentorId];

          return (
            <div
              key={req.id}
              className="bg-white p-4 rounded-xl shadow border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">{req.topic}</p>
                  <p className="text-sm text-gray-500">Mentor: {mentor?.name}</p>
                  <p className="text-sm text-gray-400">Date: {req.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${getStatusColor(req.status)}`}>
                    {req.status}
                  </p>
                  <button
                    onClick={() =>
                      setActionRequestId(actionRequestId === req.id ? null : req.id)
                    }
                    className="text-primary underline text-sm mt-1"
                  >
                    {actionRequestId === req.id ? 'Hide Actions' : 'Manage'}
                  </button>
                </div>
              </div>

              {/* Action section */}
              {actionRequestId === req.id && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleReschedule(req.id)}
                    className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm hover:bg-blue-200"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancel(req.id)}
                    className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm hover:bg-red-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRequests;
