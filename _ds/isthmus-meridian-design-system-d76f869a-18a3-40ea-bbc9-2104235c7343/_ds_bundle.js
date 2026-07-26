/* @ds-bundle: {"format":4,"namespace":"IsthmusMeridianDesignSystem_d76f86","components":[{"name":"LogoMark","sourcePath":"components/brand/Logo.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"BarChart","sourcePath":"components/charts/BarChart.jsx"},{"name":"BubbleChart","sourcePath":"components/charts/BubbleChart.jsx"},{"name":"DonutChart","sourcePath":"components/charts/DonutChart.jsx"},{"name":"FootballField","sourcePath":"components/charts/FootballField.jsx"},{"name":"LineChart","sourcePath":"components/charts/LineChart.jsx"},{"name":"Sparkline","sourcePath":"components/charts/Sparkline.jsx"},{"name":"Waterfall","sourcePath":"components/charts/Waterfall.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Divider","sourcePath":"components/core/Divider.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"GlowTile","sourcePath":"components/data/GlowTile.jsx"},{"name":"Stat","sourcePath":"components/data/Stat.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"MediaFrame","sourcePath":"components/graphics/MediaFrame.jsx"},{"name":"Pattern","sourcePath":"components/graphics/Pattern.jsx"}],"sourceHashes":{"assets/image-slot.js":"0394ad34f685","components/brand/Logo.jsx":"2b4e68e73a55","components/charts/BarChart.jsx":"0be548bde1e9","components/charts/BubbleChart.jsx":"1d6723b40cc3","components/charts/DonutChart.jsx":"e128550b0317","components/charts/FootballField.jsx":"e1a6fc19ca55","components/charts/LineChart.jsx":"9801e8be5d4d","components/charts/Sparkline.jsx":"6c45f5f6fb84","components/charts/Waterfall.jsx":"77680a72d55e","components/core/Badge.jsx":"fb4e32b01e0d","components/core/Button.jsx":"c127db2060f3","components/core/Card.jsx":"67fc1ec3cd74","components/core/Divider.jsx":"9cc5d5eee102","components/core/Eyebrow.jsx":"7cb5e2261cad","components/core/IconButton.jsx":"fc9a480dd06e","components/data/GlowTile.jsx":"960409f559d7","components/data/Stat.jsx":"52b7e10bee4e","components/forms/Input.jsx":"5ca8d6a99df9","components/forms/Select.jsx":"73c96faf6653","components/graphics/MediaFrame.jsx":"0e3d3369a3d3","components/graphics/Pattern.jsx":"379dc3fc1728","ui_kits/deck/Deck.jsx":"b6348d3bd384","ui_kits/deck/Slides.jsx":"05cedbfb96ca","ui_kits/platform/App.jsx":"09ca5e9784d6","ui_kits/platform/Shell.jsx":"12c2bcb3653a","ui_kits/platform/Views.jsx":"2bf2adf4cb71","ui_kits/website/Nav.jsx":"e1ba8d598736","ui_kits/website/Sections.jsx":"39e8bfbe2db5","ui_kits/website/Site.jsx":"336469f0876c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.IsthmusMeridianDesignSystem_d76f86 = window.IsthmusMeridianDesignSystem_d76f86 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:rgba(0,0,0,.55);' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(0,0,0,.04)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px;text-decoration-color:rgba(0,0,0,.25)}' + '.empty:hover .sub u{color:rgba(0,0,0,.75);text-decoration-color:currentColor}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed rgba(0,0,0,.25);' + '  transition:border-color .12s}' + ':host([data-over]) .ring{border-color:#c96442}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(0,0,0,.12);border-top-color:rgba(0,0,0,.45);' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/image-slot.js", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Isthmus Meridian brand mark: two chevrons converging on a vertical
 * meridian line — the bridge to the reference line.
 */
function LogoMark({
  size = 32,
  color = "currentColor",
  strokeWidth = 7,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 120 120",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: style,
    "aria-hidden": "true"
  }, rest), /*#__PURE__*/React.createElement("polyline", {
    points: "38,36 52,60 38,84"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "82,36 68,60 82,84"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "60",
    y1: "26",
    x2: "60",
    y2: "94"
  }));
}

/**
 * Full logo with wordmark. `layout` = "horizontal" | "stacked" | "mark".
 * The mark is the dominant element; the wordmark sits beside/below it,
 * set in Medium + Light, tracked, uppercase.
 */
