// El volumen de un prisma o un cilindro (Preuniversitario, pu-ge-6; spec 2026-11-18-preuda-razonamiento-completo): V = área de
// la base × altura: el sólido es una pila de capas iguales a la base. Se ve la base con su área; se arrastra la altura y las
// capas se apilan. Hay que llegar al volumen pedido.
// params = { rounds: [{ base: 'rect' | 'circ' | 'tri', dims: [..], target }] }   (circ: target en múltiplos de π)   state = { rounds: [{ h }] }   (de 1 a 10)
GAMES['prisma-capas'] = (() => {
  const A = r => (r.base === 'rect' ? r.dims[0] * r.dims[1] : r.base === 'tri' ? r.dims[0] * r.dims[1] / 2 : r.dims[0] ** 2);
  const ok = (s, r) => A(r) * s.h === r.target;
  const answer = r => ({ h: r.target / A(r) });
  const pi = r => (r.base === 'circ' ? '\\pi' : '');
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ h: 1 }),
    ok,
    solution: r => `altura ${r.target / A(r)}`,
    prompt: r => `${r.base === 'rect' ? `Base de ${r.dims[0]} × ${r.dims[1]}` : r.base === 'tri' ? `Base triangular de base ${r.dims[0]} y altura ${r.dims[1]}` : `Cilindro de radio ${r.dims[0]}`}: ¿qué altura da volumen $${r.target}${pi(r)}$?`,
    foot: () => 'Arrastra la altura: cada capa es una copia de la base',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r), cx = G.W / 2, w = Math.min(150, G.W * 0.45), lh = Math.min(14, (G.tY - 190) / 10), yb = G.tY - 60;
      for (let i = 0; i < s.h; i++) {
        const y = yb - i * lh; p.stroke(C.bg); p.strokeWeight(1);
        p.fill(RK.al(p, good ? C.ok : i % 2 ? C.sky : C.mint, 220));
        if (r.base === 'circ') p.ellipse(cx, y, w, w * 0.32); else if (r.base === 'tri') p.triangle(cx - w / 2, y + 8, cx + w / 2, y + 8, cx + w * 0.1, y - 10); else p.quad(cx - w / 2, y + 8, cx + w / 2 - 20, y + 8, cx + w / 2, y - 8, cx - w / 2 + 20, y - 8);
      }
      TK.label(p, C, `base: $${A(r)}${pi(r)}$`, cx, yb + 28, C.mute, 11, 140);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 10, s.h - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, `$${A(r)}${pi(r)} \\cdot ${s.h} = ${A(r) * s.h}${pi(r)}$`, { kicker: `${s.h} capa${s.h > 1 ? 's' : ''}`, col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X([2, 3, 5].find(i => i + 1 !== answer(G.r).h)), y: G.tY }, text: 'Arrastra la altura', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 10) + 1; if (v !== G.s.h || !G.touched[G.cur]) { G.s.h = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
