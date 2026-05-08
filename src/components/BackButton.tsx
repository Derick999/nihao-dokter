import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 rounded-full border border-[#268489]/25 bg-white px-4 py-2 text-sm font-semibold text-[#268489] shadow-sm transition-all duration-200 hover:-translate-x-1 hover:bg-[#EAF7F4] hover:opacity-95"
      aria-label="Kembali ke halaman sebelumnya"
    >
      <ArrowLeft className="h-4 w-4" />
      Kembali
    </button>
  );
}
