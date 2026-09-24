import React from 'react';

interface ClockEmptyStateProps {
  message?: string;
  submessage?: string;
}

export const ClockEmptyState: React.FC<ClockEmptyStateProps> = ({
  message = 'No Results yet',
  submessage = 'Fill in your pay rate and hours on the left to see your instant calculated breakdown'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center h-full min-h-[360px] select-none">
      {/* Clock Illustration */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Soft background glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-neutral-100/90 to-orange-50/50 dark:from-neutral-800/40 dark:to-orange-950/20 pointer-events-none" />

        <svg
          viewBox="0 0 240 240"
          className="w-full h-full relative z-10 drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dashed orbital trail */}
          <path
            d="M 45 110 C 60 50, 180 40, 205 105"
            stroke="#D1D5DB"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />

          {/* Decorative floating dots/crosses/stars */}
          {/* Coral circle */}
          <circle cx="50" cy="95" r="3.5" fill="#F43F5E" opacity="0.75" />
          {/* Purple star/cross */}
          <g transform="translate(175, 45)">
            <path d="M0 -5 L0 5 M-5 0 L5 0" stroke="#8B5CF6" strokeWidth="1.75" strokeLinecap="round" />
          </g>
          {/* Mint green cross */}
          <g transform="translate(205, 100)">
            <path d="M0 -4 L0 4 M-4 0 L4 0" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" />
          </g>
          {/* Sky blue dot */}
          <circle cx="195" cy="62" r="3" fill="#0EA5E9" opacity="0.8" />
          {/* Soft orange diamond */}
          <rect x="75" y="45" width="5" height="5" transform="rotate(45 77.5 47.5)" fill="#F97316" opacity="0.7" />

          {/* Clock base / stand shadow */}
          <ellipse cx="120" cy="188" rx="42" ry="7" fill="#E5E7EB" className="dark:fill-neutral-700/50" />

          {/* Clock stand trapezoid */}
          <path
            d="M 102 152 L 95 186 L 145 186 L 138 152 Z"
            fill="#CBD5E1"
            className="dark:fill-neutral-600"
          />
          <path
            d="M 95 186 C 95 186, 120 190, 145 186 L 145 188 C 120 192, 95 188, 95 188 Z"
            fill="#94A3B8"
            className="dark:fill-neutral-700"
          />

          {/* Clock outer body / casing */}
          <circle cx="120" cy="116" r="48" fill="#94A3B8" className="dark:fill-neutral-600" />
          <circle cx="120" cy="116" r="44" fill="#E2E8F0" className="dark:fill-neutral-700" />

          {/* Clock dial face (white) */}
          <circle cx="120" cy="116" r="39" fill="#FFFFFF" className="dark:fill-neutral-800" />

          {/* Hour markers (12, 3, 6, 9) */}
          <line x1="120" y1="82" x2="120" y2="86" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="154" y1="116" x2="150" y2="116" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="120" y1="150" x2="120" y2="146" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="86" y1="116" x2="90" y2="116" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />

          {/* Clock hands showing 3:00 hands */}
          {/* Hour hand (pointing to 3) */}
          <line
            x1="120"
            y1="116"
            x2="138"
            y2="116"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
            className="dark:stroke-neutral-100"
          />
          {/* Minute hand (pointing to 12) */}
          <line
            x1="120"
            y1="116"
            x2="120"
            y2="92"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="dark:stroke-neutral-100"
          />

          {/* Center pin */}
          <circle cx="120" cy="116" r="3.5" fill="#F97316" />
          <circle cx="120" cy="116" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Caption text matching the screenshot */}
      <h3 className="mt-3 text-base sm:text-lg font-semibold text-neutral-500 dark:text-neutral-400">
        {message}
      </h3>
      {submessage && (
        <p className="mt-1 text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 max-w-xs mx-auto">
          {submessage}
        </p>
      )}
    </div>
  );
};
