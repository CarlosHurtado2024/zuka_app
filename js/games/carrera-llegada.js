// El orden de llegada (Preuniversitario, pu-or-1; spec 2026-11-18-preuda-razonamiento-completo): una carrera y pistas como
// «Ana llegó antes que Beto», «Ciro llegó justo después de Dani», «Eva no ganó ni fue última». Se arrastran los corredores
// a los puestos del podio y de la meta (1.º el que llegó primero) hasta cumplir todas las pistas.
// params = { rounds: [{ names, clues }] }   state = { rounds: [{ arr }] }   (pistas: orden-kit.js; before = llegó antes)
GAMES['carrera-llegada'] = ORD.slotGame({
  aspect: 1.35,
  prompt: () => '¿En qué orden llegaron a la meta?',
  slots: G => { const n = G.r.names.length, w = Math.min(62, (G.W - 30) / n - 6), hs = [56, 44, 34]; return G.r.names.map((_, i) => { const x = G.W / 2 - (n * (w + 6) - 6) / 2 + i * (w + 6), h = 32, base = 186 - (hs[i] || 24); return { x, y: base - h - 4, w, h }; }); },
  label: i => `${i + 1}.º`,
  decor: G => { const { p, C, r } = G, n = r.names.length, w = Math.min(62, (G.W - 30) / n - 6), hs = [56, 44, 34]; for (let i = 0; i < n; i++) { const x = G.W / 2 - (n * (w + 6) - 6) / 2 + i * (w + 6), h = hs[i] || 24; p.noStroke(); p.fill(RK.al(p, i === 0 ? C.sun : C.card, 200)); p.rect(x, 186 - h, w, h, 3); } p.stroke(C.ink); p.strokeWeight(1.4); p.line(16, 186, G.W - 16, 186); },
  clues: G => ({ x: 16, y: 206, w: G.W - 32 }),
  color: C => C.coral,
});
