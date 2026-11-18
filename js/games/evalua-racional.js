// Evalúa la fracción (Álgebra, alg-25a; spec 2026-11-18-algebra-revision): el valor de una fracción algebraica es el
// numerador entre el denominador. Se arrastra x y dos barras muestran el numerador y el denominador; abajo, el cociente
// (o «no existe» si el denominador es 0). Hay que encontrar el x donde la fracción vale la meta.
// params = { rounds: [{ n: [a, b], d: [c, e], target }] }   (f = (ax + b)/(cx + e))   state = { rounds: [{ x }] }   (de −6 a 6)
GAMES['evalua-racional'] = (() => {
  const N = (r, x) => r.n[0] * x + r.n[1], D = (r, x) => r.d[0] * x + r.d[1];
  const ok = (s, r) => D(r, s.x) !== 0 && N(r, s.x) === r.target * D(r, s.x);
  const answer = r => { for (let x = -6; x <= 6; x++) if (ok({ x }, r)) return { x }; return null; };
  const lin = ([a, b]) => `${a === 1 ? '' : a === -1 ? '-' : a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
  const game = roundsGame({
    aspect: 1,
    init: r => ({ x: -r.d[1] / r.d[0] }),
    ok,
    solution: r => `x = ${answer(r).x}`,
    prompt: r => `¿Para qué x vale ${r.target} la fracción $\\dfrac{${lin(r.n)}}{${lin(r.d)}}$?`,
    foot: () => 'Arrastra x; donde el denominador es 0 la fracción no existe',
    layout(G) { G.L = { x0: 24, x1: G.W - 24, y: G.H - 112, min: -6, max: 6 }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, x = G.locked && !ok(G.s, r) ? answer(r).x : G.s.x, n = N(r, x), d = D(r, x);
      [[n, 'numerador', C.sky], [d, 'denominador', d === 0 ? C.bad : C.coral]].forEach(([v, t, col], i) => { const y = 112 + i * 40, cx = G.W / 2; p.noStroke(); p.fill(col); p.rect(cx, y, Math.max(-G.W / 2 + 30, Math.min(G.W / 2 - 30, v * 6)), 22, 3); TK.label(p, C, `${t}: ${v}`, cx, y + 32, C.mute, 10, 120); });
      TK.label(p, C, d === 0 ? 'no existe: divide entre 0' : `f(${x}) = ${+(n / d).toFixed(3)}`, G.W / 2, 210, d === 0 ? C.bad : ok({ x }, r) ? C.ok : C.ink, 16, G.W - 30);
      const X = drawNumLine(p, C, G.L, { step: 1, every: 2 }); RK.knob(p, C, X(x), G.L.y, C.brand); G.X = X;
      RK.strip(p, C, G.fb, d === 0 ? `$f(${x})\\ \\text{no existe}$` : `$f(${x}) = \\dfrac{${n}}{${d}}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.L.y) > 34) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.x), y: G.L.y }, to: { x: G.X(G.s.x + 2), y: G.L.y }, text: 'Arrastra x', ty: G.L.y - 40 }),
    peek: G => ({ L: G.L }),
  });
  game.move = (G, x) => { const L = G.L, v = Math.max(L.min, Math.min(L.max, Math.round(L.min + (x - L.x0) / (L.x1 - L.x0) * (L.max - L.min)))); if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
