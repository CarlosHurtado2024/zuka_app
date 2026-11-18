// La velocidad media (Preuniversitario, pu-pr-3; spec 2026-11-18-preuda-razonamiento-completo): la velocidad media es la
// distancia total entre el tiempo total, no el promedio de las velocidades. Un viaje de dos tramos; arriba las barras del
// tiempo de cada tramo. Se arrastra una velocidad constante y su barra de tiempo debe igualar la suma de las otras dos.
// params = { rounds: [{ legs: [[km, km/h], [km, km/h]] }] }   state = { rounds: [{ v }] }   (km/h, de 5 en 5 hasta 120)
GAMES['velocidad-media'] = (() => {
  const D = r => r.legs[0][0] + r.legs[1][0], T = r => r.legs[0][0] / r.legs[0][1] + r.legs[1][0] / r.legs[1][1];
  const need = r => D(r) / T(r);
  const ok = (s, r) => Math.abs(s.v - need(r)) < 1e-9;
  const game = roundsGame({
    aspect: 1.15,
    init: r => { const avg = (r.legs[0][1] + r.legs[1][1]) / 2; const a5 = Math.round(avg / 5) * 5; return { v: a5 === need(r) ? 10 : a5 }; },
    ok,
    solution: r => `${RK.num(need(r))} km/h`,
    prompt: r => `${r.legs[0][0]} km a ${r.legs[0][1]} km/h y ${r.legs[1][0]} km a ${r.legs[1][1]} km/h. ¿Velocidad media?`,
    foot: () => 'Arrastra la velocidad que hace el viaje en el mismo tiempo',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { v: need(r) } : G.s, t1 = r.legs[0][0] / r.legs[0][1], t2 = r.legs[1][0] / r.legs[1][1], tv = D(r) / s.v, u = (G.W - 60) / Math.max(T(r), tv) / 1.1, good = ok(s, r);
      TK.label(p, C, 'tiempo del viaje real', G.W / 2, 104, C.mute, 10, 200);
      p.noStroke(); p.fill(C.sky); p.rect(30, 114, t1 * u, 24, 3); p.fill(C.coral); p.rect(30 + t1 * u, 114, t2 * u, 24, 3);
      TK.label(p, C, `${RK.num(t1)} h + ${RK.num(t2)} h = ${RK.num(T(r))} h`, G.W / 2, 150, C.ink, 11, G.W - 30);
      TK.label(p, C, `a ${s.v} km/h constante`, G.W / 2, 176, C.mute, 10, 200);
      p.fill(good ? C.ok : C.mint); p.rect(30, 186, tv * u, 24, 3);
      TK.label(p, C, `${D(r)} km ÷ ${s.v} = ${RK.num(Math.round(tv * 100) / 100)} h`, G.W / 2, 222, C.ink, 11, G.W - 30);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 24, s.v / 5 - 1, i => ((i + 1) % 4 === 0 ? String((i + 1) * 5) : null));
      RK.strip(p, C, G.fb, `$v_m = \\dfrac{${D(r)}}{${RK.num(T(r))}} ${good ? '=' : '\\ne'} ${s.v}$`, { kicker: 'Distancia total ÷ tiempo total', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.v / 5 - 1), y: G.tY }, to: { x: G.X(Math.min(23, G.s.v / 5 + 2)), y: G.tY }, text: 'Arrastra la velocidad', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = (RK.pick(x, 30, G.W - 30, 24) + 1) * 5; if (v !== G.s.v || !G.touched[G.cur]) { G.s.v = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ v: need(r) }) });
})();
