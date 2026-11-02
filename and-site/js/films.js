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
    draw(g, size, rng(11));
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
const LABELS = ["AND-03", "LOT 41·07", "S355 J2", "Ø 24", "41.2°", "N 0412", "R-07", "Σ 1.18", "QA ✓", "07/26", "AX-2", "1:250", "B-12", "Δ 0.04"];
function label(g, r, x, y, px, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.font = `500 ${px}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
  g.fillText(LABELS[Math.floor(r() * LABELS.length)], 0, 0);
  g.restore();
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
function trace(g, r, x, y, steps, unit) {
  g.beginPath(); g.moveTo(x, y);
  let dir = Math.floor(r() * 4) * (Math.PI / 2);
  for (let i = 0; i < steps; i++) {
    const turn = r();
    if (turn < 0.3) dir += Math.PI / 4; else if (turn < 0.6) dir -= Math.PI / 4;
    const l = unit * (1 + Math.floor(r() * 3));
    x += Math.cos(dir) * l; y += Math.sin(dir) * l;
    g.lineTo(x, y);
  }
  g.stroke();
  g.beginPath(); g.arc(x, y, unit * 0.32, 0, TAU); g.fill();
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

// Final grade: emerald-black shadows, cool desaturated highlights, vignette, edge fringe, grain.
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uFade: { value: 1 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uRes; uniform float uFade; varying vec2 vUv;
    float hash(vec2 p){ p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }
    void main(){
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      vec2 off = c * r2 * 0.012;
      vec3 col = vec3(texture2D(tDiffuse, vUv - off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv + off).b);
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(l), col, 0.5);
      col *= vec3(0.9, 1.0, 0.96);
      col += vec3(0.006, 0.012, 0.009) * (1.0 - smoothstep(0.0, 0.25, l));
      col *= mix(0.25, 1.0, smoothstep(0.95, 0.2, length(c * vec2(1.0, 1.25))));
      float g = hash(floor(vUv * uRes) + floor(uTime * 24.0) * 17.0) - 0.5;
      col += g * 0.045 * (1.0 - l * 0.5);
      gl_FragColor = vec4(col * uFade, 1.0);
    }`,
};

/* ---------- Scenes ---------- */

