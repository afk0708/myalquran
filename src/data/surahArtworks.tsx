import React from "react";
import {
  BookOpen,
  Wheat,
  Users,
  Heart,
  Utensils,
  Footprints,
  Mountain,
  Shield,
  Droplets,
  Fish,
  Wind,
  Star,
  Zap,
  Flame,
  Building,
  Hexagon,
  Moon,
  Lamp,
  Flower2,
  Compass,
  Scroll,
  MapPin,
  ShieldCheck,
  Lightbulb,
  Scale,
  PenTool,
  GitMerge,
  BookMarked,
  Network,
  Castle,
  GraduationCap,
  Lock,
  Landmark,
  Feather,
  Sparkles,
  Rows,
  Award,
  ArrowRight,
  KeyRound,
  BookOpenCheck,
  Handshake,
  Gem,
  CloudFog,
  ArrowDownCircle,
  Flag,
  Home,
  Sun,
  Scale as ScaleIcon,
  Anvil,
  MessageSquare,
  AlignJustify,
  Calendar,
  EyeOff,
  FileText,
  Crown,
  Edit3,
  Hourglass,
  TrendingUp,
  Ship,
  Eye,
  Shirt,
  Sunrise,
  Clock,
  User,
  Newspaper,
  AtSign,
  Split,
  Gauge,
  CircleDot,
  Building2,
  SunMedium,
  Smile,
  Leaf,
  CheckCircle,
  Activity,
  AlertTriangle,
  Coins,
  Truck,
  HeartHandshake,
  Gift,
  ShieldX,
  Trophy,
  TreeDeciduous,
  Anchor,
  CloudLightning,
  Sparkle,
  Book,
  Trees,
  CloudRain
} from "lucide-react";

export interface SurahArtworkConfig {
  icon: React.ElementType;
  watermarkSvg?: React.ReactNode;
  bgPattern: string; // Tailwind opacity & accent color
  badgeColor?: string;
  symbolName: string;
}

// Custom thematic watermark vector graphics for iconic Surahs
const ElephantWatermark = (
  <svg viewBox="0 0 100 100" className="w-24 h-24 text-slate-800/10 dark:text-white/10 fill-current">
    <path d="M20 70 C 15 50, 30 30, 50 30 C 70 30, 85 45, 85 65 C 85 75, 75 80, 70 80 L 65 70 L 60 80 L 45 80 L 40 70 L 35 80 Z M 30 45 C 33 45, 33 50, 30 50 C 27 50, 27 45, 30 45 Z M 75 60 C 80 65, 85 75, 80 85 C 75 90, 70 85, 72 75 Z" />
  </svg>
);

const BeeWatermark = (
  <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-600/10 dark:text-amber-300/10 fill-none stroke-current stroke-2">
    <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" />
    <polygon points="50,25 70,36 70,64 50,75 30,64 30,36" />
    <circle cx="50" cy="50" r="12" />
  </svg>
);

const CowWatermark = (
  <svg viewBox="0 0 100 100" className="w-24 h-24 text-emerald-800/10 dark:text-emerald-200/10 fill-current">
    <path d="M25 35 C20 20, 30 15, 35 25 C45 20, 55 20, 65 25 C70 15, 80 20, 75 35 C85 45, 85 65, 70 75 L65 90 L55 90 L55 80 L45 80 L45 90 L35 90 L30 75 C15 65, 15 45, 25 35 Z M 35 45 C38 45, 38 50, 35 50 Z M 65 45 C68 45, 68 50, 65 50 Z" />
  </svg>
);

const CaveWatermark = (
  <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-700/10 dark:text-amber-200/10 fill-current">
    <path d="M10 90 L25 30 L50 15 L75 30 L90 90 Z M 35 90 C35 65, 65 65, 65 90 Z" />
  </svg>
);

const SpiderWebWatermark = (
  <svg viewBox="0 0 100 100" className="w-24 h-24 text-teal-600/10 dark:text-teal-300/10 fill-none stroke-current stroke-1">
    <line x1="50" y1="10" x2="50" y2="90" />
    <line x1="10" y1="50" x2="90" y2="50" />
    <line x1="20" y1="20" x2="80" y2="80" />
    <line x1="80" y1="20" x2="20" y2="80" />
    <polygon points="50,30 64,36 70,50 64,64 50,70 36,64 30,50 36,36" />
    <polygon points="50,20 71,29 80,50 71,71 50,80 29,71 20,50 29,29" />
  </svg>
);

