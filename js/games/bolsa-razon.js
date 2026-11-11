// La bolsa de la razón (Álgebra, razones). Una bolsa transparente con bolas rojas y azules: con − / + se ponen o se
// quitan bolas de cada color. Cada ronda pide una bolsa con una condición de razón: parte-parte («por cada 3 rojas
// hay 2 azules»), parte-todo («2 de cada 5 son azules») con un total o con un dato fijo. Se ven las cantidades sin
// simplificar: el estudiante decide cuándo la razón es la pedida.
// params = { rounds: [{ text, red, blue }], max }   state = { counts: [[rojas, azules] | null por ronda] }

GAMES['bolsa-razon'] = (() => {
  const okRound = (c, r) => Array.isArray(c) && c[0] === r.red && c[1] === r.blue;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okRound(state.counts?.[i], r));
    const solution = params.rounds.map(r => `${r.red} rojas y ${r.blue} azules`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, MAX = params.max || 20;
    const S = R.map(() => ({ red: 0, blue: 0, touched: false }));
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], B = {};

    function layout(w, h) {
      W = w; H = h; tabs = roundTabs(R.length, w);
      const bw = Math.min(44, (w - 48) / 6), y = h - 48, gap = w / 2;
      B = {
        rMinus: { x: 12, y, w: bw, h: 36 }, rPlus: { x: gap - 8 - bw, y, w: bw, h: 36 },
        bMinus: { x: gap + 8, y, w: bw, h: 36 }, bPlus: { x: w - 12 - bw, y, w: bw, h: 36 },
      };
    }
    function change(f) {
      if (locked) return;
      const s = S[cur]; f(s); s.touched = true;
      api.ready(S.every(x => x.touched)); api.sfx?.tap?.();
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function button(b, label, col) {
        p.stroke(col); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 9);
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(20); p.text(label, b.x + b.w / 2, b.y + b.h / 2 - 1);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], s = S[cur], good = okRound([s.red, s.blue], r);
        const v = locked && !good ? { red: r.red, blue: r.blue } : s;   // al fallar se ve la bolsa correcta en verde
        drawTabs(p, C, tabs, cur, i => (locked ? (okRound([S[i].red, S[i].blue], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : S[i].touched ? C.Q : C.line));
        // Enunciado (hasta tres líneas)
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(W < 300 ? 13 : 14); p.textAlign(p.CENTER, p.TOP); p.textLeading(17);
        p.text(r.text, 14, 46, W - 28, 56);
        // La bolsa
        const top = 106, bot = H - 106, bx = 26, bwid = W - 52;
        p.textAlign(p.CENTER, p.CENTER);
        p.stroke(locked && !good ? C.ok : C.line); p.strokeWeight(2); p.fill(C.card);
        p.rect(bx, top + 10, bwid, bot - top - 10, 18);
        p.noFill(); p.stroke(C.mute); p.strokeWeight(2.5);
        p.line(W / 2 - 22, top + 10, W / 2 - 8, top); p.line(W / 2 + 22, top + 10, W / 2 + 8, top);
        const balls = [...Array(v.red).fill("r"), ...Array(v.blue).fill("b")];
        const perRow = 10, d = Math.min(20, (bwid - 16) / perRow - 3), rows = Math.ceil(balls.length / perRow);
        const step = Math.min(d + 3, (bot - top - 26) / Math.max(rows, 1));
        balls.forEach((c, k) => {
          const row = Math.floor(k / perRow), col = k % perRow;
          const x = bx + 8 + (col + 0.5) * ((bwid - 16) / perRow), y = bot - 8 - (row + 0.5) * step;
          p.noStroke(); p.fill(c === 'r' ? C.bad : C.Z); p.circle(x, y, Math.min(d, step - 2));
        });
        if (!balls.length) { p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.text('bolsa vacía', W / 2, (top + bot) / 2); }
        // Cuentas
        p.noStroke(); p.textStyle(p.BOLD);
        const ly = H - 72;
        p.fill(C.bad); fitText(p, `rojas: ${v.red}`, W / 4, ly, W / 2 - 16, 14);
        p.fill(C.Z); fitText(p, `azules: ${v.blue}`, (3 * W) / 4, ly, W / 2 - 16, 14);
        p.fill(locked ? C.ok : C.mute); p.textStyle(p.NORMAL);
        fitText(p, locked && !good ? `Era: ${r.red} rojas y ${r.blue} azules` : `en total: ${s.red + s.blue}`, W / 2, H - 90, W - 24, 12);
        button(B.rMinus, '−', C.bad); button(B.rPlus, '+', C.bad); button(B.bMinus, '−', C.Z); button(B.bPlus, '+', C.Z);
        p.noStroke(); p.fill(C.bad); p.circle((B.rMinus.x + B.rMinus.w + B.rPlus.x) / 2, B.rMinus.y + 18, 18);
        p.fill(C.Z); p.circle((B.bMinus.x + B.bMinus.w + B.bPlus.x) / 2, B.bMinus.y + 18, 18);
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY;
        const tb = tabs.findIndex(b => hitBox(b, x, y));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (hitBox(B.rMinus, x, y)) { change(s => { s.red = Math.max(0, s.red - 1); }); return false; }
        if (hitBox(B.rPlus, x, y)) { change(s => { s.red = Math.min(MAX, s.red + 1); }); return false; }
        if (hitBox(B.bMinus, x, y)) { change(s => { s.blue = Math.max(0, s.blue - 1); }); return false; }
        if (hitBox(B.bPlus, x, y)) { change(s => { s.blue = Math.min(MAX, s.blue + 1); }); return false; }
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ counts: S.map(s => (s.touched ? [s.red, s.blue] : null)) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