function Logo({
  layout = "horizontal",
  size = 34,
  color = "var(--im-white)",
  wordmarkColor,
  style,
  ...rest
}) {
  const wc = wordmarkColor || color;
  if (layout === "mark") {
    return /*#__PURE__*/React.createElement(LogoMark, _extends({
      size: size,
      color: color,
      style: style
    }, rest));
  }
  const stacked = layout === "stacked";
  // Mark is intentionally larger than the wordmark cap-height.
  const wordSize = Math.round(size * (stacked ? 0.3 : 0.36));
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      flexDirection: stacked ? "column" : "row",
      alignItems: "center",
      gap: stacked ? size * 0.26 : size * 0.36,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(LogoMark, {
    size: size,
    color: color
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      lineHeight: 1.12,
      alignItems: stacked ? "center" : "flex-start",
      fontFamily: "var(--font-sans)",
      fontSize: wordSize,
      letterSpacing: "0.2em",
      textIndent: "0.2em",
      color: wc
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "ISTHMUS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 300
    }
  }, "MERIDIAN")));
}
Object.assign(__ds_scope, { LogoMark, Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/charts/BarChart.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Vertical bar chart. Institutional, high data-ink: faint baseline grid,
 * steel bars with an optional highlighted (sky) bar, Helvetica labels.
 * data: [{ label, value, highlight? }]
 */
function BarChart({
  data = [],
  height = 220,
  format = v => v,
  gridLines = 4,
  barMaxWidth = 48,
  showValues = true,
  style,
  ...rest
}) {
  const uid = React.useId().replace(/:/g, "");
  const pad = {
    t: 18,
    r: 8,
    b: 30,
    l: 8
  };
  const w = 640;
  const max = Math.max(...data.map(d => d.value), 0) || 1;
  const niceMax = niceCeil(max);
  const innerH = height - pad.t - pad.b;
  const step = (w - pad.l - pad.r) / data.length;
  const bw = Math.min(barMaxWidth, step * 0.54);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: "100%",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${height}`,
    width: "100%",
    height: height,
    preserveAspectRatio: "none",
    style: {
      overflow: "visible",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: `bar-${uid}`,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#5C9AC7"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#356C97"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: `barHi-${uid}`,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#A6D3F4"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#5FA3D6"
  }))), Array.from({
    length: gridLines + 1
  }).map((_, i) => {
    const y = pad.t + innerH * i / gridLines;
    const val = niceMax * (1 - i / gridLines);
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("line", {
      x1: pad.l,
      y1: y,
      x2: w - pad.r,
      y2: y,
      stroke: "var(--chart-grid)",
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("text", {
      x: pad.l,
      y: y - 4,
      fontSize: "10",
      fill: "var(--chart-axis)"
    }, format(Math.round(val))));
  }), data.map((d, i) => {
    const bh = d.value / niceMax * innerH;
    const x = pad.l + step * i + (step - bw) / 2;
    const y = pad.t + innerH - bh;
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("rect", {
      x: x,
      y: y,
      width: bw,
      height: Math.max(bh, 1),
      rx: "3",
      fill: d.highlight ? `url(#barHi-${uid})` : `url(#bar-${uid})`
    }), showValues && /*#__PURE__*/React.createElement("text", {
      x: x + bw / 2,
      y: y - 6,
      fontSize: "11",
      fontWeight: "500",
      textAnchor: "middle",
      fill: d.highlight ? "var(--accent-bright)" : "var(--text-body)"
    }, format(d.value)), /*#__PURE__*/React.createElement("text", {
      x: x + bw / 2,
      y: height - 10,
      fontSize: "11",
      textAnchor: "middle",
      fill: "var(--text-muted)"
    }, d.label));
  })));
}
function niceCeil(v) {
  if (v <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * mag;
}
Object.assign(__ds_scope, { BarChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/BarChart.jsx", error: String((e && e.message) || e) }); }

// components/charts/BubbleChart.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Bubble / scatter chart. Three dimensions: x, y, and bubble radius r
 * (e.g. return vs risk sized by ticket). points: [{ x, y, r, label, tone? }]
 */
function BubbleChart({
  points = [],
  xMax,
  yMax,
  rMax = 40,
  height = 300,
  xLabel,
  yLabel,
  gridLines = 4,
  style,
  ...rest
}) {
  const uid = React.useId().replace(/:/g, "");
  const pad = {
    t: 16,
    r: 20,
    b: 34,
    l: 40
  };
  const w = 640;
  const xm = xMax || Math.max(...points.map(p => p.x)) * 1.1 || 1;
  const ym = yMax || Math.max(...points.map(p => p.y)) * 1.1 || 1;
  const rm = Math.max(...points.map(p => p.r)) || 1;
  const innerW = w - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const xAt = v => pad.l + v / xm * innerW;
  const yAt = v => pad.t + innerH - v / ym * innerH;
  const rAt = v => 8 + v / rm * (rMax - 8);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: "100%",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${height}`,
    width: "100%",
    height: height,
    preserveAspectRatio: "none",
    style: {
      overflow: "visible",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
    id: `bub-${uid}`,
    cx: "38%",
    cy: "34%",
    r: "72%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#A6D3F4",
    stopOpacity: "0.95"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#3F79A6",
    stopOpacity: "0.55"
  }))), Array.from({
    length: gridLines + 1
  }).map((_, i) => {
    const y = pad.t + innerH * i / gridLines;
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: pad.l,
      y1: y,
      x2: w - pad.r,
      y2: y,
      stroke: "var(--chart-grid)",
      strokeWidth: "1"
    });
  }), [0, 0.5, 1].map((f, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: pad.l - 8,
    y: yAt(ym * f) + 3,
    fontSize: "10",
    textAnchor: "end",
    fill: "var(--chart-axis)"
  }, Math.round(ym * f))), points.map((p, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("circle", {
    cx: xAt(p.x),
    cy: yAt(p.y),
    r: rAt(p.r),
    fill: `url(#bub-${uid})`,
    stroke: "#88C1ED",
    strokeOpacity: "0.4",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: xAt(p.x),
    y: yAt(p.y) + 3,
    fontSize: "10.5",
    fontWeight: "500",
    textAnchor: "middle",
    fill: "#06121d"
  }, p.label))), xLabel && /*#__PURE__*/React.createElement("text", {
    x: pad.l + innerW / 2,
    y: height - 4,
    fontSize: "11",
    textAnchor: "middle",
    fill: "var(--text-muted)"
  }, xLabel), yLabel && /*#__PURE__*/React.createElement("text", {
    transform: `rotate(-90 12 ${pad.t + innerH / 2})`,
    x: 12,
    y: pad.t + innerH / 2,
    fontSize: "11",
    textAnchor: "middle",
    fill: "var(--text-muted)"
  }, yLabel)));
}
Object.assign(__ds_scope, { BubbleChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/BubbleChart.jsx", error: String((e && e.message) || e) }); }

// components/charts/DonutChart.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Donut / ring chart with a center label. Good for allocation, mix,
 * progress. segments: [{ label, value, color? }]
 */
function DonutChart({
  segments = [],
  size = 200,
  thickness = 22,
  centerValue,
  centerLabel,
  gap = 2,
  style,
  ...rest
}) {
  const seq = ["var(--seq-1)", "var(--seq-2)", "var(--seq-3)", "var(--seq-4)", "var(--seq-6)"];
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      gap: 24,
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--chart-track)",
    strokeWidth: thickness
  }), /*#__PURE__*/React.createElement("g", {
    transform: `rotate(-90 ${size / 2} ${size / 2})`
  }, segments.map((s, i) => {
    const frac = s.value / total;
    const len = Math.max(frac * c - gap, 0);
    const dash = `${len} ${c - len}`;
    const off = -acc * c;
    acc += frac;
    return /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: size / 2,
      cy: size / 2,
      r: r,
      fill: "none",
      stroke: s.color || seq[i % seq.length],
      strokeWidth: thickness,
      strokeDasharray: dash,
      strokeDashoffset: off,
      strokeLinecap: "butt"
    });
  })), (centerValue != null || centerLabel) && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("text", {
    x: size / 2,
    y: size / 2 - 2,
    textAnchor: "middle",
    fontSize: size * 0.17,
    fontWeight: "300",
    fill: "var(--text-strong)",
    style: {
      letterSpacing: "-0.02em"
    }
  }, centerValue), /*#__PURE__*/React.createElement("text", {
    x: size / 2,
    y: size / 2 + size * 0.11,
    textAnchor: "middle",
    fontSize: "11",
    fill: "var(--text-muted)"
  }, centerLabel))), segments.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, segments.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 3,
      background: s.color || seq[i % seq.length],
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)"
    }
  }, s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-strong)",
      marginLeft: "auto",
      fontWeight: 500
    }
  }, Math.round(s.value / total * 100), "%")))));
}
Object.assign(__ds_scope, { DonutChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/DonutChart.jsx", error: String((e && e.message) || e) }); }

// components/charts/FootballField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Football field — the investment-banking valuation-range chart. Each row
 * is a methodology with a low–high range bar; an optional marker shows the
 * point estimate, and `reference` draws a vertical "current / offer" line.
 * rows: [{ label, low, high, mid? }]
 */
function FootballField({
  rows = [],
  min,
  max,
  reference,
  referenceLabel,
  format = v => v,
  rowHeight = 44,
  style,
  ...rest
}) {
  const pad = {
    t: 10,
    r: 20,
    b: 30,
    l: 150
  };
  const w = 640;
  const lo = min != null ? min : Math.min(...rows.map(r => r.low));
  const hi = max != null ? max : Math.max(...rows.map(r => r.high));
  const innerW = w - pad.l - pad.r;
  const height = pad.t + pad.b + rows.length * rowHeight;
  const xAt = v => pad.l + (v - lo) / (hi - lo || 1) * innerW;
  const bh = 16;
  const ticks = 5;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: "100%",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${height}`,
    width: "100%",
    height: height,
    preserveAspectRatio: "none",
    style: {
      overflow: "visible",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "ffRange",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#356C97"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#88C1ED"
  }))), Array.from({
    length: ticks + 1
  }).map((_, i) => {
    const v = lo + (hi - lo) * i / ticks;
    const x = xAt(v);
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("line", {
      x1: x,
      y1: pad.t,
      x2: x,
      y2: height - pad.b,
      stroke: "var(--chart-grid)",
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("text", {
      x: x,
      y: height - 12,
      fontSize: "10",
      textAnchor: "middle",
      fill: "var(--chart-axis)"
    }, format(Math.round(v))));
  }), reference != null && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
    x1: xAt(reference),
    y1: pad.t - 2,
    x2: xAt(reference),
    y2: height - pad.b,
    stroke: "#E7EEF5",
    strokeWidth: "1.5",
    strokeDasharray: "4 3"
  }), /*#__PURE__*/React.createElement("text", {
    x: xAt(reference),
    y: pad.t - 6,
    fontSize: "10",
    fontWeight: "500",
    textAnchor: "middle",
    fill: "#E7EEF5"
  }, referenceLabel || format(reference))), rows.map((r, i) => {
    const cy = pad.t + i * rowHeight + rowHeight / 2;
    const x1 = xAt(r.low),
      x2 = xAt(r.high);
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("text", {
      x: pad.l - 14,
      y: cy + 4,
      fontSize: "12",
      textAnchor: "end",
      fill: "var(--text-secondary)"
    }, r.label), /*#__PURE__*/React.createElement("rect", {
      x: x1,
      y: cy - bh / 2,
      width: Math.max(x2 - x1, 2),
      height: bh,
      rx: bh / 2,
      fill: "url(#ffRange)"
    }), /*#__PURE__*/React.createElement("text", {
      x: x1 - 6,
      y: cy + 3.5,
      fontSize: "10.5",
      textAnchor: "end",
      fill: "var(--text-muted)"
    }, format(r.low)), /*#__PURE__*/React.createElement("text", {
      x: x2 + 6,
      y: cy + 3.5,
      fontSize: "10.5",
      textAnchor: "start",
      fill: "var(--text-muted)"
    }, format(r.high)), r.mid != null && /*#__PURE__*/React.createElement("circle", {
      cx: xAt(r.mid),
      cy: cy,
      r: "3.4",
      fill: "#fff"
    }));
  })));
}
Object.assign(__ds_scope, { FootballField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/FootballField.jsx", error: String((e && e.message) || e) }); }

// components/charts/LineChart.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Line / area chart. One or more series over shared x-labels.
 * series: [{ name, points:[num], color?, area? }]  (color falls back to seq)
 */
function LineChart({
  series = [],
  labels = [],
  height = 240,
  area = true,
  gridLines = 4,
  format = v => v,
  style,
  ...rest
}) {
  const uid = React.useId().replace(/:/g, "");
  const pad = {
    t: 18,
    r: 12,
    b: 28,
    l: 34
  };
  const w = 640;
  const all = series.flatMap(s => s.points);
  const max = niceCeil(Math.max(...all, 0) || 1);
  const min = Math.min(0, ...all);
  const innerW = w - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const seq = ["var(--seq-1)", "var(--seq-2)", "var(--seq-3)", "var(--seq-4)"];
  const xAt = (i, n) => pad.l + innerW * i / (n - 1 || 1);
  const yAt = v => pad.t + innerH - (v - min) / (max - min || 1) * innerH;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: "100%",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${height}`,
    width: "100%",
    height: height,
    preserveAspectRatio: "none",
    style: {
      overflow: "visible",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, series.map((s, si) => /*#__PURE__*/React.createElement("linearGradient", {
    key: si,
    id: `ln-${uid}-${si}`,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: s.color || seq[si % seq.length],
    stopOpacity: "0.32"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: s.color || seq[si % seq.length],
    stopOpacity: "0"
  })))), Array.from({
    length: gridLines + 1
  }).map((_, i) => {
    const y = pad.t + innerH * i / gridLines;
    const val = min + (max - min) * (1 - i / gridLines);
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("line", {
      x1: pad.l,
      y1: y,
      x2: w - pad.r,
      y2: y,
      stroke: "var(--chart-grid)",
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("text", {
      x: pad.l - 8,
      y: y + 3,
      fontSize: "10",
      textAnchor: "end",
      fill: "var(--chart-axis)"
    }, format(Math.round(val))));
  }), labels.map((l, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: xAt(i, labels.length),
    y: height - 8,
    fontSize: "10",
    textAnchor: "middle",
    fill: "var(--text-muted)"
  }, l)), series.map((s, si) => {
    const n = s.points.length;
    const line = s.points.map((v, i) => (i ? "L" : "M") + xAt(i, n).toFixed(1) + " " + yAt(v).toFixed(1)).join(" ");
    const areaPath = line + ` L${xAt(n - 1, n)} ${pad.t + innerH} L${pad.l} ${pad.t + innerH} Z`;
    const col = s.color || seq[si % seq.length];
    return /*#__PURE__*/React.createElement("g", {
      key: si
    }, (s.area ?? area) && /*#__PURE__*/React.createElement("path", {
      d: areaPath,
      fill: `url(#ln-${uid}-${si})`
    }), /*#__PURE__*/React.createElement("path", {
      d: line,
      fill: "none",
      stroke: col,
      strokeWidth: "2.25",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: xAt(n - 1, n),
      cy: yAt(s.points[n - 1]),
      r: "3.4",
      fill: "#fff",
      stroke: col,
      strokeWidth: "1.5"
    }));
  })), series.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 18,
      marginTop: 10,
      flexWrap: "wrap"
    }
  }, series.map((s, si) => /*#__PURE__*/React.createElement("span", {
    key: si,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontSize: 12,
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 2.5,
      borderRadius: 2,
      background: s.color || seq[si % seq.length]
    }
  }), s.name))));
}
function niceCeil(v) {
  if (v <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * mag;
}
Object.assign(__ds_scope, { LineChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/LineChart.jsx", error: String((e && e.message) || e) }); }

// components/charts/Sparkline.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Compact sparkline (area + line), no axes. For inline KPI trends. */
function Sparkline({
  data = [],
  width = 120,
  height = 36,
  tone = "sky",
  area = true,
  strokeWidth = 2,
  style,
  ...rest
}) {
  const uid = React.useId().replace(/:/g, "");
  const color = tone === "steel" ? "#4686B7" : tone === "positive" ? "#5BB98C" : tone === "negative" ? "#D8695E" : "#88C1ED";
  const pad = 3;
  const max = Math.max(...data),
    min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = pad + i * (width - pad * 2) / (data.length - 1 || 1);
    const y = pad + (1 - (v - min) / (max - min || 1)) * (height - pad * 2);
    return [x, y];
  });
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const areaPath = line + ` L${width - pad} ${height} L${pad} ${height} Z`;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: width,
    height: height,
    viewBox: `0 0 ${width} ${height}`,
    style: {
      display: "block",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: `sp-${uid}`,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: color,
    stopOpacity: "0.34"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: color,
    stopOpacity: "0"
  }))), area && /*#__PURE__*/React.createElement("path", {
    d: areaPath,
    fill: `url(#sp-${uid})`
  }), /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), pts.length > 0 && /*#__PURE__*/React.createElement("circle", {
    cx: pts[pts.length - 1][0],
    cy: pts[pts.length - 1][1],
    r: "2.6",
    fill: "#fff"
  }));
}
Object.assign(__ds_scope, { Sparkline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/Sparkline.jsx", error: String((e && e.message) || e) }); }

// components/charts/Waterfall.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Waterfall / bridge chart — the finance staple for walking a starting
 * value through +/- deltas to a total (EBITDA bridge, value creation).
 * bars: [{ label, value, type: "start" | "delta" | "total" }]
 * deltas may be negative; start/total are absolute anchors from 0.
 */
function Waterfall({
  bars = [],
  height = 260,
  format = v => v,
  gridLines = 4,
  style,
  ...rest
}) {
  const pad = {
    t: 20,
    r: 8,
    b: 42,
    l: 40
  };
  const w = 640;
  const innerW = w - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  // compute running cumulative + peak
  let run = 0;
  let peak = 0;
  const geo = bars.map(b => {
    if (b.type === "delta") {
      const from = run;
      run += b.value;
      peak = Math.max(peak, run, from);
      return {
        from,
        to: run,
        val: b.value
      };
    }
    const from = 0;
    run = b.value;
    peak = Math.max(peak, b.value);
    return {
      from,
      to: b.value,
      val: b.value
    };
  });
  const max = niceCeil(peak || 1);
  const step = innerW / bars.length;
  const bw = Math.min(52, step * 0.56);
  const yAt = v => pad.t + innerH - v / max * innerH;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: "100%",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${height}`,
    width: "100%",
    height: height,
    preserveAspectRatio: "none",
    style: {
      overflow: "visible",
      display: "block"
    }
  }, Array.from({
    length: gridLines + 1
  }).map((_, i) => {
    const y = pad.t + innerH * i / gridLines;
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("line", {
      x1: pad.l,
      y1: y,
      x2: w - pad.r,
      y2: y,
      stroke: "var(--chart-grid)",
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("text", {
      x: pad.l - 8,
      y: y + 3,
      fontSize: "10",
      textAnchor: "end",
      fill: "var(--chart-axis)"
    }, format(Math.round(max * (1 - i / gridLines)))));
  }), bars.map((b, i) => {
    const g = geo[i];
    const yTop = yAt(Math.max(g.from, g.to));
    const yBot = yAt(Math.min(g.from, g.to));
    const x = pad.l + step * i + (step - bw) / 2;
    const anchor = b.type !== "delta";
    const up = g.val >= 0;
    const fill = anchor ? "url(#wfAnchor)" : up ? "#4E93C2" : "#B5675E";
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, i > 0 && /*#__PURE__*/React.createElement("line", {
      x1: pad.l + step * (i - 1) + step / 2 + bw / 2,
      y1: yAt(geo[i - 1].to),
      x2: x,
      y2: yAt(g.from === 0 ? g.to : g.from),
      stroke: "var(--chart-axis)",
      strokeWidth: "1",
      strokeDasharray: "2 2",
      opacity: "0.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: x,
      y: yTop,
      width: bw,
      height: Math.max(yBot - yTop, 2),
      rx: "2.5",
      fill: fill
    }), /*#__PURE__*/React.createElement("text", {
      x: x + bw / 2,
      y: yTop - 6,
      fontSize: "10.5",
      fontWeight: "500",
      textAnchor: "middle",
      fill: anchor ? "var(--text-strong)" : up ? "var(--accent-bright)" : "#E08C83"
    }, (up && !anchor ? "+" : "") + format(g.val)), /*#__PURE__*/React.createElement("text", {
      x: x + bw / 2,
      y: height - 22,
      fontSize: "10.5",
      textAnchor: "middle",
      fill: "var(--text-muted)"
    }, b.label));
  }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "wfAnchor",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#E7EEF5"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#9DB1C1"
  })))));
}
function niceCeil(v) {
  if (v <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * mag;
}
Object.assign(__ds_scope, { Waterfall });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/Waterfall.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Small status/label chip. Tones: neutral, accent (sky), steel,
 * positive, negative, warning. `dot` prepends a status dot.
 */
function Badge({
  tone = "neutral",
  dot = false,
  children,
  style,
  ...rest
}) {
  const tones = {
    neutral: {
      bg: "rgba(255,255,255,0.06)",
      fg: "var(--text-secondary)",
      bd: "var(--border-subtle)",
      dot: "var(--text-muted)"
    },
    accent: {
      bg: "rgba(136,193,237,0.12)",
      fg: "var(--accent-bright)",
      bd: "var(--border-accent)",
      dot: "var(--accent-bright)"
    },
    steel: {
      bg: "rgba(70,134,183,0.16)",
      fg: "#8FB8D9",
      bd: "rgba(70,134,183,0.34)",
      dot: "var(--accent)"
    },
    positive: {
      bg: "rgba(91,185,140,0.14)",
      fg: "#7FCBA4",
      bd: "rgba(91,185,140,0.30)",
      dot: "var(--im-positive)"
    },
    negative: {
      bg: "rgba(216,105,94,0.14)",
      fg: "#E08C83",
      bd: "rgba(216,105,94,0.30)",
      dot: "var(--im-negative)"
    },
    warning: {
      bg: "rgba(217,164,65,0.14)",
      fg: "#E0BC77",
      bd: "rgba(217,164,65,0.30)",
      dot: "var(--im-warning)"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 24,
      padding: "0 10px",
      borderRadius: "var(--radius-pill)",
      background: t.bg,
      border: `1px solid ${t.bd}`,
      color: t.fg,
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: "0.02em",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: t.dot,
      flex: "none"
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Isthmus Meridian button. Quiet, precise, institutional.
 * Variants: primary (steel fill), bright (sky fill on dark text),
 * secondary (hairline outline), ghost (text only), link.
 */
function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  iconLeft,
  iconRight,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const heights = {
    sm: "var(--control-h-sm)",
    md: "var(--control-h-md)",
    lg: "var(--control-h-lg)"
  };
  const pads = {
    sm: "0 14px",
    md: "0 20px",
    lg: "0 28px"
  };
  const fonts = {
    sm: "13px",
    md: "15px",
    lg: "16px"
  };
  const _sz = heights[size] ? size : "md";
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    height: heights[_sz],
    padding: pads[_sz],
    width: fullWidth ? "100%" : "auto",
    fontFamily: "var(--font-sans)",
    fontSize: fonts[_sz],
    fontWeight: 500,
    letterSpacing: "0.01em",
    lineHeight: 1,
    borderRadius: "var(--radius-pill)",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    whiteSpace: "nowrap",
    transition: "background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
    transform: active && !disabled ? "translateY(0.5px) scale(0.988)" : "none",
    WebkitFontSmoothing: "antialiased"
  };
  const variants = {
    primary: {
      background: hover ? "var(--accent-hover)" : "var(--accent)",
      color: "var(--im-white)",
      boxShadow: hover ? "var(--glow-soft), var(--sheen-top)" : "var(--sheen-top)"
    },
    bright: {
      background: hover ? "#9CCDF2" : "var(--accent-bright)",
      color: "var(--im-ink-900)",
      boxShadow: hover ? "var(--glow-sky), var(--sheen-top)" : "var(--sheen-top)"
    },
    secondary: {
      background: hover ? "var(--surface-raised)" : "var(--surface-card)",
      color: "var(--text-strong)",
      boxShadow: "var(--shadow-sm)"
    },
    ghost: {
      background: hover ? "rgba(255,255,255,0.06)" : "transparent",
      color: "var(--text-body)"
    },
    link: {
      background: "transparent",
      color: hover ? "var(--accent-bright)" : "var(--accent)",
      height: "auto",
      padding: 0,
      borderRadius: 0
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      ...base,
      ...(variants[variant] || variants.primary),
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Surface container. Variants:
 *  - "flat": card surface + hairline border (default)
 *  - "raised": lighter raised surface + subtle shadow
 *  - "glass": translucent blurred glass tile (sheen + border)
 *  - "glow": signature blue radial-glow tile (for hero/marketing)
 * `interactive` adds a hover lift + border brighten.
 */
function Card({
  variant = "flat",
  interactive = false,
  padding = 24,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const variants = {
    flat: {
      background: "var(--surface-card)",
      boxShadow: "var(--shadow-card)"
    },
    raised: {
      background: "var(--surface-raised)",
      boxShadow: "var(--shadow-raised)"
    },
    glass: {
      background: "var(--glass-face)",
      boxShadow: "var(--sheen-top), var(--shadow-card)",
      backdropFilter: "var(--blur-glass)",
      WebkitBackdropFilter: "var(--blur-glass)"
    },
    metal: {
      background: "var(--metal-face)",
      boxShadow: "var(--sheen-top), var(--shadow-raised)"
    },
    glow: {
      background: "var(--grad-glow)",
      boxShadow: "var(--glow-soft), var(--sheen-top)"
    }
  };
  const hoverFx = interactive ? {
    transform: hover ? "translateY(-3px)" : "none",
    boxShadow: hover ? "var(--shadow-pop), var(--glow-soft)" : (variants[variant] || variants.flat).boxShadow
  } : {};
  const sheen = variant === "glass" || variant === "metal";
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "var(--radius-xl)",
      padding,
      color: "var(--text-body)",
      transition: "transform var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
      ...(variants[variant] || variants.flat),
      ...hoverFx,
      ...style
    }
  }, rest), sheen && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      background: variant === "metal" ? "var(--metal-sheen)" : "var(--glass-sheen)",
      pointerEvents: "none",
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Divider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Hairline divider. `orientation` horizontal|vertical. `glow` uses the
 * center-fade brand hairline gradient. */
function Divider({
  orientation = "horizontal",
  glow = false,
  style,
  ...rest
}) {
  const vertical = orientation === "vertical";
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "separator",
    "aria-orientation": orientation,
    style: {
      flex: "none",
      ...(vertical ? {
        width: 1,
        alignSelf: "stretch",
        minHeight: 16
      } : {
        height: 1,
        width: "100%"
      }),
      background: glow ? "var(--grad-hairline)" : "var(--border-subtle)",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Divider.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tracked overline / eyebrow label — the brand's small caps signpost.
 * Optional leading tick mark. Used above section titles.
 */
function Eyebrow({
  tick = true,
  color = "var(--accent-bright)",
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-overline)",
      fontWeight: 500,
      letterSpacing: "var(--ls-overline)",
      textTransform: "uppercase",
      color,
      ...style
    }
  }, rest), tick && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 1,
      background: "currentColor",
      opacity: 0.6,
      flex: "none"
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Square/pill icon-only button. Mirrors Button variants at control heights. */
function IconButton({
  variant = "secondary",
  size = "md",
  shape = "pill",
  disabled = false,
  label,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dims = {
    sm: 34,
    md: 42,
    lg: 52
  };
  const d = dims[size] || dims.md;
  const variants = {
    primary: {
      background: hover ? "var(--accent-hover)" : "var(--accent)",
      color: "var(--im-white)",
      boxShadow: "var(--sheen-top)"
    },
    bright: {
      background: hover ? "#9CCDF2" : "var(--accent-bright)",
      color: "var(--im-ink-900)",
      boxShadow: "var(--sheen-top)"
    },
    secondary: {
      background: hover ? "var(--surface-raised)" : "var(--surface-card)",
      color: "var(--text-body)",
      boxShadow: "var(--shadow-sm)"
    },
    ghost: {
      background: hover ? "rgba(255,255,255,0.06)" : "transparent",
      color: "var(--text-body)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: d,
      height: d,
      borderRadius: shape === "square" ? "var(--radius-md)" : "var(--radius-pill)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      transition: "background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)",
      ...(variants[variant] || variants.secondary),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/GlowTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * The brand's hero surface: a rounded tile carrying the signature blue
 * radial glow, with a hairline edge and a corner brand mark. Drop any
 * content (a Stat, a headline, an image) inside.
 * `glow` = "corner" (bottom-right, default) | "beam" (left) | "center".
 */
function GlowTile({
  glow = "corner",
  mark = true,
  minHeight = 220,
  padding = 28,
  children,
  style,
  ...rest
}) {
  const glows = {
    corner: "radial-gradient(120% 130% at 82% 100%, #88C1ED 0%, #2f5f85 26%, #0b1420 58%, #05090d 100%)",
    beam: "radial-gradient(90% 120% at 0% 60%, #9CCDF2 0%, #3a6c94 22%, #0b1420 55%, #05090d 100%)",
    center: "radial-gradient(90% 120% at 50% 120%, #88C1ED 0%, #2f5f85 30%, #0b1420 62%, #000 100%)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      overflow: "hidden",
      minHeight,
      padding,
      borderRadius: "var(--radius-2xl)",
      background: glows[glow] || glows.corner,
      boxShadow: "var(--glow-soft), var(--sheen-top)",
      color: "var(--text-strong)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      background: "var(--glass-sheen)",
      pointerEvents: "none",
      zIndex: 0
    }
  }), mark && /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "26",
    viewBox: "0 0 120 120",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: "absolute",
      top: padding,
      right: padding,
      opacity: 0.9,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "38,36 52,60 38,84"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "82,36 68,60 82,84"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "60",
    y1: "26",
    x2: "60",
    y2: "94"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1
    }
  }, children));
}
Object.assign(__ds_scope, { GlowTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/GlowTile.jsx", error: String((e && e.message) || e) }); }

// components/data/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Signature statistic block: an oversized display numeral (chrome
 * gradient fill by default) with a quiet label beneath or beside.
 * Mirrors the brand's "80%+ / Growth in Financial Efficiency" motif.
 */
function Stat({
  value,
  label,
  sublabel,
  size = "lg",
  layout = "stack",
  chrome = true,
  align = "left",
  delta,
  style,
  ...rest
}) {
  const sizes = {
    sm: 40,
    md: 56,
    lg: 72,
    xl: 96
  };
  const _fs = sizes[size] || sizes.lg;
  const numColor = chrome ? {
    background: "var(--grad-chrome)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent"
  } : {
    color: "var(--text-strong)"
  };
  const num = /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: _fs,
      lineHeight: 1,
      letterSpacing: "-0.02em",
      display: "inline-block",
      ...numColor
    }
  }, value);
  const labels = /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 3
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      fontWeight: 400,
      color: "var(--text-body)",
      maxWidth: 220
    }
  }, label), sublabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, sublabel));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: layout === "row" ? "row" : "column",
      alignItems: layout === "row" ? "baseline" : align === "center" ? "center" : "flex-start",
      textAlign: align,
      gap: layout === "row" ? 16 : 12,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10
    }
  }, num, delta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      fontWeight: 500,
      color: delta.startsWith("-") ? "var(--im-negative)" : "var(--im-positive)"
    }
  }, delta)), (label || sublabel) && labels);
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Stat.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Text input on dark. Hairline border that brightens to sky on focus
 * with a soft focus glow. Supports label, hint, error, and adornments.
 */
function Input({
  label,
  hint,
  error,
  size = "md",
  prefix,
  suffix,
  disabled = false,
  style,
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const heights = {
    sm: "var(--control-h-sm)",
    md: "var(--control-h-md)",
    lg: "var(--control-h-lg)"
  };
  const inputId = id || React.useId();
  const ring = error ? "0 0 0 1px var(--im-negative)" : focus ? "var(--glow-focus)" : "var(--shadow-sm)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      width: "100%",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 500,
      color: "var(--text-secondary)",
      letterSpacing: "0.01em"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      height: heights[size] || heights.md,
      padding: "0 14px",
      background: focus ? "var(--surface-raised)" : "var(--surface-input)",
      borderRadius: "var(--radius-md)",
      boxShadow: ring,
      transition: "background var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
      opacity: disabled ? 0.5 : 1
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      display: "inline-flex"
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      background: "transparent",
      border: "none",
      outline: "none",
      color: "var(--text-strong)",
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      letterSpacing: "0.01em"
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      display: "inline-flex"
    }
  }, suffix)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: error ? "var(--im-negative)" : "var(--text-muted)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Native select styled to match Input. Pass `options` [{value,label}] or children. */
function Select({
  label,
  hint,
  size = "md",
  options,
  disabled = false,
  style,
  id,
  children,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const heights = {
    sm: "var(--control-h-sm)",
    md: "var(--control-h-md)",
    lg: "var(--control-h-lg)"
  };
  const selId = id || React.useId();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      width: "100%",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 500,
      color: "var(--text-secondary)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      height: heights[size] || heights.md,
      background: focus ? "var(--surface-raised)" : "var(--surface-input)",
      borderRadius: "var(--radius-md)",
      boxShadow: focus ? "var(--glow-focus)" : "var(--shadow-sm)",
      transition: "background var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: "none",
      WebkitAppearance: "none",
      flex: 1,
      height: "100%",
      padding: "0 38px 0 14px",
      background: "transparent",
      border: "none",
      outline: "none",
      color: "var(--text-strong)",
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      cursor: "pointer"
    }
  }, rest), options ? options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value,
    style: {
      background: "#12171E"
    }
  }, o.label)) : children), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-muted)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: "absolute",
      right: 12,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/graphics/MediaFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Brand image treatment. Wraps a photo (via `src`) or any children (e.g. an
 * <image-slot>) and applies the house look: a cool blue duotone wash, soft
 * grain, a vignette, and an optional glow bloom — the cinematic, near-
 * silhouette treatment the brand uses on all photography.
 * `intensity` 0–1 controls the blue wash; `ratio` sets the frame aspect.
 */
function MediaFrame({
  src,
  alt = "",
  intensity = 0.62,
  ratio = "16 / 10",
  radius = "var(--radius-xl)",
  glow = true,
  grain = true,
  bloom = "bottom",
  children,
  style,
  ...rest
}) {
  const blooms = {
    bottom: "radial-gradient(90% 80% at 50% 120%, rgba(136,193,237,0.5), transparent 62%)",
    corner: "radial-gradient(80% 80% at 85% 110%, rgba(136,193,237,0.5), transparent 60%)",
    left: "radial-gradient(70% 120% at -10% 50%, rgba(156,205,242,0.55), transparent 60%)",
    none: "none"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      aspectRatio: ratio,
      overflow: "hidden",
      borderRadius: radius,
      background: "var(--im-ink-800)",
      boxShadow: glow ? "var(--glow-soft), var(--sheen-top)" : "var(--shadow-card)",
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "grayscale(0.4) contrast(1.08) brightness(0.82)"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(150deg, rgba(10,22,34,0.35), rgba(43,108,151,0.55))",
      mixBlendMode: "color",
      opacity: intensity
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(5,9,13,0.15), rgba(5,9,13,0.55))"
    }
  }), bloom !== "none" && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: blooms[bloom] || blooms.bottom,
      mixBlendMode: "screen",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      boxShadow: "inset 0 0 90px 10px rgba(0,0,0,0.55)",
      pointerEvents: "none"
    }
  }), grain && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      mixBlendMode: "overlay",
      opacity: 0.5,
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"
    }
  }));
}
Object.assign(__ds_scope, { MediaFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/graphics/MediaFrame.jsx", error: String((e && e.message) || e) }); }

// components/graphics/Pattern.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Brand geometric pattern layer. Fills its parent — drop it as an absolute
 * background inside a positioned container, or size it explicitly.
 * variant: "grid" | "dots" | "meridian" | "chevron" | "rings" | "contour"
 */
function Pattern({
  variant = "meridian",
  color = "rgba(136,193,237,0.16)",
  background = "transparent",
  scale = 1,
  fade = "none",
  style,
  ...rest
}) {
  const uid = React.useId().replace(/:/g, "");
  const s = n => n * scale;
  const masks = {
    none: undefined,
    radial: `radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 100%)`,
    bottom: `linear-gradient(180deg, transparent, #000 70%)`,
    top: `linear-gradient(0deg, transparent, #000 70%)`,
    right: `linear-gradient(90deg, transparent, #000 80%)`
  };
  const maskImg = masks[fade];
  const defs = {
    grid: /*#__PURE__*/React.createElement("pattern", {
      id: uid,
      width: s(40),
      height: s(40),
      patternUnits: "userSpaceOnUse"
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${s(40)} 0 L 0 0 0 ${s(40)}`,
      fill: "none",
      stroke: color,
      strokeWidth: "1"
    })),
    dots: /*#__PURE__*/React.createElement("pattern", {
      id: uid,
      width: s(26),
      height: s(26),
      patternUnits: "userSpaceOnUse"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: s(13),
      cy: s(13),
      r: s(1.4),
      fill: color
    })),
    meridian: /*#__PURE__*/React.createElement("pattern", {
      id: uid,
      width: s(64),
      height: s(64),
      patternUnits: "userSpaceOnUse"
    }, /*#__PURE__*/React.createElement("line", {
      x1: s(32),
      y1: "0",
      x2: s(32),
      y2: s(64),
      stroke: color,
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("line", {
      x1: s(28),
      y1: s(32),
      x2: s(36),
      y2: s(32),
      stroke: color,
      strokeWidth: "1"
    })),
    chevron: /*#__PURE__*/React.createElement("pattern", {
      id: uid,
      width: s(34),
      height: s(34),
      patternUnits: "userSpaceOnUse",
      patternTransform: "translate(0 0)"
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${s(10)} ${s(9)} L ${s(19)} ${s(17)} L ${s(10)} ${s(25)}`,
      fill: "none",
      stroke: color,
      strokeWidth: "1.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })),
    rings: /*#__PURE__*/React.createElement("pattern", {
      id: uid,
      width: s(120),
      height: s(120),
      patternUnits: "userSpaceOnUse"
    }, /*#__PURE__*/React.createElement("g", {
      fill: "none",
      stroke: color,
      strokeWidth: "1"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: s(60),
      cy: s(60),
      r: s(16)
    }), /*#__PURE__*/React.createElement("circle", {
      cx: s(60),
      cy: s(60),
      r: s(32)
    }), /*#__PURE__*/React.createElement("circle", {
      cx: s(60),
      cy: s(60),
      r: s(48)
    }))),
    contour: /*#__PURE__*/React.createElement("pattern", {
      id: uid,
      width: s(200),
      height: s(48),
      patternUnits: "userSpaceOnUse"
    }, /*#__PURE__*/React.createElement("path", {
      d: `M0 ${s(36)} C ${s(50)} ${s(12)}, ${s(150)} ${s(60)}, ${s(200)} ${s(30)}`,
      fill: "none",
      stroke: color,
      strokeWidth: "1.2"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M0 ${s(18)} C ${s(50)} ${s(-6)}, ${s(150)} ${s(42)}, ${s(200)} ${s(12)}`,
      fill: "none",
      stroke: color,
      strokeWidth: "1.2",
      opacity: "0.6"
    }))
  };
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "100%",
    height: "100%",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": "true",
    style: {
      display: "block",
      background,
      ...(maskImg ? {
        WebkitMaskImage: maskImg,
        maskImage: maskImg
      } : {}),
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("defs", null, defs[variant] || defs.meridian), /*#__PURE__*/React.createElement("rect", {
    width: "100%",
    height: "100%",
    fill: `url(#${uid})`
  }));
}
Object.assign(__ds_scope, { Pattern });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/graphics/Pattern.jsx", error: String((e && e.message) || e) }); }

// ui_kits/deck/Deck.jsx
try { (() => {
/* Isthmus Meridian — deck framework: scales a 1280×720 canvas to fit, nav */
function Deck() {
  const slides = window.IM_DECK_SLIDES || [];
  const [i, setI] = React.useState(() => {
    const n = parseInt(localStorage.getItem("im-deck-i") || "0", 10);
    return isNaN(n) ? 0 : Math.min(Math.max(n, 0), slides.length - 1);
  });
  const [scale, setScale] = React.useState(1);
  const W = 1280,
    H = 720;
  React.useEffect(() => {
    localStorage.setItem("im-deck-i", String(i));
  }, [i]);
  React.useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  const go = React.useCallback(d => setI(v => Math.min(Math.max(v + d, 0), slides.length - 1)), [slides.length]);
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);
  const Slide = slides[i] || (() => null);
  const arrow = dir => /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: dir < 0 ? "rotate(180deg)" : "none"
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 5 19 12 12 19"
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "#000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: W,
      height: H,
      transform: `scale(${scale})`,
      transformOrigin: "center",
      position: "relative",
      boxShadow: "0 40px 120px -30px rgba(0,0,0,0.9)"
    }
  }, /*#__PURE__*/React.createElement(Slide, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 22,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "8px 12px",
      borderRadius: 999,
      background: "var(--glass-tint)",
      backdropFilter: "var(--blur-glass)",
      WebkitBackdropFilter: "var(--blur-glass)",
      boxShadow: "var(--shadow-md)",
      fontFamily: "var(--font-sans)",
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go(-1),
    disabled: i === 0,
    style: ctrlBtn(i === 0)
  }, arrow(-1)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      alignItems: "center"
    }
  }, slides.map((_, n) => /*#__PURE__*/React.createElement("button", {
    key: n,
    onClick: () => setI(n),
    "aria-label": `Slide ${n + 1}`,
    style: {
      width: n === i ? 22 : 7,
      height: 7,
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      background: n === i ? "var(--accent-bright)" : "rgba(255,255,255,0.22)",
      transition: "all .3s var(--ease-out)"
    }
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => go(1),
    disabled: i === slides.length - 1,
    style: ctrlBtn(i === slides.length - 1)
  }, arrow(1)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)",
      marginLeft: 4,
      minWidth: 42,
      textAlign: "right",
      letterSpacing: "0.08em"
    }
  }, String(i + 1).padStart(2, "0"), " / ", String(slides.length).padStart(2, "0"))));
}
function ctrlBtn(disabled) {
  return {
    width: 34,
    height: 34,
    borderRadius: 999,
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.3 : 1,
    background: "rgba(255,255,255,0.06)",
    color: "#fff"
  };
}
window.IMDeck = Deck;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/deck/Deck.jsx", error: String((e && e.message) || e) }); }

