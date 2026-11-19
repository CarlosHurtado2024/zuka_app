// La última cifra de una potencia (Preuniversitario, pu-se-3; spec 2026-11-18-preuda-razonamiento-completo): la última cifra de
// a, a², a³… se repite en un ciclo. El juego calcula las primeras potencias y marca su última cifra; se arrastra el marcador
// de la regla 0–9 hasta la cifra en que termina aⁿ.
// params = { rounds: [{ a, n }] }   state = { rounds: [{ d }] }   (d de 0 a 9)
GAMES['ultima-cifra'] = (() => {
  const last = (a, n) => { let x = 1; for (let i = 0; i < n; i++) x = x * a % 10; return x; };
  const ok = (s, r) => s.d === last(r.a, r.n);
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ d: last(r.a, r.n) === 0 ? 1 : 0 }),
    ok,
    solution: r => `$${r.a}^{${r.n}}$ termina en ${last(r.a, r.n)}`,
    prompt: r => `¿En qué cifra termina $${r.a}^{${r.n}}$?`,
    foot: () => 'Arrastra el marcador a la última cifra',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { d: last(r.a, r.n) } : G.s, good = ok(s, r), y0 = 96, rh = (G.tY - 40 - y0) / 5;
      for (let k = 1; k <= 6; k++) {
        const str = String(Math.pow(r.a, k)), y = y0 + (k - 1) * rh, tx = str.length > 9 ? '…' + str.slice(-8) : str;
        TK.label(p, C, `$${r.a}^{${k}}$`, 46, y, C.mute, 12, 60);
        TK.label(p, C, tx.length > 1 ? tx.slice(0, -1) : '', G.W * 0.48, y, C.ink, 12, G.W * 0.45);
        p.noStroke(); p.fill(RK.al(p, C.coral, 60)); p.rect(G.W * 0.8 - 13, y - 12, 26, 24, 6);
        TK.label(p, C, str.slice(-1), G.W * 0.8, y, C.ink, 14, 26);
      }
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 10, s.d, i => String(i), good ? C.ok : C.brand);
      RK.strip(p, C, G.fb, good ? `$${r.a}^{${r.n}}\\ \\text{termina en}\\ ${s.d}$` : `$\\text{¿termina en}\\ ${s.d}?$`, { col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.d), y: G.tY }, to: { x: G.X(G.s.d + 3), y: G.tY }, text: 'Arrastra el marcador', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const d = RK.pick(x, 30, G.W - 30, 10); if (d !== G.s.d || !G.touched[G.cur]) { G.s.d = d; G.touch(); } };
  return Object.assign(game, { answer: r => ({ d: last(r.a, r.n) }) });
})();
