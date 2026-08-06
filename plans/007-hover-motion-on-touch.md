# 007 — Stop hover-only motion sticking on touch devices

- **Status**: DONE
- **Commit**: 40625ce
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 3 files, ~30 lines

## Problem

Nothing on this site gates hover motion behind a pointer capability query.
Confirmed:

```
$ grep -rn 'hover: *hover\|pointer: *fine' src/styles src/app src/components/site src/components/ui
(no matches in any site file)
```

On a touch device, a tap fires `pointerenter` / `mouseenter` and the element
enters its hover state — but no `mouseleave` follows until the user taps
somewhere else. AUDIT category 6 requires `@media (hover: hover) and (pointer:
fine)` around hover motion for exactly this reason.

Three places on the site are affected, in descending order of how bad it is:

### 1. The offer cards flip and stay flipped — `card-flip.tsx`

```tsx
/* react/src/components/kokonutui/card-flip.tsx:47-57 — current */
<div
  className={cn("cardflip", feature && "feat")}
  onBlur={(e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setIsFlipped(false);
  }}
  onFocus={() => setIsFlipped(true)}
  onMouseEnter={() => setIsFlipped(true)}
  onMouseLeave={() => setIsFlipped(false)}
  tabIndex={0}
>
```

This is the sharpest case because the state is *large and semantic*, not
decorative: tapping a card on a phone rotates it 180° over 550ms
(`react/src/styles/site.css:796-798`) and leaves it showing its back face
indefinitely. The user is now looking at the capability list with no affordance
to get back to the offering title, and the only way out is to tap a different
card — which flips that one too, leaving two cards showing their backs.

The mobile stylesheet clearly anticipated a version of this problem and solved
it for the *old* component but not this one. At
`react/src/styles/site.css:1251-1252`:

```css
/* the capability list is the card's substance — it stays, and since touch has
   no hover it is simply always shown */
```

…but the rules that follow (`.offers`, `.offer`, `.offer h3`, `.offer p` at
`react/src/styles/site.css:1253-1256`) target `.offer`, a class that no longer
exists — the component renders `.cardflip` / `.cf-face` / `.cf-front` /
`.cf-back` now. The intent is recorded; the implementation was left behind when
the card flip replaced the old overlay cards.

### 2. `.xpanel` lifts and stays lifted — `site.css:857-861`

```css
/* react/src/styles/site.css:857-861 — current */
.xpanel{display:flex;flex-direction:column;gap:16px;padding:22px 22px 24px;border-radius:16px;
  border:1px solid var(--line);background:var(--card);
  transition:border-color .3s var(--ease),transform .3s var(--ease)}
.xpanel:hover,.xpanel:focus-visible{border-color:var(--line-3);transform:translateY(-4px)}
```

Tapping a panel on a phone leaves it lifted 4px above its two neighbours.
Cosmetic rather than confusing, but it is a permanently wrong-looking row.

The panel ALSO replays its animation on `onMouseEnter`
(`react/src/components/site/ExpectationPanels.tsx:106`), which on touch means a
tap replays the figure. That part is arguably fine — a tap-to-replay is a
reasonable touch affordance — so this plan leaves the replay alone and only
fixes the stuck lift.

### 3. `.bo-chip` on the orbit — `site.css:906-917`

```css
/* react/src/styles/site.css:912-917 — current */
.bo-chip:hover,.bo-chip:focus-visible{border-color:var(--line-3);color:var(--accent-ink);
  background:color-mix(in srgb,var(--accent-ink) 12%,transparent)}
/* holding one chip quiets the rest, so the pair below reads against one label */
.brainorbit.holding .bo-chip{opacity:.5}
.brainorbit.holding .bo-chip:hover,.brainorbit.holding .bo-chip:focus-visible{opacity:1}
.brainorbit.holding .animate-orbit{animation-play-state:paused}
```

Tapping a chip on a phone dims the other five to `opacity:.5` and **pauses the
orbit permanently** (`animation-play-state:paused`), because `held` never clears
(`react/src/components/site/BrainOrbit.tsx:71`). The screen's whole conceit —
six qualities turning around a centre — stops dead on first tap.

Note this one is colour + opacity + a paused animation, not a transform. It
still belongs here: a stuck state is a stuck state, and the paused orbit is the
most visible consequence of the three.

**Excluded from this plan** (verified, deliberately out of scope):

