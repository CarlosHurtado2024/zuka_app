// El edificio (Preuniversitario, pu-or-1; spec 2026-11-18-preuda-razonamiento-completo): cada persona vive en un piso; «más
// arriba», «justo encima», «no vive en el último». Se arrastran los nombres a los pisos del edificio (el 1 abajo) hasta
// cumplir todas las pistas. Las pistas usan el mismo orden que la fila: la casilla 0 es el primer piso.
// params = { rounds: [{ names, clues }] }   state = { rounds: [{ arr }] }   (pistas: orden-kit.js; before = más abajo)
GAMES['edificio-pisos'] = ORD.slotGame({
  aspect: 1.7,
  prompt: r => `¿En qué piso vive cada uno? (${r.names.length} pisos)`,
  slots: G => { const n = G.r.names.length, h = Math.min(40, 170 / n), w = 110, x = 28; return G.r.names.map((_, i) => ({ x: x + 22, y: 104 + (n - 1 - i) * (h + 4), w, h, lx: x + 8, ly: 104 + (n - 1 - i) * (h + 4) + h / 2 })); },
  label: i => `${i + 1}`,
  decor: G => { const { p, C, r } = G, n = r.names.length, h = Math.min(40, 170 / n); p.stroke(C.ink); p.strokeWeight(1.6); p.noFill(); p.rect(44, 98, 122, n * (h + 4) + 6, 4); p.triangle(40, 98, 170, 98, 105, 80); },
  clues: G => ({ x: 16, y: 112 + G.r.names.length * (Math.min(40, 170 / G.r.names.length) + 4) + 10, w: G.W - 32 }),
  color: C => C.coral,
});
