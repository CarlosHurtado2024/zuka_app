// Restar polinomios (Álgebra, alg-23a; spec 2026-11-18-algebra-revision): restar Q es sumar su opuesto, que es Q con
// todos los bloques volteados. En la mesa está P; abajo están los bloques de Q. Cada bloque se arrastra primero al
// volteador (cambia de color: de positivo a negativo o al revés) y luego a la mesa. Si se suma sin voltear, la cuenta da
// P + Q. Hay que dejar en la mesa P − Q.
// params = { rounds: [{ P, Q }] }   (coeficientes [x², x, 1])   state = { rounds: [{ c: [..], used: [índices], flip: [índices] }] }
GAMES['resta-voltea'] = (() => {
  const pieces = r => { const o = []; r.Q.forEach((v, i) => { for (let j = 0; j < Math.abs(v); j++) o.push({ k: 2 - i, neg: v < 0 }); }); return o; };
  const goal = r => r.P.map((v, i) => v - r.Q[i]);
  const ok = (s, r) => s.used.length === pieces(r).length && s.c.join() === goal(r).join();
  const poly = c => GAMES['bloques-polinomio'].poly(c);
  const game = roundsGame({
    aspect: 1.3,
    init: r => ({ c: [...r.P], used: [], flip: [] }),
    ok,
    answered: s => s.used.length > 0,
    solution: r => poly(goal(r)),
    prompt: r => `Resta: $(${poly(r.P)}) - (${poly(r.Q)})$`,
    foot: () => 'Pasa cada bloque de Q por el volteador antes de llevarlo a la mesa',
    layout(G) { G.mat = { x: 12, y: 96, w: G.W - 24, h: G.H * 0.34 }; G.qY = G.mat.y + G.mat.h + 20; G.flipB = { x: G.W - 92, y: G.qY + 56, w: 80, h: 44 }; G.u = 36; G.s = 13; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r, mat, u, s } = G, done = G.locked && !ok(G.s, r), c = done ? goal(r) : G.s.c, Q = pieces(r);
      p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.card, 200)); p.rect(mat.x, mat.y, mat.w, mat.h, 14);
      let x = mat.x + 10, y = mat.y + 10, rowH = 0;
      [2, 1, 0].forEach(k => { const n = Math.abs(c[2 - k]); for (let i = 0; i < n; i++) { const [w, h] = RK.tileSize(k, u, s); if (x + w > mat.x + mat.w - 8) { x = mat.x + 10; y += rowH + 6; rowH = 0; } RK.tile(p, C, k, x, y, u, s, c[2 - k] < 0); x += w + 5; rowH = Math.max(rowH, h); } });
      p.stroke(C.brand); p.strokeWeight(1.5); p.fill(RK.al(p, C.brand, 30)); p.rect(G.flipB.x, G.flipB.y, G.flipB.w, G.flipB.h, 10); TK.label(p, C, 'volteador', G.flipB.x + G.flipB.w / 2, G.flipB.y + G.flipB.h / 2, C.ink, 11, 76);
      TK.label(p, C, 'Q', 22, G.qY - 6, C.mute, 11, 20);
      G.qs = []; let qx = 34;
      Q.forEach((q, i) => { if (G.s.used.includes(i) || done) return; const [w, h] = RK.tileSize(q.k, u, s), neg = q.neg !== G.s.flip.includes(i); const b = { i, k: q.k, neg, x: qx, y: G.qY, w, h }; G.qs.push(b); if (G.drag?.i !== i) RK.tile(p, C, q.k, qx, G.qY, u, s, neg); qx += w + 5; });
      if (G.drag) RK.tile(p, C, G.drag.k, G.drag.x - 10, G.drag.y - 10, u, s, G.drag.neg, { lift: true });
      RK.strip(p, C, G.fb, `$${poly(c)}$`, { kicker: 'En la mesa', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 19 });
    },
    press(G, x, y) { const q = (G.qs || []).find(q => hitBox({ x: q.x - 3, y: q.y - 3, w: q.w + 6, h: q.h + 6 }, x, y)); if (!q) return false; G.drag = { ...q, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const s = G.s;
      if (hitBox(G.flipB, x, y)) { const k = s.flip.indexOf(d.i); if (k >= 0) s.flip.splice(k, 1); else s.flip.push(d.i); G.touch(); return; }
      if (hitBox(G.mat, x, y)) { s.c[2 - d.k] += d.neg ? -1 : 1; s.used.push(d.i); G.touch(); }
    },
    demo(G) { const q = G.qs?.[0]; return q ? { from: { x: q.x + 8, y: q.y + 12 }, to: { x: G.flipB.x + 40, y: G.flipB.y + 22 }, text: 'Primero al volteador', ty: G.flipB.y + 64 } : null; },
    peek: G => ({ qs: G.qs, mat: G.mat, flipB: G.flipB }),
  });
  return Object.assign(game, { goal, pieces });
})();
