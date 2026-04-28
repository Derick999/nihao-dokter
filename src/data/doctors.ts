export type DoctorProfile = {
  id: number;
  name: string;
  spec: string;
  exp: string;
  rating: string;
  img: string;
};

const doctorImage = (name: string, background = 'E6F4F1') =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${background}&color=268489&bold=true`;

export const doctors: DoctorProfile[] = [
  { id: 1, name: 'Dr. Daniel Paskalist', spec: 'Dokter Umum', exp: '5 Tahun', rating: '4.9', img: doctorImage('Dr. Daniel Paskalist') },
  { id: 2, name: 'Dr. Vivi Florencia', spec: 'Spesialis Anak', exp: '8 Tahun', rating: '4.8', img: doctorImage('Dr. Vivi Florencia', 'DDF5F6') },
  { id: 3, name: 'Dr. Kevin Nugraha', spec: 'Spesialis Kandungan', exp: '10 Tahun', rating: '5.0', img: doctorImage('Dr. Kevin Nugraha', 'EAF7F4') },
  { id: 4, name: 'Dr. Nicole Abisha', spec: 'Spesialis Kulit', exp: '6 Tahun', rating: '4.7', img: doctorImage('Dr. Nicole Abisha', 'F2FBFB') },
  { id: 5, name: 'Dr. Bayanaka', spec: 'Spesialis Penyakit Dalam', exp: '12 Tahun', rating: '4.9', img: doctorImage('Dr. Bayanaka', 'E4F3F4') },
  { id: 6, name: 'Dr. Andi Setiawan', spec: 'Dokter Umum', exp: '7 Tahun', rating: '4.8', img: doctorImage('Dr. Andi Setiawan', 'E6F7F2') },
  { id: 7, name: 'Dr. Citra Lestari', spec: 'Spesialis Kandungan', exp: '9 Tahun', rating: '4.9', img: doctorImage('Dr. Citra Lestari', 'EAF4F7') },
  { id: 8, name: 'Dr. Dewi Anggraini', spec: 'Spesialis Kulit', exp: '6 Tahun', rating: '4.8', img: doctorImage('Dr. Dewi Anggraini', 'EFF8F8') },
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
