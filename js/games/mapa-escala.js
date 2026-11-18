// El mapa a escala (Álgebra, alg-12f; spec 2026-11-18-algebra-revision): regla de tres con una escala. En el mapa, la
// barra de escala dice cuántos km vale 1 cm. Se arrastra el segundo pueblo sobre la regla del mapa (de medio en medio
// centímetro) hasta que la distancia en el mapa represente la distancia real pedida.
// params = { rounds: [{ cm, km, real }] }   (escala: cm centímetros = km kilómetros)   state = { rounds: [{ d }] }   (cm en el mapa)
GAMES['mapa-escala'] = (() => {
  const need = r => (r.real * r.cm) / r.km;
  const ok = (s, r) => Math.abs(s.d - need(r)) < 1e-9;
  const MAX = 10;
  const game = roundsGame({
    aspect: 1,
    init: () => ({ d: 1 }),
    ok,
    solution: r => `${need(r)} cm en el mapa`,
    prompt: r => `Escala: ${r.cm} cm son ${r.km} km. Ubica un pueblo a ${r.real} km`,
    foot: () => 'Arrastra el segundo pueblo sobre la regla del mapa',
    layout(G) { G.map = { x: 12, y: 96, w: G.W - 24, h: G.H * 0.5 }; G.ry = G.map.y + G.map.h * 0.62; G.x0 = G.map.x + 18; G.u = (G.map.w - 36) / MAX; G.fb = { x: 12, y: G.H - 84, w: G.W - 24, h: 52 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r, map } = G, d = G.locked && !ok(G.s, r) ? need(r) : G.s.d;
      p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.mint, 30)); p.rect(map.x, map.y, map.w, map.h, 12);
      p.noFill(); p.stroke(RK.al(p, C.mint, 120)); p.strokeWeight(1.2); p.beginShape(); for (let i = 0; i <= 8; i++) p.vertex(map.x + i * map.w / 8, map.y + 30 + Math.sin(i * 1.3) * 12); p.endShape();
      // Regla del mapa en centímetros.
      for (let i = 0; i <= MAX * 2; i++) { const x = G.x0 + i * G.u / 2; p.stroke(C.ink); p.strokeWeight(i % 2 ? 1 : 1.6); p.line(x, G.ry, x, G.ry + (i % 2 ? 5 : 9)); if (i % 2 === 0) TK.label(p, C, String(i / 2), x, G.ry + 18, C.mute, 10, 20); }
      TK.label(p, C, 'cm', G.x0 + MAX * G.u + 4, G.ry + 32, C.mute, 10, 30);
      const bx = G.x0 + d * G.u;
      p.stroke(C.brand); p.strokeWeight(2.5); p.drawingContext.setLineDash([5, 4]); p.line(G.x0, G.ry - 22, bx, G.ry - 22); p.drawingContext.setLineDash([]);
      drawDot(p, C, G.x0, G.ry - 22, 14, C.ink); TK.label(p, C, 'A', G.x0, G.ry - 40, C.ink, 12, 20);
      RK.knob(p, C, bx, G.ry - 22, C.brand); TK.label(p, C, 'B', bx, G.ry - 44, C.brand, 12, 20); G.bx = bx;
      // Barra de escala.
      p.stroke(C.ink); p.strokeWeight(3); p.line(map.x + 18, map.y + map.h - 18, map.x + 18 + r.cm * G.u, map.y + map.h - 18);
      TK.label(p, C, `${r.cm} cm = ${r.km} km`, map.x + 18 + r.cm * G.u + 50, map.y + map.h - 18, C.ink, 11, 100);
      RK.strip(p, C, G.fb, `$\\tfrac{${r.cm}\\text{ cm}}{${r.km}\\text{ km}} = \\tfrac{${d}\\text{ cm}}{${r.real}\\text{ km}}\\;?$`, { kicker: `En el mapa: ${d} cm`, col: G.locked ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - (G.ry - 22)) > 40) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.bx, y: G.ry - 22 }, to: { x: G.bx + 3 * G.u, y: G.ry - 22 }, text: 'Arrastra el pueblo B', ty: G.ry + 50 }),
    peek: G => ({ x0: G.x0, u: G.u, ry: G.ry }),
  });
  game.move = (G, x) => { const d = Math.max(0.5, Math.min(MAX, Math.round(((x - G.x0) / G.u) * 2) / 2)); if (d !== G.s.d || !G.touched[G.cur]) { G.s.d = d; G.touch(); } };
  return Object.assign(game, { need });
})();
