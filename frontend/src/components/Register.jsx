import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiMail, HiUser, HiLockClosed, HiUserAdd, HiSparkles } from 'react-icons/hi';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    gmail: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/register', {
        gmail: formData.gmail,
        username: formData.username,
        password: formData.password
      });

      setSuccess('Registrasi berhasil! Silakan login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Premium Badge */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-1.5 bg-gray-800/80 backdrop-blur-xl px-3 py-1.5 rounded-full border border-gray-700 shadow-xl">
            <HiSparkles className="text-yellow-400 text-sm" />
            <span className="text-xs text-gray-300 font-medium">UTS React Lanjutan 2026</span>
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
              <HiUserAdd className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Buat Akun Baru</h2>
            <p className="text-sm text-gray-400">Daftar untuk mengakses sistem</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-3 py-2 rounded-lg mb-4 animate-pulse">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
                <input
                  type="email"
                  name="gmail"
                  value={formData.gmail}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-700/30 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="Masukkan email"
                  required
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Username</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-700/30 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-700/30 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="Minimal 6 karakter"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Konfirmasi Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-700/30 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="Ulangi password"
                  required
                />
              </div>
            </div>

            {/* Password Requirements - Informasi tambahan */}
            <div className="text-xs text-gray-500 space-y-1 bg-gray-700/20 p-2 rounded-lg">
              <p className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 6 ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                Minimal 6 karakter
              </p>
              <p className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${formData.password === formData.confirmPassword && formData.password !== '' ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                Password dan konfirmasi harus sama
              </p>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-green-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              <HiUserAdd className="text-base" />
              {loading ? 'Loading...' : 'Daftar'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-4 text-xs text-gray-400">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
              Login
            </Link>
          </p>

          {/* Divider */}
          <div className="relative mt-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-gray-800/40 text-gray-500">informasi</span>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-3">
            Dengan mendaftar, Anda menyetujui{' '}
            <button className="text-gray-400 hover:text-blue-400">Syarat & Ketentuan</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;