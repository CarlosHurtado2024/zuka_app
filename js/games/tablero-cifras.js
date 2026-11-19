// El tablero de los números de dos cifras (Preuniversitario, pu-ar-3; spec 2026-11-18-preuda-razonamiento-completo): del 10 al
// 99, cada fila es una cifra de las decenas y cada columna una de las unidades: el número XY vale 10X + Y. Se toca un número y
// el juego revisa cada condición con él; hay que encontrar el único que las cumple todas.
// params = { rounds: [{ conds: [{ say, f(n) → bool }] }] }   state = { rounds: [{ n }] }
GAMES['tablero-cifras'] = (() => {
  const all = r => Array.from({ length: 90 }, (_, k) => k + 10).filter(n => r.conds.every(c => c.f(n)));
  const ok = (s, r) => s.n !== null && r.conds.every(c => c.f(s.n));
  const game = roundsGame({
    aspect: 1.6,
    init: () => ({ n: null }),
    answered: s => s.n !== null,
    ok,
    solution: r => `${all(r)[0]}`,
    prompt: () => 'Busca el número de dos cifras que cumple todo',
    foot: () => 'Toca un número para ponerlo a prueba',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { n: all(r)[0] } : G.s, good = ok(s, r), cs = Math.min(28, (G.W - 40) / 10), x0 = (G.W - 10 * cs) / 2 + 6, y0 = 96 + r.conds.length * 18;
      r.conds.forEach((c, i) => { const hit = s.n !== null && c.f(s.n); TK.label(p, C, `${s.n === null ? '·' : hit ? '✓' : '✗'} ${c.say}`, G.W / 2, 92 + i * 18, s.n === null ? C.ink : hit ? C.ok : C.bad, 11, G.W - 24); });
      for (let u = 0; u < 10; u++) TK.label(p, C, String(u), x0 + (u + 0.5) * cs, y0 + 6, C.coral, 9, cs);
      G.cells = [];
      for (let t = 1; t <= 9; t++) {
        TK.label(p, C, String(t), x0 - 10, y0 + 14 + (t - 0.5) * cs, C.sky, 9, 14);
        for (let u = 0; u < 10; u++) {
          const n = 10 * t + u, x = x0 + u * cs, y = y0 + 14 + (t - 1) * cs, on = s.n === n;
          p.stroke(RK.al(p, C.line, 140)); p.strokeWeight(1); p.fill(on ? (good ? C.ok : C.brand) : RK.al(p, C.card, 200)); p.rect(x, y, cs, cs, 3);
          TK.label(p, C, String(n), x + cs / 2, y + cs / 2, on ? inkOn(good ? C.ok : C.brand) : C.ink, 9, cs - 2);
          G.cells.push({ x, y, w: cs, h: cs, n });
        }
      }
      RK.strip(p, C, G.fb, s.n === null ? '$\\text{toca un número}$' : `$${s.n} = 10 \\cdot ${Math.floor(s.n / 10)} + ${s.n % 10}$`, { kicker: good ? 'cumple todas' : '', col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const c = (G.cells || []).find(b => hitBox(b, x, y)); if (!c) return false; G.s.n = c.n; G.touch(); return true; },
    demo: G => { const c = G.cells?.[34]; return c ? { from: { x: c.x + c.w / 2, y: c.y + c.h / 2 }, to: { x: c.x + c.w / 2, y: c.y + c.h / 2 }, text: 'Toca un número', ty: G.cells.at(-1).y + 40 } : null; },
    peek: G => ({ cells: G.cells }),
  });
  return Object.assign(game, { answer: r => ({ n: all(r)[0] }), solutions: r => all(r) });
})();
