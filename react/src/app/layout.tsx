import type { Metadata } from "next";
import { Archivo, Source_Serif_4 } from "next/font/google";
import "./globals.css";

/**
 * Type system per typography/README.md.
 *
 * `next/font/google` self-hosts these at build time, so the render-blocking
 * cross-origin stylesheet and the two extra DNS+TLS handshakes to
 * fonts.googleapis.com / fonts.gstatic.com are gone — and it generates
 * size-adjust/ascent-override fallback metrics automatically, which is the
 * no-layout-shift requirement in Step 2 without hand-tuning them.
 */

// Body, UI, wordmark, nav, labels. The wdth axis is what lets the wordmark sit
// expanded rather than merely large; the real Thin is why the 150px hairline
// ISTHMUS now works off macOS too.
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

// One serif for everything. Source Serif 4 is variable on `opsz`, so the same
// family sets a 120px wordmark and a 19px inline italic and adjusts its own
// contrast and spacing for each — which is what the two-face split was working
// around. Wider and sturdier than Instrument Serif, and it holds up reversed on
// the dark ground without a weight bump.
const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  style: "italic",
  axes: ["opsz"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Isthmus Meridian · The private-markets back office, rebuilt with AI",
  description:
    "Isthmus Meridian operates the analytical, operational, and reporting functions behind private-market investment firms, from active deal execution through portfolio monitoring.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={`dark ${archivo.variable} ${sourceSerif.variable}`}
      lang="en"
    >
      <body>{children}</body>
    </html>
  );
}
