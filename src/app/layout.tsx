import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://gs1-digital-link.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Free GS1 Digital Link 2D QR Generator, Modulo-10 Validator & EU DPP (Sunrise 2027) | GS1Link.studio",
    template: "%s | GS1Link.studio",
  },
  description:
    "100% Free GS1 Sunrise 2027 2D QR Code Generator & Modulo-10 Check Digit Calculator. Convert EAN-13 and UPC-A barcodes into POS-scannable GS1 Digital Link QR codes with batch/lot (AI 10), expiry date (AI 17), hybrid 1D+2D print SVGs, 300 DPI PNGs, and EU Digital Product Passports (ESPR).",
  keywords: [
    "GS1 Digital Link QR code generator free",
    "GS1 Sunrise 2027 2D barcode generator",
    "convert EAN-13 to GS1 QR code",
    "UPC-A to 2D barcode converter",
    "GS1 Modulo-10 check digit calculator",
    "generador QR GS1 Digital Link gratis",
    "codigo de barras 2D Sunrise 2027",
    "EU Digital Product Passport QR generator",
    "pasaporte digital de producto UE QR",
    "ISO/IEC 18004 retail POS QR code",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_ES"],
    url: siteUrl,
    siteName: "GS1Link.studio",
    title:
      "Free GS1 Digital Link 2D QR Generator & Sunrise 2027 Barcode Studio",
    description:
      "Convert EAN-13 & UPC-A into POS-ready 2D GS1 Digital Link QR codes. Validate Modulo-10 check digits and export vector SVG, 300 DPI PNG & EU Digital Product Passports free.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GS1Link.studio — Free GS1 Sunrise 2027 2D QR Generator",
    description:
      "Turn your 1D EAN/UPC barcode into a dual-purpose POS + Smartphone GS1 Digital Link QR code. Free SVG & 300 DPI PNG export.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "GS1Link.studio — GS1 Digital Link 2D QR Generator & EU Digital Product Passport",
      url: siteUrl,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "All",
      inLanguage: ["en", "es"],
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description:
          "100% Free generation and download of GS1 Digital Link 2D QR codes, Hybrid 1D EAN-13 + 2D QR labels (.SVG / 300 DPI .PNG), and W3C JSON-LD EU Digital Product Passports.",
      },
      featureList: [
        "GS1 Digital Link Standard Release 1.3 Canonical URI Builder (/01/GTIN/10/Batch/21/Serial?17=Expiry)",
        "GS1 Modulo-10 Check Digit Validator and 1-Click Auto-Fixer for EAN-8, UPC-A (12), EAN-13, and GTIN-14",
        "Dual 1D EAN-13 + 2D GS1 QR Hybrid Label Generator for the 2026-2027 Retail Transition",
        "EU Digital Product Passport (ESPR Regulation 2024/1781) Consumer View & W3C JSON-LD Schema Export",
        "Print-ready ISO/IEC 18004 Vector .SVG and 300 DPI .PNG downloads with 4X Quiet Zone verification",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is GS1 Sunrise 2027 and how does a GS1 Digital Link QR code work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "GS1 Sunrise 2027 is the global retail transition replacing traditional 1D linear barcodes (EAN-13 and UPC-A) with 2D QR codes powered by the GS1 Digital Link standard. A single GS1 Digital Link QR code scans at supermarket POS optical checkouts (providing GTIN, batch AI 10, and expiration date AI 17) while simultaneously functioning as a web URL when scanned by a consumer's smartphone.",
          },
        },
        {
          "@type": "Question",
          name: "How do I convert an EAN-13 or 12-digit UPC-A into a 14-digit GTIN-14 for GS1 Digital Link?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "In the GS1 Digital Link URI syntax (/01/{gtin}), the primary identifier AI (01) is canonically normalized to 14 digits by prepending leading zeros (one zero for EAN-13, two zeros for 12-digit UPC-A) after verifying the Modulo-10 check digit. GS1Link.studio performs this normalization and Modulo-10 validation automatically.",
          },
        },
        {
          "@type": "Question",
          name: "Does a GS1 Digital Link QR code fulfill the EU Digital Product Passport (DPP / ESPR) requirement?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Under EU Ecodesign for Sustainable Products Regulation (ESPR 2024/1781), products sold in the European Union require a data carrier linking to sustainability, origin, and packaging recyclability metadata (97/129/EC). A GS1 Digital Link 2D QR code serves as both the retail POS checkout barcode and the EU Digital Product Passport carrier.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
