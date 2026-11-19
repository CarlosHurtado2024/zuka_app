// La rueda de la semana (Preuniversitario, pu-se-3; spec 2026-11-18-preuda-razonamiento-completo): los días se repiten cada 7.
// Una rueda con los siete días y una flecha que sale del día de hoy: se gira la flecha hasta el día pedido. El juego cuenta
// cuántos días avanza la flecha (k) y muestra si lo que queda, n − k, son semanas completas.
// params = { rounds: [{ start: 0 (lunes) … 6, n }] }   state = { rounds: [{ d }] }   (día 0 a 6)
GAMES['ciclo-reloj'] = (() => {
  const DAYS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const need = r => (r.start + r.n) % 7;
  const ok = (s, r) => s.d === need(r);
  const ang = d => -Math.PI / 2 + d * 2 * Math.PI / 7;
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ d: need(r) === r.start ? (r.start + 1) % 7 : r.start }),
    ok,
    solution: r => `${r.n} = 7 · ${Math.floor(r.n / 7)} + ${r.n % 7}: ${DAYS[need(r)]}`,
    prompt: r => `Hoy es ${DAYS[r.start]}. ¿Qué día será dentro de ${r.n} días?`,
    foot: () => 'Gira la flecha hasta el día',
    layout(G) { G.R = Math.min(G.W * 0.33, 118); G.c = { x: G.W / 2, y: 92 + G.R + 10 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { d: need(r) } : G.s, good = ok(s, r), c = G.c, R = G.R, k = ((s.d - r.start) % 7 + 7) % 7, rest = r.n - k;
      p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.card, 200)); p.circle(c.x, c.y, 2 * R);
      for (let i = 0; i < 7; i++) {
        const a = ang(i), x = c.x + R * 0.78 * Math.cos(a), y = c.y + R * 0.78 * Math.sin(a), on = i === s.d, here = i === r.start;
        p.noStroke(); p.fill(on ? (good ? C.ok : C.brand) : here ? RK.al(p, C.sky, 120) : RK.al(p, C.line, 80)); p.circle(x, y, 40);
        TK.label(p, C, DAYS[i].slice(0, 3), x, y, on ? inkOn(good ? C.ok : C.brand) : C.ink, 11, 38);
      }
      p.noFill(); p.stroke(C.coral); p.strokeWeight(2);
      if (k) p.arc(c.x, c.y, R * 0.9, R * 0.9, ang(r.start), ang(r.start + k));
      const a = ang(s.d); p.stroke(good ? C.ok : C.brand); p.strokeWeight(3); p.line(c.x, c.y, c.x + R * 0.55 * Math.cos(a), c.y + R * 0.55 * Math.sin(a));
      G.tip = { x: c.x + R * 0.55 * Math.cos(a), y: c.y + R * 0.55 * Math.sin(a) }; RK.knob(p, C, G.tip.x, G.tip.y, C.brand);
      TK.label(p, C, `avanza ${k}`, c.x, c.y + 18, C.coral, 10, 80);
      const mult = rest % 7 === 0;
      RK.strip(p, C, G.fb, `$${r.n} - ${k} = ${rest}$`, { kicker: mult ? `${rest} son ${rest / 7} semanas completas` : `${rest} no son semanas completas`, col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.hypot(x - G.c.x, y - G.c.y) > G.R + 16) return false; G.grab = true; game.move(G, x, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, x, y); return true; },
    release(G) { G.grab = false; },
    demo: G => { const a = ang(G.s.d + 2); return { from: G.tip || G.c, to: { x: G.c.x + G.R * 0.6 * Math.cos(a), y: G.c.y + G.R * 0.6 * Math.sin(a) }, text: 'Gira la flecha', ty: G.c.y + G.R + 22 }; },
    peek: G => ({ c: G.c, R: G.R }),
  });
  game.move = (G, x, y) => {
    if (Math.hypot(x - G.c.x, y - G.c.y) < 12) return;
    let a = Math.atan2(y - G.c.y, x - G.c.x) + Math.PI / 2; if (a < 0) a += 2 * Math.PI;
    const d = Math.round(a / (2 * Math.PI / 7)) % 7;
    if (d !== G.s.d || !G.touched[G.cur]) { G.s.d = d; G.touch(); }
  };
  return Object.assign(game, { answer: r => ({ d: need(r) }) });
})();
