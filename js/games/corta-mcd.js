// Baldosas sin cortar (Preuniversitario, pu-nu-2; spec 2026-11-18-preuda-razonamiento-completo): un piso de a × b se cubre con
// baldosas cuadradas iguales, sin cortar ninguna. Se arrastra el tamaño de la baldosa; el juego la repite por el piso y pinta
// de rojo lo que sobra si no cabe justo. La baldosa más grande que cubre sin sobrar mide el MCD.
// params = { rounds: [{ a, b }] }   state = { rounds: [{ k }] }   (lado de la baldosa, de 1 a min(a, b))
GAMES['corta-mcd'] = (() => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const ok = (s, r) => s.k === gcd(r.a, r.b);
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ k: 1 }),
    ok,
    solution: r => `baldosas de ${gcd(r.a, r.b)}: ${(r.a / gcd(r.a, r.b)) * (r.b / gcd(r.a, r.b))} baldosas`,
    prompt: r => `Piso de ${r.a} × ${r.b}: la baldosa cuadrada más grande sin cortar`,
    foot: () => 'Desliza el tamaño de la baldosa',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { k: gcd(r.a, r.b) } : G.s, good = ok(s, r), u = Math.min((G.W - 40) / r.a, (G.tY - 150) / r.b), x0 = (G.W - r.a * u) / 2, y0 = 100, k = s.k;
      const fx = Math.floor(r.a / k), fy = Math.floor(r.b / k), fits = r.a % k === 0 && r.b % k === 0;
      p.noStroke(); p.fill(RK.al(p, C.bad, 80)); p.rect(x0, y0, r.a * u, r.b * u, 4);
      for (let i = 0; i < fx; i++) for (let j = 0; j < fy; j++) { p.stroke(C.ink); p.strokeWeight(1); p.fill(RK.al(p, good ? C.ok : (i + j) % 2 ? C.sky : C.mint, 170)); p.rect(x0 + i * k * u, y0 + j * k * u, k * u, k * u); }
      p.noFill(); p.stroke(C.ink); p.strokeWeight(2); p.rect(x0, y0, r.a * u, r.b * u, 4);
      TK.label(p, C, String(r.a), x0 + r.a * u / 2, y0 - 10, C.mute, 10, 40); TK.label(p, C, String(r.b), x0 - 12, y0 + r.b * u / 2, C.mute, 10, 20);
      const mx = Math.min(r.a, r.b);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, mx, k - 1, i => ((i + 1) % Math.ceil(mx / 8) === 0 || i === 0 ? String(i + 1) : null), good ? C.ok : C.brand);
      RK.strip(p, C, G.fb, `$\\text{baldosa de ${k}}$`, { kicker: fits ? (good ? 'la más grande que cabe justo' : `cabe justo: ${fx * fy} baldosas; ¿y más grande?`) : 'sobra piso (en rojo)', col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 28) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.k - 1), y: G.tY }, to: { x: G.X(G.s.k - 1) + 60, y: G.tY }, text: 'Desliza el tamaño', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const r = G.r, k = RK.pick(x, 30, G.W - 30, Math.min(r.a, r.b)) + 1; if (k !== G.s.k || !G.touched[G.cur]) { G.s.k = k; G.touch(); } };
  return Object.assign(game, { answer: r => ({ k: gcd(r.a, r.b) }) });
})();
