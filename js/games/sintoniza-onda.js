// Sintoniza la onda (trigonometría, gráficas): en la pantalla de un osciloscopio está la onda fantasma
// (punteada) y la tuya; con los botones − y + de cada perilla (a amplitud, b frecuencia, c desfase en
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
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], scr = null, rows = [], glow = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      scr = { x: 12, y: 48, w: w - 24, h: h * 0.44 };
      const knobs = params.rounds[cur].knobs, rh = 40, y0 = scr.y + scr.h + 44;
      rows = knobs.map((k, i) => ({ k, y: y0 + i * (rh + 6), minus: { x: w - 150, y: y0 + i * (rh + 6), w: 40, h: rh - 4 }, plus: { x: w - 52, y: y0 + i * (rh + 6), w: 40, h: rh - 4 } }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
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
        tabs.forEach((t, i) => {
          const ok = same(params.rounds[i].fn, st.vals[i], params.rounds[i].target);
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : ok ? C.Q : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        // Pantalla del osciloscopio: cuadrícula, eje y las dos ondas.
        glow = good ? Math.min(1, glow + 0.08) : Math.max(0, glow - 0.08);
        p.stroke(good || (locked && good) ? C.ok : locked ? C.bad : C.line); p.strokeWeight(2 + 2 * glow); p.fill(C.card); p.rect(scr.x, scr.y, scr.w, scr.h, 12);
        p.stroke(C.line); p.strokeWeight(1);
        for (let k = 1; k < 4; k++) { const x = scr.x + 10 + k * (scr.w - 20) / 4; p.line(x, scr.y + 6, x, scr.y + scr.h - 6); }
        for (let k = -3; k <= 3; k++) { const y = scr.y + scr.h / 2 - k * (scr.h - 16) / 8; p.stroke(k === 0 ? C.mute : C.line); p.line(scr.x + 6, y, scr.x + scr.w - 6, y); }
        p.noStroke(); p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.TOP);
        ['π/2', 'π', '3π/2'].forEach((t, k) => p.text(t, scr.x + 10 + (k + 1) * (scr.w - 20) / 4, scr.y + scr.h / 2 + 3));
        p.textAlign(p.LEFT, p.CENTER); p.text('3', scr.x + 4, scr.y + scr.h / 2 - 3 * (scr.h - 16) / 8); p.text('−3', scr.x + 4, scr.y + scr.h / 2 + 3 * (scr.h - 16) / 8);
        wave(r.fn, r.target, C.mute, 3, true);
        wave(r.fn, v, locked ? (good ? C.ok : C.bad) : r.fn === 'sen' ? C.I : C.Z, 3.5, false);
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(17); p.fill(good ? C.ok : C.ink);
        p.text(txtOf(r.fn, v), W / 2, scr.y + scr.h + 20);
        if (good && !locked) { p.fill(C.ok); p.textSize(12); p.text('¡Sintonizada!', scr.x + scr.w - 48, scr.y + 14); }
        // Perillas.
        rows.forEach(row => {
          const K = KNOBS[row.k], val = v[K.key];
          p.noStroke(); p.fill(C.mute); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(K.name, 14, row.y + 18);
          p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(16);
          p.text(row.k === 'c' ? piTxt(val) : String(val).replace('-', '−'), W - 81, row.y + 18);
          [[row.minus, '−'], [row.plus, '+']].forEach(([b, t]) => {
            p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 9);
            p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textSize(18); p.text(t, b.x + b.w / 2, b.y + b.h / 2);
          });
        });
        if (locked && !good) { p.noStroke(); p.fill(C.ok); p.textSize(12); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.text(`era ${txtOf(r.fn, r.target)}`, W / 2, H - 12); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; layout(W, H); api.sfx?.tap?.(); return false; }
        if (locked) return;
        for (const row of rows) {
          const K = KNOBS[row.k], v = st.vals[cur];
          const d = inside(row.minus, p.mouseX, p.mouseY) ? -1 : inside(row.plus, p.mouseX, p.mouseY) ? 1 : 0;
          if (!d) continue;
          v[K.key] = Math.max(K.min, Math.min(K.max, +(v[K.key] + d * K.step).toFixed(2)));
          if (K.key === 'a' && v.a === 0) v.a = d * K.step;   // la amplitud 0 borra la onda: se salta
          touched[cur] = true; api.sfx?.tap?.(); ready();
          return false;
        }
      };
    }, 1.35);

    return {
      loaded: m.ready,
      getState: () => ({ vals: st.vals.map(v => ({ ...v })) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, texOf };
})();