const SunburstWatermark = (
  <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-500/10 dark:text-amber-300/10 fill-current">
    <circle cx="50" cy="50" r="18" />
    <path d="M50 10 L50 24 M50 76 L50 90 M10 50 L24 50 M76 50 L90 50 M22 22 L32 32 M68 68 L78 78 M22 78 L32 68 M68 32 L78 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// Map each surah number (1 - 114) to its corresponding icon and watermark artwork
export const getSurahArtwork = (surahNomor: number): SurahArtworkConfig => {
  switch (surahNomor) {
    case 1: // Al-Fatihah (Pembuka)
      return {
        icon: Sun,
        watermarkSvg: SunburstWatermark,
        bgPattern: "from-amber-500/10 via-emerald-500/5 to-transparent",
        symbolName: "Pembukaan & Cahaya"
      };
    case 2: // Al-Baqarah (Sapi Betina)
      return {
        icon: Wheat,
        watermarkSvg: CowWatermark,
        bgPattern: "from-emerald-600/10 to-transparent",
        symbolName: "Sapi Betina & Gembala"
      };
    case 3: // Ali 'Imran (Keluarga 'Imran)
      return {
        icon: Users,
        bgPattern: "from-teal-600/10 to-transparent",
        symbolName: "Keluarga & Keberkahan"
      };
    case 4: // An-Nisa' (Wanita)
      return {
        icon: Heart,
        bgPattern: "from-rose-500/10 to-transparent",
        symbolName: "Wanita & Kasih Sayang"
      };
    case 5: // Al-Ma'idah (Hidangan)
      return {
        icon: Utensils,
        bgPattern: "from-amber-600/10 to-transparent",
        symbolName: "Hidangan Langit"
      };
    case 6: // Al-An'am (Hewan Ternak)
      return {
        icon: Footprints,
        bgPattern: "from-stone-600/10 to-transparent",
        symbolName: "Hewan Ternak & Alam"
      };
    case 7: // Al-A'raf (Tempat Tertinggi)
      return {
        icon: Mountain,
        bgPattern: "from-slate-600/10 to-transparent",
        symbolName: "Tempat Tertinggi"
      };
    case 8: // Al-Anfal (Rampasan Perang)
      return {
        icon: Shield,
        bgPattern: "from-sky-600/10 to-transparent",
        symbolName: "Perisai & Kemenangan"
      };
    case 9: // At-Taubah (Pengampunan)
      return {
        icon: Droplets,
        bgPattern: "from-emerald-500/10 to-transparent",
        symbolName: "Rahmat & Pengampunan"
      };
    case 10: // Yunus (Nabi Yunus)
      return {
        icon: Fish,
        bgPattern: "from-cyan-600/10 to-transparent",
        symbolName: "Nabi Yunus & Samudra"
      };
    case 11: // Hud (Nabi Hud)
      return {
        icon: CloudRain,
        bgPattern: "from-blue-600/10 to-transparent",
        symbolName: "Nabi Hud & Angin Kencang"
      };
    case 12: // Yusuf (Nabi Yusuf)
      return {
        icon: Crown,
        bgPattern: "from-amber-500/10 to-transparent",
        symbolName: "Nabi Yusuf & Mahkota"
      };
    case 13: // Ar-Ra'd (Guruh)
      return {
        icon: CloudLightning,
        bgPattern: "from-purple-600/10 to-transparent",
        symbolName: "Guruh & Halilintar"
      };
    case 14: // Ibrahim (Nabi Ibrahim)
      return {
        icon: Flame,
        bgPattern: "from-orange-500/10 to-transparent",
        symbolName: "Nabi Ibrahim & Api Dingin"
      };
    case 15: // Al-Hijr (Lembah Batu)
      return {
        icon: Building,
        bgPattern: "from-amber-700/10 to-transparent",
        symbolName: "Lembah Batu Ukir"
      };
    case 16: // An-Nahl (Lebah)
      return {
        icon: Hexagon,
        watermarkSvg: BeeWatermark,
        bgPattern: "from-amber-500/15 to-transparent",
        symbolName: "Sarang Lebah & Madu"
      };
    case 17: // Al-Isra' (Perjalanan Malam)
      return {
        icon: Moon,
        bgPattern: "from-indigo-600/10 to-transparent",
        symbolName: "Perjalanan Malam"
      };
    case 18: // Al-Kahf (Gua)
      return {
        icon: Lamp,
        watermarkSvg: CaveWatermark,
        bgPattern: "from-amber-600/10 to-transparent",
        symbolName: "Gua Pemuda & Pelita"
      };
    case 19: // Maryam (Siti Maryam)
      return {
        icon: Flower2,
        bgPattern: "from-rose-400/10 to-transparent",
        symbolName: "Siti Maryam & Kurma"
      };
    case 20: // Taha (Taha)
      return {
        icon: Compass,
        bgPattern: "from-emerald-600/10 to-transparent",
        symbolName: "Petunjuk Yang Lurus"
      };
    case 21: // Al-Anbiya' (Para Nabi)
      return {
        icon: Scroll,
        bgPattern: "from-teal-600/10 to-transparent",
        symbolName: "Para Nabi Allah"
      };
    case 22: // Al-Hajj (Haji)
      return {
        icon: MapPin,
        bgPattern: "from-emerald-700/10 to-transparent",
        symbolName: "Baitullah Makkah"
      };
    case 23: // Al-Mu'minun (Orang Beriman)
      return {
        icon: ShieldCheck,
        bgPattern: "from-emerald-600/10 to-transparent",
        symbolName: "Orang Beriman Khusyuk"
      };
    case 24: // An-Nur (Cahaya)
      return {
        icon: Lightbulb,
        bgPattern: "from-amber-400/15 to-transparent",
        symbolName: "Cahaya Langit & Bumi"
      };
    case 25: // Al-Furqan (Pembeda)
      return {
        icon: Scale,
        bgPattern: "from-sky-600/10 to-transparent",
        symbolName: "Pembeda Haq & Batil"
      };
    case 26: // Asy-Syu'ara' (Para Penyair)
      return {
        icon: PenTool,
        bgPattern: "from-indigo-500/10 to-transparent",
        symbolName: "Pena Para Penyair"
      };
    case 27: // An-Naml (Semut)
      return {
        icon: GitMerge,
        bgPattern: "from-amber-600/10 to-transparent",
        symbolName: "Lembah Semut"
      };
    case 28: // Al-Qasas (Kisah-Kisah)
      return {
        icon: BookMarked,
        bgPattern: "from-stone-600/10 to-transparent",
        symbolName: "Kisah Nabi Musa"
      };
    case 29: // Al-'Ankabut (Laba-Laba)
      return {
        icon: Network,
        watermarkSvg: SpiderWebWatermark,
        bgPattern: "from-teal-600/10 to-transparent",
        symbolName: "Sarang Laba-Laba"
      };
    case 30: // Ar-Rum (Bangsa Romawi)
      return {
        icon: Castle,
        bgPattern: "from-purple-600/10 to-transparent",
        symbolName: "Bangsa Romawi"
      };
    case 31: // Luqman (Luqman)
      return {
        icon: GraduationCap,
        bgPattern: "from-emerald-600/10 to-transparent",
        symbolName: "Nasihat Luqman Al-Hakim"
      };
    case 32: // As-Sajdah (Sujud)
      return {
        icon: Sparkles,
        bgPattern: "from-emerald-700/10 to-transparent",
        symbolName: "Kemuliaan Sujud"
      };
    case 33: // Al-Ahzab (Golongan Bersekutu)
      return {
        icon: Lock,
        bgPattern: "from-slate-700/10 to-transparent",
        symbolName: "Benteng Parit Ahzab"
      };
    case 34: // Saba' (Kaum Saba')
      return {
        icon: Landmark,
        bgPattern: "from-amber-600/10 to-transparent",
        symbolName: "Negeri Saba' & Bendungan"
      };
    case 35: // Fatir (Pencipta)
      return {
        icon: Feather,
        bgPattern: "from-sky-500/10 to-transparent",
        symbolName: "Sayap Malaikat & Penciptaan"
      };
    case 36: // Yasin (Yasin)
      return {
        icon: Heart,
        bgPattern: "from-emerald-500/15 to-transparent",
        symbolName: "Jantung Al-Qur'an"
      };
    case 37: // As-Saffat (Barisan-Barisan)
      return {
        icon: Rows,
        bgPattern: "from-indigo-600/10 to-transparent",
        symbolName: "Barisan Malaikat"
      };
    case 38: // Sad (Sad)
      return {
        icon: Award,
        bgPattern: "from-amber-600/10 to-transparent",
        symbolName: "Kerajaan Nabi Sulaiman"
      };
    case 39: // Az-Zumar (Rombongan)
      return {
        icon: ArrowRight,
        bgPattern: "from-blue-600/10 to-transparent",
        symbolName: "Rombongan Surga"
      };
    case 40: // Ghafir (Maha Pengampun)
      return {
        icon: KeyRound,
        bgPattern: "from-emerald-600/10 to-transparent",
        symbolName: "Pintu Ampunan"
      };
    case 41: // Fussilat (Dijelaskan)
      return {
        icon: BookOpenCheck,
        bgPattern: "from-teal-600/10 to-transparent",
        symbolName: "Penjelasan Rinci"
      };
    case 42: // Asy-Syura (Musyawarah)
      return {
        icon: Handshake,
        bgPattern: "from-sky-600/10 to-transparent",
        symbolName: "Musyawarah Mufakat"
      };
    case 43: // Az-Zukhruf (Perhiasan)
      return {
        icon: Gem,
        bgPattern: "from-amber-400/15 to-transparent",
        symbolName: "Perhiasan Emas"
      };
    case 44: // Ad-Dukhan (Kabut)
      return {
        icon: CloudFog,
        bgPattern: "from-slate-600/10 to-transparent",
        symbolName: "Kabut Asap"
      };
    case 45: // Al-Jasiyah (Berlutut)
      return {
        icon: ArrowDownCircle,
        bgPattern: "from-indigo-600/10 to-transparent",
        symbolName: "Berlutut Ketundukan"
      };
    case 46: // Al-Ahqaf (Bukit Pasir)
      return {
        icon: Mountain,
        bgPattern: "from-amber-700/10 to-transparent",
        symbolName: "Bukit-Bukit Pasir Kaum 'Ad"
      };
    case 47: // Muhammad (Nabi Muhammad SAW)
      return {
        icon: Sparkles,
        bgPattern: "from-emerald-600/15 to-transparent",
        symbolName: "Rasulullah Muhammad SAW"
      };
    case 48: // Al-Fath (Kemenangan)
      return {
        icon: Flag,
        bgPattern: "from-emerald-500/10 to-transparent",
        symbolName: "Kemenangan Nyata"
      };
    case 49: // Al-Hujurat (Kamar-Kamar)
      return {
        icon: Home,
        bgPattern: "from-stone-600/10 to-transparent",
        symbolName: "Kamar-Kamar Kerukunan"
      };
    case 50: // Qaf (Qaf)
      return {
        icon: Mountain,
        bgPattern: "from-slate-700/10 to-transparent",
        symbolName: "Gunung Kosmik Qaf"
      };
    case 51: // Az-Zariyat (Angin)
      return {
        icon: Wind,
        bgPattern: "from-sky-500/10 to-transparent",
        symbolName: "Angin Menerbangkan"
      };
    case 52: // At-Tur (Bukit Sinai)
      return {
        icon: Mountain,
        bgPattern: "from-amber-600/10 to-transparent",
        symbolName: "Bukit Sinai Nabi Musa"
      };
    case 53: // An-Najm (Bintang)
      return {
        icon: Star,
        bgPattern: "from-indigo-500/10 to-transparent",
        symbolName: "Bintang Jatuh & Isra"
      };
    case 54: // Al-Qamar (Bulan)
      return {
        icon: Moon,
        bgPattern: "from-cyan-500/10 to-transparent",
        symbolName: "Terbelahnya Bulan"
      };
    case 55: // Ar-Rahman (Yang Maha Pemurah)
      return {
        icon: Sparkle,
        bgPattern: "from-emerald-500/20 via-teal-500/10 to-transparent",
        symbolName: "Nikmat Syurga & Mutiara"
      };
    case 56: // Al-Waqi'ah (Hari Kiamat)
      return {
        icon: Hourglass,
        bgPattern: "from-amber-600/10 to-transparent",
        symbolName: "Hari Kiamat Nyata"
      };
    case 57: // Al-Hadid (Besi)
      return {
        icon: Anvil,
        bgPattern: "from-slate-600/15 to-transparent",
        symbolName: "Kekuatan Besi"
      };
    case 58: // Al-Mujadilah (Gugatan)
      return {
        icon: MessageSquare,
        bgPattern: "from-teal-600/10 to-transparent",
        symbolName: "Gugatan Wanita"
      };
    case 59: // Al-Hasyr (Pengusiran)
      return {
        icon: Compass,
        bgPattern: "from-stone-600/10 to-transparent",
        symbolName: "Pengusiran & Kebijakan"
      };
    case 60: // Al-Mumtahanah (Ujian)
      return {
        icon: ShieldCheck,
        bgPattern: "from-indigo-600/10 to-transparent",
        symbolName: "Wanita Yang Diuji"
      };
    case 61: // As-Saff (Barisan)
      return {
        icon: AlignJustify,
        bgPattern: "from-blue-600/10 to-transparent",
        symbolName: "Barisan Kokoh"
      };
    case 62: // Al-Jumu'ah (Hari Jumat)
      return {
        icon: Calendar,
        bgPattern: "from-emerald-600/10 to-transparent",
        symbolName: "Keutamaan Hari Jumat"
      };
    case 63: // Al-Munafiqun (Orang Munafik)
      return {
        icon: EyeOff,
        bgPattern: "from-slate-700/10 to-transparent",
        symbolName: "Peringatan Kemunafikan"
      };
    case 64: // At-Taghabun (Dinampakkan)
      return {
        icon: ScaleIcon,
        bgPattern: "from-amber-600/10 to-transparent",
        symbolName: "Hari Untung Rugi"
      };
    case 65: // At-Talaq (Talak)
      return {
        icon: FileText,
        bgPattern: "from-slate-600/10 to-transparent",
        symbolName: "Ketentuan Hukum"
      };
    case 66: // At-Tahrim (Mengharamkan)
      return {
        icon: Lock,
        bgPattern: "from-rose-600/10 to-transparent",
        symbolName: "Kesucian Rumah Tangga"
      };
    case 67: // Al-Mulk (Kerajaan)
      return {
        icon: Crown,
        bgPattern: "from-amber-500/15 to-transparent",
        symbolName: "Kerajaan Semesta"
      };
    case 68: // Al-Qalam (Pena)
      return {
        icon: Edit3,
        bgPattern: "from-teal-600/10 to-transparent",
        symbolName: "Pena & Tulisan"
      };
    case 69: // Al-Haqqah (Hari Kiamat)
      return {
        icon: Hourglass,
        bgPattern: "from-red-600/10 to-transparent",
        symbolName: "Kebenaran Mutlak"
      };
    case 70: // Al-Ma'arij (Tempat Naik)
      return {
        icon: TrendingUp,
        bgPattern: "from-indigo-600/10 to-transparent",
        symbolName: "Tangga Ke Langit"
      };
    case 71: // Nuh (Nabi Nuh)
      return {
        icon: Ship,
        bgPattern: "from-cyan-600/10 to-transparent",
        symbolName: "Bahtera Nabi Nuh"
      };
    case 72: // Al-Jinn (Jin)
      return {
        icon: Eye,
        bgPattern: "from-purple-600/10 to-transparent",
        symbolName: "Alam Jin"
      };
    case 73: // Al-Muzzammil (Berselimut)
      return {
        icon: Shirt,
        bgPattern: "from-emerald-600/10 to-transparent",
        symbolName: "Shalat Malam Berselimut"
      };
    case 74: // Al-Muddassir (Berkemul)
      return {
        icon: Sunrise,
        bgPattern: "from-amber-500/10 to-transparent",
        symbolName: "Bangkit Memberi Peringatan"
      };
    case 75: // Al-Qiyamah (Hari Kiamat)
      return {
        icon: Clock,
        bgPattern: "from-slate-700/10 to-transparent",
        symbolName: "Kebangkitan Manusia"
      };
    case 76: // Al-Insan (Manusia)
      return {
        icon: User,
        bgPattern: "from-teal-600/10 to-transparent",
        symbolName: "Penciptaan Manusia"
      };
    case 77: // Al-Mursalat (Malaikat Diutus)
      return {
        icon: Feather,
        bgPattern: "from-sky-600/10 to-transparent",
        symbolName: "Angin & Utusan"
      };
    case 78: // An-Naba' (Berita Besar)
      return {
        icon: Newspaper,
        bgPattern: "from-emerald-500/10 to-transparent",
        symbolName: "Berita Hari Kebangkitan"
      };
    case 79: // An-Nazi'at (Mencabut)
      return {
        icon: Sparkles,
        bgPattern: "from-indigo-600/10 to-transparent",
        symbolName: "Malaikat Pencabut Roh"
      };
    case 80: // 'Abasa (Bermuka Masam)
      return {
        icon: Eye,
        bgPattern: "from-stone-600/10 to-transparent",
        symbolName: "Pelajaran Akhlak"
      };
    case 81: // At-Takwir (Menggulung)
      return {
        icon: Sun,
        bgPattern: "from-amber-600/10 to-transparent",
        symbolName: "Matahari Digulung"
      };
    case 82: // Al-Infitar (Terbelah)
      return {
        icon: Split,
        bgPattern: "from-cyan-600/10 to-transparent",
        symbolName: "Langit Terbelah"
      };
    case 83: // Al-Mutaffifin (Curang)
      return {
        icon: Gauge,
        bgPattern: "from-slate-600/10 to-transparent",
        symbolName: "Timbangan Jujur"
      };
    case 84: // Al-Insyiqaq (Terbelah)
      return {
        icon: CircleDot,
        bgPattern: "from-indigo-600/10 to-transparent",
        symbolName: "Langit Patuh"
      };
    case 85: // Al-Buruj (Gugusan Bintang)
      return {
        icon: Star,
        bgPattern: "from-purple-600/10 to-transparent",
        symbolName: "Gugusan Bintang Galaksi"
      };
    case 86: // At-Tariq (Bintang Malam)
      return {
        icon: Moon,
        bgPattern: "from-indigo-500/10 to-transparent",
        symbolName: "Bintang Malam Cemerlang"
      };
    case 87: // Al-A'la (Maha Tinggi)
      return {
        icon: Crown,
        bgPattern: "from-emerald-500/10 to-transparent",
        symbolName: "Nama Allah Yang Maha Tinggi"
      };
    case 88: // Al-Ghasyiyah (Hari Pembalasan)
      return {
        icon: Flame,
        bgPattern: "from-red-600/10 to-transparent",
        symbolName: "Hari Pembalasan"
      };
    case 89: // Al-Fajr (Fajar)
      return {
        icon: Sunrise,
        bgPattern: "from-amber-400/15 to-transparent",
        symbolName: "Fajar Waktu Subuh"
      };
    case 90: // Al-Balad (Negeri)
      return {
        icon: Building2,
        bgPattern: "from-stone-600/10 to-transparent",
        symbolName: "Kota Suci Makkah"
      };
    case 91: // Asy-Syams (Matahari)
      return {
        icon: Sun,
        watermarkSvg: SunburstWatermark,
        bgPattern: "from-amber-500/15 to-transparent",
        symbolName: "Matahari Terang"
      };
    case 92: // Al-Lail (Malam)
      return {
        icon: Moon,
        bgPattern: "from-indigo-700/15 to-transparent",
        symbolName: "Malam Gelap"
      };
    case 93: // Ad-Duha (Waktu Dhuha)
      return {
        icon: SunMedium,
        bgPattern: "from-amber-400/15 to-transparent",
        symbolName: "Cahaya Pagi Dhuha"
      };
    case 94: // Asy-Syarh (Kelapangan)
      return {
        icon: Smile,
        bgPattern: "from-emerald-500/10 to-transparent",
        symbolName: "Kelapangan Dada"
      };
    case 95: // At-Tin (Buah Tin)
      return {
        icon: Leaf,
        bgPattern: "from-emerald-600/10 to-transparent",
        symbolName: "Buah Tin & Zaitun"
      };
    case 96: // Al-'Alaq (Segumpal Darah)
      return {
        icon: BookOpen,
        bgPattern: "from-teal-600/10 to-transparent",
        symbolName: "Bacalah! (Iqra')"
      };
    case 97: // Al-Qadr (Kemuliaan)
      return {
        icon: Sparkles,
        bgPattern: "from-emerald-500/20 via-teal-500/10 to-transparent",
        symbolName: "Malam Lailatul Qadr"
      };
    case 98: // Al-Bayyinah (Bukti Nyata)
      return {
        icon: CheckCircle,
        bgPattern: "from-emerald-600/10 to-transparent",
        symbolName: "Bukti Kebenaran"
      };
    case 99: // Az-Zalzalah (Kegoncangan)
      return {
        icon: Activity,
        bgPattern: "from-amber-600/10 to-transparent",
        symbolName: "Goncangan Dahsyat"
      };
    case 100: // Al-'Adiyat (Kuda Perang)
      return {
        icon: Zap,
        bgPattern: "from-orange-600/10 to-transparent",
        symbolName: "Kuda Perang Berlari"
      };
    case 101: // Al-Qari'ah (Hari Kiamat)
      return {
        icon: AlertTriangle,
        bgPattern: "from-red-600/10 to-transparent",
        symbolName: "Ketukan Dahsyat"
      };
    case 102: // At-Takasur (Bermewah-Mewahan)
      return {
        icon: Coins,
        bgPattern: "from-amber-600/10 to-transparent",
        symbolName: "Megah & Berharta"
      };
    case 103: // Al-'Asr (Demi Masa)
      return {
        icon: Clock,
        bgPattern: "from-slate-600/10 to-transparent",
        symbolName: "Waktu & Kerugian Manusia"
      };
    case 104: // Al-Humazah (Pengumpat)
      return {
        icon: MessageSquare,
        bgPattern: "from-red-600/10 to-transparent",
        symbolName: "Bahaya Pengumpat"
      };
    case 105: // Al-Fil (Gajah)
      return {
        icon: Shield,
        watermarkSvg: ElephantWatermark,
        bgPattern: "from-slate-700/15 to-transparent",
        symbolName: "Pasukan Gajah Abrahah"
      };
    case 106: // Quraisy (Suku Quraisy)
      return {
        icon: Truck,
        bgPattern: "from-amber-600/10 to-transparent",
        symbolName: "Kafilah Dagang Quraisy"
      };
    case 107: // Al-Ma'un (Barang Berguna)
      return {
        icon: HeartHandshake,
        bgPattern: "from-emerald-600/10 to-transparent",
        symbolName: "Pertolongan & Anak Yatim"
      };
    case 108: // Al-Kausar (Nikmat Berlimpah)
      return {
        icon: Gift,
        bgPattern: "from-emerald-500/15 to-transparent",
        symbolName: "Telaga Al-Kausar"
      };
    case 109: // Al-Kafirun (Orang Kafir)
      return {
        icon: ShieldX,
        bgPattern: "from-slate-700/10 to-transparent",
        symbolName: "Batas Teguh Toleransi"
      };
    case 110: // An-Nasr (Pertolongan)
      return {
        icon: Trophy,
        bgPattern: "from-emerald-500/10 to-transparent",
        symbolName: "Pertolongan Allah"
      };
    case 111: // Al-Lahab (Gejolak Api)
      return {
        icon: Flame,
        bgPattern: "from-red-600/15 to-transparent",
        symbolName: "Gejolak Api"
      };
    case 112: // Al-Ikhlas (Ikhlas & Tauhid)
      return {
        icon: Gem,
        bgPattern: "from-emerald-500/15 to-transparent",
        symbolName: "Kemurnian Tauhid"
      };
    case 113: // Al-Falaq (Subuh)
      return {
        icon: Sunrise,
        bgPattern: "from-teal-600/10 to-transparent",
        symbolName: "Perlindungan Waktu Subuh"
      };
    case 114: // An-Nas (Manusia)
      return {
        icon: ShieldCheck,
        bgPattern: "from-indigo-600/10 to-transparent",
        symbolName: "Perlindungan Umat Manusia"
      };
    default:
      return {
        icon: BookOpen,
        bgPattern: "from-emerald-500/10 to-transparent",
        symbolName: "Ayat Suci Al-Qur'an"
      };
  }
};
