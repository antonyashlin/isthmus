"use client";

import { useEffect, useState } from "react";

import { MeridianMark } from "@/decks/isthmus/Meridian";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";

/**
 * "A brain for private equity" — the six things that make it one, turning around
 * the core.
 *
 * Replaces the six contrast switches. The argument is unchanged — each quality
 * still carries what it is instead of — but a row of toggles read as a feature
 * comparison, and the claim on this screen is that these are one system rather
 * than six checkboxes. Magic UI's OrbitingCircles is the form: two
 * counter-rotating rings around a single centre.
 *
 * The rings counter-rotate each chip against its own orbit, so the labels stay
 * upright and readable while they travel. Pointing at one holds it and shows
 * what it replaces; releasing hands it back.
 */

type Quality = { ours: string; theirs: string };

/* One ring, not two. Two rings collide: these chips are ~130px of text, so an
   inner chip's outer edge overlaps an outer chip's inner edge whenever the two
   line up radially. Six on a single orbit sit ~180px apart along the arc, which
   clears the widest label. */
const QUALITIES: Quality[] = [
  { ours: "Integrated", theirs: "fragmented across vendors" },
  { ours: "Investment-specific", theirs: "generic back-office labour" },
  { ours: "Embedded", theirs: "external and at arm's length" },
  { ours: "AI-enabled", theirs: "labour-only" },
  { ours: "Execution", theirs: "another software licence" },
  { ours: "Scalable", theirs: "dependent on internal hiring" },
];

const SUMMARY = "Point at one to see what it replaces.";

/* OrbitingCircles takes radius in px, so it cannot come from a clamp() — the
   breakpoint is read here instead and the drawn ring follows it in CSS. */
function useRadius() {
  const [r, setR] = useState(178);
  useEffect(() => {
    const wide = matchMedia("(min-width:1000px)");
    const mid = matchMedia("(min-width:620px)");
    const pick = () => setR(wide.matches ? 178 : mid.matches ? 140 : 108);
    pick();
    wide.addEventListener("change", pick);
    mid.addEventListener("change", pick);
    return () => {
      wide.removeEventListener("change", pick);
      mid.removeEventListener("change", pick);
    };
  }, []);
  return r;
}

export function BrainOrbit() {
  const [held, setHeld] = useState<Quality | null>(null);
  const radius = useRadius();

  const chip = (q: Quality) => (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: focus stop so keyboard users get the same reading as hover
    <span
      className="bo-chip"
      key={q.ours}
      onBlur={() => setHeld((c) => (c === q ? null : c))}
      onFocus={() => setHeld(q)}
      onMouseEnter={() => setHeld(q)}
      onMouseLeave={() => setHeld((c) => (c === q ? null : c))}
      tabIndex={0}
    >
      {q.ours}
    </span>
  );

  return (
    <div className={`brainorbit${held ? " holding" : ""}`}>
      <div
        className="bo-plot"
        style={{ "--orbit-r": `${radius}px` } as React.CSSProperties}
      >
        <div className="bo-core">
          <MeridianMark title="" />
        </div>
        <OrbitingCircles duration={54} iconSize={0} path={false} radius={radius}>
          {QUALITIES.map(chip)}
        </OrbitingCircles>
      </div>

      <p className="bo-detail">
        {held ? (
          <>
            <span className="bo-ours">{held.ours}</span>
            <span className="bo-sep">not</span>
            <span className="bo-theirs">{held.theirs}</span>
          </>
        ) : (
          SUMMARY
        )}
      </p>
    </div>
  );
}
