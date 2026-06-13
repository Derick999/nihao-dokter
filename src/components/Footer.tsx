import { Link } from 'react-router-dom';
import { Stethoscope, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

type FooterProps = {
  onOpenChat: (doctor: { name: string; img: string }) => void;
};

export default function Footer({ onOpenChat }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Rombak Grid Menjadi 12 Kolom Biar Pembagian 3 Blok Proporsional */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          
          {/* KOLOM 1: PROFILE, LOGO ASLI, & SOSMED REAL LINKS (md:col-span-5) */}
          <div className="md:col-span-5">
            {/* LOGO ASLI LU DIKEMBALIKAN UTUH TANPA PERUBAHAN */}
            <Link to="/" className="flex items-center shrink-0 mb-4">
              <div className="w-8 h-8 bg-[#D32F2F] rounded-full flex items-center justify-center mr-2">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight">
                <span className="text-[#D32F2F]">Nihao</span>
                <span className="text-[#268489]">Dokter</span>
              </span>
            </Link>
            
            <p className="text-gray-500 text-sm mb-4 max-w-sm">
              Platform kesehatan terpercaya untuk konsultasi dokter online, beli obat secara praktis, dan edukasi kesehatan terkurasi.
            </p>
            
            {/* SOSMED DIARAHKAN KE WEB UTAMA TERKAIT */}
            <div className="flex space-x-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#2E7D32] transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#2E7D32] transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#2E7D32] transition-colors">
                <span className="sr-only">X (Twitter)</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#2E7D32] transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* KOLOM 2: PARTNER KAMI - TETAP ADALAH KUNCI BACKLINK (md:col-span-4) */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Partner Kami
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.denifferscookies.web.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 transition-colors hover:text-[#268489]"
                >
                  Deniffer&apos;s Cookies
                </a>
              </li>
              <li>
                <a
                  href="https://www.zaffrino.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 transition-colors hover:text-[#268489]"
                >
                  Zaffrino
                </a>
              </li>
              <li>
                <a
                  href="https://sites.google.com/view/pawbieast/beranda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 transition-colors hover:text-[#268489]"
                >
                  Pawbieast
                </a>
              </li>
              <li>
                <a
                  href="https://www.inirasa.biz.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 transition-colors hover:text-[#268489]"
                >
                  Inirasa
                </a>
              </li>
              <li>
                <a
                  href="https://kicaucafe.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 transition-colors hover:text-[#268489]"
                >
                  Kicau Cafe
                </a>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: GABUNGAN PERUSAHAAN & LEGAL MENJADI "LAINNYA" (md:col-span-3) */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Lainnya
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/tentang-kami" className="text-gray-500 transition-colors hover:text-[#268489]">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-500 transition-colors hover:text-[#268489]">
                  Karir
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 transition-colors hover:text-[#268489]">
                  Hubungi Kami
                </a>
              </li>
              <li className="pt-2 border-t border-gray-100 mt-2">
                <a href="#" className="text-gray-500 transition-colors hover:text-[#268489] font-medium">
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-12 border-t border-gray-200 pt-8 text-center md:text-left">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} NihaoDokter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}