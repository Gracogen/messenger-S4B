import axios from 'axios';

const API_BASE_URL = 'https://whisperbox.koyeb.app';

// Register a new user
export const register = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, {
    username,
    password
  });
  return response.data;
};

// Login user - returns JWT token
export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    username,
    password
  });
  return response.data; // Should contain { token: "..." }
};

// Save token to localStorage (temporary, will improve later)
export const saveToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('authToken');
};

// Remove token on logout
export const removeToken = () => {
  localStorage.removeItem('authToken');
};