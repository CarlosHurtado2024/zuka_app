// Vistas de una construcción (Preuniversitario, pu-es-2; spec 2026-11-18-preuda-razonamiento-completo): la vista de frente
// muestra la torre más alta de cada columna y la de lado, la más alta de cada fila. Con esas dos vistas, ¿cuál es la
// construcción con más cubos? Cada casilla puede tener a lo sumo el menor de los dos límites. Se arrastra cada casilla de la
// vista desde arriba hacia arriba o abajo para fijar su altura; las vistas se dibujan en vivo.
// params = { rounds: [{ front: [máximo por columna], side: [máximo por fila] }] }   state = { rounds: [{ h: [[alturas]] }] }
GAMES['torres-vistas'] = (() => {
  const want = r => r.side.map(sv => r.front.map(fv => Math.min(sv, fv)));
  const views = h => ({ front: h[0].map((_, i) => Math.max(...h.map(row => row[i]))), side: h.map(row => Math.max(...row)) });
  const ok = (s, r) => s.h.flat().join() === want(r).flat().join();
  const lay = G => { const r = G.r, c = Math.min(46, (G.W - 120) / r.front.length); G.c = c; G.o = { x: 40, y: 150 }; };
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ h: r.side.map(() => r.front.map(() => 0)) }),
    ok,
    answered: s => s.h.flat().some(v => v > 0),
    solution: r => `${want(r).flat().reduce((a, b) => a + b, 0)} cubos: ${want(r).map(row => row.join(' ')).join(' / ')}`,
    prompt: () => 'Arma la construcción con más cubos que tenga estas dos vistas',
    foot: () => 'Arrastra cada casilla hacia arriba o abajo para cambiar su altura',
    layout(G) { lay(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = null; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { h: want(r) } : G.s, c = G.c, o = G.o, v = views(s.h), good = ok(s, r);
      TK.label(p, C, 'desde arriba', o.x + r.front.length * c / 2, o.y - 34, C.mute, 10, 120);
      s.h.forEach((row, j) => row.forEach((hv, i) => { p.stroke(C.ink); p.strokeWeight(1.2); p.fill(RK.al(p, good ? C.ok : C.sky, 40 + hv * 50)); p.rect(o.x + i * c, o.y + j * c, c, c); TK.label(p, C, String(hv), o.x + i * c + c / 2, o.y + j * c + c / 2, C.ink, 13, c); }));
      r.front.forEach((fv, i) => { const vv = v.front[i]; TK.label(p, C, `${fv}`, o.x + i * c + c / 2, o.y - 14, vv === fv ? C.ok : C.coral, 11, c); });
      TK.label(p, C, 'frente ↑', o.x - 22, o.y - 14, C.mute, 8, 40);
      r.side.forEach((sv, j) => { const vv = v.side[j]; TK.label(p, C, `${sv}`, o.x + r.front.length * c + 14, o.y + j * c + c / 2, vv === sv ? C.ok : C.coral, 11, 24); });
      TK.label(p, C, 'lado →', o.x + r.front.length * c + 40, o.y - 14, C.mute, 8, 50);
      const tot = s.h.flat().reduce((a, b) => a + b, 0);
      RK.strip(p, C, G.fb, `$\\text{${tot} cubos}$`, { kicker: 'Los números de afuera son las vistas pedidas', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const i = Math.floor((x - G.o.x) / G.c), j = Math.floor((y - G.o.y) / G.c); if (i < 0 || j < 0 || i >= G.r.front.length || j >= G.r.side.length) return false; G.grab = { i, j, y0: y, h0: G.s.h[j][i] }; return true; },
    drag(G, x, y) { const g = G.grab; if (!g) return false; const v = Math.max(0, Math.min(4, g.h0 + Math.round((g.y0 - y) / 24))); if (v !== G.s.h[g.j][g.i] || !G.touched[G.cur]) { G.s.h[g.j][g.i] = v; G.touch(); } return true; },
    release(G) { G.grab = null; },
    demo: G => ({ from: { x: G.o.x + G.c / 2, y: G.o.y + G.c / 2 }, to: { x: G.o.x + G.c / 2, y: G.o.y + G.c / 2 - 48 }, text: 'Arrastra hacia arriba', ty: G.o.y + G.r.side.length * G.c + 24 }),
    peek: G => ({ o: G.o, c: G.c }),
  });
  return Object.assign(game, { answer: r => ({ h: want(r) }) });
})();
