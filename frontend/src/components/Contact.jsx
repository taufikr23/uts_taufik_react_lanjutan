import { HiMail, HiUser, HiCalendar, HiAcademicCap, HiUserGroup, HiHeart, HiSparkles } from 'react-icons/hi';

const Contact = () => {
  const contacts = [
    {
      name: 'Taufik Rahman Tanjung',
      ttl: 'Sibolga, 19 Desember 2006',
      pelatihan: 'React Lanjutan',
      instruktur: 'Teh Eka & A Ikmal',
      nim: '2024001',
      email: 'taufik@student.com',
      icon: HiUser,
      color: 'from-blue-500 to-blue-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-teal-600 p-8 text-white text-center mb-6">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <HiUserGroup className="text-5xl mx-auto mb-3" />
              <h1 className="text-3xl font-bold mb-2">Contact Person</h1>
              <p className="text-green-100">Informasi Peserta UTS React Lanjutan 2026</p>
            </div>
          </div>

          {/* Contact Card */}
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 mb-6 hover:shadow-2xl hover:shadow-green-500/10 transition-all"
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Avatar */}
                <div className={`w-24 h-24 bg-gradient-to-br ${contact.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  <contact.icon className="text-4xl" />
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {contact.name}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoBox
                      icon={<HiCalendar />}
                      label="Tempat, Tanggal Lahir"
                      value={contact.ttl}
                    />
                    <InfoBox
                      icon={<HiAcademicCap />}
                      label="Pelatihan"
                      value={contact.pelatihan}
                    />
                    <InfoBox
                      icon={<HiUserGroup />}
                      label="Instruktur"
                      value={contact.instruktur}
                    />
                    <InfoBox
                      icon={<HiMail />}
                      label="Email"
                      value={contact.email}
                    />
                    <InfoBox
                      icon={<HiUser />}
                      label="NIM"
                      value={contact.nim}
                    />
                    <InfoBox
                      icon={<HiSparkles />}
                      label="Status"
                      value="Aktif"
                      badge
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Ucapan Terima Kasih */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 mb-6 text-center">
            <HiHeart className="text-5xl text-pink-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Terima Kasih Kepada
            </h3>
            <p className="text-gray-300 text-lg mb-2">
              <span className="font-semibold text-purple-400">Teh Eka</span> &{' '}
              <span className="font-semibold text-pink-400">A Ikmal</span>
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Yang telah membimbing dan mengajarkan kami dengan sabar dalam Pelatihan React Lanjutan. 
              Ilmu yang diberikan sangat bermanfaat untuk pengembangan diri kami ke depannya.
            </p>
            
            {/* Quotes */}
            <div className="mt-6 pt-6 border-t border-purple-500/30">
              <p className="text-gray-400 italic">
                "Terima kasih atas dedikasi dan kesabarannya dalam membimbing kami. 
                Semoga kebailan selalu menyertai."
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <HiMail className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Informasi Tambahan</h3>
                <p className="text-gray-400 text-sm">
                  Untuk pertanyaan lebih lanjut, silakan hubungi instruktur atau 
                  asisten dosen melalui email atau platform pembelajaran yang tersedia.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              © 2026 UTS React Lanjutan | Dibuat dengan ❤️ untuk penilaian
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ icon, label, value, badge = false }) => (
  <div className="flex items-start gap-3">
    <div className="text-gray-500 mt-1">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      {badge ? (
        <span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium mt-1 border border-green-500/30">
          {value}
        </span>
      ) : (
        <p className="text-gray-300 font-medium">{value}</p>
      )}
    </div>
  </div>
);

export default Contact;