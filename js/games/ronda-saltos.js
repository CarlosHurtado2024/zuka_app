// La ronda que cuenta (Preuniversitario, pu-or-2; spec 2026-11-18-preuda-razonamiento-completo): n personas en círculo; se
// cuenta desde la persona 1 en el sentido del reloj y cada k-ésima sale de la ronda, y se sigue contando desde la siguiente.
// ¿Quién queda de último? Se arrastra la corona hasta la persona que crees que se queda; el juego muestra, en el orden en que
// salen, quiénes van saliendo hasta donde va tu corona, para que puedas seguir la cuenta tú mismo.
// params = { rounds: [{ n, k }] }   state = { rounds: [{ pick }] }   (pick: número de la persona, de 1 a n)
GAMES['ronda-saltos'] = (() => {
  const order = r => { const ring = Array.from({ length: r.n }, (_, i) => i + 1), out = []; let i = 0; while (ring.length > 1) { i = (i + r.k - 1) % ring.length; out.push(ring.splice(i, 1)[0]); } return { out, last: ring[0] }; };
  const ok = (s, r) => s.pick === order(r).last;
  const game = roundsGame({
    aspect: 1.4,
    init: () => ({ pick: null }),
    ok,
    answered: s => s.pick != null,
    solution: r => `queda la persona ${order(r).last}`,
    prompt: r => `${r.n} personas en ronda; sale cada ${r.k}.ª al contar. ¿Quién queda?`,
    foot: () => 'Arrastra la corona hasta la persona que se queda',
    layout(G) { G.c = { x: G.W / 2, y: 196 }; G.R = Math.min(G.W / 2 - 40, 92); G.crown = { x: G.W / 2 - 30, y: G.c.y + G.R + 30, w: 60, h: 30 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { pick: order(r).last } : G.s, o = order(r);
      for (let i = 0; i < r.n; i++) {
        const a = -Math.PI / 2 + i * 2 * Math.PI / r.n, x = G.c.x + G.R * Math.cos(a), y = G.c.y + G.R * Math.sin(a), me = s.pick === i + 1;
        p.stroke(C.ink); p.strokeWeight(1.4); p.fill(me ? (G.locked ? (ok(s, r) ? C.ok : C.bad) : C.sun) : C.card); p.circle(x, y, 30);
        TK.label(p, C, String(i + 1), x, y, inkOn(me ? C.sun : C.card), 12, 26);
        if (me) { p.noStroke(); p.fill(C.brand); p.triangle(x - 10, y - 18, x + 10, y - 18, x, y - 30); p.triangle(x - 10, y - 18, x - 4, y - 18, x - 10, y - 28); p.triangle(x + 10, y - 18, x + 4, y - 18, x + 10, y - 28); }
      }
      TK.label(p, C, '↻ se cuenta así', G.c.x, G.c.y, C.mute, 10, 100);
      if (!G.drag && s.pick == null) RK.chip(p, C, G.crown, 'corona', { on: true, col: C.brand, size: 11 });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 30, y: G.drag.y - 15, w: 60, h: 30 }, 'corona', { on: true, col: C.brand, size: 11 });
      RK.strip(p, C, G.fb, G.locked ? `$\\text{salen: ${o.out.join(', ')}}$` : `$\\text{cuenta de ${r.k} en ${r.k}}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 14 });
    },
    press(G, x, y) {
      if (G.s.pick == null && hitBox(G.crown, x, y)) { G.drag = { x, y }; return true; }
      if (G.s.pick != null) { const i = G.s.pick - 1, a = -Math.PI / 2 + i * 2 * Math.PI / G.r.n; if (Math.hypot(x - (G.c.x + G.R * Math.cos(a)), y - (G.c.y + G.R * Math.sin(a))) < 24) { G.drag = { x, y }; G.s.pick = null; return true; } }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      for (let i = 0; i < G.r.n; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / G.r.n; if (Math.hypot(x - (G.c.x + G.R * Math.cos(a)), y - (G.c.y + G.R * Math.sin(a))) < 26) { G.s.pick = i + 1; break; } }
      G.touch();
    },
    demo: G => ({ from: { x: G.crown.x + 30, y: G.crown.y + 15 }, to: { x: G.c.x, y: G.c.y - G.R }, text: 'Arrastra la corona', ty: G.crown.y - 14 }),
    peek: G => ({ c: G.c, R: G.R, crown: G.crown }),
  });
  return Object.assign(game, { answer: r => ({ pick: order(r).last }), order });
})();
