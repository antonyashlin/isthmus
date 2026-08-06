# 001 — Replace the services-tree detail replay with one crossfade

- **Status**: DONE
- **Commit**: 40625ce
- **Severity**: HIGH
- **Category**: Purpose & frequency (also: interruptibility, performance)
- **Estimated scope**: 2 files, ~30 lines

## Problem

The services tree (screen "What Isthmus Meridian operates") has seven leaf
functions stacked vertically. Hovering a leaf swaps the copy in the detail card
below. That swap is currently a `TextAnimate` that is **remounted** on every
hover via a changing React `key`, so each swap replays a word-by-word blur-in
from zero.

```tsx
/* react/src/components/site/ServicesTree.tsx:236-256 — current */
{/* the illustration: a glyph that blurs in and copy that types itself
    back in, both keyed on the hovered leaf so every swap replays */}
<div className={`tree-detail${active ? " lit" : ""}`}>
  <BlurFade className="td-glyph" direction="up" key={`g-${active ?? "0"}`}>
    {Icon ? (
      <Icon aria-hidden="true" size={22} strokeWidth={1.4} />
    ) : (
      <MeridianMark title="" />
    )}
  </BlurFade>
  <TextAnimate
    animation="blurInUp"
    as="p"
    by="word"
    className="td-copy"
    duration={0.4}
    key={`t-${active ?? "0"}`}
    startOnView={false}
  >
    {leaf?.desc ?? summary}
  </TextAnimate>
```

Three things go wrong, and they compound:

1. **Frequency.** The seven leaves are a vertical list at
   `react/src/components/site/ServicesTree.tsx:220-226`. Moving the pointer from
   the first to the last crosses all seven, so a single sweep fires seven
   complete word-by-word entrance sequences. AUDIT category 1 puts list-hover
   motion in the "remove or drastically reduce" band.
2. **Interruptibility.** A changing `key` unmounts and remounts the component,
   so an in-flight animation does not retarget — it is destroyed and a new one
   starts from `opacity: 0, blur(10px), y: 20`. Sweeping the list therefore
   produces seven hard restarts rather than one continuous settle.
3. **Cost.** Each description is roughly 12–20 words, and `TextAnimate` splits
   on `/(\s+)/`, so it renders ~25–40 `motion.span` elements
   (`react/src/components/ui/text-animate.tsx:351`, `:424-438`). Every one of
   them animates `filter: blur(10px) → blur(0px)`
   (`react/src/components/ui/text-animate.tsx:176-186`). That is 25–40
   simultaneous blur animations per hover, seven times per sweep.

The **intent** — that the copy visibly re-reads on every swap rather than
silently substituting — is correct and documented, and this plan keeps it. What
changes is the granularity: one element crossfading instead of forty words
individually blurring.

The glyph's `BlurFade` (a single element, one blur) is fine and stays.

## Target

The paragraph crossfades as one block: a short fade with a slight lift and a
light blur, driven by `AnimatePresence` so an interrupted swap retargets instead
of restarting.

```tsx
/* target — react/src/components/site/ServicesTree.tsx */
<AnimatePresence mode="wait">
  <motion.p
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    className="td-copy"
    exit={{ opacity: 0, y: -4, filter: "blur(3px)" }}
    initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
    key={`t-${active ?? "0"}`}
    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
  >
    {leaf?.desc ?? summary}
  </motion.p>
</AnimatePresence>
```

Exact values, and why each:

| Value | Reason |
| --- | --- |
| `duration: 0.16` (160ms) | AUDIT category 2: hover-frequency UI stays at the fast end. 160ms is inside the 125–200ms "tooltips, small popovers" band. |
| `ease: [0.22, 1, 0.36, 1]` | The repo's one motion token, `--ease` (`react/src/styles/site.css:17`). Entering content takes ease-out; this curve is one. |
| `y: 6 → 0`, exit `y: -4` | A hint of direction, not a slide. AUDIT category 3: never appear from nothing, but movement on a hover-frequency element stays minimal. |
| `filter: blur(3px)` | Masks the double-exposure of two overlapping strings (AUDIT category 7). Well under the 20px ceiling in AUDIT category 5, and now on ONE element rather than forty. |
| `mode="wait"` | The outgoing paragraph finishes before the incoming one starts, so the two never overlap in the same box. With a 160ms duration the total swap is ~320ms, which still reads as immediate. |

## Repo conventions to follow

- **Easing**: the site has exactly one curve token, `--ease:cubic-bezier(0.22,1,0.36,1)`
  at `react/src/styles/site.css:17`. In JS it is written as the array literal
  `[0.22, 1, 0.36, 1]` — see `react/src/components/site/ScrollFx.tsx:11`:
  ```ts
  const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
  ```
  Use that literal. Do NOT invent a new curve.
- **Exemplar for an inline Motion element in this codebase**:
  `react/src/components/site/PressureRadar.tsx:68-74` animates a single SVG
  circle with an explicit `transition` object rather than a component wrapper.
  Follow that shape.
