"use client";

import { Bot, Inbox, PenLine, SearchCheck, type LucideIcon } from "lucide-react";
import { useRef } from "react";

import {
  FigChecks,
  FigResolve,
  FigRows,
  FigType,
} from "@/components/site/figures";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";

/**
 * "Nothing reaches your desk without a sign-off" — the four checkpoints between
 * an AI draft and an IC or LP, with the human gate made explicit rather than
 * implied.
 *
 * Same rig as JourneyFlow: three Magic UI AnimatedBeams strung dot-to-dot, each
 * delayed by its own index so one pulse walks the chain and repeats. The gate
 * itself — "You sign off" — is the step the headline promises, so it carries a
 * BorderBeam while the others just hold their glyph.
 */

/* screen 12 is the paper theme */
const BEAM_LEAD = "#88C1ED";
const BEAM_BODY = "#2f628a";

const LEG = 1.6;
const LEGS = 3;
const CYCLE = LEG * (LEGS + 1);

/* Each checkpoint shows its own work: the draft typing itself, the review
   ticking against a standard, the approval resolving into a decision, the
   finished packs going out. */
const STEPS: Array<{
  k: string;
  p: string;
  icon: LucideIcon;
  gate?: boolean;
  fig: React.ReactNode;
}> = [
  {
    k: "AI drafts",
    p: "First-pass work from an AI-first bench, built to your firm's structure and standard.",
    icon: Bot,
    fig: <FigType lines={"Q3 valuation memo\n> drafting…"} />,
  },
  {
    k: "Bench reviews",
    p: "A senior analyst checks it against your standard before it ever reaches you.",
    icon: SearchCheck,
    fig: <FigChecks items={["Method", "Sources", "Format"]} />,
  },
  {
    k: "You sign off",
    p: "Nothing ships to an IC or an LP without your team's approval.",
    icon: PenLine,
    gate: true,
    fig: <FigResolve word="APPROVED" />,
  },
  {
    k: "IC / LP receives",
    p: "Completed, institutional-grade work, delivered ready to use.",
    icon: Inbox,
    fig: <FigRows reverse rows={["IC pack", "LP report", "Valuation", "Board deck"]} />,
  },
];

export function SignOffFlow() {
  const container = useRef<HTMLDivElement>(null);
  /* stable ref objects — AnimatedBeam keys its measuring effect on ref identity */
  const d0 = useRef<HTMLSpanElement>(null);
  const d1 = useRef<HTMLSpanElement>(null);
  const d2 = useRef<HTMLSpanElement>(null);
  const d3 = useRef<HTMLSpanElement>(null);
  const dots = [d0, d1, d2, d3];

  return (
    <div className="soflow reveal" ref={container}>
      {STEPS.map(({ k, p, icon: Icon, gate, fig }, i) => (
        <BlurFade
          className={`sostep${gate ? " gate" : ""}`}
          delay={i * 0.09}
          inView
          key={k}
        >
          <span className={`sodot${gate ? " feat" : ""}`} ref={dots[i]} />
          <div className="soplate">
            {fig}
            {gate ? (
              <BorderBeam
                borderWidth={1.5}
                className="sobeam-gate"
                colorFrom={BEAM_LEAD}
                colorTo={BEAM_BODY}
                duration={5}
                size={48}
              />
            ) : null}
          </div>
          <div className="sok">
            <span className="soglyph">
              <Icon aria-hidden="true" size={15} strokeWidth={1.5} />
            </span>
            {k}
          </div>
          <p>{p}</p>
        </BlurFade>
      ))}

      {STEPS.slice(0, LEGS).map((s, i) => (
        <AnimatedBeam
          className="sobeam"
          containerRef={container}
          delay={i * LEG}
          duration={LEG}
          fromRef={dots[i]}
          gradientStartColor={BEAM_LEAD}
          gradientStopColor={BEAM_BODY}
          key={`beam-${s.k}`}
          pathColor={BEAM_BODY}
          pathOpacity={0.18}
          pathWidth={1.5}
          repeatDelay={CYCLE - LEG}
          toRef={dots[i + 1]}
        />
      ))}
    </div>
  );
}
