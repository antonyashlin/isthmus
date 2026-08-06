# 005 — Give every button on the site press feedback

- **Status**: DONE
- **Commit**: 40625ce
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 1 file, ~8 lines

## Problem

The site has exactly four buttons, and every one of them is a `.glass-btn`:

```
react/src/components/site/Nav.tsx:69        nav CTA — "Reach out to us"
react/src/components/site/Nav.tsx:104       mobile drawer CTA — "Reach out to us"
react/src/components/site/InquiryCta.tsx:12 last-screen CTA — links to /inquiry
react/src/app/inquiry/page.tsx:129          the form's Send button
```

`.glass-btn` has no `:active` state at all:

```css
/* react/src/styles/site.css:164-176 — current, complete */
.glass-btn{display:inline-flex;align-items:center;justify-content:center;
  font-family:var(--sans);font-weight:500;letter-spacing:0.005em;
  white-space:nowrap;color:#fff;cursor:pointer}
.glass-btn .lg-content{display:flex;align-items:center;height:100%}
body.on-light .nav-row .glass-btn{color:var(--deep)}
.glass-btn-sm{height:34px;font-size:12.5px}
.glass-btn-sm .lg-content{padding:0 20px}
.glass-btn-lg{height:48px;font-size:14px}
.glass-btn-lg .lg-content{padding:0 28px}
```

So pressing any button on this site — including the one that submits the inquiry
form, the only conversion action the whole site has — produces no acknowledgement
whatsoever. On a touch device, where there is no hover state either, the button
is completely inert until the navigation happens.

There *is* a press rule in the stylesheet:

```css
/* react/src/styles/site.css:203-206 */
.btn{…;transition:transform .14s var(--ease),background .2s var(--ease),
  border-color .2s var(--ease),color .2s var(--ease)}
.btn:active{transform:translateY(1px)}
```

But `.btn` is **dead code**. Confirmed:
```
$ grep -rn 'className="[^"]*\bbtn\b' src/app src/components/site
src/app/inquiry/page.tsx:129    glass-btn glass-btn-lg form-send lg-shell
src/components/site/Nav.tsx:69          glass-btn glass-btn-sm lg-shell
src/components/site/Nav.tsx:104   nav-drawer-cta glass-btn glass-btn-sm lg-shell
src/components/site/InquiryCta.tsx:12   glass-btn glass-btn-lg inquiry-cta lg-shell
```
Every hit is `glass-btn`; nothing uses the bare `.btn` class. The `.btn`,
`.btn-sm`, `.btn-primary`, `.btn-glass`, `.btn-ghost`, `.btn-row` block at
`react/src/styles/site.css:202-216` is left over from the static build that this
React app was ported from.

AUDIT category 3 names this directly: "pressable elements with no press
feedback" is a finding, and the target is `transform: scale(0.97)` on `:active`
with `transition: transform 160ms ease-out`.

## Target

```css
/* target — appended to the .glass-btn block, react/src/styles/site.css */
.glass-btn{display:inline-flex;align-items:center;justify-content:center;
  font-family:var(--sans);font-weight:500;letter-spacing:0.005em;
  white-space:nowrap;color:#fff;cursor:pointer;
  transition:transform 160ms var(--ease)}
.glass-btn:active{transform:scale(0.97)}
@media (prefers-reduced-motion:reduce){
  .glass-btn{transition:none}
  .glass-btn:active{transform:none}
}
```

Exact values, and why each:

| Value | Reason |
| --- | --- |
| `scale(0.97)` | AUDIT category 3's exact press-feedback value. The subtle band is 0.95–0.98; 0.97 is the reference figure. Scale, not `translateY`, because a stadium-shaped glass pill reads as being *pushed into* the surface, not nudged down it. |
| `transition: transform 160ms var(--ease)` | AUDIT category 3 specifies `160ms ease-out`. `--ease` (`react/src/styles/site.css:17`) IS the site's ease-out — `cubic-bezier(0.22,1,0.36,1)`. 160ms also sits inside AUDIT category 2's 100–160ms "button press feedback" budget. |
| Applied on `.glass-btn`, not `.lg-content` | The shell is the element with the height and the shape (see the comment at `react/src/styles/site.css:159-163`), so scaling it takes the glass layer, the scrim and the label together. Scaling `.lg-content` alone would leave the glass behind. |
| Reduced-motion override | AUDIT category 6: drop position/size changes under reduced motion. The button still has `:focus-visible` (`react/src/styles/site.css:73-74`) and the browser's own active state, so feedback is not eliminated entirely. |

**Note on asymmetric timing** (AUDIT category 4): a single `transition` value
gives press and release the same 160ms. That is acceptable for a plain button —
the asymmetry rule targets deliberate hold gestures (press-and-hold, destructive
confirms), which this site has none of. Do not build a two-phase press here.

## Repo conventions to follow

- **Easing token**: `--ease` at `react/src/styles/site.css:17`. Never write a
  raw `cubic-bezier()` in this stylesheet where the token applies.
