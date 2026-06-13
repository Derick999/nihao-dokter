import { useEffect, useMemo, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, ArrowLeft, Share2, Link2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
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

const articleContentClassName = [
  'max-w-none',
  '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-950 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:tracking-tight',
  '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:pl-3 [&_h3]:border-l-2 [&_h3]:border-[#268489]',
  '[&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:text-base [&_p]:mb-4 [&_p]:text-justify',
  '[&_a.seo-link]:font-bold [&_a.seo-link]:text-[#268489] [&_a.seo-link]:hover:underline',
  "[&_a[href^='/']]:font-bold [&_a[href^='/']]:text-[#268489] [&_a[href^='/']]:hover:underline",
].join(' ');

const isInternalArticleHref = (href: string) => href.startsWith('/') && !href.startsWith('//');

type ArticleContentProps = {
  html: string;
};

function ArticleContent({ html }: ArticleContentProps) {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) {
      return;
    }

    const handleContentClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest('a');
      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href) {
        return;
      }

      const isSeoLink = anchor.classList.contains('seo-link');
      const isInternalLink = isInternalArticleHref(href);

      if (!isSeoLink && !isInternalLink) {
        return;
      }

      event.preventDefault();
      navigate(href);
    };

    container.addEventListener('click', handleContentClick);
    return () => container.removeEventListener('click', handleContentClick);
  }, [html, navigate]);

  return (
    <section ref={contentRef} className={articleContentClassName}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}

const canUseWebShare = (): boolean =>
  typeof navigator !== 'undefined' && typeof navigator.share === 'function';

type ShareArticleProps = {
  title: string;
};

