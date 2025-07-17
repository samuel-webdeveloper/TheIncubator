// src/pages/auth/CompleteProfile.jsx
import React, { useState, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import axios from '../../axiosInstance';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const skillsList = [
  'AI/Machine learning', 'Content & copy writing', 'Cybersecurity', 'Data analysis',
  'Digital marketing', 'Graphics design', 'Product design', 'Product management',
  'Project management', 'Software development', 'Video editing', 'Virtual assistant',
];

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
const menteeExperienceLevels = ['Beginner', 'Intermediate', 'Advanced'];
const mentorExperienceYears = Array.from({ length: 10 }, (_, i) => `${i + 1} year${i > 0 ? 's' : ''}`);

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CompleteProfile = () => {
  const countryOptions = useMemo(() => countryList().getData(), []);
  const navigate = useNavigate();
  const { setUser, user } = useContext(AppContext);

  const [form, setForm] = useState({
    name: '', bio: '', skills: [], specialty: '', goals: '', gender: '',
    dob: '', phone: '', experience: '', address: '', location: null,
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSkillToggle = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleLocationChange = (selectedOption) => {
    setForm({ ...form, location: selectedOption });
  };

  const isFormComplete = () => (
    form.name && form.bio && form.specialty && form.skills.length > 0 &&
    form.goals && form.gender && form.dob && form.phone &&
    form.experience && form.address && form.location
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormComplete()) return toast.error('❌ Please fill all required fields');

    try {
      const token = localStorage.getItem('token');
      const payload = { ...form, location: form.location?.label || '' };

      const { data } = await axios.put('/api/auth/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(data);
      toast.success('🎉 Profile completed successfully!');

      if (data.role === 'admin') navigate('/admin/users');
      else if (data.role === 'mentor') {
        navigate('/mentor/dashboard');
        window.location.reload();
      } else {
        navigate('/mentee/dashboard');
        window.location.reload();
      }
    } catch (error) {
      console.error('Profile submission failed:', error);
      toast.error('Failed to submit profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <motion.h2
          className="text-2xl font-semibold text-center text-[#25D366] mb-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Complete Your Profile
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.05, delayChildren: 0.15 }}
        >
          {[
            { label: 'Full Name', name: 'name', type: 'text' },
            { label: user?.role === 'mentor' ? 'About' : 'Short Bio', name: 'bio', type: 'textarea' },
            { label: 'Goals', name: 'goals', type: 'text' },
            { label: 'Date of Birth', name: 'dob', type: 'date' },
            { label: 'Phone Number', name: 'phone', type: 'tel' },
            { label: 'Address', name: 'address', type: 'text' },
          ].map(({ label, name, type }) => (
            <motion.div key={name} variants={fadeInUp}>
              <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-xl"
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              )}
            </motion.div>
          ))}

          {/* Specialty */}
          <motion.div variants={fadeInUp}>
            <label className="block text-sm font-medium text-gray-600 mb-1">Specialty</label>
            <select
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl"
            >
              <option value="">Select your specialty</option>
              {skillsList.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </motion.div>

          {/* Skills */}
          <motion.div variants={fadeInUp}>
            <label className="block text-sm font-medium text-gray-600 mb-2">Select Skills</label>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill) => (
                <motion.button
                  type="button"
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-1 rounded-full border transition ${
                    form.skills.includes(skill)
                      ? 'bg-[#25D366] text-white border-[#25D366]'
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                  }`}
                >
                  {skill}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Gender */}
          <motion.div variants={fadeInUp}>
            <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl"
            >
              <option value="">Select Gender</option>
              {genderOptions.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </motion.div>

          {/* Experience */}
          <motion.div variants={fadeInUp}>
            <label className="block text-sm font-medium text-gray-600 mb-1">Experience</label>
            <select
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl"
            >
              <option value="">Select Experience</option>
              {(user?.role === 'mentor' ? mentorExperienceYears : menteeExperienceLevels).map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </motion.div>

          {/* Country */}
          <motion.div variants={fadeInUp}>
            <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
            <Select
              options={countryOptions}
              value={form.location}
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
          </motion.div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Save Profile
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
