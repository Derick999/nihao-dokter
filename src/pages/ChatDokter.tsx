import {
  Baby,
  Brain,
  CircleDot,
  CheckCircle2,
  Clock3,
  Ear,
  HeartPulse,
  ShieldCheck,
  Star,
  Stethoscope,
  WalletCards,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getStoredUser } from '../utils/auth';
import {
  getActiveSession,
  getFamilyProfiles,
  isSessionStillActive,
  saveActiveSession,
} from '../utils/chatFlow';
import BackButton from '../components/BackButton';

type SpecialtyFilter = 'Semua' | 'Umum' | 'Anak' | 'THT' | 'Jantung' | 'Psikologi' | 'Kulit';

type DoctorRecommendation = {
  id: number;
  name: string;
  title: string;
  specialization: SpecialtyFilter;
  experience: string;
  price: number;
  avatarSeed: string;
  image: string;
  credentials: string;
  bio: string;
  reviews: Array<{ id: number; text: string; author: string }>;
};

type BookingStep = 'profile' | 'patient' | 'payment' | 'success';
type PaymentMethod = 'QRIS' | 'VA';

const specialtyFilters: Array<{ id: SpecialtyFilter; label: string; icon: ReactNode }> = [
  { id: 'Semua', label: 'Semua', icon: <Stethoscope className="h-5 w-5" /> },
  { id: 'Umum', label: 'Umum', icon: <ShieldCheck className="h-5 w-5" /> },
  { id: 'Anak', label: 'Anak', icon: <Baby className="h-5 w-5" /> },
  { id: 'Kulit', label: 'Kulit', icon: <CircleDot className="h-5 w-5" /> },
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
    image: '/dokter/dokter derrick.jpg',
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
    image: '/dokter/dokter punjabi.jpg',
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
    image: '/dokter/dokter kevin.jpg',
    credentials: 'Spesialis Jantung, 10+ tahun pengalaman klinis dan telekonsultasi.',
    bio: 'Berfokus pada evaluasi gejala kardiovaskular awal dan rekomendasi perubahan gaya hidup jangka panjang.',
    reviews: [
      { id: 1, text: 'Saran pola hidupnya praktis dan bisa langsung diterapkan.', author: 'Riko, 40' },
      { id: 2, text: 'Penjelasan kondisi jantung jadi lebih mudah dipahami.', author: 'Maya, 38' },
      { id: 3, text: 'Konsultasi profesional dan menenangkan.', author: 'Dwi, 45' },
    ],
  },
  {
    id: 4,
    name: 'Dr. Siti Rahmawati',
    title: 'Sp.PD',
    specialization: 'Umum',
    experience: '7 Tahun',
    price: 95000,
    avatarSeed: 'dr-siti-rahmawati',
    image: '/dokter/dokter sigma.jpg',
    credentials: 'Spesialis Penyakit Dalam dengan pengalaman 7 tahun menangani keluhan metabolik dan infeksi.',
    bio: 'Fokus pada evaluasi keluhan penyakit dalam, pemantauan kondisi kronis, dan edukasi pencegahan berkelanjutan.',
    reviews: [
      { id: 1, text: 'Penjelasan diagnosis jelas dan mudah dipahami.', author: 'Laras, 33' },
      { id: 2, text: 'Sangat teliti saat menanyakan riwayat keluhan.', author: 'Fajar, 39' },
      { id: 3, text: 'Rencana tindak lanjutnya detail dan praktis.', author: 'Mila, 36' },
    ],
  },
  {
    id: 5,
    name: 'Dr. Budi Santoso',
    title: 'Sp.THT',
    specialization: 'THT',
    experience: '6 Tahun',
    price: 85000,
    avatarSeed: 'dr-budi-santoso',
    image: '/dokter/dokter strange.jpg',
    credentials: 'Spesialis THT dengan pengalaman 6 tahun menangani gangguan telinga, hidung, dan tenggorokan.',
    bio: 'Membantu evaluasi gejala THT akut maupun berulang dengan pendekatan yang terarah dan komunikatif.',
    reviews: [
      { id: 1, text: 'Keluhan telinga saya ditangani dengan cepat.', author: 'Rudi, 30' },
      { id: 2, text: 'Saran perawatan di rumah sangat membantu.', author: 'Nina, 28' },
      { id: 3, text: 'Dokter ramah dan detail menjelaskan kondisi.', author: 'Andre, 41' },
    ],
  },
  {
    id: 6,
    name: 'Dr. Amanda Putri',
    title: 'M.Psi',
    specialization: 'Psikologi',
    experience: '5 Tahun',
    price: 120000,
    avatarSeed: 'dr-amanda-putri',
    image: '/dokter/dokter strange.jpg',
    credentials: 'Psikolog klinis dengan pengalaman 5 tahun dalam pendampingan stres, kecemasan, dan burnout.',
    bio: 'Berfokus pada konseling suportif dan strategi coping yang bisa diterapkan dalam rutinitas harian.',
    reviews: [
      { id: 1, text: 'Sesi terasa aman dan membuat saya lebih tenang.', author: 'Santi, 27' },
      { id: 2, text: 'Teknik coping yang diberikan efektif dipraktikkan.', author: 'Bagas, 32' },
      { id: 3, text: 'Pendekatannya empatik dan tidak menghakimi.', author: 'Dina, 29' },
    ],
  },
];

