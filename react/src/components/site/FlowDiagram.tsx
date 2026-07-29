"use client";

import {
  BadgeCheck,
  Banknote,
  ChartNoAxesCombined,
  FileSpreadsheet,
  FileText,
  Landmark,
  Scale,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { AnimatedList } from "@/components/ui/animated-list";
import { BorderBeam } from "@/components/ui/border-beam";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { MeridianMark } from "@/decks/isthmus/Meridian";

/**
 * "You send → We operate → You receive" — the three steps, each with its own
 * illustration, wired together by Magic UI's AnimatedBeam.
 *
 * Every moving part is an imported component:
 *   · AnimatedList     — requests piling into the inbox ("you send")
 *   · OrbitingCircles  — the bench turning around the meridian mark ("we operate")
 *   · BorderBeam       — the finished deliverable being sealed ("you receive")
 *   · AnimatedBeam     — the connectors between them
 * Icons are lucide. Nothing here is a hand-drawn path.
 *
 * The beams measure from live DOM refs, so the ports are the only geometry that
 * matters: CSS moves them to the plate's side edges on wide screens and to the
 * top/bottom edges once the columns stack, and the beams re-measure themselves
 * through their own ResizeObserver. No JS branch on viewport.
 */

/* Screen 4 is always the paper theme, so these are the light-side tokens:
   --sky #88C1ED leads the pulse, --accent-ink #2f628a carries its body. */
const BEAM_LEAD = "#88C1ED";
const BEAM_BODY = "#2f628a";

const INBOUND = [
  { icon: FileSpreadsheet, label: "Deal model" },
  { icon: FileText, label: "LP report" },
  { icon: Banknote, label: "Fundraise pack" },
  { icon: Search, label: "Research memo" },
] as const;

/* the bench: what actually turns while the work is with us */
const ORBIT_INNER = [FileSpreadsheet, ChartNoAxesCombined, Landmark] as const;
const ORBIT_OUTER = [Scale, Users, Banknote, FileText] as const;

export function FlowDiagram() {
  const container = useRef<HTMLDivElement>(null);
  const outA = useRef<HTMLSpanElement>(null);
  const inB = useRef<HTMLSpanElement>(null);
  const outB = useRef<HTMLSpanElement>(null);
  const inC = useRef<HTMLSpanElement>(null);

  /* AnimatedList fills once and stops by design, which is right for an inbox —
     remounting it on a cycle is what turns it back into a loop. */
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setCycle((c) => c + 1), 9000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flow reveal" ref={container}>
      <div className="fstep">
        <div className="flow-plate">
          <AnimatedList className="fbox" delay={900} key={cycle}>
            {INBOUND.map(({ icon: Icon, label }) => (
              <div className="fin" key={label}>
                <Icon aria-hidden="true" size={15} strokeWidth={1.5} />
                <span>{label}</span>
              </div>
            ))}
          </AnimatedList>
        </div>
        <span className="fport port-out" ref={outA} />
        <div className="fk">You send</div>
        <p>A deal, a model, a reporting need, a fundraise, a research question.</p>
      </div>

      <div className="fstep">
        <div className="flow-plate">
          <div className="fbench">
            <MeridianMark className="fbench-mark" title="" />
            <OrbitingCircles duration={26} iconSize={26} path={false} radius={40}>
              {ORBIT_INNER.map((Icon, i) => (
                <span className="forb" key={`i${i}`}>
                  <Icon aria-hidden="true" size={13} strokeWidth={1.5} />
                </span>
              ))}
            </OrbitingCircles>
            <OrbitingCircles duration={36} iconSize={26} path={false} radius={64} reverse>
              {ORBIT_OUTER.map((Icon, i) => (
                <span className="forb" key={`o${i}`}>
                  <Icon aria-hidden="true" size={13} strokeWidth={1.5} />
                </span>
              ))}
            </OrbitingCircles>
          </div>
        </div>
        <span className="fport port-in" ref={inB} />
        <span className="fport port-out" ref={outB} />
        <div className="fk">We operate</div>
        <p>On an AI-first bench, to your firm&rsquo;s standard, at the pace of a live raise.</p>
      </div>

      <div className="fstep">
        <div className="flow-plate">
          <div className="fout">
            <BorderBeam
              borderWidth={1.5}
              className="fseam"
              colorFrom={BEAM_LEAD}
              colorTo={BEAM_BODY}
              duration={7}
              size={70}
            />
            <BadgeCheck aria-hidden="true" className="fout-seal" size={20} strokeWidth={1.4} />
            <span className="fout-rule" />
            <span className="fout-rule" />
            <span className="fout-rule short" />
            <div className="fout-cap">Signed off</div>
          </div>
        </div>
        <span className="fport port-in" ref={inC} />
        <div className="fk">You receive</div>
        <p>Completed, institutional-grade work, ready for the IC or the LP.</p>
      </div>

      <AnimatedBeam
        className="fbeam"
        containerRef={container}
        duration={4}
        fromRef={outA}
        gradientStartColor={BEAM_LEAD}
        gradientStopColor={BEAM_BODY}
        pathColor={BEAM_BODY}
        pathOpacity={0.16}
        pathWidth={1.5}
        toRef={inB}
      />
      <AnimatedBeam
        className="fbeam"
        containerRef={container}
        delay={1.1}
        duration={4}
        fromRef={outB}
        gradientStartColor={BEAM_LEAD}
        gradientStopColor={BEAM_BODY}
        pathColor={BEAM_BODY}
        pathOpacity={0.16}
        pathWidth={1.5}
        toRef={inC}
      />
    </div>
  );
}
