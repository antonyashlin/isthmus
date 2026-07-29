"use client";

/**
 * The deck's line/area figures, on Bklit — replacing the ECharts line charts
 * that used to carry GAP and MODEL. CompsChart (bar) and StructureMap (geo)
 * stay on ECharts in `echart-charts.tsx`; those aren't line charts.
 */

import { curveNatural } from "@visx/curve";
import {
  Area,
  AreaChart,
  ChartTooltip,
  Grid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "@/components/charts";
import { GAP, MODEL } from "./content";

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

/* -------------------------------------------------------------- VIII · model */

const MODEL_BASE = new Date(2026, 7, 1); // month 0 of the roadmap: August 2026

export function ModelChart() {
  const data = MODEL.quarters.map((_, i) => ({
    date: new Date(MODEL_BASE.getFullYear(), MODEL_BASE.getMonth() + i * 3, 1),
    margin: MODEL.series.margin.values[i],
    automated: MODEL.series.automated.values[i],
  }));

  return (
    <div className="fd-chart-fill">
      <LineChart
        aspectRatio="4.8 / 1"
        data={data}
        margin={{ top: 24, right: 56, bottom: 30, left: 48 }}
      >
        <Grid horizontal />
        <Line
          curve={curveNatural}
          dataKey="margin"
          stroke="var(--accent-ink)"
          strokeWidth={2.5}
          yAxisId="left"
        />
        <Line
          curve={curveNatural}
          dataKey="automated"
          stroke="var(--tx-3)"
          strokeWidth={2}
          yAxisId="right"
        />
        <XAxis />
        <YAxis formatValue={(v) => `${v}%`} yAxisId="left" />
        <YAxis formatValue={(v) => `${v}`} orientation="right" yAxisId="right" />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}
