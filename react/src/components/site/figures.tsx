"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { AnimatedList } from "@/components/ui/animated-list";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import { HyperText } from "@/components/ui/hyper-text";
import { Marquee } from "@/components/ui/marquee";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { TypingAnimation } from "@/components/ui/typing-animation";

/**
 * The small animated figures that sit in the step plates on the journey,
 * sign-off and under-guard screens.
 *
 * Each one is assembled from imported Magic UI components — nothing here draws
 * its own paths or writes its own keyframes. They are collected in one file so
 * the three screens share a single vocabulary rather than each inventing one,
 * and so the cycle timing is declared in one place.
 *
 * Most of the source components play once and stop, which is right for a page
 * you scroll past but wrong for a plate you sit and look at. `useCycle` remounts
 * them on an interval to loop, and returns 0 under reduced motion so they mount
 * once and rest.
 */

function useCycle(ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setN((c) => c + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return n;
}

/* ---- understand / confidentiality: characters resolving out of noise ---- */
export function FigResolve({ word }: { word: string }) {
  const n = useCycle(5200);
  return (
    <div className="fig fig-center">
      <HyperText className="fig-hyper" duration={1100} key={n} startOnView={false}>
        {word}
      </HyperText>
    </div>
  );
}

/* ---- operate: the bench turning ---- */
export function FigBench({ glyphs }: { glyphs: React.ReactNode[] }) {
  return (
    <div className="fig fig-center fig-bench">
      <span className="fig-hub" />
      <OrbitingCircles duration={22} iconSize={24} path={false} radius={40}>
        {glyphs.map((g, i) => (
          <span className="fig-orb" key={i}>
            {g}
          </span>
        ))}
      </OrbitingCircles>
    </div>
  );
}

/* ---- standardize / delivery: identical rows running past ---- */
export function FigRows({
  rows,
  reverse = false,
}: {
  rows: string[];
  reverse?: boolean;
}) {
  return (
    <div className="fig fig-rows">
      <Marquee className="[--duration:14s] [--gap:6px]" reverse={reverse} vertical>
        {rows.map((r) => (
          <span className="fig-row" key={r}>
            {r}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

/* ---- segregation: two lanes that never meet ---- */
export function FigLanes() {
  const bar = (w: number, i: number) => <span className="fig-bar" key={i} style={{ width: w }} />;
  return (
    <div className="fig fig-lanes">
      <div className="fig-lane">
        <Marquee className="[--duration:11s] [--gap:5px]" vertical>
          {[26, 34, 20, 30].map(bar)}
        </Marquee>
      </div>
      <span className="fig-divide" />
      <div className="fig-lane">
        <Marquee className="[--duration:13s] [--gap:5px]" reverse vertical>
          {[30, 22, 32, 25].map(bar)}
        </Marquee>
      </div>
    </div>
  );
}

/* ---- automate / drafting: work writing itself ---- */
export function FigType({ lines }: { lines: string }) {
  const n = useCycle(6400);
  return (
    <div className="fig fig-type">
      <TypingAnimation className="fig-mono" duration={58} key={n} startOnView={false}>
        {lines}
      </TypingAnimation>
    </div>
  );
}

/* ---- review / expand: items landing one after another ---- */
export function FigChecks({ items }: { items: string[] }) {
  const n = useCycle(6800);
  return (
    <div className="fig fig-checks">
      <AnimatedList className="fig-list" delay={820} key={n}>
        {items.map((t) => (
          <span className="fig-check" key={t}>
            <Check aria-hidden="true" size={11} strokeWidth={2.4} />
            {t}
          </span>
        ))}
      </AnimatedList>
    </div>
  );
}

/* ---- residency: two jurisdictions, and a path only between them ---- */
export function FigResidency() {
  const box = useRef<HTMLDivElement>(null);
  const us = useRef<HTMLSpanElement>(null);
  const ae = useRef<HTMLSpanElement>(null);
  return (
    <div className="fig fig-residency" ref={box}>
      <span className="fig-place" ref={us}>
        US
      </span>
      <span className="fig-place" ref={ae}>
        UAE
      </span>
      <AnimatedBeam
        className="fig-beam"
        containerRef={box}
        duration={3.2}
        fromRef={us}
        gradientStartColor="#C9E2F6"
        gradientStopColor="#88C1ED"
        pathColor="#88C1ED"
        pathOpacity={0.22}
        pathWidth={1.5}
        toRef={ae}
      />
    </div>
  );
}

/* ---- SOC 2: an audit that is genuinely part-way through ---- */
export function FigAudit() {
  /* creeps between two points rather than sitting still — "in progress" */
  const n = useCycle(4200);
  return (
    <div className="fig fig-center">
      <AnimatedCircularProgressBar
        className="fig-gauge"
        gaugePrimaryColor="var(--accent-ink)"
        gaugeSecondaryColor="var(--line-2)"
        max={100}
        min={0}
        value={n % 2 === 0 ? 62 : 71}
      />
    </div>
  );
}
