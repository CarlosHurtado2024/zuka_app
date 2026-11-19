// Los círculos del silogismo (Preuniversitario, pu-lo-4; spec 2026-11-18-preuda-razonamiento-completo): cada premisa se dibuja
// con círculos: «todos los A son B» pone A dentro de B, «ningún A es B» los separa y «algunos A son B» los cruza sin que uno
// quede dentro del otro. Se arrastran los círculos hasta cumplir todas las premisas; cada una se marca al cumplirse. Lo que
// queda dibujado muestra qué conclusión sale.
// params = { rounds: [{ sets: [{ k, name, r }], rels: [[k1, k2, 'sub' | 'disj' | 'cross']], sol: { k: [x, y] } }] }   (unidades: lienzo de 10 × 6)
// state = { rounds: [{ pos: { k: [x, y] } }] }
GAMES['arma-silogismo'] = (() => {
  const rel = (s, r, [a, b, t]) => {
    const A = r.sets.find(z => z.k === a), B = r.sets.find(z => z.k === b), [xa, ya] = s.pos[a], [xb, yb] = s.pos[b], d = Math.hypot(xa - xb, ya - yb);
    if (t === 'sub') return d + A.r <= B.r + 1e-9;
    if (t === 'disj') return d >= A.r + B.r - 1e-9;
    return d < A.r + B.r && d + Math.min(A.r, B.r) > Math.max(A.r, B.r);
  };
  const ok = (s, r) => r.rels.every(x => rel(s, r, x));
  const SAY = { sub: (a, b) => `todos los ${a} son ${b}`, disj: (a, b) => `ningún ${a} es ${b}`, cross: (a, b) => `algunos ${a} son ${b}` };
  const start = r => { const pos = {}; r.sets.forEach((z, i) => { pos[z.k] = [1.6 + i * 3.4, 3]; }); return pos; };
  const game = roundsGame({
    aspect: 1.3,
    init: r => ({ pos: start(r) }),
    answered: (s, r) => JSON.stringify(s.pos) !== JSON.stringify(start(r)),
    ok,
    solution: r => r.rels.map(([a, b, t]) => SAY[t](r.sets.find(z => z.k === a).name, r.sets.find(z => z.k === b).name)).join('; '),
    prompt: () => 'Dibuja las premisas con los círculos',
    foot: () => 'Arrastra los círculos',
    layout(G) { G.u = (G.W - 20) / 10; G.o = { x: 10, y: 150 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { pos: r.sol } : G.s, good = ok(s, r), u = G.u, o = G.o, cols = [C.sky, C.coral, C.mint];
      r.rels.forEach((x, i) => { const hit = rel(s, r, x); TK.label(p, C, `${hit ? '✓' : '·'} ${SAY[x[2]](r.sets.find(z => z.k === x[0]).name, r.sets.find(z => z.k === x[1]).name)}`, G.W / 2, 96 + i * 18, hit ? C.ok : C.ink, 11, G.W - 24); });
      p.stroke(C.line); p.strokeWeight(1); p.noFill(); p.rect(o.x, o.y, 10 * u, 6 * u, 10);
      r.sets.forEach((z, i) => {
        const [x, y] = s.pos[z.k], cx = o.x + x * u, cy = o.y + y * u;
        p.stroke(cols[i % 3]); p.strokeWeight(2); p.fill(RK.al(p, cols[i % 3], 40)); p.circle(cx, cy, 2 * z.r * u);
        TK.label(p, C, z.name, cx, cy - z.r * u + 12, C.ink, 10, z.r * u * 1.6);
      });
      RK.strip(p, C, G.fb, good ? '$\\text{todas las premisas dibujadas}$' : `$\\text{${r.rels.filter(x => rel(s, r, x)).length} de ${r.rels.length} premisas}$`, { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) {
      const u = G.u, o = G.o, list = G.r.sets.slice().sort((a, b) => a.r - b.r);
      const z = list.find(z => { const [px, py] = G.s.pos[z.k]; return Math.hypot(x - (o.x + px * u), y - (o.y + py * u)) < z.r * u; });
      if (!z) return false; const [px, py] = G.s.pos[z.k]; G.grab = { k: z.k, dx: (x - o.x) / u - px, dy: (y - o.y) / u - py }; return true;
    },
    drag(G, x, y) {
      if (!G.grab) return false;
      const u = G.u, o = G.o, z = G.r.sets.find(q => q.k === G.grab.k), nx = Math.max(z.r * 0.5, Math.min(10 - z.r * 0.5, Math.round(((x - o.x) / u - G.grab.dx) * 4) / 4)), ny = Math.max(z.r * 0.5, Math.min(6 - z.r * 0.5, Math.round(((y - o.y) / u - G.grab.dy) * 4) / 4));
      const c = G.s.pos[z.k]; if (c[0] !== nx || c[1] !== ny) { G.s.pos[z.k] = [nx, ny]; G.touch(); }
      return true;
    },
    release(G) { G.grab = null; },
    demo: G => { const z = G.r.sets[0], [x, y] = G.s.pos[z.k]; const a = { x: G.o.x + x * G.u, y: G.o.y + y * G.u }; return { from: a, to: { x: a.x + 2.5 * G.u, y: a.y }, text: 'Arrastra un círculo', ty: G.o.y + 6 * G.u + 16 }; },
    peek: G => ({ u: G.u, o: G.o }),
  });
  return Object.assign(game, { answer: r => ({ pos: r.sol }) });
})();
