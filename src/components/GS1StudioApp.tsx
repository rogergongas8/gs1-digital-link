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
  ExternalLink,
  Image as ImageIcon,
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
  const [lang, setLang] = useState<"en" | "es">("es");
  const [leftStep, setLeftStep] = useState<"gs1" | "dpp" | "audit">("gs1");
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

  // Build local live resolver URL so the user can test scanning/clicking right now
  const localResolverPath = useMemo(() => {
    let path = `/01/${gs1Result.gtinValidation.gtin14}`;
    if (form.batchLot?.trim()) {
      path += `/10/${encodeURIComponent(form.batchLot.trim())}`;
    }
    if (form.serialNumber?.trim()) {
      path += `/21/${encodeURIComponent(form.serialNumber.trim())}`;
    }
    const q = new URLSearchParams();
    if (form.expiryDate) {
      const clean = form.expiryDate.replace(/\D/g, "");
      if (clean.length === 8) q.set("17", clean.slice(2));
    }
    if (form.netWeightKg && Number(form.netWeightKg) > 0) {
      q.set(
        "3103",
        String(Math.round(Number(form.netWeightKg) * 1000)).padStart(6, "0")
      );
    }
    if (form.productName) q.set("name", form.productName);
    if (form.brandName) q.set("brand", form.brandName);
    if (form.originCountry) q.set("origin", form.originCountry);
    if (form.packagingMaterial) q.set("pack", form.packagingMaterial);
    if (form.carbonFootprintKg) q.set("co2", form.carbonFootprintKg);
    return `${path}?${q.toString()}`;
  }, [form, gs1Result.gtinValidation.gtin14]);

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

  const build2DSVGString = () => {
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

    return {
      svgWidth,
      svgHeight,
      svgContent: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="${svgWidth}" height="${svgHeight}" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
  <rect x="${offsetX}" y="${offsetY}" width="${qrPixelSize}" height="${qrPixelSize}" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="3 3"/>
  ${paths}
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 24}" text-anchor="middle" font-family="Courier New, monospace" font-size="12" font-weight="bold" fill="#000000">${gs1Result.hriString}</text>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 44}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#475569">GS1 Digital Link (Sunrise 2027) · GTIN-14: ${gs1Result.gtinValidation.gtin14}</text>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 60}" text-anchor="middle" font-family="Courier New, monospace" font-size="9" fill="#64748B">${gs1Result.canonicalUri}</text>
</svg>`,
    };
  };

  // Export Real Scannable 2D QR Vector SVG
  const handleDownload2DSVG = () => {
    const { svgContent } = build2DSVGString();
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

  // Export High-Resolution 300 DPI PNG
  const handleDownload2DPNG = () => {
    const { svgWidth, svgHeight, svgContent } = build2DSVGString();
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new window.Image();
    img.onload = () => {
      const scale = 3; // 3x for 300 DPI print crispness
      const canvas = document.createElement("canvas");
      canvas.width = svgWidth * scale;
      canvas.height = svgHeight * scale;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `gs1-2d-qr-300dpi-${gs1Result.gtinValidation.gtin14}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
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

  const passedChecksCount = gs1Result.auditChecks.filter((c) => c.passed).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100 font-sans">
      {/* Compact Engineering Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0F1623]/95 backdrop-blur px-4 sm:px-6 py-3">
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
              </div>
              <p className="text-xs text-slate-400">
                {lang === "en"
                  ? "2D Barcode Generator, Modulo-10 Validator & EU Product Passport"
                  : "Generador QR 2D GS1, Validador Módulo-10 y Pasaporte Digital UE"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={localResolverPath}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>
                {lang === "en"
                  ? "Test Live QR Resolver (/01/...)"
                  : "Probar Escaneo QR Real (/01/...)"}
              </span>
            </a>

            <div className="flex border border-slate-700 bg-slate-900 p-0.5 font-mono text-xs">
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
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  lang === "en"
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workstation Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
        {/* Clear 3-Step Guide + "Create Blank Barcode" CTA */}
        <div className="mb-5 p-4 sm:p-5 bg-gradient-to-r from-emerald-950/60 via-[#0F1623] to-[#0F1623] border border-emerald-500/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="inline-block font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold">
              {lang === "en"
                ? "HOW IT WORKS · 3 SIMPLE STEPS"
                : "¿CÓMO FUNCIONA? · EN 3 PASOS SIMPLES"}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {lang === "en"
                ? "Turn your regular EAN/UPC barcode into an official 2027 2D QR Code"
                : "Convierte tu código de barras EAN/UPC en el nuevo QR Oficial 2027"}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === "en"
                ? "1. Enter your 13-digit EAN or 12-digit UPC barcode below → 2. Add optional batch/expiry & EU Passport data → 3. Download your print-ready .SVG or 300 DPI .PNG!"
                : "1. Introduce abajo tu código EAN-13 o UPC de siempre → 2. Añade lote, caducidad y datos de envase → 3. ¡Descarga tu etiqueta QR en .PNG o .SVG lista para imprenta!"}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setForm({
                resolverDomain: "id.mimarca.com",
                gtin: "8400000000008",
                batchLot: "LOTE-01",
                serialNumber: "",
                expiryDate: "2027-12-31",
                productionDate: "",
                netWeightKg: "0.500",
                productName:
                  lang === "en" ? "My Commercial Product" : "Mi Producto Comercial",
                brandName: lang === "en" ? "My Brand" : "Mi Marca",
                originCountry: lang === "en" ? "Spain (ES)" : "España (ES)",
                packagingMaterial: "GL 70 Glass / PAP 21",
                carbonFootprintKg: "0.40",
              })
            }
            className="h-11 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-emerald-500/15"
          >
            <QrCode className="w-4 h-4" />
            <span>
              {lang === "en"
                ? "+ Create New Barcode from Scratch"
                : "+ Crear Mi Propio QR desde Cero"}
            </span>
          </button>
        </div>

        {/* Compact Preset & Live URI Bar */}
        <div className="mb-5 p-3.5 bg-[#0F1623] border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {lang === "en" ? "Retail Examples:" : "Ejemplos Reales:"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm(preset)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-xs font-mono text-slate-200 transition-colors cursor-pointer"
                >
                  {lang === "en" ? preset.labelEn : preset.labelEs}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                CANONICAL GS1 DIGITAL LINK URI (POS SCANNER + CONSUMER WEB):
              </span>
              <p className="font-mono text-xs sm:text-sm text-white break-all bg-slate-950 px-3 py-2 border border-slate-800">
                {gs1Result.canonicalUri}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyUri}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-white flex items-center gap-1.5 cursor-pointer"
              >
                {copiedUri ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === "en" ? "Copied" : "Copiado"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lang === "en" ? "Copy URI" : "Copiar URI"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 12-Column Decluttered Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Columns: Clean Step-by-Step Tabs */}
          <div className="lg:col-span-7 space-y-4">
            {/* Step Selector Bar */}
            <div className="grid grid-cols-3 border border-slate-800 bg-[#0F1623] p-1 font-mono text-xs">
              <button
                type="button"
                onClick={() => setLeftStep("gs1")}
                className={`py-2.5 px-2 text-center font-bold transition-colors cursor-pointer ${
                  leftStep === "gs1"
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {lang === "en"
                  ? "1. Barcode & Lot (GTIN)"
                  : "1. Código EAN y Lote"}
              </button>
              <button
                type="button"
                onClick={() => setLeftStep("dpp")}
                className={`py-2.5 px-2 text-center font-bold transition-colors cursor-pointer ${
                  leftStep === "dpp"
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {lang === "en"
                  ? "2. EU Product Passport"
                  : "2. Pasaporte UE (DPP)"}
              </button>
              <button
                type="button"
                onClick={() => setLeftStep("audit")}
                className={`py-2.5 px-2 text-center font-bold transition-colors cursor-pointer ${
                  leftStep === "audit"
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {lang === "en"
                  ? `3. POS Audit (${passedChecksCount}/5)`
                  : `3. Auditoría TPV (${passedChecksCount}/5)`}
              </button>
            </div>

            {/* STEP 1: Barcode & Lot (GTIN + AI 10/17/21/3103) */}
            {leftStep === "gs1" && (
              <div className="bg-[#111927] border border-slate-800 p-5 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                      {lang === "en"
                        ? "Primary Barcode (GTIN) & Lot Data"
                        : "Código de Barras (GTIN) y Trazabilidad de Lote"}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lang === "en"
                        ? "Compatible with EAN-13, UPC-A (12), EAN-8, and GTIN-14."
                        : "Compatible con EAN-13, UPC-A (12), EAN-8 y GTIN-14."}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/30">
                    {gs1Result.gtinValidation.barcodeType} ·{" "}
                    {gs1Result.gtinValidation.gs1Organization}
                  </span>
                </div>

                {/* GTIN Input + Modulo-10 Status */}
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1.5">
                    {lang === "en"
                      ? "AI (01) — Barcode Number (EAN-13 / UPC / GTIN)"
                      : "AI (01) — Número de Código de Barras (EAN-13 / UPC / GTIN)"}
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
                          <span>
                            {lang === "en"
                              ? `Auto-Fix Digit to ${gs1Result.gtinValidation.expectedCheckDigit}`
                              : `Corregir Dígito a ${gs1Result.gtinValidation.expectedCheckDigit}`}
                          </span>
                        </button>
                      )}
                  </div>

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

                {/* Grid for Qualifiers: Batch (10), Expiry (17), Serial (21), Weight (3103) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block font-mono text-xs text-slate-300 mb-1">
                      {lang === "en"
                        ? "AI (10) — Batch / Lot Number"
                        : "AI (10) — Número de Lote"}
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
                      {lang === "en"
                        ? "AI (17) — Expiration Date (POS Block)"
                        : "AI (17) — Fecha de Caducidad (TPV)"}
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
                      {lang === "en"
                        ? "AI (21) — Serial Number (Optional)"
                        : "AI (21) — Número de Serie (Opcional)"}
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      value={form.serialNumber || ""}
                      onChange={(e) => updateField("serialNumber", e.target.value)}
                      placeholder="SN9041"
                      className="w-full h-10 px-3 bg-slate-950 border border-slate-700 focus:border-emerald-400 font-mono text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate-300 mb-1">
                      {lang === "en"
                        ? "AI (3103) — Net Weight (kg)"
                        : "AI (3103) — Peso Neto (kg)"}
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

                {/* Custom Domain */}
                <div className="pt-2 border-t border-slate-800">
                  <label className="block font-mono text-xs text-slate-300 mb-1.5">
                    {lang === "en"
                      ? "Resolver Domain (Your Brand Subdomain)"
                      : "Dominio Web Resolver (Subdominio de tu marca)"}
                  </label>
                  <div className="flex items-center">
                    <span className="h-10 px-3 bg-slate-900 border border-r-0 border-slate-700 font-mono text-xs text-slate-400 flex items-center">
                      https://
                    </span>
                    <input
                      type="text"
                      value={form.resolverDomain}
                      onChange={(e) =>
                        updateField("resolverDomain", e.target.value)
                      }
                      placeholder="id.yourbrand.com"
                      className="flex-1 h-10 px-3 bg-slate-950 border border-slate-700 focus:border-emerald-400 font-mono text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: EU Digital Product Passport (DPP / ESPR) */}
            {leftStep === "dpp" && (
              <div className="bg-[#111927] border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                      {lang === "en"
                        ? "EU Digital Product Passport (DPP) Metadata"
                        : "Datos del Pasaporte Digital de Producto UE (ESPR)"}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lang === "en"
                        ? "Displayed when consumers scan the QR with their phone."
                        : "Información que ve el consumidor al escanear el QR con su móvil."}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-blue-400">
                    EU 2024/1781
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-xs text-slate-300 mb-1">
                      {lang === "en"
                        ? "Commercial Product Name"
                        : "Nombre Comercial del Producto"}
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
                      {lang === "en"
                        ? "Brand / Manufacturer"
                        : "Marca / Fabricante"}
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
                      onChange={(e) =>
                        updateField("originCountry", e.target.value)
                      }
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
                      onChange={(e) =>
                        updateField("packagingMaterial", e.target.value)
                      }
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
                      onChange={(e) =>
                        updateField("carbonFootprintKg", e.target.value)
                      }
                      className="w-full h-10 px-3 bg-slate-950 border border-slate-700 focus:border-emerald-400 font-mono text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: 5-Point Sunrise 2027 POS Readiness Checklist */}
            {leftStep === "audit" && (
              <div className="bg-[#111927] border border-slate-800 p-5">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  {lang === "en"
                    ? "POS Optical Scanner & ISO/IEC 18004 Readiness Audit"
                    : "Auditoría Óptica de Escáner TPV Supermercado (ISO/IEC 18004)"}
                </h3>
                <div className="divide-y divide-slate-800/80">
                  {gs1Result.auditChecks.map((check) => (
                    <div
                      key={check.id}
                      className="py-3 flex items-start justify-between gap-3 text-xs"
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
            )}
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
              <div className="bg-white text-slate-950 p-5 border-2 border-emerald-500 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3 font-mono text-[10px] text-slate-500">
                  <span>GS1 DIGITAL LINK 2D SYMBOL</span>
                  <span>QUIET ZONE: 4X · X-DIM: 0.40mm</span>
                </div>

                {/* Real Scannable SVG QR Code */}
                <div className="flex flex-col items-center justify-center py-3 bg-slate-50 border border-dashed border-slate-300">
                  <svg
                    viewBox={`0 0 ${qrMatrix.size + 8} ${qrMatrix.size + 8}`}
                    className="w-52 h-52 bg-white p-2 border border-slate-200"
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
                  <p className="mt-2.5 font-mono text-xs font-bold text-slate-950 text-center px-3 break-all">
                    {gs1Result.hriString}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-600">
                  <span>GTIN-14: {gs1Result.gtinValidation.gtin14}</span>
                  <span className="text-emerald-700 font-bold">✓ POS READY</span>
                </div>
              </div>
            )}

            {/* Tab 2: Hybrid 2026-2027 Retail Transition Label (1D EAN-13 + 2D GS1 QR) */}
            {activeTab === "hybrid" && (
              <div className="bg-white text-slate-950 p-5 border-2 border-emerald-500 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3 font-mono text-[10px] text-slate-500">
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

                <div className="bg-white text-slate-900 p-4 rounded-xl space-y-3">
                  <div className="border-b border-slate-200 pb-2.5">
                    <span className="font-mono text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5">
                      VERIFIED EU PRODUCT PASSPORT
                    </span>
                    <h4 className="font-bold text-base text-slate-950 mt-1">
                      {form.productName}
                    </h4>
                    <p className="text-xs text-slate-500">{form.brandName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div className="p-2 bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">GTIN-14</span>
                      <strong className="text-slate-900">
                        {gs1Result.gtinValidation.gtin14}
                      </strong>
                    </div>
                    <div className="p-2 bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">BATCH / LOT</span>
                      <strong className="text-slate-900">
                        {form.batchLot || "Standard"}
                      </strong>
                    </div>
                    <div className="p-2 bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">EXPIRY DATE</span>
                      <strong className="text-slate-900">
                        {form.expiryDate || "N/A"}
                      </strong>
                    </div>
                    <div className="p-2 bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">ORIGIN</span>
                      <strong className="text-slate-900">
                        {form.originCountry}
                      </strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-0.5">
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
                <pre className="p-3 bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-72">
                  {gs1Result.dppJsonLd}
                </pre>
              </div>
            )}

            {/* Vector & Raster Export Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownload2DSVG}
                className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{lang === "en" ? "2D QR (.SVG)" : "QR Vector (.SVG)"}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload2DPNG}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>{lang === "en" ? "300 DPI (.PNG)" : "300 DPI (.PNG)"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadHybridSVG}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {lang === "en" ? "EAN+QR Combo (.SVG)" : "Combo EAN+QR (.SVG)"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJsonLd}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  {lang === "en" ? "DPP Schema (.JSONLD)" : "Pasaporte (.JSONLD)"}
                </span>
              </button>
            </div>

            {/* Live Resolver Test Button */}
            <a
              href={localResolverPath}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>
                {lang === "en"
                  ? "Open Live Public Passport Page (/01/...)"
                  : "Abrir Página Pública Real del QR (/01/...)"}
              </span>
            </a>
          </div>
        </div>
      </main>

      {/* Technical & Legal Standards Footer */}
      <footer className="mt-10 border-t border-slate-800 bg-[#080B11] py-6 px-4 sm:px-6 text-xs text-slate-400">
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
                ? "All 1D EAN-13 and 2D QR symbols are generated locally in your browser using Reed-Solomon GF(2^8) error correction and Modulo-10 check digit verification."
                : "Todos los símbolos 1D EAN-13 y 2D QR se generan localmente aplicando corrección de errores Reed-Solomon GF(2^8) y verificación Módulo-10."}
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
