// La tabla de verdad (Preuniversitario, pu-lo-1 a pu-lo-3; spec 2026-11-18-preuda-razonamiento-completo): todas las
// combinaciones de p y q (o de p, q y r) en filas, y la columna de la fórmula vacía. Se toca cada casilla para ponerle V o F.
// Si hay `given`, una columna ya hecha sirve de comparación (para ver que dos fórmulas son equivalentes).
// params = { rounds: [{ tex, f(p, q, r) → bool, n: 2 | 3, given?: { tex, f } }] }   state = { rounds: [{ c: [null | true | false por fila] }] }
GAMES['tabla-verdad'] = (() => {
  const rows = r => Array.from({ length: 2 ** r.n }, (_, k) => Array.from({ length: r.n }, (_, j) => !((k >> (r.n - 1 - j)) & 1)));
  const need = r => rows(r).map(v => !!r.f(...v));
  const ok = (s, r) => need(r).every((v, i) => s.c[i] === v);
  const game = roundsGame({
    aspect: 1.35,
    init: r => ({ c: rows(r).map(() => null) }),
    answered: s => s.c.some(v => v !== null),
    ok,
    solution: r => need(r).map(v => (v ? 'V' : 'F')).join(' '),
    prompt: r => `Llena la tabla de $${r.tex}$`,
    foot: () => 'Toca cada casilla: V, F, V…',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { c: need(r) } : G.s, good = ok(s, r), R = rows(r), nc = r.n + (r.given ? 2 : 1);
      const cw = Math.min(70, (G.W - 30) / nc), x0 = (G.W - nc * cw) / 2, rh = Math.min(34, (G.H - 220) / (R.length + 1)), y0 = 96;
      const head = ['p', 'q', 'r'].slice(0, r.n).concat(r.given ? [r.given.tex] : [], [r.tex]);
      head.forEach((h, j) => { const last = j === nc - 1; p.noStroke(); p.fill(RK.al(p, last ? C.brand : C.line, last ? 60 : 90)); p.rect(x0 + j * cw + 1, y0, cw - 2, rh - 2, 4); TK.label(p, C, `$${h}$`, x0 + (j + 0.5) * cw, y0 + rh / 2, C.ink, 12, cw - 4); });
      G.cells = R.map((v, i) => {
        const y = y0 + (i + 1) * rh;
        v.forEach((b, j) => TK.label(p, C, b ? 'V' : 'F', x0 + (j + 0.5) * cw, y + rh / 2, b ? C.ok : C.bad, 12, cw));
        if (r.given) { const g = !!r.given.f(...v); TK.label(p, C, g ? 'V' : 'F', x0 + (r.n + 0.5) * cw, y + rh / 2, C.mute, 12, cw); }
        const x = x0 + (nc - 1) * cw, c = s.c[i];
        p.stroke(C.line); p.strokeWeight(1); p.fill(c === null ? RK.al(p, C.card, 200) : RK.al(p, c ? C.ok : C.bad, 70)); p.rect(x + 3, y + 2, cw - 6, rh - 4, 6);
        TK.label(p, C, c === null ? '?' : c ? 'V' : 'F', x + cw / 2, y + rh / 2, C.ink, 13, cw);
        return { x: x + 3, y: y + 2, w: cw - 6, h: rh - 4, i };
      });
      const done = s.c.filter(v => v !== null).length;
      RK.strip(p, C, G.fb, good ? '$\\text{tabla completa y correcta}$' : `$\\text{${done} de ${R.length} filas}$`, { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { const c = (G.cells || []).find(b => hitBox(b, x, y)); if (!c) return false; const v = G.s.c[c.i]; G.s.c[c.i] = v === null ? true : v ? false : true; G.touch(); return true; },
    demo: G => (G.cells ? { from: { x: G.cells[0].x + G.cells[0].w / 2, y: G.cells[0].y + 12 }, to: { x: G.cells[0].x + G.cells[0].w / 2, y: G.cells[0].y + 12 }, text: 'Toca la casilla', ty: G.cells.at(-1).y + 50 } : null),
    peek: G => ({ cells: G.cells }),
  });
  return Object.assign(game, { answer: r => ({ c: need(r) }) });
})();