export default function ChatDokter() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSessionSnapshot, setActiveSessionSnapshot] = useState(getActiveSession());
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyFilter>('Semua');
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [bookingStep, setBookingStep] = useState<BookingStep>('profile');
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const familyProfiles = useMemo(() => getFamilyProfiles(), []);

  useEffect(() => {
    setIsLoggedIn(Boolean(getStoredUser()));
    setActiveSessionSnapshot(getActiveSession());
  }, []);

  useEffect(() => {
    const syncSession = () => {
      setActiveSessionSnapshot(getActiveSession());
    };

    const interval = window.setInterval(syncSession, 1000);
    window.addEventListener('storage', syncSession);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('storage', syncSession);
    };
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

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const specialtyFromQuery = searchParams.get('specialty');
    const allowedSpecialties: SpecialtyFilter[] = ['Semua', 'Umum', 'Anak', 'Kulit', 'THT', 'Jantung', 'Psikologi'];
    if (specialtyFromQuery && allowedSpecialties.includes(specialtyFromQuery as SpecialtyFilter)) {
      setSelectedSpecialty(specialtyFromQuery as SpecialtyFilter);
    }
  }, [location.search]);

  useEffect(() => {
    const state = location.state as { openDoctorName?: string } | null;
    if (!state?.openDoctorName) {
      return;
    }

    const matchedDoctor = popularDoctors.find((doctor) => doctor.name === state.openDoctorName);
    if (!matchedDoctor) {
      return;
    }

    setSelectedDoctorId(matchedDoctor.id);
    setBookingStep('profile');
    setSelectedPatientId('');
    setSelectedPaymentMethod(null);
    setActiveReviewIndex(0);

    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!showSuccessNotification) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowSuccessNotification(false);
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [showSuccessNotification]);

  const hasActiveSession = Boolean(
    activeSessionSnapshot && isSessionStillActive(activeSessionSnapshot.startedAt),
  );

  const handleOpenDoctorModal = (doctor: DoctorRecommendation) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setSelectedDoctorId(doctor.id);
    setBookingStep('profile');
    setSelectedPatientId('');
    setSelectedPaymentMethod(null);
    setActiveReviewIndex(0);
  };

  const closeModal = () => {
    setSelectedDoctorId(null);
    setBookingStep('profile');
    setSelectedPatientId('');
    setSelectedPaymentMethod(null);
    setShowQRISModal(false);
    setActiveReviewIndex(0);
  };

  const handleFinalPayment = () => {
    if (!selectedDoctor) {
      return;
    }

    const selectedPatient = familyProfiles.find((profile) => profile.id === selectedPatientId);
    if (!selectedPatient || !selectedPaymentMethod) {
      return;
    }

    saveActiveSession({
      doctorName: selectedDoctor.name,
      doctorTitle: selectedDoctor.title,
      specialization: `Spesialis ${selectedDoctor.specialization}`,
      avatarSeed: selectedDoctor.avatarSeed,
      patientName: selectedPatient.fullName,
      startedAt: Date.now(),
    });

    setBookingStep('success');
    setShowSuccessNotification(true);
    setShowQRISModal(false);

    window.setTimeout(() => {
      closeModal();
      navigate('/chat-room');
    }, 1400);
  };

  const handleConfirmPayment = () => {
    if (!selectedPaymentMethod) {
      return;
    }

    if (selectedPaymentMethod === 'QRIS') {
      setShowQRISModal(true);
      return;
    }

    handleFinalPayment();
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
                onClick={() => handleOpenDoctorModal(doctor)}
                className="min-w-[240px] cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-[#268489]/45"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-12 w-12 rounded-full border border-slate-200 bg-slate-100 object-cover aspect-square"
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
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOpenDoctorModal(doctor);
                  }}
                  className="mt-3 w-full rounded-full bg-[#268489] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f6f73]"
                >
                  Lihat Profil
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
                  onClick={() => handleOpenDoctorModal(doctor)}
                  className="mt-3 w-full rounded-full border border-[#268489] px-4 py-2 text-xs font-semibold text-[#268489] hover:bg-[#EAF7F4]"
                >
                  Lihat Profil
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>

      {showSuccessNotification && (
        <div className="fixed right-4 top-6 z-[90] max-w-xs rounded-2xl border border-emerald-200 bg-emerald-50 p-3 shadow-lg">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
            <p className="text-xs font-semibold text-emerald-700">
              Pembayaran berhasil. Sesi konsultasi aktif dan chat siap dimulai.
            </p>
          </div>
        </div>
      )}

      {selectedDoctor && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="h-14 w-14 rounded-full border border-slate-200 bg-slate-100 object-cover aspect-square"
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
                onClick={closeModal}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-slate-100 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#268489]">
                <span className={bookingStep === 'profile' ? 'text-[#268489]' : 'text-slate-400'}>Profil</span>
                <span className="text-slate-300">/</span>
                <span className={bookingStep === 'patient' ? 'text-[#268489]' : 'text-slate-400'}>Pasien</span>
                <span className="text-slate-300">/</span>
                <span className={bookingStep === 'payment' ? 'text-[#268489]' : 'text-slate-400'}>Pembayaran</span>
              </div>

              {bookingStep === 'profile' && (
                <>
                  <div className="rounded-2xl border border-slate-200 bg-[#F8FCFC] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Credentials</p>
                    <p className="mt-1 text-sm text-gray-700">{selectedDoctor.credentials}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Bio</p>
                    <p className="mt-1 text-sm text-gray-700">{selectedDoctor.bio}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Ulasan Pasien</p>
                    <blockquote className="text-sm font-medium text-gray-700">
                      "{selectedDoctor.reviews[activeReviewIndex].text}"
                    </blockquote>
                    <p className="mt-2 text-xs text-gray-500">- {selectedDoctor.reviews[activeReviewIndex].author}</p>
                    <div className="mt-3 flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-600">
                      Biaya konsultasi:{' '}
                      <span className="font-bold text-[#0D503C]">Rp {selectedDoctor.price.toLocaleString('id-ID')}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setBookingStep('patient')}
                      className="inline-flex items-center justify-center rounded-full bg-[#268489] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1f6f73]"
                    >
                      Pilih
                    </button>
                  </div>
                </>
              )}

              {bookingStep === 'patient' && (
                <>
                  <div className="rounded-2xl border border-slate-200 bg-[#F8FCFC] p-4">
                    <p className="text-sm font-semibold text-gray-900">Pilih Pasien</p>
                    <p className="mt-1 text-xs text-gray-600">
                      Tentukan profil pasien yang akan menjalani sesi konsultasi ini.
                    </p>
                    <div className="mt-3 space-y-2">
                      {familyProfiles.map((profile) => (
                        <button
                          key={profile.id}
                          type="button"
                          onClick={() => setSelectedPatientId(profile.id)}
                          className={`w-full rounded-xl border px-3 py-2 text-left transition-colors ${
                            selectedPatientId === profile.id
                              ? 'border-[#268489] bg-[#EAF7F4]'
                              : 'border-slate-200 bg-white hover:border-[#268489]/40'
                          }`}
                        >
                          <p className="text-sm font-semibold text-gray-900">{profile.fullName}</p>
                          <p className="text-xs text-gray-600">
                            {profile.relationship} {profile.dob ? `- ${profile.dob}` : ''}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingStep('profile')}
                      className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Kembali
                    </button>
                    <button
                      type="button"
                      disabled={!selectedPatientId}
                      onClick={() => setBookingStep('payment')}
                      className="rounded-full bg-[#268489] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1f6f73] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Lanjut Pembayaran
                    </button>
                  </div>
                </>
              )}

              {bookingStep === 'payment' && (
                <>
                  <div className="rounded-2xl border border-slate-200 bg-[#F8FCFC] p-4">
                    <p className="text-sm font-semibold text-gray-900">Pilih Metode Pembayaran</p>
                    <p className="mt-1 text-xs text-gray-600">
                      Selesaikan pembayaran untuk mengaktifkan sesi chat dokter.
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {(['QRIS', 'VA'] as PaymentMethod[]).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setSelectedPaymentMethod(method)}
                          className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                            selectedPaymentMethod === method
                              ? 'border-[#268489] bg-[#EAF7F4]'
                              : 'border-slate-200 bg-white hover:border-[#268489]/40'
                          }`}
                        >
                          <p className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                            <WalletCards className="h-4 w-4 text-[#268489]" />
                            {method}
                          </p>
                          <p className="mt-1 text-xs text-gray-600">
                            {method === 'QRIS'
                              ? 'Bayar cepat dengan scan QR dari e-wallet atau mobile banking.'
                              : 'Transfer virtual account dari bank pilihan Anda.'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingStep('patient')}
                      className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Kembali
                    </button>
                    <button
                      type="button"
                      disabled={!selectedPaymentMethod}
                      onClick={handleConfirmPayment}
                      className="rounded-full bg-[#268489] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1f6f73] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Bayar & Mulai Chat
                    </button>
                  </div>
                </>
              )}

              {bookingStep === 'success' && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                  <p className="mt-2 text-sm font-semibold text-emerald-700">
                    Pembayaran sukses! Anda akan diarahkan ke ruang chat.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedDoctor && showQRISModal && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-950/55 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Pembayaran QRIS</h3>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div className="rounded-2xl border border-[#268489]/25 bg-[#F8FCFC] p-4">
                <img
                  src="/src/public/Nihao.png"
                  alt="QRIS code"
                  className="mx-auto h-64 w-64 rounded-xl border border-slate-200 bg-white object-contain p-2"
                />
              </div>
              <p className="text-center text-sm text-gray-600">
                Silakan scan kode QR di atas menggunakan aplikasi e-wallet atau mobile banking Anda.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowQRISModal(false)}
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleFinalPayment}
                className="rounded-full bg-[#268489] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1f6f73]"
              >
                Saya Sudah Bayar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
