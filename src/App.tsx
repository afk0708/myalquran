import React, { useState, useEffect, useRef } from "react";
import { 
  Book, 
  BookOpen,
  Search, 
  Bookmark, 
  History, 
  Moon, 
  Sun, 
  Download,
  ChevronRight, 
  ArrowLeft, 
  Sparkles, 
  Copy, 
  Share2, 
  BookmarkCheck, 
  BookmarkPlus, 
  Menu, 
  X, 
  Settings, 
  Type as FontIcon, 
  Check, 
  Maximize2, 
  Minimize2, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Mail,
  Send,
  Inbox,
  RefreshCw,
  LogOut,
  FileText,
  CheckCircle,
  ChevronDown,
  User,
  Compass,
  Headphones,
  Palette,
  Heart,
  Globe,
  GripVertical
} from "lucide-react";
import { Surah, SurahDetail, Verse, Bookmark as BookmarkType, LastRead } from "./types";
import AIAssistant from "./components/AIAssistant";
import PrayerTimes from "./components/PrayerTimes";
import AudioPlayer from "./components/AudioPlayer";
import PrayerGuideView from "./components/PrayerGuideView";
import DoaHaditsView from "./components/DoaHaditsView";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  googleSignIn, 
  logout, 
  initAuth, 
  listEmails, 
  sendGmailEmail, 
  GmailMessage 
} from "./lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
import { getSurahArtwork } from "./data/surahArtworks";
import { triggerHaptic } from "./utils/haptics";
import { TajweedArabic } from "./components/TajweedArabic";
import { TajweedLegendBar } from "./components/TajweedLegendBar";
import { TajweedGuideModal } from "./components/TajweedGuideModal";
import { TajweedRuleType } from "./utils/tajweed";

import quranHoldingHand from "./assets/images/quran_holding_hand_1783987733674.jpg";
import islamicHeroBg from "./assets/images/islamic_hero_bg_1782880239688.jpg";
import quranTasbihBg from "./assets/images/quran_tasbih_bg_1784075735757.jpg";

// Popular Surahs quick access
const POPULAR_SURAHS = [
  { nomor: 18, namaLatin: "Al-Kahfi", arti: "Goa" },
  { nomor: 36, namaLatin: "Yasin", arti: "Ya Sin" },
  { nomor: 55, namaLatin: "Ar-Rahman", arti: "Maha Pemurah" },
  { nomor: 56, namaLatin: "Al-Waqi'ah", arti: "Hari Kiamat" },
  { nomor: 67, namaLatin: "Al-Mulk", arti: "Kerajaan" }
];

// Helper to get elegant, calm, diverse card backgrounds from a unified palette or category theme
const getSurahCardBg = (
  surah: number | { nomor: number; tempatTurun?: string; jumlahAyat?: number },
  themeMode: string = "mixed"
) => {
  const nomor = typeof surah === "number" ? surah : surah.nomor;
  const tempatTurun = typeof surah === "object" && surah.tempatTurun ? surah.tempatTurun : "";
  const jumlahAyat = typeof surah === "object" && surah.jumlahAyat ? surah.jumlahAyat : 0;

  const presets = [
    // 0: Soft Mint / Emerald Sage
    {
      id: "emerald",
      name: "Emerald Sage",
      card: "bg-emerald-50/45 hover:bg-emerald-50/75 border-emerald-100/50 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20 dark:border-emerald-900/30 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 shadow-emerald-950/5",
      num: "bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/30 dark:border-emerald-800/40",
      badge: "bg-emerald-100/60 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400",
      arabic: "text-emerald-800 dark:text-emerald-400"
    },
    // 1: Serene Teal
    {
      id: "teal",
      name: "Serene Teal",
      card: "bg-teal-50/45 hover:bg-teal-50/75 border-teal-100/50 dark:bg-teal-950/10 dark:hover:bg-teal-950/20 dark:border-teal-900/30 hover:border-teal-500/30 dark:hover:border-teal-500/30 shadow-teal-950/5",
      num: "bg-teal-100/70 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 border border-teal-200/30 dark:border-teal-800/40",
      badge: "bg-teal-100/60 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400",
      arabic: "text-teal-800 dark:text-teal-400"
    },
    // 2: Warm Amber (Desert Gold)
    {
      id: "amber",
      name: "Warm Amber",
      card: "bg-amber-50/30 hover:bg-amber-50/65 border-amber-100/40 dark:bg-amber-950/5 dark:hover:bg-amber-950/15 dark:border-amber-950/30 hover:border-amber-500/30 dark:hover:border-amber-500/30 shadow-amber-950/5",
      num: "bg-amber-100/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-350 border border-amber-200/30 dark:border-amber-900/30",
      badge: "bg-amber-100/50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400",
      arabic: "text-amber-800 dark:text-amber-400"
    },
    // 3: Calm Slate
    {
      id: "slate",
      name: "Calm Slate",
      card: "bg-stone-50/55 hover:bg-stone-100/75 border-stone-200/60 dark:bg-slate-900/40 dark:hover:bg-slate-900/65 dark:border-slate-800/60 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 shadow-slate-950/5",
      num: "bg-stone-150/85 dark:bg-slate-800/80 text-stone-700 dark:text-slate-300 border border-stone-250 dark:border-slate-700",
      badge: "bg-stone-150/70 dark:bg-slate-800 text-stone-600 dark:text-slate-400",
      arabic: "text-emerald-850 dark:text-emerald-400"
    },
    // 4: Celestial Sky
    {
      id: "sky",
      name: "Celestial Sky",
      card: "bg-sky-50/45 hover:bg-sky-50/75 border-sky-100/50 dark:bg-sky-950/10 dark:hover:bg-sky-950/20 dark:border-sky-900/30 hover:border-sky-500/30 dark:hover:border-sky-500/30 shadow-sky-950/5",
      num: "bg-sky-100/70 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 border border-sky-200/30 dark:border-sky-800/40",
      badge: "bg-sky-100/60 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400",
      arabic: "text-sky-800 dark:text-sky-400"
    },
    // 5: Royal Indigo
    {
      id: "indigo",
      name: "Royal Indigo",
      card: "bg-indigo-50/35 hover:bg-indigo-50/65 border-indigo-100/40 dark:bg-indigo-950/5 dark:hover:bg-indigo-950/15 dark:border-indigo-900/20 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 shadow-indigo-950/5",
      num: "bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200/20 dark:border-indigo-850",
      badge: "bg-indigo-100/50 dark:bg-indigo-950/55 text-indigo-700 dark:text-indigo-400",
      arabic: "text-indigo-800 dark:text-indigo-450"
    }
  ];

  if (themeMode === "category-location") {
    const t = tempatTurun.toLowerCase();
    if (t.includes("mekah") || t.includes("makkah")) {
      return presets[2]; // Warm Amber for Makkiyah (Diturunkan di Makkah)
    }
    return presets[0]; // Emerald Sage for Madaniyah (Diturunkan di Madinah)
  }

  if (themeMode === "category-length") {
    if (jumlahAyat >= 100) return presets[5]; // Indigo (Surat Sangat Panjang >= 100 ayat)
    if (jumlahAyat >= 40) return presets[1]; // Teal (Surat Panjang 40-99 ayat)
    if (jumlahAyat >= 20) return presets[4]; // Sky (Surat Sedang 20-39 ayat)
    return presets[2]; // Amber (Surat Pendek < 20 ayat)
  }

  // Single Favorite Palette mode
  if (themeMode === "emerald") return presets[0];
  if (themeMode === "teal") return presets[1];
  if (themeMode === "amber") return presets[2];
  if (themeMode === "slate") return presets[3];
  if (themeMode === "sky") return presets[4];
  if (themeMode === "indigo") return presets[5];

  // Default "mixed" (Pelangi Sejuk Variatif)
  return presets[nomor % presets.length];
};

