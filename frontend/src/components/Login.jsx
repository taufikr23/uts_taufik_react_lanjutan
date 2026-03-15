import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiMail, HiLockClosed, HiLogin, HiSparkles } from 'react-icons/hi';
import api from '../api/axios';
import Cookies from 'js-cookie';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login', formData);
      
      if (response.data.token) {
        Cookies.set('token', String(response.data.token), { 
          expires: 1, path: '/', sameSite: 'lax'
        });
        localStorage.setItem('token', response.data.token);
      }
      
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Background Effects - Sangat subtle */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Premium Badge */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 bg-gray-800/90 backdrop-blur-xl px-3 py-1.5 rounded-full border border-gray-700 shadow-lg">
            <HiSparkles className="text-yellow-400 text-sm" />
            <span className="text-xs text-gray-300">UTS React Lanjutan 2026</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
              <HiLogin className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-sm text-gray-400">Silakan login untuk melanjutkan</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Email atau Username</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-700/80 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Masukkan email atau username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-700/80 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <HiLogin className="text-base" />
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <p className="text-center mt-4 text-xs text-gray-400">
            Belum punya akun?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;