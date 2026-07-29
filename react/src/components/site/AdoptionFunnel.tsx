"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { InView } from "@/components/site/InView";

/* Same split as the other charts — visx and the funnel runtime arrive when you
   reach the screen, not on first paint. */
const FunnelChart = dynamic(() =>
  import("@/components/charts/funnel-chart").then((m) => m.FunnelChart)
);

/**
 * "The technology works. The expertise is missing." — the integration funnel.
 *
 * The Bklit funnel's default "spread" layout puts the value on the left of the
 * band, the percentage badge in the middle and the stage name on the right,
 * each with `white-space:nowrap` in a 16%-wide box that is allowed to overflow.
 * On a wide screen the plate's side padding absorbs that; on a phone there is
 * no room to absorb it and "Meets the business case" simply runs off the edge
 * of the screen.
 *
 * So on narrow screens the labels move inside the band: value over stage name,
 * centred, and the percentage badge drops — it was the second number in a
 * stack of two and the one the copy does not refer to.
 */

const STAGES = [
  { label: "Meets the business case", value: 95, displayValue: "95%" },
  { label: "Held back by expertise", value: 49, displayValue: "49%" },
  { label: "Actually integrated", value: 31, displayValue: "31%" },
];

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const q = matchMedia("(max-width:760px)");
    const pick = () => setNarrow(q.matches);
    pick();
    q.addEventListener("change", pick);
    return () => q.removeEventListener("change", pick);
  }, []);
  return narrow;
}

export function AdoptionFunnel() {
  const narrow = useNarrow();

  return (
    <InView amount={0.2}>
      <FunnelChart
        color="var(--chart-1)"
        data={STAGES}
        labelAlign="center"
        labelLayout={narrow ? "grouped" : "spread"}
        labelOrientation="vertical"
        orientation="vertical"
        showLabels
        showPercentage={!narrow}
        showValues
        style={{ height: "min(52vh, calc(100vh - 250px))" }}
      />
    </InView>
  );
}
