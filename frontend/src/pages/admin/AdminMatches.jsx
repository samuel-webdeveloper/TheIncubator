import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../axiosInstance';

const AdminMatches = () => {
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [selectedMentee, setSelectedMentee] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [mentorsRes, menteesRes, matchesRes] = await Promise.all([
          axios.get('/api/admin/mentors', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/admin/matches', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setMentors(mentorsRes.data);
        setMentees(menteesRes.data.filter((u) => u.role === 'mentee'));
        setMatches(matchesRes.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load mentors, mentees, or matches');
      }
    };

    fetchData();
  }, []);

  const handleMatch = async () => {
    if (!selectedMentor || !selectedMentee) {
      toast.error('Please select both mentor and mentee');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        '/api/admin/matches',
        {
          mentorId: selectedMentor,
          menteeId: selectedMentee,
          message: 'Assigned by admin',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMatches((prev) => [...prev, data.match]);
      toast.success('Match created successfully');
      setSelectedMentor('');
      setSelectedMentee('');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create match');
    }
  };

  const handleDeleteMatch = async (id) => {
    if (!window.confirm('Are you sure you want to delete this match?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/matches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMatches((prev) => prev.filter((match) => match._id !== id));
      toast.success('Match deleted');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete match');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Mentorship Matches</h2>

      {/* Match Creation Form */}
      <div className="bg-white shadow rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block mb-1 text-sm">Select Mentor</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
          >
            <option value="">-- Choose Mentor --</option>
            {mentors.map((mentor) => (
              <option key={mentor._id} value={mentor._id}>
                {mentor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block mb-1 text-sm">Select Mentee</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedMentee}
            onChange={(e) => setSelectedMentee(e.target.value)}
          >
            <option value="">-- Choose Mentee --</option>
            {mentees.map((mentee) => (
              <option key={mentee._id} value={mentee._id}>
                {mentee.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleMatch}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
        >
          Assign Match
        </button>
      </div>

      {/* Match List Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-left text-sm text-gray-600 uppercase">
            <tr>
              <th className="p-4">Mentor</th>
              <th className="p-4">Mentee</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match._id} className="border-t">
                <td className="p-4">{match.mentor?.name}</td>
                <td className="p-4">{match.mentee?.name}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleDeleteMatch(match._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {matches.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No matches yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMatches;
