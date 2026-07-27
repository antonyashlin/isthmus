import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Isthmus Meridian · The private-markets back office, rebuilt with AI",
  description:
    "Isthmus Meridian operates the analytical, operational, and reporting functions behind private-market investment firms, from active deal execution through portfolio monitoring.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@1,500;1,600&family=Newsreader:ital,opsz,wght@1,6..72,400;1,6..72,500;1,6..72,600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
