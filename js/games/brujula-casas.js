// Las casas alrededor de la plaza (Preuniversitario, pu-or-2; spec 2026-11-18-preuda-razonamiento-completo): las casas están
// en los puntos de una brújula alrededor de la plaza. Aquí las posiciones sí importan (el norte es el norte): «la de Ana está
// al norte», «la de Beto está frente a la de Ana», «la de Ciro está justo a la derecha de la de Dora, mirando la plaza desde
// arriba en el sentido del reloj». Se arrastran los nombres a las casas.
// params = { rounds: [{ names, clues }] }   (4 u 8 casas; la casilla 0 es el norte y siguen en el sentido del reloj)
GAMES['brujula-casas'] = (() => {
  const P4 = ['N', 'E', 'S', 'O'], P8 = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return ORD.slotGame({
    circ: true,
    aspect: 1.6,
    prompt: () => '¿En qué casa vive cada uno?',
    slots: G => { const n = G.r.names.length, cx = G.W / 2, cy = 188, R = 84, w = 56; return G.r.names.map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return { x: cx + R * Math.cos(a) - w / 2, y: cy + R * Math.sin(a) - 14, w, h: 28, lx: cx + (R - 34) * Math.cos(a), ly: cy + (R - 34) * Math.sin(a) }; }); },
    label: (i, r) => (r.names.length === 8 ? P8 : P4)[i],
    decor: G => { const { p, C } = G; p.noStroke(); p.fill(RK.al(p, C.mint, 70)); p.circle(G.W / 2, 188, 90); TK.label(p, C, 'plaza', G.W / 2, 188, C.mute, 10, 60); },
    clues: G => ({ x: 16, y: 292, w: G.W - 32 }),
    color: C => C.mint,
  });
})();
