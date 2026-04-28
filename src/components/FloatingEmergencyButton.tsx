import { PhoneCall } from 'lucide-react';

export default function FloatingEmergencyButton() {
  return (
    <a
      href="tel:119"
      className="fixed bottom-6 right-6 z-50 bg-[#D32F2F] text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-transform transform hover:scale-110 flex items-center justify-center group"
      aria-label="Emergency Call"
    >
      <PhoneCall className="w-6 h-6 animate-pulse" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap font-bold ml-0 group-hover:ml-2">
        DARURAT
      </span>
    </a>
  );
}
