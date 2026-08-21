import React, { useState } from "react";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  Repeat, 
  X, 
  Headphones,
  ListMusic,
  Minimize2,
  Maximize2
} from "lucide-react";
import { SurahDetail } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { triggerHaptic } from "../utils/haptics";

export interface Qari {
  id: string;
  name: string;
  fullName: string;
}

export const AVAILABLE_QARIS: Qari[] = [
  { id: "01", name: "Al-Juhany", fullName: "Syaikh Abdullah Al-Juhany" },
  { id: "02", name: "Al-Qasim", fullName: "Syaikh Abdul-Muhsin Al-Qasim" },
  { id: "03", name: "As-Sudais", fullName: "Syaikh Abdurrahman As-Sudais" },
  { id: "04", name: "Al-Dossari", fullName: "Syaikh Ibrahim Al-Dossari" },
  { id: "05", name: "Al-Afasy", fullName: "Syaikh Misyari Rasyid Al-Afasi" },
  { id: "06", name: "Al-Dosari", fullName: "Syaikh Yasser Al-Dosari" },
];

interface AudioPlayerProps {
  activeSurah: SurahDetail;
  audioVerseNumber: number | null;
  isPlayingAudio: boolean;
  selectedQari: string;
  audioProgress: number;
  isContinuousPlay: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onTogglePlay: () => void;
  onPrevVerse: () => void;
  onNextVerse: () => void;
  onSelectQari: (qariId: string) => void;
  onToggleContinuous: () => void;
  onClose: () => void;
  onSeek: (percent: number) => void;
  onVolumeChange: (volume: number) => void;
}

