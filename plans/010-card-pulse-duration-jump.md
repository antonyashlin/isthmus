# 010 — Stop the offer-card pulse jumping when the pointer arrives

- **Status**: DONE (Option A — hover speed-up removed)
- **Note**: implemented on the argument in the plan (the hover flips the card away
  within ~150ms, so the speed-up bought almost nothing against a spec-guaranteed
  retiming artefact) rather than on an observed slow-motion feel check. If the
  rings ever want a hover speed-up back, it needs a JS/spring rewrite, not CSS.
- **Commit**: 40625ce
- **Severity**: LOW
- **Category**: Interruptibility
- **Estimated scope**: 1 file, ~12 lines

## Problem

The front face of each offer card carries eight expanding rings — "a slow pulse
that reads as work in hand". Hovering the card speeds them up by changing
`animation-duration`:

```css
/* react/src/styles/site.css:820-833 — current */
.cf-pulse{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  pointer-events:none;
  mask-image:linear-gradient(180deg,#000,transparent 72%);
  -webkit-mask-image:linear-gradient(180deg,#000,transparent 72%)}
.cf-pulse span{position:absolute;width:46px;height:46px;border-radius:50%;opacity:0;
  border:1px solid color-mix(in srgb,var(--accent-ink) 45%,transparent);
  animation:cf-scale 3.4s linear infinite}
.cardflip:hover .cf-pulse span{animation-duration:2.3s}
@keyframes cf-scale{
  0%{transform:scale(2.1);opacity:0}
  50%{transform:translateY(-5px) scale(1);opacity:.62}
  100%{transform:translateY(5px) scale(.1);opacity:0}
}
@media (prefers-reduced-motion:reduce){ .cf-pulse span{animation:none;opacity:.28} }
```

Each ring is offset by an inline `animationDelay`
(`react/src/components/kokonutui/card-flip.tsx:62`):

```tsx
<span key={i} style={{ animationDelay: `${i * 0.38}s` }} />
```

Changing `animation-duration` mid-flight does not smoothly retime the animation.
The spec says elapsed time is measured against the *new* duration, so the
animation's current progress is recomputed: a ring that was 80% through a 3.4s
cycle (2.72s elapsed) becomes 2.72/2.3 = 118% through a 2.3s cycle — i.e. it
jumps forward past the end of the cycle and restarts. A ring at 30% (1.02s) jumps
to 44%.

Because the eight rings all have different `animation-delay` values, they are at
eight different phases when the pointer arrives, so they all jump by different
amounts, in different directions relative to each other. The visible result is a
brief scatter the instant the pointer crosses the card boundary — the opposite
of the "slow, steady work in hand" the comment at
`react/src/styles/site.css:812` is going for. It happens again in reverse on
`mouseleave`.

This is AUDIT category 4: `@keyframes` restart from zero rather than retargeting
from the current state, and anything whose timing can change under the user must
account for that.

**Why LOW and not higher**: the rings are decorative, low-contrast
(`opacity: .62` at peak, over a 45%-transparent border colour), behind a mask
that fades them out over the top 72% of the card, and the jump lasts one frame.
It is genuinely possible this reads as texture rather than as a glitch. The feel
check below asks you to make that call before doing the work.

## Target

The speed-up is driven by a custom property that the ring's `animation-duration`
reads, and the property is *transitioned* rather than switched. A transition on
`animation-duration` does not exist, so instead the ring's `animation-duration`
stays constant and the **hover no longer changes it at all**.

There are two acceptable end states. Pick based on the feel check:

### Option A (preferred) — drop the hover speed-up

```css
/* target — react/src/styles/site.css */
.cf-pulse span{position:absolute;width:46px;height:46px;border-radius:50%;opacity:0;
  border:1px solid color-mix(in srgb,var(--accent-ink) 45%,transparent);
  animation:cf-scale 3.4s linear infinite}
/* No `animation-duration` change on hover. Retiming a running keyframe animation
   re-maps its elapsed time against the new duration, so all eight rings jump to
   new phases — by different amounts, since each carries its own inline
   animation-delay (card-flip.tsx:62). Hovering also flips the card, which is
   already the whole feedback the interaction needs. */
```

The hover already triggers a 550ms 180° card flip
(`react/src/styles/site.css:796-798`) that hides this face entirely. The
speed-up is therefore visible only during the first ~150ms of the flip, before
the face rotates away. It is doing almost no work for a guaranteed visual
artefact.

### Option B — keep the speed-up, remove the jump

Give each ring its own paused/running pair at two speeds and cross-fade between
them. This costs 8 extra DOM nodes per card, 24 across the row, and is only
worth it if the feel check says the speed-up genuinely reads.

```css
/* target — only if Option A loses the feel check */
.cf-pulse span{…;animation:cf-scale var(--pulse-dur,3.4s) linear infinite}
```
…which does NOT fix it — a custom property feeding `animation-duration` retimes
exactly the same way. There is no CSS-only fix that both keeps the speed change
and avoids the re-map. Option B therefore means moving the pulse to
`motion/react` and animating `scale`/`opacity` on a spring, which is a
disproportionate rewrite for a decorative background element.

