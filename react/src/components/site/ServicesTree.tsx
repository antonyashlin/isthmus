"use client";

import { animate, createDrawable, stagger } from "animejs";
import { useEffect, useMemo, useRef } from "react";

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

const EASE = "cubicBezier(0.22, 1, 0.36, 1)";
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

  // hover: pure DOM, no re-render
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const detail = el.querySelector<HTMLElement>(".tree-detail");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
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

      if (!detail) return;
      detail.textContent = leaf ? leaf.desc : summary;
      if (reduce) return;
      // no JS keyframe here on purpose: re-running a [6,0] rise on every pointer
      // move restarts the translate from 6px each time, which reads as a jitter
      // when you shuffle quickly. A CSS transition interpolates from wherever
      // the value currently is, so rapid switching just settles.
      detail.classList.add("swapping");
      requestAnimationFrame(() => detail.classList.remove("swapping"));
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
  }, [layout, summary]);

  return (
    <div className="tree" ref={scope}>
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

      <p className="tree-detail">{summary}</p>
    </div>
  );
}
