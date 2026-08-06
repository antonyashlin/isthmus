# 013 — Make the theme flip read as one move

- **Status**: DONE
- **Commit**: 40625ce
- **Severity**: LOW (additive — missed opportunity, not a defect)
- **Category**: Missed opportunities
- **Estimated scope**: 1 file, ~20 lines

## Problem

As you scroll, `ScrollFx` toggles `body.on-light` when the incoming screen is a
paper screen:

```ts
/* react/src/components/site/ScrollFx.tsx:87-98 — current */
const themeIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        document.body.classList.toggle("on-light", e.target.classList.contains("light"));
        …
```

The floating nav bar hangs over whatever screen is passing beneath it, so
`on-light` has to repaint the bar's ink for the new ground. Six rules do that —
and exactly one of them transitions.

**The one that does** — the scrim behind the glass:

```css
/* react/src/styles/site.css:121-123 — current */
.lg-shell>.lg-scrim{position:absolute;inset:0;z-index:0;pointer-events:none;
  opacity:0;transition:opacity .2s var(--ease)}
body.on-light .lg-shell>.lg-scrim{opacity:1;background:rgba(0,0,0,0.18)}
```

**The five that don't** — every piece of text on the bar:

```css
/* react/src/styles/site.css:148-156, 172, 182 — current */
.brand .wm b{font-weight:700;color:#fff}
.brand .wm i{font-style:normal;font-weight:300;color:rgba(255,255,255,0.66)}
body.on-light .brand .wm b{color:var(--deep)}
body.on-light .brand .wm i{color:color-mix(in srgb,var(--deep) 66%,transparent)}
.nav-links a{font-family:var(--sans);font-weight:500;font-size:12px;letter-spacing:0.02em;color:rgba(255,255,255,0.6)}
.nav-links a:hover{color:#fff}
body.on-light .nav-links a{color:color-mix(in srgb,var(--deep) 62%,transparent)}
body.on-light .nav-links a:hover{color:var(--deep)}
body.on-light .nav-row .glass-btn{color:var(--deep)}
body.on-light .nav-burger{color:var(--deep)}
```

So the theme flip is a 200ms scrim fading in *underneath* five hard colour cuts.
The bar's wordmark, its five links, its CTA label and its burger icon all snap
from white to `--deep` on one frame, while the darkening behind them takes a
fifth of a second. The two halves of one change happen at different speeds,
which reads as the text glitching rather than the bar adapting.

This is worth fixing precisely because the effort already went in: the scrim was
deliberately given a transition (and the comment at
`react/src/styles/site.css:130-142` shows the ink flip was thought about
carefully). The text was simply never given the matching one.

AUDIT category 8: a state change that teleports where a brief transition would
prevent a jarring change. AUDIT category 7: motion that should read as one
system.

## Target

Every element whose colour is driven by `body.on-light` transitions over the
same 200ms with the same curve as the scrim, so the whole bar changes as one.

```css
/* target — react/src/styles/site.css, added to the nav block */
/* The theme flip: `.lg-scrim` already crossfades over 200ms (see the .lg-shell
   block above), but the bar's ink used to cut on one frame, so the two halves
   of one change happened at different speeds. Everything body.on-light
   repaints now shares that timing. `color` only — the glass, the scrim and the
   backdrop-filter are handled where they are declared. */
.brand .wm b,.brand .wm i,
.nav-links a,
.nav-row .glass-btn,
.nav-burger{transition:color var(--dur-2,200ms) var(--ease)}
```

Exact values, and why each:

| Value | Reason |
| --- | --- |
| `200ms` | Matches `.lg-scrim`'s existing `.2s` at `react/src/styles/site.css:122` exactly. The whole point is that these agree; do not pick a different number. Also inside AUDIT category 2's 125–200ms band. |
| `var(--ease)` | Matches the scrim's curve. AUDIT category 2: colour changes take `ease`, and `--ease` is this site's. |
| `color` only, not `all` | AUDIT category 5: `transition: all` animates unintended properties off the GPU and is always a finding. Only `color` changes here. |
| `var(--dur-2,200ms)` | Plan **009** introduces `--dur-2: 200ms`. The fallback means this works whether or not 009 has landed. Drop the fallback if 009 is done. |
| One grouped rule, not five | AUDIT category 7. These five selectors are one behaviour; splitting them invites drift. |

