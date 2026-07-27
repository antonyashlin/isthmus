# Isthmus Meridian — Typography

A specification for the marketing site's type system. Scope is `website/` only — the standalone
static page. The Next.js/Storybook deck system in `src/` is a separate type system and is not
changed here (see [Out of scope](#out-of-scope)).

Status: **proposed**. Nothing in `website/` has been changed yet.

---

## 1. The problem

The site loads **four families and owns none of the important ones.**

```css
/* website/index.html:21-23 */
--sans:  "Helvetica Neue","Helvetica","Arimo",Arial,sans-serif;   /* no webfont */
--serif: "Newsreader",Georgia,"Times New Roman",serif;             /* 6 styles loaded */
--mono:  "SFMono-Regular","SF Mono",ui-monospace,Menlo,Consolas,"Liberation Mono",monospace;

/* website/index.html:116 — hard-coded, not tokenised */
.wordmark .w-mer { font-family: "Cormorant",Georgia,serif; }       /* 2 styles, one word */
```

### 1.1 The body voice is whatever the OS supplies

There is no sans webfont. macOS renders Helvetica Neue — which is what a Mac screenshot shows,
and why the problem is invisible in local review. Windows falls through to **Arimo**, which is
Liberation Sans: a metric *substitution* face whose entire purpose is standing in for Arial in
documents. Android gets Roboto.

The token file says so in as many words:

```css
/* website/_ds/…/tokens/fonts.css */
/* For machines with neither, we load ARIMO — an Apache-licensed, metrically
   identical substitute for Helvetica/Arial — from Google Fonts so line breaks
   and spacing are preserved. */
```

Preserving line breaks is a document-fidelity goal. It is not a brand goal, and Arimo was never
chosen as a voice.

### 1.2 The hero only works on Apple hardware

```css
/* website/index.html:112 */
.wordmark .w-isth { font-weight:200; font-size:clamp(52px,11vw,150px); letter-spacing:0.02em; }
/* website/index.html:58 */
h1,h2,h3,h4 { font-weight:300; letter-spacing:-0.02em; }
```

Helvetica Neue has UltraLight (200) and Light (300). Arimo ships **400/500/700 only**. On any
machine without Helvetica Neue, the monumental hairline `ISTHMUS` synthesises to Regular and the
hero lockup collapses. Every heading on the page loses its Light weight the same way.

This is the single most expensive defect on the page and it is invisible from a Mac.

### 1.3 Two serifs, nine font files, zero for the lead voice

Cormorant is loaded — two styles, a whole extra Google Fonts family — to set the single word
"Meridian". Newsreader (six styles) carries pull quotes and inline emphasis. The **supporting**
voice is fully funded; the **primary** voice is not funded at all.

### 1.4 Mono is system-only but doing real brand work

| Element | Rule |
|---|---|
| Nav links | `index.html:83` |
| Eyebrows | `index.html:63` |
| Feature tags | `index.html:228` |
| Footer nav | `index.html:255` |
| Journey numbers | `index.html:206` |
| Source lines | `index.html:183` |

That texture is SF Mono for a Mac visitor and Consolas for a Windows one. Six brand surfaces
rendered in a face nobody chose.

### 1.5 The two faces in question

**Helvetica / Arimo** reads as unauthored. Correct, neutral, and completely silent — the wrong
signal for a firm selling precision.

**Cormorant Italic** is a beautiful face doing the wrong job — and the reason is *mood*, not size.
Cormorant was explicitly drawn for display use, so "too fine at 132px" would be a false charge. Two
real objections:

1. **Register.** It is a romantic Garamond revival with a small x-height and a calligraphic italic.
   It reads bridal. An investment-operations firm wants engraved, not handwritten.
2. **Light-on-dark erosion.** Fine strokes optically thin when set light on a dark ground — the
   standard reason reversed type wants a touch more weight. The current `font-weight:600`
   (`index.html:116`) is already compensating for this; the fix is a face that doesn't need the
   compensation, not more weight.

---

## 2. Constraints

Fixed before selection, and they eliminate most of the field:

- **Open licence only** (OFL/Apache), self-hosted. No foundry licence.
- **Keep the device.** Serif italic under a hairline grotesque stays; only the serif changes.
- **A real Thin is non-negotiable.** Any sans without weight 200 cannot set `.w-isth` and is
  disqualified regardless of how well it reads.
- **Dark ground.** Everything is judged on `#04101c`, not on white.

---

## 3. The system

### 3.1 Sans — Archivo Variable

**Role:** body, UI, wordmark, nav, labels. Licence: OFL (Omnibus-Type).

Axes verified against the Google Fonts API: `wght 100–900`, `wdth 62–125`, roman + italic.

- **Real Thin/ExtraLight.** The 150px hairline `ISTHMUS` works on every platform, not just Macs.
  This alone resolves §1.2.
- **Width axis.** The wordmark can sit slightly expanded (`wdth` ~105–112) so it reads *drafted
  and monumental* rather than merely large. Body stays at `wdth 100`. No other free grotesque in
  the running offers this.
- **Tabular figures** (`tnum`) for `.mgrid strong` (`index.html:233`), which already asks for
  `tabular-nums` and currently gets it from whatever the OS provides.
- Grotesque lineage — Trade Gothic / DIN-adjacent, squarish counters. At hairline weight that
  squareness reads as *engineered*, which is the right register for a nautical-instrument brand.
  It is a colder face than Helvetica, deliberately.
- One file replaces Helvetica Neue, Arimo, **and** the entire mono stack.

**The risk, stated plainly.** Archivo is chosen on its *display* strengths — the Thin, the width
axis, the engineered counters. Those same qualities make it a stiffer body face than Helvetica
Neue. At 17px across a 62ch measure (`.body`, `index.html:66`) it will read cooler and more
mechanical than what is on the site today. That is a deliberate trade, but it is the one thing
here that could be wrong, and it is why Step 1 renders body copy at real size before anything
ships. **Judge Archivo on the `.body` and `.lead` columns of the specimen, not on the hero** — the
hero will look good either way.

**Alternate:** **Geist** (OFL, `wght 100–900`, italic, with a Geist Mono sibling) — warmer in text,
closer to a true Swiss neo-grotesque, and it keeps the Thin. It gives up the width axis, so the
wordmark would need tracking rather than expansion to reach the same monumentality. Take this if
Archivo's body copy reads cold in the specimen.

**Rejected: Instrument Sans.** Verified `wght 400–700` only. No Thin, so it cannot set `.w-isth`.
Ruled out on §2, not on taste — it is otherwise an excellent fit.

### 3.2 Display serif italic — Instrument Serif Italic

**Role:** "Meridian", and display italic ≥40px. Licence: OFL. Single weight, 400.

- Larger x-height and more vertical stress than Cormorant's diagonal, humanist axis. Sturdier
  stems mean it **holds up reversed on the dark ground** without needing a weight bump.
- Reads editorial-authoritative rather than calligraphic-romantic. This is the mood correction the
  lockup actually needs — the problem with Cormorant was never that it was ugly.
- Single weight 400 is the whole family, and at 132px that is correct. The current `600` exists
  only to compensate for Cormorant and must **not** carry over.
- ~25 KB, one file, replacing Cormorant's two.

**Alternate:** **Bodoni Moda Italic** (variable `opsz 6–96`) — higher contrast, more drama, but it
tips fashion-editorial and away from the instrument register.

**Checked and rejected: Libre Caslon Display.** Historically the ideal face for this job — Caslon
is the typography of 18th-century charts, cartouches and legal instruments, and the brand story
would have landed perfectly. **It ships no italic** (verified: Regular 400 only). Libre Caslon
*Text* has an italic, but it is a text face and will not carry 132px. Recorded here so the idea
is not re-proposed.

### 3.3 Text serif italic — Newsreader Italic, role narrowed

**Keep it.** It has a genuine `opsz 6–72` axis, which is exactly what the small italics need:

| Element | Size | Rule |
|---|---|---|
| `.serif-i` inline emphasis | body | `index.html:60` |
| `.contrasts .no` | 16px | `index.html:240` |
| `.svc .idx` | 20px | `index.html:191` |
| `.pts .n` | 26px | `index.html:168` |
| `.fk` | 27px | `index.html:218` |

Instrument Serif is a display face and loses its hairlines at 16px. Newsreader at low `opsz` is
built for precisely this.

Two serifs, but now **optically justified rather than redundant**:

- **Instrument Serif** — display, ≥40px
- **Newsreader** — text, ≤32px

`.pull` (`clamp(26px,3.8vw,46px)`, `index.html:243`) straddles the boundary. Give it Instrument
Serif with its own clamp floor raised to ~40px rather than letting it render display type at 26px
on mobile.

### 3.4 Mono — delete it

Nav, eyebrows, tags, footer and journey numbers are **labels, not data**. Set them in Archivo 500,
uppercase, tracked `0.22em` — the value `DESIGN.md:153` already documents for eyebrows.

This keeps the technical register, costs zero bytes, and removes the last unowned face from the
page.

If the mono texture is wanted back later, self-host **Geist Mono** scoped strictly to `.source`
citations and genuine figures. That is an extra family for a small job and should be a deliberate
decision, not a default.

### 3.5 Net result

| | Before | After |
|---|---|---|
| Families | 4 (Helvetica/Arimo, Newsreader, Cormorant, system mono) | 3 (Archivo, Instrument Serif, Newsreader) |
| Sans webfont | none | Archivo Variable |
| Webfont requests | 9 styles across 3 families, cross-origin | 3 files, self-hosted, ~115 KB (est.) |
| Weight 200 available | macOS only | everywhere |
| Renders identically cross-platform | no | yes |

---

## 4. Implementation

### Step 1 — Specimen before production

Build `website/_type-specimen.html`: the real hero lockup, `.hero-tag`, `.body`, nav, eyebrow,
pull quote and metrics grid, at real sizes, on the real `#04101c` ground. Three columns:

1. Current (Helvetica Neue + Cormorant + Newsreader)
2. Archivo + Instrument Serif
3. Geist + Bodoni Moda

Screenshot at 1440 and 390 wide. **Nothing in `index.html` changes until this is reviewed** — the
alternates in §3 exist to be seen, not argued about in the abstract.

### Step 2 — Self-host

Subset to latin + latin-ext, `.woff2`, into `website/fonts/`:

| File | Axes | ~Size |
|---|---|---|
| `archivo-var.woff2` | `wght 100–900`, `wdth 62–125` | ~55 KB |
| `instrument-serif-italic.woff2` | 400 italic | ~25 KB |
| `newsreader-italic-var.woff2` | `opsz 6–72`, `wght 400–600` | ~35 KB |

Declare `@font-face` with `font-display:swap` **plus `size-adjust` / `ascent-override` /
`descent-override`** tuned against the system fallback, so the swap does not reflow the hero.

Then remove:

- `website/index.html:11` — the Google Fonts `<link>`, and the `preconnect`s at `:9-10`
- `website/_ds/…/tokens/fonts.css:10` — the Arimo `@import`

This deletes a render-blocking cross-origin stylesheet. Self-hosting on the same Cloudflare Pages
origin removes two extra DNS+TLS handshakes (`fonts.googleapis.com`, `fonts.gstatic.com`) and the
round trip that currently has to complete *before* the browser even learns which font files to
fetch. With `<link rel="preload">` the fonts start downloading in the first flight instead of the
third.

### Step 3 — Rewire tokens

```css
/* website/index.html:21-23 */
--sans:"Archivo","Helvetica Neue",Arial,sans-serif;
--serif-display:"Instrument Serif",Georgia,serif;   /* ≥40px */
--serif-text:"Newsreader",Georgia,serif;            /* ≤32px */
/* --mono removed */
```

Also update the stale duplicate at `website/_ds/…/tokens/typography.css:10-11`, which currently
declares its own `--font-sans`/`--font-mono` that the page overrides and never uses. Leaving it
wrong is how the next person ends up debugging the wrong file.

### Step 4 — Retune

**A font swap is not find-and-replace.** Every tracking value in this file was optically tuned
against Helvetica Neue and will be wrong for Archivo, which is spaced more openly.

| Rule | Current | Action |
|---|---|---|
| `.w-isth` `:112` | `letter-spacing:0.02em` | Retune toward `0`; let `wdth` carry the monumentality |
| `h1–h4` `:58` | `-0.02em` | Will over-tighten Archivo; expect roughly half |
| `.h-xl` / `.h-lg` `:159-160` | `-0.025em` | Same |
| `.w-mer` `:116-117` | `clamp(46px,9.6vw,132px)`, weight 600 | Instrument Serif's x-height is much larger, so this renders **optically bigger**. Drop ~8–10% and set weight 400 |
| `.w-mer` `:117` | `margin-top:-0.06em` | A baseline nudge hand-tuned to Cormorant's ascender and overshoot. It **will be wrong** for Instrument Serif. Re-derive it against the `ISTHMUS` cap-line — do not carry the number over |
| `.eyebrow` `:63` | `0.18em` | → `0.22em`, matching `DESIGN.md:153` |
| Nav / tags / footer / journey | `var(--mono)` | → `var(--sans)` 500, uppercase, tracked |

Separately flagged, **not** bundled into this change: `.w-isth` uses a chrome-gradient text fill
(`index.html:114-115`), which is on `DESIGN.md:233`'s Don't list. It is a live design decision, not
a typography one — decide it on its own.

### Step 5 — Verify

- Screenshot at 1440 / 1024 / 390 on the real dark ground. Hero lockup holds; metrics stay tabular.
- **Force the fallback** (block `website/fonts/`) and confirm no layout shift. This is the check
  the current site fails hardest.
- Confirm weight 200 renders at 200 via **computed style**, not visual guess — this is the specific
  bug that motivated the work, and it is the one that looks fine on the machine doing the checking.
- Re-run the type scan; expect the three new families flagged against `DESIGN.md` until Step 6:

```bash
node .claude/skills/impeccable/scripts/detect.mjs --json --scope type website
```

### Step 6 — Reconcile `DESIGN.md` *(decision required)*

`DESIGN.md:151` states **"The One-Family Rule … A serif or second grotesque is prohibited"**, and
`:219` says "set all type in Helvetica Neue". **The live site already violates both** — Cormorant
and Newsreader are shipping today. This proposal does not create the conflict; it makes it explicit.

`DESIGN.md` describes the **deck**. A deck and a marketing page have different jobs, and
legitimately want different type.

**Recommendation:** add a scoped *"Marketing surface"* typography subsection rather than rewriting
the deck rules. Confirm before editing — `DESIGN.md` is the deck's authority and should not change
as a side effect of a website pass.

---

## Out of scope

- **`website/charts.js`** hard-codes `'"Helvetica Neue","Helvetica","Arimo",Arial,sans-serif'` for
  ECharts labels (line 39, but it is a minified bundle — that line is ~1.1 MB long, so grep for the
  string rather than opening it by line). The fix belongs in `_m.js` source plus a rebuild. Until
  then **charts keep the old face** and will visibly disagree with the page around them. This needs
  doing; it is excluded here only because it is a build change, not a CSS one.
- **`src/`** (Next.js / Storybook deck system) is a separate type system: `src/styles/tokens.css:19-21`,
  `src/styles/globals.css:19-20`, and `src/lib/fonts.ts:8` — an intentional no-op with a comment
  explaining that no webfont is loaded. Changing the deck's type is a larger identity decision than
  the site's and should be taken on its own terms.

## Appendix — verification log

Axes confirmed against the Google Fonts CSS2 API rather than from memory, because at least one
otherwise-perfect candidate turned out not to have the styles it needed:

| Family | Verified | Verdict |
|---|---|---|
| Archivo | `ital` + `wdth 62..125` + `wght 100..900` | **Selected** — sans |
| Instrument Serif | italic 400 only | **Selected** — display serif |
| Newsreader | `ital` + `opsz 6..72` + `wght 200..800` | **Retained** — text serif |
| Instrument Sans | `wdth 75..100`, `wght 400..700` | Rejected — no Thin |
| Libre Caslon Display | Regular 400, **no italic** | Rejected — cannot do the job |
| Libre Caslon Text | italic 400 present | Rejected — text face, not display |
| Geist / Geist Mono | `ital` + `wght 100..900` | Alternate |
| Bodoni Moda | `ital` + `opsz 6..96` + `wght 400..900` | Alternate |
