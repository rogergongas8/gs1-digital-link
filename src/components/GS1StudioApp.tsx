"use client";

import React, { useState, useMemo } from "react";
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  Wrench,
  ShieldCheck,
  FileCode2,
} from "lucide-react";
import { buildGS1DigitalLink, GS1DigitalLinkInput } from "@/lib/gs1-engine";
import { generateQRMatrix } from "@/lib/qr-encoder";

const PRESETS: Record<string, GS1DigitalLinkInput & { labelEn: string; labelEs: string }> = {
  oliveOil: {
    labelEn: "🇪🇸 Extra Virgin Olive Oil (EAN-13)",
    labelEs: "🇪🇸 Aceite Oliva Virgen Extra (EAN-13)",
    resolverDomain: "id.oleosur.eu",
    gtin: "8412345678905",
    batchLot: "LOT26A",
    serialNumber: "SN9041",
    expiryDate: "2027-12-31",
    productionDate: "2026-10-15",
    netWeightKg: "0.500",
    productName: "Aceite de Oliva Virgen Extra Ecológico 500ml",
    brandName: "OleoSur Organics",
    originCountry: "Spain (ES)",
    packagingMaterial: "GL 71 Dark Glass / ALU 41 Cap",
    carbonFootprintKg: "0.62",
  },
  supplementUs: {
    labelEn: "🇺🇸 Whey Protein Isolate (UPC-A 12)",
    labelEs: "🇺🇸 Proteína Whey Isolate (UPC-A 12)",
    resolverDomain: "qr.apexnutrition.com",
    gtin: "036000291452",
    batchLot: "B9920X",
    serialNumber: "",
    expiryDate: "2028-06-30",
    productionDate: "2026-11-01",
    netWeightKg: "0.908",
    productName: "100% Grass-Fed Whey Isolate Vanilla",
    brandName: "Apex Nutrition Labs",
    originCountry: "USA (US)",
    packagingMaterial: "HDPE 02 Recyclable Tub",
    carbonFootprintKg: "1.45",
  },
  cosmeticsFr: {
    labelEn: "🇫🇷 Hyaluronic Serum (DPP Ready)",
    labelEs: "🇫🇷 Sérum Ácido Hialurónico (DPP)",
    resolverDomain: "id.lumiere-paris.fr",
    gtin: "3014260021450",
    batchLot: "L2611F",
    serialNumber: "884120",
    expiryDate: "2028-03-15",
    productionDate: "",
    netWeightKg: "0.030",
    productName: "Sérum Concentré Acide Hyaluronique 2%",
    brandName: "Lumière Botanique Paris",
    originCountry: "France (FR)",
    packagingMaterial: "GL 70 Clear Glass Dropper",
    carbonFootprintKg: "0.28",
  },
};

