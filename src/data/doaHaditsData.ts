export interface DoaItem {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  category: string;
  source: string;
  fadhilah?: string;
}

export interface HaditsItem {
  id: string;
  title: string;
  narrator: string;
  arabic: string;
  latin: string;
  translation: string;
  category: string;
  explanation: string;
}

export const DOA_CATEGORIES = [
  { id: "semua", name: "Semua Doa", icon: "✨" },
  { id: "harian", name: "Doa Harian", icon: "🌅" },
  { id: "mustajab", name: "Doa Mustajab & Para Nabi", icon: "⭐" },
  { id: "ibadah", name: "Ibadah & Sholat", icon: "🕌" },
  { id: "keluarga", name: "Keluarga & Orang Tua", icon: "🏡" },
  { id: "perlindungan", name: "Perlindungan & Kesehatan", icon: "🛡️" },
  { id: "rezeki", name: "Rezeki & Ilmu", icon: "💡" },
];

export const HADITS_CATEGORIES = [
  { id: "semua", name: "Semua Hadits", icon: "📜" },
  { id: "qudsi", name: "Hadits Qudsi", icon: "👑" },
  { id: "niat", name: "Niat & Keikhlasan", icon: "❤️" },
  { id: "akhlak", name: "Akhlak & Budi Pekerti", icon: "🌱" },
  { id: "persaudaraan", name: "Persaudaraan & Kasih Sayang", icon: "🤝" },
  { id: "ilmu", name: "Ilmu & Al-Qur'an", icon: "📚" },
  { id: "keutamaan", name: "Zikir & Sholat", icon: "📿" },
];

