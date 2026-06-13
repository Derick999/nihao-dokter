import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Lock, Package, Stethoscope } from 'lucide-react';
import { getStoredUser } from '../utils/auth';
import { getActiveSession, isSessionStillActive } from '../utils/chatFlow';
import BackButton from '../components/BackButton';

type FilterType = 'Semua' | 'Konsultasi Dokter' | 'Pesanan Shop';

type ConsultationHistoryItem = {
  id: string;
  type: 'Konsultasi Dokter';
  doctorName: string;
  specialty: string;
  avatarSeed: string;
  date: string;
  transcript?: Array<{
    id: number;
    sender: 'dokter' | 'pasien';
    content: string;
    time: string;
  }>;
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
    price: 'Rp 15.000',
    image: '/shop/paracetamol.jpg',
    date: '07 Mei 2026, 14:22',
    status: 'Selesai',
  },
  {
    id: 'shop-2',
    type: 'Pesanan Shop',
    productName: 'Vitamin C 1000mg',
    price: 'Rp 45.000',
    image: '/shop/VITAMIN C.jpg',
    date: '08 Mei 2026, 09:05',
    status: 'Selesai',
  },
  {
    id: 'shop-3',
    type: 'Pesanan Shop',
    productName: 'Madu Murni 500ml',
    price: 'Rp 85.000',
    image: '/shop/honey jar.jpg',
    date: '08 Mei 2026, 09:20',
    status: 'Selesai',
  },
];

const filters: FilterType[] = ['Semua', 'Konsultasi Dokter', 'Pesanan Shop'];

const monthToNumber: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  Mei: 4,
  Jun: 5,
  Jul: 6,
  Agu: 7,
  Sep: 8,
  Okt: 9,
  Nov: 10,
  Des: 11,
};

const parseHistoryDate = (value: string) => {
  const matched = value.match(/^(\d{2})\s([A-Za-z]+)\s(\d{4}),\s(\d{2}):(\d{2})$/);
  if (!matched) {
    return 0;
  }
  const [, day, monthLabel, year, hour, minute] = matched;
  const month = monthToNumber[monthLabel];
  if (month === undefined) {
    return 0;
  }
  return new Date(Number(year), month, Number(day), Number(hour), Number(minute)).getTime();
};

const getIdTimestamp = (id: string) => {
  const matched = id.match(/-(\d+)$/);
  return matched ? Number(matched[1]) : 0;
};

