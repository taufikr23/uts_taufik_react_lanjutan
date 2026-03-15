import { HiAcademicCap, HiCode, HiChip, HiShieldCheck } from 'react-icons/hi';

const About = () => {
  const technologies = [
    {
      category: "Frontend",
      icon: HiCode,
      gradient: "from-blue-500 to-blue-400",
      items: ["React 18", "Tailwind CSS v4", "React Router v6", "Axios"]
    },
    {
      category: "Backend",
      icon: HiChip,
      gradient: "from-green-500 to-green-400",
      items: ["Node.js", "Express", "PostgreSQL", "JWT"]
    },
    {
      category: "Keamanan",
      icon: HiShieldCheck,
      gradient: "from-purple-500 to-purple-400",
      items: ["Bcrypt", "HTTP Only Cookies", "CORS", "Environment Variables"]
    }
  ];

  const features = [
    "Autentikasi dengan JWT & Cookies",
    "CRUD Mahasiswa lengkap",
    "Status Active/Inactive dengan warna berbeda",
    "Toggle status aktif",
    "Desain responsif",
    "Protected routes"
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center mb-6">
            <HiAcademicCap className="text-5xl mx-auto mb-3" />
            <h1 className="text-3xl font-bold mb-2">Tentang Website Mahasiswa</h1>
            <p className="text-blue-100">Sistem Informasi Akademik Modern</p>
          </div>

          {/* Description */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 mb-6">
            <p className="text-gray-300 leading-relaxed">
              Website ini dikembangkan sebagai bagian dari Ujian Tengah Semester 
              mata kuliah React Lanjutan. Dibangun dengan teknologi modern untuk 
              memudahkan manajemen data mahasiswa.
            </p>
          </div>

          {/* Technologies */}
          <h2 className="text-xl font-bold text-white mb-4">Teknologi yang Digunakan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {technologies.map((tech, index) => (
              <TechCard
                key={index}
                category={tech.category}
                icon={tech.icon}
                gradient={tech.gradient}
                items={tech.items}
              />
            ))}
          </div>

          {/* Features */}
          <h2 className="text-xl font-bold text-white mb-4">Fitur Unggulan</h2>
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <FeatureItem key={index} text={feature} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TechCard = ({ category, icon: Icon, gradient, items }) => (
  <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-5">
    <div className={`w-10 h-10 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center mb-3`}>
      <Icon className="text-lg text-white" />
    </div>
    <h3 className="text-white font-semibold mb-3">{category}</h3>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
          <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const FeatureItem = ({ text }) => (
  <div className="flex items-center gap-2 text-gray-300">
    <span className="text-green-400 text-lg">✓</span>
    <span className="text-sm">{text}</span>
  </div>
);

export default About;