export const GS1StudioApp: React.FC = () => {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [activeTab, setActiveTab] = useState<"2d" | "hybrid" | "dpp" | "json">("2d");
  const [copiedUri, setCopiedUri] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const [form, setForm] = useState<GS1DigitalLinkInput>({
    resolverDomain: PRESETS.oliveOil.resolverDomain,
    gtin: PRESETS.oliveOil.gtin,
    batchLot: PRESETS.oliveOil.batchLot,
    serialNumber: PRESETS.oliveOil.serialNumber,
    expiryDate: PRESETS.oliveOil.expiryDate,
    productionDate: PRESETS.oliveOil.productionDate,
    netWeightKg: PRESETS.oliveOil.netWeightKg,
    productName: PRESETS.oliveOil.productName,
    brandName: PRESETS.oliveOil.brandName,
    originCountry: PRESETS.oliveOil.originCountry,
    packagingMaterial: PRESETS.oliveOil.packagingMaterial,
    carbonFootprintKg: PRESETS.oliveOil.carbonFootprintKg,
  });

  const updateField = (key: keyof GS1DigitalLinkInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const gs1Result = useMemo(() => buildGS1DigitalLink(form), [form]);
  const qrMatrix = useMemo(
    () => generateQRMatrix(gs1Result.canonicalUri),
    [gs1Result.canonicalUri]
  );

  const handleAutoFixCheckDigit = () => {
    if (gs1Result.gtinValidation.correctedGTIN) {
      updateField("gtin", gs1Result.gtinValidation.correctedGTIN);
    }
  };

  const handleCopyUri = () => {
    navigator.clipboard.writeText(gs1Result.canonicalUri);
    setCopiedUri(true);
    setTimeout(() => setCopiedUri(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(gs1Result.dppJsonLd);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJsonLd = () => {
    const blob = new Blob([gs1Result.dppJsonLd], {
      type: "application/ld+json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dpp-passport-${gs1Result.gtinValidation.gtin14}.jsonld`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Real Scannable 2D QR Vector SVG (with 4-module ISO/IEC 18004 Quiet Zone + HRI text)
  const handleDownload2DSVG = () => {
    const quietZone = 4;
    const moduleSize = 8;
    const totalModules = qrMatrix.size + quietZone * 2;
    const qrPixelSize = totalModules * moduleSize;
    const svgWidth = Math.max(380, qrPixelSize + 60);
    const svgHeight = qrPixelSize + 110;
    const offsetX = Math.floor((svgWidth - qrPixelSize) / 2);
    const offsetY = 24;

    let paths = "";
    for (let r = 0; r < qrMatrix.size; r++) {
      for (let c = 0; c < qrMatrix.size; c++) {
        if (qrMatrix.modules[r][c]) {
          const x = offsetX + (c + quietZone) * moduleSize;
          const y = offsetY + (r + quietZone) * moduleSize;
          paths += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="#000000"/>`;
        }
      }
    }

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="${svgWidth}" height="${svgHeight}" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
  <rect x="${offsetX}" y="${offsetY}" width="${qrPixelSize}" height="${qrPixelSize}" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="3 3"/>
  ${paths}
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 24}" text-anchor="middle" font-family="Courier New, monospace" font-size="12" font-weight="bold" fill="#000000">${gs1Result.hriString}</text>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 44}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#475569">GS1 Digital Link (Sunrise 2027) · GTIN-14: ${gs1Result.gtinValidation.gtin14}</text>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 60}" text-anchor="middle" font-family="Courier New, monospace" font-size="9" fill="#64748B">${gs1Result.canonicalUri}</text>
</svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gs1-2d-qr-${gs1Result.gtinValidation.gtin14}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Hybrid 1D EAN-13 + 2D GS1 QR Combo Vector SVG
  const handleDownloadHybridSVG = () => {
    const svgWidth = 480;
    const svgHeight = 230;
    const eanBits = gs1Result.ean13Bars.bits;

    let eanRects = "";
    for (let i = 0; i < eanBits.length; i++) {
      if (eanBits[i] === "1") {
        const isGuard = i < 3 || (i >= 45 && i < 50) || i >= 92;
        eanRects += `<rect x="${36 + i * 2}" y="42" width="2" height="${
          isGuard ? 108 : 96
        }" fill="#000000"/>`;
      }
    }

    const qrScale = 3.2;
    const qrOffsetX = 290;
    const qrOffsetY = 34;
    let qrRects = "";
    for (let r = 0; r < qrMatrix.size; r++) {
      for (let c = 0; c < qrMatrix.size; c++) {
        if (qrMatrix.modules[r][c]) {
          qrRects += `<rect x="${(qrOffsetX + c * qrScale).toFixed(2)}" y="${(
            qrOffsetY +
            r * qrScale
          ).toFixed(2)}" width="${qrScale}" height="${qrScale}" fill="#000000"/>`;
        }
      }
    }

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="${svgWidth}" height="${svgHeight}" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
  <text x="24" y="24" font-family="Courier New, monospace" font-size="10" font-weight="bold" fill="#475569">GS1 SUNRISE 2027 HYBRID RETAIL LABEL (1D EAN-13 + 2D DIGITAL LINK)</text>
  ${eanRects}
  <text x="131" y="166" text-anchor="middle" font-family="Courier New, monospace" font-size="15" font-weight="bold" fill="#000000">${gs1Result.ean13Bars.ean13}</text>
  <line x1="258" y1="34" x2="258" y2="174" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4"/>
  ${qrRects}
  <text x="240" y="204" text-anchor="middle" font-family="Courier New, monospace" font-size="11" font-weight="bold" fill="#000000">${gs1Result.hriString}</text>
</svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gs1-hybrid-ean13-qr-${gs1Result.gtinValidation.gtin14}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const t = {
    subtitle:
      lang === "en"
        ? "GS1 Sunrise 2027 2D Barcode Generator, Modulo-10 Validator & EU Digital Product Passport"
        : "Generador QR GS1 Sunrise 2027, Validador Módulo-10 y Pasaporte Digital de Producto UE",
    presets: lang === "en" ? "Load Retail SKU Preset:" : "Cargar Ejemplo Retail:",
    step1:
      lang === "en"
        ? "1. Primary GTIN & GS1 Application Identifiers (AI)"
        : "1. Código GTIN Primario e Identificadores de Aplicación GS1 (AI)",
    gtinLabel:
      lang === "en"
        ? "AI (01) — Barcode Number (EAN-13, UPC-A 12, EAN-8 or GTIN-14)"
        : "AI (01) — Código de Barras (EAN-13, UPC-A 12, EAN-8 o GTIN-14)",
    fixDigit:
      lang === "en"
        ? `Auto-Fix Check Digit to ${gs1Result.gtinValidation.expectedCheckDigit}`
        : `Corregir Dígito de Control a ${gs1Result.gtinValidation.expectedCheckDigit}`,
    domainLabel:
      lang === "en"
        ? "Resolver Domain (Custom Brand Domain or Shared)"
        : "Dominio Resolver (Dominio propio de marca o compartido)",
    batchLabel:
      lang === "en" ? "AI (10) — Batch / Lot Number" : "AI (10) — Número de Lote",
    serialLabel:
      lang === "en" ? "AI (21) — Serial Number" : "AI (21) — Número de Serie",
    expLabel:
      lang === "en"
        ? "AI (17) — Expiration Date (POS Auto-Block)"
        : "AI (17) — Fecha de Caducidad (Bloqueo TPV)",
    weightLabel:
      lang === "en"
        ? "AI (3103) — Net Weight (kg)"
        : "AI (3103) — Peso Neto (kg)",
    step2:
      lang === "en"
        ? "2. EU Digital Product Passport (DPP / ESPR) Metadata"
        : "2. Metadatos de Pasaporte Digital de Producto (UE ESPR)",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100 font-sans">
      {/* Compact Engineering Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0F1623]/95 backdrop-blur px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono text-base font-bold tracking-tight text-white">
                  GS1Link<span className="text-emerald-400">.studio</span>
                </h1>
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                  SUNRISE 2027 STANDARD
                </span>
                <span className="hidden md:inline-block font-mono text-[10px] uppercase px-2 py-0.5 bg-blue-500/15 text-blue-300 border border-blue-500/30">
                  ISO/IEC 18004 + EU DPP
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.subtitle}</p>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex border border-slate-700 bg-slate-900 p-0.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  lang === "en"
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                EN (Global)
              </button>
              <button
                type="button"
                onClick={() => setLang("es")}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  lang === "es"
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workstation Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Preset Selector Strip */}
        <div className="mb-6 p-3 bg-[#111927] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            {t.presets}
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PRESETS).map(([key, preset]) => (
              <button
                key={key}
                type="button"
                onClick={() => setForm(preset)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-xs font-mono text-slate-200 transition-colors cursor-pointer"
              >
                {lang === "en" ? preset.labelEn : preset.labelEs}
              </button>
            ))}
          </div>
        </div>

        {/* Live Canonical GS1 URI Banner */}
        <div className="mb-6 p-4 bg-[#0F1623] border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                CANONICAL GS1 DIGITAL LINK URI (POS + MOBILE WEB)
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                • {gs1Result.canonicalUri.length} chars • QR Version {qrMatrix.version} ({qrMatrix.size}×{qrMatrix.size} modules)
              </span>
            </div>
            <p className="font-mono text-sm sm:text-base text-white break-all bg-slate-950/90 px-3 py-2 border border-slate-800">
              {gs1Result.canonicalUri}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyUri}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-white flex items-center gap-2 cursor-pointer"
            >
              {copiedUri ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{lang === "en" ? "Copied" : "Copiado"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>{lang === "en" ? "Copy URI" : "Copiar URI"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload2DSVG}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <Download className="w-4 h-4" />
              <span>{lang === "en" ? "Export 2D .SVG" : "Descargar .SVG"}</span>
            </button>
          </div>
        </div>

        {/* 12-Column Engineering Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Columns: GS1 Syntax & DPP Builder */}
          <div className="lg:col-span-7 space-y-6">
            {/* Panel 1: GS1 Application Identifiers */}
            <div className="bg-[#111927] border border-slate-800 p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  {t.step1}
                </h2>
                <span className="font-mono text-xs text-emerald-400">
                  {gs1Result.gtinValidation.barcodeType} · {gs1Result.gtinValidation.gs1Organization}
                </span>
              </div>

              {/* GTIN Input + Modulo-10 Status */}
              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1.5">
                  {t.gtinLabel}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={form.gtin}
                    onChange={(e) => updateField("gtin", e.target.value)}
                    placeholder="8412345678905"
                    className={`flex-1 h-11 px-3.5 bg-slate-950 border font-mono text-base font-bold text-white focus:outline-none ${
                      gs1Result.gtinValidation.isValid
                        ? "border-emerald-500/50 focus:border-emerald-400"
                        : "border-rose-500 focus:border-rose-400"
                    }`}
                  />
                  {!gs1Result.gtinValidation.isValid &&
                    gs1Result.gtinValidation.isValidLength && (
                      <button
                        type="button"
                        onClick={handleAutoFixCheckDigit}
                        className="px-4 h-11 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>{t.fixDigit}</span>
                      </button>
                    )}
                </div>

                {/* Live Validation Feedback */}
                {gs1Result.gtinValidation.isValid ? (
                  <p className="mt-1.5 font-mono text-xs text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {lang === "en"
                        ? `Valid Modulo-10 Check Digit (${gs1Result.gtinValidation.actualCheckDigit}) → Canonical GTIN-14: ${gs1Result.gtinValidation.gtin14}`
                        : `Dígito de control Módulo-10 válido (${gs1Result.gtinValidation.actualCheckDigit}) → GTIN-14 canónico: ${gs1Result.gtinValidation.gtin14}`}
                    </span>
                  </p>
                ) : (
                  <p className="mt-1.5 font-mono text-xs text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {lang === "en"
                        ? gs1Result.gtinValidation.errorMessageEn
                        : gs1Result.gtinValidation.errorMessageEs}
                    </span>
                  </p>
                )}
              </div>

              {/* Resolver Domain */}
              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1.5">
                  {t.domainLabel}
                </label>
                <div className="flex items-center">
                  <span className="h-10 px-3 bg-slate-900 border border-r-0 border-slate-700 font-mono text-xs text-slate-400 flex items-center">
                    https://
                  </span>
                  <input
                    type="text"
                    value={form.resolverDomain}
                    onChange={(e) => updateField("resolverDomain", e.target.value)}
                    placeholder="id.yourbrand.com"
                    className="flex-1 h-10 px-3 bg-slate-950 border border-slate-700 focus:border-emerald-400 font-mono text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid for Qualifiers & Attributes: Batch (10), Serial (21), Expiry (17), Weight (3103) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">
                    {t.batchLabel}
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={form.batchLot || ""}
                    onChange={(e) => updateField("batchLot", e.target.value)}
                    placeholder="LOT26A"
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-700 focus:border-emerald-400 font-mono text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">
                    {t.serialLabel}
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={form.serialNumber || ""}
                    onChange={(e) => updateField("serialNumber", e.target.value)}
                    placeholder="SN9041 (Optional)"
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-700 focus:border-emerald-400 font-mono text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">
                    {t.expLabel}
                  </label>
                  <input
                    type="date"
                    value={form.expiryDate || ""}
                    onChange={(e) => updateField("expiryDate", e.target.value)}
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-700 focus:border-emerald-400 font-mono text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">
                    {t.weightLabel}
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={form.netWeightKg || ""}
                    onChange={(e) => updateField("netWeightKg", e.target.value)}
                    placeholder="0.500"
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-700 focus:border-emerald-400 font-mono text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Panel 2: EU Digital Product Passport (DPP / ESPR) */}
            <div className="bg-[#111927] border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  {t.step2}
                </h2>
                <span className="font-mono text-[11px] text-blue-400">
                  Regulation (EU) 2024/1781
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-mono text-xs text-slate-300 mb-1">
                    {lang === "en" ? "Commercial Product Name" : "Nombre Comercial del Producto"}
                  </label>
                  <input
                    type="text"
                    value={form.productName || ""}
                    onChange={(e) => updateField("productName", e.target.value)}
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-700 focus:border-emerald-400 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">
                    {lang === "en" ? "Brand / Manufacturer" : "Marca / Fabricante"}
                  </label>
                  <input
                    type="text"
                    value={form.brandName || ""}
                    onChange={(e) => updateField("brandName", e.target.value)}
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-700 focus:border-emerald-400 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">
                    {lang === "en" ? "Origin Country" : "País de Origen"}
                  </label>
                  <input
                    type="text"
                    value={form.originCountry || ""}
                    onChange={(e) => updateField("originCountry", e.target.value)}
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-700 focus:border-emerald-400 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">
                    {lang === "en"
                      ? "Packaging Material Code (97/129/EC)"
                      : "Material de Envase (97/129/CE)"}
                  </label>
                  <input
                    type="text"
                    value={form.packagingMaterial || ""}
                    onChange={(e) => updateField("packagingMaterial", e.target.value)}
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-700 focus:border-emerald-400 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">
                    {lang === "en"
                      ? "Carbon Footprint (kg CO2e / unit)"
                      : "Huella de Carbono (kg CO2e / ud)"}
                  </label>
                  <input
                    type="text"
                    value={form.carbonFootprintKg || ""}
                    onChange={(e) => updateField("carbonFootprintKg", e.target.value)}
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-700 focus:border-emerald-400 font-mono text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Panel 3: 5-Point Sunrise 2027 POS Readiness Checklist */}
            <div className="bg-[#111927] border border-slate-800 p-5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                {lang === "en"
                  ? "POS Optical Scanner & ISO/IEC 18004 Readiness Audit"
                  : "Auditoría Óptica TPV Supermercado e ISO/IEC 18004"}
              </h3>
              <div className="divide-y divide-slate-800/80">
                {gs1Result.auditChecks.map((check) => (
                  <div
                    key={check.id}
                    className="py-2.5 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      {check.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-200">
                          {lang === "en" ? check.labelEn : check.labelEs}
                        </p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          {lang === "en" ? check.detailEn : check.detailEs}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 font-bold uppercase shrink-0 ${
                        check.passed
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {check.passed ? "PASS" : "WARN"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Multi-Mode Live Output Workstation */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            {/* Output Mode Tabs */}
            <div className="grid grid-cols-4 border border-slate-800 bg-[#0F1623] p-1 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setActiveTab("2d")}
                className={`py-2 text-center font-bold transition-colors cursor-pointer ${
                  activeTab === "2d"
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                1. 2D QR
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hybrid")}
                className={`py-2 text-center font-bold transition-colors cursor-pointer ${
                  activeTab === "hybrid"
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                2. EAN + QR
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("dpp")}
                className={`py-2 text-center font-bold transition-colors cursor-pointer ${
                  activeTab === "dpp"
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                3. Mobile DPP
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("json")}
                className={`py-2 text-center font-bold transition-colors cursor-pointer ${
                  activeTab === "json"
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                4. JSON-LD
              </button>
            </div>

            {/* Tab 1: Pure 2D GS1 Digital Link QR Print Proof */}
            {activeTab === "2d" && (
              <div className="bg-white text-slate-950 p-6 border-2 border-emerald-500 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4 font-mono text-[10px] text-slate-500">
                  <span>GS1 DIGITAL LINK 2D SYMBOL</span>
                  <span>QUIET ZONE: 4X MODULES · X-DIM: 0.40mm</span>
                </div>

                {/* Real Scannable SVG QR Code */}
                <div className="flex flex-col items-center justify-center py-4 bg-slate-50 border border-dashed border-slate-300">
                  <svg
                    viewBox={`0 0 ${qrMatrix.size + 8} ${qrMatrix.size + 8}`}
                    className="w-56 h-56 bg-white p-2 border border-slate-200"
                    shapeRendering="crispEdges"
                  >
                    <rect
                      width={qrMatrix.size + 8}
                      height={qrMatrix.size + 8}
                      fill="#FFFFFF"
                    />
                    {qrMatrix.modules.map((row, r) =>
                      row.map((cell, c) =>
                        cell ? (
                          <rect
                            key={`${r}-${c}`}
                            x={c + 4}
                            y={r + 4}
                            width={1}
                            height={1}
                            fill="#000000"
                          />
                        ) : null
                      )
                    )}
                  </svg>

                  {/* HRI (Human Readable Interpretation) */}
                  <p className="mt-3 font-mono text-xs font-bold text-slate-950 text-center px-3 break-all">
                    {gs1Result.hriString}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-slate-500">
                    {lang === "en"
                      ? "Scan with your phone camera right now to test!"
                      : "¡Apunta con la cámara de tu móvil ahora mismo para probarlo!"}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-600">
                  <span>GTIN-14: {gs1Result.gtinValidation.gtin14}</span>
                  <span className="text-emerald-700 font-bold">✓ POS READY</span>
                </div>
              </div>
            )}

            {/* Tab 2: Hybrid 2026-2027 Retail Transition Label (1D EAN-13 + 2D GS1 QR) */}
            {activeTab === "hybrid" && (
              <div className="bg-white text-slate-950 p-6 border-2 border-emerald-500 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4 font-mono text-[10px] text-slate-500">
                  <span>HYBRID TRANSITION LABEL (2026–2027)</span>
                  <span>1D EAN-13 + 2D GS1 LINK</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-300 flex flex-col sm:flex-row items-center justify-around gap-4">
                  {/* Left: Authentic 95-Module 1D EAN-13 Barcode SVG */}
                  <div className="flex flex-col items-center bg-white p-3 border border-slate-200">
                    <svg
                      viewBox="0 0 115 65"
                      className="w-40 h-24"
                      shapeRendering="crispEdges"
                    >
                      <rect width="115" height="65" fill="#FFFFFF" />
                      {gs1Result.ean13Bars.bits.split("").map((bit, idx) => {
                        const isGuard =
                          idx < 3 ||
                          (idx >= 45 && idx < 50) ||
                          idx >= 92;
                        return bit === "1" ? (
                          <rect
                            key={idx}
                            x={10 + idx}
                            y={6}
                            width={1}
                            height={isGuard ? 48 : 42}
                            fill="#000000"
                          />
                        ) : null;
                      })}
                      <text
                        x="57"
                        y="61"
                        textAnchor="middle"
                        fontFamily="Courier New, monospace"
                        fontSize="8.5"
                        fontWeight="bold"
                        fill="#000000"
                      >
                        {gs1Result.ean13Bars.ean13}
                      </text>
                    </svg>
                    <span className="font-mono text-[9px] text-slate-500 mt-1">
                      LEGACY 1D POS LASER
                    </span>
                  </div>

                  {/* Right: 2D GS1 Digital Link QR */}
                  <div className="flex flex-col items-center bg-white p-3 border border-slate-200">
                    <svg
                      viewBox={`0 0 ${qrMatrix.size + 4} ${qrMatrix.size + 4}`}
                      className="w-24 h-24"
                      shapeRendering="crispEdges"
                    >
                      <rect
                        width={qrMatrix.size + 4}
                        height={qrMatrix.size + 4}
                        fill="#FFFFFF"
                      />
                      {qrMatrix.modules.map((row, r) =>
                        row.map((cell, c) =>
                          cell ? (
                            <rect
                              key={`${r}-${c}`}
                              x={c + 2}
                              y={r + 2}
                              width={1}
                              height={1}
                              fill="#000000"
                            />
                          ) : null
                        )
                      )}
                    </svg>
                    <span className="font-mono text-[9px] text-emerald-700 font-bold mt-1">
                      SUNRISE 2027 2D + DPP
                    </span>
                  </div>
                </div>

                <p className="mt-3 font-mono text-[11px] text-center font-bold text-slate-800">
                  {gs1Result.hriString}
                </p>
              </div>
            )}

            {/* Tab 3: Consumer Smartphone Digital Product Passport (DPP) Preview */}
            {activeTab === "dpp" && (
              <div className="bg-[#111927] border-2 border-slate-700 p-5 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-xs font-bold text-white">
                      {lang === "en"
                        ? "EU Digital Product Passport (Consumer View)"
                        : "Pasaporte Digital de Producto UE (Vista Móvil)"}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300">
                    0% COOKIES
                  </span>
                </div>

                <div className="bg-white text-slate-900 p-5 rounded-xl space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <span className="font-mono text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5">
                      VERIFIED EU PRODUCT PASSPORT
                    </span>
                    <h4 className="font-bold text-lg text-slate-950 mt-1.5">
                      {form.productName}
                    </h4>
                    <p className="text-xs text-slate-500">{form.brandName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                    <div className="p-2.5 bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">GTIN-14</span>
                      <strong className="text-slate-900">
                        {gs1Result.gtinValidation.gtin14}
                      </strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">BATCH / LOT</span>
                      <strong className="text-slate-900">
                        {form.batchLot || "Standard"}
                      </strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">EXPIRY DATE</span>
                      <strong className="text-slate-900">
                        {form.expiryDate || "N/A"}
                      </strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">ORIGIN</span>
                      <strong className="text-slate-900">
                        {form.originCountry}
                      </strong>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <p className="font-bold">
                      ♻️ ESPR Sustainability & Packaging Passport:
                    </p>
                    <p>Material: {form.packagingMaterial}</p>
                    <p>Carbon Footprint: {form.carbonFootprintKg} kg CO2e / unit</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: W3C / GS1 JSON-LD Schema Export */}
            {activeTab === "json" && (
              <div className="bg-[#111927] border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    W3C / GS1 JSON-LD PAYLOAD
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedJson ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy JSON-LD</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-80">
                  {gs1Result.dppJsonLd}
                </pre>
              </div>
            )}

            {/* Vector Export Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleDownload2DSVG}
                className="py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{lang === "en" ? "2D QR (.SVG)" : "QR 2D (.SVG)"}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadHybridSVG}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>
                  {lang === "en" ? "Hybrid EAN+QR (.SVG)" : "Híbrido EAN+QR (.SVG)"}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadJsonLd}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileCode2 className="w-4 h-4 text-blue-400" />
              <span>
                {lang === "en"
                  ? "Download EU Digital Product Passport (.JSONLD)"
                  : "Descargar Pasaporte Digital UE (.JSONLD)"}
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* Technical & Legal Standards Footer */}
      <footer className="mt-12 border-t border-slate-800 bg-[#080B11] py-8 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2 font-mono text-slate-200 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                GS1 Digital Link Standard Release 1.3 · ISO/IEC 18004:2015 · EU ESPR (2024/1781)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {lang === "en"
                ? "All 1D EAN-13 and 2D QR symbols are generated locally in your browser using Reed-Solomon GF(2^8) error correction and Modulo-10 check digit verification. Brand owners must ensure their GTIN prefix is licensed by their national GS1 Member Organization."
                : "Todos los símbolos 1D EAN-13 y 2D QR se generan localmente en el navegador aplicando corrección de errores Reed-Solomon GF(2^8) y verificación Módulo-10. El propietario de la marca es responsable de contar con la asignación oficial de su prefijo GTIN ante GS1 / AECOC."}
            </p>
          </div>
          <div className="font-mono text-[11px] text-slate-500 shrink-0">
            GS1Link.studio // Sunrise 2027 Ready
          </div>
        </div>
      </footer>
    </div>
  );
};
