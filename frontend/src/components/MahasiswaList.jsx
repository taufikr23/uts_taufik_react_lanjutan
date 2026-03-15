import { useState, useEffect } from 'react';
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiSearch,
  HiX,
  HiUserAdd,
  HiRefresh,
  HiUser,
  HiAcademicCap,
  HiIdentification,
  HiStar,
  HiChevronLeft,
  HiChevronRight,
  HiViewGrid,
  HiViewList
} from 'react-icons/hi';
import api from '../api/axios';
import Cookies from 'js-cookie';

const MahasiswaList = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    jurusan: '',
    ipk: '',
    isActive: true
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchMahasiswa();
  }, []);

  const fetchMahasiswa = async () => {
    try {
      setLoading(true);
      const response = await api.get('/mahasiswa');
      setMahasiswa(response.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Sesi berakhir. Silakan login ulang.');
        setTimeout(() => {
          Cookies.remove('token');
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(err.response?.data?.message || 'Gagal mengambil data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openModal = (mhs = null) => {
    if (mhs) {
      setFormData({
        name: mhs.name,
        nim: mhs.nim,
        jurusan: mhs.jurusan,
        ipk: mhs.ipk,
        isActive: mhs.isactive
      });
      setEditingId(mhs.id);
    } else {
      setFormData({
        name: '',
        nim: '',
        jurusan: '',
        ipk: '',
        isActive: true
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/mahasiswa/${editingId}`, formData);
      } else {
        await api.post('/mahasiswa', formData);
      }
      fetchMahasiswa();
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await api.delete(`/mahasiswa/${id}`);
        fetchMahasiswa();
      } catch (err) {
        setError('Gagal menghapus data');
      }
    }
  };

  const toggleActive = async (id) => {
    try {
      await api.patch(`/mahasiswa/${id}/toggle-active`);
      fetchMahasiswa();
    } catch (err) {
      setError('Gagal mengubah status');
    }
  };

  // Filter dan Pagination
  const filteredMahasiswa = mahasiswa.filter(m => {
    const matchesSearch = 
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nim?.includes(searchTerm) ||
      m.jurusan?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'active' ? m.isactive :
      filterStatus === 'inactive' ? !m.isactive : true;
    
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMahasiswa.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMahasiswa.length / itemsPerPage);

  const totalActive = mahasiswa.filter(m => m.isactive).length;
  const totalInactive = mahasiswa.length - totalActive;
  const averageIpk = (mahasiswa.reduce((acc, m) => acc + parseFloat(m.ipk), 0) / mahasiswa.length).toFixed(2) || '0.00';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin blur-sm"></div>
        </div>
        <p className="mt-4 text-gray-400 animate-pulse">Memuat data mahasiswa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Data Mahasiswa</h1>
          <p className="text-gray-400">Kelola data mahasiswa dengan mudah dan cepat</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={<HiUser className="text-2xl" />}
            label="Total Mahasiswa" 
            value={mahasiswa.length} 
            color="blue"
          />
          <StatCard 
            icon={<HiStar className="text-2xl" />}
            label="Aktif" 
            value={totalActive} 
            color="green"
            percentage={mahasiswa.length ? ((totalActive / mahasiswa.length) * 100).toFixed(1) : 0}
          />
          <StatCard 
            icon={<HiUser className="text-2xl" />}
            label="Non-Aktif" 
            value={totalInactive} 
            color="red"
            percentage={mahasiswa.length ? ((totalInactive / mahasiswa.length) * 100).toFixed(1) : 0}
          />
          <StatCard 
            icon={<HiAcademicCap className="text-2xl" />}
            label="Rata-rata IPK" 
            value={averageIpk} 
            color="purple"
          />
        </div>

        {/* Toolbar */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Cari nama, NIM, atau jurusan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Non-Aktif</option>
              </select>

              <div className="flex bg-gray-700/50 rounded-xl border border-gray-600 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <HiViewGrid className="text-xl" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="List View"
                >
                  <HiViewList className="text-xl" />
                </button>
              </div>

              <button
                onClick={() => openModal()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                <HiPlus />
                <span className="hidden md:inline">Tambah</span>
              </button>

              <button
                onClick={fetchMahasiswa}
                className="bg-gray-700/50 text-gray-400 hover:text-white p-3 rounded-xl hover:bg-gray-600 transition-all"
                title="Refresh"
              >
                <HiRefresh className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Content */}
        {filteredMahasiswa.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentItems.map((m, index) => (
                  <MahasiswaCard
                    key={m.id}
                    mahasiswa={m}
                    index={indexOfFirstItem + index + 1}
                    onEdit={openModal}
                    onDelete={handleDelete}
                    onToggle={toggleActive}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">No</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Nama</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">NIM</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Jurusan</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">IPK</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {currentItems.map((m, index) => (
                        <tr key={m.id} className="hover:bg-gray-700/50 transition group">
                          <td className="px-6 py-4 text-sm text-gray-400">{indexOfFirstItem + index + 1}</td>
                          <td className="px-6 py-4 font-medium text-white">{m.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{m.nim}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{m.jurusan}</td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-white">{m.ipk}</span>
                          </td>
                          <td className="px-6 py-4">
                            <ToggleSwitch 
                              isActive={m.isactive} 
                              onToggle={() => toggleActive(m.id)}
                              size="sm"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <ActionButton
                                onClick={() => openModal(m)}
                                color="blue"
                                icon={<HiPencil />}
                                title="Edit"
                              />
                              <ActionButton
                                onClick={() => handleDelete(m.id)}
                                color="red"
                                icon={<HiTrash />}
                                title="Hapus"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredMahasiswa.length)} dari {filteredMahasiswa.length} data
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 transition"
                  >
                    <HiChevronLeft />
                  </button>
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition"
                  >
                    <HiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-12 text-center">
            <HiUserAdd className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Data Mahasiswa</h3>
            <p className="text-gray-400 mb-6">Mulai dengan menambahkan data mahasiswa baru</p>
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl inline-flex items-center gap-2 hover:shadow-lg transition"
            >
              <HiPlus />
              Tambah Data Mahasiswa
            </button>
          </div>
        )}

        {/* Modal Form */}
        {showModal && (
          <ModalForm
            editingId={editingId}
            formData={formData}
            onClose={() => setShowModal(false)}
            onSubmit={handleSubmit}
            onChange={handleInputChange}
          />
        )}
      </div>
    </div>
  );
};

// Komponen Toggle Switch - YANG DIPERBAIKI
const ToggleSwitch = ({ isActive, onToggle, size = 'md' }) => {
  const sizes = {
    sm: {
      switch: 'w-10 h-5',
      circle: 'w-4 h-4',
      translate: 'translate-x-5'
    },
    md: {
      switch: 'w-12 h-6',
      circle: 'w-5 h-5',
      translate: 'translate-x-6'
    },
    lg: {
      switch: 'w-14 h-7',
      circle: 'w-6 h-6',
      translate: 'translate-x-7'
    }
  };

  const currentSize = sizes[size];

  return (
    <button
      onClick={onToggle}
      className={`relative ${currentSize.switch} rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 ${
        isActive ? 'bg-green-500' : 'bg-gray-600'
      }`}
      role="switch"
      aria-checked={isActive}
    >
      <span
        className={`absolute left-0.5 top-0.5 ${currentSize.circle} bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isActive ? currentSize.translate : 'translate-x-0'
        }`}
      />
    </button>
  );
};

// Komponen Card untuk setiap mahasiswa
const MahasiswaCard = ({ mahasiswa, index, onEdit, onDelete, onToggle }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="group bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all hover:-translate-y-1">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${
            mahasiswa.isactive 
              ? 'from-green-500 to-green-400' 
              : 'from-gray-600 to-gray-500'
          } rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {getInitials(mahasiswa.name)}
          </div>
          <div>
            <span className="text-xs text-gray-500">#{index}</span>
            <h3 className="font-semibold text-white">{mahasiswa.name}</h3>
          </div>
        </div>
        <ToggleSwitch 
          isActive={mahasiswa.isactive} 
          onToggle={() => onToggle(mahasiswa.id)}
          size="sm"
        />
      </div>

      {/* Card Body */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-sm">
          <HiIdentification className="text-gray-500" />
          <span className="text-gray-300">{mahasiswa.nim}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <HiAcademicCap className="text-gray-500" />
          <span className="text-gray-300">{mahasiswa.jurusan}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <HiStar className="text-gray-500" />
          <span className="text-gray-300">IPK: <span className="font-semibold text-white">{mahasiswa.ipk}</span></span>
        </div>
      </div>

      {/* Card Footer - Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-700/50">
        <button
          onClick={() => onEdit(mahasiswa)}
          className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition flex items-center justify-center gap-1"
        >
          <HiPencil />
          Edit
        </button>
        <button
          onClick={() => onDelete(mahasiswa.id)}
          className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition flex items-center justify-center gap-1"
        >
          <HiTrash />
          Hapus
        </button>
      </div>
    </div>
  );
};

// Komponen Stat Card
const StatCard = ({ icon, label, value, color, percentage }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-400',
    green: 'from-green-500 to-green-400',
    red: 'from-red-500 to-red-400',
    purple: 'from-purple-500 to-purple-400'
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 hover:shadow-xl transition">
      <div className="flex items-start justify-between mb-2">
        <div className={`w-12 h-12 bg-gradient-to-br ${colors[color]} rounded-xl flex items-center justify-center text-white`}>
          {icon}
        </div>
        {percentage !== undefined && (
          <span className="text-xs text-gray-400">{percentage}%</span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className={`text-3xl font-bold bg-gradient-to-r ${colors[color]} bg-clip-text text-transparent`}>
        {value}
      </p>
    </div>
  );
};

// Komponen Action Button
const ActionButton = ({ onClick, color, icon, title }) => {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30',
    red: 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg ${colors[color]} transition hover:scale-110`}
      title={title}
    >
      {icon}
    </button>
  );
};

// Komponen Modal Form
const ModalForm = ({ editingId, formData, onClose, onSubmit, onChange }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {editingId ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition"
        >
          <HiX className="text-xl" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <FormField
          label="Nama Lengkap"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Masukkan nama lengkap"
          required
        />
        
        <FormField
          label="NIM"
          name="nim"
          value={formData.nim}
          onChange={onChange}
          placeholder="Masukkan NIM"
          required
        />
        
        <FormField
          label="Jurusan"
          name="jurusan"
          value={formData.jurusan}
          onChange={onChange}
          placeholder="Masukkan jurusan"
          required
        />
        
        <FormField
          label="IPK"
          name="ipk"
          type="number"
          step="0.01"
          min="0"
          max="4"
          value={formData.ipk}
          onChange={onChange}
          placeholder="0.00 - 4.00"
          required
        />

        <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl border border-gray-600">
          <span className="text-gray-300 font-medium">Status Aktif</span>
          <ToggleSwitch 
            isActive={formData.isActive} 
            onToggle={() => {
              const event = {
                target: {
                  name: 'isActive',
                  type: 'checkbox',
                  checked: !formData.isActive
                }
              };
              onChange(event);
            }}
            size="md"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            {editingId ? 'Update' : 'Simpan'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-700 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-600 transition"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
);

// Komponen Form Field
const FormField = ({ label, name, value, onChange, type = 'text', step, min, max, placeholder, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      step={step}
      min={min}
      max={max}
      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default MahasiswaList;