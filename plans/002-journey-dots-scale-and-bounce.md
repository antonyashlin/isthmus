# 002 — Stop the journey dots popping from nothing, and calm the bounce

- **Status**: DONE
- **Commit**: 40625ce
- **Severity**: HIGH
- **Category**: Physicality & origin (also: interruptibility, cohesion)
- **Estimated scope**: 1 file, ~15 lines

## Problem

`ScrollFx` runs a `tracks()` routine on every section as it enters view. It
animates any `.jdot` / `.fdot` inside that section from `scale: 0`:

```ts
/* react/src/components/site/ScrollFx.tsx:31-49 — current */
const tracks = (section: Element) => {
  const track = section.querySelector(".journey-track, .flow-track");
  const dots = section.querySelectorAll(".jdot, .fdot");
  if (REDUCE) {
    if (track) (track as HTMLElement).style.transform = "scaleX(1)";
    dots.forEach((d) => ((d as HTMLElement).style.transform = "none"));
    return;
  }
  if (track) {
    (track as HTMLElement).style.transformOrigin = "left center";
    animate(track, { scaleX: [0, 1] }, { duration: 0.85, ease: EASE, delay: 0.2 });
  }
  if (dots.length)
    animate(
      dots,
      { scale: [0, 1] },
      { type: "spring", bounce: 0.5, visualDuration: 0.5, delay: (i: number) => 0.4 + i * 0.11 }
    );
};
```

`.jdot` is real and rendered — five of them, one per stage, at
`react/src/components/site/JourneyFlow.tsx:117`:

```tsx
<span className="jdot" ref={dots[i]} />
```

Three problems:

1. **`scale(0)`.** AUDIT category 3 is unambiguous: nothing in the real world
   appears from nothing. The dot is a 15px ring with a 4px background halo and a
   glow (`react/src/styles/site.css:580-582`), so at `scale: 0` it is completely
   invisible and then pops into existence.
2. **`bounce: 0.5`.** AUDIT category 4 puts subtle bounce at 0.1–0.3 and
   reserves anything visibly springy for drag-to-dismiss and playful moments.
   0.5 is the bounciest motion on a site whose personality is a crisp
   instrument, and it is the only spring in the codebase — every other entrance
   uses the `cubic-bezier(0.22,1,0.36,1)` token. It reads as borrowed from a
   different product.
3. **Dead selectors and an inconsistency.** `.journey-track`, `.flow-track` and
   `.fdot` no longer exist anywhere in the markup — confirmed by
   `grep -rn 'jdot\|fdot\|journey-track\|flow-track' src/`, which returns only
   `.jdot` (JourneyFlow) and this file. The comment at
   `react/src/styles/site.css:576-577` records why: "The static rule is gone: the
   track is four AnimatedBeams strung dot-to-dot." Meanwhile `.sodot` — the
   sign-off flow's four dots at
   `react/src/components/site/SignOffFlow.tsx:90`, visually identical and
   rendered by the same rig — is NOT in the selector, so it never animates at
   all. Two identical dot rows, one pops with a heavy spring, the other just
   appears.

## Target

Both dot rows enter the same way: a small scale-up from 0.9 with an opacity
fade, on a gentle spring. The dead track branch is removed.

```ts
/* target — react/src/components/site/ScrollFx.tsx */
const tracks = (section: Element) => {
  const dots = section.querySelectorAll(".jdot, .sodot");
  if (!dots.length) return;
  if (REDUCE) {
    dots.forEach((d) => {
      (d as HTMLElement).style.transform = "none";
      (d as HTMLElement).style.opacity = "1";
    });
    return;
  }
  animate(
    dots,
    { scale: [0.9, 1], opacity: [0, 1] },
    {
      type: "spring",
      duration: 0.5,
      bounce: 0.2,
      delay: (i: number) => 0.4 + i * 0.11,
    }
  );
};
```

Exact values, and why each:

| Value | Reason |
| --- | --- |
| `scale: [0.9, 1]` | AUDIT category 3: the target range for an entrance is 0.9–0.97. 0.9 is the low end, appropriate for a small 15px element where a subtler scale would be invisible. |
| `opacity: [0, 1]` | AUDIT category 3 pairs the scale with an opacity fade — that is what replaces `scale(0)` as the "arriving" signal. Without it, 0.9→1 alone is imperceptible. |
| `bounce: 0.2` | AUDIT category 4's recommended Apple-style config is `{ type: "spring", duration: 0.5, bounce: 0.2 }`. 0.2 sits in the 0.1–0.3 subtle band. |
| `duration: 0.5` | Same recommended config. Replaces `visualDuration: 0.5`, which is a different (perceptual) parameter; use `duration` so the config matches the AUDIT reference verbatim. |
| `delay: 0.4 + i * 0.11` | UNCHANGED. 110ms is a slightly wide stagger but it is deliberate — it is the travelling-pulse rhythm the AnimatedBeams use (`LEG = 1.6` split across legs). Do not touch it. |
| `.sodot` added | The sign-off dots are the same component pattern and should enter identically (AUDIT category 7, cohesion). |

