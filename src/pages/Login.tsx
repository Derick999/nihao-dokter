import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, UserRound } from 'lucide-react';
import { getStoredUser, loginUser } from '../utils/auth';

type LoginProps = {
  onAuthSuccess: () => void;
};

export default function Login({ onAuthSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const existingUser = getStoredUser();

    loginUser({
      username,
      fullName: existingUser?.fullName || username,
      birthDate: existingUser?.birthDate,
      gender: existingUser?.gender,
      weight: existingUser?.weight,
      height: existingUser?.height,
      history: existingUser?.history,
    });

    onAuthSuccess();
    navigate('/');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#268489]">Masuk ke NihaoDokter</p>
          <h1 className="text-3xl font-bold text-gray-900">Login akun Anda</h1>
          <p className="mt-3 text-sm text-gray-500">Masuk untuk mulai chat dokter dan menggunakan Nihao AI.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Username</span>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Password</span>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
              />
            </div>
          </label>

          <div className="text-right">
            <a href="#" className="text-sm text-[#268489] hover:text-[#1f6f73]">Lupa Password?</a>
          </div>

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#268489] text-sm font-semibold text-white transition hover:bg-[#1f6f73]"
          >
            Login
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-[#268489] hover:text-[#1f6f73]">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}
