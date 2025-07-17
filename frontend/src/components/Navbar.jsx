import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  assets,
  commonMenuLinks,
  menteeMenuLinks,
  mentorMenuLinks,
  adminMenuLinks
} from '../assets/assets';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  let menuLinks = commonMenuLinks;
  if (user?.role === 'mentee') menuLinks = menteeMenuLinks;
  else if (user?.role === 'mentor') menuLinks = mentorMenuLinks;
  else if (user?.role === 'admin') menuLinks = adminMenuLinks;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {showNavbar && (
        <motion.div
          key="navbar"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="bg-primary text-white fixed top-0 left-0 w-full z-50 shadow-md"
        >
          <div className="flex items-center justify-between text-sm py-4 px-6 md:px-16 lg:px-24 xl:px-32">
            {/* Logo */}
            <Link to="/">
              <motion.img
                className="w-12 rounded-full cursor-pointer ml-2 sm:ml-5"
                src={assets.logo_1}
                alt="Logo"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
              {menuLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link to={link.path} className="hover:underline">
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {!user ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/login">
                    <button className="cursor-pointer px-6 py-2 bg-white text-primary rounded-lg hover:bg-gray-300 transition-all">
                      Login
                    </button>
                  </Link>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => {
                    logout();
                    toast.success('Logged out successfully 👋');
                    navigate('/');
                  }}
                  className="cursor-pointer px-6 py-2 bg-white text-primary rounded-lg hover:bg-red-400 transition-all"
                >
                  Logout
                </motion.button>
              )}
            </div>

            {/* Mobile Slide-Out Menu */}
            <AnimatePresence>
              {open && (
                <motion.div
                  key="mobileMenu"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="sm:hidden fixed top-0 right-0 h-auto min-h-[200px] w-2/3 max-w-xs bg-primary z-40 flex flex-col p-6 gap-4"
                >
                  <div className="flex flex-col space-y-4 mt-16">
                    {menuLinks.map((link, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <Link
                          to={link.path}
                          className="text-white text-base"
                          onClick={() => setOpen(false)}
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}

                    {!user ? (
                      <Link to="/login" onClick={() => setOpen(false)}>
                        <button className="cursor-pointer px-6 py-2 bg-white text-primary rounded-lg hover:bg-gray-300 transition-all">
                          Login
                        </button>
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          logout();
                          toast.success('Logged out successfully 👋');
                          navigate('/');
                          setOpen(false);
                        }}
                        className="cursor-pointer px-6 py-2 bg-white text-primary rounded-lg hover:bg-red-400 transition-all"
                      >
                        Logout
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
              className="sm:hidden z-50"
              aria-label="Toggle Menu"
              onClick={() => setOpen(!open)}
              whileTap={{ rotate: 90 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <img
                src={open ? assets.cross_icon : assets.menu_icon}
                alt="menu toggle"
                className="w-6 h-6"
              />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