// ui_kits/deck/Slides.jsx
try { (() => {
/* Isthmus Meridian — pitch deck slides (Lunetra-inspired structure) */
const D = window.IsthmusMeridianDesignSystem_d76f86;
const {
  Logo,
  LogoMark,
  Stat,
  Badge,
  Eyebrow,
  Card,
  Pattern,
  MediaFrame,
  BarChart,
  LineChart,
  DonutChart,
  BubbleChart,
  Waterfall,
  FootballField
} = D;
const usd = v => `$${v}M`;
const slideBase = {
  position: "absolute",
  inset: 0,
  fontFamily: "var(--font-sans)",
  color: "#fff",
  overflow: "hidden"
};
const Eye = ({
  children
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "var(--accent-bright)"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    width: 22,
    height: 1,
    background: "currentColor",
    opacity: 0.7
  }
}), children);
const pageMark = n => /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    bottom: 34,
    left: 56,
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 12,
    color: "rgba(255,255,255,0.42)",
    letterSpacing: "0.04em"
  }
}, /*#__PURE__*/React.createElement(LogoMark, {
  size: 16,
  color: "rgba(255,255,255,0.6)"
}), " Isthmus Meridian", /*#__PURE__*/React.createElement("span", {
  style: {
    position: "absolute",
    left: 640,
    whiteSpace: "nowrap"
  }
}));
const pageNo = n => /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    bottom: 34,
    right: 56,
    fontSize: 12,
    color: "rgba(255,255,255,0.42)",
    letterSpacing: "0.12em"
  }
}, String(n).padStart(2, "0"), " / 09");