export default function App() {
  // Parallax Scroll Effect for Header Video
  const { scrollY } = useScroll();
  const headerVideoY = useTransform(scrollY, [0, 600], [0, 50]);

  // Navigation & View States
  const [view, setView] = useState<"home" | "surah" | "bookmark" | "search" | "prayer-guide" | "doa-hadits">("home");
  const [activeSurahNumber, setActiveSurahNumber] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  // Data States
  const [surahList, setSurahList] = useState<Surah[]>([]);
  const [activeSurah, setActiveSurah] = useState<SurahDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [surahError, setSurahError] = useState<string | null>(null);

  // Language Preference State
  const [lang, setLang] = useState<"id" | "en">(() => {
    return (localStorage.getItem("app_lang") as "id" | "en") || "id";
  });

  // Settings & Customization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [highlightTajweed, setHighlightTajweed] = useState<boolean>(() => {
    const saved = localStorage.getItem("quran_tajweed_highlight");
    return saved !== null ? saved === "true" : true;
  });
  const [showTajweedModal, setShowTajweedModal] = useState(false);
  const [activeTajweedModalRule, setActiveTajweedModalRule] = useState<TajweedRuleType | null>(null);
  const [fontSizeArabic, setFontSizeArabic] = useState<"lg" | "xl" | "2xl" | "3xl">("2xl");
  const [fontSizeTranslation, setFontSizeTranslation] = useState<"sm" | "base" | "lg">("base");
  const [cardThemeMode, setCardThemeMode] = useState<string>(() => {
    return localStorage.getItem("quran_card_theme") || "mixed";
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Personalization States
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>(() => {
    const saved = localStorage.getItem("quran_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });
  const [lastRead, setLastRead] = useState<LastRead | null>(() => {
    const saved = localStorage.getItem("quran_last_read");
    return saved ? JSON.parse(saved) : null;
  });

  // Track click history & reading frequency per Surah
  const [clickHistory, setClickHistory] = useState<Record<number, {
    surahNumber: number;
    surahName: string;
    count: number;
    lastClicked: string;
    jumlahAyat: number;
    tempatTurun: string;
    namaArab: string;
  }>>(() => {
    const saved = localStorage.getItem("quran_click_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse click history", e);
      }
    }
    return {};
  });

  const [historySortBy, setHistorySortBy] = useState<"recent" | "frequency">("frequency");

  const trackSurahClick = (nomor: number) => {
    setClickHistory((prev) => {
      const surah = surahList.find((s) => s.nomor === nomor) || 
                    POPULAR_SURAHS.find((s) => s.nomor === nomor);
      
      const surahName = surah ? surah.namaLatin : `Surat ke-${nomor}`;
      const jumlahAyat = (surah && "jumlahAyat" in surah) ? (surah as any).jumlahAyat : 0;
      const tempatTurun = (surah && "tempatTurun" in surah) ? (surah as any).tempatTurun : "";
      const namaArab = surah ? surah.nama : "";

      const existing = prev[nomor] || {
        surahNumber: nomor,
        surahName: surahName,
        count: 0,
        jumlahAyat: jumlahAyat,
        tempatTurun: tempatTurun,
        namaArab: namaArab,
      };

      const updated = {
        ...prev,
        [nomor]: {
          ...existing,
          count: existing.count + 1,
          lastClicked: new Date().toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      };

      localStorage.setItem("quran_click_history", JSON.stringify(updated));
      return updated;
    });
  };

  // AI Assistant Drawer States
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiContext, setAIContext] = useState<{
    surahNumber: number;
    surahName: string;
    verseNumber: number;
    verse: Verse;
  } | null>(null);

  // Success Notification / Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Header Background Video Fallback State for Mobile HP
  const [headerVideoFailed, setHeaderVideoFailed] = useState(false);

  // Offline Surah Caching States & Helpers
  const [cachedSurahNumbers, setCachedSurahNumbers] = useState<number[]>([]);
  const [onlyShowOffline, setOnlyShowOffline] = useState(false);
  const [cachingSurahNum, setCachingSurahNum] = useState<number | null>(null);

  const refreshCachedSurahs = () => {
    const cached: number[] = [];
    try {
      for (let i = 1; i <= 114; i++) {
        const item = localStorage.getItem(`quran_surah_cache_${i}`);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            if (parsed && parsed.data && parsed.data.nomor) {
              cached.push(i);
            }
          } catch (e) {
            // ignore invalid cache item
          }
        }
      }
    } catch (e) {
      console.error("Error checking local surah cache", e);
    }
    setCachedSurahNumbers(cached);
  };

  useEffect(() => {
    refreshCachedSurahs();
  }, []);

  const handleCacheSurah = async (nomor: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCachingSurahNum(nomor);
    try {
      const cacheKey = `quran_surah_cache_${nomor}`;
      let surahData: any = null;
      
      try {
        const response = await fetch(`/api/quran/surat/${nomor}`);
        if (response.ok) {
          const resData = await response.json();
          if (resData.success && resData.data) {
            surahData = resData.data;
          }
        }
      } catch (err) {
        // Fallback below
      }

      if (!surahData) {
        // Direct public API fallback (e.g. GitHub Pages / Static Hosting)
        const fallbackRes = await fetch(`https://equran.id/api/v2/surat/${nomor}`);
        const fallbackJson = await fallbackRes.json();
        if (fallbackJson && fallbackJson.code === 200 && fallbackJson.data) {
          surahData = fallbackJson.data;
        }
      }

      if (surahData) {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: surahData,
          timestamp: Date.now()
        }));
        refreshCachedSurahs();
        const surahName = surahData.namaLatin || `Surat ke-${nomor}`;
        triggerHaptic("success");
        triggerToast(lang === "id"
          ? `Alhamdulillah! QS. ${surahName} tersimpan untuk dibaca luring (offline).`
          : `QS. ${surahName} saved for offline reading.`
        );
      } else {
        triggerToast(lang === "id" ? "Gagal menyimpan surat secara luring." : "Failed to cache surah.");
      }
    } catch (err) {
      console.error(err);
      triggerToast(lang === "id" ? "Koneksi gagal saat mengunduh surat." : "Network error downloading surah.");
    } finally {
      setCachingSurahNum(null);
    }
  };

  const handleRemoveSurahCache = (nomor: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      localStorage.removeItem(`quran_surah_cache_${nomor}`);
      refreshCachedSurahs();
      triggerHaptic("light");
      triggerToast(lang === "id"
        ? `Surat ke-${nomor} dihapus dari penyimpanan luring.`
        : `Surah #${nomor} removed from offline cache.`
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Auto Scroll Engine (Lyric Style)
  const [isAutoScrollPlay, setIsAutoScrollPlay] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<number>(24); // speed in characters per second
  const [activeScrollVerse, setActiveScrollVerse] = useState<number | null>(null);
  const [verseProgress, setVerseProgress] = useState(0);
  const [isAutoScrollMinimized, setIsAutoScrollMinimized] = useState(false);

  // Real Audio Recitation Player States
  const [audioVerseNumber, setAudioVerseNumber] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedQari, setSelectedQari] = useState(() => {
    return localStorage.getItem("quran_selected_qari") || "05"; // Default Sheikh Misyari Rasyid Al-Afasi
  });
  const [audioProgress, setAudioProgress] = useState(0);
  const [isContinuousPlay, setIsContinuousPlay] = useState(() => {
    return localStorage.getItem("quran_audio_continuous") !== "false"; // Default true
  });
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioVolume, setAudioVolume] = useState(() => {
    const saved = localStorage.getItem("quran_audio_volume");
    return saved !== null ? parseFloat(saved) : 0.8;
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Gmail & Firebase Auth States
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [gmailEmails, setGmailEmails] = useState<GmailMessage[]>([]);
  const [gmailSearchQuery, setGmailSearchQuery] = useState("");
  const [isGmailLoading, setIsGmailLoading] = useState(false);
  const [isGmailDashboardOpen, setIsGmailDashboardOpen] = useState(false);
  
  // Gmail Share Verse Modal
  const [isGmailShareOpen, setIsGmailShareOpen] = useState(false);
  const [shareVerseTarget, setShareVerseTarget] = useState<{ verse: Verse; surahName: string; surahNumber: number } | null>(null);
  
  // Gmail Share History Modal
  const [isGmailShareHistoryOpen, setIsGmailShareHistoryOpen] = useState(false);

  // Compose Email States
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isPrayerTimesOpen, setIsPrayerTimesOpen] = useState(false);
  const [showFeaturesMenu, setShowFeaturesMenu] = useState(false);
  const [lastUsedService, setLastUsedService] = useState<"ai" | "prayer" | "prayer-guide" | "doa-hadits" | null>(() => {
    return (localStorage.getItem("last_used_islamic_service") as any) || "ai";
  });
  const [menuRipples, setMenuRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleFeaturesMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    setMenuRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setMenuRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
    setShowFeaturesMenu((prev) => !prev);
  };
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // PWA Installation state & event listener
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if app is already running in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallBtn(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try {
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] User response to installation prompt: ${outcome}`);
    } catch (err) {
      console.error("[PWA] Install prompt failed:", err);
    }
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  // Load Gmail Inbox
  const loadGmailInbox = async (token: string, query?: string) => {
    setIsGmailLoading(true);
    try {
      const list = await listEmails(token, query);
      setGmailEmails(list);
    } catch (err) {
      console.error("Error loading Gmail messages:", err);
      triggerToast("Gagal memuat pesan Gmail.");
    } finally {
      setIsGmailLoading(false);
    }
  };

  // Google Sign In handler
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        triggerToast(`Ahlan wa sahlan, ${res.user.displayName}! Gmail terhubung.`);
        loadGmailInbox(res.accessToken);
      }
    } catch (err: any) {
      console.error("Google login failed:", err);
      const errorCode = err?.code || "";
      const errorMessage = err?.message || "";
      
      if (errorCode === "auth/popup-closed-by-user" || errorMessage.includes("popup-closed-by-user")) {
        triggerToast("Jendela login ditutup sebelum selesai. Pastikan browser mengizinkan popup, atau coba buka aplikasi di tab baru.");
      } else if (errorCode === "auth/cancelled-popup-request" || errorMessage.includes("cancelled-popup-request")) {
        triggerToast("Login dibatalkan karena ada proses login aktif. Silakan coba lagi setelah beberapa saat.");
      } else if (errorCode === "auth/popup-blocked" || errorMessage.includes("popup-blocked")) {
        triggerToast("Popup login diblokir browser. Izinkan popup di pengaturan browser Anda, atau coba buka di tab baru.");
      } else {
        triggerToast("Gagal menghubungkan akun Google. Silakan coba lagi atau buka di tab baru jika masih terkendala.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout handler
  const handleGoogleLogout = async () => {
    if (confirm("Apakah Sahabat ingin memutuskan hubungan akun Google & Gmail?")) {
      try {
        await logout();
        setUser(null);
        setAccessToken(null);
        setGmailEmails([]);
        setIsGmailDashboardOpen(false);
        setIsGmailShareOpen(false);
        setIsGmailShareHistoryOpen(false);
        setShowUserDropdown(false);
        triggerToast("Akun Google berhasil diputuskan.");
      } catch (err) {
        console.error("Logout error:", err);
      }
    }
  };

  // Open Gmail share modal for a verse
  const handleOpenGmailShare = (verse: Verse) => {
    if (!activeSurah) return;
    
    setShareVerseTarget({
      verse,
      surahName: activeSurah.namaLatin,
      surahNumber: activeSurah.nomor,
    });

    setEmailSubject(`Kutipan Al-Qur'an: QS. ${activeSurah.namaLatin} [${activeSurah.nomor}:${verse.nomorAyat}]`);
    setEmailBody(`
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="background-color: #ecfdf5; color: #047857; font-size: 11px; font-weight: bold; padding: 6px 14px; border-radius: 9999px; text-transform: uppercase;">Tadarus Al-Qur'an Digital</span>
          <h2 style="color: #065f46; font-family: Georgia, serif; margin-top: 12px; margin-bottom: 4px; font-size: 22px;">QS. ${activeSurah.namaLatin} Ayat ${verse.nomorAyat}</h2>
          <p style="color: #6b7280; font-size: 12px; margin: 0;">Arti Surat: ${activeSurah.arti}</p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
        
        <div style="direction: rtl; font-size: 28px; line-height: 2.0; text-align: right; font-family: 'Amiri', 'Traditional Arabic', Georgia, serif; margin-bottom: 20px; color: #0f172a; padding: 15px 0;">
          ${verse.teksArab}
        </div>
        
        <div style="font-style: italic; color: #4b5563; font-size: 14px; margin-bottom: 12px; line-height: 1.6; padding: 12px; border-left: 3px solid #10b981; background-color: #f9fafb;">
          <strong>Transliterasi:</strong><br/>
          ${verse.teksLatin}
        </div>
        
        <div style="color: #1f2937; font-size: 14px; line-height: 1.6; margin-bottom: 25px; background-color: #f0fdf4; padding: 12px; border-radius: 8px;">
          <strong>Terjemahan Bahasa Indonesia:</strong><br/>
          "${verse.teksIndonesia}"
        </div>
        
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
        
        <div style="text-align: center; font-size: 11px; color: #9ca3af; line-height: 1.5;">
          Semoga ayat ini membawa keberkahan dan ketenangan hati bagi kita semua. Amin.<br/>
          <span style="font-size: 10px; color: #d1d5db; margin-top: 8px; display: block;">Dikirim melalui integrasi resmi Al-Qur'an Digital & Gmail API</span>
        </div>
      </div>
    `);

    // Default recipient is empty to let user input
    setEmailTo("");
    setIsGmailShareOpen(true);
  };

  // Open Gmail share modal for tadarus progress history
  const handleOpenGmailShareHistory = () => {
    setEmailSubject("Laporan Riwayat Tadarus Al-Qur'an Digital Saya");
    
    const sortedHistory = (Object.values(clickHistory) as Array<{
      surahNumber: number;
      surahName: string;
      count: number;
      lastClicked: string;
      jumlahAyat: number;
      tempatTurun: string;
      namaArab: string;
    }>).sort((a, b) => b.count - a.count);

    let tableRows = "";
    sortedHistory.forEach((item, index) => {
      tableRows += `
        <tr style="border-b: 1px solid #f1f5f9;">
          <td style="padding: 12px 8px; font-weight: bold; color: #1e293b;">${index + 1}. QS. ${item.surahName} (${item.namaArab || ""})</td>
          <td style="padding: 12px 8px; text-align: center; font-weight: bold; color: #047857; background-color: #ecfdf5; border-radius: 6px;">${item.count} kali</td>
          <td style="padding: 12px 8px; color: #475569; font-size: 12px; font-family: monospace;">${item.lastClicked}</td>
        </tr>
      `;
    });

    setEmailBody(`
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <div style="text-align: center; margin-bottom: 25px;">
          <span style="background-color: #ecfdf5; color: #047857; font-size: 11px; font-weight: bold; padding: 6px 14px; border-radius: 9999px; text-transform: uppercase;">Laporan Istiqomah Tadarus</span>
          <h2 style="color: #065f46; font-family: Georgia, serif; margin-top: 12px; margin-bottom: 4px; font-size: 22px;">Riwayat Tadarus Al-Qur'an Digital</h2>
          <p style="color: #6b7280; font-size: 12px; margin: 0;">Dicatat secara berkala untuk memantau konsistensi ibadah</p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
        
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; margin-bottom: 25px;">
          <thead>
            <tr style="border-b: 2px solid #e2e8f0; color: #475569; font-weight: bold; text-transform: uppercase; font-size: 11px;">
              <th style="padding: 8px;">Surat Al-Qur'an</th>
              <th style="padding: 8px; text-align: center;">Frekuensi Dibaca</th>
              <th style="padding: 8px;">Tadarus Terakhir</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows || `<tr><td colspan="3" style="text-align: center; padding: 20px; color: #94a3b8; font-style: italic;">Belum ada riwayat tadarus tercatat.</td></tr>`}
          </tbody>
        </table>

        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
          <h4 style="color: #166534; margin: 0 0 5px 0; font-size: 14px;">🌟 Motivasi Tadarus Hari Ini</h4>
          <p style="color: #14532d; font-size: 12px; margin: 0; line-height: 1.5;">
            "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya." (HR. Bukhari)
          </p>
        </div>

        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
        
        <div style="text-align: center; font-size: 11px; color: #9ca3af; line-height: 1.5;">
          Semoga Allah melipatgandakan pahala tadarus kita dan menjadikannya syafaat kelak. Amin.<br/>
          <span style="font-size: 10px; color: #d1d5db; margin-top: 8px; display: block;">Dikirim melalui integrasi resmi Al-Qur'an Digital & Gmail API</span>
        </div>
      </div>
    `);

    setEmailTo("");
    setIsGmailShareHistoryOpen(true);
  };

  // Action function to send email via Gmail
  const handleSendGmailMessage = async () => {
    if (!accessToken) {
      triggerToast("Mohon hubungkan akun Google Sahabat terlebih dahulu.");
      return;
    }
    if (!emailTo) {
      triggerToast("Silakan masukkan email penerima.");
      return;
    }

    setIsSendingEmail(true);
    try {
      const success = await sendGmailEmail(accessToken, emailTo, emailSubject, emailBody);
      if (success) {
        triggerToast("Alhamdulillah! Email berhasil dikirim.");
        setIsGmailShareOpen(false);
        setIsGmailShareHistoryOpen(false);
      } else {
        triggerToast("Gagal mengirim email. Silakan coba lagi.");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Terjadi kesalahan saat mengirim email.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Initialize Auth State on load
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        loadGmailInbox(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handle PWA Launch Shortcuts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shortcut = params.get("shortcut");
    if (shortcut) {
      if (shortcut === "quran") {
        setView("home");
      } else if (shortcut === "ustadz") {
        setIsAIOpen(true);
      } else if (shortcut === "bookmarks") {
        setView("bookmark");
      }
      // Clean up the URL parameter gracefully
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Monitor auto scroll and advance verses
  useEffect(() => {
    if (!isAutoScrollPlay || !activeSurah || activeScrollVerse === null) return;

    const currentVerse = activeSurah.ayat.find(v => v.nomorAyat === activeScrollVerse);
    if (!currentVerse) return;

    // Calculate duration based on characters of Arabic, translation, and optional transliteration
    const charLength = currentVerse.teksArab.length + 
                       (showTransliteration ? currentVerse.teksLatin.length : 0) + 
                       currentVerse.teksIndonesia.length;

    // Base seconds calculated dynamically: longer verse = more time, speed factor adjusts this
    // Clamp between 5s minimum and 85s maximum so short/long verses are readable
    const totalSeconds = Math.max(5, Math.min(85, Math.ceil(charLength / autoScrollSpeed)));

    let elapsedMs = 0;
    const intervalMs = 100; // updates progress 10 times a second for beautiful fluid UI
    const totalMs = totalSeconds * 1000;

    // Scroll active verse into view smoothly centering it
    const element = document.getElementById(`verse-container-${activeScrollVerse}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const timer = setInterval(() => {
      elapsedMs += intervalMs;
      const pct = Math.min(100, (elapsedMs / totalMs) * 100);
      setVerseProgress(pct);

      if (elapsedMs >= totalMs) {
        clearInterval(timer);
        // Find next verse index
        const currentIndex = activeSurah.ayat.findIndex(v => v.nomorAyat === activeScrollVerse);
        if (currentIndex < activeSurah.ayat.length - 1) {
          const nextVerse = activeSurah.ayat[currentIndex + 1].nomorAyat;
          setActiveScrollVerse(nextVerse);
          setVerseProgress(0);
        } else {
          // Finished entire Surah
          setIsAutoScrollPlay(false);
          setActiveScrollVerse(null);
          setVerseProgress(0);
          triggerHaptic("success");
          triggerToast("Alhamdulillah, khatam membaca surat ini.");
        }
      }
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [isAutoScrollPlay, activeScrollVerse, autoScrollSpeed, activeSurah, showTransliteration]);

  // Real Audio Recitation Player Engine
  const stateRef = useRef({
    isContinuousPlay,
    audioVerseNumber,
    activeSurah,
    selectedQari,
  });

  useEffect(() => {
    stateRef.current = {
      isContinuousPlay,
      audioVerseNumber,
      activeSurah,
      selectedQari,
    };
  }, [isContinuousPlay, audioVerseNumber, activeSurah, selectedQari]);

  // Initialize and handle Audio instance events
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleEnded = () => {
      const { isContinuousPlay, audioVerseNumber, activeSurah } = stateRef.current;
      if (isContinuousPlay && activeSurah && audioVerseNumber !== null) {
        const currentIndex = activeSurah.ayat.findIndex(v => v.nomorAyat === audioVerseNumber);
        if (currentIndex !== -1 && currentIndex < activeSurah.ayat.length - 1) {
          const nextVerse = activeSurah.ayat[currentIndex + 1];
          setAudioVerseNumber(nextVerse.nomorAyat);
          setActiveScrollVerse(nextVerse.nomorAyat);
        } else {
          setIsPlayingAudio(false);
          setAudioVerseNumber(null);
          setAudioProgress(0);
          triggerHaptic("success");
          triggerToast("Selesai memutar surat ini.");
        }
      } else {
        setIsPlayingAudio(false);
        setAudioProgress(0);
      }
    };

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setAudioCurrentTime(audioRef.current.currentTime);
        const duration = audioRef.current.duration;
        setAudioDuration(isNaN(duration) ? 0 : duration);
        const pct = (audioRef.current.currentTime / duration) * 100;
        setAudioProgress(isNaN(pct) ? 0 : pct);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setAudioDuration(audioRef.current.duration);
      }
    };

    const handleError = () => {
      console.error("Audio playback error occurred");
      triggerToast("Gagal memutar audio rekaman.");
      setIsPlayingAudio(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);

    // Initial volume setting
    audio.volume = audioVolume;

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  // Update volume on Audio instance
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume;
    }
    localStorage.setItem("quran_audio_volume", audioVolume.toString());
  }, [audioVolume]);

  // Synchronize localStorage settings
  useEffect(() => {
    localStorage.setItem("quran_selected_qari", selectedQari);
  }, [selectedQari]);

  useEffect(() => {
    localStorage.setItem("quran_audio_continuous", isContinuousPlay ? "true" : "false");
  }, [isContinuousPlay]);

  // Load and play audio when verse or qari changes
  useEffect(() => {
    if (!activeSurah || audioVerseNumber === null) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    const verse = activeSurah.ayat.find(v => v.nomorAyat === audioVerseNumber);
    if (!verse) return;

    const audioUrl = verse.audio[selectedQari];
    if (!audioUrl) {
      triggerToast("Suara murattal Qari ini tidak tersedia untuk ayat ini.");
      setIsPlayingAudio(false);
      return;
    }

    if (audioRef.current) {
      const wasPlaying = isPlayingAudio;
      
      // Stop current and change src
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.load();

      if (wasPlaying) {
        audioRef.current.play()
          .then(() => {
            // Smoothly center the playing verse card
            const element = document.getElementById(`verse-container-${audioVerseNumber}`);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          })
          .catch(err => {
            console.error("Autoplay failed:", err);
            setIsPlayingAudio(false);
          });
      }
    }
  }, [audioVerseNumber, selectedQari, activeSurah]);

  // Whenever auto scroll starts, pause any audio recitation
  useEffect(() => {
    if (isAutoScrollPlay) {
      if (isPlayingAudio) {
        setIsPlayingAudio(false);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    }
  }, [isAutoScrollPlay, isPlayingAudio]);

  // Audio actions
  const togglePlayAudio = () => {
    triggerHaptic('light');
    if (!activeSurah) return;

    if (audioVerseNumber === null) {
      // Start from first verse or the currently active/selected scroll verse
      const startingVerse = activeScrollVerse || 1;
      setAudioVerseNumber(startingVerse);
      setActiveScrollVerse(startingVerse);
      setIsPlayingAudio(true);
      return;
    }

    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
    } else {
      if (audioRef.current) {
        // If auto scroll is playing, turn it off to prevent conflict
        setIsAutoScrollPlay(false);
        
        audioRef.current.play()
          .then(() => {
            setIsPlayingAudio(true);
            const element = document.getElementById(`verse-container-${audioVerseNumber}`);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          })
          .catch(err => {
            console.error("Manual audio play failed:", err);
            triggerToast("Gagal memutar audio.");
          });
      }
    }
  };

  const handlePlaySpecificVerse = (verseNumber: number) => {
    triggerHaptic('light');
    if (!activeSurah) return;

    // Pause mock scroll if it was running
    setIsAutoScrollPlay(false);

    if (audioVerseNumber === verseNumber) {
      togglePlayAudio();
    } else {
      setAudioVerseNumber(verseNumber);
      setActiveScrollVerse(verseNumber);
      setIsPlayingAudio(true);
    }
  };

  const handlePrevVerseAudio = () => {
    triggerHaptic('light');
    if (audioVerseNumber !== null && audioVerseNumber > 1) {
      const prevVal = audioVerseNumber - 1;
      setAudioVerseNumber(prevVal);
      setActiveScrollVerse(prevVal);
    }
  };

  const handleNextVerseAudio = () => {
    triggerHaptic('light');
    if (activeSurah && audioVerseNumber !== null && audioVerseNumber < activeSurah.ayat.length) {
      const nextVal = audioVerseNumber + 1;
      setAudioVerseNumber(nextVal);
      setActiveScrollVerse(nextVal);
    }
  };

  const handleSeekAudio = (percent: number) => {
    if (audioRef.current && audioDuration > 0) {
      const targetTime = (percent / 100) * audioDuration;
      audioRef.current.currentTime = targetTime;
      setAudioCurrentTime(targetTime);
      setAudioProgress(percent);
    }
  };

  // Fetch all surahs on load
  useEffect(() => {
    fetchSurahList();
  }, []);

  // Set dark mode HTML class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Persist bookmarks
  useEffect(() => {
    localStorage.setItem("quran_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Listen for search focus shortcuts (/ or cmd+k / ctrl+k)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus when "/" is pressed and user is not inside inputs
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Focus when Cmd+K or Ctrl+K is pressed
      if ((e.metaKey || e.ctrlKey) && e.key?.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Show Toast Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSearchChange = (query: string) => {
    setSearchFilter(query);
    if (query && view !== "home") {
      setView("home");
    }
  };

  const fetchSurahList = async () => {
    setLoadingList(true);
    setListError(null);
    try {
      // Check local storage cache first
      const cached = localStorage.getItem("quran_surah_list_cache");
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // If cache is less than 3 days old, use it
        if (Date.now() - timestamp < 1000 * 60 * 60 * 24 * 3) {
          setSurahList(data);
          setLoadingList(false);
          return;
        }
      }

      let listData: any = null;

      try {
        const response = await fetch("/api/quran/surat");
        if (response.ok) {
          const resData = await response.json();
          if (resData.success && Array.isArray(resData.data)) {
            listData = resData.data;
          }
        }
      } catch (err) {
        // Fallback to direct public API
      }

      if (!listData) {
        // Direct public equran.id API fallback (e.g. on GitHub Pages)
        const fallbackRes = await fetch("https://equran.id/api/v2/surat");
        const fallbackJson = await fallbackRes.json();
        if (fallbackJson && fallbackJson.code === 200 && Array.isArray(fallbackJson.data)) {
          listData = fallbackJson.data;
        }
      }

      if (listData) {
        setSurahList(listData);
        // Save to cache
        localStorage.setItem("quran_surah_list_cache", JSON.stringify({
          data: listData,
          timestamp: Date.now()
        }));
      } else {
        throw new Error("Gagal memproses daftar surat");
      }
    } catch (err: any) {
      console.error(err);
      setListError("Koneksi gagal atau server bermasalah. Silakan periksa koneksi internet Anda.");
    } finally {
      setLoadingList(false);
    }
  };

  const fetchSurahDetail = async (nomor: number, scrollTargetVerse?: number) => {
    setLoadingSurah(true);
    setSurahError(null);
    try {
      // Check local storage cache first
      const cacheKey = `quran_surah_cache_${nomor}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Use if less than 3 days old
        if (Date.now() - timestamp < 1000 * 60 * 60 * 24 * 3) {
          setActiveSurah(data);
          setLoadingSurah(false);
          // Set last read surah metadata
          updateLastRead(data.nomor, data.namaLatin, scrollTargetVerse);
          if (scrollTargetVerse) {
            setTimeout(() => scrollToVerse(scrollTargetVerse), 150);
          }
          return;
        }
      }

      let detailData: any = null;

      try {
        const response = await fetch(`/api/quran/surat/${nomor}`);
        if (response.ok) {
          const resData = await response.json();
          if (resData.success && resData.data) {
            detailData = resData.data;
          }
        }
      } catch (err) {
        // Fallback to direct public API
      }

      if (!detailData) {
        // Direct public equran.id API fallback (e.g. on GitHub Pages)
        const fallbackRes = await fetch(`https://equran.id/api/v2/surat/${nomor}`);
        const fallbackJson = await fallbackRes.json();
        if (fallbackJson && fallbackJson.code === 200 && fallbackJson.data) {
          detailData = fallbackJson.data;
        }
      }

      if (detailData) {
        setActiveSurah(detailData);
        updateLastRead(detailData.nomor, detailData.namaLatin, scrollTargetVerse);
        // Save to cache
        localStorage.setItem(cacheKey, JSON.stringify({
          data: detailData,
          timestamp: Date.now()
        }));
        refreshCachedSurahs();

        if (scrollTargetVerse) {
          setTimeout(() => scrollToVerse(scrollTargetVerse), 250);
        }
      } else {
        throw new Error(`Gagal mengambil surat ke-${nomor}`);
      }
    } catch (err: any) {
      console.error(err);
      setSurahError(`Gagal memuat Surat. Periksa jaringan Anda dan tekan tombol muat ulang.`);
    } finally {
      setLoadingSurah(false);
    }
  };

  const updateLastRead = (surahNum: number, surahName: string, verseNum?: number) => {
    const info: LastRead = {
      surahNumber: surahNum,
      surahName: surahName,
      verseNumber: verseNum,
      updatedAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    };
    setLastRead(info);
    localStorage.setItem("quran_last_read", JSON.stringify(info));
  };

  const scrollToVerse = (verseNum: number) => {
    const el = document.getElementById(`verse-container-${verseNum}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add brief highlight effect
      el.classList.add("bg-emerald-55/60", "dark:bg-emerald-950/40");
      setTimeout(() => {
        el.classList.remove("bg-emerald-55/60", "dark:bg-emerald-950/40");
      }, 2000);
    }
  };

  // Bookmark functions
  const handleToggleBookmark = (verseNum: number) => {
    triggerHaptic('medium');
    if (!activeSurah) return;

    const isExist = bookmarks.some(
      (b) => b.surahNumber === activeSurah.nomor && b.verseNumber === verseNum
    );

    if (isExist) {
      setBookmarks((prev) =>
        prev.filter((b) => !(b.surahNumber === activeSurah.nomor && b.verseNumber === verseNum))
      );
      triggerToast("Ayat dihapus dari bookmark.");
    } else {
      const newB: BookmarkType = {
        surahNumber: activeSurah.nomor,
        surahName: activeSurah.namaLatin,
        verseNumber: verseNum,
        addedAt: new Date().toLocaleDateString("id-ID")
      };
      setBookmarks((prev) => [newB, ...prev]);
      triggerToast("Ayat berhasil disimpan ke bookmark!");
    }
  };

  const isVerseBookmarked = (verseNum: number) => {
    if (!activeSurah) return false;
    return bookmarks.some((b) => b.surahNumber === activeSurah.nomor && b.verseNumber === verseNum);
  };

  // Clear / Reset All Local Device Data
  const handleResetAllUserData = () => {
    if (window.confirm("Apakah Sahabat yakin ingin menghapus seluruh data lokal di perangkat ini (bookmark, riwayat bacaan, obrolan AI, & pengaturan)? Data pengguna/pengunjung lain tidak akan terpengaruh.")) {
      try {
        localStorage.removeItem("quran_bookmarks");
        localStorage.removeItem("quran_last_read");
        localStorage.removeItem("quran_click_history");
        localStorage.removeItem("quran_ai_chat_messages");
        localStorage.removeItem("theme");
        localStorage.removeItem("quran_selected_qari");
        localStorage.removeItem("quran_audio_continuous");
        localStorage.removeItem("quran_audio_volume");
      } catch (e) {
        console.error("Failed clearing local storage", e);
      }
      
      setBookmarks([]);
      setLastRead(null);
      setClickHistory({});
      triggerToast("Seluruh data lokal perangkat Anda telah berhasil dibersihkan!");
    }
  };

  // Copy Verse Function
  const handleCopyVerse = (verse: Verse) => {
    if (!activeSurah) return;
    const shareText = `QS. ${activeSurah.namaLatin} [${activeSurah.nomor}]: ${verse.nomorAyat}\n\n${verse.teksArab}\n\n${showTransliteration ? `(${verse.teksLatin})\n\n` : ""}"${verse.teksIndonesia}"\n\n--- Dibagikan dari Al-Qur'an Digital & Tafsir Lengkap`;
    
    navigator.clipboard.writeText(shareText);
    triggerToast("Teks ayat dan terjemahan disalin!");
  };

  // Share via system if available, else copy link
  const handleShareVerse = async (verse: Verse) => {
    if (!activeSurah) return;
    const shareText = `QS. ${activeSurah.namaLatin} [${activeSurah.nomor}]: ${verse.nomorAyat} - ${verse.teksIndonesia}`;
    const shareUrl = `${window.location.origin}/surah/${activeSurah.nomor}/${verse.nomorAyat}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QS. ${activeSurah.namaLatin} [${activeSurah.nomor}]: ${verse.nomorAyat}`,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n\nBaca lengkap: ${shareUrl}`);
      triggerToast("Tautan ayat disalin ke papan klip!");
    }
  };

  // Trigger Ustadz AI on specific verse
  const handleAskAI = (verse: Verse) => {
    if (!activeSurah) return;
    setAIContext({
      surahNumber: activeSurah.nomor,
      surahName: activeSurah.namaLatin,
      verseNumber: verse.nomorAyat,
      verse: verse
    });
    setIsAIOpen(true);
  };

  // View Surah Detail
  const handleSelectSurah = (nomor: number, targetVerse?: number) => {
    setActiveSurahNumber(nomor);
    fetchSurahDetail(nomor, targetVerse);
    setView("surah");
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackSurahClick(nomor);
    
    // Reset Auto Scroll states for the new Surah
    setActiveScrollVerse(targetVerse || 1);
    setVerseProgress(0);
    setIsAutoScrollPlay(false);
  };

  // Filtering for homepage list
  const filteredSurahs = surahList.filter((s) => {
    if (onlyShowOffline && !cachedSurahNumbers.includes(s.nomor)) {
      return false;
    }
    const q = searchFilter.toLowerCase();
    return (
      s.namaLatin.toLowerCase().includes(q) ||
      s.arti.toLowerCase().includes(q) ||
      s.nomor.toString() === q
    );
  });

  return (
    <div className="min-h-screen pb-28 bg-gradient-to-tr from-slate-100 via-emerald-50/10 to-slate-100 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* Dynamic Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-slate-900/90 dark:bg-slate-800/95 text-white text-xs py-2.5 px-5 rounded-full shadow-lg z-50 flex items-center space-x-2"
            id="toast-notification"
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header NavBar */}
      <header className="sticky top-0 bg-white/85 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 z-30 transition-colors duration-300 shadow-xs shadow-slate-200/50 dark:shadow-none relative">
        {/* Background Video 01.mov & Islamic Geometric Ambient Mesh Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {/* Fail-Safe Static Background Image Layer */}
          <div 
            style={{ backgroundImage: `url(${islamicHeroBg})` }}
            className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none opacity-20 dark:opacity-35 mix-blend-multiply dark:mix-blend-screen"
          />

          {/* Subtle Emerald & Gold Mesh Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/15 via-amber-500/10 to-teal-500/15 dark:from-emerald-900/30 dark:via-amber-900/20 dark:to-teal-900/30 opacity-90" />

          {/* Background Video Layer with Blend Mode (Static, non-shifting) */}
          {!headerVideoFailed && (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              // @ts-ignore
              webkit-playsinline="true"
              onError={() => setHeaderVideoFailed(true)}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30 dark:opacity-45 mix-blend-multiply dark:mix-blend-screen [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
            >
              <source src="/01.mov" type="video/quicktime" />
              <source src="/01.mov" type="video/mp4" />
            </video>
          )}

          {/* Islamic Geometric Pattern Accent Background & Floating Gold Particles */}
          <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.09] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute top-2 left-10 w-2 h-2 rounded-full bg-amber-400/60 blur-xs animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-2 right-16 w-3 h-3 rounded-full bg-emerald-400/50 blur-xs animate-pulse" style={{ animationDuration: '4s' }} />

          {/* Ambient Corner Soft Glows */}
          <div className="absolute -top-10 left-1/4 w-72 h-72 bg-emerald-400/20 dark:bg-emerald-600/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 right-1/4 w-72 h-72 bg-amber-400/15 dark:bg-amber-600/10 rounded-full blur-3xl" />
        </div>

        {/* Header Content Container (max-w-7xl) - Optimized for Portrait Mobile */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-15 sm:h-16 md:h-20 flex items-center justify-between gap-1 sm:gap-4 transition-all duration-300 relative z-10">
          {/* Logo / Brand */}
          <button
            onClick={() => {
              setView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center space-x-1.5 sm:space-x-2 hover:opacity-90 group text-left shrink-0"
            id="btn-brand-logo"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-800 to-emerald-950 dark:from-emerald-900 dark:to-emerald-950 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md transform group-hover:scale-105 transition-all overflow-hidden border border-emerald-500/20 shrink-0">
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 select-none"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Beautiful rotating background star/mandala */}
                <g className="animate-[spin_25s_linear_infinite] origin-center" style={{ transformOrigin: "50% 50%" }}>
                  {/* 8-pointed Islamic Star (Rub el Hizb) */}
                  <path
                    d="M50 5 L63 23 L85 23 L77 45 L95 50 L77 55 L85 77 L63 77 L50 95 L37 77 L15 77 L23 55 L5 50 L23 45 L15 23 L37 23 Z"
                    stroke="rgba(245, 158, 11, 0.4)"
                    strokeWidth="2"
                    fill="rgba(245, 158, 11, 0.05)"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    stroke="rgba(245, 158, 11, 0.25)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </g>

                {/* Outer glowing halo */}
                <circle
                  cx="50"
                  cy="50"
                  r="28"
                  className="animate-[pulse_3s_ease-in-out_infinite]"
                  fill="rgba(245, 158, 11, 0.08)"
                  stroke="rgba(245, 158, 11, 0.15)"
                  strokeWidth="1"
                />

                {/* Golden Crescent Moon wrapping from the side */}
                <path
                  d="M 68 25 A 30 30 0 1 0 76 60 A 24 24 0 1 1 68 25 Z"
                  fill="url(#gold-grad)"
                  className="animate-[pulse_4s_ease-in-out_infinite]"
                  opacity="0.85"
                />

                {/* Floating open Book (Al-Quran) with turning pages look */}
                <g className="animate-[bounce_3s_ease-in-out_infinite] origin-center" style={{ transformOrigin: "50% 50%" }}>
                  {/* Book Pages base */}
                  <path
                    d="M50 68 C 38 65, 26 69, 20 72 V 42 C 26 39, 38 35, 50 38 C 62 35, 74 39, 80 42 V 72 C 74 69, 62 65, 50 68 Z"
                    fill="url(#gold-grad)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  {/* Inner pages overlay */}
                  <path
                    d="M50 66 C 39 63, 29 66, 23 69 V 40 C 29 37, 39 34, 50 36 C 61 34, 71 37, 77 40 V 69 C 71 66, 61 63, 50 66 Z"
                    fill="#fffbeb"
                    stroke="rgba(245, 158, 11, 0.4)"
                    strokeWidth="0.5"
                  />
                  {/* Center Spine */}
                  <line x1="50" y1="36" x2="50" y2="67" stroke="#b45309" strokeWidth="1.5" />
                  
                  {/* Book ribbon marker */}
                  <path d="M50 67 L48 76 L50 74 L52 76 Z" fill="#dc2626" />

                  {/* Glowing particles or rays above the book */}
                  <circle cx="50" cy="28" r="2" fill="#f59e0b" className="animate-ping" />
                </g>

                <defs>
                  <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold font-display tracking-tight text-slate-900 dark:text-white leading-tight truncate">Al-Qur'an Digital</h1>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium hidden sm:flex items-center gap-1">القرآن الكريم • Lengkap & Terjemahan</p>
            </div>
          </button>

          {/* Nav Controls - Mobile Portrait Optimized */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {/* Dropdown Layanan Islami (Combining Tanya Ustadz and Jadwal Sholat) */}
            <div className="relative">
              <motion.button
                onClick={handleFeaturesMenuClick}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative overflow-hidden px-2 py-1.5 sm:px-3 sm:py-2 text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs font-semibold flex items-center space-x-1 sm:space-x-1.5 border transition-all duration-200 cursor-pointer select-none shadow-xs shadow-emerald-600/20 dark:shadow-emerald-950/60 hover:shadow-md ${
                  (showFeaturesMenu || isAIOpen || isPrayerTimesOpen || view === "prayer-guide" || view === "doa-hadits")
                    ? "border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/30 shadow-md shadow-emerald-500/30 dark:shadow-emerald-950/80"
                    : "border-emerald-100/80 dark:border-emerald-900/80 hover:border-emerald-300 dark:hover:border-emerald-700"
                }`}
                title={lang === "id" ? "Layanan Islami" : "Islamic Services"}
                id="btn-nav-features-menu"
              >
                {/* Subtle Pulsing Border Glow Effect when Active */}
                {(showFeaturesMenu || isAIOpen || isPrayerTimesOpen || view === "prayer-guide" || view === "doa-hadits") && (
                  <motion.span
                    initial={{ opacity: 0.5 }}
                    animate={{ 
                      opacity: [0.35, 0.95, 0.35],
                      boxShadow: [
                        "0 0 8px rgba(16, 185, 129, 0.25)",
                        "0 0 18px rgba(16, 185, 129, 0.55)",
                        "0 0 8px rgba(16, 185, 129, 0.25)"
                      ]
                    }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-xl border-2 border-emerald-500/80 dark:border-emerald-400/80 ring-2 ring-emerald-500/40 pointer-events-none z-0"
                  />
                )}
                {/* Active Service Indicator Dot */}
                {(isAIOpen || isPrayerTimesOpen || view === "prayer-guide" || view === "doa-hadits") && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                )}
                {(isAIOpen || isPrayerTimesOpen || view === "prayer-guide" || view === "doa-hadits") && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-xs" />
                )}
                {/* Ripple Effect Elements */}
                {menuRipples.map((ripple) => (
                  <motion.span
                    key={ripple.id}
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 2.8, opacity: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    style={{
                      top: ripple.y - 20,
                      left: ripple.x - 20,
                      width: 40,
                      height: 40,
                    }}
                    className="absolute rounded-full bg-emerald-500/40 dark:bg-emerald-400/40 pointer-events-none"
                  />
                ))}
                <motion.span
                  animate={{ rotate: showFeaturesMenu ? 360 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="inline-flex items-center justify-center shrink-0 z-10"
                >
                  <motion.span
                    animate={{ y: [0, -3.5, 0], scale: [1, 1.12, 1], rotate: [0, 8, -4, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-flex items-center justify-center drop-shadow-xs"
                  >
                    <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                  </motion.span>
                </motion.span>
                <span className="inline text-[11px] sm:text-xs font-semibold z-10">
                  {lang === "id" ? "Layanan" : "Services"}
                </span>
                <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 transition-transform z-10 ${showFeaturesMenu ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {showFeaturesMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowFeaturesMenu(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-80 max-h-[calc(100vh-90px)] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2.5 text-xs"
                    >
                      {/* Top Drag Handle for Pull/Drag UX */}
                      <div className="flex items-center justify-center pt-0.5 pb-2 cursor-grab active:cursor-grabbing group/drag select-none" title={lang === "id" ? "Tarik untuk menggeser menu" : "Drag handle"}>
                        <div className="w-14 h-2 bg-slate-300 dark:bg-slate-700 group-hover/drag:bg-emerald-500 dark:group-hover/drag:bg-emerald-400 active:bg-emerald-600 dark:active:bg-emerald-300 rounded-full transition-all duration-300 active:w-20 shadow-xs" />
                      </div>

                      {/* Header Banner */}
                      <div className="px-3.5 py-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-amber-950/20 border border-emerald-500/20 dark:border-emerald-900/40 mb-2 flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                              {lang === "id" ? "Layanan & Penunjang Ibadah" : "Islamic Worship Suite"}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {lang === "id" ? "Fitur islami terpadu & interaktif" : "Integrated & interactive Islamic features"}
                          </p>
                        </div>
                        {lastUsedService && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/15 dark:bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 shrink-0 shadow-2xs" title={lang === "id" ? "Fitur Terakhir Terbuka" : "Most Recently Used"}>
                            <History className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>
                              {lastUsedService === "ai" && (lang === "id" ? "Ustadz AI" : "Ustadz AI")}
                              {lastUsedService === "prayer" && (lang === "id" ? "Jadwal" : "Prayer")}
                              {lastUsedService === "prayer-guide" && (lang === "id" ? "Panduan" : "Guide")}
                              {lastUsedService === "doa-hadits" && (lang === "id" ? "Doa & Hadits" : "Duas")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Section 1: Layanan Cerdas & Waktu */}
                      <div className="space-y-1 mb-2">
                        <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {lang === "id" ? "Konsultasi & Waktu" : "Consultation & Times"}
                        </p>

                        {/* Option 1: Tanya Ustadz AI */}
                        <button
                          onClick={() => {
                            setIsAIOpen(true);
                            setLastUsedService("ai");
                            localStorage.setItem("last_used_islamic_service", "ai");
                            setShowFeaturesMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-200 group cursor-pointer relative ${
                            isAIOpen
                              ? "bg-emerald-50/90 dark:bg-emerald-950/70 border-2 border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/30 dark:ring-emerald-400/30 shadow-md shadow-emerald-500/20"
                              : lastUsedService === "ai"
                              ? "bg-emerald-50/40 dark:bg-slate-800/60 border-2 border-emerald-400/60 dark:border-emerald-500/60 ring-1 ring-emerald-400/20"
                              : "bg-slate-50/60 dark:bg-slate-800/40 hover:bg-emerald-50/80 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800/80 hover:border-emerald-500/60 dark:hover:border-emerald-400/60 hover:border-dashed hover:ring-2 hover:ring-emerald-500/20 dark:hover:ring-emerald-400/20 active:ring-2 active:ring-emerald-500/40"
                          }`}
                          id="btn-dropdown-ai"
                        >
                          <div className="flex items-center space-x-2.5">
                            {/* Drag Grip Handle */}
                            <div 
                              className="p-1 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/60 rounded-md transition-all duration-200 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 active:bg-emerald-600 active:text-white dark:active:bg-emerald-500 dark:active:text-white active:scale-110 shrink-0 cursor-grab active:cursor-grabbing shadow-xs"
                              title={lang === "id" ? "Genggam untuk menggeser" : "Drag handle"}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="relative shrink-0">
                              <div className={`p-2 rounded-xl transition-colors duration-200 shrink-0 ${isAIOpen ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/40" : "bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white"}`}>
                                <Sparkles className="w-4 h-4 animate-pulse" />
                              </div>
                              {lastUsedService === "ai" && (
                                <span className="absolute -top-1.5 -right-1.5 p-0.5 bg-amber-500 text-white rounded-full ring-2 ring-white dark:ring-slate-900 shadow-md flex items-center justify-center animate-pulse" title={lang === "id" ? "Terakhir Digunakan" : "Most Recently Used"}>
                                  <History className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-slate-850 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                  {lang === "id" ? "Tanya Ustadz AI" : "Ask Ustadz AI"}
                                </p>
                                {isAIOpen ? (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-extrabold flex items-center gap-1 shadow-xs animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                    {lang === "id" ? "Aktif" : "Active"}
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[9px] font-extrabold">
                                    AI
                                  </span>
                                )}
                                {lastUsedService === "ai" && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-[9px] font-extrabold flex items-center gap-0.5 shadow-2xs">
                                    <History className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                                    {lang === "id" ? "Terakhir" : "Recent"}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {lang === "id" ? "Konsultasi fiqih, tafsir, & hadits interaktif." : "Interactive consultation on fiqh, tafsir & hadith."}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                        </button>

                        {/* Option 2: Jadwal Sholat */}
                        <button
                          onClick={() => {
                            setIsPrayerTimesOpen(true);
                            setLastUsedService("prayer");
                            localStorage.setItem("last_used_islamic_service", "prayer");
                            setShowFeaturesMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-200 group cursor-pointer relative ${
                            isPrayerTimesOpen
                              ? "bg-emerald-50/90 dark:bg-emerald-950/70 border-2 border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/30 dark:ring-emerald-400/30 shadow-md shadow-emerald-500/20"
                              : lastUsedService === "prayer"
                              ? "bg-emerald-50/40 dark:bg-slate-800/60 border-2 border-emerald-400/60 dark:border-emerald-500/60 ring-1 ring-emerald-400/20"
                              : "bg-slate-50/60 dark:bg-slate-800/40 hover:bg-emerald-50/80 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800/80 hover:border-emerald-500/60 dark:hover:border-emerald-400/60 hover:border-dashed hover:ring-2 hover:ring-emerald-500/20 dark:hover:ring-emerald-400/20 active:ring-2 active:ring-emerald-500/40"
                          }`}
                          id="btn-dropdown-prayer"
                        >
                          <div className="flex items-center space-x-2.5">
                            {/* Drag Grip Handle */}
                            <div 
                              className="p-1 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/60 rounded-md transition-all duration-200 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 active:bg-emerald-600 active:text-white dark:active:bg-emerald-500 dark:active:text-white active:scale-110 shrink-0 cursor-grab active:cursor-grabbing shadow-xs"
                              title={lang === "id" ? "Genggam untuk menggeser" : "Drag handle"}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="relative shrink-0">
                              <div className={`p-2 rounded-xl transition-colors duration-200 shrink-0 ${isPrayerTimesOpen ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/40" : "bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white"}`}>
                                <Clock className="w-4 h-4" />
                              </div>
                              {lastUsedService === "prayer" && (
                                <span className="absolute -top-1.5 -right-1.5 p-0.5 bg-amber-500 text-white rounded-full ring-2 ring-white dark:ring-slate-900 shadow-md flex items-center justify-center animate-pulse" title={lang === "id" ? "Terakhir Digunakan" : "Most Recently Used"}>
                                  <History className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-slate-850 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                  {lang === "id" ? "Jadwal & Waktu Salat" : "Prayer Times"}
                                </p>
                                {isPrayerTimesOpen ? (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-extrabold flex items-center gap-1 shadow-xs animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                    {lang === "id" ? "Aktif" : "Active"}
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[9px] font-extrabold">
                                    Akurat
                                  </span>
                                )}
                                {lastUsedService === "prayer" && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-[9px] font-extrabold flex items-center gap-0.5 shadow-2xs">
                                    <History className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                                    {lang === "id" ? "Terakhir" : "Recent"}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {lang === "id" ? "Jadwal presisi lokasi, jam digital & hitung mundur." : "Location-based times, digital clock & countdown."}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                        </button>
                      </div>

                      {/* Section 2: Panduan & Doa */}
                      <div className="space-y-1">
                        <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {lang === "id" ? "Panduan & Amalan Harian" : "Guidance & Daily Practice"}
                        </p>

                        {/* Option 3: Pendampingan Sholat */}
                        <button
                          onClick={() => {
                            setView("prayer-guide");
                            setLastUsedService("prayer-guide");
                            localStorage.setItem("last_used_islamic_service", "prayer-guide");
                            setShowFeaturesMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-200 group cursor-pointer relative ${
                            view === "prayer-guide"
                              ? "bg-teal-50/90 dark:bg-teal-950/70 border-2 border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/30 dark:ring-teal-400/30 shadow-md shadow-teal-500/20"
                              : lastUsedService === "prayer-guide"
                              ? "bg-teal-50/40 dark:bg-slate-800/60 border-2 border-teal-400/60 dark:border-teal-500/60 ring-1 ring-teal-400/20"
                              : "bg-slate-50/60 dark:bg-slate-800/40 hover:bg-teal-50/80 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800/80 hover:border-teal-500/60 dark:hover:border-teal-400/60 hover:border-dashed hover:ring-2 hover:ring-teal-500/20 dark:hover:ring-teal-400/20 active:ring-2 active:ring-teal-500/40"
                          }`}
                          id="btn-dropdown-prayer-guide"
                        >
                          <div className="flex items-center space-x-2.5">
                            {/* Drag Grip Handle */}
                            <div 
                              className="p-1 hover:bg-teal-100/80 dark:hover:bg-teal-950/60 rounded-md transition-all duration-200 text-slate-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 active:bg-teal-600 active:text-white dark:active:bg-teal-500 dark:active:text-white active:scale-110 shrink-0 cursor-grab active:cursor-grabbing shadow-xs"
                              title={lang === "id" ? "Genggam untuk menggeser" : "Drag handle"}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="relative shrink-0">
                              <div className={`p-2 rounded-xl transition-colors duration-200 shrink-0 ${view === "prayer-guide" ? "bg-teal-600 text-white shadow-sm shadow-teal-500/40" : "bg-teal-100/80 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 group-hover:bg-teal-600 group-hover:text-white"}`}>
                                <Book className="w-4 h-4" />
                              </div>
                              {lastUsedService === "prayer-guide" && (
                                <span className="absolute -top-1.5 -right-1.5 p-0.5 bg-amber-500 text-white rounded-full ring-2 ring-white dark:ring-slate-900 shadow-md flex items-center justify-center animate-pulse" title={lang === "id" ? "Terakhir Digunakan" : "Most Recently Used"}>
                                  <History className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-slate-850 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                                  {lang === "id" ? "Pendampingan Sholat" : "Prayer Guidance"}
                                </p>
                                {view === "prayer-guide" ? (
                                  <span className="px-1.5 py-0.2 rounded bg-teal-600 text-white text-[9px] font-extrabold flex items-center gap-1 shadow-xs animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                    {lang === "id" ? "Aktif" : "Active"}
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-[9px] font-extrabold">
                                    Audio
                                  </span>
                                )}
                                {lastUsedService === "prayer-guide" && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-[9px] font-extrabold flex items-center gap-0.5 shadow-2xs">
                                    <History className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                                    {lang === "id" ? "Terakhir" : "Recent"}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {lang === "id" ? "Niat, bacaan, audio & gerakan dari niat-salam." : "Intentions, readings, audio & step-by-step posture."}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                        </button>

                        {/* Option 4: Doa & Hadits Sehari-hari */}
                        <button
                          onClick={() => {
                            setView("doa-hadits");
                            setLastUsedService("doa-hadits");
                            localStorage.setItem("last_used_islamic_service", "doa-hadits");
                            setShowFeaturesMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-200 group cursor-pointer relative ${
                            view === "doa-hadits"
                              ? "bg-amber-50/90 dark:bg-amber-950/70 border-2 border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/30 dark:ring-amber-400/30 shadow-md shadow-emerald-500/20"
                              : lastUsedService === "doa-hadits"
                              ? "bg-amber-50/40 dark:bg-slate-800/60 border-2 border-amber-400/60 dark:border-amber-500/60 ring-1 ring-amber-400/20"
                              : "bg-slate-50/60 dark:bg-slate-800/40 hover:bg-amber-50/80 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800/80 hover:border-amber-500/60 dark:hover:border-amber-400/60 hover:border-dashed hover:ring-2 hover:ring-amber-500/20 dark:hover:ring-amber-400/20 active:ring-2 active:ring-amber-500/40"
                          }`}
                          id="btn-dropdown-doa-hadits"
                        >
                          <div className="flex items-center space-x-2.5">
                            {/* Drag Grip Handle */}
                            <div 
                              className="p-1 hover:bg-amber-100/80 dark:hover:bg-amber-950/60 rounded-md transition-all duration-200 text-slate-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 active:bg-amber-600 active:text-white dark:active:bg-amber-500 dark:active:text-white active:scale-110 shrink-0 cursor-grab active:cursor-grabbing shadow-xs"
                              title={lang === "id" ? "Genggam untuk menggeser" : "Drag handle"}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="relative shrink-0">
                              <div className={`p-2 rounded-xl transition-colors duration-200 shrink-0 ${view === "doa-hadits" ? "bg-amber-600 text-white shadow-sm shadow-amber-500/40" : "bg-amber-100/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white"}`}>
                                <Heart className="w-4 h-4" />
                              </div>
                              {lastUsedService === "doa-hadits" && (
                                <span className="absolute -top-1.5 -right-1.5 p-0.5 bg-amber-500 text-white rounded-full ring-2 ring-white dark:ring-slate-900 shadow-md flex items-center justify-center animate-pulse" title={lang === "id" ? "Terakhir Digunakan" : "Most Recently Used"}>
                                  <History className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-slate-850 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                                  {lang === "id" ? "Doa & Hadits Sehari-hari" : "Daily Duas & Hadiths"}
                                </p>
                                {view === "doa-hadits" ? (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-600 text-white text-[9px] font-extrabold flex items-center gap-1 shadow-xs animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                    {lang === "id" ? "Aktif" : "Active"}
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[9px] font-extrabold">
                                    Lengkap
                                  </span>
                                )}
                                {lastUsedService === "doa-hadits" && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-[9px] font-extrabold flex items-center gap-0.5 shadow-2xs">
                                    <History className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                                    {lang === "id" ? "Terakhir" : "Recent"}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {lang === "id" ? "200+ doa harian, Latin, terjemahan, & faedah." : "200+ supplications, transliteration & benefits."}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* PWA Install Trigger */}
            {showInstallBtn && (
              <>
                {/* Desktop Version */}
                <button
                  onClick={handleInstallClick}
                  className="hidden md:flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold transition border border-amber-500/20 shadow-md cursor-pointer active:scale-95 shrink-0"
                  title={lang === "id" ? "Pasang Aplikasi Al-Qur'an" : "Install Quran App"}
                  id="btn-nav-install-pwa"
                >
                  <Download className="w-3.5 h-3.5 animate-bounce" />
                  <span>{lang === "id" ? "Pasang Aplikasi" : "Install App"}</span>
                </button>
                {/* Mobile Version */}
                <button
                  onClick={handleInstallClick}
                  className="flex md:hidden p-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-400/10 rounded-xl border border-transparent transition cursor-pointer active:scale-95 shrink-0"
                  title={lang === "id" ? "Pasang Aplikasi" : "Install App"}
                  id="btn-nav-install-pwa-mobile"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
                </button>
              </>
            )}

            {/* Language Toggle Button */}
            <button
              onClick={() => {
                const nextLang = lang === "id" ? "en" : "id";
                setLang(nextLang);
                localStorage.setItem("app_lang", nextLang);
              }}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 text-[10px] sm:text-xs font-bold text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 transition flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
              title={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
              id="btn-nav-language-toggle"
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Bookmark list page */}
            <button
              onClick={() => setView("bookmark")}
              className={`p-1.5 sm:p-2 rounded-xl border transition cursor-pointer shrink-0 ${view === "bookmark" ? "bg-slate-100 border-slate-200 text-emerald-700 dark:bg-slate-800 dark:border-slate-700 dark:text-emerald-400" : "text-slate-500 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
              title={lang === "id" ? "Bookmark Saya" : "My Bookmarks"}
              id="btn-nav-bookmarks"
            >
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Quick Settings Trigger */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl border border-transparent transition cursor-pointer shrink-0"
              title={lang === "id" ? "Pengaturan Tampilan" : "Display Settings"}
              id="btn-nav-settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dark Mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl border border-transparent transition cursor-pointer shrink-0"
              title={isDarkMode ? (lang === "id" ? "Mode Terang" : "Light Mode") : (lang === "id" ? "Mode Gelap" : "Dark Mode")}
              id="btn-nav-dark-mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Google / Gmail Integration Button/Dropdown */}
            <div className="relative">
              {user ? (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-1.5 p-1.5 pr-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-100 dark:border-slate-750 transition text-xs font-semibold"
                    id="btn-user-profile-menu"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-6 h-6 rounded-lg object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-[10px] uppercase font-bold shrink-0">
                        {user.displayName?.charAt(0) || "U"}
                      </div>
                    )}
                    <span className="hidden md:inline max-w-[90px] truncate">
                      {user.displayName?.split(" ")[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showUserDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowUserDropdown(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 text-xs"
                        >
                          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                            <p className="font-bold text-slate-850 dark:text-white truncate">
                              {user.displayName}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                              {user.email}
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              setIsGmailDashboardOpen(true);
                              setShowUserDropdown(false);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition text-left"
                            id="btn-open-gmail-dash"
                          >
                            <Inbox className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-medium">Kotak Masuk Gmail</span>
                          </button>

                          <button
                            onClick={handleGoogleLogout}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition text-left"
                            id="btn-google-logout"
                          >
                            <LogOut className="w-4 h-4 shrink-0" />
                            <span className="font-medium">Putuskan Hubungan</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        
        <AnimatePresence mode="wait">
          {/* VIEW 1: HOMEPAGE */}
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-8"
            >
            
            {/* Bento Grid Main Content */}
            <div className="grid grid-cols-12 gap-4">
              
              {/* Card 1: Last Read (Hero Card) */}
              <div className="col-span-12 lg:col-span-8 bg-slate-950 border border-emerald-500/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-emerald-950/10 group min-h-[300px]">
                <img 
                  src={quranHoldingHand} 
                  alt="Seseorang mendekap mushaf Al-Qur'an" 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none"
                />
                {/* Elegant gradient overlay for premium depth and text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-emerald-950/20 pointer-events-none"></div>
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="z-10">
                  <span className="bg-emerald-500/20 text-emerald-400 dark:text-emerald-300 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30">
                    Terakhir Dibaca
                  </span>
                  {lastRead ? (
                    <>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mt-4 mb-2 tracking-tight">
                        {lastRead.surahName}
                      </h2>
                      <p className="text-slate-300 text-sm md:text-base italic">
                        Surat ke-{lastRead.surahNumber} • {lastRead.verseNumber ? `Ayat ${lastRead.verseNumber}` : "Seluruh Surat"}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2">Dibuka pada: {lastRead.updatedAt}</p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mt-4 mb-2 tracking-tight">
                        Al-Fatihah
                      </h2>
                      <p className="text-slate-300 text-sm md:text-base italic">
                        Surat ke-1 • Pembukaan
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2">Mulai tadarus pertama Sahabat hari ini</p>
                    </>
                  )}
                </div>
                <div className="z-10 flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={() => handleSelectSurah(lastRead ? lastRead.surahNumber : 1, lastRead?.verseNumber)}
                    className="w-full sm:w-auto bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95"
                  >
                    <span>Lanjutkan Membaca</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSelectSurah(lastRead ? lastRead.surahNumber : 1)}
                    className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
                  >
                    Detail Surat
                  </button>
                </div>
              </div>

              {/* Card 2: Quick Access Card */}
              <div className="col-span-12 lg:col-span-4 bg-slate-100/40 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
                <img 
                  src={quranTasbihBg} 
                  alt="Quran and Tasbih" 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-[0.38] dark:opacity-[0.22] pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/35 via-white/10 to-transparent dark:from-slate-950/90 dark:via-slate-950/40 dark:to-transparent pointer-events-none"></div>
                <div className="relative z-10 w-full">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Akses Cepat</h3>
                  <div className="space-y-3">
                    {[36, 67, 56].map((num) => {
                      const preset = getSurahCardBg(num);
                      const surahData = num === 36 ? { name: "Ya-Sin", verses: "83 Ayat", arabic: "يس" } :
                                        num === 67 ? { name: "Al-Mulk", verses: "30 Ayat", arabic: "الملك" } :
                                                     { name: "Al-Waqi'ah", verses: "96 Ayat", arabic: "الواقعة" };
                      const isCached = cachedSurahNumbers.includes(num);
                      return (
                        <div
                          key={num}
                          onClick={() => handleSelectSurah(num)}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border hover:-translate-y-0.5 transition-all cursor-pointer group ${preset.card}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${preset.num}`}>
                              {num}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                                <span>{surahData.name}</span>
                                {isCached && (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[8px] font-extrabold flex items-center gap-0.5 shadow-2xs">
                                    <CheckCircle className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                                    <span>Luring</span>
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500">{surahData.verses}</div>
                            </div>
                          </div>
                          <div className={`text-xl font-serif font-bold opacity-80 group-hover:opacity-100 transition-opacity ${preset.arabic}`}>
                            {surahData.arabic}
                          </div>
                        </div>
                      );
                    })}

                    {/* Quick Link to Pendampingan Sholat */}
                    <button
                      onClick={() => setView("prayer-guide")}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/45 hover:bg-emerald-50/75 border border-emerald-100/50 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20 dark:border-emerald-900/30 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 text-slate-800 dark:text-slate-100 hover:-translate-y-0.5 transition-all cursor-pointer group/btn mt-2 shadow-xs"
                      id="btn-quick-prayer-guide"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 dark:bg-emerald-400/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs shrink-0 transition-transform group-hover/btn:scale-110">
                          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs text-slate-900 dark:text-white group-hover/btn:text-emerald-600 dark:group-hover/btn:text-emerald-400 transition-colors">Pendampingan Sholat</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Niat hingga Salam (Lengkap)</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    {/* Quick Link to Doa & Hadits Sehari-hari */}
                    <button
                      onClick={() => setView("doa-hadits")}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/30 hover:bg-amber-50/65 border border-amber-100/40 dark:bg-amber-950/5 dark:hover:bg-amber-950/15 dark:border-amber-950/30 hover:border-amber-500/30 dark:hover:border-amber-500/30 text-slate-800 dark:text-slate-100 hover:-translate-y-0.5 transition-all cursor-pointer group/btn mt-2 shadow-xs"
                      id="btn-quick-doa-hadits"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/15 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-xs shrink-0 transition-transform group-hover/btn:scale-110">
                          <Heart className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs text-slate-900 dark:text-white group-hover/btn:text-emerald-600 dark:group-hover/btn:text-emerald-400 transition-colors">Doa & Hadits Sehari-hari</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Doa Harian & Hadits Pilihan</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 4: Detailed Click & Reading History Table */}
              <div className="col-span-12 lg:col-span-8 bg-slate-100/30 dark:bg-slate-900/15 border border-slate-200/40 dark:border-slate-800/70 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                <img 
                  src={islamicHeroBg} 
                  alt="Islamic background pattern" 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-[0.35] dark:opacity-[0.20] pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-white/5 to-transparent dark:from-slate-950/85 dark:via-slate-950/40 dark:to-transparent pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
                        <History className="w-4 h-4 text-emerald-500" />
                        <span>Riwayat & Frekuensi Tadarus Saya</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                        Menelisik surat yang sering dibaca & mengoptimalkan riwayat klik tadarus Sahabat
                      </p>
                    </div>

                    {/* Controls & Reset */}
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <div className="flex bg-slate-200/70 dark:bg-slate-800/70 p-0.5 rounded-lg text-[11px]">
                        <button
                          onClick={() => setHistorySortBy("frequency")}
                          className={`px-2.5 py-1 rounded-md transition ${historySortBy === "frequency" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
                        >
                          Paling Sering
                        </button>
                        <button
                          onClick={() => setHistorySortBy("recent")}
                          className={`px-2.5 py-1 rounded-md transition ${historySortBy === "recent" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
                        >
                          Terbaru
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (!user) {
                            handleGoogleLogin().then(() => {
                              handleOpenGmailShareHistory();
                            });
                          } else {
                            handleOpenGmailShareHistory();
                          }
                        }}
                        className="p-1.5 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors flex items-center gap-1 text-[11px] font-bold"
                        title="Kirim Laporan via Gmail"
                        id="btn-gmail-history-report"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="hidden sm:inline">Kirim Laporan</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm("Apakah Sahabat ingin menghapus semua riwayat tadarus?")) {
                            setClickHistory({});
                            localStorage.removeItem("quran_click_history");
                            triggerToast("Riwayat tadarus berhasil dibersihkan.");
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-450 transition-colors"
                        title="Reset Riwayat"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Table Display */}
                  <div className="overflow-x-auto -mx-6 sm:mx-0">
                    <table className="w-full text-left text-xs border-collapse min-w-0 sm:min-w-[500px]">
                      <thead>
                        <tr className="border-b border-slate-200/50 dark:border-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                          <th className="pb-2.5 px-3">Surat</th>
                          <th className="pb-2.5 px-3 text-center">Dibaca</th>
                          <th className="pb-2.5 px-3 hidden sm:table-cell">Terakhir Diklik</th>
                          <th className="pb-2.5 px-3 text-center hidden md:table-cell">Optimasi Riwayat</th>
                          <th className="pb-2.5 px-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/30">
                        {Object.keys(clickHistory).length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                              Belum ada riwayat klik surat. Silakan klik surat di daftar di bawah untuk mulai mencatat.
                            </td>
                          </tr>
                        ) : (
                          (Object.values(clickHistory) as Array<{
                            surahNumber: number;
                            surahName: string;
                            count: number;
                            lastClicked: string;
                            jumlahAyat: number;
                            tempatTurun: string;
                            namaArab: string;
                          }>)
                            .sort((a, b) => {
                              if (historySortBy === "recent") {
                                return b.lastClicked.localeCompare(a.lastClicked);
                              }
                              return b.count - a.count;
                            })
                            .slice(0, 5) // Show top 5 for neatness
                            .map((item) => {
                              // Dynamic status calculation
                              let badgeColor = "bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400";
                              let statusText = "Baru";
                              if (item.count >= 10) {
                                badgeColor = "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/20";
                                statusText = "Sangat Istiqomah";
                              } else if (item.count >= 5) {
                                badgeColor = "bg-teal-500/15 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300 border border-teal-500/20";
                                statusText = "Sering Diulang";
                              } else if (item.count >= 2) {
                                badgeColor = "bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-500/10";
                                statusText = "Perlu Istiqomah";
                              }

                              return (
                                <tr 
                                  key={item.surahNumber}
                                  className="group hover:bg-slate-100/30 dark:hover:bg-slate-800/10 transition-colors"
                                >
                                  {/* Surat Name with Number and Arabic info */}
                                  <td className="py-3 px-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-md bg-slate-200/50 dark:bg-slate-800/75 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center font-display">
                                        {item.surahNumber}
                                      </div>
                                      <div>
                                        <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                                          {item.surahName}
                                          {item.namaArab && (
                                            <span className="arabic-text text-emerald-600 dark:text-emerald-400 text-xs font-semibold select-none">
                                              {item.namaArab}
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                                          {item.jumlahAyat} Ayat • {item.tempatTurun}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Clicks count */}
                                  <td className="py-3 px-3 text-center">
                                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded-full">
                                      {item.count}x
                                    </span>
                                  </td>

                                  {/* Last clicked timestamp */}
                                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px] hidden sm:table-cell">
                                    {item.lastClicked}
                                  </td>

                                  {/* Optimization level badge */}
                                  <td className="py-3 px-3 text-center hidden md:table-cell">
                                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium inline-block ${badgeColor}`}>
                                      {statusText}
                                    </span>
                                  </td>

                                  {/* Quick read action button */}
                                  <td className="py-3 px-3 text-right">
                                    <button
                                      onClick={() => handleSelectSurah(item.surahNumber)}
                                      className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-0.5"
                                    >
                                      Baca
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Personalized recommendation text */}
                <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800/60 flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 italic relative z-10">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                  <span>
                    {Object.keys(clickHistory).length > 0 ? (
                      `Rekomendasi Tadarus: Surat ${(Object.values(clickHistory) as Array<{ surahName: string; count: number }>).sort((a,b) => b.count - a.count)[0]?.surahName} paling sering dibaca. Cobalah melengkapi tadarus surat lainnya untuk menyempurnakan khatam.`
                    ) : (
                      "Silakan mulai membaca Al-Qur'an untuk melihat analisis konsistensi tadarus Sahabat."
                    )}
                  </span>
                </div>
              </div>

              {/* Card 5: Bookmark & Share Card */}
              <div className="col-span-12 lg:col-span-4 bg-slate-100/30 dark:bg-slate-900/15 border border-slate-200/40 dark:border-slate-800/70 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                <img 
                  src={quranTasbihBg} 
                  alt="Quran and Tasbih" 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-[0.38] dark:opacity-[0.22] pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/35 via-white/10 to-transparent dark:from-slate-950/90 dark:via-slate-950/40 dark:to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col justify-between h-full w-full">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Bookmark Terbaru</h3>
                    <div className="space-y-3 min-h-[120px]">
                      {bookmarks.length === 0 ? (
                        <div className="text-xs text-slate-400 dark:text-slate-500 italic py-3">
                          Belum ada ayat yang dibookmark. Klik ikon bendera di samping ayat untuk menyimpannya di sini.
                        </div>
                      ) : (
                        bookmarks.slice(0, 3).map((b, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleSelectSurah(b.surahNumber, b.verseNumber)} 
                            className="flex items-center gap-2.5 p-1.5 hover:bg-white dark:hover:bg-slate-800/40 rounded-xl cursor-pointer group/item transition-all"
                          >
                            <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover/item:scale-125 transition"></div>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">QS. {b.surahName} • Ayat {b.verseNumber}</span>
                            <span className="text-[9px] ml-auto text-slate-400 dark:text-slate-500 uppercase">{b.addedAt}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => setView("bookmark")}
                    className="mt-4 w-full py-2.5 rounded-xl border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Lihat Semua Bookmark</span>
                  </button>
                </div>
              </div>

            </div>

            {/* List of 114 Surahs */}
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 mt-8">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2.5">
                    <span className="w-1.5 h-6 bg-emerald-600 dark:bg-emerald-500 rounded-full"></span>
                    <span>Daftar Surat Al-Qur'an</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 py-0.5 px-2.5 rounded-full font-mono font-bold">114 Surah</span>
                  </h3>

                  {/* Filter Toggle for Offline Cached Surahs */}
                  <button
                    onClick={() => setOnlyShowOffline(!onlyShowOffline)}
                    className={`text-[11px] px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                      onlyShowOffline
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-500/30"
                        : cachedSurahNumbers.length > 0
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                    title={lang === "id" ? "Filter hanya surat yang tersimpan luring" : "Filter only offline cached surahs"}
                    id="btn-filter-offline-surahs"
                  >
                    <CheckCircle className={`w-3.5 h-3.5 ${onlyShowOffline ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} />
                    <span>{lang === "id" ? "Tersimpan Luring" : "Cached Offline"}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-extrabold ${onlyShowOffline ? "bg-white/20 text-white" : "bg-emerald-200/70 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200"}`}>
                      {cachedSurahNumbers.length}
                    </span>
                  </button>

                  {cardThemeMode !== "mixed" && (
                    <button
                      onClick={() => setShowSettingsModal(true)}
                      className="text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full font-medium flex items-center gap-1 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition cursor-pointer"
                      title="Ubah tema kartu di pengaturan"
                    >
                      <Palette className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        {
                          cardThemeMode === "category-location" ? "Makkiyah / Madaniyah" :
                          cardThemeMode === "category-length" ? "Berdasarkan Ayat" :
                          cardThemeMode === "emerald" ? "Emerald Sage" :
                          cardThemeMode === "teal" ? "Serene Teal" :
                          cardThemeMode === "amber" ? "Warm Amber" :
                          cardThemeMode === "slate" ? "Calm Slate" :
                          cardThemeMode === "sky" ? "Celestial Sky" :
                          cardThemeMode === "indigo" ? "Royal Indigo" : "Tema Pilihan"
                        }
                      </span>
                    </button>
                  )}
                </div>

                {/* Instant search input with smooth entrance animation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex items-center bg-white dark:bg-slate-900 rounded-full py-1.5 px-3.5 shadow-sm border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-emerald-500/30 transition-all max-w-md w-full"
                >
                  <div className="text-slate-400 shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Cari nama surat (contoh: 'Yasin', 'Al-Kahfi')..."
                    className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none text-slate-800 dark:text-slate-100 text-xs py-1 px-2.5 placeholder-slate-400 dark:placeholder-slate-500"
                    id="search-filter-input"
                  />
                  <AnimatePresence>
                    {searchFilter && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        key={`surah-count-${filteredSurahs.length}`}
                        className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 shrink-0 border border-emerald-200 dark:border-emerald-800/60 mr-1.5 whitespace-nowrap shadow-xs"
                      >
                        {filteredSurahs.length} Surat
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {searchFilter && (
                    <button
                      onClick={() => handleSearchChange("")}
                      className="p-1 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-full text-slate-400"
                      id="btn-clear-search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </motion.div>
              </div>

              {/* Loader List */}
              {loadingList && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="border border-slate-100 dark:border-slate-850 p-4 rounded-2xl flex items-center justify-between space-x-3 bg-white dark:bg-slate-900 animate-pulse">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
                        <div className="space-y-2">
                          <div className="h-4 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
                          <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                      <div className="h-5 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error Loading Surah List */}
              {listError && (
                <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 p-6 rounded-2xl text-center">
                  <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-rose-800 dark:text-rose-400">{listError}</p>
                  <button
                    onClick={fetchSurahList}
                    className="mt-3 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition"
                    id="btn-retry-list"
                  >
                    Muat Ulang
                  </button>
                </div>
              )}

              {/* Results Container with Framer Motion Fade-in and Scale */}
              <AnimatePresence mode="wait">
                {!loadingList && !listError && filteredSurahs.length === 0 && (
                  <motion.div
                    key="empty-search-state"
                    initial={{ opacity: 0, scale: 0.97, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 rounded-2xl text-center max-w-md mx-auto"
                  >
                    <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Surat Tidak Ditemukan</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Maaf, tidak ada surat yang sesuai dengan kata pencarian "{searchFilter}". Pastikan ejaan atau nomor sudah benar.
                    </p>
                    <button
                      onClick={() => setSearchFilter("")}
                      className="mt-3 text-xs text-emerald-700 hover:underline dark:text-emerald-400 font-semibold"
                      id="btn-reset-search"
                    >
                      Setel Ulang Pencarian
                    </button>
                  </motion.div>
                )}

                {!loadingList && !listError && filteredSurahs.length > 0 && (
                  <motion.div
                    key={searchFilter ? `filtered-${searchFilter}` : "all-surahs-grid"}
                    initial={{ opacity: 0, scale: 0.985, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.985, y: -6 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {filteredSurahs.map((s) => {
                      const preset = getSurahCardBg(s, cardThemeMode);
                      const artwork = getSurahArtwork(s.nomor);
                      const ArtworkIcon = artwork.icon;
                      const isCached = cachedSurahNumbers.includes(s.nomor);
                      const isCachingThis = cachingSurahNum === s.nomor;

                      return (
                        <div
                          key={s.nomor}
                          onClick={() => handleSelectSurah(s.nomor)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleSelectSurah(s.nomor);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          className={`group relative overflow-hidden text-left border hover:border-emerald-400 dark:hover:border-emerald-400 p-4 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01] transition duration-300 flex items-center justify-between cursor-pointer ${preset.card}`}
                          id={`surah-card-${s.nomor}`}
                        >
                          {/* Background Thematic Gradient & Watermark Graphic */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${artwork.bgPattern} pointer-events-none opacity-60 group-hover:opacity-100 transition duration-300`} />
                          
                          {artwork.watermarkSvg ? (
                            <div className="absolute -right-2 -bottom-2 opacity-[0.13] group-hover:opacity-[0.25] transition duration-300 pointer-events-none shrink-0">
                              {artwork.watermarkSvg}
                            </div>
                          ) : (
                            <div className="absolute -right-3 -bottom-3 opacity-[0.12] group-hover:opacity-[0.24] transition duration-300 pointer-events-none text-slate-800 dark:text-slate-100 shrink-0">
                              <ArtworkIcon className="w-20 h-20" />
                            </div>
                          )}

                          <div className="flex items-center space-x-3.5 min-w-0 z-10">
                            {/* Number design as octahedron star */}
                            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm font-display shadow-xs ${preset.num}`}>
                              {s.nomor}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-semibold text-sm text-slate-950 dark:text-white truncate font-display">
                                  {s.namaLatin}
                                </h4>
                                <ArtworkIcon 
                                  className="w-3.5 h-3.5 text-emerald-600/80 dark:text-emerald-400/80 shrink-0" 
                                  title={`Simbol Surat: ${artwork.symbolName}`} 
                                />
                                {isCached && (
                                  <span 
                                    className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-500/40 text-[9px] font-extrabold inline-flex items-center gap-0.5 shadow-2xs shrink-0"
                                    title={lang === "id" ? "Tersimpan luring (dapat dibaca tanpa koneksi internet)" : "Cached locally for offline reading"}
                                  >
                                    <CheckCircle className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                                    <span>{lang === "id" ? "Luring" : "Offline"}</span>
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {s.arti} • {s.jumlahAyat} Ayat
                              </p>
                            </div>
                          </div>

                          {/* Arabic Writing block & Cache Button */}
                          <div className="text-right z-10 shrink-0 ml-2 flex flex-col items-end gap-1">
                            <span className={`arabic-text text-lg font-bold block ${preset.arabic}`}>
                              {s.nama}
                            </span>
                            <div className="flex items-center gap-1 justify-end">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-medium ${preset.badge}`}>
                                {s.tempatTurun}
                              </span>
                              {!isCached ? (
                                <button
                                  onClick={(e) => handleCacheSurah(s.nomor, e)}
                                  disabled={isCachingThis}
                                  className="p-1 rounded-md bg-white/80 dark:bg-slate-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-300 border border-slate-200/60 dark:border-slate-700/60 transition cursor-pointer active:scale-90 shadow-2xs"
                                  title={lang === "id" ? "Unduh surat ini agar dapat dibaca luring tanpa koneksi internet" : "Cache this surah for offline reading"}
                                  id={`btn-cache-surah-${s.nomor}`}
                                >
                                  {isCachingThis ? (
                                    <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                                  ) : (
                                    <Download className="w-3 h-3" />
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => handleRemoveSurahCache(s.nomor, e)}
                                  className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 hover:bg-red-50 dark:hover:bg-red-950 text-emerald-600 dark:text-emerald-400 hover:text-red-600 dark:hover:text-red-400 border border-emerald-200/50 dark:border-emerald-800/50 hover:border-red-200 dark:hover:border-red-800 transition cursor-pointer active:scale-90 shadow-2xs"
                                  title={lang === "id" ? "Surat tersimpan luring. Klik untuk menghapus dari memori lokal" : "Stored offline. Click to clear cache"}
                                  id={`btn-uncache-surah-${s.nomor}`}
                                >
                                  <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        )}

        {/* VIEW 2: SURAH DETAIL PAGE */}
        {view === "surah" && (
          <motion.div
            key="surah"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-6"
          >
            
            {/* Navigation back and header banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                onClick={() => {
                  setView("home");
                  setActiveSurah(null);
                }}
                className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 py-1.5 px-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 transition w-fit"
                id="btn-back-home"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Daftar Surat</span>
              </button>

              {/* Prev / Next Surah selectors if detail loaded */}
              {activeSurah && (
                <div className="flex items-center space-x-2">
                  {activeSurah.suratSebelumnya && (
                    <button
                      onClick={() => handleSelectSurah(activeSurah.suratSebelumnya ? activeSurah.suratSebelumnya.nomor : 1)}
                      className="text-[11px] bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-slate-600 dark:text-slate-300 py-1.5 px-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-700 transition"
                      id="btn-prev-surah"
                    >
                      ← QS. {activeSurah.suratSebelumnya.namaLatin}
                    </button>
                  )}
                  {activeSurah.suratSelanjutnya && (
                    <button
                      onClick={() => handleSelectSurah(activeSurah.suratSelanjutnya ? activeSurah.suratSelanjutnya.nomor : 1)}
                      className="text-[11px] bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-slate-600 dark:text-slate-300 py-1.5 px-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-700 transition"
                      id="btn-next-surah"
                    >
                      QS. {activeSurah.suratSelanjutnya.namaLatin} →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Loading detailed surah banner */}
            {loadingSurah && (
              <div className="space-y-6">
                <div className="h-44 w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl animate-pulse flex flex-col justify-center items-center">
                  <div className="h-6 w-48 bg-slate-100 dark:bg-slate-800 rounded mb-2" />
                  <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>

                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl animate-pulse space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800" />
                        <div className="w-32 h-4 bg-slate-100 dark:bg-slate-800 rounded" />
                      </div>
                      <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                      <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error loading surah detail */}
            {surahError && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 p-6 rounded-2xl text-center max-w-lg mx-auto">
                <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-rose-800 dark:text-rose-400">{surahError}</p>
                <button
                  onClick={() => activeSurahNumber && fetchSurahDetail(activeSurahNumber)}
                  className="mt-3 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition"
                  id="btn-retry-surah"
                >
                  Muat Ulang
                </button>
              </div>
            )}

            {/* Render Surah Details & Verses */}
            {activeSurah && !loadingSurah && !surahError && (
              <div className="space-y-6">
                
                {/* Surah Header Card */}
                <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 md:p-8 text-white shadow-lg text-center relative overflow-hidden">
                  {getSurahArtwork(activeSurah.nomor).watermarkSvg ? (
                    <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none transform translate-x-6 -translate-y-6 shrink-0 scale-150">
                      {getSurahArtwork(activeSurah.nomor).watermarkSvg}
                    </div>
                  ) : (
                    <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none transform translate-x-6 -translate-y-6">
                      {React.createElement(getSurahArtwork(activeSurah.nomor).icon, { className: "w-56 h-56 text-white" })}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                    <span className="inline-block bg-white/10 text-emerald-200 text-[10px] font-bold tracking-widest px-3 py-1 rounded-full border border-white/5 uppercase">
                      QS. Surat Ke-{activeSurah.nomor} • {activeSurah.tempatTurun}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-emerald-700/60 text-emerald-100 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      {React.createElement(getSurahArtwork(activeSurah.nomor).icon, { className: "w-3 h-3 text-emerald-200 shrink-0" })}
                      <span>Simbol: {getSurahArtwork(activeSurah.nomor).symbolName}</span>
                    </span>

                    {/* Offline Status Badge & Save Action */}
                    {cachedSurahNumbers.includes(activeSurah.nomor) ? (
                      <div className="inline-flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 bg-emerald-500/30 text-emerald-100 text-[10px] font-extrabold px-3 py-0.5 rounded-full border border-emerald-400/40 shadow-xs">
                          <CheckCircle className="w-3 h-3 text-emerald-300" />
                          <span>{lang === "id" ? "Tersimpan Luring (Offline)" : "Available Offline"}</span>
                        </span>
                        <button
                          onClick={(e) => handleRemoveSurahCache(activeSurah.nomor, e)}
                          className="text-[10px] text-emerald-200/80 hover:text-red-200 underline cursor-pointer"
                          title={lang === "id" ? "Hapus dari memori luring" : "Remove from offline cache"}
                          id="btn-remove-surah-cache-detail"
                        >
                          {lang === "id" ? "Hapus" : "Remove"}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleCacheSurah(activeSurah.nomor, e)}
                        disabled={cachingSurahNum === activeSurah.nomor}
                        className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white text-[10px] font-bold px-3 py-0.5 rounded-full border border-white/20 transition cursor-pointer active:scale-95 shadow-xs"
                        id="btn-cache-current-surah"
                      >
                        {cachingSurahNum === activeSurah.nomor ? (
                          <RefreshCw className="w-3 h-3 animate-spin text-emerald-200" />
                        ) : (
                          <Download className="w-3 h-3 text-emerald-200" />
                        )}
                        <span>{lang === "id" ? "Simpan Luring" : "Save Offline"}</span>
                      </button>
                    )}
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">{activeSurah.namaLatin}</h2>
                  <p className="text-emerald-100 text-xs sm:text-sm mt-1">"{activeSurah.arti}" • {activeSurah.jumlahAyat} Ayat</p>
                  
                  <span className="arabic-text text-2xl sm:text-3xl font-bold text-emerald-200 block mt-3 select-none">
                    {activeSurah.nama}
                  </span>

                  {/* HTML formatted description from API */}
                  <div 
                    className="mt-4 text-[11px] text-emerald-100/80 max-w-xl mx-auto border-t border-white/10 pt-3 text-justify leading-relaxed line-clamp-3 hover:line-clamp-none transition-all duration-300 cursor-pointer"
                    title="Klik untuk lihat deskripsi lengkap"
                    dangerouslySetInnerHTML={{ __html: activeSurah.deskripsi }}
                  />

                  {/* Play full surah recitation launcher */}
                  <div className="mt-5 flex justify-center">
                    <button
                      onClick={() => handlePlaySpecificVerse(1)}
                      className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-md border border-emerald-100 cursor-pointer"
                      id="btn-play-full-surah-audio"
                    >
                      <Headphones className="w-4 h-4 text-emerald-700 animate-bounce" />
                      <span>Dengarkan Murattal Surat</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Tajweed Legend & Toggle Bar */}
                <TajweedLegendBar
                  enabled={highlightTajweed}
                  onToggle={() => {
                    setHighlightTajweed((prev) => {
                      const next = !prev;
                      localStorage.setItem("quran_tajweed_highlight", String(next));
                      triggerToast(next ? "Tajwid Berwarna diaktifkan." : "Tajwid Berwarna dinonaktifkan.");
                      return next;
                    });
                  }}
                  onOpenGuide={(ruleId) => {
                    setActiveTajweedModalRule(ruleId || null);
                    setShowTajweedModal(true);
                  }}
                />

                {/* Bismillah banner (exclude Al-Fatihah & At-Taubah, usually handled on the API side) */}
                {activeSurah.nomor !== 1 && activeSurah.nomor !== 9 && (
                  <div className="text-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
                    <p className="arabic-text text-2xl font-bold text-slate-900 dark:text-emerald-400 font-display">
                      <TajweedArabic
                        text="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                        enabled={highlightTajweed}
                        onOpenGuide={(ruleId) => {
                          setActiveTajweedModalRule(ruleId || null);
                          setShowTajweedModal(true);
                        }}
                      />
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
                    </p>
                  </div>
                )}

                {/* Verse Cards container */}
                <div className="space-y-4 pb-28">
                  {activeSurah.ayat.map((verse) => {
                    const isBookmarked = isVerseBookmarked(verse.nomorAyat);

                    return (
                      <div
                        key={verse.nomorAyat}
                        id={`verse-container-${verse.nomorAyat}`}
                        onClick={() => {
                          setActiveScrollVerse(verse.nomorAyat);
                          setVerseProgress(0);
                        }}
                        className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm transition duration-300 scroll-mt-24 relative overflow-hidden cursor-pointer ${activeScrollVerse === verse.nomorAyat ? "ring-2 ring-emerald-500/70 border-emerald-500/30 bg-emerald-50/15 dark:bg-emerald-950/10 shadow-md" : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-750"}`}
                      >
                        {/* Smooth auto-scroll progress indicator at the top of the currently active verse */}
                        {activeScrollVerse === verse.nomorAyat && (isAutoScrollPlay || (isPlayingAudio && audioVerseNumber === verse.nomorAyat)) && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800/60">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-100 ease-linear"
                              style={{ width: `${isPlayingAudio && audioVerseNumber === verse.nomorAyat ? audioProgress : verseProgress}%` }}
                            />
                          </div>
                        )}
                        {/* Verse Card Header Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 dark:border-slate-800 pb-3 mb-4">
                          <div className="flex items-center space-x-2">
                            {/* Octagon verse indicator */}
                            <span className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center font-display">
                              {verse.nomorAyat}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                              QS. {activeSurah.namaLatin} : {verse.nomorAyat}
                            </span>
                          </div>

                          {/* Quick Actions Panel */}
                          <div className="flex items-center justify-start sm:justify-end space-x-1 mt-1 sm:mt-0">
                            {/* Play Audio Recitation Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlaySpecificVerse(verse.nomorAyat);
                              }}
                              className={`p-1.5 rounded-lg transition flex items-center space-x-1 ${
                                audioVerseNumber === verse.nomorAyat && isPlayingAudio
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20"
                                  : "text-slate-400 hover:bg-slate-150 dark:hover:bg-slate-800 hover:text-slate-600"
                              }`}
                              title={audioVerseNumber === verse.nomorAyat && isPlayingAudio ? "Jeda Murattal" : "Putar Murattal"}
                              id={`btn-play-verse-${verse.nomorAyat}`}
                            >
                              {audioVerseNumber === verse.nomorAyat && isPlayingAudio ? (
                                <>
                                  <span className="flex space-x-0.5 items-end h-3 w-3 shrink-0 mb-0.5 pl-0.5">
                                    <span className="w-0.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms", animationDuration: "1s" }} />
                                    <span className="w-0.5 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms", animationDuration: "1s" }} />
                                    <span className="w-0.5 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms", animationDuration: "1s" }} />
                                  </span>
                                  <span className="text-[10px] font-bold hidden md:inline text-emerald-600 dark:text-emerald-400 pl-1">Jeda</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                                  <span className="text-[10px] font-semibold hidden md:inline text-slate-500 dark:text-slate-400">Putar</span>
                                </>
                              )}
                            </button>

                            {/* Ask AI Trigger */}
                            <button
                              onClick={() => handleAskAI(verse)}
                              className="p-1.5 hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950/30 dark:text-emerald-400 rounded-lg transition text-slate-400 flex items-center space-x-1"
                              title="Tanya Tafsir Ustadz"
                              id={`btn-ask-ai-verse-${verse.nomorAyat}`}
                            >
                              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="text-[10px] font-semibold hidden md:inline">Tanya Tafsir</span>
                            </button>

                            {/* Bookmark */}
                            <button
                              onClick={() => handleToggleBookmark(verse.nomorAyat)}
                              className={`p-1.5 rounded-lg transition ${isBookmarked ? "text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/20" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"}`}
                              title={isBookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
                              id={`btn-bookmark-verse-${verse.nomorAyat}`}
                            >
                              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                            </button>

                            {/* Copy Text */}
                            <button
                              onClick={() => handleCopyVerse(verse)}
                              className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 rounded-lg transition"
                              title="Salin Ayat & Terjemahan"
                              id={`btn-copy-verse-${verse.nomorAyat}`}
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            {/* Share */}
                            <button
                              onClick={() => handleShareVerse(verse)}
                              className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 rounded-lg transition"
                              title="Bagikan Tautan Ayat"
                              id={`btn-share-verse-${verse.nomorAyat}`}
                            >
                              <Share2 className="w-4 h-4" />
                            </button>

                            {/* Kirim via Gmail */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!user) {
                                  handleGoogleLogin().then(() => {
                                    handleOpenGmailShare(verse);
                                  });
                                } else {
                                  handleOpenGmailShare(verse);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 rounded-lg transition"
                              title="Kirim Ayat via Gmail"
                              id={`btn-gmail-verse-${verse.nomorAyat}`}
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Arabic verse text display with custom size settings and Tajweed highlighting */}
                        <div className="text-right py-4 select-none">
                          <p 
                            className={`arabic-text font-semibold text-slate-950 dark:text-white font-display tracking-wide`}
                            style={{ 
                              fontSize: fontSizeArabic === "lg" ? "1.65rem" : 
                                        fontSizeArabic === "xl" ? "2rem" : 
                                        fontSizeArabic === "2xl" ? "2.4rem" : "3.15rem",
                              lineHeight: 2.3
                            }}
                          >
                            <TajweedArabic
                              text={verse.teksArab}
                              enabled={highlightTajweed}
                              onOpenGuide={(ruleId) => {
                                setActiveTajweedModalRule(ruleId || null);
                                setShowTajweedModal(true);
                              }}
                            />
                          </p>
                        </div>

                        {/* Transliteration and Translation block */}
                        <div className="space-y-3 mt-4">
                          {showTransliteration && (
                            <p className="text-[13px] text-emerald-600 dark:text-emerald-300 font-medium italic leading-relaxed pl-3 border-l-2 border-emerald-500/50 dark:border-emerald-400">
                              {verse.teksLatin}
                            </p>
                          )}
                          <p 
                            className="text-slate-900 dark:text-white leading-relaxed text-justify tracking-wide"
                            style={{ 
                              fontSize: fontSizeTranslation === "sm" ? "0.925rem" : 
                                        fontSizeTranslation === "base" ? "1.05rem" : "1.2rem"
                            }}
                          >
                            {verse.teksIndonesia}
                          </p>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Footer Navigation within Surah */}
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm mt-8">
                  {activeSurah.suratSebelumnya ? (
                    <button
                      onClick={() => handleSelectSurah(activeSurah.suratSebelumnya ? activeSurah.suratSebelumnya.nomor : 1)}
                      className="text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-700 font-semibold py-2 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      id="btn-footer-prev-surah"
                    >
                      ← QS. {activeSurah.suratSebelumnya.namaLatin}
                    </button>
                  ) : <div />}

                  <button
                    onClick={() => {
                      setView("home");
                      setActiveSurah(null);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs text-emerald-700 hover:underline font-semibold"
                    id="btn-footer-home"
                  >
                    Daftar Surat
                  </button>

                  {activeSurah.suratSelanjutnya ? (
                    <button
                      onClick={() => handleSelectSurah(activeSurah.suratSelanjutnya ? activeSurah.suratSelanjutnya.nomor : 1)}
                      className="text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-700 font-semibold py-2 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      id="btn-footer-next-surah"
                    >
                      QS. {activeSurah.suratSelanjutnya.namaLatin} →
                    </button>
                  ) : <div />}
                </div>

              </div>
            )}

          </motion.div>
        )}

        {/* VIEW 3: BOOKMARKS PAGE */}
        {view === "bookmark" && (
          <motion.div
            key="bookmark"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setView("home")}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 mr-1"
                  id="btn-bookmark-back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Bookmark className="w-5 h-5 text-emerald-700 dark:text-emerald-400 fill-current" />
                  <span>Bookmark Saya</span>
                </h2>
              </div>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full font-mono font-semibold">
                {bookmarks.length} Ayat Tersimpan
              </span>
            </div>

            {bookmarks.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl text-center max-w-md mx-auto">
                <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 font-display">Belum ada Bookmark</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                  Sahabat belum menambahkan ayat apa pun ke bookmark. Tekan tombol ikon bendera bookmark di samping ayat saat membaca untuk menyimpannya di sini.
                </p>
                <button
                  onClick={() => setView("home")}
                  className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition shadow"
                  id="btn-bookmark-browse"
                >
                  Mulai Membaca
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bookmarks.map((b, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider block">
                        QS. {b.surahName}
                      </span>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white font-display mt-0.5">
                        QS. {b.surahName} : Ayat {b.verseNumber}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Disimpan pada: {b.addedAt}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleSelectSurah(b.surahNumber, b.verseNumber)}
                        className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-semibold rounded-xl flex items-center space-x-1 transition"
                        title="Buka Ayat"
                        id={`btn-open-bookmark-${i}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span>Buka</span>
                      </button>

                      <button
                        onClick={() => {
                          setBookmarks((prev) =>
                            prev.filter((item) => !(item.surahNumber === b.surahNumber && item.verseNumber === b.verseNumber))
                          );
                          triggerToast("Bookmark dihapus.");
                        }}
                        className="p-2 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 text-slate-400 rounded-xl transition"
                        title="Hapus Bookmark"
                        id={`btn-remove-bookmark-${i}`}
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW: PRAYER GUIDE */}
        {view === "prayer-guide" && (
          <motion.div
            key="prayer-guide"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <PrayerGuideView 
              onBack={() => setView("home")}
              onOpenAIQuestion={(promptText) => {
                setAIContext({ type: "general", query: promptText });
                setIsAIOpen(true);
              }}
            />
          </motion.div>
        )}

        {/* VIEW: DOA & HADITS */}
        {view === "doa-hadits" && (
          <motion.div
            key="doa-hadits"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <DoaHaditsView 
              onBack={() => setView("home")}
              triggerToast={triggerToast}
            />
          </motion.div>
        )}
      </AnimatePresence>

        {/* Footer Info / Meta */}
        <footer className="mt-12 mb-6 flex flex-col sm:flex-row justify-center items-center gap-4 text-[10px] text-slate-450 dark:text-slate-500 uppercase tracking-widest font-semibold border-t border-slate-200/50 dark:border-slate-800/40 pt-6">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <span>© 2026 Al-Qur'an Digital</span>
            <span>V 2.2.0-Stable</span>
          </div>
        </footer>

      </main>

      {/* Auto Scroll Floating Controls (Non-intrusive Floating Capsule) */}
      {view === "surah" && activeSurah && audioVerseNumber === null && (
        <div 
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-[95vw] sm:max-w-md"
          id="autoscroll-control-panel"
        >
          {isAutoScrollMinimized ? (
            /* Minimized Sleek Pill */
            <div className="bg-slate-900/85 dark:bg-slate-950/90 backdrop-blur-md border border-slate-700/70 rounded-full shadow-xl px-3.5 py-1.5 flex items-center space-x-3 text-white transition-all duration-300 hover:bg-slate-900">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  {isAutoScrollPlay && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isAutoScrollPlay ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-200">
                  Gulir: Ayat {activeScrollVerse || 1}
                </span>
              </div>

              {/* Quick Play/Pause */}
              <button
                onClick={() => {
                  if (activeScrollVerse === null) setActiveScrollVerse(1);
                  setIsAutoScrollPlay(!isAutoScrollPlay);
                }}
                className={`p-1.5 rounded-full text-white transition active:scale-90 cursor-pointer ${isAutoScrollPlay ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                title={isAutoScrollPlay ? "Jeda Gulir" : "Mulai Gulir"}
              >
                {isAutoScrollPlay ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
              </button>

              {/* Expand Button */}
              <button
                onClick={() => setIsAutoScrollMinimized(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Buka Kontrol Lengkap"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Full Compact Floating Capsule Bar */
            <div className="bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/70 rounded-full shadow-2xl px-3.5 py-2 flex items-center space-x-2 sm:space-x-3 text-white transition-all duration-300">
              {/* Status Indicator Dot & Label */}
              <div className="flex items-center space-x-2 shrink-0 pl-1">
                <span className="relative flex h-2 w-2">
                  {isAutoScrollPlay && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isAutoScrollPlay ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                </span>
                <div className="flex flex-col">
                  <span className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Gulir Otomatis</span>
                  <span className="text-[11px] text-slate-200 font-mono font-bold tracking-tight">
                    Ayat {activeScrollVerse || 1}
                  </span>
                </div>
              </div>

              <div className="h-5 w-[1px] bg-slate-700/80" />

              {/* Controls Group */}
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                {/* Prev Verse */}
                <button
                  onClick={() => {
                    if (activeScrollVerse && activeScrollVerse > 1) {
                      setActiveScrollVerse(activeScrollVerse - 1);
                      setVerseProgress(0);
                    }
                  }}
                  disabled={!activeScrollVerse || activeScrollVerse <= 1}
                  className="p-1 rounded-full hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition active:scale-95 cursor-pointer"
                  title="Ayat Sebelumnya"
                >
                  <SkipBack className="w-3.5 h-3.5 fill-current" />
                </button>

                {/* Play/Pause */}
                <button
                  onClick={() => {
                    if (activeScrollVerse === null) {
                      setActiveScrollVerse(1);
                    }
                    setIsAutoScrollPlay(!isAutoScrollPlay);
                  }}
                  className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white shadow-md transition-all duration-200 transform active:scale-90 cursor-pointer ${isAutoScrollPlay ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                  title={isAutoScrollPlay ? "Jeda Gulir" : "Mulai Gulir"}
                >
                  {isAutoScrollPlay ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </button>

                {/* Next Verse */}
                <button
                  onClick={() => {
                    if (activeScrollVerse && activeSurah && activeScrollVerse < activeSurah.ayat.length) {
                      setActiveScrollVerse(activeScrollVerse + 1);
                      setVerseProgress(0);
                    }
                  }}
                  disabled={!activeScrollVerse || !activeSurah || activeScrollVerse >= activeSurah.ayat.length}
                  className="p-1 rounded-full hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition active:scale-95 cursor-pointer"
                  title="Ayat Selanjutnya"
                >
                  <SkipForward className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              <div className="h-5 w-[1px] bg-slate-700/80" />

              {/* Cycle Speed Button */}
              <button
                onClick={() => {
                  const speeds = [
                    { label: "1.0x", val: 11 },
                    { label: "1.5x", val: 20 },
                    { label: "2.0x", val: 28 },
                    { label: "2.5x", val: 42 }
                  ];
                  const currentIndex = speeds.findIndex(s => s.val === autoScrollSpeed);
                  const nextIndex = (currentIndex + 1) % speeds.length;
                  setAutoScrollSpeed(speeds[nextIndex].val);
                  triggerToast(`Kecepatan Gulir: ${speeds[nextIndex].label}`);
                }}
                className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-emerald-300 border border-slate-700 transition active:scale-95 cursor-pointer"
                title="Klik untuk mengubah kecepatan gulir"
              >
                {autoScrollSpeed === 11 ? "1.0x" : autoScrollSpeed === 20 ? "1.5x" : autoScrollSpeed === 28 ? "2.0x" : "2.5x"}
              </button>

              {/* Minimize Button */}
              <button
                onClick={() => setIsAutoScrollMinimized(true)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer ml-1"
                title="Sembunyikan / Kecilkan"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Gemini AI Floating Assistant Panel */}
      <AIAssistant
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        activeContext={aiContext}
        onClearContext={() => setAIContext(null)}
      />

      {/* Global Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-100 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              id="btn-close-settings-modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center mb-4">
              <Settings className="w-5 h-5 text-emerald-700 mr-2" />
              <span>Pengaturan Tampilan</span>
            </h3>

            <div className="space-y-4 text-sm">
              {/* Tajweed Color Highlighting Option */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="pr-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold block text-slate-800 dark:text-slate-200">Tajwid Berwarna (Color Rules)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold uppercase">Tartil</span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Sorot hukum Ghunnah, Qalqalah, Ikhfa, Idgham, Mad, Iqlab dengan warna khusus
                  </span>
                  <button
                    onClick={() => {
                      setShowSettingsModal(false);
                      setActiveTajweedModalRule(null);
                      setShowTajweedModal(true);
                    }}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold mt-1 inline-flex items-center gap-1"
                  >
                    <span>Buka Panduan & Keterangan Warna Tajwid →</span>
                  </button>
                </div>
                <input
                  type="checkbox"
                  checked={highlightTajweed}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setHighlightTajweed(checked);
                    localStorage.setItem("quran_tajweed_highlight", String(checked));
                    triggerToast(checked ? "Tajwid Berwarna diaktifkan." : "Tajwid Berwarna dinonaktifkan.");
                  }}
                  className="w-4 h-4 rounded text-emerald-700 accent-emerald-700 cursor-pointer shrink-0"
                  id="settings-toggle-tajweed"
                />
              </div>

              {/* Transliteration option */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="font-semibold block text-slate-800 dark:text-slate-200">Teks Latin (Transliterasi)</span>
                  <span className="text-xs text-slate-400">Tampilkan teks latin di bawah huruf Arab</span>
                </div>
                <input
                  type="checkbox"
                  checked={showTransliteration}
                  onChange={(e) => setShowTransliteration(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-700 accent-emerald-700 cursor-pointer"
                  id="settings-toggle-transliteration"
                />
              </div>

              {/* Arabic Font Size options */}
              <div className="space-y-1.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <label className="font-semibold block text-slate-800 dark:text-slate-200">Ukuran Huruf Arab</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["lg", "xl", "2xl", "3xl"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSizeArabic(size)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition uppercase ${fontSizeArabic === size ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500/50" : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"}`}
                      id={`btn-font-arabic-${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Translation Font Size options */}
              <div className="space-y-1.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <label className="font-semibold block text-slate-800 dark:text-slate-200">Ukuran Terjemahan</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["sm", "base", "lg"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSizeTranslation(size)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition uppercase ${fontSizeTranslation === size ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500/50" : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"}`}
                      id={`btn-font-translation-${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tema Warna Kartu Surah Options */}
              <div className="space-y-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="font-semibold block text-slate-800 dark:text-slate-200">
                    Tema Warna Kartu Surah
                  </label>
                  <span className="text-[10px] bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                    Kategori & Palet
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">
                  Pilih gaya pewarnaan kartu surah berdasarkan kategori tertentu atau palet warna favorit Sahabat:
                </p>

                {/* Dynamic Category Options */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                    Mode Kategori Otomatis:
                  </span>
                  
                  {/* Mode 1: Pelangi Variatif */}
                  <button
                    onClick={() => {
                      setCardThemeMode("mixed");
                      localStorage.setItem("quran_card_theme", "mixed");
                    }}
                    className={`w-full p-2.5 text-left rounded-xl border transition flex items-center justify-between cursor-pointer ${
                      cardThemeMode === "mixed"
                        ? "bg-emerald-50/80 border-emerald-500 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-500/80 font-bold shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    id="btn-theme-mixed"
                  >
                    <div>
                      <div className="text-xs font-semibold">Pelangi Sejuk (Variatif)</div>
                      <div className="text-[10px] text-slate-400 font-normal">Kombinasi warna alami berganti secara halus</div>
                    </div>
                    <div className="flex -space-x-1 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500 border border-white dark:border-slate-900"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white dark:border-slate-900"></span>
                    </div>
                  </button>

                  {/* Mode 2: Makkiyah vs Madaniyah */}
                  <button
                    onClick={() => {
                      setCardThemeMode("category-location");
                      localStorage.setItem("quran_card_theme", "category-location");
                    }}
                    className={`w-full p-2.5 text-left rounded-xl border transition flex items-center justify-between cursor-pointer ${
                      cardThemeMode === "category-location"
                        ? "bg-emerald-50/80 border-emerald-500 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-500/80 font-bold shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    id="btn-theme-category-location"
                  >
                    <div>
                      <div className="text-xs font-semibold">Kategori Tempat Turun (Mekkah vs Madinah)</div>
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">Emas Gurun (Makkiyah) vs Hijau Kebun (Madaniyah)</div>
                    </div>
                    <div className="flex -space-x-1 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white dark:border-slate-900"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900"></span>
                    </div>
                  </button>

                  {/* Mode 3: Jumlah Ayat */}
                  <button
                    onClick={() => {
                      setCardThemeMode("category-length");
                      localStorage.setItem("quran_card_theme", "category-length");
                    }}
                    className={`w-full p-2.5 text-left rounded-xl border transition flex items-center justify-between cursor-pointer ${
                      cardThemeMode === "category-length"
                        ? "bg-emerald-50/80 border-emerald-500 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-500/80 font-bold shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    id="btn-theme-category-length"
                  >
                    <div>
                      <div className="text-xs font-semibold">Kategori Panjang Surat</div>
                      <div className="text-[10px] text-indigo-500 dark:text-indigo-400 font-normal">Sangat Panjang, Panjang, Sedang, & Pendek</div>
                    </div>
                    <div className="flex -space-x-1 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 border border-white dark:border-slate-900"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500 border border-white dark:border-slate-900"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white dark:border-slate-900"></span>
                    </div>
                  </button>
                </div>

                {/* Single Favorite Color Palette */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                    Atau Palet Warna Favorit Konsisten:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {[
                      { id: "emerald", label: "Emerald", color: "bg-emerald-500" },
                      { id: "teal", label: "Teal", color: "bg-teal-500" },
                      { id: "amber", label: "Amber", color: "bg-amber-500" },
                      { id: "slate", label: "Slate", color: "bg-stone-500" },
                      { id: "sky", label: "Sky", color: "bg-sky-500" },
                      { id: "indigo", label: "Indigo", color: "bg-indigo-500" },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setCardThemeMode(p.id);
                          localStorage.setItem("quran_card_theme", p.id);
                        }}
                        className={`py-1.5 px-1.5 rounded-xl border text-[10px] font-semibold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                          cardThemeMode === p.id
                            ? "bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500 font-bold ring-1 ring-emerald-500"
                            : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750"
                        }`}
                        id={`btn-theme-${p.id}`}
                      >
                        <span className={`w-3 h-3 rounded-full ${p.color} shadow-xs`}></span>
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Data Isolation & Privacy Section */}
              <div className="pt-1 space-y-2">
                <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 rounded-xl text-xs space-y-1">
                  <div className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <span>🔒 Privasi & Isolasi Data Visitor</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Seluruh data Anda (riwayat tadarus, bookmark, pencarian, dan percakapan Ustadz AI) disimpan secara <strong>lokal & privat</strong> di perangkat Anda. Data Anda 100% terisolasi dan tidak pernah digabungkan dengan pengunjung lain.
                  </p>
                </div>

                <button
                  onClick={handleResetAllUserData}
                  className="w-full py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl border border-red-200 dark:border-red-900/50 transition flex items-center justify-center gap-1.5"
                  id="btn-reset-user-data"
                >
                  <span>Reset Semua Data Lokal Saya</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="mt-6 w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow transition"
              id="btn-settings-close"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      )}

      {/* Tajweed Guide & Rules Modal */}
      <TajweedGuideModal
        isOpen={showTajweedModal}
        onClose={() => {
          setShowTajweedModal(false);
          setActiveTajweedModalRule(null);
        }}
        initialRuleId={activeTajweedModalRule}
      />

      {/* Floating Sparkle Assistant Launcher */}
      {!isAIOpen && (
        <button
          onClick={() => setIsAIOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 group z-30"
          id="btn-floating-ai"
        >
          <Sparkles className="w-5.5 h-5.5 group-hover:rotate-12 transition duration-300" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-28 group-hover:ml-2 font-semibold text-xs transition-all duration-300 ease-out whitespace-nowrap hidden md:inline">
            Tanya Ustadz
          </span>
        </button>
      )}

      {/* Gmail Inbox side drawer */}
      <AnimatePresence>
        {isGmailDashboardOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950 z-45"
              onClick={() => setIsGmailDashboardOpen(false)}
            />

            {/* Slide-over Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[480px] md:w-[540px] bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-slate-800"
              id="gmail-inbox-drawer"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-800 text-white rounded-tl-xl sm:rounded-none">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-emerald-700/60 rounded-lg text-emerald-300 animate-pulse">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold font-display tracking-tight text-sm">Kotak Masuk Gmail</h3>
                    <p className="text-xs text-emerald-200 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse"></span>
                      Terhubung resmi • {user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => accessToken && loadGmailInbox(accessToken, gmailSearchQuery)}
                    title="Segarkan Kotak Masuk"
                    className="p-1.5 hover:bg-emerald-700 rounded text-emerald-200 hover:text-white transition"
                    id="btn-refresh-gmail"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsGmailDashboardOpen(false)}
                    className="p-1.5 hover:bg-emerald-700 rounded text-emerald-100 hover:text-white transition"
                    id="btn-close-gmail-drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search Inbox bar */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/20">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (accessToken) loadGmailInbox(accessToken, gmailSearchQuery);
                  }}
                  className="relative flex items-center"
                >
                  <input
                    type="text"
                    placeholder="Cari pesan di kotak masuk..."
                    value={gmailSearchQuery}
                    onChange={(e) => setGmailSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-xl py-2 pl-3 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/25 text-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 p-1.5 text-slate-400 hover:text-emerald-600 transition"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Inbox list container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 dark:bg-slate-950/15">
                {isGmailLoading ? (
                  // Skeleton list
                  Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-4 rounded-xl space-y-2 animate-pulse">
                      <div className="flex justify-between items-center">
                        <div className="h-3 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
                        <div className="h-2 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
                      </div>
                      <div className="h-4 w-44 bg-slate-100 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  ))
                ) : gmailEmails.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                    <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-750 mx-auto mb-3" />
                    <p className="text-xs">Kotak masuk kosong atau tidak ada hasil pencarian.</p>
                  </div>
                ) : (
                  gmailEmails.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-4 rounded-2xl shadow-sm hover:border-emerald-500/20 dark:hover:border-emerald-500/25 transition duration-200 group relative"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 max-w-[70%] truncate">
                          {msg.fromName || msg.fromEmail}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">
                          {msg.date}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1 mb-1">
                        {msg.subject || "(Tanpa Subjek)"}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {msg.snippet}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Gmail Share Verse Modal overlay */}
      <AnimatePresence>
        {isGmailShareOpen && shareVerseTarget && (
          <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg border border-slate-100 dark:border-slate-800 shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsGmailShareOpen(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                id="btn-close-gmail-share-verse"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center mb-4">
                <Mail className="w-5 h-5 text-emerald-700 mr-2" />
                <span>Kirim Ayat via Gmail</span>
              </h3>

              <div className="space-y-4 text-xs overflow-y-auto flex-1 pr-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Penerima
                  </label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="contoh: sahabat@email.com"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/25 text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Subjek Email
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/25 text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Pratinjau Ayat
                  </label>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800 font-serif text-right space-y-2 max-h-[160px] overflow-y-auto">
                    <p className="arabic-text text-lg text-emerald-700 dark:text-emerald-400">{shareVerseTarget.verse.teksArab}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans italic text-left">"{shareVerseTarget.verse.teksIndonesia}"</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-6">
                <button
                  onClick={() => setIsGmailShareOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 text-xs font-semibold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendGmailMessage}
                  disabled={isSendingEmail || !emailTo}
                  className="w-1/2 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow transition flex items-center justify-center space-x-1.5"
                >
                  {isSendingEmail ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Kirim Sekarang</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gmail Share History Modal overlay */}
      <AnimatePresence>
        {isGmailShareHistoryOpen && (
          <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg border border-slate-100 dark:border-slate-800 shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsGmailShareHistoryOpen(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                id="btn-close-gmail-share-history"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center mb-4">
                <Mail className="w-5 h-5 text-emerald-700 mr-2" />
                <span>Kirim Laporan Tadarus via Gmail</span>
              </h3>

              <div className="space-y-4 text-xs overflow-y-auto flex-1 pr-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Penerima Laporan
                  </label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="contoh: ustadz@email.com atau email sendiri"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/25 text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Subjek Laporan
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/25 text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Pratinjau Ringkasan Riwayat
                  </label>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5 max-h-[160px] overflow-y-auto text-[11px]">
                    {Object.values(clickHistory).length === 0 ? (
                      <p className="italic text-slate-400">Belum ada data riwayat tadarus.</p>
                    ) : (
                      (Object.values(clickHistory) as any[])
                        .sort((a, b) => b.count - a.count)
                        .map((item) => (
                          <div key={item.surahNumber} className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">QS. {item.surahName}</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.count} kali dibaca</span>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-6">
                <button
                  onClick={() => setIsGmailShareHistoryOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 text-xs font-semibold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendGmailMessage}
                  disabled={isSendingEmail || !emailTo}
                  className="w-1/2 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow transition flex items-center justify-center space-x-1.5"
                >
                  {isSendingEmail ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Kirim Sekarang</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Prayer Times Drawer */}
      <PrayerTimes 
        isOpen={isPrayerTimesOpen} 
        onClose={() => setIsPrayerTimesOpen(false)} 
        triggerToast={triggerToast} 
      />

      {/* Global Quran Audio Player */}
      {view === "surah" && activeSurah && audioVerseNumber !== null && (
        <AudioPlayer
          activeSurah={activeSurah}
          audioVerseNumber={audioVerseNumber}
          isPlayingAudio={isPlayingAudio}
          selectedQari={selectedQari}
          audioProgress={audioProgress}
          isContinuousPlay={isContinuousPlay}
          currentTime={audioCurrentTime}
          duration={audioDuration}
          volume={audioVolume}
          onTogglePlay={togglePlayAudio}
          onPrevVerse={handlePrevVerseAudio}
          onNextVerse={handleNextVerseAudio}
          onSelectQari={setSelectedQari}
          onToggleContinuous={() => setIsContinuousPlay(!isContinuousPlay)}
          onClose={() => {
            setIsPlayingAudio(false);
            setAudioVerseNumber(null);
            if (audioRef.current) {
              audioRef.current.pause();
            }
          }}
          onSeek={handleSeekAudio}
          onVolumeChange={setAudioVolume}
        />
      )}

    </div>
  );
}
