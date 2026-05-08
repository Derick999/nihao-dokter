import { MessageCircleReply, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredUser } from '../utils/auth';
import { getActiveSession, isSessionStillActive } from '../utils/chatFlow';

type ChatMessage = {
  id: number;
  sender: 'dokter' | 'pasien';
  content: string;
  time: string;
};

type EndedChatRecord = {
  id: number;
  doctorName: string;
  doctorTitle: string;
  specialization: string;
  avatarSeed: string;
  lastMessage: string;
  lastChatTime: string;
  status: 'Selesai';
  rating: string;
  transcript: ChatMessage[];
};

const endedChats: EndedChatRecord[] = [
  {
    id: 1,
    doctorName: 'Dr. Andi Prasetyo',
    doctorTitle: 'Sp.A',
    specialization: 'Spesialis Anak',
    avatarSeed: 'dr-andi-spa',
    lastMessage: 'Silakan lanjutkan observasi demamnya selama 24 jam ya, Bu.',
    lastChatTime: 'Yesterday, 09:15 PM',
    status: 'Selesai',
    rating: '4.9/5.0',
    transcript: [
      { id: 1, sender: 'pasien', content: 'Dok, anak saya demam sejak sore.', time: '20:03' },
      { id: 2, sender: 'dokter', content: 'Suhu terakhir berapa, Bu?', time: '20:05' },
      { id: 3, sender: 'pasien', content: '38.2 derajat, Dok.', time: '20:06' },
      { id: 4, sender: 'dokter', content: 'Berikan kompres hangat dan cukup cairan. Bila >39 atau kejang, segera IGD.', time: '20:08' },
      { id: 5, sender: 'pasien', content: 'Baik Dok, terima kasih.', time: '20:10' },
    ],
  },
  {
    id: 2,
    doctorName: 'Dr. Siti Rahmawati',
    doctorTitle: 'Sp.PD',
    specialization: 'Spesialis Penyakit Dalam',
    avatarSeed: 'dr-siti-sppd',
    lastMessage: 'Jangan lupa konsumsi obat setelah makan dan kontrol 2 minggu lagi.',
    lastChatTime: 'Today, 10:45 AM',
    status: 'Selesai',
    rating: '4.8/5.0',
    transcript: [
      { id: 1, sender: 'pasien', content: 'Dok, asam lambung saya sering kambuh malam hari.', time: '10:20' },
      { id: 2, sender: 'dokter', content: 'Hindari kopi, pedas, dan makan terlalu malam.', time: '10:24' },
      { id: 3, sender: 'pasien', content: 'Obat diminum kapan, Dok?', time: '10:26' },
      { id: 4, sender: 'dokter', content: 'Pagi sebelum sarapan dan malam sebelum tidur ya.', time: '10:28' },
      { id: 5, sender: 'pasien', content: 'Siap Dok, terima kasih banyak.', time: '10:31' },
    ],
  },
];

export default function ChatDokter() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSessionSnapshot, setActiveSessionSnapshot] = useState(getActiveSession());
  const [selectedChatId, setSelectedChatId] = useState<number>(endedChats[0].id);

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

  const selectedChat = useMemo(
    () => endedChats.find((chat) => chat.id === selectedChatId) ?? endedChats[0],
    [selectedChatId],
  );
  const hasActiveSession = Boolean(
    activeSessionSnapshot && isSessionStillActive(activeSessionSnapshot.startedAt),
  );
  const sessionStatusLabel = hasActiveSession ? 'Chat Berlangsung' : 'Chat Ulang';

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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-4xl">
          <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Lebih dari ratusan dokter terpercaya di spesialisnya masing-masing.
          </h1>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Riwayat konsultasi yang sudah selesai, siap dibuka kembali kapan saja.
          </p>
        </div>

        {activeSessionSnapshot && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeSessionSnapshot.avatarSeed}`}
                  alt={`${activeSessionSnapshot.doctorName} profile`}
                  className="h-11 w-11 rounded-full border border-slate-200 bg-slate-100"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                    {activeSessionSnapshot.doctorName}, {activeSessionSnapshot.doctorTitle}
                  </h2>
                  <p className="text-xs font-medium text-[#268489]">{activeSessionSnapshot.specialization}</p>
                  <p className="mt-1 text-xs text-gray-500">Pasien: {activeSessionSnapshot.patientName}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    hasActiveSession ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {sessionStatusLabel}
                </span>
                {hasActiveSession ? (
                  <Link
                    to="/chat-room"
                    className="rounded-full bg-[#268489] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f6f73]"
                  >
                    Lanjutkan Chat
                  </Link>
                ) : (
                  <Link
                    to="/"
                    className="rounded-full bg-[#268489] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f6f73]"
                  >
                    Chat Ulang
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Riwayat Konsultasi</h2>
            <div className="space-y-3">
              {endedChats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    selectedChatId === chat.id
                      ? 'border-[#268489] bg-[#EFF8F8] shadow-sm'
                      : 'border-slate-200 bg-white hover:border-[#268489]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${chat.avatarSeed}`}
                        alt={`${chat.doctorName} profile`}
                        className="h-11 w-11 flex-shrink-0 rounded-full border border-slate-200 bg-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-gray-900">
                          {chat.doctorName}, {chat.doctorTitle}
                        </h3>
                        <p className="mt-0.5 text-xs font-medium text-[#268489]">{chat.specialization}</p>
                        <p className="mt-1 line-clamp-1 text-xs text-gray-600">{chat.lastMessage}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      {chat.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">{chat.lastChatTime}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600">
                      <Star className="h-3 w-3 fill-current" />
                      {chat.rating}
                    </span>
                  </div>

                  <div className="mt-3">
                    <span className="inline-flex items-center rounded-full bg-[#268489] px-3 py-1.5 text-xs font-semibold text-white">
                      Chat Ulang
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="flex items-center gap-3 border-b border-slate-200 bg-[#F2FAFA] px-4 py-3 sm:px-5">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedChat.avatarSeed}`}
                alt={`${selectedChat.doctorName} profile`}
                className="h-11 w-11 rounded-full border border-slate-200 bg-white"
                referrerPolicy="no-referrer"
              />
              <div>
                <h2 className="text-sm font-bold text-gray-900 sm:text-base">
                  {selectedChat.doctorName}, {selectedChat.doctorTitle}
                </h2>
                <p className="text-xs font-medium text-[#268489]">{selectedChat.specialization}</p>
              </div>
            </header>

            {/* WhatsApp-style bubble alignment for transcript messages. */}
            <div className="h-[420px] space-y-3 overflow-y-auto bg-[#EDF6F8] px-4 py-4 sm:px-5">
              {selectedChat.transcript.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'pasien' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[84%] rounded-2xl px-3 py-2 shadow-sm sm:max-w-[78%] ${
                      message.sender === 'pasien'
                        ? 'rounded-br-md bg-[#D7F0EE] text-gray-800'
                        : 'rounded-bl-md bg-white text-gray-700'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="mt-1 text-right text-[11px] text-gray-500">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-5">
              <p className="mb-3 text-sm font-medium text-gray-600">Sesi chat ini telah berakhir</p>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[#268489] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1f6f73]"
              >
                <MessageCircleReply className="h-4 w-4" />
                Chat Ulang
              </button>
            </footer>
          </section>
        </div>
      </section>
    </main>
  );
}
