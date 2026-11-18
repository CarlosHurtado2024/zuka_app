// Radio, longitud y área del círculo (Preuniversitario, pu-ge-4; spec 2026-11-18-preuda-razonamiento-completo): L = 2πr y
// A = πr². Se arrastra el borde del círculo (radio de medio en medio) y se ven en vivo el diámetro, la longitud y el área
// (en múltiplos de π). Hay que lograr la medida pedida, sin confundir radio con diámetro.
// params = { rounds: [{ ask: 'L' | 'A' | 'd', target }] }   (L y A en múltiplos de π)   state = { rounds: [{ r }] }   (de 0.5 a 10)
GAMES['mide-circulo'] = (() => {
  const val = (ask, r) => (ask === 'L' ? 2 * r : ask === 'A' ? r * r : 2 * r);
  const ok = (s, r) => Math.abs(val(r.ask, s.r) - r.target) < 1e-9;
  const answer = r => ({ r: r.ask === 'A' ? Math.sqrt(r.target) : r.target / 2 });
  const show = v => RK.num(Math.round(v * 100) / 100);
  const game = roundsGame({
    aspect: 1.15,
    init: r => ({ r: answer(r).r === 1 ? 2 : 1 }),
    ok,
    solution: r => `r = ${show(answer(r).r)}`,
    prompt: r => (r.ask === 'L' ? `Haz un círculo de longitud ${show(r.target)}π` : r.ask === 'A' ? `Haz un círculo de área ${show(r.target)}π` : `Haz un círculo de diámetro ${show(r.target)}`),
    foot: () => 'Arrastra el borde del círculo',
    layout(G) { G.c = { x: G.W / 2, y: 100 + (G.H - 280) / 2 }; G.R = Math.min(G.W / 2 - 24, (G.H - 280) / 2); G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, u = G.R / 10, good = ok(s, r);
      p.stroke(good ? C.ok : C.sky); p.strokeWeight(2.4); p.fill(RK.al(p, good ? C.ok : C.sky, 50)); p.circle(G.c.x, G.c.y, 2 * s.r * u);
      p.stroke(C.brand); p.strokeWeight(1.6); p.line(G.c.x, G.c.y, G.c.x + s.r * u, G.c.y); drawDot(p, C, G.c.x, G.c.y, 6, C.ink);
      RK.knob(p, C, G.c.x + s.r * u, G.c.y, C.brand); G.kx = G.c.x + s.r * u;
      TK.label(p, C, `r = ${show(s.r)}`, G.c.x + s.r * u / 2, G.c.y - 12, C.ink, 11, 70);
      [`d = ${show(2 * s.r)}`, `L = ${show(2 * s.r)}π`, `A = ${show(s.r * s.r)}π`].forEach((t, i) => TK.label(p, C, t, 20 + (i + 0.5) * (G.W - 40) / 3, G.c.y + G.R + 20, C.mute, 11, (G.W - 40) / 3));
      RK.strip(p, C, G.fb, r.ask === 'L' ? `$L = 2\\pi \\cdot ${show(s.r)} = ${show(2 * s.r)}\\pi$` : r.ask === 'A' ? `$A = \\pi \\cdot ${show(s.r)}^2 = ${show(s.r * s.r)}\\pi$` : `$d = 2 \\cdot ${show(s.r)} = ${show(2 * s.r)}$`, { col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.hypot(x - G.c.x, y - G.c.y) > G.R + 30) return false; G.grab = true; game.move(G, x, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, x, y); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.kx, y: G.c.y }, to: { x: G.kx + G.R * 0.25, y: G.c.y }, text: 'Arrastra el borde', ty: G.c.y + G.R + 40 }),
    peek: G => ({ c: G.c, R: G.R }),
  });
  game.move = (G, x, y) => { const v = Math.max(0.5, Math.min(10, Math.round(Math.hypot(x - G.c.x, y - G.c.y) / (G.R / 10) * 2) / 2)); if (v !== G.s.r || !G.touched[G.cur]) { G.s.r = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
