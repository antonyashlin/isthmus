"use client";

import { Columns2, Lock, MapPin, ShieldCheck, type LucideIcon } from "lucide-react";

import {
  FigAudit,
  FigLanes,
  FigResidency,
  FigResolve,
} from "@/components/site/figures";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { DotPattern } from "@/components/ui/dot-pattern";

/**
 * Four proof points backing the sign-off flow's claim.
 *
 * Quiet by intent — these are evidence, not a feature grid — so the motion is
 * an entrance and a hover, never a loop: BlurFade brings them in on scroll one
 * after another, and a BorderBeam traces whichever card is under the pointer.
 * DotPattern lays a faint field behind the row so the navy screen has some
 * texture without another element competing for attention.
 *
 * Glyphs are lucide; the four hand-drawn SVGs that used to live here are gone.
 */

/* Each card shows its claim rather than badging it: two lanes that never meet,
   plaintext lost in noise, an audit genuinely part-way through, and a path that
   runs between two jurisdictions and nowhere else. */
const BADGES: Array<{
  key: string;
  label: string;
  note: string;
  icon: LucideIcon;
  fig: React.ReactNode;
}> = [
  {
    key: "segregation",
    label: "Client segregation",
    note: "Dedicated, isolated workspace per client — no cross-client data mixing.",
    icon: Columns2,
    fig: <FigLanes />,
  },
  {
    key: "confidentiality",
    label: "Confidentiality",
    note: "NDA-covered, need-to-know access, encrypted in transit and at rest.",
    icon: Lock,
    fig: <FigResolve word="ENCRYPTED" />,
  },
  {
    key: "soc2",
    label: "SOC 2 (in progress)",
    note: "Type II audit currently underway.",
    icon: ShieldCheck,
    fig: <FigAudit />,
  },
  {
    key: "residency",
    label: "Data residency",
    note: "Client data is stored and processed in the US and the UAE only.",
    icon: MapPin,
    fig: <FigResidency />,
  },
];

export function TrustBadges() {
  return (
    <div className="badges-wrap">
      <DotPattern
        className="badges-field"
        cr={0.8}
        cx={1}
        cy={1}
        height={18}
        width={18}
      />
      <div className="badges">
        {BADGES.map(({ key, label, note, icon: Icon, fig }, i) => (
          <BlurFade className="badge" delay={i * 0.08} inView key={key}>
            <div className="badge-plate">{fig}</div>
            <div className="badge-label">
              <span className="badge-icon">
                <Icon aria-hidden="true" size={15} strokeWidth={1.5} />
              </span>
              {label}
            </div>
            <p className="badge-note">{note}</p>
            <BorderBeam
              borderWidth={1.5}
              className="badge-beam"
              colorFrom="#C9E2F6"
              colorTo="#88C1ED"
              duration={5}
              size={60}
            />
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
