// La regla de tres compuesta por unidades (Álgebra, alg-12f; spec 2026-11-18-algebra-revision): si el resultado es
// proporcional a dos magnitudes a la vez, se reduce a la unidad: lo que hace un trabajador en una hora. Una cuadrícula de
// trabajadores × horas; se arrastra cuánto rinde cada casilla hasta que la primera cuadrícula dé el dato conocido. Con ese
// rendimiento, el juego llena la segunda cuadrícula y da la respuesta.
// params = { rounds: [{ who, what, m1, h1, c1, m2, h2, step, max }] }   state = { rounds: [{ k }] }   (rendimiento k·step)
GAMES['tabla-compuesta'] = (() => {
  const ok = (s, r) => s.k * r.step * r.m1 * r.h1 === r.c1;
  const answer = r => ({ k: r.c1 / (r.m1 * r.h1) / r.step });
  const grid = (p, C, x, y, m, h, cell, v, col, good) => {
    for (let i = 0; i < m; i++) for (let j = 0; j < h; j++) { p.stroke(C.bg); p.strokeWeight(1.5); p.fill(good ? C.ok : col); p.rect(x + j * cell, y + i * cell, cell, cell, 3); }
  };
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ k: answer(r).k === 1 ? 2 : 1 }),
    ok,
    solution: r => `${r.c1 / (r.m1 * r.h1)} por casilla: ${r.c1 / (r.m1 * r.h1) * r.m2 * r.h2} ${r.what}`,
    prompt: r => `${r.m1} ${r.who} en ${r.h1} h: ${r.c1} ${r.what}. ¿Y ${r.m2} ${r.who} en ${r.h2} h?`,
    foot: () => 'Arrastra cuánto rinde un trabajador en una hora',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, v = s.k * r.step, cell = Math.min(22, (G.W - 60) / (r.h1 + r.h2), (G.tY - 160) / Math.max(r.m1, r.m2));
      const t1 = v * r.m1 * r.h1, good = ok(s, r);
      TK.label(p, C, `${r.m1} × ${r.h1} casillas = ${t1} (meta ${r.c1})`, 20 + r.h1 * cell / 2 + 30, 104, good ? C.ok : C.mute, 10, G.W / 2);
      grid(p, C, 20, 120, r.m1, r.h1, cell, v, C.sky, good);
      const x2 = G.W - 20 - r.h2 * cell;
      TK.label(p, C, good ? `${r.m2} × ${r.h2} = ${v * r.m2 * r.h2}` : '?', x2 + r.h2 * cell / 2, 104, C.mute, 10, G.W / 2);
      grid(p, C, x2, 120, r.m2, r.h2, cell, v, RK.al(p, C.coral, good ? 255 : 90), false);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, r.max / r.step, s.k - 1, i => ((i + 1) % 2 === 0 ? String((i + 1) * r.step) : null));
      RK.strip(p, C, G.fb, good ? `$${v}\\cdot ${r.m2}\\cdot ${r.h2} = ${v * r.m2 * r.h2}\\ \\text{${r.what}}$` : `$${v}\\ \\text{por casilla}$`, { col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.k - 1), y: G.tY }, to: { x: G.X([G.s.k + 1, G.s.k + 2, G.s.k + 3].find(i => i + 1 !== answer(G.r).k)), y: G.tY }, text: 'Arrastra el rendimiento', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const k = RK.pick(x, 30, G.W - 30, G.r.max / G.r.step) + 1; if (k !== G.s.k || !G.touched[G.cur]) { G.s.k = k; G.touch(); } };
  return Object.assign(game, { answer });
})();
