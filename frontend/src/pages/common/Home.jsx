// src/pages/common/Home.jsx
import React, { useState } from "react";
import Header from "../../components/Header";
import AvailableMentors from "../../components/AvailableMentors";
import Testimonial from "../../components/Testimonial";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <Header />
      <AvailableMentors />
      <Testimonial />

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl mb-4 font-semibold">Login</h2>
            <button
              onClick={() => setShowLogin(false)}
              className="mt-4 bg-primary text-white px-6 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
