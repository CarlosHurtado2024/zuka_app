// Pisa las huellas (Álgebra, progresiones aritméticas). Un caminante da pasos iguales sobre la recta: el paso 1 cae
// en a₁ y cada paso avanza d (o retrocede, si d es negativo). Dos banderas marcan dónde cayeron dos pasos conocidos.
// Con − / + se fijan a₁ y d; las huellas numeradas se mueven en vivo. Gana cuando las dos huellas pisan sus banderas:
// aₖ = a₁ + (k − 1)d.
// params = { rounds: [{ known: [[k, valor], [k, valor]], a1, d }] }   state = { ans: [[a1, d] | null por ronda] }

GAMES['pisa-huellas'] = (() => {
  const termAt = (a1, d, k) => a1 + (k - 1) * d;
  const okRound = (a, r) => Array.isArray(a) && r.known.every(([k, v]) => termAt(a[0], a[1], k) === v);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okRound(state.ans?.[i], r));
    return { ok, solution: params.rounds.map(r => `a₁ = ${r.a1}, d = ${r.d}`.replace(/-/g, '−')).join(' · ') };
  }

  const neg = v => String(v).replace('-', '−');

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const A = R.map(() => ({ a1: 0, d: 1, touched: false }));
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], B = {};

    function layout(w, h) {
      W = w; H = h; tabs = roundTabs(R.length, w);
      const bw = 44, y1 = h - 92, y2 = h - 48;
      B = { aM: { x: w - 2 * bw - 22, y: y1, w: bw, h: 36 }, aP: { x: w - bw - 12, y: y1, w: bw, h: 36 },
        dM: { x: w - 2 * bw - 22, y: y2, w: bw, h: 36 }, dP: { x: w - bw - 12, y: y2, w: bw, h: 36 } };
    }
    function change(f) {
      if (locked) return;
      const a = A[cur]; f(a); a.touched = true;
      api.ready(A.every(x => x.touched)); api.sfx?.tap?.();
    }
    // Rango de la recta: los pasos correctos con un margen (las huellas que se salen quedan en el borde).
    // La recta abarca las banderas y las huellas actuales, para que ninguna se amontone en un borde.
    function range(r, a) {
      const n = Math.max(...r.known.map(k => k[0])) + 1;
      const vals = [...r.known.map(k => k[1]), ...Array.from({ length: n }, (_, k) => termAt(a.a1, a.d, k + 1))];
      return { n, lo: Math.min(...vals) - 2, hi: Math.max(...vals) + 2 };
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function button(b, t) {
        p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 9);
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(20); p.textAlign(p.CENTER, p.CENTER); p.text(t, b.x + b.w / 2, b.y + b.h / 2 - 1);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], a = locked && !okRound([A[cur].a1, A[cur].d], r) ? { a1: r.a1, d: r.d } : A[cur];
        const good = okRound([A[cur].a1, A[cur].d], r);
        drawTabs(p, C, tabs, cur, i => (locked ? (okRound([A[i].a1, A[i].d], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : A[i].touched ? C.Q : C.line));
        const [[k1, v1], [k2, v2]] = r.known;
        p.textAlign(p.CENTER, p.CENTER); p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD);
        fitText(p, `El paso ${k1} cayó en ${neg(v1)} y el paso ${k2} en ${neg(v2)}`, W / 2, 56, W - 24, 14);
        p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, 'Elige el primer paso y el salto', W / 2, 76, W - 24, 12);
        // Recta
        const { n, lo, hi } = range(r, a), x0 = 16, x1 = W - 16, ly = H * 0.44;
        const X = v => x0 + ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * (x1 - x0);
        p.stroke(C.mute); p.strokeWeight(2); p.line(x0, ly, x1, ly);
        const every = hi - lo > 60 ? 10 : hi - lo > 30 ? 5 : hi - lo > 14 ? 2 : 1;
        for (let v = Math.ceil(lo); v <= hi; v++) {
          if (v % every) continue;
          p.stroke(C.line); p.strokeWeight(1.5); p.line(X(v), ly - 4, X(v), ly + 4);
          if (v % (every * 2) === 0 || every >= 5) { p.noStroke(); p.fill(C.mute); p.textSize(10); p.text(neg(v), X(v), ly + 34); }
        }
        // Banderas de los pasos conocidos
        for (const [k, v] of r.known) {
          const fx = X(v);
          p.stroke(C.ink); p.strokeWeight(1.5); p.line(fx, ly, fx, ly - 46);
          p.noStroke(); p.fill(C.bad); p.triangle(fx, ly - 46, fx + 12, ly - 42, fx, ly - 38);
          p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(10); p.text(`paso ${k}`, fx, ly - 54);
        }
        // Huellas: arriba y abajo de la recta, alternadas, para que no se tapen
        for (let k = 1; k <= n; k++) {
          const v = termAt(a.a1, a.d, k), x = X(v), up = k % 2 === 1, y = up ? ly - 16 : ly + 16;
          const hit = r.known.some(([kk, vv]) => kk === k && vv === v);
          p.noStroke(); p.fill(hit ? C.ok : locked ? C.ok : C.brand); p.ellipse(x, y, 13, 17);
          p.fill(C.bg); p.textStyle(p.BOLD); p.textSize(9); p.text(k, x, y + 1);
        }
        // Controles y lectura
        p.textAlign(p.LEFT, p.CENTER); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(15);
        p.text(`a₁ = ${neg(a.a1)}`, 16, B.aM.y + 18); p.text(`d = ${neg(a.d)}`, 16, B.dM.y + 18);
        p.textAlign(p.CENTER, p.CENTER);
        button(B.aM, '−'); button(B.aP, '+'); button(B.dM, '−'); button(B.dP, '+');
        const msg = locked ? (good ? '¡Las dos huellas pisan su bandera!' : `Era a₁ = ${neg(r.a1)} y d = ${neg(r.d)}`)
          : `paso ${k2}: ${neg(a.a1)} + ${k2 - 1} · ${a.d < 0 ? `(${neg(a.d)})` : a.d} = ${neg(termAt(a.a1, a.d, k2))}`;
        p.fill(locked ? C.ok : C.mute); p.textStyle(p.NORMAL); fitText(p, msg, W / 2, B.aM.y - 18, W - 24, 12);
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY;
        const tb = tabs.findIndex(b => hitBox(b, x, y));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (hitBox(B.aM, x, y)) { change(a => { a.a1 = Math.max(-30, a.a1 - 1); }); return false; }
        if (hitBox(B.aP, x, y)) { change(a => { a.a1 = Math.min(40, a.a1 + 1); }); return false; }
        if (hitBox(B.dM, x, y)) { change(a => { a.d = Math.max(-10, a.d - 1); }); return false; }
        if (hitBox(B.dP, x, y)) { change(a => { a.d = Math.min(10, a.d + 1); }); return false; }
      };
    }, 1.25);

    return {
      loaded: m.ready,
      getState: () => ({ ans: A.map(a => (a.touched ? [a.a1, a.d] : null)) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, termAt };
})();