export default function Riwayat() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('Semua');
  const [activeSessionSnapshot, setActiveSessionSnapshot] = useState(getActiveSession());
  const [storedConsultationItems, setStoredConsultationItems] = useState<ConsultationHistoryItem[]>([]);
  const [storedShopItems, setStoredShopItems] = useState<ShopHistoryItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ConsultationHistoryItem | null>(null);

  const mockConversation = useMemo(
    () => [
      { id: 1, sender: 'dokter' as const, content: 'Halo, silakan ceritakan keluhan utama Anda.', time: '20:10' },
      { id: 2, sender: 'pasien' as const, content: 'Saya demam sejak tadi malam, Dok.', time: '20:11' },
      { id: 3, sender: 'dokter' as const, content: 'Baik, tetap cukup cairan dan pantau suhu tiap 4 jam ya.', time: '20:12' },
    ],
    [],
  );

  useEffect(() => {
    setIsLoggedIn(Boolean(getStoredUser()));
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSessionSnapshot(getActiveSession());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadShopHistory = () => {
      try {
        const savedRaw = localStorage.getItem('shop_order_history');
        if (!savedRaw) {
          setStoredShopItems([]);
          return;
        }
        const parsed = JSON.parse(savedRaw) as unknown;
        if (!Array.isArray(parsed)) {
          setStoredShopItems([]);
          return;
        }
        const validItems = parsed.filter((item): item is ShopHistoryItem => {
          if (!item || typeof item !== 'object') {
            return false;
          }
          const candidate = item as Record<string, unknown>;
          return (
            typeof candidate.id === 'string' &&
            candidate.type === 'Pesanan Shop' &&
            typeof candidate.productName === 'string' &&
            typeof candidate.price === 'string' &&
            typeof candidate.image === 'string' &&
            typeof candidate.date === 'string' &&
            candidate.status === 'Selesai'
          );
        });
        setStoredShopItems(validItems);
      } catch {
        setStoredShopItems([]);
      }
    };

    loadShopHistory();
    window.addEventListener('storage', loadShopHistory);
    return () => window.removeEventListener('storage', loadShopHistory);
  }, []);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedRaw = localStorage.getItem('consultation_history');
        if (!savedRaw) {
          setStoredConsultationItems([]);
          return;
        }

        const parsed = JSON.parse(savedRaw) as unknown;
        if (!Array.isArray(parsed)) {
          setStoredConsultationItems([]);
          return;
        }

        const validItems = parsed.filter((item): item is ConsultationHistoryItem => {
          if (!item || typeof item !== 'object') {
            return false;
          }
          const candidate = item as Record<string, unknown>;
          return (
            typeof candidate.id === 'string' &&
            candidate.type === 'Konsultasi Dokter' &&
            typeof candidate.doctorName === 'string' &&
            typeof candidate.specialty === 'string' &&
            typeof candidate.avatarSeed === 'string' &&
            typeof candidate.date === 'string' &&
            (candidate.transcript === undefined || Array.isArray(candidate.transcript))
          );
        });

        setStoredConsultationItems(validItems);
      } catch {
        setStoredConsultationItems([]);
      }
    };

    loadHistory();
    window.addEventListener('storage', loadHistory);
    return () => window.removeEventListener('storage', loadHistory);
  }, []);

  const hasActiveSession = Boolean(
    activeSessionSnapshot && isSessionStillActive(activeSessionSnapshot.startedAt),
  );

  const allItems = useMemo<HistoryItem[]>(
    () => {
      const combinedItems = [...storedConsultationItems, ...consultationItems, ...shopItems];
      const combinedWithStoredShop = [...combinedItems, ...storedShopItems];
      return combinedWithStoredShop.sort((a, b) => {
        const idDiff = getIdTimestamp(b.id) - getIdTimestamp(a.id);
        if (idDiff !== 0) {
          return idDiff;
        }
        return parseHistoryDate(b.date) - parseHistoryDate(a.date);
      });
    },
    [storedConsultationItems, storedShopItems],
  );

  const filteredItems = useMemo(() => {
    if (selectedFilter === 'Semua') {
      return allItems;
    }
    return allItems.filter((item) => item.type === selectedFilter);
  }, [allItems, selectedFilter]);

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-[calc(100vh-9rem)] flex-grow items-center justify-center bg-[#F7FBFC] px-4 py-12">
        <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF7F4] text-[#268489]">
            <History className="h-8 w-8" />
          </div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-gray-600">
            <Lock className="h-3.5 w-3.5" />
            Area Terproteksi
          </div>
          <h2 className="text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
            Akses Riwayat Konsultasi Dokter & Catatan Medis Online
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            Silakan masuk ke akun Anda untuk melihat kembali seluruh riwayat konsultasi dokter dan rangkuman resep obat digital Anda dengan aman.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#268489] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1f6f73]"
          >
            Login / Register
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-9rem)] flex-grow bg-[#F7FBFC] py-8 sm:py-10">
      <section className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="pt-1">
          <BackButton />
        </div>
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
          {selectedChat ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Detail Transkrip Konsultasi</h2>
                  <p className="mt-1 text-xs font-medium text-[#268489]">{selectedChat.doctorName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedChat(null)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Back
                </button>
              </div>

              <div className="h-[420px] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-[#EDF6F8] px-4 py-4 sm:px-5">
                {(selectedChat.transcript && selectedChat.transcript.length > 0
                  ? selectedChat.transcript
                  : mockConversation
                ).map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'pasien' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                        message.sender === 'pasien'
                          ? 'rounded-br-md bg-[#D7F0EE] text-gray-800'
                          : 'rounded-bl-md bg-white text-gray-700'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="mt-1 text-right text-[11px] text-gray-500">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
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
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedChat(item)}
                            className="inline-flex items-center justify-center rounded-full border border-[#268489] px-4 py-2 text-xs font-semibold text-[#268489] hover:bg-[#EAF7F4]"
                          >
                            Lihat Detail
                          </button>
                          <Link
                            to="/"
                            className="inline-flex items-center justify-center rounded-full bg-[#268489] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f6f73]"
                          >
                            Chat Ulang
                          </Link>
                        </div>
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
            </>
          )}
        </section>
      </section>
    </main>
  );
}
