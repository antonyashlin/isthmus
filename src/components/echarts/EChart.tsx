"use client";

import * as React from "react";
import * as echarts from "echarts";
import { motion } from "motion/react";
import {
  type IsthmusTokens,
  isthmusEChartsTheme,
  resolveIsthmusTokens,
} from "./theme";

// Bklit's enter signature (from @bklit/chart-animation): a left-to-right reveal,
// tween, cubic-bezier(0.85,0,0.15,1), 1100ms. ECharts' own draw animation is
// switched off so this clip wipe is the single enter motion — identical feel
// across every chart type, maps and complex charts included.
const BKLIT_EASE: [number, number, number, number] = [0.85, 0, 0.15, 1];
const BKLIT_DURATION_S = 1.1;

/** Resolve the live Isthmus tokens on the client (for visualMap ramps etc.). */
export function useIsthmusTokens(): IsthmusTokens {
  const [t, setT] = React.useState<IsthmusTokens>(() => resolveIsthmusTokens());
  React.useEffect(() => {
    setT(resolveIsthmusTokens());
  }, []);
  return t;
}

export interface EChartProps {
  /** ECharts option. */
  option: echarts.EChartsCoreOption;
  height?: number | string;
  /** Register a map before rendering (name + GeoJSON). */
  map?: { name: string; geoJson: unknown };
  /** Play the Bklit reveal on mount. Default true. */
  reveal?: boolean;
  /** Bump to replay the reveal. */
  replayKey?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export function EChart({
  option,
  height = 380,
  map,
  reveal = true,
  replayKey,
  className,
  style,
}: EChartProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<echarts.ECharts | null>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (map) {
      // registerMap is idempotent-enough; re-registering the same name is fine.
      echarts.registerMap(map.name, map.geoJson as never);
    }
    echarts.registerTheme("isthmus", isthmusEChartsTheme(resolveIsthmusTokens()));
    const chart = echarts.init(host, "isthmus", { renderer: "canvas" });
    chartRef.current = chart;

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(host);

    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
    // Only (re)create the instance when a map registration changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map?.name]);

  React.useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.setOption(
      {
        // Enter is the clip reveal; keep smooth updates for interaction.
        animationDuration: 0,
        animationDurationUpdate: 320,
        animationEasingUpdate: "cubicOut",
        ...(option as object),
      },
      { notMerge: true },
    );
  }, [option]);

  return (
    <motion.div
      key={replayKey}
      className={className}
      initial={reveal ? { clipPath: "inset(0 100% 0 0)" } : false}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: BKLIT_DURATION_S, ease: BKLIT_EASE }}
      style={{ width: "100%", ...style }}
    >
      <div ref={hostRef} style={{ width: "100%", height }} />
    </motion.div>
  );
}
