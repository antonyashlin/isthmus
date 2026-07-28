import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Isthmus Meridian — Founding-Partner Deck",
  description:
    "The private-markets back office, rebuilt as an AI company. Confidential founding-partner opportunity.",
  // A confidential deck should not be indexed, and the site's sitemap does not
  // list it. This is the belt to that suspenders.
  robots: { index: false, follow: false, nocache: true },
};

export default function DeckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
