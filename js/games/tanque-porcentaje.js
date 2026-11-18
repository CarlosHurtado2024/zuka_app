// El tanque al tanto por ciento (Álgebra, alg-13; juego en movimiento; spec 2026-11-18-algebra-revision): el porcentaje
// de una cantidad. El tanque tiene su capacidad marcada en litros (no en por ciento). Se arrastra la marca de nivel
// hasta los litros que corresponden al porcentaje pedido y, al soltar, la llave llena el tanque hasta esa marca; el
// tanto por ciento aparece al final. Sin prisa: el agua solo corre al soltar.
// params = { rounds: [{ title, items: [{ cap, pct, step }] }] }   s = { L, shot }
GAMES['tanque-porcentaje'] = (() => {
  const need = it => (it.cap * it.pct) / 100;
  const game = questGame({
    aspect: 1.05,
    idle: 'Pon la marca con calma; el agua sale al soltar',
    init: it => ({ L: it.step, shot: null }),
    ok: (s, it) => Math.abs(s.L - need(it)) < 1e-9,
    answer: it => ({ L: need(it), shot: null }),
    solution: it => `${it.pct} % de ${it.cap} L = ${need(it)} L`,
    prompt: it => `Llena el ${it.pct} % de un tanque de ${it.cap} L`,
    foot: (it, s) => (s.missed ? 'El por ciento es de cada 100: busca el 1 % primero' : 'Arrastra la marca a los litros y suelta'),
    layout(G) { G.tank = { x: G.W / 2 - 50, y: G.top + 30, w: 100, h: G.bottom - G.top - 70 }; },
    draw(G) {
      const { p, C, s, item: it, tank } = G, Y = v => tank.y + tank.h * (1 - v / it.cap);
      p.stroke(C.ink); p.strokeWeight(2); p.fill(C.card); p.rect(tank.x, tank.y, tank.w, tank.h, 4);
      for (let v = 0; v <= it.cap; v += it.step) { p.stroke(C.line); p.strokeWeight(1); p.line(tank.x - 8, Y(v), tank.x, Y(v)); if ((v / it.step) % 2 === 0) TK.label(p, C, `${v} L`, tank.x - 30, Y(v), C.mute, 10, 44); }
      let lev = 0;
      if (s.shot != null) { const t = Math.min(1, (G.t - s.shot) / 1.4); lev = s.L * t; if (t >= 1 && !G.solved) { if (Math.abs(s.L - need(it)) < 1e-9) G.good(`${need(it)} L es el ${it.pct} %`); else { s.shot = null; s.missed = true; G.bad(`${s.L} L es el ${+(100 * s.L / it.cap).toFixed(1)} %`); } } }
      if (G.solved) lev = need(it);
      p.noStroke(); p.fill(RK.al(p, C.sky, 170)); p.rect(tank.x + 2, Y(lev), tank.w - 4, tank.y + tank.h - Y(lev) - 2, 2);
      p.stroke(C.brand); p.strokeWeight(2.5); p.line(tank.x - 4, Y(s.L), tank.x + tank.w + 14, Y(s.L)); RK.knob(p, C, tank.x + tank.w + 24, Y(s.L), C.brand);
      TK.label(p, C, `${s.L} L`, tank.x + tank.w + 62, Y(s.L), C.brand, 12, 50);
      G.ky = Y(s.L); G.Y = Y;
    },
    press(G, x, y) { if (G.s.shot != null || x < G.tank.x) return false; G.grab = true; game.move(G, y); return true; },
    drag(G, x, y) { if (!G.grab || G.s.shot != null) return false; game.move(G, y); return true; },
    release(G) { if (G.grab && G.s.shot == null && !G.solved) { G.s.shot = G.t; G.api.sfx?.tap?.(); } G.grab = false; },
    demo: G => (G.ky ? { from: { x: G.tank.x + G.tank.w + 24, y: G.ky }, to: { x: G.tank.x + G.tank.w + 24, y: G.ky - 60 }, text: 'Sube la marca y suelta', ty: G.tank.y - 12 } : null),
    peek: G => ({ tank: G.tank, need: need(G.item), flying: G.s.shot != null }),
  });
  game.move = (G, y) => { const it = G.item, t = G.tank, v = (1 - (y - t.y) / t.h) * it.cap; G.s.L = Math.max(it.step, Math.min(it.cap, Math.round(v / it.step) * it.step)); };
  return Object.assign(game, { need });
})();
