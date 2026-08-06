# 003 — Make the trust-badge hover lift actually fire

- **Status**: DONE
- **Commit**: 40625ce
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens (a designed animation that silently never runs)
- **Estimated scope**: 2 files, ~10 lines

## Problem

The four trust badges under the sign-off flow are styled to lift 3px on hover:

```css
/* react/src/styles/site.css:758-765 — current */
.badge{position:relative;overflow:hidden;
  display:flex;flex-direction:column;gap:10px;padding:16px 16px 18px;
  border-radius:14px;border:1px solid var(--line);background:var(--card);
  transition:border-color .3s var(--ease),transform .3s var(--ease)}
.badge:hover,.badge:focus-visible{border-color:var(--line-3);transform:translateY(-3px)}
/* the beam only traces the card being pointed at — evidence, not a loop */
.badge-beam{opacity:0;transition:opacity .3s var(--ease)}
.badge:hover .badge-beam,.badge:focus-within .badge-beam{opacity:1}
```

That `transform` never applies. `.badge` is not a plain `<div>` — it is the
class handed to a `BlurFade`, which renders a `motion.div`:

```tsx
/* react/src/components/site/TrustBadges.tsx:79-97 — current */
{BADGES.map(({ key, label, note, icon: Icon, fig }, i) => (
  <BlurFade className="badge" delay={i * 0.08} inView key={key}>
```

```tsx
/* react/src/components/ui/blur-fade.tsx:74-88 — the element .badge lands on */
<motion.div
  ref={ref}
  initial="hidden"
  animate={isInView ? "visible" : "hidden"}
  exit="hidden"
  variants={combinedVariants}
  transition={{ delay: 0.04 + delay, duration, ease: "easeOut", … }}
  className={className}
  {...props}
>
```

The `hidden`/`visible` variants animate `y` and `filter`
(`react/src/components/ui/blur-fade.tsx:50-62`), so Motion writes `transform`
into the element's **inline `style` attribute**. An inline style beats a
stylesheet rule regardless of selector specificity, so
`.badge:hover{transform:translateY(-3px)}` is dead from the moment the entrance
animation starts.

The `border-color` half of the hover DOES work (Motion never touches that
property), and so does the `.badge-beam` opacity reveal. The result is a hover
that changes the border and lights the beam but does not move — which is not what
the CSS says, and is inconsistent with `.xpanel`, the other card row on the site,
which does lift (`react/src/styles/site.css:861`).

## Target

The lift moves from CSS into Motion, so it composes with the entrance instead of
being overwritten by it. `whileHover` also ignores touch pointers, which fixes
the sticky-hover problem on phones for these cards at the same time.

```tsx
/* target — react/src/components/site/TrustBadges.tsx */
<BlurFade
  className="badge"
  delay={i * 0.08}
  inView
  key={key}
  whileHover={{ y: -3, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
>
```

```css
/* target — react/src/styles/site.css:758-762 */
.badge{position:relative;overflow:hidden;
  display:flex;flex-direction:column;gap:10px;padding:16px 16px 18px;
  border-radius:14px;border:1px solid var(--line);background:var(--card);
  transition:border-color .3s var(--ease)}
.badge:hover,.badge:focus-visible{border-color:var(--line-3)}
```

Exact values, and why each:

| Value | Reason |
| --- | --- |
| `y: -3` | The lift the CSS already specified. Unchanged in magnitude — this plan makes the existing design work, it does not redesign it. |
| `duration: 0.2` (200ms) | The CSS said `.3s`. AUDIT category 2 caps UI animation at 300ms and puts hover feedback at the fast end; 200ms on a hover-frequency element is the right side of that. Also matches `.lg-scrim`'s `.2s` at `react/src/styles/site.css:122`. |
| `ease: [0.22, 1, 0.36, 1]` | The repo's `--ease` token (`react/src/styles/site.css:17`) in Motion's tuple form, same as `react/src/components/site/ScrollFx.tsx:11`. |
| `transition` nested inside the `whileHover` target | Without this, the gesture inherits `BlurFade`'s own transition — `duration: 0.4, ease: "easeOut", delay: 0.04` (`react/src/components/ui/blur-fade.tsx:81-86`) — which would make the hover a delayed 400ms drift. |
| `transform` removed from the CSS `transition` list | It is now dead: nothing in CSS animates transform on this element any more. Leaving it would mislead the next reader. |
| `transform: translateY(-3px)` removed from `:hover` | Same reason — it never fired, and now the lift lives in one place. |

