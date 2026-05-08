import { Thermometer, Brain, Wind, ActivitySquare, Stethoscope, Activity, ShoppingBag, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { doctors } from '../data/doctors';

type HomeProps = {
  onOpenChat: (doctor: { name: string; img: string }) => void;
};

export default function Home({ onOpenChat }: HomeProps) {
  const navigate = useNavigate();
  const heroFeatures = [
    { name: 'Chat Dokter', icon: <Stethoscope className="h-6 w-6" />, to: '/layanan' },
    { name: 'Nihao Shop', icon: <ShoppingBag className="h-6 w-6" />, to: '/shop' },
  ];

  const handleProtectedFeatureClick = (target: string) => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      navigate('/login');
      return;
    }

    navigate(target);
  };

  return (
    <main className="flex-grow bg-white">
      <section
        id="hero-section"
        className="bg-[#f1faf9] pb-16 pt-0 sm:pb-20"
        style={{ marginTop: '-1px' }}
      >
        <div
          id="hero-bg"
          className="pointer-events-none absolute inset-0 z-0 opacity-15"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-[#EAF7F4] to-transparent lg:block" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10 pt-4 text-left sm:pt-6 lg:pt-8">
              <p className="mb-4 inline-flex rounded-full border border-[#D32F2F]/10 bg-[#FFF5F5] px-4 py-2 text-sm font-medium text-[#D32F2F]">
                Platform kesehatan digital terpercaya
              </p>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
                Sehat itu Mudah, <br className="hidden sm:block" />
                <span className="text-[#268489]">Gak Pake Antre.</span>
              </h1>
              <p className="mb-10 max-w-2xl text-base text-gray-600 sm:text-lg md:text-xl">
                Konsultasi aman, transaksi terjamin. Solusi kesehatan digital No. 1 untuk masa depan Indonesia.
              </p>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {heroFeatures.map((feature) => (
                  <button
                    key={feature.name}
                    type="button"
                    onClick={() => handleProtectedFeatureClick(feature.to)}
                    className="group flex min-w-[140px] flex-1 flex-col items-center rounded-2xl border border-white/80 bg-white/95 px-4 py-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF7F4] text-[#268489] transition-colors group-hover:bg-[#268489] group-hover:text-white">
                      {feature.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-[#0D503C]">{feature.name}</h3>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-10 lg:mt-0">
              <div className="absolute left-10 top-8 h-72 w-72 rounded-full bg-[#D32F2F]/10 blur-3xl" />
              <div className="absolute bottom-12 right-0 h-72 w-72 rounded-full bg-[#268489]/15 blur-3xl" />
              <img 
                src="/dokternanan.png" 
                alt="fotodokter" 
                className="relative z-10 ml-auto mr-0 w-full max-w-lg object-contain drop-shadow-[0_30px_60px_rgba(15,23,42,0.18)]"
                referrerPolicy="no-referrer"
              />
          
              <div className="absolute bottom-8 left-0 z-20 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF1F1]">
                    <span className="h-3 w-3 rounded-full bg-[#D32F2F] animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dokter Aktif</p>
                    <p className="text-xl font-bold text-gray-900">500+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Cek Gejala Cepat</h2>
            <p className="text-gray-500">Pilih gejala yang Anda rasakan untuk rekomendasi spesialis yang tepat.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/artikel" className="flex items-center rounded-xl border border-orange-200 bg-orange-50 px-6 py-4 font-medium text-orange-700 transition-colors hover:bg-orange-100">
              <Thermometer className="mr-2 h-5 w-5" /> Demam
            </Link>
            <Link to="/artikel" className="flex items-center rounded-xl border border-purple-200 bg-purple-50 px-6 py-4 font-medium text-purple-700 transition-colors hover:bg-purple-100">
              <Brain className="mr-2 h-5 w-5" /> Sakit Kepala
            </Link>
            <Link to="/artikel" className="flex items-center rounded-xl border border-blue-200 bg-blue-50 px-6 py-4 font-medium text-blue-700 transition-colors hover:bg-blue-100">
              <Wind className="mr-2 h-5 w-5" /> Batuk
            </Link>
            <Link to="/artikel" className="flex items-center rounded-xl border border-teal-200 bg-teal-50 px-6 py-4 font-medium text-teal-700 transition-colors hover:bg-teal-100">
              <Wind className="mr-2 h-5 w-5" /> Pilek
            </Link>
            <Link to="/artikel" className="flex items-center rounded-xl border border-yellow-200 bg-yellow-50 px-6 py-4 font-medium text-yellow-700 transition-colors hover:bg-yellow-100">
              <Activity className="mr-2 h-5 w-5" /> Perut
            </Link>
            <Link to="/artikel" className="flex items-center rounded-xl border border-pink-200 bg-pink-50 px-6 py-4 font-medium text-pink-700 transition-colors hover:bg-pink-100">
              <ActivitySquare className="mr-2 h-5 w-5" /> Kulit
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Rekomendasi Dokter</h2>
              <p className="text-gray-500">Konsultasi langsung dengan dokter spesialis kami.</p>
            </div>
            <Link to="/layanan" className="text-[#2E7D32] font-semibold hover:underline hidden sm:block">Lihat Semua</Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="relative">
                  <img 
                    src={doc.img} 
                    alt={doc.name} 
                    className="w-full h-48 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    LIVE ONLINE
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{doc.name}</h3>
                  <p className="text-[#2E7D32] text-sm font-medium mb-3">{doc.spec}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
                    <span className="flex items-center"><Activity className="w-4 h-4 mr-1" /> {doc.exp}</span>
                    <span className="flex items-center text-yellow-500 font-medium">★ {doc.rating}</span>
                  </div>
                  
                  <div className="mt-auto">
                    <button
                      type="button"
                      onClick={() => onOpenChat({ name: doc.name, img: doc.img })}
                      className="w-full flex items-center justify-center bg-[#268489] hover:bg-[#1f6f73] text-white py-2.5 rounded-xl font-medium transition-all duration-300 hover:-translate-y-2"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/layanan" className="text-[#2E7D32] font-semibold hover:underline">Lihat Semua Dokter</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
