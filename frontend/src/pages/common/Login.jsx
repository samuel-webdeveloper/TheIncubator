import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { motion } from 'framer-motion'; 

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginUser(form.email, form.password);

      if (!response.token || !response.user) {
        throw new Error("Login failed: Invalid response from server");
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);

      toast.success(`Welcome back, ${response.user.name}! 🎉`);

      const role = response.user.role;
      if (role === 'admin') {
        navigate('/admin/users');
      } else if (role === 'mentor') {
        navigate('/mentor/dashboard');
      } else if (role === 'mentee') {
        navigate('/mentee/dashboard');
      } else {
        setError('Unknown user role');
      }

    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-center text-primary mb-6"
        >
          Welcome Back 👋
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
            >
              Login
            </button>
          </motion.div>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          Need access? Contact your program admin.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