function ShareArticle({ title }: ShareArticleProps) {
  const getArticleUrl = () => window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getArticleUrl());
      toast.success('Link artikel berhasil disalin ke clipboard!');
    } catch {
      toast.error('Gagal menyalin link. Silakan coba lagi.');
    }
  };

  const handleShare = async () => {
    if (!canUseWebShare()) {
      await handleCopyLink();
      return;
    }

    try {
      await navigator.share({
        title,
        text: title,
        url: getArticleUrl(),
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
    }
  };

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      {canUseWebShare() && (
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-full bg-[#268489] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1f6f73]"
        >
          <Share2 className="h-4 w-4" />
          Bagikan
        </button>
      )}
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-[#268489]/30 hover:bg-[#EAF7F4] hover:text-[#268489]"
      >
        <Link2 className="h-4 w-4" />
        Salin Link
      </button>
    </div>
  );
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();

  // Database 5 Partner UMKM Kelompok Temen UBM Lengkap dengan Strategi Copywriting Medis
  // Database 5 Partner UMKM Kelompok Temen UBM
  const partnerProjects = useMemo(
    () => [
      {
        id: 'pawbieast',
        name: 'Pawbieast',
        href: 'https://sites.google.com/view/pawbieast/beranda',
        tag: 'Pet Care & Hotel',
        title: 'Stres Kuliah? Jaga Mental Kamu Bersama Anabul di Pawbieast!',
        description: 'Anabul yang bersih bebas kutu adalah terapi stres terbaik. Jaga higiene hewan peliharaan lu lewat grooming rutin untuk mencegah penularan alergi kulit ke manusia. Titip aman pas mudik, konsultasi mental tetap di NihaoDokter!',
        image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400'
      },
      {
        id: 'cookies',
        name: "Deniffer's Cookies",
        href: 'https://www.denifferscookies.web.id',
        tag: 'Healthy Snack',
        title: 'Ngemil Bebas Cemas: Cookies Sehat Rendah Gula Rekomendasi Dokter!',
        description: 'Punya riwayat diabetes atau lagi diet ketat? Tetap bisa ngemil tanpa takut gula darah melonjak bareng Deniffer\'s Cookies. Konsultasikan porsi cemilan ideal lu di NihaoDokter!',
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400'
      },
      {
        id: 'zaffrino',
        name: 'Zaffrino',
        href: 'https://www.zaffrino.site/',
        tag: 'Italian Resto',
        title: 'Diet Mediterania: Reservasi Menu Kaya Antioksidan di Zaffrino',
        description: 'Menjaga kesehatan jantung gak harus menyiksa. Cek opsi menu khas Italia yang ramah kolesterol di Zaffrino. Butuh panduan gizi seimbang? Chat dokter spesialis di NihaoDokter.',
        image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400'
      },
      {
        id: 'inirasa',
        name: 'Inirasa',
        href: 'https://www.inirasa.biz.id/',
        tag: 'Organic Bakery',
        title: 'Pencernaan Bermasalah? Beralih ke Roti Organik dari IniRasa',
        description: 'Atasi begah dan kembung dengan serat tinggi dari roti organik premium terbaik di Jakarta Barat. Proses beli praktis di web mereka, konsultasi kesehatan tetap di NihaoDokter!',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff/704b?w=400'
      },
      {
        id: 'kicaucafe',
        name: 'Kicau Cafe',
        href: 'https://kicaucafe.com/',
        tag: 'Cozy Cafe',
        title: 'Ngopi Anti Pening: Atur Konsumsi Kafein Kamu di Kicau Cafe',
        description: 'Butuh tempat dekompresi buat ngurangin stres tugas kuliah? Nikmati suasana Kicau Cafe sambil pesan menu rendah kafein yang ramah lambung versi rekomendasi NihaoDokter.',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400'
      }
    ],
    [],
  );

  const article = useMemo(
    () => articles.find((item) => item.id === slug),
    [slug],
  );

  // Logika Diperketat dengan TolowerCase & Trim (Anti Gagal Deteksi Slug)
  const orderedPartners = useMemo(() => {
    const priorityId = (article as any)?.suggestedPartner || 'cookies';

    const prioritized = partnerProjects.find((p) => p.id === priorityId);
    const others = partnerProjects.filter((p) => p.id !== priorityId);

    return prioritized ? [prioritized, ...others] : partnerProjects;
  }, [article, partnerProjects]);

  useEffect(() => {
    const previousTitle = document.title;
    if (article) {
      document.title = `${article.title} | NihaoDokter`;
      
      // 🚀 SOLUSI TOTAL: Bungkus pake setTimeout biar nunggu DOM selesai nge-render
      setTimeout(() => {
        // Tembak window standar
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
        
        // Tembak root dokumen HTML (buat ngatasin bug html/body scroll)
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
        
        // Tembak bodi aplikasi langsung
        document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
      }, 20); // Dikasih delay jeda 20 milidetik biar browser kelar loading teks baru
    }

    return () => {
      document.title = previousTitle;
    };
  }, [article]);

  if (!article) {
    return <Navigate to="/artikel" replace />;
  }

  // SINKRONISASI VARIABEL: Mencegah komponen salah panggil data statis
  const mainPartner = orderedPartners[0];
  const secondaryPartners = orderedPartners.slice(1);

  return (
    <main className="flex-grow bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
          <article className="lg:col-span-7">
            <div className="mb-6 pt-1">
              <BackButton />
            </div>
            <nav className="mb-5 flex flex-wrap items-center gap-1 text-xs text-gray-500 sm:text-sm">
              <Link to="/" className="hover:text-[#268489]">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/artikel" className="hover:text-[#268489]">
                Artikel
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="line-clamp-1 text-gray-700">{article.title}</span>
            </nav>

            <header className="mb-8 border-b border-slate-100 pb-8">
              <span className="inline-flex rounded-full bg-[#EAF7F4] px-3 py-1 text-xs font-semibold text-[#268489]">
                {article.category}
              </span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              <ShareArticle title={article.title} />
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

            <ArticleContent html={article.fullContent} />

            <div className="mt-10 border-t border-slate-100 pt-6">
              <Link
                to="/artikel"
                className="inline-flex items-center gap-2 rounded-full bg-[#268489] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1f6f73]"
              >
                <ArrowLeft className="h-4 w-4" />
                Lihat Artikel Lainnya
              </Link>
            </div>
          </article>

          {/* SIDEBAR SIDEBAR SINKRON 100% */}
          <aside className="lg:col-span-3">
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-3xl border border-slate-150 bg-slate-50 p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">
                    NihaoCare Partner
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 leading-snug">
                    Jejaring kemitraan strategis NihaoDokter untuk pemenuhan kebutuhan lainnya.
                  </p>
                </div>

                {/* 1. SLOT MAIN PREMIUM CARD */}
                <a
                  href={mainPartner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all duration-300 hover:border-[#268489] hover:shadow-md"
                >
                  <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={mainPartner.image}
                      alt={mainPartner.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-[#268489] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white">
                      {mainPartner.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-950 leading-snug transition-colors group-hover:text-[#268489]">
                    {mainPartner.title}
                  </h3>
                  <p className="mt-1.5 text-justify text-[11px] leading-relaxed text-gray-500 line-clamp-4">
                    {mainPartner.description}
                  </p>
                  <div className="mt-3 flex items-center justify-end text-[11px] font-bold text-[#268489] opacity-80 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1">
                      Kunjungi Situs <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </a>

                {/* 2. SLOT SECONDARY CARDS ROW MINI */}
                <div className="mt-5 space-y-3 border-t border-dashed border-slate-200 pt-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Artikel Lainnya
                  </h4>
                  
                  {secondaryPartners.map((partner) => (
                    <a
                      key={partner.href}
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-2 shadow-xs transition-all hover:border-[#268489]/40 hover:bg-[#EAF7F4]/20 hover:shadow-sm"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <img 
                          src={partner.image} 
                          alt={partner.name} 
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="min-w-0 flex-1 pr-1">
                        <span className="text-[9px] font-extrabold text-[#268489] uppercase tracking-wide block opacity-70">
                          {partner.name}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-[#268489] transition-colors mt-0.5">
                          {partner.title}
                        </h4>
                      </div>
                    </a>
                  ))}
                </div>

              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}