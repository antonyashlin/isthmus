# 009 — Name the second and third curves, and add a duration scale

- **Status**: DONE
- **Commit**: 40625ce
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file, ~20 lines

## Problem

The site has exactly one motion token:

```css
/* react/src/styles/site.css:17 */
--max:1200px; --ease:cubic-bezier(0.22,1,0.36,1);
```

It is a good token and it is used consistently — 40-odd times across the
stylesheet. But two other curves are hand-typed inline, and there is no duration
scale at all.

### Two unnamed curves

```css
/* react/src/styles/site.css:796-798 — current */
.cf-turn{position:relative;width:100%;height:100%;transform-style:preserve-3d;
  transition:transform .55s cubic-bezier(0.77,0,0.175,1)}
.cf-turn.flipped{transform:rotateY(180deg)}
```

```css
/* react/src/styles/site.css:840-841 — current */
.cf-caps li{display:flex;align-items:flex-start;gap:8px;font-size:13px;line-height:1.5;
  color:var(--tx-2);transition:transform .3s cubic-bezier(0.23,1,0.32,1),opacity .3s cubic-bezier(0.23,1,0.32,1)}
```

Both curves are *correct choices*, which is why this is LOW and not higher:

- `cubic-bezier(0.77, 0, 0.175, 1)` is AUDIT category 2's `--ease-in-out`
  verbatim, and ease-in-out is the right family for something morphing on screen
  — which a 180° card rotation is. Right curve, no name.
- `cubic-bezier(0.23, 1, 0.32, 1)` is AUDIT category 2's `--ease-out` verbatim.
  It is also, to the eye, indistinguishable from the existing `--ease`
  (`0.22, 1, 0.36, 1`) — the two differ by 0.01 and 0.04 in the control points.
  This is the classic "five hand-typed cubic-beziers that almost match" that
  AUDIT category 7 calls a consolidation finding, caught at two.

The `.cf-caps li` one is also written out **twice on the same line**, once per
property.

### No duration scale

Durations are typed as literals throughout: `.2s`, `.25s`, `.28s`, `.3s`,
`.45s`, `.55s`, `160ms`, `620ms`, `900ms`. Three of those — `.25s`, `.28s`,
`.3s` — are the same intent (a hover/reveal transition) at three different
values, which is drift rather than design:

```
react/src/styles/site.css:446   transition:background .25s var(--ease)        .rk
react/src/styles/site.css:452   transition:opacity .28s var(--ease),…         .rk-note
react/src/styles/site.css:404   transition:opacity .3s var(--ease),…          .route
react/src/styles/site.css:485   transition:color .25s var(--ease)             .tr-branch
react/src/styles/site.css:528   transition:opacity .28s var(--ease),…         .dial-note
react/src/styles/site.css:566   transition:background .3s var(--ease)         .svc article
```

## Target

Three curve tokens and a four-step duration scale, declared alongside `--ease`,
with the two inline curves replaced by references.

```css
/* target — react/src/styles/site.css, in the :root block */
--max:1200px;
/* ---- motion ----
   --ease is the site's ease-out and the default for everything: entrances,
   hovers, reveals. --ease-in-out is for something MORPHING on screen rather
   than arriving (the offer card's 180° turn is the only case so far).
   Durations: a four-step scale. Anything above --dur-3 is explanatory motion
   (a chart drawing itself, the globe breathing) and stays a literal at its
   call site, because those are one-offs tuned to their own content. */
--ease:cubic-bezier(0.22,1,0.36,1);
--ease-in-out:cubic-bezier(0.77,0,0.175,1);
--dur-1:160ms;   /* press feedback, instant acknowledgement */
--dur-2:200ms;   /* colour + opacity on a hover-frequency element */
--dur-3:300ms;   /* card / panel state change */
--dur-4:450ms;   /* a panel or drawer arriving */
```

Exact values, and why each:

| Token | Value | Reason |
| --- | --- | --- |
| `--ease` | `cubic-bezier(0.22,1,0.36,1)` | UNCHANGED. Already the site's ease-out and used 40+ times. Do not renumber it to AUDIT's `0.23,1,0.32,1` — that would be a no-op visual change across the entire site for the sake of matching a reference table. |
| `--ease-in-out` | `cubic-bezier(0.77,0,0.175,1)` | AUDIT category 2's strong ease-in-out, verbatim, and exactly what `.cf-turn` already uses. Naming it costs nothing and changes nothing visually. |
| `--dur-1` | `160ms` | AUDIT category 2: button press feedback is 100–160ms. Matches the value plan 005 introduces for `.glass-btn:active`. |
| `--dur-2` | `200ms` | AUDIT category 2: tooltips and small popovers, 125–200ms. Matches the existing `.2s` on `a`, `.lg-scrim`, `.contact a`, `.field-input`, `.rdr-lab`. |
| `--dur-3` | `300ms` | AUDIT category 2 caps UI animation at 300ms. This is where `.25s` / `.28s` / `.3s` converge. |
| `--dur-4` | `450ms` | Matches Base UI's own drawer duration (`react/src/components/ui/drawer.tsx:123`, `duration-450`), so the site's panel timing and the vendored drawer's agree. Inside AUDIT category 2's 200–500ms modal/drawer band. |

