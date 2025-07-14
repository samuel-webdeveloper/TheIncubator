import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../context/AppContext";
import Title from './Title';

const AvailableMentors = () => {
  const navigate = useNavigate();
  const { mentors, loadingMentors } = useContext(AppContext);

  const displayedMentors = Array.isArray(mentors) ? mentors.slice(0, 20) : [];

  if (loadingMentors) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        Loading mentors...
      </div>
    );
  }

  return (
    <div id="available" className="flex flex-col items-center gap-4 my-8 text-gray-900 md:mx-10">
      <Title
        title="Available Mentors To Book"
        subTitle="Browse through our extensive list of mentors and book an appointment"
      />

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5 px-3 sm:px-0">
        {displayedMentors.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/mentee/dashboard/mentor/${item._id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="border border-primary rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-sm"
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
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate('/mentee/dashboard/mentors');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="bg-primary text-gray-600 px-12 py-3 rounded-full mt-10 hover:scale-105 transition-all duration-300"
      >
        more
      </button>
    </div>
  );
};

export default AvailableMentors;
