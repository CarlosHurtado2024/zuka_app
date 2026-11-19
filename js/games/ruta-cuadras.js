// El camino más corto por cuadras (Preuniversitario, pu-es-1; spec 2026-11-18-preuda-razonamiento-completo): en una ciudad
// sin diagonales, el camino más corto mide lo horizontal más lo vertical, por cualquier ruta que no se devuelva; un
// obstáculo obliga a rodearlo. Se arrastra el dedo por las esquinas de la rejilla, de A hacia B; cada cuadra se cuenta.
// Hay que llegar a B con el menor número de cuadras posible.
// params = { rounds: [{ w, h, A: [x, y], B: [x, y], walls: [[x, y]] }] }   (walls: manzanas que no se pueden cruzar)
// state = { rounds: [{ path: [[x, y], …] }] }
GAMES['ruta-cuadras'] = (() => {
  const key = p => p.join(',');
  // Distancia más corta con BFS sobre las esquinas. El parque ocupa varias manzanas: una calle queda cerrada si pasa por
  // dentro de él, es decir, si las dos manzanas que separa son del parque.
  const isWall = (r, x, y) => (r.walls || []).some(w => w[0] === x && w[1] === y);
  const blocked = (r, a, b) => { if (a[0] === b[0]) { const y = Math.min(a[1], b[1]), x = a[0]; return isWall(r, x - 1, y) && isWall(r, x, y); } const x = Math.min(a[0], b[0]), y = a[1]; return isWall(r, x, y - 1) && isWall(r, x, y); };
  const nbrs = (r, p) => [[1, 0], [-1, 0], [0, 1], [0, -1]].map(d => [p[0] + d[0], p[1] + d[1]]).filter(q => q[0] >= 0 && q[1] >= 0 && q[0] <= r.w && q[1] <= r.h && !blocked(r, p, q));
  const shortest = r => { const seen = { [key(r.A)]: 0 }, Q = [r.A]; while (Q.length) { const p = Q.shift(); for (const q of nbrs(r, p)) if (seen[key(q)] == null) { seen[key(q)] = seen[key(p)] + 1; Q.push(q); } } return seen[key(r.B)]; };
  const ok = (s, r) => s.path.length > 0 && key(s.path[s.path.length - 1]) === key(r.B) && s.path.length - 1 === shortest(r);
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ path: [r.A] }),
    ok,
    answered: s => s.path.length > 1,
    solution: r => `${shortest(r)} cuadras`,
    prompt: r => `Ve de A a B por el camino más corto${(r.walls || []).length ? ' (rodea el parque)' : ''}`,
    foot: () => 'Arrastra el dedo por las calles; vuelve atrás para borrar',
    layout(G) { const r = G.r; G.u = Math.min((G.W - 40) / r.w, (G.H - 220) / r.h); G.o = { x: (G.W - r.w * G.u) / 2, y: 104 + r.h * G.u }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; game.lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { path: [r.A] } : G.s, u = G.u, o = G.o, X = x => o.x + x * u, Y = y => o.y - y * u, good = ok(s, r);
      for (let i = 0; i < r.w; i++) for (let j = 0; j < r.h; j++) { const wall = (r.walls || []).some(w => w[0] === i && w[1] === j); p.noStroke(); p.fill(wall ? RK.al(p, C.mint, 160) : RK.al(p, C.card, 170)); p.rect(X(i) + 3, Y(j + 1) + 3, u - 6, u - 6, 3); }
      p.noFill(); p.stroke(good ? C.ok : C.brand); p.strokeWeight(3.5); p.beginShape(); s.path.forEach(q => p.vertex(X(q[0]), Y(q[1]))); p.endShape();
      [[r.A, 'A', C.sky], [r.B, 'B', C.coral]].forEach(([q, t, col]) => { p.noStroke(); p.fill(col); p.circle(X(q[0]), Y(q[1]), 22); TK.label(p, C, t, X(q[0]), Y(q[1]), inkOn(col), 11, 20); });
      const last = s.path[s.path.length - 1]; RK.knob(p, C, X(last[0]), Y(last[1]), C.brand);
      RK.strip(p, C, G.fb, `$\\text{${s.path.length - 1} cuadras}$`, { kicker: key(last) === key(r.B) ? (good ? 'Es el más corto' : 'Llegaste, pero hay un camino más corto') : 'Sigue hasta B', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const last = G.s.path[G.s.path.length - 1]; if (Math.hypot(x - (G.o.x + last[0] * G.u), y - (G.o.y - last[1] * G.u)) > 36) return false; G.grab = true; return true; },
    drag(G, x, y) {
      if (!G.grab) return false; const r = G.r, P = G.s.path, q = [Math.round((x - G.o.x) / G.u), Math.round((G.o.y - y) / G.u)], last = P[P.length - 1];
      if (P.length > 1 && key(q) === key(P[P.length - 2])) { P.pop(); G.touch(); return true; }
      if (nbrs(r, last).some(n => key(n) === key(q)) && !P.some(p => key(p) === key(q))) { P.push(q); G.touch(); }
      return true;
    },
    release(G) { G.grab = false; },
    demo: G => { const A = G.r.A, X = x => G.o.x + x * G.u, Y = y => G.o.y - y * G.u; return { from: { x: X(A[0]), y: Y(A[1]) }, to: { x: X(A[0] + 1), y: Y(A[1]) }, text: 'Arrastra por las calles', ty: G.o.y + 18 }; },
    peek: G => ({ o: G.o, u: G.u }),
  });
  game.lay = G => { const r = G.r; G.u = Math.min((G.W - 40) / r.w, (G.H - 220) / r.h); G.o = { x: (G.W - r.w * G.u) / 2, y: 104 + r.h * G.u }; };
  return Object.assign(game, { shortest });
})();
