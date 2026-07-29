# Isthmus Meridian — Fixes / Rebuild status

## Direction

Full **React rebuild in `/react`** (Next.js App Router, static export) importing the real
component libraries — **Kokonut UI** (liquid-glass card/buttons) and **Bklit UI** (funnel +
charts). Run it: `cd react && ../node_modules/.bin/next dev` (reuses root `node_modules`).
Build: `../node_modules/.bin/next build` → static export in `react/out`.

## Live

- **Static site (production, `main`):** https://isthmus-meridian.pages.dev — unchanged.
- **React rebuild (preview, `react` branch):** https://react.isthmus-meridian.pages.dev
- Repoint production to the React build only on the user's go-ahead
  (`wrangler pages deploy react/out --project-name=isthmus-meridian --branch=main`).

## Done ✅

- ✅ `/react` scaffold (Next 16 App Router, Tailwind v4, reuses `--isth-*` tokens + shared `src`).
- ✅ Real **Kokonut** `LiquidGlassCard` + `LiquidButton` (shadcn) on offer cards + CTAs.
- ✅ Real **Bklit** `FunnelChart` on the AI page (halo rings + % pills); top-value color fixed
  for the light page (`.funnel-on-light` remaps shadcn foreground/background tokens).
- ✅ Shell at parity: 13 snap pages, nav, wordmark, 300vh scroll-panned globe, theme flip,
  Motion entrance (`ScrollFx`), ECharts panels (radar/gauge/rose/tree via `SiteChart`).
- ✅ Perf: no glow blur; no `scroll-snap-stop:always`. Color flip retimed to ~28% of transition.
- ✅ Final page: heading top-right, ~40px liquid-glass contact bar, side line hidden (`at-end`).
- ✅ Kokonut glass cards use `glassEffect={false}` (blur+rim) so the displacement doesn't
  re-introduce scroll jank over the moving globe.
- ✅ Hero oblique line re-angled (steeper, centred between the two circles).
- ✅ Static export builds clean; deployed to the preview URL; verified in-browser (hero, funnel,
  offers, tree, final page) with no console errors.
- ✅ **Feel pass (3 issues):**
  - Scroll no longer fights back — `scroll-snap-type` changed `mandatory` → **`proximity`**, so
    scrolling up/away is never forced onto a bound.
  - Glow fixed — the globe is now **two independent fixed layers** (`globe-markup.ts`): a soft
    `filter:blur(6px)` glow layer (thin 2.2px stroke, cached once on its own `will-change:transform`
    compositor texture so the scroll-pan is a cheap translate) under a crisp 1.1px sharp layer.
    Replaces the old fat-stroke fake glow.
  - Background crossfade smoothed — `background`→**`background-color` only**, timing
    `.6s var(--ease)` → **`.8s ease-in-out`** (smooth navy↔paper dissolve, no front-loaded snap).

- ✅ **Body-slide framing system** (per the 4-panel spec):
  - Every body slide now clears a left **no-zone** (`--nozone`, the band the globe
    arc + vertical rule occupy) — content is a left-anchored grid that starts just
    past it, capped so line-lengths stay sane.
  - Three framed blocks per slide: **`.blk-head`** (big, always-visible heading),
    **`.blk-desc`** (description, grows with the space), **`.blk-viz`** (the
    animated, interactive chart / illustration with its ECharts / Bklit tooltips).
  - Four archetypes (`.lay-a … .lay-d`) distributed for variety:
    A head→desc→viz (problem, tree, gauges, journey, offers, metrics);
    B viz-leads→head-below (flow, contrasts); C viz-left + head/desc-right
    (radar, rose); D head-top + desc-left + viz-right (funnel).
  - Radar axis labels shortened + radials widened in two-column layouts so long
    outer labels don't clip against the no-zone edge.
  - Collapses to a single stacked column below 1000px; mobile untouched in spirit
    (small gutter, auto height).

- ✅ **Snap + colour timing:** `scroll-snap-type` back to **`mandatory`** (still no
  `scroll-snap-stop:always`, so a fast flick can cross screens); the background
  crossfade cut `.8s` → **`.3s ease-out`** and the theme trigger band raised from
  ~71% to **~57%** of the viewport, so the colour lands with the snap.

