import React, { useEffect, useState, useMemo } from 'react';
import axios from '../../axiosInstance';
import { toast } from 'react-toastify';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const skillsList = [
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
  'Virtual assistant',
];

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];

const Profile = () => {
  const countryOptions = useMemo(() => countryList().getData(), []);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
    skills: [],
    specialty: '',
    goals: '',
    gender: '',
    dob: '',
    phone: '',
    experience: '',
    address: '',
    location: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          ...data,
          location: countryOptions.find((c) => c.label === data.location) || null,
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Unable to load profile');
      }
    };

    fetchProfile();
  }, [countryOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleLocationChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, location: selectedOption }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        location: formData.location?.label || '',
      };

      const { data } = await axios.put('/api/auth/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem('user', JSON.stringify(data));
      toast.success('✅ Profile updated successfully');
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-semibold text-primary mb-6">Edit Profile</h2>

      <motion.div
        className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto space-y-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
        <Input label="Email" name="email" value={formData.email} disabled />

        <div>
          <label className="text-sm font-medium text-gray-700">Short Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Specialty</label>
          <select
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded"
          >
            <option value="">Select your specialty</option>
            {skillsList.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Skills</label>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill) => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                type="button"
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`px-4 py-1 rounded-full border transition ${
                  formData.skills.includes(skill)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              >
                {skill}
              </motion.button>
            ))}
          </div>
        </div>

        <Input label="Goals" name="goals" value={formData.goals} onChange={handleChange} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded"
            >
              <option value="">Select Gender</option>
              {genderOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <Input
            type="date"
            label="Date of Birth"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />

          <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />

          <div>
            <label className="text-sm font-medium text-gray-700">Experience</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded"
            >
              <option value="">Select Experience</option>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <Input label="Address" name="address" value={formData.address} onChange={handleChange} />

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Country</label>
            <Select
              options={countryOptions}
              value={formData.location}
              onChange={handleLocationChange}
              placeholder="Select your country"
              isSearchable
              className="text-sm"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.75rem',
                  borderColor: '#d1d5db',
                  '&:hover': { borderColor: '#25D366' },
                }),
              }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          >
            Save Changes
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/change-password')}
            className="px-6 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 transition"
          >
            Change Password
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;

const Input = ({ label, name, value, onChange, disabled = false, type = 'text' }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded"
    />
  </div>
);
