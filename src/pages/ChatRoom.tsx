import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LogOut, MessageCircleReply, MoreVertical, Plus, User, X } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { getStoredUser } from '../utils/auth';
import { doctors } from '../data/doctors';
import {
  clearActiveSession,
  getActiveSession,
  getChatDurationMs,
  isSessionStillActive,
} from '../utils/chatFlow';

type MessageType = 'text' | 'prescription';

type RoomMessage = {
  id: number;
  sender: 'dokter' | 'pasien';
  content: string;
  time: string;
  type: MessageType;
};

type DoctorReview = {
  id: number;
  text: string;
  author: string;
};

type DoctorProfileDetails = {
  education: string;
  bio: string;
  reviews: DoctorReview[];
};

const DOCTOR_REPLY_DELAY_MS = 1200;

const symptomDictionary: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ['demam', 'panas'],
    response: 'Pastikan cukup cairan, kompres hangat, dan pantau suhu tiap 4 jam ya.',
  },
  {
    keywords: ['batuk', 'pilek', 'flu'],
    response: 'Istirahat cukup, minum air hangat, dan hindari udara dingin sementara.',
  },
  {
    keywords: ['lambung', 'maag', 'mual'],
    response: 'Makan porsi kecil tapi sering, hindari pedas-asam, dan jangan telat makan.',
  },
];

const defaultDoctorReviews: DoctorReview[] = [
  { id: 1, text: 'Dokter menjelaskan kondisi dengan bahasa yang mudah dipahami.', author: 'Pasien, 30' },
  { id: 2, text: 'Konsultasi berlangsung nyaman dan responsif.', author: 'Pasien, 26' },
  { id: 3, text: 'Saran yang diberikan membantu saya menentukan langkah berikutnya.', author: 'Pasien, 34' },
];

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const containsKeyword = (text: string, keyword: string) => {
  return text.toLowerCase().includes(keyword);
};

function PrescriptionCard() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border-2 border-[#D32F2F] bg-gradient-to-br from-red-50 to-rose-100 p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-[#B71C1C]">Resep Digital</p>
        <div className="mt-2 space-y-1 text-sm font-semibold text-[#7F1D1D]">
          <p>R/ Paracetamol 500mg</p>
          <p>Antasida Doen</p>
        </div>
        <p className="mt-2 text-xs text-red-800/80">Gunakan sesuai petunjuk dokter. Simpan resep ini untuk pembelian obat.</p>
      </div>
      <Link
        to="/shop"
        className="inline-flex w-full items-center justify-center rounded-full bg-[#D32F2F] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#B71C1C]"
      >
        Tembus Obat di Nihao Shop
      </Link>
    </div>
  );
}

