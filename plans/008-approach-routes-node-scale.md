# 008 — Stop the provider nodes appearing from nothing

- **Status**: DONE
- **Commit**: 40625ce
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 1 file, ~6 lines

## Problem

The "Outsource it" route glyph is four provider nodes around an empty centre.
They are set to `scale: 0` before the entrance and animated up to 1:

```ts
/* react/src/components/site/ApproachRoutes.tsx:151-154 — current */
utils.set(bars, { scaleY: 0 });
utils.set(nodes, { scale: 0, opacity: 1 });
if (funnel) utils.set(funnel, { scaleY: 0 });
utils.set(drops, { opacity: 0 });
```

```ts
/* react/src/components/site/ApproachRoutes.tsx:198-201 — current */
const tl = createTimeline({ defaults: { ease: EASE } });
tl.add(bars, { scaleY: 1, duration: 620, delay: stagger(90) }, 0)
  .add(nodes, { scale: 1, duration: 520, delay: stagger(80) }, 120)
  .add(funnel ?? [], { scaleY: 1, duration: 600 }, 200);
```

AUDIT category 3: nothing in the real world appears from nothing. The nodes are
`r={7}` stroked circles (`react/src/components/site/ApproachRoutes.tsx:87-96`),
so at `scale: 0` they are a zero-area point — they pop into being rather than
arriving. Note `opacity: 1` is explicitly set alongside, so there is not even a
fade to soften it.

The stagger makes it four separate pops, 80ms apart.

**Two things in the same block are exempt and must not be changed:**

- `bars` at `scaleY: 0` — the "Build it" glyph is a bar chart
  (`react/src/components/site/ApproachRoutes.tsx:51-62`) with a baseline at
  `y=114` and `transform-origin: 50% 100%`. A bar growing from its own baseline
  is the established convention for chart entry, and the bar has a real anchored
  origin to grow *from*. This is not "appearing from nothing".
- `funnel` at `scaleY: 0` — same reasoning. It has
  `transform-origin: 50% 0%` (`react/src/components/site/ApproachRoutes.tsx:109`)
  and unfurls downward from its own top edge, which is where the input enters.
  The motion is the diagram's meaning.

The nodes are different: they have `transform-origin: 50% 50%`
(`react/src/components/site/ApproachRoutes.tsx:94`) and no anchor. They are just
objects that need to be there.

## Target

```ts
/* target — react/src/components/site/ApproachRoutes.tsx, the utils.set block */
utils.set(bars, { scaleY: 0 });
/* not scale:0 — a stroked r=7 circle at zero is a point, and it pops. 0.9 with
   an opacity fade is the arrival; the bars and the funnel keep their zero
   because each grows from a real anchored edge (baseline / top). */
utils.set(nodes, { scale: 0.9, opacity: 0 });
if (funnel) utils.set(funnel, { scaleY: 0 });
utils.set(drops, { opacity: 0 });
```

```ts
/* target — the timeline */
const tl = createTimeline({ defaults: { ease: EASE } });
tl.add(bars, { scaleY: 1, duration: 620, delay: stagger(90) }, 0)
  .add(nodes, { scale: 1, opacity: 1, duration: 520, delay: stagger(80) }, 120)
  .add(funnel ?? [], { scaleY: 1, duration: 600 }, 200);
```

Exact values, and why each:

| Value | Reason |
| --- | --- |
| `scale: 0.9` | AUDIT category 3's target range is 0.9–0.97. These circles are `r={7}` in a 200×124 viewBox — small — so the low end of the range is needed for the scale to register at all. |
| `opacity: 0 → 1` | AUDIT category 3 pairs the scale with an opacity fade; that is what carries the "arriving" read once the scale is subtle. The current code sets `opacity: 1` up front, which is what makes the pop so bare. |
| `duration: 520`, `stagger(80)`, offset `120` | UNCHANGED. The timeline is choreographed against the bars and the funnel and against the idle loop that starts after it (`react/src/components/site/ApproachRoutes.tsx:202`). Do not retime it. |
| `ease: EASE` (inherited from the timeline defaults) | UNCHANGED. `cubicBezier(0.22, 1, 0.36, 1)` at `react/src/components/site/ApproachRoutes.tsx:18` — the repo's one curve. |

## Interaction with the idle loop and the hover replay

Two other animations touch these same nodes. Check both after the change:

1. **Idle loop** (`react/src/components/site/ApproachRoutes.tsx:160-168`) pulses
   `opacity: [1, 0.45, 1]` on a 2800ms cycle, starting only after the entrance
   timeline resolves (`tl.then(startIdle)` at line 202). Because the entrance now
   ends on `opacity: 1`, the loop picks up from the right value. No change
   needed — but confirm there is no flicker at the handoff.

2. **Hover replay** (`react/src/components/site/ApproachRoutes.tsx:224-231`)
   animates `scale: [1, 1.28, 1]`. It does not touch opacity, so it composes
   with the idle pulse as before. No change needed.

