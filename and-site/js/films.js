/*
 * AND Capital — films, made in code.
 *
 * Each film is a small three.js scene shot like a product film: one hard
 * slit of light sweeping across engraved metal, a dim soft-box environment,
 * shallow depth of field, a little bloom on the glints, and grain.
 * Every motion is a function of the loop phase, so each film loops exactly.
 */
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

RectAreaLightUniformsLib.init();
export { THREE };

const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- Helpers ---------- */

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// One drawing, three maps: height (bump), roughness and cavity colour.
function engraving(size, draw, { rough = 0.4, groove = 0.75, brushed = 0, repeat = [1, 1], offset = [0, 0] } = {}) {
  const mk = (bg, line, kind) => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");
    g.fillStyle = bg; g.fillRect(0, 0, size, size);
    if (brushed && kind !== "height") {
      const r = rng(7);
      for (let i = 0; i < size * 1.2; i++) {
        const v = kind === "rough" ? Math.round(255 * (rough + (r() - 0.5) * 0.18)) : Math.round(235 + r() * 20);
        g.strokeStyle = `rgba(${v},${v},${v},${0.25 + r() * 0.4})`;
        g.lineWidth = r() * 1.6 + 0.3;
        const y = r() * size;
        g.beginPath();
        if (brushed === "v") { g.moveTo(y, 0); g.lineTo(y + (r() - 0.5) * 6, size); }
        else { g.moveTo(0, y); g.lineTo(size, y + (r() - 0.5) * 6); }
        g.stroke();
      }
    }
    if (kind === "rough") {
      const r = rng(5);
      for (let i = 0; i < 40; i++) {
        const x = r() * size, y = r() * size, rad = size * (0.05 + r() * 0.2), v = Math.round(255 * (rough + (r() - 0.3) * 0.25));
        const gr = g.createRadialGradient(x, y, 0, x, y, rad);
        gr.addColorStop(0, `rgba(${v},${v},${v},0.35)`); gr.addColorStop(1, `rgba(${v},${v},${v},0)`);
        g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
      for (let i = 0; i < 220; i++) {
        const v = Math.round(255 * Math.min(1, rough + 0.25 + r() * 0.2));
        g.strokeStyle = `rgba(${v},${v},${v},${0.2 + r() * 0.5})`; g.lineWidth = 0.6 + r() * 0.8;
        const x = r() * size, y = r() * size, a = r() * TAU, l = size * (0.01 + r() * 0.08);
        g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + 0.3) * l * 0.5, y + Math.sin(a + 0.3) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
      }
    }
    g.strokeStyle = line; g.fillStyle = line;
    g.lineCap = "butt"; g.lineJoin = "miter";
    const layer = document.createElement("canvas");
    layer.width = layer.height = size;
    const lg = layer.getContext("2d");
    lg.strokeStyle = line; lg.fillStyle = line; lg.lineCap = "butt"; lg.lineJoin = "miter";
    draw(lg, size, rng(11));
    g.drawImage(layer, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
    t.repeat.set(repeat[0], repeat[1]);
    t.offset.set(offset[0], offset[1]);
    if (kind === "color") t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const gv = (v) => { const n = Math.round(v * 255); return `rgb(${n},${n},${n})`; };
  return {
    bumpMap: mk("#ffffff", "#000000", "height"),
    roughnessMap: mk(gv(rough), gv(groove), "rough"),
    map: mk("#ffffff", "#5a605d", "color"),
  };
}

// Technical markings: ticks, labels, traces, dot fields.
// Banknote and certificate engraving: serial numbers, roman numerals, the name.
const LABELS = ["AND CAPITAL", "No. 004127", "MMXXVI", "SERIES I", "No. 000918", "AND CAPITAL", "FOLIO XII", "No. 031406"];
function label(g, r, x, y, px, rot = 0, text) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.font = `400 ${px}px "Times New Roman", Times, serif`;
  g.letterSpacing = `${px * 0.28}px`;
  g.fillText(text || LABELS[Math.floor(r() * LABELS.length)], 0, 0);
  g.restore();
}
// A guilloché rosette: interlaced sine rings, as on a banknote or a share certificate.
function guilloche(g, cx, cy, r0, amp, n, lines, lw) {
  g.lineWidth = lw;
  for (let j = 0; j < lines; j++) {
    const ph = (j / lines) * (TAU / n);
    g.beginPath();
    for (let i = 0; i <= 720; i++) {
      const t = (i / 720) * TAU;
      const rr = r0 + amp * Math.sin(n * t + ph) + amp * 0.35 * Math.sin(n * 3 * t - ph * 2);
      const x = cx + Math.cos(t) * rr, y = cy + Math.sin(t) * rr;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
  }
}
// Fine parallel rules across a box, at an angle.
function rules(g, x, y, w, h, gap, angle, lw) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.translate(x + w / 2, y + h / 2); g.rotate(angle); g.lineWidth = lw;
  const L = Math.hypot(w, h);
  g.beginPath();
  for (let k = -L; k <= L; k += gap) { g.moveTo(-L, k); g.lineTo(L, k); }
  g.stroke(); g.restore();
}
function ruler(g, x, y, len, step, h, vertical = false) {
  g.lineWidth = Math.max(1, step * 0.12);
  g.beginPath();
  for (let i = 0, n = Math.floor(len / step); i <= n; i++) {
    const hh = i % 10 === 0 ? h : i % 5 === 0 ? h * 0.66 : h * 0.4;
    if (vertical) { g.moveTo(x, y + i * step); g.lineTo(x + hh, y + i * step); }
    else { g.moveTo(x + i * step, y); g.lineTo(x + i * step, y + hh); }
  }
  g.stroke();
}
// A soft-edged slit, projected by the key light.
function slitTexture(width = 0.16, soft = 0.05, angle = 0) {
  const s = 512, c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d");
  g.fillStyle = "#000"; g.fillRect(0, 0, s, s);
  g.translate(s / 2, s / 2); g.rotate(angle);
  const w = width * s, f = soft * s;
  const grad = g.createLinearGradient(-w / 2 - f, 0, w / 2 + f, 0);
  grad.addColorStop(0, "rgba(255,255,255,0)");
  grad.addColorStop(f / (w + 2 * f), "rgba(255,255,255,1)");
  grad.addColorStop(1 - f / (w + 2 * f), "rgba(255,255,255,1)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(-w / 2 - f, -s, w + 2 * f, s * 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// A dim, cool soft-box studio for reflections.
function studio(renderer, strips) {
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x000000);
  const geo = new THREE.PlaneGeometry(1, 1);
  strips.forEach(([w, h, x, y, z, i, tint = [1, 1, 1]]) => {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: new THREE.Color(i * tint[0], i * tint[1], i * tint[2]), side: THREE.DoubleSide }));
    m.scale.set(w, h, 1); m.position.set(x, y, z); m.lookAt(0, 0, 0);
    s.add(m);
  });
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(s, 0.035).texture;
  pm.dispose();
  return tex;
}

