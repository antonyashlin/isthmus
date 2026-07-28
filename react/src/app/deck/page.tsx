import { FoundingDeck } from "@/decks/founding/FoundingDeck";

/**
 * The founding-partner deck.
 *
 * ECharts and the world map are the heaviest things this repo imports, and `/`
 * was deliberately stripped of ECharts for page speed. Next's route-level code
 * splitting is what keeps that cost here: the deck chunk is only fetched when
 * someone opens /deck, so the marketing site's bundle is untouched.
 *
 * The deck itself is a client component; everything that touches `window` runs
 * in an effect, so the static export prerenders the markup without incident.
 */
export default function DeckPage() {
  return <FoundingDeck />;
}
