---
name: Isthmus Meridian
description: A deep-navy system for the marketing site and investor decks — Archivo with a Source Serif 4 italic carrying every emphasis, Kokonut liquid glass as the card material, and one sky accent that glows.
colors:
  bg: "#04101c"
  panel: "#0b0f14"
  card: "#080d13"
  card-hover: "#111a24"
  ink-0: "#000000"
  ink-1: "#05070a"
  ink-2: "#0b0f14"
  ink-3: "#101720"
  heading: "#ffffff"
  text: "rgba(255,255,255,0.94)"
  text-2: "rgba(255,255,255,0.62)"
  text-3: "rgba(255,255,255,0.42)"
  sky: "#88c1ed"
  sky-2: "#c9e2f6"
  steel: "#4686b7"
  steel-2: "#63a6d9"
  deep: "#274f6f"
  silver: "#c2d0dd"
  gold: "#d9a441"
  danger: "#c96f6f"
  line: "rgba(255,255,255,0.10)"
  line-2: "rgba(255,255,255,0.18)"
  line-3: "rgba(136,193,237,0.24)"
typography:
  wordmark:
    fontFamily: "var(--font-archivo), 'Helvetica Neue', Arial, sans-serif"
    fontSize: "68px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.10em"
  display:
    fontFamily: "var(--font-archivo), 'Helvetica Neue', Arial, sans-serif"
    fontSize: "48px"
    fontWeight: 300
    lineHeight: 1.0
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "var(--font-archivo), 'Helvetica Neue', Arial, sans-serif"
    fontSize: "38px"
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: "-0.012em"
  title:
    fontFamily: "var(--font-archivo), 'Helvetica Neue', Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  subtitle:
    fontFamily: "var(--font-archivo), 'Helvetica Neue', Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 300
    lineHeight: 1.3
  emphasis:
    fontFamily: "var(--font-serif), Georgia, 'Times New Roman', serif"
    fontSize: "inherit"
    fontStyle: "italic"
    fontWeight: 500
    letterSpacing: "0"
  body:
    fontFamily: "var(--font-archivo), 'Helvetica Neue', Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.62
  small:
    fontFamily: "var(--font-archivo), 'Helvetica Neue', Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
  caption:
    fontFamily: "var(--font-archivo), 'Helvetica Neue', Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "var(--font-archivo), 'Helvetica Neue', Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.22em"
  micro:
    fontFamily: "var(--font-archivo), 'Helvetica Neue', Arial, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    letterSpacing: "0.18em"
rounded:
  sm: "8px"
  md: "16px"
  lg: "26px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
  "8": "64px"
  "9": "76px"
components:
  button-primary:
    backgroundColor: "color-mix(in srgb, {colors.sky} 24%, transparent)"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "46px"
  card:
    backgroundColor: "{colors.card}"
    borderColor: "{colors.line}"
    rounded: "{rounded.md}"
    padding: "24px"
  card-glass:
    backgroundColor: "color-mix(in srgb, {colors.panel} 55%, transparent)"
    borderColor: "{colors.line-2}"
    rounded: "{rounded.md}"
  chip:
    textColor: "{colors.sky}"
    borderColor: "{colors.line-3}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  eyebrow:
    textColor: "{colors.text-3}"
    typography: "{typography.label}"
---

# Design System: Isthmus Meridian

> **This document was rewritten on 2026-07-28.** It previously described the
> original master deck — Helvetica Neue, one family, flat cards, hairline
> borders, with explicit bans on serif and on glass. That system is retired.
> The live marketing site is now the brand's canonical expression, and both the
> site and the founding-partner deck are built from what follows. The old
> reference deck at `deck reference/` is a content source, not a visual one.

## Overview

**Creative North Star: "Instrument light on deep water."**

Isthmus Meridian reads as deep navy under instrument light. The ground is
near-black blue; the structure is drawn in hairlines; the one confident sky
blue does all the emphasis work; and warmth enters only as a serif italic —
never as a colour. Surfaces are glass rather than paper: they refract what is
behind them instead of sitting on top of it, which is what keeps a dense
investor slide from reading as a dashboard.

The lineage is Swiss in its discipline — mathematical spacing, hierarchy over
ornament, asymmetric calm — but it is not austere. Type is set light and large,
whitespace is generous, and the meridian field runs behind the whole thing.

**Key characteristics**

- Dark-primary and single-theme. There is no light mode on the deck surface;
  the site carries a paper variant for alternating screens, nothing more.
- **Two families, one voice.** Archivo does the structural work; Source Serif 4
  italic carries emphasis. This is the signature and it is not optional.
- One accent blue. Everything else is ground, ink, or hairline.
- Glass is the card material — Kokonut's liquid-glass recipe, not a tint.
- Depth is glow, never a drop shadow.

## Colors

### Primary
**Meridian Sky** (`#88c1ed`). The one voice: emphasis, active nodes, the primary
chart series, links, glowing rules. On any surface it should touch ≤10–15% of
the pixels — its rarity is what makes it read.

### Secondary
**Steel** (`#4686b7`) and **Steel Light** (`#63a6d9`). Structural blue: the second
chart series, the globe wireframe, inactive nodes. **Deep** (`#274f6f`) anchors
gradients.

### Signature neutral
**Silver** (`#c2d0dd`). The wordmark, and only the wordmark, at a soft glow.

### Tertiary
**Signal Gold** (`#d9a441`) — provenance warnings, an unsourced-figure band, a
single called-out caveat. Never a background. **Muted Danger** (`#c96f6f`) — the
only red, for genuine negatives.

