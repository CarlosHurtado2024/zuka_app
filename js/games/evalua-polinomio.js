// Evalúa con bloques (Álgebra, alg-23a; spec 2026-11-18-algebra-revision): evaluar es darle un valor a x. Se arrastra x
// por la recta y cada bloque del polinomio muestra cuánto vale (x² y x cambian; los cuadritos no); abajo se suma todo.
// Hay que encontrar el x (entre −4 y 4) en que el polinomio vale la meta.
// params = { rounds: [{ c: [a, b, c], target }] }   state = { rounds: [{ x }] }
GAMES['evalua-polinomio'] = (() => {
  const P = (c, x) => c[0] * x * x + c[1] * x + c[2];
  const need = r => { for (let x = -4; x <= 4; x++) if (P(r.c, x) === r.target) return x; return null; };
  const ok = (s, r) => P(r.c, s.x) === r.target;
  const poly = c => GAMES['bloques-polinomio'].poly(c);
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ x: 0 }),
    ok,
    solution: r => `x = ${need(r)}`,
    prompt: r => `¿Para qué x vale ${r.target} el polinomio $${poly(r.c)}$?`,
    foot: () => 'Arrastra x: cada término muestra cuánto vale',
    layout(G) { G.L = { x0: 30, x1: G.W - 30, y: G.H - 112, min: -4, max: 4 }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, x = G.locked && !ok(G.s, r) ? need(r) : G.s.x, terms = [[r.c[0], x * x, `x^2`], [r.c[1], x, 'x'], [r.c[2], 1, '']];
      terms.forEach(([k, v, n], i) => { const bx = 24 + i * (G.W - 48) / 3, val = k * v; RK.chip(p, C, { x: bx + 4, y: 112, w: (G.W - 48) / 3 - 8, h: 52 }, `$${k}${n ? `\\cdot(${x})${n === 'x^2' ? '^2' : ''}` : ''} = ${val}$`, { on: true, col: val < 0 ? C.coral : C.sky, size: 13 }); });
      const tot = P(r.c, x);
      TK.label(p, C, `total: ${tot}`, G.W / 2, 190, tot === r.target ? C.ok : C.ink, 16, 160);
      const X = drawNumLine(p, C, G.L, { step: 1 }); RK.knob(p, C, X(x), G.L.y, C.brand); G.X = X;
      RK.strip(p, C, G.fb, `$P(${x}) = ${tot}$`, { kicker: `Meta: ${r.target}`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 19 });
    },
    press(G, x, y) { if (Math.abs(y - G.L.y) > 34) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.x), y: G.L.y }, to: { x: G.X(G.s.x + 2), y: G.L.y }, text: 'Arrastra x', ty: G.L.y - 40 }),
    peek: G => ({ L: G.L }),
  });
  game.move = (G, x) => { const L = G.L, v = Math.max(L.min, Math.min(L.max, Math.round(L.min + (x - L.x0) / (L.x1 - L.x0) * (L.max - L.min)))); if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { need });
})();
