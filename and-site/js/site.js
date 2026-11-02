/* AND Capital — behaviour. Opening, text rise, scroll choreography. */
(function () {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ------------------------------------------------------------------
   * The wordmark, path data taken verbatim from andcapitalventures.com/logo.svg
   * (tagline omitted). Glyph order: A N D C a p i t a l.
   * ------------------------------------------------------------------ */
  const AND_PATHS = [
    "M24.0635 25.0596H19.508L17.9827 20.6462L10.5632 20.6553L9.05718 25.0596H4.60889L12.1635 5.07972L16.4832 5.05176L16.6632 5.13995L24.064 25.059L24.0635 25.0596ZM16.8819 17.3159L14.3099 10.0024L11.7369 17.3159H16.8819Z",
    "M38.5343 18.4986V5.13535L38.6147 5.05469H42.5806L42.661 5.13535V25.0593H38.2931L30.0573 11.8127L29.9057 11.7229V25.0593H25.8325V5.05469H30.1468L38.5343 18.4986Z",
    "M46.5195 25.0594V5.0548C49.2903 5.12686 52.0869 4.95962 54.8561 5.05211C60.7734 5.25054 63.8942 8.52334 64.0962 14.4408C64.2838 19.9233 61.8613 24.5566 55.9783 25.0588H46.5195V25.0594ZM50.8606 21.3489H55.4965C55.6353 21.3489 56.1563 21.2074 56.3272 21.1606C59.6533 20.2416 60.1024 16.1837 59.5798 13.2728C59.0514 10.3324 57.3214 8.92773 54.371 8.76586C53.4969 8.718 51.88 8.66423 51.0461 8.76264C50.9678 8.77178 50.9083 8.76909 50.8612 8.84599V21.3489H50.8606Z",
  ];
  const CAPITAL_PATHS = [
    "M92.4494 11.8304H88.2154C87.731 9.05988 84.8771 7.79453 82.2976 8.50061C78.7856 9.46212 78.0573 13.8879 78.5846 17.0042C79.1056 20.0839 81.1609 22.0806 84.3835 21.8322C86.7866 21.6472 88.1468 19.6225 88.3768 17.3693H92.6107C92.3572 21.6402 89.4293 25.0119 85.1333 25.4884C79.5043 26.1127 74.9579 22.7022 74.1819 17.0655C73.1941 9.89232 77.6387 3.77533 85.2346 4.68468C89.0397 5.14016 92.0956 7.93166 92.4499 11.8299L92.4494 11.8304Z",
    "M108.635 25.0593H104.642C104.423 24.6791 104.426 24.2134 104.345 23.7966C104.332 23.7294 104.385 23.6993 104.267 23.7154C103.314 24.7307 101.877 25.2765 100.508 25.4287C97.0993 25.8078 94.2551 24.2419 94.6002 20.4684C94.932 16.8402 98.9429 16.8655 101.632 16.4465C103.074 16.2218 104.716 15.9421 104.042 13.9928C103.594 12.6978 101.262 12.6688 100.222 13.0952C99.3963 13.4329 99.0394 14.1971 98.9885 15.0575H95.0225C95.2358 10.4204 100.589 9.77243 104.197 10.3962C106.592 10.8103 108.029 11.8842 108.155 14.4369C108.294 17.2413 107.988 20.1974 108.15 22.9921C108.189 23.6697 108.329 24.4527 108.635 25.0603V25.0593ZM104.186 18.0152C104.023 18.0641 103.926 18.1819 103.757 18.2561C101.962 19.045 98.0399 18.297 98.5828 21.4595C98.8615 23.083 101.548 22.9964 102.679 22.4447C104.348 21.6305 104.196 19.5983 104.186 18.0152Z",
    "M115.173 23.2846V30.1679H111.208V10.5935H114.959V12.4219C115.083 12.4515 115.047 12.3988 115.082 12.3541C116.072 11.0705 117.051 10.3386 118.738 10.2182C122.371 9.95788 124.94 12.1509 125.653 15.6468C126.637 20.4802 124.515 25.8863 118.845 25.4351C117.344 25.3157 116.056 24.466 115.173 23.2851L115.173 23.2846ZM117.841 13.2436C114.135 13.6883 114.06 21.4804 117.487 22.3349C119.847 22.9237 121.413 21.6079 121.805 19.3175C122.29 16.4755 121.431 12.8123 117.841 13.2436Z",
    "M132.323 10.5938H128.357V25.0594H132.323V10.5938Z M128.357 8.38878V5.05469H132.243L132.323 5.13535V8.30812L132.243 8.38878H128.357Z",
    "M140.47 10.5941H143.364V13.2829H140.47V20.9459C140.47 21.0358 140.617 21.5036 140.673 21.6025C141.056 22.2828 142.698 22.1258 143.364 21.9946V25.1136C141.945 25.2286 140.364 25.3642 138.969 25.0334C137.573 24.7027 136.504 23.731 136.504 22.2366V13.2829H134.173L134.092 13.2022V10.5941H136.504V6.23828H140.39L140.47 6.31894V10.5941Z",
    "M158.692 25.0596H154.672L154.378 23.7152C153.358 24.7413 151.941 25.2903 150.512 25.429C147.313 25.7388 144.375 24.3078 144.651 20.6774C145.007 15.979 150.404 17.1997 153.321 16.0941C154.602 15.6085 154.509 13.7828 153.44 13.201C152.625 12.7573 151.098 12.7568 150.258 13.1289C149.418 13.501 149.177 14.1792 149.045 15.0573H145.159L145.101 14.9476C145.427 10.6751 149.932 9.93894 153.412 10.2713C155.635 10.4837 157.979 11.3489 158.203 13.9076C158.477 17.054 157.836 20.7441 158.332 23.8335C158.4 24.2578 158.526 24.666 158.692 25.0591V25.0596ZM154.244 18.015C152.649 19.1518 148.479 18.1467 148.614 21.056C148.706 23.036 151.296 23.085 152.672 22.488C153.555 22.1046 154.244 20.9936 154.244 20.0316V18.015Z",
    "M165.338 5.05469V25.0593H161.372V5.13535L161.452 5.05469H165.338Z",
  ];
  const LOGO_VIEWBOX = "4 4 162 27";

  function logoSVG() {
    const paths = [...AND_PATHS, ...CAPITAL_PATHS]
      .map((d, i) => `<path style="--i:${i}" d="${d}"/>`)
      .join("");
    return `<svg viewBox="${LOGO_VIEWBOX}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AND Capital">${paths}</svg>`;
  }
  $$("[data-logo]").forEach((el) => (el.innerHTML = logoSVG()));
  $$("svg[data-and]").forEach((svg) => {
    svg.setAttribute("viewBox", "4.4 4.6 59.9 20.6");
    svg.innerHTML = AND_PATHS.map((d) => `<path d="${d}"/>`).join("");
  });

  window.ANDIcons && ANDIcons.mount();

  /* ------------------------------------------------------------------
   * Splitting. Wraps each word as .split-word > .split-in, keeping inline
   * markup (<b>, <em>, <br>) intact, and numbers the words with --word.
   * The outer span is the mask, the inner one is what moves.
   * ------------------------------------------------------------------ */
  function split(el) {
    if (el.dataset.split) return;
    el.dataset.split = "1";
    let w = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(" ")); return; }
            w++;
            const ws = document.createElement("span");
            ws.className = "split-word";
            ws.style.setProperty("--word", w);
            const wi = document.createElement("span");
            wi.className = "split-in";
            wi.textContent = tok;
            ws.appendChild(wi);
            frag.appendChild(ws);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR" && n.tagName !== "I") walk(n);
      });
    };
    walk(el);
  }
  $$("[data-text-fade], [data-hero-title], [data-words], [data-scrub-words]").forEach((el) => split(el));

  /* ------------------------------------------------------------------
   * Opening. "Andean Capital" rises in, the "ean" closes up to leave
   * "And Capital", which gives way to the wordmark. Nine nodes fill with
   * the real load, the AND node last. Then the black lifts and the
   * wordmark settles into the header.
   * ------------------------------------------------------------------ */
  const opening = $(".opening");
  const owName = $(".ow-name");
  const owCut = $(".ow-cut");
  const owLogo = $(".ow-logo");
  const nodesEl = $("[data-nodes]");
  const heroVideo = $(".hero-media video");

  // Perimeter clockwise, then the centre: every line meets at AND.
  const NODE_ORDER = [0, 1, 2, 5, 8, 7, 6, 3, 4];
  nodesEl.innerHTML = "<i></i>".repeat(9);
  const nodes = NODE_ORDER.map((i) => nodesEl.children[i]);
  nodes[8].classList.add("is-and");

  // Real loading progress: fonts, the hero video's first frames, the window.
  let loaded = 0;
  const tasks = [
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((r) => {
      if (!heroVideo) return r();
      if (heroVideo.readyState >= 3) return r();
      heroVideo.addEventListener("canplay", r, { once: true });
      heroVideo.addEventListener("error", r, { once: true });
      setTimeout(r, 6000);
    }),
    new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r, { once: true }))),
  ];
  tasks.forEach((p) => p.then(() => loaded++));
  const allLoaded = Promise.all(tasks);

  let shown = 0;
  function tickPct() {
    const target = Math.min(100, (loaded / tasks.length) * 100);
    shown += (target - shown) * 0.08 + (target > shown ? 0.25 : 0);
    shown = Math.min(shown, target);
    const lit = Math.floor((shown / 100) * nodes.length + 0.001);
    nodes.forEach((n, i) => n.classList.toggle("is-on", i < lit));
    if (shown < 100) requestAnimationFrame(tickPct);
  }
  const pctDone = new Promise((res) => {
    const check = () => (shown >= 100 ? res() : requestAnimationFrame(check));
    check();
  });

  async function openingSequence() {
    requestAnimationFrame(tickPct);
    await wait(120);
    owName.classList.add("is-in");
    // Hold the name long enough to read, and until the page is ready.
    await Promise.all([allLoaded.then(() => pctDone), wait(1300)]);
    await wait(180);

    // "Andean" closes up to "And".
    owCut.style.width = owCut.getBoundingClientRect().width + "px";
    void owCut.offsetWidth;
    owName.classList.add("is-cut");
    await wait(820);

    // "And Capital" gives way to the wordmark.
    owName.classList.add("is-out");
    owLogo.classList.add("is-on");
    await wait(1050);

    // The black lifts and the wordmark settles into the header.
    nodesEl.classList.add("is-out");
    opening.classList.add("is-opening");
    document.body.classList.remove("is-loading");
    const target = $(".chrome-logo").getBoundingClientRect();
    const from = owLogo.getBoundingClientRect();
    const dx = target.left + target.width / 2 - (from.left + from.width / 2);
    const dy = target.top + target.height / 2 - (from.top + from.height / 2);
    const s = target.width / from.width;

    if (window.gsap) {
      gsap.fromTo(heroVideo, { scale: 1.2 }, { scale: 1.12, duration: 2.6, ease: "expo.out" });
      gsap.to(owLogo, { x: dx, y: dy, scale: s, duration: 1.2, ease: "expo.inOut" });
      setTimeout(startHero, 450);
      await wait(1250);
    } else startHero();
    document.body.classList.add("is-ready");
    opening.classList.add("is-done");
  }

  function startHero() {
    document.body.classList.add("is-open");
    $(".hero-eyebrow").classList.add("is-inview");
    setTimeout(() => $("[data-hero-title]").classList.add("is-inview"), 260);
    setTimeout(() => $(".hero-foot").classList.add("is-inview"), 1200);
  }

  // ?skip jumps past the opening (for review).
  if (reduced || /[?&]skip/.test(location.search)) {
    document.body.classList.add("is-ready");
    opening.classList.add("is-done");
    document.body.classList.remove("is-loading");
    startHero();
  } else {
    openingSequence();
  }

  /* ------------------------------------------------------------------
   * Smooth scroll and scroll choreography.
   * ------------------------------------------------------------------ */
  let lenis = null;
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    document.documentElement.classList.add("lenis");
    if (window.gsap) {
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    $$('a[href^="#"]').forEach((a) =>
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const el = $(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: 0, duration: 1.6 });
      })
    );
  }

  // In view: adds .is-inview once. The hero is run by the opening instead.
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-inview"); io.unobserve(e.target); }
    }),
    { rootMargin: "0px 0px -12% 0px" }
  );
  $$("[data-text-fade], [data-blink], [data-words], [data-reveal], [data-line], .step")
    .filter((el) => !el.closest(".hero"))
    .forEach((el) => io.observe(el));
  // Stagger the problem lines.
  $$("[data-line]").forEach((el, i) => (el.style.transitionDelay = `${i * 110}ms`));

  // The convergence diagram's dot grid.
  const dg = $("[data-dg-grid]");
  if (dg) {
    let d = "";
    for (let x = 50; x <= 750; x += 50) for (let y = 50; y <= 450; y += 50) d += `<rect x="${x - 1}" y="${y - 1}" width="2" height="2"/>`;
    dg.innerHTML = d;
  }

  // Lazy videos play only while on screen.
  const vio = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) {
        if (v.closest("[data-focus-media]") && !v.classList.contains("is-active")) return;
        if (v.preload === "none") { v.preload = "auto"; v.load(); }
        v.play().catch(() => {});
      } else v.pause();
    }),
    { rootMargin: "20% 0px" }
  );
  $$("video[data-lazy]").forEach((v) => vio.observe(v));

  // Hide the chrome on the way down, return it on the way up; dark ink over the footer.
  const chrome = $(".chrome");
  const foot = $(".foot");
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    if (!document.body.classList.contains("is-loading")) {
      chrome.classList.toggle("is-hidden", y > lastY && y > window.innerHeight * 0.6);
    }
    lastY = y;
    const fr = foot.getBoundingClientRect();
    chrome.classList.toggle("on-light", fr.top < 60);
  }
  addEventListener("scroll", onScroll, { passive: true });

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) lenis.on("scroll", ScrollTrigger.update);

    // Hero recedes as you leave it.
    gsap.to(".hero-inner", {
      yPercent: -18, opacity: 0, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 30%", scrub: true },
    });
    gsap.to(".hero-media", {
      yPercent: 16, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    // Slow drift on the focus films.
    $$(".focus-media").forEach((m) => {
      gsap.fromTo(m.querySelectorAll("video"), { yPercent: -6, scale: 1.12 }, {
        yPercent: 6, scale: 1.04, ease: "none",
        scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // Focus names settle into their offsets.
    $$(".focus-item").forEach((li, i) => {
      gsap.fromTo(li, { x: (i % 2 ? 1 : -1) * 40 }, {
        x: 0, ease: "none",
        scrollTrigger: { trigger: li, start: "top bottom", end: "center 55%", scrub: true },
      });
    });

    // Letter quote lights word by word with the scroll.
    const q = $("[data-scrub-words]");
    if (q) {
      const words = $$(".split-word", q);
      ScrollTrigger.create({
        trigger: q, start: "top 80%", end: "bottom 40%", scrub: true,
        onUpdate: (self) => {
          const n = Math.round(self.progress * words.length);
          words.forEach((w, i) => w.classList.toggle("is-lit", i < n));
        },
      });
    }

    // Footer letterform rises into place.
    gsap.fromTo(".foot-letter svg", { yPercent: 18 }, {
      yPercent: 0, ease: "none",
      scrollTrigger: { trigger: ".foot", start: "top bottom", end: "top 20%", scrub: true },
    });
  }

  /* ------------------------------------------------------------------
   * Stats: the tick ring and the count-up figures.
   * ------------------------------------------------------------------ */
  const ring = $("[data-ring]");
  if (ring) {
    const n = 120, cx = 200, cy = 200, r1 = 186, r2 = 198;
    let s = "";
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const long = i % 10 === 0;
      const ri = long ? r1 - 6 : r1;
      s += `<line data-t="${i}" x1="${cx + Math.cos(a) * ri}" y1="${cy + Math.sin(a) * ri}" x2="${cx + Math.cos(a) * r2}" y2="${cy + Math.sin(a) * r2}"/>`;
    }
    ring.innerHTML = s;
  }
  // Figures count up on one long ease, then rest on the stated value.
  function countUp(el) {
    const final = el.dataset.count;
    const m = final.match(/^(\D*)([\d.]+)(.*)$/);
    if (!m) return;
    const [, pre, num, suf] = m;
    const n = parseFloat(num);
    const dur = 1800;
    const t0 = performance.now();
    const frame = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const v = n * (1 - Math.pow(2, -10 * p));
      el.textContent = p < 1 ? pre + (n < 10 ? v.toFixed(1) : Math.round(v)) + suf : final;
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
  const sio = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const stat = e.target;
      const num = $("[data-count]", stat);
      if (!reduced) countUp(num);
      const ticks = $$(".ring line", stat);
      if (ticks.length && window.gsap && !reduced) {
        gsap.fromTo(ticks, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.008, ease: "none" });
        // A single emerald tick runs the ring once, then rests at the top.
        let i = 0;
        const run = () => {
          ticks.forEach((t) => t.classList.remove("tick-hi"));
          ticks[i % ticks.length].classList.add("tick-hi");
          if (i++ < ticks.length) requestAnimationFrame(run);
          else ticks[0].classList.add("tick-hi");
        };
        setTimeout(run, 900);
      }
      const orbits = $$(".orbits circle", stat);
      if (orbits.length && window.gsap && !reduced) {
        gsap.fromTo(orbits, { attr: { r: 0 }, opacity: 0 }, { attr: { r: (i) => [138, 138, 62][i] }, opacity: 1, duration: 1.6, ease: "expo.out", stagger: 0.12 });
      }
      sio.unobserve(stat);
    }),
    { threshold: 0.4 }
  );
  $$(".stat").forEach((s) => sio.observe(s));

  /* ------------------------------------------------------------------
   * Footer: the dark stage steps down into the white field.
   * ------------------------------------------------------------------ */
  const steps = $("[data-steps]");
  if (steps) {
    const cols = 32, rows = 5;
    // Heights fall away from the edges toward the centre, in whole steps.
    const H = [];
    for (let c = 0; c < cols; c++) {
      const d = Math.abs(c - (cols - 1) / 2) / ((cols - 1) / 2); // 0 centre .. 1 edge
      H.push(Math.max(0, Math.round(d * d * rows + ((c * 7) % 3 === 0 ? 1 : 0))));
    }
    let s = `<svg viewBox="0 0 ${cols} ${rows}" preserveAspectRatio="none">`;
    s += `<rect x="0" y="-0.02" width="${cols}" height="0.04" style="fill:var(--bg)"/>`;
    H.forEach((h, c) => {
      for (let r = 0; r < Math.min(h, rows); r++) s += `<rect data-c="${c}" data-r="${r}" x="${c - 0.01}" y="${r - 0.01}" width="1.02" height="1.02"/>`;
    });
    s += `</svg>`;
    steps.innerHTML = s;
  }

  /* ------------------------------------------------------------------
   * Focus list.
   * ------------------------------------------------------------------ */
  $$(".focus-item").forEach((li) => {
    const b = $(".focus-name", li);
    const open = (v) => {
      li.classList.toggle("is-open", v);
      b.setAttribute("aria-expanded", v);
      if (v) {
        $$("[data-focus-media] video").forEach((vid) => {
          const on = vid.dataset.k === li.dataset.k;
          vid.classList.toggle("is-active", on);
          if (on) { if (vid.preload === "none") { vid.preload = "auto"; vid.load(); } vid.play().catch(() => {}); }
        });
      }
    };
    b.addEventListener("mouseenter", () => matchMedia("(hover: hover)").matches && open(true));
    li.addEventListener("mouseleave", () => matchMedia("(hover: hover)").matches && open(false));
    b.addEventListener("click", () => open(!li.classList.contains("is-open")));
  });
})();
