import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './ui';

/*
  A living neural network drawn in ink. Nodes are real skills grouped around
  their domain hubs; signals travel along edges and make neurons fire, the way
  the VR neural-network project does. Pointer proximity excites neurons and a
  click sends a cascade. Pure canvas 2D with a small 3D projection — no deps.
*/

const INK = [28, 19, 33];
const PAPER = [247, 240, 248];
const SPARK = [242, 222, 69];

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function buildGraph(clusters, fillerCount, seed) {
  const rand = seeded(seed);
  const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;
  const nodes = [];
  const n = clusters.length;
  // cluster hubs on a golden-angle sphere
  clusters.forEach((c, i) => {
    const y = 1 - (i + 0.5) * (2 / n);
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.399963;
    const hub = { x: Math.cos(th) * r * 0.66, y: y * 0.5, z: Math.sin(th) * r * 0.66, kind: 'hub', label: c.title, cluster: i };
    nodes.push(hub);
    c.skills.forEach((s) => {
      nodes.push({
        x: hub.x + gauss() * 0.3, y: hub.y + gauss() * 0.24, z: hub.z + gauss() * 0.3,
        kind: 'skill', label: s, cluster: i,
      });
    });
  });
  for (let i = 0; i < fillerCount; i++) {
    const u = rand() * Math.PI * 2, v = Math.acos(2 * rand() - 1), rr = 0.55 + rand() * 0.6;
    nodes.push({ x: Math.sin(v) * Math.cos(u) * rr * 1.15, y: Math.cos(v) * rr * 0.62, z: Math.sin(v) * Math.sin(u) * rr, kind: 'filler', cluster: -1 });
  }

  const edges = [];
  const key = new Set();
  const add = (a, b) => {
    if (a === b) return;
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (key.has(k)) return;
    key.add(k);
    edges.push([a, b]);
  };
  const d2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
  nodes.forEach((nd, i) => {
    if (nd.kind === 'skill') {
      const hubIndex = nodes.findIndex((m) => m.kind === 'hub' && m.cluster === nd.cluster);
      add(i, hubIndex);
    }
    const near = nodes
      .map((m, j) => [j, d2(nd, m)])
      .filter(([j]) => j !== i)
      .sort((a, b) => a[1] - b[1])
      .slice(0, nd.kind === 'filler' ? 2 : 1);
    near.forEach(([j]) => add(i, j));
  });
  // hubs talk to each other — the domains are connected
  const hubs = nodes.map((m, i) => (m.kind === 'hub' ? i : -1)).filter((i) => i >= 0);
  hubs.forEach((h, i) => { add(h, hubs[(i + 1) % hubs.length]); add(h, hubs[(i + 2) % hubs.length]); });

  const adj = nodes.map(() => []);
  edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  return { nodes, edges, adj };
}