- `.badge` — handled by plan **003**, which moves the lift to Motion's
  `whileHover`. Motion's hover gesture already filters out `pointerType:
  "touch"`, so 003 fixes the touch case for badges as a side effect. Run 003
  first; do not touch `.badge` here.
- `.route` (`react/src/components/site/ApproachRoutes.tsx:237-240`) — the mobile
  stylesheet already neutralises the hover-revealed content:
  `react/src/styles/site.css:1214` sets `.rt-detail{display:block;opacity:1;transform:none}`.
  A stuck `.on` class there only changes `opacity:.42` on siblings; check it in
  the feel check but do not add a query unless it actually reads wrong.
- `.dial` (`react/src/styles/site.css:520-529`) — same, neutralised at
  `react/src/styles/site.css:1172`.
- `.tr-leaf` (`react/src/components/site/ServicesTree.tsx:159-162`) — these are
  real `<button>` elements and a tap-to-read-the-description is the correct
  touch behaviour, not a bug. Leave it.

## Target

### `.cardflip`

Below 760px, where there is no hover, the card does not flip at all — both
readings are shown stacked, which is what the comment at
`react/src/styles/site.css:1251-1252` already says the design wants.

```css
/* target — appended to the @media (max-width:760px) block in site.css */
/* No hover on touch, so a tap would flip the card and leave it flipped with
   no way back. The card stops being a card here: the front's copy and the
   back's capability list both show, stacked, in normal flow. */
.cardflip{height:auto;perspective:none}
.cf-turn{transform:none;transition:none;transform-style:flat}
.cf-turn.flipped{transform:none}
.cf-face{position:relative;inset:auto;backface-visibility:visible}
.cf-front{min-height:clamp(150px,40vw,190px)}
.cf-back{transform:none;border-top:none;border-radius:0 0 18px 18px;margin-top:-1px}
.cf-front{border-radius:18px 18px 0 0}
.cf-caps li{transform:none!important;opacity:1!important;transition-delay:0ms!important}
```

The `!important` on `.cf-caps li` is required and not laziness: those three
properties are set as **inline styles** by the component
(`react/src/components/kokonutui/card-flip.tsx:80-84`), and an inline style
cannot be beaten by a class selector at any specificity.

### `.xpanel`

```css
/* target — react/src/styles/site.css:857-861 */
.xpanel{display:flex;flex-direction:column;gap:16px;padding:22px 22px 24px;border-radius:16px;
  border:1px solid var(--line);background:var(--card);
  transition:border-color .3s var(--ease),transform .3s var(--ease)}
.xpanel:focus-visible{border-color:var(--line-3);transform:translateY(-4px)}
@media (hover: hover) and (pointer: fine){
  .xpanel:hover{border-color:var(--line-3);transform:translateY(-4px)}
}
```

`:focus-visible` stays outside the query — a keyboard user on a touch-capable
laptop still needs it, and `:focus-visible` never fires from a tap.

### `.bo-chip`

```css
/* target — react/src/styles/site.css */
.bo-chip:focus-visible{border-color:var(--line-3);color:var(--accent-ink);
  background:color-mix(in srgb,var(--accent-ink) 12%,transparent)}
