import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import diseasesData from '../data/diseases.json';

type AiMessage = {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  matches?: Disease[];
  ctaLink?: '/shop' | '/doctors';
};

type NihaoAIWidgetProps = {
  isOpen: boolean;
  onClose: () => void;
};

type TriageCategory = 'Head' | 'Stomach' | 'Others';

type Disease = {
  id: string;
  name: string;
  symptoms: string[];
  triage_category: TriageCategory;
  advice: string;
  recommendation_link: '/shop' | '/doctors';
};

type TriageStep = 'awaitingSymptom' | 'awaitingArea' | 'completed';

const diseases = diseasesData as Disease[];

const normalizeArea = (input: string): TriageCategory | null => {
  const text = input.toLowerCase();
  if (/(head|kepala|pusing|migrain)/.test(text)) {
    return 'Head';
  }

  if (/(stomach|lambung|perut|mual|diare)/.test(text)) {
    return 'Stomach';
  }

  if (/(others|lain|selain|tenggorokan|kulit|otot|batuk|flu)/.test(text)) {
    return 'Others';
  }

  return null;
};

const scoreDiseaseMatch = (disease: Disease, symptomInput: string) => {
  const normalizedInput = symptomInput.toLowerCase();
  const terms = normalizedInput.split(/\s+/).filter((term) => term.length > 2);

  return terms.reduce((score, term) => {
    const symptomScore = disease.symptoms.some((symptom) => symptom.toLowerCase().includes(term)) ? 2 : 0;
    const nameScore = disease.name.toLowerCase().includes(term) ? 1 : 0;
    return score + symptomScore + nameScore;
  }, 0);
};

export default function NihaoAIWidget({ isOpen, onClose }: NihaoAIWidgetProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [triageStep, setTriageStep] = useState<TriageStep>('awaitingSymptom');
  const [pendingSymptom, setPendingSymptom] = useState('');
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const replyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTriageStep('awaitingSymptom');
      setPendingSymptom('');
      setMessages([
        {
          id: 1,
          sender: 'ai',
          text: 'Halo, saya Nihao AI 2.0. Ceritakan gejala yang Anda rasakan dulu ya, nanti saya bantu triase langkah demi langkah.',
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
      if (triageStep === 'awaitingSymptom' || triageStep === 'completed') {
        // Always ask follow-up first instead of diagnosing immediately.
        setPendingSymptom(trimmedInput);
        setTriageStep('awaitingArea');
        setMessages((current) => [
          ...current,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: 'Terima kasih. Supaya lebih akurat, area keluhannya ada di Head, Stomach, atau Others?',
          },
        ]);
        return;
      }

      const area = normalizeArea(trimmedInput);

      if (!area) {
        setMessages((current) => [
          ...current,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: 'Saya belum bisa mengenali areanya. Balas dengan salah satu: Head, Stomach, atau Others.',
          },
        ]);
        return;
      }

      const rankedMatches = diseases
        .filter((disease) => disease.triage_category === area)
        .map((disease) => ({ disease, score: scoreDiseaseMatch(disease, pendingSymptom) }))
        .sort((a, b) => b.score - a.score);

      const bestMatches = rankedMatches.slice(0, 3).map((item) => item.disease);
      const primaryMatch = bestMatches[0];

      if (!primaryMatch) {
        setMessages((current) => [
          ...current,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: 'Saya belum menemukan saran yang tepat dari area tersebut. Anda bisa coba jelaskan gejala dengan detail lain.',
            ctaLink: '/doctors',
          },
        ]);
        setTriageStep('completed');
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `Berdasarkan triase ${area}, keluhan Anda paling mendekati ${primaryMatch.name}. Saran awal: ${primaryMatch.advice}`,
          matches: bestMatches,
          ctaLink: primaryMatch.recommendation_link,
        },
      ]);
      setTriageStep('completed');
    }, 800);
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
              {message.matches && (
                <div className="mt-3 space-y-2">
                  {message.matches.map((disease) => (
                    <div key={disease.id} className="rounded-2xl border border-gray-100 bg-[#F9FBFB] p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{disease.name}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          Gejala terkait: {disease.symptoms.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {message.ctaLink && (
                <Link
                  to={message.ctaLink}
                  className="mt-3 inline-flex rounded-full bg-[#268489] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1f6f73]"
                >
                  {message.ctaLink === '/shop' ? 'Lihat Produk Rekomendasi' : 'Konsultasi Dokter Sekarang'}
                </Link>
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
            placeholder={
              triageStep === 'awaitingArea'
                ? 'Balas: Head / Stomach / Others'
                : 'Tulis gejala atau pertanyaan...'
            }
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
