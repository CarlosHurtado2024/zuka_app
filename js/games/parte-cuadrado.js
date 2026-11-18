// Parte el cuadrado (Álgebra, alg-3; spec 2026-11-18-algebra-revision): (a + b)² = a² + 2ab + b². Un cuadrado de lado N;
// se arrastra el corte del lado y el cuadrado queda en cuatro piezas: a², dos rectángulos ab y b². Cualquier corte da el
// mismo total, pero uno redondo vuelve la cuenta fácil de hacer de cabeza: hay que cortar en una decena.
// params = { rounds: [{ N }] }   state = { rounds: [{ a }] }   (a de 1 a N − 1)
GAMES['parte-cuadrado'] = (() => {
  const ok = (s, r) => s.a % 10 === 0 && s.a > 0 && s.a < r.N;
  const game = roundsGame({
    aspect: 1.1,
    init: r => ({ a: Math.floor(r.N / 2) % 10 === 0 ? Math.floor(r.N / 2) + 1 : Math.floor(r.N / 2) }),
    ok,
    solution: r => { const a = r.N - (r.N % 10), b = r.N - a; return `${a} + ${b}: ${a * a} + 2·${a}·${b} + ${b * b} = ${r.N * r.N}`; },
    prompt: r => `Calcula $${r.N}^2$ de cabeza: corta el lado en una decena`,
    foot: () => 'Arrastra el corte del lado; mira las cuatro piezas',
    layout(G) { G.S = Math.min(G.W - 80, G.H * 0.48); G.ox = (G.W - G.S) / 2; G.oy = 110; G.fb = { x: 12, y: G.H - 80, w: G.W - 24, h: 52 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r, S, ox, oy } = G, a = G.locked && !ok(G.s, r) ? r.N - (r.N % 10) : G.s.a, b = r.N - a, k = S / r.N;
      const R = (x, y, w, h, col, t) => { p.stroke(C.bg); p.strokeWeight(2); p.fill(col); p.rect(x, y, w, h); if (w > 26 && h > 18) TK.label(p, C, t, x + w / 2, y + h / 2, C.ink, 12, w - 4); };
      R(ox, oy, a * k, a * k, C.mint, `${a}² = ${a * a}`); R(ox + a * k, oy, b * k, a * k, C.sky, `${a * b}`); R(ox, oy + a * k, a * k, b * k, C.sky, `${a * b}`); R(ox + a * k, oy + a * k, b * k, b * k, C.coral, `${b * b}`);
      G.cx = ox + a * k; RK.knob(p, C, G.cx, oy - 14, C.brand);
      TK.label(p, C, String(a), ox + a * k / 2, oy - 14, C.mute, 11, 40); TK.label(p, C, String(b), ox + a * k + b * k / 2, oy - 14, C.mute, 11, 40);
      RK.strip(p, C, G.fb, `$${r.N}^2 = ${a}^2 + 2\\cdot${a}\\cdot${b} + ${b}^2 = ${a * a} + ${2 * a * b} + ${b * b} = ${r.N * r.N}$`, { kicker: ok({ a }, r) ? 'Corte redondo' : 'Cualquier corte da lo mismo: busca uno fácil', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { if (Math.abs(y - (G.oy - 14)) > 30 && !(y > G.oy && y < G.oy + G.S)) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.cx, y: G.oy - 14 }, to: { x: G.cx + 40, y: G.oy - 14 }, text: 'Arrastra el corte', ty: G.oy + G.S + 18 }),
    peek: G => ({ ox: G.ox, oy: G.oy, S: G.S }),
  });
  game.move = (G, x) => { const r = G.r, a = Math.max(1, Math.min(r.N - 1, Math.round((x - G.ox) / (G.S / r.N)))); if (a !== G.s.a || !G.touched[G.cur]) { G.s.a = a; G.touch(); } };
  return game;
})();
