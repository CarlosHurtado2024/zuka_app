// Cónica viva (geometría analítica, cónicas): una cónica dibujada en el plano con perillas para su
// centro o vértice (h, k) y su forma — radio r; parámetro p y eje de la parábola; semiejes a (horizontal)
// y b (vertical) de la elipse y la hipérbola, y hacia dónde abre esta —. Se ven en vivo los focos (y la
// directriz de la parábola). La meta de cada ronda es que la cónica sea la de la ecuación o los datos.
// Convención: parábola (y − k)² = 4p(x − h) si abre en x, (x − h)² = 4p(y − k) si abre en y.
// params = { rounds: [{ type: 'circ' | 'par' | 'eli' | 'hip', eq: texto, ans: { h, k, r | p, dir | a, b, dir } }] }
// state = { vals: [{ h, k, r, p, a, b, dir }] }

GAMES['conica-viva'] = (() => {
  const RANGE = 8;
  const KEYS = { circ: ['h', 'k', 'r'], par: ['h', 'k', 'p', 'dir'], eli: ['h', 'k', 'a', 'b'], hip: ['h', 'k', 'a', 'b', 'dir'] };
  const keysOf = t => KEYS[t];
  const n = v => String(+(+v).toFixed(3)).replace('-', '−');
  const sq = v => +(v * v).toFixed(4);
  const shift = (s, v) => (v === 0 ? s : `(${s} ${v > 0 ? '−' : '+'} ${n(Math.abs(v))})`);
  const r9 = v => Math.round(v * 1e9) / 1e9 || 0;

  function foci(t, o) {
    if (t === 'circ') return [[o.h, o.k]];
    if (t === 'par') return [o.dir === 'x' ? [o.h + o.p, o.k] : [o.h, o.k + o.p]];
    const c = t === 'eli' ? Math.sqrt(Math.abs(o.a * o.a - o.b * o.b)) : Math.hypot(o.a, o.b);
    const alongX = t === 'eli' ? o.a >= o.b : o.dir === 'x';
    return alongX ? [[r9(o.h - c), o.k], [r9(o.h + c), o.k]] : [[o.h, r9(o.k - c)], [o.h, r9(o.k + c)]];
  }
  function eqText(t, o) {
    const X = shift('x', o.h), Y = shift('y', o.k);
    if (t === 'circ') return `${X}² + ${Y}² = ${n(sq(o.r))}`;
    if (t === 'par') return o.dir === 'x' ? `${Y}² = ${n(4 * o.p)}${X}` : `${X}² = ${n(4 * o.p)}${Y}`;
    const xs = `${X}²/${n(sq(o.a))}`, ys = `${Y}²/${n(sq(o.b))}`;
    if (t === 'eli') return `${xs} + ${ys} = 1`;
    return o.dir === 'x' ? `${xs} − ${ys} = 1` : `${ys} − ${xs} = 1`;
  }
  const meets = (v, r) => !!v && keysOf(r.type).every(k => (k === 'dir' ? v.dir === r.ans.dir : Math.abs(v[k] - r.ans[k]) < 1e-9));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => meets(state.vals[i], r));
    return { ok, solution: params.rounds.map(r => eqText(r.type, r.ans)).join(' · ') };
  }

  const KNOB = {
    h: { name: 'h', step: 1, min: -6, max: 6 }, k: { name: 'k', step: 1, min: -6, max: 6 },
    r: { name: 'r', step: 0.5, min: 0.5, max: 7 }, p: { name: 'p', step: 0.5, min: -4, max: 4 },
    a: { name: 'a↔', step: 1, min: 1, max: 7 }, b: { name: 'b↕', step: 1, min: 1, max: 7 },
  };

  function create(host, params, api) {
    const C = api.palette;
    const vals = params.rounds.map(() => ({ h: 0, k: 0, r: 2, p: 1, a: 3, b: 2, dir: 'x' })), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], view = null, knobs = [];

    function layout() {
      tabs = roundTabs(params.rounds.length);
      const keys = keysOf(params.rounds[cur].type), nRows = Math.ceil(keys.length / 2);
      const side = Math.min(W - 24, H - 96 - nRows * 44 - 16);
      view = planeView({ x: (W - side) / 2, y: 74, w: side, h: side }, [-RANGE, RANGE], [-RANGE, RANGE]);
      const y0 = view.box.y + side + 12, half = (W - 24) / 2;
      knobs = keys.map((key, i) => {
        const x = 12 + (i % 2) * half, y = y0 + Math.floor(i / 2) * 44;
        return key === 'dir'
          ? { key, toggle: { x: x + 4, y, w: half - 8, h: 36 } }
          : { key, x, y, minus: { x: x + 28, y, w: 36, h: 36 }, plus: { x: x + half - 44, y, w: 36, h: 36 }, mid: x + 28 + (half - 44 + 36 - 28) / 2 };
      });
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      function curve(t, o, col, w) {
        const v = view, ctx = p.drawingContext;
        ctx.save(); ctx.beginPath(); ctx.rect(v.box.x, v.box.y, v.box.w, v.box.h); ctx.clip();
        p.noFill(); p.stroke(col); p.strokeWeight(w);
        const path = pts => { p.beginShape(); pts.forEach(([x, y]) => p.vertex(v.X(x), v.Y(y))); p.endShape(); };
        const N = 160;
        if (t === 'circ' || t === 'eli') {
          const ax = t === 'circ' ? o.r : o.a, ay = t === 'circ' ? o.r : o.b;
          path(Array.from({ length: N + 1 }, (_, i) => [o.h + ax * Math.cos(2 * Math.PI * i / N), o.k + ay * Math.sin(2 * Math.PI * i / N)]));
        } else if (t === 'par') {
          const s = Array.from({ length: N + 1 }, (_, i) => -12 + 24 * i / N);
          path(s.map(u => (o.dir === 'x' ? [o.h + u * u / (4 * o.p), o.k + u] : [o.h + u, o.k + u * u / (4 * o.p)])));
        } else {
          const s = Array.from({ length: N + 1 }, (_, i) => -2.6 + 5.2 * i / N);
          [1, -1].forEach(sg => path(s.map(u => (o.dir === 'x' ? [o.h + sg * o.a * Math.cosh(u), o.k + o.b * Math.sinh(u)] : [o.h + o.a * Math.sinh(u), o.k + sg * o.b * Math.cosh(u)]))));
          p.stroke(C.mute); p.strokeWeight(1); p.drawingContext.setLineDash([4, 4]);
          [1, -1].forEach(sg => p.line(v.X(o.h - 20 * o.a), v.Y(o.k - sg * 20 * o.b), v.X(o.h + 20 * o.a), v.Y(o.k + sg * 20 * o.b)));
          p.drawingContext.setLineDash([]);
        }
        if (t === 'par') {
          p.stroke(C.mute); p.strokeWeight(1.5); p.drawingContext.setLineDash([5, 5]);
          if (o.dir === 'x') p.line(v.X(o.h - o.p), v.box.y, v.X(o.h - o.p), v.box.y + v.box.h); else p.line(v.box.x, v.Y(o.k - o.p), v.box.x + v.box.w, v.Y(o.k - o.p));
          p.drawingContext.setLineDash([]);
        }
        ctx.restore(); p.fill(C.bg); p.stroke(C.bg); // p5 guarda el último color: lo resincroniza tras el recorte
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], o = vals[cur], ok = meets(o, r);
        drawTabs(p, C, tabs, cur, i => (locked ? (meets(vals[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); fitText(p, r.eq, W / 2, 52, W - 24, 16);
        drawPlane(p, C, view);
        if (locked && !ok) curve(r.type, r.ans, C.ok, 2.5);
        const col = locked ? (ok ? C.ok : C.bad) : ok ? C.ok : C.brand;
        curve(r.type, o, col, 3);
        p.noStroke(); p.fill(C.ink); p.circle(view.X(o.h), view.Y(o.k), 8);
        if (r.type !== 'circ') foci(r.type, o).forEach(([x, y]) => { p.fill(C.I); p.circle(view.X(x), view.Y(y), 9); });
        p.fill(ok ? C.ok : C.mute); p.textStyle(p.NORMAL); fitText(p, eqText(r.type, o), W / 2, view.box.y + view.box.h - 12, view.box.w - 16, 12);
        knobs.forEach(K => {
          if (K.key === 'dir') {
            const b = K.toggle;
            p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 9);
            p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textStyle(p.BOLD); fitText(p, o.dir === 'x' ? 'abre en x ⇄' : 'abre en y ⇅', b.x + b.w / 2, b.y + b.h / 2, b.w - 8, 14);
            return;
          }
          p.noStroke(); p.fill(C.mute); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(14); p.text(KNOB[K.key].name, K.x + 4, K.y + 18);
          p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); fitText(p, n(o[K.key]), K.mid, K.y + 18, Math.max(16, K.plus.x - K.minus.x - K.minus.w - 2), 16);
          [[K.minus, '−'], [K.plus, '+']].forEach(([b, s]) => {
            p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 9);
            p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textSize(18); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
          });
        });
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; layout(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const o = vals[cur];
        for (const K of knobs) {
          if (K.key === 'dir') { if (hitBox(K.toggle, p.mouseX, p.mouseY)) { o.dir = o.dir === 'x' ? 'y' : 'x'; } else continue; }
          else {
            const d = hitBox(K.minus, p.mouseX, p.mouseY) ? -1 : hitBox(K.plus, p.mouseX, p.mouseY) ? 1 : 0;
            if (!d) continue;
            const S = KNOB[K.key];
            let v = +(o[K.key] + d * S.step).toFixed(3);
            if (K.key === 'p' && v === 0) v = d * S.step;
            o[K.key] = Math.max(S.min, Math.min(S.max, v));
          }
          touched[cur] = true; api.sfx?.tap?.(); api.ready(touched.every(Boolean));
          return false;
        }
      };
    }, 1.62);

    return {
      loaded: m.ready,
      getState: () => ({ vals: vals.map(v => ({ ...v })) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, keysOf, foci, eqText, KNOB };
})();