/* 1 · COVER */
function SlideCover() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...slideBase,
      background: "#000"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0
    }
  }, /*#__PURE__*/React.createElement(MediaFrame, {
    ratio: "16 / 9",
    radius: "0",
    glow: false,
    bloom: "corner",
    intensity: 0.7,
    style: {
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "im-deck-cover",
    shape: "rect",
    placeholder: "Drop cover image (cool, cinematic)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(90deg, rgba(0,0,0,0.86) 32%, rgba(0,0,0,0.2) 72%, transparent)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 56,
      left: 56,
      right: 56,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    layout: "horizontal",
    size: 30
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.55)"
    }
  }, "Investment Committee \xB7 Confidential")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 56,
      bottom: 132,
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement(Eye, null, "Project Meridian \xB7 Senior facility"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 92,
      fontWeight: 300,
      lineHeight: 0.98,
      letterSpacing: "-0.03em",
      margin: "26px 0 0"
    }
  }, "The bridge to", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "fundable.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 19,
      color: "rgba(255,255,255,0.72)",
      maxWidth: 540,
      marginTop: 24,
      lineHeight: 1.5
    }
  }, "A $240M senior credit structure connecting Gulf capital to frontier logistics \u2014 modeled, diligenced and narrated as one.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 40,
      left: 56,
      fontSize: 13,
      color: "rgba(255,255,255,0.5)"
    }
  }, "Prepared for Harborcrest Capital \xB7 July 2026"));
}

