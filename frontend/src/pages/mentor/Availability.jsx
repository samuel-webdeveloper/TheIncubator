import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from '../../axiosInstance';
import { AppContext } from '../../context/AppContext';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

const Availability = () => {
  const { user } = useContext(AppContext);
  const [availability, setAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data } = await axios.get('/api/availability', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAvailability(data.slots || []);
      } catch (error) {
        const status = error.response?.status;

        if (status === 404) {
          // No availability found yet — valid scenario
          console.log('ℹ️ No availability set yet for this mentor.');
          setAvailability([]);
        } else {
          toast.error('Failed to load availability');
          console.error('Load Error:', error.response?.data || error.message);
        }
      }
    };

    fetchAvailability();
  }, []);

  const saveAvailability = async (updatedSlots) => {
    try {
      const res = await axios.put(
        '/api/availability',
        { slots: updatedSlots },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setAvailability(res.data.data.slots || []);
      return true;
    } catch (error) {
      toast.error('Failed to save availability');
      console.error('Save Error:', error.response?.data || error.message);
      throw error;
    }
  };

  const addSlot = async () => {
    if (!selectedDay || !startTime || !endTime) {
      toast.error('All fields are required');
      return;
    }

    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    const newTime = { start: startTime, end: endTime };
    const existingDay = availability.find((slot) => slot.day === selectedDay);

    let updated;
    if (existingDay) {
      const exists = existingDay.times.find(
        (t) => t.start === newTime.start && t.end === newTime.end
      );
      if (exists) {
        toast.warning('This time slot already exists');
        return;
      }
      existingDay.times.push(newTime);
      updated = [...availability];
    } else {
      updated = [...availability, { day: selectedDay, times: [newTime] }];
    }

    try {
      await saveAvailability(updated);
      setStartTime('');
      setEndTime('');
      toast.success('Slot added successfully ✅');
    } catch (error) {
      // Already handled inside saveAvailability
    }
  };

  const removeSlot = async (day, index) => {
    const updated = availability
      .map((slot) => {
        if (slot.day === day) {
          const newTimes = slot.times.filter((_, i) => i !== index);
          return { ...slot, times: newTimes };
        }
        return slot;
      })
      .filter((slot) => slot.times.length > 0);

    try {
      await saveAvailability(updated);
      toast.info('Slot removed');
    } catch (error) {
      // Already handled inside saveAvailability
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Manage Your Availability</h2>

      {/* Add Slot Form */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
        <div>
          <label className="block text-sm mb-1">Day</label>
          <select
            className="border rounded px-3 py-2"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Start Time</label>
          <input
            type="time"
            className="border rounded px-3 py-2"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">End Time</label>
          <input
            type="time"
            className="border rounded px-3 py-2"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <button
          onClick={addSlot}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
        >
          Add Slot
        </button>
      </div>

      {/* Availability Display */}
      {availability.length > 0 ? (
        <div className="space-y-4">
          {availability.map((slot) => (
            <div key={slot.day} className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold text-lg mb-2 text-primary">{slot.day}</h4>
              <ul className="space-y-2">
                {slot.times.map((t, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-sm border p-2 rounded"
                  >
                    <span>{t.start} - {t.end}</span>
                    <button
                      onClick={() => removeSlot(slot.day, index)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No availability set yet.</p>
      )}
    </div>
  );
};

export default Availability;
