// Motion (Framer) entrance choreography for the Isthmus Meridian site.
// Bundled to website/motion.js via esbuild. Vanilla Motion API — no React.
// Craft: ease-out entrances (~0.6s), small y-rise, tight stagger; spring "pops"
// only where a gesture-like momentum reads (the waypoint dots); line draws for the
// journey/flow meridians; count-up for numeric metrics. Reduced-motion => no transforms.
import { animate, inView, stagger } from "motion";

const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const EASE = [0.22, 1, 0.36, 1]; // easeOutExpo-ish: quick start, soft settle

// Staggered rise+fade of a section's editorial elements as it enters its bound.
function reveal(section) {
  const items = section.querySelectorAll(".reveal");
  if (!items.length) return;
  if (REDUCE) {
    items.forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
    return;
  }
  animate(
    items,
    { opacity: [0, 1], y: [24, 0] },
    { duration: 0.6, delay: stagger(0.07), ease: EASE }
  );
}

// Draw the meridian track left->right, then pop each waypoint dot in with a spring.
function tracks(section) {
  const track = section.querySelector(".journey-track, .flow-track");
  const dots = section.querySelectorAll(".jdot, .fdot");
  if (REDUCE) {
    if (track) track.style.transform = "scaleX(1)";
    dots.forEach((d) => (d.style.transform = "none"));
    return;
  }
  if (track) {
    track.style.transformOrigin = "left center";
    animate(track, { scaleX: [0, 1] }, { duration: 0.85, ease: EASE, delay: 0.2 });
  }
  if (dots.length) {
    animate(
      dots,
      { scale: [0, 1] },
      { type: "spring", bounce: 0.5, visualDuration: 0.5, delay: (i) => 0.4 + i * 0.11 }
    );
  }
}

// Bklit-style funnel: build each stage segment in with a staggered spring grow.
function funnel(section) {
  const f = section.querySelector(".funnel");
  if (!f) return;
  if (REDUCE) {
    f.style.opacity = "1";
    return;
  }
  // Fade the HTML container (inline style wins over the stylesheet) and stagger
  // each stage's scale — SVG <g> takes the transform inline, so the build reads.
  animate(f, { opacity: [0, 1] }, { duration: 0.5, ease: EASE });
  animate(
    f.querySelectorAll(".fn-seg"),
    { scale: [0.8, 1] },
    { duration: 0.6, ease: EASE, delay: (i) => 0.1 + i * 0.13 }
  );
}

// Count numeric metrics up from zero (e.g. "58%").
function counts(section) {
  if (REDUCE) return;
  section.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    animate(0, target, {
      duration: 1.0,
      ease: EASE,
      delay: 0.3,
      onUpdate: (v) => { el.textContent = Math.round(v) + suffix; },
    });
  });
}

// Fire each section's choreography once, when it first enters its bound.
const seen = new WeakSet();
document.querySelectorAll(".hero, main > section").forEach((section) => {
  inView(
    section,
    () => {
      if (seen.has(section)) return;
      seen.add(section);
      reveal(section);
      tracks(section);
      funnel(section);
      counts(section);
    },
    { amount: 0.2 }
  );
});
