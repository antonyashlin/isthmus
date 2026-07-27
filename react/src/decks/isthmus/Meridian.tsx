import * as React from "react";

/**
 * The Isthmus Meridian mark — the "crossing": two arcs that bow IN toward a
 * central meridian line, pinching near the middle and flaring out at the top and
 * bottom ( )|( ). Traced pixel-for-pixel from the master deck's closing slide:
 * the arc control handles sit exactly on the line ("the line you cross it by").
 * The line is plain — no serif caps. `MeridianMark` is the compact lockup glyph;
 * `MeridianGlobe` nests it in the longitude/latitude wireframe used on the cover.
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
      strokeWidth={1.4}
      strokeLinecap="round"
      role="img"
      aria-label={title}
      {...props}
    >
      {/* the meridian line — plain, no caps, slightly taller than the arcs */}
      <line x1="24" y1="9" x2="24" y2="39" />
      {/* left arc ) — tips flare out, belly bows in toward the line */}
      <path d="M12.5 12 C 24 18, 24 30, 12.5 38" />
      {/* right arc ( — mirror */}
      <path d="M35.5 12 C 24 18, 24 30, 35.5 38" />
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
      {/* the crossing mark, brighter, centred ( )|( ) */}
      <g stroke="currentColor" strokeWidth={2.6} strokeLinecap="round">
        <line x1="100" y1="67" x2="100" y2="133" />
        <path d="M74.7 74 C 100 87, 100 113, 74.7 131" />
        <path d="M125.3 74 C 100 87, 100 113, 125.3 131" />
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
