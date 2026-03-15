import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { HiExclamationCircle } from 'react-icons/hi';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Cek token
    const token = Cookies.get('token') || localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setShowError(true);
      
      // Tampilkan error selama 3 detik lalu redirect
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated && showError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-red-500/30 p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HiExclamationCircle className="text-5xl text-red-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">Akses Ditolak</h2>
          
          <p className="text-gray-400 mb-6">
            Anda harus login terlebih dahulu untuk mengakses halaman ini.
          </p>
          
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm">
              ⚠️ Anda akan dialihkan ke halaman login dalam 3 detik...
            </p>
          </div>
          
          <div className="flex gap-3">
            <a
              href="/login"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Login Sekarang
            </a>
            <a
              href="/"
              className="flex-1 bg-gray-700 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-600 transition"
            >
              Kembali
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;