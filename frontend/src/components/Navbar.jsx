import { Link, useNavigate } from 'react-router-dom';
import { 
  HiHome, 
  HiUserGroup, 
  HiInformationCircle, 
  HiMail, 
  HiLogout,
  HiChevronDown,
  HiSparkles
} from 'react-icons/hi';
import { useState } from 'react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg group-hover:blur-xl transition-all opacity-50"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-xl">UTS</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white">React-Lanjutan</h1>
            </div>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/" icon={<HiHome />} text="Beranda" />
              <NavLink to="/mahasiswa" icon={<HiUserGroup />} text="Mahasiswa" />
              <NavLink to="/about" icon={<HiInformationCircle />} text="Tentang" />
              <NavLink to="/contact" icon={<HiMail />} text="Kontak" />
            </div>
          )}

          {/* User Section */}
          {user && (
            <div className="flex items-center gap-4">
              {/* User Menu - Klik username untuk munculin logout */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-2xl transition-all border border-gray-700"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-white">{user.username}</p>
                    <p className="text-xs text-gray-400">{user.email || user.gmail}</p>
                  </div>
                  <HiChevronDown className={`text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu - Hanya Logout */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 py-2 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <HiLogout className="text-lg" />
                      <span className="text-sm font-medium">Keluar</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Premium Badge */}
              <div className="hidden lg:flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1.5 rounded-full border border-yellow-500/30">
                <HiSparkles className="text-yellow-400 text-sm" />
                <span className="text-xs text-yellow-400 font-medium">PREMIUM</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-2 z-50">
          <div className="flex justify-around items-center">
            <MobileNavLink to="/" icon={<HiHome />} text="Home" />
            <MobileNavLink to="/mahasiswa" icon={<HiUserGroup />} text="Mhs" />
            <MobileNavLink to="/about" icon={<HiInformationCircle />} text="About" />
            <MobileNavLink to="/contact" icon={<HiMail />} text="Contact" />
          </div>
        </div>
      )}
    </nav>
  );
};

// NavLink untuk desktop
const NavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all group"
  >
    <span className="text-lg group-hover:text-blue-400 transition-colors">{icon}</span>
    <span className="text-sm font-medium">{text}</span>
  </Link>
);

// Mobile navigation link
const MobileNavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex flex-col items-center p-2 text-gray-400 hover:text-blue-400 transition-colors"
  >
    <span className="text-xl">{icon}</span>
    <span className="text-xs mt-1">{text}</span>
  </Link>
);

export default Navbar;