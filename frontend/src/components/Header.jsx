import React from 'react'
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="relative h-[80vh] w-full">
      {/* Background Image */}
      <img
        src={assets.cover_4}
        alt="Cover"
        className="absolute inset-0 h-full w-full object-cover z-0"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>

      {/* Text Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-outfit animate-fade-in">
          Welcome to <span className="text-primary">TheIncubator</span>
        </h1>
        <p className="text-lg md:text-xl font-light max-w-2xl mb-6 animate-fade-in-delay">
          Empowering future leaders through impactful mentorship.
        </p>
       
        {/* CTA Button */}
        <a 
          href="#available" 
          aria-label="Book a mentorship appointment"
          className="flex items-center gap-2 bg-primary px-8 py-3 rounded-full text-gray-600 font-medium text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-delay-2"
        >
          Book appointment <img className="w-3" src={assets.arrow_icon} alt="arrow icon" />
        </a>
      </div>
    </div>
  )
}

export default Header
