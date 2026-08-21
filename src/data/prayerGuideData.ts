export interface NiatSholat {
  id: string;
  nama: string;
  waktu: string;
  jumlahRakaat: number;
  kategori: "fardhu" | "sunnah";
  deskripsi: string;
  teksArab: string;
  teksLatin: string;
  terjemahan: string;
}

export interface LangkahSholat {
  id: number;
  judul: string;
  namaRukun: string;
  kategoriRukun: "Niat" | "Takbir" | "Membaca" | "Ruku" | "Itidal" | "Sujud" | "Duduk" | "Tasyahud" | "Salam";
  ikonGerakan: string; // Icon representation key or SVG path name
  deskripsiGerakan: string;
  bacaanArab: string;
  bacaanLatin: string;
  terjemahan: string;
  dibacaBerapaKali?: string;
  catatanPenting?: string;
}

export const NIAT_SHOLAT_LIST: NiatSholat[] = [
  {
    id: "subuh",
    nama: "Sholat Subuh",
    waktu: "Fajar / Subuh",
    jumlahRakaat: 2,
    kategori: "fardhu",
    deskripsi: "Dikerjakan 2 rakaat pada terbit fajar shadiq hingga menjelang matahari terbit. Menggunakan Doa Qunut pada rakaat kedua.",
    teksArab: "أُصَلِّى فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    teksLatin: "Ushallii fardhash-shubhi rak'ataini mustaqbilal qiblati adaa'an lillaahi ta'aalaa.",
    terjemahan: "Aku berniat sholat fardhu Subuh dua rakaat menghadap kiblat karena Allah Ta'ala."
  },
  {
    id: "dzuhur",
    nama: "Sholat Dzuhur",
    waktu: "Siang Hari",
    jumlahRakaat: 4,
    kategori: "fardhu",
    deskripsi: "Dikerjakan 4 rakaat ketika matahari tergelincir ke barat hingga panjang bayangan sama dengan tingginya.",
    teksArab: "أُصَلِّى فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    teksLatin: "Ushallii fardhadz-dhuhri arba'a raka'aatin mustaqbilal qiblati adaa'an lillaahi ta'aalaa.",
    terjemahan: "Aku berniat sholat fardhu Dzuhur empat rakaat menghadap kiblat karena Allah Ta'ala."
  },
  {
    id: "ashar",
    nama: "Sholat Ashar",
    waktu: "Sore Hari",
    jumlahRakaat: 4,
    kategori: "fardhu",
    deskripsi: "Dikerjakan 4 rakaat dari berakhirnya waktu Dzuhur hingga sebelum matahari terbenam.",
    teksArab: "أُصَلِّى فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    teksLatin: "Ushallii fardhal-'ashri arba'a raka'aatin mustaqbilal qiblati adaa'an lillaahi ta'aalaa.",
    terjemahan: "Aku berniat sholat fardhu Ashar empat rakaat menghadap kiblat karena Allah Ta'ala."
  },
  {
    id: "maghrib",
    nama: "Sholat Maghrib",
    waktu: "Petang Hari",
    jumlahRakaat: 3,
    kategori: "fardhu",
    deskripsi: "Dikerjakan 3 rakaat tepat setelah matahari terbenam hingga hilangnya awan merah di ufuk barat.",
    teksArab: "أُصَلِّى فَرْضَ الْمَغْرِبِ ثَلاَثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    teksLatin: "Ushallii fardhal-maghribi thalaatha raka'aatin mustaqbilal qiblati adaa'an lillaahi ta'aalaa.",
    terjemahan: "Aku berniat sholat fardhu Maghrib tiga rakaat menghadap kiblat karena Allah Ta'ala."
  },
  {
    id: "isya",
    nama: "Sholat Isya",
    waktu: "Malam Hari",
    jumlahRakaat: 4,
    kategori: "fardhu",
    deskripsi: "Dikerjakan 4 rakaat setelah hilangnya syafaq (sisa cahaya merah) di ufuk barat hingga sepertiga malam terakhir.",
    teksArab: "أُصَلِّى فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    teksLatin: "Ushallii fardhal-'isyaa'i arba'a raka'aatin mustaqbilal qiblati adaa'an lillaahi ta'aalaa.",
    terjemahan: "Aku berniat sholat fardhu Isya empat rakaat menghadap kiblat karena Allah Ta'ala."
  },
  {
    id: "dhuha",
    nama: "Sholat Dhuha",
    waktu: "Pagi Hari (Sunnah)",
    jumlahRakaat: 2,
    kategori: "sunnah",
    deskripsi: "Sholat sunnah yang dikerjakan pada pagi hari (antara jam 07:00 pagi hingga sebelum masuk Dzuhur) untuk memohon pembuka rezeki & keberkahan.",
    teksArab: "أُصَلِّى سُنَّةَ الضُّحَى رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
    teksLatin: "Ushallii sunnatad-dhuhaa rak'ataini lillaahi ta'aalaa.",
    terjemahan: "Aku berniat sholat sunnah Dhuha dua rakaat karena Allah Ta'ala."
  },
  {
    id: "tahajud",
    nama: "Sholat Tahajud",
    waktu: "Sepertiga Malam (Sunnah)",
    jumlahRakaat: 2,
    kategori: "sunnah",
    deskripsi: "Sholat malam yang dikerjakan setelah bangun dari tidur pada sepertiga malam terakhir. Memiliki keutamaan kemuliaan di sisi Allah.",
    teksArab: "أُصَلِّى سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
    teksLatin: "Ushallii sunnatat-tahajjudi rak'ataini lillaahi ta'aalaa.",
    terjemahan: "Aku berniat sholat sunnah Tahajud dua rakaat karena Allah Ta'ala."
  },
  {
    id: "witir",
    nama: "Sholat Witir",
    waktu: "Malam Hari (Penutup Sholat)",
    jumlahRakaat: 3,
    kategori: "sunnah",
    deskripsi: "Sholat sunnah dengan rakaat ganjil sebagai penutup sholat-sholat malam.",
    teksArab: "أُصَلِّى سُنَّةَ الْوِتْرِ ثَلاَثَ رَكَعَاتٍ لِلَّهِ تَعَالَى",
    teksLatin: "Ushallii sunnatal-witri thalaatha raka'aatin lillaahi ta'aalaa.",
    terjemahan: "Aku berniat sholat sunnah Witir tiga rakaat karena Allah Ta'ala."
  }
];