export default function ChatRoom() {
  const navigate = useNavigate();
  const [session, setSession] = useState(getActiveSession());
  const [messageInput, setMessageInput] = useState('');
  const [remainingMs, setRemainingMs] = useState(0);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [showPrescriptionButton, setShowPrescriptionButton] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEndSessionModalOpen, setIsEndSessionModalOpen] = useState(false);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const chatViewportRef = useRef<HTMLDivElement | null>(null);
  const replyTimeoutRefs = useRef<number[]>([]);

  const isLoggedIn = Boolean(getStoredUser());
  const isActive = session ? isSessionStillActive(session.startedAt) : false;

  const currentDoctor = useMemo(
    () => (session ? doctors.find((doctor) => doctor.name === session.doctorName) ?? null : null),
    [session],
  );

  const doctorAvatar = useMemo(() => {
    if (!session) {
      return '';
    }
    if (currentDoctor?.img) {
      return currentDoctor.img;
    }
    return `https://api.dicebear.com/7.x/initials/svg?seed=${session.avatarSeed}`;
  }, [currentDoctor?.img, session]);

  const doctorDetails = useMemo<DoctorProfileDetails>(() => {
    if (!session) {
      return { education: '', bio: '', reviews: [] };
    }

    return {
      education: `${session.doctorName}, ${session.doctorTitle} — ${session.specialization}`,
      bio: 'Berfokus pada penanganan awal, edukasi gejala, serta rekomendasi tindak lanjut sesuai kondisi pasien.',
      reviews: defaultDoctorReviews,
    };
  }, [session]);

  const scheduleReply = useCallback((callback: () => void, delayMs: number) => {
    const timeoutId = window.setTimeout(callback, delayMs);
    replyTimeoutRefs.current.push(timeoutId);
  }, []);

  const appendMessage = useCallback((message: RoomMessage) => {
    setMessages((current) => [...current, message]);
  }, []);

  const createPrescriptionMessage = useCallback((): RoomMessage => {
    return {
      id: Date.now(),
      sender: 'dokter',
      content: 'Berikut resep digital untuk keluhan Anda. Silakan tebus obat di Nihao Shop.',
      time: formatTime(new Date()),
      type: 'prescription',
    };
  }, []);

  const getDoctorReply = useCallback((input: string) => {
    const normalized = input.toLowerCase();
    const matched = symptomDictionary.find((item) =>
      item.keywords.some((keyword) => normalized.includes(keyword)),
    );
    if (matched) {
      return matched.response;
    }
    return 'Terima kasih informasinya. Mohon jelaskan sejak kapan gejala dirasakan dan apa yang membuatnya memburuk.';
  }, []);

  const deliverPrescription = useCallback(() => {
    appendMessage(createPrescriptionMessage());
    setShowPrescriptionButton(false);
  }, [appendMessage, createPrescriptionMessage]);

  const processPatientMessage = useCallback(
    (rawText: string) => {
      const trimmed = rawText.trim();
      if (!trimmed || !isActive || !session) {
        return;
      }

      const normalized = trimmed.toLowerCase();
      const now = new Date();

      appendMessage({
        id: Date.now(),
        sender: 'pasien',
        content: trimmed,
        time: formatTime(now),
        type: 'text',
      });

      if (containsKeyword(normalized, 'resep')) {
        deliverPrescription();
        return;
      }

      if (containsKeyword(normalized, 'perut') || containsKeyword(normalized, 'stomach')) {
        scheduleReply(() => {
          appendMessage({
            id: Date.now(),
            sender: 'dokter',
            content: `Baik, ${session.patientName}. Bisa ceritakan lebih detail gejala perut Anda? Sejak kapan dirasakan, lokasinya di mana, dan apakah disertai mual atau muntah?`,
            time: formatTime(new Date()),
            type: 'text',
          });
          setShowPrescriptionButton(true);
        }, DOCTOR_REPLY_DELAY_MS);
        return;
      }

      appendMessage({
        id: Date.now() + 1,
        sender: 'dokter',
        content: getDoctorReply(trimmed),
        time: formatTime(new Date(now.getTime() + 1000)),
        type: 'text',
      });
    },
    [appendMessage, deliverPrescription, getDoctorReply, isActive, scheduleReply, session],
  );

  useEffect(() => {
    return () => {
      replyTimeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    const initialDoctorMessage: RoomMessage = {
      id: 1,
      sender: 'dokter',
      content: `Halo, saya ${session.doctorName}. Gejala atau keluhan kesehatan apa yang Anda alami hari ini?`,
      time: formatTime(new Date()),
      type: 'text',
    };
    setMessages([initialDoctorMessage]);
    setShowPrescriptionButton(false);
  }, [session?.startedAt]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const tick = () => {
      const elapsed = Date.now() - session.startedAt;
      const left = Math.max(getChatDurationMs() - elapsed, 0);
      setRemainingMs(left);

      if (left <= 0) {
        clearActiveSession();
      }
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [session]);

  useEffect(() => {
    if (session && !isSessionStillActive(session.startedAt)) {
      setSession(getActiveSession());
    }
  }, [remainingMs, session]);

  useEffect(() => {
    if (!isProfileModalOpen) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveReviewIndex((current) => (current + 1) % doctorDetails.reviews.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [doctorDetails.reviews.length, isProfileModalOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current || menuRef.current.contains(event.target as Node)) {
        return;
      }
      setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      window.addEventListener('mousedown', handleOutsideClick);
    }

    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  useEffect(() => {
    const viewport = chatViewportRef.current;
    if (!viewport) {
      return;
    }
    viewport.scrollTop = viewport.scrollHeight;
  }, [messages, showPrescriptionButton]);

  const remainingText = useMemo(() => {
    const hours = Math.floor(remainingMs / (60 * 60 * 1000));
    const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);
    return `${hours}j ${minutes}m ${seconds}d`;
  }, [remainingMs]);

  const handleSendMessage = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = messageInput.trim();
    if (!trimmed) {
      return;
    }

    processPatientMessage(trimmed);
    setMessageInput('');
  };

  const handlePrescriptionRequest = () => {
    if (!isActive) {
      return;
    }

    setShowPrescriptionButton(false);

    appendMessage({
      id: Date.now(),
      sender: 'pasien',
      content: 'Dok, saya ingin minta resep obat untuk keluhan ini.',
      time: formatTime(new Date()),
      type: 'text',
    });

    scheduleReply(() => {
      deliverPrescription();
    }, DOCTOR_REPLY_DELAY_MS);
  };

  const handleOpenProfile = () => {
    setIsMenuOpen(false);
    setActiveReviewIndex(0);
    setIsProfileModalOpen(true);
  };

  const handleOpenEndSessionConfirmation = () => {
    setIsMenuOpen(false);
    setIsEndSessionModalOpen(true);
  };

  const handleConfirmEndSession = () => {
    const activeSessionRaw = localStorage.getItem('active_session');
    if (activeSessionRaw) {
      try {
        const activeSession = JSON.parse(activeSessionRaw) as {
          doctorName?: string;
          specialization?: string;
          avatarSeed?: string;
        };

        if (activeSession.doctorName && activeSession.specialization && activeSession.avatarSeed) {
          const newHistoryItem = {
            id: `consult-${Date.now()}`,
            type: 'Konsultasi Dokter' as const,
            doctorName: activeSession.doctorName,
            specialty: activeSession.specialization,
            avatarSeed: activeSession.avatarSeed,
            date: new Date().toLocaleString('id-ID'),
            transcript: messages,
          };

          const historyRaw = localStorage.getItem('consultation_history');
          const historyList = historyRaw ? (JSON.parse(historyRaw) as unknown[]) : [];
          const normalizedHistory = Array.isArray(historyList) ? historyList : [];
          normalizedHistory.unshift(newHistoryItem);

          localStorage.setItem('consultation_history', JSON.stringify(normalizedHistory));
        }
      } catch {
        // Ignore malformed localStorage payloads and continue cleanup flow.
      }
    }

    localStorage.removeItem('active_session');
    setSession(null);
    setIsEndSessionModalOpen(false);
    navigate('/riwayat');
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!session || !isActive) {
    return (
      <main className="flex min-h-[calc(100vh-9rem)] flex-grow items-center justify-center bg-[#F7FBFC] px-4 py-12">
        <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Sesi chat sudah berakhir</h1>
          <p className="mt-3 text-sm text-gray-600">Silakan kembali ke riwayat konsultasi untuk memulai Chat Ulang.</p>
          <Link
            to="/riwayat"
            className="mt-6 inline-flex rounded-full bg-[#268489] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Ke Riwayat
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-[#F3FAFB] py-8">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 bg-[#EAF7F4] px-4 py-3 sm:px-5">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <BackButton />
              <img
                src={doctorAvatar}
                alt={session.doctorName}
                className="h-11 w-11 shrink-0 rounded-full border border-slate-200 bg-white object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <h1 className="truncate text-base font-bold text-gray-900">
                  {session.doctorName}, {session.doctorTitle}
                </h1>
                <p className="text-xs text-[#268489]">{session.specialization}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:items-center">
              <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0D503C]">
                Sesi ini aktif selama 3 jam. Sisa: {remainingText}
              </div>
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((current) => !current)}
                  className="rounded-full bg-white p-2 text-gray-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-[#268489]"
                  aria-label="Buka menu sesi"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 z-40 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                    <button
                      type="button"
                      onClick={handleOpenProfile}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-[#EAF7F4] hover:text-[#1f6f73]"
                    >
                      <User className="h-4 w-4" />
                      Lihat Profil Dokter
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenEndSessionConfirmation}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-[#D32F2F] transition-colors hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Akhiri Sesi
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div
            ref={chatViewportRef}
            className="h-[420px] space-y-3 overflow-y-auto bg-[#EDF6F8] px-4 py-4 sm:px-5"
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'pasien' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    message.sender === 'pasien'
                      ? 'rounded-br-md bg-[#D7F0EE] text-gray-800'
                      : 'rounded-bl-md bg-white text-gray-700'
                  }`}
                >
                  {message.type === 'prescription' ? (
                    <PrescriptionCard />
                  ) : (
                    <p>{message.content}</p>
                  )}
                  <p className="mt-1 text-right text-[11px] text-gray-500">{message.time}</p>
                </div>
              </div>
            ))}
          </div>

          {showPrescriptionButton && (
            <div className="border-t border-slate-100 bg-white px-4 pt-3 sm:px-5">
              <button
                type="button"
                onClick={handlePrescriptionRequest}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2E7D32] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1B5E20]"
              >
                <Plus className="h-4 w-4" />
                Minta Resep Obat
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-200 bg-white px-4 py-3 sm:px-5">
            <input
              type="text"
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
              placeholder="Tulis gejala Anda..."
              className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm outline-none focus:border-[#268489]"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-[#268489] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f6f73]"
            >
              <MessageCircleReply className="h-4 w-4" />
              Kirim
            </button>
          </form>
        </div>
      </section>

      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <img
                  src={doctorAvatar}
                  alt={session.doctorName}
                  className="h-14 w-14 rounded-full border border-slate-200 bg-slate-100 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {session.doctorName}, {session.doctorTitle}
                  </h3>
                  <p className="text-sm font-medium text-[#268489]">{session.specialization}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-slate-100 hover:text-gray-700"
                aria-label="Tutup modal profil dokter"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6">
              <div className="rounded-2xl border border-slate-200 bg-[#F8FCFC] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Education</p>
                <p className="mt-1 text-sm text-gray-700">{doctorDetails.education}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Bio</p>
                <p className="mt-1 text-sm text-gray-700">{doctorDetails.bio}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Ulasan Pasien</p>
                <blockquote className="text-sm font-medium text-gray-700">
                  "{doctorDetails.reviews[activeReviewIndex].text}"
                </blockquote>
                <p className="mt-2 text-xs text-gray-500">- {doctorDetails.reviews[activeReviewIndex].author}</p>
                <div className="mt-3 flex gap-1.5">
                  {doctorDetails.reviews.map((review, index) => (
                    <span
                      key={review.id}
                      className={`h-1.5 w-6 rounded-full ${index === activeReviewIndex ? 'bg-[#268489]' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEndSessionModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">Akhiri Sesi Konsultasi?</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Setelah diakhiri, Anda tidak dapat mengirim pesan lagi dalam sesi ini. Pastikan semua pertanyaan Anda
              sudah terjawab.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEndSessionModalOpen(false)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleConfirmEndSession}
                className="rounded-full bg-[#D32F2F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#b71c1c]"
              >
                Ya, Akhiri
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