- **Imports**: `motion/react` is the import path used throughout
  (`react/src/components/site/PressureRadar.tsx:3`,
  `react/src/components/ui/blur-fade.tsx:4-11`).
- **Reduced motion**: this component already branches on
  `matchMedia("(prefers-reduced-motion: reduce)")` at
  `react/src/components/site/ServicesTree.tsx:97`. The new crossfade is opacity
  plus a 6px offset; under reduced motion the offset and blur must drop but the
  opacity fade stays (AUDIT category 6: fewer and gentler, not zero).

## Steps

1. In `react/src/components/site/ServicesTree.tsx`, change the import on line 19
   from:
   ```tsx
   import { TextAnimate } from "@/components/ui/text-animate";
   ```
   to:
   ```tsx
   import { AnimatePresence, motion, useReducedMotion } from "motion/react";
   ```
   Keep the `BlurFade` and `BorderBeam` imports on lines 17-18 as they are.

2. Add the shared easing constant next to the existing one. The file already has
   at line 44:
   ```ts
   const EASE = cubicBezier(0.22, 1, 0.36, 1);
   ```
   That is the anime.js form. Add a second constant directly beneath it for the
   Motion form:
   ```ts
   /* the same curve as EASE above, in the tuple form motion/react takes */
   const EASE_MOTION: [number, number, number, number] = [0.22, 1, 0.36, 1];
   ```

3. Inside the `ServicesTree` component body, near the existing `const leaf = …`
   and `const Icon = …` lines (`react/src/components/site/ServicesTree.tsx:173-174`),
   add:
   ```ts
   const reduced = useReducedMotion();
   ```

4. Replace the entire `<TextAnimate>…</TextAnimate>` block
   (`react/src/components/site/ServicesTree.tsx:246-256`) with:
   ```tsx
   <AnimatePresence mode="wait">
     <motion.p
       animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
       className="td-copy"
       exit={
         reduced
           ? { opacity: 0 }
           : { opacity: 0, y: -4, filter: "blur(3px)" }
       }
       initial={
         reduced
           ? { opacity: 0 }
           : { opacity: 0, y: 6, filter: "blur(3px)" }
       }
       key={`t-${active ?? "0"}`}
       transition={{ duration: 0.16, ease: EASE_MOTION }}
     >
       {leaf?.desc ?? summary}
     </motion.p>
   </AnimatePresence>
   ```

5. Leave the `BlurFade` glyph block (`react/src/components/site/ServicesTree.tsx:239-245`)
   exactly as it is. It is one element with one blur and is not part of this
   finding.

6. Check whether `TextAnimate` is still imported anywhere else:
   ```bash
   cd /Users/m1/things/isthumus/react && grep -rn "text-animate" src/
   ```
   If `src/components/ui/text-animate.tsx` is the only hit, leave the file in
   place (it is a vendored Magic UI primitive, not dead project code) but do NOT
   delete it. Report the grep result.

## Boundaries

- Do NOT touch `react/src/components/ui/text-animate.tsx` — it is a vendored
  Magic UI primitive and may be used by the deck.
- Do NOT touch the `plot` memo, the hover `paint()` effect, or the enter
  animation (`react/src/components/site/ServicesTree.tsx:94-171, 178-230`).
  Those are correct and deliberately DOM-class-driven for performance; the file
  comment at lines 32-36 explains why.
- Do NOT change `.td-copy` or `.tree-detail` in `react/src/styles/site.css`.
- Do NOT add new dependencies. `motion` is already in `package.json`.
- If the code at the cited lines does not match what is quoted above (drift
  since commit 40625ce), STOP and report rather than improvising.

## Verification

- **Mechanical**:
  ```bash
  cd /Users/m1/things/isthumus/react && pnpm typecheck
  ```
  Expected: exits 0 with no output. If `AnimatePresence` complains about the
  child key, confirm `motion.p` carries the `key` prop and not a wrapper.
- **Feel check**: run `pnpm dev`, open the services screen, and confirm:
  - Sweeping the pointer from the first leaf to the seventh produces one
    continuously-settling paragraph, not seven staccato restarts.
  - Individual words no longer animate at different times — the paragraph moves
    as one block.
  - Resting on a single leaf still visibly re-reads the copy (the intent is
    preserved, not deleted).
  - In DevTools → Animations, set playback to 10% and confirm the outgoing
    paragraph is fully gone before the incoming one begins (`mode="wait"`).
  - In DevTools → Rendering → "Emulate prefers-reduced-motion: reduce", confirm
    the copy still fades between leaves but no longer moves or blurs.
- **Performance check**: record a DevTools performance trace while sweeping the
  seven leaves. Before this change the trace shows a burst of ~30 concurrent
  filter animations per leaf. After, expect one animation per swap.
- **Done when**: a full seven-leaf sweep produces seven crossfades totalling
  well under one dropped frame, `pnpm typecheck` passes, and reduced motion
  keeps the fade but drops the movement.
