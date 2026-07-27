"use client";

import { useState } from "react";
import { Gauge } from "@/components/charts";

/**
 * The three back-office pressures CFOs name most, on the Bklit notch gauge.
 * Pointing at a dial brings it forward and opens the reading behind the number.
 */

export type PainDial = {
  key: string;
  label: string;
  value: number;
  note: string;
};

export function PainGauges({ dials }: { dials: PainDial[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="dials">
      {dials.map((d, i) => {
        const on = active === i;
        return (
          <button
            className={`dial${on ? " on" : ""}${active !== null && !on ? " off" : ""}`}
            key={d.key}
            onBlur={() => setActive((c) => (c === i ? null : c))}
            onFocus={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive((c) => (c === i ? null : c))}
            type="button"
          >
            <Gauge
              activeFill="var(--chart-1)"
              centerValue={d.value}
              defaultLabel=""
              height={236}
              suffix="%"
              totalNotches={48}
              value={d.value}
              width={310}
            />
            <span className="dial-label">{d.label}</span>
            <span className="dial-note">{d.note}</span>
          </button>
        );
      })}
    </div>
  );
}
