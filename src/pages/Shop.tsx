import { ShoppingCart, Star } from 'lucide-react';

export default function Shop() {
  const products = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      category: 'Obat Demam',
      price: 'Rp 15.000',
      rating: 4.8,
      reviews: 124,
      img: 'https://picsum.photos/seed/medicine1/300/300',
      description: 'Obat penurun panas dan pereda nyeri ringan hingga sedang.'
    },
    {
      id: 2,
      name: 'Vitamin C 1000mg',
      category: 'Suplemen',
      price: 'Rp 45.000',
      rating: 4.9,
      reviews: 342,
      img: 'https://picsum.photos/seed/medicine2/300/300',
      description: 'Suplemen vitamin C untuk menjaga daya tahan tubuh.'
    },
    {
      id: 3,
      name: 'Madu Murni 500ml',
      category: 'Herbal',
      price: 'Rp 85.000',
      rating: 5.0,
      reviews: 89,
      img: 'https://picsum.photos/seed/medicine3/300/300',
      description: 'Madu murni alami untuk kesehatan dan stamina.'
    }
  ];

  return (
    <main className="flex-grow bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Apotek <span className="text-[#2E7D32]">Online</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Beli obat dan vitamin terpercaya dengan mudah. Pengiriman cepat langsung ke rumah Anda.
          </p>
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
                  <span className="text-2xl font-bold text-[#D32F2F]">{product.price}</span>
                  <button className="bg-[#2E7D32] hover:bg-green-800 text-white p-3 rounded-xl transition-colors flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
