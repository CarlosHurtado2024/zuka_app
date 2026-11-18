// El árbol de opciones (Preuniversitario, pu-co-1; spec 2026-11-18-preuda-razonamiento-completo): si cada decisión se toma
// después de la anterior, el árbol se abre en cada nivel y las hojas son el producto de las opciones. Se conocen el total y
// casi todos los niveles; se arrastran las ramas del nivel que falta y el árbol cuenta sus hojas.
// params = { rounds: [{ levels: [{ name, n }], miss, total }] }   (miss: nivel que falta)   state = { rounds: [{ k }] }   (de 1 a 8)
GAMES['arbol-opciones'] = (() => {
  const prod = (r, k) => r.levels.reduce((a, l, i) => a * (i === r.miss ? k : l.n), 1);
  const ok = (s, r) => prod(r, s.k) === r.total;
  const answer = r => ({ k: r.levels[r.miss].n });
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ k: r.levels[r.miss].n === 1 ? 2 : 1 }),
    ok,
    solution: r => `${r.levels[r.miss].n} ${r.levels[r.miss].name}`,
    prompt: r => `${r.total} combinaciones en total. ¿Cuántas opciones de ${r.levels[r.miss].name}?`,
    foot: () => 'Arrastra cuántas ramas tiene el nivel que falta',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, ns = r.levels.map((l, i) => (i === r.miss ? s.k : l.n)), L = ns.length, top = 104, H = G.tY - 150, good = ok(s, r);
      let nodes = [{ x: G.W / 2, y: top }];
      ns.forEach((n, lv) => {
        const y = top + (lv + 1) * H / L, total = nodes.length * n, w = (G.W - 40) / total, next = [];
        nodes.forEach((nd, j) => { for (let b = 0; b < n; b++) { const x = 20 + (j * n + b + 0.5) * w; p.stroke(lv === r.miss ? (good ? C.ok : C.coral) : C.line); p.strokeWeight(total > 40 ? 0.6 : 1.2); p.line(nd.x, nd.y, x, y); next.push({ x, y }); } });
        TK.label(p, C, `${r.levels[lv].name}: ${n}`, 54, y - H / L / 2, lv === r.miss ? C.coral : C.mute, 9, 100);
        nodes = next;
      });
      if (nodes.length <= 60) nodes.forEach(nd => drawDot(p, C, nd.x, nd.y, 4, good ? C.ok : C.sky));
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 8, s.k - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, `$${ns.join(' \\cdot ')} = ${prod(r, s.k)}\\ \\text{hojas}$`, { col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.k - 1), y: G.tY }, to: { x: G.X([5, 6, 7].find(i => i + 1 !== answer(G.r).k)), y: G.tY }, text: 'Arrastra las ramas', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 8) + 1; if (v !== G.s.k || !G.touched[G.cur]) { G.s.k = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
