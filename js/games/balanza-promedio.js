// La balanza del promedio (Preuniversitario, pu-gr-2; spec 2026-11-18-preuda-razonamiento-completo): cada grupo es una pila de
// bloques (uno por persona) puesta sobre su promedio en una regla. Se arrastra el apoyo por debajo de la regla: la regla se
// inclina hacia el lado que pesa más. Queda quieta justo en el promedio de todos, que se acerca al grupo más grande y no es el
// promedio de los promedios.
// params = { rounds: [{ groups: [{ lab, n, mean }], lo, hi }] }   state = { rounds: [{ f }] }   (apoyo, de medio en medio)
GAMES['balanza-promedio'] = (() => {
  const total = r => r.groups.reduce((a, g) => a + g.n, 0);
  const need = r => r.groups.reduce((a, g) => a + g.n * g.mean, 0) / total(r);
  const ok = (s, r) => s.f === need(r);
  const game = roundsGame({
    aspect: 1.15,
    init: r => ({ f: r.lo === need(r) ? r.lo + 0.5 : r.lo }),
    ok,
    solution: r => `(${r.groups.map(g => `${g.n} · ${g.mean}`).join(' + ')}) ÷ ${total(r)} = ${need(r)}`,
    prompt: () => '¿Cuál es el promedio de todos juntos?',
    foot: () => 'Arrastra el apoyo hasta que la regla quede quieta',
    layout(G) { G.ax = { x0: 34, x1: G.W - 34, y: 220 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { f: need(r) } : G.s, good = ok(s, r), ax = G.ax, X = v => ax.x0 + (v - r.lo) / (r.hi - r.lo) * (ax.x1 - ax.x0);
      const torque = r.groups.reduce((a, g) => a + g.n * (g.mean - s.f), 0), ang = Math.max(-0.2, Math.min(0.2, torque / total(r) / (r.hi - r.lo) * 1.5));
      const fx = X(s.f), cols = [C.sky, C.coral, C.mint];
      p.push(); p.translate(fx, ax.y); p.rotate(ang);
      p.stroke(C.ink); p.strokeWeight(3); p.line(X(r.lo) - fx, 0, X(r.hi) - fx, 0);
      for (let v = r.lo; v <= r.hi; v++) { p.strokeWeight(1); p.line(X(v) - fx, -3, X(v) - fx, 3); TK.label(p, C, String(v), X(v) - fx, 12, C.mute, 8, 20); }
      r.groups.forEach((g, i) => {
        const x = X(g.mean) - fx, sz = 12, per = 3;
        for (let k = 0; k < g.n; k++) { p.noStroke(); p.fill(cols[i % 3]); p.rect(x - per * sz / 2 + (k % per) * sz, -4 - sz - Math.floor(k / per) * sz, sz - 1, sz - 1, 2); }
        TK.label(p, C, `${g.lab}: ${g.n} · prom. ${g.mean}`, x, -18 - Math.ceil(g.n / per) * sz - (i % 2) * 14, C.ink, 9, 120);
      });
      p.pop();
      p.noStroke(); p.fill(good ? C.ok : C.brand); p.triangle(fx, ax.y + 3, fx - 14, ax.y + 30, fx + 14, ax.y + 30);
      TK.label(p, C, String(s.f), fx, ax.y + 44, C.brand, 12, 50);
      RK.strip(p, C, G.fb, good ? `$\\text{promedio de todos} = ${need(r)}$` : `$\\text{apoyo en}\\ ${s.f}$`, { kicker: good ? 'la regla queda quieta' : torque > 0 ? 'se inclina a la derecha' : 'se inclina a la izquierda', col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (y < G.ax.y - 10 || y > G.ax.y + 60) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => { const r = G.r, ax = G.ax, x = ax.x0 + (G.s.f - r.lo) / (r.hi - r.lo) * (ax.x1 - ax.x0); return { from: { x, y: ax.y + 20 }, to: { x: x + 70, y: ax.y + 20 }, text: 'Arrastra el apoyo', ty: ax.y + 70 }; },
    peek: G => ({ ax: G.ax }),
  });
  game.move = (G, x) => { const r = G.r, ax = G.ax, v = Math.max(r.lo, Math.min(r.hi, Math.round((r.lo + (x - ax.x0) / (ax.x1 - ax.x0) * (r.hi - r.lo)) * 2) / 2)); if (v !== G.s.f || !G.touched[G.cur]) { G.s.f = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ f: need(r) }) });
})();
