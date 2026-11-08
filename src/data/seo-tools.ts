export interface SeoGS1Tool {
  slug: string;
  navLabelEn: string;
  navLabelEs: string;
  defaultTab: "2d" | "hybrid" | "dpp";
  defaultPresetKey: "oliveOil" | "supplementUs" | "cosmeticsFr";
  title: string;
  description: string;
  h1En: string;
  h1Es: string;
  subtitleEn: string;
  subtitleEs: string;
  faqQuestionEn: string;
  faqAnswerEn: string;
}

export const SEO_GS1_TOOLS: SeoGS1Tool[] = [
  {
    slug: "gs1-check-digit-calculator",
    navLabelEn: "GS1 Check Digit Calculator",
    navLabelEs: "Calculadora Dígito Control GS1",
    defaultTab: "2d",
    defaultPresetKey: "oliveOil",
    title: "Free GS1 Modulo-10 Check Digit Calculator & Validator (EAN-13, UPC-A, GTIN-14)",
    description:
      "Instantly calculate and verify the last Modulo-10 check digit for 8-digit EAN-8, 12-digit UPC-A, 13-digit EAN-13, and 14-digit GTIN-14 barcodes with 1-click auto-fix.",
    h1En: "Free GS1 Modulo-10 Check Digit Calculator & Validator",
    h1Es: "Calculadora y Validador de Dígito de Control GS1 (Módulo-10)",
    subtitleEn:
      "Enter any 8, 12, 13, or 14-digit barcode below to verify its Modulo-10 check digit and generate its official 2D QR code.",
    subtitleEs:
      "Introduce cualquier código de 8, 12, 13 o 14 dígitos para verificar su último dígito de control y generar su QR oficial.",
    faqQuestionEn: "How is the GS1 Modulo-10 check digit calculated?",
    faqAnswerEn:
      "Starting from the right (excluding the check digit), alternate multiplying digits by 3 and 1, sum the products, and subtract the remainder from the nearest multiple of 10.",
  },
  {
    slug: "ean-13-to-qr-code-generator",
    navLabelEn: "EAN-13 to 2D QR Code",
    navLabelEs: "Convertir EAN-13 a QR 2D",
    defaultTab: "2d",
    defaultPresetKey: "oliveOil",
    title: "Convert EAN-13 Barcode to GS1 2D QR Code Free (Sunrise 2027)",
    description:
      "Free EAN-13 to GS1 Digital Link 2D QR Code converter. Turn your 13-digit European retail barcode into a POS-scannable 2D QR code with batch/lot and expiry date.",
    h1En: "Convert EAN-13 Barcode to GS1 2D QR Code",
    h1Es: "Convertir Código de Barras EAN-13 a Código QR 2D GS1",
    subtitleEn:
      "Automatically normalizes your 13-digit EAN-13 into a canonical 14-digit GTIN-14 URI (/01/0...) ready for retail optical checkout scanners.",
    subtitleEs:
      "Normaliza automáticamente tu EAN-13 a GTIN-14 canónico listo para lectores ópticos de supermercado y móviles.",
    faqQuestionEn: "Can an EAN-13 barcode be replaced by a QR code at supermarket checkouts?",
    faqAnswerEn:
      "Yes, under the GS1 Sunrise 2027 initiative, optical POS scanners read 2D QR codes formatted with the GS1 Digital Link URI syntax (/01/{gtin14}).",
  },
  {
    slug: "upc-a-to-2d-barcode-converter",
    navLabelEn: "UPC-A to 2D QR Converter",
    navLabelEs: "Convertir UPC-A a QR 2D",
    defaultTab: "2d",
    defaultPresetKey: "supplementUs",
    title: "Free 12-Digit UPC-A to GS1 2D QR Barcode Converter (US Sunrise 2027)",
    description:
      "Convert 12-digit North American UPC-A barcodes into GS1 Sunrise 2027 2D QR codes for US retail POS scanners and smartphone product pages. Export SVG & 300 DPI PNG.",
    h1En: "Convert 12-Digit UPC-A Barcode to 2D GS1 QR Code",
    h1Es: "Conversor de Código UPC-A (12 dígitos) a QR 2D GS1",
    subtitleEn:
      "Pre-loaded with a 12-digit US UPC-A barcode. Automatically pads two leading zeros to form a valid GTIN-14 Digital Link.",
    subtitleEs:
      "Precargado con un código UPC-A estadounidense de 12 dígitos. Añade automáticamente los dos ceros iniciales del estándar GTIN-14.",
    faqQuestionEn: "How does a 12-digit UPC-A convert to a 14-digit GTIN in GS1 Digital Link?",
    faqAnswerEn:
      "A 12-digit UPC-A is converted to a 14-digit GTIN-14 by prepending two leading zeros (00) while keeping the same Modulo-10 check digit.",
  },
  {
    slug: "hybrid-1d-ean13-2d-qr-label",
    navLabelEn: "Hybrid 1D Bars + 2D QR",
    navLabelEs: "Etiqueta Híbrida Barras + QR",
    defaultTab: "hybrid",
    defaultPresetKey: "oliveOil",
    title: "Free Hybrid 1D EAN-13 Barcode + 2D GS1 QR Label Generator (.SVG Vector)",
    description:
      "Generate side-by-side dual 1D linear EAN-13 barcode and 2D GS1 Digital Link QR code labels in print-ready vector SVG for the 2026-2027 retail transition.",
    h1En: "Hybrid 1D Barcode + 2D GS1 QR Code Label Generator",
    h1Es: "Generador de Etiqueta Híbrida: Código de Barras 1D + QR 2D",
    subtitleEn:
      "Recommended during the 2026–2027 transition period: print both classic linear bars and the new 2D QR code side by side.",
    subtitleEs:
      "Recomendado para la transición 2026–2027: imprime las barras clásicas y el nuevo QR 2D juntos en un solo vector .SVG.",
    faqQuestionEn: "Why print both 1D linear bars and a 2D QR code on packaging?",
    faqAnswerEn:
      "During the Sunrise 2027 transition, co-locating the classic EAN-13/UPC barcode alongside the 2D GS1 Digital Link QR code ensures 100% compatibility with both legacy laser scanners and modern camera checkouts.",
  },
  {
    slug: "eu-digital-product-passport-qr",
    navLabelEn: "EU Product Passport (DPP)",
    navLabelEs: "Pasaporte Digital UE (DPP)",
    defaultTab: "dpp",
    defaultPresetKey: "cosmeticsFr",
    title: "Free EU Digital Product Passport (DPP / ESPR 2024/1781) QR Generator",
    description:
      "Create EU Digital Product Passport (DPP) QR codes compliant with Ecodesign Regulation (EU) 2024/1781 and GS1 Digital Link. Includes origin, carbon footprint, and packaging recyclability.",
    h1En: "Free EU Digital Product Passport (DPP) QR Code Generator",
    h1Es: "Generador Gratis de QR para el Pasaporte Digital de Producto UE",
    subtitleEn:
      "Combine your GS1 retail barcode with a cookie-free mobile Product Passport showing origin, packaging materials, and carbon footprint.",
    subtitleEs:
      "Combina el código de barras comercial con la ficha móvil del Pasaporte Europeo (origen, reciclaje de envase y huella de carbono).",
    faqQuestionEn: "What is required in an EU Digital Product Passport (DPP) QR code?",
    faqAnswerEn:
      "Under the EU Ecodesign for Sustainable Products Regulation (ESPR 2024/1781), products must carry a data carrier (such as a GS1 Digital Link QR code) linking to product identity, origin, material composition, and recycling instructions.",
  },
  {
    slug: "batch-lot-expiry-qr-barcode",
    navLabelEn: "Batch (AI 10) & Expiry (AI 17) QR",
    navLabelEs: "QR con Lote (10) y Caducidad (17)",
    defaultTab: "2d",
    defaultPresetKey: "oliveOil",
    title: "Generate Barcode QR with Batch/Lot (AI 10) & Expiration Date (AI 17)",
    description:
      "Encode dynamic batch/lot numbers (GS1 AI 10), expiration dates (AI 17), and serial numbers (AI 21) into a single 2D GS1 Digital Link QR code for food, pharma, and cosmetics.",
    h1En: "Barcode QR Generator with Batch/Lot (AI 10) & Expiry Date (AI 17)",
    h1Es: "Generador de QR GS1 con Lote (AI 10) y Fecha de Caducidad (AI 17)",
    subtitleEn:
      "Enable automatic expired-product blocking at retail POS checkouts and instant lot traceability.",
    subtitleEs:
      "Permite que las cajas de supermercado detecten automáticamente la fecha de caducidad y el lote del envase.",
    faqQuestionEn: "How are Batch/Lot and Expiry Date encoded in a GS1 Digital Link URL?",
    faqAnswerEn:
      "Batch/Lot uses path segment '/10/{lot}' and Expiration Date uses query parameter '?17=YYMMDD' (for example: /01/08412345678905/10/LOT26A?17=271231).",
  },
  {
    slug: "amazon-gtin-ean-validator",
    navLabelEn: "Amazon GTIN / EAN Validator",
    navLabelEs: "Validador EAN / GTIN para Amazon",
    defaultTab: "2d",
    defaultPresetKey: "supplementUs",
    title: "Free Amazon FBA GTIN, EAN-13 & UPC Check Digit Validator & Fixer",
    description:
      "Fix invalid GTIN, EAN-13, or UPC-A barcode errors in Amazon Seller Central. Verify GS1 prefix country and Modulo-10 check digit in 1 click.",
    h1En: "Free Amazon GTIN, EAN-13 & UPC Barcode Validator",
    h1Es: "Validador y Corrector de Códigos EAN y UPC para Amazon FBA",
    subtitleEn:
      "Getting an 'Invalid Product ID' error on Amazon Seller Central? Check and repair your barcode's Modulo-10 check digit instantly.",
    subtitleEs:
      "¿Amazon Seller Central rechaza tu EAN o UPC? Comprueba y corrige el último dígito de control en un clic.",
    faqQuestionEn: "Why does Amazon Seller Central reject my EAN or UPC barcode?",
    faqAnswerEn:
      "The most common cause is an incorrect final Modulo-10 check digit or a missing leading zero when converting between 12-digit UPC-A, 13-digit EAN-13, and 14-digit GTIN-14.",
  },
];
