import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

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

      // Make sure response has token and user
      if (!response.token || !response.user) {
        throw new Error("Login failed: Invalid response from server");
      }

      // Save token and user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);

      toast.success(`Welcome back, ${response.user.name}! 🎉`);

      // Redirect based on role
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
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-primary mb-6">
          Welcome Back 👋
        </h2>

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

          <div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
            >
              Login
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Need access? Contact your program admin.
        </p>
      </div>
    </div>
  );
};

export default Login;