// Health & Wellness: a living lattice of engraved hex cells.
function health(ctx) {
  const { scene, camera, renderer } = ctx;
  scene.fog = new THREE.FogExp2(0x000000, 0.06);
  scene.environment = studio(renderer, [[14, 1.6, 0, 9, -6, 3.5], [1.2, 10, -9, 2, 4, 1.4], [1.2, 10, 9, 3, -2, 0.8, [0.85, 1, 0.92]]]);
  scene.environmentIntensity = 0.22;

  const R = 1, gap = 0.085;
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + (i * Math.PI) / 3; i ? shape.lineTo(R * Math.cos(a), R * Math.sin(a)) : shape.moveTo(R * Math.cos(a), R * Math.sin(a)); }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 5, curveSegments: 1 });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, -0.56, 0);

  // Three engraved faces: circuit, dot field with a chip, a calibrated ring.
  const faces = [
    (g, s, r) => {
      g.lineWidth = s * 0.006;
      hexPath(g, s, 0.84); g.stroke();
      g.lineWidth = s * 0.0045;
      for (let i = 0; i < 14; i++) trace(g, r, s * (0.3 + r() * 0.4), s * (0.3 + r() * 0.4), 4 + Math.floor(r() * 4), s * 0.03);
      g.lineWidth = s * 0.004; g.strokeRect(s * 0.4, s * 0.42, s * 0.2, s * 0.16);
      label(g, r, s * 0.41, s * 0.66, s * 0.035);
    },
    (g, s, r) => {
      g.lineWidth = s * 0.006; hexPath(g, s, 0.84); g.stroke();
      for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) if (r() > 0.25) { g.beginPath(); g.arc(s * (0.34 + x * 0.04), s * (0.3 + y * 0.04), s * 0.007, 0, TAU); g.fill(); }
      g.lineWidth = s * 0.0045;
      for (let i = 0; i < 6; i++) trace(g, r, s * (0.35 + r() * 0.3), s * (0.62 + r() * 0.08), 3 + Math.floor(r() * 3), s * 0.03);
      label(g, r, s * 0.36, s * 0.27, s * 0.03);
    },
    (g, s, r) => {
      g.lineWidth = s * 0.006; hexPath(g, s, 0.84); g.stroke();
      g.lineWidth = s * 0.004;
      g.beginPath(); g.arc(s / 2, s / 2, s * 0.18, 0, TAU); g.stroke();
      g.beginPath(); g.arc(s / 2, s / 2, s * 0.1, 0, TAU); g.stroke();
      for (let i = 0; i < 72; i++) { const a = (i / 72) * TAU, l = i % 6 ? 0.02 : 0.045; g.beginPath(); g.moveTo(s / 2 + Math.cos(a) * s * 0.18, s / 2 + Math.sin(a) * s * 0.18); g.lineTo(s / 2 + Math.cos(a) * s * (0.18 + l), s / 2 + Math.sin(a) * s * (0.18 + l)); g.stroke(); }
      for (let i = 0; i < 5; i++) trace(g, r, s * 0.5, s * 0.5, 3, s * 0.035);
      label(g, r, s * 0.43, s * 0.76, s * 0.03);
    },
  ];
  function hexPath(g, s, k) { g.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + (i * Math.PI) / 3; const x = s / 2 + (Math.cos(a) * s * k) / 2, y = s / 2 - (Math.sin(a) * s * k) / 2; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); }

  const side = new THREE.MeshPhysicalMaterial({ color: 0xb9c4bf, metalness: 1, roughness: 0.22, clearcoat: 0.4 });
  const tops = faces.map((draw) => {
    const m = engraving(1024, draw, { rough: 0.34, groove: 0.8, repeat: [0.5, -0.5], offset: [0.5, 0.5] });
    return new THREE.MeshPhysicalMaterial({ color: 0x9aa59f, metalness: 1, roughness: 1, ...m, bumpScale: 2.2, clearcoat: 0.25, clearcoatRoughness: 0.4 });
  });

  const d = Math.sqrt(3) * R + gap, rowH = (d * Math.sqrt(3)) / 2;
  const cells = [];
  const r = rng(21);
  for (let row = -10; row < 26; row++) for (let col = -10; col < 10; col++) {
    const x = d * (col + 0.5 * (row & 1)), z = row * rowH;
    const across = x * 0.82 - z * 0.57;
    if (Math.abs(across + 0.6) > 3.4 + r() * 1.6) continue;
    if (r() < 0.04) continue;
    cells.push({ x, z, set: Math.floor(r() * 3), rot: Math.floor(r() * 6) * (Math.PI / 3), h0: r() < 0.1 ? 0.12 * r() : r() < 0.06 ? -0.25 : 0, lift: r() < 0.08 ? r() : -1 });
  }
  const meshes = tops.map((top, k) => {
    const list = cells.filter((c) => c.set === k);
    const m = new THREE.InstancedMesh(geo, [top, side], list.length);
    m.castShadow = m.receiveShadow = true;
    m.userData.list = list;
    scene.add(m);
    return m;
  });

  const key = new THREE.SpotLight(0xe6fff1, 2200, 60, 0.42, 0.25, 2);
  key.map = slitTexture(0.22, 0.07, 0.35);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
  key.position.set(-7, 11, 12);
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xcfe8dc, 0.35);
  rim.position.set(4, 3, 20);
  scene.add(rim);
  scene.add(ctx.motes = dust(500, [-4, 6, 0, 3.5, -1, 10]));
  const band = softbox(scene, 30, 0.7, 3.2);
  ctx.band = band;

  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), v = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
  return {
    focus: 6.6, aperture: 0.0022, maxblur: 0.01,
    update(p) {
      const ph = p * TAU;
      meshes.forEach((m) => {
        m.userData.list.forEach((c, i) => {
          let y = c.h0 + 0.03 * Math.sin(ph - (c.x * 0.33 + c.z * 0.21));
          if (c.lift >= 0) y += 0.16 * Math.pow(0.5 + 0.5 * Math.cos(ph - c.lift * TAU), 10);
          q.setFromAxisAngle(up, c.rot);
          m4.compose(v.set(c.x, y, c.z), q, one);
          m.setMatrixAt(i, m4);
        });
        m.instanceMatrix.needsUpdate = true;
      });
      camera.position.set(-3.4 + 0.45 * Math.sin(ph), 1.75 + 0.1 * Math.sin(ph * 2), -0.6 + 0.6 * Math.cos(ph));
      camera.lookAt(1.8 + 0.3 * Math.sin(ph + 1), -0.1, 5.4);
      key.target.position.set(1 + 3.2 * Math.sin(ph), 0, 5 + 2 * Math.cos(ph));
      band.position.set(2, 2.6, 15 + 5 * Math.sin(ph));
      band.lookAt(2, 0, 4);
      band.rotateZ(0.6);
    },
  };
}

