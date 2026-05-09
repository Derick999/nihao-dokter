import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import searchData from '../data/searchData.json';

type DoctorItem = {
  id: string;
  name: string;
  specialty: string;
};

type MedicineItem = {
  id: string;
  name: string;
  usage: string;
  link: string;
};

type ArticleItem = {
  id: string;
  title: string;
  topic: string;
  link: string;
};

type SearchData = {
  doctors: DoctorItem[];
  medicine: MedicineItem[];
  articles: ArticleItem[];
};

const MAX_PER_CATEGORY = 4;

function SearchBar() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const data = searchData as SearchData;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const trimmedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmedQuery) {
      return {
        doctors: [] as DoctorItem[],
        medicine: [] as MedicineItem[],
        articles: [] as ArticleItem[],
      };
    }

    return {
      doctors: data.doctors
        .filter((item) =>
          `${item.name} ${item.specialty}`.toLowerCase().includes(trimmedQuery)
        )
        .slice(0, MAX_PER_CATEGORY),
      medicine: data.medicine
        .filter((item) =>
          `${item.name} ${item.usage}`.toLowerCase().includes(trimmedQuery)
        )
        .slice(0, MAX_PER_CATEGORY),
      articles: data.articles
        .filter((item) =>
          `${item.title} ${item.topic}`.toLowerCase().includes(trimmedQuery)
        )
        .slice(0, MAX_PER_CATEGORY),
    };
  }, [data.articles, data.doctors, data.medicine, trimmedQuery]);

  const totalResults = results.doctors.length + results.medicine.length + results.articles.length;

  const handleSelect = (link: string) => {
    navigate(link);
    setIsDropdownOpen(false);
    setQuery('');
  };

  const handleSelectDoctor = (doctor: DoctorItem) => {
    navigate('/chat-dokter', {
      state: {
        openDoctorName: doctor.name,
      },
    });
    setIsDropdownOpen(false);
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className="relative hidden max-w-xl flex-1 md:block">
      <Search className="pointer-events-none absolute left-4 top-5 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsDropdownOpen(true);
        }}
        onFocus={() => setIsDropdownOpen(true)}
        placeholder="Cari gejala, dokter, atau obat..."
        className="h-11 w-full rounded-full border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
      />

      {isDropdownOpen && trimmedQuery && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-[70vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl">
          {totalResults === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-500">Tidak ada hasil ditemukan.</p>
          ) : (
            <div className="space-y-2">
              {results.doctors.length > 0 && (
                <section>
                  <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-[#268489]">Doctors</p>
                  {results.doctors.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectDoctor(item)}
                      className="flex w-full flex-col rounded-xl px-3 py-2 text-left transition hover:bg-[#E9F6F3]"
                    >
                      <span className="text-sm font-medium text-gray-800">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.specialty}</span>
                    </button>
                  ))}
                </section>
              )}

              {results.medicine.length > 0 && (
                <section>
                  <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-[#268489]">Medicine</p>
                  {results.medicine.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.link)}
                      className="flex w-full flex-col rounded-xl px-3 py-2 text-left transition hover:bg-[#E9F6F3]"
                    >
                      <span className="text-sm font-medium text-gray-800">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.usage}</span>
                    </button>
                  ))}
                </section>
              )}

              {results.articles.length > 0 && (
                <section>
                  <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-[#268489]">Articles</p>
                  {results.articles.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.link)}
                      className="flex w-full flex-col rounded-xl px-3 py-2 text-left transition hover:bg-[#E9F6F3]"
                    >
                      <span className="text-sm font-medium text-gray-800">{item.title}</span>
                      <span className="text-xs text-gray-500">{item.topic}</span>
                    </button>
                  ))}
                </section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(SearchBar);
