/*
// src/layouts/MentorLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Reuse if role-based
import Footer from '../components/Footer';
// You can add a sidebar or mentor-specific navbar here if desired

const MentorLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MentorLayout;
*/




import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MentorLayout = () => {
  useEffect(() => {
    console.log("✅ MentorLayout rendered");
  }, []);

  return (
    <div>
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MentorLayout;
