# 011 — Crossfade the orbit's detail line instead of teleporting it

- **Status**: DONE
- **Commit**: 40625ce
- **Severity**: LOW (additive — missed opportunity, not a defect)
- **Category**: Missed opportunities
- **Estimated scope**: 1 file, ~20 lines

## Problem

On the "A brain for private equity" screen, six qualities orbit a centre. The
line below the orbit shows what the pointed-at quality replaces. That line swaps
its entire contents instantly:

```tsx
/* react/src/components/site/BrainOrbit.tsx:92-102 — current */
<p className="bo-detail">
  {held ? (
    <>
      <span className="bo-ours">{held.ours}</span>
      <span className="bo-sep">not</span>
      <span className="bo-theirs">{held.theirs}</span>
    </>
  ) : (
    SUMMARY
  )}
</p>
```

Moving the pointer from one chip to another hard-cuts three strings at once —
the quality name at 25px, the "NOT" separator, and the italic serif phrase. It
also hard-cuts between the single-string summary state and the three-span held
state, which is a bigger change than a chip-to-chip swap.

AUDIT category 8: a state change that teleports, where a brief transition would
prevent a jarring change. The chips are moving targets on a 54-second orbit
(`react/src/components/site/BrainOrbit.tsx:87`), so the pointer crosses several
of them in normal use — this swap fires more often than the screen's design
implies.

The space is already reserved, so a crossfade costs nothing in layout:

```css
/* react/src/styles/site.css:919-921 — current */
.bo-detail{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:center;gap:10px;
  min-height:2.4em;margin:0;text-align:center;
  font-size:clamp(15px,1.35vw,19px);line-height:1.5;color:var(--tx-3)}
```

`min-height: 2.4em` means the box does not resize when the content changes.
That is exactly the precondition a crossfade needs, and it is already there —
this opportunity is cheap because someone already did the hard part.

## Target

The line crossfades on every change of held quality, including to and from the
summary state.

```tsx
/* target — react/src/components/site/BrainOrbit.tsx */
<div className="bo-detail">
  <AnimatePresence initial={false} mode="wait">
    <motion.p
      animate={{ opacity: 1, y: 0 }}
      className="bo-detail-line"
      exit={{ opacity: 0, y: -3 }}
      initial={{ opacity: 0, y: 3 }}
      key={held?.ours ?? "summary"}
      transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
    >
      {held ? (
        <>
          <span className="bo-ours">{held.ours}</span>
          <span className="bo-sep">not</span>
          <span className="bo-theirs">{held.theirs}</span>
        </>
      ) : (
        SUMMARY
      )}
    </motion.p>
  </AnimatePresence>
</div>
```

```css
/* target — react/src/styles/site.css, replacing the .bo-detail rule */
/* the outer box owns the reserved height and the centring; the inner line is
   what crossfades, so the box never resizes as the copy changes */
.bo-detail{display:flex;align-items:center;justify-content:center;
  min-height:2.4em;margin:0}
.bo-detail-line{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:center;gap:10px;
  margin:0;text-align:center;
  font-size:clamp(15px,1.35vw,19px);line-height:1.5;color:var(--tx-3)}
```

Exact values, and why each:

| Value | Reason |
| --- | --- |
| `duration: 0.14` (140ms) | The chips are hover targets crossed frequently as the orbit turns. AUDIT category 2 puts small popovers at 125–200ms; 140ms is at the fast end of that, which is right for something that fires this often. |
| `ease: [0.22, 1, 0.36, 1]` | The repo's `--ease` token (`react/src/styles/site.css:17`) in Motion's tuple form, as at `react/src/components/site/ScrollFx.tsx:11`. |
| `y: 3 → 0`, exit `y: -3` | A 3px hint of direction. AUDIT category 3: never a pure fade with no transform, but on a hover-frequency element the movement stays minimal. |
| `mode="wait"` | The outgoing line clears before the incoming one starts, so the two never double-expose in a centred box where they would overlap illegibly. Total swap ~280ms, still instantaneous to the eye. |
| `initial={false}` on `AnimatePresence` | Suppresses the entrance animation on first mount. The summary line should be simply present when the screen arrives, not fading in — the screen already has its own entrance via `.reveal`. |
| `key={held?.ours ?? "summary"}` | Keys on the quality name, so chip→chip, chip→summary and summary→chip all trigger the swap. |
| Wrapper `<div>` + inner `<p>` | The reserved `min-height` and the centring must live on an element that does NOT animate, or the box would move with its contents. Splitting the one rule in two is what makes the crossfade free. |

No blur here, unlike plan 001 — that paragraph is a block of body copy where
overlapping words need masking; this is one short centred line with `mode="wait"`,
so nothing overlaps.

## Repo conventions to follow

- **Easing**: `--ease` at `react/src/styles/site.css:17`, written in JS as
  `[0.22, 1, 0.36, 1]` (`react/src/components/site/ScrollFx.tsx:11`).
- **Import path**: `motion/react` — see
  `react/src/components/site/PressureRadar.tsx:3`.
- **Exemplar**: plan 001 introduces the identical `AnimatePresence mode="wait"`
  pattern in `react/src/components/site/ServicesTree.tsx`. If 001 has landed,
  copy its shape exactly so the two swaps read as one system. If it has not,
  this plan establishes the pattern and 001 should follow it.
