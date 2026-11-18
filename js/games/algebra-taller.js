// Las escenas operan sobre el mismo estado que se comprueba. El gesto de ayuda no lo modifica.
const ALG_TALLER = (() => {
  const modes = {};
  const bound = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const step = (v, lo, hi, d = 1) => +bound(lo + Math.round((v - lo) / d) * d, lo, hi).toFixed(6);
  const eq = (a, b) => Math.abs(a - b) < 1e-6;
  const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
  const point = (x, y) => ({ x, y });
  const gap = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const box = (x, y, w, h) => ({ x, y, w, h });
  const inside = (q, b) => hitBox(b, q.x, q.y);
  const center = b => point(b.x + b.w / 2, b.y + b.h / 2);
  const normal = (v, a, b) => (v - a) / (b - a);
  const color = (p, value, alpha) => { const c = p.color(value); c.setAlpha(alpha); return c; };
  const stroke = (p, c, w = 1) => { p.noFill(); p.stroke(c); p.strokeWeight(w); };
  const panel = (p, b, ink, fill, radius) => drawPracticePanel(p, b, fill, ink, radius);
  function txt(p, text, x, y, width, tone, size = 14) {
    p.noStroke(); p.fill(tone); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.NORMAL);
    fitText(p, String(text ?? ''), x, y, width, size, 27);
  }
  function handle(p, C, q, active = false) {
    drawPracticeHandle(p, C, q.x, q.y, C.brand, active);
  }
  function line(p, a, b, c, w = 1) {
    stroke(p, c, w); p.line(a.x, a.y, b.x, b.y);
  }
  function dash(p, a, b, c) {
    const ctx = p.drawingContext;
    ctx.setLineDash([4, 4]); line(p, a, b, c); ctx.setLineDash([]);
  }
  function curve(p, pts, c, width = 2) {
    stroke(p, c, width);
    let open = false;
    for (const q of pts) {
      if (q && !open) { p.beginShape(); open = true; }
      if (q) p.vertex(q.x, q.y);
      else if (open) { p.endShape(); open = false; }
    }
    if (open) p.endShape();
  }
  function chip(p, C, b, label, tone) {
    panel(p, b, tone || C.line, C.card, 7);
    txt(p, label, center(b).x, center(b).y, b.w - 8, C.ink, 15);
  }

  function register(mode) {
    const def = modes[mode];
    const answer = r => ({ v: r.goal, moved: true });
    const correct = (s, r) => !!s?.moved && (r.valid || def.valid)(s.v, r);
    const grade = (s, params) => ({
      ok: params.rounds.every((r, i) => correct(s.rounds?.[i], r)),
      solution: params.rounds.map(r => r.solution || r.read(r.goal)).join(' · '),
    });
    function create(host, params, api) {
      const C = api.palette, R = params.rounds;
      const rounds = R.map(r => ({ v: structuredInitial(r.start), moved: false }));
      let cur = 0, G, held = false, locked = false, activated = false, t = 0, reveal = 0, motion = null;
      const input = {};
      let keyboard = false, cursor = null, status;
      const ready = () => api.ready(!motion && rounds.every((s, i) => s.moved && (def.complete?.(s.v, R[i]) ?? true)));
      const set = value => {
        if (value === undefined) return;
        G.s.v = value; G.s.moved = true; ready();
        if (keyboard && status) {
          const message = G.r.read(value);
          if (api.tex) status.innerHTML = api.tex(message);
          else status.textContent = message;
        }
      };
      const press = q => {
        if (locked || motion) return false;
        const tab = G.tabs.findIndex(b => inside(q, b));
        if (tab >= 0) { cur = tab; activated = rounds[cur].moved; reveal = 0; held = false; return true; }
        if (!def.press(G, q, set)) return false;
        activated = true; reveal = 0; held = true; api.sfx?.tap?.();
        return true;
      };
      function release(q, animate = true) {
        if (!held) return;
        held = false;
        if (!animate) { def.cancel?.(G); return; }
        def.release?.(G, q, set);
        if (params.motion && !reducedMotion() && G.s.moved && (def.complete?.(G.s.v, G.r) ?? true)) {
          const route = def.route?.(G) || [point(G.b.x, G.b.y + G.b.h / 2), q];
          motion = { route, since: t };
          ready();
        }
      }
      const sketch = mountSketch(host, (p, size) => {
        const layout = () => {
          const { w: W, h: H } = size, r = R[cur], s = rounds[cur];
          const b = box(16, 43, W - 32, H - 106);
          G = { p, C, W, H, r, s, b, held, locked, input, tabs: R.length > 1 ? roundTabs(R.length, W) : [] };
          def.layout(G);
          return G;
        };
        p.setup = () => {
          p.createCanvas(size.w, size.h); p.textFont('system-ui');
          layout();
          const cv = p.canvas;
          cv.tabIndex = 0;
          cv.setAttribute('aria-label', `Escena de álgebra. ${def.instruction}. Usa las flechas para mover el cursor y espacio para tomar o soltar.`);
          status = document.createElement('output');
          status.className = 'algebra-live';
          status.setAttribute('aria-live', 'polite');
          host.appendChild(status);
          cv.addEventListener('keydown', e => {
            if (!G || locked || motion || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Escape'].includes(e.key)) return;
            if (e.key === 'Escape' && !held) return;
            e.preventDefault(); e.stopPropagation();
            keyboard = true;
            cursor ??= def.demo(G).from;
            if (e.key === 'Escape') release(cursor, false);
            else if (e.key === ' ') { if (held) release(cursor); else press(cursor); }
            else {
              const dx = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
              const dy = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
              if (held && def.key) {
                def.key(G, dx, dy, set);
                def.layout(G);
                cursor = def.demo(G).from;
                return;
              }
              const d = e.shiftKey ? 3 : 12;
              cursor = point(bound(cursor.x + dx * d, 5, G.W - 5), bound(cursor.y + dy * d, 5, G.H - 5));
              if (held) def.drag?.(G, cursor, set);
            }
          });
          cv.addEventListener('blur', () => { if (held && keyboard) release(cursor, false); keyboard = false; cursor = null; });
        };
        p.draw = () => {
          t += frameDt(p);
          const { W, H, r, s, b } = layout();
          p.background(C.bg);
          if (G.tabs.length) drawTabs(p, C, G.tabs, cur, i => i === cur ? C.brand : rounds[i].moved ? C.Z : C.line);
          const instruction = locked ? (correct(s, r) ? 'Construcción correcta' : 'Revisa la relación') : def.instruction;
          txt(p, instruction, W / 2, 23, W - 24, locked && correct(s, r) ? C.ok : C.ink, 14);
          panel(p, b, C.line, color(p, C.card, 125), 12);
          def.draw(G);
          if (motion) {
            const u = Math.min(1, (t - motion.since) / .64), route = motion.route;
            const piece = u * (route.length - 1), i = Math.min(Math.floor(piece), route.length - 2), a = route[i], z = route[i + 1];
            const f = piece - i, q = point(mix(a.x, z.x, f), mix(a.y, z.y, f));
            p.noStroke(); p.fill(color(p, C.brand, 65)); p.circle(q.x, q.y, 27);
            p.fill(C.brand); p.circle(q.x, q.y, 10);
            if (u >= 1) { motion = null; ready(); }
          }
          const demo = !locked && !held && !motion && ((!activated && api.guideAuto !== false && params.autoDemo !== false) || t < reveal);
          if (demo) drawDemo(p, C, reveal > t ? t - (reveal - 2 * DEMO_T) : t, def.demo(G));
          if (keyboard && cursor && !locked) handle(p, C, cursor, held);
          const value = locked && !correct(s, r) ? (r.solution || r.read(r.goal)) : r.read(s.v);
          panel(p, box(16, H - 47, W - 32, 35), C.line, C.card, 8);
          txt(p, value, W / 2, H - 29, W - 48, C.ink, 19);
        };
        p.mousePressed = () => {
          if (!G || !inCanvas(p)) return;
          keyboard = false; cursor = null;
          if (press(point(p.mouseX, p.mouseY))) return false;
        };
        p.mouseDragged = () => {
          if (!held) return;
          def.drag?.(G, point(p.mouseX, p.mouseY), set);
          return false;
        };
        p.mouseReleased = e => { if (held) release(point(p.mouseX, p.mouseY), e?.type !== 'touchcancel'); };
      }, .98);
      return {
        loaded: sketch.ready,
        getState: () => ({ rounds: rounds.map(s => ({ ...s })) }),
        lock() { locked = true; },
        destroy() { status?.remove(); sketch.remove(); },
        demo() { reveal = t + 2 * DEMO_T; },
        peek: () => G && ({ cur, tabs: G.tabs, frame: G.b, demo: def.demo(G), solve: def.solve(G) }),
      };
    }
    return { grade, answer, create, demo: true, algebraScene: true, instruction: def.instruction };
  }
  const structuredInitial = v => Array.isArray(v) ? v.slice() : v;
  return { modes, register, bound, step, eq, same, mix, point, gap, box, inside, center, normal, color, stroke, panel, txt, handle, line, dash, curve, chip };
})();