// A long soft-box. On metal its reflection is the band of light that travels.
function softbox(scene, w, h, intensity, color = 0xeefff4) {
  const l = new THREE.RectAreaLight(color, intensity, w, h);
  scene.add(l);
  return l;
}

// Dust in the light: each mote drifts across its own lifetime and fades at both ends.
function dust(count, box, seed = 3) {
  const r = rng(seed);
  const pos = new Float32Array(count * 3), dat = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = lerp(box[0], box[1], r()); pos[i * 3 + 1] = lerp(box[2], box[3], r()); pos[i * 3 + 2] = lerp(box[4], box[5], r());
    dat[i * 4] = r(); dat[i * 4 + 1] = r() * 0.6 + 0.4; dat[i * 4 + 2] = (r() - 0.5) * 0.6; dat[i * 4 + 3] = r();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aData", new THREE.BufferAttribute(dat, 4));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uPhase: { value: 0 }, uPx: { value: 1 } },
    vertexShader: `
      attribute vec4 aData; uniform float uPhase; uniform float uPx; varying float vA;
      void main(){
        float life = fract(uPhase * 2.0 + aData.x);
        vec3 p = position + vec3(life - 0.5, (life - 0.5) * aData.z, (life - 0.5) * 0.4) * 1.2;
        vA = sin(life * 3.14159) * aData.y;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uPx * (1.2 + aData.w * 2.4) * (6.0 / -mv.z);
      }`,
    fragmentShader: `
      varying float vA;
      void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vec3(0.75, 0.85, 0.8) * a * vA * 0.35, 1.0); }`,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  return pts;
}

