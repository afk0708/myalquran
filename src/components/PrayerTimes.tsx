import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  MapPin, 
  Compass, 
  Navigation, 
  Clock, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  Info,
  Calendar,
  ChevronDown,
  Sparkles,
  Settings,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Activity,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PrayerTimesProps {
  isOpen: boolean;
  onClose: () => void;
  triggerToast: (msg: string) => void;
}

interface Timings {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Midnight: string;
}

interface City {
  name: string;
  lat: number;
  lng: number;
}

// Major Indonesian Cities with precise coordinates for offline fallback & selection
const INDONESIAN_CITIES: City[] = [
  { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Surabaya", lat: -7.2575, lng: 112.7521 },
  { name: "Bandung", lat: -6.9175, lng: 107.6191 },
  { name: "Medan", lat: 3.5952, lng: 98.6722 },
  { name: "Bekasi", lat: -6.2383, lng: 106.9756 },
  { name: "Tangerang", lat: -6.1783, lng: 106.6319 },
  { name: "Depok", lat: -6.4025, lng: 106.7942 },
  { name: "Semarang", lat: -6.9667, lng: 110.4167 },
  { name: "Palembang", lat: -2.9761, lng: 104.7754 },
  { name: "Makassar", lat: -5.1477, lng: 119.4327 },
  { name: "Tangerang Selatan", lat: -6.2912, lng: 106.7118 },
  { name: "Bogor", lat: -6.5971, lng: 106.8060 },
  { name: "Batam", lat: 1.1301, lng: 104.0529 },
  { name: "Pekanbaru", lat: 0.5071, lng: 101.4478 },
  { name: "Bandar Lampung", lat: -5.3971, lng: 105.2663 },
  { name: "Padang", lat: -0.9471, lng: 100.4172 },
  { name: "Malang", lat: -7.9819, lng: 112.6265 },
  { name: "Denpasar", lat: -8.6705, lng: 115.2126 },
  { name: "Samarinda", lat: -0.5021, lng: 117.1536 },
  { name: "Tasikmalaya", lat: -7.3274, lng: 108.2207 },
  { name: "Banjarmasin", lat: -3.3186, lng: 114.5944 },
  { name: "Balikpapan", lat: -1.2654, lng: 116.8312 },
  { name: "Pontianak", lat: -0.0263, lng: 109.3425 },
  { name: "Jambi", lat: -1.6101, lng: 103.6131 },
  { name: "Yogyakarta", lat: -7.7956, lng: 110.3695 },
  { name: "Surakarta (Solo)", lat: -7.5667, lng: 110.8167 },
  { name: "Manado", lat: 1.4748, lng: 124.8404 },
  { name: "Mataram", lat: -8.5822, lng: 116.1167 },
  { name: "Kupang", lat: -10.1772, lng: 123.6070 },
  { name: "Ambon", lat: -3.6547, lng: 128.1906 },
  { name: "Jayapura", lat: -2.5488, lng: 140.6765 },
  { name: "Banda Aceh", lat: 5.5483, lng: 95.3238 },
  { name: "Cirebon", lat: -6.7320, lng: 108.5555 },
  { name: "Purwokerto", lat: -7.4244, lng: 109.2302 },
  { name: "Madinah (Saudi Arabia)", lat: 24.4672, lng: 39.6111 },
  { name: "Mekah (Saudi Arabia)", lat: 21.3891, lng: 39.8579 }
];

interface AdhanTrack {
  id: string;
  name: string;
  url: string;
  description: string;
}

const ADHAN_TRACKS: AdhanTrack[] = [
  { 
    id: "yusuf", 
    name: "Adzan Yusuf Islam", 
    url: "https://www.islamcan.com/audio/adhan/azan4.mp3",
    description: "Lantunan sangat lembut, tenang, dan penuh penghayatan"
  },
  { 
    id: "makkah", 
    name: "Adzan Makkah", 
    url: "https://www.islamcan.com/audio/adhan/azan1.mp3",
    description: "Lantunan klasik yang agung dari Masjidil Haram Makkah"
  },
  { 
    id: "madinah", 
    name: "Adzan Madinah", 
    url: "https://www.islamcan.com/audio/adhan/azan2.mp3",
    description: "Lantunan penuh kedamaian yang khas dari Masjid Nabawi Madinah"
  },
  { 
    id: "egypt", 
    name: "Adzan Mesir", 
    url: "https://www.islamcan.com/audio/adhan/azan3.mp3",
    description: "Lantunan maqam Bayati khas Mesir yang sangat menyentuh hati"
  }
];

export default function PrayerTimes({ isOpen, onClose, triggerToast }: PrayerTimesProps) {
  // Current coordinates (defaults to Jakarta)
  const [coords, setCoords] = useState<{ lat: number; lng: number; name: string }>({
    lat: -6.2088,
    lng: 106.8456,
    name: "Jakarta"
  });

  // Audio Reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Adhan States
  const [selectedTrackId, setSelectedTrackId] = useState<string>(() => {
    return localStorage.getItem("user_adhan_track") || "makkah";
  });
  const [activeAdhan, setActiveAdhan] = useState<string | null>(null);
  const [showAdhanModal, setShowAdhanModal] = useState<boolean>(false);
  const [showDoaModal, setShowDoaModal] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem("user_adhan_volume");
    return saved !== null ? parseFloat(saved) : 1.0;
  });

  // App States
  const [timings, setTimings] = useState<Timings | null>(null);
  const [hijriDate, setHijriDate] = useState<string>("");
  const [gregorianDate, setGregorianDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [locationType, setLocationType] = useState<"gps" | "manual" | "default">("default");
  const [searchCityQuery, setSearchCityQuery] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [calculationMethod, setCalculationMethod] = useState<number>(20); // 20 = Kemenag RI, 3 = MWL, etc.

  // Countdown State
  const [countdown, setCountdown] = useState<{
    label: string;
    timeStr: string;
    remaining: string;
    percentage: number; // For progress bar representation
  } | null>(null);

  // Tick the clock and update countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update dates on load
  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setGregorianDate(new Date().toLocaleDateString('id-ID', options));
  }, []);

  // Load saved location preferences on mount
  useEffect(() => {
    const savedCoords = localStorage.getItem("user_prayer_coords");
    const savedLocType = localStorage.getItem("user_prayer_loc_type");
    const savedMethod = localStorage.getItem("user_prayer_method");

    if (savedMethod) {
      setCalculationMethod(parseInt(savedMethod));
    }

    if (savedCoords) {
      try {
        const parsed = JSON.parse(savedCoords);
        setCoords(parsed);
        if (savedLocType) {
          setLocationType(savedLocType as any);
        }
      } catch (e) {
        console.error("Failed to load saved coordinates", e);
      }
    } else {
      // Prompt for geolocation once drawer opens or is detected
      attemptGPSLocation(true);
    }
  }, []);

  // Fetch timings when coordinates or method changes
  useEffect(() => {
    fetchPrayerTimes(coords.lat, coords.lng, calculationMethod);
  }, [coords.lat, coords.lng, calculationMethod]);

  // Recalculate countdown every second when timings or currentTime change
  useEffect(() => {
    if (!timings) return;

    const now = currentTime;
    const prayerItems = [
      { name: "Imsak", label: "Imsak", time: timings.Imsak },
      { name: "Fajr", label: "Subuh", time: timings.Fajr },
      { name: "Sunrise", label: "Terbit", time: timings.Sunrise },
      { name: "Dhuhr", label: "Dzuhur", time: timings.Dhuhr },
      { name: "Asr", label: "Ashar", time: timings.Asr },
      { name: "Maghrib", label: "Maghrib", time: timings.Maghrib },
      { name: "Isha", label: "Isya", time: timings.Isha },
    ];

    let nextPrayer: { label: string; timeStr: string; date: Date; name: string } | null = null;
    let minDiff = Infinity;
    let previousPrayerDate: Date | null = null;

    // Parse all today
    const parsedPrayers = prayerItems.map(item => {
      const [h, m] = item.time.split(":").map(Number);
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
      return { ...item, date: d };
    });

    // Find chronological next
    for (const item of parsedPrayers) {
      let diff = item.date.getTime() - now.getTime();
      if (diff <= 0) {
        // Already passed today, checking tomorrow
        const tomDate = new Date(item.date.getTime() + 24 * 60 * 60 * 1000);
        const tomDiff = tomDate.getTime() - now.getTime();
        if (tomDiff < minDiff) {
          minDiff = tomDiff;
          nextPrayer = { label: item.label, timeStr: item.time, date: tomDate, name: item.name };
        }
      } else {
        // Upcoming today
        if (diff < minDiff) {
          minDiff = diff;
          nextPrayer = { label: item.label, timeStr: item.time, date: item.date, name: item.name };
        }
      }
    }

    if (nextPrayer) {
      const totalSecs = Math.floor(minDiff / 1000);
      const h = Math.floor(totalSecs / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;

      const remainingFormatted = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

      // Calculate approximate duration of active prayer interval to show a progress percentage
      // For a beautiful aesthetic, let's say the full interval is roughly 3-4 hours (14400 secs)
      const intervalSecs = 4 * 3600; // 4 hours standard fallback
      const elapsed = Math.max(0, intervalSecs - totalSecs);
      const percentage = Math.min(100, Math.max(0, (elapsed / intervalSecs) * 100));

      setCountdown({
        label: nextPrayer.label,
        timeStr: nextPrayer.timeStr,
        remaining: remainingFormatted,
        percentage
      });
    }
  }, [timings, currentTime]);

  // Sync audio element volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Background check for exact prayer time matches to play automatic Adhan
  useEffect(() => {
    if (!timings) return;

    const prayersToCheck = [
      { name: "Subuh", time: timings.Fajr },
      { name: "Dzuhur", time: timings.Dhuhr },
      { name: "Ashar", time: timings.Asr },
      { name: "Maghrib", time: timings.Maghrib },
      { name: "Isya", time: timings.Isha }
    ];

    const currentHHMM = currentTime.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const todayStr = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });

    prayersToCheck.forEach((prayer) => {
      if (!prayer.time) return;

      // Clean the time format if it contains any timezone info
      const cleanTime = prayer.time.split(" ")[0];

      if (currentHHMM === cleanTime) {
        const uniqueId = `played_${todayStr}_${prayer.name}`;
        const hasPlayed = localStorage.getItem(uniqueId);

        if (!hasPlayed && !showAdhanModal && !showDoaModal) {
          // Mark as played to prevent repeat triggering in the same minute
          localStorage.setItem(uniqueId, "true");
          // Trigger Adhan automatically
          startAdhanAlarm(prayer.name);
        }
      }
    });
  }, [currentTime, timings]);

  const startAdhanAlarm = (prayerName: string, isTest = false) => {
    setActiveAdhan(prayerName);
    setShowAdhanModal(true);
    setShowDoaModal(false);
    setIsTestMode(isTest);

    const track = ADHAN_TRACKS.find(t => t.id === selectedTrackId) || ADHAN_TRACKS[0];

    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.volume = volume;
      audioRef.current.load();

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          setIsAutoplayBlocked(false);
          triggerToast(`Adzan ${prayerName} dimulai secara otomatis.`);
        }).catch((error) => {
          console.warn("Autoplay was blocked by the browser. Waiting for user interaction.", error);
          setIsPlaying(false);
          setIsAutoplayBlocked(true);
        });
      }
    }
  };

  const handleUnblockAutoplay = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsAutoplayBlocked(false);
        })
        .catch(err => {
          console.error("Gagal memulai audio setelah interaksi user", err);
          triggerToast("Gagal memutar audio. Silakan coba klik tombol Putar lagi.");
        });
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setIsAutoplayBlocked(false);
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  };

  const changeAdhanTrack = (trackId: string) => {
    setSelectedTrackId(trackId);
    localStorage.setItem("user_adhan_track", trackId);
    triggerToast(`Suara adzan diubah ke: ${ADHAN_TRACKS.find(t => t.id === trackId)?.name}`);
    
    // If adhan is currently playing, switch the live source
    if (showAdhanModal && audioRef.current) {
      const track = ADHAN_TRACKS.find(t => t.id === trackId);
      if (track) {
        const wasPlaying = isPlaying;
        audioRef.current.src = track.url;
        audioRef.current.load();
        if (wasPlaying) {
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              setIsPlaying(false);
              setIsAutoplayBlocked(true);
            });
        }
      }
    }
  };

  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
    localStorage.setItem("user_adhan_volume", newVolume.toString());
  };

  const forceStopAdhan = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setShowAdhanModal(false);
    setShowDoaModal(false);
    triggerToast("Alarm adzan diberhentikan paksa.");
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioDurationChange = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setShowAdhanModal(false);
    // Automatically transition to Doa Setelah Adzan screen
    setShowDoaModal(true);
  };

  const handleCloseDoaModal = () => {
    setShowDoaModal(false);
    setActiveAdhan(null);
    setIsTestMode(false);
    triggerToast("Semoga ibadah sholat kita diterima Allah SWT. Aamiin.");
  };

  const fetchPrayerTimes = async (latitude: number, longitude: number, methodId: number) => {
    setIsLoading(true);
    try {
      // Fetch Aladhan Timings API
      const todayTimestamp = Math.floor(Date.now() / 1000);
      const url = `https://api.aladhan.com/v1/timings/${todayTimestamp}?latitude=${latitude}&longitude=${longitude}&method=${methodId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Gagal mengambil data dari server");
      
      const json = await response.json();
      if (json.code === 200 && json.data) {
        setTimings(json.data.timings);
        
        // Formulate Hijri Date
        const hijri = json.data.date.hijri;
        const formattedHijri = `${hijri.day} ${hijri.month.ar} (${hijri.month.en}) ${hijri.year} H`;
        setHijriDate(formattedHijri);
      }
    } catch (err) {
      console.error(err);
      triggerToast("Gagal memuat jadwal sholat. Periksa koneksi internet.");
    } finally {
      setIsLoading(false);
    }
  };

  const attemptGPSLocation = (silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) triggerToast("Browser Anda tidak mendukung layanan lokasi (GPS).");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode or fetch coordinate's timezone name via free lookup,
        // or just label it as "Lokasi Anda (GPS)"
        const newCoords = {
          lat: latitude,
          lng: longitude,
          name: "Lokasi Anda (GPS)"
        };

        setCoords(newCoords);
        setLocationType("gps");
        localStorage.setItem("user_prayer_coords", JSON.stringify(newCoords));
        localStorage.setItem("user_prayer_loc_type", "gps");
        if (!silent) triggerToast("Lokasi GPS berhasil didapatkan.");
      },
      (error) => {
        console.warn("Geolocation permission error/denied", error);
        if (!silent) {
          if (error.code === error.PERMISSION_DENIED) {
            triggerToast("Izin lokasi ditolak. Silakan pilih kota secara manual.");
          } else {
            triggerToast("Gagal mendeteksi lokasi GPS Anda.");
          }
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const selectCityManual = (city: City) => {
    const newCoords = {
      lat: city.lat,
      lng: city.lng,
      name: city.name
    };
    setCoords(newCoords);
    setLocationType("manual");
    localStorage.setItem("user_prayer_coords", JSON.stringify(newCoords));
    localStorage.setItem("user_prayer_loc_type", "manual");
    setShowCityDropdown(false);
    setSearchCityQuery("");
    triggerToast(`Jadwal sholat diubah ke kota: ${city.name}`);
  };

  const handleMethodChange = (method: number) => {
    setCalculationMethod(method);
    localStorage.setItem("user_prayer_method", method.toString());
    triggerToast("Metode perhitungan jadwal sholat berhasil diubah.");
  };

  const filteredCities = INDONESIAN_CITIES.filter(city => 
    city.name.toLowerCase().includes(searchCityQuery.toLowerCase())
  );

  // Check which prayer is active/highlighted right now
  const isPrayerActiveNow = (prayerTimeStr: string, nextPrayerTimeStr: string | undefined): boolean => {
    if (!prayerTimeStr) return false;
    const nowStr = currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    if (!nextPrayerTimeStr) return false;
    return nowStr >= prayerTimeStr && nowStr < nextPrayerTimeStr;
  };

  return (
    <>
      <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-45"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-slate-50 dark:bg-slate-900 shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-slate-800"
            id="prayer-times-drawer"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-tl-2xl sm:rounded-none flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-700/50 rounded-xl text-emerald-300">
                  <Compass className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-sm tracking-tight">Jadwal Sholat & Waktu Salat</h3>
                  <div className="flex items-center space-x-1.5 text-[10px] text-emerald-100/90 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate max-w-[200px]">{coords.name}</span>
                    <span className="opacity-60">•</span>
                    <span className="capitalize">{locationType === "gps" ? "GPS Otomatis" : locationType === "manual" ? "Manual" : "Bawaan"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => fetchPrayerTimes(coords.lat, coords.lng, calculationMethod)}
                  title="Segarkan Jadwal"
                  className="p-1.5 hover:bg-emerald-700/60 rounded-lg text-emerald-200 hover:text-white transition"
                  id="btn-refresh-prayer-times"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-emerald-700/60 rounded-lg text-emerald-100 hover:text-white transition"
                  id="btn-close-prayer-drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Container (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* Info alert if using default coordinates */}
              {locationType === "default" && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl flex items-start space-x-2 text-[11px] text-amber-800 dark:text-amber-300">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Menggunakan Jadwal Default (Jakarta).</span> Klik tombol GPS di bawah atau cari kota Anda untuk mendapatkan jadwal salat yang akurat sesuai lokasi asli Anda.
                  </div>
                </div>
              )}

              {/* Countdown & Live Clock Widget (Muslim Pro Style) */}
              <div className="bg-gradient-to-br from-emerald-850 to-teal-950 dark:from-slate-950 dark:to-emerald-950 text-white rounded-3xl p-5 shadow-lg border border-emerald-800/20 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute -right-12 -bottom-12 opacity-[0.06] pointer-events-none">
                  <Compass className="w-48 h-48" />
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] text-emerald-250 font-semibold uppercase tracking-widest flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {gregorianDate}
                    </p>
                    <p className="text-xs font-medium text-emerald-300 mt-1">
                      {hijriDate || "Memuat Tanggal Hijriah..."}
                    </p>
                  </div>

                  {/* Jam Digital */}
                  <div className="bg-emerald-800/40 dark:bg-slate-900/60 backdrop-blur-sm border border-emerald-700/30 dark:border-slate-850 py-1 px-2.5 rounded-xl text-center">
                    <span className="font-mono text-xs font-bold text-emerald-300 tracking-wider">
                      {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
                    </span>
                  </div>
                </div>

                {countdown ? (
                  <div className="mt-2 space-y-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block">Mendekati Waktu</span>
                        <h4 className="text-2xl font-black tracking-tight mt-0.5 flex items-center gap-1 text-emerald-100">
                          {countdown.label} 
                          <span className="text-sm font-medium opacity-75">({countdown.timeStr})</span>
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Sisa Waktu</span>
                        <span className="font-mono text-xl font-extrabold text-amber-300 tracking-wider">
                          -{countdown.remaining}
                        </span>
                      </div>
                    </div>

                    {/* Simple Progress Bar */}
                    <div className="h-1.5 w-full bg-emerald-950/50 dark:bg-slate-900/70 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${countdown.percentage}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-amber-300"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-emerald-200 text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Menghitung sisa waktu salat...
                  </div>
                )}
              </div>

              {/* Location Controls (GPS & Manual Select) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => attemptGPSLocation(false)}
                  className="flex items-center justify-center space-x-1.5 p-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl transition text-xs font-bold text-emerald-800 dark:text-emerald-400"
                  id="btn-prayer-gps"
                >
                  <Navigation className="w-3.5 h-3.5 rotate-45 shrink-0" />
                  <span>GPS Otomatis</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-750 rounded-2xl transition text-xs font-bold text-slate-700 dark:text-slate-300"
                    id="btn-prayer-manual-city"
                  >
                    <span className="truncate">Pilih Kota</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${showCityDropdown ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {showCityDropdown && (
                      <>
                        <div className="fixed inset-0 z-35" onClick={() => setShowCityDropdown(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-40 p-2 text-xs flex flex-col max-h-60"
                        >
                          {/* Search bar inside dropdown */}
                          <div className="relative mb-2 shrink-0">
                            <input
                              type="text"
                              placeholder="Cari nama kota..."
                              value={searchCityQuery}
                              onChange={(e) => setSearchCityQuery(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl py-1.5 pl-7 pr-3 text-[11px] text-slate-800 dark:text-slate-200 focus:outline-none"
                            />
                            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
                          </div>

                          <div className="overflow-y-auto flex-1 space-y-0.5 scrollbar-thin">
                            {filteredCities.length === 0 ? (
                              <p className="text-center py-3 text-[10px] text-slate-400">Kota tidak ditemukan</p>
                            ) : (
                              filteredCities.map(city => (
                                <button
                                  key={city.name}
                                  onClick={() => selectCityManual(city)}
                                  className={`w-full text-left px-2.5 py-2 rounded-lg transition ${coords.name === city.name ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                                >
                                  {city.name}
                                </button>
                              ))
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Prayer Times List (Muslim Pro Style) */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
                  Jadwal Waktu Sholat Hari Ini
                </h4>

                {isLoading || !timings ? (
                  // Loader skeleton
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-14 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[
                      { name: "Imsak", label: "Imsak", time: timings.Imsak, nextTime: timings.Fajr },
                      { name: "Fajr", label: "Subuh", time: timings.Fajr, nextTime: timings.Sunrise },
                      { name: "Sunrise", label: "Terbit", time: timings.Sunrise, nextTime: timings.Dhuhr },
                      { name: "Dhuhr", label: "Dzuhur", time: timings.Dhuhr, nextTime: timings.Asr },
                      { name: "Asr", label: "Ashar", time: timings.Asr, nextTime: timings.Maghrib },
                      { name: "Maghrib", label: "Maghrib", time: timings.Maghrib, nextTime: timings.Isha },
                      { name: "Isha", label: "Isya", time: timings.Isha, nextTime: "24:00" },
                    ].map((item) => {
                      const isActive = isPrayerActiveNow(item.time, item.nextTime);
                      const isNext = countdown?.label === item.label;

                      return (
                        <div
                          key={item.name}
                          className={`flex justify-between items-center px-4 py-3.5 rounded-2xl transition duration-300 border ${
                            isActive 
                              ? "bg-emerald-500/10 border-emerald-500/40 dark:bg-emerald-950/20 dark:border-emerald-500/30 shadow-sm"
                              : isNext
                              ? "bg-amber-500/5 border-amber-500/20 dark:bg-amber-950/10 dark:border-amber-500/20"
                              : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-xl transition-colors ${
                              isActive
                                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                : isNext
                                ? "bg-amber-500 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                            }`}>
                              <Clock className="w-4 h-4" />
                            </div>
                            <div>
                              <span className={`text-xs font-bold ${isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-800 dark:text-slate-250"}`}>
                                {item.label}
                              </span>
                              {isActive && (
                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                                  Sedang Berlangsung
                                </span>
                              )}
                              {isNext && (
                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                                  Berikutnya
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className={`font-mono font-black text-sm tracking-wider ${
                              isActive 
                                ? "text-emerald-600 dark:text-emerald-400" 
                                : isNext
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-slate-800 dark:text-slate-250"
                            }`}>
                              {item.time}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">WIB</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Settings / Configuration (Automatic Adhan Alarm) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2">
                  <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                    <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span className="text-xs font-bold">Alarm Adzan Otomatis</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Aktif Otomatis
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                  Lantunan adzan merdu akan berkumandang otomatis saat memasuki waktu sholat <b>Subuh, Dzuhur, Ashar, Maghrib, dan Isya</b>. Layar akan terkunci sampai adzan selesai untuk menghormati panggilan ibadah.
                </p>

                {/* Track Selector */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Pilih Suara Adzan
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {ADHAN_TRACKS.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => changeAdhanTrack(track.id)}
                        className={`text-left p-2.5 rounded-xl transition border text-xs flex items-center justify-between ${
                          selectedTrackId === track.id
                            ? "bg-emerald-50/60 dark:bg-emerald-950/25 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 shadow-xs"
                            : "bg-slate-50/60 dark:bg-slate-850/40 border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className={`p-1.5 rounded-lg ${selectedTrackId === track.id ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
                            <Volume2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-[11px]">{track.name}</p>
                            <p className="text-[9px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">{track.description}</p>
                          </div>
                        </div>
                        {selectedTrackId === track.id && (
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume Slider */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>Volume Alarm</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">{Math.round(volume * 100)}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => changeVolume(volume > 0 ? 0 : 0.8)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => changeVolume(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 dark:accent-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Trial Button */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <button
                    onClick={() => startAdhanAlarm("Dzuhur", true)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/25 transition duration-300 flex items-center justify-center space-x-2"
                  >
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>Uji Coba Alarm Adzan (Tes)</span>
                  </button>
                </div>
              </div>

              {/* Settings / Configuration (Calculation Methods) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                  <Settings className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold">Metode Perhitungan</span>
                </div>
                
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                  Pilih metode penghitungan waktu astronomis salat yang paling sesuai untuk wilayah Anda.
                </p>

                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { id: 20, name: "Kementerian Agama RI (Indonesia)" },
                    { id: 3, name: "Muslim World League (MWL)" },
                    { id: 2, name: "Islamic Society of North America (ISNA)" },
                    { id: 4, name: "Umm al-Qura University, Makkah" },
                    { id: 11, name: "Majlis Ugama Islam Singapura (MUIS)" }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleMethodChange(method.id)}
                      className={`text-left px-3 py-2 text-[11px] rounded-xl transition flex items-center justify-between ${calculationMethod === method.id ? "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 border border-transparent"}`}
                    >
                      <span>{method.name}</span>
                      {calculationMethod === method.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer / Info */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Al-Qur'an Digital & Prayer Times
              </span>
              <span>Kemenag RI • Aladhan API</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Hidden audio element for Adhan Playback */}
    <audio
      ref={audioRef}
      onTimeUpdate={handleAudioTimeUpdate}
      onDurationChange={handleAudioDurationChange}
      onEnded={handleAudioEnded}
      preload="auto"
    />

    {/* Full screen unclosable Adhan Playback Overlay */}
    <AnimatePresence>
      {showAdhanModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950 z-[9999] p-4 sm:p-6 md:p-12 text-white overflow-y-auto flex flex-col justify-center items-center"
        >
          {/* Subtle geometric star pattern in the background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none bg-radial-gradient from-emerald-500/40 to-transparent bg-cover" />

          {/* Centered responsive container */}
          <div className="relative flex flex-col justify-between w-full max-w-lg min-h-[90vh] md:min-h-0 md:max-h-screen gap-4 sm:gap-6 z-10 py-2">
            
            {/* Top Info Header */}
            <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-950/80 border border-emerald-500/30 rounded-xl text-emerald-400 animate-pulse">
                  <Compass className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h2 className="font-bold font-display text-xs sm:text-sm tracking-tight text-slate-100">Tadarus Al-Qur'an Digital</h2>
                  <p className="text-[10px] text-slate-400 leading-none mt-1">{coords.name} • {gregorianDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 text-[10px] sm:text-xs font-bold text-slate-400 bg-slate-900/60 px-3 py-1.5 border border-white/5 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>{currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} WIB</span>
              </div>
            </div>

            {/* Core Visualizer & Active Prayer Name */}
            <div className="flex-1 flex flex-col items-center justify-center py-4 text-center max-w-md mx-auto space-y-4">
              {/* Pulsing visual halo */}
              <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 flex items-center justify-center flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping duration-[3s]" />
                <div className="absolute inset-2 sm:inset-4 rounded-full bg-emerald-500/10 animate-pulse duration-[2s]" />
                <div className="absolute inset-4 sm:inset-8 rounded-full bg-emerald-500/20 border border-emerald-500/20" />
                <div className="relative p-5 sm:p-7 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full shadow-2xl shadow-emerald-500/20 flex items-center justify-center text-white border border-emerald-400/20">
                  <Moon className="w-10 h-10 sm:w-16 sm:h-16 animate-bounce duration-[4s]" />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                  {isTestMode ? "Uji Coba Panggilan" : "Panggilan Ibadah"}
                </span>
                <h1 className="font-black text-xl sm:text-2xl md:text-3xl font-display tracking-tight text-white leading-tight">
                  Waktu Sholat {activeAdhan} Telah Tiba
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-400 max-w-xs mx-auto leading-relaxed px-2">
                  "Sesungguhnya shalat itu adalah kewajiban yang ditentukan waktunya atas orang-orang yang beriman." (QS. An-Nisa: 103)
                </p>
              </div>

              {/* Track Info */}
              <div className="px-3 py-1 bg-slate-900/60 border border-white/5 rounded-full text-[9px] sm:text-[10px] text-slate-400 font-bold">
                Suara: {ADHAN_TRACKS.find(t => t.id === selectedTrackId)?.name}
              </div>

              {/* Browser Autoplay Interstitial */}
              {isAutoplayBlocked && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl max-w-xs sm:max-w-sm mt-2 animate-bounce"
                >
                  <div className="flex items-start space-x-2 text-left">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold text-amber-400 leading-none">Audio Autoplay Diblokir</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-300 leading-relaxed">Browser Anda memblokir pemutaran suara otomatis. Klik tombol di bawah untuk mengaktifkan adzan secara manual.</p>
                      <button
                        onClick={handleUnblockAutoplay}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-[10px] font-black transition duration-200 shadow shadow-amber-500/20"
                      >
                        Aktifkan Suara Adzan
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Bottom Audio Controller */}
            <div className="bg-slate-900/40 border border-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full space-y-3 sm:space-y-4">
              {/* Slider progress bar */}
              <div className="space-y-1">
                <div className="w-full flex justify-between text-[9px] sm:text-[10px] font-mono text-slate-400">
                  <span>
                    {Math.floor(audioCurrentTime / 60)}:{(Math.floor(audioCurrentTime % 60)).toString().padStart(2, "0")}
                  </span>
                  <span>
                    {audioDuration ? `${Math.floor(audioDuration / 60)}:${(Math.floor(audioDuration % 60)).toString().padStart(2, "0")}` : "--:--"}
                  </span>
                </div>
                <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-emerald-500 rounded-full transition-all duration-100" 
                    style={{ width: `${audioDuration ? (audioCurrentTime / audioDuration) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Play controls & volume slider - Re-architected for Portrait/Mobile Finger-friendly */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-1">
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlayPause}
                    disabled={isAutoplayBlocked}
                    className="p-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 rounded-full shadow-lg shadow-emerald-500/15 transition duration-200 flex-shrink-0"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950 ml-0.5" />}
                  </button>

                  {/* Volume Slider */}
                  <div className="flex-1 flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => changeVolume(parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Stop button fits beautifully on portrait stacks */}
                <button
                  onClick={forceStopAdhan}
                  className="w-full sm:w-auto py-2 px-4 bg-red-500/10 hover:bg-red-600 hover:text-white border border-red-500/20 hover:border-red-600 rounded-xl text-[10px] font-black tracking-wider uppercase transition duration-200 text-center text-red-400"
                >
                  Hentikan Alarm
                </button>
              </div>

              <p className="text-[8px] sm:text-[9px] text-center text-slate-500 uppercase tracking-widest font-black leading-none pt-1">
                Overlay Menghormati Waktu Shalat
              </p>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Doa Setelah Adzan Modal */}
    <AnimatePresence>
      {showDoaModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 text-slate-850 dark:text-white shadow-2xl relative overflow-hidden"
          >
            {/* Top decorative element */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700" />

            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold font-display text-lg tracking-tight">Do'a Setelah Adzan</h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Membaca doa setelah adzan memiliki keutamaan syafaat di hari kiamat.</p>
              </div>

              {/* Arabic translation */}
              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-4 text-center">
                <p className="font-arabic text-xl md:text-2xl leading-loose font-medium text-slate-900 dark:text-emerald-150 py-2 antialiased direction-rtl" lang="ar">
                  اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ
                </p>

                {/* Latin */}
                <p className="text-xs italic text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                  "Allahumma rabba hadzihid-da'watit-tammah, wash-shalatil-qa'imah, ati Muhammadanil-wasilata wal-fadhilah, wab'atshu maqamam-mahmudanil-ladzi wa'adtah."
                </p>

                {/* Divider */}
                <div className="border-t border-slate-100 dark:border-slate-800" />

                {/* Translation */}
                <div className="text-[10px] text-slate-500 dark:text-slate-400 text-left space-y-1 leading-relaxed">
                  <p className="font-bold">Artinya:</p>
                  <p className="italic">"Ya Allah, Tuhan pemilik seruan yang sempurna ini, dan shalat yang didirikan, berilah kepada Nabi Muhammad wasilah (perantara) dan keutamaan, serta kedudukan yang terpuji yang telah Engkau janjikan." (HR. Bukhari)</p>
                </div>
              </div>

              {/* Close/Dismiss Button */}
              <button
                onClick={handleCloseDoaModal}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 transition duration-300"
              >
                Aamiin Ya Rabbal Alamin (Selesai)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