export const LANGKAH_SHOLAT_STEPS: LangkahSholat[] = [
  {
    id: 1,
    judul: "Niat Sholat & Berdiri Tegak (Qiyam)",
    namaRukun: "Niat & Berdiri Bagi Yang Mampu",
    kategoriRukun: "Niat",
    ikonGerakan: "stand",
    deskripsiGerakan: "Berdiri lurus menghadap Kiblat dengan tumit sejajar, dada dan pandangan mata tertuju ke tempat sujud. Hadirkan niat di dalam hati secara tulus untuk beribadah karena Allah SWT.",
    bacaanArab: "أُصَلِّى فَرْضَ ... مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    bacaanLatin: "(Lafalkan niat sesuai sholat yang dikerjakan dalam hati)",
    terjemahan: "Aku berniat sholat menghadap kiblat karena Allah Ta'ala.",
    catatanPenting: "Niat tempatnya di dalam hati saat Takbiratul Ihram diucapkan."
  },
  {
    id: 2,
    judul: "Takbiratul Ihram",
    namaRukun: "Takbiratul Ihram (Rukun Qouliyah & Fi'liyah)",
    kategoriRukun: "Takbir",
    ikonGerakan: "takbir",
    deskripsiGerakan: "Mengangkat kedua tangan sejajar dengan bahu atau daun telinga dengan telapak tangan terbuka menghadap Kiblat, lalu menguncapkan 'Allahu Akbar'. Memulai ibadah sholat.",
    bacaanArab: "اللهُ أَكْبَرُ",
    bacaanLatin: "Allahu Akbar.",
    terjemahan: "Allah Maha Besar.",
    dibacaBerapaKali: "1 kali",
    catatanPenting: "Dengan menguncapkan takbir ini, haram hukumnya melakukan hal-hal di luar sholat (makan, berbicara, bergerak bebas)."
  },
  {
    id: 3,
    judul: "Sedekep & Membaca Doa Iftitah",
    namaRukun: "Bersedekep & Sunnah Membaca Doa Iftitah",
    kategoriRukun: "Membaca",
    ikonGerakan: "sedekep",
    deskripsiGerakan: "Meletakkan tangan kanan di atas punggung tangan kiri di atas dada atau di atas pusar. Membaca doa pembuka (Iftitah) dengan suara lembut.",
    bacaanArab: "اللَّهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلَّهِ كَثِيرًا وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلاً ، وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالأَرْضَ حَنِيفًا مُسْلِمًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ ، إِنَّ صَلاَتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ ، لاَ شَرِيكَ لَهُ وَبِذَلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِينَ",
    bacaanLatin: "Allaahu akbaru kabiirow-walhamdu lillaahi katsiirow-wasubhaanallaahi bukrataw-wa ashiilaa. Wajjahtu wajhiya lilladzii fatharas-samaawaati wal-ardha haniifam-muslimaw-wamaa ana minal-musyrikiin. Inna shalaatii wanusukii wamahyaaya wamamaatii lillaahi rabbil-'aalamiin. Laa syariika lahu wa bidzaalika umirtu wa ana minal-muslimiin.",
    terjemahan: "Allah Maha Besar sebesar-besarnya. Dan puji-pujian bagi Allah sebanyak-banyaknya. Maha Suci Allah siang dan malam. Kuhadapkan mukaku kepada Zat yang menciptakan langit dan bumi dengan tulus dan berserah diri, dan aku bukanlah dari golongan orang-orang musyrik. Sesungguhnya sholatku, ibadahku, hidupku dan matiku hanyalah untuk Allah Tuhan semesta alam. Tidak ada sekutu bagi-Nya dan dengan demikian aku diperintahkan dan aku adalah dari golongan orang-orang Muslim.",
    dibacaBerapaKali: "1 kali (pada rakaat pertama saja)",
    catatanPenting: "Hukum membaca doa Iftitah adalah Sunnah Muakkad."
  },
  {
    id: 4,
    judul: "Membaca Surah Al-Fatihah",
    namaRukun: "Membaca Al-Fatihah (Rukun Wajib)",
    kategoriRukun: "Membaca",
    ikonGerakan: "read",
    deskripsiGerakan: "Tetap bersedekep dan membaca Surah Al-Fatihah dengan perlahan (tartil) di setiap rakaat sholat.",
    bacaanArab: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ (١) الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (٢) الرَّحْمَنِ الرَّحِيمِ (٣) مَالِكِ يَوْمِ الدِّينِ (٤) إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ (٥) اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ (٦) صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلا الضَّالِّينَ (٧)",
    bacaanLatin: "Bismillaahir-rahmaanir-rahiim. Al-hamdu lillaahi rabbil-'aalamiin. Ar-rahmaanir-rahiim. Maaliki yaumid-diin. Iyyaaka na'budu wa iyyaaka nasta'iin. Ihdinas-shiraatal-mustaqiim. Shiraatal-ladziina an'amta 'alaihim ghairil-maghdhuubi 'alaihim wa lad-dhaalliin. (Aamiin)",
    terjemahan: "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam. Maha Pengasih lagi Maha Penyayang. Yang menguasai di Hari Pembalasan. Hanya Engkaulah yang kami sembah, dan hanya kepada Engkaulah kami meminta pertolongan. Tunjukkanlah kami jalan yang lurus, (yaitu) Jalan orang-orang yang telah Engkau beri nikmat kepada mereka; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat. (Kabulkanlah doa kami ya Allah).",
    dibacaBerapaKali: "Wajib di setiap rakaat",
    catatanPenting: "Tidak sah sholat seseorang yang tidak membaca Al-Fatihah."
  },
  {
    id: 5,
    judul: "Membaca Ayat / Surah Pendek",
    namaRukun: "Membaca Surah Al-Qur'an (Sunnah)",
    kategoriRukun: "Membaca",
    ikonGerakan: "quran-read",
    deskripsiGerakan: "Membaca salah satu surah atau ayat pendek Al-Qur'an (seperti Al-Ikhlas, Al-Falaq, An-Nas, Al-Kautsar, dll) pada rakaat ke-1 dan rakaat ke-2.",
    bacaanArab: "قُلْ هُوَ اللَّهُ أَحَدٌ (١) اللَّهُ الصَّمَدُ (٢) لَمْ يَلِدْ وَلَمْ يُولَدْ (٣) وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ (٤)",
    bacaanLatin: "Qul huwallaahu ahad. Allaahus-shamad. Lam yalid wa lam yuulad. Wa lam yakul-lahu kufuwan ahad.",
    terjemahan: "Katakanlah (Muhammad): 'Dialah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorang pun yang setara dengan Dia.'",
    dibacaBerapaKali: "Pada Rakaat 1 dan Rakaat 2",
    catatanPenting: "Boleh membaca surah apa saja yang dihafalkan dari Al-Qur'an."
  },
  {
    id: 6,
    judul: "Ruku' dengan Thuma'ninah",
    namaRukun: "Ruku' (Rukun Fi'liyah)",
    kategoriRukun: "Ruku",
    ikonGerakan: "ruku",
    deskripsiGerakan: "Mengangkat kedua tangan sambil bertakbir (Allahu Akbar), lalu membungkukkan badan hingga punggung dan kepala sejajar mendatar. Kedua telapak tangan memegang erat kedua lutut dengan jari meregang. Tenang sejenak (Thuma'ninah).",
    bacaanArab: "سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ",
    bacaanLatin: "Subhaana rabbiyal-'azhiimi wa bihamdih.",
    terjemahan: "Maha Suci Tuhanku Yang Maha Agung dan dengan memuji-Nya.",
    dibacaBerapaKali: "3 kali",
    catatanPenting: "Thuma'ninah artinya berhenti sejenak sekadar lamanya membaca 'Subhanallah'."
  },
  {
    id: 7,
    judul: "I'tidal (Bangkit dari Ruku')",
    namaRukun: "I'tidal dengan Thuma'ninah",
    kategoriRukun: "Itidal",
    ikonGerakan: "itidal",
    deskripsiGerakan: "Bangkit berdiri dari ruku' sambil mengangkat kedua tangan setinggi bahu/telinga sambil mengucapkan 'Sami'allahu liman hamidah', lalu meluruskan badan dengan tenang.",
    bacaanArab: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ، رَبَّنَا لَكَ الْحَمْدُ مِلْءُ السَّمَاوَاتِ وَمِلْءُ الأَرْضِ وَمِلْءُ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ",
    bacaanLatin: "Sami'allaahu liman hamidah. Rabbanaa lakal-hamdu mil'us-samaawaati wa mil'ul-ardhi wa mil'u maa syi'ta min syai'in ba'du.",
    terjemahan: "Allah mendengar orang yang memuji-Nya. Ya Tuhan kami, bagi-Mu lah segala puji sepenuh langit dan sepenuh bumi dan sepenuh apa yang Engkau kehendaki sesudah itu.",
    dibacaBerapaKali: "1 kali",
    catatanPenting: "Pada sholat Subuh di rakaat ke-2, Doa Qunut dibaca saat posisi I'tidal ini sebelum sujud."
  },
  {
    id: 8,
    judul: "Sujud Pertama",
    namaRukun: "Sujud Pertama dengan Thuma'ninah",
    kategoriRukun: "Sujud",
    ikonGerakan: "sujud",
    deskripsiGerakan: "Turun bertakbir tanpa mengangkat tangan, lalu meletakkan 7 anggota sujud ke lantai: dahi bersama hidung, dua telapak tangan, dua lutut, dan ujung jari-jari kedua kaki yang ditekuk menghadap Kiblat.",
    bacaanArab: "سُبْحَانَ رَبِّيَ الأَعْلَى وَبِحَمْدِهِ",
    bacaanLatin: "Subhaana rabbiyal-a'laa wa bihamdih.",
    terjemahan: "Maha Suci Tuhanku Yang Maha Tinggi dan dengan memuji-Nya.",
    dibacaBerapaKali: "3 kali",
    catatanPenting: "Sujud adalah posisi paling dekat antara seorang hamba dengan Allah SWT."
  },
  {
    id: 9,
    judul: "Duduk di Antara Dua Sujud (Iftirasy)",
    namaRukun: "Duduk Antara Dua Sujud",
    kategoriRukun: "Duduk",
    ikonGerakan: "sit-iftirasy",
    deskripsiGerakan: "Bangkit dari sujud sambil bertakbir, lalu duduk Iftirasy (duduk di atas telapak kaki kiri dan menegakkan telapak kaki kanan dengan jari-jari kaki menghadap Kiblat). Tangan di atas paha.",
    bacaanArab: "رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي",
    bacaanLatin: "Rabbighfir lii warhamnii wajburnii warfa'nii warzuqnii wahdinii wa 'aafinii wa'fu 'annii.",
    terjemahan: "Ya Tuhanku ampunilah aku, rahmatilah aku, cukupkanlah kekuranganku, tinggikanlah derajatku, berilah aku rezeki, berilah aku petunjuk, sehatkanlah aku dan maafkanlah kesalahanku.",
    dibacaBerapaKali: "1 kali",
    catatanPenting: "Doa ini mencakup permohonan ampunan, rezeki, kesehatan, dan hidayah yang sangat lengkap."
  },
  {
    id: 10,
    judul: "Sujud Kedua",
    namaRukun: "Sujud Kedua dengan Thuma'ninah",
    kategoriRukun: "Sujud",
    ikonGerakan: "sujud",
    deskripsiGerakan: "Bertakbir kembali untuk sujud yang kedua dengan cara dan bacaan yang sama persis seperti sujud pertama.",
    bacaanArab: "سُبْحَانَ رَبِّيَ الأَعْلَى وَبِحَمْدِهِ",
    bacaanLatin: "Subhaana rabbiyal-a'laa wa bihamdih.",
    terjemahan: "Maha Suci Tuhanku Yang Maha Tinggi dan dengan memuji-Nya.",
    dibacaBerapaKali: "3 kali",
    catatanPenting: "Setelah sujud kedua: Jika masih ada rakaat berikutnya, bangkit berdiri untuk rakaat berikutnya. Jika di rakaat ke-2 (untuk sholat 3/4 rakaat), lakukan Tasyahud Awal."
  },
  {
    id: 11,
    judul: "Tasyahud Awal (Rakaat Kedua)",
    namaRukun: "Tasyahud Awal (Sunnah Ab'adh)",
    kategoriRukun: "Tasyahud",
    ikonGerakan: "tasyahud-awal",
    deskripsiGerakan: "Duduk Iftirasy pada rakaat kedua (untuk sholat Dzuhur, Ashar, Maghrib, Isya). Meletakkan tangan kiri di atas paha kiri dan tangan kanan di atas paha kanan dengan jari telunjuk mengacung ke depan saat membaca syahadat.",
    bacaanArab: "التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ ، السَّلاَمُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ، السَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ ، اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ",
    bacaanLatin: "At-tahiyyaatul-mubaarakaatus-shalawaatut-thayyibaatu lillaah. Assalaamu 'alaika ayyuhan-nabiyyu wa rahmatullaahi wa barakaatuh. Assalaamu 'alainaa wa 'alaa 'ibaadillaahis-shaalihiin. Asyhadu allaa ilaaha illallaah, wa asyhadu anna Muhammadar-rasuulullaah. Allaahumma shalli 'alaa sayyidinaa Muhammad.",
    terjemahan: "Segala penghormatan yang berkat, solawat yang baik adalah bagi Allah. Sejahtera atasmu wahai Nabi dan rahmat Allah serta keberkahan-Nya. Sejahtera atas kami dan atas hamba-hamba Allah yang soleh. Aku bersaksi bahwa tiada Tuhan melainkan Allah, dan aku bersaksi bahwa Muhammad adalah utusan Allah. Ya Allah berilah sholawat kepada junjungan kami Nabi Muhammad.",
    dibacaBerapaKali: "1 kali (pada Rakaat 2)",
    catatanPenting: "Setelah Tasyahud Awal, berdiri kembali bertakbir melanjutkan rakaat berikutnya."
  },
  {
    id: 12,
    judul: "Tasyahud Akhir & Sholawat Ibrahimiyah",
    namaRukun: "Tasyahud Akhir (Rukun Wajib)",
    kategoriRukun: "Tasyahud",
    ikonGerakan: "tasyahud-akhir",
    deskripsiGerakan: "Duduk Tawarruk pada rakaat terakhir (kaki kiri dimasukkan di bawah kaki kanan, dan duduk di atas lantai/papan). Jari telunjuk kanan mengacung tegak menghadap Kiblat.",
    bacaanArab: "التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ ، السَّلاَمُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ، السَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ . اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى سَيِّدِنَا إِبْرَاهِيمَ وَعَلَى آلِ سَيِّدِنَا إِبْرَاهِيمَ ، وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى سَيِّدِنَا إِبْرَاهِيمَ وَعَلَى آلِ سَيِّدِنَا إِبْرَاهِيمَ فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    bacaanLatin: "At-tahiyyaatul-mubaarakaatus-shalawaatut-thayyibaatu lillaah. Assalaamu 'alaika ayyuhan-nabiyyu wa rahmatullaahi wa barakaatuh. Assalaamu 'alainaa wa 'alaa 'ibaadillaahis-shaalihiin. Asyhadu allaa ilaaha illallaah, wa asyhadu anna Muhammadar-rasuulullaah. Allaahumma shalli 'alaa sayyidinaa Muhammad wa 'alaa aali sayyidinaa Muhammad, kamaa shallaita 'alaa sayyidinaa Ibraahiim wa 'alaa aali sayyidinaa Ibraahiim. Wa baarik 'alaa sayyidinaa Muhammad wa 'alaa aali sayyidinaa Muhammad, kamaa baarakta 'alaa sayyidinaa Ibraahiim wa 'alaa aali sayyidinaa Ibraahiim, fil-'aalamiina innaka hamiidum-majiid.",
    terjemahan: "Segala penghormatan yang berkat, sholawat yang baik adalah bagi Allah. Sejahtera atasmu wahai Nabi dan rahmat Allah serta keberkahan-Nya. Sejahtera atas kami dan atas hamba-hamba Allah yang sholeh. Aku bersaksi bahwa tiada Tuhan selain Allah dan aku bersaksi bahwa Muhammad utusan Allah. Ya Allah, limpahkanlah sholawat kepada Nabi Muhammad dan keluarga Nabi Muhammad, sebagaimana Engkau telah melimpahkan sholawat kepada Nabi Ibrahim dan keluarga Nabi Ibrahim. Dan berkahilah Nabi Muhammad dan keluarga Nabi Muhammad, sebagaimana Engkau telah memberkahi Nabi Ibrahim dan keluarga Nabi Ibrahim. Di seluruh alam semesta, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.",
    dibacaBerapaKali: "1 kali (di rakaat paling akhir)",
    catatanPenting: "Dianjurkan membaca doa perlindungan dari 4 hal setelah sholawat sebelum mengucapkan salam."
  },
  {
    id: 13,
    judul: "Salam (Kanan dan Kiri)",
    namaRukun: "Salam Pertama (Rukun Wajib)",
    kategoriRukun: "Salam",
    ikonGerakan: "salam",
    deskripsiGerakan: "Menolehkan wajah ke arah kanan hingga pipi kanan terlihat dari belakang sambil mengucapkan salam pertama, lalu menolehkan wajah ke arah kiri sambil mengucapkan salam kedua.",
    bacaanArab: "السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
    bacaanLatin: "Assalaamu 'alaikum wa rahmatullaahi wa barakaatuh.",
    terjemahan: "Keselamatan, rahmat Allah, dan keberkahan-Nya semoga tercurah kepada kamu sekalian.",
    dibacaBerapaKali: "Salam Ke Kanan (Wajib), Salam Ke Kiri (Sunnah)",
    catatanPenting: "Salam pertama menandai berakhirnya ibadah sholat secara resmi."
  },
  {
    id: 14,
    judul: "Dzikir & Doa Setelah Sholat",
    namaRukun: "Dzikir & Doa Bada Sholat (Sunnah)",
    kategoriRukun: "Membaca",
    ikonGerakan: "dua",
    deskripsiGerakan: "Duduk tenang setelah salam untuk beristighfar, membaca kalimat Thoyyibah, Tasbih, Tahmid, Takbir, dan berdoa memohon kebaikan dunia dan akhirat.",
    bacaanArab: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ (٣x) ، اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ",
    bacaanLatin: "Astaghfirullaahal-'azhiim (3x). Allaahumma antas-salaamu wa minkas-salaam tabarakta yaa dzal-jalaali wal-ikraam.",
    terjemahan: "Aku memohon ampun kepada Allah Yang Maha Agung (3 kali). Ya Allah, Engkaulah Yang Maha Sejahtera dan dari-Mu lah kesejahteraan, Maha Suci Engkau wahai Tuhan Pemilik Keagungan dan Kemuliaan.",
    dibacaBerapaKali: "Istighfar 3x, Tasbih 33x, Tahmid 33x, Takbir 33x",
    catatanPenting: "Merupakan momen yang sangat mustajab untuk memohon hajat dan pengampunan dosa."
  }
];

