import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

type TransactionItem = {
  name: string;
  qty: number;
  subtotal: number;
};

type TransactionSummary = {
  orderId: string;
  totalItems: number;
  totalPrice: number;
  paidAt: string;
  items: TransactionItem[];
};

export default function PaymentSuccess() {
  const [summary, setSummary] = useState<TransactionSummary | null>(null);

  useEffect(() => {
    const storedSummary = localStorage.getItem('nihao_last_transaction');
    if (!storedSummary) {
      return;
    }

    try {
      const parsedSummary = JSON.parse(storedSummary) as TransactionSummary;
      setSummary(parsedSummary);
    } catch {
      // Ignore invalid transaction summary.
    }
  }, []);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

  return (
    <main className="flex-grow bg-[#f1faf9] py-14">
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white bg-white p-8 shadow-sm sm:p-10">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
            >
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.35 }}
              >
                <Check className="h-10 w-10" />
              </motion.div>
            </motion.div>
            <h1 className="text-3xl font-extrabold text-gray-900">Pembayaran Berhasil</h1>
            <p className="mt-2 text-gray-500">
              Terima kasih, transaksi Anda sudah terverifikasi. Pesanan sedang diproses.
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-[#f6fbfa] p-5">
            <h2 className="text-lg font-bold text-gray-900">Ringkasan Transaksi</h2>
            {summary ? (
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <p><span className="font-semibold text-gray-800">Order ID:</span> {summary.orderId}</p>
                <p><span className="font-semibold text-gray-800">Waktu Pembayaran: </span> {new Date(summary.paidAt).toLocaleString('id-ID')}</p>
                <p><span className="font-semibold text-gray-800">Total Item:</span> {summary.totalItems}</p>
                <p className="text-base font-bold text-[#0D503C]">Total Bayar: {formatRupiah(summary.totalPrice)}</p>
                <div className="pt-2">
                  <p className="mb-2 font-semibold text-gray-800">Detail Item:</p>
                  <div className="space-y-2">
                    {summary.items.map((item) => (
                      <div key={`${item.name}-${item.qty}`} className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                        <p className="text-gray-700">{item.name} x{item.qty}</p>
                        <p className="font-medium text-gray-900">{formatRupiah(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                Ringkasan tidak ditemukan. Silakan kembali ke shop untuk membuat transaksi baru.
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full bg-[#268489] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1f6f73]"
            >
              Kembali ke Shop
            </Link>
            <Link
              to="/layanan"
              className="inline-flex items-center justify-center rounded-full border border-[#268489]/25 bg-[#EAF7F4] px-6 py-3 text-sm font-semibold text-[#268489] transition hover:bg-[#dff2ef]"
            >
              Lihat Layanan Kesehatan
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
