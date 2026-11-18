// La receta (Álgebra, alg-12; spec 2026-11-18-algebra-revision): al cambiar las porciones, cada ingrediente cambia en la
// misma razón. Una receta para `base` porciones con sus barras de ingredientes; se arrastra la manija de las porciones y
// todas las barras crecen o se encogen juntas. Hay que llegar a las porciones donde el ingrediente marcado da la meta.
// params = { rounds: [{ base, items: [[nombre, cantidad, unidad]], goal: [índice, cantidad] }] }   state = { rounds: [{ n }] }
GAMES['receta-escala'] = (() => {
  const need = r => (r.goal[1] * r.base) / r.items[r.goal[0]][1];
  const ok = (s, r) => s.n === need(r);
  const MAX = 12;
  const game = roundsGame({
    aspect: 1.05,
    init: r => ({ n: r.base }),
    ok,
    solution: r => `${need(r)} porciones`,
    prompt: r => { const [name, , u] = r.items[r.goal[0]]; return `¿Para cuántas porciones se usan ${r.goal[1]} ${u} de ${name}?`; },
    foot: r => `La receta es para ${r.base} porciones`,
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, n = G.locked && !ok(G.s, r) ? need(r) : G.s.n, k = n / r.base;
      r.items.forEach(([name, q, u], i) => {
        const y = 108 + i * 46, max = q * MAX / r.base, w = (G.W - 130) * (q * k) / max, mark = i === r.goal[0];
        TK.label(p, C, name, 44, y + 12, C.ink, 12, 76);
        p.noStroke(); p.fill(mark ? C.coral : C.sky); p.rect(86, y, Math.max(2, w), 24, 5);
        TK.label(p, C, `${+(q * k).toFixed(1)} ${u}`, Math.min(G.W - 34, 86 + w + 30), y + 12, mark ? C.coral : C.mute, 11, 56);
        if (mark) { const gx = 86 + (G.W - 130) * r.goal[1] / max; p.stroke(C.ok); p.strokeWeight(2); p.line(gx, y - 6, gx, y + 30); }
      });
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, MAX, n - 1, i => ((i + 1) % 2 === 0 || i === 0 ? String(i + 1) : null));
      TK.label(p, C, `${n} porciones`, G.W / 2, G.tY - 22, C.ink, 13, 120);
      RK.strip(p, C, G.fb, `$\\times\\,\\tfrac{${n}}{${r.base}}$ en cada ingrediente`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.n - 1), y: G.tY }, to: { x: G.X(G.s.n + 2), y: G.tY }, text: 'Arrastra las porciones', ty: G.tY - 46 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = RK.pick(x, 30, G.W - 30, MAX) + 1; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { need });
})();
