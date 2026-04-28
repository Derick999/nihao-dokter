import { Link } from 'react-router-dom';
import { Stethoscope, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

type FooterProps = {
  onOpenChat: (doctor: { name: string; img: string }) => void;
};

export default function Footer({ onOpenChat }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center shrink-0 mb-4">
              <div className="w-8 h-8 bg-[#D32F2F] rounded-full flex items-center justify-center mr-2">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight">
                <span className="text-[#D32F2F]">Nihao</span>
                <span className="text-[##268489]">Dokter</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm mb-4">
              Platform kesehatan terpercaya untuk konsultasi dokter, beli obat, dan edukasi kesehatan.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#2E7D32]">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#2E7D32]">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#2E7D32]">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#2E7D32]">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Layanan
            </h3>
            <ul className="space-y-4">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onOpenChat({
                      name: 'Dr. Sarah',
                      img: 'https://ui-avatars.com/api/?name=Dr.+Sarah&background=E6F4F1&color=268489&bold=true',
                    })
                  }
                  className="text-base text-gray-500 hover:text-[#2E7D32]"
                >
                  Chat Dokter
                </button>
              </li>
              <li>
                <Link to="/shop" className="text-base text-gray-500 hover:text-[#2E7D32]">
                  Apotek Online
                </Link>
              </li>
              <li>
                <Link to="/artikel" className="text-base text-gray-500 hover:text-[#2E7D32]">
                  Artikel Kesehatan
                </Link>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-[#2E7D32]">
                  Buat Janji RS
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Perusahaan
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-[#2E7D32]">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-[#2E7D32]">
                  Karir
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-[#2E7D32]">
                  Hubungi Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-[#2E7D32]">
                  Mitra
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-[#2E7D32]">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-[#2E7D32]">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-[#2E7D32]">
                  Kebijakan Cookie
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} NihaoDokter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
