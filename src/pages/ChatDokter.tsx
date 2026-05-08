import { Clock3, ShieldCheck, Star, Stethoscope, Baby, Ear, HeartPulse, Brain } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser } from '../utils/auth';
import { getActiveSession, isSessionStillActive, savePendingDoctor, type BookingDoctor } from '../utils/chatFlow';
import BackButton from '../components/BackButton';

type SpecialtyFilter = 'Semua' | 'Umum' | 'Anak' | 'THT' | 'Jantung' | 'Psikologi';

type DoctorRecommendation = {
  id: number;
  name: string;
  title: string;
  specialization: SpecialtyFilter;
  experience: string;
  price: number;
  avatarSeed: string;
  credentials: string;
  bio: string;
  reviews: Array<{ id: number; text: string; author: string }>;
};

const specialtyFilters: Array<{ id: SpecialtyFilter; label: string; icon: ReactNode }> = [
  { id: 'Semua', label: 'Semua', icon: <Stethoscope className="h-5 w-5" /> },
  { id: 'Umum', label: 'Umum', icon: <ShieldCheck className="h-5 w-5" /> },
  { id: 'Anak', label: 'Anak', icon: <Baby className="h-5 w-5" /> },
  { id: 'THT', label: 'THT', icon: <Ear className="h-5 w-5" /> },
  { id: 'Jantung', label: 'Jantung', icon: <HeartPulse className="h-5 w-5" /> },
  { id: 'Psikologi', label: 'Psikologi', icon: <Brain className="h-5 w-5" /> },
];

const popularDoctors: DoctorRecommendation[] = [
  {
    id: 1,
    name: 'Dr. Daniel Paskalist',
    title: 'Sp.Um',
    specialization: 'Umum',
    experience: '5 Tahun',
    price: 75000,
    avatarSeed: 'dr-daniel-paskalist',
    credentials: 'SIP Aktif, Alumni Fakultas Kedokteran UI, 5+ tahun praktik klinis.',
    bio: 'Fokus pada keluhan umum harian, skrining gejala awal, dan edukasi pasien yang mudah dipahami.',
    reviews: [
      { id: 1, text: 'Dokter sangat jelas menjelaskan langkah perawatan di rumah.', author: 'Nadya, 29' },
      { id: 2, text: 'Respon cepat dan komunikatif, sangat membantu saat butuh cepat.', author: 'Agus, 34' },
      { id: 3, text: 'Anjuran obat dan pola istirahatnya efektif.', author: 'Siska, 31' },
    ],
  },
  {
    id: 2,
    name: 'Dr. Vivi Florencia',
    title: 'Sp.A',
    specialization: 'Anak',
    experience: '8 Tahun',
    price: 110000,
    avatarSeed: 'dr-vivi-florencia',
    credentials: 'Spesialis Anak, pengalaman 8 tahun di layanan tumbuh kembang.',
    bio: 'Mendampingi konsultasi kesehatan anak dengan pendekatan ramah keluarga dan berbasis bukti.',
    reviews: [
      { id: 1, text: 'Dokter sabar banget jawab pertanyaan orang tua baru.', author: 'Tika, 27' },
      { id: 2, text: 'Penjelasan dosis obat anak sangat detail.', author: 'Beni, 35' },
      { id: 3, text: 'Follow-up jelas, jadi lebih tenang.', author: 'Rani, 30' },
    ],
  },
  {
    id: 3,
    name: 'Dr. Kevin Nugraha',
    title: 'Sp.JP',
    specialization: 'Jantung',
    experience: '10 Tahun',
    price: 130000,
    avatarSeed: 'dr-kevin-nugraha',
    credentials: 'Spesialis Jantung, 10+ tahun pengalaman klinis dan telekonsultasi.',
    bio: 'Berfokus pada evaluasi gejala kardiovaskular awal dan rekomendasi perubahan gaya hidup jangka panjang.',
    reviews: [
      { id: 1, text: 'Saran pola hidupnya praktis dan bisa langsung diterapkan.', author: 'Riko, 40' },
      { id: 2, text: 'Penjelasan kondisi jantung jadi lebih mudah dipahami.', author: 'Maya, 38' },
      { id: 3, text: 'Konsultasi profesional dan menenangkan.', author: 'Dwi, 45' },
    ],
  },
];

