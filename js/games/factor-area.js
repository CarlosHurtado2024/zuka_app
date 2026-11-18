// Escalar una figura (Preuniversitario, pu-ge-3; spec 2026-11-18-preuda-razonamiento-completo): si las longitudes se
// multiplican por k, el área se multiplica por k² y el volumen por k³. Se ve la figura original en cuadritos (o cubitos) y se
// arrastra el factor k; la copia crece y se cuentan sus cuadritos. Hay que llegar al área (o volumen) pedido.
// params = { rounds: [{ kind: 'area' | 'vol', side, target }] }   (side: lado original en unidades)   state = { rounds: [{ k }] }   (k de 1 a 5)
GAMES['factor-area'] = (() => {
  const val = (r, k) => (r.kind === 'vol' ? (r.side * k) ** 3 : (r.side * k) ** 2);
  const ok = (s, r) => val(r, s.k) === r.target;
  const answer = r => { for (let k = 1; k <= 5; k++) if (val(r, k) === r.target) return { k }; return null; };
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ k: 1 }),
    ok,
    solution: r => `k = ${answer(r).k}`,
    prompt: r => (r.kind === 'vol' ? `Un cubo de ${r.side ** 3} cubitos crece hasta ${r.target}. ¿Por cuánto se multiplicó la arista?` : `Un cuadrado de ${r.side ** 2} cuadritos crece hasta ${r.target}. ¿Por cuánto se multiplicó el lado?`),
    foot: () => 'Arrastra el factor k que multiplica las longitudes',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, n = r.side * s.k, room = Math.min(G.W - 120, G.tY - 150), c = Math.min(22, room / (r.side * 5)), good = ok(s, r);
      const sq = (x, y, m, col) => { for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) { p.stroke(C.bg); p.strokeWeight(1); p.fill(col); p.rect(x + i * c, y + j * c, c, c, 2); } };
      sq(20, 110, r.side, C.mint);
      TK.label(p, C, 'original', 20 + r.side * c / 2, 100, C.mute, 9, 70);
      const x0 = Math.max(30 + r.side * c + 20, G.W - 20 - n * c);
      sq(x0, 110, n, good ? C.ok : C.sky);
      if (r.kind === 'vol') TK.label(p, C, `× ${n} capas`, x0 + n * c / 2, 110 + n * c + 12, C.mute, 10, 90);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 5, s.k - 1, i => `k = ${i + 1}`);
      RK.strip(p, C, G.fb, r.kind === 'vol' ? `$${n}^3 = ${val(r, s.k)}\\ \\text{cubitos}$` : `$${n}^2 = ${val(r, s.k)}\\ \\text{cuadritos}$`, { kicker: `Las longitudes por ${s.k}`, col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X([1, 2, 3].find(i => i + 1 !== answer(G.r).k)), y: G.tY }, text: 'Arrastra el factor', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 5) + 1; if (v !== G.s.k || !G.touched[G.cur]) { G.s.k = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
