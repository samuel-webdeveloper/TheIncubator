import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance'; 
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'mentee',
  });
  const [image, setImage] = useState(null);
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsers(data);
      } catch (error) {
        toast.error('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newUser.name);
      formData.append('email', newUser.email);
      formData.append('password', newUser.password);
      formData.append('role', newUser.role);

      if (newUser.role === 'mentor' && image) {
        formData.append('image', image);
      }

      const { data } = await axios.post('/api/admin/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setUsers((prev) => [...prev, data.user]);
      setNewUser({ name: '', email: '', password: '', role: 'mentee' });
      setImage(null);

      toast.success('User added successfully ✅');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(users.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(
        `/api/admin/users/${id}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, role: newRole } : user))
      );
      toast.success('Role updated');
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const filteredUsers = filterRole === 'all'
    ? users
    : users.filter((user) => user.role === filterRole);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Admin – Manage Users</h1>

      {/* Filter by Role */}
      <div className="mb-4">
        <label className="mr-2 text-sm font-medium text-gray-700">Filter by Role:</label>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Add User Form */}
      <form
        onSubmit={handleAddUser}
        className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          name="name"
          value={newUser.name}
          onChange={handleInputChange}
          placeholder="Full Name"
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          value={newUser.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="border p-2 rounded"
        />
        <select
          name="role"
          value={newUser.role}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>

        {newUser.role === 'mentor' && (
          <div className="col-span-full">
            <label className="block text-sm text-gray-600 mb-1">Upload Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 rounded w-full"
            />
          </div>
        )}

        <div className="col-span-1 sm:col-span-2 md:col-span-4">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            Add User
          </button>
        </div>
      </form>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200 bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id || user.id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="border p-1 rounded text-sm"
                  >
                    <option value="mentee">Mentee</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3 text-red-500">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 hover:text-red-800 ml-2 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No users available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
