import React, { useState } from 'react';
import axios from '../../axiosInstance';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return toast.error('Please fill in all fields');
    }

    if (form.newPassword !== form.confirmPassword) {
      return toast.error('New passwords do not match');
    }

    setLoading(true);

    try {
      const res = await axios.put(
        '/api/auth/change-password',
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success('Password changed successfully. Logging out...');

      // Clear token and user from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Reset form
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-6 text-center text-primary">
        Change Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
