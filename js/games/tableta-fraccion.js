// Tableta partida (Preuniversitario UdeA, pu-cm-2; spec 2026-11-18-preuda-mundo-1): la fracción de una cantidad se
// hace con las manos. Una tableta de `total` cuadritos; un deslizador la corta en partes iguales (si no se reparte
// parejo, los cuadritos que sobran quedan en rojo) y luego se arrastra el dedo sobre la tableta para tomar partes. El
// juego cuenta: «5/8 de 32 = 20». Vale cualquier corte equivalente (10/16 de 32 también son 20).
// params = { rounds: [{ total, cols, num, den, what }] }   state = { rounds: [{ parts, take }] }
GAMES['tableta-fraccion'] = (() => {
  const MAXP = 12;
  const even = (r, s) => r.total % s.parts === 0;
  const game = roundsGame({
    aspect: 1.36,
    init: () => ({ parts: 1, take: 0 }),
    ok: (s, r) => even(r, s) && s.take > 0 && s.take * r.den === r.num * s.parts,
    answered: s => s.take > 0,
    solution: r => `$\\tfrac{${r.num}}{${r.den}}$ de ${r.total} = ${r.total / r.den * r.num}`,
    prompt: r => `Toma $\\tfrac{${r.num}}{${r.den}}$ de ${r.total} ${r.what}`,
    foot: (r, s) => (s.parts === 1 ? 'Primero corta la tableta en partes iguales' : !even(r, s) ? 'Así no se reparte parejo: sobran cuadritos' : s.take ? 'Arrastra sobre la tableta para tomar más o menos partes' : 'Ahora arrastra el dedo sobre la tableta para tomar partes'),
    layout(G) {
      const r = G.r, rows = Math.ceil(r.total / r.cols), cell = Math.min(32, (G.W - 28) / r.cols, 170 / rows);
      G.cell = cell; G.gx = (G.W - cell * r.cols) / 2; G.gy = 150;
      G.slY = G.H - 62; G.px = n => 30 + (n - 1) / (MAXP - 1) * (G.W - 60);
    },
    enter(G) { G.mode = null; game.lay(G); },
    draw(G) {
      const { p, C, r, s, cell, gx, gy } = G, size = Math.floor(r.total / s.parts), ok = even(r, s), taken = ok ? s.take * size : 0;
      TK.label(p, C, ok && s.take ? `${s.take}/${s.parts} de ${r.total} = ${taken}` : ok ? `${s.parts} ${s.parts === 1 ? 'parte' : 'partes'} de ${size}` : `${s.parts} partes: sobran ${r.total - size * s.parts}`, G.W / 2, 112, G.locked ? (game.okOf(s, r) ? C.ok : C.bad) : ok ? C.ink : C.bad, 18, G.W - 24);
      for (let i = 0; i < r.total; i++) {
        const cx = gx + (i % r.cols) * cell, cy = gy + Math.floor(i / r.cols) * cell, part = Math.floor(i / size), left = i >= size * s.parts;
        p.stroke(C.bg); p.strokeWeight(1.5);
        p.fill(left ? C.bad : ok && part < s.take ? C.mint : part % 2 ? shade(C.sun, 0.82) : C.sun);
        p.rect(cx, cy, cell, cell, 4);
      }
      // Los cortes entre partes: una raya gruesa donde termina cada una.
      p.stroke(C.bg); p.strokeWeight(7);
      for (let k = 1; k < s.parts; k++) { const i = k * size, cx = gx + (i % r.cols) * cell, cy = gy + Math.floor(i / r.cols) * cell; if (i % r.cols) p.line(cx, cy, cx, cy + cell); else p.line(gx, cy, gx + r.cols * cell, cy); }
      // Deslizador: en cuántas partes iguales se corta.
      const y = G.slY;
      p.stroke(C.line); p.strokeWeight(6); p.line(G.px(1), y, G.px(MAXP), y);
      for (let n = 1; n <= MAXP; n++) { p.stroke(C.bg); p.strokeWeight(2); p.line(G.px(n), y - 3, G.px(n), y + 3); p.noStroke(); p.fill(r.total % n ? C.mute : C.Z); p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.CENTER, p.CENTER); p.text(n, G.px(n), y + 24); }
      TK.label(p, C, 'cortar en partes iguales', G.W / 2, y - 26, C.mute, 11, 200);
      p.stroke(ok ? C.sky : C.bad); p.strokeWeight(3); p.fill(C.cream); p.circle(G.px(s.parts), y, 30);
      p.noStroke(); p.fill(inkOn(C.cream, C.ink)); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.CENTER); p.text(s.parts, G.px(s.parts), y + 1);
    },
    press(G, x, y) {
      if (Math.abs(y - G.slY) < 30) { G.mode = 'cut'; game.cut(G, x); return true; }
      if (game.cellAt(G, x, y) >= 0) { G.mode = 'take'; game.take(G, x, y); return true; }
      return false;
    },
    drag(G, x, y) { if (!G.mode) return false; G.mode === 'cut' ? game.cut(G, x) : game.take(G, x, y); return true; },
    release(G) { G.mode = null; },
    demo(G) {
      const { r, s } = G;
      if (s.parts === 1 || !even(r, s)) return { from: { x: G.px(s.parts), y: G.slY }, to: { x: G.px(r.den === 2 ? 3 : 2), y: G.slY }, text: 'Arrastra para cortar en partes iguales', ty: G.slY - 50 };
      const size = r.total / s.parts, at = i => ({ x: G.gx + (i % r.cols + .5) * G.cell, y: G.gy + (Math.floor(i / r.cols) + .5) * G.cell });
      return { from: at(0), to: at(size - 1), text: 'Arrastra sobre la tableta para tomar partes', ty: G.slY - 50 };
    },
    peek: G => ({ slY: G.slY, px: [...Array(MAXP).keys()].map(i => G.px(i + 1)), gx: G.gx, gy: G.gy, cell: G.cell }),
  });
  game.okOf = (s, r) => even(r, s) && s.take > 0 && s.take * r.den === r.num * s.parts;
  game.lay = G => { const r = G.r, rows = Math.ceil(r.total / r.cols), cell = Math.min(32, (G.W - 28) / r.cols, 170 / rows); G.cell = cell; G.gx = (G.W - cell * r.cols) / 2; };
  game.cellAt = (G, x, y) => { const c = Math.floor((x - G.gx) / G.cell), w = Math.floor((y - G.gy) / G.cell), i = w * G.r.cols + c; return c >= 0 && c < G.r.cols && w >= 0 && i < G.r.total ? i : -1; };
  game.cut = (G, x) => { const n = Math.max(1, Math.min(MAXP, Math.round(1 + (x - 30) / (G.W - 60) * (MAXP - 1)))); if (n !== G.s.parts) { G.s.parts = n; G.s.take = 0; G.api.sfx?.tap?.(); G.api.ready(G.params.rounds.every((_, i) => G.st[i].take > 0)); } };
  game.take = (G, x, y) => {
    const { r, s } = G, i = game.cellAt(G, x, y);
    if (i < 0 || !even(r, s)) return;
    const k = Math.min(s.parts, Math.floor(i / (r.total / s.parts)) + 1);
    if (k !== s.take) { s.take = k; G.touch(); }
  };
  return game;
})();
