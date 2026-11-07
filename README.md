# GS1Link.studio — Global GS1 Digital Link 2D QR Generator & EU Digital Product Passport (Sunrise 2027)

Engineering workstation for converting legacy 1D barcodes (`EAN-13`, `UPC-A`, `EAN-8`) into **GS1 Sunrise 2027** 2D Digital Link QR codes and **EU Digital Product Passports (ESPR 2024/1781)**.

## Features
- **Real-Time GS1 Modulo-10 Check Digit Engine:** Validates and auto-repairs barcode check digits and detects national GS1 Member Organization prefixes.
- **Canonical GS1 Digital Link URI Builder:** Encodes Application Identifiers `(01)` GTIN-14, `(10)` Batch/Lot, `(21)` Serial, `(17)` Expiry Date, and `(3103)` Net Weight.
- **Zero-Dependency ISO/IEC 18004 QR & 1D EAN-13 Vector Engine:** Generates 100% real, scannable 2D QR matrices and 95-module 1D EAN-13 bars in print-ready `.SVG` format.
- **EU Digital Product Passport (DPP):** Exports W3C/GS1 JSON-LD credentials and previews the cookie-free mobile passport.

## Local Development & Vercel Deployment
```bash
pnpm install
pnpm dev    # Runs on http://localhost:3001
pnpm build  # Production build verification
```