- ✅ **Travelling lights on the meridians:** a third fixed globe layer
  (`.fgl-spark`, no CSS filter — its contents move every frame) carries 18 small
  lights looping the globe outlines, the meridian arcs, and both straight rays via
  SMIL `animateMotion` + `<mpath>`, each on its own clock and breathing on a CSS
  opacity cycle. Every lamp is four concentric filled circles, not a drop-shadow,
  so nothing re-rasterises the 300vh layer. On every screen below the hero, a
  **medium light per globe** rides the same meridian at one lap per page,
  positioned from scroll progress (`GlobeSparks.tsx`, `getPointAtLength`).

- ✅ **Slide rebuilds** (all reveals are opacity + lift over reserved space — a
  100vh bound must never change height while you point at it):
  - *Running a fund* — the three stances are now **`ApproachRoutes`**, three
    animated line diagrams (cost climbing past its own line / four providers that
    never reach the middle / drafts falling through to your desk); hover or focus
    draws one out and opens what it costs.
  - *Private-market pressure* — real **Bklit `RadarChart`** (grid + axis + area),
    with interactive vertices and a key that share one active index. Bklit offsets
    its grid polygon half a step, so it is rotated back onto the axes.
  - *We do not hand your team another tool* — **`FlowDiagram`**: a packet travels
    You send → We operate → You receive on a loop, lighting each waypoint; pointing
    at a step takes the loop over. Heading moved to the base of the bound
    (`.slide.low`) and up to `clamp(32px,5.1vw,64px)` (`.pull-xl`).
  - *The back-office pain* — three **Bklit `Gauge`** dials replace the ECharts
    gauges, plus a description; each dial opens what its number measures.
  - *AI use is active* — funnel is now **vertical, top-to-bottom** on the right,
    straight edges, no relative-% pills.
  - *Three ways to work with us* / *From periodic reporting* — Kokonut
    **`LiquidGlassCard`** cards made interactive (`GlassCards.tsx`): pointer-tracked
    spotlight, lift, dim-the-rest, and a second layer of detail fading up.
  - Bklit chart chrome is token-driven and ships dark-only, so `.light` screens now
    hand it the paper palette (`--chart-*`, `--foreground`, `--border`).
  - Fixed: this stylesheet is unlayered, so `img,svg{display:block}` was beating
    Tailwind's `hidden` and leaving Kokonut's glass-filter `<svg>` as an empty
    150px block inside every card (`svg.hidden{display:none}`).

## Open queue 🔧 (requested 2026-07-27)

**All 13 landed**, plus the rose rebuild, the `next/dynamic` split, and the
card backgrounds. Measured end state: main chunk **2112 KB raw / 515 KB gz →
largest chunk 256 KB raw / 80 KB gz**; **FCP 700ms → 332ms**, DCL 619ms → 179ms.


**Global**

1. **Perf — the site renders extremely slowly.** **Diagnosed 2026-07-27: it is
   load weight, not scroll jank.**
   - Scrolling holds a solid 60fps (avg 16.7ms, p95 17ms, zero frames >32ms).
     A/B-ing the suspects — spark layer off, blur glow layer off, nav
     `backdrop-filter` off — changed nothing. The fixed layers and SMIL are fine.
   - The real cost is **one 2.1 MB (515 KB gzipped) JS chunk**, of which
     **ECharts is 361 KB gz — ~70%** — parsed and executed before the page is
     interactive. `themeRiver` / `geoSVG` / `candlestick` are all in there.
   - It is loaded for exactly **two** charts: the services tree and the
     readiness rose. Everything else already moved to Bklit.
   - **Fixed:** the tree is now `ServicesTree.tsx` (~2 KB of SVG + HTML) and the
     rose is `ReadinessRings.tsx` (Bklit `RingChart`). `echarts` uninstalled,
     `SiteChart.tsx` / `echart-options.ts` / `components/echarts/` deleted.
     **Main chunk 2112 KB raw / 515 KB gz → 512 KB raw / 164 KB gz. Total JS
     ~671 KB gz → 342 KB gz.** Scroll was already 60fps and still is.
   - Still to do: code-split the remaining chart components with `next/dynamic`.
