// frontend/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Anek_Devanagari, Tiro_Devanagari_Hindi, Tillana, Yantramanav } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* 1. Marathi Font (Body Text) - Anek Devanagari for cross-device stability */
const marathiFont = Anek_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-anek",
  display: "swap",
});

/* 2. Sanskrit Font (Shlokas) */
const sanskritFont = Tiro_Devanagari_Hindi({
  weight: ["400"],
  subsets: ["devanagari"],
  variable: "--font-tiro",
  display: "swap",
});

/* 3. Calligraphy/Signature Font (Names) */
const signatureFont = Tillana({
  weight: ["400", "700", "800"],
  subsets: ["devanagari"],
  variable: "--font-tillana",
  display: "swap",
});

/* 4. Bold Headings Font (Shubh Aarambh) */
const yantramanavFont = Yantramanav({
  weight: ["400", "500", "700", "900"],
  subsets: ["devanagari"],
  variable: "--font-yantramanav",
});

/* 3. SEO Metadata - Updated for gavaskarwedding.live */
export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  manifest: "/manifest.json",
  icons: {
    // Adding ?v=1 forces the browser to bypass the cache and load the new file
    icon: [
      { url: "/images/gavaskar-logo.png?v=1", type: "image/png" },
    ],
    shortcut: ["/images/gavaskar-logo.png?v=1"],
    apple: [
      { url: "/images/gavaskar-logo.png?v=1" },
    ],
  },
};

/* 4. Viewport Configuration */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FDFCF0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* The most aggressive way to force Chrome to update the tab icon */}
        <link rel="shortcut icon" href="/images/gavaskar-logo.png?v=1" />
        <link rel="icon" type="image/png" href="/images/gavaskar-logo.png?v=1" />
        <link rel="apple-touch-icon" href="/images/gavaskar-logo.png?v=1" />
      </head>
      <body
        className={cn(
          "relative min-h-screen bg-wedding-paper antialiased overflow-x-hidden font-marathi",
          marathiFont.variable,
          sanskritFont.variable,
          signatureFont.variable,
          yantramanavFont.variable
        )}
      >
        <div
          className="texture-overlay pointer-events-none fixed inset-0 z-[1] opacity-15 mix-blend-multiply"
          aria-hidden="true"
        />

        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}