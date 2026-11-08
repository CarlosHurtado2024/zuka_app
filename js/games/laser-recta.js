// El láser (cálculo, ecuación de la recta): un rayo láser recto atraviesa el plano y hay dos cristales.
// Tres perillas lo controlan: «sube» y «avanza» (la pendiente m = sube/avanza, que se ve como un
// escalón dibujado en el corte con el eje y) y el corte b con el eje y. Hay que alinearlo para que
// atraviese los dos cristales: entonces brillan. La ecuación y = mx + b se escribe en vivo.
// params = { rounds: [{ P: [x, y], Q: [x, y] }] }   state = { vals: [{ rise, run, b }] }

GAMES['laser-recta'] = (() => {
  const RANGE = 6;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const num = v => String(v).replace('-', '−');
  function lineText(v) {
    const g = gcd(Math.abs(v.rise), v.run) || 1, n = v.rise / g, d = v.run / g;
    const bTxt = v.b > 0 ? ` + ${num(v.b)}` : v.b < 0 ? ` − ${num(-v.b)}` : '';
    if (n === 0) return `y = ${num(v.b)}`;
    const mx = d === 1 ? (n === 1 ? 'x' : n === -1 ? '−x' : `${num(n)}x`) : `${n < 0 ? '−' : ''}${Math.abs(n)}/${d} x`;
    return `y = ${mx}${bTxt}`;
  }
  const hits = (v, P) => Math.abs(P[1] - (v.rise / v.run * P[0] + v.b)) < 1e-9;
  const fits = (v, r) => !!v && hits(v, r.P) && hits(v, r.Q);
  function texOf(r) {
    let n = r.Q[1] - r.P[1], d = r.Q[0] - r.P[0];
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(Math.abs(n), d) || 1; n /= g; d /= g;
    const b = Math.round((r.P[1] - n / d * r.P[0]) * 1e9) / 1e9;
    const m = n === 0 ? '' : d === 1 ? (n === 1 ? 'x' : n === -1 ? '-x' : `${n}x`) : `${n < 0 ? '-' : ''}\\tfrac{${Math.abs(n)}}{${d}}x`;
    const bt = n === 0 ? `${b}` : b > 0 ? ` + ${b}` : b < 0 ? ` - ${-b}` : '';
    return `y = ${m}${bt}`;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => fits(state.vals[i], r));
    return { ok, solution: params.rounds.map(r => `$${texOf(r)}$`).join(' · ') };
  }

  const KNOBS = [
    { key: 'rise', step: 1, min: -6, max: 6, name: 'sube' },
    { key: 'run', step: 1, min: 1, max: 6, name: 'avanza' },
    { key: 'b', step: 0.5, min: -6, max: 6, name: 'corte b' },
  ];

  function create(host, params, api) {
    const C = api.palette;
    const vals = params.rounds.map(() => ({ rise: 1, run: 1, b: 0 })), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], box = null, rows = [];
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const n = 2 * RANGE + 1;
    const X = x => box.x + (x + RANGE + 0.5) / n * box.w, Y = y => box.y + (RANGE + 0.5 - y) / n * box.h;

    function layout() {
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      const side = Math.min(W - 24, H - 200);
      box = { x: (W - side) / 2, y: 76, w: side, h: side };
      const y0 = box.y + side + 10;
      rows = KNOBS.map((k, i) => ({ k, y: y0 + i * 40, minus: { x: W - 150, y: y0 + i * 40, w: 42, h: 34 }, plus: { x: W - 54, y: y0 + i * 40, w: 42, h: 34 } }));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], v = vals[cur], ok = fits(v, r), mm = v.rise / v.run;
        tabs.forEach((tb, i) => {
          const g = fits(vals[i], params.rounds[i]);
          const col = locked ? (g ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(tb.x, tb.y, tb.w, tb.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, tb.x + tb.w / 2, tb.y + tb.h / 2);
        });
        p.noStroke(); p.fill(ok ? C.ok : C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(20); p.text(lineText(v), W / 2, 58);
        // Plano.
        p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 10);
        for (let k = -RANGE; k <= RANGE; k++) { p.stroke(C.line); p.strokeWeight(0.6); p.line(X(k), box.y + 2, X(k), box.y + box.h - 2); p.line(box.x + 2, Y(k), box.x + box.w - 2, Y(k)); }
        p.stroke(C.mute); p.strokeWeight(1.5); p.line(X(0), box.y + 2, X(0), box.y + box.h - 2); p.line(box.x + 2, Y(0), box.x + box.w - 2, Y(0));
        // Rayo (recortado al plano) con resplandor.
        const xa = -RANGE - 0.5, xb = RANGE + 0.5;
        p.drawingContext.save(); p.drawingContext.beginPath(); p.drawingContext.rect(box.x, box.y, box.w, box.h); p.drawingContext.clip();
        const col = locked ? (ok ? C.ok : C.bad) : ok ? C.ok : C.I;
        p.stroke(col); p.strokeWeight(9); p.drawingContext.globalAlpha = 0.25; p.line(X(xa), Y(mm * xa + v.b), X(xb), Y(mm * xb + v.b));
        p.drawingContext.globalAlpha = 1; p.strokeWeight(2.5); p.line(X(xa), Y(mm * xa + v.b), X(xb), Y(mm * xb + v.b));
        // Escalón de la pendiente desde el corte con el eje y.
        p.stroke(C.N); p.strokeWeight(2); p.drawingContext.setLineDash([4, 4]);
        p.line(X(0), Y(v.b), X(v.run), Y(v.b)); p.line(X(v.run), Y(v.b), X(v.run), Y(v.b + v.rise)); p.drawingContext.setLineDash([]);
        p.drawingContext.restore();
        p.noStroke(); p.fill(C.N); p.circle(X(0), Y(v.b), 9);
        // Cristales.
        [r.P, r.Q].forEach(Pt => {
          const x = X(Pt[0]), y = Y(Pt[1]), lit = hits(v, Pt);
          p.stroke(C.ink); p.strokeWeight(1.5); p.fill(lit ? C.ok : C.Z);
          p.quad(x, y - 11, x + 8, y, x, y + 11, x - 8, y);
          p.noStroke(); p.fill(C.ink); p.textSize(11); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.BOTTOM);
          p.text(`(${num(Pt[0])}, ${num(Pt[1])})`, Math.max(box.x + 28, Math.min(box.x + box.w - 28, x)), y - 13);
        });
        if (locked && !ok) { p.noStroke(); p.fill(C.ok); p.textSize(13); p.textAlign(p.CENTER, p.TOP); p.text(`era ${texOf(r).replace(/\\tfrac\{(\d+)\}\{(\d+)\}/, '$1/$2 ').replace(/-/g, '−')}`, W / 2, box.y + box.h - 22); }
        rows.forEach(row => {
          const K = row.k;
          p.noStroke(); p.fill(C.mute); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(K.name, 14, row.y + 17);
          p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(16); p.text(num(v[K.key]), W - 81, row.y + 17);
          [[row.minus, '−'], [row.plus, '+']].forEach(([b, s]) => {
            p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 9);
            p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textSize(18); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
          });
        });
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        for (const row of rows) {
          const d = inside(row.minus, p.mouseX, p.mouseY) ? -1 : inside(row.plus, p.mouseX, p.mouseY) ? 1 : 0;
          if (!d) continue;
          const K = row.k, v = vals[cur];
          v[K.key] = Math.max(K.min, Math.min(K.max, +(v[K.key] + d * K.step).toFixed(2)));
          touched[cur] = true; api.sfx?.tap?.(); api.ready(touched.every(Boolean));
          return false;
        }
      };
    }, 1.6);

    return {
      loaded: m.ready,
      getState: () => ({ vals: vals.map(v => ({ ...v })) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, lineText };
})();
