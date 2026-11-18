// La cinta de la razón (Álgebra, alg-12; spec 2026-11-18-algebra-revision): el diagrama de cinta. Una cinta de T unidades
// se parte con una manija en dos tramos, A y B; abajo se escribe A : B y su forma más simple. Hay que dejar la razón que
// pide la ronda: con 2 : 5 en 35, cada «parte» vale 5 y la cinta queda 10 y 25.
// params = { rounds: [{ T, p, q, A, B }] }   state = { rounds: [{ a }] }   (a: unidades del primer tramo)
GAMES['barra-razon'] = (() => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const need = r => (r.T * r.p) / (r.p + r.q);
  const ok = (s, r) => s.a * r.q === (r.T - s.a) * r.p;
  const game = roundsGame({
    aspect: 0.95,
    init: r => ({ a: Math.round(r.T / 2) === need(r) ? Math.round(r.T / 2) + 1 : Math.round(r.T / 2) }),
    ok,
    solution: r => `${need(r)} de ${r.A} y ${r.T - need(r)} de ${r.B}`,
    prompt: r => `${r.T} en total, ${r.A} a ${r.B} como ${r.p} : ${r.q}`,
    foot: () => 'Arrastra la manija para partir la cinta',
    layout(G) { G.bar = { x: 16, y: G.H * 0.42, w: G.W - 32, h: 46 }; G.fb = { x: 12, y: G.H - 84, w: G.W - 24, h: 52 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r, bar } = G, a = G.locked && !ok(G.s, r) ? need(r) : G.s.a, b = r.T - a, u = bar.w / r.T, g = gcd(a, b) || 1;
      p.stroke(C.line); p.strokeWeight(1); p.fill(C.sky); p.rect(bar.x, bar.y, a * u, bar.h, 6, 0, 0, 6); p.fill(C.coral); p.rect(bar.x + a * u, bar.y, b * u, bar.h, 0, 6, 6, 0);
      if (u > 5) for (let i = 1; i < r.T; i++) { p.stroke(RK.al(p, C.ink, 50)); p.strokeWeight(1); p.line(bar.x + i * u, bar.y + 4, bar.x + i * u, bar.y + bar.h - 4); }
      TK.label(p, C, `${r.A}: ${a}`, bar.x + a * u / 2, bar.y - 14, C.ink, 12, Math.max(60, a * u)); TK.label(p, C, `${r.B}: ${b}`, bar.x + a * u + b * u / 2, bar.y - 14, C.ink, 12, Math.max(60, b * u));
      G.hx = bar.x + a * u; RK.knob(p, C, G.hx, bar.y + bar.h + 26, C.brand);
      RK.strip(p, C, G.fb, `$${a} : ${b} = ${a / g} : ${b / g}$`, { kicker: `Meta: ${r.p} : ${r.q}`, col: G.locked ? C.ok : ok(G.s, r) ? C.ok : C.brand, size: 20 });
    },
    press(G, x, y) { if (Math.abs(y - (G.bar.y + G.bar.h / 2)) > 60) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.hx, y: G.bar.y + G.bar.h + 26 }, to: { x: G.hx - 50, y: G.bar.y + G.bar.h + 26 }, text: 'Arrastra la manija', ty: G.bar.y - 40 }),
    peek: G => ({ bar: G.bar }),
  });
  game.move = (G, x) => { const r = G.r, a = Math.max(1, Math.min(r.T - 1, Math.round((x - G.bar.x) / (G.bar.w / r.T)))); if (a !== G.s.a || !G.touched[G.cur]) { G.s.a = a; G.touch(); } };
  return Object.assign(game, { need });
})();
