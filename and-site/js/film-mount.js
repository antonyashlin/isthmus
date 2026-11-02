/*
 * Mounts the code films into the page. Each film renders only while on screen.
 * Without WebGL, or with reduced motion, the posters stay.
 */
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canGL = (() => {
  try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; }
})();

const POSTERS = { health: "assets/focus-health.jpg", assets: "assets/focus-assets.jpg", energy: "assets/focus-energy.jpg" };
const focusPoster = document.querySelector("[data-focus-media] .film-poster");
let focusFilms = null;

// The focus list asks for a sector; the film fades through black to it.
addEventListener("focus:show", (e) => {
  if (focusFilms) focusFilms.show(e.detail);
  else if (focusPoster && POSTERS[e.detail]) focusPoster.src = POSTERS[e.detail];
});

function ready() { window.__filmReady = true; dispatchEvent(new Event("film:ready")); }

if (reduced || !canGL) {
  ready();
} else {
  import("./films.js?v=4").then(({ createFilms }) => {
    const dpr = Math.min(devicePixelRatio || 1, innerWidth < 900 ? 1.25 : 1.75);
    const mount = (canvas, opts) => {
      const films = createFilms(canvas, { dpr, ...opts });
      new IntersectionObserver(([e]) => (e.isIntersecting ? films.play() : films.pause()), { rootMargin: "10% 0px" }).observe(canvas);
      // Show the canvas once it has drawn.
      requestAnimationFrame(() => requestAnimationFrame(() => canvas.classList.add("is-live")));
      return films;
    };
    const heroCanvas = document.querySelector(".hero-media .film");
    if (heroCanvas) {
      const h = mount(heroCanvas, { names: ["hero"], start: "hero" });
      h.play();
    }
    const focusCanvas = document.querySelector("[data-focus-media] .film");
    if (focusCanvas) focusFilms = mount(focusCanvas, { names: ["health", "assets", "energy"], start: "health" });
    requestAnimationFrame(() => requestAnimationFrame(ready));
  }).catch(ready);
}
