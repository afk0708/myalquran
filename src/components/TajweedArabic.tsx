import React, { useMemo, useState } from "react";
import { parseTajweed, TAJWEED_RULES, TajweedRuleType, TajweedRuleInfo } from "../utils/tajweed";

interface TajweedArabicProps {
  text: string;
  enabled: boolean;
  className?: string;
  style?: React.CSSProperties;
  onOpenGuide?: (ruleId?: TajweedRuleType) => void;
}

export const TajweedArabic: React.FC<TajweedArabicProps> = ({
  text,
  enabled,
  className = "",
  style = {},
  onOpenGuide
}) => {
  const [activeTooltip, setActiveTooltip] = useState<{
    rule: TajweedRuleInfo;
    text: string;
  } | null>(null);

  const segments = useMemo(() => {
    if (!enabled || !text) return null;
    return parseTajweed(text);
  }, [text, enabled]);

  if (!enabled || !segments) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    );
  }

  return (
    <span className={`relative inline-block ${className}`} style={style}>
      {segments.map((seg, idx) => {
        if (!seg.rule) {
          return <React.Fragment key={idx}>{seg.text}</React.Fragment>;
        }

        const ruleInfo = TAJWEED_RULES[seg.rule];
        if (!ruleInfo) {
          return <React.Fragment key={idx}>{seg.text}</React.Fragment>;
        }

        return (
          <span
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenGuide) {
                onOpenGuide(seg.rule);
              } else {
                setActiveTooltip({ rule: ruleInfo, text: seg.text });
              }
            }}
            title={`${ruleInfo.name} - ${ruleInfo.howToRead} (Klik untuk panduan tajwid)`}
            className={`${ruleInfo.colorClass} hover:opacity-85 hover:underline cursor-pointer transition-all duration-150 rounded px-[1px] select-text`}
          >
            {seg.text}
          </span>
        );
      })}

      {/* Floating Active Tooltip for Tap on Mobile */}
      {activeTooltip && (
        <span
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-slate-950/95 text-white backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl shadow-2xl text-xs max-w-xs animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setActiveTooltip(null);
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${activeTooltip.rule.dotColor}`} />
              <span className="font-bold text-emerald-400">{activeTooltip.rule.name}</span>
            </div>
            <span className="text-[10px] text-slate-400">Tutup ✕</span>
          </div>
          <p className="text-[11px] text-slate-200 leading-relaxed">{activeTooltip.rule.description}</p>
          <p className="text-[10px] text-amber-300 font-semibold mt-1">Cara Baca: {activeTooltip.rule.howToRead}</p>
        </span>
      )}
    </span>
  );
};
