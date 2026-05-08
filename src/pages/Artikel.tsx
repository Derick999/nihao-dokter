import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import articlesData from '../data/articles.json';
import BackButton from '../components/BackButton';

type Article = {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  fullContent: string;
  imageUrl: string;
};

export default function Artikel() {
  const articles = articlesData as Article[];

  return (
    <main className="flex-grow bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 pt-1">
          <BackButton />
        </div>
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
                  src={article.imageUrl}
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
                
                <Link to={`/artikel/${article.id}`} className="block">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-[#D32F2F] transition-colors cursor-pointer">
                    {article.title}
                  </h2>
                </Link>
                
                <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="mt-auto">
                  <Link to={`/artikel/${article.id}`} className="inline-flex items-center text-[#D32F2F] font-semibold hover:text-red-800 transition-colors">
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
