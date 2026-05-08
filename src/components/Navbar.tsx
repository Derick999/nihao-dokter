import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, House, BookOpen, Stethoscope, LogOut, User, Info } from 'lucide-react';
import { useState } from 'react';
import { StoredUser } from '../utils/auth';
import SearchBar from './SearchBar';

type NavbarProps = {
  currentUser: StoredUser | null;
  onLogout: () => void;
};

export default function Navbar({ currentUser, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navLinks = [
    { name: 'Beranda', path: '/', icon: <House className="h-4 w-4" /> },
    { name: 'Riwayat', path: '/riwayat', icon: <Stethoscope className="h-4 w-4" /> },
    { name: 'Nihao Shop', path: '/shop', icon: <ShoppingBag className="h-4 w-4" /> },
    { name: 'Artikel', path: '/artikel', icon: <BookOpen className="h-4 w-4" /> },
    { name: 'Tentang', path: '/tentang-kami', icon: <Info className="h-4 w-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-4 py-3">
          {/* Logo & Search Area */}
          <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-5">
            <Link to="/" className="flex shrink-0 items-center">
              <img src="/Nihao Dokters.png" alt="Logo NihaoDokter" className="h-10 w-auto" />
              <span className="font-bold text-2xl tracking-tight hidden sm:block">
                <span className="text-[#D32F2F]">Nihao</span>
                <span className="text-[#0D503C]">Dokter</span>
              </span>
            </Link>

            <SearchBar />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-[#E9F6F3] text-[#268489]'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#268489]'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Profile Link - Klik Nama ke Halaman Register/Lengkapi Profil */}
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full border border-[#268489]/20 bg-[#EAF7F4] px-4 py-2.5 text-sm font-medium text-[#268489] transition-all hover:bg-[#DDF1EF] hover:shadow-sm"
                >
                  <User className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">{currentUser.fullName || currentUser.username}</span>
                </Link>

                {/* Separate Logout Button */}
                <button
                  type="button"
                  onClick={onLogout}
                  title="Logout"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-red-100 bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-[#268489] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1f6f73]"
              >
                Masuk/Daftar
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#268489] focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden animate-in fade-in slide-in-from-top-4">
          <div className="space-y-3 px-4 pb-5 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-[#E9F6F3] text-[#268489]'
                    : 'text-gray-700'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            <div className="border-t border-gray-50 pt-3">
              {currentUser ? (
                <div className="grid grid-cols-5 gap-2">
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="col-span-4 flex items-center gap-2 rounded-xl bg-[#EAF7F4] px-4 py-3 text-sm font-medium text-[#268489]"
                  >
                    <User className="h-4 w-4" />
                    <span className="truncate">{currentUser.fullName || currentUser.username}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onLogout();
                    }}
                    className="flex items-center justify-center rounded-xl bg-red-50 text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full rounded-xl bg-[#268489] px-4 py-3 text-center text-sm font-medium text-white"
                >
                  Masuk/Daftar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}