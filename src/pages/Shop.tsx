import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Lock, Minus, Plus, ShoppingCart, Star, Trash2, WalletCards, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { getStoredUser } from '../utils/auth';
import qrisImage from '../assets/images/my-qris.png';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  img: string;
  description: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type PaymentMethod = 'QRIS' | 'VA';

export default function Shop() {
  const navigate = useNavigate();
  const products: Product[] = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      category: 'Obat Demam',
      price: 15000,
      rating: 4.8,
      reviews: 124,
      img: '/shop/paracetamol.jpg',
      description: 'Obat penurun panas dan pereda nyeri ringan hingga sedang.'
    },
    {
      id: 2,
      name: 'Vitamin C 1000mg',
      category: 'Suplemen',
      price: 45000,
      rating: 4.9,
      reviews: 342,
      img: '/shop/VITAMIN C.jpg',
      description: 'Suplemen vitamin C untuk menjaga daya tahan tubuh.'
    },
    {
      id: 3,
      name: 'Madu Murni 500ml',
      category: 'Herbal',
      price: 85000,
      rating: 5.0,
      reviews: 89,
      img: '/shop/honey jar.jpg',
      description: 'Madu murni alami untuk kesehatan dan stamina.'
    }
  ];

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getStoredUser()));
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem('nihao_cart_items');
    if (!storedCart) {
      return;
    }
    try {
      const parsedCart = JSON.parse(storedCart) as CartItem[];
      if (Array.isArray(parsedCart)) {
        setCartItems(parsedCart);
      }
    } catch {
      // Ignore invalid cart data.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nihao_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems]
  );

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

  const requireAuthForPurchase = () => {
    if (isLoggedIn) {
      return true;
    }
    setShowLoginPrompt(true);
    return false;
  };

  const addToCart = (product: Product) => {
    if (!requireAuthForPurchase()) {
      return;
    }

    setCartItems((current) => {
      const existingItem = current.find((item) => item.product.id === product.id);
      if (existingItem) {
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const increaseQty = (productId: number) => {
    setCartItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (productId: number) => {
    setCartItems((current) =>
      current
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: number) => {
    setCartItems((current) => current.filter((item) => item.product.id !== productId));
  };

  useEffect(() => {
    if (!showSuccessNotification) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowSuccessNotification(false);
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [showSuccessNotification]);

  const completeOrder = () => {
    if (!requireAuthForPurchase() || cartItems.length === 0) {
      return;
    }

    const transactionSummary = {
      orderId: `NH-${Date.now()}`,
      totalItems,
      totalPrice,
      paidAt: new Date().toISOString(),
      items: cartItems.map((item) => ({
        name: item.product.name,
        qty: item.quantity,
        subtotal: item.quantity * item.product.price,
      })),
    };

    localStorage.setItem('nihao_last_transaction', JSON.stringify(transactionSummary));
    const now = new Date();
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const formattedDate = `${String(now.getDate()).padStart(2, '0')} ${monthLabels[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newShopHistory = cartItems.map((item) => ({
      id: `shop-${Date.now()}-${item.product.id}`,
      type: 'Pesanan Shop' as const,
      productName: item.product.name,
      price: formatRupiah(item.product.price * item.quantity),
      image: item.product.img,
      date: formattedDate,
      status: 'Selesai' as const,
    }));
    const previousShopHistoryRaw = localStorage.getItem('shop_order_history');
    let previousShopHistory: unknown[] = [];
    if (previousShopHistoryRaw) {
      try {
        const parsedHistory = JSON.parse(previousShopHistoryRaw);
        if (Array.isArray(parsedHistory)) {
          previousShopHistory = parsedHistory;
        }
      } catch {
        previousShopHistory = [];
      }
    }
    localStorage.setItem('shop_order_history', JSON.stringify([...newShopHistory, ...previousShopHistory]));
    localStorage.removeItem('nihao_cart_items');
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setShowQRISModal(false);
    setShowSuccessNotification(true);

    window.setTimeout(() => {
      navigate('/payment-success');
    }, 900);
  };

  const handleCheckoutPayment = () => {
    if (!requireAuthForPurchase() || !selectedPaymentMethod || cartItems.length === 0) {
      return;
    }

    if (selectedPaymentMethod === 'QRIS') {
      setShowQRISModal(true);
      return;
    }

    completeOrder();
  };

  return (
    <main className="flex-grow bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 pt-1">
          <BackButton />
        </div>
        <div className="mb-12 flex flex-col gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Toko Obat Online & Layanan Farmasi Digital
            </h1>
            <p className="max-w-2xl text-lg text-gray-500">
              Beli obat dan vitamin terpercaya dengan mudah. Pengiriman cepat langsung ke rumah Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#268489] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f6f73] sm:mx-0"
          >
            <ShoppingCart className="h-4 w-4" />
            Keranjang ({totalItems})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="relative h-64 bg-gray-100">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-[#2E7D32] shadow-sm">
                  {product.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                </div>
                
                <div className="flex items-center mb-4">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium text-gray-700">{product.rating}</span>
                  <span className="ml-2 text-sm text-gray-500">({product.reviews} ulasan)</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-[#D32F2F]">{formatRupiah(product.price)}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="bg-[#268489] hover:bg-[#1f6f73] text-white p-3 rounded-xl transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <aside className="h-full w-full max-w-md bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">Keranjang Belanja</h2>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(100vh-200px)] space-y-3 overflow-y-auto px-5 py-4">
              {cartItems.length === 0 ? (
                <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  Keranjang masih kosong. Tambahkan produk dulu ya.
                </p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product.id} className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-500">{formatRupiah(item.product.price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="rounded-full p-2 text-red-500 transition hover:bg-red-50"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1">
                        <button type="button" onClick={() => decreaseQty(item.product.id)} className="rounded-full p-1 text-gray-600 hover:bg-gray-100">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold text-gray-800">{item.quantity}</span>
                        <button type="button" onClick={() => increaseQty(item.product.id)} className="rounded-full p-1 text-gray-600 hover:bg-gray-100">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="font-semibold text-[#268489]">
                        {formatRupiah(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-100 px-5 py-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold text-[#0D503C]">{formatRupiah(totalPrice)}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!requireAuthForPurchase()) {
                    return;
                  }
                  setSelectedPaymentMethod(null);
                  setShowQRISModal(false);
                  setIsCheckoutOpen(true);
                }}
                disabled={cartItems.length === 0}
                className="w-full rounded-xl bg-[#268489] px-4 py-3 text-sm font-semibold text-white transition enabled:hover:bg-[#1f6f73] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Checkout
              </button>
            </div>
          </aside>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Checkout</h3>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
                aria-label="Close checkout modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-4 text-sm text-gray-500">Pilih metode pembayaran untuk menyelesaikan pesanan Anda.</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {(['QRIS', 'VA'] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSelectedPaymentMethod(method)}
                  className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                    selectedPaymentMethod === method
                      ? 'border-[#268489] bg-[#EAF7F4]'
                      : 'border-slate-200 bg-white hover:border-[#268489]/40'
                  }`}
                >
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <WalletCards className="h-4 w-4 text-[#268489]" />
                    {method}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    {method === 'QRIS'
                      ? 'Bayar cepat dengan scan QR dari e-wallet atau mobile banking.'
                      : 'Transfer virtual account dari bank pilihan Anda.'}
                  </p>
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-600">Total bayar: <span className="font-bold text-[#0D503C]">{formatRupiah(totalPrice)}</span></p>

            <button
              type="button"
              onClick={handleCheckoutPayment}
              disabled={!selectedPaymentMethod || cartItems.length === 0}
              className="mt-5 w-full rounded-xl bg-[#268489] px-4 py-3 text-sm font-semibold text-white transition enabled:hover:bg-[#1f6f73] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {isCheckoutOpen && showQRISModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Pembayaran QRIS</h3>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div className="rounded-2xl border border-[#268489]/25 bg-[#F8FCFC] p-4">
                <img
                  src={qrisImage}
                  alt="QRIS code"
                  className="mx-auto h-64 w-64 rounded-xl border border-slate-200 bg-white object-contain p-2"
                />
              </div>
              <p className="text-center text-sm text-gray-600">
                Silakan scan kode QR di atas menggunakan aplikasi e-wallet atau mobile banking Anda.
              </p>
              <p className="text-center text-sm text-gray-600">
                Total bayar: <span className="font-bold text-[#0D503C]">{formatRupiah(totalPrice)}</span>
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowQRISModal(false)}
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={completeOrder}
                className="rounded-full bg-[#268489] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1f6f73]"
              >
                Saya Sudah Bayar
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoginPrompt && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl sm:p-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7F4] text-[#268489]">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Login Diperlukan</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              Silakan masuk ke akun Anda untuk beli obat resep dokter online secara aman.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full bg-[#268489] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1f6f73]"
              >
                Login / Register
              </Link>
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessNotification && (
        <div className="fixed right-4 top-6 z-[90] max-w-xs rounded-2xl border border-emerald-200 bg-emerald-50 p-3 shadow-lg">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
            <p className="text-xs font-semibold text-emerald-700">
              Pembayaran berhasil. Pesanan Anda sedang diproses.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
