import React from 'react';
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
    <div className="py-16 px-6 md:px-16 lg:px-24 xl:px-44">
      <Title
        title="What Our Mentees Are Saying"
        subTitle="Real experiences from mentees who have grown, launched, and thrived with the help of our mentors."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-transform duration-500"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="text-xl font-semibold">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <img key={i} src={assets.star_icon} alt="star_icon" className="w-4 h-4" />
                ))}
            </div>
            <p className="text-gray-500 max-w-md mt-4 font-light">"{testimonial.testimonial}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
