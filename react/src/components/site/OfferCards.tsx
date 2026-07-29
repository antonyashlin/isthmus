"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { CardFlip } from "@/components/kokonutui/card-flip";

/**
 * "Three ways to work with us" — Kokonut UI's card-flip, three up.
 *
 * The front carries the offering and who it is for; the back turns to the
 * capabilities. That replaces the liquid-glass cards, whose capability list
 * only appeared on hover as an overlay — the flip makes the two readings
 * explicit rather than stacking one on top of the other.
 *
 * BlurFade brings the three in on scroll; the flip itself is the card's own
 * hover/focus state, so nothing here re-renders while the pointer moves.
 */

export type Offer = {
  key: string;
  title: string;
  blurb: string;
  caps: string[];
  feature?: boolean;
};

export function OfferCards({ offers }: { offers: Offer[] }) {
  return (
    <div className="offers">
      {offers.map((o, i) => (
        <BlurFade className="offer-slot" delay={i * 0.1} inView key={o.key}>
          <CardFlip
            feature={o.feature}
            features={o.caps}
            subtitle={o.blurb}
            title={o.title}
          />
        </BlurFade>
      ))}
    </div>
  );
}
