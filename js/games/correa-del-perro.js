// El perro y la correa (cálculo, valor absoluto): |x − c| < r son los puntos a menos de r del poste c,
// justo hasta donde llega un perro amarrado con una correa de largo r. Se mueve el poste, se estira la
// correa, se elige la zona (🐶 «donde el perro alcanza», adentro, o 🐱 «donde el gato está a salvo»,
// afuera) y si las puntas cuentan (la correa llega justo: ≤, ≥). La zona se pinta en la recta en vivo.
// params = { min, max, rounds: [{ txt, c, r, out, closed }] }   state = { vals: [{ c, r, out, closed }] }

GAMES['correa-del-perro'] = (() => {
  const num = v => String(v).replace('-', '−');
  function setText(v) {
    const L = num(v.c - v.r), R = num(v.c + v.r);
    if (!v.out) return `${v.closed ? '[' : '('}${L}, ${R}${v.closed ? ']' : ')'}`;
    return `(−∞, ${L}${v.closed ? ']' : ')'} ∪ ${v.closed ? '[' : '('}${R}, ∞)`;
  }
  const same = (a, b) => !!a && a.c === b.c && a.r === b.r && !!a.out === !!b.out && !!a.closed === !!b.closed;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.vals[i], r));
    return { ok, solution: params.rounds.map(r => `${r.txt}: ${setText(r)}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, lo = params.min, hi = params.max;
    const vals = params.rounds.map(() => ({ c: 0, r: 1, out: false, closed: false })), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], rows = [], modeBtn = null, endBtn = null, drag = null;
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const X = v => 22 + (v - lo) / (hi - lo) * (W - 44);
    const toV = px => lo + (px - 22) / (W - 44) * (hi - lo);
    const snap = v => Math.round(v * 2) / 2;
    const LY = () => 172;

    function layout() {
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      const y0 = H - 140;
      rows = ['c', 'r'].map((k, i) => ({ k, y: y0 + i * 44, minus: { x: W - 150, y: y0 + i * 44, w: 42, h: 36 }, plus: { x: W - 54, y: y0 + i * 44, w: 42, h: 36 } }));
      const by = H - 46, bw = (W - 32) / 2;
      modeBtn = { x: 12, y: by, w: bw, h: 38 };
      endBtn = { x: 20 + bw, y: by, w: bw, h: 38 };
    }
    const changed = () => { touched[cur] = true; api.sfx?.tap?.(); api.ready(touched.every(Boolean)); };
    function setC(v) { const s = vals[cur]; s.c = Math.max(lo + s.r, Math.min(hi - s.r, snap(v))); }
    function setR(v) { const s = vals[cur]; s.r = Math.max(0.5, Math.min(Math.min(s.c - lo, hi - s.c), snap(v))); }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };
      function fit(s, x, y, sz, maxW) { p.textSize(sz); while (sz > 9 && p.textWidth(s) > maxW) { sz -= 1; p.textSize(sz); } p.text(s, x, y); }
      function btn(b, label, on, col) {
        p.stroke(locked ? C.line : on ? col : C.line); p.strokeWeight(on ? 2.5 : 1.5); p.fill(on ? C.card : C.bg); p.rect(b.x, b.y, b.w, b.h, 10);
        p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); fit(label, b.x + b.w / 2, b.y + b.h / 2, 14, b.w - 10);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], v = vals[cur], good = same(v, r), ly = LY();
        tabs.forEach((tb, i) => {
          const ok = same(vals[i], params.rounds[i]);
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(tb.x, tb.y, tb.w, tb.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, tb.x + tb.w / 2, tb.y + tb.h / 2);
        });
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); fit(r.txt, W / 2, 62, 24, W - 24);

        // Recta, zona pintada y puntas.
        const zone = locked ? (good ? C.ok : C.bad) : v.out ? C.R : C.Q, L = X(v.c - v.r), R = X(v.c + v.r);
        p.stroke(C.line); p.strokeWeight(2); p.line(14, ly, W - 14, ly);
        for (let k = Math.ceil(lo); k <= hi; k++) {
          p.stroke(C.line); p.strokeWeight(1); p.line(X(k), ly - 4, X(k), ly + 4);
          if (k % 2 === 0) { p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(10); p.textAlign(p.CENTER, p.TOP); p.text(num(k), X(k), ly + 8); }
        }
        p.stroke(zone); p.strokeWeight(8);
        if (v.out) { p.line(14, ly, L, ly); p.line(R, ly, W - 14, ly); } else p.line(L, ly, R, ly);
        [L, R].forEach(x => { p.stroke(zone); p.strokeWeight(2.5); p.fill(v.closed ? zone : C.bg); p.circle(x, ly, 15); });
        // Poste, correa (arco) y perro en la punta.
        const pole = X(v.c), rad = R - pole;
        p.noFill(); p.stroke(C.N); p.strokeWeight(2); p.drawingContext.setLineDash([5, 5]);
        p.arc(pole, ly, 2 * rad, 2 * Math.min(rad, 70), Math.PI, 2 * Math.PI); p.drawingContext.setLineDash([]);
        p.stroke(C.ink); p.strokeWeight(4); p.line(pole, ly, pole, ly - 46);
        p.noStroke(); p.fill(C.N); p.circle(pole, ly - 48, 10);
        p.stroke(C.N); p.strokeWeight(2); p.line(pole, ly - 44, R, ly - 10);
        p.noStroke(); p.textAlign(p.CENTER, p.BOTTOM); p.textSize(24); p.text(v.out ? '🐱' : '🐶', v.out ? Math.min(W - 18, R + 22) : R, ly - 6);
        p.fill(C.mute); p.textSize(11); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.TOP); p.text(`poste ${num(v.c)}`, pole, ly + 22);

        p.fill(good && !locked ? C.ok : C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); fit(`zona: ${setText(v)}`, W / 2, ly + 44, 16, W - 24);
        if (locked && !good) { p.fill(C.ok); fit(`era ${setText(r)}`, W / 2, ly + 62, 13, W - 24); }

        rows.forEach(row => {
          p.noStroke(); p.fill(C.mute); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(13);
          p.text(row.k === 'c' ? 'poste (centro)' : 'correa (radio)', 14, row.y + 18);
          p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(16); p.text(num(v[row.k]), W - 81, row.y + 18);
          [[row.minus, '−'], [row.plus, '+']].forEach(([b, s]) => {
            p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 9);
            p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textSize(18); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
          });
        });
        btn(modeBtn, v.out ? '🐱 afuera: a salvo' : '🐶 adentro: alcanza', true, v.out ? C.R : C.Q);
        btn(endBtn, v.closed ? '● puntas incluidas' : '○ puntas excluidas', v.closed, C.N);
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const v = vals[cur], mx = p.mouseX, my = p.mouseY, ly = LY();
        if (inside(modeBtn, mx, my)) { v.out = !v.out; changed(); return false; }
        if (inside(endBtn, mx, my)) { v.closed = !v.closed; changed(); return false; }
        for (const row of rows) {
          const d = inside(row.minus, mx, my) ? -0.5 : inside(row.plus, mx, my) ? 0.5 : 0;
          if (!d) continue;
          if (row.k === 'c') setC(v.c + d); else setR(v.r + d);
          changed(); return false;
        }
        if (Math.abs(my - ly) < 60) {
          drag = Math.abs(mx - X(v.c + v.r)) < 22 || Math.abs(mx - X(v.c - v.r)) < 22 ? 'r' : Math.abs(mx - X(v.c)) < 26 ? 'c' : null;
          if (drag) return false;
        }
      };
      p.mouseDragged = () => {
        if (!drag || locked) return;
        const v = vals[cur], x = toV(p.mouseX), old = `${v.c},${v.r}`;
        if (drag === 'c') setC(x); else setR(Math.abs(x - v.c));
        if (`${v.c},${v.r}` !== old) changed();
        return false;
      };
      p.mouseReleased = () => { drag = null; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ vals: vals.map(v => ({ ...v })) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, setText };
})();
