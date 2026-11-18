// La caja desarmada (Preuniversitario, pu-ge-6; spec 2026-11-18-preuda-razonamiento-completo): el área de la superficie de una
// caja es la suma de sus seis caras, que vienen en tres parejas: 2(ab + bc + ca). La caja está abierta sobre la mesa (su
// desarrollo); se arrastra la altura y las caras laterales cambian. Hay que llegar al área pedida.
// params = { rounds: [{ a, b, target }] }   state = { rounds: [{ c }] }   (altura de 1 a 8)
GAMES['desarrollo-caja'] = (() => {
  const SA = (r, c) => 2 * (r.a * r.b + r.b * c + c * r.a);
  const ok = (s, r) => SA(r, s.c) === r.target;
  const answer = r => { for (let c = 1; c <= 8; c++) if (SA(r, c) === r.target) return { c }; return null; };
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ c: 1 }),
    ok,
    solution: r => `altura ${answer(r).c}`,
    prompt: r => `Caja de base ${r.a} × ${r.b}: ¿qué altura da una superficie de ${r.target}?`,
    foot: () => 'Arrastra la altura de la caja',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r), a = r.a, b = r.b, c = s.c;
      const W = 2 * a + 2 * c, H = b + 2 * c, u = Math.min((G.W - 30) / W, (G.tY - 150) / H), x0 = (G.W - W * u) / 2, y0 = 100;
      const face = (x, y, w, h, col, t) => { p.stroke(C.bg); p.strokeWeight(1.5); p.fill(good ? C.ok : col); p.rect(x0 + x * u, y0 + y * u, w * u, h * u); if (w * u > 26 && h * u > 14) TK.label(p, C, t, x0 + (x + w / 2) * u, y0 + (y + h / 2) * u, C.ink, 9, w * u); };
      face(c, c, a, b, C.sky, `${a * b}`); face(c + a + c, c, a, b, C.sky, `${a * b}`);
      face(0, c, c, b, C.mint, `${b * c}`); face(c + a, c, c, b, C.mint, `${b * c}`);
      face(c, 0, a, c, C.coral, `${a * c}`); face(c, c + b, a, c, C.coral, `${a * c}`);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 8, c - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, `$2(${a * b} + ${b * c} + ${a * c}) = ${SA(r, c)}$`, { kicker: `altura ${c}`, col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X([2, 3, 6].find(i => i + 1 !== answer(G.r).c)), y: G.tY }, text: 'Arrastra la altura', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 8) + 1; if (v !== G.s.c || !G.touched[G.cur]) { G.s.c = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
