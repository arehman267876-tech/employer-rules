import React from 'react';
import { Sparkles, ShieldCheck, Lock, Phone } from 'lucide-react';

interface PreviewBannerProps {
  isVisible?: boolean;
  onDismiss?: () => void;
  onOpenTrust?: () => void;
}

export const PreviewBanner: React.FC<PreviewBannerProps> = ({
  isVisible = true,
  onOpenTrust
}) => {
  if (!isVisible) return null;

  return (
    <aside
      id="site-preview-banner"
      role="region"
      aria-label="Compliance Engine Notice"
      className="bg-neutral-900 text-neutral-100 border-b border-neutral-800 px-4 py-2 text-xs font-sans"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-[#FF6200] text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            FREE CALCULATOR
          </span>
          <span className="text-neutral-300 text-xs hidden sm:inline">
            Statutory overtime, final paycheck deadlines, and 1099 filing rules updated for 2026.
          </span>
          {onOpenTrust && (
            <button
              onClick={onOpenTrust}
              className="underline hover:text-white text-orange-400 font-semibold text-xs ml-1"
            >
              Counsel Verification Policy →
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 text-[11px] text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Data Stored · 100% Private</span>
          </span>
          <span className="hidden md:inline text-neutral-600">|</span>
          <span className="hidden md:flex items-center gap-1 text-neutral-300 font-semibold">
            <ShieldCheck className="w-3 h-3 text-[#FF6200]" />
            <span>All 50 US States & Federal FLSA</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
