import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MentorLayout = () => {
  useEffect(() => {
    console.log("MentorLayout rendered");
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
