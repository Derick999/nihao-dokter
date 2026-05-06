import { useEffect, useMemo, useState } from 'react';
import { Activity, Droplets, GlassWater, HeartPulse, MessageCircle, ShoppingBag, Sparkles, Scale, Ruler, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { doctors } from '../data/doctors';
import { getStoredUser } from '../utils/auth';

type LayananProps = {
  onOpenChat: (doctor: { name: string; img: string }) => void;
};

export default function Layanan({ onOpenChat }: LayananProps) {
  const user = getStoredUser();
  const displayName = user?.fullName || user?.username || 'siapa';
  const storedHeight = user?.height || localStorage.getItem('userHeight') || '';
  const storedWeight = user?.weight || localStorage.getItem('userWeight') || '';
  const rawHeight = Number.parseFloat(storedHeight.replace(',', '.'));
  const rawWeight = Number.parseFloat(storedWeight.replace(',', '.'));
  const hasPhysicalData = Number.isFinite(rawHeight) && rawHeight > 0 && Number.isFinite(rawWeight) && rawWeight > 0;
  const bmi = hasPhysicalData ? rawWeight / ((rawHeight / 100) * (rawHeight / 100)) : null;
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isDataIncomplete = Boolean(user) && !hasPhysicalData;
  const [waterIntakeMl, setWaterIntakeMl] = useState(0);
  const [bmiSnapshot, setBmiSnapshot] = useState<number | null>(null);
  const [calculatorInput, setCalculatorInput] = useState({
    weight: hasPhysicalData ? String(rawWeight) : '',
    height: hasPhysicalData ? String(rawHeight) : '',
    age: '',
    gender: 'male',
    activityLevel: 'sedentary',
  });
  const [bmrResult, setBmrResult] = useState<number | null>(null);
  const [tdeeResult, setTdeeResult] = useState<number | null>(null);

  useEffect(() => {
    const storedWater = Number.parseInt(localStorage.getItem('health_water_intake_ml') || '0', 10);
    const storedBmi = localStorage.getItem('health_bmi_snapshot');
    const storedBmr = localStorage.getItem('health_bmr_result');
    const storedTdee = localStorage.getItem('health_tdee_result');
    const storedInputs = localStorage.getItem('health_bmr_form');

    if (Number.isFinite(storedWater) && storedWater > 0) {
      setWaterIntakeMl(storedWater);
    }
    if (storedBmi) {
      const parsedBmi = Number.parseFloat(storedBmi);
      if (Number.isFinite(parsedBmi)) {
        setBmiSnapshot(parsedBmi);
      }
    }
    if (storedBmr) {
      const parsedBmr = Number.parseFloat(storedBmr);
      if (Number.isFinite(parsedBmr)) {
        setBmrResult(parsedBmr);
      }
    }
    if (storedTdee) {
      const parsedTdee = Number.parseFloat(storedTdee);
      if (Number.isFinite(parsedTdee)) {
        setTdeeResult(parsedTdee);
      }
    }
    if (storedInputs) {
      try {
        const parsedInputs = JSON.parse(storedInputs) as typeof calculatorInput;
        setCalculatorInput((current) => ({ ...current, ...parsedInputs }));
      } catch {
        // Ignore invalid stored form data.
      }
    }
  }, []);

  useEffect(() => {
    if (bmi !== null) {
      setBmiSnapshot(bmi);
    }
  }, [bmi]);

  useEffect(() => {
    localStorage.setItem('health_water_intake_ml', String(waterIntakeMl));
  }, [waterIntakeMl]);

  useEffect(() => {
    if (bmiSnapshot !== null) {
      localStorage.setItem('health_bmi_snapshot', bmiSnapshot.toFixed(2));
    }
  }, [bmiSnapshot]);

  useEffect(() => {
    localStorage.setItem('health_bmr_form', JSON.stringify(calculatorInput));
  }, [calculatorInput]);

  useEffect(() => {
    if (bmrResult !== null) {
      localStorage.setItem('health_bmr_result', bmrResult.toFixed(0));
    }
    if (tdeeResult !== null) {
      localStorage.setItem('health_tdee_result', tdeeResult.toFixed(0));
    }
  }, [bmrResult, tdeeResult]);

  const waterGoalMl = 2000;
  const waterProgress = Math.min((waterIntakeMl / waterGoalMl) * 100, 100);

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    lightlyActive: 1.375,
    moderatelyActive: 1.55,
    veryActive: 1.725,
    extraActive: 1.9,
  };

  const bmiStatus = (() => {
    if (!isLoggedIn) {
      return { label: 'Login untuk cek BMI', color: 'bg-gray-100 text-gray-600' };
    }
    if (isDataIncomplete) {
      return { label: 'Data belum lengkap', color: 'bg-sky-100 text-sky-700' };
    }
    const currentBmi = bmiSnapshot ?? bmi;
    if (currentBmi === null) {
      return { label: 'Data belum lengkap', color: 'bg-sky-100 text-sky-700' };
    }
    if (currentBmi < 18.5) {
      return { label: 'Berat Rendah', color: 'bg-amber-100 text-amber-700' };
    }
    if (currentBmi < 25) {
      return { label: 'Normal/Ideal', color: 'bg-emerald-100 text-emerald-700' };
    }
    if (currentBmi < 30) {
      return { label: 'Berat Berlebih', color: 'bg-orange-100 text-orange-700' };
    }
    return { label: 'Obesitas', color: 'bg-red-100 text-red-700' };
  })();

  const aiSuggestion = (() => {
    if (!isLoggedIn) {
      return 'Lengkapi tinggi dan berat badanmu untuk mendapatkan saran personal dari Nihao AI.';
    }
    if (isDataIncomplete) {
      return 'Profilmu sudah tersimpan, tapi tinggi dan berat badan belum lengkap. Lengkapi dulu untuk mendapat insight personal.';
    }
    const currentBmi = bmiSnapshot ?? bmi;
    if (currentBmi === null) {
      return 'Lengkapi tinggi dan berat badanmu untuk mendapatkan saran personal dari Nihao AI.';
    }
    if (currentBmi < 18.5) {
      return 'Tingkatkan asupan nutrisi seimbang dan pertimbangkan konsultasi untuk optimasi berat badan.';
    }
    if (currentBmi < 25) {
      return 'Pertahankan pola makan sehat, tidur cukup, dan aktivitas fisik rutin agar tetap ideal.';
    }
    if (currentBmi < 30) {
      return 'Jaga pola makan, perbanyak aktivitas ringan, dan pantau berat badan secara berkala.';
    }
    return 'Mulai perubahan bertahap pada pola makan dan konsultasikan target kesehatan dengan dokter.';
  })();

  const calorieAdvice = useMemo(() => {
    if (tdeeResult === null) {
      return 'Data perlu diisi dan dihitung terlebih dahulu untuk mendapatkan rekomendasi kebutuhan kalori harian.';
    }
    if (tdeeResult < 1800) {
      return 'Kebutuhan kalori harianmu cenderung rendah. Fokus pada kualitas nutrisi dan asupan protein cukup.';
    }
    if (tdeeResult < 2400) {
      return 'Kebutuhan kalori harianmu berada di rentang moderat. Jaga keseimbangan karbohidrat, protein, dan lemak sehat.';
    }
    return 'Kebutuhan kalori harianmu cukup tinggi. Pastikan energi tercukupi dengan makanan utuh dan hidrasi optimal.';
  }, [tdeeResult]);

  const handleCalculateBmr = () => {
    const weight = Number.parseFloat(calculatorInput.weight);
    const height = Number.parseFloat(calculatorInput.height);
    const age = Number.parseFloat(calculatorInput.age);
    const activityMultiplier = activityMultipliers[calculatorInput.activityLevel] ?? 1.2;

    if (!Number.isFinite(weight) || !Number.isFinite(height) || !Number.isFinite(age)) {
      return;
    }

    // Mifflin-St Jeor Equation.
    const baseBmr = 10 * weight + 6.25 * height - 5 * age;
    const genderConstant = calculatorInput.gender === 'male' ? 5 : -161;
    const totalBmr = baseBmr + genderConstant;
    const totalTdee = totalBmr * activityMultiplier;

    setBmrResult(totalBmr);
    setTdeeResult(totalTdee);
  };

  return (
    <main className="flex-grow bg-white">
      {/* Header */}
     <section className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Layanan <span className="text-[#268489]">Kesehatan</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami menyediakan berbagai layanan medis terintegrasi untuk memastikan kesehatan Anda dan keluarga selalu terjaga.
          </p>
        </div>
      </section>

      <section className="bg-[#f1faf9] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {user ? (
            <>
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900">Halo, {displayName}! Pantau kesehatanmu di sini.</h2>
                <p className="mt-3 max-w-2xl text-gray-600">Ringkasan ini dibuat dari data profil kesehatanmu untuk membantu pemantauan harian yang lebih praktis.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7F4] text-[#268489]">
                    <Scale className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Indeks Massa Tubuh (BMI)</h3>
                  <p className="mt-4 text-4xl font-extrabold text-[#268489]">{bmiSnapshot !== null ? bmiSnapshot.toFixed(1) : 'Data belum lengkap'}</p>
                  <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-medium ${bmiStatus.color}`}>
                    {bmiStatus.label}
                  </span>
                  {!hasPhysicalData && (
                    <Link to="/register" className="mt-4 inline-flex text-sm font-medium text-[#268489] hover:text-[#1f6f73]">
                      Lengkapi profil
                    </Link>
                  )}
                </div>

                <div className="rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7F4] text-[#268489]">
                    <Ruler className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Profil Fisik</h3>
                  <div className="mt-4 space-y-3 text-gray-600">
                    {hasPhysicalData ? (
                      <>
                        <p>Tinggi: {rawHeight} cm</p>
                        <p>Berat: {rawWeight} kg</p>
                      </>
                    ) : (
                      <>
                        <p>Data belum lengkap</p>
                        <Link to="/register" className="inline-flex text-sm font-medium text-[#268489] hover:text-[#1f6f73]">
                          Lengkapi profil fisik
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7F4] text-[#268489]">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Rekomendasi AI</h3>
                  <p className="mt-4 text-gray-600">Berdasarkan BMI-mu, Nihao AI menyarankan: {aiSuggestion}</p>
                </div>

                <div className="rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7F4] text-[#268489]">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Nihao Shop</h3>
                  <p className="mt-4 text-gray-600">Cek vitamin yang cocok buat kamu dan lengkapi kebutuhan kesehatan harianmu.</p>
                  <Link
                    to="/shop"
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-[#268489] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f6f73]"
                  >
                    Ke Nihao Shop
                  </Link>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7F4] text-[#268489]">
                        <Droplets className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Water Intake</h3>
                        <p className="text-sm text-gray-500">Target harian: {waterGoalMl} ml</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWaterIntakeMl((current) => current + 250)}
                      className="rounded-full bg-[#268489] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f6f73]"
                    >
                      +250 ml
                    </button>
                  </div>

                  <div className="mb-5 flex items-end gap-5">
                    <div className="relative h-40 w-24 overflow-hidden rounded-2xl border border-[#d8eeea] bg-[#ecf8f5]">
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#268489] to-[#5ab6bc]"
                        initial={{ height: '0%' }}
                        animate={{ height: `${waterProgress}%` }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-white/90">
                        <GlassWater className="h-7 w-7" />
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-[#268489]">{waterIntakeMl} ml</p>
                      <p className="mt-1 text-sm text-gray-500">Progress {Math.round(waterProgress)}%</p>
                    </div>
                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                      className="h-full rounded-full bg-[#268489]"
                      initial={{ width: '0%' }}
                      animate={{ width: `${waterProgress}%` }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7F4] text-[#268489]">
                      <Flame className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">BMR & TDEE Calculator</h3>
                      <p className="text-sm text-gray-500">Hitung kebutuhan kalori harian secara akurat</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Weight (kg)"
                      value={calculatorInput.weight}
                      onChange={(event) => setCalculatorInput((current) => ({ ...current, weight: event.target.value }))}
                      className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Height (cm)"
                      value={calculatorInput.height}
                      onChange={(event) => setCalculatorInput((current) => ({ ...current, height: event.target.value }))}
                      className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Age (years)"
                      value={calculatorInput.age}
                      onChange={(event) => setCalculatorInput((current) => ({ ...current, age: event.target.value }))}
                      className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
                    />
                    <select
                      value={calculatorInput.gender}
                      onChange={(event) => setCalculatorInput((current) => ({ ...current, gender: event.target.value }))}
                      className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <select
                      value={calculatorInput.activityLevel}
                      onChange={(event) => setCalculatorInput((current) => ({ ...current, activityLevel: event.target.value }))}
                      className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-[#268489] focus:bg-white focus:ring-4 focus:ring-teal-100 sm:col-span-2"
                    >
                      <option value="sedentary">Sedentary (jarang olahraga)</option>
                      <option value="lightlyActive">Lightly Active (1-3x/minggu)</option>
                      <option value="moderatelyActive">Moderately Active (3-5x/minggu)</option>
                      <option value="veryActive">Very Active (6-7x/minggu)</option>
                      <option value="extraActive">Extra Active (aktivitas berat harian)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleCalculateBmr}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#268489] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f6f73]"
                  >
                    Hitung BMR & TDEE
                  </button>

                  <div className="mt-4 rounded-xl bg-[#f6fbfa] p-4">
                    <p className="text-sm text-gray-500">BMR</p>
                    <p className="text-2xl font-extrabold text-[#268489]">{bmrResult !== null ? `${Math.round(bmrResult)} kkal` : '-'}</p>
                    <p className="mt-3 text-sm text-gray-500">TDEE (Daily Calories)</p>
                    <p className="text-2xl font-extrabold text-[#0D503C]">{tdeeResult !== null ? `${Math.round(tdeeResult)} kkal` : '-'}</p>
                    <p className="mt-3 text-sm text-gray-600">{calorieAdvice}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-3xl bg-white px-6 py-10 text-center shadow-sm border border-white">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7F4] text-[#268489]">
                <HeartPulse className="h-7 w-7" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Login untuk melihat ringkasan kesehatan pribadimu.</h2>
              <p className="mx-auto mt-3 max-w-2xl text-gray-600">Masuk ke akun NihaoDokter untuk melihat BMI, profil fisik, dan rekomendasi kesehatan personal dari Nihao AI.</p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#268489] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1f6f73]"
              >
                Login Sekarang
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Doctors List */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Daftar Dokter</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Pilih dokter spesialis yang sesuai dengan kebutuhan Anda dan mulai konsultasi sekarang.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="relative">
                  <img 
                    src={doc.img} 
                    alt={doc.name} 
                    className="w-full h-48 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    LIVE ONLINE
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{doc.name}</h3>
                  <p className="text-[#2E7D32] text-sm font-medium mb-3">{doc.spec}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
                    <span className="flex items-center"><Activity className="w-4 h-4 mr-1" /> {doc.exp}</span>
                    <span className="flex items-center text-yellow-500 font-medium">★ {doc.rating}</span>
                  </div>
                  
                  <div className="mt-auto">
                    <button
                      type="button"
                      onClick={() => onOpenChat({ name: doc.name, img: doc.img })}
                      className="w-full flex items-center justify-center bg-[#268489] hover:bg-[#1f6f73] text-white py-2.5 rounded-xl font-medium transition-all duration-300 hover:-translate-y-2"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
