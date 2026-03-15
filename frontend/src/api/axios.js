import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Coba ambil token dari cookies
    let token = Cookies.get('token');
    
    // Kalau tidak ada di cookies, coba dari localStorage
    if (!token) {
      token = localStorage.getItem('token');
      console.log('Token dari localStorage:', token ? 'ADA' : 'TIDAK ADA');
    } else {
      console.log('Token dari cookies:', token ? 'ADA' : 'TIDAK ADA');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Header Authorization:', config.headers.Authorization.substring(0, 50) + '...');
    } else {
      console.log('TIDAK ADA TOKEN!');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;