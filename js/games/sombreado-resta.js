// El área sombreada es una resta (Preuniversitario, pu-ge-5; spec 2026-11-18-preuda-razonamiento-completo): la zona
// sombreada es la figura grande menos lo que se le quita. Un cuadrado con un círculo (o un cuadrado) adentro; se arrastra
// el tamaño de la figura de adentro y la cuenta «grande − chica» se ve en vivo, hasta que lo sombreado mida lo pedido.
// params = { rounds: [{ s, kind: 'circ' | 'sq', target }] }   (target: número o [a, b] = a − bπ)   state = { rounds: [{ t }] }   (radio o lado, de 1 a s)
GAMES['sombreado-resta'] = (() => {
  const shaded = (r, t) => (r.kind === 'circ' ? [r.s * r.s, t * t] : [r.s * r.s - t * t, 0]);
  const ok = (s, r) => { const [a, b] = shaded(r, s.t); return Array.isArray(r.target) ? a === r.target[0] && b === r.target[1] : a === r.target && b === 0; };
  const answer = r => { for (let t = 1; t <= r.s; t++) if (ok({ t }, r)) return { t }; return null; };
  const tt = (r, t) => { const [a, b] = shaded(r, t); return b ? `${a} - ${b}\\pi` : `${a}`; };
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ t: 1 }),
    ok,
    solution: r => `${r.kind === 'circ' ? 'radio' : 'lado'} ${answer(r).t}`,
    prompt: r => `Cuadrado de lado ${r.s}. Ajusta ${r.kind === 'circ' ? 'el círculo' : 'el cuadrado'} de adentro para que lo sombreado mida $${Array.isArray(r.target) ? `${r.target[0]} - ${r.target[1]}\\pi` : r.target}$`,
    foot: () => 'Arrastra el borde de la figura de adentro',
    layout(G) { const s = Math.min(G.W - 60, G.H - 210); G.box = { x: (G.W - s) / 2, y: 100, w: s }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, b = G.box, u = b.w / r.s, cx = b.x + b.w / 2, cy = b.y + b.w / 2, good = ok(s, r);
      p.stroke(C.ink); p.strokeWeight(1.6); p.fill(good ? C.ok : C.sky); p.rect(b.x, b.y, b.w, b.w);
      p.fill(C.bg); p.stroke(C.ink); if (r.kind === 'circ') p.circle(cx, cy, 2 * s.t * u); else p.rect(cx - s.t * u / 2, cy - s.t * u / 2, s.t * u, s.t * u);
      const kx = r.kind === 'circ' ? cx + s.t * u : cx + s.t * u / 2; RK.knob(p, C, kx, cy, C.brand); G.kx = kx; G.cy = cy;
      TK.label(p, C, `${r.kind === 'circ' ? 'r' : 'lado'} = ${s.t}`, cx, cy + 14, C.ink, 11, 70);
      RK.strip(p, C, G.fb, `$${r.s}^2 - ${r.kind === 'circ' ? `\\pi \\cdot ${s.t}^2` : `${s.t}^2`} = ${tt(r, s.t)}$`, { kicker: 'grande − chica', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const b = G.box; if (!hitBox({ x: b.x, y: b.y, w: b.w, h: b.w }, x, y)) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.kx, y: G.cy }, to: { x: G.kx + G.box.w * 0.15, y: G.cy }, text: 'Arrastra el borde', ty: G.box.y + G.box.w + 16 }),
    peek: G => ({ box: G.box }),
  });
  game.move = (G, x) => { const r = G.r, b = G.box, u = b.w / r.s, d = Math.abs(x - (b.x + b.w / 2)) / u, t = Math.max(1, Math.min(r.kind === 'circ' ? Math.floor(r.s / 2) : r.s - 1, Math.round(r.kind === 'circ' ? d : 2 * d))); if (t !== G.s.t || !G.touched[G.cur]) { G.s.t = t; G.touch(); } };
  return Object.assign(game, { answer });
})();
