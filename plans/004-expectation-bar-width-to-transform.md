# 004 — Animate the turnaround bar with transform, not width

- **Status**: DONE
- **Commit**: 40625ce
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 2 files, ~10 lines

## Problem

The middle expectation panel ("Expected response speed is compressing from days
toward hours") shows its claim by collapsing a bar from full width down to 14%.
It does that by animating the `width` property:

```ts
/* react/src/components/site/ExpectationPanels.tsx:52-61 — current */
if (which === 1) {
  const bar = el.querySelector(".xp-bar-fill");
  if (!bar) return;
  utils.set(bar, { width: "100%" });
  if (!reduce) {
    animate(bar, { width: "14%", duration: 900, ease: "inOut(3)" });
  } else {
    utils.set(bar, { width: "14%" });
  }
}
```

```css
/* react/src/styles/site.css:868-870 — current */
.xp-bar{position:relative;height:48px;display:flex;align-items:center}
.xp-bar-fill{position:absolute;left:0;top:50%;height:6px;margin-top:-3px;border-radius:3px;
  background:linear-gradient(90deg,var(--steel),var(--sky))}
```

AUDIT category 5 is explicit: animate `transform` and `opacity` only.
`width`/`height`/`margin`/`padding`/`top`/`left` trigger layout, then paint, then
composite — every frame, on the main thread. Over 900ms at 60fps that is 54
forced layout passes for a bar that could ride the compositor for free.

Two things make it worse here than the general case:

1. This panel replays on **every** hover and focus
   (`react/src/components/site/ExpectationPanels.tsx:106-109`), so the cost is
   not paid once on entry — it is paid every time the pointer crosses the card.
2. It fires while two neighbouring panels are running their own staggered
   animations across 40 and 12 elements
   (`react/src/components/site/ExpectationPanels.tsx:35-41, 70-83`), because all
   three `play()` calls run together on scroll-in
   (`react/src/components/site/ExpectationPanels.tsx:94-96`).

The gradient background is another reason to prefer transform: repainting a
`linear-gradient` at a new width every frame is more expensive than scaling an
already-rasterised layer.

## Target

The bar is laid out at its full width once, in CSS, and the animation scales it
horizontally from its left edge. Visually identical; entirely on the compositor.

```css
/* target — react/src/styles/site.css */
.xp-bar-fill{position:absolute;left:0;top:50%;width:100%;height:6px;margin-top:-3px;
  border-radius:3px;transform-origin:0 50%;
  background:linear-gradient(90deg,var(--steel),var(--sky))}
```

```ts
/* target — react/src/components/site/ExpectationPanels.tsx */
if (which === 1) {
  const bar = el.querySelector(".xp-bar-fill");
  if (!bar) return;
  utils.set(bar, { scaleX: 1 });
  if (!reduce) {
    animate(bar, { scaleX: 0.14, duration: 900, ease: "inOut(3)" });
  } else {
    utils.set(bar, { scaleX: 0.14 });
  }
}
```

Exact values, and why each:

| Value | Reason |
| --- | --- |
| `width: 100%` in CSS | The bar's layout size is now static. It is set once at layout time and never touched again. |
| `transform-origin: 0 50%` | The bar is anchored `left: 0`, so it must collapse toward its left edge to look identical to the old `width` animation. `0 50%` is the left-centre origin. AUDIT category 3: an element's motion origin must match where it is anchored. |
| `scaleX: 1 → 0.14` | Exactly equivalent to `width: 100% → 14%` for a left-anchored element. Same visual, same endpoint. |
| `duration: 900`, `ease: "inOut(3)"` | UNCHANGED. This is a marketing/explanatory figure, not a UI control, and AUDIT category 2 allows longer durations there. `inOut` is also the correct family for something moving/morphing on screen rather than entering. Do not "fix" these. |

`border-radius: 3px` on a horizontally-scaled element will squash the corner
curve as the bar narrows. At a 6px-tall bar with a 3px radius scaled to 0.14,
the left and right caps become slightly elliptical. This is essentially
invisible at that size, but the feel check below asks you to confirm it. If it
does read as wrong, the fallback is `border-radius: 3px / 3px` on a
`will-change: transform` layer — do NOT switch back to animating width.

## Repo conventions to follow

- **This file already animates transforms elsewhere and gets it right.** The
  exemplar is one function up, at
  `react/src/components/site/ExpectationPanels.tsx:34-41`:
  ```ts
  utils.set(ticks, { opacity: 0.18, scaleY: 0.55 });
  animate(Array.from(ticks).slice(0, LIT), {
    opacity: 1, scaleY: 1, duration: 420, delay: stagger(22), ease: "out(3)",
  });
  ```
  with its origin declared in CSS at `react/src/styles/site.css:866-867`:
  ```css
  .xp-tick{flex:1;height:100%;border-radius:1px;background:var(--accent-ink);
    transform-origin:50% 100%}
  ```
  Panel 3 does the same with `scaleX` and
  `transform-origin:0 50%` (`react/src/styles/site.css:876-877`). Panel 2 is the
  only one of the three still on a layout property — this plan brings it in
  line.
- **anime.js v4 API**: `utils.set` for instant state, `animate` for motion, both
  already imported at `react/src/components/site/ExpectationPanels.tsx:3`.

## Steps

1. In `react/src/styles/site.css`, replace the `.xp-bar-fill` rule at lines
   869-870 with:
   ```css
   .xp-bar-fill{position:absolute;left:0;top:50%;width:100%;height:6px;margin-top:-3px;
     border-radius:3px;transform-origin:0 50%;
     background:linear-gradient(90deg,var(--steel),var(--sky))}
   ```
   The two additions are `width:100%` and `transform-origin:0 50%`. Everything
   else is unchanged.

2. In `react/src/components/site/ExpectationPanels.tsx`, replace lines 55-60
   with:
   ```ts
   utils.set(bar, { scaleX: 1 });
   if (!reduce) {
     animate(bar, { scaleX: 0.14, duration: 900, ease: "inOut(3)" });
   } else {
     utils.set(bar, { scaleX: 0.14 });
   }
   ```
   Three edits: `width: "100%"` → `scaleX: 1`, `width: "14%"` → `scaleX: 0.14`
   (twice — once in each branch).

3. Add a comment above the `if (which === 1)` block at
   `react/src/components/site/ExpectationPanels.tsx:52` so the reason survives:
   ```ts
   // scaleX, not width: this replays on every hover, and animating width
   // forces layout + paint on each of ~54 frames. The bar is laid out at
   // full width in CSS and collapses toward its left anchor (transform-origin
   // 0 50%), which is visually identical and rides the compositor.
   ```

4. Check the mobile overrides do not conflict:
   ```bash
   cd /Users/m1/things/isthumus/react && grep -n 'xp-bar' src/styles/site.css
   ```
   Expected hits: `:868` (`.xp-bar`), `:869-870` (`.xp-bar-fill`), `:871-873`
   (`.xp-bar-from` / `.xp-bar-to`). None should set a width on `.xp-bar-fill`.
   If one does, STOP and report.

## Boundaries

- Do NOT change the 900ms duration or the `inOut(3)` easing. Both are correct
  for an explanatory figure that morphs on screen.
- Do NOT touch panel 1 (the ticks) or panel 3 (the rows) — they already animate
  transforms correctly.
- Do NOT change the replay-on-hover behaviour
  (`react/src/components/site/ExpectationPanels.tsx:105-109`). It is deliberate
  and documented at lines 11-12: "Every panel replays on hover or focus, so the
  evidence is repeatable instead of a one-shot you might scroll past."
- Do NOT touch `.xp-bar-from` / `.xp-bar-to`, the labels either side of the bar.
- Do NOT add new dependencies.
- If the code at the cited lines does not match what is quoted (drift since
  commit 40625ce), STOP and report.

## Verification

- **Mechanical**:
  ```bash
  cd /Users/m1/things/isthumus/react && pnpm typecheck
  ```
  Expected: exits 0.
- **Feel check**: run `pnpm dev`, scroll to the "From periodic reporting to
  on-demand analysis" screen, and confirm:
  - The middle bar collapses from full width to a short stub anchored at the
    LEFT edge — exactly as before. If it collapses toward the centre or the
    right, `transform-origin` is wrong.
  - The bar's rounded end caps still look round at the collapsed size. If they
    read as visibly squashed, report it rather than reverting.
  - The gradient still runs steel→sky across the bar (it will now compress with
    the bar rather than being resampled — confirm it does not look banded).
  - Hover the panel repeatedly: the bar resets to full width and collapses
    again, same as before.
- **Performance check** (this is the point of the change): open DevTools →
  Performance, record while hovering the middle panel three times, and confirm
  the "Layout" and "Paint" rows are essentially empty during the 900ms
  animation. Before this change, the same recording shows a layout+paint pair on
  every frame of it. Alternatively, DevTools → Rendering → "Paint flashing":
  after the change the bar should not flash green while animating.
- **Done when**: the animation is visually indistinguishable from before, and a
  performance trace shows no per-frame layout during the collapse.
