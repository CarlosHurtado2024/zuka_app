// Eliminar una incógnita (Álgebra, alg-101; spec 2026-11-18-algebra-revision): si a una ecuación se le suma otra
// multiplicada por un número, la solución no cambia; con el número justo una incógnita desaparece. Se arrastra el
// multiplicador k de la segunda ecuación y abajo se ve la suma fila 1 + k · fila 2: barras para los coeficientes de x y de
// y. Cuando la barra de y se apaga, queda una ecuación con una sola incógnita y el juego la resuelve.
// params = { rounds: [{ e1: [a, b, c], e2: [a, b, c] }] }   state = { rounds: [{ k }] }   (k entero de −4 a 4)
GAMES['elimina-variable'] = (() => {
  const K = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  const sum = (r, k) => r.e1.map((v, i) => v + k * r.e2[i]);
  const ok = (s, r) => sum(r, s.k)[1] === 0;
  const answer = r => ({ k: K.find(k => ok({ k }, r)) });
  const eq = ([a, b, c]) => `${a === 1 ? '' : a === -1 ? '-' : a}x ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y = ${c}`;
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ k: 0 }),
    ok,
    solution: r => { const k = answer(r).k, f = sum(r, k); return `k = ${k}: ${f[0]}x = ${f[2]}, x = ${f[2] / f[0]}`; },
    prompt: r => `Elimina la y: $${eq(r.e1)}$ y $${eq(r.e2)}$`,
    foot: () => 'Arrastra k: a la fila 1 se le suma k veces la fila 2',
    layout(G) { G.tY = G.H - 112; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, k = G.locked && !ok(G.s, r) ? answer(r).k : G.s.k, f = sum(r, k), cx = G.W / 2;
      TK.label(p, C, `fila 1: $${eq(r.e1)}$`, cx, 104, C.ink, 14, G.W - 30);
      TK.label(p, C, `fila 2: $${eq(r.e2)}$   × ${k}`, cx, 132, C.ink, 14, G.W - 30);
      [['x', f[0], C.sky], ['y', f[1], f[1] === 0 ? C.ok : C.coral]].forEach(([n, v, col], i) => {
        const y = 176 + i * 44; TK.label(p, C, n, 26, y + 11, C.mute, 14, 24);
        p.stroke(C.line); p.strokeWeight(1); p.line(cx, y - 4, cx, y + 26);
        p.noStroke(); p.fill(col); p.rect(cx, y, Math.max(-cx + 50, Math.min(cx - 50, v * 12)), 22, 3);
        TK.label(p, C, String(v), v >= 0 ? cx - 18 : cx + 18, y + 11, C.ink, 12, 30);
      });
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, K.length, K.indexOf(k), i => String(K[i]));
      const t = f[1] === 0 && f[0] !== 0 ? `${f[0]}x = ${f[2]} \\Rightarrow x = ${RK.num(f[2] / f[0])}` : eq(f);
      RK.strip(p, C, G.fb, `$${t}$`, { kicker: 'Fila 1 + k · fila 2', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(4), y: G.tY }, to: { x: G.X([6, 2, 7].find(i => K[i] !== answer(G.r).k)), y: G.tY }, text: 'Arrastra k', ty: G.tY - 32 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const k = K[RK.pick(x, 30, G.W - 30, K.length)]; if (k !== G.s.k || !G.touched[G.cur]) { G.s.k = k; G.touch(); } };
  return Object.assign(game, { answer, K });
})();
