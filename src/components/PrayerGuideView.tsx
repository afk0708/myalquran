import React, { useState, useEffect, useRef } from "react";
import { 
  NIAT_SHOLAT_LIST, 
  LANGKAH_SHOLAT_STEPS, 
  QUNUT_SUBUH, 
  NiatSholat, 
  LangkahSholat 
} from "../data/prayerGuideData";
import { triggerHaptic } from "../utils/haptics";
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  BookOpen, 
  Clock, 
  HelpCircle,
  Play,
  Pause,
  Info,
  Layers,
  Heart,
  Headphones,
  Radio,
  Disc,
  Music
} from "lucide-react";

export interface QariOption {
  id: string;
  name: string;
  title: string;
  equranCode: string;
  everyAyahFolder: string;
}

export const PRAYER_QARI_OPTIONS: QariOption[] = [
  { id: "alafasy", name: "Al-Afasy", title: "Syaikh Misyari Rasyid Al-Afasi", equranCode: "05", everyAyahFolder: "Alafasy_128kbps" },
  { id: "sudais", name: "As-Sudais", title: "Syaikh Abdurrahman As-Sudais", equranCode: "03", everyAyahFolder: "Abdurrahmaan_As-Sudais_192kbps" },
  { id: "dosari", name: "Al-Dosari", title: "Syaikh Yasser Al-Dosari", equranCode: "06", everyAyahFolder: "Yasser_Ad-Dussary_128kbps" },
];

interface PrayerGuideViewProps {
  onBack: () => void;
  onOpenAIQuestion?: (prompt: string) => void;
}