export default function NeuralField({
  clusters,
  filler = 46,
  center = [0.62, 0.48],
  scale = 0.46,
  originRef,
  originAt = [0.5, 0.5],
  interactionRef,
  showLabels = true,
  labelMinX = 0,
  quiet = false,
  seed = 27,
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    const { nodes, edges, adj } = buildGraph(clusters, filler, seed);

    let W = 0, H = 0, dpr = 1;
    let origin = null;
    const fontStack = "'Bricolage Grotesque', system-ui, sans-serif";

    const state = {
      t0: performance.now(),
      angle: 0.6,
      rx: 0, ry: 0, trx: 0, try: 0,
      pointer: null,
      pulses: [],
      nextSpontaneous: 900,
      running: true,
      visible: true,
      raf: 0,
      last: performance.now(),
    };
    nodes.forEach((nd, i) => {
      nd.fire = 0;
      nd.lastFired = -1e9;
      nd.delay = reduced ? 0 : 80 + (i % 17) * 38 + Math.random() * 260;
      nd.sx = 0; nd.sy = 0; nd.sz = 0; nd.k = 1;
    });

    const measure = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      if (originRef && originRef.current) {
        const o = originRef.current.getBoundingClientRect();
        origin = { x: o.left - r.left + o.width * originAt[0], y: o.top - r.top + o.height * originAt[1] };
      } else {
        origin = { x: W * center[0], y: H * center[1] };
      }
    };

    const project = (now) => {
      const S = Math.min(W, H * 1.35) * scale;
      const cx = W * center[0], cy = H * center[1];
      const ca = Math.cos(state.angle + state.ry), sa = Math.sin(state.angle + state.ry);
      const cb = Math.cos(state.rx), sb = Math.sin(state.rx);
      const elapsed = now - state.t0;
      for (const nd of nodes) {
        let x = nd.x * ca - nd.z * sa;
        let z = nd.x * sa + nd.z * ca;
        let y = nd.y * cb - z * sb;
        z = nd.y * sb + z * cb;
        const k = 2.8 / (2.8 + z);
        let px = cx + x * k * S, py = cy + y * k * S;
        const g = reduced ? 1 : Math.min(1, Math.max(0, (elapsed - nd.delay) / 1300));
        const e = 1 - Math.pow(1 - g, 3);
        nd.grow = e;
        if (origin && e < 1) {
          px = origin.x + (px - origin.x) * e;
          py = origin.y + (py - origin.y) * e;
        }
        nd.sx = px; nd.sy = py; nd.sz = z; nd.k = k;
      }
    };

    const fire = (i, strength, from = -1, now = performance.now()) => {
      const nd = nodes[i];
      if (now - nd.lastFired < 260) return;
      nd.lastFired = now;
      nd.fire = Math.min(1, nd.fire + 0.6 + strength * 0.4);
      if (strength < 0.22) return;
      for (const j of adj[i] || []) {
        if (j === from) continue;
        if (Math.random() < 0.62 && state.pulses.length < 90) {
          state.pulses.push({ a: i, b: j, t: 0, v: 0.0011 + Math.random() * 0.0009, s: strength * 0.74 });
        }
      }
    };

    const nearest = (x, y, maxD) => {
      let best = -1, bd = maxD * maxD;
      nodes.forEach((nd, i) => {
        const d = (nd.sx - x) ** 2 + (nd.sy - y) ** 2;
        if (d < bd && nd.grow > 0.9) { bd = d; best = i; }
      });
      return best;
    };

    const draw = (now) => {
      const dt = Math.min(48, now - state.last);
      state.last = now;
      if (!reduced) state.angle += dt * 0.00005;
      state.rx += (state.trx - state.rx) * 0.05;
      state.ry += (state.try - state.ry) * 0.05;
      project(now);

      // the laptop (origin) stays wired to the two lowest hubs
      const anchored = !!(originRef && origin);
      const anchorTargets = anchored
        ? nodes.map((nd, i) => [i, nd]).filter(([, nd]) => nd.kind === 'hub').sort((a, b) => b[1].sy - a[1].sy).slice(0, 2).map(([i]) => i)
        : [];
      const anchor = anchored ? { sx: origin.x, sy: origin.y, sz: 0, grow: 1, fire: 0 } : null;

      // spontaneous activity keeps the network alive — some of it fed from the laptop
      if (!reduced && now - state.t0 > 2000) {
        state.nextSpontaneous -= dt;
        if (state.nextSpontaneous <= 0) {
          if (anchored && Math.random() < 0.45) {
            const target = anchorTargets[Math.floor(Math.random() * anchorTargets.length)];
            state.pulses.push({ a: -1, b: target, t: 0, v: 0.0009, s: 1 });
          } else {
            fire(Math.floor(Math.random() * nodes.length), quiet ? 0.6 : 0.9, -1, now);
          }
          state.nextSpontaneous = (quiet ? 1600 : 1000) + Math.random() * 900;
        }
      }

      // pulses advance
      const arrived = [];
      state.pulses = state.pulses.filter((p) => {
        p.t += p.v * dt;
        if (p.t >= 1) { arrived.push(p); return false; }
        return true;
      });
      arrived.forEach((p) => fire(p.b, p.s, p.a, now));
      const at = (i) => (i === -1 ? anchor : nodes[i]);

      nodes.forEach((nd) => { nd.fire = Math.max(0, nd.fire - dt * 0.0011); });

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // edges
      ctx.lineCap = 'round';
      for (const [a, b] of edges) {
        const A = nodes[a], B = nodes[b];
        const g = Math.min(A.grow, B.grow);
        if (g <= 0.02) continue;
        const depth = 1 - ((A.sz + B.sz) / 2 + 1.2) / 2.4;
        const heat = Math.max(A.fire, B.fire);
        ctx.strokeStyle = rgba(INK, (0.1 + depth * 0.22 + heat * 0.35) * g * (quiet ? 0.7 : 1));
        ctx.lineWidth = 0.6 + depth * 0.7 + heat * 0.8;
        ctx.beginPath();
        ctx.moveTo(A.sx, A.sy);
        ctx.lineTo(A.sx + (B.sx - A.sx) * g, A.sy + (B.sy - A.sy) * g);
        ctx.stroke();
      }

      // cables from the laptop screen into the network
      if (anchored) {
        const g = Math.min(1, Math.max(0, (now - state.t0 - 900) / 900));
        ctx.strokeStyle = rgba(INK, 0.55 * g);
        ctx.lineWidth = 1.4;
        ctx.setLineDash([5, 5]);
        for (const i of anchorTargets) {
          const B = nodes[i];
          ctx.beginPath(); ctx.moveTo(anchor.sx, anchor.sy);
          ctx.lineTo(anchor.sx + (B.sx - anchor.sx) * g, anchor.sy + (B.sy - anchor.sy) * g);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.fillStyle = rgba(INK, g);
        ctx.beginPath(); ctx.arc(anchor.sx, anchor.sy, 3.5, 0, Math.PI * 2); ctx.fill();
      }

      // travelling signals
      for (const p of state.pulses) {
        const A = at(p.a), B = nodes[p.b];
        const x = A.sx + (B.sx - A.sx) * p.t, y = A.sy + (B.sy - A.sy) * p.t;
        const tx = A.sx + (B.sx - A.sx) * Math.max(0, p.t - 0.18), ty = A.sy + (B.sy - A.sy) * Math.max(0, p.t - 0.18);
        ctx.strokeStyle = rgba(INK, 0.85);
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = rgba(SPARK, 1);
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.stroke();
      }

      // neurons, far to near
      const order = nodes.map((_, i) => i).sort((i, j) => nodes[j].sz - nodes[i].sz);
      const ptr = state.pointer;
      for (const i of order) {
        const nd = nodes[i];
        if (nd.grow <= 0.01) continue;
        const base = nd.kind === 'hub' ? 5.2 : nd.kind === 'skill' ? 3.3 : 1.7;
        const r = base * nd.k * (0.6 + 0.4 * nd.grow) + nd.fire * 2.2;
        const depth = 1 - (nd.sz + 1.2) / 2.4;
        if (nd.fire > 0.05) {
          ctx.strokeStyle = rgba(INK, nd.fire * 0.5);
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(nd.sx, nd.sy, r + 4 + (1 - nd.fire) * 10, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.fillStyle = rgba(mix(PAPER, SPARK, Math.min(1, nd.fire * 1.4)), nd.kind === 'filler' ? 0.9 : 1);
        ctx.strokeStyle = rgba(INK, (0.45 + depth * 0.55) * nd.grow);
        ctx.lineWidth = nd.kind === 'hub' ? 1.6 : 1.1;
        ctx.beginPath(); ctx.arc(nd.sx, nd.sy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        if (nd.kind === 'hub') {
          ctx.fillStyle = rgba(INK, 0.9 * nd.grow);
          ctx.beginPath(); ctx.arc(nd.sx, nd.sy, r * 0.38, 0, Math.PI * 2); ctx.fill();
        }

        if (!showLabels || nd.kind === 'filler' || nd.sx < W * labelMinX) continue;
        let a = nd.fire;
        if (ptr) {
          const d = Math.hypot(nd.sx - ptr.x, nd.sy - ptr.y);
          a = Math.max(a, 1 - d / 120);
        }
        if (nd.kind === 'hub') a = Math.max(a, 0.62 * nd.grow);
        a *= 0.35 + 0.65 * depth;
        if (a <= 0.04) continue;
        const size = nd.kind === 'hub' ? 15 : 13;
        ctx.font = `${nd.kind === 'hub' ? 700 : 500} ${size}px ${fontStack}`;
        ctx.fillStyle = rgba(INK, Math.min(1, a));
        ctx.textBaseline = 'middle';
        const lx = nd.sx + r + 7;
        // paper knock-out keeps labels legible over lines
        const w = ctx.measureText(nd.label).width;
        ctx.save();
        ctx.globalAlpha = Math.min(1, a) * (nd.kind === 'hub' ? 0.0 : 0.75);
        ctx.fillStyle = rgba([228, 166, 239], 1);
        ctx.fillRect(lx - 3, nd.sy - size * 0.62, w + 6, size * 1.24);
        ctx.restore();
        ctx.fillText(nd.label, lx, nd.sy + 1);
      }

      if (state.running && state.visible) state.raf = requestAnimationFrame(draw);
      else state.raf = 0;
    };

    const start = () => {
      if (!state.raf && state.running && state.visible) {
        state.last = performance.now();
        state.raf = requestAnimationFrame(draw);
      }
    };

    measure();
    start();

    const ro = new ResizeObserver(() => { measure(); if (!state.raf) draw(performance.now()); });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => { state.visible = e.isIntersecting; start(); }, { threshold: 0 });
    io.observe(canvas);

    const onVis = () => { state.running = !document.hidden; start(); };
    document.addEventListener('visibilitychange', onVis);

    const local = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientY >= r.top && e.clientY <= r.bottom };
    };
    const onMove = (e) => {
      const p = local(e);
      if (!p.inside) { state.pointer = null; state.trx = 0; state.try = 0; return; }
      state.pointer = p;
      if (!reduced) {
        state.try = (p.x / W - 0.5) * 0.6;
        state.trx = (p.y / H - 0.5) * 0.35;
      }
      const i = nearest(p.x, p.y, 34);
      if (i >= 0 && nodes[i].fire < 0.2) fire(i, 0.55);
    };
    const onLeave = () => { state.pointer = null; };
    const onDown = (e) => {
      if (e.target.closest && e.target.closest('a, button, input, textarea')) return;
      const p = local(e);
      if (!p.inside) return;
      const i = nearest(p.x, p.y, 160);
      if (i >= 0) { nodes[i].lastFired = -1e9; fire(i, 1.25); }
    };
    const host = (interactionRef && interactionRef.current) || canvas;
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointerdown', onDown);
    // fonts change label metrics once loaded
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!state.raf) draw(performance.now()); });

    return () => {
      state.running = false;
      cancelAnimationFrame(state.raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onDown);
    };
  }, [clusters, filler, center, scale, originRef, originAt, interactionRef, showLabels, labelMinX, quiet, seed]);

  return <canvas ref={canvasRef} className={`neural ${className}`} aria-hidden="true" />;
}
