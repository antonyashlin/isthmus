# 012 — Reveal the inquiry form's errors instead of shoving the layout

- **Status**: DONE
- **Commit**: 40625ce
- **Severity**: LOW (additive — missed opportunity, not a defect)
- **Category**: Missed opportunities
- **Estimated scope**: 2 files, ~25 lines

## Problem

The inquiry form is the site's only conversion surface. Its two validation
errors mount and unmount as bare conditional nodes:

```tsx
/* react/src/app/inquiry/page.tsx:85-89 — current */
{touched && noWho ? (
  <p className="field-error" id="inq-who-error" role="alert">
    Tell us who you are so we can reply.
  </p>
) : null}
```

```tsx
/* react/src/app/inquiry/page.tsx:123-127 — current */
{touched && empty ? (
  <p className="field-error" id="inq-error" role="alert">
    Add a short note so we know what you need.
  </p>
) : null}
```

They sit inside a flex column with a 22px gap:

```css
/* react/src/styles/site.css:980-981 — current */
.form-fields{display:flex;flex-direction:column;gap:22px;padding:30px 28px 28px}
.field{display:flex;flex-direction:column;gap:9px}
```

```css
/* react/src/styles/site.css:991 — current */
.field-error{font-size:13px;color:var(--sky)}
```

So pressing Send on an empty form inserts two new flex children at once. Each is
a ~19px line plus a 22px gap — about 41px each, 82px total. Everything below
jumps down instantly: the type-of-inquiry select, the textarea, and the Send
button the user's pointer is still resting on. In the worst case the button
moves out from under the cursor between the mousedown and the moment the user
looks up.

AUDIT category 8 names exactly this: a state change that teleports, where a
brief transition would prevent a jarring change. It also names the tool —
`grid-template-rows: 0fr → 1fr` — which animates a reveal without a hardcoded
pixel height.

This matters more than its LOW severity suggests, because it is the one moment
on the site where the user has committed to an action and the interface answers
by moving. But it is scoped LOW because it is a single interaction on a
secondary page.

## Target

Each error occupies a collapsed grid row that expands. The message fades and
lifts inside it, so the reveal reads as the error arriving rather than the form
tearing.

```tsx
/* target — react/src/app/inquiry/page.tsx, both error sites */
<div className="field-error-slot" data-open={touched && noWho ? "" : undefined}>
  <p className="field-error" id="inq-who-error" role="alert">
    Tell us who you are so we can reply.
  </p>
</div>
```

```css
/* target — react/src/styles/site.css, replacing the .field-error rule */
/* The error is always in the DOM, in a grid row that is 0fr until it opens.
   0fr -> 1fr animates a reveal to the content's real height without ever
   hardcoding one (AUDIT category 8), so the fields below slide rather than
   jump. */
.field-error-slot{display:grid;grid-template-rows:0fr;
  transition:grid-template-rows var(--dur-3,300ms) var(--ease)}
.field-error-slot[data-open]{grid-template-rows:1fr}
.field-error{overflow:hidden;font-size:13px;color:var(--sky);
  opacity:0;transform:translateY(-4px);
  transition:opacity var(--dur-2,200ms) var(--ease),transform var(--dur-2,200ms) var(--ease)}
.field-error-slot[data-open] .field-error{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){
  .field-error-slot,.field-error{transition:none}
  .field-error{transform:none}
}
```

Exact values, and why each:

| Value | Reason |
| --- | --- |
| `grid-template-rows: 0fr → 1fr` | AUDIT category 8's named tool for a reveal with no hardcoded pixel offset. The row resolves to the content's real height, so a two-line error on a narrow screen works without a media query. |
| `overflow: hidden` on `.field-error` | Required — the `0fr` row does not clip its child on its own. Without it the message is visible at full size while the row is still collapsed. |
| `300ms` for the row | AUDIT category 2's ceiling for UI animation. The row is what pushes 80px of form around, so it gets the full budget; anything faster reads as a jump anyway. |
| `200ms` for the message | The content settles slightly faster than the space that holds it, so the message lands rather than trailing. AUDIT category 2's 125–200ms band. |
| `translateY(-4px)` | The message drops into the space rather than fading in place — AUDIT category 3, never a pure fade. Small, because the row expansion is already carrying the motion. |
| `var(--dur-3,300ms)` with a fallback | Plan **009** introduces `--dur-2` / `--dur-3`. The fallback means this plan works whether or not 009 has landed. If 009 has landed, drop the fallbacks. |
| `data-open` attribute rather than a class | The element must stay mounted for the transition to run at all — a conditional mount gives CSS nothing to transition from. `data-open` toggles a state on a permanent node. |

**Accessibility note, important**: `role="alert"` announces its contents when
the node's content changes or it is inserted. Keeping the node permanently
mounted and empty-but-collapsed changes that behaviour: an always-present
`role="alert"` with static text may be announced on page load by some screen
readers, or not announced at all when it opens. To keep the announcement
correct, the *text* must be conditional even though the *slot* is not:

```tsx
/* target — the accessible form */
<div className="field-error-slot" data-open={touched && noWho ? "" : undefined}>
  <p className="field-error" id="inq-who-error" role="alert">
    {touched && noWho ? "Tell us who you are so we can reply." : null}
  </p>
</div>
```

This keeps the box in the DOM (so CSS can animate it) while the announced
content still appears and disappears (so `role="alert"` fires on the change).
The `aria-describedby` wiring at
`react/src/app/inquiry/page.tsx:72` and `:111` already conditionally points at
these ids and needs no change.

## Repo conventions to follow

