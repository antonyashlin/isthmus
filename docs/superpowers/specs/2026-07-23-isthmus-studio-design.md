# Isthmus Studio — design

Date: 2026-07-23
Status: approved-pending-review

## Goal

Stand up a design-system + deck "studio" for **Isthmus Meridian**, mirroring the
proven structure of the sibling **andcap** project (`/Users/m1/things/andcap`) —
specifically its `/studio` and `/deck` routes, its foundations/Storybook token
system, and its skill/plugin setup — but re-themed to the Isthmus Meridian brand.

Scope for this pass: **core scaffold**. Real, runnable structure with the brand
tokens, one themed deck, the core foundations stories, and Storybook initialised.
The heavy canvas `/studio` landing and the full ~24-story foundations set from
andcap are explicitly deferred; the structure leaves room to grow into them.

## Reference

- Brand source: `/Users/m1/Downloads/small changes isthumus.pdf` (10 slides, 16:9,
  native 720×405). This is the refined master; supersedes the earlier
  `isthmus-meridian-deck.pdf`.
- Structural reference: `andcap` (Next.js 16, React 19, Tailwind v4, Storybook 10).

## Stack (match andcap)

- Next.js 16, React 19, TypeScript 5
- Tailwind v4 (`@tailwindcss/postcss`), `tw-animate-css`
- shadcn + `@base-ui/react`, `class-variance-authority`, `clsx`, `tailwind-merge`,
  `lucide-react`
- `motion` (animation), `recharts` (charts)
- Storybook 10 `nextjs-vite` + addons: a11y, docs, themes, vitest, chromatic
- ESLint 9 (`eslint-config-next`) + Prettier (+ tailwind plugin)
- Vitest (browser/playwright project for stories)

Versions pinned to andcap's `package.json` to stay in lockstep.

## Brand tokens (extracted from the PDF)

Format: 16:9. Author slides at 1920×1080, scale-to-fit in the viewer (as andcap's
GridDeck does); native PDF is 720×405.

Typography — **Helvetica Neue** with Arial fallback:
- Thin → the `MERIDIAN` wordmark and large display numerals
- Regular / Medium → body and subheads
- Bold → the `ISTHMUS` wordmark and emphasis
- Emphasis phrases are **accent-blue coloured text** (NOT serif-italic). For this
  brand, "preserve original typography" = keep blue emphasis; do not introduce
  Georgia/italic. (Contrast with GEOF, which used Georgia-italic.)

Colour tokens:

| token | value | role |
| --- | --- | --- |
| `--bg` | `#06121d` | deepest ground / stage |
| `--panel` | `#0b1926` | primary slide ground |
| `--surface` | `#0e1e2d` | card / glass surface |
| `--accent` | `#88c1ed` | primary accent, emphasis text, active nodes |
| `--accent-2` | `#4f83b0` | secondary blue, hairline borders |
| `--text` | `#ffffff` | primary text |
| `--muted` | `#6a798a` | secondary text, eyebrows, footers |
| `--light` | `#f2f6fa` | inverted / light surface |
| `--danger` | `#c96f6f` | muted red — negative / warning |

Motifs:
- `)|(` "crossing" logo mark — two facing arcs around a central vertical bar; the
  full lockup nests it in a globe/meridian wireframe (circle + equator + meridian +
  two longitude arcs). Reproduced as SVG traced from the rendered deck.
- Faint background grid.
- Tracked-out uppercase eyebrow in `--accent`/`--muted` with a leading dash rule
  (e.g. `—— THE THESIS`).
- Footer: left `ISTHMUS MERIDIAN · SECTION`, right `NN / NN`.
- Cards: `--surface` glass with hairline `--accent-2` borders, rounded corners;
  left accent-bar callout blocks.

## Structure

```
isthumus/
  package.json                    # cloned deps/scripts from andcap, name "isthmus"
  next.config.ts, tsconfig.json, postcss.config.mjs, eslint.config.mjs
  .prettierrc.json, .prettierignore
  .storybook/                     # Storybook 10 config (main, preview, vitest)
  src/
    app/
      layout.tsx                  # fonts + globals, Isthmus metadata
      page.tsx                    # simple landing (grow later)
      studio/                     # /studio landing root (simpler than andcap's dual-canvas; grows later)
        page.tsx, layout.tsx, _studio-root.tsx
      deck/                       # /deck → IsthmusDeck
        page.tsx, layout.tsx
    decks/
      isthmus/
        IsthmusDeck.tsx           # scaled 16:9 stage + slide compositions
        slides.tsx                # cover / thesis / closing to start
        isthmus-deck.css
        Meridian.tsx              # the )|( + globe logo SVG mark
    foundations/                  # core Storybook stories only
      ColourSystem.stories.tsx
      Typography.stories.tsx
      Spacing.stories.tsx
      DeckSystem.stories.tsx
      Overview.mdx
    components/                   # ui primitives as needed (cn, etc.)
    lib/
      fonts.ts                    # font-variable wiring (Helvetica Neue stack)
      utils.ts                    # cn()
    styles/
      globals.css
      tokens.css                  # the tokens above, at :root
      deck.css
```

## Skills / plugins (copy + re-lock)

Copy from andcap into isthumus:
- `.agents/skills/` (animation-vocabulary, apple-design, brandkit,
  design-taste-frontend[-v1], emil-design-eng, …)
- `.impeccable/`
- `.claude/skills/` (impeccable)
- `skills-lock.json`

Then **re-lock**: re-resolve each skill's GitHub source and recompute/verify the
hashes, updating `skills-lock.json` if any upstream drifted. `.claude/settings.json`
and `settings.local.json` are NOT copied verbatim (they carry andcap-specific
permissions); isthumus keeps its own existing `.claude/settings.local.json`.

## Storybook

Initialised as part of the scaffold with the same addon set as andcap. Wired to the
core foundations stories. `storybook` / `build-storybook` / `test:stories` scripts
carried over.

## Verification

- `npm run dev` serves `/`, `/studio`, `/deck` without runtime error.
- `/deck` renders the Isthmus cover (globe + `)|(` mark, wordmark, blue emphasis
  subhead) and at least the thesis + closing slides, on-brand.
- `npm run storybook` renders the four foundations stories using the Isthmus tokens.
- `npm run typecheck` and `npm run lint` pass.
- `skills-lock.json` present with verified hashes.

## Non-goals (this pass)

- andcap's canvas `/studio` landing (desktop + mobile rAF engines) — deferred.
- The full ~24-story foundations set, chart story matrix, and validation guards
  (deck/showcase/foundations/bundle/layout/motion `scripts/*.mjs`) — deferred.
- Porting andcap deck *content*; Isthmus deck uses its own slides.
- Playwright e2e — deferred.
