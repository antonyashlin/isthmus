"use client";

import {
  ChartNoAxesCombined,
  Cog,
  Compass,
  FileSpreadsheet,
  Landmark,
  Ruler,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useRef } from "react";

import {
  FigBench,
  FigChecks,
  FigResolve,
  FigRows,
  FigType,
} from "@/components/site/figures";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { BlurFade } from "@/components/ui/blur-fade";

/**
 * "An embedded team, without the cost of building one" — the five stages of the
 * engagement, which until now were a static rule with five dots on it.
 *
 * The track is four Magic UI AnimatedBeams strung dot-to-dot. Each beam's delay
 * is its own index × its duration and its repeat gap is the rest of the cycle,
 * so a single pulse walks the whole chain and starts over — the travelling light
 * is a consequence of how the beams are configured, not a timer.
 *
 * BlurFade brings each stage in on scroll; lucide carries the glyphs.
 */

/* dark screen: --accent-ink resolves to --sky here */
const BEAM_LEAD = "#C9E2F6";
const BEAM_BODY = "#88C1ED";

const LEG = 1.6;
const LEGS = 4;
const CYCLE = LEG * (LEGS + 1);

const BENCH_GLYPHS = [
  <FileSpreadsheet aria-hidden="true" key="a" size={11} strokeWidth={1.6} />,
  <ChartNoAxesCombined aria-hidden="true" key="b" size={11} strokeWidth={1.6} />,
  <Landmark aria-hidden="true" key="c" size={11} strokeWidth={1.6} />,
];

/* Each stage carries a figure that shows what the stage does, rather than a
   glyph that names it: noise resolving into the firm's standard, the bench
   turning, identical templates running past, work writing itself, functions
   accumulating. */
const STAGES: Array<{
  n: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  fig: React.ReactNode;
}> = [
  {
    n: "01",
    title: "Understand",
    desc: "Map the firm's strategy, standards, and recurring requirements.",
    icon: Compass,
    fig: <FigResolve word="YOUR STANDARD" />,
  },
  {
    n: "02",
    title: "Operate",
    desc: "Take responsibility for defined workflows end to end.",
    icon: Cog,
    fig: <FigBench glyphs={BENCH_GLYPHS} />,
  },
  {
    n: "03",
    title: "Standardize",
    desc: "Build templates, structures, and quality controls.",
    icon: Ruler,
    fig: <FigRows rows={["Template", "Template", "Template", "Template"]} />,
  },
  {
    n: "04",
    title: "Automate",
    desc: "Use AI and tooling to cut repetitive labor.",
    icon: Sparkles,
    fig: <FigType lines={"run monthly pack\n> building…"} />,
  },
  {
    n: "05",
    title: "Expand",
    desc: "Take on additional functions as trust compounds.",
    icon: TrendingUp,
    fig: <FigChecks items={["Reporting", "Monitoring", "Research"]} />,
  },
];

export function JourneyFlow() {
  const container = useRef<HTMLDivElement>(null);
  /* Stable ref objects, one per stage — AnimatedBeam keys its measuring effect
     on ref identity, so a fresh {current} literal per render would leave the
     beams pointing at null and never re-measure. STAGES is a constant, so the
     hook count is too. */
  const d0 = useRef<HTMLSpanElement>(null);
  const d1 = useRef<HTMLSpanElement>(null);
  const d2 = useRef<HTMLSpanElement>(null);
  const d3 = useRef<HTMLSpanElement>(null);
  const d4 = useRef<HTMLSpanElement>(null);
  const dots = [d0, d1, d2, d3, d4];

  return (
    <div className="journey reveal" ref={container}>
      {STAGES.map(({ n, title, desc, icon: Icon, fig }, i) => (
        <BlurFade className="jstep" delay={i * 0.09} inView key={n}>
          <span className="jdot" ref={dots[i]} />
          <div className="jn">{n}</div>
          <div className="jplate">{fig}</div>
          <h3>
            <span className="jglyph">
              <Icon aria-hidden="true" size={15} strokeWidth={1.5} />
            </span>
            {title}
          </h3>
          <p>{desc}</p>
        </BlurFade>
      ))}

      {STAGES.slice(0, LEGS).map((s, i) => (
        <AnimatedBeam
          className="jbeam"
          containerRef={container}
          delay={i * LEG}
          duration={LEG}
          fromRef={dots[i]}
          gradientStartColor={BEAM_LEAD}
          gradientStopColor={BEAM_BODY}
          key={`beam-${s.n}`}
          pathColor={BEAM_BODY}
          pathOpacity={0.22}
          pathWidth={1.5}
          repeatDelay={CYCLE - LEG}
          toRef={dots[i + 1]}
        />
      ))}
    </div>
  );
}