/* 2 · THESIS */
function SlideThesis() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...slideBase,
      background: "var(--surface-page)",
      display: "flex",
      alignItems: "center",
      padding: "0 110px"
    }
  }, /*#__PURE__*/React.createElement(Pattern, {
    variant: "meridian",
    fade: "right",
    color: "rgba(136,193,237,0.12)",
    style: {
      position: "absolute",
      inset: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(70% 100% at 0% 50%, rgba(70,134,183,0.32), transparent 55%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Eye, null, "The thesis"), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: "28px 0 0",
      fontSize: 46,
      fontWeight: 300,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      maxWidth: 940
    }
  }, "Isthmus is the narrow bridge between two great masses. Meridian is the line others navigate by. We are ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: "var(--accent-bright)"
    }
  }, "both"), " \u2014 the crossing point that becomes the reference standard.")), pageMark(), pageNo(2));
}

/* 3 · MARKET (bubble) */
function SlideMarket() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...slideBase,
      background: "var(--surface-page)",
      padding: "64px 56px"
    }
  }, /*#__PURE__*/React.createElement(Eye, null, "The opportunity"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 40,
      fontWeight: 300,
      letterSpacing: "-0.02em",
      margin: "16px 0 0"
    }
  }, "Frontier capital is ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "mispriced, not missing")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 40,
      marginTop: 30,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "flat",
    padding: 20
  }, /*#__PURE__*/React.createElement(BubbleChart, {
    height: 340,
    xLabel: "Market maturity",
    yLabel: "5-yr growth %",
    xMax: 100,
    yMax: 40,
    points: [{
      x: 22,
      y: 32,
      r: 60,
      label: "CIS"
    }, {
      x: 44,
      y: 26,
      r: 42,
      label: "Gulf"
    }, {
      x: 68,
      y: 18,
      r: 30,
      label: "SEA"
    }, {
      x: 34,
      y: 22,
      r: 34,
      label: "Africa"
    }, {
      x: 82,
      y: 12,
      r: 22,
      label: "EU"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "$1.2T",
    label: "Addressable frontier deal flow by 2030",
    size: "lg"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "19",
    label: "Markets under active coverage",
    size: "md",
    chrome: false
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15.5,
      color: "var(--text-secondary)",
      lineHeight: 1.6,
      margin: 0
    }
  }, "Western capital wants exposure; frontier GPs lack the infrastructure to be underwritten. We are the connective tissue."))), pageMark(), pageNo(3));
}

/* 4 · PRACTICE */
function SlidePractice() {
  const items = [{
    n: "01",
    t: "Financial modeling",
    d: "IC-grade three-statement, LBO/DCF, bespoke structures."
  }, {
    n: "02",
    t: "Diligence",
    d: "Commercial, financial and market — in days, not weeks."
  }, {
    n: "03",
    t: "Institutional decks",
    d: "IC memos, PPMs and raise-ready narratives."
  }, {
    n: "04",
    t: "AI platforms",
    d: "Data rooms turned into live decision engines."
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...slideBase,
      background: "var(--surface-page)",
      padding: "64px 56px"
    }
  }, /*#__PURE__*/React.createElement(Eye, null, "The practice"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 40,
      fontWeight: 300,
      letterSpacing: "-0.02em",
      margin: "16px 0 30px"
    }
  }, "One firm ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "across the deal")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 16
    }
  }, items.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.n,
    variant: "metal",
    padding: 24,
    style: {
      height: 300,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--accent-bright)",
      letterSpacing: "0.1em"
    }
  }, s.n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 22,
      fontWeight: 400,
      margin: "0 0 10px"
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14.5,
      color: "var(--text-secondary)",
      lineHeight: 1.55,
      margin: 0
    }
  }, s.d))))), pageMark(), pageNo(4));
}

