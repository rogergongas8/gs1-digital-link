import React from "react";

export const GS1BrandLogo: React.FC<{
  size?: "sm" | "md" | "lg";
  subtitle?: string;
}> = ({ size = "md", subtitle }) => {
  const iconSize =
    size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-8 h-8";

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className={`${iconSize} rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-xs shrink-0 p-1.5 text-white`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <path d="M14 14h3v3h-3z" />
          <path d="M18 18h3v3h-3z" />
          <path d="M14 19h2v2h-2z" />
          <path d="M19 14h2v2h-2z" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-base font-bold tracking-tight text-neutral-900">
            GS1<span className="text-blue-600">Link</span>
          </span>
          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80">
            2027
          </span>
        </div>
        {subtitle && (
          <span className="text-[11px] text-neutral-500 font-medium mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
