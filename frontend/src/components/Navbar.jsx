import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import {
  assets,
  commonMenuLinks,
  menteeMenuLinks,
  mentorMenuLinks,
  adminMenuLinks
} from '../assets/assets';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  // Decide menu based on logged-in user role
  let menuLinks = commonMenuLinks;

  if (user?.role === 'mentee') {
    menuLinks = menteeMenuLinks;
  } else if (user?.role === 'mentor') {
    menuLinks = mentorMenuLinks;
  } else if (user?.role === 'admin') {
    menuLinks = adminMenuLinks;
  }

  return (
    <div className="bg-primary flex items-center justify-between text-sm py-4 px-6 md:px-16 lg:px-24 xl:px-32 relative transition-all overflow-x-hidden">
      <Link to="/">
        <img
          className="w-12 rounded-full cursor-pointer ml-5"
          src={assets.logo_1}
          alt="Logo"
        />
      </Link>

      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 text-white transition-all duration-300 z-50 ${
          open ? 'max-sm:translate-x-0' : 'max-sm:translate-x-full'
        }`}
      >
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.name}
          </Link>
        ))}

        {/* Show Login only if user not logged in */}
        {!user ? (
  <Link to="/login">
    <button className="cursor-pointer px-8 py-2 bg-white hover:bg-gray-500 transition-all text-primary rounded-lg">
      Login
    </button>
  </Link>
) : (
  <button
    onClick={() => {
      logout();
      toast.success('Logged out successfully 👋');
      navigate('/');
    }}
    className="cursor-pointer px-8 py-2 bg-white hover:bg-red-400 transition-all text-primary rounded-lg"
  >
    Logout
  </button>
)}
      </div>

      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <img
          src={open ? assets.cross_icon : assets.menu_icon}
          alt="menu toggle"
        />
      </button>
    </div>
  );
};

export default Navbar;
