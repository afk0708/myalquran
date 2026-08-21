import React from "react";
import { Sparkles, HelpCircle, BookOpen, Check } from "lucide-react";
import { TAJWEED_RULES, TajweedRuleType } from "../utils/tajweed";

interface TajweedLegendBarProps {
  enabled: boolean;
  onToggle: () => void;
  onOpenGuide: (ruleId?: TajweedRuleType) => void;
}

export const TajweedLegendBar: React.FC<TajweedLegendBarProps> = ({
  enabled,
  onToggle,
  onOpenGuide
}) => {
  const rulesList: Array<{ id: TajweedRuleType; label: string; color: string; bg: string }> = [
    { id: "mad", label: "Mad (4-6 Harakat)", color: "bg-red-500", bg: "text-red-700 dark:text-red-400" },
    { id: "ghunnah", label: "Ghunnah (Dengung)", color: "bg-emerald-500", bg: "text-emerald-700 dark:text-emerald-400" },
    { id: "qalqalah", label: "Qalqalah (Pantulan)", color: "bg-blue-500", bg: "text-blue-700 dark:text-sky-400" },
    { id: "ikhfa", label: "Ikhfa' (Samar)", color: "bg-amber-500", bg: "text-amber-700 dark:text-amber-400" },
    { id: "idgham_bighunnah", label: "Idgham Bighunnah", color: "bg-purple-500", bg: "text-purple-700 dark:text-purple-400" },
    { id: "idgham_bilaghunnah", label: "Idgham Bilaghunnah", color: "bg-teal-500", bg: "text-teal-700 dark:text-teal-400" },
    { id: "iqlab", label: "Iqlab (Ganti Mim)", color: "bg-rose-500", bg: "text-rose-700 dark:text-rose-400" },
    { id: "izhhar", label: "Izhhar (Jelas)", color: "bg-cyan-600", bg: "text-cyan-800 dark:text-cyan-300" }
  ];

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Toggle Title & Switch */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              enabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
            id="toggle-tajweed-active"
            title="Klik untuk mengaktifkan/menonaktifkan pewarnaan tajwid"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-display">
              <Sparkles className={`w-3.5 h-3.5 ${enabled ? "text-emerald-500" : "text-slate-400"}`} />
              <span>Tajwid Berwarna</span>
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                enabled
                  ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              {enabled ? "Aktif" : "Nonaktif"}
            </span>
          </div>
        </div>

        {/* Guide Modal Trigger */}
        <button
          onClick={() => onOpenGuide()}
          className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 hover:bg-emerald-100/60 transition cursor-pointer"
          id="btn-open-tajweed-guide"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Panduan Lengkap & Hukum Tajwid</span>
        </button>
      </div>

      {/* Color Legend Chips (Shown when enabled) */}
      {enabled && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Keterangan Warna Tajwid (Klik warna untuk penjelasan):
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {rulesList.map((item) => (
              <button
                key={item.id}
                onClick={() => onOpenGuide(item.id)}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200/60 dark:border-slate-700/60 transition cursor-pointer active:scale-95"
                title={`Klik untuk melihat hukum dan contoh ${item.label}`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0 shadow-xs`} />
                <span className={item.bg}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
