import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import Title from './Title';

const Testimonial = () => {
  const testimonials = [
    {
      name: 'Ada Oyinyechi',
      location: 'Port Harcourt, Nigeria',
      image: assets.testimonial_image_1,
      testimonial:
        'Before joining the platform, I had no idea how to break into the tech world. My mentor helped me create a strong portfolio, and now I’ve landed my first internship. I’m so grateful for this experience!',
    },
    {
      name: 'Ibrahim Mohammed',
      location: 'Kaduna, Nigeria',
      image: assets.testimonial_image_2,
      testimonial:
        'I was transitioning from a technical role into project management and felt overwhelmed. My mentor shared real-world tools, frameworks, and even reviewed my project plans. Today, I lead my own team with confidence!',
    },
    {
      name: 'Yusuf Kabirat',
      location: 'Lagos, Nigeria',
      image: assets.testimonial_image_3,
      testimonial:
        'As a medical student transitioning into Tech, I needed direction. My mentor walked me through career options, tech skills, and networking tips. I now feel confident pursuing this new path.',
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 bg-gray-50">
      <Title
        title="What Our Mentees Are Saying"
        subTitle="Real experiences from mentees who have grown, launched, and thrived with the help of our mentors."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                className="w-14 h-14 rounded-full object-cover border border-gray-200"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="text-lg font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-3">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <img key={i} src={assets.star_icon} alt="star_icon" className="w-4 h-4" />
                ))}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              "{testimonial.testimonial}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