- **Exemplar for a transform transition in this stylesheet**:
  `react/src/styles/site.css:860-861`
  ```css
  .xpanel{…;transition:border-color .3s var(--ease),transform .3s var(--ease)}
  .xpanel:hover,.xpanel:focus-visible{border-color:var(--line-3);transform:translateY(-4px)}
  ```
- **Reduced-motion blocks in this file are single-line where short** — see
  `react/src/styles/site.css:505`, `:558`, `:799`, `:833`, `:844`, `:927`. A
  two-rule block gets braces on their own lines; match the surrounding style.
- **`.glass-btn` is a `.lg-shell`** at every call site. The shell/decor/content
  contract is documented at `react/src/styles/site.css:119-128` and
  `react/src/components/site/glass.tsx:29-34`. Scaling the shell is safe:
  `.lg-decor` is `position:absolute;inset:0` inside it and scales with it.

## Steps

1. In `react/src/styles/site.css`, add `transition:transform 160ms var(--ease)`
   to the `.glass-btn` rule. Lines 164-166 become:
   ```css
   .glass-btn{display:inline-flex;align-items:center;justify-content:center;
     font-family:var(--sans);font-weight:500;letter-spacing:0.005em;
     white-space:nowrap;color:#fff;cursor:pointer;
     transition:transform 160ms var(--ease)}
   ```

2. Immediately after the `.glass-btn-lg .lg-content` rule at
   `react/src/styles/site.css:176`, add the press state and its reduced-motion
   override:
   ```css
   /* press feedback. AUDIT: scale(0.97) over 160ms — the shell scales, so the
      glass layer, the scrim and the label all go together. These four buttons
      (nav CTA, drawer CTA, inquiry CTA, form send) are every button on the
      site; the .btn block below is left over from the static build and is
      not used by anything. */
   .glass-btn:active{transform:scale(0.97)}
   @media (prefers-reduced-motion:reduce){
     .glass-btn{transition:none}
     .glass-btn:active{transform:none}
   }
   ```

3. Do NOT delete the dead `.btn` block at `react/src/styles/site.css:202-216` as
   part of this plan — that is a separate cleanup and would widen the diff past
   a motion change. Instead the comment added in step 2 records that it is dead,
   for whoever does that cleanup.

4. Confirm nothing else already sets a `transform` on these elements that would
   be clobbered:
   ```bash
   cd /Users/m1/things/isthumus/react && grep -n 'glass-btn' src/styles/site.css
   ```
   Expected hits are all inside `react/src/styles/site.css:159-200` plus the
   drawer CTA rules at `:199-200`. None sets a transform. If one does, STOP and
   report.

## Boundaries

- Do NOT touch `react/src/components/site/glass.tsx` — the `.lg-shell` /
  `.lg-decor` / `.lg-content` structure is load-bearing and its failure modes are
  documented at length in that file's header comment.
- Do NOT touch `react/src/components/site/Nav.tsx`,
  `react/src/components/site/InquiryCta.tsx`, or
  `react/src/app/inquiry/page.tsx`. This is a pure stylesheet change.
- Do NOT delete or edit the dead `.btn` block (see step 3).
- Do NOT add a hover state to `.glass-btn`. The glass surface already has one
  through `.lg-scrim` and `body.on-light`; adding a hover lift on top of a
  translucent floating bar would fight the theme-flip logic.
- Do NOT add new dependencies.
- If the code at the cited lines does not match what is quoted (drift since
  commit 40625ce), STOP and report.

## Verification

- **Mechanical**:
  ```bash
  cd /Users/m1/things/isthumus/react && pnpm build
  ```
  Expected: the build succeeds. (There is no CSS linter configured; the build is
  the check that the stylesheet still parses.)
- **Feel check**: run `pnpm dev` and confirm, on all four buttons:
  - **Nav CTA** (top right on desktop, bottom bar on mobile): press and hold —
    the pill shrinks very slightly and the glass shrinks with it, with no gap
    appearing at its edge. Release — it springs back.
  - **Inquiry CTA** (bottom-left of the last screen).
  - **Mobile drawer CTA**: narrow the window below 760px, open the burger, press
    the CTA inside the panel.
  - **Form Send** at `/inquiry`.
  - The scale should be barely perceptible at full speed — if it reads as a big
    squash, the value is wrong. In DevTools → Animations at 10% playback, confirm
    the shell reaches 0.97 and no smaller.
  - Confirm the `.lg-decor` blur layer scales WITH the button. If a hairline of
    unblurred background appears at the pill's edge during the press, the
    transform is on the wrong element — report rather than patching around it.
  - Press and release rapidly several times: the transition should retarget from
    wherever it is, never queue or snap.
  - In DevTools → Rendering → "Emulate prefers-reduced-motion: reduce", confirm
    pressing produces no size change at all, and that `:focus-visible` still
    draws its outline when you tab to the button.
- **Touch check**: in device emulation, tap each button and confirm the press
  state appears and clears — `:active` is the correct selector for this on touch,
  where `:hover` would stick.
- **Done when**: all four buttons acknowledge a press, the glass stays flush
  with the shell throughout, and reduced motion disables the scale.
