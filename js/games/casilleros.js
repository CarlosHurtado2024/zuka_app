// Los casilleros (Preuniversitario, pu-or-3; spec 2026-11-18-preuda-razonamiento-completo): cada persona guarda una cosa
// distinta en su casillero. Pistas: «la mochila no es de Ana», «el balón está en el casillero de Beto». Se arrastran las
// cosas a los casilleros hasta cumplir todas las pistas (una cosa por casillero).
// params = { rounds: [{ people, names, clues }] }   (names: cosas; pistas at / notAt con i = índice de la persona)
// state = { rounds: [{ arr }] }
GAMES['casilleros'] = ORD.slotGame({
  aspect: 1.3,
  prompt: () => '¿Qué guarda cada uno en su casillero?',
  slots: G => { const n = G.r.people.length, w = Math.min(70, (G.W - 30) / n - 6); return G.r.people.map((_, i) => ({ x: G.W / 2 - (n * (w + 6) - 6) / 2 + i * (w + 6), y: 128, w, h: 50 })); },
  label: (i, r) => r.people[i],
  decor: G => { const { p, C, r } = G, n = r.people.length, w = Math.min(70, (G.W - 30) / n - 6); for (let i = 0; i < n; i++) { const x = G.W / 2 - (n * (w + 6) - 6) / 2 + i * (w + 6); p.stroke(C.line); p.strokeWeight(1.2); p.fill(RK.al(p, C.card, 200)); p.rect(x - 3, 106, w + 6, 82, 4); p.line(x + w - 8, 112, x + w - 8, 120); } },
  clues: G => ({ x: 16, y: 206, w: G.W - 32 }),
  color: C => C.coral,
});
