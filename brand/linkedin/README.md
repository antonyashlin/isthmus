# LinkedIn assets

| File | Use | Spec |
|---|---|---|
| `linkedin-page.md` | Page copy — tagline, About, specialties, launch posts | — |
| `isthmus-linkedin-logo-400x400.png` | Company logo / profile picture | 400×400, LinkedIn wants ≥300×300 |
| `isthmus-linkedin-cover-1128x191.png` | Page cover image | 1128×191 ratio, delivered at 2× (2256×382) for retina |

## Regenerating

`_source-cover.html` and `_source-logo.html` are the sources. Both are rendered
with headless Chrome against a locally served production build — the cover pulls
Archivo from the site's own built CSS, so the type matches the live site exactly
rather than approximating it.

```bash
cd react && npm run build
python3 -m http.server 4712 --directory out &
cp brand/linkedin/_source-*.html out/
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --force-device-scale-factor=2 --window-size=1128,191 \
  --screenshot=cover.png http://localhost:4712/_source-cover.html
```

**The `<link>` at the top of `_source-cover.html` points at a content-hashed CSS
filename.** That hash changes on any style change, so update the path to the
current `out/_next/static/chunks/*.css` before re-rendering, or the type silently
falls back and renders in the wrong face.

## Two design notes

**The cover keeps its left ~250px clear of text.** LinkedIn parks the company
logo over the lower-left of the cover; anything set there gets covered.

**The logo uses a heavier stroke than the web lockup** — 2.2 units against the
site's 1.4. LinkedIn shows the avatar at roughly 48px in the feed, where the
site's hairline computes to well under a pixel and disappears. Same geometry,
tuned for the size it is actually seen at. Don't "fix" it back to match the site.