**Recommendation: take Option A.** Report if the feel check disagrees rather
than implementing Option B unasked.

## Repo conventions to follow

- **Reduced motion for this element is already correct** at
  `react/src/styles/site.css:833`:
  ```css
  @media (prefers-reduced-motion:reduce){ .cf-pulse span{animation:none;opacity:.28} }
  ```
  It stops the animation but leaves the rings faintly visible rather than
  deleting them — AUDIT category 6's "fewer and gentler, not zero". Leave it
  exactly as is.
- **`linear` is correct here** and must not be "fixed". AUDIT category 2:
  constant, looping motion (marquee, progress, a steady pulse) takes `linear`.
  The keyframe itself carries the shape.
- **Comment style**: prose explaining the constraint, above the rule. See
  `react/src/styles/site.css:812`, `:1251-1252`.

## Steps

1. **Do the feel check first** (see Verification below). Load the "Three ways to
   work with us" screen and move the pointer on and off a card several times,
   watching only the background rings. Decide whether the scatter reads as a
   glitch. If it does not, mark this plan `WONTFIX` in `plans/README.md` with one
   sentence saying so, and stop — that is a legitimate outcome for a LOW finding.

2. If it does read as a glitch: in `react/src/styles/site.css`, delete line 827:
   ```css
   .cardflip:hover .cf-pulse span{animation-duration:2.3s}
   ```

3. Add a comment in its place so the rule is not reintroduced:
   ```css
   /* No `animation-duration` change on hover. Retiming a running keyframe
      animation re-maps its elapsed time against the new duration, so all eight
      rings jump to new phases — by different amounts, since each carries its
      own inline animation-delay (card-flip.tsx:62). Hovering already flips the
      card, which hides this face 150ms later anyway. */
   ```

4. Leave everything else in the block untouched: the `.cf-pulse` mask, the
   `.cf-pulse span` base rule, the `cf-scale` keyframes, and the reduced-motion
   override.

5. Confirm nothing else changes this animation's timing:
   ```bash
   cd /Users/m1/things/isthumus/react && grep -n 'cf-pulse\|cf-scale' src/styles/site.css src/components/kokonutui/card-flip.tsx
   ```
   Expected after the change: the `.cf-pulse` / `.cf-pulse span` rules, the
   `@keyframes cf-scale` block, the reduced-motion override, and
   `card-flip.tsx:60` (`className="cf-pulse"`) plus `:62` (the inline
   `animationDelay`). No remaining `animation-duration` override.

## Boundaries

- Do NOT change `3.4s`, `linear`, `infinite`, or the `cf-scale` keyframes.
- Do NOT change the inline `animationDelay` at
  `react/src/components/kokonutui/card-flip.tsx:62` or the ring count at
  `react/src/components/kokonutui/card-flip.tsx:61`.
- Do NOT touch the card flip itself
  (`react/src/styles/site.css:796-799`), the faces, or the capability list.
- Do NOT implement Option B without checking back — it is a rewrite of a
  decorative element onto a JS animation loop, which is the wrong trade for a
  LOW finding.
- Do NOT rewrite the `100%{…scale(.1)…}` keyframe stop. It ends at `scale(.1)`
  with `opacity: 0`, which is fine — AUDIT category 3's `scale(0)` rule is about
  elements *appearing* from nothing, and this one is fully transparent well
  before it gets there.
- Do NOT add new dependencies.
- If line 827 does not read exactly
  `.cardflip:hover .cf-pulse span{animation-duration:2.3s}` (drift since commit
  40625ce), STOP and report.

## Verification

- **Mechanical**:
  ```bash
  cd /Users/m1/things/isthumus/react && pnpm build
  ```
  Expected: succeeds.
- **Feel check — run this BEFORE making the change, to decide whether to make
  it**: run `pnpm dev`, go to the "Three ways to work with us" screen, and:
  - Move the pointer slowly onto a card while watching only the faint expanding
    rings behind the copy — not the card flip. Repeat five or six times,
    entering from different edges so the rings are at different phases each
    time.
  - Look for a one-frame scatter at the moment of entry: rings jumping to new
    sizes rather than continuing to grow.
  - To see it clearly, open DevTools → Animations, or temporarily raise the ring
    opacity in DevTools (`.cf-pulse span{opacity:1}` on the base rule) so the
    artefact is not hidden by the mask.
  - **Decide**: glitch, or texture? Record the answer either way.
- **Feel check after the change** (if made):
  - The rings expand at one steady rate regardless of pointer position.
  - Entering and leaving a card produces no scatter.
  - The card still flips on hover at the same 550ms.
  - In DevTools → Rendering → "Emulate prefers-reduced-motion: reduce", confirm
    the rings are static at `opacity: .28` and hovering changes nothing about
    them.
- **Done when**: either the rule is gone and the pulse is phase-stable across
  hover, or the plan is marked WONTFIX with the feel-check finding recorded.
