// El precio de una unidad (Álgebra, alg-12; spec 2026-11-18-algebra-revision): una razón compara dividiendo: precio por
// unidad = precio ÷ unidades. Cada paquete es una barra del largo de su precio; se arrastra el precio de una unidad y el
// juego pone tantas copias como unidades trae el paquete. Cuando las copias llenan la barra justa, ese es el precio unitario.
// params = { rounds: [{ names: [a, b], packs: [[n, precio], [n, precio]], step, max }] }   state = { rounds: [{ v: [k, k] }] }   (k·step)
GAMES['tasa-unitaria'] = (() => {
  const ok = (s, r) => r.packs.every(([n, pr], j) => s.v[j] * r.step * n === pr);
  const answer = r => ({ v: r.packs.map(([n, pr]) => pr / n / r.step) });
  const fmt = v => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ v: [1, 1] }),
    ok,
    solution: r => r.packs.map(([n, pr], j) => `${r.names[j]}: ${fmt(pr / n)} c/u`).join('; '),
    prompt: r => `¿Cuánto vale una unidad en cada paquete? ¿Cuál sale más barato?`,
    foot: () => 'Arrastra el precio de una unidad de cada paquete',
    layout(G) { G.tr = [G.H - 150, G.H - 108]; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, maxP = Math.max(...r.packs.map(q => q[1])) * 1.25, u = (G.W - 40) / maxP, x0 = 20;
      r.packs.forEach(([n, pr], j) => {
        const y = 110 + j * 74, v = s.v[j] * r.step, good = v * n === pr;
        TK.label(p, C, `${r.names[j]}: ${n} unidades por ${fmt(pr)} pesos`, G.W / 2, y - 12, C.mute, 11, G.W - 30);
        p.noStroke(); p.fill(RK.al(p, C.card, 200)); p.rect(x0, y, pr * u, 26, 4);
        for (let i = 0; i < n; i++) { const x = x0 + i * v * u; if (x > G.W - 10) break; p.stroke(C.bg); p.strokeWeight(1.2); p.fill(good ? C.ok : j ? C.coral : C.sky); p.rect(x, y + 30, Math.min(v * u, G.W - 10 - x), 14, 2); }
        p.stroke(C.ink); p.strokeWeight(2); p.line(x0 + pr * u, y - 4, x0 + pr * u, y + 48);
      });
      G.X = [0, 1].map(j => RK.track(p, C, 30, G.W - 30, G.tr[j], r.max / r.step, s.v[j] - 1, i => ((i + 1) % 5 === 0 ? fmt((i + 1) * r.step) : null), j ? C.coral : C.sky));
      const [a, b] = r.packs.map(([n, pr]) => pr / n), done = ok(s, r);
      RK.strip(p, C, G.fb, done ? `$\\text{${a < b ? r.names[0] : r.names[1]} sale más barato}$` : `$${fmt(s.v[0] * r.step)}\\ \\text{y}\\ ${fmt(s.v[1] * r.step)}\\ \\text{por unidad}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 20); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[0](0), y: G.tr[0] }, to: { x: G.X[0](4), y: G.tr[0] }, text: 'Arrastra el precio', ty: G.tr[0] - 26 }),
    peek: G => ({ tr: G.tr }),
  });
  game.move = (G, x) => { const k = RK.pick(x, 30, G.W - 30, G.r.max / G.r.step) + 1, j = G.grab; if (k !== G.s.v[j] || !G.touched[G.cur]) { G.s.v[j] = k; G.touch(); } };
  return Object.assign(game, { answer });
})();
