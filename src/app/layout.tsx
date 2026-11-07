import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "GS1Link.studio — GS1 Digital Link 2D QR Generator, Modulo-10 Validator & EU DPP (Sunrise 2027)",
  description:
    "Convert traditional EAN-13 and UPC-A barcodes into GS1 Sunrise 2027 2D Digital Link QR codes. Validate Modulo-10 check digits, encode batch/lot (AI 10) and expiry dates (AI 17), and export print-ready vector SVGs & EU Digital Product Passports.",
  keywords: [
    "GS1 Digital Link QR generator",
    "Sunrise 2027 barcode converter",
    "EAN-13 to GS1 QR code",
    "GS1 Modulo-10 check digit calculator",
    "EU Digital Product Passport QR",
    "ISO/IEC 18004 retail barcode",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