/* 5 · TRACTION */
function SlideTraction() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...slideBase,
      background: "var(--surface-page)",
      padding: "64px 56px"
    }
  }, /*#__PURE__*/React.createElement(Eye, null, "Traction"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 40,
      fontWeight: 300,
      letterSpacing: "-0.02em",
      margin: "16px 0 0"
    }
  }, "Driven by ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "data")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr",
      gap: 36,
      marginTop: 28,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "flat",
    padding: 22
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      marginBottom: 12
    }
  }, "Financial efficiency index \xB7 TTM"), /*#__PURE__*/React.createElement(LineChart, {
    labels: ["Q1'24", "Q2", "Q3", "Q4", "Q1'25", "Q2", "Q3", "Q4"],
    series: [{
      name: "Portfolio",
      points: [42, 48, 52, 58, 63, 69, 74, 80]
    }, {
      name: "Benchmark",
      points: [40, 42, 44, 47, 50, 53, 57, 60],
      color: "var(--seq-4)"
    }],
    height: 260
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateRows: "repeat(3,1fr)",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "80%+",
    label: "Growth in financial efficiency",
    size: "lg"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "$3.4B",
    label: "Modeled & structured",
    size: "md",
    delta: "+12%"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "92%",
    label: "Client re-engagement",
    size: "md",
    chrome: false
  }))), pageMark(), pageNo(5));
}

/* 6 · VALUE BRIDGE (waterfall) */
function SlideBridge() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...slideBase,
      background: "var(--surface-page)",
      padding: "64px 56px"
    }
  }, /*#__PURE__*/React.createElement(Eye, null, "Value creation"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 40,
      fontWeight: 300,
      letterSpacing: "-0.02em",
      margin: "16px 0 6px"
    }
  }, "The EBITDA bridge, ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "engineered")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15.5,
      color: "var(--text-secondary)",
      maxWidth: 620,
      margin: "0 0 8px"
    }
  }, "How Project Meridian walks from entry to exit EBITDA across our value-creation levers."), /*#__PURE__*/React.createElement(Card, {
    variant: "flat",
    padding: 24,
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(Waterfall, {
    height: 330,
    format: usd,
    bars: [{
      label: "Entry",
      value: 120,
      type: "start"
    }, {
      label: "Volume",
      value: 38,
      type: "delta"
    }, {
      label: "Pricing",
      value: 22,
      type: "delta"
    }, {
      label: "Cost-out",
      value: -18,
      type: "delta"
    }, {
      label: "AI ops",
      value: 16,
      type: "delta"
    }, {
      label: "Exit",
      value: 178,
      type: "total"
    }]
  })), pageMark(), pageNo(6));
}

/* 7 · VALUATION (football field) */
function SlideValuation() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...slideBase,
      background: "var(--surface-page)",
      padding: "64px 56px"
    }
  }, /*#__PURE__*/React.createElement(Eye, null, "Valuation"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 40,
      fontWeight: 300,
      letterSpacing: "-0.02em",
      margin: "16px 0 0"
    }
  }, "A defensible ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "range")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.6fr 1fr",
      gap: 40,
      marginTop: 26,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "flat",
    padding: 24
  }, /*#__PURE__*/React.createElement(FootballField, {
    format: usd,
    reference: 255,
    referenceLabel: "Offer $255M",
    rows: [{
      label: "DCF",
      low: 180,
      high: 260,
      mid: 220
    }, {
      label: "Trading comps",
      low: 210,
      high: 300
    }, {
      label: "Transaction comps",
      low: 230,
      high: 330
    }, {
      label: "LBO",
      low: 170,
      high: 240
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "$230\u2013290M",
    label: "Convergent enterprise value",
    size: "md"
  }), /*#__PURE__*/React.createElement(DonutChart, {
    size: 150,
    thickness: 18,
    centerValue: "6.4\xD7",
    centerLabel: "EV / EBITDA",
    segments: [{
      label: "Debt",
      value: 45
    }, {
      label: "Equity",
      value: 40
    }, {
      label: "Mezz",
      value: 15
    }]
  }))), pageMark(), pageNo(7));
}

/* 8 · TEAM / DELIVERY */
function SlideTeam() {
  const people = [{
    id: "im-deck-p1",
    n: "Partner",
    r: "Structuring"
  }, {
    id: "im-deck-p2",
    n: "Partner",
    r: "Diligence"
  }, {
    id: "im-deck-p3",
    n: "Lead",
    r: "AI platforms"
  }, {
    id: "im-deck-p4",
    n: "Lead",
    r: "Narrative"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...slideBase,
      background: "var(--surface-page)",
      padding: "64px 56px"
    }
  }, /*#__PURE__*/React.createElement(Eye, null, "Delivery model"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 40,
      fontWeight: 300,
      letterSpacing: "-0.02em",
      margin: "16px 0 0"
    }
  }, "Dubai desk. ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "India engine.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 16,
      marginTop: 28
    }
  }, people.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id
  }, /*#__PURE__*/React.createElement(MediaFrame, {
    ratio: "4 / 5",
    bloom: "corner"
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: p.id,
    shape: "rect",
    placeholder: "Portrait"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500,
      marginTop: 12
    }
  }, p.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, p.r)))), pageMark(), pageNo(8));
}

/* 9 · CLOSING */
function SlideClosing() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...slideBase,
      background: "#000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(80% 90% at 50% 120%, #88C1ED 0%, #2f5f85 28%, #0b1420 58%, #000 100%)",
      opacity: 0.85
    }
  }), /*#__PURE__*/React.createElement(Pattern, {
    variant: "rings",
    color: "rgba(255,255,255,0.06)",
    style: {
      position: "absolute",
      inset: 0
    },
    fade: "radial"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(LogoMark, {
    size: 54,
    color: "#fff",
    style: {
      margin: "0 auto"
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 62,
      fontWeight: 300,
      letterSpacing: "-0.025em",
      lineHeight: 1.04,
      margin: "26px 0 0"
    }
  }, "Become the", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "reference standard.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 44,
      justifyContent: "center",
      marginTop: 40,
      fontSize: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.5)",
      marginBottom: 6
    }
  }, "Mandates"), /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 500
    }
  }, "partners@isthmusmeridian.com")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.5)",
      marginBottom: 6
    }
  }, "Delivery"), /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 500
    }
  }, "Dubai \xB7 Bengaluru")))));
}
window.IM_DECK_SLIDES = [SlideCover, SlideThesis, SlideMarket, SlidePractice, SlideTraction, SlideBridge, SlideValuation, SlideTeam, SlideClosing];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/deck/Slides.jsx", error: String((e && e.message) || e) }); }