## Repo conventions to follow

- **Reduced motion** in this file is a single hoisted boolean, read once at the
  top of the effect — `react/src/components/site/ScrollFx.tsx:10`:
  ```ts
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  ```
  Keep using it; do not introduce `useReducedMotion()` here.
- **Reduced-motion handling in this file sets final styles inline rather than
  skipping.** See the `reveal()` branch at
  `react/src/components/site/ScrollFx.tsx:17-23` — it forces `opacity: 1` and
  `transform: none` so the element is definitely visible. Match that shape
  exactly: the dots must end up visible, not left at their pre-animation state.
- **Exemplar**: `reveal()` at `react/src/components/site/ScrollFx.tsx:14-29` is
  the pattern for "query, bail on reduce with explicit final styles, otherwise
  animate".

## Steps

1. Open `react/src/components/site/ScrollFx.tsx`.

2. Replace the whole `tracks` function (lines 31-49) with the target code in the
   **Target** section above. Note the four specific changes:
   - the `track` query, its `REDUCE` branch, and its `animate` call are all
     deleted (the elements do not exist);
   - the dot selector changes from `".jdot, .fdot"` to `".jdot, .sodot"`;
   - the `REDUCE` branch now also sets `opacity = "1"`, because the animation
     now animates opacity and the reduce path must land on the visible state;
   - the animation config changes from
     `{ type: "spring", bounce: 0.5, visualDuration: 0.5, … }` to
     `{ type: "spring", duration: 0.5, bounce: 0.2, … }`.

3. Add a comment above the function recording why the track branch went, so the
   next reader does not restore it:
   ```ts
   // The five journey dots and the four sign-off dots. There is no longer a
   // `.journey-track` / `.flow-track` element to draw — both rows are strung
   // together by AnimatedBeams now (see the note at site.css:576) — so this
   // only handles the dots themselves.
   ```

4. Leave the call site at `react/src/components/site/ScrollFx.tsx:76` unchanged:
   ```ts
   tracks(section);
   ```

5. Confirm no CSS sets an initial `opacity` on `.jdot` or `.sodot` that would
   fight the animation:
   ```bash
   cd /Users/m1/things/isthumus/react && grep -n '\.jdot\|\.sodot' src/styles/site.css
   ```
   Expected hits: `:580`, `:582` (`.jdot`), `:655`, `:657` (`.sodot`, `.sodot.feat`),
   and the mobile overrides at `:1224` and `:1246`. None of them set `opacity`,
   so the dots start fully opaque and Motion's `opacity: [0, 1]` takes over. If
   any of them DOES set opacity, STOP and report.

## Boundaries

- Do NOT touch `react/src/components/site/JourneyFlow.tsx` or
  `react/src/components/site/SignOffFlow.tsx`. The dots' refs are load-bearing —
  `AnimatedBeam` measures from them (see the comment at
  `react/src/components/site/JourneyFlow.tsx:102-105`) — and this change is
  purely to how ScrollFx animates them.
- Do NOT change the `delay` stagger. It is tuned against the beam cycle.
- Do NOT touch `reveal()`, `counts()`, the `IntersectionObserver` setup, or the
  theme-flip observer in the same file.
- Do NOT change `.jdot` / `.sodot` styling in `react/src/styles/site.css`.
- Do NOT add new dependencies.
- If the code at the cited lines does not match what is quoted (drift since
  commit 40625ce), STOP and report.

## Verification

- **Mechanical**:
  ```bash
  cd /Users/m1/things/isthumus/react && pnpm typecheck
  ```
  Expected: exits 0. The `delay` callback keeps its `(i: number)` annotation.
- **Feel check**: run `pnpm dev`, scroll to the "An embedded team" screen and
  then the "Nothing reaches your desk without a sign-off" screen, and confirm:
  - The dots fade up into place rather than popping out of nothing — at no point
    is a dot invisible-then-suddenly-full-size.
  - There is no visible overshoot-and-settle wobble. At `bounce: 0.2` the
    overshoot should be barely perceptible at full speed.
  - The four sign-off dots now enter the same way the five journey dots do.
    Before this change they simply appeared.
  - In DevTools → Animations at 10% playback, confirm each dot starts at roughly
    nine-tenths of its final size and visible-but-transparent, not at zero.
  - Reload the screen several times in a row. Because this is a one-shot guarded
    by the `seen` WeakSet (`react/src/components/site/ScrollFx.tsx:67, 73-74`),
    scrolling away and back should NOT replay it.
  - In DevTools → Rendering → "Emulate prefers-reduced-motion: reduce", confirm
    all nine dots are immediately visible at full size and opacity.
- **Done when**: no dot is ever at scale 0 or fully invisible-then-popping, the
  spring reads as a settle rather than a bounce, and both dot rows behave
  identically.
