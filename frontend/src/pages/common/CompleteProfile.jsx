import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';

const skillsList = [
  'UI/UX',
  'Marketing',
  'Frontend Development',
  'Backend Development',
  'Data Science',
  'Product Management',
  'Business Strategy',
];

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
const ageRanges = ['18–24', '25–34', '35–44', '45–54', '55+'];
const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];

const CompleteProfile = () => {
  const countryOptions = useMemo(() => countryList().getData(), []);
  const [form, setForm] = useState({
    name: '',
    bio: '',
    skills: [],
    goals: '',
    gender: '',
    ageRange: '',
    experience: '',
    location: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile submitted:', form);
    // Later: send to backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-[#25D366] mb-6">
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Short Bio</label>
            <textarea
              name="bio"
              rows="3"
              value={form.bio}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              placeholder="Tell us a little about yourself..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Select Skills</label>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-4 py-1 rounded-full border transition ${
                    form.skills.includes(skill)
                      ? 'bg-[#25D366] text-white border-[#25D366]'
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Goals</label>
            <input
              type="text"
              name="goals"
              value={form.goals}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              placeholder="e.g., Improve product design skills"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            >
              <option value="">Select Gender</option>
              {genderOptions.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Age Range</label>
            <select
              name="ageRange"
              value={form.ageRange}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            >
              <option value="">Select Age Range</option>
              {ageRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Experience Level</label>
            <select
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            >
              <option value="">Select Experience Level</option>
              {experienceLevels.map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          {/* Location with searchable dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
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
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#25D366' },
                }),
              }}
            />
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