// ui_kits/platform/App.jsx
try { (() => {
/* Isthmus Meridian Platform — composition */
function PlatformApp() {
  const [view, setView] = React.useState("overview");
  const titles = {
    overview: {
      crumb: "Workspace",
      title: "Overview"
    },
    mandates: {
      crumb: "Workspace",
      title: "Mandates"
    },
    models: {
      crumb: "Workspace",
      title: "Models"
    },
    engine: {
      crumb: "Workspace",
      title: "AI Engine"
    },
    documents: {
      crumb: "Workspace",
      title: "Data room"
    }
  };
  const t = titles[view] || titles.overview;
  const Body = view === "mandates" ? window.IMMandates : window.IMOverview;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: "100vh",
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement(window.IMSidebar, {
    active: view,
    onNav: setView
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(window.IMTopbar, {
    title: t.title,
    crumb: t.crumb
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflowY: "auto"
    }
  }, view === "overview" || view === "mandates" ? /*#__PURE__*/React.createElement(Body, null) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      flexDirection: "column",
      gap: 12,
      color: "var(--text-muted)",
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement(window.IMIcon, {
    d: window.IMicons.model,
    s: 30
  }), /*#__PURE__*/React.createElement("span", null, t.title, " \u2014 connect a mandate to begin.")))));
}
Object.assign(window, {
  IMPlatformApp: PlatformApp
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/platform/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/platform/Shell.jsx
try { (() => {
/* Isthmus Meridian Platform — app shell (sidebar + topbar) */
const {
  Logo,
  LogoMark,
  Badge,
  IconButton,
  Input
} = window.IsthmusMeridianDesignSystem_d76f86;
const Icon = ({
  d,
  s = 18,
  fill = "none"
}) => /*#__PURE__*/React.createElement("svg", {
  width: s,
  height: s,
  viewBox: "0 0 24 24",
  fill: fill,
  stroke: "currentColor",
  strokeWidth: "1.7",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, d);
const icons = {
  grid: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "7",
    height: "7"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "3",
    width: "7",
    height: "7"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "14",
    width: "7",
    height: "7"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "14",
    width: "7",
    height: "7"
  })),
  deals: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 7h18M3 12h18M3 17h12"
  })),
  model: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 3v18h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 14l3-4 3 3 5-7"
  })),
  ai: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M18.4 5.6l-2 2M7.6 16.4l-2 2"
  })),
  docs: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 3v5h5"
  })),
  bell: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.7 21a2 2 0 0 1-3.4 0"
  })),
  search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  }))
};
const navItems = [{
  id: "overview",
  label: "Overview",
  icon: icons.grid
}, {
  id: "mandates",
  label: "Mandates",
  icon: icons.deals
}, {
  id: "models",
  label: "Models",
  icon: icons.model
}, {
  id: "engine",
  label: "AI Engine",
  icon: icons.ai
}, {
  id: "documents",
  label: "Data room",
  icon: icons.docs
}];
function Sidebar({
  active,
  onNav
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 236,
      flex: "none",
      background: "var(--surface-sunken)",
      boxShadow: "12px 0 32px -18px rgba(0,0,0,0.8)",
      display: "flex",
      flexDirection: "column",
      padding: "22px 16px",
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 8px 22px"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    layout: "horizontal",
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 3
    }
  }, navItems.map(n => {
    const on = active === n.id;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => onNav(n.id),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: "var(--radius-md)",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        background: on ? "rgba(70,134,183,0.16)" : "transparent",
        color: on ? "var(--text-strong)" : "var(--text-secondary)",
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: on ? 500 : 400,
        transition: "background .18s var(--ease-out), color .18s var(--ease-out)"
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = "transparent";
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        color: on ? "var(--accent-bright)" : "var(--text-muted)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      d: n.icon
    })), n.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      padding: 14,
      borderRadius: "var(--radius-lg)",
      background: "var(--grad-glow)",
      boxShadow: "var(--glow-soft), var(--sheen-top)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 500,
      color: "#fff"
    }
  }, "AI Engine \xB7 Pro"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "rgba(255,255,255,0.7)",
      marginTop: 3
    }
  }, "412 / 500 model-hours"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      borderRadius: 4,
      background: "rgba(255,255,255,0.2)",
      marginTop: 10,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "82%",
      height: "100%",
      background: "#fff"
    }
  }))));
}
function Topbar({
  title,
  crumb
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 62,
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      boxShadow: "var(--shadow-md)",
      background: "rgba(5,7,10,0.7)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, crumb), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 18,
      fontWeight: 500,
      color: "var(--text-strong)"
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 240
    }
  }, /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    placeholder: "Search mandates, models\u2026",
    prefix: /*#__PURE__*/React.createElement(Icon, {
      d: icons.search,
      s: 15
    })
  })), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    label: "Notifications"
  }, /*#__PURE__*/React.createElement(Icon, {
    d: icons.bell
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: "var(--grad-sky)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--im-ink-900)"
    }
  }, "AM")));
}
Object.assign(window, {
  IMSidebar: Sidebar,
  IMTopbar: Topbar,
  IMIcon: Icon,
  IMicons: icons
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/platform/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/platform/Views.jsx
try { (() => {
/* Isthmus Meridian Platform — views: Overview, Mandates */
const {
  Card,
  Stat,
  Badge,
  Button,
  Divider,
  GlowTile
} = window.IsthmusMeridianDesignSystem_d76f86;
const Ic = window.IMIcon,
  ic = window.IMicons;

/* ---- simple area chart (data viz, inline SVG) ---- */
function AreaChart({
  data,
  height = 128
}) {
  const w = 520,
    h = height,
    pad = 6;
  const max = Math.max(...data),
    min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = pad + i * (w - pad * 2) / (data.length - 1);
    const y = pad + (1 - (v - min) / (max - min || 1)) * (h - pad * 2);
    return [x, y];
  });
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L${w - pad} ${h} L${pad} ${h} Z`;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${h}`,
    width: "100%",
    height: h,
    preserveAspectRatio: "none",
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "imArea",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#4686B7",
    stopOpacity: "0.42"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#4686B7",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: "url(#imArea)"
  }), /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: "#88C1ED",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), pts.length && /*#__PURE__*/React.createElement("circle", {
    cx: pts[pts.length - 1][0],
    cy: pts[pts.length - 1][1],
    r: "3.5",
    fill: "#fff"
  }));
}
const mandates = [{
  name: "Project Meridian — Sr. facility",
  client: "Harborcrest Capital",
  stage: "Modeling",
  tone: "steel",
  val: "$240M",
  prog: 68
}, {
  name: "Caspian growth round",
  client: "Astra Frontier",
  stage: "Diligence",
  tone: "accent",
  val: "$85M",
  prog: 41
}, {
  name: "Gulf logistics roll-up",
  client: "Meridian Partners",
  stage: "IC deck",
  tone: "warning",
  val: "$1.2B",
  prog: 88
}, {
  name: "Fintech carve-out",
  client: "Northwind PE",
  stage: "Closed",
  tone: "positive",
  val: "$310M",
  prog: 100
}, {
  name: "Sovereign co-invest",
  client: "ADQ desk",
  stage: "Modeling",
  tone: "steel",
  val: "$540M",
  prog: 22
}];
function Overview() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 16
    }
  }, [{
    v: "$3.4B",
    l: "Active mandate value",
    d: "+12%"
  }, {
    v: "14",
    l: "Live mandates",
    d: "+3"
  }, {
    v: "48h",
    l: "Median turnaround",
    d: null
  }, {
    v: "92%",
    l: "Model confidence",
    d: "+1.4%"
  }].map((s, i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    variant: "flat",
    padding: 20
  }, /*#__PURE__*/React.createElement(Stat, {
    value: s.v,
    label: s.l,
    size: "md",
    delta: s.d
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.6fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "flat",
    padding: 22
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      fontWeight: 500,
      color: "var(--text-strong)"
    }
  }, "Financial efficiency index"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--text-muted)",
      marginTop: 2
    }
  }, "Trailing 12 months \xB7 portfolio-weighted")), /*#__PURE__*/React.createElement(Badge, {
    tone: "positive",
    dot: true
  }, "+18.4%")), /*#__PURE__*/React.createElement(AreaChart, {
    data: [42, 44, 41, 48, 52, 49, 58, 62, 60, 68, 74, 80]
  })), /*#__PURE__*/React.createElement(GlowTile, {
    glow: "corner",
    minHeight: 0,
    padding: 22,
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.8)"
    }
  }, "AI Engine"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Stat, {
    value: "124M+",
    label: "Data points reconciled this month",
    size: "lg"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: "rgba(255,255,255,0.72)",
      marginTop: 14,
      lineHeight: 1.5
    }
  }, "3 models re-run overnight \xB7 2 anomalies flagged for review.")))), /*#__PURE__*/React.createElement(MandatesTable, {
    compact: true
  }));
}
function MandatesTable({
  compact
}) {
  const rows = compact ? mandates.slice(0, 5) : mandates;
  return /*#__PURE__*/React.createElement(Card, {
    variant: "flat",
    padding: 0,
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "18px 22px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      fontWeight: 500,
      color: "var(--text-strong)"
    }
  }, "Mandate pipeline"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "View all")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "2.4fr 1.4fr 1fr 1fr 1.4fr",
      padding: "6px 22px 10px",
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Mandate"), /*#__PURE__*/React.createElement("span", null, "Client"), /*#__PURE__*/React.createElement("span", null, "Stage"), /*#__PURE__*/React.createElement("span", null, "Value"), /*#__PURE__*/React.createElement("span", null, "Progress")), rows.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "grid",
      gridTemplateColumns: "2.4fr 1.4fr 1fr 1fr 1.4fr",
      alignItems: "center",
      padding: "15px 22px",
      background: i % 2 ? "rgba(255,255,255,0.022)" : "transparent",
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--text-strong)",
      fontWeight: 500
    }
  }, m.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: "var(--text-secondary)"
    }
  }, m.client), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Badge, {
    tone: m.tone
  }, m.stage)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--text-body)"
    }
  }, m.val), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 4,
      borderRadius: 4,
      background: "var(--im-ink-600)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      width: m.prog + "%",
      height: "100%",
      background: m.prog === 100 ? "var(--im-positive)" : "var(--grad-sky)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)",
      width: 30,
      textAlign: "right"
    }
  }, m.prog, "%")))));
}
function Mandates() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12
    }
  }, ["All", "Modeling", "Diligence", "IC deck", "Closed"].map((f, i) => /*#__PURE__*/React.createElement(Badge, {
    key: f,
    tone: i === 0 ? "accent" : "neutral"
  }, f))), /*#__PURE__*/React.createElement(MandatesTable, null));
}
Object.assign(window, {
  IMOverview: Overview,
  IMMandates: Mandates
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/platform/Views.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Nav.jsx
try { (() => {
/* Isthmus Meridian — marketing site chrome: Nav + Footer */
const {
  Logo,
  LogoMark,
  Button,
  Divider
} = window.IsthmusMeridianDesignSystem_d76f86;
const navLinks = ["Practice", "Approach", "Platforms", "Insights"];
function Nav({
  onRequest
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.querySelector("[data-site-scroll]");
    const onScroll = () => setScrolled((el ? el.scrollTop : window.scrollY) > 12);
    const t = el || window;
    t.addEventListener("scroll", onScroll);
    return () => t.removeEventListener("scroll", onScroll);
  }, []);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 48px",
      background: scrolled ? "var(--glass-tint)" : "transparent",
      backdropFilter: scrolled ? "var(--blur-glass)" : "none",
      WebkitBackdropFilter: scrolled ? "var(--blur-glass)" : "none",
      boxShadow: scrolled ? "var(--shadow-md)" : "none",
      transition: "background .4s var(--ease-out), box-shadow .4s var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    layout: "horizontal",
    size: 34
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 38
    }
  }, navLinks.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13.5,
      fontWeight: 400,
      color: "var(--text-secondary)",
      textDecoration: "none",
      letterSpacing: "0.01em"
    },
    onMouseEnter: e => e.currentTarget.style.color = "var(--text-strong)",
    onMouseLeave: e => e.currentTarget.style.color = "var(--text-secondary)"
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Client login"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: onRequest
  }, "Request access")));
}
const footCols = [{
  h: "Practice",
  items: ["Financial modeling", "Diligence", "Institutional decks", "AI platforms"]
}, {
  h: "Firm",
  items: ["Thesis", "Delivery model", "Dubai · India", "Careers"]
}, {
  h: "Contact",
  items: ["New mandates", "Partnerships", "Press", "hello@isthmusmeridian.com"]
}];
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      padding: "64px 48px 40px",
      background: "var(--surface-sunken)",
      boxShadow: "inset 0 34px 60px -46px rgba(0,0,0,0.9)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
      gap: 40,
      maxWidth: 1216,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    layout: "stacked",
    size: 36,
    style: {
      alignItems: "flex-start"
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      lineHeight: 1.6,
      color: "var(--text-muted)",
      maxWidth: 280,
      marginTop: 20
    }
  }, "The reference standard for financial engineering \u2014 the bridge between Western capital and frontier opportunity.")), footCols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      marginBottom: 16
    }
  }, c.h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 11
    }
  }, c.items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13.5,
      color: "var(--text-secondary)",
      textDecoration: "none"
    }
  }, i)))))), /*#__PURE__*/React.createElement(Divider, {
    style: {
      maxWidth: 1216,
      margin: "40px auto 0"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      maxWidth: 1216,
      margin: "20px auto 0",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--text-faint)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Isthmus Meridian FZ-LLC \xB7 Dubai free zone"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: "inherit",
      textDecoration: "none"
    }
  }, "Terms"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: "inherit",
      textDecoration: "none"
    }
  }, "Privacy"))));
}
Object.assign(window, {
  IMNav: Nav,
  IMFooter: Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Sections.jsx
try { (() => {
/* Isthmus Meridian — marketing site sections */
const {
  Button,
  Card,
  Stat,
  GlowTile,
  Eyebrow,
  Badge,
  Divider
} = window.IsthmusMeridianDesignSystem_d76f86;
const Arrow = ({
  s = 16
}) => /*#__PURE__*/React.createElement("svg", {
  width: s,
  height: s,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("line", {
  x1: "5",
  y1: "12",
  x2: "19",
  y2: "12"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "12 5 19 12 12 19"
}));
const container = {
  maxWidth: 1216,
  margin: "0 auto",
  width: "100%",
  boxSizing: "border-box",
  paddingLeft: 48,
  paddingRight: 48
};

/* ---------------- HERO ---------------- */
function Hero({
  onRequest
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden",
      padding: "96px 0 104px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(80% 90% at 78% 26%, rgba(70,134,183,0.32), transparent 60%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...container,
      position: "relative",
      display: "grid",
      gridTemplateColumns: "repeat(12, 1fr)",
      columnGap: 24,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / 7"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "AI-first financial engineering"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 72,
      fontWeight: 300,
      lineHeight: 1.0,
      letterSpacing: "-0.03em",
      color: "var(--text-strong)",
      margin: "24px 0 0"
    }
  }, "The bridge to", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "fundable.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 18,
      lineHeight: 1.6,
      color: "var(--text-secondary)",
      maxWidth: 460,
      margin: "28px 0 0"
    }
  }, "We connect Western capital to CIS, Gulf and frontier opportunity \u2014 and turn a fund into the infrastructure that makes it fundable. Modeling, diligence, decks and AI platforms, delivered as one."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "bright",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Arrow, null),
    onClick: onRequest
  }, "Request access"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg"
  }, "See the practice")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 20,
      marginTop: 44,
      color: "var(--text-muted)",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      letterSpacing: "0.01em"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Dubai free zone HQ"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 3,
      borderRadius: 9,
      background: "var(--text-faint)"
    }
  }), /*#__PURE__*/React.createElement("span", null, "India delivery"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 3,
      borderRadius: 9,
      background: "var(--text-faint)"
    }
  }), /*#__PURE__*/React.createElement("span", null, "Unregulated. Unbounded."))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "8 / 13"
    }
  }, /*#__PURE__*/React.createElement(GlowTile, {
    glow: "corner",
    minHeight: 360,
    padding: 34,
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    dot: true
  }, "Live mandate desk"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Stat, {
    value: "80%+",
    label: "Growth in financial efficiency for our clients",
    size: "xl"
  }), /*#__PURE__*/React.createElement(Divider, {
    glow: true,
    style: {
      margin: "24px 0"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 36
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "48h",
    label: "Median deck turnaround",
    size: "sm",
    chrome: false
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "19",
    label: "Frontier markets",
    size: "sm",
    chrome: false
  })))))));
}

