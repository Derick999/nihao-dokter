import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { DoctorProfile, getAiRecommendations } from '../data/doctors';

type AiMessage = {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  recommendations?: DoctorProfile[];
};

type NihaoAIWidgetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectDoctor: (doctor: DoctorProfile) => void;
};

const getAiResponse = (message: string) => {
  const input = message.toLowerCase();

  if (/(meriang|demam|panas)/.test(input)) {
    return 'Keluhan demam atau meriang biasanya perlu istirahat cukup, cairan yang memadai, dan pemantauan suhu tubuh. Saya rekomendasikan konsultasi cepat dengan dokter umum untuk memastikan tindak lanjut yang sesuai.';
  }

  if (/(anak|batuk|pilek|flu)/.test(input)) {
    return 'Untuk batuk atau pilek pada anak, pastikan anak cukup minum, istirahat, dan hindari paparan dingin berlebih. Supaya lebih aman, saya siapkan dokter yang cocok untuk konsultasi lanjutan.';
  }

  if (/(pusing|sakit kepala)/.test(input)) {
    return 'Sakit kepala bisa dipicu kurang tidur, dehidrasi, atau kelelahan. Jika berulang atau memburuk, sebaiknya konsultasi dengan dokter umum agar penyebabnya dievaluasi lebih lanjut.';
  }

  if (/(kulit|jerawat|ruam|gatal)/.test(input)) {
    return 'Keluhan kulit seperti ruam, gatal, atau jerawat lebih tepat ditangani dokter spesialis kulit. Saya pilihkan dokter yang relevan untuk Anda.';
  }

  return 'Saya bisa bantu memberikan arahan awal terkait gejala dan mencarikan dokter yang sesuai. Berikut beberapa dokter yang bisa Anda hubungi sekarang.';
};

export default function NihaoAIWidget({ isOpen, onClose, onSelectDoctor }: NihaoAIWidgetProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const replyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: 1,
          sender: 'ai',
          text: 'Halo, saya Nihao AI. Ceritakan gejala Anda seperti "meriang", "anak batuk", atau "kulit gatal", nanti saya bantu beri arahan awal dan rekomendasi dokter.',
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) {
        window.clearTimeout(replyTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = (event: FormEvent) => {
    event.preventDefault();
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return;
    }

    setMessages((current) => [
      ...current,
      { id: Date.now(), sender: 'user', text: trimmedInput },
    ]);
    setInput('');

    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
    }

    replyTimeoutRef.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: getAiResponse(trimmedInput),
          recommendations: getAiRecommendations(trimmedInput).slice(0, 2),
        },
      ]);
    }, 900);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-3xl border border-gray-200 bg-[#f3f4f6] shadow-2xl sm:bottom-6 sm:right-6">
      <div className="flex items-start gap-3 rounded-t-3xl bg-[#268489] px-4 py-4 text-white">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/80 bg-white/10">
          <Bot className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold sm:text-base">Nihao AI</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-teal-50 sm:text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Asisten kesehatan pintar</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
          aria-label="Close AI chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[55vh] min-h-[340px] space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                message.sender === 'user'
                  ? 'rounded-br-md bg-[#268489] text-white'
                  : 'rounded-bl-md bg-white text-gray-700'
              }`}
            >
              <p>{message.text}</p>
              {message.recommendations && (
                <div className="mt-3 space-y-2">
                  {message.recommendations.map((doctor) => (
                    <div key={doctor.id} className="rounded-2xl border border-gray-100 bg-[#F9FBFB] p-3">
                      <div className="flex items-center gap-3">
                        <img src={doctor.img} alt={doctor.name} className="h-10 w-10 rounded-full object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-900">{doctor.name}</p>
                          <p className="text-xs text-gray-500">{doctor.spec}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onSelectDoctor(doctor)}
                          className="rounded-full bg-[#268489] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#1f6f73]"
                        >
                          Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tulis gejala atau pertanyaan..."
            className="h-11 flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
          />
          <button
            type="submit"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#268489] text-white transition hover:-translate-y-0.5 hover:bg-[#1f6f73]"
            aria-label="Send AI message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