`BlurFade` forwards unknown props straight to the `motion.div` via `{...props}`
(`react/src/components/ui/blur-fade.tsx:88`) and its props type extends
`MotionProps` (`react/src/components/ui/blur-fade.tsx:15`), so `whileHover` is
already accepted with no change to the primitive.

## Repo conventions to follow

- **Do not edit vendored primitives to add features.** `blur-fade.tsx` is Magic
  UI, kept close to upstream. It already spreads `...props`, so pass the gesture
  from the call site instead of modifying it.
- **Easing** is the single `--ease` token, written in JS as
  `[0.22, 1, 0.36, 1]` — see `react/src/components/site/ScrollFx.tsx:11`.
- **Exemplar for a card that lifts correctly**: `.xpanel` at
  `react/src/styles/site.css:857-861` — a plain `<div>` (not a Motion element),
  where the CSS hover works fine. That is the contrast that makes `.badge` a bug
  rather than a choice.

## Steps

1. In `react/src/components/site/TrustBadges.tsx`, add the `whileHover` prop to
   the `BlurFade` at line 80. The full opening tag becomes:
   ```tsx
   <BlurFade
     className="badge"
     delay={i * 0.08}
     inView
     key={key}
     whileHover={{ y: -3, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
   >
   ```

2. Add a short comment above the `BADGES.map` call at
   `react/src/components/site/TrustBadges.tsx:79` recording the constraint, so
   nobody moves the lift back into CSS:
   ```tsx
   {/* The lift is a Motion gesture, not a CSS :hover rule: BlurFade renders
       this element as a motion.div and writes `transform` inline, which beats
       any stylesheet transform. The border-colour half still lives in CSS. */}
   ```

3. In `react/src/styles/site.css`, edit line 761 — drop `transform` from the
   transition list:
   ```css
   transition:border-color .3s var(--ease)}
   ```
   (was `transition:border-color .3s var(--ease),transform .3s var(--ease)}`)

4. In `react/src/styles/site.css`, edit line 762 — drop the transform from the
   hover rule:
   ```css
   .badge:hover,.badge:focus-visible{border-color:var(--line-3)}
   ```
   (was `…{border-color:var(--line-3);transform:translateY(-3px)}`)

5. Keyboard focus: `whileHover` does not fire on focus, and step 4 removed the
   `:focus-visible` transform. That is acceptable — the `:focus-visible` border
   change and the `:focus-within` beam reveal
   (`react/src/styles/site.css:765`) both still fire, so keyboard users keep two
   distinct focus signals. Do NOT add `whileFocus`; Motion's `whileFocus` maps to
   `:focus`, not `:focus-visible`, and would fire on mouse clicks too.

## Boundaries

- Do NOT modify `react/src/components/ui/blur-fade.tsx`.
- Do NOT change the `delay={i * 0.08}` entrance stagger.
- Do NOT touch `.badge-beam`, `.badge-icon`, `.badge-label`, `.badge-note`,
  `.badges-field`, or the mobile overrides at
  `react/src/styles/site.css:1225-1229`.
- Do NOT apply the same treatment to `.jstep`, `.sostep` or `.offer-slot` — those
  are also `BlurFade` wrappers but none of them has a hover transform, so there
  is nothing broken to fix.
- Do NOT add new dependencies.
- If the code at the cited lines does not match what is quoted (drift since
  commit 40625ce), STOP and report.

## Verification

- **Mechanical**:
  ```bash
  cd /Users/m1/things/isthumus/react && pnpm typecheck
  ```
  Expected: exits 0. `whileHover` typechecks because `BlurFadeProps extends
  MotionProps` (`react/src/components/ui/blur-fade.tsx:15`).
- **Feel check**: run `pnpm dev`, scroll to the "And it is handled under guard"
  screen, and confirm:
  - Hovering a badge now visibly lifts it 3px. **Before this change it did not
    move at all** — if you cannot tell the difference, check the inline
    `transform` on the element in DevTools' Elements panel to confirm Motion is
    driving it.
  - The lift settles in about a fifth of a second, not slowly.
  - The border still brightens and the BorderBeam still lights up.
  - Move the pointer quickly on and off a badge repeatedly: the lift should
    retarget smoothly from wherever it is, never snap or restart.
  - Tab to a badge with the keyboard: the border should change and the beam
    should light, without a lift.
  - In DevTools device emulation (a touch device), tap a badge: it should NOT
    stick in a lifted state. Motion's hover gesture filters out
    `pointerType: "touch"`.
- **Done when**: the badge visibly lifts on pointer hover, the CSS no longer
  contains a `transform` for `.badge`, and tapping on touch leaves no stuck
  state.
