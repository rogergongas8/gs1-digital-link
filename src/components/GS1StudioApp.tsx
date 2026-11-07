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
  ExternalLink,
  Image as ImageIcon,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { buildGS1DigitalLink, GS1DigitalLinkInput } from "@/lib/gs1-engine";
import { generateQRMatrix } from "@/lib/qr-encoder";

const PRESETS: Record<
  string,
  GS1DigitalLinkInput & { labelEn: string; labelEs: string }
> = {
  oliveOil: {
    labelEn: "Olive Oil",
    labelEs: "Aceite de Oliva",
    resolverDomain: "id.oleosur.eu",
    gtin: "8412345678905",
    batchLot: "LOT26A",
    serialNumber: "SN9041",
    expiryDate: "2027-12-31",
    productionDate: "2026-10-15",
    netWeightKg: "0.500",
    productName: "Aceite de Oliva Virgen Extra Ecológico 500ml",
    brandName: "OleoSur Organics",
    originCountry: "España (ES)",
    packagingMaterial: "Vidrio GL 71 / Tapón ALU 41",
    carbonFootprintKg: "0.62",
  },
  supplementUs: {
    labelEn: "Protein Tub",
    labelEs: "Proteína Whey",
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
    packagingMaterial: "Envase Reciclable HDPE 02",
    carbonFootprintKg: "1.45",
  },
  cosmeticsFr: {
    labelEn: "Cosmetic Serum",
    labelEs: "Sérum Facial",
    resolverDomain: "id.lumiere-paris.fr",
    gtin: "3014260021450",
    batchLot: "L2611F",
    serialNumber: "884120",
    expiryDate: "2028-03-15",
    productionDate: "",
    netWeightKg: "0.030",
    productName: "Sérum Concentré Acide Hyaluronique 2%",
    brandName: "Lumière Botanique Paris",
    originCountry: "Francia (FR)",
    packagingMaterial: "Frasco Vidrio GL 70",
    carbonFootprintKg: "0.28",
  },
};