export default function ChatDokter() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSessionSnapshot, setActiveSessionSnapshot] = useState(getActiveSession());
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyFilter>('Semua');
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  useEffect(() => {
    setIsLoggedIn(Boolean(getStoredUser()));
    setActiveSessionSnapshot(getActiveSession());
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSessionSnapshot(getActiveSession());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const selectedDoctor = useMemo(
    () => popularDoctors.find((doctor) => doctor.id === selectedDoctorId) ?? null,
    [selectedDoctorId],
  );
  const filteredDoctors = useMemo(
    () =>
      selectedSpecialty === 'Semua'
        ? popularDoctors
        : popularDoctors.filter((doctor) => doctor.specialization === selectedSpecialty),
    [selectedSpecialty],
  );

  useEffect(() => {
    if (!selectedDoctor) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveReviewIndex((current) => (current + 1) % selectedDoctor.reviews.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [selectedDoctor]);

  const hasActiveSession = Boolean(
    activeSessionSnapshot && isSessionStillActive(activeSessionSnapshot.startedAt),
  );

  const handleSelectDoctor = (doctor: DoctorRecommendation) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setSelectedDoctorId(doctor.id);
    setActiveReviewIndex(0);
  };

  const handleProceedBooking = () => {
    if (!selectedDoctor) {
      return;
    }

    const pendingDoctor: BookingDoctor = {
      doctorName: selectedDoctor.name,
      doctorTitle: selectedDoctor.title,
      specialization: `Spesialis ${selectedDoctor.specialization}`,
      avatarSeed: selectedDoctor.avatarSeed,
      price: selectedDoctor.price,
    };
    savePendingDoctor(pendingDoctor);
    setSelectedDoctorId(null);
    navigate('/pilih-pasien');
  };

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-[calc(100vh-9rem)] flex-grow items-center justify-center bg-[#F7FBFC] px-4 py-12">
        <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
            Chat Dokter
          </h1>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            Yuk, masuk dulu! Biar riwayat konsultasimu terjaga rapi dan bisa cek saran dokter kapan aja.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#268489] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1f6f73]"
          >
            Login / Register
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-9rem)] flex-grow bg-[#F7FBFC] py-8 sm:py-10">
      <section className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="pt-1">
          <BackButton />
        </div>
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Chat Dokter</h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Hub konsultasi utama untuk memulai sesi baru maupun melanjutkan chat aktif.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Sesi Konsultasi Aktif</h2>
          {hasActiveSession && activeSessionSnapshot ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-[#F3FAFA] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeSessionSnapshot.avatarSeed}`}
                    alt={`${activeSessionSnapshot.doctorName} profile`}
                    className="h-12 w-12 rounded-full border border-slate-200 bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                      {activeSessionSnapshot.doctorName}, {activeSessionSnapshot.doctorTitle}
                    </h3>
                    <p className="text-xs font-medium text-[#268489]">{activeSessionSnapshot.specialization}</p>
                    <p className="mt-1 text-xs text-gray-500">Pasien: {activeSessionSnapshot.patientName}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                    Chat Berlangsung
                  </span>
                  <Link
                    to="/chat-room"
                    className="rounded-full bg-[#268489] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f6f73]"
                  >
                    Lanjutkan Chat
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-gray-600">
              Dokter ahli kami siap membantu keluhanmu 24/7. Mulai chat sekarang?
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Rekomendasi Dokter Terpopuler</h2>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-1">
            {popularDoctors.map((doctor) => (
              <article
                key={doctor.id}
                className="min-w-[240px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${doctor.avatarSeed}`}
                    alt={doctor.name}
                    className="h-12 w-12 rounded-full border border-slate-200 bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{doctor.name}</h3>
                    <p className="text-xs text-[#268489]">Spesialis {doctor.specialization}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {doctor.experience}
                  </span>
                  <span className="font-semibold text-[#0D503C]">Rp {doctor.price.toLocaleString('id-ID')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectDoctor(doctor)}
                  className="mt-3 w-full rounded-full bg-[#268489] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f6f73]"
                >
                  Pilih
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Cari Berdasarkan Spesialis</h2>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {specialtyFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedSpecialty(filter.id)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                  selectedSpecialty === filter.id
                    ? 'border-[#268489] bg-[#EAF7F4] text-[#268489]'
                    : 'border-slate-200 bg-white text-gray-600 hover:border-[#268489]/40'
                }`}
              >
                <span className="mx-auto mb-1 block w-fit">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <article key={doctor.id} className="rounded-2xl border border-slate-200 bg-[#FBFEFE] p-4">
                <h3 className="text-sm font-bold text-gray-900">{doctor.name}</h3>
                <p className="mt-1 text-xs text-[#268489]">Spesialis {doctor.specialization}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                  <span>{doctor.experience}</span>
                  <span className="font-semibold text-[#0D503C]">Rp {doctor.price.toLocaleString('id-ID')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectDoctor(doctor)}
                  className="mt-3 w-full rounded-full border border-[#268489] px-4 py-2 text-xs font-semibold text-[#268489] hover:bg-[#EAF7F4]"
                >
                  Lihat Profil
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>

      {selectedDoctor && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedDoctor.avatarSeed}`}
                  alt={selectedDoctor.name}
                  className="h-14 w-14 rounded-full border border-slate-200 bg-slate-100"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedDoctor.name}, {selectedDoctor.title}
                  </h3>
                  <p className="text-sm font-medium text-[#268489]">Spesialis {selectedDoctor.specialization}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoctorId(null)}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-slate-100 hover:text-gray-700"
              >
                x
              </button>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6">
              <div className="rounded-2xl border border-slate-200 bg-[#F8FCFC] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Credentials</p>
                <p className="mt-1 text-sm text-gray-700">{selectedDoctor.credentials}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Bio</p>
                <p className="mt-1 text-sm text-gray-700">{selectedDoctor.bio}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Ulasan Pasien</p>
                <blockquote className="text-sm font-medium text-gray-700">"{selectedDoctor.reviews[activeReviewIndex].text}"</blockquote>
                <p className="mt-2 text-xs text-gray-500">- {selectedDoctor.reviews[activeReviewIndex].author}</p>
                <div className="mt-3 flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                  Biaya konsultasi: <span className="font-bold text-[#0D503C]">Rp {selectedDoctor.price.toLocaleString('id-ID')}</span>
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
