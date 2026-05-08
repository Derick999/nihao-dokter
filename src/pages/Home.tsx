import { Thermometer, Brain, Wind, ActivitySquare, Stethoscope, Activity, ShoppingBag, X, Star, ShieldCheck, Users, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doctors } from '../data/doctors';
import { savePendingDoctor } from '../utils/chatFlow';

type HomeProps = {
  onOpenChat: (doctor: { name: string; img: string }) => void;
};

export default function Home({ onOpenChat }: HomeProps) {
  const navigate = useNavigate();
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [isTrustVisible, setIsTrustVisible] = useState(false);
  const [isTestimonialsVisible, setIsTestimonialsVisible] = useState(false);
  const heroFeatures = [
    { name: 'Chat Dokter', icon: <Stethoscope className="h-6 w-6" />, to: '/chat-dokter' },
    { name: 'Nihao Shop', icon: <ShoppingBag className="h-6 w-6" />, to: '/shop' },
  ];
  const doctorReviews = [
    { id: 1, text: 'Dokternya sabar banget jelasin dari awal sampai akhir.', author: 'Nadia, 29' },
    { id: 2, text: 'Saran pengobatan jelas dan mudah dipahami keluarga kami.', author: 'Budi, 35' },
    { id: 3, text: 'Konsultasi cepat tapi tetap detail. Sangat membantu.', author: 'Ratna, 41' },
  ];
  const testimonials = [
    {
      id: 1,
      name: 'Budi Santoso',
      review: 'Konsultasi lewat NihaoDokter cepet banget, dokternya ramah dan solusinya manjur!',
      avatarSeed: 'budi-santoso',
    },
    {
      id: 2,
      name: 'Sarah Wijaya',
      review: 'UI-nya nyaman dipakai, proses pilih dokter sampai chat sangat praktis.',
      avatarSeed: 'sarah-wijaya',
    },
    {
      id: 3,
      name: 'Rina Maharani',
      review: 'Suka banget karena bisa cek saran dokter lagi kapan saja dari riwayat chat.',
      avatarSeed: 'rina-maharani',
    },
    {
      id: 4,
      name: 'Dimas Pratama',
      review: 'Pelayanan responsif, cocok buat yang butuh konsultasi cepat tanpa antre.',
      avatarSeed: 'dimas-pratama',
    },
  ];

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === selectedDoctorId) ?? null,
    [selectedDoctorId],
  );

  const handleProtectedFeatureClick = (target: string) => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      navigate('/login');
      return;
    }

    navigate(target);
  };

  useEffect(() => {
    if (!selectedDoctor) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveReviewIndex((current) => (current + 1) % doctorReviews.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [selectedDoctor, doctorReviews.length]);

  useEffect(() => {
    const trustSection = document.getElementById('trust-indicators');
    const testimonialSection = document.getElementById('customer-testimonials');
    if (!trustSection || !testimonialSection) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          if (entry.target.id === 'trust-indicators') {
            setIsTrustVisible(true);
          }

          if (entry.target.id === 'customer-testimonials') {
            setIsTestimonialsVisible(true);
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(trustSection);
    observer.observe(testimonialSection);
    return () => observer.disconnect();
  }, []);

  const getDoctorPrice = (experience: string) => {
    const years = Number.parseInt(experience, 10);
    if (Number.isNaN(years)) {
      return 75000;
    }
    if (years >= 10) {
      return 130000;
    }
    if (years >= 8) {
      return 110000;
    }
    if (years >= 6) {
      return 90000;
    }
    return 75000;
  };

  const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`;

  const handleChooseDoctor = (doctorId: number) => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      navigate('/login');
      return;
    }
    setSelectedDoctorId(doctorId);
    setActiveReviewIndex(0);
  };

  const handleProceedBooking = () => {
    if (!selectedDoctor) {
      return;
    }

    const doctorTitle = selectedDoctor.spec.includes('Spesialis') ? selectedDoctor.spec.replace('Spesialis ', 'Sp.') : 'Dokter Umum';

    savePendingDoctor({
      doctorName: selectedDoctor.name,
      doctorTitle,
      specialization: selectedDoctor.spec,
      avatarSeed: selectedDoctor.name,
      price: getDoctorPrice(selectedDoctor.exp),
    });

    setSelectedDoctorId(null);
    navigate('/pilih-pasien');
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
                    className="group flex min-w-[140px] flex-1 flex-col items-center rounded-2xl border border-white/80 bg-white/95 px-4 py-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.99]"
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

      <section
        id="trust-indicators"
        className={`bg-[#F5FBFC] py-16 transition-all duration-700 ${
          isTrustVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Dipercaya Ribuan Pengguna</h2>
            <p className="mt-3 text-gray-600">Komitmen layanan kesehatan digital yang cepat, aman, dan tepercaya.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <article className="rounded-2xl border border-[#D9EEEF] bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6F6] text-[#268489]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-2xl font-extrabold leading-snug text-[#0D503C] sm:text-3xl">
                Lebih dari 100+ Dokter Terpercaya dan Ahli di bidangnya.
              </p>
            </article>

            <article className="rounded-2xl border border-[#D9EEEF] bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6F6] text-[#268489]">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-2xl font-extrabold leading-snug text-[#0D503C] sm:text-3xl">
                Telah membantu lebih dari 10.000+ Pasien Online secara instan.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Rekomendasi Dokter</h2>
              <p className="text-gray-500">Konsultasi langsung dengan dokter spesialis kami.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {doctors.slice(0, 3).map((doc) => (
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
                    <div className="mb-3 rounded-xl border border-[#E2F0EF] bg-[#F5FBFA] px-3 py-2 text-center">
                      <p className="text-xs text-gray-500">Mulai dari</p>
                      <p className="text-sm font-bold text-[#0D503C]">{formatPrice(getDoctorPrice(doc.exp))}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChooseDoctor(doc.id)}
                      className="w-full flex items-center justify-center bg-[#268489] hover:bg-[#1f6f73] text-white py-2.5 rounded-xl font-medium transition-all duration-300 hover:-translate-y-2"
                    >
                      Pilih
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => navigate('/chat-dokter')}
              className="hidden lg:flex h-full min-h-[360px] items-center justify-center rounded-2xl border border-[#D7ECEC] bg-[#F3FAFA] text-[#268489] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md"
            >
              <span className="inline-flex flex-col items-center gap-2 rounded-2xl bg-white px-6 py-5 shadow-sm">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#268489] text-white">
                  <ArrowRight className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold">Lihat Semua</span>
              </span>
            </button>
          </div>

          <div className="mt-6 flex justify-center lg:hidden">
            <button
              type="button"
              onClick={() => navigate('/chat-dokter')}
              className="inline-flex items-center gap-2 rounded-full bg-[#268489] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1f6f73] hover:shadow-md active:scale-[0.98]"
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section
        id="customer-testimonials"
        className={`bg-[#F9FCFD] py-16 transition-all duration-700 ${
          isTestimonialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Apa Kata Mereka?</h2>
            <p className="mt-3 text-gray-600">Cerita singkat dari pasien yang sudah merasakan manfaat NihaoDokter.</p>
          </div>

          <div className="grid snap-x snap-mandatory grid-cols-1 gap-5 overflow-x-auto pb-2 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((item) => (
              <article
                key={item.id}
                className="min-w-[260px] snap-start rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.avatarSeed}`}
                    alt={item.name}
                    className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">Pasien NihaoDokter</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">{item.review}</p>
                <div className="mt-4 flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={`${item.id}-${index}`} className="h-4 w-4 fill-current" />
                  ))}
                  <span className="ml-2 text-xs font-semibold text-amber-600">5.0/5.0</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selectedDoctor && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDoctor.img}
                  alt={selectedDoctor.name}
                  className="h-14 w-14 rounded-full border border-slate-200 bg-slate-100"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedDoctor.name}</h3>
                  <p className="text-sm font-medium text-[#268489]">{selectedDoctor.spec}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoctorId(null)}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-slate-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6">
              <div className="rounded-2xl border border-slate-200 bg-[#F8FCFC] p-4">
                <p className="text-sm text-gray-700">
                  Dokter berpengalaman {selectedDoctor.exp} dalam layanan konsultasi digital. Fokus pada penanganan
                  awal, edukasi pasien, dan tindak lanjut berbasis kondisi Anda.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  Rating {selectedDoctor.rating}/5.0
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Ulasan Pasien</p>
                <blockquote className="text-sm font-medium text-gray-700">"{doctorReviews[activeReviewIndex].text}"</blockquote>
                <p className="mt-2 text-xs text-gray-500">- {doctorReviews[activeReviewIndex].author}</p>
                <div className="mt-3 flex gap-1.5">
                  {doctorReviews.map((review, index) => (
                    <span
                      key={review.id}
                      className={`h-1.5 w-6 rounded-full ${index === activeReviewIndex ? 'bg-[#268489]' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                  Biaya konsultasi: <span className="font-bold text-[#0D503C]">{formatPrice(getDoctorPrice(selectedDoctor.exp))}</span>
                </p>
                <button
                  type="button"
                  onClick={handleProceedBooking}
                  className="inline-flex items-center justify-center rounded-full bg-[#268489] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1f6f73]"
                >
                  Pilih
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
