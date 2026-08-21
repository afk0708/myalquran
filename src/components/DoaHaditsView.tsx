import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  DOA_CATEGORIES,
  HADITS_CATEGORIES,
  DOA_LIST,
  HADITS_LIST,
  DoaItem,
  HaditsItem,
} from "../data/doaHaditsData";
import { triggerHaptic } from "../utils/haptics";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Share2,
  Sparkles,
  Info,
  Heart,
  RotateCcw,
  Filter,
  Layers,
  Star,
  Bookmark,
} from "lucide-react";

interface DoaHaditsViewProps {
  onBack: () => void;
  triggerToast: (msg: string) => void;
}

export default function DoaHaditsView({ onBack, triggerToast }: DoaHaditsViewProps) {
  const [activeTab, setActiveTab] = useState<"doa" | "hadits">("doa");
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio / Speech State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Saved Favorites in LocalStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("favorit_doa_hadits");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("favorit_doa_hadits", JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [activeTab]);

  const toggleFavorite = (id: string) => {
    triggerHaptic("medium");
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      if (isFav) {
        triggerToast("Dihapus dari daftar favorit");
        return prev.filter((item) => item !== id);
      } else {
        triggerToast("Disimpan ke daftar favorit ⭐");
        return [...prev, id];
      }
    });
  };

  const handleCopy = (item: DoaItem | HaditsItem, isDoa: boolean) => {
    triggerHaptic("light");
    let textToCopy = "";
    if (isDoa) {
      const d = item as DoaItem;
      textToCopy = `🤲 *${d.title}*\n\n${d.arabic}\n\n_${d.latin}_\n\n" ${d.translation} "\n\n📌 Sumber: ${d.source}\n${d.fadhilah ? `✨ Keutamaan: ${d.fadhilah}` : ""}`;
    } else {
      const h = item as HaditsItem;
      textToCopy = `📜 *${h.title}*\n_${h.narrator}_\n\n${h.arabic}\n\n_${h.latin}_\n\n" ${h.translation} "\n\n💡 Penjelasan: ${h.explanation}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    triggerToast("Teks berhasil disalin!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (item: DoaItem | HaditsItem, isDoa: boolean) => {
    triggerHaptic("light");
    const title = isDoa ? (item as DoaItem).title : (item as HaditsItem).title;
    const text = `${item.arabic}\n\n${item.latin}\n\n"${item.translation}"`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      handleCopy(item, isDoa);
    }
  };

  // Play Audio Stream or Speech Synthesis
  const handlePlayAudio = (id: string, arabicText: string, latinText: string) => {
    triggerHaptic("light");
    if (playingId === id) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
      return;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setPlayingId(id);

    const cleanArabic = (arabicText || "")
      .replace(/[\(\)[\],.0-9\u0660-\u0669]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encoded = encodeURIComponent(cleanArabic);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=ar&client=tw-ob`;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    audio.referrerPolicy = "no-referrer";
    audio.src = audioUrl;

    const handleEnded = () => {
      setPlayingId(null);
    };

    const handleError = () => {
      const synth = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
      if (synth) {
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanArabic || latinText);
        utterance.lang = "ar-SA";
        utterance.rate = 0.8;
        utterance.onend = () => setPlayingId(null);
        utterance.onerror = () => setPlayingId(null);
        synth.speak(utterance);
      } else {
        setPlayingId(null);
      }
    };

    audio.onended = handleEnded;
    audio.onerror = handleError;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        handleError();
      });
    }
  };

  const categoriesList = activeTab === "doa" ? DOA_CATEGORIES : HADITS_CATEGORIES;

  const getCategoryCount = (catId: string) => {
    if (activeTab === "doa") {
      if (catId === "semua") return DOA_LIST.length;
      return DOA_LIST.filter((d) => d.category === catId).length;
    } else {
      if (catId === "semua") return HADITS_LIST.length;
      return HADITS_LIST.filter((h) => h.category === catId).length;
    }
  };

  const filteredDoaList = DOA_LIST.filter((item) => {
    const matchesCategory = selectedCategory === "semua" || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.fadhilah && item.fadhilah.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFav = !onlyFavorites || favorites.includes(item.id);

    return matchesCategory && matchesQuery && matchesFav;
  });

  const filteredHaditsList = HADITS_LIST.filter((item) => {
    const matchesCategory = selectedCategory === "semua" || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.narrator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = !onlyFavorites || favorites.includes(item.id);

    return matchesCategory && matchesQuery && matchesFav;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-20">
      <audio ref={audioRef} className="hidden" />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                triggerHaptic("light");
                onBack();
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all flex items-center gap-2 text-xs font-bold border border-white/15 cursor-pointer active:scale-95"
              id="btn-back-from-doa"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  triggerHaptic("light");
                  setOnlyFavorites(!onlyFavorites);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                  onlyFavorites
                    ? "bg-amber-400 text-slate-900 border-amber-300 shadow-md font-bold"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/15"
                }`}
                id="btn-filter-favorites"
              >
                <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? "fill-slate-900" : ""}`} />
                <span>Favorit ({favorites.length})</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/20 mb-2">
                <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                <span>Kumpulan Khazanah Islami</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
                Doa Sehari-hari & Hadits Pilihan
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
                Panduan doa harian lengkap dengan lafal Latin, terjemahan, keutamaan, serta hadits shahih beserta sanad dan faedahnya.
              </p>
            </div>

            {/* Main Tabs */}
            <div className="bg-slate-900/60 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md flex items-center gap-1 self-start md:self-auto shrink-0">
              <button
                onClick={() => {
                  triggerHaptic("light");
                  setActiveTab("doa");
                  setSelectedCategory("semua");
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === "doa"
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
                id="btn-tab-doa"
              >
                <span className="text-base">🤲</span>
                <span>Doa Sehari-hari</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">
                  {DOA_LIST.length}
                </span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic("light");
                  setActiveTab("hadits");
                  setSelectedCategory("semua");
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === "hadits"
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
                id="btn-tab-hadits"
              >
                <span className="text-base">📜</span>
                <span>Hadits Pilihan</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">
                  {HADITS_LIST.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Responsive Category Sidebar & Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Category Sidebar (Desktop & Tablet) */}
          <aside className="w-full lg:w-64 shrink-0 space-y-4 lg:sticky lg:top-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-xs uppercase tracking-wider">Kategori Tema</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50">
                  {categoriesList.length} Tema
                </span>
              </div>

              {/* Sidebar Navigation Items */}
              <div className="hidden lg:block space-y-1">
                {categoriesList.map((cat) => {
                  const count = getCategoryCount(cat.id);
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        triggerHaptic("light");
                        setSelectedCategory(cat.id);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between cursor-pointer group ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                      }`}
                      id={`sidebar-cat-${cat.id}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base shrink-0">{cat.icon}</span>
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 ${
                          isSelected
                            ? "bg-white/20 text-white font-bold"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Horizontal Carousel Tabs */}
              <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
                {categoriesList.map((cat) => {
                  const count = getCategoryCount(cat.id);
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        triggerHaptic("light");
                        setSelectedCategory(cat.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1.5 cursor-pointer border ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
                      }`}
                      id={`mobile-cat-btn-${cat.id}`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                          isSelected ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Theme Highlights */}
            <div className="hidden lg:block bg-gradient-to-br from-emerald-900/10 via-emerald-800/5 to-teal-900/10 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pilihan Tema Favorit</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    setActiveTab("doa");
                    setSelectedCategory("harian");
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    activeTab === "doa" && selectedCategory === "harian"
                      ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                      : "bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500"
                  }`}
                >
                  🌅 Doa Harian
                </button>
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    setActiveTab("doa");
                    setSelectedCategory("mustajab");
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    activeTab === "doa" && selectedCategory === "mustajab"
                      ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                      : "bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500"
                  }`}
                >
                  ⭐ Doa Mustajab
                </button>
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    setActiveTab("hadits");
                    setSelectedCategory("qudsi");
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    activeTab === "hadits" && selectedCategory === "qudsi"
                      ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                      : "bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500"
                  }`}
                >
                  👑 Hadits Qudsi
                </button>
              </div>
            </div>
          </aside>

          {/* Main List Area */}
          <main className="flex-1 w-full space-y-4">
            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-800">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === "doa"
                      ? "Cari doa harian (contoh: sebelum makan, keluar rumah, orang tua)..."
                      : "Cari hadits (contoh: niat, senyum, ilmu, qudsi)..."
                  }
                  className="w-full pl-10 pr-24 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                  id="input-search-doa-hadits"
                />
                <div className="absolute right-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {activeTab === "doa" ? filteredDoaList.length : filteredHaditsList.length}
                  </span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

        {/* List Grid with AnimatePresence & Staggered Motion */}
        <AnimatePresence mode="wait">
          {activeTab === "doa" ? (
            filteredDoaList.length > 0 ? (
              <motion.div
                key={`doa-grid-${selectedCategory}-${searchQuery}-${onlyFavorites}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {filteredDoaList.map((item, index) => {
                  const isFav = favorites.includes(item.id);
                  const isPlaying = playingId === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25, delay: Math.min(index * 0.035, 0.25), ease: "easeOut" }}
                      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all flex flex-col justify-between group relative overflow-hidden"
                    >
                      <div>
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-100 dark:border-emerald-900/50 mb-1">
                              {item.source}
                            </span>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                              {item.title}
                            </h3>
                          </div>

                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                              isFav
                                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200 dark:border-amber-900/50"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            }`}
                            title={isFav ? "Hapus dari favorit" : "Tambah ke favorit"}
                            id={`btn-fav-doa-${item.id}`}
                          >
                            <Heart className={`w-4 h-4 ${isFav ? "fill-amber-500" : ""}`} />
                          </button>
                        </div>

                        {/* Arabic Text */}
                        <div className="bg-emerald-50/40 dark:bg-slate-800/50 p-4 rounded-xl border border-emerald-100/50 dark:border-slate-700/50 my-3 text-right">
                          <p className="arabic-text text-xl sm:text-2xl font-bold text-slate-900 dark:text-emerald-300 leading-loose select-all">
                            {item.arabic}
                          </p>
                        </div>

                        {/* Transliteration */}
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium italic mb-2 leading-relaxed">
                          {item.latin}
                        </p>

                        {/* Translation */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                          "{item.translation}"
                        </p>

                        {/* Fadhilah */}
                        {item.fadhilah && (
                          <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-2.5 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2 mb-4">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Keutamaan: </span>
                              <span>{item.fadhilah}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Toolbar */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <button
                          onClick={() => handlePlayAudio(item.id, item.arabic, item.latin)}
                          className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                            isPlaying
                              ? "bg-emerald-600 text-white animate-pulse"
                              : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                          }`}
                          id={`btn-audio-doa-${item.id}`}
                        >
                          {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span>{isPlaying ? "Berhenti" : "Dengarkan"}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(item, true)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                            title="Salin Teks Doa"
                            id={`btn-copy-doa-${item.id}`}
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleShare(item, true)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                            title="Bagikan Doa"
                            id={`btn-share-doa-${item.id}`}
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty-doa-state"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800"
              >
                <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-700 dark:text-slate-200">Tidak Ada Doa Yang Ditemukan</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Coba sesuaikan kata kunci pencarian atau matikan filter favorit.
                </p>
              </motion.div>
            )
          ) : filteredHaditsList.length > 0 ? (
            <motion.div
              key={`hadits-grid-${selectedCategory}-${searchQuery}-${onlyFavorites}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredHaditsList.map((item, index) => {
                const isFav = favorites.includes(item.id);
                const isPlaying = playingId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.035, 0.25), ease: "easeOut" }}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 text-[10px] font-bold border border-teal-100 dark:border-teal-900/50 mb-1">
                            {item.narrator}
                          </span>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                            {item.title}
                          </h3>
                        </div>

                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                            isFav
                              ? "bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200 dark:border-amber-900/50"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          }`}
                          title={isFav ? "Hapus dari favorit" : "Tambah ke favorit"}
                          id={`btn-fav-hadits-${item.id}`}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? "fill-amber-500" : ""}`} />
                        </button>
                      </div>

                      {/* Arabic Text */}
                      <div className="bg-teal-50/40 dark:bg-slate-800/50 p-4 rounded-xl border border-teal-100/50 dark:border-slate-700/50 my-3 text-right">
                        <p className="arabic-text text-xl sm:text-2xl font-bold text-slate-900 dark:text-teal-300 leading-loose select-all">
                          {item.arabic}
                        </p>
                      </div>

                      {/* Transliteration */}
                      <p className="text-xs text-teal-700 dark:text-teal-400 font-medium italic mb-2 leading-relaxed">
                        {item.latin}
                      </p>

                      {/* Translation */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                        "{item.translation}"
                      </p>

                      {/* Explanation */}
                      <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 p-2.5 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2 mb-4">
                        <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Faedah Hadits: </span>
                          <span>{item.explanation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Toolbar */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <button
                        onClick={() => handlePlayAudio(item.id, item.arabic, item.latin)}
                        className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                          isPlaying
                            ? "bg-teal-600 text-white animate-pulse"
                            : "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50"
                        }`}
                        id={`btn-audio-hadits-${item.id}`}
                      >
                        {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{isPlaying ? "Berhenti" : "Dengarkan"}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(item, false)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                          title="Salin Teks Hadits"
                          id={`btn-copy-hadits-${item.id}`}
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleShare(item, false)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                          title="Bagikan Hadits"
                          id={`btn-share-hadits-${item.id}`}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty-hadits-state"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800"
            >
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 dark:text-slate-200">Tidak Ada Hadits Yang Ditemukan</h3>
              <p className="text-xs text-slate-400 mt-1">
                Coba sesuaikan kata kunci pencarian atau matikan filter favorit.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