// Final grade, after TGE: the frame is mostly true black, and light reads as
// one colour, the AND emerald. Luminance is crushed at the toe, then mapped
// through black, deep emerald, emerald and neon to a pale mint at the hottest
// speculars. No fringe; a whisper of grain to hold the gradients.
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uFade: { value: 1 }, uGrain: { value: 0.03 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uRes; uniform float uFade; uniform float uGrain; varying vec2 vUv;
    float hash(vec2 p){ p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }
    vec3 ramp(float k){
      vec3 c1 = vec3(0.006, 0.050, 0.026);
      vec3 c2 = vec3(0.090, 0.330, 0.200);
      vec3 c3 = vec3(0.310, 0.725, 0.478);
      vec3 c4 = vec3(0.560, 0.960, 0.680);
      vec3 c5 = vec3(0.930, 1.000, 0.950);
      vec3 c = mix(vec3(0.0), c1, smoothstep(0.0, 0.14, k));
      c = mix(c, c2, smoothstep(0.14, 0.38, k));
      c = mix(c, c3, smoothstep(0.38, 0.64, k));
      c = mix(c, c4, smoothstep(0.64, 0.9, k));
      return mix(c, c5, smoothstep(0.92, 1.0, k));
    }
    void main(){
      vec2 c = vUv - 0.5;
      vec3 src = texture2D(tDiffuse, vUv).rgb;
      float l = dot(src, vec3(0.2126, 0.7152, 0.0722));
      float k = clamp((l - 0.03) / 0.97, 0.0, 1.0);
      k = pow(k, 1.25);
      vec3 col = ramp(k);
      col *= mix(0.15, 1.0, smoothstep(0.9, 0.18, length(c * vec2(1.0, 1.3))));
      float g = hash(floor(vUv * uRes) + floor(uTime * 24.0) * 17.0) - 0.5;
      col += g * uGrain * (0.35 + k) * vec3(0.7, 1.0, 0.8);
      gl_FragColor = vec4(max(col, 0.0) * uFade, 1.0);
    }`,
};

/* ---------- Scenes ---------- */

// Health & Wellness: an MRI scanner, the light travelling around its bore.
function health(ctx) {
  const { scene, camera, renderer } = ctx;
  scene.fog = new THREE.FogExp2(0x000000, 0.035);
  scene.environment = studio(renderer, [[16, 1.4, 0, 10, 2, 3.2], [1.2, 12, -10, 2, 6, 1.4], [1.2, 10, 10, 2, -4, 0.8, [0.85, 1, 0.92]]]);
  scene.environmentIntensity = 0.34;

  // The gantry: each face of the profile is its own lathe, so every edge stays crisp.
  const prof = [[1.45, -1.3], [1.45, 1.3], [1.62, 1.46], [3.05, 1.46], [3.45, 1.1], [3.45, -1.1], [3.05, -1.46], [1.62, -1.46], [1.45, -1.3]];
  const faceMarks = engraving(2048, (g, s, r) => {
    rules(g, 0, s * 0.3, s, s * 0.06, s * 0.008, 0, 1.6);
    g.lineWidth = 3; g.beginPath(); g.moveTo(0, s * 0.62); g.lineTo(s, s * 0.62); g.stroke();
    for (let k = 0; k < 4; k++) label(g, r, s * (0.06 + k * 0.25), s * 0.56, s * 0.022, 0, k % 2 ? "No. 004127" : "AND CAPITAL");
  }, { rough: 0.22, groove: 0.6, brushed: "h", repeat: [1, 1] });
  const shell = new THREE.MeshPhysicalMaterial({ color: 0xb4beb9, metalness: 0.35, roughness: 1, ...faceMarks, bumpScale: 1.1, clearcoat: 0.8, clearcoatRoughness: 0.1 });
  const boreMat = new THREE.MeshPhysicalMaterial({ color: 0x6f7975, metalness: 1, roughness: 0.32, anisotropy: 0.7 });
  const gantry = new THREE.Group();
  for (let i = 0; i < prof.length - 1; i++) {
    const pts = [new THREE.Vector2(...prof[i]), new THREE.Vector2(...prof[i + 1])];
    const geo = new THREE.LatheGeometry(pts, 220);
    const m = new THREE.Mesh(geo, i === 0 ? boreMat : shell);
    m.castShadow = m.receiveShadow = true;
    gantry.add(m);
  }
  // A recessed light ring inside the bore, and a fine seam around the front.
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.44, 0.012, 8, 220), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xd9fff0).multiplyScalar(1.6) }));
  ring.rotation.x = Math.PI / 2; ring.position.y = 0.9;
  gantry.add(ring);
  const seam = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.01, 6, 220), new THREE.MeshPhysicalMaterial({ color: 0x0a0d0c, roughness: 0.6 }));
  seam.rotation.x = Math.PI / 2; seam.position.y = 1.465;
  gantry.add(seam);
  gantry.rotation.x = Math.PI / 2;
  gantry.position.set(0, 3.45, 0);
  scene.add(gantry);

  // The patient table runs out of the bore toward us.
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.14, 7.5), new THREE.MeshPhysicalMaterial({ color: 0x9aa59f, metalness: 0.2, roughness: 0.35, clearcoat: 0.9 }));
  table.position.set(0, 2.38, 3.0); table.castShadow = table.receiveShadow = true;
  scene.add(table);
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.2, 4.2), new THREE.MeshPhysicalMaterial({ color: 0x59625e, metalness: 0.3, roughness: 0.4 }));
  base.scale.set(1, 1, 0.5); base.position.set(0, 1.15, 3.2); base.castShadow = base.receiveShadow = true;
  scene.add(base);

  // A dark, faintly polished floor to set it down.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshPhysicalMaterial({ color: 0x050706, metalness: 0.4, roughness: 0.22, clearcoat: 0.6 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
  scene.add(floor);

  const key = new THREE.SpotLight(0xe6fff1, 3800, 60, 0.36, 0.25, 2);
  key.map = slitTexture(0.16, 0.05, 0.6);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
  key.position.set(-9, 12, 9);
  scene.add(key, key.target);
  const band = softbox(scene, 0.7, 18, 5);
  // A broad, still soft-box above to model the gantry's form.
  const top = softbox(scene, 8, 3, 1.6);
  top.position.set(-5, 9, 7); top.lookAt(0, 3, 0);
  scene.add(ctx.motes = dust(500, [-4, 4, 0.5, 6, -1, 8]));

  return {
    focus: 12.6, aperture: 0.0004, maxblur: 0.0022,
    update(p) {
      const ph = p * TAU;
      camera.position.set(-7.4 + 0.6 * Math.sin(ph), 2.9 + 0.2 * Math.sin(ph * 2), 10.6 + 0.5 * Math.cos(ph));
      camera.lookAt(0.6 + 0.2 * Math.sin(ph), 3.3, 0);
      key.target.position.set(2.2 * Math.sin(ph), 3.4, 1.2 * Math.cos(ph));
      band.position.set(-1 + 9 * Math.sin(ph), 5, 12);
      band.lookAt(0, 3.4, 0);
      band.rotateZ(0.25);
    },
  };
}

// Construction & Real Assets: a bolted steel connection in a raking light.
function assets(ctx) {
  const { scene, camera, renderer } = ctx;
  scene.fog = new THREE.FogExp2(0x000000, 0.05);
  scene.environment = studio(renderer, [[1.4, 16, -10, 4, 6, 2.6], [16, 1.2, 0, 10, -4, 1.2], [1.2, 8, 10, 0, 6, 0.6, [0.85, 1, 0.92]]]);
  scene.environmentIntensity = 0.11;

  function iShape(b, h, tf, tw, rr) {
    const s = new THREE.Shape(), B = b / 2, H = h / 2, W = tw / 2;
    s.moveTo(-B, -H); s.lineTo(B, -H); s.lineTo(B, -H + tf); s.lineTo(W + rr, -H + tf);
    s.quadraticCurveTo(W, -H + tf, W, -H + tf + rr); s.lineTo(W, H - tf - rr); s.quadraticCurveTo(W, H - tf, W + rr, H - tf);
    s.lineTo(B, H - tf); s.lineTo(B, H); s.lineTo(-B, H); s.lineTo(-B, H - tf); s.lineTo(-W - rr, H - tf);
    s.quadraticCurveTo(-W, H - tf, -W, H - tf - rr); s.lineTo(-W, -H + tf + rr); s.quadraticCurveTo(-W, -H + tf, -W - rr, -H + tf);
    s.lineTo(-B, -H + tf); s.closePath();
    return s;
  }
  const beamGeo = (len, b = 0.9, h = 1.3) => new THREE.ExtrudeGeometry(iShape(b, h, 0.1, 0.065, 0.07), { depth: len, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 8 });

  // The web carries the markings: a ruler along its length, stencils, a dimension line.
  const webMarks = engraving(2048, (g, s, r) => {
    g.lineWidth = 3;
    ruler(g, s * 0.62, 0, s, s / 160, s * 0.05, true);
    g.beginPath(); g.moveTo(s * 0.36, 0); g.lineTo(s * 0.36, s); g.stroke();
    for (let k = 0; k < 4; k++) {
      const y = s * (0.1 + k * 0.25);
      for (let j = 0; j < 3; j++) label(g, r, s * 0.4 + j * s * 0.075, y + j * s * 0.05, s * 0.022, Math.PI / 2);
      g.lineWidth = 2; g.strokeRect(s * 0.28, y - s * 0.02, s * 0.06, s * 0.12);
    }
  }, { rough: 0.3, groove: 0.75, brushed: "v", repeat: [0.7, 0.18] });
  const steel = new THREE.MeshPhysicalMaterial({ color: 0x8a9591, metalness: 1, roughness: 1, ...webMarks, bumpScale: 1.6, anisotropy: 0.8, anisotropyRotation: Math.PI / 2, clearcoat: 0.15 });
  const plainMarks = engraving(1024, () => {}, { rough: 0.38, groove: 0.5, brushed: "v", repeat: [1, 0.25] });
  const plain = new THREE.MeshPhysicalMaterial({ color: 0x7c8783, metalness: 1, roughness: 1, roughnessMap: plainMarks.roughnessMap, anisotropy: 0.6, anisotropyRotation: Math.PI / 2 });

  const concreteTex = engraving(1024, (g, s, r) => {
    for (let i = 0; i < 9000; i++) { g.globalAlpha = r() * 0.25; g.beginPath(); g.arc(r() * s, r() * s, r() * 2.2, 0, TAU); g.fill(); }
    g.globalAlpha = 1; g.lineWidth = 2; g.beginPath(); g.moveTo(0, s * 0.5); g.lineTo(s, s * 0.5); g.stroke();
  }, { rough: 0.85, groove: 0.95, repeat: [2, 2] });
  const concrete = new THREE.MeshStandardMaterial({ color: 0x3f4643, roughness: 1, metalness: 0, ...concreteTex, bumpScale: 1.6 });

  const add = (geo, mat, pos, rot = [0, 0, 0]) => { const m = new THREE.Mesh(geo, mat); m.position.set(...pos); m.rotation.set(...rot); m.castShadow = m.receiveShadow = true; scene.add(m); return m; };

  // The main beam runs from the column toward the camera; the column is concrete.
  add(beamGeo(16), steel, [0, 3, 0.62]);
  add(new THREE.BoxGeometry(1.5, 30, 1.2), concrete, [0, 3, 0]);
  add(new THREE.BoxGeometry(1.1, 1.6, 0.04), plain, [0, 3, 0.62]);
  // Bolts: washer, hex head and a short threaded stub, two by three.
  const boltMat = new THREE.MeshPhysicalMaterial({ color: 0xb4beb9, metalness: 1, roughness: 0.26 });
  const washer = new THREE.CylinderGeometry(0.085, 0.085, 0.012, 32), head = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 6), stub = new THREE.CylinderGeometry(0.032, 0.032, 0.06, 16);
  [-0.3, 0.3].forEach((x) => [-0.5, 0, 0.5].forEach((y) => {
    add(washer, boltMat, [x, 3 + y, 0.646], [Math.PI / 2, 0, 0]);
    add(head, boltMat, [x, 3 + y, 0.677], [Math.PI / 2, Math.PI / 6, 0]);
    add(stub, boltMat, [x, 3 + y, 0.72], [Math.PI / 2, 0, 0]);
  }));
  // A secondary beam crossing behind, and a repeating frame fading into the dark.
  add(beamGeo(30, 0.7, 1.0), plain, [-15, 1.0, -0.9], [0, Math.PI / 2, 0]);
  for (let k = 1; k < 6; k++) {
    add(new THREE.BoxGeometry(1.5, 30, 1.2), concrete, [-7 * k, 3, -2 - k]);
    add(beamGeo(16), plain, [-7 * k, 3, -1.4 - k]);
    add(beamGeo(16), plain, [-7 * k, 9, -1.4 - k]);
  }
  // A second beam above, so the frame reads as a structure, not a part.
  add(beamGeo(16), steel, [0, 9, 0.62]);
  add(new THREE.PlaneGeometry(120, 60), concrete, [0, 0, -12]);

  const key = new THREE.SpotLight(0xeefff5, 700, 70, 0.32, 0.2, 2);
  key.map = slitTexture(0.1, 0.035, 0);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0003; key.shadow.normalBias = 0.02;
  key.position.set(-13, 8, 8);
  scene.add(key, key.target);
  const fill = new THREE.SpotLight(0xbfd9cc, 260, 50, 0.6, 0.8, 2);
  fill.position.set(6, -4, 14); fill.target.position.set(0, 3, 4);
  scene.add(fill, fill.target);
  scene.add(ctx.motes = dust(500, [-5, 3, 0, 6, 2, 12]));
  const band = softbox(scene, 22, 0.5, 4.5);
  ctx.band = band;

  return {
    focus: 6.4, aperture: 0.0004, maxblur: 0.0022,
    update(p) {
      const ph = p * TAU;
      camera.position.set(-4.6 + 0.45 * Math.sin(ph), 0.7 + 0.2 * Math.sin(ph + 0.6), 8.2 + 0.45 * Math.cos(ph));
      camera.lookAt(0.1 + 0.2 * Math.sin(ph), 3.5, 2.2);
      key.target.position.set(0, 3, 5.5 + 3.8 * Math.sin(ph));
      band.position.set(-3, -2.5, 4.5 + 4 * Math.sin(ph));
      band.lookAt(-3, 3, 4.5 + 4 * Math.sin(ph));
    },
  };
}

// Energy Transition: one engraved turbine blade, the light running along its edge.
function energy(ctx) {
  const { scene, camera, renderer } = ctx;
  scene.fog = new THREE.FogExp2(0x000000, 0.045);
  scene.environment = studio(renderer, [[18, 1.2, 0, 10, 2, 3.2], [1.2, 12, -10, 2, 6, 1.2], [1.2, 10, 10, -2, -4, 0.7, [0.85, 1, 0.92]]]);
  scene.environmentIntensity = 0.17;

  // NACA 4412 section, swept along the span with taper, twist and pre-bend.
  const N = 72, S = 160, L = 22;
  const sec = [];
  for (let i = 0; i <= N; i++) {
    const x = 0.5 * (1 - Math.cos((i / N) * Math.PI));
    sec.push(x);
  }
  const foil = (x, t, upper) => {
    const m = 0.04, pp = 0.4;
    const yt = 5 * t * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4);
    const yc = x < pp ? (m / pp ** 2) * (2 * pp * x - x * x) : (m / (1 - pp) ** 2) * (1 - 2 * pp + 2 * pp * x - x * x);
    const dy = x < pp ? ((2 * m) / pp ** 2) * (pp - x) : ((2 * m) / (1 - pp) ** 2) * (pp - x);
    const th = Math.atan(dy);
    return upper ? [x - yt * Math.sin(th), yc + yt * Math.cos(th)] : [x + yt * Math.sin(th), yc - yt * Math.cos(th)];
  };
  const ring = [];
  for (let i = N; i >= 0; i--) ring.push([sec[i], 1]);
  for (let i = 1; i <= N; i++) ring.push([sec[i], 0]);
  const P = ring.length;
  const pos = new Float32Array((S + 1) * P * 3), uv = new Float32Array((S + 1) * P * 2), idx = [];
  for (let j = 0; j <= S; j++) {
    const s = j / S;
    const chord = lerp(2.6, 0.5, Math.pow(s, 0.85));
    const t = lerp(0.2, 0.11, s);
    const tw = 0.42 * Math.pow(1 - s, 1.6) - 0.04;
    const bend = 0.6 * s * s;
    for (let k = 0; k < P; k++) {
      const [x, y] = foil(ring[k][0], t, ring[k][1]);
      const cx = (x - 0.3) * chord, cy = y * chord;
      const rx = cx * Math.cos(tw) - cy * Math.sin(tw), ry = cx * Math.sin(tw) + cy * Math.cos(tw);
      const o = (j * P + k) * 3;
      pos[o] = s * L; pos[o + 1] = rx; pos[o + 2] = ry + bend;
      uv[(j * P + k) * 2] = (s * L) / 4; uv[(j * P + k) * 2 + 1] = k / (P - 1);
    }
  }
  for (let j = 0; j < S; j++) for (let k = 0; k < P - 1; k++) {
    const a = j * P + k, b = a + P;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();

  // Flowing lines along the span, a tick ladder and labels near the leading edge.
  const marks = engraving(2048, (g, s, r) => {
    g.lineWidth = 2.5;
    for (let k = 0; k < 9; k++) {
      g.beginPath();
      const y0 = s * (0.25 + k * 0.06), a = s * (0.01 + r() * 0.03), f = 1 + Math.floor(r() * 2);
      for (let x = 0; x <= s; x += 8) { const y = y0 + a * Math.sin((x / s) * TAU * f + k); x ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
    }
    g.lineWidth = 3;
    rules(g, 0, s * 0.15, s, s * 0.03, s * 0.005, 0, 1.6);
    label(g, r, s * 0.1, s * 0.215, s * 0.022, 0, "AND CAPITAL");
    label(g, r, s * 0.6, s * 0.215, s * 0.016, 0, "No. 004127");
  }, { rough: 0.26, groove: 0.7, brushed: "h" });
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xa3aea9, metalness: 0.85, roughness: 1, ...marks, bumpScale: 1.4, clearcoat: 0.7, clearcoatRoughness: 0.18, side: THREE.DoubleSide });
  const blade = new THREE.Mesh(geo, mat);
  blade.castShadow = blade.receiveShadow = true;
  const pivot = new THREE.Group();
  pivot.add(blade);
  pivot.rotation.set(0, 0, 0.42);
  pivot.position.set(-4, -3.4, 0);
  scene.add(pivot);
  const far = blade.clone();
  far.position.set(0, 3.5, -14);
  far.rotation.set(0.4, 0.3, -0.25);
  scene.add(far);

  // Two hairline cables below, catching the light.
  const cableMat = new THREE.MeshPhysicalMaterial({ color: 0xb8c2bd, metalness: 1, roughness: 0.2 });
  [0, 1].forEach((k) => {
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-6, -5.2 - k * 0.3, 1.5 + k * 0.4), new THREE.Vector3(4, -2.6 - k * 0.25, 1.8 + k * 0.3), new THREE.Vector3(16, 1.6 - k * 0.2, 1 + k * 0.2)]);
    const c = new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.018, 8), cableMat);
    scene.add(c);
  });

  const key = new THREE.SpotLight(0xf0fff6, 4200, 70, 0.3, 0.18, 2);
  key.map = slitTexture(0.08, 0.03, 0.2);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0003; key.shadow.normalBias = 0.02;
  key.position.set(3, 15, 5);
  scene.add(key, key.target);
  const rim = new THREE.SpotLight(0xcde6d9, 1600, 60, 0.5, 0.6, 2);
  rim.position.set(14, 6, -10); rim.target.position.set(4, 0, 0);
  scene.add(rim, rim.target);
  scene.add(ctx.motes = dust(500, [-2, 10, -3, 3, -1, 6]));
  const band = softbox(scene, 0.8, 16, 9);
  ctx.band = band;

  return {
    focus: 10.5, aperture: 0.0004, maxblur: 0.0022,
    update(p) {
      const ph = p * TAU;
      blade.rotation.x = 0.06 * Math.sin(ph);
      camera.position.set(2.2 + 0.8 * Math.sin(ph), -0.6 + 0.2 * Math.sin(ph * 2), 10.4 + 0.5 * Math.cos(ph));
      camera.lookAt(4.6 + 0.6 * Math.sin(ph), 0.2, 0);
      key.target.position.set(4 + 5.5 * Math.sin(ph), -0.4 + 2 * Math.sin(ph) * 0.42, 0.5);
      band.position.set(5 + 6 * Math.sin(ph), 1, 12);
      band.lookAt(5, 0.5, 0);
      band.rotateZ(-0.35);
    },
  };
}

// The hero: a turbofan intake, the fan turning slowly, the light crossing the lip.
function hero(ctx) {
  const { scene, camera, renderer } = ctx;
  scene.fog = new THREE.FogExp2(0x000000, 0.03);
  scene.environment = studio(renderer, [[16, 1.2, 0, 10, 4, 2.6], [1.2, 12, -10, 2, 6, 1.0], [1.2, 10, 10, 2, -4, 0.7, [0.85, 1, 0.92]]]);
  scene.environmentIntensity = 0.12;

  const metal = (c, r, extra = {}) => new THREE.MeshPhysicalMaterial({ color: c, metalness: 1, roughness: r, ...extra });

  // Nacelle: a smooth lathe from the inner lip, round the leading edge, back along the outside.
  const lip = [];
  for (let i = 0; i <= 40; i++) { const a = -Math.PI / 2 + (i / 40) * Math.PI; lip.push(new THREE.Vector2(3.0 + 0.32 * Math.cos(a) * -1 + 0.32, 0.32 * Math.sin(a))); }
  const nacPts = [new THREE.Vector2(2.72, -5.5), new THREE.Vector2(2.7, -1.2), ...lip.reverse().map((v) => new THREE.Vector2(v.x - 0.02, v.y)), new THREE.Vector2(3.38, -1.4), new THREE.Vector2(3.42, -5.5)];
  const nacMarks = engraving(2048, (g, s, r) => {
    label(g, r, s * 0.1, s * 0.72, s * 0.02, 0, "AND CAPITAL");
    label(g, r, s * 0.6, s * 0.72, s * 0.014, 0, "No. 004127");
    g.lineWidth = 2; g.beginPath(); g.moveTo(0, s * 0.76); g.lineTo(s, s * 0.76); g.stroke();
  }, { rough: 0.2, groove: 0.6, brushed: "h" });
  const nacelle = new THREE.Mesh(new THREE.LatheGeometry(nacPts, 240), metal(0xb8c2bd, 1, { ...nacMarks, bumpScale: 1, clearcoat: 1, clearcoatRoughness: 0.06, side: THREE.DoubleSide }));
  nacelle.castShadow = nacelle.receiveShadow = true;

  // Spinner: a polished cone with the engraved spiral every turbofan carries.
  const sp = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40; sp.push(new THREE.Vector2(0.78 * Math.sin(t * Math.PI / 2) ** 0.8 + 0.001, 1.1 - t * 1.9)); }
  const spMarks = engraving(1024, (g, s) => {
    g.lineWidth = s * 0.03;
    g.beginPath(); for (let i = 0; i <= 100; i++) { const t = i / 100; const x = (t * s * 1.0 + s * 0.2) % s, y = t * s; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  }, { rough: 0.12, groove: 0.45 });
  const spinner = new THREE.Mesh(new THREE.LatheGeometry(sp, 160), metal(0x9aa5a0, 1, { ...spMarks, bumpScale: 0.6, clearcoat: 1, clearcoatRoughness: 0.04 }));

  // Fan: swept, twisted blades on a hub; identical, so turning by one pitch loops exactly.
  const NB = 22, S = 40, C = 10;
  const pos = [], idx = [], uvs = [];
  for (let j = 0; j <= S; j++) {
    const t = j / S, rad = lerp(0.8, 2.66, t), pitch = lerp(0.95, 0.42, t), w = lerp(0.62, 0.9, t), sweep = 0.32 * t * t;
    for (let k = 0; k <= C; k++) {
      const c = k / C - 0.5;
      const dth = (c * w * Math.cos(pitch)) / rad + sweep;
      const z = -0.9 - c * w * Math.sin(pitch) + 0.08 * Math.sin(Math.PI * (k / C));
      pos.push(rad * Math.cos(dth), rad * Math.sin(dth), z);
      uvs.push(k / C, t);
    }
  }
  for (let j = 0; j < S; j++) for (let k = 0; k < C; k++) { const a = j * (C + 1) + k, b = a + C + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const bladeGeo = new THREE.BufferGeometry();
  bladeGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  bladeGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  bladeGeo.setIndex(idx); bladeGeo.computeVertexNormals();
  const bladeMat = metal(0x9ba6a1, 0.3, { anisotropy: 0.6, clearcoat: 0.5, side: THREE.DoubleSide });
  const fan = new THREE.Group();
  for (let i = 0; i < NB; i++) { const b = new THREE.Mesh(bladeGeo, bladeMat); b.rotation.z = (i / NB) * TAU; b.castShadow = b.receiveShadow = true; fan.add(b); }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 1.2, 96), metal(0x89938f, 0.3));
  hub.rotation.x = Math.PI / 2; hub.position.z = -0.9;
  fan.add(hub);
  // The dark core behind the fan.
  const core = new THREE.Mesh(new THREE.CircleGeometry(2.72, 96), new THREE.MeshStandardMaterial({ color: 0x010101, roughness: 1 }));
  core.position.z = -2.6;

  const engine = new THREE.Group();
  nacelle.rotation.x = Math.PI / 2; spinner.rotation.x = Math.PI / 2;
  engine.add(nacelle, spinner, fan, core);
  engine.rotation.set(0.08, -0.62, 0);
  engine.position.set(1.4, 0.2, 0);
  scene.add(engine);

  const key = new THREE.SpotLight(0xeefff5, 1300, 70, 0.34, 0.2, 2);
  key.map = slitTexture(0.12, 0.04, 0.4);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0003; key.shadow.normalBias = 0.02;
  key.position.set(-8, 10, 10);
  scene.add(key, key.target);
  const band = softbox(scene, 0.6, 22, 1.8);
  const rim = new THREE.SpotLight(0xcde6d9, 500, 60, 0.5, 0.6, 2);
  rim.position.set(10, 6, -8); rim.target.position.set(1.4, 0, 0);
  scene.add(rim, rim.target);
  scene.add(ctx.motes = dust(600, [-6, 6, -3, 4, -1, 7]));

  return {
    focus: 9.4, aperture: 0.0004, maxblur: 0.0022,
    update(p) {
      const ph = p * TAU;
      fan.rotation.z = -p * (TAU / NB) * 3;
      camera.position.set(-2.6 + 0.6 * Math.sin(ph), 0.5 + 0.25 * Math.sin(ph * 2), 9.6 + 0.4 * Math.cos(ph));
      camera.lookAt(-0.4 + 0.3 * Math.sin(ph), 0.1, 0);
      key.target.position.set(1.4 + 2 * Math.sin(ph), 0.5, 1.5 * Math.cos(ph));
      band.position.set(1 + 8 * Math.sin(ph), 3, 12);
      band.lookAt(1.4, 0, 0);
      band.rotateZ(0.4);
    },
  };
}

const SCENES = { health, assets, energy, hero };

/* ---------- The player ---------- */

export const PERIOD = 16;

export function createFilms(canvas, { names = ["health", "assets", "energy"], start = names[0], dpr = Math.min(devicePixelRatio || 1, 1.75), freeze = null, size = null, grain = 0.03, envScale = 0.45 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(dpr);

  const films = {};
  names.forEach((n) => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const camera = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 200);
    const ctx = { scene, camera, renderer };
    const shot = SCENES[n](ctx);
    scene.environmentIntensity *= envScale;
    films[n] = { scene, camera, shot, motes: ctx.motes, ctx };
  });

  const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, rt);
  const renderPass = new RenderPass(films[start].scene, films[start].camera);
  const bokeh = new BokehPass(films[start].scene, films[start].camera, { focus: 8, aperture: 0.001, maxblur: 0.008 });
  const bloom = new UnrealBloomPass(new THREE.Vector2(4, 4), 0.32, 0.18, 0.9);
  const grade = new ShaderPass(GradeShader);
  grade.uniforms.uGrain.value = grain;
  composer.addPass(renderPass);
  composer.addPass(bokeh);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  composer.addPass(grade);

  let current = start, next = null, fadeT = 1, fading = 0;
  let w = 0, h = 0;
  function resize() {
    const r = size ? { width: size[0], height: size[1] } : canvas.getBoundingClientRect();
    const nw = Math.max(2, Math.round(r.width)), nh = Math.max(2, Math.round(r.height));
    if (nw === w && nh === h) return;
    w = nw; h = nh;
    renderer.setSize(w, h, false);
    composer.setPixelRatio(dpr);
    composer.setSize(w, h);
    Object.values(films).forEach((f) => { f.camera.aspect = w / h; f.camera.updateProjectionMatrix(); });
    grade.uniforms.uRes.value.set(w * dpr, h * dpr);
  }
  function use(name) {
    const f = films[name];
    renderPass.scene = bokeh.scene = f.scene;
    renderPass.camera = bokeh.camera = f.camera;
    bokeh.uniforms.focus.value = f.shot.focus;
    bokeh.uniforms.aperture.value = f.shot.aperture;
    bokeh.uniforms.maxblur.value = f.shot.maxblur;
  }
  use(start);

  // A shot: narrower lens (fov), a turn off the scene camera (yaw, pitch, roll)
  // and its own focus distance.
  function aim(f, o) {
    const cam = f.camera;
    const fov = (o && o.fov) || 30;
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
    if (o) {
      cam.rotateY(o.yaw || 0); cam.rotateX(o.pitch || 0); cam.rotateZ(o.roll || 0);
      if (o.dolly) cam.translateZ(-o.dolly);
      cam.updateMatrixWorld();
    }
    bokeh.uniforms.focus.value = (o && o.focus) || f.shot.focus;
    if (o && o.aperture != null) bokeh.uniforms.aperture.value = o.aperture;
  }
  // Distance to whatever is at the centre of a shot, for focus.
  const ray = new THREE.Raycaster();
  function focusAt(name, p, o) {
    const f = films[name];
    f.shot.update(p); aim(f, o);
    ray.setFromCamera(new THREE.Vector2(o && o.fx || 0, o && o.fy || 0), f.camera);
    const hit = ray.intersectObjects(f.scene.children, true).find((h) => h.object.isMesh && h.object.visible && !h.object.material.transparent);
    return hit ? hit.distance : f.shot.focus;
  }

  const t0 = performance.now();
  let running = false, raf = 0, last = t0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    resize();
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const t = (now - t0) / 1000;
    const p = freeze != null ? freeze : (t % PERIOD) / PERIOD;
    // Fade through black between films.
    if (fading) {
      fadeT += fading * dt * 2.6;
      if (fading < 0 && fadeT <= 0) { fadeT = 0; current = next; next = null; use(current); fading = 1; }
      if (fading > 0 && fadeT >= 1) { fadeT = 1; fading = 0; }
    }
    const f = films[current];
    f.shot.update(p);
    if (f.motes) { f.motes.material.uniforms.uPhase.value = p; f.motes.material.uniforms.uPx.value = dpr * (h / 900); }
    grade.uniforms.uTime.value = t;
    grade.uniforms.uFade.value = fadeT * fadeT * (3 - 2 * fadeT);
    composer.render(dt);
  }

  return {
    show(name) {
      if (!films[name] || name === (next || current)) return;
      next = name;
      fading = -1;
    },
    play() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); },
    pause() { running = false; cancelAnimationFrame(raf); },
    get current() { return current; },
    // Renders one frame at a phase, for posters and checks.
    still(name, p) { use(name); resize(); films[name].shot.update(p); composer.render(0); use(current); },
    // One frame of a film at loop phase p, with grain seeded by t: for offline rendering.
    frame(name, p, t, o = null) {
      use(name); resize();
      const f = films[name];
      f.shot.update(p);
      aim(f, o);
      if (f.motes) { f.motes.material.uniforms.uPhase.value = p; f.motes.material.uniforms.uPx.value = dpr * (h / 900); }
      grade.uniforms.uTime.value = t; grade.uniforms.uFade.value = 1;
      composer.render(1 / 24);
    },
    focusAt, renderer, films,
    set freeze(v) { freeze = v; },
  };
}
