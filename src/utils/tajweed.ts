// Tajweed Rules Parser and Definition Engine
// Accurately recognizes Ghunnah, Qalqalah, Ikhfa, Idgham, Iqlab, Mad, and Izhhar

export type TajweedRuleType =
  | "ghunnah"
  | "qalqalah"
  | "ikhfa"
  | "idgham_bighunnah"
  | "idgham_bilaghunnah"
  | "iqlab"
  | "mad"
  | "izhhar"
  | "ikhfa_syafawi"
  | "idgham_mimi";

export interface TajweedRuleInfo {
  id: TajweedRuleType;
  name: string;
  arabicName: string;
  category: "Ghunnah & Dengung" | "Pantulan" | "Nun/Tanwin" | "Mad (Panjang)" | "Mim Sukun";
  colorClass: string;
  bgBadgeClass: string;
  borderClass: string;
  dotColor: string;
  description: string;
  howToRead: string;
  examples: Array<{ arabic: string; latin: string; surah: string }>;
}

export const TAJWEED_RULES: Record<TajweedRuleType, TajweedRuleInfo> = {
  mad: {
    id: "mad",
    name: "Mad Wajib / Jaiz / Lazim (Panjang 4-6 Harakat)",
    arabicName: "مَدّ وَاجِب / جَائِز / لَازِم",
    category: "Mad (Panjang)",
    colorClass: "text-red-700 dark:text-red-400 font-bold",
    bgBadgeClass: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800",
    borderClass: "border-red-500",
    dotColor: "bg-red-500",
    description: "Tanda Mad gelombang (ٓ) atau Alif Mad (آ) yang harus dibaca panjang 4 sampai 6 ketukan/harakat.",
    howToRead: "Dipanjangkan suaranya 4 hingga 6 harakat secara teratur dan berirama.",
    examples: [
      { arabic: "جَآءَ نَصْرُ اللَّهِ", latin: "Jaaa'a nashrullaah", surah: "QS. An-Nasr : 1" },
      { arabic: "السَّمَآءِ", latin: "As-samaaa'", surah: "QS. Al-Baqarah : 19" },
      { arabic: "وَلَا الضَّآلِّينَ", latin: "Wa ladh-dhaalliiin", surah: "QS. Al-Fatihah : 7" }
    ]
  },
  ghunnah: {
    id: "ghunnah",
    name: "Ghunnah Musyaddadah (Nun / Mim Tasydid)",
    arabicName: "غُنَّة مُشَدَّدَة (نّ / مّ)",
    category: "Ghunnah & Dengung",
    colorClass: "text-emerald-700 dark:text-emerald-400 font-bold",
    bgBadgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    borderClass: "border-emerald-500",
    dotColor: "bg-emerald-500",
    description: "Huruf Nun (نّ) atau Mim (مّ) yang bertasydid / bersyaddah.",
    howToRead: "Wajib mendengung dari rongga hidung ditahan selama 2 harakat (2 ketukan).",
    examples: [
      { arabic: "إِنَّ الْإِنسَانَ", latin: "Inna-l-insaana", surah: "QS. Al-'Asr : 2" },
      { arabic: "مِمَّا رَزَقْنَاهُمْ", latin: "Mimmaa razaqnaahum", surah: "QS. Al-Baqarah : 3" },
      { arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ", latin: "Minal jinnati wan-naas", surah: "QS. An-Nas : 6" }
    ]
  },
  qalqalah: {
    id: "qalqalah",
    name: "Qalqalah (Pantulan: ق ط ب ج د)",
    arabicName: "قَلْقَلَة (ق ط ب ج د)",
    category: "Pantulan",
    colorClass: "text-blue-700 dark:text-sky-400 font-bold",
    bgBadgeClass: "bg-blue-50 text-blue-700 dark:bg-sky-950/50 dark:text-sky-300 border-blue-200 dark:border-sky-800",
    borderClass: "border-blue-500",
    dotColor: "bg-blue-500",
    description: "Lima huruf pantul (Qaf, Tha, Ba, Jim, Dal - disingkat Ba-Ju-Di-To-Qo) saat berharakat sukun (mati) atau waqaf.",
    howToRead: "Dipantulkan bunyinya dengan jelas dan mantap tanpa tergesa-gesa.",
    examples: [
      { arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", latin: "Qul huwallaahu ahad", surah: "QS. Al-Ikhlas : 1" },
      { arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", latin: "Lam yalid wa lam yuulad", surah: "QS. Al-Ikhlas : 3" },
      { arabic: "تَبَّتْ يَدَآ أَبِي لَهَبٍ وَتَبَّ", latin: "Watabb", surah: "QS. Al-Lahab : 1" }
    ]
  },
  ikhfa: {
    id: "ikhfa",
    name: "Ikhfa' Haqiqi (Samar-samar)",
    arabicName: "إِخْفَاء حَقِيقِي",
    category: "Nun/Tanwin",
    colorClass: "text-amber-700 dark:text-amber-400 font-bold",
    bgBadgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    borderClass: "border-amber-500",
    dotColor: "bg-amber-500",
    description: "Nun Sukun (نْ) atau Tanwin (ً ٍ ٌ) bertemu salah satu dari 15 huruf Ikhfa: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك.",
    howToRead: "Disamarkan bacaan antara Izhhar dan Idgham dengan dengung 2 harakat mengarah ke makhraj huruf berikutnya.",
    examples: [
      { arabic: "مِن قَبْلِكَ", latin: "Ming qablik", surah: "QS. Al-Baqarah : 4" },
      { arabic: "أَنزَلْنَاهُ", latin: "Anzalnaahu", surah: "QS. Al-Qadr : 1" },
      { arabic: "كُنتُمْ خَيْرَ أُمَّةٍ", latin: "Kuntum khayra ummatin", surah: "QS. Ali 'Imran : 110" }
    ]
  },
  idgham_bighunnah: {
    id: "idgham_bighunnah",
    name: "Idgham Bighunnah (Lebur Berdengung: ي ن م و)",
    arabicName: "إِدْغَام بِغُنَّة (ي ن م و)",
    category: "Nun/Tanwin",
    colorClass: "text-purple-700 dark:text-purple-400 font-bold",
    bgBadgeClass: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    borderClass: "border-purple-500",
    dotColor: "bg-purple-500",
    description: "Nun Sukun atau Tanwin bertemu salah satu dari 4 huruf: Ya (ي), Nun (ن), Mim (م), Wawu (و) dalam dua kata terpisah.",
    howToRead: "Meleburkan bunyi Nun/Tanwin ke huruf berikutnya disertai dengung 2 harakat.",
    examples: [
      { arabic: "مَن يَقُولُ", latin: "May-yaquulu", surah: "QS. Al-Baqarah : 8" },
      { arabic: "مِن مَّالٍ", latin: "Mim-maalin", surah: "QS. Al-Mu'minun : 55" },
      { arabic: "خَيْرًا يَرَهُ", latin: "Khayray-yarah", surah: "QS. Az-Zalzalah : 7" }
    ]
  },
  idgham_bilaghunnah: {
    id: "idgham_bilaghunnah",
    name: "Idgham Bilaghunnah (Lebur Tanpa Dengung: ل ر)",
    arabicName: "إِدْغَام بِلَا غُنَّة (ل ر)",
    category: "Nun/Tanwin",
    colorClass: "text-teal-700 dark:text-teal-400 font-bold",
    bgBadgeClass: "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    borderClass: "border-teal-500",
    dotColor: "bg-teal-500",
    description: "Nun Sukun atau Tanwin bertemu huruf Lam (ل) atau Ra (ر).",
    howToRead: "Meleburkan bunyi Nun/Tanwin sepenuhnya ke huruf Lam atau Ra tanpa dengung.",
    examples: [
      { arabic: "مِن رَّبِّهِمْ", latin: "Mir-rabbihim", surah: "QS. Al-Baqarah : 5" },
      { arabic: "هُدًى لِّلْمُتَّقِينَ", latin: "Hudal-lil-muttaqiin", surah: "QS. Al-Baqarah : 2" },
      { arabic: "غَفُورٌ رَّحِيمٌ", latin: "Ghafuurur-rahiim", surah: "QS. Al-Baqarah : 173" }
    ]
  },
  iqlab: {
    id: "iqlab",
    name: "Iqlab (Ganti Bunyi Mim: ب)",
    arabicName: "إِقْلَاب (ب)",
    category: "Nun/Tanwin",
    colorClass: "text-rose-700 dark:text-rose-400 font-bold",
    bgBadgeClass: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    borderClass: "border-rose-500",
    dotColor: "bg-rose-500",
    description: "Nun Sukun atau Tanwin bertemu huruf Ba (ب), biasanya ditandai dengan huruf Mim kecil (ۢ / ۨ / م).",
    howToRead: "Mengubah bunyi Nun/Tanwin menjadi Mim (م) yang dirapatkan bibir disertai dengung 2 harakat.",
    examples: [
      { arabic: "مِن بَعْدِ", latin: "Mim-ba'di", surah: "QS. Al-Baqarah : 27" },
      { arabic: "أَنۢبِئْهُم", latin: "Ambi'hum", surah: "QS. Al-Baqarah : 33" },
      { arabic: "عَلِيمٌۢ بِذَاتِ الصُّدُورِ", latin: "'Aliimum-bidzaatis-shuduur", surah: "QS. Ali 'Imran : 119" }
    ]
  },
  izhhar: {
    id: "izhhar",
    name: "Izhhar Halqi (Jelas: ء هـ ع ح غ خ)",
    arabicName: "إِظْهَار حَلْقِي",
    category: "Nun/Tanwin",
    colorClass: "text-cyan-800 dark:text-cyan-300 font-bold",
    bgBadgeClass: "bg-cyan-50 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    borderClass: "border-cyan-500",
    dotColor: "bg-cyan-600",
    description: "Nun Sukun atau Tanwin bertemu salah satu dari 6 huruf Halq: Hamzah (ء/أ/إ), Ha (هـ), 'Ain (ع), Ha (ح), Ghain (غ), Kha (خ).",
    howToRead: "Dibaca jelas, terang, dan tegas tanpa ada dengung atau jeda.",
    examples: [
      { arabic: "مِنْ خَوْفٍ", latin: "Min khawf", surah: "QS. Quraisy : 4" },
      { arabic: "مَنْ ءَامَنَ", latin: "Man aamana", surah: "QS. Al-Baqarah : 62" },
      { arabic: "سَلَامٌ هِيَ", latin: "Salaamun hiya", surah: "QS. Al-Qadr : 5" }
    ]
  },
  ikhfa_syafawi: {
    id: "ikhfa_syafawi",
    name: "Ikhfa' Syafawi (Mim Sukun + ب)",
    arabicName: "إِخْفَاء شَفَوِي (مْ + ب)",
    category: "Mim Sukun",
    colorClass: "text-pink-700 dark:text-pink-400 font-bold",
    bgBadgeClass: "bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300 border-pink-200 dark:border-pink-800",
    borderClass: "border-pink-500",
    dotColor: "bg-pink-500",
    description: "Huruf Mim Sukun (مْ) bertemu dengan huruf Ba (ب).",
    howToRead: "Disamarkan pada bibir dengan disertai dengung 2 harakat.",
    examples: [
      { arabic: "تَرْمِيهِم بِحِجَارَةٍ", latin: "Tarmiihim bihijaarah", surah: "QS. Al-Fil : 4" },
      { arabic: "يَعْتَصِم بِاللَّهِ", latin: "Ya'tashim billaah", surah: "QS. Ali 'Imran : 101" }
    ]
  },
  idgham_mimi: {
    id: "idgham_mimi",
    name: "Idgham Mimi / Mitslain (Mim Sukun + م)",
    arabicName: "إِدْغَام مِيمِي (مْ + م)",
    category: "Mim Sukun",
    colorClass: "text-violet-700 dark:text-violet-400 font-bold",
    bgBadgeClass: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border-violet-200 dark:border-violet-800",
    borderClass: "border-violet-500",
    dotColor: "bg-violet-500",
    description: "Huruf Mim Sukun (مْ) bertemu huruf Mim (م).",
    howToRead: "Meleburkan kedua huruf Mim disertai dengung sempurna 2 harakat.",
    examples: [
      { arabic: "أَطْعَمَهُم مِّن جُوعٍ", latin: "Ath'amahum min juu'", surah: "QS. Quraisy : 4" },
      { arabic: "فِي قُلُوبِهِم مَّرَضٌ", latin: "Fii quluubihim maradh", surah: "QS. Al-Baqarah : 10" }
    ]
  }
};

export interface TajweedSegment {
  text: string;
  rule?: TajweedRuleType;
}

// Tokenizes an Arabic verse text into segments with attached Tajweed rule types
export function parseTajweed(arabicText: string): TajweedSegment[] {
  if (!arabicText) return [];

  // We parse through words and character sequences
  const segments: TajweedSegment[] = [];

  // Tajweed regex patterns
  // 1. Maddah (Mad Panjang ~ / ٓ / آ)
  // 2. Nun/Mim Musyaddadah (نّ / مّ)
  // 3. Iqlab (ن/tanwin + ب with mim)
  // 4. Qalqalah (ق ط ب ج د with sukun or word ends)
  // 5. Idgham Bighunnah (ن/tanwin + ي ن م و)
  // 6. Idgham Bilaghunnah (ن/tanwin + ل ر)
  // 7. Ikhfa Haqiqi (ن/tanwin + ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك)
  // 8. Izhhar (ن/tanwin + ء ه ع ح غ خ)
  // 9. Mim Sukun rules (Ikhfa Syafawi, Idgham Mimi)

  // Harakats regex
  const HARAKAT = "[\\u064B-\\u0652\\u0670\\u0654\\u0653\\u06E2\\u06ED\\u06E0\\u06DF]*";

  // Comprehensive Regex Pattern with named or index capture
  // Matches tokens that carry specific tajweed rules
  const tajweedRegex = new RegExp(
    [
      // Rule: Maddah Panjang (Mad Wajib/Jaiz)
      `(?<mad>(?:[\\u0600-\\u06FF]\\u0653|آ|\\u0622|\\u0671[\\u0600-\\u06FF]*\\u0653))`,
      
      // Rule: Ghunnah Musyaddadah (نّ atau مّ)
      `(?<ghunnah>(?:[نم]${HARAKAT}\\u0651|\\u0651${HARAKAT}[نم]))`,
      
      // Rule: Iqlab (نْ/tanwin + ب or small mim)
      `(?<iqlab>(?:(?:ن[\\u0652]?|[\\u064B\\u064C\\u064D]|[\\u06E2\\u06ED\\u06E0])\\s*ب${HARAKAT}))`,
      
      // Rule: Mim Sukun + Ba (Ikhfa Syafawi)
      `(?<ikhfa_syafawi>(?:م[\\u0652]?\\s*ب${HARAKAT}))`,

      // Rule: Mim Sukun + Mim (Idgham Mimi)
      `(?<idgham_mimi>(?:م[\\u0652]?\\s*م[\\u0651]?${HARAKAT}))`,

      // Rule: Idgham Bilaghunnah (ن/tanwin + ل/ر)
      `(?<idgham_bilaghunnah>(?:(?:ن[\\u0652]?|[\\u064B\\u064C\\u064D])\\s*[لر][\\u0651]?${HARAKAT}))`,

      // Rule: Idgham Bighunnah (ن/tanwin + ي/ن/م/و)
      `(?<idgham_bighunnah>(?:(?:ن[\\u0652]?|[\\u064B\\u064C\\u064D])\\s*[ينمو][\\u0651]?${HARAKAT}))`,

      // Rule: Izhhar Halqi (ن/tanwin + ء/هـ/ع/ح/غ/خ)
      `(?<izhhar>(?:(?:ن[\\u0652]|[\\u064B\\u064C\\u064D])\\s*[ءأإؤئههـعحغخ]${HARAKAT}))`,

      // Rule: Ikhfa' Haqiqi (ن/tanwin + 15 huruf)
      `(?<ikhfa>(?:(?:ن[\\u0652]?|[\\u064B\\u064C\\u064D])\\s*[تثجدذزسشصضطظفقك]${HARAKAT}))`,

      // Rule: Qalqalah (ق ط ب ج د sukun)
      `(?<qalqalah>[قطبجد](?:\\u0652|[\\u064B-\\u0650]?\\b))`
    ].join("|"),
    "gu"
  );

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tajweedRegex.exec(arabicText)) !== null) {
    const matchIndex = match.index;
    const matchText = match[0];

    // Push preceding normal text if any
    if (matchIndex > lastIndex) {
      segments.push({
        text: arabicText.substring(lastIndex, matchIndex)
      });
    }

    // Determine matching rule
    let rule: TajweedRuleType = "ghunnah";
    if (match.groups) {
      if (match.groups.mad) rule = "mad";
      else if (match.groups.ghunnah) rule = "ghunnah";
      else if (match.groups.iqlab) rule = "iqlab";
      else if (match.groups.ikhfa_syafawi) rule = "ikhfa_syafawi";
      else if (match.groups.idgham_mimi) rule = "idgham_mimi";
      else if (match.groups.idgham_bilaghunnah) rule = "idgham_bilaghunnah";
      else if (match.groups.idgham_bighunnah) rule = "idgham_bighunnah";
      else if (match.groups.izhhar) rule = "izhhar";
      else if (match.groups.ikhfa) rule = "ikhfa";
      else if (match.groups.qalqalah) rule = "qalqalah";
    }

    segments.push({
      text: matchText,
      rule
    });

    lastIndex = matchIndex + matchText.length;
  }

  // Push remainder
  if (lastIndex < arabicText.length) {
    segments.push({
      text: arabicText.substring(lastIndex)
    });
  }

  return segments;
}
