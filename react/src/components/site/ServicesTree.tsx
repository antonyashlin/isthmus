"use client";

import { animate, createDrawable, stagger } from "animejs";
import { useEffect, useMemo, useRef, useState } from "react";

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
 * `vector-effect: non-scaling-stroke` keeps the line weight honest.
 *
 * Because every node is absolutely positioned, highlighting never reflows.
 */

export type TreeLeaf = { key: string; name: string; desc: string };
export type TreeBranch = { key: string; name: string; leaves: TreeLeaf[] };

const EASE = "cubicBezier(0.22, 1, 0.36, 1)";
/** leaf centres, top to bottom, as a % of the plot height */
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
  const [active, setActive] = useState<string | null>(null);
  const scope = useRef<HTMLDivElement>(null);
  const detail = useRef<HTMLParagraphElement>(null);

  // flatten once: every leaf carries its row index and its owning branch
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
      const y = (Math.min(...ys) + Math.max(...ys)) / 2;
      return { ...b, y };
    });
    return { leaves, spines };
  }, [branches]);

  const activeLeaf = layout.leaves.find((l) => l.key === active);
  const activeBranch = activeLeaf?.branch ?? null;

  // enter: draw the connectors, then bring the nodes in behind them
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

  // swap the detail line with a short lift rather than a hard cut
  useEffect(() => {
    const el = detail.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animate(el, {
      opacity: [0, 1],
      y: [6, 0],
      duration: 300,
      ease: EASE,
    });
  }, [active]);

  const hold = (key: string | null) => () => setActive(key);

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
              className={`tr-link${activeBranch === b.key ? " lit" : ""}`}
              d={`M ${ROOT_X} 50 H 23.5 V ${b.y} H ${BRANCH_X}`}
              key={`s-${b.key}`}
            />
          ))}
          {layout.leaves.map((l) => {
            const b = layout.spines.find((s) => s.key === l.branch);
            return (
              <path
                className={`tr-link${active === l.key ? " lit" : ""}`}
                d={`M ${BRANCH_R} ${b?.y ?? 50} H 51 V ${l.y} H ${LEAF_X}`}
                key={`l-${l.key}`}
              />
            );
          })}
        </svg>

        {/* .tr-slot owns the vertical centring, .tr-node owns the animation —
            anime writes `transform` on the node, so it must not also be the
            element carrying translateY(-50%) */}
        <div className="tr-slot slot-root" style={{ top: "50%" }}>
          <div className="tr-node tr-root">{root}</div>
        </div>

        {layout.spines.map((b) => (
          <div className="tr-slot slot-branch" key={b.key} style={{ top: `${b.y}%` }}>
            <div
              className={`tr-node tr-branch${activeBranch === b.key ? " lit" : ""}`}
            >
              {b.name}
            </div>
          </div>
        ))}

        {layout.leaves.map((l) => (
          <div className="tr-slot slot-leaf" key={l.key} style={{ top: `${l.y}%` }}>
            <button
              className={`tr-node tr-leaf${active === l.key ? " lit" : ""}`}
              onBlur={hold(null)}
              onFocus={hold(l.key)}
              onMouseEnter={hold(l.key)}
              onMouseLeave={hold(null)}
              type="button"
            >
              {l.name}
            </button>
          </div>
        ))}
      </div>

      <p className="tree-detail" key={active ?? "root"} ref={detail}>
        {activeLeaf ? activeLeaf.desc : summary}
      </p>
    </div>
  );
}