export const DOA_LIST: DoaItem[] = [
  {
    id: "doa-sebelum-makan",
    title: "Doa Sebelum Makan",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ، بِسْمِ اللَّهِ",
    latin: "Allahumma baarik lanaa fiimaa razaqtanaa wa qinaa 'adzaaban naar, bismillah.",
    translation: "Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa neraka. Dengan nama Allah.",
    category: "harian",
    source: "HR. Ibny As-Sunni",
    fadhilah: "Mengundang keberkahan rezeki dan membentengi makanan dari gangguan syaitan."
  },
  {
    id: "doa-sesudah-makan",
    title: "Doa Sesudah Makan & Minum",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ",
    latin: "Alhamdulillahilladzi ath'amanaa wa saqaanaa wa ja'alanaa minal muslimiin.",
    translation: "Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami termasuk orang-orang muslim.",
    category: "harian",
    source: "HR. Abu Daud & Tirmidzi",
    fadhilah: "Wujud rasa syukur atas rezeki makanan sehingga Allah meredhai hamba-Nya."
  },
  {
    id: "doa-sebelum-tidur",
    title: "Doa Sebelum Tidur",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَحْيَا وَبِاسْمِكَ أَمُوتُ",
    latin: "Bismika allahumma ahyaa wa bismika amuut.",
    translation: "Dengan nama-Mu ya Allah aku hidup dan dengan nama-Mu aku mati.",
    category: "harian",
    source: "HR. Bukhari & Muslim",
    fadhilah: "Menyerahkan jiwa dan raga kepada Allah agar tidur dilindungi malaikat."
  },
  {
    id: "doa-bangun-tidur",
    title: "Doa Bangun Tidur",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    latin: "Alhamdulillahilladzi ahyaanaa ba'da maa amaatanaa wa ilaihin nusyuur.",
    translation: "Segala puji bagi Allah yang telah menghidupkan kami kembali setelah mematikan kami, dan hanya kepada-Nya kami dibangkitkan.",
    category: "harian",
    source: "HR. Bukhari",
    fadhilah: "Menyegarkan jiwa di pagi hari dengan rasa syukur atas nikmat umur kembali."
  },
  {
    id: "doa-keluar-rumah",
    title: "Doa Keluar Rumah",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ ، لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ",
    latin: "Bismillahi tawakkaltu 'alallah, laa haula wa laa quwwata illaa billah.",
    translation: "Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.",
    category: "harian",
    source: "HR. Abu Daud & Tirmidzi",
    fadhilah: "Diberi petunjuk, dicukupi perlindungan, dan syaitan akan menjauh."
  },
  {
    id: "doa-masuk-rumah",
    title: "Doa Masuk Rumah",
    arabic: "بِسْمِ اللهِ وَلَجْنَا، وَبِسْمِ اللهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا",
    latin: "Bismillahi walajnaa wa bismillahi kharajnaa wa 'ala rabbinaa tawakkalnaa.",
    translation: "Dengan nama Allah kami masuk, dan dengan nama Allah kami keluar, dan kepada Rabb kami kami bertawakal.",
    category: "harian",
    source: "HR. Abu Daud",
    fadhilah: "Menjaga kedamaian rumah dan menghalangi syaitan menginap di dalam rumah."
  },
  {
    id: "doa-masuk-kamar-mandi",
    title: "Doa Masuk Kamar Mandi / Toilet",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    latin: "Allahumma innii a'uudzu bika minal khubutsi wal khabaa-its.",
    translation: "Ya Allah, sesungguhnya aku berlindung kepada-Mu dari godaan syaitan jantan dan syaitan betina.",
    category: "harian",
    source: "HR. Bukhari & Muslim",
    fadhilah: "Melindungi aurat dan kebersihan dari gangguan jin dan syaitan."
  },
  {
    id: "doa-keluar-kamar-mandi",
    title: "Doa Keluar Kamar Mandi",
    arabic: "غُفْرَانَكَ ، الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الأَذَى وَعَافَانِي",
    latin: "Ghufraanaka, alhamdulillahilladzi adz-haba 'annil adzaa wa 'aafaanil.",
    translation: "Aku memohon ampunan-Mu. Segala puji bagi Allah yang telah menghilangkan kotoran dari tubuhku dan menyehatkanku.",
    category: "harian",
    source: "HR. Abu Daud & Ibnu Majah",
    fadhilah: "Menghapuskan dosa dan bersyukur atas lancarnya metabolisme tubuh."
  },
  {
    id: "doa-sesudah-wudhu",
    title: "Doa Sesudah Wudhu",
    arabic: "أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
    latin: "Asyhadu alla ilaha illallah wahdahu laa syariika lah, wa asyhadu anna muhammadan 'abduhu wa rasuuluh. Allahummaj'alnii minat tawwaabiina waj'alnii minal mutathahhiriin.",
    translation: "Aku bersaksi tiada sesembahan yang berhak disembah selain Allah semata, dan aku bersaksi Nabi Muhammad hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk orang yang bertobat dan bersuci.",
    category: "ibadah",
    source: "HR. Muslim & Tirmidzi",
    fadhilah: "Dibukakan baginya 8 pintu surga dan boleh masuk dari pintu mana saja yang disukainya."
  },
  {
    id: "doa-setelah-azan",
    title: "Doa Setelah Mendengar Azan",
    arabic: "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلاَةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
    latin: "Allahumma rabba hadzihid da'watit taammati wash shalaatil qaa-imah, aati muhammadanil wasiilata wal fadhiilah, wab'ats-hu maqaamam mahmuudanilladzi wa'adtah.",
    translation: "Ya Allah, Rabb pemilik panggilan yang sempurna ini dan sholat yang didirikan, berikanlah kepada Nabi Muhammad kedudukan wasilah dan keutamaan, dan tempatkanlah beliau di tempat yang terpuji sebagaimana telah Engkau janjikan.",
    category: "ibadah",
    source: "HR. Bukhari",
    fadhilah: "Mendapatkan syafa'at Rasulullah SAW di hari kiamat kelak."
  },
  {
    id: "doa-sholat-dhuha",
    title: "Doa Sholat Dhuha",
    arabic: "اللَّهُمَّ إِنَّ الضُّحَاءَ ضُحَاؤُكَ وَالْبَهَاءَ بَهَاؤُكَ وَالْجَمَالَ جَمَالُكَ وَالْقُوَّةَ قُوَّتُكَ وَالْقُدْرَةَ قُدْرَتُكَ وَالْعِصْمَةَ عِصْمَتُكَ",
    latin: "Allahumma innadh dhuhaa'a dhuhaa'uka, wal bahaa'a bahaa'uka, wal jamaala jamaaluka, wal quwwata quwwatuka, wal qudrata qudratuka, wal 'ishmata 'ishmatuka.",
    translation: "Ya Allah, sesungguhnya waktu dhuha adalah waktu dhuha-Mu, keagungan adalah keagungan-Mu, keindahan adalah keindahan-Mu, kekuatan adalah kekuatan-Mu, dan perlindungan adalah perlindungan-Mu.",
    category: "ibadah",
    source: "Doa Masyhur Sholat Dhuha",
    fadhilah: "Membuka pintu rezeki yang berkah dan melapangkan jiwa."
  },
  {
    id: "doa-kedua-orang-tua",
    title: "Doa Untuk Kedua Orang Tua",
    arabic: "رَبَّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    latin: "Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa.",
    translation: "Wahai Rabbku, ampunilah aku dan kedua orang tuaku, dan kasihilah mereka berdua sebagaimana mereka telah merawatku sewaktu kecil.",
    category: "keluarga",
    source: "QS. Al-Isra: 24",
    fadhilah: "Bentuk kebhaktian (birrul walidain) yang menghantarkan keridhoan Allah."
  },
  {
    id: "doa-sapu-jagat",
    title: "Doa Sapu Jagat (Kebaikan Dunia & Akhirat)",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    latin: "Rabbanaa aatinaa fid dunyaa hasanatan wa fil aakhirati hasanatan wa qinaa 'adzaaban naar.",
    translation: "Ya Rabb kami, berikanlah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari siksa neraka.",
    category: "perlindungan",
    source: "QS. Al-Baqarah: 201",
    fadhilah: "Doa paling sering dibaca oleh Rasulullah SAW karena mencakup seluruh kebaikan."
  },
  {
    id: "doa-penenang-hati",
    title: "Doa Kelapangan Hati & Kelancaran Urusan",
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
    latin: "Rabbisyrah lii shadrii wa yassir lii amrii wahlul 'uqdatam mil lisaanii yafqahuu qawlii.",
    translation: "Ya Rabbku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah kekakuan dari lidahku agar mereka mengerti perkataanku.",
    category: "rezeki",
    source: "QS. Thaha: 25-28",
    fadhilah: "Doa Nabi Musa AS untuk ketenangan jiwa, keberanian berbicara, dan kemudahan ujian."
  },
  {
    id: "doa-menjenguk-orang-sakit",
    title: "Doa Menjenguk Orang Sakit",
    arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي لاَ شِفَاءَ إِلاَّ شِفَاؤُكَ شِفَاءً لاَ يُغَادِرُ سَقَمًا",
    latin: "Allahumma rabban naas, adzhibil ba's, isyfi antas syaafii laa syifaa-a illaa syifaa-uka syifaa-an laa yughaadiru saqamaa.",
    translation: "Ya Allah Rabb seluruh manusia, hilangkanlah penyakit ini, sembuhkanlah karena Engkau Maha Penyembuh. Tidak ada kesembuhan selain kesembuhan-Mu, kesembuhan yang tidak meninggalkan rasa sakit.",
    category: "perlindungan",
    source: "HR. Bukhari & Muslim",
    fadhilah: "Memohon kesembuhan total dan memberi dukungan moril pada orang yang sakit."
  },
  {
    id: "doa-tambah-ilmu",
    title: "Doa Mohon Tambah Ilmu yang Bermanfaat",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلاً مُتَقَبَّلاً",
    latin: "Allahumma innii as-aluka 'ilman naafi'an wa rizqan thayyiban wa 'amalan mutaqabbalan.",
    translation: "Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang halal dan baik, serta amal yang diterima.",
    category: "rezeki",
    source: "HR. Ibnu Majah",
    fadhilah: "Dibaca setiap selesai sholat Subuh untuk keberkahan aktivitas sepanjang hari."
  },
  {
    id: "doa-nabi-yunus",
    title: "Doa Nabi Yunus AS (Pengentas Kesulitan)",
    arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    latin: "Laa ilaaha illaa anta subhaanaka innii kuntu minadh zhaalimiin.",
    translation: "Tidak ada tuhan selain Engkau. Maha Suci Engkau, sungguh aku adalah termasuk orang-orang yang zhalim.",
    category: "mustajab",
    source: "QS. Al-Anbiya: 87",
    fadhilah: "Doa sangat mustajab saat ditimpa cobaan berat, kesulitan, dan duka cita mendalam."
  },
  {
    id: "doa-nabi-adam",
    title: "Doa Nabi Adam AS (Permohonan Ampunan)",
    arabic: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    latin: "Rabbanaa zhalamnaa anfusanaa wa il-lam taghfir lanaa wa tarhamnaa lanakuunanna minal khaasiriin.",
    translation: "Ya Rabb kami, kami telah menzalimi diri kami sendiri. Jika Engkau tidak mengampuni kami dan memberi rahmat kepada kami, niscaya kami termasuk orang-orang yang rugi.",
    category: "mustajab",
    source: "QS. Al-A'raf: 23",
    fadhilah: "Doa tobat mendalam memohon pertolongan dan ampunan Ilahi."
  },
  {
    id: "doa-nabi-ibrahim-keturunan",
    title: "Doa Nabi Ibrahim AS (Kemuliaan Keturunan & Sholat)",
    arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    latin: "Rabbij'alnii muqiimash shalaati wa min dzurriyyatii rabbanaa wa taqabbal du'aa'.",
    translation: "Ya Rabbku, jadikanlah aku dan anak cucuku orang-orang yang tetap mendirikan sholat. Ya Rabb kami, perkenankanlah doaku.",
    category: "mustajab",
    source: "QS. Ibrahim: 40",
    fadhilah: "Doa kelanggengan tauhid dan istiqomah ibadah bagi keluarga hingga generasi mendatang."
  }
];

