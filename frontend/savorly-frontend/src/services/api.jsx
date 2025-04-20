import axios from 'axios';
import https from 'https';  // Import the https module

// Define the HTTPS base URL
const API_BASE_URL = 'https://localhost:5001';

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // Ensure cookies are included in requests
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,  // Allow self-signed certificates during local development (only for dev!)
  }),
});

// Add an interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Avoid redirect loop
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);


export default api;
