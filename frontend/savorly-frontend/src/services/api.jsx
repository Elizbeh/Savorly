import axios from 'axios';
import Cookies from "js-cookie";

const API_BASE_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

//I nterceptor to automatically include the auth token in all requests
api.interceptors.request.use((config) => {
  const token = Cookies.get("authToken") || localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add an interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("authToken"); 
      localStorage.removeItem("authToken");
      window.location.href = '/login';
    } else {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
