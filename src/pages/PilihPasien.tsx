import { FormEvent, useMemo, useState } from 'react';
import { Copy, QrCode } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getStoredUser } from '../utils/auth';
import {
  clearPendingDoctor,
  getFamilyProfiles,
  getPendingDoctor,
  saveActiveSession,
  saveFamilyProfiles,
  type FamilyProfile,
} from '../utils/chatFlow';

type PaymentMethod = 'qris' | 'va';

export default function PilihPasien() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<FamilyProfile[]>(getFamilyProfiles());
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.id ?? '');
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const [newProfile, setNewProfile] = useState({ fullName: '', dob: '', relationship: '' });
  const [paymentStep, setPaymentStep] = useState<'idle' | 'ready' | 'processing' | 'success'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [copiedVa, setCopiedVa] = useState(false);

  const user = getStoredUser();
  const doctor = getPendingDoctor();

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedProfileId) ?? null,
    [profiles, selectedProfileId],
  );
  const vaCode = useMemo(() => `ABC-${Math.floor(100000 + Math.random() * 900000)}`, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!doctor) {
    return (
      <main className="flex min-h-[calc(100vh-9rem)] flex-grow items-center justify-center bg-[#F7FBFC] px-4 py-10">
        <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Belum ada dokter yang dipilih</h1>
          <p className="mt-3 text-sm text-gray-600">Silakan pilih dokter dulu dari halaman beranda.</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 rounded-full bg-[#268489] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Kembali ke Beranda
          </button>
        </section>
      </main>
    );
  }

  const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newProfile.fullName || !newProfile.dob || !newProfile.relationship) {
      return;
    }

    const created: FamilyProfile = {
      id: `family-${Date.now()}`,
      fullName: newProfile.fullName,
      dob: newProfile.dob,
      relationship: newProfile.relationship,
    };

    const updatedProfiles = [...profiles, created];
    setProfiles(updatedProfiles);
    saveFamilyProfiles(updatedProfiles);
    setSelectedProfileId(created.id);
    setNewProfile({ fullName: '', dob: '', relationship: '' });
    setShowNewProfileForm(false);
  };

  const completePayment = (delayMs: number) => {
    setPaymentStep('processing');
    window.setTimeout(() => {
      if (!selectedProfile) {
        return;
      }

      saveActiveSession({
        doctorName: doctor.doctorName,
        doctorTitle: doctor.doctorTitle,
        specialization: doctor.specialization,
        avatarSeed: doctor.avatarSeed,
        patientName: selectedProfile.fullName,
        startedAt: Date.now(),
      });
      clearPendingDoctor();
      setPaymentStep('success');
      window.setTimeout(() => {
        navigate('/chat-room');
      }, 700);
    }, delayMs);
  };

  return (
    <main className="flex-grow bg-[#F7FBFC] py-8 sm:py-10">
      <section className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Pilih Pasien</h1>
          <p className="mt-2 text-sm text-gray-600">
            Anda akan konsultasi dengan <span className="font-semibold text-[#0D503C]">{doctor.doctorName}</span> (
            {doctor.specialization}) - Rp {doctor.price.toLocaleString('id-ID')}
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900">Profil Keluarga</h2>
            <button
              type="button"
              onClick={() => setShowNewProfileForm((current) => !current)}
              className="rounded-full border border-[#268489] px-4 py-2 text-xs font-semibold text-[#268489] hover:bg-[#EAF7F4]"
            >
              + Profil Baru
            </button>
          </div>

          <div className="space-y-3">
            {profiles.map((profile) => (
              <label
                key={profile.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 hover:border-[#268489]/50"
              >
                <input
                  type="radio"
                  name="selectedProfile"
                  value={profile.id}
                  checked={selectedProfileId === profile.id}
                  onChange={() => setSelectedProfileId(profile.id)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{profile.fullName}</p>
                  <p className="text-xs text-gray-500">
                    {profile.relationship} {profile.dob ? `- ${profile.dob}` : ''}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {showNewProfileForm && (
            <form onSubmit={handleSaveProfile} className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={newProfile.fullName}
                onChange={(event) => setNewProfile((current) => ({ ...current, fullName: event.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#268489]"
              />
              <input
                type="date"
                value={newProfile.dob}
                onChange={(event) => setNewProfile((current) => ({ ...current, dob: event.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#268489]"
              />
              <input
                type="text"
                placeholder="Hubungan (Istri/Anak/Orang Tua)"
                value={newProfile.relationship}
                onChange={(event) => setNewProfile((current) => ({ ...current, relationship: event.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#268489] sm:col-span-2"
              />
              <button
                type="submit"
                className="rounded-full bg-[#268489] px-4 py-2 text-sm font-semibold text-white sm:col-span-2"
              >
                Simpan Profil
              </button>
            </form>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Pembayaran ABC Gateway</h2>
          <p className="mt-2 text-sm text-gray-600">Pilih metode pembayaran untuk melanjutkan ke chat aktif.</p>

          {paymentStep === 'idle' && (
            <button
              type="button"
              disabled={!selectedProfile}
              onClick={() => setPaymentStep('ready')}
              className="mt-4 rounded-full bg-[#268489] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Lanjut ke Pembayaran
            </button>
          )}

          {paymentStep !== 'idle' && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    paymentMethod === 'qris' ? 'bg-[#268489] text-white' : 'bg-slate-100 text-gray-700'
                  }`}
                >
                  QRIS
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('va')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    paymentMethod === 'va' ? 'bg-[#268489] text-white' : 'bg-slate-100 text-gray-700'
                  }`}
                >
                  ABC Virtual Account
                </button>
              </div>

              {paymentMethod === 'qris' ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <QrCode className="h-10 w-10 text-[#268489]" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Scan QRIS untuk menyelesaikan pembayaran</p>
                      <p className="text-xs text-gray-500">Simulasi sukses otomatis dalam 5 detik.</p>
                    </div>
                  </div>
                  <div className="mt-4 h-40 rounded-xl border border-dashed border-slate-300 bg-white" />
                  <button
                    type="button"
                    onClick={() => completePayment(5000)}
                    disabled={paymentStep === 'processing'}
                    className="mt-4 rounded-full bg-[#268489] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {paymentStep === 'processing' ? 'Memproses...' : 'Saya Sudah Bayar'}
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-gray-700">Kode VA Anda:</p>
                  <p className="mt-1 text-xl font-bold text-[#0D503C]">{vaCode}</p>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(vaCode);
                      setCopiedVa(true);
                      completePayment(3000);
                    }}
                    disabled={paymentStep === 'processing'}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#268489] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    <Copy className="h-4 w-4" />
                    {copiedVa ? 'Tersalin, proses pembayaran...' : 'Salin'}
                  </button>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  Pembayaran Berhasil! Mengarahkan ke ruang chat...
                </div>
              )}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