export default function PrayerGuideView({ onBack, onOpenAIQuestion }: PrayerGuideViewProps) {
  // Navigation mode
  const [activeTab, setActiveTab] = useState<"step-by-step" | "preparation" | "niat-list" | "dzikir-after" | "full-summary">("step-by-step");
  
  // Selected prayer for step-by-step guidance
  const [selectedPrayer, setSelectedPrayer] = useState<NiatSholat>(NIAT_SHOLAT_LIST[0]); // Default Subuh
  
  // Active step index (0 to 13)
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSynth, setSpeechSynth] = useState<SpeechSynthesis | null>(null);
  
  // Qari & Murottal MP3 Audio State
  const [selectedQari, setSelectedQari] = useState<QariOption>(PRAYER_QARI_OPTIONS[0]);
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(null);
  const [totalVerses, setTotalVerses] = useState<number>(0);
  const [activeAudioSource, setActiveAudioSource] = useState<string | null>(null);
  
  // Font Size for Arabic Text
  const [arabicFontSize, setArabicFontSize] = useState<"normal" | "medium" | "large">("medium");

  // Completed Step Checklist State
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Short Surah Switcher for Step 5 (Membaca Ayat/Surah Pendek)
  const SHORT_SURAHS = [
    {
      id: "ikhlas",
      number: 112,
      name: "Al-Ikhlas",
      versesCount: 4,
      arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ (١) اللَّهُ الصَّمَدُ (٢) لَمْ يَلِدْ وَلَمْ يُولَدْ (٣) وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ (٤)",
      latin: "Qul huwallaahu ahad. Allaahus-shamad. Lam yalid wa lam yuulad. Wa lam yakul-lahu kufuwan ahad.",
      translation: "Katakanlah (Muhammad): Dialah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorang pun yang setara dengan Dia."
    },
    {
      id: "falaq",
      number: 113,
      name: "Al-Falaq",
      versesCount: 5,
      arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (١) مِن شَرِّ مَا خَلَقَ (٢) وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ (٣) وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ (٤) وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ (٥)",
      latin: "Qul a'uudzu birabbil-falaq. Min syarri maa khalaq. Wa min syarri ghaasiqin idzaa waqab. Wa min syarrin-naffaathaati fil-'uqad. Wa min syarri haasidin idzaa hasad.",
      translation: "Katakanlah: Aku berlindung kepada Tuhan Yang Menguasai subuh, dari kejahatan makhluk-Nya, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul, dan dari kejahatan pendengki apabila ia dengki."
    },
    {
      id: "nas",
      number: 114,
      name: "An-Nas",
      versesCount: 6,
      arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ (١) مَلِكِ النَّاسِ (٢) إِلَٰهِ النَّاسِ (٣) مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ (٤) الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ (٥) مِنَ الْجِنَّةِ وَالنَّاسِ (٦)",
      latin: "Qul a'uudzu birabbin-naas. Malikin-naas. Ilaahin-naas. Min syarril-waswaasil-khannaas. Alladzii yuwaswisu fii shuduurin-naas. Minal-jinnati wan-naas.",
      translation: "Katakanlah: Aku berlindung kepada Tuhan (yang memelihara dan menguasai) manusia. Raja manusia. Sembahan manusia. Dari kejahatan (bisikan) syaitan yang biasa bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari (golongan) jin dan manusia."
    },
    {
      id: "kautsar",
      number: 108,
      name: "Al-Kautsar",
      versesCount: 3,
      arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ (١) فَصَلِّ لِرَبِّكَ وَانْحَرْ (٢) إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ (٣)",
      latin: "Innaa a'thainaakal-kautsar. Fa shalli lirabbika wan-har. Inna syaani'aka huwal-abtar.",
      translation: "Sesungguhnya Kami telah memberikan kepadamu nikmat yang banyak. Maka dirikanlah shalat karena Tuhanmu; dan berkorbanlah. Sesungguhnya orang-orang yang membenci kamu dialah yang terputus."
    }
  ];

  const [selectedShortSurah, setSelectedShortSurah] = useState(SHORT_SURAHS[0]);

  // Digital Tasbih State for Dzikir Bada Sholat
  const [tasbihCount, setTasbihCount] = useState(0);
  const [tasbihTarget, setTasbihTarget] = useState(33);
  const [activeDzikirIndex, setActiveDzikirIndex] = useState(0);

  const DZIKIR_ITEMS = [
    {
      id: "subhanallah",
      title: "Membaca Tasbih (33x)",
      arabic: "سُبْحَانَ اللَّهِ",
      latin: "Subhanallah",
      meaning: "Maha Suci Allah",
      target: 33
    },
    {
      id: "alhamdulillah",
      title: "Membaca Tahmid (33x)",
      arabic: "الْحَمْدُ لِلَّهِ",
      latin: "Alhamdulillah",
      meaning: "Segala puji bagi Allah",
      target: 33
    },
    {
      id: "allahuakbar",
      title: "Membaca Takbir (33x)",
      arabic: "اللَّهُ أَكْبَرُ",
      latin: "Allahu Akbar",
      meaning: "Allah Maha Besar",
      target: 33
    },
    {
      id: "tauhid",
      title: "Membaca Kalimat Tauhid Penutup (1x)",
      arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      latin: "Laa ilaaha illallaahu wahdahu laa syariika lah, lahul-mulku wa lahul-hamdu wa huwa 'alaa kulli syai'in qadiir.",
      meaning: "Tidak ada Tuhan melainkan Allah Sendiri, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan puji-pujian, dan Dia Maha Kuasa atas segala sesuatu.",
      target: 1
    }
  ];

  const handleTasbihIncrement = () => {
    const currentItem = DZIKIR_ITEMS[activeDzikirIndex];
    if (tasbihCount + 1 >= currentItem.target) {
      if (activeDzikirIndex < DZIKIR_ITEMS.length - 1) {
        triggerHaptic('success');
        setActiveDzikirIndex((prev) => prev + 1);
        setTasbihCount(0);
      } else {
        triggerHaptic('success');
        setTasbihCount(currentItem.target);
      }
    } else {
      triggerHaptic('light');
      setTasbihCount((prev) => prev + 1);
    }
  };

  const handleTasbihReset = () => {
    triggerHaptic('medium');
    setTasbihCount(0);
    setActiveDzikirIndex(0);
  };

  const toggleStepCompleted = (stepId: number) => {
    triggerHaptic('medium');
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto progression timer state
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoProgressSeconds, setAutoProgressSeconds] = useState(12);

  // Show Qunut Modal / Card if Subuh at step 7 (I'tidal)
  const [showQunut, setShowQunut] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      setSpeechSynth(synth);

      const handleVoices = () => {
        synth.getVoices();
      };
      handleVoices();

      if (typeof synth.addEventListener === "function") {
        synth.addEventListener("voiceschanged", handleVoices);
      } else {
        synth.onvoiceschanged = handleVoices;
      }

      return () => {
        if (typeof synth.removeEventListener === "function") {
          synth.removeEventListener("voiceschanged", handleVoices);
        }
      };
    }
  }, []);

  // Stop audio when changing steps or tab
  useEffect(() => {
    stopAllAudio();
  }, [currentStepIndex, selectedPrayer, activeTab]);

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (speechSynth) {
      speechSynth.cancel();
    }
    setIsPlayingAudio(false);
    setCurrentVerseIndex(null);
    setActiveAudioSource(null);
  };

  // Handle auto-advance timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlay) {
      timer = setInterval(() => {
        setAutoProgressSeconds((prev) => {
          if (prev <= 1) {
            handleNextStep();
            return 12;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setAutoProgressSeconds(12);
    }
    return () => clearInterval(timer);
  }, [isAutoPlay, currentStepIndex]);

  const currentStep: LangkahSholat = LANGKAH_SHOLAT_STEPS[currentStepIndex];

  // Helper to calculate estimated rakaat based on step index and total rakaat of selected prayer
  const getRakaatEstimate = (stepIdx: number, totalRakaat: number) => {
    if (stepIdx <= 3) return 1; // Niat, Takbir, Iftitah, Al-Fatihah
    if (stepIdx >= 11) return totalRakaat; // Tasyahud Akhir, Salam, Dzikir
    
    // For middle steps
    if (totalRakaat === 2) {
      if (stepIdx <= 9) return 1;
      return 2;
    } else if (totalRakaat === 3) {
      if (stepIdx <= 9) return 1;
      if (stepIdx === 10) return 2; // Tasyahud Awal
      return 3;
    } else { // 4 Rakaat
      if (stepIdx <= 9) return 1;
      if (stepIdx === 10) return 2; // Tasyahud Awal
      return 3;
    }
  };

  // Main Audio Player: Plays real Qari Murottal for Quran verses, and Tartil Qari sound for others
  const handleToggleStepAudio = (step: LangkahSholat) => {
    triggerHaptic('light');
    if (isPlayingAudio) {
      stopAllAudio();
      return;
    }

    // Check if current step corresponds to a Quran Surah with verse MP3s
    let surahNum = 0;
    let verseCount = 0;

    if (step.id === 4) {
      surahNum = 1;
      verseCount = 7;
    } else if (step.id === 5) {
      surahNum = selectedShortSurah.number;
      verseCount = selectedShortSurah.versesCount;
    }

    if (surahNum > 0) {
      playQuranVerseSequence(surahNum, 1, verseCount);
    } else {
      // For Niat (Step 1), use the specific selected prayer's Niat text
      const arabicToRead = step.id === 1 ? selectedPrayer.teksArab : step.bacaanArab;
      const latinToRead = step.id === 1 ? selectedPrayer.teksLatin : step.bacaanLatin;
      playTartilTTS(arabicToRead, latinToRead);
    }
  };

  // Play sequential Murottal verses from EveryAyah Qari CDN with fallback
  const playQuranVerseSequence = (surah: number, currentVerse: number, maxVerses: number) => {
    const surahPadded = String(surah).padStart(3, "0");
    const versePadded = String(currentVerse).padStart(3, "0");

    const everyAyahUrl = `https://everyayah.com/data/${selectedQari.everyAyahFolder}/${surahPadded}${versePadded}.mp3`;
    const equranUrl = `https://cdn.equran.id/audio-partial/${selectedQari.equranCode}/${surahPadded}${versePadded}.mp3`;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    audio.referrerPolicy = "no-referrer";

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    audio.pause();
    audio.src = everyAyahUrl;
    audio.load();

    setIsPlayingAudio(true);
    setCurrentVerseIndex(currentVerse);
    setTotalVerses(maxVerses);
    setActiveAudioSource(selectedQari.title);

    let triedFallback = false;

    audio.onended = () => {
      if (currentVerse < maxVerses) {
        playQuranVerseSequence(surah, currentVerse + 1, maxVerses);
      } else {
        setIsPlayingAudio(false);
        setCurrentVerseIndex(null);
        setActiveAudioSource(null);
      }
    };

    const handleAudioError = () => {
      if (!triedFallback) {
        triedFallback = true;
        audio.referrerPolicy = "no-referrer";
        audio.src = equranUrl;
        audio.load();
        audio.play().catch(() => {
          const textToRead = currentStep.id === 1 ? selectedPrayer.teksArab : currentStep.id === 5 ? selectedShortSurah.arabic : currentStep.bacaanArab;
          const latinToRead = currentStep.id === 1 ? selectedPrayer.teksLatin : currentStep.id === 5 ? selectedShortSurah.latin : currentStep.bacaanLatin;
          playTartilTTS(textToRead, latinToRead);
        });
      } else {
        const textToRead = currentStep.id === 1 ? selectedPrayer.teksArab : currentStep.id === 5 ? selectedShortSurah.arabic : currentStep.bacaanArab;
        const latinToRead = currentStep.id === 1 ? selectedPrayer.teksLatin : currentStep.id === 5 ? selectedShortSurah.latin : currentStep.bacaanLatin;
        playTartilTTS(textToRead, latinToRead);
      }
    };

    audio.onerror = handleAudioError;

    audio.play().catch(() => {
      handleAudioError();
    });
  };

  // High Quality Google Translate Arabic Audio Streamer with referrer bypass & fallback
  const playGoogleTranslateAudio = (arabicText: string, latinFallback?: string) => {
    if (!arabicText && !latinFallback) return;

    // Clean brackets, verse numbers, dots, and extra spaces
    const cleanText = (arabicText || "")
      .replace(/[\(\)[\],.0-9\u0660-\u0669]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText && latinFallback) {
      // Speak latin text using SpeechSynthesis if arabic text is missing
      const synth = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : speechSynth;
      if (synth) {
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(latinFallback);
        utterance.lang = "id-ID";
        utterance.rate = 0.85;
        utterance.onstart = () => {
          setIsPlayingAudio(true);
          setActiveAudioSource("Audio Reader (Latin)");
        };
        utterance.onend = () => {
          setIsPlayingAudio(false);
          setActiveAudioSource(null);
        };
        utterance.onerror = () => {
          setIsPlayingAudio(false);
          setActiveAudioSource(null);
        };
        synth.speak(utterance);
      }
      return;
    }

    if (!cleanText) return;

    // Split text into chunks of max ~170 chars on space boundaries to avoid truncation
    const maxChunkLen = 170;
    const chunks: string[] = [];
    let currentChunk = "";

    const words = cleanText.split(" ");
    for (const word of words) {
      if ((currentChunk + " " + word).trim().length <= maxChunkLen) {
        currentChunk = (currentChunk + " " + word).trim();
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = word;
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    if (chunks.length === 0) return;

    let currentChunkIdx = 0;

    const playNextChunk = () => {
      if (currentChunkIdx >= chunks.length) {
        setIsPlayingAudio(false);
        setActiveAudioSource(null);
        return;
      }

      const chunkText = chunks[currentChunkIdx];
      const encoded = encodeURIComponent(chunkText);
      // Use client=tw-ob with no-referrer for reliable Google TTS audio streaming
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=ar&client=tw-ob`;

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      const audio = audioRef.current;
      audio.referrerPolicy = "no-referrer";
      audio.pause();
      audio.src = url;
      audio.load();

      setIsPlayingAudio(true);
      setActiveAudioSource("Audio Tilawah (Tartil)");

      audio.onended = () => {
        currentChunkIdx++;
        playNextChunk();
      };

      const handleChunkError = () => {
        // If Google TTS audio streaming fails, fallback to Web Speech API
        const synth = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : speechSynth;
        if (synth && (cleanText || latinFallback)) {
          synth.cancel();
          const utterance = new SpeechSynthesisUtterance(cleanText || latinFallback || "");
          utterance.lang = "ar-SA";
          utterance.rate = 0.8;
          utterance.onstart = () => {
            setIsPlayingAudio(true);
            setActiveAudioSource("Audio Reader");
          };
          utterance.onend = () => {
            setIsPlayingAudio(false);
            setActiveAudioSource(null);
          };
          utterance.onerror = () => {
            setIsPlayingAudio(false);
            setActiveAudioSource(null);
          };
          synth.speak(utterance);
        } else {
          setIsPlayingAudio(false);
          setActiveAudioSource(null);
        }
      };

      audio.onerror = handleChunkError;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          handleChunkError();
        });
      }
    };

    playNextChunk();
  };

  // Tartil Speech Engine with Murottal style tuning
  const playTartilTTS = (arabicText: string, latinText: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const cleanArabic = (arabicText || "")
      .replace(/[\(\)[\],.0-9\u0660-\u0669]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Primary audio engine: Google Translate Arabic Audio Stream (with no-referrer bypass)
    playGoogleTranslateAudio(cleanArabic, latinText);
  };

  const handleSpeakText = (arabicText: string, latinText: string) => {
    if (isPlayingAudio) {
      stopAllAudio();
    } else {
      let cleanAr = arabicText;
      let cleanLat = latinText;
      if (cleanAr.includes("...")) {
        cleanAr = selectedPrayer.teksArab;
        cleanLat = selectedPrayer.teksLatin;
      }
      playTartilTTS(cleanAr, cleanLat);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < LANGKAH_SHOLAT_STEPS.length - 1) {
      if (currentStepIndex === LANGKAH_SHOLAT_STEPS.length - 2) {
        triggerHaptic('success');
      } else {
        triggerHaptic('light');
      }
      setCurrentStepIndex((prev) => prev + 1);
      setAutoProgressSeconds(12);
    } else {
      triggerHaptic('success');
      setIsAutoPlay(false);
    }
  };

  const handlePrevStep = () => {
    triggerHaptic('light');
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setAutoProgressSeconds(12);
    }
  };

  const handleResetSteps = () => {
    triggerHaptic('medium');
    setCurrentStepIndex(0);
    setIsAutoPlay(false);
    setAutoProgressSeconds(12);
  };

  // Icon illustration renderer
  const renderStepIcon = (iconKey: string) => {
    switch (iconKey) {
      case "stand":
        return (
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-2xl shadow-inner border border-emerald-200 dark:border-emerald-800">
            🧍
          </div>
        );
      case "takbir":
        return (
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-2xl shadow-inner border border-amber-200 dark:border-amber-800">
            🙌
          </div>
        );
      case "sedekep":
      case "read":
      case "quran-read":
        return (
          <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 flex items-center justify-center font-bold text-2xl shadow-inner border border-teal-200 dark:border-teal-800">
            🤲
          </div>
        );
      case "ruku":
        return (
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-2xl shadow-inner border border-indigo-200 dark:border-indigo-800">
            🙇‍♂️
          </div>
        );
      case "itidal":
        return (
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-2xl shadow-inner border border-emerald-200 dark:border-emerald-800">
            🧍‍♂️
          </div>
        );
      case "sujud":
        return (
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-inner border border-emerald-500">
            🧎‍♂️
          </div>
        );
      case "sit-iftirasy":
      case "tasyahud-awal":
      case "tasyahud-akhir":
        return (
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-2xl shadow-inner border border-amber-400">
            ☝️
          </div>
        );
      case "salam":
        return (
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-2xl shadow-inner border border-emerald-400">
            👋
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-2xl shadow-inner">
            ✨
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 transition-colors duration-300">
      {/* Top Header Navigation */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition active:scale-95"
            id="btn-back-prayer-guide"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-sm md:text-base font-bold bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              Pendampingan Sholat Digital
            </h1>
          </div>

          {onOpenAIQuestion && (
            <button
              onClick={() => onOpenAIQuestion("Bagaimana tata cara dan syarat sah sholat sesuai tuntunan Rasulullah SAW?")}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/80 dark:border-emerald-800/80 transition"
              id="btn-ask-ai-prayer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tanya Ustadz AI</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Banner Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 p-6 md:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Panduan Fiqih Sholat Lengkap</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-amber-300 font-serif">
                Pendampingan Sholat dari Niat sampai Salam
              </h2>
              <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed">
                Panduan praktis beribadah sholat dilengkapi audio lafal, urutan gerakan rukun sholat, teks Arab, transliterasi Latin, dan terjemahan bahasa Indonesia untuk membimbing sahabat belajar khusyuk.
              </p>
            </div>

            {/* Navigation Tab Controls */}
            <div className="flex flex-wrap md:flex-col gap-1.5 bg-slate-900/60 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setActiveTab("step-by-step")}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                  activeTab === "step-by-step"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-900/50"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
                id="tab-step-by-step"
              >
                <Layers className="w-4 h-4 text-amber-300" />
                <span>1. Panduan Langkah</span>
              </button>

              <button
                onClick={() => setActiveTab("preparation")}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                  activeTab === "preparation"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-900/50"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
                id="tab-preparation"
              >
                <Info className="w-4 h-4 text-emerald-300" />
                <span>2. Syarat & Persiapan</span>
              </button>

              <button
                onClick={() => setActiveTab("niat-list")}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                  activeTab === "niat-list"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-900/50"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
                id="tab-niat-list"
              >
                <Heart className="w-4 h-4 text-rose-300" />
                <span>3. Lafal Niat Sholat</span>
              </button>

              <button
                onClick={() => setActiveTab("dzikir-after")}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                  activeTab === "dzikir-after"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-900/50"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
                id="tab-dzikir-after"
              >
                <Disc className="w-4 h-4 text-amber-300" />
                <span>4. Dzikir & Tasbih</span>
              </button>

              <button
                onClick={() => setActiveTab("full-summary")}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                  activeTab === "full-summary"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-900/50"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
                id="tab-full-summary"
              >
                <BookOpen className="w-4 h-4 text-teal-300" />
                <span>5. Ringkasan Gerakan</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: STEP-BY-STEP PRAYER COMPANION */}
        {activeTab === "step-by-step" && (
          <div className="space-y-6">
            {/* Sholat Selector Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  Pilih Sholat yang Sedang Dijalani:
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {selectedPrayer.jumlahRakaat} Rakaat
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                {NIAT_SHOLAT_LIST.map((sholat) => (
                  <button
                    key={sholat.id}
                    onClick={() => {
                      setSelectedPrayer(sholat);
                      setCurrentStepIndex(0);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold text-center transition border ${
                      selectedPrayer.id === sholat.id
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]"
                        : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="truncate">{sholat.nama.replace("Sholat ", "")}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{sholat.jumlahRakaat} Rakaat</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Step Main Guidance Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-lg overflow-hidden transition-all">
              {/* Card Header & Progress Bar */}
              <div className="bg-slate-900 text-white p-5 md:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    {renderStepIcon(currentStep.ikonGerakan)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                          Langkah {currentStep.id} dari {LANGKAH_SHOLAT_STEPS.length}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          • {currentStep.kategoriRukun}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white mt-1">
                        {currentStep.judul}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleStepCompleted(currentStep.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
                        completedSteps.includes(currentStep.id)
                          ? "bg-emerald-500 text-white border-emerald-400 shadow-sm"
                          : "bg-slate-800/80 text-slate-300 hover:text-white border-slate-700"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                      <span>{completedSteps.includes(currentStep.id) ? "Selesai Dipraktikkan" : "Tandai Selesai"}</span>
                    </button>

                    <div className="flex items-center space-x-1 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                      <span className="text-xs text-slate-300 font-semibold">Rakaat:</span>
                      <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                        {getRakaatEstimate(currentStepIndex, selectedPrayer.jumlahRakaat)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                    style={{
                      width: `${((currentStepIndex + 1) / LANGKAH_SHOLAT_STEPS.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Deskripsi Gerakan & Petunjuk */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-emerald-500" />
                      Panduan Tata Cara Gerakan:
                    </span>
                    {currentStep.dibacaBerapaKali && (
                      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                        Frekuensi: {currentStep.dibacaBerapaKali}
                      </span>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentStep.deskripsiGerakan}
                  </p>
                </div>

                {/* Short Surah Selector if at Step 5 */}
                {currentStep.id === 5 && (
                  <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Music className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        Pilih Surah Pendek untuk Rakaat 1 atau 2:
                      </span>
                      <span className="text-[11px] text-teal-700 dark:text-teal-300 font-semibold">
                        {selectedShortSurah.name} ({selectedShortSurah.versesCount} Ayat)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SHORT_SURAHS.map((surah) => (
                        <button
                          key={surah.id}
                          onClick={() => {
                            setSelectedShortSurah(surah);
                            if (isPlayingAudio) stopAllAudio();
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition border ${
                            selectedShortSurah.id === surah.id
                              ? "bg-teal-600 text-white border-teal-500 shadow-sm"
                              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-teal-200 dark:border-teal-900 hover:border-teal-400"
                          }`}
                        >
                          {surah.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bacaan Arab & Control Audio */}
                <div className="space-y-4 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                  {/* Qari Selection Bar & Audio Trigger */}
                  <div className="space-y-3 border-b border-emerald-200/60 dark:border-emerald-900/50 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        <Headphones className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                          Suara Qari Murottal:
                        </span>
                      </div>

                      {/* Qari Options Switcher & Font Size Adjuster */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Font Size Adjuster */}
                        <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 shadow-sm">
                          <span className="text-[10px] font-bold text-slate-400 px-1">Ukuran Font:</span>
                          <button
                            onClick={() => setArabicFontSize("normal")}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              arabicFontSize === "normal" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            Biasa
                          </button>
                          <button
                            onClick={() => setArabicFontSize("medium")}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              arabicFontSize === "medium" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            Sedang
                          </button>
                          <button
                            onClick={() => setArabicFontSize("large")}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              arabicFontSize === "large" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            Besar
                          </button>
                        </div>

                        {/* Qari Options Switcher */}
                        <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 shadow-sm">
                          {PRAYER_QARI_OPTIONS.map((q) => (
                            <button
                              key={q.id}
                              onClick={() => {
                                setSelectedQari(q);
                                if (isPlayingAudio) {
                                  stopAllAudio();
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                                selectedQari.id === q.id
                                  ? "bg-emerald-600 text-white shadow-sm"
                                  : "text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300"
                              }`}
                            >
                              {q.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <button
                        onClick={() => handleToggleStepAudio(currentStep)}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                          isPlayingAudio
                            ? "bg-amber-500 hover:bg-amber-600 text-white animate-pulse"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                        title="Dengarkan Suara Tilawah Qari Murottal"
                        id="btn-play-step-audio"
                      >
                        {isPlayingAudio ? (
                          <>
                            <VolumeX className="w-4 h-4" />
                            <span>Hentikan Murottal</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4" />
                            <span>Dengarkan Tilawah ({selectedQari.name})</span>
                          </>
                        )}
                      </button>

                      {/* Animated Sound Wave Equalizer & Playing Badge */}
                      {isPlayingAudio && (
                        <div className="flex items-center space-x-2 bg-emerald-600/10 dark:bg-emerald-400/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                          <div className="flex items-end space-x-1 h-3.5">
                            <span className="w-0.5 h-3 bg-emerald-500 rounded-full animate-bounce"></span>
                            <span className="w-0.5 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-0.5 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 truncate max-w-[160px]">
                            {currentVerseIndex ? `Ayat ${currentVerseIndex}/${totalVerses}` : selectedQari.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Big Arabic Text */}
                  <div
                    className={`py-4 text-right leading-[2.3] font-serif text-slate-800 dark:text-emerald-200 dir-rtl select-text ${
                      arabicFontSize === "normal"
                        ? "text-xl md:text-2xl"
                        : arabicFontSize === "large"
                        ? "text-3xl md:text-4xl"
                        : "text-2xl md:text-3xl"
                    }`}
                  >
                    {currentStep.id === 1 
                      ? selectedPrayer.teksArab 
                      : currentStep.id === 5 
                      ? selectedShortSurah.arabic 
                      : currentStep.bacaanArab}
                  </div>

                  {/* Transliterasi Latin */}
                  <div className="space-y-1 border-t border-emerald-200/60 dark:border-emerald-900/50 pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Transliterasi Latin:
                    </span>
                    <p className="text-xs md:text-sm italic font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                      "{currentStep.id === 1 
                        ? selectedPrayer.teksLatin 
                        : currentStep.id === 5 
                        ? selectedShortSurah.latin 
                        : currentStep.bacaanLatin}"
                    </p>
                  </div>

                  {/* Terjemahan Bahasa Indonesia */}
                  <div className="space-y-1 border-t border-emerald-200/60 dark:border-emerald-900/50 pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Arti / Terjemahan:
                    </span>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {currentStep.id === 1 
                        ? selectedPrayer.terjemahan 
                        : currentStep.id === 5 
                        ? selectedShortSurah.translation 
                        : currentStep.terjemahan}
                    </p>
                  </div>
                </div>

                {/* Catatan Khusus Qunut jika Sholat Subuh & di Langkah I'tidal */}
                {selectedPrayer.id === "subuh" && currentStep.id === 7 && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Catatan Doa Qunut (Sholat Subuh Rakaat Ke-2):
                      </span>
                      <button
                        onClick={() => setShowQunut(!showQunut)}
                        className="text-xs font-bold text-amber-700 dark:text-amber-400 underline hover:text-amber-800"
                      >
                        {showQunut ? "Sembunyikan Qunut" : "Tampilkan Teks Doa Qunut"}
                      </button>
                    </div>

                    {showQunut && (
                      <div className="space-y-3 pt-2 border-t border-amber-200 dark:border-amber-800">
                        <p className="text-right text-lg md:text-xl font-serif text-slate-800 dark:text-amber-200 leading-relaxed dir-rtl">
                          {QUNUT_SUBUH.teksArab}
                        </p>
                        <p className="text-xs italic text-slate-700 dark:text-slate-300">
                          "{QUNUT_SUBUH.teksLatin}"
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          <strong>Arti:</strong> {QUNUT_SUBUH.terjemahan}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Catatan Penting Rukun */}
                {currentStep.catatanPenting && (
                  <div className="flex items-start space-x-2 text-xs text-slate-500 dark:text-slate-400 italic bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Fikih Rukun:</strong> {currentStep.catatanPenting}</span>
                  </div>
                )}

                {/* Navigation Buttons Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStepIndex === 0}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                      id="btn-prev-step"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Langkah Sebelumnya</span>
                    </button>

                    <button
                      onClick={handleResetSteps}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold transition flex items-center justify-center"
                      title="Ulangi dari Langkah Pertama"
                      id="btn-reset-steps"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Auto Progression Toggle */}
                  <button
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
                      isAutoPlay
                        ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {isAutoPlay ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
                    <span>{isAutoPlay ? `Maju Otomatis (${autoProgressSeconds}s)` : "Maju Otomatis"}</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    disabled={currentStepIndex === LANGKAH_SHOLAT_STEPS.length - 1}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-1 shadow-md shadow-emerald-900/20"
                    id="btn-next-step"
                  >
                    <span>Langkah Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Step Selector Pill Drawer */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-500" />
                Lompat Langsung ke Gerakan Sholat:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {LANGKAH_SHOLAT_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                      currentStepIndex === idx
                        ? "bg-emerald-600 text-white font-bold shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {step.id}. {step.judul.split("&")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NIAT SHOLAT COLLECTION */}
        {activeTab === "niat-list" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-500" />
                Kumpulan Lafal Niat Sholat Wajib & Sunnah
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Niat merupakan rukun pertama dalam beribadah sholat. Berikut daftar lafal niat lengkap dengan teks Arab, Latin, dan Terjemahannya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NIAT_SHOLAT_LIST.map((niat) => (
                <div
                  key={niat.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/50 transition"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        niat.kategori === "fardhu"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      }`}>
                        Sholat {niat.kategori} • {niat.jumlahRakaat} Rakaat
                      </span>
                      <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">
                        {niat.nama}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleSpeakText(niat.teksArab, niat.teksLatin)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-600 dark:text-slate-300 transition"
                      title="Dengarkan Suara Audio Niat"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {niat.deskripsi}
                  </p>

                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                    <p className="text-right text-xl font-serif text-slate-800 dark:text-emerald-200 dir-rtl leading-relaxed">
                      {niat.teksArab}
                    </p>
                    <p className="text-xs italic font-medium text-slate-700 dark:text-slate-300 border-t border-emerald-200/50 dark:border-emerald-900/40 pt-2">
                      "{niat.teksLatin}"
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <strong>Arti:</strong> {niat.terjemahan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DZIKIR & TASBIH DIGITAL BADA SHOLAT */}
        {activeTab === "dzikir-after" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Disc className="w-5 h-5 text-amber-500" />
                Tasbih & Dzikir Interaktif Bada Sholat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hitung bacaan tasbih, tahmid, takbir, dan kalimat tauhid setelah salam dengan penghitung digital interaktif.
              </p>
            </div>

            {/* Tasbih Digital Counter Main Card */}
            <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 p-6 md:p-8 rounded-3xl border border-emerald-800/50 text-white shadow-xl space-y-6">
              {/* Dzikir Item Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-emerald-800/60 pb-4">
                {DZIKIR_ITEMS.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveDzikirIndex(idx);
                      setTasbihCount(0);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center space-y-1 ${
                      activeDzikirIndex === idx
                        ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                        : "bg-slate-800/60 text-emerald-200 hover:bg-slate-800"
                    }`}
                  >
                    <span>{item.title.split("(")[0]}</span>
                    <span className="text-[10px] opacity-80">({item.target}x)</span>
                  </button>
                ))}
              </div>

              {/* Active Dzikir Display */}
              <div className="text-center space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  {DZIKIR_ITEMS[activeDzikirIndex].title}
                </span>

                <div className="py-2 text-3xl md:text-5xl font-serif text-amber-300 dir-rtl">
                  {DZIKIR_ITEMS[activeDzikirIndex].arabic}
                </div>

                <div className="text-sm font-semibold italic text-emerald-200">
                  "{DZIKIR_ITEMS[activeDzikirIndex].latin}"
                </div>

                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  {DZIKIR_ITEMS[activeDzikirIndex].meaning}
                </p>
              </div>

              {/* Big Counter Button */}
              <div className="flex flex-col items-center justify-center space-y-4 pt-2">
                <button
                  onClick={handleTasbihIncrement}
                  className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 hover:from-emerald-500 hover:to-teal-300 text-white shadow-2xl flex flex-col items-center justify-center space-y-1 border-4 border-amber-400/40 active:scale-95 transition cursor-pointer"
                  id="btn-tasbih-count"
                >
                  <span className="text-3xl md:text-5xl font-extrabold tracking-tight">
                    {tasbihCount}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                    / {DZIKIR_ITEMS[activeDzikirIndex].target} Tekan
                  </span>
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleSpeakText(DZIKIR_ITEMS[activeDzikirIndex].arabic, DZIKIR_ITEMS[activeDzikirIndex].latin)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold transition flex items-center space-x-1.5 border border-emerald-800"
                  >
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span>Dengarkan Lafal</span>
                  </button>

                  <button
                    onClick={handleTasbihReset}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center space-x-1.5 border border-slate-700"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                    <span>Reset Hitungan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FULL SUMMARY READOUT */}
        {activeTab === "full-summary" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                Ringkasan Seluruh Gerakan & Bacaan Sholat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Urutan 14 rukun sholat fardhu secara lengkap dan berurutan dari Takbiratul Ihram hingga Salam dan Dzikir penutup.
              </p>
            </div>

            <div className="space-y-4">
              {LANGKAH_SHOLAT_STEPS.map((step) => (
                <div
                  key={step.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {step.id}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {step.judul}
                        </h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {step.namaRukun}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSpeakText(step.bacaanArab, step.bacaanLatin)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-600 dark:text-slate-300 transition"
                      title="Dengarkan Audio Bacaan"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                    {step.deskripsiGerakan}
                  </p>

                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                    <p className="text-right text-lg font-serif text-slate-800 dark:text-emerald-200 dir-rtl">
                      {step.bacaanArab}
                    </p>
                    <p className="text-xs italic text-slate-700 dark:text-slate-300 border-t border-emerald-100 dark:border-emerald-900/40 pt-2">
                      "{step.bacaanLatin}"
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <strong>Arti:</strong> {step.terjemahan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
