// Contar cuadrados por tamaños (Preuniversitario, pu-co-5; spec 2026-11-18-preuda-razonamiento-completo): en una cuadrícula de
// n × n hay cuadrados de 1, de 2, …, de n; los de lado s caben (n − s + 1) veces por fila y por columna: (n − s + 1)². Para
// cada tamaño se arrastra cuántos hay (el juego muestra uno de ese tamaño moviéndose por la cuadrícula para ayudar a contar).
// params = { rounds: [{ n }] }   state = { rounds: [{ c: [conteo por tamaño] }] }   (conteos de 0 a 25)
GAMES['cuenta-cuadrados'] = (() => {
  const want = r => Array.from({ length: r.n }, (_, s) => (r.n - s) ** 2);
  const ok = (st, r) => st.c.join() === want(r).join();
  const game = roundsGame({
    aspect: 1.45,
    init: r => ({ c: Array(r.n).fill(0) }),
    ok,
    answered: s => s.c.some(v => v > 0),
    solution: r => `${want(r).join(' + ')} = ${want(r).reduce((a, b) => a + b, 0)}`,
    prompt: r => `¿Cuántos cuadrados hay en una cuadrícula de ${r.n} × ${r.n}?`,
    foot: () => 'Arrastra cuántos cuadrados hay de cada tamaño',
    layout(G) { const n = G.r.n; G.u = Math.min(30, (G.W * 0.5) / n); G.o = { x: (G.W - n * G.u) / 2, y: 104 }; G.tr = Array.from({ length: n }, (_, s) => 104 + n * G.u + 34 + s * 40); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; game.layout(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { c: want(r) } : G.s, n = r.n, u = G.u, o = G.o, good = ok(s, r);
      p.stroke(C.ink); p.strokeWeight(1.4); p.noFill(); for (let i = 0; i <= n; i++) { p.line(o.x + i * u, o.y, o.x + i * u, o.y + n * u); p.line(o.x, o.y + i * u, o.x + n * u, o.y + i * u); }
      const sz = G.grab >= 0 ? G.grab + 1 : 0;
      if (sz) { const m = n - sz + 1, k = Math.floor(G.t * 1.2) % (m * m); p.stroke(C.brand); p.strokeWeight(3); p.rect(o.x + (k % m) * u, o.y + Math.floor(k / m) * u, sz * u, sz * u); }
      G.X = G.tr.map((ty, si) => { TK.label(p, C, `lado ${si + 1}: ${s.c[si]}`, 50, ty - 14, s.c[si] === want(r)[si] && G.locked ? C.ok : C.ink, 10, 90); return RK.track(p, C, 100, G.W - 24, ty, 26, s.c[si], i => (i % 5 === 0 ? String(i) : null), C.sky); });
      RK.strip(p, C, G.fb, `$${s.c.join(' + ')} = ${s.c.reduce((a, b) => a + b, 0)}$`, { col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 18); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[0](0), y: G.tr[0] }, to: { x: G.X[0](3), y: G.tr[0] }, text: 'Arrastra el conteo', ty: G.tr[0] - 28 }),
    peek: G => ({ tr: G.tr }),
  });
  game.layout = G => { const n = G.r.n; G.u = Math.min(30, (G.W * 0.5) / n); G.o = { x: (G.W - n * G.u) / 2, y: 104 }; G.tr = Array.from({ length: n }, (_, s) => 104 + n * G.u + 34 + s * 40); };
  game.move = (G, x) => { const v = RK.pick(x, 100, G.W - 24, 26), j = G.grab; if (v !== G.s.c[j] || !G.touched[G.cur]) { G.s.c[j] = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ c: want(r) }) });
})();
