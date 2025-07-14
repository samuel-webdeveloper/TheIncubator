import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const Profile = () => {
  const { user, setUser } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    // (Later) Send this data to the backend
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert('Profile updated!');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-primary mb-6">My Profile</h2>

      <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Role</label>
          <input
            name="role"
            value={formData.role}
            disabled
            className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Write a short bio..."
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded resize-none"
          ></textarea>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
