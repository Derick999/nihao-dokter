import { FormEvent, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Save } from 'lucide-react';
import { loginUser, getStoredUser } from '../utils/auth';

type RegisterProps = {
  onAuthSuccess: () => void;
};

export default function Register({ onAuthSuccess }: RegisterProps) {
  const navigate = useNavigate();
  
  // 1. Cek apakah user sudah login (buat nentuin mode Edit atau Daftar)
  const existingUser = getStoredUser();
  const isEditMode = !!existingUser;

  const [form, setForm] = useState({
    username: existingUser?.username || '',
    fullName: existingUser?.fullName || '',
    birthDate: existingUser?.birthDate || '',
    gender: existingUser?.gender || '',
    weight: existingUser?.weight || '',
    height: existingUser?.height || '',
    history: existingUser?.history || '',
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    loginUser(form);
    onAuthSuccess();
    // Kalau habis edit, balik ke home aja
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="mb-8">
          {/* Teks kecil di atas ganti sesuai kondisi */}
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#268489]">
            {isEditMode ? 'Profil Saya' : 'Daftar NihaoDokter'}
          </p>
          
          {/* Judul ganti sesuai kondisi */}
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Update data kesehatan Anda' : 'Buat profil kesehatan Anda'}
          </h1>
          
          <p className="mt-3 text-sm text-gray-500">
            {isEditMode 
              ? 'Pastikan data berat dan tinggi badan Anda akurat untuk perhitungan BMI yang tepat.' 
              : 'Lengkapi data dasar agar konsultasi dokter dan Nihao AI jadi lebih relevan.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Data Wajib</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Username</span>
                <input
                  required
                  disabled={isEditMode} // Username biasanya nggak boleh diganti kalau udah daftar
                  value={form.username}
                  onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                  className={`h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100 ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'}`}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Nama Lengkap</span>
                <input
                  required
                  value={form.fullName}
                  onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
              </label>
              {/* ... sisanya tetap sama ... */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Tanggal Lahir</span>
                <input
                  required
                  type="date"
                  value={form.birthDate}
                  onChange={(event) => setForm((current) => ({ ...current, birthDate: event.target.value }))}
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Jenis Kelamin</span>
                <select
                  required
                  value={form.gender}
                  onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
                >
                  <option value="">Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </label>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Data Tambahan</h2>
              <span className="rounded-full bg-[#EAF7F4] px-3 py-1 text-xs font-medium text-[#268489]">Opsional</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Berat Badan</span>
                <input
                  value={form.weight}
                  onChange={(event) => setForm((current) => ({ ...current, weight: event.target.value }))}
                  placeholder="contoh: 60"
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Tinggi Badan</span>
                <input
                  value={form.height}
                  onChange={(event) => setForm((current) => ({ ...current, height: event.target.value }))}
                  placeholder="contoh: 170"
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-gray-700">Riwayat Penyakit</span>
                <textarea
                  value={form.history}
                  onChange={(event) => setForm((current) => ({ ...current, history: event.target.value }))}
                  placeholder="Tuliskan alergi, riwayat penyakit, atau obat rutin bila ada"
                  className="min-h-28 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
              </label>
            </div>
          </section>

          {/* TOMBOL DINAMIS */}
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#268489] text-sm font-semibold text-white transition hover:bg-[#1f6f73]"
          >
            {isEditMode ? (
              <>
                Simpan Perubahan
                <Save className="h-4 w-4" />
              </>
            ) : (
              <>
                Daftar & Masuk
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* FOOTER DINAMIS: Kalau udah login, bagian "Sudah punya akun" diilangin */}
        {!isEditMode && (
          <p className="mt-6 text-center text-sm text-gray-500">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold text-[#268489] hover:text-[#1f6f73]">
              Login sekarang
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}