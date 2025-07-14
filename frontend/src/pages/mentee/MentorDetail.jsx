






import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const MentorDetail = () => {
  const { id } = useParams();
  const { mentors, currencySymbol } = useContext(AppContext);
  const navigate = useNavigate();

  const mentor = mentors.find((m) => m._id === id);

  if (!mentor) {
    return <p className="text-center text-red-600 mt-10">Mentor not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8 bg-white shadow-lg rounded-lg p-6">
        <img
          src={mentor.image}
          alt={mentor.name}
          className="w-full md:w-72 h-72 object-cover rounded-lg"
        />
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold text-primary">{mentor.name}</h2>
          <p className="text-gray-600">{mentor.speciality}</p>
          <p className="text-sm text-gray-500">Experience: {mentor.experience}</p>
          <p className="text-sm text-gray-500">Address: {mentor.address}</p>
          <p className="text-gray-700">{mentor.about}</p>

          <button
            onClick={() => alert("Booking flow coming soon")}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
          >
            Book Appointment
          </button>

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 underline ml-4"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorDetail;
