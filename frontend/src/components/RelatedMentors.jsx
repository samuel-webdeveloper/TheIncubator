import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const RelatedMentors = ({ speciality, mentorId }) => {
  const { mentors } = useContext(AppContext)
  const navigate = useNavigate()
  const [relMentors, setRelMentors] = useState([])

  useEffect(() => {
    if (mentors.length > 0 && speciality) {
      const mentorsData = mentors.filter(
        (mentor) => mentor.speciality === speciality && mentor._id !== mentorId
      )
      setRelMentors(mentorsData)
    }
  }, [mentors, speciality, mentorId])

  return (
    <motion.div
      id="available"
      className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <motion.h1
        className="text-3xl font-medium"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
      >
        Related Mentors That You Can Also Book
      </motion.h1>

      <motion.p
        className="sm:w-1/3 text-center text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        viewport={{ once: true }}
      >
        Browse through our extensive list of mentors and book an appointment
      </motion.p>

      <motion.div
        className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0"
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        viewport={{ once: true }}
      >
        {relMentors.slice(0, 5).map((item, index) => (
          <motion.div
            key={index}
            className="border border-primary rounded-xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-all duration-500"
            onClick={() => {
              navigate(`/appointment/${item._id}`)
              scrollTo(0, 0)
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <img className="bg-blue-50" src={item.image} alt="Mentor image" />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-center text-green-500">
                <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                <p>Available</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        onClick={() => {
          navigate('/mentors')
          scrollTo(0, 0)
        }}
        className="bg-primary text-gray-600 px-12 py-3 rounded-full mt-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        viewport={{ once: true }}
      >
        more
      </motion.button>
    </motion.div>
  )
}

export default RelatedMentors
