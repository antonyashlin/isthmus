"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { type ReactNode, useState } from "react";
import { LiquidGlassCard } from "@/components/kokonutui/liquid-glass-card";

/**
 * Kokonut liquid-glass cards, made interactive: the pointer drags a soft
 * meridian-blue spotlight across the glass, the card lifts, and a second layer
 * of detail fades up from space that was already reserved — so nothing on a
 * fixed-height screen reflows while you point at it.
 */

const LIFT = { type: "spring", bounce: 0, duration: 0.4 } as const;

function GlassShell({
  className,
  on,
  onOn,
  onOff,
  children,
}: {
  className: string;
  on: boolean;
  onOn: () => void;
  onOff: () => void;
  children: ReactNode;
}) {
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const spot = useMotionTemplate`radial-gradient(240px circle at ${mx}px ${my}px, rgba(136,193,237,0.20), transparent 68%)`;

  return (
    <motion.div
      animate={{ y: on ? -8 : 0 }}
      className="glass-slot"
      onBlur={onOff}
      onFocus={onOn}
      onMouseEnter={onOn}
      onMouseLeave={onOff}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      transition={LIFT}
    >
      <LiquidGlassCard
        className={className}
        glassEffect={false}
        glassSize="lg"
      >
        <motion.span
          animate={{ opacity: on ? 1 : 0 }}
          className="glass-spot"
          style={{ background: spot }}
          transition={{ duration: 0.24 }}
        />
        {children}
      </LiquidGlassCard>
    </motion.div>
  );
}

export type Offer = {
  key: string;
  title: string;
  blurb: string;
  caps: string[];
  feature?: boolean;
};

export function OfferCards({ offers }: { offers: Offer[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="offers">
      {offers.map((o) => {
        const on = active === o.key;
        return (
          <GlassShell
            className={`offer${o.feature ? " feat" : ""}${on ? " on" : ""}${
              active && !on ? " off" : ""
            }`}
            key={o.key}
            on={on}
            onOff={() => setActive((c) => (c === o.key ? null : c))}
            onOn={() => setActive(o.key)}
          >
            {o.feature ? <div className="feat-tag">Central offering</div> : null}
            <h3>{o.title}</h3>
            <p>{o.blurb}</p>
            <ul className={`glass-detail${on ? " on" : ""}`}>
              {o.caps.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </GlassShell>
        );
      })}
    </div>
  );
}

export type Metric = {
  key: string;
  value: string;
  count?: number;
  suffix?: string;
  blurb: string;
  detail: string;
};

export function MetricCards({ metrics }: { metrics: Metric[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="mcards">
      {metrics.map((m) => {
        const on = active === m.key;
        return (
          <GlassShell
            className={`mcard${on ? " on" : ""}${active && !on ? " off" : ""}`}
            key={m.key}
            on={on}
            onOff={() => setActive((c) => (c === m.key ? null : c))}
            onOn={() => setActive(m.key)}
          >
            <strong
              data-count={m.count}
              data-suffix={m.suffix}
              className="mcard-figure"
            >
              {m.value}
            </strong>
            <span className="mcard-blurb">{m.blurb}</span>
            <span className={`glass-detail${on ? " on" : ""}`}>{m.detail}</span>
          </GlassShell>
        );
      })}
    </div>
  );
}
