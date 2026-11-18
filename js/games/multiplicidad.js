// La multiplicidad (Álgebra, alg-93; spec 2026-11-18-algebra-revision): en (x − c)ᵐ la gráfica cruza el eje si m es impar
// y lo toca y se devuelve si m es par; cuanto mayor m, más plana pasa. Se arrastra el exponente de cada cero y la curva
// cambia; hay que lograr la forma pedida con el grado pedido.
// params = { rounds: [{ zeros: [c1, c2], want: ['cruza'|'rebota', …], deg }] }   state = { rounds: [{ m: [m1, m2] }] }   (de 1 a 3)
GAMES['multiplicidad'] = (() => {
  const shape = m => (m % 2 ? 'cruza' : 'rebota');
  const ok = (s, r) => s.m.every((m, i) => shape(m) === r.want[i]) && s.m.reduce((a, b) => a + b, 0) === r.deg;
  const answer = r => { for (let a = 1; a <= 3; a++) for (let b = 1; b <= 3; b++) if (ok({ m: [a, b] }, r)) return { m: [a, b] }; return null; };
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ m: [1, 1] }),
    ok,
    solution: r => { const { m } = answer(r); return r.zeros.map((c, i) => `(x ${c < 0 ? '+' : '-'} ${Math.abs(c)})^${m[i]}`).join(''); },
    prompt: r => `Grado ${r.deg}: en ${r.zeros[0]} ${r.want[0]} y en ${r.zeros[1]} ${r.want[1]}`,
    foot: () => 'Arrastra el exponente de cada cero',
    layout(G) { G.b = { x: 16, y: 100, w: G.W - 32, h: G.H * 0.44 }; G.t1 = G.H - 150; G.t2 = G.H - 108; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, V = { x0: -4, x1: 4, y0: -10, y1: 10 }, M = RK.plane(p, C, G.b, V, { step: 2 });
      RK.curve(p, G.b, M, V, x => (x - r.zeros[0]) ** s.m[0] * (x - r.zeros[1]) ** s.m[1], C.sky, 2.4);
      r.zeros.forEach((c, i) => { drawDot(p, C, M.X(c), M.Y(0), 10, shape(s.m[i]) === r.want[i] ? C.ok : C.coral); TK.label(p, C, shape(s.m[i]), M.X(c), M.Y(0) + 18, C.mute, 10, 60); });
      G.X1 = RK.track(p, C, 90, G.W - 30, G.t1, 3, s.m[0] - 1, i => String(i + 1)); TK.label(p, C, `en ${r.zeros[0]}`, 46, G.t1, C.mute, 11, 60);
      G.X2 = RK.track(p, C, 90, G.W - 30, G.t2, 3, s.m[1] - 1, i => String(i + 1)); TK.label(p, C, `en ${r.zeros[1]}`, 46, G.t2, C.mute, 11, 60);
      RK.strip(p, C, G.fb, `$${r.zeros.map((c, i) => `(x ${c < 0 ? '+' : '-'} ${Math.abs(c)})^{${s.m[i]}}`).join('')}\\quad\\text{grado } ${s.m[0] + s.m[1]}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const k = Math.abs(y - G.t1) < 20 ? 0 : Math.abs(y - G.t2) < 20 ? 1 : -1; if (k < 0) return false; G.grab = k; game.move(G, x); return true; },
    drag(G, x) { if (G.grab == null) return false; game.move(G, x); return true; },
    release(G) { G.grab = null; },
    demo: G => ({ from: { x: G.X1(G.s.m[0] - 1), y: G.t1 }, to: { x: G.X1(G.s.m[0]), y: G.t1 }, text: 'Arrastra los exponentes', ty: G.t1 - 26 }),
    peek: G => ({ t1: G.t1, t2: G.t2 }),
  });
  game.move = (G, x) => { G.s.m[G.grab] = RK.pick(x, 90, G.W - 30, 3) + 1; G.touch(); };
  return Object.assign(game, { answer });
})();
