// Dos recibos (Álgebra, alg-101; spec 2026-11-18-algebra-revision): un sistema de ecuaciones es un par de condiciones
// que se cumplen a la vez. Dos recibos de compras con los mismos artículos; se arrastran los precios de los dos artículos y
// cada recibo se arma como una barra de bloques (un bloque por artículo, de largo su precio) frente a su total. Los dos
// recibos deben cuadrar con los mismos precios.
// params = { rounds: [{ names: [a, b], e1: [n, m, total], e2: [n, m, total], max }] }   state = { rounds: [{ p: [pa, pb] }] }   (enteros de 1 a max)
GAMES['dos-compras'] = (() => {
  const tot = (e, p) => e[0] * p[0] + e[1] * p[1];
  const ok = (s, r) => tot(r.e1, s.p) === r.e1[2] && tot(r.e2, s.p) === r.e2[2];
  const answer = r => { for (let a = 1; a <= r.max; a++) for (let b = 1; b <= r.max; b++) if (ok({ p: [a, b] }, r)) return { p: [a, b] }; return null; };
  const game = roundsGame({
    aspect: 1.15,
    init: r => (ok({ p: [1, 1] }, r) ? { p: [2, 1] } : { p: [1, 1] }),
    ok,
    solution: r => { const a = answer(r).p; return `${r.names[0]}: ${a[0]} mil; ${r.names[1]}: ${a[1]} mil`; },
    prompt: r => `¿Cuánto vale un ${r.names[0]} y cuánto un ${r.names[1]}?`,
    foot: () => 'Arrastra los dos precios hasta que los dos recibos cuadren',
    layout(G) { G.tr = [0, 1].map(i => G.H - 150 + i * 44); G.fb = { x: 12, y: G.H - 64, w: G.W - 24, h: 42 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, maxT = Math.max(r.e1[2], r.e2[2], tot(r.e1, s.p), tot(r.e2, s.p)), u = (G.W - 70) / maxT, x0 = 20;
      [r.e1, r.e2].forEach((e, k) => {
        const y = 108 + k * 70; let x = x0;
        TK.label(p, C, `recibo ${k + 1}: ${e[0]} × ${r.names[0]} + ${e[1]} × ${r.names[1]} = ${e[2]} mil`, G.W / 2, y - 10, C.mute, 10, G.W - 30);
        [0, 1].forEach(j => { for (let n = 0; n < e[j]; n++) { p.stroke(C.bg); p.strokeWeight(1.5); p.fill(j ? C.coral : C.sky); p.rect(x, y, s.p[j] * u, 26, 4); x += s.p[j] * u; } });
        const tx = x0 + e[2] * u, good = tot(e, s.p) === e[2];
        p.stroke(good ? C.ok : C.ink); p.strokeWeight(2); p.drawingContext.setLineDash([4, 3]); p.line(tx, y - 6, tx, y + 32); p.drawingContext.setLineDash([]);
        TK.label(p, C, `${tot(e, s.p)} / ${e[2]}`, Math.min(G.W - 30, Math.max(tx, x) + 26), y + 13, good ? C.ok : C.ink, 11, 52);
      });
      G.X = [0, 1].map(j => { TK.label(p, C, r.names[j], 40, G.tr[j] - 16, j ? C.coral : C.sky, 11, 80); return RK.track(p, C, 30, G.W - 30, G.tr[j], r.max, s.p[j] - 1, i => (r.max <= 10 || i % 2 === 1 ? String(i + 1) : null), j ? C.coral : C.sky); });
      RK.strip(p, C, G.fb, `$${r.e1[0]}a + ${r.e1[1]}b = ${tot(r.e1, s.p)},\\ \\ ${r.e2[0]}a + ${r.e2[1]}b = ${tot(r.e2, s.p)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 20); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[0](G.s.p[0] - 1), y: G.tr[0] }, to: { x: G.X[0](G.s.p[0] + 1), y: G.tr[0] }, text: 'Arrastra un precio', ty: G.tr[1] + 26 }),
    peek: G => ({ tr: G.tr }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, G.r.max) + 1, j = G.grab; if (v !== G.s.p[j] || !G.touched[G.cur]) { G.s.p[j] = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