// Construction & Real Assets: a bolted steel connection in a raking light.
function assets(ctx) {
  const { scene, camera, renderer } = ctx;
  scene.fog = new THREE.FogExp2(0x000000, 0.05);
  scene.environment = studio(renderer, [[1.4, 16, -10, 4, 6, 2.6], [16, 1.2, 0, 10, -4, 1.2], [1.2, 8, 10, 0, 6, 0.6, [0.85, 1, 0.92]]]);
  scene.environmentIntensity = 0.16;

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

  const key = new THREE.SpotLight(0xeefff5, 650, 70, 0.32, 0.2, 2);
  key.map = slitTexture(0.1, 0.035, 0);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0003; key.shadow.normalBias = 0.02;
  key.position.set(-13, 8, 8);
  scene.add(key, key.target);
  const fill = new THREE.SpotLight(0xbfd9cc, 260, 50, 0.6, 0.8, 2);
  fill.position.set(6, -4, 14); fill.target.position.set(0, 3, 4);
  scene.add(fill, fill.target);
  scene.add(ctx.motes = dust(500, [-5, 3, 0, 6, 2, 12]));
  const band = softbox(scene, 22, 0.5, 3.0);
  ctx.band = band;

  return {
    focus: 6.4, aperture: 0.0022, maxblur: 0.01,
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
  scene.environmentIntensity = 0.3;

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
    ruler(g, 0, s * 0.16, s, s / 96, s * 0.025);
    for (let k = 0; k < 4; k++) label(g, r, s * (0.08 + k * 0.25), s * 0.215, s * 0.02);
    g.lineWidth = 2; g.strokeRect(s * 0.6, s * 0.13, s * 0.12, s * 0.018);
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

  const key = new THREE.SpotLight(0xf0fff6, 2600, 70, 0.3, 0.18, 2);
  key.map = slitTexture(0.08, 0.03, 0.2);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0003; key.shadow.normalBias = 0.02;
  key.position.set(3, 15, 5);
  scene.add(key, key.target);
  const rim = new THREE.SpotLight(0xcde6d9, 1600, 60, 0.5, 0.6, 2);
  rim.position.set(14, 6, -10); rim.target.position.set(4, 0, 0);
  scene.add(rim, rim.target);
  scene.add(ctx.motes = dust(500, [-2, 10, -3, 3, -1, 6]));
  const band = softbox(scene, 0.8, 16, 5.5);
  ctx.band = band;

  return {
    focus: 10.5, aperture: 0.0014, maxblur: 0.009,
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

// The hero: the counter of the AND "A", standing as an engraved fin on a long faceted body.
function hero(ctx) {
  const { scene, camera, renderer } = ctx;
  scene.fog = new THREE.FogExp2(0x000000, 0.04);
  scene.environment = studio(renderer, [[16, 1.2, 0, 10, 4, 2.6], [1.2, 12, -10, 2, 6, 1.0], [1.2, 10, 10, 2, -4, 0.7, [0.85, 1, 0.92]]]);
  scene.environmentIntensity = 0.2;

  const K = 0.378, H = 6, B = K * H;
  // Fin: the counter triangle, its engraving a column of marks and an inner counter.
  const finShape = new THREE.Shape();
  finShape.moveTo(-B, 0); finShape.lineTo(B, 0); finShape.lineTo(0, H); finShape.closePath();
  const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 });
  finGeo.translate(0, 0, -0.05);
  const finMarks = engraving(2048, (g, s, r) => {
    const X = (x) => s * (x / H + 0.5), Y = (y) => s * (1 - y / H);
    g.lineWidth = 4;
    g.beginPath(); g.moveTo(X(-B * 0.86), Y(0.25)); g.lineTo(X(B * 0.86), Y(0.25)); g.lineTo(X(0), Y(H * 0.9)); g.closePath(); g.stroke();
    g.lineWidth = 3;
    for (let k = 0; k < 6; k++) { const y = 0.9 + k * 0.62; label(g, r, X(-0.12), Y(y), s * 0.0085); }
    g.save(); g.translate(X(-B * 0.62), Y(0.5)); g.rotate(-Math.atan2(H, B) + Math.PI / 2 - Math.PI);
    g.restore();
    for (let k = 0; k < 40; k++) { const y = 0.5 + k * 0.12, half = B * (1 - y / H) * 0.78; g.beginPath(); g.moveTo(X(-half), Y(y)); g.lineTo(X(-half + (k % 5 ? 0.08 : 0.18)), Y(y)); g.stroke(); }
    g.beginPath(); g.moveTo(X(0.35), Y(0.6)); g.lineTo(X(0.35), Y(3.2)); g.stroke();
    g.strokeRect(X(0.5), Y(1.6), s * 0.03, s * 0.08);
  }, { rough: 0.24, groove: 0.75, brushed: "v", repeat: [1 / H, 1 / H], offset: [0.5, 0] });
  const finMat = new THREE.MeshPhysicalMaterial({ color: 0xa6b1ac, metalness: 1, roughness: 1, ...finMarks, bumpScale: 1.6, clearcoat: 0.6, clearcoatRoughness: 0.15 });
  const fin = new THREE.Mesh(finGeo, finMat);
  fin.castShadow = fin.receiveShadow = true;

  // Body: a long faceted bar with panel seams and markings.
  const prof = new THREE.Shape();
  [[-1.7, 0], [-1.25, 0.55], [1.25, 0.55], [1.7, 0], [1.3, -0.45], [-1.3, -0.45]].forEach(([x, y], i) => (i ? prof.lineTo(x, y) : prof.moveTo(x, y)));
  prof.closePath();
  const bodyGeo = new THREE.ExtrudeGeometry(prof, { depth: 40, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 });
  bodyGeo.translate(0, 0, -20);
  const bodyMarks = engraving(2048, (g, s, r) => {
    g.lineWidth = 3;
    for (let k = 0; k < 6; k++) { const y = s * (k / 6); g.beginPath(); g.moveTo(0, y); g.lineTo(s, y); g.stroke(); }
    g.lineWidth = 2.5;
    ruler(g, s * 0.62, 0, s, s / 120, s * 0.03, true);
    for (let k = 0; k < 6; k++) { label(g, r, s * 0.3, s * (0.08 + k / 6), s * 0.02, Math.PI / 2); }
    for (let k = 0; k < 8; k++) trace(g, r, s * (0.15 + r() * 0.15), s * r(), 3, s * 0.02);
  }, { rough: 0.32, groove: 0.8, brushed: "v", repeat: [0.4, 0.12] });
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x7f8a86, metalness: 1, roughness: 1, ...bodyMarks, bumpScale: 1.5, anisotropy: 0.6, anisotropyRotation: Math.PI / 2, clearcoat: 0.2 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = body.receiveShadow = true;

  const rig = new THREE.Group();
  body.rotation.y = Math.PI / 2;
  fin.position.set(0.6, 0.5, 0);
  fin.rotation.y = -0.5;
  rig.add(body, fin);
  // A single emerald inlay where the fin meets the body: the only colour in the film.
  const inlay = new THREE.Mesh(new THREE.BoxGeometry(2 * B * 0.9, 0.025, 0.02), new THREE.MeshBasicMaterial({ color: new THREE.Color(0x4fb97a).multiplyScalar(2.2) }));
  inlay.position.set(0.6, 0.57, 0); inlay.rotation.y = -0.5;
  rig.add(inlay);
  rig.rotation.set(0.1, 0.35, -0.32);
  scene.add(rig);

  // Hairline frames in the dark behind, catching the light as it passes.
  const hair = new THREE.MeshPhysicalMaterial({ color: 0xc0cac5, metalness: 1, roughness: 0.2 });
  const r = rng(9);
  for (let i = 0; i < 9; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 80), hair);
    m.position.set(-8 + r() * 18, -2 + r() * 10, -6 - r() * 10);
    m.rotation.set(r() * 0.6, 0.6 + r() * 1.2, r() * 0.8);
    scene.add(m);
  }

  const key = new THREE.SpotLight(0xeefff5, 1600, 70, 0.34, 0.2, 2);
  key.map = slitTexture(0.12, 0.04, 0.5);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0003; key.shadow.normalBias = 0.02;
  key.position.set(-6, 13, 9);
  scene.add(key, key.target);
  const band = softbox(scene, 0.8, 20, 2.4);
  const rim = new THREE.SpotLight(0xcde6d9, 900, 60, 0.5, 0.6, 2);
  rim.position.set(10, 8, -10); rim.target.position.set(0, 2, 0);
  scene.add(rim, rim.target);
  scene.add(ctx.motes = dust(600, [-6, 6, -1, 6, -2, 7]));

  return {
    focus: 13.5, aperture: 0.0012, maxblur: 0.009,
    update(p) {
      const ph = p * TAU;
      camera.position.set(-2.6 + 0.8 * Math.sin(ph), -0.4 + 0.25 * Math.sin(ph * 2), 14 + 0.6 * Math.cos(ph));
      camera.lookAt(-1.4 + 0.3 * Math.sin(ph), 2.6, 0);
      key.target.position.set(1.5 * Math.sin(ph), 1.5, 2 * Math.cos(ph));
      band.position.set(1 + 7 * Math.sin(ph), 3, 12);
      band.lookAt(1, 2, 0);
      band.rotateZ(0.5);
    },
  };
}

const SCENES = { health, assets, energy, hero };

/* ---------- The player ---------- */

export const PERIOD = 16;

export function createFilms(canvas, { names = ["health", "assets", "energy"], start = names[0], dpr = Math.min(devicePixelRatio || 1, 1.75), freeze = null } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
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
    films[n] = { scene, camera, shot, motes: ctx.motes, ctx };
  });

  const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, rt);
  const renderPass = new RenderPass(films[start].scene, films[start].camera);
  const bokeh = new BokehPass(films[start].scene, films[start].camera, { focus: 8, aperture: 0.001, maxblur: 0.008 });
  const bloom = new UnrealBloomPass(new THREE.Vector2(4, 4), 0.42, 0.55, 0.82);
  const grade = new ShaderPass(GradeShader);
  composer.addPass(renderPass);
  composer.addPass(bokeh);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  composer.addPass(grade);

  let current = start, next = null, fadeT = 1, fading = 0;
  let w = 0, h = 0;
  function resize() {
    const r = canvas.getBoundingClientRect();
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
    renderer, films,
    set freeze(v) { freeze = v; },
  };
}
