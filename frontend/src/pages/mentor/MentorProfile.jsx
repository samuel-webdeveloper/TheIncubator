import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance';
import { toast } from 'react-toastify';
import countryList from 'react-select-country-list';
import Select from 'react-select';
import { IKUpload } from 'imagekitio-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const skillsList = [ /* ...skills list (unchanged) */ ];
const genderOptions = [/* ... */];
const experienceYears = [/* ... */];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

const MentorProfile = () => {
  const [form, setForm] = useState({
    name: '', email: '', bio: '', skills: [], specialty: '', goals: '',
    gender: '', dob: '', phone: '', experience: '',
    address: '', location: null, image: ''
  });

  const [countryOptions] = useState(countryList().getData());
  const [authParams, setAuthParams] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const countryObj = countryOptions.find(c => c.label === data.location);
        setForm({ ...form, ...data, location: countryObj || null });
      } catch {
        toast.error('Failed to load profile');
      }
    };

    const getImagekitAuth = async () => {
      const { data } = await axios.get('/api/imagekit/auth');
      setAuthParams(data);
    };

    fetchData();
    getImagekitAuth();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleLocationChange = (selectedOption) => {
    setForm(prev => ({ ...prev, location: selectedOption }));
  };

  const handleImageUploadSuccess = (res) => {
    setForm(prev => ({ ...prev, image: res.url }));
    toast.success('Image uploaded');
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = { ...form, location: form.location?.label || '' };
      const { data } = await axios.put('/api/auth/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('✅ Profile updated');
    } catch {
      toast.error('Profile update failed');
    }
  };

  return (
    <motion.div
      className="p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        className="text-2xl font-semibold text-primary mb-6"
        variants={itemVariants}
      >
        Edit Profile
      </motion.h2>

      <motion.div
        className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto space-y-4"
        variants={containerVariants}
      >
        {authParams && (
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            {form.image && (
              <motion.img
                src={form.image}
                alt="Profile"
                className="w-32 h-32 rounded-full mb-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            <IKUpload
              publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
              urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL}
              authenticationEndpoint={`${import.meta.env.VITE_BACKEND_URL}/api/imagekit/auth`}
              fileName="mentor-profile"
              onSuccess={handleImageUploadSuccess}
              onError={() => toast.error('Upload failed')}
            />
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium mb-1">About</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded px-3 py-2"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="text-sm font-medium text-gray-700">Specialty</label>
          <select
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded"
          >
            <option value="">Select your specialty</option>
            {skillsList.map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="text-sm font-medium text-gray-700 mb-1">Skills</label>
          <div className="flex flex-wrap gap-2">
            {skillsList.map(skill => (
              <motion.button
                key={skill}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSkillToggle(skill)}
                className={`px-3 py-1 border rounded-full text-sm transition ${
                  form.skills.includes(skill)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              >
                {skill}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium mb-1">Goals</label>
          <input
            type="text"
            name="goals"
            value={form.goals}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={itemVariants}>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Gender</option>
              {genderOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Experience</label>
            <select
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select experience</option>
              {experienceYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="text-sm font-medium text-gray-700 mb-1">Country</label>
          <Select
            options={countryOptions}
            value={form.location}
            onChange={handleLocationChange}
            placeholder="Select your country"
            isSearchable
          />
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6"
          variants={itemVariants}
        >
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.05 }}
            className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          >
            Save Changes
          </motion.button>

          <motion.button
            onClick={() => navigate('/change-password')}
            whileHover={{ scale: 1.05 }}
            className="px-6 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 transition"
          >
            Change Password
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MentorProfile;
