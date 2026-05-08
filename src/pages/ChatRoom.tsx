import { FormEvent, useEffect, useMemo, useState } from 'react';
import { MessageCircleReply } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { getStoredUser } from '../utils/auth';
import {
  clearActiveSession,
  getActiveSession,
  getChatDurationMs,
  isSessionStillActive,
} from '../utils/chatFlow';

type RoomMessage = {
  id: number;
  sender: 'dokter' | 'pasien';
  content: string;
  time: string;
};

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

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

export default function ChatRoom() {
  const [session, setSession] = useState(getActiveSession());
  const [messageInput, setMessageInput] = useState('');
  const [remainingMs, setRemainingMs] = useState(0);
  const [messages, setMessages] = useState<RoomMessage[]>([]);

  const isLoggedIn = Boolean(getStoredUser());
  const isActive = session ? isSessionStillActive(session.startedAt) : false;

  useEffect(() => {
    if (!session) {
      return;
    }

    const initialDoctorMessage: RoomMessage = {
      id: 1,
      sender: 'dokter',
      content: `Halo ${session.patientName}, silakan ceritakan keluhan utama Anda ya.`,
      time: formatTime(new Date()),
    };
    setMessages([initialDoctorMessage]);
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

  const remainingText = useMemo(() => {
    const hours = Math.floor(remainingMs / (60 * 60 * 1000));
    const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);
    return `${hours}j ${minutes}m ${seconds}d`;
  }, [remainingMs]);

  const getDoctorReply = (input: string) => {
    const normalized = input.toLowerCase();
    const matched = symptomDictionary.find((item) => item.keywords.some((keyword) => normalized.includes(keyword)));
    if (matched) {
      return matched.response;
    }
    return 'Terima kasih informasinya. Mohon jelaskan sejak kapan gejala dirasakan dan apa yang membuatnya memburuk.';
  };

  const handleSendMessage = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = messageInput.trim();
    if (!trimmed || !isActive) {
      return;
    }

    const now = new Date();
    const patientMsg: RoomMessage = {
      id: Date.now(),
      sender: 'pasien',
      content: trimmed,
      time: formatTime(now),
    };
    const doctorMsg: RoomMessage = {
      id: Date.now() + 1,
      sender: 'dokter',
      content: getDoctorReply(trimmed),
      time: formatTime(new Date(now.getTime() + 1000)),
    };

    setMessages((current) => [...current, patientMsg, doctorMsg]);
    setMessageInput('');
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
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-[#EAF7F4] px-4 py-3 sm:px-5">
            <div>
              <h1 className="text-base font-bold text-gray-900">
                {session.doctorName}, {session.doctorTitle}
              </h1>
              <p className="text-xs text-[#268489]">{session.specialization}</p>
            </div>
            <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0D503C]">
              Sesi ini aktif selama 3 jam. Sisa: {remainingText}
            </div>
          </header>

          <div className="h-[420px] space-y-3 overflow-y-auto bg-[#EDF6F8] px-4 py-4 sm:px-5">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'pasien' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    message.sender === 'pasien'
                      ? 'rounded-br-md bg-[#D7F0EE] text-gray-800'
                      : 'rounded-bl-md bg-white text-gray-700'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="mt-1 text-right text-[11px] text-gray-500">{message.time}</p>
                </div>
              </div>
            ))}
          </div>

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
    </main>
  );
}
