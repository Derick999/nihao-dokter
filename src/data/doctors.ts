export type DoctorProfile = {
  id: number;
  name: string;
  spec: string;
  exp: string;
  rating: string;
  img: string;
};

export const doctors: DoctorProfile[] = [
  { id: 1, name: 'Dr. Daniel Paskalist', spec: 'Dokter Umum', exp: '5 Tahun', rating: '4.9', img: '/dokter/dokter derrick.jpg' },
  { id: 2, name: 'Dr. Vivi Florencia', spec: 'Spesialis Anak', exp: '8 Tahun', rating: '4.8', img: '/dokter/dokter punjabi.jpg' },
  { id: 3, name: 'Dr. Kevin Nugraha', spec: 'Spesialis Jantung', exp: '10 Tahun', rating: '5.0', img: '/dokter/dokter kevin.jpg' },
  { id: 4, name: 'Dr. Siti Rahmawati', spec: 'Spesialis Penyakit Dalam', exp: '7 Tahun', rating: '4.8', img: '/dokter/dokter sigma.jpg' },
  { id: 5, name: 'Dr. Budi Santoso', spec: 'Spesialis THT', exp: '6 Tahun', rating: '4.7', img: '/dokter/dokter strange.jpg' },
  { id: 6, name: 'Dr. Amanda Putri', spec: 'Psikolog', exp: '5 Tahun', rating: '4.9', img: '/dokter/dokter strange.jpg' },
];

export const getAiRecommendations = (query: string) => {
  const input = query.toLowerCase();

  if (/(anak|batuk|pilek|flu)/.test(input)) {
    return [doctors[1], doctors[0]];
  }

  if (/(kulit|jerawat|ruam|gatal)/.test(input)) {
    return [doctors[3], doctors[7]];
  }

  if (/(hamil|kandungan|haid|menstruasi)/.test(input)) {
    return [doctors[2], doctors[6]];
  }

  if (/(meriang|demam|panas|pusing|sakit kepala)/.test(input)) {
    return [doctors[0], doctors[4]];
  }

  return [doctors[0], doctors[1]];
};