**`.nav-links a` already has a hover colour change**
(`react/src/styles/site.css:154`, `:156`) with no transition of its own. Adding
this rule gives the link hover a 200ms colour fade as a side effect. That is a
bonus, not a regression — AUDIT category 2 puts hover colour changes on `ease`
at exactly this duration — but note it in the feel check.

**Deliberately NOT included:**

- **The glass blur itself.** `GlassDecor` sets `backdropFilter` inline and
  switches between `blur(23px)` and `blur(31px)` on `overLight`
  (`react/src/components/site/glass.tsx:37-44, 66-79`). Transitioning a
  backdrop-filter over a scrolling, animating globe field means re-running the
  blur every frame for 200ms across the full bar — the same cost the project
  already measured and rejected for `.viz-plate` (see the comment at
  `react/src/styles/site.css:458-461`: "32ms frame on hover vs 18ms without
  it"). The scrim crossfade already carries the perceived change. Leave the blur
  as a cut.
- **The `boxShadow` switch** in the same inline style
  (`react/src/components/site/glass.tsx:75`). Same reasoning — it is a large
  blurred shadow and it is masked by the scrim.
- **The globe field's stroke colours**
  (`react/src/styles/site.css:255-256`, `:278-281`) and `.gf-rule`
  (`react/src/styles/site.css:295-297`). These are on a 300vh composited layer
  that the scroll timeline is actively translating; adding colour transitions
  there risks the exact per-frame repaint the layer was built to avoid (see the
  comment at `react/src/styles/site.css:247-249`). Out of scope.

## Repo conventions to follow

- **Easing**: `--ease` at `react/src/styles/site.css:17`.
- **The nav block** runs from `react/src/styles/site.css:130` to `:200`, opening
  with a long prose comment explaining the floating bar and the ink flip. Add
  the new rule at the end of that block, after `.nav-cta`
  (`react/src/styles/site.css:157`) and before the `.glass-btn` block — or
  directly after the `.nav-burger` rules at `:180-182`, whichever keeps the
  grouped selector nearest the rules it pairs with. Prefer the latter.
- **The existing comment at `react/src/styles/site.css:136-142`** explains
  exactly why the bar's text is hardcoded white/black rather than tokenised.
  Read it before touching anything in this block; the new rule must not disturb
  that reasoning, only the timing of it.
- **Exemplar for a colour-only transition**: `react/src/styles/site.css:72`
  ```css
  a{color:var(--accent-ink);text-decoration:none;transition:color .2s var(--ease)}
  ```
  and `react/src/styles/site.css:965`
  ```css
  .contact a{color:var(--tx);text-decoration:none;transition:color .2s var(--ease)}
  ```
  Same duration, same curve. This plan is extending an established pattern, not
  inventing one.

## Steps

1. In `react/src/styles/site.css`, find the `.nav-burger` rules at lines
   180-182.

2. Directly after line 182 (`body.on-light .nav-burger{color:var(--deep)}`), add
   the comment and grouped rule from the **Target** section:
   ```css
   /* The theme flip: `.lg-scrim` already crossfades over 200ms (see the
      .lg-shell block above), but the bar's ink used to cut on one frame, so the
      two halves of one change happened at different speeds. Everything
      body.on-light repaints now shares that timing. `color` only — the glass,
      the scrim and the backdrop-filter are handled where they are declared. */
   .brand .wm b,.brand .wm i,
   .nav-links a,
   .nav-row .glass-btn,
   .nav-burger{transition:color var(--dur-2,200ms) var(--ease)}
   ```

3. If plan **009** has already landed, drop the `,200ms` fallback.

4. If plan **005** has already landed, `.glass-btn` will carry
   `transition:transform 160ms var(--ease)` from its own rule
   (`react/src/styles/site.css:164-167`). The new rule here targets
   `.nav-row .glass-btn`, a MORE specific selector, so it would **replace** that
   transform transition rather than adding to it — killing the press feedback on
   the nav CTA. Check for this:
   ```bash
   cd /Users/m1/things/isthumus/react && grep -n 'glass-btn{' src/styles/site.css
   ```
   If `.glass-btn` has a `transition` property, change the new grouped rule's
   `.nav-row .glass-btn` line to list both:
   ```css
   .nav-row .glass-btn{transition:color var(--dur-2,200ms) var(--ease),
     transform 160ms var(--ease)}
   ```
   and move it OUT of the grouped selector into its own rule. **This is the one
   real trap in this plan** — a silently dropped press transition is easy to
   miss.

5. Confirm the drawer's CTA is unaffected. `body.on-light .nav-row .glass-btn`
   is deliberately scoped to `.nav-row` because Base UI portals `DrawerContent`
   out to `document.body` — see the comment at
   `react/src/styles/site.css:168-171`. The new rule inherits that scoping, which
   is correct: the drawer panel's text stays white always (comment at
   `react/src/styles/site.css:186-190`), so it has no flip to transition.

