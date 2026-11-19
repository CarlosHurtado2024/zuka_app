// El eje que engaña (Preuniversitario, pu-gr-3; spec 2026-11-18-preuda-razonamiento-completo): dos barras con el eje cortado
// parecen muy distintas. A la izquierda hay una agarradera para bajar el piso del eje hasta 0 y ver la diferencia de verdad.
// Abajo se desliza cuánto por ciento más tiene la barra alta que la baja: eso no depende de dónde empiece el eje.
// params = { rounds: [{ a: [rótulo, valor], b: [rótulo, valor], floor }] }   state = { rounds: [{ p, fl }] }   (p de 0 a 100, de 5 en 5)
GAMES['eje-engano'] = (() => {
  const need = r => (r.a[1] - r.b[1]) / r.b[1] * 100;
  const ok = (s, r) => s.p === need(r);
  const game = roundsGame({
    aspect: 1.3,
    init: r => ({ p: need(r) === 50 ? 45 : 50, fl: r.floor }),
    ok,
    solution: r => `${r.a[0]} tiene ${need(r)} % más que ${r.b[0]}`,
    prompt: r => `¿Cuánto por ciento más tiene ${r.a[0]} que ${r.b[0]}?`,
    foot: () => 'Baja el piso del eje y desliza el porcentaje',
    layout(G) { G.b = { x: 60, y: 96, w: G.W - 80, h: G.H - 276 }; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { p: need(r), fl: 0 } : G.s, good = ok(s, r), b = G.b, hi = r.a[1] * 1.08;
      const Y = v => b.y + b.h - (v - s.fl) / (hi - s.fl) * b.h;
      for (let k = 0; k <= 4; k++) { const v = s.fl + (hi - s.fl) * k / 4, y = Y(v); p.stroke(RK.al(p, C.line, 90)); p.strokeWeight(1); p.line(b.x, y, b.x + b.w, y); TK.label(p, C, String(Math.round(v)), b.x - 18, y, C.mute, 9, 30); }
      [r.a, r.b].forEach(([lab, v], i) => { const x = b.x + b.w * (0.15 + i * 0.45), w = b.w * 0.3; p.noStroke(); p.fill(i ? C.sky : C.coral); p.rect(x, Y(v), w, Y(s.fl) - Y(v), 3, 3, 0, 0); TK.label(p, C, `${lab}: ${v}`, x + w / 2, b.y + b.h + 14, C.ink, 10, w + 30); });
      G.hy = Y(s.fl); p.noStroke(); p.fill(C.brand); p.rect(b.x - 62, G.hy - 9, 24, 18, 5); TK.label(p, C, `piso ${s.fl}`, b.x - 50, G.hy - 18, C.brand, 8, 44); TK.label(p, C, '↓', b.x - 50, G.hy + 16, C.brand, 10, 20);
      const look = (r.a[1] - s.fl) / (r.b[1] - s.fl);
      TK.label(p, C, `a la vista: ${Math.round(look * 10) / 10} veces más alta`, b.x + b.w / 2, b.y - 6, s.fl > 0 ? C.coral : C.mute, 10, b.w);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 21, s.p / 5, k => (k % 4 === 0 ? `${k * 5}%` : null), good ? C.ok : C.brand);
      RK.strip(p, C, G.fb, `$${r.b[1]} \\cdot ${(1 + s.p / 100).toFixed(2)} = ${Math.round(r.b[1] * (1 + s.p / 100) * 100) / 100}$`, { kicker: `${s.p} % más`, col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) {
      if (Math.abs(y - G.tY) < 28) { G.grab = 'p'; game.move(G, x); return true; }
      if (x < G.b.x && Math.abs(y - G.hy) < 22) { G.grab = 'fl'; G.y0 = y; G.f0 = G.s.fl; return true; }
      return false;
    },
    drag(G, x, y) {
      if (G.grab === 'p') { game.move(G, x); return true; }
      if (G.grab === 'fl') { const r = G.r, b = G.b, f = Math.max(0, Math.min(r.floor, Math.round(G.f0 - (y - G.y0) / 80 * r.floor))); if (f !== G.s.fl) { G.s.fl = f; G.touch(); } return true; }
      return false;
    },
    release(G) { G.grab = null; },
    demo: G => ({ from: { x: G.b.x - 50, y: G.hy }, to: { x: G.b.x - 50, y: G.hy + 50 }, text: 'Baja el piso', ty: G.b.y + 20 }),
    peek: G => ({ tY: G.tY, b: G.b }),
  });
  game.move = (G, x) => { const v = 5 * RK.pick(x, 30, G.W - 30, 21); if (v !== G.s.p || !G.touched[G.cur]) { G.s.p = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ p: need(r), fl: 0 }) });
})();