.brainorbit.holding .bo-chip{opacity:.5}
.brainorbit.holding .bo-chip:focus-visible{opacity:1}
.brainorbit.holding .animate-orbit{animation-play-state:paused}
@media (hover: hover) and (pointer: fine){
  .bo-chip:hover{border-color:var(--line-3);color:var(--accent-ink);
    background:color-mix(in srgb,var(--accent-ink) 12%,transparent)}
  .brainorbit.holding .bo-chip:hover{opacity:1}
}
```

Plus a guard in the component so `held` cannot be set from a touch pointer at
all — otherwise the orbit still pauses even with the CSS fixed, because
`.holding` is a React-driven class on the parent
(`react/src/components/site/BrainOrbit.tsx:79`):

```tsx
/* target — react/src/components/site/BrainOrbit.tsx */
onPointerEnter={(e) => { if (e.pointerType !== "touch") setHeld(q); }}
onPointerLeave={(e) => { if (e.pointerType !== "touch") setHeld((c) => (c === q ? null : c)); }}
```

`pointerType` is the reliable runtime signal — it is what Motion's own hover
gesture uses, and it distinguishes a real pointer from a finger on hybrid
devices where a media query alone would guess wrong.

## Repo conventions to follow

- **Media-query style in this stylesheet**: no space after the colon in the
  existing queries — `@media (max-width:760px)`,
  `@media (prefers-reduced-motion:reduce)`. But the two
  `prefers-reduced-transparency` queries DO use a space
  (`react/src/styles/site.css:125`, `:467`, `:967`). Either is consistent with
  something; prefer the spaced form `@media (hover: hover) and (pointer: fine)`
  since it matches AUDIT category 6's reference snippet verbatim.
- **Mobile overrides live in the single `@media (max-width:760px)` block** at
  `react/src/styles/site.css:1080-1275`, grouped by component with a prose
  comment per group. The card-flip group already exists at
  `react/src/styles/site.css:1251-1262` — extend it in place rather than opening
  a new block.
- **Exemplar for a capability query in this repo**:
  `react/src/components/kokonutui/liquid-glass-card.tsx:94` already does it —
  `[@media(hover:hover)]:hover:scale-105` — though that component is not used by
  the site. It confirms the pattern is understood here.
- **Exemplar for a `!important` beating an inline style**: none exists yet in
  this stylesheet. Comment it where you add it so it does not look like a
  specificity war.

## Steps

1. **Run plan 003 first** if it has not been run. It removes `.badge`'s CSS
   transform, which would otherwise be a fourth case here. If 003 is not done,
   note it and proceed — the two plans do not touch the same lines.

2. **`.xpanel`** — in `react/src/styles/site.css`, replace line 861:
   ```css
   .xpanel:hover,.xpanel:focus-visible{border-color:var(--line-3);transform:translateY(-4px)}
   ```
   with:
   ```css
   /* :focus-visible stays ungated — it never fires from a tap. The hover lift
      does, and on touch it would stick with no mouseleave to clear it. */
   .xpanel:focus-visible{border-color:var(--line-3);transform:translateY(-4px)}
   @media (hover: hover) and (pointer: fine){
     .xpanel:hover{border-color:var(--line-3);transform:translateY(-4px)}
   }
   ```

3. **`.bo-chip`** — in `react/src/styles/site.css`, replace lines 912-916:
   ```css
   .bo-chip:hover,.bo-chip:focus-visible{border-color:var(--line-3);color:var(--accent-ink);
     background:color-mix(in srgb,var(--accent-ink) 12%,transparent)}
   /* holding one chip quiets the rest, so the pair below reads against one label */
   .brainorbit.holding .bo-chip{opacity:.5}
   .brainorbit.holding .bo-chip:hover,.brainorbit.holding .bo-chip:focus-visible{opacity:1}
   .brainorbit.holding .animate-orbit{animation-play-state:paused}
   ```
   with:
   ```css
   .bo-chip:focus-visible{border-color:var(--line-3);color:var(--accent-ink);
     background:color-mix(in srgb,var(--accent-ink) 12%,transparent)}
   /* holding one chip quiets the rest, so the pair below reads against one label */
   .brainorbit.holding .bo-chip{opacity:.5}
   .brainorbit.holding .bo-chip:focus-visible{opacity:1}
   .brainorbit.holding .animate-orbit{animation-play-state:paused}
   /* the hover half, gated: on touch a tap would dim the other five chips and
      leave the orbit paused for good, since nothing clears `held`. */
   @media (hover: hover) and (pointer: fine){
     .bo-chip:hover{border-color:var(--line-3);color:var(--accent-ink);
       background:color-mix(in srgb,var(--accent-ink) 12%,transparent)}
     .brainorbit.holding .bo-chip:hover{opacity:1}
   }
   ```

4. **`BrainOrbit`** — in `react/src/components/site/BrainOrbit.tsx`, replace the
   two mouse handlers on lines 70-71:
   ```tsx
   onMouseEnter={() => setHeld(q)}
   onMouseLeave={() => setHeld((c) => (c === q ? null : c))}
   ```
   with pointer handlers that ignore touch:
   ```tsx
   /* pointerType, not a media query: on a hybrid laptop the query would say
      "you have a fine pointer" while the user is actually using the screen.
      A touch tap here would pause the orbit for good — nothing clears `held`. */
   onPointerEnter={(e) => {
     if (e.pointerType !== "touch") setHeld(q);
   }}
   onPointerLeave={(e) => {
     if (e.pointerType !== "touch") setHeld((c) => (c === q ? null : c));
   }}
   ```
   Leave `onFocus` and `onBlur` (lines 68-69) exactly as they are.

5. **`.cardflip`** — in `react/src/styles/site.css`, find the card-flip group in
   the `@media (max-width:760px)` block at lines 1251-1262. Replace the whole
   group (from the comment on line 1251 through line 1262) with:
   ```css
   /* No hover on touch, so a tap would flip the card and leave it flipped with
      no way back — and tapping a second card leaves two cards showing their
      backs. The card stops being a card at this width: the front's copy and
      the back's capability list both show, stacked, in normal flow. The rules
      below used to target `.offer`, a class the card-flip component replaced. */
   .offers{grid-template-columns:1fr;gap:14px}
   .cardflip{height:auto;perspective:none}
   .cf-turn{transform:none;transition:none;transform-style:flat}
   .cf-turn.flipped{transform:none}
   .cf-face{position:relative;inset:auto;backface-visibility:visible}
   .cf-front{min-height:clamp(150px,40vw,190px);border-radius:18px 18px 0 0}
   .cf-back{transform:none;margin-top:-1px;border-radius:0 0 18px 18px}
   /* these three are inline styles on the <li> (card-flip.tsx:80-84), so a
      class selector cannot reach them at any specificity */
   .cf-caps li{transform:none!important;opacity:1!important;transition-delay:0ms!important}
   .cf-front h3,.cf-back h3{font-size:19px}
   .cf-front p{font-size:13px;margin-top:8px}
   .cf-caps li{font-size:12px}
   ```
   Note this DELETES the four dead `.offer` rules (lines 1253-1256) and the
   now-duplicated `.offers` rule, and keeps the four type-scale rules from lines
   1259-1262.

6. Check nothing else references the dead `.offer` class:
   ```bash
   cd /Users/m1/things/isthumus/react && grep -rn '\boffer\b' src/styles/site.css src/components/site src/app
   ```
   Expected: only `.offers`, `.offer-slot`, and the `Offer` TypeScript type.
   If a bare `.offer` rule survives elsewhere, report it.

## Boundaries

- Do NOT touch `.badge` — plan 003 owns it.
- Do NOT touch `.route`, `.dial`, or `.tr-leaf`. All three are already handled or
  are correct on touch (see the "Excluded" list above).
- Do NOT change `react/src/components/kokonutui/card-flip.tsx`. The flip is
  disabled from CSS at the mobile breakpoint, which keeps the component
  untouched and the desktop behaviour identical.
- Do NOT change the `.cf-turn` desktop transition
  (`react/src/styles/site.css:796-798`) or its reduced-motion override
  (`react/src/styles/site.css:799`).
- Do NOT change `ExpectationPanels`' tap-to-replay behaviour
  (`react/src/components/site/ExpectationPanels.tsx:106-109`) — only the CSS
  lift is in scope.
- Do NOT add new dependencies.
- If the code at the cited lines does not match what is quoted (drift since
  commit 40625ce), STOP and report.

## Verification

- **Mechanical**:
  ```bash
  cd /Users/m1/things/isthumus/react && pnpm typecheck && pnpm build
  ```
  Expected: both exit 0. `onPointerEnter`/`onPointerLeave` give `e` a
  `React.PointerEvent`, so `e.pointerType` typechecks.
- **Desktop feel check** (unchanged behaviour — this is a regression check): run
  `pnpm dev` in a window wider than 760px with a mouse, and confirm:
  - Offer cards still flip on hover and flip back on leave, over 550ms.
  - Expectation panels still lift 4px on hover.
  - Orbit chips still highlight on hover, still dim their five siblings, and the
    orbit still pauses while held and resumes on leave.
  - Tab through all three with the keyboard: focus states are unchanged.
- **Touch feel check** — this is the actual test. Use DevTools device emulation
  with touch simulation on, at a width below 760px:
  - **Offer cards**: they should render as tall stacked cards showing the
    offering title, blurb, AND the capability list, with no flip. Tapping does
    nothing. Confirm no card is ever showing a mirrored/backwards face.
  - **Expectation panels**: tap one. It must NOT stay lifted. (The figure
    replaying on tap is expected and fine.)
  - **Orbit chips**: tap a chip. The other five must NOT dim, and **the orbit
    must keep turning**. This is the clearest pass/fail on the page — before the
    change, the first tap stops the orbit permanently.
  - Best effort: check on a real phone if one is available. Emulated touch and
    real touch differ on `pointerType` in some browsers, and this fix depends on
    it.
- **Hybrid check**: if a touchscreen laptop is available, confirm that using the
  trackpad still gives hover states while using the screen does not. This is why
  step 4 uses `pointerType` rather than only the media query.
- **Done when**: no tap on any of the three components leaves a state that a
  subsequent tap elsewhere cannot clear, and the orbit never stops on touch.
