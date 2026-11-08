"use client";

import React, { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Package,
  Calendar,
  Scale,
  Globe,
  ArrowLeft,
  Recycle,
} from "lucide-react";
import Link from "next/link";
import { validateAndNormalizeGTIN } from "@/lib/gs1-engine";
import { GS1BrandLogo } from "@/components/GS1BrandLogo";

function GS1ResolverContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const segments = Array.isArray(params?.gs1)
    ? params.gs1
    : params?.gs1
    ? [params.gs1]
    : [];

  const gtinRaw = segments[0] || "08412345678905";
  let batchLot = "STANDARD";
  let serialNumber = "";

  for (let i = 1; i < segments.length; i += 2) {
    const ai = segments[i];
    const val = decodeURIComponent(segments[i + 1] || "");
    if (ai === "10") batchLot = val;
    if (ai === "21") serialNumber = val;
  }

  const expRaw = searchParams.get("17") || "";
  const weightRaw = searchParams.get("3103") || "";
  const productName =
    searchParams.get("name") || "Verified GS1 Digital Link Retail Product";
  const brandName = searchParams.get("brand") || "GS1 Sunrise 2027 Brand Owner";
  const origin = searchParams.get("origin") || "European Union (EU)";
  const packaging =
    searchParams.get("pack") || "GL 71 Recyclable Glass / ALU 41";
  const co2 = searchParams.get("co2") || "0.62";

  // Format YYMMDD to YYYY-MM-DD
  const formattedExp =
    expRaw.length === 6
      ? `20${expRaw.slice(0, 2)}-${expRaw.slice(2, 4)}-${expRaw.slice(4, 6)}`
      : expRaw || "No Expiry Declared";

  const formattedWeightKg =
    weightRaw && !isNaN(Number(weightRaw))
      ? `${(Number(weightRaw) / 1000).toFixed(3)} kg`
      : "Standard Net Weight";

  const validation = validateAndNormalizeGTIN(gtinRaw);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 py-10 px-4 flex flex-col items-center justify-center font-sans">
      <div className="max-w-lg w-full space-y-4">
        {/* Top Header with Brand Logo */}
        <div className="flex items-center justify-between px-1">
          <Link href="/" className="hover:opacity-85 transition-opacity">
            <GS1BrandLogo size="sm" />
          </Link>
          <span className="font-mono text-[10px] px-2.5 py-1 bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold rounded-full">
            0% COOKIES
          </span>
        </div>

        <div className="bg-[#111927] border border-slate-800 p-6 shadow-2xl space-y-6 rounded-2xl">
          {/* Top Resolver Status Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-blue-400 rounded-lg">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-blue-400 font-bold block">
                  LIVE GS1 DIGITAL LINK RESOLVER
                </span>
                <span className="font-mono text-xs text-slate-400">
                  ISO/IEC 18004 · EU ESPR (2024/1781)
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-slate-400">
              Release 1.3
            </span>
          </div>

        {/* Product Header */}
        <div className="bg-white text-slate-950 p-5 border-l-4 border-emerald-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5">
              {validation.gs1Organization}
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              AI (01) GTIN-14
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-950">{productName}</h1>
          <p className="text-xs font-medium text-slate-600">{brandName}</p>
        </div>

        {/* Parsed GS1 Application Identifiers (AIs) */}
        <div className="space-y-2">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
            Parsed GS1 Application Identifiers (POS & Traceability)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-emerald-400 block">
                AI (01) — CANONICAL GTIN-14
              </span>
              <strong className="text-white text-sm">{validation.gtin14}</strong>
              <span className="block text-[10px] text-slate-400 mt-0.5">
                {validation.isValid
                  ? "✓ Modulo-10 Check Digit Verified"
                  : "⚠ Unverified Check Digit"}
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-emerald-400 block flex items-center gap-1">
                <Package className="w-3 h-3" /> AI (10) — BATCH / LOT
              </span>
              <strong className="text-white text-sm">{batchLot}</strong>
              {serialNumber && (
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  AI (21) Serial: {serialNumber}
                </span>
              )}
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-emerald-400 block flex items-center gap-1">
                <Calendar className="w-3 h-3" /> AI (17) — EXPIRY DATE
              </span>
              <strong className="text-white text-sm">{formattedExp}</strong>
              <span className="block text-[10px] text-slate-400 mt-0.5">
                Auto-checked at Supermarket POS
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-emerald-400 block flex items-center gap-1">
                <Scale className="w-3 h-3" /> AI (3103) — NET WEIGHT
              </span>
              <strong className="text-white text-sm">{formattedWeightKg}</strong>
              <span className="block text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                <Globe className="w-3 h-3" /> {origin}
              </span>
            </div>
          </div>
        </div>

        {/* EU Digital Product Passport Sustainability Box */}
        <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-mono font-bold text-emerald-300">
            <Recycle className="w-4 h-4 text-emerald-400" />
            <span>EU DIGITAL PRODUCT PASSPORT (ESPR 2024/1781)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">
                PACKAGING DIRECTIVE 97/129/EC
              </span>
              <strong className="text-slate-100">{packaging}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">
                CARBON FOOTPRINT
              </span>
              <strong className="text-emerald-300">{co2} kg CO2e / unit</strong>
            </div>
          </div>
        </div>

        {/* Compliance Seal */}
        <div className="p-3 bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-[11px] font-mono text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            GS1 Digital Link Release 1.3 · Dual POS Optical Scanner + Consumer Smartphone Resolution.
          </span>
        </div>

        <div className="pt-1 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-blue-400 hover:text-blue-300 underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to GS1Link.studio Generator</span>
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
}

export default function GS1ResolverPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0F17] text-slate-200 flex items-center justify-center font-mono text-xs">
          Resolving GS1 Digital Link Syntax...
        </div>
      }
    >
      <GS1ResolverContent />
    </Suspense>
  );
}
