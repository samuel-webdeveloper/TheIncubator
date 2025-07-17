// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* Shared or Admin-specific navbar */}
      <main className="p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