export const HADITS_LIST: HaditsItem[] = [
  {
    id: "hadits-qudsi-prasangka",
    title: "Hadits Qudsi: Aku Sesuai Prasangka Hamba-Ku",
    narrator: "HR. Bukhari & Muslim (Hadits Qudsi)",
    arabic: "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي ، وَأَنَا مَعَهُ إِذَا ذَكَرَنِي",
    latin: "Ana 'inda zhanni 'abdii bii, wa ana ma'ahu idzaa dzakaranii.",
    translation: "Allah Ta'ala berfirman: 'Aku sesuai prasangka hamba-Ku kepada-Ku, dan Aku bersamanya apabila ia mengingat-Ku.'",
    category: "qudsi",
    explanation: "Dorongan mendalam untuk senantiasa berprasangka baik (husnuzhan) kepada Allah SWT dan memperbanyak zikir."
  },
  {
    id: "hadits-qudsi-cinta-allah",
    title: "Hadits Qudsi: Keutamaan Mencintai Karena Allah",
    narrator: "HR. Malik & Tirmidzi (Hadits Qudsi)",
    arabic: "وَجَبَتْ مَحَبَّتِي لِلْمُتَحَابِّينَ فِيَّ وَالْمُتَجَالِسِينَ فِيَّ وَالْمُتَزَاوِرِينَ فِيَّ",
    latin: "Wajabat mahabbatii lil mutahaabbiina fiyya wal mutajaalisiina fiyya wal mutazaawiriina fiyya.",
    translation: "Allah Ta'ala berfirman: 'Cinta-Ku berhak didapatkan oleh orang-orang yang saling mencintai karena-Ku, saling duduk berkumpul karena-Ku, dan saling mengunjungi karena-Ku.'",
    category: "qudsi",
    explanation: "Keagungan jalinan silaturahmi dan ukhuwah ikhlas yang semata-mata mencari keridhoan Allah."
  },
  {
    id: "hadits-niat",
    title: "Segala Amal Tergantung Pada Niatnya",
    narrator: "HR. Bukhari & Muslim (Dari Umar bin Khattab RA)",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    latin: "Innamal a'maalu bin niyyaati wa innamaa likullimri-in maa nawaa.",
    translation: "Sesungguhnya setiap amalan tergantung pada niatnya, dan sesungguhnya setiap orang akan mendapatkan sesuai dengan apa yang ia niatkan.",
    category: "niat",
    explanation: "Hadits pilar utama ajaran Islam. Setiap ibadah maupun muamalah dinilai berdasarkan keikhlasan niat di dalam hati."
  },
  {
    id: "hadits-senyum-sedekah",
    title: "Senyum Adalah Sedekah",
    narrator: "HR. Tirmidzi (Dari Abu Dharr RA)",
    arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    latin: "Tabassumuka fii wajhi akhiika laka shadaqah.",
    translation: "Senyummu di hadapan saudaramu adalah sedekah bagimu.",
    category: "akhlak",
    explanation: "Islam mengajarkan ramah tamah. Senyuman tulus yang membahagiakan sesama bernilai pahala sedekah."
  },
  {
    id: "hadits-larangan-marah",
    title: "Jangan Marah, Maka Bagimu Surga",
    narrator: "HR. Bukhari (Dari Abu Hurairah RA)",
    arabic: "لاَ تَغْضَبْ وَلَكَ الْجَنَّةُ",
    latin: "Laa taghdhab wa lakal jannah.",
    translation: "Janganlah engkau marah, maka bagimu adalah surga.",
    category: "akhlak",
    explanation: "Pentingnya mengendalikan emosi dan amarah. Menahan diri saat emosi adalah tanda keberanian sejati."
  },
  {
    id: "hadits-mencintai-saudara",
    title: "Sempurna Iman Mencintai Saudara",
    narrator: "HR. Bukhari & Muslim (Dari Anas bin Malik RA)",
    arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    latin: "Laa yu'minu ahadukum hattaa yuhibba li-akhihi maa yuhibbu linafsih.",
    translation: "Tidak sempurna iman salah seorang di antara kalian hingga ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri.",
    category: "persaudaraan",
    explanation: "Dasar empati sosial dalam Islam. Menghilangkan rasa iri dan menumbuhkan kasih sayang antarsesama."
  },
  {
    id: "hadits-belajar-quran",
    title: "Sebaik-baik Manusia Belajar & Mengajar Al-Qur'an",
    narrator: "HR. Bukhari (Dari Utsman bin Affan RA)",
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    latin: "Khairukum man ta'allamal qur'aana wa 'allamah.",
    translation: "Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya.",
    category: "ilmu",
    explanation: "Kemuliaan mendalam bagi siapa saja yang meluangkan waktu membaca, memahami, dan mengajarkan Al-Qur'an."
  },
  {
    id: "hadits-menuntut-ilmu",
    title: "Menuntut Ilmu Wajib Bagi Setiap Muslim",
    narrator: "HR. Ibnu Majah (Dari Anas bin Malik RA)",
    arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    latin: "Thalabul 'ilmi fariidhatun 'alaa kulli muslim.",
    translation: "Menuntut ilmu itu wajib bagi setiap muslim.",
    category: "ilmu",
    explanation: "Pendidikan dan pencarian ilmu adalah kewajiban seumur hidup tanpa membedakan laki-laki maupun perempuan."
  },
  {
    id: "hadits-kalimat-ringan-berat-timbangan",
    title: "Dua Kalimat Ringan di Lisan Berat di Timbangan",
    narrator: "HR. Bukhari & Muslim (Dari Abu Hurairah RA)",
    arabic: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ ، ثَقِيلَتَانِ فِي الْمِيزَانِ ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ : سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    latin: "Kalimataan khafiifataan 'alal lisaan, tsaqiilataan fil miizaan, habiibataan ilar rahmaan: Subhaanallahi wa bihamdihi, subhaanallahil 'azhiim.",
    translation: "Dua kalimat yang ringan di lisan, berat di timbangan (kebaikan), dan dicintai oleh Ar-Rahman: Subhanallahi wa bihamdihi, subhanallahil 'azhiim.",
    category: "keutamaan",
    explanation: "Zikir istimewa yang mudah diucapkan namun memberikan pahala yang sangat melimpah di akhirat."
  },
  {
    id: "hadits-sholat-tiang-agama",
    title: "Sholat Adalah Tiang Agama",
    narrator: "HR. Tirmidzi (Dari Mu'adz bin Jabal RA)",
    arabic: "رَأْسُ الأَمْرِ الإِسْلاَمُ وَعَمُودُهُ الصَّلاَةُ",
    latin: "Ra'sul amril islamu wa 'amuduhush shalah.",
    translation: "Pokok dari segala urusan adalah Islam dan tiangnya adalah sholat.",
    category: "keutamaan",
    explanation: "Sholat 5 waktu merupakan pilar utama penopang keimanan seorang muslim."
  }
];
