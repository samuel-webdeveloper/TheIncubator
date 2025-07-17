import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { assets } from "../assets/assets";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';

const footerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const Footer = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
      className="px-4 md:px-10 bg-gray-50"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between gap-10 py-12 text-sm text-gray-700">
        {/* Left section */}
        <div className="sm:w-1/2">
          <img className="mb-4 w-32 sm:w-40 rounded-full" src={assets.logo_1} alt="logo" />
          <p className="leading-6">
            TheIncubator is a mentorship platform that bridges aspiring talents with seasoned professionals, fostering growth, guidance, and lasting impact. Through meaningful connections, we empower the next generation to thrive, lead, and leave their mark on the world.
          </p>
        </div>

        {/* Center section */}
        <div className="flex-1">
          <p className="text-lg font-semibold mb-4">Quick Links</p>
          <ul className="flex flex-col gap-2">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/mentee/dashboard/mentors">Find Mentors</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        {/* Right section */}
        <div className="flex-1">
          <p className="text-lg font-semibold mb-4">Contact Us</p>
          <ul className="flex flex-col gap-2">
            <li>+2348140309594</li>
            <li>theincubatorng@gmail.com</li>
          </ul>

          <div className="flex gap-4 mt-4 text-xl text-primary">
            <a href="https://facebook.com/theincubatorng" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://x.com/theincubator_ng" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://ng.linkedin.com/company/theincubatorng" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://www.instagram.com/theincubatornigeria/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.youtube.com/@theincubatorhub" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <hr className="border-gray-300" />
      <p className="py-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} TheIncubator. All rights reserved.
      </p>
    </motion.div>
  );
};

export default Footer;