- **This component is already React-state-driven**, unlike ServicesTree and
  ApproachRoutes which deliberately use DOM class toggles for performance. Six
  chips and one line is a small enough tree that state is fine here — do not
  "optimise" it to DOM manipulation.
- **Reduced motion**: `react/src/components/site/BrainOrbit.tsx` currently has no
  reduced-motion branch (the orbit's own is handled in CSS at
  `react/src/styles/site.css:927`). Add one for the crossfade.

## Steps

1. In `react/src/components/site/BrainOrbit.tsx`, extend the import on line 3:
   ```tsx
   import { useEffect, useState } from "react";
   ```
   and add below it:
   ```tsx
   import { AnimatePresence, motion, useReducedMotion } from "motion/react";
   ```

2. Add the easing constant near the top of the file, after the `SUMMARY`
   constant at line 38:
   ```ts
   /* the site's one curve (--ease, site.css:17) in motion/react's tuple form */
   const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
   ```

3. Inside the `BrainOrbit` component, after `const radius = useRadius();`
   (`react/src/components/site/BrainOrbit.tsx:61`), add:
   ```ts
   const reduced = useReducedMotion();
   ```

4. Replace the `<p className="bo-detail">…</p>` block
   (`react/src/components/site/BrainOrbit.tsx:92-102`) with:
   ```tsx
   <div className="bo-detail">
     <AnimatePresence initial={false} mode="wait">
       <motion.p
         animate={{ opacity: 1, y: 0 }}
         className="bo-detail-line"
         exit={reduced ? { opacity: 0 } : { opacity: 0, y: -3 }}
         initial={reduced ? { opacity: 0 } : { opacity: 0, y: 3 }}
         key={held?.ours ?? "summary"}
         transition={{ duration: 0.14, ease: EASE }}
       >
         {held ? (
           <>
             <span className="bo-ours">{held.ours}</span>
             <span className="bo-sep">not</span>
             <span className="bo-theirs">{held.theirs}</span>
           </>
         ) : (
           SUMMARY
         )}
       </motion.p>
     </AnimatePresence>
   </div>
   ```

5. In `react/src/styles/site.css`, replace the `.bo-detail` rule at lines
   919-921 with the two rules from the **Target** section (a layout-only
   `.bo-detail` and a type-carrying `.bo-detail-line`).

6. Update the mobile override. Line 1176 currently reads:
   ```css
   .bo-detail{font-size:13px;gap:7px}
   ```
   Both of those properties now live on the inner element, so change it to:
   ```css
   .bo-detail-line{font-size:13px;gap:7px}
   ```

7. Confirm no other rule targets `.bo-detail`:
   ```bash
   cd /Users/m1/things/isthumus/react && grep -n 'bo-detail\|bo-ours\|bo-sep\|bo-theirs' src/styles/site.css
   ```
   Expected: the two new rules, the mobile override, and the
   `.bo-ours` / `.bo-sep` / `.bo-theirs` rules at `:922-926` (which are unchanged
   — they target the spans inside, which have not moved).

## Boundaries

- Do NOT touch the orbit itself, `useRadius`, the chip handlers, or
  `OrbitingCircles`. If plan 007 has landed it has already changed the chip's
  pointer handlers — do not undo that.
- Do NOT change `min-height: 2.4em`. It is what makes this free; without it the
  crossfade would resize the box.
- Do NOT add a blur to this crossfade. `mode="wait"` means nothing overlaps.
- Do NOT animate the three inner spans individually. That is the mistake plan
  001 exists to undo elsewhere; one element crossfading is the whole point.
- Do NOT add new dependencies. `motion` is already in `package.json`.
- If the code at the cited lines does not match what is quoted (drift since
  commit 40625ce), STOP and report.

## Verification

- **Mechanical**:
  ```bash
  cd /Users/m1/things/isthumus/react && pnpm typecheck && pnpm build
  ```
  Expected: both exit 0.
- **Feel check**: run `pnpm dev`, scroll to the "A brain for private equity"
  screen, and confirm:
  - Pointing at a chip crossfades the line in rather than cutting to it.
  - Moving between two chips crossfades cleanly — the outgoing text is fully
    gone before the incoming text appears, with no moment where two overlapping
    strings are legible at once.
  - Moving off all chips crossfades back to "Point at one to see what it
    replaces."
  - **The box does not move.** Watch the orbit above and any content below while
    swapping: nothing should shift vertically. If it does, the `min-height` /
    `align-items` split in step 5 is wrong.
  - The swap still feels immediate. At 140ms × 2 it should read as a soft cut,
    not a transition you wait for. If it feels slow, that is a signal the
    duration is wrong — report rather than retuning past 100ms.
  - Sweep the pointer rapidly across several chips: with `mode="wait"` the swaps
    queue rather than overlapping. Confirm this does not visibly lag behind the
    pointer. If it does, that is the one case for switching to
    `mode="popLayout"` — report it.
  - In DevTools → Rendering → "Emulate prefers-reduced-motion: reduce", confirm
    the line still crossfades but no longer moves vertically.
- **Done when**: the detail line never hard-cuts, the surrounding layout never
  moves, and a fast sweep across chips does not lag.
