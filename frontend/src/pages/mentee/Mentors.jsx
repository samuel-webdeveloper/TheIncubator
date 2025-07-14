import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const Mentors = () => {
  const { speciality } = useParams();
  const decodedSpeciality = decodeURIComponent(speciality || '');
  const [filterMentor, setFilterMentor] = useState([]);
  const navigate = useNavigate();
  const { mentors, loadingMentors } = useContext(AppContext);

  useEffect(() => {
    if (!Array.isArray(mentors)) return;

    if (decodedSpeciality) {
      const filtered = mentors.filter(
        (mentor) => mentor.speciality === decodedSpeciality
      );
      setFilterMentor(filtered);
    } else {
      setFilterMentor(mentors);
    }
  }, [mentors, decodedSpeciality]);

  const handleNavigate = (field) => {
    if (decodedSpeciality === field) {
      navigate('/mentee/dashboard/mentors'); // unselect
    } else {
      navigate(`/mentee/dashboard/mentors/${encodeURIComponent(field)}`);
    }
  };

  const categories = [
    'AI/Machine learning',
    'Content & copy writing',
    'Cybersecurity',
    'Data analysis',
    'Digital marketing',
    'Graphics design',
    'Product design',
    'Product management',
    'Project management',
    'Software development',
    'Video editing',
    'Virtual assistant'
  ];

  if (loadingMentors) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        Loading mentors...
      </div>
    );
  }

  return (
    <div className="m-6">
      {/* Header */}
      <div className='bg-white rounded-lg p-4 text-center mb-6 mt-6 shadow'>
        <h2 className='text-xl sm:text-2xl font-semibold text-primary'>
          Explore expert mentors by specialty and book your next appointment with ease.
        </h2>
      </div>

      <div className='flex flex-col sm:flex-row items-start gap-8 mt-6'>

        {/* Specialties List */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-700">Filter by Specialty</h3>
          <div className='flex flex-col gap-4 text-sm text-gray-600'>
            {categories.map((field, index) => {
              const isActive = decodedSpeciality === field;
              return (
                <p
                  key={index}
                  onClick={() => handleNavigate(field)}
                  className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:bg-primary/90 ${
                    isActive
                      ? 'bg-primary text-white font-semibold'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  {field}
                </p>
              );
            })}
          </div>
        </div>

        {/* Mentor Cards */}
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterMentor.length === 0 ? (
            <p className="text-gray-500 col-span-full">No mentors found in this specialty.</p>
          ) : (
            filterMentor.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(`/mentee/dashboard/mentor/${item._id}`)}
                className='border border-primary rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300 bg-white shadow'
              >
                <img className='bg-blue-50 w-full h-25 object-cover' src={item.image} alt={`${item.name} profile`} />
                <div className='p-4'>
                  <div className='flex items-center gap-2 text-sm text-green-500 mb-1'>
                    <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                    <span>Available</span>
                  </div>
                  <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                  <p className='text-gray-600 text-sm'>{item.speciality}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Mentors;
