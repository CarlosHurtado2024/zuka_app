// La espiral de raíces (Álgebra, alg-11c; spec 2026-11-18-algebra-revision): la espiral de Teodoro. Cada triángulo
// rectángulo nuevo tiene un cateto de 1 y como otro cateto la hipotenusa anterior, así que sus hipotenusas miden √2, √3,
// √4, √5… Se arrastra la punta alrededor para agregar o quitar triángulos hasta la raíz pedida; el compás lleva esa
// hipotenusa a la recta, entre dos enteros, porque casi ninguna es entera.
// params = { rounds: [{ n }] }   state = { rounds: [{ k }] }   (k triángulos: la última hipotenusa mide √(k + 1))
GAMES['espiral-teodoro'] = (() => {
  const MAXK = 12;
  // Puntas de la espiral: la j-ésima está a distancia √(j + 1) del centro.
  const tips = () => { const o = [[1, 0]]; for (let j = 1; j <= MAXK; j++) { const [x, y] = o[j - 1], d = Math.hypot(x, y); o.push([x - y / d, y + x / d]); } return o; };
  const T = tips(), ang = T.map(([x, y]) => { let a = Math.atan2(y, x); return a < 0 ? a + 2 * Math.PI : a; });
  const game = roundsGame({
    aspect: 1.45,
    init: () => ({ k: 1 }),
    ok: (s, r) => s.k + 1 === r.n,
    solution: r => `${r.n - 1} triángulos: √${r.n} ≈ ${Math.sqrt(r.n).toFixed(3)}`,
    prompt: r => `Arma la espiral hasta la hipotenusa $\\sqrt{${r.n}}$`,
    foot: () => 'Arrastra la punta alrededor del centro: cada triángulo suma uno bajo la raíz',
    layout(G) { G.u = Math.min((G.W - 40) / 7.6, (G.H * 0.5) / 7.2); G.o = { x: G.W / 2, y: 96 + G.u * 3.7 }; G.L = { x0: 26, x1: G.W - 26, y: G.H - 108, min: 0, max: 4 }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r, u, o } = G, k = G.locked && G.s.k + 1 !== r.n ? r.n - 1 : G.s.k, P = j => [o.x + T[j][0] * u, o.y - T[j][1] * u];
      for (let j = 1; j <= k; j++) {
        const [ax, ay] = P(j - 1), [bx, by] = P(j), last = j === k;
        p.fill(RK.al(p, j % 2 ? C.sky : C.mint, last ? 80 : 36)); p.stroke(C.line); p.strokeWeight(1); p.triangle(o.x, o.y, ax, ay, bx, by);
        p.stroke(C.ink); p.strokeWeight(2); p.line(ax, ay, bx, by);
      }
      const [hx, hy] = P(k);
      p.stroke(C.brand); p.strokeWeight(3.5); p.line(o.x, o.y, hx, hy);
      TK.label(p, C, `√${k + 1}`, (o.x + hx) / 2 + 10, (o.y + hy) / 2 - 10, C.brand, 14, 50);
      RK.knob(p, C, hx, hy, C.brand); G.tip = { x: hx, y: hy };
      // El compás lleva la hipotenusa a la recta.
      const X = drawNumLine(p, C, G.L, { step: 1 }), v = Math.sqrt(k + 1);
      p.noFill(); p.stroke(RK.al(p, C.brand, 150)); p.strokeWeight(1.4); p.drawingContext.setLineDash([4, 4]); p.line(X(0), G.L.y - 22, X(v), G.L.y - 22); p.drawingContext.setLineDash([]);
      drawDot(p, C, X(v), G.L.y, 12, C.brand);
      RK.strip(p, C, G.fb, `$\\sqrt{${k + 1}} \\approx ${v.toFixed(3)}$`, { col: G.locked ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.hypot(x - G.tip.x, y - G.tip.y) > 34 && Math.hypot(x - G.o.x, y - G.o.y) > G.u * 3.8) return false; G.grab = true; game.move(G, x, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, x, y); return true; },
    release(G) { G.grab = false; },
    demo: G => { const [x, y] = T[Math.min(MAXK, G.s.k + 2)]; return { from: G.tip, to: { x: G.o.x + x * G.u, y: G.o.y - y * G.u }, text: 'Gira la punta', ty: 104 }; },
    peek: G => ({ o: G.o, u: G.u, tips: T }),
  });
  // El ángulo del dedo elige la punta más cercana.
  game.move = (G, x, y) => {
    let a = Math.atan2(G.o.y - y, x - G.o.x); if (a < 0) a += 2 * Math.PI;
    let best = 1; for (let j = 1; j <= MAXK; j++) if (Math.abs(ang[j] - a) < Math.abs(ang[best] - a)) best = j;
    if (best !== G.s.k || !G.touched[G.cur]) { G.s.k = best; G.touch(); }
  };
  return Object.assign(game, { tips: T, ang });
})();
