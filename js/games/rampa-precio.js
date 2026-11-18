// La rampa de precios (Álgebra, alg-13c; juego en movimiento; spec 2026-11-18-algebra-revision): una etiqueta baja por una
// rampa y pasa por un sello que le aplica un cambio porcentual. Se gira el sello (de −50 % a +50 %, de 5 en 5) y al
// soltar la etiqueta baja; al pasar por el sello su precio cambia. Debe llegar abajo con el precio de la canasta.
// params = { rounds: [{ title, items: [{ from, to }] }] }   s = { c, shot }   (c: cambio en %)
GAMES['rampa-precio'] = (() => {
  const need = it => Math.round((it.to / it.from - 1) * 100);
  const game = questGame({
    aspect: 1.05,
    idle: 'Gira el sello con calma; la etiqueta baja al soltar',
    init: () => ({ c: 0, shot: null }),
    ok: (s, it) => Math.abs(it.from * (1 + s.c / 100) - it.to) < 1e-9,
    answer: it => ({ c: need(it), shot: null }),
    solution: it => `${need(it) > 0 ? '+' : ''}${need(it)} %: ${it.from} × ${1 + need(it) / 100} = ${it.to}`,
    prompt: it => `Pasa de ${it.from} a ${it.to}: elige el sello`,
    foot: (it, s) => (s.missed ? 'El porcentaje se mide sobre el precio de arriba' : 'Arrastra el sello y suelta'),
    layout(G) { G.a = { x: 40, y: G.top + 40 }; G.b = { x: G.W - 50, y: G.bottom - 100 }; G.tY = G.bottom - 36; },
    draw(G) {
      const { p, C, s, item: it, a, b } = G, mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, after = it.from * (1 + s.c / 100);
      p.stroke(C.line); p.strokeWeight(6); p.line(a.x, a.y + 14, b.x, b.y + 14);
      p.stroke(C.brand); p.strokeWeight(2); p.fill(RK.al(p, C.brand, 40)); p.rect(mid.x - 34, mid.y - 34, 68, 30, 8);
      TK.label(p, C, `${s.c > 0 ? '+' : s.c < 0 ? '−' : ''}${Math.abs(s.c)} %`, mid.x, mid.y - 19, C.ink, 14, 64);
      p.stroke(C.ok); p.strokeWeight(2); p.noFill(); p.rect(b.x - 30, b.y + 20, 60, 30, 6); TK.label(p, C, `${it.to}`, b.x, b.y + 35, C.ok, 13, 56);
      let t = 0; if (s.shot != null) { t = Math.min(1, (G.t - s.shot) / 1.6); if (t >= 1 && !G.solved) { if (Math.abs(after - it.to) < 1e-9) G.good('¡Precio justo!'); else { s.shot = null; s.missed = true; G.bad(`Llegó con ${+after.toFixed(2)}`); } } }
      if (G.solved) t = 1;
      const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t, price = t < 0.5 ? it.from : after;
      p.stroke(C.ink); p.strokeWeight(1.5); p.fill(C.cream ?? C.card); p.rect(x - 28, y - 8, 56, 26, 6); TK.label(p, C, `${+price.toFixed(2)}`, x, y + 5, C.ink, 13, 52);
      G.X = RK.track(p, C, 24, G.W - 24, G.tY, 21, (s.c + 50) / 5, i => (i % 5 === 0 ? `${(i - 10) * 5}` : null));
    },
    press(G, x, y) { if (G.s.shot != null || Math.abs(y - G.tY) > 34) return false; G.grab = true; G.s.c = RK.pick(x, 24, G.W - 24, 21) * 5 - 50; return true; },
    drag(G, x) { if (!G.grab || G.s.shot != null) return false; G.s.c = RK.pick(x, 24, G.W - 24, 21) * 5 - 50; return true; },
    release(G) { if (G.grab && G.s.shot == null && !G.solved) { G.s.shot = G.t; G.api.sfx?.tap?.(); } G.grab = false; },
    demo: G => (G.X ? { from: { x: G.X(10), y: G.tY }, to: { x: G.X(6), y: G.tY }, text: 'Arrastra el sello y suelta', ty: G.tY - 40 } : null),
    peek: G => ({ tY: G.tY, need: need(G.item), flying: G.s.shot != null }),
  });
  return Object.assign(game, { need });
})();
