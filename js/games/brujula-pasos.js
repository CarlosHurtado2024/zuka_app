// Seguir instrucciones en la rejilla (Preuniversitario, pu-es-1; spec 2026-11-18-preuda-razonamiento-completo): «3 cuadras al
// norte, 5 al este, 1 al sur…»: los movimientos opuestos se cancelan, así que basta sumar lo vertical y lo horizontal por
// separado. Se arrastra la ficha a la esquina donde termina el recorrido (desde la salida marcada).
// params = { rounds: [{ w, h, start: [x, y], moves: [['N' | 'S' | 'E' | 'O', n]] }] }   state = { rounds: [{ x, y }] }
GAMES['brujula-pasos'] = (() => {
  const D = { N: [0, 1], S: [0, -1], E: [1, 0], O: [-1, 0] }, NAME = { N: 'norte', S: 'sur', E: 'este', O: 'oeste' };
  const end = r => r.moves.reduce((p, [d, n]) => [p[0] + D[d][0] * n, p[1] + D[d][1] * n], r.start);
  const ok = (s, r) => s.x === end(r)[0] && s.y === end(r)[1];
  const lay = G => { const r = G.r; G.u = Math.min((G.W - 40) / r.w, (G.H - 250) / r.h); G.o = { x: (G.W - r.w * G.u) / 2, y: 104 + r.h * G.u }; };
  const game = roundsGame({
    aspect: 1.3,
    init: r => ({ x: r.start[0], y: r.start[1] }),
    ok,
    solution: r => `(${end(r).join(', ')})`,
    prompt: r => r.moves.map(([d, n]) => `${n} al ${NAME[d]}`).join(', '),
    foot: () => 'Arrastra la ficha a la esquina donde termina el recorrido',
    layout(G) { lay(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { x: end(r)[0], y: end(r)[1] } : G.s, u = G.u, o = G.o, X = x => o.x + x * u, Y = y => o.y - y * u, good = ok(s, r);
      p.stroke(RK.al(p, C.line, 120)); p.strokeWeight(1); for (let i = 0; i <= r.w; i++) p.line(X(i), Y(0), X(i), Y(r.h)); for (let j = 0; j <= r.h; j++) p.line(X(0), Y(j), X(r.w), Y(j));
      TK.label(p, C, 'N ↑', X(r.w) - 14, Y(r.h) - 10, C.mute, 10, 30);
      p.noStroke(); p.fill(C.sky); p.circle(X(r.start[0]), Y(r.start[1]), 18); TK.label(p, C, 'salida', X(r.start[0]), Y(r.start[1]) + 16, C.mute, 9, 50);
      p.fill(good ? C.ok : C.brand); p.circle(X(s.x), Y(s.y), 22);
      RK.strip(p, C, G.fb, good ? '$\\text{los opuestos se cancelan}$' : '$\\text{suma lo horizontal y lo vertical}$', { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { if (Math.hypot(x - (G.o.x + G.s.x * G.u), y - (G.o.y - G.s.y * G.u)) > 36) return false; G.grab = true; return true; },
    drag(G, x, y) { if (!G.grab) return false; const nx = Math.max(0, Math.min(G.r.w, Math.round((x - G.o.x) / G.u))), ny = Math.max(0, Math.min(G.r.h, Math.round((G.o.y - y) / G.u))); if (nx !== G.s.x || ny !== G.s.y || !G.touched[G.cur]) { G.s.x = nx; G.s.y = ny; G.touch(); } return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.o.x + G.s.x * G.u, y: G.o.y - G.s.y * G.u }, to: { x: G.o.x + (G.s.x + 1) * G.u, y: G.o.y - (G.s.y + 1) * G.u }, text: 'Arrastra la ficha', ty: G.o.y + 26 }),
    peek: G => ({ o: G.o, u: G.u }),
  });
  return Object.assign(game, { answer: r => ({ x: end(r)[0], y: end(r)[1] }) });
})();
