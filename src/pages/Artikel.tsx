import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function Artikel() {
  const articles = [
    {
      id: 1,
      title: '5 Cara Ampuh Meredakan Sakit Kepala Tanpa Obat',
      excerpt: 'Sakit kepala bisa sangat mengganggu aktivitas. Ketahui cara alami meredakannya dengan cepat dan efektif.',
      date: '12 Mar 2026',
      readTime: '4 min read',
      category: 'Kesehatan Umum',
      img: 'https://picsum.photos/seed/article1/600/400'
    },
    {
      id: 2,
      title: 'Pentingnya Menjaga Kesehatan Mental di Era Digital',
      excerpt: 'Stres akibat media sosial semakin meningkat. Pelajari tips menjaga keseimbangan mental Anda.',
      date: '10 Mar 2026',
      readTime: '6 min read',
      category: 'Psikologi',
      img: 'https://picsum.photos/seed/article2/600/400'
    },
    {
      id: 3,
      title: 'Mitos dan Fakta Seputar Diet Keto',
      excerpt: 'Apakah diet keto benar-benar aman untuk semua orang? Mari kita kupas tuntas mitos dan faktanya.',
      date: '08 Mar 2026',
      readTime: '5 min read',
      category: 'Nutrisi',
      img: 'https://picsum.photos/seed/article3/600/400'
    },
    {
      id: 4,
      title: 'Olahraga Ringan untuk Mengatasi Nyeri Punggung',
      excerpt: 'Duduk terlalu lama bisa menyebabkan nyeri punggung. Lakukan gerakan sederhana ini setiap hari.',
      date: '05 Mar 2026',
      readTime: '3 min read',
      category: 'Kebugaran',
      img: 'https://picsum.photos/seed/article4/600/400'
    },
    {
      id: 5,
      title: 'Tanda-tanda Tubuh Kekurangan Vitamin D',
      excerpt: 'Kelelahan kronis bisa jadi tanda Anda kekurangan vitamin D. Kenali gejala lainnya di sini.',
      date: '01 Mar 2026',
      readTime: '4 min read',
      category: 'Kesehatan Umum',
      img: 'https://picsum.photos/seed/article5/600/400'
    }
  ];

  return (
    <main className="flex-grow bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Edukasi <span className="text-[#D32F2F]">Kesehatan</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Temukan informasi kesehatan terpercaya, tips gaya hidup sehat, dan artikel medis terbaru.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="relative h-48">
                <img 
                  src={article.img} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#2E7D32] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  {article.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> {article.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {article.readTime}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-[#D32F2F] transition-colors cursor-pointer">
                  {article.title}
                </h2>
                
                <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="mt-auto">
                  <a href="#" className="inline-flex items-center text-[#D32F2F] font-semibold hover:text-red-800 transition-colors">
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