## Boundaries

- Do NOT transition `backdrop-filter`, `box-shadow`, or anything on
  `.lg-decor`. See the "Deliberately NOT included" section — the cost is
  measured and documented in this repo.
- Do NOT touch `react/src/components/site/glass.tsx`.
- Do NOT touch the globe field's colour rules
  (`react/src/styles/site.css:255-256`, `:278-281`, `:295-297`).
- Do NOT change any COLOUR value. This plan changes timing only; every
  `body.on-light` colour stays exactly as it is.
- Do NOT use `transition: all`.
- Do NOT change `.lg-scrim`'s existing `.2s` — the new rules are being matched
  to it, not the other way round.
- Do NOT touch `ScrollFx`'s `themeIO` observer or its `rootMargin`
  (`react/src/components/site/ScrollFx.tsx:87-101`). The trigger point is
  deliberate and was tuned in commit d51ab89 ("flip the theme earlier").
- Do NOT add new dependencies.
- If the code at the cited lines does not match what is quoted (drift since
  commit 40625ce), STOP and report.

## Verification

- **Mechanical**:
  ```bash
  cd /Users/m1/things/isthumus/react && pnpm build
  ```
  Expected: succeeds.
- **Feel check**: run `pnpm dev` in a window wider than 1000px (so the desktop
  nav links are visible), and scroll slowly across a dark→light screen boundary.
  Confirm:
  - The wordmark, the five nav links, the CTA label and the burger all change
    ink at the same rate as the scrim darkening behind them. Before the change,
    the text snapped while the scrim faded.
  - Scroll back up across the same boundary and confirm the reverse flip is
    equally smooth.
  - Scroll rapidly up and down across the boundary several times. The colour
    transitions should retarget from wherever they are mid-flight — CSS
    transitions do this by nature — and never snap or queue.
  - **Check the nav CTA's press feedback still works** if plan 005 has landed
    (see step 4). Press and hold the "Reach out to us" button: it must still
    scale to 0.97. If it does not, step 4's trap was hit.
  - Hover a nav link. Its colour now fades over 200ms instead of cutting. Confirm
    this reads as intentional rather than sluggish — at 200ms on a small
    12px label it should feel responsive. If it feels laggy, report it.
  - Narrow the window below 760px so the bar moves to the bottom and the burger
    appears. Scroll across a boundary and confirm the burger icon and the CTA
    both transition.
  - Open the mobile drawer while over a light screen and confirm its links are
    still white and did NOT pick up a transition (step 5).
- **Performance check**: record a DevTools performance trace while scrolling
  across two theme boundaries. Confirm no new long frames appear at the flip
  points — colour transitions on nine small text nodes should be free, but this
  is the check that the selector did not accidentally reach something expensive.
- **Done when**: the bar's ink and its scrim change together as one move, and
  the nav CTA's press feedback (if present) survives.
