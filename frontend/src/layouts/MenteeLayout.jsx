// src/layouts/MenteeLayout.jsx
import React from 'react'
import Navbar from '../components/Navbar'; 
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'

const MenteeLayout = () => {
  return (
    <>
      <Navbar />
      <div className="pt-20 px-5">
        <Outlet /> {/* This is where the current mentee page will show */}
      </div>
      <Footer />
    </>
  )
}

export default MenteeLayout