2. ~~The mid-size scroll light is missing~~ → **done, and it was neither guess.**
   All three lamps were genuinely off-screen (measured `screenTop: -2411`,
   `left: 1863`, `top: 2959`): walking one lap of the meridian per page puts the
   lamp outside the frame nearly always, because these are ~1400-unit ellipses
   in a 2025-unit viewBox that is itself panning. `GlobeSparks.tsx` now finds
   where the meridian **actually crosses the viewport** at the height your
   scroll maps to and places the lamp there — samples the path once, then maps
   local→screen with `getScreenCTM()` (verified exact against
   `getBoundingClientRect`). Exactly one lamp lit at every scroll position.
3. ~~Graphs at 40–50% of the screen~~ → **done** via the `.viz-plate` sizing,
   the taller tree plot (`clamp(300px,40vh,420px)`), 310×236 gauges, and the
   full-height funnel column.
4. ~~Behind every graph, a 30–40% fill glass layer~~ → **done**: `.viz-plate`,
   34% fill on dark / 38% on light + `backdrop-filter`, on all 8 viz blocks.
   Falls back to a solid panel under `prefers-reduced-transparency`.
5. ~~`anime.js` is not installed~~ → **done**: `animejs@4.5.0` added to
   `package.json` (ships its own types; v4 API is
   `import { animate, stagger, createTimeline } from "animejs"`). Note the
   `/plugin` install added the anime.js *skill*, not the npm package — those are
   separate things.

**Per screen**

6. ~~*Running a fund* — heading overlaps the meridian~~ → **done.** Measured the
   arc's envelope down the screen: x≈757 at y=0, then 524 / 387 / 290 / ≤221 as
   y increases. No single left gutter clears it, because the conflict only
   exists in the top ~300px. The heading now steps right (`.clear-arc`, 19.5vw)
   into clear space while the illustration below sits where the arc has already
   receded. **−306px overlap → +30px clearance.**
7. ~~*We do not hand your team another tool*~~ → **done**: `FlowDiagram.tsx`
   rebuilt on an anime.js timeline. One packet runs the track with a trailing
   fill; each waypoint flares as it lands. Dot positions are measured from the
   live DOM, so the packet stays welded to them at any width. Pointing at a step
   pauses the timeline and seeks to it, releasing hands it back — per the
   interruptibility rule, the motion is never something you wait out.
8. ~~*What Isthmus Meridian operates*~~ → **done**: `ServicesTree.tsx`. Root →
   3 branches → 7 functions, laid out in percentages against a
   `preserveAspectRatio="none"` viewBox so elbow connectors track the
   absolutely-positioned HTML nodes. Type up to `clamp(16px,1.4vw,20px)`;
   hovering a function lights its whole path back to the root and swaps a
   detail line. anime.js draws the connectors in (`createDrawable`) and staggers
   the nodes. Nodes are absolutely positioned, so highlighting never reflows.
9. ~~*The back-office pain* — bigger radials~~ → **done**: 240×182 → 310×236,
   48 notches.
10. ~~*AI use is active* — funnel~~ → **done**: reverted my earlier deviations
    (straight edges / 2 layers / no pills) back to Bklit's own storybook
    defaults, kept vertical, and gave it a full-height column (`.lay-e`).
11. ~~*Three ways to work with us* — drop the buttons~~ → **done**.
12. ~~*From periodic reporting*~~ → **done**: `ExpectationPanels.tsx` — three
    panels that show their claim instead of captioning it (a share filling tick
    by tick, a turnaround collapsing from days to hours, a report getting
    finer). anime.js; each replays on hover or focus.
13. ~~*Built for private-market operating work*~~ → **done**:
    `ContrastSwitches.tsx` — six switches whose marker travels from the usual
    way to ours, so the motion carries the argument. anime.js stagger on entry,
    re-throw on hover or focus.

14. ~~Backgrounds as cards instead of a colour transition~~ → **done, and yes it
    is cheaper.** The old `background-color` transition repainted the whole
    viewport every frame for 300ms on every screen change. Each screen now owns
    an opaque card (`main>section::before`) painted once, rising into place on a
    pure `transform` driven by `animation-timeline: view()` and settled exactly
    when the screen snaps (`entry 0%` → `entry 100%`). Cards sit at `z-index:-2`
    so the globe field (-1) still reads across every screen; `body.on-light`
    stays because the globe's own colour still flips.

