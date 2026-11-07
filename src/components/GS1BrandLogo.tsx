import React from "react";

export const GS1BrandLogo: React.FC<{ subtitle?: string }> = ({ subtitle }) => {
  return (
    <div className="flex items-center gap-3.5 select-none">
      {/* Bespoke 1D Barcode -> 2D QR Metamorphosis Emblem (Swiss / Braun Palette) */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="56" height="56" rx="14" fill="#181816" />
        {/* 1D Linear Bars on the Left */}
        <rect x="14" y="15" width="3.5" height="34" rx="1" fill="#FBF9F5" />
        <rect x="20.5" y="15" width="2" height="34" rx="1" fill="#FBF9F5" />
        <rect x="25.5" y="15" width="3.5" height="26" rx="1" fill="#FBF9F5" />
        <circle cx="27.25" cy="46.5" r="2.2" fill="#D94E28" />

        {/* 2D QR Finder Square & Matrix on the Right */}
        <rect
          x="33.5"
          y="15.5"
          width="16.5"
          height="16.5"
          rx="3.5"
          stroke="#FBF9F5"
          strokeWidth="3"
        />
        <rect
          x="38.75"
          y="20.75"
          width="6"
          height="6"
          rx="1.2"
          fill="#D94E28"
        />
        <rect x="33" y="37" width="4.5" height="4.5" rx="1" fill="#FBF9F5" />
        <rect x="39.5" y="37" width="4.5" height="12" rx="1" fill="#5B86E5" />
        <rect x="46" y="44.5" width="4.5" height="4.5" rx="1" fill="#FBF9F5" />
        <rect x="33" y="44.5" width="4.5" height="4.5" rx="1" fill="#FBF9F5" />
      </svg>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-display text-xl font-bold tracking-tight text-[#181816]">
            GS1<span className="text-[#1D3E8A]">Link</span>
          </span>
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#E4E0D8] text-[#181816] border border-[#D0C9BC]">
            2D·STUDIO
          </span>
        </div>
        {subtitle && (
          <span className="text-[11px] text-[#66635B] font-medium mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