/* ---------------- TRUST STRIP ---------------- */
function TrustStrip() {
  const items = ["Sovereign funds", "Family offices", "Growth equity", "Private credit", "Frontier GPs"];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "24px 0",
      background: "var(--glass-tint)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...container,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      whiteSpace: "nowrap"
    }
  }, "Trusted across the capital stack"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 40,
      opacity: 0.72
    }
  }, items.map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      fontWeight: 400,
      color: "var(--text-secondary)"
    }
  }, i)))));
}

/* ---------------- SERVICES ---------------- */
const services = [{
  t: "Financial modeling",
  d: "Institutional three-statement models, LBO/DCF, and bespoke structures your IC can defend line by line.",
  tag: "Modeling"
}, {
  t: "Diligence",
  d: "Buy- and sell-side diligence — commercial, financial, and market — compressed into days, not weeks.",
  tag: "Diligence"
}, {
  t: "Institutional decks",
  d: "IC memos, PPMs and raise-ready decks engineered to move capital, not just to look the part.",
  tag: "Narrative"
}, {
  t: "AI platforms",
  d: "We build the AI infrastructure that turns your data room into a live, queryable decision engine.",
  tag: "Platforms"
}];
function Services() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "104px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: container
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(12,1fr)",
      columnGap: 24,
      alignItems: "end",
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / 8"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "The practice"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 46,
      fontWeight: 300,
      letterSpacing: "-0.03em",
      color: "var(--text-strong)",
      margin: "18px 0 0"
    }
  }, "One firm across the deal")), /*#__PURE__*/React.createElement("p", {
    style: {
      gridColumn: "9 / 13",
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      color: "var(--text-secondary)",
      lineHeight: 1.65,
      margin: 0
    }
  }, "A single back-office, from first model to signed term sheet \u2014 with AI in the loop at every step.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(2,1fr)",
      gap: 16
    }
  }, services.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.t,
    variant: "metal",
    interactive: true,
    padding: 30,
    style: {
      minHeight: 184,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 23,
      fontWeight: 400,
      letterSpacing: "-0.01em",
      color: "var(--text-strong)",
      margin: 0
    }
  }, s.t), /*#__PURE__*/React.createElement(Badge, {
    tone: "steel"
  }, s.tag)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      lineHeight: 1.62,
      color: "var(--text-secondary)",
      margin: 0
    }
  }, s.d), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      color: "var(--accent-bright)",
      textDecoration: "none"
    }
  }, "Explore ", /*#__PURE__*/React.createElement(Arrow, {
    s: 14
  })))))));
}

/* ---------------- METRICS BAND ---------------- */
function Metrics() {
  const stats = [{
    v: "$3.4B",
    l: "Modeled & structured"
  }, {
    v: "124M+",
    l: "Data points / month"
  }, {
    v: "40+",
    l: "Mandates delivered"
  }, {
    v: "92%",
    l: "Re-engagement rate"
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "72px 0",
      background: "var(--grad-ink)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...container,
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      columnGap: 24
    }
  }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.l
  }, /*#__PURE__*/React.createElement(Stat, {
    value: s.v,
    label: s.l,
    size: "lg"
  })))));
}

/* ---------------- APPROACH ---------------- */
const steps = [{
  n: "01",
  t: "Connect",
  d: "We map the capital and the opportunity, then build the bridge between them — the isthmus."
}, {
  n: "02",
  t: "Engineer",
  d: "Models, diligence and narrative are engineered together, AI-accelerated, IC-grade."
}, {
  n: "03",
  t: "Reference",
  d: "You become the fixed point capital navigates by — the meridian others measure against."
}];
function Approach() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "104px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...container
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tick: false
  }, "Isthmus \u2192 Meridian"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 44,
      fontWeight: 300,
      letterSpacing: "-0.03em",
      color: "var(--text-strong)",
      margin: "16px 0 0"
    }
  }, "From crossing point to ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "reference standard"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      columnGap: 24
    }
  }, steps.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: "var(--accent-bright)",
      letterSpacing: "0.12em"
    }
  }, s.n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 25,
      fontWeight: 400,
      letterSpacing: "-0.01em",
      color: "var(--text-strong)",
      margin: "14px 0 12px"
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      lineHeight: 1.68,
      color: "var(--text-secondary)",
      margin: 0,
      maxWidth: 320
    }
  }, s.d))))));
}

/* ---------------- CTA ---------------- */
function CTA({
  onRequest
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "48px 0 104px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: container
  }, /*#__PURE__*/React.createElement(GlowTile, {
    glow: "center",
    mark: false,
    minHeight: 320,
    padding: 0,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "72px 24px",
      maxWidth: 620
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "46",
    height: "46",
    viewBox: "0 0 120 120",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      margin: "0 auto 26px"
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "38,36 52,60 38,84"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "82,36 68,60 82,84"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "60",
    y1: "26",
    x2: "60",
    y2: "94"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 46,
      fontWeight: 300,
      letterSpacing: "-0.03em",
      color: "#fff",
      margin: 0,
      lineHeight: 1.06
    }
  }, "Become the reference", /*#__PURE__*/React.createElement("br", null), "standard."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      color: "rgba(255,255,255,0.72)",
      margin: "20px auto 32px",
      maxWidth: 440,
      lineHeight: 1.55
    }
  }, "A limited number of new mandates each quarter. Tell us what you're raising."), /*#__PURE__*/React.createElement(Button, {
    variant: "bright",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Arrow, null),
    onClick: onRequest
  }, "Request access")))));
}
Object.assign(window, {
  IMHero: Hero,
  IMTrustStrip: TrustStrip,
  IMServices: Services,
  IMMetrics: Metrics,
  IMApproach: Approach,
  IMCTA: CTA
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Site.jsx
try { (() => {
/* Isthmus Meridian — marketing site composition + Request-access modal */
const {
  Button,
  Input,
  Select,
  Logo
} = window.IsthmusMeridianDesignSystem_d76f86;
function RequestModal({
  open,
  onClose
}) {
  const [sent, setSent] = React.useState(false);
  React.useEffect(() => {
    if (!open) setSent(false);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      background: "rgba(0,0,0,0.66)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      animation: "imFade .24s ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 460,
      maxWidth: "100%",
      background: "var(--surface-raised)",
      borderRadius: "var(--radius-xl)",
      padding: 32,
      boxShadow: "var(--shadow-pop), var(--sheen-top)"
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "18px 0"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 120 120",
    fill: "none",
    stroke: "var(--accent-bright)",
    strokeWidth: "7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      margin: "0 auto 20px"
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "38,36 52,60 38,84"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "82,36 68,60 82,84"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "60",
    y1: "26",
    x2: "60",
    y2: "94"
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 24,
      fontWeight: 500,
      color: "var(--text-strong)",
      margin: "0 0 8px"
    }
  }, "Request received"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      color: "var(--text-secondary)",
      margin: "0 0 24px"
    }
  }, "A partner will be in touch within one business day."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onClose
  }, "Close")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 24,
      fontWeight: 500,
      color: "var(--text-strong)",
      margin: "0 0 6px"
    }
  }, "Request access"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      color: "var(--text-muted)",
      margin: 0
    }
  }, "Tell us what you're raising.")), /*#__PURE__*/React.createElement(Logo, {
    layout: "mark",
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Work email",
    placeholder: "you@fund.com"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Fund / firm",
    placeholder: "Harborcrest Capital"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Mandate",
    options: [{
      value: "fm",
      label: "Financial modeling"
    }, {
      value: "dd",
      label: "Diligence"
    }, {
      value: "deck",
      label: "Institutional deck"
    }, {
      value: "ai",
      label: "AI platform"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    fullWidth: true,
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    variant: "bright",
    fullWidth: true,
    onClick: () => setSent(true)
  }, "Submit request"))))));
}
function Site() {
  const [modal, setModal] = React.useState(false);
  const open = () => setModal(true);
  return /*#__PURE__*/React.createElement("div", {
    "data-site-scroll": true,
    style: {
      height: "100vh",
      overflowY: "auto",
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement(window.IMNav, {
    onRequest: open
  }), /*#__PURE__*/React.createElement(window.IMHero, {
    onRequest: open
  }), /*#__PURE__*/React.createElement(window.IMTrustStrip, null), /*#__PURE__*/React.createElement(window.IMServices, null), /*#__PURE__*/React.createElement(window.IMMetrics, null), /*#__PURE__*/React.createElement(window.IMApproach, null), /*#__PURE__*/React.createElement(window.IMCTA, {
    onRequest: open
  }), /*#__PURE__*/React.createElement(window.IMFooter, null), /*#__PURE__*/React.createElement(RequestModal, {
    open: modal,
    onClose: () => setModal(false)
  }));
}
Object.assign(window, {
  IMSite: Site
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Site.jsx", error: String((e && e.message) || e) }); }

__ds_ns.LogoMark = __ds_scope.LogoMark;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.BarChart = __ds_scope.BarChart;

__ds_ns.BubbleChart = __ds_scope.BubbleChart;

__ds_ns.DonutChart = __ds_scope.DonutChart;

__ds_ns.FootballField = __ds_scope.FootballField;

__ds_ns.LineChart = __ds_scope.LineChart;

__ds_ns.Sparkline = __ds_scope.Sparkline;

__ds_ns.Waterfall = __ds_scope.Waterfall;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.GlowTile = __ds_scope.GlowTile;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.MediaFrame = __ds_scope.MediaFrame;

__ds_ns.Pattern = __ds_scope.Pattern;

})();
