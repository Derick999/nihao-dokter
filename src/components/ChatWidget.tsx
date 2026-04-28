import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';

type Doctor = {
  name: string;
  img: string;
};

type Message = {
  id: number;
  sender: 'doctor' | 'user';
  text: string;
};

type ChatWidgetProps = {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
};

const defaultDoctor = {
  name: 'Dr. Sarah',
  img: 'https://ui-avatars.com/api/?name=Dr.+Sarah&background=E6F4F1&color=268489&bold=true',
};

const getBotReply = (message: string) => {
  const input = message.toLowerCase();

  if (/(meriang|demam|panas)/.test(input)) {
    return 'Baik, mohon istirahat yang cukup dan minum air putih. Jika panas tidak turun dalam 2 hari, mohon hubungi saya kembali.';
  }

  if (/(batuk|pilek|flu)/.test(input)) {
    return 'Usahakan tetap hangat, hindari minuman dingin. Untuk penanganan sementara, Anda bisa konsumsi paracetamol.';
  }

  if (/(pusing|sakit kepala)/.test(input)) {
    return 'Coba rileks sejenak dan pastikan tekanan darah normal. Mohon infokan jika pusing berkelanjutan.';
  }

  return 'Terima kasih atas pesannya. Sedang saya proses, mohon tunggu sebentar ya.';
};

export default function ChatWidget({ doctor, isOpen, onClose }: ChatWidgetProps) {
  const activeDoctor = doctor ?? defaultDoctor;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const replyTimeoutRef = useRef<number | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const initialDoctorMessages = useMemo(
    () => [
      {
        id: 1,
        sender: 'doctor' as const,
        text: `Halo, saya ${activeDoctor.name}. Silakan ceritakan keluhan Anda ya.`,
      },
    ],
    [activeDoctor.name]
  );

  useEffect(() => {
    if (isOpen) {
      setMessages(initialDoctorMessages);
    }
  }, [initialDoctorMessages, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: trimmedInput,
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');

    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
    }

    replyTimeoutRef.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          sender: 'doctor',
          text: getBotReply(trimmedInput),
        },
      ]);
    }, 1000);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-3xl border border-gray-200 bg-[#f3f4f6] shadow-2xl sm:bottom-6 sm:right-6">
      <div className="flex items-start gap-3 rounded-t-3xl bg-[#268489] px-4 py-4 text-white">
        <img
          src={activeDoctor.img}
          alt={activeDoctor.name}
          className="h-11 w-11 rounded-full border-2 border-white/80 object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold sm:text-base">{activeDoctor.name}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-teal-50 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-green-300" />
            <span>Online</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[55vh] min-h-[320px] space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                message.sender === 'user'
                  ? 'rounded-br-md bg-[#268489] text-white'
                  : 'rounded-bl-md bg-white text-gray-700'
              }`}
            >
              {message.text}
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
            placeholder="Tulis pesan..."
            className="h-11 flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
          />
          <button
            type="submit"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#268489] text-white transition hover:-translate-y-0.5 hover:bg-[#1f6f73]"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
