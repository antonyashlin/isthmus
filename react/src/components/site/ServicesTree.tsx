"use client";

import { animate, createDrawable, cubicBezier, stagger } from "animejs";
import { motion, useReducedMotion } from "motion/react";
import {
  Boxes,
  BrainCircuit,
  ClipboardList,
  Calculator,
  Handshake,
  Radar,
  Telescope,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { MeridianMark } from "@/decks/isthmus/Meridian";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";

/**
 * The operating tree — root → three branches → seven functions.
 *
 * Replaces the ECharts tree (ECharts was 361 KB gz, ~70% of the JS payload, and
 * it was loaded for two charts). This is ~2 KB of SVG + HTML.
 *
 * Geometry is declared in percentages against a `preserveAspectRatio="none"`
 * 100×100 viewBox, so the connectors track the absolutely-positioned HTML nodes
 * at any size. Elbows rather than curves: right angles survive the non-uniform
 * scale without looking warped, and they suit the drafting style of the field.
 *
 * Hover is handled by toggling classes on the DOM directly, NOT React state.
 * Driving it through state re-rendered ten paths and eleven nodes on every
 * pointer move, which showed up as a stutter (worst frame 32ms → 18ms once this
 * and the plate's backdrop-filter were removed).
 */

export type TreeLeaf = { key: string; name: string; desc: string };
export type TreeBranch = { key: string; name: string; leaves: TreeLeaf[] };

/* anime.js v4 dropped the string form of this ease from the core, so the easing
   function is imported and passed directly — the string was silently falling
   back to the default. */
const EASE = cubicBezier(0.22, 1, 0.36, 1);
/* the same curve as EASE above, in the tuple form motion/react takes */
const EASE_MOTION: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* One lucide glyph per function, so hovering a leaf swaps the illustration in
   the detail card as well as the description. */
const LEAF_ICONS: Record<string, LucideIcon> = {
  "deal-team": Handshake,
  modeling: Calculator,
  capital: Telescope,
  "fund-ops": ClipboardList,
  monitoring: Radar,
  intel: Boxes,
  ai: BrainCircuit,
};
const LEAF_Y = [6, 20, 34, 49, 63, 78, 92];
const ROOT_X = 20;
const BRANCH_X = 27;
const BRANCH_R = 46;
const LEAF_X = 55;

export function ServicesTree({
  root,
  branches,
  summary,
}: {
  root: string;
  branches: TreeBranch[];
  summary: string;
}) {
  const scope = useRef<HTMLDivElement>(null);
  /* Only the detail card is React-driven. The tree itself stays on direct DOM
     class toggles and its markup is memoised, so a hover re-renders one card
     rather than ten paths and eleven nodes (see the note above). */
  const [active, setActive] = useState<string | null>(null);

  const layout = useMemo(() => {
    let row = 0;
    const leaves: Array<TreeLeaf & { y: number; branch: string }> = [];
    const spines = branches.map((b) => {
      const first = row;
      for (const l of b.leaves) {
        leaves.push({ ...l, y: LEAF_Y[row] ?? 50, branch: b.key });
        row += 1;
      }
      const ys = LEAF_Y.slice(first, row);
      return { ...b, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
    });
    return { leaves, spines };
  }, [branches]);

  // enter: draw the connectors, bring the nodes in behind them
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("ready");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        el.classList.add("ready");
        animate(createDrawable(".tr-link"), {
          draw: ["0 0", "0 1"],
          duration: 900,
          delay: stagger(70),
          ease: EASE,
        });
        animate(".tr-node", {
          opacity: [0, 1],
          x: [-14, 0],
          duration: 620,
          delay: stagger(55, { start: 180 }),
          ease: EASE,
        });
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // hover: the tree paints via DOM, the detail card via `active`
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    let current: string | null = null;

    const paint = (leafKey: string | null) => {
      if (leafKey === current) return;
      current = leafKey;
      const leaf = layout.leaves.find((l) => l.key === leafKey);
      const branchKey = leaf?.branch ?? null;

      for (const n of el.querySelectorAll<HTMLElement>("[data-leaf]")) {
        n.classList.toggle("lit", n.dataset.leaf === leafKey);
      }
      for (const n of el.querySelectorAll<HTMLElement>("[data-branch]")) {
        n.classList.toggle("lit", n.dataset.branch === branchKey);
      }
      for (const p of el.querySelectorAll<SVGPathElement>("[data-link]")) {
        p.classList.toggle("lit", p.dataset.link === leafKey);
      }
      for (const p of el.querySelectorAll<SVGPathElement>("[data-spine]")) {
        p.classList.toggle("lit", p.dataset.spine === branchKey);
      }

      setActive(leafKey);
    };

    const offs: Array<() => void> = [];
    for (const btn of el.querySelectorAll<HTMLElement>(".tr-leaf")) {
      const k = btn.dataset.leaf ?? null;
      const on = () => paint(k);
      const off = () => paint(null);
      btn.addEventListener("mouseenter", on);
      btn.addEventListener("focus", on);
      btn.addEventListener("mouseleave", off);
      btn.addEventListener("blur", off);
      offs.push(() => {
        btn.removeEventListener("mouseenter", on);
        btn.removeEventListener("focus", on);
        btn.removeEventListener("mouseleave", off);
        btn.removeEventListener("blur", off);
      });
    }
    return () => offs.forEach((o) => o());
  }, [layout]);

  const leaf = active ? layout.leaves.find((l) => l.key === active) : undefined;
  const Icon = active ? LEAF_ICONS[active] : undefined;
  const reduced = useReducedMotion();

  /* memoised so `active` changing re-renders the detail card only — the plot's
     element tree is reused wholesale and React reconciles nothing inside it */
  const plot = useMemo(
    () => (
      <div className="tree-plot">
        <svg
          aria-hidden="true"
          className="tree-links"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          {layout.spines.map((b) => (
            <path
              className="tr-link"
              d={`M ${ROOT_X} 50 H 23.5 V ${b.y} H ${BRANCH_X}`}
              data-spine={b.key}
              key={`s-${b.key}`}
            />
          ))}
          {layout.leaves.map((l) => {
            const b = layout.spines.find((s) => s.key === l.branch);
            return (
              <path
                className="tr-link"
                d={`M ${BRANCH_R} ${b?.y ?? 50} H 51 V ${l.y} H ${LEAF_X}`}
                data-link={l.key}
                key={`l-${l.key}`}
              />
            );
          })}
        </svg>

        <div className="tr-slot slot-root" style={{ top: "50%" }}>
          <div className="tr-node tr-root">{root}</div>
        </div>

        {layout.spines.map((b) => (
          <div className="tr-slot slot-branch" key={b.key} style={{ top: `${b.y}%` }}>
            <div className="tr-node tr-branch" data-branch={b.key}>
              {b.name}
            </div>
          </div>
        ))}

        {layout.leaves.map((l) => (
          <div className="tr-slot slot-leaf" key={l.key} style={{ top: `${l.y}%` }}>
            <button className="tr-node tr-leaf" data-leaf={l.key} type="button">
              {l.name}
            </button>
          </div>
        ))}
      </div>
    ),
    [layout, root]
  );

  return (
    <div className="tree" ref={scope}>
      {plot}

      {/* the illustration: a glyph that blurs in and copy that crossfades,
          both keyed on the hovered leaf so every swap replays.

          The copy is ONE element, not one span per word. Seven leaves stacked
          vertically means a single pointer sweep crosses all of them, and a
          per-word entrance made that seven word-by-word sequences, each
          restarting from zero because the changing key remounts the component.
          AnimatePresence keeps the replay but pays for one animation per swap
          instead of forty. */}
      <div className={`tree-detail${active ? " lit" : ""}`}>
        <BlurFade className="td-glyph" direction="up" key={`g-${active ?? "0"}`}>
          {Icon ? (
            <Icon aria-hidden="true" size={22} strokeWidth={1.4} />
          ) : (
            <MeridianMark title="" />
          )}
        </BlurFade>
        {/* A plain key-remount, exactly as the old TextAnimate did — no
            AnimatePresence. There is nothing to animate OUT of here (the copy
            is replaced, not dismissed), and mode="wait" left the first swap
            after mount stuck at its initial state: the exit ran, the incoming
            paragraph mounted at opacity 0 and never animated in. */}
        <motion.p
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          className="td-copy"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6, filter: "blur(3px)" }}
          key={`t-${active ?? "0"}`}
          transition={{ duration: 0.16, ease: EASE_MOTION }}
        >
          {leaf?.desc ?? summary}
        </motion.p>
        {active ? (
          <BorderBeam
            borderWidth={1.5}
            className="td-beam"
            colorFrom="#88C1ED"
            colorTo="#4686B7"
            duration={5}
            size={64}
          />
        ) : null}
      </div>
    </div>
  );
}
