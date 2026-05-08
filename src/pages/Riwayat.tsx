import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Stethoscope } from 'lucide-react';
import { getActiveSession, isSessionStillActive } from '../utils/chatFlow';

type FilterType = 'Semua' | 'Konsultasi Dokter' | 'Pesanan Shop';

type ConsultationHistoryItem = {
  id: string;
  type: 'Konsultasi Dokter';
  doctorName: string;
  specialty: string;
  avatarSeed: string;
  date: string;
};

type ShopHistoryItem = {
  id: string;
  type: 'Pesanan Shop';
  productName: string;
  price: string;
  image: string;
  date: string;
  status: 'Selesai';
};

type HistoryItem = ConsultationHistoryItem | ShopHistoryItem;

const consultationItems: ConsultationHistoryItem[] = [
  {
    id: 'consult-1',
    type: 'Konsultasi Dokter',
    doctorName: 'Dr. Andi Prasetyo, Sp.A',
    specialty: 'Spesialis Anak',
    avatarSeed: 'dr-andi-prasetyo',
    date: '03 Mei 2026, 20:10',
  },
  {
    id: 'consult-2',
    type: 'Konsultasi Dokter',
    doctorName: 'Dr. Siti Rahmawati, Sp.PD',
    specialty: 'Spesialis Penyakit Dalam',
    avatarSeed: 'dr-siti-rahmawati',
    date: '06 Mei 2026, 10:31',
  },
];

const shopItems: ShopHistoryItem[] = [
  {
    id: 'shop-1',
    type: 'Pesanan Shop',
    productName: 'Paracetamol 500mg',
    price: 'Rp 28.000',
    image: 'https://picsum.photos/seed/paracetamol/200/200',
    date: '07 Mei 2026, 14:22',
    status: 'Selesai',
  },
  {
    id: 'shop-2',
    type: 'Pesanan Shop',
    productName: 'Vitamin C 1000mg',
    price: 'Rp 65.000',
    image: 'https://picsum.photos/seed/vitamin-c/200/200',
    date: '08 Mei 2026, 09:05',
    status: 'Selesai',
  },
];

const filters: FilterType[] = ['Semua', 'Konsultasi Dokter', 'Pesanan Shop'];

export default function Riwayat() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('Semua');
  const [activeSessionSnapshot, setActiveSessionSnapshot] = useState(getActiveSession());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSessionSnapshot(getActiveSession());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const hasActiveSession = Boolean(
    activeSessionSnapshot && isSessionStillActive(activeSessionSnapshot.startedAt),
  );

  const allItems = useMemo<HistoryItem[]>(
    () => [...consultationItems, ...shopItems].sort((a, b) => (a.id < b.id ? 1 : -1)),
    [],
  );

  const filteredItems = useMemo(() => {
    if (selectedFilter === 'Semua') {
      return allItems;
    }
    return allItems.filter((item) => item.type === selectedFilter);
  }, [allItems, selectedFilter]);

  return (
    <main className="min-h-[calc(100vh-9rem)] flex-grow bg-[#F7FBFC] py-8 sm:py-10">
      <section className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Riwayat</h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Ringkasan aktivitas konsultasi dan pesanan Anda.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Sesi Chat Aktif</h2>

          {hasActiveSession && activeSessionSnapshot ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-[#F3FAFA] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeSessionSnapshot.avatarSeed}`}
                    alt={`${activeSessionSnapshot.doctorName} profile`}
                    className="h-12 w-12 rounded-full border border-slate-200 bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                      {activeSessionSnapshot.doctorName}, {activeSessionSnapshot.doctorTitle}
                    </h3>
                    <p className="text-xs font-medium text-[#268489]">{activeSessionSnapshot.specialization}</p>
                    <p className="mt-1 text-xs text-gray-500">Pasien: {activeSessionSnapshot.patientName}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                    Chat Berlangsung
                  </span>
                  <Link
                    to="/chat-room"
                    className="rounded-full bg-[#268489] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f6f73]"
                  >
                    Lanjutkan Chat
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-gray-600">
              Saat ini tidak ada sesi chat yang aktif. Mulai konsultasi baru di halaman Beranda.
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Riwayat Aktivitas</h2>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                    selectedFilter === filter
                      ? 'bg-[#268489] text-white'
                      : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredItems.map((item) =>
              item.type === 'Konsultasi Dokter' ? (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.avatarSeed}`}
                        alt={`${item.doctorName} profile`}
                        className="h-12 w-12 rounded-full border border-slate-200 bg-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
                          <Stethoscope className="h-3.5 w-3.5" />
                          Konsultasi
                        </span>
                        <h3 className="mt-2 truncate text-sm font-bold text-gray-900 sm:text-base">{item.doctorName}</h3>
                        <p className="text-xs font-medium text-[#268489]">{item.specialty}</p>
                        <p className="mt-1 text-xs text-gray-500">{item.date}</p>
                      </div>
                    </div>
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center rounded-full bg-[#268489] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f6f73]"
                    >
                      Chat Ulang
                    </Link>
                  </div>
                </article>
              ) : (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-100 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-[11px] font-semibold text-purple-700">
                          <Package className="h-3.5 w-3.5" />
                          Shop
                        </span>
                        <h3 className="mt-2 truncate text-sm font-bold text-gray-900 sm:text-base">{item.productName}</h3>
                        <p className="text-xs font-medium text-[#0D503C]">{item.price}</p>
                        <p className="mt-1 text-xs text-gray-500">{item.date}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700">
                      {item.status}
                    </span>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