- **Easing**: `--ease` at `react/src/styles/site.css:17`.
- **Data attributes as state hooks**: the codebase already uses this pattern —
  `data-leaf`, `data-branch`, `data-link`, `data-spine` in
  `react/src/components/site/ServicesTree.tsx:138-149`, and `data-bar` in
  `react/src/components/site/ApproachRoutes.tsx:54`. `data-open` fits.
- **Form styles live in the "inquiry form page" block** at
  `react/src/styles/site.css:970-996`. Add the new rules there, next to the
  existing `.field-error`, not at the end of the file.
- **The mobile override at `react/src/styles/site.css:993-996`** adjusts
  `.formpage` and `.form-fields` padding only, and needs no change.
- **This page is a client component already** (`"use client"` at
  `react/src/app/inquiry/page.tsx:1`) with `useState` driving `touched`, so no
  new client boundary is introduced.

## Steps

1. In `react/src/styles/site.css`, replace line 991:
   ```css
   .field-error{font-size:13px;color:var(--sky)}
   ```
   with the full block from the **Target** section (the `.field-error-slot`
   rules, the extended `.field-error` rule, and the reduced-motion override).

2. In `react/src/app/inquiry/page.tsx`, replace lines 85-89 with:
   ```tsx
   <div className="field-error-slot" data-open={touched && noWho ? "" : undefined}>
     <p className="field-error" id="inq-who-error" role="alert">
       {touched && noWho ? "Tell us who you are so we can reply." : null}
     </p>
   </div>
   ```

3. Replace lines 123-127 with:
   ```tsx
   <div className="field-error-slot" data-open={touched && empty ? "" : undefined}>
     <p className="field-error" id="inq-error" role="alert">
       {touched && empty ? "Add a short note so we know what you need." : null}
     </p>
   </div>
   ```

4. Leave the `aria-describedby` and `aria-invalid` props on the input
   (`react/src/app/inquiry/page.tsx:72-73`) and the textarea
   (`react/src/app/inquiry/page.tsx:111-112`) exactly as they are. They already
   point at the ids conditionally, which is correct.

5. Check the `gap: 22px` on `.form-fields`
   (`react/src/styles/site.css:980`). The slot is now a permanent flex child, so
   it contributes a 22px gap even when collapsed — which would add 44px of dead
   space to the closed form. Fix by making the collapsed slot gapless:
   ```css
   .form-fields{display:flex;flex-direction:column;gap:22px;padding:30px 28px 28px}
   /* the two error slots are always present, so a collapsed one must not
      contribute the column gap */
   .field-error-slot:not([data-open]){margin-top:-22px}
   ```
   Add that second rule directly below the `.form-fields` rule. **Verify the
   measurement in the browser** — if the resting form is taller or shorter than
   before by any amount, this offset is wrong.

6. If plan **009** has already landed, remove the `,300ms` and `,200ms`
   fallbacks from the `var()` calls added in step 1. If it has not, leave them.

## Boundaries

- Do NOT change the validation logic, the `submit` handler, or the `mailto:`
  composition (`react/src/app/inquiry/page.tsx:32-45`).
- Do NOT remove `role="alert"` or change the ids — screen-reader behaviour
  depends on both.
- Do NOT animate `height` or `max-height` instead. `max-height` requires a
  guessed pixel ceiling and produces a delay at the end of the transition;
  `0fr → 1fr` is the tool AUDIT names.
- Do NOT use `AnimatePresence` here. This page has no other Motion usage, and
  pulling the runtime into a form for two error messages is the wrong trade —
  CSS does this correctly (AUDIT category 5: CSS beats JS for predetermined
  motion).
- Do NOT touch `.field-input`, `.field-label`, `.field-area`, or the Send button.
  Plan 005 owns the button.
- Do NOT add new dependencies.
- If the code at the cited lines does not match what is quoted (drift since
  commit 40625ce), STOP and report.

## Verification

- **Mechanical**:
  ```bash
  cd /Users/m1/things/isthumus/react && pnpm typecheck && pnpm build
  ```
  Expected: both exit 0.
- **Layout check first** (step 5 is the risk in this plan): run `pnpm dev`, open
  `/inquiry`, and before submitting anything, confirm the resting form looks
  **identical** to before the change — same spacing between the name field, the
  type select, the textarea and the Send button. Screenshot before and after if
  unsure. If the form got taller, the negative margin in step 5 is missing or
  wrong.
- **Feel check**:
  - Press Send on an empty form. Both errors should expand into place over about
    a third of a second, with the fields below sliding down rather than jumping.
  - Watch the Send button specifically: it should travel to its new position
    visibly, not teleport.
  - Type a name, press Send again. The name error should collapse smoothly as
    the note error stays open.
  - Fill both fields — the errors should close and the form should return to
    exactly its original height.
  - In DevTools → Animations at 10% playback, confirm the message fades in
    slightly ahead of the row finishing its expansion, and that the message is
    clipped (not overflowing) while the row is still opening.
  - In DevTools → Rendering → "Emulate prefers-reduced-motion: reduce", confirm
    the errors appear instantly with no expansion — which is correct here, since
    the alternative is animated layout movement, exactly what the setting asks us
    to drop.
- **Accessibility check**: with VoiceOver (macOS: ⌘F5) active, press Send on an
  empty form and confirm both messages are announced. Then reload and confirm
  they are NOT announced on page load. This is the check that step 2/3's
  conditional-text approach is working; if the messages announce on load, the
  text is not conditional.
- **Done when**: the resting form's height is unchanged, errors expand rather
  than jump, and the screen-reader announcement fires on submit and not on load.
