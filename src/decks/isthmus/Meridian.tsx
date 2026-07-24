import * as React from "react";

/**
 * The Isthmus Meridian mark — the "crossing": two facing arcs bowing away from a
 * central meridian bar ( )|( ), traced from the master deck. `MeridianMark` is
 * the compact lockup glyph; `MeridianGlobe` nests it in the longitude/latitude
 * wireframe used on the cover.
 *
 * Both are stroke-only and inherit `color` via currentColor, so a caller sets
 * the hue with text colour (white lockup, --isth-accent-2 wireframe, etc.).
 */

type MarkProps = React.SVGProps<SVGSVGElement> & { title?: string };

export function MeridianMark({ title = "Isthmus Meridian", ...props }: MarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      role="img"
      aria-label={title}
      {...props}
    >
      {/* central meridian bar with serif caps */}
      <line x1="24" y1="10" x2="24" y2="38" />
      <line x1="20" y1="10" x2="28" y2="10" strokeWidth={1.8} />
      <line x1="20" y1="38" x2="28" y2="38" strokeWidth={1.8} />
      {/* left arc, bowing left away from the bar */}
      <path d="M18 12 C 11 18, 11 30, 18 36" />
      {/* right arc, bowing right away from the bar */}
      <path d="M30 12 C 37 18, 37 30, 30 36" />
    </svg>
  );
}

export function MeridianGlobe({
  title = "Isthmus Meridian",
  ...props
}: MarkProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      role="img"
      aria-label={title}
      {...props}
    >
      {/* wireframe sphere — thin secondary-blue */}
      <g stroke="currentColor" strokeWidth={1} opacity={0.5}>
        <circle cx="100" cy="100" r="72" />
        <line x1="28" y1="100" x2="172" y2="100" />
        <ellipse cx="100" cy="100" rx="30" ry="72" />
        <line x1="100" y1="28" x2="100" y2="172" />
      </g>
      {/* the crossing mark, brighter, centred */}
      <g
        transform="translate(76 76) scale(1)"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
      >
        <line x1="24" y1="8" x2="24" y2="40" />
        <line x1="19" y1="8" x2="29" y2="8" strokeWidth={2} />
        <line x1="19" y1="40" x2="29" y2="40" strokeWidth={2} />
        <path d="M17 10 C 9 17, 9 31, 17 38" />
        <path d="M31 10 C 39 17, 39 31, 31 38" />
      </g>
    </svg>
  );
}

/** The horizontal wordmark lockup: mark + ISTHMUS (bold) MERIDIAN (thin). */
export function MeridianWordmark(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        color: "var(--isth-text)",
        ...props.style,
      }}
    >
      <MeridianMark style={{ width: 26, height: 26 }} />
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 18,
          letterSpacing: "var(--isth-tracking-wordmark)",
        }}
      >
        <b style={{ fontWeight: 700 }}>ISTHMUS</b>{" "}
        <span style={{ fontWeight: 200, color: "var(--isth-muted)" }}>
          MERIDIAN
        </span>
      </span>
    </div>
  );
}
