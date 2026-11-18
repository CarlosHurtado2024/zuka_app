// Pinta la razón (Álgebra, alg-12; spec 2026-11-18-algebra-revision): razones equivalentes. Una rejilla de baldosas; se
// pinta pasando el dedo (si se empieza sobre una pintada, se despinta). Abajo se escribe pintadas : blancas y su forma
// simple. Hay que pintar en la razón pedida, y en una rejilla de 15 la razón 2 : 3 obliga a pintar 6, no 2.
// params = { rounds: [{ rows, cols, p, q }] }   state = { rounds: [{ on: [índices] }] }
GAMES['rejilla-razon'] = (() => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const ok = (s, r) => { const x = s.on.length, y = r.rows * r.cols - x; return x > 0 && x * r.q === y * r.p; };
  const need = r => (r.rows * r.cols * r.p) / (r.p + r.q);
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ on: [] }),
    ok,
    answered: s => s.on.length > 0,
    solution: r => `${need(r)} pintadas y ${r.rows * r.cols - need(r)} blancas`,
    prompt: r => `Pinta: pintadas a blancas como ${r.p} : ${r.q}`,
    foot: () => 'Pasa el dedo por las baldosas para pintarlas',
    layout(G) { const r = G.r; G.cs = Math.min((G.W - 40) / r.cols, (G.H * 0.5) / r.rows); G.gx = (G.W - G.cs * r.cols) / 2; G.gy = 100; G.fb = { x: 12, y: G.H - 84, w: G.W - 24, h: 52 }; },
    enter(G) { G.mode = null; G.lay(G); },
    draw(G) {
      game.lay(G);
      const { p, C, r } = G, n = r.rows * r.cols, s = G.locked && !ok(G.s, r) ? { on: [...Array(need(r)).keys()] } : G.s;
      for (let i = 0; i < n; i++) { const x = G.gx + (i % r.cols) * G.cs, y = G.gy + Math.floor(i / r.cols) * G.cs; p.stroke(C.line); p.strokeWeight(1); p.fill(s.on.includes(i) ? C.mint : C.card); p.rect(x + 2, y + 2, G.cs - 4, G.cs - 4, 5); }
      const x = s.on.length, y = n - x, g = gcd(x, y) || 1;
      RK.strip(p, C, G.fb, `$${x} : ${y}${x && y ? ` = ${x / g} : ${y / g}` : ''}$`, { kicker: `Pintadas : blancas · meta ${r.p} : ${r.q}`, col: G.locked || ok(G.s, r) ? C.ok : C.mint, size: 20 });
    },
    press(G, x, y) { const i = game.cell(G, x, y); if (i < 0) return false; G.mode = !G.s.on.includes(i); game.set(G, i); return true; },
    drag(G, x, y) { if (G.mode == null) return false; const i = game.cell(G, x, y); if (i >= 0) game.set(G, i); return true; },
    release(G) { G.mode = null; },
    demo: G => ({ from: { x: G.gx + G.cs / 2, y: G.gy + G.cs / 2 }, to: { x: G.gx + G.cs * 2.5, y: G.gy + G.cs / 2 }, text: 'Pasa el dedo para pintar', ty: G.gy + G.cs * G.r.rows + 20 }),
    peek: G => ({ gx: G.gx, gy: G.gy, cs: G.cs, need: need(G.r) }),
  });
  game.lay = G => { const r = G.r; G.cs = Math.min((G.W - 40) / r.cols, (G.H * 0.5) / r.rows); G.gx = (G.W - G.cs * r.cols) / 2; G.gy = 100; };
  game.cell = (G, x, y) => { const c = Math.floor((x - G.gx) / G.cs), w = Math.floor((y - G.gy) / G.cs); return c >= 0 && c < G.r.cols && w >= 0 && w < G.r.rows ? w * G.r.cols + c : -1; };
  game.set = (G, i) => { const on = G.s.on, k = on.indexOf(i); if (G.mode && k < 0) { on.push(i); G.touch(); } else if (!G.mode && k >= 0) { on.splice(k, 1); G.touch(); } };
  return Object.assign(game, { need });
})();
