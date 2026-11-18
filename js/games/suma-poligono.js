// Parte el polígono (Preuniversitario UdeA, pu-ge-1; spec 2026-11-18-preuda-geometria): por qué los ángulos de un
// polígono de n lados suman (n − 2)·180°. Desde el vértice marcado se arrastran diagonales hasta los demás vértices:
// el polígono queda partido en triángulos, cada uno vale 180° y el juego lleva la cuenta. Hay que trazarlas todas.
// params = { rounds: [{ n }] }   state = { rounds: [{ d: [vértices unidos con el 0] }] }
GAMES['suma-poligono'] = (() => {
  const NOM = { 4: 'cuadrilátero', 5: 'pentágono', 6: 'hexágono', 7: 'heptágono', 8: 'octágono' };
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ d: [] }),
    ok: (s, r) => s.d.length === r.n - 3,
    answered: s => s.d.length > 0,
    solution: r => `${r.n - 2} triángulos: ${r.n - 2} · 180° = ${(r.n - 2) * 180}°`,
    prompt: r => `Parte el ${NOM[r.n]} en triángulos con diagonales desde el punto`,
    foot: (r, s) => (s.d.length === r.n - 3 ? `Regular: cada ángulo mide ${(r.n - 2) * 180}° ÷ ${r.n} ${Number.isInteger((r.n - 2) * 180 / r.n) ? '=' : '≈'} ${Math.round((r.n - 2) * 1800 / r.n) / 10}°` : 'Arrastra desde el punto hasta otro vértice'),
    layout(G) { G.cx = G.W / 2; G.cy = (128 + G.H - 34) / 2 + 6; G.R = Math.min(G.W * 0.38, (G.H - 190) / 2); },
    enter(G) { G.line = null; },
    draw(G) {
      const { p, C, r, s, cx, cy, R } = G, V = Array.from({ length: r.n }, (_, i) => GEO.at(cx, cy, R, 90 - i * 360 / r.n)), tri = s.d.length + 1, done = s.d.length === r.n - 3;
      G.V = V;
      // Solo se cuentan triángulos cuando todas las piezas lo son: antes, alguna pieza todavía tiene más de tres lados.
      TK.label(p, C, done ? `${tri} triángulos: ${tri} · 180° = ${tri * 180}°` : `${tri} ${tri === 1 ? 'pieza' : 'piezas'}: aún no son todas triángulos`, G.W / 2, 108, G.locked ? (done ? C.ok : C.bad) : done ? C.ok : C.ink, 17, G.W - 24);
      // Los triángulos del abanico, cada uno de un tono, cuando ya están todas las diagonales de en medio.
      const cuts = [1, ...[...s.d].sort((a, b) => a - b), r.n - 1], cols = [C.sky, C.mint, C.coral, C.sun];
      for (let k = 0; k < cuts.length - 1; k++) {
        const full = cuts[k + 1] - cuts[k] === 1, c = p.color(cols[k % 4]); c.setAlpha(full ? 110 : 40);
        p.noStroke(); p.fill(c); p.beginShape(); p.vertex(V[0][0], V[0][1]); for (let i = cuts[k]; i <= cuts[k + 1]; i++) p.vertex(V[i][0], V[i][1]); p.endShape(p.CLOSE);
      }
      p.noFill(); p.stroke(C.ink); p.strokeWeight(3); p.beginShape(); V.forEach(v => p.vertex(v[0], v[1])); p.endShape(p.CLOSE);
      p.stroke(C.ink); p.strokeWeight(2); s.d.forEach(i => p.line(V[0][0], V[0][1], V[i][0], V[i][1]));
      if (G.line) { p.stroke(C.brand); p.strokeWeight(2.5); p.drawingContext.setLineDash([6, 5]); p.line(V[0][0], V[0][1], G.line.x, G.line.y); p.drawingContext.setLineDash([]); }
      V.forEach((v, i) => { if (i > 1 && i < r.n - 1 && !s.d.includes(i)) { p.noFill(); p.stroke(C.brand); p.strokeWeight(2); p.circle(v[0], v[1], 18); } else if (i) drawDot(p, C, v[0], v[1], 7, C.ink); });
      GEO.knob(p, C, V[0][0], V[0][1], C.brand);
    },
    press(G, x, y) { if (Math.hypot(x - G.V[0][0], y - G.V[0][1]) > 30) return false; G.line = { x, y }; return true; },
    drag(G, x, y) { if (!G.line) return false; G.line.x = x; G.line.y = y; return true; },
    release(G, x, y) {
      if (!G.line) return; G.line = null;
      const i = G.V.findIndex((v, k) => k > 1 && k < G.r.n - 1 && Math.hypot(x - v[0], y - v[1]) < 28);
      if (i > 0 && !G.s.d.includes(i)) { G.s.d.push(i); G.touch(); }
    },
    demo(G) { const i = [...Array(G.r.n).keys()].find(k => k > 1 && k < G.r.n - 1 && !G.s.d.includes(k)); return i ? { from: { x: G.V[0][0], y: G.V[0][1] }, to: { x: G.V[i][0], y: G.V[i][1] }, text: 'Arrastra del punto a otro vértice', ty: G.H - 44 } : null; },
    peek: G => ({ V: G.V }),
  });
  return game;
})();
