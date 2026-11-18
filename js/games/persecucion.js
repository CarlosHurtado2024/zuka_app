// La persecución (Preuniversitario, pu-pr-3; spec 2026-11-18-preuda-razonamiento-completo): si uno sale con ventaja y el de
// atrás va más rápido, cada hora le descuenta la diferencia de velocidades: lo alcanza en ventaja ÷ (v₂ − v₁). Se arrastra
// el tiempo y los dos carros avanzan por la carretera; hay que dejarlos justo en el mismo punto.
// params = { rounds: [{ head, v1, v2 }] }   (head: km de ventaja del primero)   state = { rounds: [{ t }] }   (horas, de media en media hasta 8)
GAMES['persecucion'] = (() => {
  const need = r => r.head / (r.v2 - r.v1);
  const ok = (s, r) => Math.abs(s.t - need(r)) < 1e-9;
  const game = roundsGame({
    aspect: 1,
    init: () => ({ t: 0.5 }),
    ok,
    solution: r => `${RK.num(need(r))} h`,
    prompt: r => `Un carro sale con ${r.head} km de ventaja a ${r.v1} km/h; otro lo sigue a ${r.v2} km/h. ¿Cuándo lo alcanza?`,
    foot: () => 'Arrastra el tiempo',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { t: need(r) } : G.s, good = ok(s, r), x1 = r.head + r.v1 * s.t, x2 = r.v2 * s.t, L = r.head + r.v1 * 8, u = (G.W - 50) / L, y = 150;
      p.stroke(C.line); p.strokeWeight(14); p.line(25, y, G.W - 25, y); p.strokeWeight(1); p.stroke(C.bg); p.drawingContext.setLineDash([8, 6]); p.line(25, y, G.W - 25, y); p.drawingContext.setLineDash([]);
      const car = (x, col, dy) => { p.noStroke(); p.fill(col); p.rect(25 + x * u - 12, y + dy - 7, 24, 14, 4); };
      car(x1, good ? C.ok : C.sky, -14); car(x2, good ? C.ok : C.coral, 14);
      TK.label(p, C, `${RK.num(x1)} km`, 25 + x1 * u, y - 32, C.sky, 10, 60); TK.label(p, C, `${RK.num(x2)} km`, 25 + x2 * u, y + 34, C.coral, 10, 60);
      TK.label(p, C, `distancia entre ellos: ${RK.num(Math.abs(x1 - x2))} km`, G.W / 2, y + 64, good ? C.ok : C.ink, 11, G.W - 30);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 16, Math.round(s.t * 2) - 1, i => ((i + 1) % 2 === 0 ? String((i + 1) / 2) : null));
      RK.strip(p, C, G.fb, `$${r.head} - (${r.v2} - ${r.v1}) \\cdot ${RK.num(s.t)} = ${RK.num(r.head - (r.v2 - r.v1) * s.t)}$`, { kicker: 'Cada hora descuenta la diferencia', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X(1), y: G.tY }, text: 'Arrastra el tiempo', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = (RK.pick(x, 30, G.W - 30, 16) + 1) / 2; if (v !== G.s.t || !G.touched[G.cur]) { G.s.t = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ t: need(r) }) });
})();
