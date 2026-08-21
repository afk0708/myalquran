import React, { useState } from "react";
import { X, Sparkles, BookOpen, Search, CheckCircle2, ChevronRight, Volume2 } from "lucide-react";
import { TAJWEED_RULES, TajweedRuleType, TajweedRuleInfo } from "../utils/tajweed";

interface TajweedGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRuleId?: TajweedRuleType | null;
}

export const TajweedGuideModal: React.FC<TajweedGuideModalProps> = ({
  isOpen,
  onClose,
  initialRuleId
}) => {
  const [selectedRuleId, setSelectedRuleId] = useState<TajweedRuleType>(
    initialRuleId || "qalqalah"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (!isOpen) return null;

  const allRules = Object.values(TAJWEED_RULES);
  const activeRule = TAJWEED_RULES[selectedRuleId] || allRules[0];

  const categories = ["all", "Ghunnah & Dengung", "Pantulan", "Nun/Tanwin", "Mad (Panjang)", "Mim Sukun"];

  const filteredRules = allRules.filter((r) => {
    const matchesCategory = selectedCategory === "all" || r.category === selectedCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.arabicName.includes(searchQuery) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
                Panduan Hukum & Warna Tajwid
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Memahami kaidah membaca Al-Qur'an dengan tartil dan tajwid yang benar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            id="btn-close-tajweed-guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Filter Bar */}
        <div className="p-3 sm:px-5 border-b border-slate-100 dark:border-slate-800 space-y-2.5 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari hukum tajwid (misal: Qalqalah, Ghunnah, Ikhfa, Mad...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750"
                }`}
              >
                {cat === "all" ? "Semua Hukum" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body: Split Grid on Desktop */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Rules List Sidebar */}
          <div className="md:col-span-5 border-r border-slate-100 dark:border-slate-800 overflow-y-auto p-3 space-y-1.5 max-h-[30vh] md:max-h-full">
            {filteredRules.map((rule) => (
              <button
                key={rule.id}
                onClick={() => setSelectedRuleId(rule.id)}
                className={`w-full text-left p-2.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                  selectedRuleId === rule.id
                    ? "bg-emerald-50/80 border-emerald-500 dark:bg-emerald-950/40 dark:border-emerald-500/70 shadow-xs"
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className={`w-3.5 h-3.5 rounded-full ${rule.dotColor} shrink-0 shadow-xs`} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {rule.name.split("(")[0]}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {rule.category}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${selectedRuleId === rule.id ? "text-emerald-600 dark:text-emerald-400" : "text-slate-300 dark:text-slate-600"}`} />
              </button>
            ))}
          </div>

          {/* Active Rule Details View */}
          <div className="md:col-span-7 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/30">
            {activeRule && (
              <div className="space-y-4">
                {/* Header of Active Rule */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-3 h-3 rounded-full ${activeRule.dotColor}`} />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        {activeRule.category}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
                      {activeRule.name}
                    </h4>
                  </div>
                  <span className="arabic-text text-xl font-bold text-emerald-600 dark:text-emerald-400 select-none">
                    {activeRule.arabicName}
                  </span>
                </div>

                {/* Description Block */}
                <div className="bg-white dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 p-3.5 rounded-2xl shadow-xs space-y-2">
                  <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Pengertian & Kaidah Hukum:</span>
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeRule.description}
                  </p>
                </div>

                {/* How to pronounce */}
                <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60 rounded-2xl space-y-1.5">
                  <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Cara Membaca:
                  </h5>
                  <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed">
                    {activeRule.howToRead}
                  </p>
                </div>

                {/* Examples */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Contoh dalam Al-Qur'an:
                  </h5>
                  <div className="space-y-2">
                    {activeRule.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {ex.surah}
                          </span>
                          <span className="text-xs italic text-slate-600 dark:text-slate-300">
                            "{ex.latin}"
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`arabic-text text-xl font-bold select-none ${activeRule.colorClass}`}>
                            {ex.arabic}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-xs text-slate-400">
            Aktifkan tombol toggle <strong>Tajwid Berwarna</strong> pada halaman surat untuk melihat pewarnaan interaktif.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
            id="btn-close-tajweed-modal-bottom"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
