// Billar de un rebote (Preuniversitario UdeA, pu-ge-1; juego en movimiento; spec 2026-11-18-preuda-geometria): la
// bola tiene que entrar en la tronera después de rebotar una vez en la banda de arriba. Rebota con el mismo ángulo con
// que llega. Se arrastra la mira por la banda (salta de medio en medio) y al soltar, la bola sale. Mientras viaja se
// ven los dos ángulos. Fallar quita una vida y deja dibujado el tiro, con una equis donde cayó la bola.
// item = { p: [x, y], t: [x, y] }   (mesa de 10 × 6, con y hacia arriba)   s = { x: mira | null, shot: tiempo | null, last: mira del tiro fallado }
GAMES['billar-rebote'] = (() => {
  const TW = 10, TH = 6;
  // Punto de la banda al que hay que apuntar: la recta de la bola a la tronera reflejada.
  const aim = it => it.p[0] + (it.t[0] - it.p[0]) * (TH - it.p[1]) / (2 * TH - it.p[1] - it.t[1]);
  const game = questGame({
    aspect: 1.25,
    idle: 'Apunta con calma; al soltar, la bola sale',
    init: () => ({ x: null, shot: null, missed: false }),
    ok: (s, it) => s.x != null && Math.abs(s.x - aim(it)) < 0.26,
    answer: it => ({ x: aim(it), shot: null }),
    solution: it => `apuntar a ${aim(it)} en la banda`,
    prompt: () => 'Rebota en la banda de arriba y entra en la tronera',
    foot: (it, s) => (s.missed ? 'La equis marca dónde cayó: corre la mira hasta igualar los ángulos' : 'El ángulo con que llega es el ángulo con que sale'),
    layout(G) { const m = 18; G.u = Math.min((G.W - 2 * m) / TW, (G.bottom - G.top - 86) / TH); G.tx = (G.W - TW * G.u) / 2; G.ty = G.top + 62; G.P = (x, y) => [G.tx + x * G.u, G.ty + (TH - y) * G.u]; },
    draw(G) {
      const { p, C, s, item: it, u, P } = G, [x0, y0] = P(0, TH);
      // La mesa.
      p.stroke(C.line); p.strokeWeight(4); p.fill(C.card); p.rect(x0, y0, TW * u, TH * u, 6);
      p.stroke(C.sun); p.strokeWeight(5); p.line(x0, y0, x0 + TW * u, y0);
      for (let i = 0; i <= TW; i++) { p.stroke(C.mute); p.strokeWeight(1.5); p.line(x0 + i * u, y0 - 6, x0 + i * u, y0); if (i % 2 === 0) TK.label(p, C, String(i), x0 + i * u, y0 - 16, C.mute, 10, 20); }
      const [bx, by] = P(...it.p), [hx, hy] = P(...it.t);
      p.noStroke(); p.fill(C.night ?? C.ink); p.circle(hx, hy, 22); p.noFill(); p.stroke(C.ok); p.strokeWeight(2.5); p.circle(hx, hy, 26);
      // El tiro anterior queda dibujado, tenue: se ve si la bola se pasó o se quedó corta.
      if (s.last != null && s.shot == null) {
        const [lx, ly] = P(s.last, TH), ex = s.last + (s.last - it.p[0]) * TH / (TH - it.p[1]), [fx, fy] = P(Math.max(0, Math.min(TW, ex)), ex < 0 || ex > TW ? TH - TH * (ex < 0 ? s.last : TW - s.last) / Math.abs(ex - s.last) : 0);
        p.stroke(C.bad); p.strokeWeight(1.5); p.drawingContext.setLineDash([3, 5]); p.line(bx, by, lx, ly); p.line(lx, ly, fx, fy); p.drawingContext.setLineDash([]);
        p.line(fx - 5, fy - 5, fx + 5, fy + 5); p.line(fx - 5, fy + 5, fx + 5, fy - 5);
      }
      // La mira y la línea de tiro.
      if (s.x != null) {
        const [ax, ay] = P(s.x, TH);
        p.stroke(C.ink); p.strokeWeight(1.5); p.drawingContext.setLineDash([5, 5]); p.line(bx, by, ax, ay); p.drawingContext.setLineDash([]);
        p.noStroke(); p.fill(C.brand); p.triangle(ax, ay + 2, ax - 7, ay - 11, ax + 7, ay - 11);
        // Los ángulos con la banda, a los dos lados del punto de rebote.
        const inDir = GEO.angOf(ax, ay, bx, by);   // hacia la bola (entre 180 y 360)
        if (s.shot != null) { const a = Math.round(Math.min(inDir - 180, 360 - inDir)); const left = bx < ax; GEO.wedge(p, C, ax, ay, 24, left ? 180 : inDir, left ? inDir : 360, C.sky, `${a}°`, 40); GEO.wedge(p, C, ax, ay, 24, left ? 540 - inDir : 180, left ? 360 : 540 - inDir, C.coral, `${a}°`, 40); }
      }
      // La bola: quieta, o viajando por su camino (ida, rebote y vuelta hasta el piso de la mesa).
      let ball = [bx, by];
      if (s.shot != null && s.x != null) {
        const [ax, ay] = P(s.x, TH), d1 = Math.hypot(ax - bx, ay - by), vx = (ax - bx) / d1, vy = (ay - by) / d1, d2 = (TH * u) / -vy, dw = vx > 0 ? (x0 + TW * u - ax) / vx : vx < 0 ? (x0 - ax) / vx : Infinity, tot = d1 + Math.min(d2, dw);   // se detiene en el piso o en una banda lateral
        const dHit = d1 + ((TH - it.t[1]) * u) / -vy, good = game.okShot(s, it);
        const d = Math.min(good ? dHit : tot, (G.t - s.shot) * 230);
        ball = d < d1 ? [bx + vx * d, by + vy * d] : [ax + vx * (d - d1), ay - vy * (d - d1)];
        p.stroke(C.cream); p.strokeWeight(2); p.line(bx, by, d < d1 ? ball[0] : ax, d < d1 ? ball[1] : ay); if (d >= d1) p.line(ax, ay, ball[0], ball[1]);
        // Llegó: entra si pasa por la tronera.
        if (!G.solved && d >= (good ? dHit : tot)) { if (good) G.good('¡Adentro! Ángulos iguales'); else { s.shot = null; s.missed = true; s.last = s.x; G.bad('No entró: mira los ángulos'); } }
        if (G.solved) ball = [hx, hy];
      }
      drawDot(p, C, ball[0], ball[1], 15, C.cream);
      G.band = { x0, y0, w: TW * u };
    },
    press(G, x, y) { if (G.s.shot != null || y > G.band.y0 + 40 || y < G.band.y0 - 44) return false; game.aimAt(G, x); return true; },
    drag(G, x) { if (G.s.shot != null || G.s.x == null) return false; game.aimAt(G, x); return true; },
    release(G) { if (G.s.x != null && G.s.shot == null && !G.solved) { G.s.shot = G.t; G.api.sfx?.tap?.(); } },
    demo(G) { const b = G.band; return b ? { from: { x: b.x0 + b.w * 0.2, y: b.y0 }, to: { x: b.x0 + b.w * 0.55, y: b.y0 }, text: 'Arrastra la mira por la banda y suelta', ty: G.bottom - 12 } : null; },
    peek: G => ({ band: G.band, u: G.u, aim: aim(G.item), flying: G.s.shot != null }),
  });
  game.okShot = (s, it) => s.x != null && Math.abs(s.x - aim(it)) < 0.26;
  game.aimAt = (G, x) => { G.s.x = Math.max(0.5, Math.min(TW - 0.5, Math.round((x - G.band.x0) / G.u * 2) / 2)); };
  return Object.assign(game, { aim });
})();
