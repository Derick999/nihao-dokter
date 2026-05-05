import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, ShoppingCart, Star, Trash2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

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
      img: 'https://picsum.photos/seed/medicine1/300/300',
      description: 'Obat penurun panas dan pereda nyeri ringan hingga sedang.'
    },
    {
      id: 2,
      name: 'Vitamin C 1000mg',
      category: 'Suplemen',
      price: 45000,
      rating: 4.9,
      reviews: 342,
      img: 'https://picsum.photos/seed/medicine2/300/300',
      description: 'Suplemen vitamin C untuk menjaga daya tahan tubuh.'
    },
    {
      id: 3,
      name: 'Madu Murni 500ml',
      category: 'Herbal',
      price: 85000,
      rating: 5.0,
      reviews: 89,
      img: 'https://picsum.photos/seed/medicine3/300/300',
      description: 'Madu murni alami untuk kesehatan dan stamina.'
    }
  ];

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

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

  const addToCart = (product: Product) => {
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

  const startPaymentVerification = () => {
    if (cartItems.length === 0) {
      return;
    }

    setIsVerifyingPayment(true);
    setPaymentProgress(0);
    const startedAt = Date.now();
    const durationMs = 3000;
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min((elapsed / durationMs) * 100, 100);
      setPaymentProgress(nextProgress);

      if (nextProgress >= 100) {
        window.clearInterval(interval);
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
        localStorage.removeItem('nihao_cart_items');
        setCartItems([]);
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        setIsVerifyingPayment(false);
        navigate('/payment-success');
      }
    }, 100);
  };

  return (
    <main className="flex-grow bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Apotek <span className="text-[#268489]">Online</span>
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
                  className="w-full h-full object-cover"
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
                onClick={() => setIsCheckoutOpen(true)}
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
              <h3 className="text-xl font-bold text-gray-900">Pembayaran QRIS</h3>
              <button
                type="button"
                onClick={() => !isVerifyingPayment && setIsCheckoutOpen(false)}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
                aria-label="Close checkout modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-4 text-sm text-gray-500">Scan QRIS di bawah ini untuk menyelesaikan pembayaran.</p>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <img
                src="https://picsum.photos/seed/qris-placeholder/320/320"
                alt="QRIS placeholder"
                className="mx-auto h-56 w-56 rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="mt-4 text-sm text-gray-600">Total bayar: <span className="font-bold text-[#0D503C]">{formatRupiah(totalPrice)}</span></p>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <motion.div
                className="h-full rounded-full bg-[#268489]"
                animate={{ width: `${paymentProgress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {isVerifyingPayment ? 'Memverifikasi pembayaran...' : 'Klik tombol di bawah untuk simulasi verifikasi 3 detik.'}
            </p>

            <button
              type="button"
              onClick={startPaymentVerification}
              disabled={isVerifyingPayment}
              className="mt-5 w-full rounded-xl bg-[#268489] px-4 py-3 text-sm font-semibold text-white transition enabled:hover:bg-[#1f6f73] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isVerifyingPayment ? 'Memproses...' : 'Pay Now'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
