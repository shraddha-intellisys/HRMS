const axios = require('axios');

// ✅ Auth API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/auth';

const AuthService = {
  // ✅ User Signup
  signup: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, userData);
      return response.data;
    } catch (error) {
      console.error('❌ Signup Error:', error.response?.data || error.message);
      throw error.response?.data || { message: '❌ Signup failed. Please try again.' };
    }
  },

  // ✅ User Login
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);

      console.log('✅ Login Success:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Optional: Store user
      } else {
        console.error('❌ Token missing in login response');
        throw { message: 'Login failed: No token received.' };
      }

      return response.data;
    } catch (error) {
      console.error('❌ Login Error:', error.response?.data || error.message);
      throw error.response?.data || { message: '❌ Login failed. Please try again later.' };
    }
  },

  // ✅ Logout
  logout: () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ Cleared auth data.');
  },

  // ✅ Get Auth Token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // ✅ Check if Authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // ✅ Auth Headers
  getAuthHeaders: () => {
    const token = AuthService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // ✅ Get User Profile (Protected Route)
  getProfile: async () => {
    try {
      const EMPLOYEE_API_URL = process.env.REACT_APP_EMPLOYEE_API_URL || 'http://localhost:5000/api/employee';
  
      const response = await axios.get(`${EMPLOYEE_API_URL}/profile`, {
        headers: AuthService.getAuthHeaders(),
      });
  
      console.log('✅ Profile:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Profile Error:', error.response?.data || error.message);
      throw error.response?.data || { message: '❌ Unable to fetch profile.' };
    }
  },
}

module.exports = AuthService;
