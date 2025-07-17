import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../context/AppContext";
import Title from './Title';
import { motion } from 'framer-motion';

const AvailableMentors = () => {
  const navigate = useNavigate();
  const { mentors, loadingMentors } = useContext(AppContext);

  // Randomize 20 mentors only once on render
  const displayedMentors = useMemo(() => {
    if (!Array.isArray(mentors)) return [];
    const shuffled = [...mentors].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 20);
  }, [mentors]);

  if (loadingMentors) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        Loading mentors...
      </div>
    );
  }

  return (
    <motion.div
      id="available"
      className="flex flex-col items-center gap-4 px-4 my-8 text-gray-900 md:mx-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Title
          title="Available Mentors To Book"
          subTitle="Browse through our extensive list of mentors and book an appointment"
        />
      </motion.div>

      <motion.div
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5 px-3 sm:px-0"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {displayedMentors.map((item, index) => (
          <motion.div
            key={index}
            onClick={() => {
              navigate(`/mentee/dashboard/mentor/${item._id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="border border-primary rounded-xl overflow-hidden cursor-pointer shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.03 }}
          >
            <img
              className="bg-blue-50 w-full h-25 object-cover"
              src={item.image}
              alt={`${item.name} profile`}
            />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-green-500 mb-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <p>Available</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.specialty}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        onClick={() => {
          navigate('/mentee/dashboard/mentors');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="bg-primary text-gray-600 px-12 py-3 rounded-full mt-10 hover:scale-105 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        more
      </motion.button>
    </motion.div>
  );
};

export default AvailableMentors;