export const QUNUT_SUBUH = {
  judul: "Doa Qunut Sholat Subuh",
  deskripsi: "Dibaca pada Rakaat Ke-2 Sholat Subuh saat berdiri I'tidal sebelum turun sujud.",
  teksArab: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ ، وَعَافِنِي فِيمَنْ عَافَيْتَ ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ ، وَقِنِي شَرَّ مَا قَضَيْتَ ، فَإِنَّكَ تَقْضِي وَلاَ يُقْضَى عَلَيْكَ ، وَإِنَّهُ لاَ يَذِلُّ مَنْ وَالَيْتَ ، وَلاَ يَعِزُّ مَنْ عَادَيْتَ ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ ، فَلَكَ الْحَمْدُ عَلَى مَا قَضَيْتَ ، وَأَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ ، وَصَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الأُمِّيِّ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ",
  teksLatin: "Allaahummahdinii fiiman hadait, wa 'aafinii fiiman 'aafait, wa tawallanii fiiman tawallait, wa baarik lii fiimaa a'thait, wa qinii syarra maa qadhait, fa innaka taqdhii wa laa yuqdhaa 'alaik, wa innahuu laa yadzillu maw-waalait, wa laa ya'izzu man 'aadait, tabaarakta rabbanaa wa ta'aalait, fa lakal-hamdu 'alaa maa qadhait, wa astaghfiruka wa atuubu ilaik, wa shallallaahu 'alaa sayyidinaa Muhammadi-nin-nabiyyil-ummiyyi wa 'alaa aalihii wa shahbihii wa sallam.",
  terjemahan: "Ya Allah berilah aku petunjuk sebagaimana orang yang telah Engkau beri petunjuk, berilah aku kesehatan sebagaimana orang yang telah Engkau beri kesehatan, peliharalah aku sebagaimana orang yang telah Engkau pelihara, berkahilah bagiku apa yang telah Engkau berikan, dan lindungilah aku dari kejahatan yang telah Engkau tetapkan. Karena sesungguhnya Engkaulah yang menetapkan dan tidak ada yang menetapkan atas-Mu. Dan sesungguhnya tidak akan hina orang yang Engkau cintai, dan tidak akan mulia orang yang Engkau musuhi. Maha Suci Engkau wahai Tuhan kami dan Maha Tinggi. Bagi-Mu lah segala puji atas apa yang telah Engkau tetapkan. Aku memohon ampunan dan bertaubat kepada-Mu. Dan semoga Allah melimpahkan sholawat serta salam kepada junjungan kami Nabi Muhammad yang ummi beserta keluarga dan sahabatnya."
};
