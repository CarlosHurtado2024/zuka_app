// El rectángulo con perímetro y área (Álgebra, alg-102; spec 2026-11-18-algebra-revision): pedir un perímetro y un área a
// la vez es un sistema no lineal: 2(x + y) = P y x·y = A. Se arrastra la esquina del rectángulo; dos medidores muestran
// perímetro y área frente a lo pedido. Al cumplir las dos, el juego muestra la cuadrática que resolvía el sistema.
// params = { rounds: [{ P, A, max }] }   state = { rounds: [{ x, y }] }   (lados enteros de 1 a max)
GAMES['rectangulo-pa'] = (() => {
  const lay = G => { G.u = Math.min((G.W - 60) / G.r.max, (G.H * 0.5) / G.r.max); G.o = { x: 30, y: 100 + G.r.max * G.u }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; };
  const ok = (s, r) => 2 * (s.x + s.y) === r.P && s.x * s.y === r.A;
  const answer = r => { for (let x = 1; x <= r.max; x++) for (let y = 1; y <= r.max; y++) if (ok({ x, y }, r)) return { x, y }; return null; };
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ x: 1, y: 1 }),
    ok,
    solution: r => { const a = answer(r); return `${a.x} por ${a.y}`; },
    prompt: r => `Arma un rectángulo de perímetro ${r.P} y área ${r.A}`,
    foot: () => 'Arrastra la esquina del rectángulo',
    layout: G => lay(G),
    enter(G) { G.grab = false; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, u = G.u, o = G.o, P = 2 * (s.x + s.y), A = s.x * s.y;
      p.stroke(RK.al(p, C.line, 110)); p.strokeWeight(1);
      for (let i = 0; i <= r.max; i++) { p.line(o.x + i * u, o.y, o.x + i * u, o.y - r.max * u); p.line(o.x, o.y - i * u, o.x + r.max * u, o.y - i * u); }
      p.stroke(ok(s, r) ? C.ok : C.brand); p.strokeWeight(2.4); p.fill(RK.al(p, C.sky, 70)); p.rect(o.x, o.y - s.y * u, s.x * u, s.y * u);
      RK.knob(p, C, o.x + s.x * u, o.y - s.y * u, C.brand);
      TK.label(p, C, String(s.x), o.x + s.x * u / 2, o.y + 12, C.ink, 12, 40); TK.label(p, C, String(s.y), o.x - 12, o.y - s.y * u / 2, C.ink, 12, 30);
      const mx = o.x + r.max * u + 8, gw = G.W - mx - 10;
      if (gw > 50) [[`P = ${P}`, P === r.P], [`A = ${A}`, A === r.A]].forEach(([t, g], i) => RK.chip(p, C, { x: mx, y: 110 + i * 44, w: gw, h: 34 }, t, { on: g, col: g ? C.ok : C.coral, size: 12 }));
      RK.strip(p, C, G.fb, ok(s, r) ? `$x + y = ${r.P / 2},\\ xy = ${r.A}:\\ x^2 - ${r.P / 2}x + ${r.A} = 0$` : `$P = ${P}\\ (${r.P}),\\ \\ A = ${A}\\ (${r.A})$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { const k = { x: G.o.x + G.s.x * G.u, y: G.o.y - G.s.y * G.u }; if (Math.hypot(x - k.x, y - k.y) > 40 && !hitBox({ x: G.o.x, y: G.o.y - G.r.max * G.u, w: G.r.max * G.u, h: G.r.max * G.u }, x, y)) return false; G.grab = true; game.move(G, x, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, x, y); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.o.x + G.s.x * G.u, y: G.o.y - G.s.y * G.u }, to: { x: G.o.x + (G.s.x + 3) * G.u, y: G.o.y - (G.s.y + 2) * G.u }, text: 'Arrastra la esquina', ty: G.o.y + 30 }),
    peek: G => ({ o: G.o, u: G.u }),
  });
  game.move = (G, x, y) => { const c = v => Math.max(1, Math.min(G.r.max, Math.round(v))), nx = c((x - G.o.x) / G.u), ny = c((G.o.y - y) / G.u); if (nx !== G.s.x || ny !== G.s.y || !G.touched[G.cur]) { G.s.x = nx; G.s.y = ny; G.touch(); } };
  return Object.assign(game, { answer });
})();
