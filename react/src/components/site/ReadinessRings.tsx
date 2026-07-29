"use client";

import { useState } from "react";
import { Ring, RingChart } from "@/components/charts";
import { NumberTicker } from "@/components/ui/number-ticker";

/**
 * The transaction-readiness gap, on Bklit's concentric ring chart — the second
 * and last chart that was holding ECharts in the bundle.
 *
 * The rings and the key share one hovered index, so pointing at either reads the
 * same row. RingCenter already swaps to the hovered ring's own figure.
 */

export type ReadinessBand = {
  key: string;
  label: string;
  value: number;
  display: string;
  note: string;
};

export function ReadinessRings({ bands }: { bands: ReadinessBand[] }) {
  const [active, setActive] = useState<number | null>(null);
  const shown = bands[active ?? 0] ?? bands[0];

  // Bklit's default ring palette rotates through --chart-3 (gold), which is off
  // this page. Weight the blues instead: the biggest gap reads darkest.
  const RAMP = ["var(--deep)", "var(--steel)", "var(--steel-2)", "var(--sky)"];

  const data = bands.map((b, i) => ({
    label: b.label,
    value: b.value,
    maxValue: 100,
    color: RAMP[i % RAMP.length],
  }));

  return (
    <div className="rings">
      <div className="rings-plot">
        <RingChart
          baseInnerRadius={60}
          data={data}
          hoveredIndex={active}
          onHoverChange={setActive}
          ringGap={7}
          size={321}
          strokeWidth={16}
        >
          {data.map((d, i) => (
            <Ring index={i} key={d.label} />
          ))}
        </RingChart>
        {/* Not RingCenter: its custom renderer only runs while hovering, and its
            fallback sums the rings — 147%, which means nothing when these are
            four independent shares. Own centre, correct at rest and on hover. */}
        {/* The centre figure rolls rather than cutting: it counts up when the
            screen arrives, and rolls between bands as you move across the key. */}
        <div className="rings-center">
          <span className="rings-figure">
            <NumberTicker className="rings-num" value={shown.value} />%
          </span>
          <span className="rings-cap">{shown.label}</span>
        </div>
      </div>

      <ul className="rings-key">
        {bands.map((b, i) => {
          const on = active === i;
          return (
            <li key={b.key}>
              <button
                className={`rk${on ? " on" : ""}`}
                onBlur={() => setActive((c) => (c === i ? null : c))}
                onFocus={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive((c) => (c === i ? null : c))}
                type="button"
              >
                <span className="rk-top">
                  <span className="rk-label">{b.label}</span>
                  <span className="rk-val">{b.display}</span>
                </span>
                <span className="rk-note">{b.note}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
