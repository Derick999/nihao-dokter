import { useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, ArrowLeft } from 'lucide-react';
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

const articles = articlesData as Article[];

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();

  const article = useMemo(
    () => articles.find((item) => item.id === slug),
    [slug],
  );

  useEffect(() => {
    const previousTitle = document.title;
    if (article) {
      document.title = `${article.title} | NihaoDokter`;
    }

    return () => {
      document.title = previousTitle;
    };
  }, [article]);

  if (!article) {
    return <Navigate to="/artikel" replace />;
  }

  return (
    <main className="flex-grow bg-white py-8 sm:py-10">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 pt-1">
          <BackButton />
        </div>
        <nav className="mb-5 flex flex-wrap items-center gap-1 text-xs text-gray-500 sm:text-sm">
          <Link to="/" className="hover:text-[#268489]">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/artikel" className="hover:text-[#268489]">Artikel</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="line-clamp-1 text-gray-700">{article.title}</span>
        </nav>

        <Link
          to="/artikel"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-slate-50 hover:text-[#268489]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Artikel
        </Link>

        <header className="mb-8 border-b border-slate-100 pb-8">
          <span className="inline-flex rounded-full bg-[#EAF7F4] px-3 py-1 text-xs font-semibold text-[#268489]">
            {article.category}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="font-medium text-gray-700">NihaoDokter Team</span>
            <span className="inline-flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {article.date}
            </span>
            <span className="inline-flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {article.readTime}
            </span>
          </div>
          <img
            src={article.imageUrl}
            alt={article.title}
            className="mt-6 h-[260px] w-full rounded-2xl object-cover shadow-sm sm:h-[340px]"
            referrerPolicy="no-referrer"
          />
        </header>

        <section className="prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-700 prose-li:text-gray-700">
          <div dangerouslySetInnerHTML={{ __html: article.fullContent }} />
        </section>

        <div className="mt-10 border-t border-slate-100 pt-6">
          <Link
            to="/artikel"
            className="inline-flex items-center gap-2 rounded-full bg-[#268489] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1f6f73]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Artikel
          </Link>
        </div>
      </article>
    </main>
  );
}