export default function AudioPlayer({
  activeSurah,
  audioVerseNumber,
  isPlayingAudio,
  selectedQari,
  audioProgress,
  isContinuousPlay,
  currentTime,
  duration,
  volume,
  onTogglePlay,
  onPrevVerse,
  onNextVerse,
  onSelectQari,
  onToggleContinuous,
  onClose,
  onSeek,
  onVolumeChange,
}: AudioPlayerProps) {
  const [showQariDropdown, setShowQariDropdown] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isMini, setIsMini] = useState(() => localStorage.getItem("quran_audio_mini") === "true");

  const toggleMini = () => {
    const newVal = !isMini;
    setIsMini(newVal);
    localStorage.setItem("quran_audio_mini", String(newVal));
  };

  const currentQari = AVAILABLE_QARIS.find(q => q.id === selectedQari) || AVAILABLE_QARIS[4];
  const currentVerseNum = audioVerseNumber || 1;

  // Format time (mm:ss)
  const formatTime = (timeInSecs: number) => {
    if (isNaN(timeInSecs)) return "0:00";
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = Math.min(100, Math.max(0, (clickX / width) * 100));
    onSeek(percent);
  };

  const toggleMute = () => {
    triggerHaptic('light');
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange(prevVolume);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      onVolumeChange(0);
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 w-full animate-in fade-in slide-in-from-bottom-5 duration-300 px-2 sm:px-4 pb-2 pt-0"
      id="global-quran-audio-player"
    >
      <div className={`mx-auto bg-slate-900/95 dark:bg-slate-950/98 backdrop-blur-xl border-t border-x border-slate-800/80 rounded-t-3xl shadow-2xl transition-all duration-300 relative text-white ${
        isMini ? "max-w-md p-3 space-y-2" : "max-w-4xl p-4 md:px-6 md:py-4 space-y-3"
      }`}>
        
        {/* Glow effect at top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/10 via-emerald-500/60 to-emerald-500/10 rounded-t-3xl overflow-hidden" />

        {isMini ? (
          /* ================= MINI MODE LAYOUT ================= */
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between min-w-0">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div className="p-1.5 bg-emerald-950/40 border border-emerald-500/20 rounded-lg text-emerald-400 shrink-0">
                  <Headphones className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider truncate">
                    QS. {activeSurah.namaLatin} • {currentVerseNum}
                  </p>
                </div>
              </div>

              {/* Mini Mode Controls */}
              <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                {/* Prev Verse */}
                <button
                  onClick={onPrevVerse}
                  disabled={currentVerseNum <= 1}
                  className="p-1.5 bg-slate-800 hover:bg-slate-750 active:scale-90 text-slate-300 disabled:opacity-25 rounded-full transition cursor-pointer"
                  title="Ayat Sebelumnya"
                >
                  <SkipBack className="w-3 h-3 fill-current text-white" />
                </button>

                {/* Play/Pause Button */}
                <button
                  onClick={onTogglePlay}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-slate-900 shadow transition-all duration-300 transform active:scale-90 hover:scale-105 cursor-pointer ${
                    isPlayingAudio 
                      ? "bg-amber-400 hover:bg-amber-300" 
                      : "bg-emerald-500 hover:bg-emerald-400"
                  }`}
                  title={isPlayingAudio ? "Jeda" : "Putar"}
                >
                  {isPlayingAudio ? (
                    <Pause className="w-3.5 h-3.5 fill-current text-slate-950" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current text-slate-950 ml-0.5" />
                  )}
                </button>

                {/* Next Verse */}
                <button
                  onClick={onNextVerse}
                  disabled={currentVerseNum >= activeSurah.ayat.length}
                  className="p-1.5 bg-slate-800 hover:bg-slate-750 active:scale-90 text-slate-300 disabled:opacity-25 rounded-full transition cursor-pointer"
                  title="Ayat Selanjutnya"
                >
                  <SkipForward className="w-3 h-3 fill-current text-white" />
                </button>

                <div className="w-[1px] h-4 bg-slate-800 mx-0.5" />

                {/* Maximize Button */}
                <button
                  onClick={toggleMini}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition active:scale-95 cursor-pointer"
                  title="Ubah Ukuran Lebih Besar (Full)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition active:scale-95 cursor-pointer"
                  title="Sembunyikan Player"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Progress line */}
            <div className="space-y-0.5">
              <div 
                onClick={handleProgressBarClick}
                className="group relative h-1 w-full bg-slate-800 rounded-full cursor-pointer overflow-hidden"
              >
                <div 
                  className="absolute h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[8px] text-slate-400 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || 0)}</span>
              </div>
            </div>
          </div>
        ) : (
          /* ================= FULL MODE LAYOUT ================= */
          <>
            {/* Top bar: Info and Qari Selection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="p-2 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-emerald-400">
                  <Headphones className="w-4 h-4 animate-pulse" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider truncate">
                    QS. {activeSurah.namaLatin} • Ayat {currentVerseNum}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    Membaca: Surat ke-{activeSurah.nomor} ({activeSurah.jumlahAyat} Ayat)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {/* Qari Selector Dropdown Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowQariDropdown(!showQariDropdown)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-xs font-semibold rounded-full border border-slate-700 hover:border-emerald-500/60 transition cursor-pointer shadow-sm"
                    title="Pilih Pembaca / Qari Al-Qur'an"
                  >
                    <ListMusic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider shrink-0">Qari:</span>
                    <span className="text-xs font-semibold text-slate-100 max-w-[130px] sm:max-w-[220px] truncate">
                      {currentQari.fullName}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${showQariDropdown ? "rotate-180 text-emerald-400" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {showQariDropdown && (
                      <>
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-[70] bg-slate-950/70 backdrop-blur-sm" 
                          onClick={() => setShowQariDropdown(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 20, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-[92vw] max-w-md max-h-[85vh] bg-slate-900/98 dark:bg-slate-950/98 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-white p-4 sm:p-5 flex flex-col space-y-3.5"
                        >
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
                            <div className="flex items-center space-x-2.5">
                              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                                <Headphones className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Pilih Qari Pembaca Al-Qur'an</h4>
                                <p className="text-[11px] text-slate-400">Pilih lantunan suara Murottal Syaikh favorit Sahabat</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowQariDropdown(false)}
                              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
                              title="Tutup"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="max-h-[55vh] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                            {AVAILABLE_QARIS.map((q) => {
                              const isSelected = selectedQari === q.id;
                              return (
                                <button
                                  key={q.id}
                                  onClick={() => {
                                    onSelectQari(q.id);
                                    setShowQariDropdown(false);
                                  }}
                                  className={`w-full text-left p-3.5 rounded-2xl transition flex items-center justify-between border cursor-pointer ${
                                    isSelected 
                                      ? "bg-emerald-600/90 border-emerald-400 text-white font-bold shadow-lg" 
                                      : "bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-200 hover:text-white"
                                  }`}
                                >
                                  <div className="flex items-center space-x-3.5 min-w-0">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                      isSelected ? "bg-white text-emerald-800 shadow" : "bg-slate-700 text-slate-300"
                                    }`}>
                                      {q.id}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs sm:text-sm font-bold truncate">{q.fullName}</p>
                                      <p className="text-[11px] opacity-80 truncate">Audio Murottal 128kbps HQ</p>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <span className="flex h-3 w-3 relative shrink-0 ml-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Minimize / Collapse Button */}
                <button
                  onClick={toggleMini}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition active:scale-95 cursor-pointer"
                  title="Ubah Ukuran Lebih Kecil (Mini)"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>

                {/* Close / Hide Button */}
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition active:scale-95 cursor-pointer"
                  title="Sembunyikan Player"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Middle Bar: Beautiful Progress Slider and Times */}
            <div className="space-y-1">
              <div 
                onClick={handleProgressBarClick}
                className="group relative h-2 w-full bg-slate-800 rounded-full cursor-pointer overflow-hidden"
              >
                {/* Hover preview line */}
                <div className="absolute inset-0 bg-slate-700 opacity-0 group-hover:opacity-30 transition-opacity" />
                {/* Active Progress Bar */}
                <div 
                  className="absolute h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${audioProgress}%` }}
                />
                {/* Glowing thumb handle (hidden by default, shows on hover) */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-md border-2 border-white scale-0 group-hover:scale-100 transition-transform duration-150"
                  style={{ left: `calc(${audioProgress}% - 7px)` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || 0)}</span>
              </div>
            </div>

            {/* Bottom Bar: Primary Player Controls */}
            <div className="flex items-center justify-between pt-1">
              
              {/* Left corner: Continuous Play Repeat Toggle */}
              <button
                onClick={onToggleContinuous}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition active:scale-95 cursor-pointer border ${
                  isContinuousPlay 
                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400 font-bold" 
                    : "bg-transparent border-slate-800 text-slate-400 hover:text-slate-350"
                }`}
                title={isContinuousPlay ? "Putar Otomatis (Aktif): Lanjut ke Ayat berikutnya" : "Putar Otomatis (Nonaktif)"}
              >
                <Repeat className={`w-3.5 h-3.5 ${isContinuousPlay ? "animate-spin-slow text-emerald-400" : ""}`} />
                <span className="text-[10px] uppercase tracking-wider font-semibold">
                  {isContinuousPlay ? "Auto-Next" : "Single"}
                </span>
              </button>

              {/* Center: Main Controls */}
              <div className="flex items-center space-x-4">
                {/* Previous Verse */}
                <button
                  onClick={onPrevVerse}
                  disabled={currentVerseNum <= 1}
                  className="p-2 bg-slate-800 hover:bg-slate-750 active:scale-90 text-slate-300 disabled:opacity-25 disabled:hover:bg-slate-800 disabled:hover:text-slate-300 disabled:active:scale-100 rounded-full transition cursor-pointer"
                  title="Ayat Sebelumnya"
                >
                  <SkipBack className="w-4 h-4 fill-current text-white" />
                </button>

                {/* Play/Pause Large Button */}
                <button
                  onClick={onTogglePlay}
                  className={`flex items-center justify-center w-12 h-12 rounded-full text-slate-900 shadow-xl transition-all duration-300 transform active:scale-90 hover:scale-105 cursor-pointer ${
                    isPlayingAudio 
                      ? "bg-amber-400 hover:bg-amber-300 ring-4 ring-amber-400/20" 
                      : "bg-emerald-500 hover:bg-emerald-400 ring-4 ring-emerald-500/20"
                  }`}
                  title={isPlayingAudio ? "Jeda Suara" : "Mulai Suara"}
                >
                  {isPlayingAudio ? (
                    <Pause className="w-5 h-5 fill-current text-slate-950" />
                  ) : (
                    <Play className="w-5 h-5 fill-current text-slate-950 ml-1" />
                  )}
                </button>

                {/* Next Verse */}
                <button
                  onClick={onNextVerse}
                  disabled={currentVerseNum >= activeSurah.ayat.length}
                  className="p-2 bg-slate-800 hover:bg-slate-750 active:scale-90 text-slate-300 disabled:opacity-25 disabled:hover:bg-slate-800 disabled:hover:text-slate-300 disabled:active:scale-100 rounded-full transition cursor-pointer"
                  title="Ayat Selanjutnya"
                >
                  <SkipForward className="w-4 h-4 fill-current text-white" />
                </button>
              </div>

              {/* Right corner: Volume Control Slider */}
              <div className="flex items-center space-x-1.5 shrink-0 w-24">
                <button
                  onClick={toggleMute}
                  className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
                  title={isMuted ? "Bunyikan Suara" : "Senyap"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    onVolumeChange(vol);
                    if (isMuted && vol > 0) setIsMuted(false);
                  }}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${((isMuted ? 0 : volume) * 100)}%, #374151 ${((isMuted ? 0 : volume) * 100)}%, #374151 100%)`
                  }}
                  title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                />
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}
