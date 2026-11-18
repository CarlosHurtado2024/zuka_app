// La tabla de doble entrada (Preuniversitario, pu-or-3; spec 2026-11-18-preuda-razonamiento-completo): personas en las filas
// y opciones en las columnas; cada fila y cada columna tiene un solo ✓. Las pistas negativas («Lina no estudia Medicina»)
// ya vienen tachadas con ✗ en la tabla. Se arrastran las fichas ✓ (una por persona) a las casillas; una casilla tachada no
// recibe ✓. Hay que dejar un ✓ por fila y por columna que cumpla todas las pistas.
// params = { rounds: [{ rows, cols, clues: [{ t: 'not' | 'is', a, v, say }] }] }   (a: índice de fila, v: de columna)
// state = { rounds: [{ pick: [columna | null por fila] }] }
GAMES['tabla-cruces'] = (() => {
  const crossed = (r, a, v) => r.clues.some(c => c.t === 'not' && c.a === a && c.v === v);
  const valid = (r, pick) => pick.every(x => x != null) && new Set(pick).size === pick.length && r.clues.every(c => (c.t === 'not' ? pick[c.a] !== c.v : pick[c.a] === c.v));
  const solutions = r => ORD.perms(r.cols.map((_, i) => i)).filter(p => valid(r, p));
  const ok = (s, r) => valid(r, s.pick);
  const answer = r => ({ pick: solutions(r)[0] });
  const lay = G => { const r = G.r, cw = Math.min(64, (G.W - 90) / r.cols.length), ch = 34; G.cell = (a, v) => ({ x: 84 + v * cw, y: 128 + a * ch, w: cw - 4, h: ch - 4 }); G.cw = cw; G.ch = ch; };
  const game = roundsGame({
    aspect: 1.3,
    init: r => ({ pick: r.rows.map(() => null) }),
    ok,
    answered: s => s.pick.some(x => x != null),
    solution: r => answer(r).pick.map((v, a) => `${r.rows[a]}: ${r.cols[v]}`).join(', '),
    prompt: () => 'Pon un ✓ por fila y por columna',
    foot: () => 'Arrastra las fichas ✓ a la tabla; sácalas para quitarlas',
    layout(G) { lay(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r);
      r.cols.forEach((c, v) => TK.label(p, C, c, 84 + v * G.cw + (G.cw - 4) / 2, 116, C.ink, 10, G.cw));
      r.rows.forEach((nm, a) => { TK.label(p, C, nm, 44, 128 + a * G.ch + (G.ch - 4) / 2, C.ink, 11, 76); r.cols.forEach((_, v) => { const b = G.cell(a, v); p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.card, 180)); p.rect(b.x, b.y, b.w, b.h, 4); if (crossed(r, a, v)) TK.label(p, C, '✗', b.x + b.w / 2, b.y + b.h / 2, C.bad, 14, b.w); else if (s.pick[a] === v && G.drag?.a !== a) TK.label(p, C, '✓', b.x + b.w / 2, b.y + b.h / 2, good ? C.ok : C.sky, 16, b.w); }); });
      const left = r.rows.length - s.pick.filter(x => x != null).length - (G.drag && G.drag.a == null ? 1 : 0), ty = 128 + r.rows.length * G.ch + 14;
      G.src = { x: G.W / 2 - 40, y: ty, w: 80, h: 30 };
      if (left > 0) RK.chip(p, C, G.src, `✓ × ${left}`, { on: true, col: C.brand, size: 12 });
      const pos = r.clues.filter(c => c.t === 'is');
      pos.forEach((c, i) => TK.label(p, C, c.say, G.W / 2, ty + 44 + i * 14, C.mute, 10, G.W - 30));
      if (G.drag) TK.label(p, C, '✓', G.drag.x, G.drag.y, C.brand, 22, 30);
      RK.strip(p, C, G.fb, good ? '$\\text{un ✓ por fila y por columna}$' : '$\\text{cada fila y cada columna: un solo ✓}$', { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) {
      if (G.src && hitBox(G.src, x, y)) { G.drag = { a: null, x, y }; return true; }
      for (let a = 0; a < G.r.rows.length; a++) { const v = G.s.pick[a]; if (v != null && hitBox(G.cell(a, v), x, y)) { G.drag = { a, x, y }; return true; } }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return; const r = G.r;
      if (d.a != null) G.s.pick[d.a] = null;
      for (let a = 0; a < r.rows.length; a++) for (let v = 0; v < r.cols.length; v++) if (hitBox(G.cell(a, v), x, y) && !crossed(r, a, v)) { G.s.pick[a] = v; }
      G.touch();
    },
    demo(G) { const r = G.r, sol = answer(r).pick, v = r.cols.findIndex((_, k) => k !== sol[0] && !crossed(r, 0, k)), b = G.cell(0, v < 0 ? 0 : v); return G.src ? { from: { x: G.src.x + 40, y: G.src.y + 15 }, to: { x: b.x + b.w / 2, y: b.y + b.h / 2 }, text: 'Arrastra un ✓', ty: G.src.y - 12 } : null; },
    peek: G => ({ src: G.src }),
  });
  return Object.assign(game, { answer, solutions });
})();
