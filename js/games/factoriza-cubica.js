// Del cúbico a la parábola (Álgebra, alg-93; spec 2026-11-18-algebra-revision): si c es un cero de P, P = (x − c)·Q con Q
// de un grado menos. Se arrastra c buscando un cero (P(c) se ve en vivo); cuando P(c) = 0 aparece el cociente cuadrático
// Q y sus dos ceros (reales o complejos), y así se completan los tres ceros del cúbico.
// params = { rounds: [{ P: [1, p2, p1, p0], c }] }   state = { rounds: [{ x }] }   (de −4 a 4)
GAMES['factoriza-cubica'] = (() => {
  const val = (P, x) => P.reduce((a, q) => a * x + q, 0);
  const quot = (P, c) => { const o = [P[0]]; for (let i = 1; i < P.length - 1; i++) o.push(P[i] + c * o[i - 1]); return o; };
  const ok = (s, r) => val(r.P, s.x) === 0;
  const poly3 = P => GAMES['iguala-coeficientes'].poly3(P);
  const roots2 = ([a, b, c]) => { const D = b * b - 4 * a * c, h = -b / (2 * a); if (D >= 0) return [h - Math.sqrt(D) / (2 * a), h + Math.sqrt(D) / (2 * a)].map(v => +v.toFixed(3)).join(' y '); return `${h} ± ${+(Math.sqrt(-D) / (2 * a)).toFixed(3)}i`; };
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ x: 0 }),
    ok,
    solution: r => `c = ${r.c}; Q = ${poly3([0, ...quot(r.P, r.c)])}; ceros de Q: ${roots2(quot(r.P, r.c))}`,
    prompt: r => `Encuentra un cero entero de $${poly3(r.P)}$`,
    foot: () => 'Arrastra c: cuando P(c) = 0, aparece lo que queda por factorizar',
    layout(G) { G.L = { x0: 24, x1: G.W - 24, y: G.H - 112, min: -4, max: 4 }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, x = G.locked && !ok(G.s, r) ? r.c : G.s.x, v = val(r.P, x);
      TK.label(p, C, `P(${x}) = ${v}`, G.W / 2, 116, v === 0 ? C.ok : C.ink, 20, G.W - 30);
      if (v === 0) { const Q = quot(r.P, x); TK.label(p, C, `$${poly3(r.P)} = (x ${x < 0 ? '+' : '-'} ${Math.abs(x)})(${poly3([0, ...Q])})$`, G.W / 2, 160, C.ink, 14, G.W - 24); TK.label(p, C, `ceros de la parábola: ${roots2(Q)}`, G.W / 2, 196, C.mute, 12, G.W - 24); }
      const X = drawNumLine(p, C, G.L, { step: 1 }); RK.knob(p, C, X(x), G.L.y, C.brand); G.X = X;
      RK.strip(p, C, G.fb, v === 0 ? `$x = ${x}\\ \\text{es un cero}$` : `$P(${x}) = ${v} \\ne 0$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.L.y) > 34) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.x), y: G.L.y }, to: { x: G.X(G.s.x + 2), y: G.L.y }, text: 'Arrastra c', ty: G.L.y - 40 }),
    peek: G => ({ L: G.L }),
  });
  game.move = (G, x) => { const L = G.L, v = Math.max(L.min, Math.min(L.max, Math.round(L.min + (x - L.x0) / (L.x1 - L.x0) * (L.max - L.min)))); if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { quot });
})();
