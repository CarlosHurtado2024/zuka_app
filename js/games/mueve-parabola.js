// Mueve la parábola (polinomio cuadrático): arriba está la ecuación en forma estándar y abajo una
// parábola propia en una cuadrícula. Se toca o se arrastra sobre la cuadrícula para poner el vértice
// (salta a puntos enteros) y con − / + se cambia a (pasos de 0.5, sin el 0) hasta que la parábola sea
// la de la ecuación. No hay parábola fantasma: el vértice sale de completar el cuadrado.
// params = { rounds: [{ a, b, c }] }   state = { vals: [{ a, h, k }] }

GAMES['mueve-parabola'] = (() => {
  const RANGE = 6;
  const clean = v => { const r = Math.round(v * 1e9) / 1e9; return r === 0 ? 0 : r; };
  const vertexOf = r => ({ h: clean(-r.b / (2 * r.a)), k: clean(r.c - r.b * r.b / (4 * r.a)) });
  const coef = a => (a === 1 ? '' : a === -1 ? '-' : String(a));
  const signed = v => (v > 0 ? ` + ${v}` : v < 0 ? ` - ${-v}` : '');
  function texStd(r) {
    const bx = r.b === 0 ? '' : `${r.b > 0 ? ' + ' : ' - '}${Math.abs(r.b) === 1 ? '' : Math.abs(r.b)}x`;
    return `y = ${coef(r.a)}x^2${bx}${signed(r.c)}`;
  }
  function texVertex(v) {
    const sq = v.h === 0 ? 'x^2' : `(x ${v.h > 0 ? '-' : '+'} ${Math.abs(v.h)})^2`;
    return `y = ${coef(v.a)}${sq}${signed(v.k)}`;
  }
  const txt = s => s.replace(/\^2/g, '²').replace(/ - /g, ' − ').replace(/= -/, '= −').replace(/\(x - /, '(x − ');
  const same = (v, r) => { const t = vertexOf(r); return !!v && v.a === r.a && v.h === t.h && v.k === t.k; };

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.vals[i], r));
    return { ok, solution: params.rounds.map(r => `$${texStd(r)} = ${texVertex({ a: r.a, ...vertexOf(r) }).slice(4)}$`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const vals = params.rounds.map(() => ({ a: 1, h: 0, k: 0 })), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], box = null, minus = null, plus = null;
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      const side = Math.min(w - 24, h - 190);
      box = { x: (w - side) / 2, y: 82, w: side, h: side };
      minus = { x: w - 150, y: box.y + side + 12, w: 44, h: 38 };
      plus = { x: w - 56, y: box.y + side + 12, w: 44, h: 38 };
    }
    const X = x => box.x + (x + RANGE + 0.5) * box.w / (2 * RANGE + 1);
    const Y = y => box.y + (RANGE + 0.5 - y) * box.h / (2 * RANGE + 1);
    const toGrid = (px, py) => ({
      h: Math.max(-RANGE, Math.min(RANGE, Math.round((px - box.x) * (2 * RANGE + 1) / box.w - RANGE - 0.5))),
      k: Math.max(-RANGE, Math.min(RANGE, Math.round(RANGE + 0.5 - (py - box.y) * (2 * RANGE + 1) / box.h))),
    });
    const ready = () => api.ready(touched.every(Boolean));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);
      function fit(s, x, y, sz, maxW) {
        p.textSize(sz);
        while (sz > 9 && p.textWidth(s) > maxW) { sz -= 1; p.textSize(sz); }
        p.text(s, x, y);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], v = vals[cur], good = same(v, r);
        tabs.forEach((t, i) => {
          const ok = same(vals[i], params.rounds[i]);
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        fit(txt(texStd(r)), W / 2, 62, 20, W - 24);

        // Cuadrícula con ejes.
        p.stroke(locked ? (good ? C.ok : C.bad) : C.line); p.strokeWeight(locked ? 2.5 : 1.5); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 10);
        p.strokeWeight(1);
        for (let k = -RANGE; k <= RANGE; k++) {
          p.stroke(k === 0 ? C.mute : C.line);
          p.line(X(k), box.y + 4, X(k), box.y + box.h - 4); p.line(box.x + 4, Y(k), box.x + box.w - 4, Y(k));
        }
        p.noStroke(); p.fill(C.mute); p.textSize(9); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.TOP);
        for (const k of [-4, -2, 2, 4]) {
          const s = String(k).replace('-', '−');
          p.text(s, X(k), Y(0) + 2); p.textAlign(p.RIGHT, p.CENTER); p.text(s, X(0) - 3, Y(k)); p.textAlign(p.CENTER, p.TOP);
        }
        // La parábola propia, recortada a la cuadrícula.
        p.noFill(); p.stroke(locked ? (good ? C.ok : C.bad) : C.I); p.strokeWeight(3);
        p.drawingContext.save(); p.drawingContext.beginPath(); p.drawingContext.rect(box.x, box.y, box.w, box.h); p.drawingContext.clip();
        p.beginShape();
        for (let s = 0; s <= 160; s++) { const x = -RANGE - 0.5 + s * (2 * RANGE + 1) / 160, y = v.a * (x - v.h) ** 2 + v.k; if (Math.abs(y) < 40) p.vertex(X(x), Y(y)); }
        p.endShape();
        p.drawingContext.setLineDash([5, 5]); p.stroke(C.mute); p.strokeWeight(1.5); p.line(X(v.h), box.y, X(v.h), box.y + box.h); p.drawingContext.setLineDash([]);
        p.drawingContext.restore();
        p.noStroke(); p.fill(C.N); p.circle(X(v.h), Y(v.k), 16);
        p.fill(C.bg); p.circle(X(v.h), Y(v.k), 6);

        // a con − / + y la forma canónica en vivo.
        p.noStroke(); p.fill(C.mute); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text('a · abertura', 14, minus.y + 19);
        p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(17); p.text(String(v.a).replace('-', '−'), (minus.x + minus.w + plus.x) / 2, minus.y + 19);
        [[minus, '−'], [plus, '+']].forEach(([b, s]) => {
          p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 9);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textSize(20); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
        });
        p.fill(C.ink); p.textStyle(p.BOLD);
        fit(`${txt(texVertex(v))}   vértice (${v.h}, ${v.k})`.replace(/-(\d)/g, '−$1'), W / 2, minus.y + 62, 15, W - 24);
        if (locked && !good) { p.fill(C.ok); fit(`era ${txt(texVertex({ a: r.a, ...vertexOf(r) }))}`, W / 2, H - 10, 12, W - 24); }
      };

      function moveTo() {
        const g = toGrid(p.mouseX, p.mouseY), v = vals[cur];
        if (g.h !== v.h || g.k !== v.k) { v.h = g.h; v.k = g.k; api.sfx?.tap?.(); }
        touched[cur] = true; ready();
      }
      let dragging = false;
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (inside(box, p.mouseX, p.mouseY)) { dragging = true; moveTo(); return false; }
        const d = inside(minus, p.mouseX, p.mouseY) ? -1 : inside(plus, p.mouseX, p.mouseY) ? 1 : 0;
        if (!d) return;
        const v = vals[cur];
        v.a = Math.max(-3, Math.min(3, v.a + d * 0.5));
        if (v.a === 0) v.a = d * 0.5;   // a = 0 no es parábola: se salta
        touched[cur] = true; api.sfx?.tap?.(); ready();
        return false;
      };
      p.mouseDragged = () => { if (dragging && !locked) { moveTo(); return false; } };
      p.mouseReleased = () => { dragging = false; };
    }, 1.5);

    return {
      loaded: m.ready,
      getState: () => ({ vals: vals.map(v => ({ ...v })) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, vertexOf, texStd, texVertex, RANGE };
})();
