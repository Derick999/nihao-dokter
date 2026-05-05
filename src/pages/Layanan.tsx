import { Activity, HeartPulse, MessageCircle, ShoppingBag, Sparkles, Scale, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doctors } from '../data/doctors';
import { getStoredUser } from '../utils/auth';

type LayananProps = {
  onOpenChat: (doctor: { name: string; img: string }) => void;
};

export default function Layanan({ onOpenChat }: LayananProps) {
  const user = getStoredUser();
  const displayName = user?.fullName || user?.username || 'siapa';
  const storedHeight = user?.height || localStorage.getItem('userHeight') || '';
  const storedWeight = user?.weight || localStorage.getItem('userWeight') || '';
  const rawHeight = Number.parseFloat(storedHeight.replace(',', '.'));
  const rawWeight = Number.parseFloat(storedWeight.replace(',', '.'));
  const hasPhysicalData = Number.isFinite(rawHeight) && rawHeight > 0 && Number.isFinite(rawWeight) && rawWeight > 0;
  const bmi = hasPhysicalData ? rawWeight / ((rawHeight / 100) * (rawHeight / 100)) : null;
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isDataIncomplete = Boolean(user) && !hasPhysicalData;

  const bmiStatus = (() => {
    if (!isLoggedIn) {
      return { label: 'Login untuk cek BMI', color: 'bg-gray-100 text-gray-600' };
    }
    if (isDataIncomplete) {
      return { label: 'Data belum lengkap', color: 'bg-sky-100 text-sky-700' };
    }
    if (bmi < 18.5) {
      return { label: 'Berat Rendah', color: 'bg-amber-100 text-amber-700' };
    }
    if (bmi < 25) {
      return { label: 'Normal/Ideal', color: 'bg-emerald-100 text-emerald-700' };
    }
    if (bmi < 30) {
      return { label: 'Berat Berlebih', color: 'bg-orange-100 text-orange-700' };
    }
    return { label: 'Obesitas', color: 'bg-red-100 text-red-700' };
  })();

  const aiSuggestion = (() => {
    if (!isLoggedIn) {
      return 'Lengkapi tinggi dan berat badanmu untuk mendapatkan saran personal dari Nihao AI.';
    }
    if (isDataIncomplete) {
      return 'Profilmu sudah tersimpan, tapi tinggi dan berat badan belum lengkap. Lengkapi dulu untuk mendapat insight personal.';
    }
    if (bmi < 18.5) {
      return 'Tingkatkan asupan nutrisi seimbang dan pertimbangkan konsultasi untuk optimasi berat badan.';
    }
    if (bmi < 25) {
      return 'Pertahankan pola makan sehat, tidur cukup, dan aktivitas fisik rutin agar tetap ideal.';
    }
    if (bmi < 30) {
      return 'Jaga pola makan, perbanyak aktivitas ringan, dan pantau berat badan secara berkala.';
    }
    return 'Mulai perubahan bertahap pada pola makan dan konsultasikan target kesehatan dengan dokter.';
  })();

  return (
    <main className="flex-grow bg-white">
      {/* Header */}
     <section className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Layanan <span className="text-[#268489]">Kesehatan</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami menyediakan berbagai layanan medis terintegrasi untuk memastikan kesehatan Anda dan keluarga selalu terjaga.
          </p>
        </div>
      </section>

      <section className="bg-[#f1faf9] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {user ? (
            <>
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900">Halo, {displayName}! Pantau kesehatanmu di sini.</h2>
                <p className="mt-3 max-w-2xl text-gray-600">Ringkasan ini dibuat dari data profil kesehatanmu untuk membantu pemantauan harian yang lebih praktis.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7F4] text-[#268489]">
                    <Scale className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Indeks Massa Tubuh (BMI)</h3>
                  <p className="mt-4 text-4xl font-extrabold text-[#268489]">{bmi !== null ? bmi.toFixed(1) : 'Data belum lengkap'}</p>
                  <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-medium ${bmiStatus.color}`}>
                    {bmiStatus.label}
                  </span>
                  {!hasPhysicalData && (
                    <Link to="/register" className="mt-4 inline-flex text-sm font-medium text-[#268489] hover:text-[#1f6f73]">
                      Lengkapi profil
                    </Link>
                  )}
                </div>

                <div className="rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7F4] text-[#268489]">
                    <Ruler className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Profil Fisik</h3>
                  <div className="mt-4 space-y-3 text-gray-600">
                    {hasPhysicalData ? (
                      <>
                        <p>Tinggi: {rawHeight} cm</p>
                        <p>Berat: {rawWeight} kg</p>
                      </>
                    ) : (
                      <>
                        <p>Data belum lengkap</p>
                        <Link to="/register" className="inline-flex text-sm font-medium text-[#268489] hover:text-[#1f6f73]">
                          Lengkapi profil fisik
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7F4] text-[#268489]">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Rekomendasi AI</h3>
                  <p className="mt-4 text-gray-600">Berdasarkan BMI-mu, Nihao AI menyarankan: {aiSuggestion}</p>
                </div>

                <div className="rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7F4] text-[#268489]">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Nihao Shop</h3>
                  <p className="mt-4 text-gray-600">Cek vitamin yang cocok buat kamu dan lengkapi kebutuhan kesehatan harianmu.</p>
                  <Link
                    to="/shop"
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-[#268489] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f6f73]"
                  >
                    Ke Nihao Shop
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-3xl bg-white px-6 py-10 text-center shadow-sm border border-white">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7F4] text-[#268489]">
                <HeartPulse className="h-7 w-7" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Login untuk melihat ringkasan kesehatan pribadimu.</h2>
              <p className="mx-auto mt-3 max-w-2xl text-gray-600">Masuk ke akun NihaoDokter untuk melihat BMI, profil fisik, dan rekomendasi kesehatan personal dari Nihao AI.</p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#268489] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1f6f73]"
              >
                Login Sekarang
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Doctors List */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Daftar Dokter</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Pilih dokter spesialis yang sesuai dengan kebutuhan Anda dan mulai konsultasi sekarang.</p>
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
        </div>
      </section>
    </main>
  );
}
