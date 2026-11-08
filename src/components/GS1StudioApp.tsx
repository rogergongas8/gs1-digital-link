"use client";

import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Smartphone,
  Wrench,
  ExternalLink,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { GS1BrandLogo } from "@/components/GS1BrandLogo";
import { buildGS1DigitalLink, GS1DigitalLinkInput } from "@/lib/gs1-engine";
import { generateQRMatrix } from "@/lib/qr-encoder";
import { SEO_GS1_TOOLS, SeoGS1Tool } from "@/data/seo-tools";

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
    productName: "Organic Extra Virgin Olive Oil 500ml",
    brandName: "OleoSur Organics",
    originCountry: "Spain (ES)",
    packagingMaterial: "Glass Bottle GL 71 / Cap ALU 41",
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
    packagingMaterial: "Recyclable HDPE 02",
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
    originCountry: "France (FR)",
    packagingMaterial: "Glass Bottle GL 70",
    carbonFootprintKg: "0.28",
  },
};

export const GS1StudioApp: React.FC<{ initialTool?: SeoGS1Tool }> = ({
  initialTool,
}) => {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [activeTab, setActiveTab] = useState<"2d" | "hybrid" | "dpp">(
    initialTool?.defaultTab || "2d"
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);

  const startPreset = initialTool
    ? PRESETS[initialTool.defaultPresetKey]
    : PRESETS.oliveOil;

  const [form, setForm] = useState<GS1DigitalLinkInput>({
    resolverDomain: startPreset.resolverDomain,
    gtin: startPreset.gtin,
    batchLot: startPreset.batchLot,
    serialNumber: startPreset.serialNumber,
    expiryDate: startPreset.expiryDate,
    productionDate: startPreset.productionDate,
    netWeightKg: startPreset.netWeightKg,
    productName: startPreset.productName,
    brandName: startPreset.brandName,
    originCountry: startPreset.originCountry,
    packagingMaterial: startPreset.packagingMaterial,
    carbonFootprintKg: startPreset.carbonFootprintKg,
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
    q.set("lang", lang);
    return `${path}?${q.toString()}`;
  }, [form, gs1Result.gtinValidation.gtin14, lang]);

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
          paths += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="#171717"/>`;
        }
      }
    }

    return {
      svgWidth,
      svgHeight,
      svgContent: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="${svgWidth}" height="${svgHeight}" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2" rx="12"/>
  ${paths}
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 24}" text-anchor="middle" font-family="Courier New, monospace" font-size="12" font-weight="bold" fill="#171717">${gs1Result.hriString}</text>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 44}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#737373">GS1 Digital Link · GTIN: ${gs1Result.gtinValidation.gtin14}</text>
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
        }" fill="#171717"/>`;
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
          ).toFixed(2)}" width="${qrScale}" height="${qrScale}" fill="#171717"/>`;
        }
      }
    }

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="${svgWidth}" height="${svgHeight}" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2" rx="12"/>
  ${eanRects}
  <text x="131" y="162" text-anchor="middle" font-family="Courier New, monospace" font-size="15" font-weight="bold" fill="#171717">${gs1Result.ean13Bars.ean13}</text>
  <line x1="258" y1="30" x2="258" y2="170" stroke="#D4D4D4" stroke-width="1.5" stroke-dasharray="4 4"/>
  ${qrRects}
  <text x="240" y="198" text-anchor="middle" font-family="Courier New, monospace" font-size="11" font-weight="bold" fill="#171717">${gs1Result.hriString}</text>
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
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-neutral-900">
      {/* Minimal Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 py-3 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <a href="/" className="hover:opacity-80 transition-opacity">
            <GS1BrandLogo />
          </a>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-neutral-100 p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  lang === "en"
                    ? "bg-white text-blue-700 font-semibold shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("es")}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  lang === "es"
                    ? "bg-white text-blue-700 font-semibold shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Clean Intro */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight">
            {initialTool
              ? isEn
                ? initialTool.h1En
                : initialTool.h1Es
              : isEn
              ? "GS1 Sunrise 2027 2D Barcode & QR Generator"
              : "Generador de Códigos QR 2D GS1 Sunrise 2027"}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {initialTool
              ? isEn
                ? initialTool.subtitleEn
                : initialTool.subtitleEs
              : isEn
              ? "Convert your EAN-13 or UPC barcode into an official 2D QR code with batch and expiry."
              : "Convierte tu código de barras EAN-13 o UPC en un QR 2D oficial con lote y caducidad."}
          </p>
        </div>

        {/* Clean 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-6 space-y-5">
              {/* Top Row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-neutral-900">
                  {isEn ? "Barcode & Batch Details" : "Código de barras y lote"}
                </h2>

                <div className="flex items-center gap-1.5 text-xs">
                  {Object.entries(PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm(preset)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200/70 text-neutral-600 font-medium transition-colors cursor-pointer"
                    >
                      {isEn ? preset.labelEn : preset.labelEs}
                    </button>
                  ))}
                </div>
              </div>

              {/* Barcode Input + Modulo-10 Check */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                  {isEn ? "GTIN / EAN-13 / UPC Number" : "Número EAN-13 / UPC"}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={form.gtin}
                    onChange={(e) => updateField("gtin", e.target.value)}
                    placeholder="8412345678905"
                    className={`flex-1 h-10 px-3.5 rounded-xl font-mono text-sm font-semibold transition-all focus:outline-none ${
                      gs1Result.gtinValidation.isValid
                        ? "bg-white border border-neutral-200 focus:border-neutral-900 text-neutral-900"
                        : "bg-red-50/50 border border-red-300 text-red-900"
                    }`}
                  />
                  {!gs1Result.gtinValidation.isValid &&
                    gs1Result.gtinValidation.isValidLength && (
                      <button
                        type="button"
                        onClick={handleAutoFixCheckDigit}
                        className="px-3.5 h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>
                          {isEn
                            ? `Fix digit to ${gs1Result.gtinValidation.expectedCheckDigit}`
                            : `Corregir dígito a ${gs1Result.gtinValidation.expectedCheckDigit}`}
                        </span>
                      </button>
                    )}
                </div>

                {gs1Result.gtinValidation.isValid ? (
                  <p className="mt-2 text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {isEn
                        ? `Valid ${gs1Result.gtinValidation.barcodeType} (${gs1Result.gtinValidation.gs1Organization})`
                        : `Código ${gs1Result.gtinValidation.barcodeType} válido (${gs1Result.gtinValidation.gs1Organization})`}
                    </span>
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
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
                  <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                    {isEn ? "Batch / Lot (AI 10)" : "Lote (AI 10)"}
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={form.batchLot || ""}
                    onChange={(e) => updateField("batchLot", e.target.value)}
                    placeholder="LOT26A"
                    className="w-full h-10 px-3.5 rounded-xl bg-white border border-neutral-200 focus:border-neutral-900 text-sm text-neutral-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                    {isEn ? "Expiry Date (AI 17)" : "Caducidad (AI 17)"}
                  </label>
                  <input
                    type="date"
                    value={form.expiryDate || ""}
                    onChange={(e) => updateField("expiryDate", e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-white border border-neutral-200 focus:border-neutral-900 text-sm text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Collapsible Optional Section */}
              <div className="pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full py-1.5 flex items-center justify-between text-xs font-medium text-neutral-500 hover:text-neutral-900 cursor-pointer"
                >
                  <span>
                    {isEn
                      ? "Product Passport & Custom Domain (Optional)"
                      : "Datos del producto y dominio propio (Opcional)"}
                  </span>
                  {showAdvanced ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-neutral-600 mb-1">
                        {isEn ? "Product Name" : "Nombre del producto"}
                      </label>
                      <input
                        type="text"
                        value={form.productName || ""}
                        onChange={(e) =>
                          updateField("productName", e.target.value)
                        }
                        className="w-full h-9 px-3 rounded-lg bg-white border border-neutral-200 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">
                        {isEn ? "Brand" : "Marca"}
                      </label>
                      <input
                        type="text"
                        value={form.brandName || ""}
                        onChange={(e) =>
                          updateField("brandName", e.target.value)
                        }
                        className="w-full h-9 px-3 rounded-lg bg-white border border-neutral-200 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">
                        {isEn ? "Origin Country" : "País de origen"}
                      </label>
                      <input
                        type="text"
                        value={form.originCountry || ""}
                        onChange={(e) =>
                          updateField("originCountry", e.target.value)
                        }
                        className="w-full h-9 px-3 rounded-lg bg-white border border-neutral-200 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">
                        {isEn ? "Packaging Material" : "Material del envase"}
                      </label>
                      <input
                        type="text"
                        value={form.packagingMaterial || ""}
                        onChange={(e) =>
                          updateField("packagingMaterial", e.target.value)
                        }
                        className="w-full h-9 px-3 rounded-lg bg-white border border-neutral-200 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">
                        {isEn ? "Web Domain" : "Dominio web"}
                      </label>
                      <input
                        type="text"
                        value={form.resolverDomain}
                        onChange={(e) =>
                          updateField("resolverDomain", e.target.value)
                        }
                        className="w-full h-9 px-3 rounded-lg bg-white border border-neutral-200 text-xs font-mono text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Subtle Link Preview Bar */}
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-neutral-400 block">
                    GS1 Digital Link URI
                  </span>
                  <p className="font-mono text-xs text-neutral-800 truncate">
                    {gs1Result.canonicalUri}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUri}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-xs font-medium text-neutral-700 flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copiedUri ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isEn ? "Copied" : "Copiado"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{isEn ? "Copy" : "Copiar"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Sticky Clean Preview Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-6 space-y-5">
              {/* Pill Tabs */}
              <div className="flex rounded-lg bg-neutral-100 p-1 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab("2d")}
                  className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer ${
                    activeTab === "2d"
                      ? "bg-blue-600 text-white font-semibold shadow-2xs"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {isEn ? "2D QR" : "QR 2D"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("hybrid")}
                  className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer ${
                    activeTab === "hybrid"
                      ? "bg-blue-600 text-white font-semibold shadow-2xs"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {isEn ? "Bars + QR" : "Barras + QR"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("dpp")}
                  className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer ${
                    activeTab === "dpp"
                      ? "bg-blue-600 text-white font-semibold shadow-2xs"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {isEn ? "Mobile View" : "Vista Móvil"}
                </button>
              </div>

              {/* Tab 1: Clean 2D QR */}
              {activeTab === "2d" && (
                <div className="py-5 px-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col items-center justify-center">
                  <div className="bg-white p-4 rounded-xl border border-neutral-200/80">
                    <svg
                      viewBox={`0 0 ${qrMatrix.size + 4} ${qrMatrix.size + 4}`}
                      className="w-40 h-40"
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
                              fill="#171717"
                            />
                          ) : null
                        )
                      )}
                    </svg>
                  </div>
                  <p className="mt-3 font-mono text-xs font-semibold text-neutral-900 text-center">
                    {gs1Result.hriString}
                  </p>
                </div>
              )}

              {/* Tab 2: Hybrid 1D + 2D */}
              {activeTab === "hybrid" && (
                <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-3">
                  <div className="bg-white p-4 rounded-xl border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-around gap-4">
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
                              fill="#171717"
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
                          fill="#171717"
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
                                fill="#171717"
                              />
                            ) : null
                          )
                        )}
                      </svg>
                    </div>
                  </div>
                  <p className="font-mono text-xs text-center font-semibold text-neutral-900">
                    {gs1Result.hriString}
                  </p>
                </div>
              )}

              {/* Tab 3: Mobile View */}
              {activeTab === "dpp" && (
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-600 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" />
                      {isEn ? "Product Passport" : "Pasaporte de Producto"}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-neutral-200/80 space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-neutral-900">
                        {form.productName}
                      </h4>
                      <p className="text-xs text-neutral-500">{form.brandName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-neutral-50">
                        <span className="text-[10px] text-neutral-400 block">
                          GTIN
                        </span>
                        <strong className="font-mono text-neutral-900">
                          {form.gtin}
                        </strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-neutral-50">
                        <span className="text-[10px] text-neutral-400 block">
                          {isEn ? "Batch" : "Lote"}
                        </span>
                        <strong className="font-mono text-neutral-900">
                          {form.batchLot || "—"}
                        </strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-neutral-50">
                        <span className="text-[10px] text-neutral-400 block">
                          {isEn ? "Expiry" : "Caducidad"}
                        </span>
                        <strong className="text-neutral-900">
                          {form.expiryDate || "—"}
                        </strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-neutral-50">
                        <span className="text-[10px] text-neutral-400 block">
                          {isEn ? "Origin" : "Origen"}
                        </span>
                        <strong className="text-neutral-900">
                          {form.originCountry}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Download Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleDownload2DPNG}
                  className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{isEn ? "Download PNG" : "Descargar PNG"}</span>
                </button>

                <button
                  type="button"
                  onClick={
                    activeTab === "hybrid"
                      ? handleDownloadHybridSVG
                      : handleDownload2DSVG
                  }
                  className="h-10 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isEn ? "Download SVG" : "Descargar SVG"}</span>
                </button>
              </div>

              <a
                href={localResolverPath}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-9 px-4 rounded-xl text-neutral-500 hover:text-neutral-900 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? "Preview mobile QR page"
                    : "Previsualizar página móvil"}
                </span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="mt-16 bg-white border-t border-neutral-200/80 py-10 px-4 sm:px-6 text-xs text-neutral-500">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <p className="font-medium text-neutral-500 mb-2.5">
              {isEn
                ? "Specialized Barcode & GS1 2D QR Tools:"
                : "Herramientas de Código de Barras y QR GS1:"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SEO_GS1_TOOLS.map((tool) => (
                <a
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200/80 hover:border-neutral-400 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  {isEn ? tool.navLabelEn : tool.navLabelEs}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100 text-neutral-400">
            <span>
              GS1 Digital Link Standard · ISO/IEC 18004 · EU ESPR (2024/1781)
            </span>
            <span>© {new Date().getFullYear()} GS1Link.studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
