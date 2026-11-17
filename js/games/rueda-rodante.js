// La rueda rodante (Trigonometría, trig-41b): una rueda avanza lo mismo que mide el arco que apoya, s = r·θ. Se elige el ángulo (en
// sextos de π) y se suelta la rueda. item = { r, n }   (θ = n·π/6; la bandera está a r·θ)
GAMES['rueda-rodante'] = (() => {
  const sTex = it => TK.piTex(it.r * it.n, 6);
  return questGame({
    aspect: 1.3,
    init: () => ({ n: 0, rolled: false }),
    ok: (s, it) => !!s.rolled && s.n === it.n,
    answer: it => ({ n: it.n, rolled: true }),
    solution: it => `$\\theta = \\tfrac{s}{r} = ${TK.piTex(it.n, 6)}$`,
    prompt: it => `Bandera a $s = ${sTex(it)}$ m, radio de ${it.r} m. ¿Qué ángulo debe girar la rueda?`,
    foot: () => 'La rueda avanza lo mismo que mide el arco que apoya: $s = r\\theta$',
    layout(G) { const y = G.bottom - 46; G.st = { x: 12, y, w: G.W * 0.56, h: 38 }; G.go = { x: G.st.x + G.st.w + 10, y, w: G.W - 34 - G.st.w, h: 38 }; G.gy = y - 46; },
    draw(G) {
      const { p, C, s, item: it, W, gy } = G, x0 = 60, span = W - 100, dist = n => it.r * n * Math.PI / 6;
      const sc = Math.min(span * 0.74 / dist(it.n), 44 / it.r), rp = it.r * sc, th = (s.rolled ? s.n * Math.PI / 6 : 0) * TK.prog(G, 0.5);
      const wx = Math.min(W - rp - 4, x0 + it.r * th * sc), wy = gy - rp, fx = x0 + dist(it.n) * sc;
      p.stroke(C.line); p.strokeWeight(3); p.line(10, gy, W - 10, gy);
      p.stroke(C.coral); p.strokeWeight(5); p.line(x0, gy, wx, gy);
      // Bandera.
      p.stroke(C.ink); p.strokeWeight(2); p.line(fx, gy, fx, gy - 2 * rp - 26); p.noStroke(); p.fill(G.solved ? C.ok : C.coral); p.triangle(fx, gy - 2 * rp - 26, fx + 18, gy - 2 * rp - 19, fx, gy - 2 * rp - 12);
      TK.label(p, C, `$s = ${sTex(it)}$ m`, fx, gy + 16, C.ink, 13, 120);
      // Rueda: el arco que ya rodó va en coral, igual que el camino.
      p.fill(C.card); p.stroke(C.ink); p.strokeWeight(3); p.circle(wx, wy, 2 * rp);
      if (th > 0) { p.noFill(); p.stroke(C.coral); p.strokeWeight(5); p.arc(wx, wy, 2 * rp, 2 * rp, Math.PI / 2, Math.PI / 2 + Math.min(th, 2 * Math.PI - 0.001)); }
      p.stroke(C.sky); p.strokeWeight(3); p.line(wx, wy, wx - rp * Math.sin(th), wy + rp * Math.cos(th));
      drawDot(p, C, wx - rp * Math.sin(th), wy + rp * Math.cos(th), 9, C.sky);
      TK.label(p, C, `r = ${it.r} m`, x0, gy - 2 * rp - 12, C.mute, 12, 90);
      drawStepper(p, C, G.st, `$${TK.piTex(s.n, 6)}$`, 'ángulo que gira (θ, en radianes)');
      drawBtn(p, C, G.go, 'Rodar', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, d = stepHit(G.st, x, y);
      if (d) { s.n = Math.max(0, Math.min(24, s.n + d)); s.rolled = false; G.api.sfx?.tap?.(); return true; }
      if (!hitBox(G.go, x, y)) return false;
      s.rolled = true; TK.fire(G); G.submit(s.n < G.item.n ? 'Se quedó corta: no llegó a la bandera' : 'Se pasó de la bandera');
      return true;
    },
    peek: G => ({ solve: [...TK.steps(G.st, G.s.n, G.item.n), G.go], wrong: G.s.n === G.item.n ? null : G.go }),
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
