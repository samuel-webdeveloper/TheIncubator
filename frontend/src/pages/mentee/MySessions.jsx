import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal'; // ✅ Adjust path if needed
const MySessions = () => {
  const [filter, setFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null); // ✅ For modal control

  const today = new Date();

  // 🧪 Add mock "feedback" field for demo
  const sessions = [
    {
      id: 1,
      mentorName: 'Mr. Oluwole Olajide',
      speciality: 'AI/Machine learning',
      date: '2025-07-10',
      time: '3:00 PM',
      status: 'Scheduled',
      feedback: null,
    },
    {
      id: 2,
      mentorName: 'Mrs. Loveth Imoniokena',
      speciality: 'Content & copy writing',
      date: '2025-06-28',
      time: '11:00 AM',
      status: 'Completed',
      feedback: { rating: 5, comment: 'Very helpful!' },
    },
    {
      id: 3,
      mentorName: 'Mr. Amos Feranmi',
      speciality: 'Digital marketing',
      date: '2025-07-01',
      time: '2:00 PM',
      status: 'Completed',
      feedback: null,
    },
  ];

  const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredSessions = sortedSessions.filter((session) => {
    const sessionDate = new Date(session.date);
    if (filter === 'upcoming') return sessionDate >= today;
    if (filter === 'past') return sessionDate < today;
    return true;
  });

  const openFeedbackModal = (session) => {
    setSelectedSession(session);
  };

  const closeModal = () => {
    setSelectedSession(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-primary mb-6">My Sessions</h2>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        {['all', 'upcoming', 'past'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded ${
              filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Session Cards */}
      {filteredSessions.length === 0 ? (
        <p className="text-gray-500">No sessions found for selected filter.</p>
      ) : (
        <div className="grid gap-6">
          {filteredSessions.map((session) => {
            const isPast = new Date(session.date) < today;
            const hasFeedback = session.feedback && session.feedback.rating;

            return (
              <div
                key={session.id}
                className="border border-primary rounded-lg p-4 bg-white shadow hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{session.mentorName}</p>
                    <p className="text-sm text-gray-500">{session.speciality}</p>
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
                  📅 {session.date} — 🕒 {session.time}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {session.status === 'Scheduled' && new Date(session.date) >= today && (
                    <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">
                      Join Session
                    </button>
                  )}

                  <button className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition">
                    View Details
                  </button>

                  {/* ✅ Feedback Button */}
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
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Feedback Modal */}
      {selectedSession && (
        <FeedbackModal
          session={selectedSession}
          onClose={closeModal}
          onSubmitted={closeModal}
        />
      )}
    </div>
  );
};

export default MySessions;
