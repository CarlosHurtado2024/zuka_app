// El punto a tantas cuadras (Preuniversitario, pu-es-1; spec 2026-11-18-preuda-razonamiento-completo): en la rejilla la
// distancia entre dos esquinas es |Δx| + |Δy| cuadras. Hay dos lugares marcados; se arrastra la casa a la esquina que queda a
// la distancia pedida de cada uno (la solución es única dentro de la rejilla).
// params = { rounds: [{ w, h, A: [x, y], B: [x, y], dA, dB, names: [a, b] }] }   state = { rounds: [{ x, y }] }
GAMES['punto-distancia'] = (() => {
  const d = (p, q) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]);
  const ok = (s, r) => d([s.x, s.y], r.A) === r.dA && d([s.x, s.y], r.B) === r.dB;
  const sols = r => { const out = []; for (let x = 0; x <= r.w; x++) for (let y = 0; y <= r.h; y++) if (ok({ x, y }, r)) out.push({ x, y }); return out; };
  const lay = G => { const r = G.r; G.u = Math.min((G.W - 40) / r.w, (G.H - 230) / r.h); G.o = { x: (G.W - r.w * G.u) / 2, y: 104 + r.h * G.u }; };
  const game = roundsGame({
    aspect: 1.25,
    init: r => [[0, 0], [r.w, r.h], [0, r.h]].map(([x, y]) => ({ x, y })).find(s => !ok(s, r)),
    ok,
    solution: r => { const s = sols(r)[0]; return `(${s.x}, ${s.y})`; },
    prompt: r => `La casa está a ${r.dA} cuadras de ${r.names[0]} y a ${r.dB} de ${r.names[1]}`,
    foot: () => 'Arrastra la casa por las esquinas',
    layout(G) { lay(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? sols(r)[0] : G.s, u = G.u, o = G.o, X = x => o.x + x * u, Y = y => o.y - y * u, good = ok(s, r);
      p.stroke(RK.al(p, C.line, 120)); p.strokeWeight(1); for (let i = 0; i <= r.w; i++) p.line(X(i), Y(0), X(i), Y(r.h)); for (let j = 0; j <= r.h; j++) p.line(X(0), Y(j), X(r.w), Y(j));
      [[r.A, r.names[0], C.sky, d([s.x, s.y], r.A)], [r.B, r.names[1], C.coral, d([s.x, s.y], r.B)]].forEach(([q, t, col, dd]) => { p.noStroke(); p.fill(col); p.rect(X(q[0]) - 9, Y(q[1]) - 9, 18, 18, 3); TK.label(p, C, `${t}: ${dd}`, X(q[0]), Y(q[1]) - 16, col, 9, 80); });
      p.fill(good ? C.ok : C.brand); p.triangle(X(s.x) - 11, Y(s.y) + 8, X(s.x) + 11, Y(s.y) + 8, X(s.x), Y(s.y) - 10);
      RK.strip(p, C, G.fb, `$\\text{a ${d([s.x, s.y], r.A)} y ${d([s.x, s.y], r.B)} cuadras}$`, { col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.hypot(x - (G.o.x + G.s.x * G.u), y - (G.o.y - G.s.y * G.u)) > 36) return false; G.grab = true; return true; },
    drag(G, x, y) { if (!G.grab) return false; const nx = Math.max(0, Math.min(G.r.w, Math.round((x - G.o.x) / G.u))), ny = Math.max(0, Math.min(G.r.h, Math.round((G.o.y - y) / G.u))); if (nx !== G.s.x || ny !== G.s.y || !G.touched[G.cur]) { G.s.x = nx; G.s.y = ny; G.touch(); } return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.o.x + G.s.x * G.u, y: G.o.y - G.s.y * G.u }, to: { x: G.o.x + (G.s.x + (G.s.x < G.r.w ? 1 : -1)) * G.u, y: G.o.y - G.s.y * G.u }, text: 'Arrastra la casa', ty: G.o.y + 22 }),
    peek: G => ({ o: G.o, u: G.u }),
  });
  return Object.assign(game, { answer: r => sols(r)[0], solutions: sols });
})();
