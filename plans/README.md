# Animation plans — Isthmus Meridian website

Produced by `improve-animations` against the Next app in `react/` at commit
`40625ce`. The deck (`react/src/decks/`) and the vendored chart library
(`react/src/components/charts/`) were **not** audited — only the site: `app/page.tsx`,
`app/inquiry/page.tsx`, `components/site/`, the UI primitives those import, and
`styles/site.css`.

Each plan is self-contained: exact file paths, current code verbatim, exact
target values, and a feel-check. An executor with no context and no taste should
be able to run one without reading anything else.

## Plans

| # | Plan | Severity | Category | Files | Status |
| --- | --- | --- | --- | --- | --- |
| 001 | [Replace the services-tree detail replay with one crossfade](001-services-tree-hover-crossfade.md) | HIGH | Purpose & frequency | `ServicesTree.tsx` | DONE |
| 002 | [Stop the journey dots popping from nothing, and calm the bounce](002-journey-dots-scale-and-bounce.md) | HIGH | Physicality | `ScrollFx.tsx` | DONE |
| 003 | [Make the trust-badge hover lift actually fire](003-badge-hover-lift-never-fires.md) | MEDIUM | Cohesion | `TrustBadges.tsx`, `site.css` | DONE |
| 004 | [Animate the turnaround bar with transform, not width](004-expectation-bar-width-to-transform.md) | MEDIUM | Performance | `ExpectationPanels.tsx`, `site.css` | DONE |
| 005 | [Give every button on the site press feedback](005-glass-button-press-feedback.md) | MEDIUM | Physicality | `site.css` | DONE |
| 006 | [Stop smooth-scrolling for users who asked for no motion](006-reduced-motion-smooth-scroll.md) | MEDIUM | Accessibility | `site.css` | DONE |
| 007 | [Stop hover-only motion sticking on touch devices](007-hover-motion-on-touch.md) | MEDIUM | Accessibility | `site.css`, `BrainOrbit.tsx` | DONE |
| 008 | [Stop the provider nodes appearing from nothing](008-approach-routes-node-scale.md) | MEDIUM | Physicality | `ApproachRoutes.tsx` | DONE |
| 009 | [Name the second and third curves, and add a duration scale](009-motion-tokens.md) | LOW | Cohesion & tokens | `site.css` | DONE |
| 010 | [Stop the offer-card pulse jumping when the pointer arrives](010-card-pulse-duration-jump.md) | LOW | Interruptibility | `site.css` | DONE |
| 011 | [Crossfade the orbit's detail line instead of teleporting it](011-brain-orbit-detail-crossfade.md) | LOW (additive) | Missed opportunity | `BrainOrbit.tsx`, `site.css` | DONE |
| 012 | [Reveal the inquiry form's errors instead of shoving the layout](012-inquiry-form-error-reveal.md) | LOW (additive) | Missed opportunity | `inquiry/page.tsx`, `site.css` | DONE |
| 013 | [Make the theme flip read as one move](013-theme-flip-colour-transition.md) | LOW (additive) | Missed opportunity | `site.css` | DONE |

## Outcome — all 13 applied at commit `40625ce`

`tsc --noEmit` clean, `next build` green, all 7 routes prerender. Verified in a
real Chromium over CDP (the Playwright MCP profile was locked), at 1440×900 and
390×844, with and without emulated `prefers-reduced-motion`.

**Two deviations from the plans as written:**

1. **001 dropped `AnimatePresence`.** The planned `mode="wait"` crossfade had a
   real bug, caught in the browser: the exit ran, then the incoming paragraph
   mounted at its `initial` state (`opacity: 0`) and never animated in, leaving
   the copy invisible. Only the *first* swap after mount was affected; later
   swaps recovered. Replaced with a plain key-remount + `initial`/`animate` —
   which is exactly the mechanism the original `TextAnimate` used, so the change
   remains "forty animating spans become one" and nothing else. There is nothing
   to animate *out* of here anyway; the copy is replaced, not dismissed.
   Re-verified: all 7 leaves settle at `opacity: 1`, single element each time.
   Note 011 keeps `AnimatePresence mode="wait"` and is fine — it passes
   `initial={false}`, and every swap was confirmed to settle.

2. **010 took Option A on the argument, not an observed feel check.** The plan
   asked for a slow-motion look first. The artefact is spec-guaranteed and the
   hover speed-up is hidden by the card flip ~150ms later, so the trade was
   one-sided regardless. Recorded in the plan file.

**One thing the plans did not anticipate:** 013's reduced-motion companion had
to sit *after* the theme-flip rule, not inside 005's press-feedback block.
`.nav-row .glass-btn` and the reduce override have equal specificity, so source
order decides, and up in the 005 block it silently lost. Confirmed by
measurement: under `reduce` a press now yields `transform: none` and a
colour-only transition; normally it yields `matrix(0.97, …)` and both.

### Measured evidence

| Check | Result |
| --- | --- |
| 012 resting form height | `542px` with slots vs `542px` with them `display:none` — **0.0px delta** |
| 012 on submit | form grows `83px` (2 × 19.5px message + restored 22px gaps), Send button travels with it |
| 004 bar | `width` pinned at `269.906px` while `transform` runs `0.919 → 0.207 → 0.14` — off the layout path entirely |
| 007 mobile cards | `transform: none`, `perspective: none`, faces stacked (215.8 / 370.8), caps `opacity: 1`, no x-overflow |
| 007 touch guard | `pointerType: "touch"` leaves no `holding` class; orbit `animation-play-state: running` |
| 003 badge | CSS transition is `border-color` only; Motion writes `transform` inline — confirming the original lift never fired |
| 005 + 013 | `.nav-row .glass-btn` carries **both** `color .2s` and `transform .16s`; real press → `matrix(0.97…)`, release → `none` |
| 011 box | `.bo-detail` fixed at `38.4px` across idle and all four chips — nothing above or below moves |
| 002 dots | all 9 (5 journey + 4 sign-off) settle at `opacity: 1`, `transform: none` |
| 009 tokens | all six resolve; no `var()` fell back to `0s`; exactly 2 `cubic-bezier`s left, both in `:root` |
| Reduced motion | `scroll-behavior: auto`, snap `none`, pulse static at `0.28`, flip `none`, dots visible |

## Recommended execution order

Six of the thirteen touch `react/src/styles/site.css`, so the order below is
chosen to keep those diffs from colliding — not purely by severity.

**Wave 1 — isolated, no dependencies, run in any order or in parallel:**

1. **006** — one line, zero risk, fixes an accessibility gap. Do it first.
2. **002** — `ScrollFx.tsx` only. Nothing else touches that file.
3. **008** — `ApproachRoutes.tsx` only. Nothing else touches that file.
4. **001** — `ServicesTree.tsx` only. Establishes the `AnimatePresence
   mode="wait"` crossfade pattern that 011 reuses.
5. **004** — `ExpectationPanels.tsx` plus one `site.css` rule (`.xp-bar-fill`,
   line 869) that nothing else goes near.

**Wave 2 — the `site.css` sequence. Run strictly in this order:**

6. **003** — must run before 007. It removes `.badge`'s CSS transform and moves
   the lift to Motion's `whileHover`, which also fixes the badge's touch case;
   007 explicitly excludes `.badge` on that assumption.
7. **007** — depends on 003. Also rewrites the dead `.offer` block in the mobile
   media query, so run it before anything else edits that region.
8. **005** — adds `.glass-btn:active`. Must run **before** 013, which touches
   `.nav-row .glass-btn` with a more specific selector and has an explicit step
   to preserve 005's transform transition.
9. **009** — the token pass. Deliberately skips every duration the other plans
   touch (see its step 6), so running it after 003/005/007 means fewer
   collisions. If you run it earlier, plans 012 and 013 can drop their
   `var(--dur-N, fallback)` fallbacks.

**Wave 3 — the additive three plus the optional one:**

10. **011** — reuses 001's crossfade pattern; run after 001 so the two match.
    Also touches `BrainOrbit.tsx`, which 007 edits, so run after 007.
11. **013** — depends on 005 (see step 4 of 013: the specificity trap).
12. **012** — `inquiry/page.tsx` and the form block of `site.css`. Independent
    of everything except 009's tokens.
13. **010** — **feel-check first.** Its step 1 says to decide whether the artefact
    reads as a glitch at all, and to mark the plan WONTFIX if it does not. That
    is a legitimate outcome; do not implement it reflexively.

## Dependency graph

```
006  (independent)
002  (independent)
008  (independent)
004  (independent)

001 ──────────────► 011
003 ──► 007 ──────► 011
005 ──────────────► 013
009  (run after 003/005/007; unblocks fallback removal in 012, 013)
012  (independent, benefits from 009)
010  (independent, gated on its own feel check)
```

## Notes for whoever runs these

- **Every plan is stamped `Commit: 40625ce`.** If a plan's quoted code does not
  match what you find, that is drift — every plan says STOP and report rather
  than improvise. Honour that; several of these depend on exact line content.
- **The repo has one motion token**, `--ease: cubic-bezier(0.22,1,0.36,1)` at
  `react/src/styles/site.css:17`, written in JS as `[0.22, 1, 0.36, 1]`. No plan
  introduces a curve that is not either that token or AUDIT's named
  `--ease-in-out`.
- **`react/src/styles/tokens.css` belongs to the deck, not the site.** No plan
  writes to it.
- **Verification is not optional.** Motion can be mechanically correct and still
  feel wrong; every plan has a feel-check section with specific things to watch
  for in DevTools' Animations panel at 10% playback, and under emulated
  `prefers-reduced-motion`.
- **Plan 007 needs a real touch device if one is available.** It turns on
  `pointerType` discrimination, and emulated touch does not always report
  `pointerType` the way a real finger does.

## What was audited and found correct

Recorded so a later pass does not re-litigate these:

- No `ease-in` anywhere in shipped site code.
- No `transition: all` in shipped site code. The three hits are in
  `ui/badge.tsx`, `ui/button.tsx` and `kokonutui/liquid-glass-card.tsx`, none of
  which the site imports.
- Reduced motion is handled in eleven places in `site.css` and in every
  JS-driven component, and it correctly reduces rather than eliminates —
  `.cf-pulse` drops to a static `opacity: .28`, `.reveal` elements are forced
  visible, the funnel is un-hidden.
- The expensive choices are deliberate and documented: the dropped
  `backdrop-filter` on `.viz-plate` (measured 32ms → 18ms), DOM-class hover
  instead of React state in `ServicesTree` and `ApproachRoutes`, per-spark
  compositor layers on the globe field (measured 3.3× less scroll jitter), and
  `liquid-glass-react`'s removal.
- Base UI's drawer uses `cubic-bezier(0.22,1,0.36,1)` at 450ms — the site's own
  curve, inside the modal/drawer budget. Nothing to change.
- `ScrollProgress` is passed brand colours at the call site
  (`react/src/app/page.tsx:161`), overriding Magic UI's default purple/pink
  gradient. Correct already.
- `.xp-tick` and `.xp-row` (expectation panels 1 and 3) animate `scaleY`/`scaleX`
  with explicit `transform-origin` — the correct pattern. Only panel 2 was on a
  layout property, which plan 004 fixes.
