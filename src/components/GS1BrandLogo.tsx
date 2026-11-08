import React from "react";

export const GS1BrandLogo: React.FC<{ subtitle?: string }> = () => {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h3v3h-3z" />
          <path d="M18 18h3v3h-3z" />
          <path d="M14 19h2v2h-2z" />
          <path d="M19 14h2v2h-2z" />
        </svg>
      </div>
      <span className="text-base font-semibold tracking-tight text-neutral-900">
        GS1Link
      </span>
    </div>
  );
};
