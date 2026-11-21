import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { projectsData } from './Projects';
import { prefersReducedMotion } from './ui';

/*
  THE WORKSHOP — a real-time holographic lab for the site's finale.
  Stark-tech meets web: a power core with gyroscope rings, the projects as
  hologram panels hung from the core on web strands, a radial-web floor, and
  a web-shooter on click. Original geometry; no third-party marks.
*/

const COL = {
  bg: 0x05070d,
  cyan: 0x66e6ff,
  red: 0xe0242e,
  gold: 0xf2b33d,
  white: 0xffffff,
};
const STATUS_HEX = { Completed: '#66E6FF', 'In Progress': '#F2B33D', 'In Development': '#E0242E' };
const N = projectsData.length;

const ease = {
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  outBack: (t) => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
};
const clamp01 = (t) => Math.max(0, Math.min(1, t));

/* ── hologram panel texture: drawn on a canvas, mapped onto a plane ───────── */
function wrap(ctx, text, maxW) {
  const words = text.replace(/-/g, '- ').split(' ');
  const lines = [];
  let line = '';
  words.forEach((w) => {
    const test = line ? (line.endsWith('-') ? line + w : `${line} ${w}`) : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
  });
  if (line) lines.push(line);
  return lines;
}

function panelTexture(p, i) {
  const W = 640, H = 380, pad = 34;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  const cyan = 'rgba(102,230,255,';

  // glass
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(40,120,150,0.30)');
  g.addColorStop(1, 'rgba(10,40,60,0.18)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // scanlines
  ctx.fillStyle = `${cyan}0.05)`;
  for (let y = 0; y < H; y += 6) ctx.fillRect(0, y, W, 2);
  // frame + corner brackets
  ctx.strokeStyle = `${cyan}0.35)`;
  ctx.lineWidth = 2;
  ctx.strokeRect(6, 6, W - 12, H - 12);
  ctx.strokeStyle = `${cyan}0.95)`;
  ctx.lineWidth = 5;
  const b = 34;
  [[6, 6, 1, 1], [W - 6, 6, -1, 1], [6, H - 6, 1, -1], [W - 6, H - 6, -1, -1]].forEach(([x, y, sx, sy]) => {
    ctx.beginPath(); ctx.moveTo(x, y + sy * b); ctx.lineTo(x, y); ctx.lineTo(x + sx * b, y); ctx.stroke();
  });

  // header: index + status
  ctx.font = "600 22px 'Bricolage Grotesque', sans-serif";
  ctx.fillStyle = `${cyan}0.85)`;
  ctx.textBaseline = 'top';
  ctx.fillText(`${String(i + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`, pad, pad);
  const st = STATUS_HEX[p.status] || STATUS_HEX['In Development'];
  ctx.textAlign = 'right';
  ctx.fillStyle = st;
  ctx.fillText(p.status, W - pad, pad);
  ctx.beginPath(); ctx.arc(W - pad - ctx.measureText(p.status).width - 16, pad + 11, 7, 0, Math.PI * 2); ctx.fill();
  ctx.textAlign = 'left';

  // title — condensed display, shrinks for long titles
  try { ctx.fontStretch = 'condensed'; } catch (e) { /* older browsers */ }
  let size = 70;
  let lines;
  do {
    ctx.font = `800 ${size}px 'Bricolage Grotesque', sans-serif`;
    lines = wrap(ctx, p.title, W - pad * 2);
    size -= 4;
  } while ((lines.length > 3 || lines.length * size > 190) && size > 26);
  size += 4;
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(102,230,255,0.9)';
  ctx.shadowBlur = 18;
  const top = 86;
  lines.forEach((l, k) => ctx.fillText(l, pad, top + k * size * 0.98));
  ctx.shadowBlur = 0;
  try { ctx.fontStretch = 'normal'; } catch (e) { /* noop */ }

  // subtitle + stack
  const subY = top + lines.length * size * 0.98 + 10;
  ctx.font = "500 24px 'Bricolage Grotesque', sans-serif";
  ctx.fillStyle = `${cyan}0.95)`;
  wrap(ctx, p.subtitle, W - pad * 2).slice(0, 2).forEach((l, k) => ctx.fillText(l, pad, subY + k * 30));
  ctx.font = "500 20px 'Bricolage Grotesque', sans-serif";
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.textBaseline = 'bottom';
  ctx.fillText(p.technologies.slice(0, 3).join('  /  '), pad, H - pad);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ── radial spider-web floor ─────────────────────────────────────────────── */
function webFloor(radius, spokes, rings) {
  const pts = [];
  for (let s = 0; s < spokes; s++) {
    const a = (s / spokes) * Math.PI * 2;
    pts.push(0, 0, 0, Math.cos(a) * radius, 0, Math.sin(a) * radius);
  }
  for (let r = 1; r <= rings; r++) {
    const rr = (r / rings) * radius;
    for (let s = 0; s < spokes; s++) {
      const a0 = (s / spokes) * Math.PI * 2, a1 = ((s + 1) / spokes) * Math.PI * 2;
      const steps = 6;
      for (let k = 0; k < steps; k++) {
        // each thread sags toward the centre between spokes
        const t0 = k / steps, t1 = (k + 1) / steps;
        const sag = (t) => 1 - 0.09 * Math.sin(Math.PI * t);
        const p = (t) => {
          const a = a0 + (a1 - a0) * t;
          const rad = rr * sag(t);
          return [Math.cos(a) * rad, 0, Math.sin(a) * rad];
        };
        pts.push(...p(t0), ...p(t1));
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: COL.cyan, transparent: true, opacity: 0.16 }));
}

function sagCurve(a, b, sag) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.y -= sag;
  return new THREE.QuadraticBezierCurve3(a, mid, b);
}

export default function Workshop({ telemetry }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const apiRef = useRef({});
  const [booted, setBooted] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;
    const reduced = prefersReducedMotion();
    const narrow = window.matchMedia('(max-width: 767px)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      setWebgl(false);
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.25 : 1.6));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COL.bg);
    scene.fog = new THREE.FogExp2(COL.bg, 0.045);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

    const root = new THREE.Group();
    scene.add(root);
    const disposables = [];
    const track = (o) => { disposables.push(o); return o; };

    /* — power core — */
    const core = new THREE.Group();
    root.add(core);
    const nucleus = new THREE.Mesh(track(new THREE.SphereGeometry(0.48, 48, 48)), track(new THREE.MeshBasicMaterial({ color: 0xdffbff })));
    core.add(nucleus);
    const glowGeo = track(new THREE.SphereGeometry(0.7, 32, 32));
    const glow = new THREE.Mesh(glowGeo, track(new THREE.MeshBasicMaterial({ color: COL.cyan, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false })));
    core.add(glow);
    const shell = new THREE.LineSegments(
      track(new THREE.EdgesGeometry(track(new THREE.IcosahedronGeometry(0.95, 1)))),
      track(new THREE.LineBasicMaterial({ color: COL.cyan, transparent: true, opacity: 0.55 }))
    );
    core.add(shell);
    const ringDefs = [
      { r: 1.35, color: COL.red, tilt: [0.4, 0, 0.2], speed: [0.9, 0.3, 0] },
      { r: 1.62, color: COL.gold, tilt: [-0.9, 0.3, 0], speed: [0, 0.7, 0.4] },
      { r: 1.9, color: COL.cyan, tilt: [Math.PI / 2, 0, 0.5], speed: [0.25, 0, -0.6] },
    ];
    const rings = ringDefs.map((d) => {
      const pivot = new THREE.Group();
      pivot.rotation.set(...d.tilt);
      const ring = new THREE.Mesh(
        track(new THREE.TorusGeometry(d.r, 0.024, 10, 220)),
        track(new THREE.MeshBasicMaterial({ color: d.color }))
      );
      // tick marks around each ring — machined detail
      const ticks = [];
      for (let k = 0; k < 48; k++) {
        const a = (k / 48) * Math.PI * 2;
        const r0 = d.r + 0.05, r1 = d.r + (k % 6 === 0 ? 0.16 : 0.09);
        ticks.push(Math.cos(a) * r0, Math.sin(a) * r0, 0, Math.cos(a) * r1, Math.sin(a) * r1, 0);
      }
      const tg = track(new THREE.BufferGeometry());
      tg.setAttribute('position', new THREE.Float32BufferAttribute(ticks, 3));
      ring.add(new THREE.LineSegments(tg, track(new THREE.LineBasicMaterial({ color: d.color, transparent: true, opacity: 0.6 }))));
      pivot.add(ring);
      core.add(pivot);
      return { pivot, ring, d };
    });
    // particle halo
    const pCount = narrow ? 500 : 1100;
    const pPos = new Float32Array(pCount * 3);
    for (let k = 0; k < pCount; k++) {
      const u = Math.random() * Math.PI * 2, v = Math.acos(2 * Math.random() - 1), rr = 2.3 + Math.random() * 1.4;
      pPos.set([Math.sin(v) * Math.cos(u) * rr, Math.cos(v) * rr * 0.55, Math.sin(v) * Math.sin(u) * rr], k * 3);
    }
    const pGeo = track(new THREE.BufferGeometry());
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const halo = new THREE.Points(pGeo, track(new THREE.PointsMaterial({ color: COL.cyan, size: 0.03, transparent: true, opacity: 0.75, depthWrite: false })));
    core.add(halo);

    /* — web floor — */
    const floor = webFloor(9, 16, 9);
    track(floor.geometry); track(floor.material);
    floor.position.y = -2.25;
    root.add(floor);

    /* — project holograms on web strands — */
    const R = narrow ? 3.3 : 4.7;
    const carousel = new THREE.Group();
    carousel.rotation.x = 0.08;
    root.add(carousel);
    const panelW = narrow ? 1.6 : 1.8, panelH = panelW * (380 / 640);
    const panelGeo = track(new THREE.PlaneGeometry(panelW, panelH));
    const panels = projectsData.map((p, i) => {
      const a = (i / N) * Math.PI * 2;
      const tex = track(panelTexture(p, i));
      const mat = track(new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false, opacity: 0 }));
      const mesh = new THREE.Mesh(panelGeo, mat);
      mesh.userData = { index: i, angle: a, scale: 1 };
      carousel.add(mesh);
      // web strand: core surface → panel top edge, sagging under its own weight
      const strandMat = track(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
      const strandGeo = track(new THREE.BufferGeometry());
      const strand = new THREE.Line(strandGeo, strandMat);
      carousel.add(strand);
      return { mesh, mat, strand, strandGeo, strandMat, a };
    });
    const placePanel = (pnl, radius) => {
      const x = Math.cos(pnl.a) * radius, z = Math.sin(pnl.a) * radius;
      pnl.mesh.position.set(x, 0.15, z);
      pnl.mesh.lookAt(0, 0.15, 0);
      pnl.mesh.rotateY(Math.PI);
      const from = new THREE.Vector3(Math.cos(pnl.a) * 0.5, 0.3, Math.sin(pnl.a) * 0.5);
      const to = new THREE.Vector3(x, 0.15 + panelH / 2, z);
      const pts = sagCurve(from, to, 0.35 + radius * 0.08).getPoints(24);
      pnl.strandGeo.setFromPoints(pts);
    };
    panels.forEach((p) => placePanel(p, 0.01));

    /* — web shots (click on empty space) — */
    const shots = [];
    const shootWeb = (target) => {
      const from = new THREE.Vector3();
      // muzzle: just below the camera, like a wrist-mounted shooter
      camera.getWorldDirection(from);
      const muzzle = camera.position.clone().add(new THREE.Vector3(0.6, -1.4, 0).applyQuaternion(camera.quaternion)).add(from.multiplyScalar(1.2));
      const geo = new THREE.BufferGeometry();
      const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      // splat: short radial threads at the hit point
      const splatPts = [];
      for (let k = 0; k < 9; k++) {
        const a = (k / 9) * Math.PI * 2;
        const len = 0.18 + Math.random() * 0.18;
        splatPts.push(0, 0, 0, Math.cos(a) * len, Math.sin(a) * len, 0);
      }
      const sg = new THREE.BufferGeometry();
      sg.setAttribute('position', new THREE.Float32BufferAttribute(splatPts, 3));
      const splat = new THREE.LineSegments(sg, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
      splat.position.copy(target);
      splat.quaternion.copy(camera.quaternion);
      scene.add(splat);
      shots.push({ line, geo, mat, splat, sg, from: muzzle, to: target.clone(), t: 0 });
    };

    /* — post: bloom — */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.85, 0.5, 0.32);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    /* — sizing — */
    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      bloom.resolution.set(w, h);
      camera.aspect = w / h;
      const aspect = w / h;
      // a little above the orbit, looking down: front holograms sit below the core, rear ones above
      camera.position.set(0, 2.5, aspect < 1 ? 5.4 / Math.max(aspect, 0.45) : 11.2);
      // on tall phone screens aim lower so the core sits in the open band above the HUD
      camera.lookAt(0, aspect < 1 ? -1.35 : -0.3, 0);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* — state — */
    const st = {
      t0: 0, booting: false, booted: false,
      rotY: panels[0].a - Math.PI / 2, vel: 0, target: null,
      pointer: new THREE.Vector2(9, 9), px: 0, py: 0,
      down: null, hovered: null, raf: 0, visible: false, last: performance.now(),
    };
    const ray = new THREE.Raycaster();
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const spinTo = (i) => {
      const goal = panels[i].a - Math.PI / 2; // world angle = a - rotY; the front faces +z (π/2)
      let cur = st.rotY;
      let d = ((goal - cur) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
      st.target = cur + d;
      st.vel = 0;
      st.idleUntil = performance.now() + 8000;
    };
    apiRef.current.spinTo = spinTo;

    const startBoot = () => {
      if (st.booting || st.booted) return;
      st.booting = true;
      st.t0 = performance.now();
      setBooted(true);
    };

    /* — loop — */
    const tick = (now) => {
      const dt = Math.min(50, now - st.last) / 1000;
      st.last = now;
      const bt = st.booting ? (reduced ? 10 : (now - st.t0) / 1000) : 0;

      // boot sequence: core powers up, rings spin up, holograms deploy
      const coreIn = clamp01(bt / 0.9);
      core.scale.setScalar(Math.max(0.001, ease.outBack(coreIn)));
      bloom.strength = 0.25 + 0.6 * ease.outCubic(clamp01(bt / 1.4));
      const spin = 0.15 + 0.85 * ease.outCubic(clamp01(bt / 1.8));
      rings.forEach(({ pivot, d }) => {
        pivot.rotation.x += d.speed[0] * dt * spin * (reduced ? 0.15 : 1);
        pivot.rotation.y += d.speed[1] * dt * spin * (reduced ? 0.15 : 1);
        pivot.rotation.z += d.speed[2] * dt * spin * (reduced ? 0.15 : 1);
      });
      shell.rotation.y -= dt * 0.25 * spin;
      halo.rotation.y += dt * 0.05;
      const pulse = 1 + Math.sin(now / 420) * 0.04;
      nucleus.scale.setScalar(pulse);
      glow.scale.setScalar(1 + Math.sin(now / 420) * 0.12);

      panels.forEach((p, i) => {
        const k = clamp01((bt - 0.9 - i * 0.09) / 0.8);
        const e = ease.outCubic(k);
        placePanel(p, 0.6 + (R - 0.6) * e);
        p.strandMat.opacity = 0.32 * e;
        p.mesh.userData.deploy = e;
      });

      // carousel: inertia, idle drift, or spin-to-target
      if (st.target !== null) {
        st.rotY += (st.target - st.rotY) * Math.min(1, dt * 6);
        if (Math.abs(st.target - st.rotY) < 0.002) { st.rotY = st.target; st.target = null; }
      } else if (!st.down) {
        st.rotY += st.vel;
        st.vel *= 0.94;
        if (!reduced && st.booted && now > (st.idleUntil || 0) && Math.abs(st.vel) < 0.0005 && st.hovered === null) st.rotY += dt * 0.06;
      }
      carousel.rotation.y = st.rotY;

      // panels: face-the-viewer brightness + hover scale
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      const n = new THREE.Vector3();
      panels.forEach((p, i) => {
        n.set(0, 0, 1).applyQuaternion(p.mesh.getWorldQuaternion(new THREE.Quaternion()));
        const facing = -n.dot(camDir); // 1 = facing camera
        const base = 0.07 + 0.88 * clamp01((facing + 0.1) / 0.9);
        const isHot = st.hovered === i;
        p.mat.opacity = base * (p.mesh.userData.deploy || 0) * (isHot ? 1.15 : 1);
        const target = isHot ? 1.14 : 1;
        p.mesh.userData.scale += (target - p.mesh.userData.scale) * Math.min(1, dt * 10);
        p.mesh.scale.setScalar(p.mesh.userData.scale);
      });

      // web shots
      for (let s = shots.length - 1; s >= 0; s--) {
        const sh = shots[s];
        sh.t += dt;
        const ext = clamp01(sh.t / 0.14);
        const head = sh.from.clone().lerp(sh.to, ext);
        const mid = sh.from.clone().lerp(head, 0.5);
        mid.y += 0.25 * (1 - ext) + 0.08;
        sh.geo.setFromPoints(new THREE.QuadraticBezierCurve3(sh.from, mid, head).getPoints(20));
        const fade = 1 - clamp01((sh.t - 0.5) / 0.6);
        sh.mat.opacity = fade;
        sh.splat.material.opacity = ext >= 1 ? fade : 0;
        sh.splat.scale.setScalar(0.6 + 0.4 * clamp01((sh.t - 0.14) / 0.12));
        if (sh.t > 1.15) {
          scene.remove(sh.line); scene.remove(sh.splat);
          sh.geo.dispose(); sh.mat.dispose(); sh.sg.dispose(); sh.splat.material.dispose();
          shots.splice(s, 1);
        }
      }

      // camera parallax
      st.px += ((st.pointer.x > 2 ? 0 : st.pointer.x) * 0.5 - st.px) * Math.min(1, dt * 3);
      st.py += ((st.pointer.y > 2 ? 0 : st.pointer.y) * 0.3 - st.py) * Math.min(1, dt * 3);
      root.rotation.y = st.px * 0.12;
      root.rotation.x = -st.py * 0.06;

      if (bt > 2.6 && !st.booted) st.booted = true;

      composer.render();
      st.raf = st.visible && !document.hidden ? requestAnimationFrame(tick) : 0;
    };
    const run = () => { if (!st.raf && st.visible && !document.hidden) { st.last = performance.now(); st.raf = requestAnimationFrame(tick); } };

    // Visibility is always measured from the element's live position. The observer and the
    // scroll listener only trigger a measurement, so a stale async observer entry can't
    // overwrite a newer result (and jump-scrolls the observer misses are still caught).
    let scrollRaf = 0;
    const checkInView = () => {
      scrollRaf = 0;
      const r = host.getBoundingClientRect();
      const visiblePx = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      const ratio = visiblePx / Math.max(1, r.height);
      st.visible = visiblePx > 0;
      if (ratio > 0.35) startBoot();
      run();
    };
    const onScroll = () => { if (!scrollRaf) scrollRaf = requestAnimationFrame(checkInView); };
    const io = new IntersectionObserver(onScroll, { threshold: [0, 0.35] });
    io.observe(host);
    window.addEventListener('scroll', onScroll, { passive: true });
    checkInView();
    const onVis = () => run();
    document.addEventListener('visibilitychange', onVis);

    /* — input — */
    const setPointer = (e) => {
      const r = canvas.getBoundingClientRect();
      st.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    const pick = () => {
      ray.setFromCamera(st.pointer, camera);
      const hit = ray.intersectObjects(panels.map((p) => p.mesh), false)
        .find((h) => h.object.material.opacity > 0.35);
      return hit ? hit.object.userData.index : null;
    };
    const onMove = (e) => {
      setPointer(e);
      if (st.down) {
        const dx = e.clientX - st.down.x;
        st.down.moved = Math.max(st.down.moved, Math.abs(dx));
        st.vel = (e.clientX - st.down.lastX) * 0.0045;
        st.rotY += st.vel;
        st.down.lastX = e.clientX;
        st.target = null;
        return;
      }
      const h = pick();
      if (h !== st.hovered) { st.hovered = h; setHovered(h); canvas.style.cursor = h !== null ? 'pointer' : 'crosshair'; }
    };
    const onDown = (e) => { setPointer(e); st.down = { x: e.clientX, lastX: e.clientX, moved: 0 }; st.idleUntil = performance.now() + 8000; };
    const onUp = (e) => {
      if (!st.down) return;
      const moved = st.down.moved;
      st.down = null;
      if (moved > 6) return;
      setPointer(e);
      const h = pick();
      if (h !== null) {
        apiRef.current.onPick(h);
      } else {
        ray.setFromCamera(st.pointer, camera);
        const p = new THREE.Vector3();
        if (ray.ray.intersectPlane(floorPlane, p)) shootWeb(p);
      }
    };
    const onLeave = () => { st.pointer.set(9, 9); st.down = null; if (st.hovered !== null) { st.hovered = null; setHovered(null); } };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointerleave', onLeave);

    // first frame even before visible, so the canvas isn't blank
    composer.render();

    return () => {
      cancelAnimationFrame(st.raf);
      st.visible = false;
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(scrollRaf);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      shots.forEach((sh) => { sh.geo.dispose(); sh.mat.dispose(); sh.sg.dispose(); sh.splat.material.dispose(); });
      disposables.forEach((d) => d.dispose && d.dispose());
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  /* picking a hologram: first pick spins it to the front, picking it again opens it */
  const openProject = useCallback((i) => window.dispatchEvent(new CustomEvent('open-project', { detail: i })), []);
  const activeRef = useRef(0);
  const select = useCallback((i) => {
    if (activeRef.current === i && apiRef.current.lastPick === i) openProject(i);
    activeRef.current = i;
    apiRef.current.lastPick = i;
    setActive(i);
    if (apiRef.current.spinTo) apiRef.current.spinTo(i);
  }, [openProject]);
  apiRef.current.onPick = select;

  const shown = projectsData[hovered ?? active];
  const shownIndex = hovered ?? active;

  return (
    <div className={`workshop ${booted ? 'is-booted' : ''} ${webgl ? '' : 'no-webgl'}`} ref={hostRef}>
      <canvas ref={canvasRef} className="workshop__canvas" aria-label="3D workshop: project holograms orbiting a power core. Drag to spin, select a hologram to open it." role="img" />
      <div className="workshop__vignette" aria-hidden="true" />

      <div className="hud" aria-live="polite">
        <div className="hud__corner hud__corner--tl" aria-hidden="true" />
        <div className="hud__corner hud__corner--tr" aria-hidden="true" />
        <div className="hud__corner hud__corner--bl" aria-hidden="true" />
        <div className="hud__corner hud__corner--br" aria-hidden="true" />

        <header className="hud__id">
          <p className="hud__sys"><span className="hud__blink" aria-hidden="true" />Workshop online</p>
          <h2 className="display hud__name">Harish Vardhan</h2>
          <p className="hud__line">Builder, Mark 27</p>
        </header>

        <dl className="hud__telemetry">
          {telemetry.map((t, k) => (
            <div key={t.label} style={{ '--k': k }}>
              <dt>{t.label}</dt>
              <dd className="display">{t.value}</dd>
            </div>
          ))}
        </dl>

        <nav className="hud__index" aria-label="Project holograms">
          <p className="hud__label">Holograms</p>
          <ol>
            {projectsData.map((p, i) => (
              <li key={p.title}>
                <button
                  type="button"
                  className={`hud__item ${i === active ? 'is-active' : ''}`}
                  onClick={() => select(i)}
                  onDoubleClick={() => openProject(i)}
                >
                  <span className="hud__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="hud__title">{p.title.length > 30 ? p.subtitle : p.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <section className="hud__readout" aria-label="Selected project">
          <p className="hud__label">Hologram {shownIndex + 1} of {N}, {shown.status.toLowerCase()}</p>
          <h3 className="display hud__rtitle">{shown.title}</h3>
          <p className="hud__rsub">{shown.subtitle}</p>
          <p className="hud__rtech">{shown.technologies.slice(0, 4).join(' / ')}</p>
          <button type="button" className="hud__open" onClick={() => openProject(shownIndex)}>Open project</button>
        </section>

        <p className="hud__hint" aria-hidden="true">Drag to spin. Tap a hologram to bring it forward, tap it again to open. Tap empty space to shoot a web.</p>
      </div>
    </div>
  );
}
