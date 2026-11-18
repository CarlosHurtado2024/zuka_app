// Tijera de ángulos (Preuniversitario UdeA, pu-ge-1; spec 2026-11-18-preuda-geometria): dos rectas que se cruzan
// forman cuatro ángulos. Una recta está quieta; la otra se gira arrastrando su punta. El ángulo azul (el que se abre)
// muestra su medida en vivo; el ángulo por el que pregunta la ronda dice «?» hasta comprobar: hay que deducirlo.
//   'opp'  : el opuesto por el vértice debe medir `given`      → el azul mide lo mismo
//   'sup'  : el vecino (suplementario) debe medir `given`      → azul = 180 − given
//   'comp' : entre la recta y la vertical debe haber `given`   → azul = 90 − given (complementarios)
//   'ratio': el vecino debe ser `k` veces el azul              → azul = 180 / (k + 1)
// params = { rounds: [{ kind, given?, k? }] }   state = { rounds: [{ a }] }   (a de 5° en 5°, entre 5° y 175°)
GAMES['tijera-angulos'] = (() => {
  const want = r => (r.kind === 'opp' ? r.given : r.kind === 'sup' ? 180 - r.given : r.kind === 'comp' ? 90 - r.given : 180 / (r.k + 1));
  const PROMPT = {
    opp: r => `Abre la tijera: el ángulo opuesto al azul debe medir ${r.given}°`,
    sup: r => `Abre la tijera: el ángulo vecino del azul debe medir ${r.given}°`,
    comp: r => `El ángulo verde, hasta la vertical, debe medir ${r.given}°`,
    ratio: r => `El ángulo vecino debe ser ${r.k === 2 ? 'el doble' : r.k === 3 ? 'el triple' : `${r.k} veces`} del azul`,
  };
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ a: 100 }),
    ok: (s, r) => s.a === want(r),
    solution: r => `azul = ${want(r)}°`,
    prompt: r => PROMPT[r.kind](r),
    foot: r => (r.kind === 'opp' ? 'Los opuestos por el vértice son iguales' : r.kind === 'comp' ? 'Complementarios: suman 90°' : 'Los vecinos son suplementarios: suman 180°'),
    layout(G) { G.ox = G.W / 2; G.oy = (112 + G.H - 30) / 2 + 8; G.R = Math.min(G.W * 0.4, (G.H - 170) / 2); },
    enter(G) { G.dragging = false; },
    draw(G) {
      const { p, C, r, s, ox, oy, R } = G, a = s.a, show = G.locked, q = v => (show ? `${v}°` : '?');
      // Los cuatro ángulos: azul y su opuesto, el vecino y su opuesto.
      GEO.wedge(p, C, ox, oy, 46, 0, a, C.sky, `${a}°`);
      if (r.kind === 'comp') {
        p.stroke(C.mute); p.strokeWeight(2); p.drawingContext.setLineDash([5, 5]); p.line(ox, oy, ox, oy - R); p.drawingContext.setLineDash([]);
        if (a < 90) GEO.wedge(p, C, ox, oy, 62, a, 90, C.mint, q(90 - a), 78);
        p.noFill(); p.stroke(C.mute); p.strokeWeight(1.5); p.rect(ox, oy - 12, 12, 12);
      } else {
        GEO.wedge(p, C, ox, oy, 38, a, 180, C.coral, r.kind === 'opp' ? null : q(180 - a));
        GEO.wedge(p, C, ox, oy, 46, 180, 180 + a, C.sky, r.kind === 'opp' ? q(a) : null);
        GEO.wedge(p, C, ox, oy, 38, 180 + a, 360, C.coral, null);
      }
      GEO.line(p, ox, oy, R, 0, C.ink);
      GEO.line(p, ox, oy, R, a, G.locked ? (a === want(r) ? C.ok : C.bad) : C.ink);
      drawDot(p, C, ox, oy, 9, C.ink);
      const [kx, ky] = GEO.at(ox, oy, R, a); G.kx = kx; G.ky = ky;
      GEO.knob(p, C, kx, ky, C.sky);
    },
    press(G, x, y) { if (Math.hypot(x - G.ox, y - G.oy) < 24 || y < 96 || y > G.H - 26) return false; G.dragging = true; game.turn(G, x, y); return true; },
    drag(G, x, y) { if (!G.dragging) return false; game.turn(G, x, y); return true; },
    release(G) { G.dragging = false; },
    demo: G => ({ from: { x: G.kx, y: G.ky }, to: (([x, y]) => ({ x, y }))(GEO.at(G.ox, G.oy, G.R, G.s.a > 90 ? 50 : 130)), text: 'Arrastra la punta para girar la recta', ty: G.H - 44 }),
    peek: G => ({ o: [G.ox, G.oy], R: G.R, want: want(G.r) }),
  });
  // El dedo fija la dirección de la recta (una recta no tiene «lado»: 200° es lo mismo que 20°).
  game.turn = (G, x, y) => { let a = GEO.snap(GEO.angOf(G.ox, G.oy, x, y) % 180, 5); a = Math.max(5, Math.min(175, a)); if (a !== G.s.a || !G.touched[G.cur]) { G.s.a = a; G.touch(); } };
  return Object.assign(game, { want });
})();
