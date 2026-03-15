import { Link } from 'react-router-dom';
import { 
  HiHeart, 
  HiCode, 
  HiMail, 
  HiPhone, 
  HiLocationMarker,
  HiUserGroup,
  HiAcademicCap,
  HiSparkles
} from 'react-icons/hi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800/50 mt-12">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <HiSparkles className="text-white text-sm" />
              </div>
              <h3 className="text-white font-bold">UTS React Lanjutan</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sistem Informasi Mahasiswa untuk Ujian Tengah Semester mata kuliah React Lanjutan tahun 2026.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <HiHeart className="text-pink-500" />
              <span className="text-xs text-gray-500">Dibuat dengan cinta</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Menu Cepat</h4>
            <ul className="space-y-2">
              <FooterLink to="/" text="Beranda" />
              <FooterLink to="/mahasiswa" text="Data Mahasiswa" />
              <FooterLink to="/about" text="Tentang" />
              <FooterLink to="/contact" text="Kontak" />
            </ul>
          </div>

          {/* Statistics */}
          <div>
            <h4 className="text-white font-semibold mb-4">Statistik</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <HiUserGroup className="text-blue-400" />
                <span>Total Mahasiswa: 1,247</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <HiAcademicCap className="text-green-400" />
                <span>Rata-rata IPK: 3.45</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <HiCode className="text-purple-400" />
                <span>Teknologi: React, Node.js</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <HiMail className="text-blue-400" />
                <span>support@utsreact.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <HiPhone className="text-green-400" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <HiLocationMarker className="text-purple-400" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              © {currentYear} UTS React Lanjutan. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-600">v1.0.0</span>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <span className="text-xs text-gray-600">Ujian Tengah Semester</span>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <span className="text-xs text-gray-600">2026</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, text }) => (
  <li>
    <Link 
      to={to} 
      className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
    >
      {text}
    </Link>
  </li>
);

export default Footer;