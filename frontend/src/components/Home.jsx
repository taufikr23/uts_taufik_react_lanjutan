import { HiUserGroup, HiAcademicCap, HiChartBar, HiStar, HiClock, HiArrowUp, HiArrowDown } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { 
      icon: HiUserGroup, 
      label: 'Total Mahasiswa', 
      value: '0', 
      change: '0%', 
      trend: 'up',
      textColor: 'text-blue-400',
      bgGlow: 'bg-blue-500/20'
    },
    { 
      icon: HiAcademicCap, 
      label: 'Rata-rata IPK', 
      value: '0.00', 
      change: '0', 
      trend: 'up',
      textColor: 'text-green-400',
      bgGlow: 'bg-green-500/20'
    },
    { 
      icon: HiChartBar, 
      label: 'Jurusan Aktif', 
      value: '0', 
      change: '0', 
      trend: 'up',
      textColor: 'text-yellow-400',
      bgGlow: 'bg-yellow-500/20'
    },
    { 
      icon: HiStar, 
      label: 'Mahasiswa Aktif', 
      value: '0%', 
      change: '0%', 
      trend: 'up',
      textColor: 'text-purple-400',
      bgGlow: 'bg-purple-500/20'
    },
  ]);

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const fetchMahasiswa = async () => {
    try {
      setLoading(true);
      const response = await api.get('/mahasiswa');
      setMahasiswa(response.data);
      
      // Hitung statistik dari data real
      const total = response.data.length;
      const aktif = response.data.filter(m => m.isactive).length;
      const nonAktif = total - aktif;
      const rataIpk = (response.data.reduce((acc, m) => acc + parseFloat(m.ipk), 0) / total).toFixed(2) || '0.00';
      
      // Hitung jurusan unik
      const jurusanSet = new Set(response.data.map(m => m.jurusan));
      const totalJurusan = jurusanSet.size;
      
      // Update stats dengan data real
      setStats([
        { 
          icon: HiUserGroup, 
          label: 'Total Mahasiswa', 
          value: total.toString(), 
          change: `${aktif} aktif`, 
          trend: 'up',
          textColor: 'text-blue-400',
          bgGlow: 'bg-blue-500/20'
        },
        { 
          icon: HiAcademicCap, 
          label: 'Rata-rata IPK', 
          value: rataIpk, 
          change: `${rataIpk} max`, 
          trend: 'up',
          textColor: 'text-green-400',
          bgGlow: 'bg-green-500/20'
        },
        { 
          icon: HiChartBar, 
          label: 'Jurusan Aktif', 
          value: totalJurusan.toString(), 
          change: `${totalJurusan} jurusan`, 
          trend: 'up',
          textColor: 'text-yellow-400',
          bgGlow: 'bg-yellow-500/20'
        },
        { 
          icon: HiStar, 
          label: 'Mahasiswa Aktif', 
          value: `${((aktif / total) * 100).toFixed(1)}%`, 
          change: `${aktif} dari ${total}`, 
          trend: 'up',
          textColor: 'text-purple-400',
          bgGlow: 'bg-purple-500/20'
        },
      ]);
      
    } catch (error) {
      console.error('Gagal mengambil data mahasiswa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTambahMahasiswa = () => {
    navigate('/mahasiswa');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-gray-700/50 p-8">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl">👋</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Selamat Datang, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user?.username}</span>!
                </h1>
                <p className="text-gray-400 mt-2 flex items-center gap-2">
                  <HiClock className="text-lg" />
                  {new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-700">
                <HiUserGroup className="text-blue-400" />
                <span className="text-sm text-gray-300">{user?.email || user?.gmail}</span>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-700">
                <HiAcademicCap className="text-purple-400" />
                <span className="text-sm text-gray-300">ID: {user?.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Data Real dari Database */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${stat.bgGlow} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`text-3xl ${stat.textColor}`} />
                </div>
                
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                    stat.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {stat.trend === 'up' ? <HiArrowUp className="text-xs" /> : <HiArrowDown className="text-xs" />}
                    <span className="text-xs font-medium">{stat.change}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton 
            icon="➕" 
            label="Tambah Mahasiswa" 
            onClick={handleTambahMahasiswa}
            gradient="from-blue-600 to-blue-400"
          />
          <QuickActionButton 
            icon="📊" 
            label="Lihat Mahasiswa" 
            onClick={handleTambahMahasiswa}
            gradient="from-green-600 to-green-400"
          />
          <QuickActionButton 
            icon="📧" 
            label="Kontak" 
            onClick={() => navigate('/contact')}
            gradient="from-purple-600 to-purple-400"
          />
          <QuickActionButton 
            icon="ℹ️" 
            label="Tentang" 
            onClick={() => navigate('/about')}
            gradient="from-gray-600 to-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

const QuickActionButton = ({ icon, label, onClick, gradient }) => (
  <button 
    onClick={onClick}
    className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${gradient} p-4 hover:shadow-2xl hover:scale-105 transition-all duration-300`}
  >
    <div className="relative z-10 text-center">
      <span className="text-2xl mb-2 block">{icon}</span>
      <span className="text-sm font-medium text-white">{label}</span>
    </div>
  </button>
);

export default Home;