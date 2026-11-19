// Los cubos que no se ven (Preuniversitario, pu-es-2; spec 2026-11-18-preuda-razonamiento-completo): en una construcción de
// cubos, los que sostienen a los de arriba también cuentan aunque no se vean. Se ve la construcción en perspectiva y su
// vista desde arriba con las alturas tapadas; se arrastra el total de cubos.
// params = { rounds: [{ h: [[alturas por fila]] }] }   state = { rounds: [{ n }] }   (de 1 a 40)
GAMES['cubos-ocultos'] = (() => {
  const total = r => r.h.flat().reduce((a, b) => a + b, 0);
  const ok = (s, r) => s.n === total(r);
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ n: 1 }),
    ok,
    solution: r => `${total(r)} cubos`,
    prompt: () => '¿Cuántos cubos tiene la construcción, contando los escondidos?',
    foot: () => 'Arrastra el total de cubos',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { n: total(r) } : G.s, rows = r.h.length, cols = r.h[0].length, c = Math.min(26, (G.W - 80) / (cols + rows * 0.6)), dx = c * 0.6, dy = c * 0.5, ox = 40, oy = G.tY - 70;
      // Se dibuja de atrás (fila 0) hacia adelante y de abajo hacia arriba, para que lo de adelante tape lo de atrás.
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) for (let k = 0; k < r.h[j][i]; k++) {
        const x = ox + i * c + (rows - 1 - j) * dx, y = oy - k * c - (rows - 1 - j) * dy;
        p.stroke(C.bg); p.strokeWeight(1); p.fill(RK.al(p, C.sky, 230)); p.rect(x, y, c, c);
        p.fill(RK.al(p, C.sky, 170)); p.quad(x, y, x + c, y, x + c + dx, y - dy, x + dx, y - dy);
        p.fill(RK.al(p, C.sky, 120)); p.quad(x + c, y, x + c + dx, y - dy, x + c + dx, y - dy + c, x + c, y + c);
      }
      const good = ok(s, r);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 40, s.n - 1, i => ((i + 1) % 5 === 0 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$\\text{${s.n} cubos}$`, { kicker: good ? 'Contaste también los de abajo' : 'Cuenta columna por columna', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X(4), y: G.tY }, text: 'Arrastra el total', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 40) + 1; if (v !== G.s.n || !G.touched[G.cur]) { G.s.n = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ n: total(r) }) });
})();
