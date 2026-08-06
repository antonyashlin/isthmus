# 006 — Stop smooth-scrolling for users who asked for no motion

- **Status**: DONE
- **Commit**: 40625ce
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file, 1 line

## Problem

The root element opts the whole document into animated scrolling:

```css
/* react/src/styles/site.css:44-46 — current */
/* one screen = one bound. mandatory (no scroll-snap-stop:always, so a fast flick
   can still cross several screens) */
html{scroll-behavior:smooth;scroll-snap-type:y mandatory;scroll-padding-top:0}
```

`scroll-behavior: smooth` is correctly reset in the two **viewport** media
queries:

```css
/* react/src/styles/site.css:1042 */
html{scroll-snap-type:none;scroll-behavior:auto}
/* react/src/styles/site.css:1087 */
html{scroll-snap-type:none;scroll-behavior:auto}
```

But it is **not** reset in the reduced-motion block, which only turns off the
snap:

```css
/* react/src/styles/site.css:1013-1017 — current */
@media (prefers-reduced-motion: reduce){
  html.js .reveal{opacity:1;transform:none}
  .mg-spark,.fgl-spark{display:none}
  html{scroll-snap-type:none}
}
```

So on a desktop viewport, a user who has asked their operating system for
reduced motion still gets a full-viewport animated scroll every time they click
one of the five nav links (`react/src/components/site/Nav.tsx:32-38`), the brand
logo (`react/src/components/site/Nav.tsx:49`), or any of the five links in the
mobile drawer. Each of those jumps is 100vh or more of smoothly animated travel
— which is exactly the class of motion the setting exists to suppress, and one
of the more common vestibular triggers.

This is a genuine gap rather than a deliberate tradeoff. The reduced-motion
block already exists and already turns off snapping and the travelling sparks;
`scroll-behavior` was simply missed, and the two viewport queries show the
project knows the property needs resetting.

## Target

```css
/* target — react/src/styles/site.css:1013-1017 */
@media (prefers-reduced-motion: reduce){
  html.js .reveal{opacity:1;transform:none}
  .mg-spark,.fgl-spark{display:none}
  /* `scroll-behavior:auto` as well as the snap: a nav-link jump on a desktop
     viewport is 100vh of animated travel, which is exactly what this setting
     is asking us not to do. The two viewport queries below already reset it
     for the same reason. */
  html{scroll-snap-type:none;scroll-behavior:auto}
}
```

The single change is `scroll-behavior:auto` added to the existing `html` rule.

Exact values, and why:

| Value | Reason |
| --- | --- |
| `scroll-behavior: auto` | `auto` is the CSS initial value — an instant jump. It is what the two viewport media queries at `react/src/styles/site.css:1042` and `:1087` already use, so this is the codebase's own established reset, not a new invention. |
| Added to the existing `html{scroll-snap-type:none}` rule rather than a new rule | Same selector, same block, same intent. AUDIT category 7: don't create a parallel declaration where one already exists. |

Nothing else in the reduced-motion story changes. AUDIT category 6 says reduced
motion means fewer and gentler animations, not zero — and this block already
honours that correctly: `.reveal` elements are made visible rather than left
hidden, the funnel is un-hidden at `react/src/styles/site.css:558`, and the
`.cf-pulse` rings drop to a static `opacity:.28` at
`react/src/styles/site.css:833` rather than vanishing.

## Repo conventions to follow

- **The reset value is already established twice in this file.** The exemplar is
  `react/src/styles/site.css:1042`, inside the "Document mode" block:
  ```css
  @media (max-width:1000px),(max-height:700px){
    html{scroll-snap-type:none;scroll-behavior:auto}
  ```
  Match that declaration order exactly (`scroll-snap-type` then
  `scroll-behavior`).
- **Comment style in this stylesheet is explanatory prose above the rule**, not
  a terse label — see the comments at `react/src/styles/site.css:44-45`,
  `:1027-1040`, `:1048-1050`. Write in that register.
- **This block is media-query-scoped, so specificity is unchanged** — a plain
  `html` selector inside `@media` still loses to nothing here. The two viewport
  queries appear LATER in the file (`:1041`, `:1080`) than the reduced-motion
  block (`:1013`), so on a narrow viewport with reduced motion on, the later
  rule wins and also says `auto`. No conflict either way.

## Steps

1. Open `react/src/styles/site.css` and find the reduced-motion block at line
   1013.

2. Replace line 1016:
   ```css
   html{scroll-snap-type:none}
   ```
   with a comment and the extended rule:
   ```css
   /* `scroll-behavior:auto` as well as the snap: a nav-link jump on a desktop
      viewport is 100vh of animated travel, which is exactly what this setting
      is asking us not to do. The two viewport queries below already reset it
      for the same reason. */
   html{scroll-snap-type:none;scroll-behavior:auto}
   ```

3. That is the whole change. Do not touch lines 1014-1015.

## Boundaries

- Do NOT remove `scroll-behavior:smooth` from
  `react/src/styles/site.css:46`. It is correct for users who have not asked for
  reduced motion, and the whole scroll-snap deck is designed around it.
- Do NOT touch `scroll-snap-type` on line 46 or in either viewport query. The
  snap is a separate concern with its own documented reasoning
  (`react/src/styles/site.css:44-45`, `:1027-1040`).
- Do NOT add a `scroll-behavior` reset in JavaScript. The CSS media query is the
  correct mechanism and it already exists.
- Do NOT touch any other rule in the reduced-motion block.
- Do NOT add new dependencies.
- If line 1016 does not read exactly `  html{scroll-snap-type:none}` (drift
  since commit 40625ce), STOP and report.

## Verification

- **Mechanical**:
  ```bash
  cd /Users/m1/things/isthumus/react && pnpm build
  ```
  Expected: the build succeeds. Then confirm the rule landed:
  ```bash
  grep -n 'scroll-behavior' src/styles/site.css
  ```
  Expected: three hits — `:46` (`smooth`), the new one in the reduced-motion
  block, and `:1042` and `:1087` (`auto`). Four total after the change.
- **Feel check**: run `pnpm dev` in a window wider than 1000px and taller than
  700px (so neither viewport query applies), then:
  - With reduced motion OFF, click a nav link. The page should glide to the
    section — unchanged behaviour.
  - Open DevTools → Rendering → "Emulate CSS media feature
    prefers-reduced-motion" → `reduce`. Click a nav link again. The page must
    jump instantly to the section with no visible travel.
  - Click the brand wordmark (`react/src/components/site/Nav.tsx:49`, `href="#top"`)
    and confirm the same instant jump.
  - Confirm scroll snapping is also off in this mode — dragging the scrollbar
    should not pull you to a screen boundary.
  - Turn the emulation back off and confirm smooth scrolling and snapping both
    return.
- **Mobile check**: narrow the window below 760px. Both viewport queries now
  apply and already set `auto`, so behaviour there is unchanged either way —
  confirm the burger-drawer links still jump instantly, as they did before.
- **Done when**: with `prefers-reduced-motion: reduce` emulated on a desktop
  viewport, every in-page anchor jumps instantly rather than animating.
