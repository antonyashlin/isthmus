"use client";

/**
 * The gap's area chart, on Bklit. Three sparse, unevenly-spaced years is
 * exactly the case Bklit's own date axis can't carry (it assumes a dense,
 * regular series) — everything else in the deck is on ECharts.
 */

import { curveNatural } from "@visx/curve";
import { Area, AreaChart, ChartTooltip, Grid, YAxis } from "@/components/charts";
import { GAP } from "./content";

/* -------------------------------------------------------------- IV · the gap */

export function GapChart() {
  const data = GAP.years.map((y, i) => ({
    date: new Date(y, 0, 1),
    aum: GAP.series.aum.values[i],
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      {/* Three sparse, unevenly-spaced years — Bklit's date axis assumes a
          dense/regular series and collapses to a single day/month tick with
          no year. A plain caption row under the plot says what it needs to. */}
      <div className="fd-chart-fill" style={{ flex: 1, minHeight: 0 }}>
        <AreaChart
          aspectRatio="4.8 / 1"
          data={data}
          margin={{ top: 24, right: 24, bottom: 10, left: 48 }}
        >
          <Grid horizontal />
          <Area
            curve={curveNatural}
            dataKey="aum"
            fill="var(--accent-ink)"
            fillOpacity={0.22}
            stroke="var(--accent-ink)"
            strokeWidth={2.5}
          />
          <YAxis formatValue={(v) => `$${v}T`} />
          <ChartTooltip />
        </AreaChart>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 24px 0 48px" }}>
        {GAP.years.map((y) => (
          <span key={y} className="fd-col-n">
            {y}
          </span>
        ))}
      </div>
    </div>
  );
}