3. **Reduced motion** (`react/src/components/site/ApproachRoutes.tsx:144-149`)
   already forces `opacity: 1` on nodes and returns early before any `utils.set`
   runs:
   ```ts
   if (reduce) {
     utils.set([...bars, ...nodes, ...drops], { opacity: 1 });
     if (funnel) utils.set(funnel, { opacity: 1 });
     el.classList.add("ready");
     return;
   }
   ```
   This is correct as-is and needs no change — but note it never resets `scale`,
   which is fine because the non-reduce `utils.set` block below it never runs in
   that branch.

## Repo conventions to follow

- **anime.js v4 API**: `utils.set` for instant state, `createTimeline` +
  `.add()` for sequencing, `stagger()` for offsets. All already imported at
  `react/src/components/site/ApproachRoutes.tsx:3`.
- **Easing**: `cubicBezier(0.22, 1, 0.36, 1)` bound to `EASE` at
  `react/src/components/site/ApproachRoutes.tsx:18`, with the reason recorded at
  lines 16-17: anime.js v4 dropped string easings from the core, so the function
  must be imported and passed directly. Do not pass a string.
- **Exemplar for a scale-plus-opacity entrance in this codebase**:
  `react/src/components/site/ServicesTree.tsx:112-118`
  ```ts
  animate(".tr-node", {
    opacity: [0, 1],
    x: [-14, 0],
    duration: 620,
    delay: stagger(55, { start: 180 }),
    ease: EASE,
  });
  ```
  Same pattern — a transform paired with an opacity fade, never a transform
  alone from zero.

## Steps

1. In `react/src/components/site/ApproachRoutes.tsx`, replace line 152:
   ```ts
   utils.set(nodes, { scale: 0, opacity: 1 });
   ```
   with the comment and the new state:
   ```ts
   /* not scale:0 — a stroked r=7 circle at zero is a point, and it pops. 0.9
      with an opacity fade is the arrival. The bars and the funnel keep their
      zero: each grows from a real anchored edge (baseline / top), which is the
      diagram's meaning, not an entrance trick. */
   utils.set(nodes, { scale: 0.9, opacity: 0 });
   ```

2. In the same file, replace line 200:
   ```ts
   .add(nodes, { scale: 1, duration: 520, delay: stagger(80) }, 120)
   ```
   with:
   ```ts
   .add(nodes, { scale: 1, opacity: 1, duration: 520, delay: stagger(80) }, 120)
   ```

3. Leave lines 151, 153, 154, 199 and 201 exactly as they are.

4. Confirm no CSS sets an opacity on `.rt-node` that would fight the animation:
   ```bash
   cd /Users/m1/things/isthumus/react && grep -n 'rt-node' src/styles/site.css
   ```
   Expected: one hit at `:412`
   (`.rt-node{fill:none;stroke:var(--accent-ink);stroke-width:1.2}`) with no
   opacity. If it sets one, STOP and report.

## Boundaries

- Do NOT change `bars`' `scaleY: 0` or `funnel`'s `scaleY: 0`. Both are exempt
  for the reasons given above, and "fixing" them would break the diagrams'
  meaning.
- Do NOT change the timeline offsets (`0`, `120`, `200`), durations, or
  staggers. They are choreographed against each other and against the idle loop
  that starts when the timeline resolves.
- Do NOT touch the idle loop (`react/src/components/site/ApproachRoutes.tsx:158-191`),
  the hover handlers (lines 208-247), or the `IntersectionObserver` (lines
  193-206).
- Do NOT touch the reduced-motion branch (lines 144-149). It is correct.
- Do NOT change the glyph SVGs (lines 44-126).
- Do NOT add new dependencies.
- If the code at the cited lines does not match what is quoted (drift since
  commit 40625ce), STOP and report.

## Verification

- **Mechanical**:
  ```bash
  cd /Users/m1/things/isthumus/react && pnpm typecheck
  ```
  Expected: exits 0.
- **Feel check**: run `pnpm dev`, scroll to the "Three ways most funds are built"
  screen (it is a one-shot behind an IntersectionObserver at `threshold: 0.3`, so
  hard-reload and scroll down to replay it), and confirm on the middle "Outsource
  it" glyph:
  - The four circles fade up into place. At no point is a circle a zero-size dot
    that suddenly becomes full size.
  - The four still arrive 80ms apart, in the same order as before.
  - In DevTools → Animations at 10% playback, confirm each circle starts at
    roughly nine-tenths size and fully transparent.
  - The left "Build it" bars still grow from the baseline up, and the right
    "Automate it" funnel still unfurls downward from its top edge. **These must
    be unchanged** — if either now fades instead of growing, the wrong line was
    edited.
  - After the entrance settles, confirm the idle out-of-phase opacity pulse
    starts cleanly with no flicker or jump at the handoff (this is the one place
    the change could regress).
  - Hover the "Outsource it" route: the four circles should still pulse up to
    1.28× and back.
  - In DevTools → Rendering → "Emulate prefers-reduced-motion: reduce", reload
    and confirm all three glyphs render immediately at full size and opacity
    with no animation.
- **Done when**: no node is ever at zero scale, the bars and funnel are visually
  identical to before, and the idle loop hands over without a flicker.
