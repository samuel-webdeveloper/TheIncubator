import React from 'react';
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Header = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden px-4">
      {/* Background Image */}
      <img
        src={assets.cover_5}
        alt="Cover"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

      {/* Text Content */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4 sm:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 font-outfit"
          variants={itemVariants}
        >
          Welcome to <span className="text-primary">TheIncubator</span>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl font-light max-w-2xl mb-6"
          variants={itemVariants}
        >
          Empowering future leaders through impactful mentorship.
        </motion.p>

        <motion.a
          href="#available"
          className="flex items-center gap-2 bg-primary px-8 py-3 rounded-full text-gray-600 font-medium text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          variants={itemVariants}
        >
          Book appointment <img className="w-3" src={assets.arrow_icon} alt="arrow icon" />
        </motion.a>
      </motion.div>
    </div>
  );
};

export default Header;
