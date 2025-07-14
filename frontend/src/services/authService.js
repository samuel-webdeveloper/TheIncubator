// ✅ src/services/authService.js
import axios from '../axiosInstance'; // use your axios instance

export const loginUser = async (email, password) => {
  const response = await axios.post('/api/auth/login', { email, password });
  return response.data; // contains { token, user }
};