export const GS1StudioApp: React.FC = () => {
  const [lang, setLang] = useState<"en" | "es">("es");
  const [activeTab, setActiveTab] = useState<"2d" | "hybrid" | "dpp">("2d");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);

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

  const isEn = lang === "en";

  const updateField = (key: keyof GS1DigitalLinkInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const gs1Result = useMemo(() => buildGS1DigitalLink(form), [form]);
  const qrMatrix = useMemo(
    () => generateQRMatrix(gs1Result.canonicalUri),
    [gs1Result.canonicalUri]
  );

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

  const handleStartBlank = () => {
    setForm({
      resolverDomain: "id.mimarca.com",
      gtin: "8400000000008",
      batchLot: "LOTE-01",
      serialNumber: "",
      expiryDate: "2027-12-31",
      productionDate: "",
      netWeightKg: "0.500",
      productName: isEn ? "My Product Name" : "Nombre de mi producto",
      brandName: isEn ? "My Brand" : "Mi Marca",
      originCountry: isEn ? "Spain (ES)" : "España (ES)",
      packagingMaterial: "Vidrio GL 70 / Cartón PAP 21",
      carbonFootprintKg: "0.40",
    });
  };

  const build2DSVGString = () => {
    const quietZone = 4;
    const moduleSize = 8;
    const totalModules = qrMatrix.size + quietZone * 2;
    const qrPixelSize = totalModules * moduleSize;
    const svgWidth = Math.max(380, qrPixelSize + 60);
    const svgHeight = qrPixelSize + 100;
    const offsetX = Math.floor((svgWidth - qrPixelSize) / 2);
    const offsetY = 20;

    let paths = "";
    for (let r = 0; r < qrMatrix.size; r++) {
      for (let c = 0; c < qrMatrix.size; c++) {
        if (qrMatrix.modules[r][c]) {
          const x = offsetX + (c + quietZone) * moduleSize;
          const y = offsetY + (r + quietZone) * moduleSize;
          paths += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="#0F172A"/>`;
        }
      }
    }

    return {
      svgWidth,
      svgHeight,
      svgContent: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="${svgWidth}" height="${svgHeight}" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" rx="12"/>
  ${paths}
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 24}" text-anchor="middle" font-family="Courier New, monospace" font-size="12" font-weight="bold" fill="#0F172A">${gs1Result.hriString}</text>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 44}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#64748B">GS1 Digital Link · GTIN: ${gs1Result.gtinValidation.gtin14}</text>
</svg>`,
    };
  };

  const handleDownload2DSVG = () => {
    const { svgContent } = build2DSVGString();
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gs1-qr-${gs1Result.gtinValidation.gtin14}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload2DPNG = () => {
    const { svgWidth, svgHeight, svgContent } = build2DSVGString();
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new window.Image();
    img.onload = () => {
      const scale = 3;
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
        link.download = `gs1-qr-300dpi-${gs1Result.gtinValidation.gtin14}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleDownloadHybridSVG = () => {
    const svgWidth = 480;
    const svgHeight = 220;
    const eanBits = gs1Result.ean13Bars.bits;

    let eanRects = "";
    for (let i = 0; i < eanBits.length; i++) {
      if (eanBits[i] === "1") {
        const isGuard = i < 3 || (i >= 45 && i < 50) || i >= 92;
        eanRects += `<rect x="${36 + i * 2}" y="38" width="2" height="${
          isGuard ? 108 : 96
        }" fill="#0F172A"/>`;
      }
    }

    const qrScale = 3.2;
    const qrOffsetX = 290;
    const qrOffsetY = 30;
    let qrRects = "";
    for (let r = 0; r < qrMatrix.size; r++) {
      for (let c = 0; c < qrMatrix.size; c++) {
        if (qrMatrix.modules[r][c]) {
          qrRects += `<rect x="${(qrOffsetX + c * qrScale).toFixed(2)}" y="${(
            qrOffsetY +
            r * qrScale
          ).toFixed(2)}" width="${qrScale}" height="${qrScale}" fill="#0F172A"/>`;
        }
      }
    }

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="${svgWidth}" height="${svgHeight}" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" rx="12"/>
  ${eanRects}
  <text x="131" y="162" text-anchor="middle" font-family="Courier New, monospace" font-size="15" font-weight="bold" fill="#0F172A">${gs1Result.ean13Bars.ean13}</text>
  <line x1="258" y1="30" x2="258" y2="170" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4"/>
  ${qrRects}
  <text x="240" y="198" text-anchor="middle" font-family="Courier New, monospace" font-size="11" font-weight="bold" fill="#0F172A">${gs1Result.hriString}</text>
</svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gs1-hybrid-${gs1Result.gtinValidation.gtin14}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Soft, Clean Daylight Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                GS1Link<span className="text-emerald-600">.studio</span>
              </span>
              <span className="hidden sm:inline-block ml-2.5 text-xs text-slate-500 font-medium">
                {isEn
                  ? "2D Barcode & EU Product Passport Generator"
                  : "Generador de Código QR 2D para Códigos de Barras"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang("es")}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  lang === "es"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  lang === "en"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8">
        {/* Calm Intro Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isEn
                ? "Turn your barcode into an official 2027 QR Code"
                : "Convierte tu código de barras en el nuevo QR 2027"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isEn
                ? "1. Enter your EAN or UPC number · 2. Add batch & expiry date · 3. Download your print-ready QR."
                : "1. Escribe tu código EAN o UPC · 2. Añade lote y caducidad · 3. Descarga tu QR listo para imprimir."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartBlank}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              {isEn ? "New Blank Barcode" : "Empezar Código en Blanco"}
            </span>
          </button>
        </div>

        {/* Clean 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Single Clean Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-7 space-y-6">
              {/* Top Row: Title + Quick Examples */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {isEn ? "1. Product Barcode & Lot" : "1. Código de barras y lote"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isEn
                      ? "Compatible with 13-digit EAN, 12-digit UPC, and 14-digit GTIN."
                      : "Compatible con códigos EAN-13 (Europa) y UPC-A (EE. UU.)."}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    {isEn ? "Examples:" : "Ejemplos:"}
                  </span>
                  {Object.entries(PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm(preset)}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200/80 text-slate-600 font-medium transition-colors cursor-pointer"
                    >
                      {isEn ? preset.labelEn : preset.labelEs}
                    </button>
                  ))}
                </div>
              </div>

              {/* Barcode Input + Modulo-10 Check */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isEn
                    ? "Barcode Number (EAN-13 / UPC)"
                    : "Número de tu código de barras (EAN-13 / UPC)"}
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={form.gtin}
                    onChange={(e) => updateField("gtin", e.target.value)}
                    placeholder="8412345678905"
                    className={`flex-1 h-11 px-4 rounded-xl font-mono text-base font-bold transition-all focus:outline-none ${
                      gs1Result.gtinValidation.isValid
                        ? "bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-emerald-600 text-slate-900"
                        : "bg-rose-50/50 border border-rose-300 text-rose-900"
                    }`}
                  />
                  {!gs1Result.gtinValidation.isValid &&
                    gs1Result.gtinValidation.isValidLength && (
                      <button
                        type="button"
                        onClick={handleAutoFixCheckDigit}
                        className="px-4 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>
                          {isEn
                            ? `Fix last digit to ${gs1Result.gtinValidation.expectedCheckDigit}`
                            : `Corregir último dígito a ${gs1Result.gtinValidation.expectedCheckDigit}`}
                        </span>
                      </button>
                    )}
                </div>

                {gs1Result.gtinValidation.isValid ? (
                  <p className="mt-2 text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {isEn
                        ? `Valid ${gs1Result.gtinValidation.barcodeType} barcode (${gs1Result.gtinValidation.gs1Organization})`
                        : `Código ${gs1Result.gtinValidation.barcodeType} válido (${gs1Result.gtinValidation.gs1Organization})`}
                    </span>
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-rose-600 flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      {isEn
                        ? gs1Result.gtinValidation.errorMessageEn
                        : gs1Result.gtinValidation.errorMessageEs}
                    </span>
                  </p>
                )}
              </div>

              {/* Simple 2-Column Batch & Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {isEn
                      ? "Batch or Lot Number (optional)"
                      : "Número de lote (opcional)"}
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={form.batchLot || ""}
                    onChange={(e) => updateField("batchLot", e.target.value)}
                    placeholder="LOT26A"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-emerald-600 text-sm font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {isEn
                      ? "Expiration Date (optional)"
                      : "Fecha de caducidad (opcional)"}
                  </label>
                  <input
                    type="date"
                    value={form.expiryDate || ""}
                    onChange={(e) => updateField("expiryDate", e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-emerald-600 text-sm font-medium text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Collapsible Optional Section for Product Passport & Advanced Settings */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full py-2 flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <span>
                    {isEn
                      ? "2. Product Passport Details & Custom Domain (Optional)"
                      : "2. Datos del producto para la vista móvil y dominio (Opcional)"}
                  </span>
                  {showAdvanced ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {isEn ? "Product Name" : "Nombre del producto"}
                      </label>
                      <input
                        type="text"
                        value={form.productName || ""}
                        onChange={(e) =>
                          updateField("productName", e.target.value)
                        }
                        className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {isEn ? "Brand" : "Marca"}
                      </label>
                      <input
                        type="text"
                        value={form.brandName || ""}
                        onChange={(e) =>
                          updateField("brandName", e.target.value)
                        }
                        className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {isEn ? "Origin Country" : "País de origen"}
                      </label>
                      <input
                        type="text"
                        value={form.originCountry || ""}
                        onChange={(e) =>
                          updateField("originCountry", e.target.value)
                        }
                        className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {isEn ? "Packaging Material" : "Material del envase"}
                      </label>
                      <input
                        type="text"
                        value={form.packagingMaterial || ""}
                        onChange={(e) =>
                          updateField("packagingMaterial", e.target.value)
                        }
                        className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {isEn ? "Web Domain" : "Dominio web"}
                      </label>
                      <input
                        type="text"
                        value={form.resolverDomain}
                        onChange={(e) =>
                          updateField("resolverDomain", e.target.value)
                        }
                        className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Subtle Link Preview Bar */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-medium text-slate-400 block">
                    {isEn
                      ? "Generated GS1 Digital Link URL:"
                      : "Enlace estándar GS1 codificado dentro del QR:"}
                  </span>
                  <p className="font-mono text-xs text-slate-700 truncate">
                    {gs1Result.canonicalUri}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUri}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copiedUri ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isEn ? "Copied" : "Copiado"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isEn ? "Copy" : "Copiar"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Sticky Clean Preview Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
              {/* Soft Pill Tabs */}
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("2d")}
                  className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
                    activeTab === "2d"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {isEn ? "2D QR Code" : "Solo QR 2D"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("hybrid")}
                  className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
                    activeTab === "hybrid"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {isEn ? "Bars + QR" : "Barras + QR"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("dpp")}
                  className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
                    activeTab === "dpp"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {isEn ? "Mobile View" : "Vista Móvil"}
                </button>
              </div>

              {/* Tab 1: Clean 2D QR */}
              {activeTab === "2d" && (
                <div className="py-5 px-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex flex-col items-center justify-center">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <svg
                      viewBox={`0 0 ${qrMatrix.size + 4} ${qrMatrix.size + 4}`}
                      className="w-44 h-44"
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
                              fill="#0F172A"
                            />
                          ) : null
                        )
                      )}
                    </svg>
                  </div>
                  <p className="mt-3 font-mono text-xs font-bold text-slate-800 text-center">
                    {gs1Result.hriString}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {isEn
                      ? "Scans at supermarket checkouts & phones"
                      : "Válido para caja de supermercado y cámara de móvil"}
                  </p>
                </div>
              )}

              {/* Tab 2: Hybrid 1D + 2D */}
              {activeTab === "hybrid" && (
                <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-3">
                  <div className="bg-white p-4 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-around gap-4">
                    <div className="flex flex-col items-center">
                      <svg
                        viewBox="0 0 115 65"
                        className="w-36 h-22"
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
                              fill="#0F172A"
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
                          fill="#0F172A"
                        >
                          {gs1Result.ean13Bars.ean13}
                        </text>
                      </svg>
                    </div>

                    <div className="flex flex-col items-center">
                      <svg
                        viewBox={`0 0 ${qrMatrix.size + 4} ${qrMatrix.size + 4}`}
                        className="w-22 h-22"
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
                                fill="#0F172A"
                              />
                            ) : null
                          )
                        )}
                      </svg>
                    </div>
                  </div>
                  <p className="font-mono text-xs text-center font-semibold text-slate-700">
                    {gs1Result.hriString}
                  </p>
                </div>
              )}

              {/* Tab 3: Mobile View */}
              {activeTab === "dpp" && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" />
                      {isEn
                        ? "Product Passport on Phone"
                        : "Ficha que se abre en el móvil"}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      0% Cookies
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {form.productName}
                      </h4>
                      <p className="text-xs text-slate-500">{form.brandName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-50">
                        <span className="text-[10px] text-slate-400 block">
                          {isEn ? "Barcode" : "Código"}
                        </span>
                        <strong className="font-mono text-slate-800">
                          {form.gtin}
                        </strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50">
                        <span className="text-[10px] text-slate-400 block">
                          {isEn ? "Batch / Lot" : "Lote"}
                        </span>
                        <strong className="font-mono text-slate-800">
                          {form.batchLot || "—"}
                        </strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50">
                        <span className="text-[10px] text-slate-400 block">
                          {isEn ? "Expiry" : "Caducidad"}
                        </span>
                        <strong className="text-slate-800">
                          {form.expiryDate || "—"}
                        </strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50">
                        <span className="text-[10px] text-slate-400 block">
                          {isEn ? "Origin" : "Origen"}
                        </span>
                        <strong className="text-slate-800">
                          {form.originCountry}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Soft Download Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleDownload2DPNG}
                  className="h-11 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>{isEn ? "Download PNG" : "Descargar PNG"}</span>
                </button>

                <button
                  type="button"
                  onClick={
                    activeTab === "hybrid"
                      ? handleDownloadHybridSVG
                      : handleDownload2DSVG
                  }
                  className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>{isEn ? "Download SVG" : "Descargar SVG"}</span>
                </button>
              </div>

              <a
                href={localResolverPath}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? "Open public mobile page in new tab"
                    : "Abrir la página móvil del QR en otra pestaña"}
                </span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Soft Daylight Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200/80 py-10 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <details className="rounded-xl bg-slate-50/80 border border-slate-200/70 p-4">
              <summary className="font-semibold text-slate-800 cursor-pointer list-none flex items-center justify-between gap-2">
                <span>
                  {isEn
                    ? "What is GS1 Sunrise 2027?"
                    : "¿Qué es el cambio GS1 Sunrise 2027?"}
                </span>
                <span className="text-slate-400">+</span>
              </summary>
              <p className="mt-2 text-slate-500 leading-relaxed">
                {isEn
                  ? "Starting in 2027, retail scanners worldwide will read 2D GS1 Digital Link QR codes that work both at checkout and on smartphones."
                  : "A partir de 2027, los supermercados sustituyen el código de barras antiguo por un QR que pasa por caja y a la vez abre la ficha del producto en el móvil."}
              </p>
            </details>

            <details className="rounded-xl bg-slate-50/80 border border-slate-200/70 p-4">
              <summary className="font-semibold text-slate-800 cursor-pointer list-none flex items-center justify-between gap-2">
                <span>
                  {isEn
                    ? "Should I print both 1D and 2D codes?"
                    : "¿Puedo poner las barras y el QR juntos?"}
                </span>
                <span className="text-slate-400">+</span>
              </summary>
              <p className="mt-2 text-slate-500 leading-relaxed">
                {isEn
                  ? "Yes! Select the 'Bars + QR' tab above to download a hybrid label with both symbols side by side."
                  : "Sí, pulsa en la pestaña 'Barras + QR' arriba a la derecha para descargar ambos juntos para tu envase."}
              </p>
            </details>

            <details className="rounded-xl bg-slate-50/80 border border-slate-200/70 p-4">
              <summary className="font-semibold text-slate-800 cursor-pointer list-none flex items-center justify-between gap-2">
                <span>
                  {isEn
                    ? "Is it compliant with EU Product Passport?"
                    : "¿Sirve para el Pasaporte Digital Europeo?"}
                </span>
                <span className="text-slate-400">+</span>
              </summary>
              <p className="mt-2 text-slate-500 leading-relaxed">
                {isEn
                  ? "Yes. Regulation (EU) 2024/1781 allows using the same GS1 QR code as the carrier for your EU Digital Product Passport."
                  : "Sí. El Reglamento (UE) 2024/1781 permite usar este mismo QR como portador del Pasaporte Digital de Producto."}
              </p>
            </details>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                GS1 Digital Link Standard · ISO/IEC 18004 · EU ESPR (2024/1781)
              </span>
            </div>
            <span>© {new Date().getFullYear()} GS1Link.studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
