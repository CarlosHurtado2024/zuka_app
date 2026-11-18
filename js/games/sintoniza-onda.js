// Sintoniza la onda (trigonometría, gráficas): en la pantalla de un osciloscopio está la onda fantasma
// (punteada) y la tuya; cada manija (a amplitud, b frecuencia, c desfase en
// cuartos de π, d altura) se mueve tu onda hasta que coincida. Vale cualquier forma equivalente
// (−3 sen(x − π) es 3 sen x). Rondas con pestañas.
// params = { rounds: [{ fn: 'sen' | 'cos', target: { a, b, cq, d }, knobs: ['a', 'b', 'c', 'd'] }] }
// state = { vals: [{ a, b, cq, d }] }   (c = cq · π/4)

GAMES['sintoniza-onda'] = (() => {
  const F = { sen: Math.sin, cos: Math.cos };
  const evalAt = (fn, v, x) => v.a * F[fn](v.b * x - v.cq * Math.PI / 4) + v.d;
  const same = (fn, u, v) => { for (let k = 0; k <= 96; k++) { const x = k * 4 * Math.PI / 96; if (Math.abs(evalAt(fn, u, x) - evalAt(fn, v, x)) > 1e-6) return false; } return true; };
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const num = v => String(v);

  function cTex(cq) {
    const n = Math.abs(cq), g = gcd(n, 4), top = n / g, den = 4 / g;
    if (den === 1) return top === 1 ? '\\pi' : `${top}\\pi`;
    return `\\tfrac{${top === 1 ? '' : top}\\pi}{${den}}`;
  }
  function texOf(fn, v) {
    const f = fn === 'sen' ? '\\operatorname{sen}' : '\\cos';
    const coef = v.a === 1 ? '' : v.a === -1 ? '-' : num(v.a);
    const inner = v.b === 1 ? 'x' : `${num(v.b)}x`;
    const body = v.cq === 0 ? `${f} ${inner}` : `${f}\\left(${inner} ${v.cq > 0 ? '-' : '+'} ${cTex(v.cq)}\\right)`;
    const tail = v.d > 0 ? ` + ${num(v.d)}` : v.d < 0 ? ` - ${num(-v.d)}` : '';
    return `y = ${coef}${body}${tail}`;
  }
  // cq · π/4 escrito simplificado: 2 → π/2, −4 → −π.
  function piTxt(cq) {
    if (cq === 0) return '0';
    const n = Math.abs(cq), g = gcd(n, 4), top = n / g, den = 4 / g;
    return (cq < 0 ? '−' : '') + (den === 1 ? (top === 1 ? 'π' : `${top}π`) : `${top === 1 ? '' : top}π/${den}`);
  }
  // La misma fórmula para el lienzo (sin TeX).
  function txtOf(fn, v) {
    const n = Math.abs(v.cq), g = gcd(n, 4), top = n / g, den = 4 / g;
    const c = den === 1 ? (top === 1 ? 'π' : `${top}π`) : `${top === 1 ? '' : top}π/${den}`;
    const coef = v.a === 1 ? '' : v.a === -1 ? '−' : num(v.a).replace('-', '−');
    const inner = v.b === 1 ? 'x' : `${num(v.b)}x`;
    const body = v.cq === 0 ? `${fn} ${inner}` : `${fn}(${inner} ${v.cq > 0 ? '−' : '+'} ${c})`;
    const tail = v.d > 0 ? ` + ${num(v.d)}` : v.d < 0 ? ` − ${num(-v.d)}` : '';
    return `y = ${coef}${body}${tail}`;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => !!state.vals[i] && same(r.fn, state.vals[i], r.target));
    return { ok, solution: params.rounds.map(r => `$${texOf(r.fn, r.target)}$`).join(' · ') };
  }

  const KNOBS = {
    a: { key: 'a', step: 0.5, min: -3, max: 3, name: 'a · amplitud' },
    b: { key: 'b', step: 0.5, min: 0.5, max: 4, name: 'b · frecuencia' },
    c: { key: 'cq', step: 1, min: -8, max: 8, name: 'c · fase' },
    d: { key: 'd', step: 0.5, min: -2, max: 2, name: 'd · altura' },
  };

  function create(host, params, api) {
    const C = api.palette;
    const st = { vals: params.rounds.map(() => ({ a: 1, b: 1, cq: 0, d: 0 })) };
    const touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], scr = null, rows = [], drag = null;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(params.rounds.length, w);
      scr = { x: 12, y: 48, w: w - 24, h: Math.min(h * .62, h - 97 - 38 * params.rounds[cur].knobs.length) };
      const y0 = scr.y + scr.h + 52;
      rows = params.rounds[cur].knobs.map((k, i) => {
        const K = KNOBS[k];
        return { k, rail: practiceTrack(113, w - 59, y0 + i * 34, K.min, K.max, K.step) };
      });
    }
    const ready = () => api.ready(touched.every(Boolean));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function wave(fn, v, col, weight, dashed) {
        const X = x => scr.x + 10 + (x / (2 * Math.PI)) * (scr.w - 20), Y = y => scr.y + scr.h / 2 - y * (scr.h - 16) / 8;
        p.noFill(); p.stroke(col); p.strokeWeight(weight);
        if (dashed) p.drawingContext.setLineDash([7, 6]);
        p.beginShape();
        for (let k = 0; k <= 160; k++) { const x = k * 2 * Math.PI / 160; p.vertex(X(x), Math.max(scr.y + 2, Math.min(scr.y + scr.h - 2, Y(evalAt(fn, v, x))))); }
        p.endShape(); p.drawingContext.setLineDash([]);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], v = st.vals[cur], good = same(r.fn, v, r.target);
        drawTabs(p, C, tabs, cur, i => {
          const ok = same(params.rounds[i].fn, st.vals[i], params.rounds[i].target);
          return locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
        });
        // Pantalla del osciloscopio: cuadrícula, eje y las dos ondas.
        drawPracticePanel(p, scr, C.card, good ? C.ok : locked ? C.bad : C.line, 12);
        p.stroke(C.line); p.strokeWeight(1);
        for (let k = 1; k < 4; k++) { const x = scr.x + 10 + k * (scr.w - 20) / 4; p.line(x, scr.y + 6, x, scr.y + scr.h - 6); }
        for (let k = -3; k <= 3; k++) { const y = scr.y + scr.h / 2 - k * (scr.h - 16) / 8; p.stroke(k === 0 ? C.mute : C.line); p.line(scr.x + 6, y, scr.x + scr.w - 6, y); }
        p.noStroke(); p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.TOP);
        ['π/2', 'π', '3π/2'].forEach((t, k) => p.text(t, scr.x + 10 + (k + 1) * (scr.w - 20) / 4, scr.y + scr.h / 2 + 3));
        p.textAlign(p.LEFT, p.CENTER); p.text('3', scr.x + 4, scr.y + scr.h / 2 - 3 * (scr.h - 16) / 8); p.text('−3', scr.x + 4, scr.y + scr.h / 2 + 3 * (scr.h - 16) / 8);
        wave(r.fn, r.target, C.mute, 3, true);
        wave(r.fn, v, locked ? (good ? C.ok : C.bad) : r.fn === 'sen' ? C.I : C.Z, 3.5, false);
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(17); p.fill(good ? C.ok : C.ink);
        fitText(p, `$${texOf(r.fn, v)}$`, W / 2, scr.y + scr.h + 21, W - 34, 17, 27);
        rows.forEach(row => {
          const K = KNOBS[row.k], val = v[K.key];
          drawPracticeTrack(p, C, row.rail, val, K.name, row.k === 'c' ? piTxt(val) : negTxt(val), C.brand, drag === row);
        });
        if (locked && !good) { p.noStroke(); p.fill(C.ok); p.textSize(12); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.text(`era ${txtOf(r.fn, r.target)}`, W / 2, H - 12); }
      };

      const move = x => {
        const K = KNOBS[drag.k], v = st.vals[cur];
        let next = drag.rail.value(x);
        if (K.key === 'a' && next === 0) next = x < drag.rail.x(0) ? -K.step : K.step;
        if (!touched[cur] || next !== v[K.key]) {
          v[K.key] = next; touched[cur] = true; api.sfx?.tap?.(); ready();
        }
      };
      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const t = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; drag = null; layout(W, H); api.sfx?.tap?.(); return false; }
        if (locked) return;
        drag = rows.find(row => row.rail.hit(p.mouseX, p.mouseY));
        if (drag) { move(p.mouseX); return false; }
      };
      p.mouseDragged = () => { if (drag && !locked) { move(p.mouseX); return false; } };
      p.mouseReleased = () => { drag = null; };
    }, 1.35, () => {
      if (locked || !rows.length) return null;
      return rows[0].rail.gesture(st.vals[cur][KNOBS[rows[0].k].key]);
    });

    return {
      loaded: m.ready,
      getState: () => ({ vals: st.vals.map(v => ({ ...v })) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      demo: m.demo,
      peek: () => ({ W, H, rails: rows.map(({ k, rail }) => ({ key: KNOBS[k].key, from: { x: rail.x(st.vals[cur][KNOBS[k].key]), y: rail.y }, to: { x: rail.x(params.rounds[cur].target[KNOBS[k].key]), y: rail.y } })) }),
    };
  }

  return { grade, create, texOf, demo: true };
})();
