// Arma el polinomio (Álgebra, alg-23a; spec 2026-11-18-algebra-revision): un polinomio se escribe con bloques. Cuadrados
// x², barras x y cuadritos 1; los rojos son negativos. Se arrastran bloques de la bandeja a la mesa (y fuera de ella para
// quitarlos); un bloque y su opuesto se anulan. Rondas 'arma': construir el polinomio pedido; rondas 'suma': la mesa ya
// tiene P y hay que agregarle Q, y queda P + Q.
// params = { rounds: [{ mode: 'arma' | 'suma', P?, Q?, target? }] }   (coeficientes [x², x, 1])   state = { rounds: [{ c: [a, b, c] }] }
GAMES['bloques-polinomio'] = (() => {
  const goal = r => (r.mode === 'suma' ? r.P.map((v, i) => v + r.Q[i]) : r.target);
  const ok = (s, r) => s.c.join() === goal(r).join();
  const poly = c => { const t = []; [[c[0], 'x^2'], [c[1], 'x'], [c[2], '']].forEach(([v, x]) => { if (!v) return; const a = Math.abs(v), body = x ? (a === 1 ? x : a + x) : String(a); t.push((v < 0 ? '-' : t.length ? '+' : '') + body); }); return t.length ? t.join(' ') : '0'; };
  const SRC = [[2, false], [1, false], [0, false], [2, true], [1, true], [0, true]];
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ c: r.mode === 'suma' ? [...r.P] : [0, 0, 0] }),
    ok,
    answered: (s, r) => s.c.join() !== (r.mode === 'suma' ? r.P : [0, 0, 0]).join(),
    solution: r => poly(goal(r)),
    prompt: r => (r.mode === 'suma' ? `Suma $${poly(r.Q)}$ al polinomio de la mesa` : `Arma $${poly(r.target)}$ con bloques`),
    foot: () => 'Arrastra bloques a la mesa; un bloque y su opuesto se anulan',
    layout(G) { G.mat = { x: 12, y: 96, w: G.W - 24, h: G.H * 0.42 }; G.trayY = G.mat.y + G.mat.h + 14; G.u = 40; G.s = 14; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r, mat, u, s } = G, c = G.locked && !ok(G.s, r) ? goal(r) : G.s.c;
      p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.card, 200)); p.rect(mat.x, mat.y, mat.w, mat.h, 14);
      let x = mat.x + 10, y = mat.y + 10, rowH = 0; G.onMat = [];
      [2, 1, 0].forEach(k => { const n = Math.abs(c[2 - k]); for (let i = 0; i < n; i++) { const [w, h] = RK.tileSize(k, u, s); if (x + w > mat.x + mat.w - 8) { x = mat.x + 10; y += rowH + 6; rowH = 0; } G.onMat.push({ k, neg: c[2 - k] < 0, x, y, w, h }); RK.tile(p, C, k, x, y, u, s, c[2 - k] < 0); x += w + 5; rowH = Math.max(rowH, h); } });
      G.src = SRC.map(([k, neg], i) => { const [w, h] = RK.tileSize(k, u, s); const bx = 16 + (i % 3) * ((G.W - 32) / 3), by = G.trayY + Math.floor(i / 3) * 50; RK.tile(p, C, k, bx, by, u, s, neg); return { k, neg, x: bx, y: by, w, h }; });
      if (G.drag) RK.tile(p, C, G.drag.k, G.drag.x - 12, G.drag.y - 12, u, s, G.drag.neg, { lift: true });
      RK.strip(p, C, G.fb, `$${poly(c)}$`, { kicker: 'En la mesa', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 19 });
    },
    press(G, x, y) {
      const q = G.src.find(q => hitBox({ x: q.x - 4, y: q.y - 4, w: q.w + 8, h: q.h + 8 }, x, y));
      if (q) { G.drag = { k: q.k, neg: q.neg, from: 'tray', x, y }; return true; }
      const m = (G.onMat || []).find(q => hitBox(q, x, y));
      if (m) { G.drag = { k: m.k, neg: m.neg, from: 'mat', x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const inMat = hitBox(G.mat, x, y), i = 2 - d.k, v = d.neg ? -1 : 1;
      if (d.from === 'tray' && inMat) { G.s.c[i] += v; G.touch(); } else if (d.from === 'mat' && !inMat) { G.s.c[i] -= v; G.touch(); }
    },
    demo(G) { const q = G.src?.[1]; return q ? { from: { x: q.x + 6, y: q.y + 16 }, to: { x: G.mat.x + G.mat.w / 2, y: G.mat.y + G.mat.h / 2 }, text: 'Arrastra bloques a la mesa', ty: G.mat.y + 14 } : null; },
    peek: G => ({ src: G.src, mat: G.mat }),
  });
  return Object.assign(game, { goal, poly });
})();
