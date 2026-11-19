// La variación porcentual en barras (Preuniversitario, pu-gr-1 y pu-gr-3; spec 2026-11-18-preuda-razonamiento-completo): la
// barra de antes es el 100 % y lleva una regla de 10 en 10 %. Se desliza el porcentaje de cambio y una barra fantasma crece o
// se encoge desde la de antes; cuando la fantasma llega justo a la barra de ahora, ese es el cambio porcentual.
// params = { rounds: [{ from, to, what }] }   state = { rounds: [{ p }] }   (de −75 a 150, de 25 en 25)
GAMES['variacion-barras'] = (() => {
  const need = r => (r.to - r.from) / r.from * 100;
  const ok = (s, r) => s.p === need(r);
  const P0 = -75, P1 = 150, ST = 25, N = (P1 - P0) / ST + 1;   // de 25 en 25: en el celular cada marca queda a más de 20 px
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ p: need(r) === 0 ? 25 : 0 }),
    ok,
    solution: r => `${need(r) > 0 ? '+' : ''}${need(r)} %`,
    prompt: r => `${r.what}: de ${r.from} a ${r.to}. ¿Qué porcentaje cambió?`,
    foot: () => 'Desliza el porcentaje hasta que la fantasma iguale a la barra nueva',
    layout(G) { G.b = { x: 44, y: 96, w: G.W - 60, h: G.H - 266 }; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { p: need(r) } : G.s, good = ok(s, r), b = G.b, hi = Math.max(r.from * 2.5, r.to) * 1.05;
      const Y = v => b.y + b.h - v / hi * b.h, bw = b.w * 0.22, xa = b.x + b.w * 0.15, xb = b.x + b.w * 0.6, ghost = r.from * (1 + s.p / 100);
      p.stroke(C.line); p.strokeWeight(1); p.line(b.x, Y(0), b.x + b.w, Y(0));
      p.noStroke(); p.fill(C.sky); p.rect(xa, Y(r.from), bw, Y(0) - Y(r.from), 3, 3, 0, 0);
      for (let k = 0; k <= 25; k++) { const v = r.from * k / 10; if (v > hi) break; const y = Y(v); p.stroke(RK.al(p, C.line, k % 5 ? 70 : 160)); p.line(xa + bw, y, xb + bw + 8, y); if (k % 5 === 0) TK.label(p, C, `${k * 10}%`, xa - 18, y, C.mute, 8, 30); }
      p.noStroke(); p.fill(C.coral); p.rect(xb, Y(r.to), bw, Y(0) - Y(r.to), 3, 3, 0, 0);
      p.noFill(); p.stroke(good ? C.ok : C.brand); p.strokeWeight(2); p.drawingContext.setLineDash([5, 4]); p.rect(xb - 4, Y(ghost), bw + 8, Y(0) - Y(ghost), 3); p.drawingContext.setLineDash([]);
      TK.label(p, C, `antes ${r.from}`, xa + bw / 2, Y(0) + 13, C.ink, 10, bw + 20);
      TK.label(p, C, `ahora ${r.to}`, xb + bw / 2, Y(0) + 13, C.ink, 10, bw + 20);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, N, (s.p - P0) / ST, k => ((P0 + ST * k) % 50 === 0 ? `${P0 + ST * k}` : null), good ? C.ok : C.brand);
      RK.strip(p, C, G.fb, `$${r.from} \\cdot ${(1 + s.p / 100).toFixed(2)} = ${Math.round(ghost * 100) / 100}$`, { kicker: `cambio ${s.p > 0 ? '+' : ''}${s.p} %`, col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 28) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X((G.s.p - P0) / ST), y: G.tY }, to: { x: G.X((G.s.p - P0) / ST + 2), y: G.tY }, text: 'Desliza el porcentaje', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = P0 + ST * RK.pick(x, 30, G.W - 30, N); if (v !== G.s.p || !G.touched[G.cur]) { G.s.p = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ p: need(r) }) });
})();