### Grounds and ink
`bg #04101c` → `panel #0b0f14` → `card #080d13`, with the ink ramp running
`heading #ffffff` → `text 94%` → `text-2 62%` → `text-3 42%`. Body copy sits at
`text-2`; captions, eyebrows and sources step to `text-3`.

### Named rules
**The One Voice Rule.** Sky carries emphasis and nothing competes. More than
~15% blue means something that should be ground got promoted.

**The No-Rainbow Rule.** The categorical ramp is sky → steel → gold → silver.
No green. No purple. Red only as Muted Danger on a real negative.

**The Glow-Not-Shadow Rule.** Elevation is a coloured halo
(`0 0 Npx color-mix(sky …)`), never a neutral drop shadow. A black shadow on
navy reads muddy.

## Typography

**Structure:** Archivo (variable, `wdth` axis), self-hosted via `next/font`.
**Emphasis:** Source Serif 4 (variable on `opsz`), italic, weight 500.

Source Serif 4 being variable on optical size is why there is exactly one
serif: the same family retunes itself from a 17px inline italic to a 68px
wordmark, so the old display/text split is unnecessary.

### The ramp
`10 · 11 · 12 · 13 · 14 · 15 · 17 · 20 · 24 · 38 · 48 · 68`

Twelve steps, and a value off the ramp is a bug. On the marketing site these
resolve through `clamp()` against the viewport; on the 1280×720 slide canvas
they are literal pixels.

### Named rules
**The Serif-Italic Rule.** Emphasis inside a heading is *always* Source Serif 4
italic in sky. Never a bolder sans, never a colour change alone, never a second
grotesque. This is the single most recognisable thing about the brand.

**The Light-Heading Rule.** Headings are weight 300 with `-0.012em` tracking.
Hierarchy comes from size and the serif accent, not from weight.

**The Tracking Rule.** Only two things are tracked out: the eyebrow (`0.22em`)
and the wordmark (`0.10em`). Everything else sits normal-to-tight.

**Measure.** Body copy caps at 62–75ch; a slide title caps at 26ch.

## Layout

Two reference frames:

- **Site** — one screen per idea, scroll-snapped, fluid, each screen a rounded
  card (`26px` top corners) rising over the one before it.
- **Deck** — a fixed **1280×720** canvas scaled to fit, letterboxed on black.
  The safe margin is `76px` (`spacing.9`); chrome sits at `48px`.

Spacing is the nine-step rhythm `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 76`. Vary
the steps for cadence; do not settle into one uniform gap.

**The Safe-Margin Rule.** Slide content stays inside `76px`. The frame edge is a
hard boundary — nothing bleeds unless it is a deliberate full-bleed ground.

## Elevation & depth

Layering is `bg` → `panel` → `card`, plus a hairline. The one lift material is
**glass**: Kokonut's `GLASS_SHADOW_DARK` recipe with `backdrop-filter: blur(22px)
saturate(165%)`.

**Use real Kokonut components.** `LiquidGlassCard` is vendored at
`react/src/components/kokonutui/`. Do not hand-roll a lookalike.

Two production caveats, both learned the hard way:

1. **Pass `glassEffect={false}`.** Kokonut's SVG-displacement backdrop is a
   measured performance trap over any moving background. The shadow recipe
   alone (`.liquid-glass`) carries the material.
2. **Guard `svg.hidden`.** Kokonut ships its filter inside an `svg.hidden`. In
   an unlayered stylesheet a bare `svg { display: block }` beats Tailwind's
   `hidden` and leaves an empty block inside every card.

`backdrop-filter` does not print — the glass falls back to its tint in PDF, and
that is fine.

## Shapes

Radii: `sm 8px` (chips, inputs, icon wells), `md 16px` (cards, panels — the
default), `lg 26px` (screen cards), `pill 999px` (buttons, chips, dots).

Borders are hairlines: `line` at 10% white for structure, `line-2` at 18% for a
raised edge, `line-3` (sky at 24%) when a surface is emphasised. The mark and
chart geometry are stroke-only.

## Motion

anime.js. One reveal mechanism: elements marked `.fd-rise` (deck) or `.reveal`
(site) lift in on a staggered timeline when their screen becomes active.

- **Easing** `out(3)` for entrances — a small, capped overshoot. Bouncy, never a
  spring, never more than ~4%.
- **Stagger** 45ms, capped at five steps.
- **Plot ceiling** 520ms; UI never exceeds 220ms.
- **Everything plays once.** No looping, no idle motion, no re-trigger on
  scroll-back.
- **Reduced motion and print resolve to the settled state** — not a fast
  version. The still frame is the deliverable.

## Data visualization

Two libraries, one theme: **Bklit** (`@visx`) for radial and funnel work,
**ECharts** (SVG renderer) for time series, geography and anything dense. Both
read the brand tokens off their container rather than taking colour props.

**ECharts is confined to the deck route.** It was deliberately removed from the
marketing site for page-speed and must not return there.

Rules, unchanged from the deck tradition and still right:

1. **The chart title is the finding**, not the variable.
2. **Two series maximum.** A third means the chart is wrong — facet or split.
3. **Direct labels always.** No legend boxes; label the series end.
4. **Horizontal gridlines only**, behind the marks. Never vertical.
5. **Exactly one annotation** per chart, naming the inflection being argued.
6. **No pie charts, no dual y-axis.**
7. **Every figure carries provenance.** A real citation, or a visible
   `illustrative — not sourced` band. There is no third state and no default.

**The Never-Fabricate Rule.** No invented metric, source, date or person. A
figure the client has not supplied renders as a labelled gap, never as a
plausible number. A fabricated figure in an investor document is the worst
failure this system can produce.
