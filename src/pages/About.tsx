import { useEffect, useState } from 'react';
import { BrainCircuit, Stethoscope, Target } from 'lucide-react';
import BackButton from '../components/BackButton';

const teamMembers = [
  'Bayanaka Indrayana Sukanda',
  'Daniel Paskalist',
  'Derick Raditya',
  'Fernando Matthias',
  'Herdinand syahputra',
  'Kevin Nugraha Japutra Simanjuntak',
  'Nicole Abisha Widjaja',
  'Vivi Florencia',
].sort((a, b) => a.localeCompare(b, 'id'));

export default function About() {
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    company: false,
    visionMission: false,
    team: false,
  });

  useEffect(() => {
    const sectionIds = ['company', 'visionMission', 'team'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const sectionId = entry.target.id;
          setVisibleSections((current) => ({ ...current, [sectionId]: true }));
        });
      },
      { threshold: 0.2 },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const getFadeClass = (sectionId: string) =>
    `transition-all duration-700 ${visibleSections[sectionId] ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`;

  return (
    <main className="flex-grow bg-[#F7FBFC] py-10 sm:py-12">
      <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="pt-1">
          <BackButton />
        </div>
        <header className="rounded-3xl border border-[#D9EEEF] bg-white p-6 shadow-sm sm:p-10">
          <p className="inline-flex rounded-full border border-[#268489]/20 bg-[#EAF7F4] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#268489]">
            Tentang NihaoDokter
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Membangun masa depan layanan kesehatan digital Indonesia
          </h1>
        </header>

        <section id="company" className={`rounded-3xl border border-[#D9EEEF] bg-white p-6 shadow-sm sm:p-8 ${getFadeClass('company')}`}>
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7F4] text-[#268489]">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Tentang Perusahaan</h2>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-600 sm:text-lg">
          NihaoDokter adalah ekosistem bisnis kesehatan digital terintegrasi yang dirancang untuk menjembatani celah antara layanan medis profesional, pemenuhan kebutuhan farmasi, dan edukasi gaya hidup sehat harian. Platform ini mengintegrasikan tiga pilar utama secara interaktif: layanan konsultasi medis jarak jauh (telemedicine), distribusi farmasi digital melalui Nihao Shop yang mendukung penebusan resep instan, serta penyediaan informasi kesehatan berbasis data. Dengan pendekatan yang mudah diakses kapan saja dan di mana saja, NihaoDokter berfungsi sebagai platform solutif yang menyederhanakan birokrasi layanan kesehatan tradisional menjadi satu alur digital yang efisien bagi masyarakat modern.
          </p>
        </section>

        <section id="visionMission" className={`rounded-3xl border border-[#D9EEEF] bg-white p-6 shadow-sm sm:p-8 ${getFadeClass('visionMission')}`}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-[#F8FCFC] p-5">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF7F4] text-[#268489]">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Visi</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
               
              </p> Menjadi platform kesehatan digital terdepan yang mendemokrasikan akses layanan medis berkualitas melalui integrasi teknologi AI dan konsultasi profesional bagi masyarakat luas.
            </article>

            <article className="rounded-2xl border border-slate-200 bg-[#F8FCFC] p-5">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF7F4] text-[#268489]">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Misi</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600 sm:text-base">
              <li>Menyediakan layanan konsultasi medis online (telemedicine) yang cepat, terpercaya, aman, dan terjangkau bagi seluruh lapisan masyarakat.</li>
              <li>Mengembangkan asisten kesehatan digital berbasis kecerdasan buatan (Nihao AI) yang responsif guna membantu skrining gejala awal dan penyediaan edukasi medis yang akurat.</li>
              <li>Membangun ekosistem kesehatan digital terintegrasi yang menghubungkan pasien, tenaga medis, dan layanan kefarmasian (Nihao Shop) secara efisien tanpa batasan jarak.</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="team" className={`rounded-3xl border border-[#D9EEEF] bg-white p-6 shadow-sm sm:p-8 ${getFadeClass('team')}`}>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Meet Our Experts</h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">Tim kami hadir dengan komitmen menghadirkan inovasi dan layanan kesehatan digital yang berdampak.</p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <article key={member} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member)}`}
                  alt={member}
                  className="h-12 w-12 rounded-full border border-slate-200 bg-slate-100"
                  referrerPolicy="no-referrer"
                />
                <h3 className="mt-3 text-sm font-bold leading-snug text-gray-900">{member}</h3>
                <p className="mt-1 text-xs font-medium text-[#268489]">NihaoDokter Expert Team</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
