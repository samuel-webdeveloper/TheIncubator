import React from 'react';
import { assets } from "../assets/assets";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-16 text-sm">
        {/* Left section */}
        <div>
          <img className="mb-5 w-40" src={assets.logo_1} alt="logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">TheIncubator is a mentorship platform connecting aspiring talents with experienced professionals for growth, guidance, and greatness.</p>
        </div>

        {/* Center section */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Right section */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+2347031274062</li>
            <li>ayoolasam2019@gmail.com</li>
          </ul>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4 text-xl text-primary">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <hr />
      <p className="py-5 text-sm text-center">
        &copy; {new Date().getFullYear()} TheIncubator. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
