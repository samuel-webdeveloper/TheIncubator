// src/pages/mentee/MenteeDashboard.jsx
import React from 'react';

const MenteeDashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-primary">Welcome Back 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md p-6 rounded-xl border border-gray-100">
          <p className="text-gray-600 text-sm">Upcoming Sessions</p>
          <p className="text-2xl font-bold text-primary">2</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-xl border border-gray-100">
          <p className="text-gray-600 text-sm">Mentorship Requests</p>
          <p className="text-2xl font-bold text-primary">1</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-xl border border-gray-100">
          <p className="text-gray-600 text-sm">Completed Sessions</p>
          <p className="text-2xl font-bold text-primary">5</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90">
            Book a Mentor
          </button>
          <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
            View Requests
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenteeDashboard;
