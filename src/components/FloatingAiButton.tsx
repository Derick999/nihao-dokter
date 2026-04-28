import { Bot, Sparkles } from 'lucide-react';

type FloatingAiButtonProps = {
  onClick: () => void;
};

export default function FloatingAiButton({ onClick }: FloatingAiButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-[#268489] px-5 py-3 text-sm font-semibold text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#1f6f73]"
    >
      <Bot className="h-5 w-5" />
      <span>Nihao AI</span>
      <Sparkles className="h-4 w-4" />
    </button>
  );
}
