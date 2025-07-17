import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../axiosInstance';

const AdminMatches = () => {
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [selectedMentee, setSelectedMentee] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');

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

  const handleMentorChange = async (mentorId) => {
    setSelectedMentor(mentorId);
    setSelectedSlot('');
    setSlots([]);

    if (!mentorId) return;

    try {
      const token = localStorage.getItem('token');
      const { data: availability } = await axios.get(`/api/availability/${mentorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!availability?.slots?.length) {
        toast.warning('This mentor has no available slots');
        return;
      }

      const now = new Date();
      const futureSlots = [];

      const daysMap = {
        Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
        Thursday: 4, Friday: 5, Saturday: 6,
      };

      availability.slots.forEach((slot) => {
        const { day, times } = slot;
        const targetDayIndex = daysMap[day];
        const today = now.getDay();

        times.forEach(({ start, end }) => {
          const [startHour, startMin] = start.split(':').map(Number);
          const slotDate = new Date();

          // Set slot date to the upcoming correct weekday
          let daysToAdd = (targetDayIndex - today + 7) % 7;
          slotDate.setDate(now.getDate() + daysToAdd);
          slotDate.setHours(startHour, startMin, 0, 0);

          const isToday = daysToAdd === 0;

          if (!isToday || slotDate > now) {
            futureSlots.push({
              label: `${day} ${start} - ${end}`,
              value: slotDate.toISOString(),
            });
          }
        });
      });

      if (futureSlots.length === 0) {
        toast.warning('No upcoming slots available for this mentor');
      }

      setSlots(futureSlots);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load mentor availability');
    }
  };

  const handleMatch = async () => {
    if (!selectedMentor || !selectedMentee || !selectedSlot) {
      toast.error('Please select mentor, mentee, and slot');
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
          slot: selectedSlot,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMatches((prev) => [...prev, data.match]);
      toast.success('Match created successfully');
      setSelectedMentor('');
      setSelectedMentee('');
      setSelectedSlot('');
      setSlots([]);
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
      <div className="bg-white shadow rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 flex-wrap items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1 text-sm">Select Mentor</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedMentor}
            onChange={(e) => handleMentorChange(e.target.value)}
          >
            <option value="">-- Choose Mentor --</option>
            {mentors.map((mentor) => (
              <option key={mentor._id} value={mentor._id}>
                {mentor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
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

        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1 text-sm">Select Slot</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            disabled={!slots.length}
          >
            <option value="">-- Choose Slot --</option>
            {slots.map((slot, idx) => (
              <option key={idx} value={slot.value}>
                {slot.label}
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

      {/* Match List */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-left text-sm text-gray-600 uppercase">
            <tr>
              <th className="p-4">Mentor</th>
              <th className="p-4">Mentee</th>
              <th className="p-4">Slot</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match._id} className="border-t">
                <td className="p-4">{match.mentor?.name}</td>
                <td className="p-4">{match.mentee?.name}</td>
                <td className="p-4">{new Date(match.slot).toLocaleString()}</td>
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
                <td colSpan="4" className="p-4 text-center text-gray-500">
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
