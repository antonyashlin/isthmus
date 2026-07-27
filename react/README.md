# Isthmus Meridian — React site

The Isthmus Meridian marketing site as a Next.js (App Router) project: a single
scroll-snapped page composed from a dark, Swiss-typographic deck system and a
custom visx/d3 charting layer.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # static export → out/
npm run typecheck
```

`next.config.ts` sets `output: "export"`, so `npm run build` emits a fully static
`out/` directory — no Node server needed to host it.

## Layout

```
src/
├── app/
│   ├── layout.tsx        root shell, metadata, Google Fonts <link>
│   ├── page.tsx          the whole page — section data lives here as consts
│   └── globals.css       imports styles/globals.css + styles/site.css
├── components/
│   ├── site/             the page's own sections and visuals
│   │   ├── Nav.tsx              fixed top nav
│   │   ├── Globe.tsx            hero globe (markup in globe-markup.ts)
│   │   ├── GlobeSparks.tsx      animated arcs over the globe
│   │   ├── ScrollFx.tsx         scroll-driven theme shift + snap behaviour
│   │   ├── InView.tsx           IntersectionObserver reveal wrapper
│   │   ├── GlassCards.tsx       MetricCards + OfferCards (liquid-glass)
│   │   ├── PressureRadar.tsx    private-market pressure figures
│   │   ├── PainGauges.tsx       back-office pain dials
│   │   ├── ServicesTree.tsx     services taxonomy tree
│   │   ├── ApproachRoutes.tsx   how-we-work routes
│   │   ├── ReadinessRings.tsx   readiness rings
│   │   └── FlowDiagram.tsx      engagement flow
│   ├── charts/           the chart library (visx + d3 + motion, ~170 files)
│   └── ui/               button, card (shadcn-style primitives)
├── lib/                  deck helpers, fonts, utils
└── styles/
    ├── tokens.css        the design tokens — colors, type scale, spacing
    ├── globals.css       Tailwind v4 bridge + token wiring
    └── site.css          snap pages, globe field, glass surfaces
```

Start with `src/app/page.tsx` — every section's copy and data is declared there
as plain consts and passed down, so content edits rarely need to touch the
components.

## Design tokens

`src/styles/tokens.css` is the source of truth. The palette is dark-ground by
construction: `--isth-bg` `#06121d` under `--isth-stage` black, with
`--isth-accent` `#88c1ed` and `--isth-gold` `#d9a441` as the only chromatic
accents. Charts read these tokens rather than carrying their own colors, so
retheming the site retints the data visualization with it.

## Notes

- **Fonts** load from the Google Fonts CDN via a `<link>` in `layout.tsx`
  (Cormorant + Newsreader italics). Everything else is system Helvetica Neue.
  The project needs network access on first paint for those two families; the
  rest degrades to the system stack.
- **No static assets.** There is no `public/` directory — the globe, arcs,
  gauges, rings, and diagrams are all generated SVG.
- **Tailwind v4** via `@tailwindcss/postcss`; there is no `tailwind.config`, the
  theme is declared inline in `styles/globals.css`.
- Verified on Node 20+ with npm — `npm install && npm run build` completes clean,
  including the TypeScript pass.