**No `--ease-drawer` token.** AUDIT category 2 lists
`cubic-bezier(0.32, 0.72, 0, 1)` as an iOS-like drawer curve, but this site's
only drawer is Base UI's, which sets its own curve in Tailwind classes
(`react/src/components/ui/drawer.tsx:123` uses
`ease-[cubic-bezier(0.22,1,0.36,1)]` — already the site's `--ease`). Adding a
token nothing consumes is the same problem in a different direction.

## Repo conventions to follow

- **Tokens live in the `:root` block at the top of
  `react/src/styles/site.css:6-27`**, NOT in `react/src/styles/tokens.css`.
  `tokens.css` is the *deck's* token file — its header says "measured from the
  master deck … Components read the semantic `--isth-*` aliases" — and the site
  does not read from it. Do not put motion tokens there.
- **Declaration style in that block**: several tokens per line, semicolon
  separated, with a prose comment above each group. See the `--sans`/`--serif`
  group at `react/src/styles/site.css:10-16` and the `--stack` group at lines
  18-20.
- **The theme blocks (`:root` at line 6, `.light` at line 28) hold colour
  overrides only.** Motion tokens go in `:root` and are not overridden by
  `.light`.
- **Exemplar for a well-commented token group**: `react/src/styles/site.css:18-20`
  ```css
  /* vertical rhythm — one deliberate two-tier scale for caption->evidence gaps.
     --stack: a component follows its caption. --stack-lg: a distinct beat (diagram groups). */
  --stack:clamp(22px,4.6vh,56px); --stack-lg:clamp(30px,6vh,80px);
  ```
  Match that register: say what each step is FOR, not just what it is.

## Steps

1. In `react/src/styles/site.css`, replace line 17:
   ```css
   --max:1200px; --ease:cubic-bezier(0.22,1,0.36,1);
   ```
   with the token block from the **Target** section above (the comment plus
   `--max`, `--ease`, `--ease-in-out`, and the four durations).

2. Replace line 797:
   ```css
   transition:transform .55s cubic-bezier(0.77,0,0.175,1)}
   ```
   with:
   ```css
   transition:transform .55s var(--ease-in-out)}
   ```
   Keep `.55s` as a literal — a 550ms 180° card rotation is explanatory motion
   above the `--dur-4` step and does not belong on the scale.

3. Replace line 841:
   ```css
   color:var(--tx-2);transition:transform .3s cubic-bezier(0.23,1,0.32,1),opacity .3s cubic-bezier(0.23,1,0.32,1)}
   ```
   with:
   ```css
   color:var(--tx-2);transition:transform var(--dur-3) var(--ease),opacity var(--dur-3) var(--ease)}
   ```
   This is the one place the change is not a pure rename: `0.23,1,0.32,1`
   becomes `0.22,1,0.36,1`. The two curves differ by 0.01 and 0.04 in their
   control points and are visually indistinguishable at 300ms over a 10px
   translate. Confirm this in the feel check.

4. Migrate the three drifting hover/reveal durations to `--dur-3`. Replace, one
   at a time:
   - line 404: `transition:opacity .3s var(--ease),transform .3s var(--ease)}` →
     `transition:opacity var(--dur-3) var(--ease),transform var(--dur-3) var(--ease)}`
   - line 446: `transition:background .25s var(--ease)}` →
     `transition:background var(--dur-3) var(--ease)}`
   - line 452: `transition:opacity .28s var(--ease),transform .28s var(--ease)}` →
     `transition:opacity var(--dur-3) var(--ease),transform var(--dur-3) var(--ease)}`
   - line 485: `transition:color .25s var(--ease)}` →
     `transition:color var(--dur-3) var(--ease)}`
   - line 528: `transition:opacity .28s var(--ease),transform .28s var(--ease)}` →
     `transition:opacity var(--dur-3) var(--ease),transform var(--dur-3) var(--ease)}`
   - line 566: `transition:background .3s var(--ease)}` →
     `transition:background var(--dur-3) var(--ease)}`

   Each of these is a change of at most 50ms and none should be perceptible;
   the point is that six rules that meant the same thing now say the same thing.

5. Migrate the `.2s` group to `--dur-2`. These are already all the same value,
   so it is a pure rename:
   - line 72 (`a`): `transition:color .2s var(--ease)}` →
     `transition:color var(--dur-2) var(--ease)}`
   - line 122 (`.lg-scrim`): `transition:opacity .2s var(--ease)}` →
     `transition:opacity var(--dur-2) var(--ease)}`
   - line 436 (`.rdr-lab`) and line 437 (`.rdr-val`):
     `transition:fill .2s var(--ease)}` → `transition:fill var(--dur-2) var(--ease)}`
   - line 965 (`.contact a`): `transition:color .2s var(--ease)}` →
     `transition:color var(--dur-2) var(--ease)}`
   - line 987 (`.field-input`): `transition:border-color .2s var(--ease)}` →
     `transition:border-color var(--dur-2) var(--ease)}`

6. Do NOT migrate these — they are deliberate one-offs, not scale steps:
   - line 205 `.btn` (dead code — see plan 005)
   - line 496 `.tree-detail` `.3s` (leave; it pairs with the JS-driven detail
     swap that plan 001 retimes, and touching both would make 001's diff harder
     to read)
   - line 764 `.badge-beam` `.3s` (plan 003 touches this file nearby)
   - line 803, 809-810 `.cf-face` `.3s`
   - line 849, 860 `.mcard` / `.xpanel` `.3s` (plan 007 touches line 861)
   - line 1140 `.fg` `.45s` on mobile
   - line 523 `.dial` `.3s`
   - line 479 `.tr-link` `.25s`, line 489 `.tr-leaf` `.25s`, line 910-911
     `.bo-chip` `.25s`

   A second pass can bring these onto the scale once the higher-severity plans
   have landed; doing it all at once would collide with plans 001, 003, 005 and
   007.

7. Verify no hand-typed cubic-bezier survives in the stylesheet:
   ```bash
   cd /Users/m1/things/isthumus/react && grep -n 'cubic-bezier' src/styles/site.css
   ```
   Expected after the change: exactly two hits, both in the `:root` token block
   (the `--ease` and `--ease-in-out` declarations). Any other hit is a miss —
   report it.

## Boundaries

- Do NOT change the VALUE of `--ease`. Renumbering it to AUDIT's
  `0.23,1,0.32,1` would touch every animation on the site for no visible
  benefit.
- Do NOT put motion tokens in `react/src/styles/tokens.css` — that file belongs
  to the deck.
- Do NOT add tokens nothing consumes (no `--ease-drawer`, no `--dur-5`).
- Do NOT migrate the durations listed in step 6. They collide with plans 001,
  003, 005 and 007.
- Do NOT touch the JS easing constants
  (`react/src/components/site/ScrollFx.tsx:11`,
  `react/src/components/site/ApproachRoutes.tsx:18`,
  `react/src/components/site/ServicesTree.tsx:44`). CSS custom properties are not
  readable from those call sites without a `getComputedStyle` read, which would
  be worse than the duplication.
- Do NOT add new dependencies.
- If the code at the cited lines does not match what is quoted (drift since
  commit 40625ce), STOP and report.

## Verification

- **Mechanical**:
  ```bash
  cd /Users/m1/things/isthumus/react && pnpm build
  ```
  Expected: succeeds. Then:
  ```bash
  grep -n 'cubic-bezier' src/styles/site.css
  ```
  Expected: exactly 2 hits, both in `:root`.
- **Feel check**: this change should be **invisible**. Run `pnpm dev` and
  confirm nothing looks different:
  - **The one real change**: hover an offer card on the "Three ways to work with
    us" screen and watch the capability list stagger in on the back face. Its
    curve changed from `0.23,1,0.32,1` to `0.22,1,0.36,1`. At 300ms over a 10px
    translate this should be imperceptible. If you can see a difference, revert
    step 3 to a literal and report it.
  - The card flip itself (550ms, 180°) must be identical — step 2 is a pure
    rename.
  - Hover a route on the "Three ways most funds are built" screen, a radar key
    item, a services-tree branch, and a dial. Each of these moved by at most
    50ms. Spot-check that none now feels sluggish or snappy relative to its
    neighbours.
  - In DevTools → Elements → Computed, select a `.route` and confirm its
    `transition-duration` resolves to `0.3s`, i.e. the token is actually
    resolving and not falling back to the initial value. A typo in a
    `var(--dur-3)` reference fails silently to `0s` — that is the main risk in
    this plan, and it is why this check matters more than the eye test.
  - Repeat that Computed check on one element per migrated rule.
- **Done when**: the stylesheet contains two cubic-beziers, both named; every
  migrated rule resolves to a non-zero duration in Computed styles; and the site
  looks and feels unchanged.