## Round 3 (2026-07-28)

- ✅ **Tree hover stutter — diagnosed, not guessed.** Two causes, measured:
  the `.viz-plate` `backdrop-filter` re-ran its blur over the constantly
  animating globe on every repaint inside the plate, and hover was React state,
  re-rendering ten paths + eleven nodes per pointer move. Plate is now fill +
  rim only (the 30–40% fill is what reads as glass; the blur cost a frame for
  little), and hover toggles DOM classes directly. **Worst frame 32ms → 18.1ms,
  zero frames over 32ms.**
- ✅ **anime.js on *Running a fund*** (`ApproachRoutes`): entry timeline per
  route, an idle loop that keeps each diagram alive (providers pulsing out of
  phase, spokes drifting, drafts falling to the desk), and a hover that plays
  that route's failure through. Hover is DOM-class only.
- ✅ **All graphs +10%**: tree plot `40vh → 44vh`, gauges 310×236 → 341×260,
  radar 352 → 387, rings 292 → 321, route glyphs 212 → 233, panel meters 44 → 48.
- ✅ ***Built for private-market operating work*** rebuilt: a framing header
  (how it is usually done / with us), the old term struck through in muted
  serif, and one anime.js timeline per row so the track fill, the marker and
  both labels move as a single gesture instead of three overlapping animations.
- ✅ ***Three ways to work with us*** rebuilt on anime.js (`OfferCards.tsx`,
  replacing `GlassCards.tsx`): entry timeline lands the flanking cards first and
  the central offering last, hover sweeps a sheen across the glass and staggers
  the capabilities up, others dim. No React re-render on pointer move.

## Mobile (2026-07-28)

Rewritten `@media (max-width:760px)` block against four requirements:

- **9:16 panels.** Every screen is `aspect-ratio:9/16` — verified 0.563 on all 13.
- **No CSS snap.** `scroll-snap-type:none` + `scroll-snap-align:none`; continuous scroll.
- **Field on the first and last screen only.** `.fg` is opacity-gated on
  `body.at-hero` / `body.at-end` (both already set by `ScrollFx`), and on mobile
  it is `height:100vh` with the pan animation off, so it reads full-screen and
  still rather than cropped mid-pan. Verified: opacity 1 on panels 0 and 12, 0
  on the panels between.
- **Heading → description → illustration, always.** All four desktop archetypes
  reset to one column with explicit `order`, so B (viz-first) and C/D
  (viz-beside) no longer put the illustration above the heading.

Five panels initially overflowed their bound and were re-laid-out rather than
scaled down — on touch there is no hover, so reveal-only copy is dead weight:

| Panel | Over | Fix |
|---|---|---|
| Running a fund | 225px | routes become 56px-glyph rows; `.rt-detail` hidden |
| An embedded team | 237px | journey steps become two-column rows, dots/track dropped |
| The back-office pain | 744px | dials become `106px` gauge + text rows (`minWidth` 170→104, a floor only, so desktop is unaffected) |
| Three ways to work | 91px | `.glass-detail` hidden (it was hover-only) |
| AI use is active | 33px | funnel height `min(52vh, …)` |

Final check after scrolling the whole page so every `InView` chart mounts:
**zero clipped panels.**

## Note: the recurring impeccable findings on `site.css`

The design hook reports ~50–90 findings on `react/src/styles/site.css` every run.
They are a **scope mismatch, not drift**: `DESIGN.md` documents the *deck* design
system, and the hook is grading website CSS against it.

- Its ramp is explicitly "px on the **1280×720 slide canvas**" — a different
  surface with a different canvas, so no website size will ever be on it.
- Its **One-Family Rule** says "a serif or second grotesque is prohibited", but
  the site's serif-italic emphasis and the Newsreader wordmark are both explicit,
  approved decisions for this surface.

So the values are correct and the spec is the wrong yardstick. The real fix is a
**website surface brief** (or scoping the hook to the deck), not suppression —
neither should happen without a decision from you.

## Optional follow-ups

- Fine-tune the hero line angle further if the gaps still read unequal to you.
- Mobile pass in React (the static site left mobile as-is by request).
- Repoint production when you're happy with the preview.
