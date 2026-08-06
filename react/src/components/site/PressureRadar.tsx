"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  RadarArea,
  RadarAxis,
  RadarChart,
  RadarGrid,
  useRadarStable,
} from "@/components/charts";

/**
 * Private-market pressure, on the Bklit radar. The chart is the real component;
 * the vertices and the key beside it are wired to one shared `active` index, so
 * pointing at either the plot or the key opens the same reading.
 */

export type PressureMetric = {
  key: string;
  label: string;
  /** headline change, e.g. 44 for +44% */
  amount: number;
  display: string;
  note: string;
};

/** metrics arrive as 0–100 percentages already, matching the radar's own domain */
const SCALE_MAX = 100;

function Vertices({
  metrics,
  active,
  onActive,
}: {
  metrics: PressureMetric[];
  active: number | null;
  onActive: (i: number | null) => void;
}) {
  const { getPointPosition, getAngle, radius } = useRadarStable();

  return (
    <g>
      {metrics.map((m, i) => {
        const p = getPointPosition(i, (m.amount / SCALE_MAX) * 100);
        const a = getAngle(i);
        const lx = (radius + 34) * Math.cos(a);
        const ly = (radius + 34) * Math.sin(a);
        const on = active === i;
        return (
          <g key={m.key}>
            <text
              className={`rdr-lab${on ? " on" : ""}`}
              textAnchor="middle"
              x={lx}
              y={ly - 6}
            >
              {m.label}
            </text>
            <text
              className={`rdr-val${on ? " on" : ""}`}
              textAnchor="middle"
              x={lx}
              y={ly + 13}
            >
              {m.display}
            </text>
            <motion.circle
              animate={{ r: on ? 7.5 : 4 }}
              className="rdr-dot"
              cx={p.x}
              cy={p.y}
              transition={{ type: "spring", bounce: 0, duration: 0.32 }}
            />
            <circle
              className="rdr-hit"
              cx={p.x}
              cy={p.y}
              onMouseEnter={() => onActive(i)}
              onMouseLeave={() => onActive(null)}
              r={24}
            />
          </g>
        );
      })}
    </g>
  );
}

export function PressureRadar({ metrics }: { metrics: PressureMetric[] }) {
  const [active, setActive] = useState<number | null>(null);

  const series = [
    {
      label: "Change vs prior year",
      values: Object.fromEntries(
        metrics.map((m) => [m.key, (m.amount / SCALE_MAX) * 100])
      ),
    },
  ];

  return (
    <div className="radarw">
      <div className="radarw-plot">
        <RadarChart
          data={series}
          levels={4}
          margin={74}
          metrics={metrics.map(({ key, label }) => ({ key, label }))}
        >
          {/* Bklit offsets the grid polygon half a step so it sits between the
              axes. With four metrics that reads as squares behind a diamond —
              rotate it back onto the axes so grid and series share a shape. */}
          <g transform={`rotate(${-180 / metrics.length})`}>
            <RadarGrid showLabels={false} strokeOpacity={0.45} />
          </g>
          <RadarAxis strokeOpacity={0.4} />
          <RadarArea index={0} />
          <Vertices active={active} metrics={metrics} onActive={setActive} />
        </RadarChart>
      </div>

      <ul className="radarw-key">
        {metrics.map((m, i) => {
          const on = active === i;
          return (
            <li key={m.key}>
              <button
                className={`rk${on ? " on" : ""}`}
                onBlur={() => setActive((c) => (c === i ? null : c))}
                onFocus={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive((c) => (c === i ? null : c))}
                type="button"
              >
                <span className="rk-top">
                  <span className="rk-label">{m.label}</span>
                  <span className="rk-val">{m.display}</span>
                </span>
                <span className="rk-note">{m.note}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
