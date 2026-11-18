// La mesa redonda (Preuniversitario, pu-or-2; spec 2026-11-18-preuda-razonamiento-completo): girar a todos no cambia nada,
// así que la primera persona ya está sentada y las demás se ubican respecto a ella. Pistas: «frente a», «junto a», «justo a la
// derecha de» (en el sentido del reloj). Se arrastran los nombres a las sillas hasta cumplir todas las pistas.
// params = { rounds: [{ names, clues }] }   (names[0] va fija en la silla de arriba)   state = { rounds: [{ arr }] }
GAMES['mesa-redonda'] = (() => {
  const g = ORD.slotGame({
    circ: true,
    fixFirst: true,
    aspect: 1.6,
    prompt: r => `Sienta a las ${r.names.length} personas alrededor de la mesa`,
    slots: G => { const n = G.r.names.length, cx = G.W / 2, cy = 190, R = 80, w = 58; return G.r.names.map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return { x: cx + R * Math.cos(a) - w / 2, y: cy + R * Math.sin(a) - 15, w, h: 30, lx: -100, ly: -100 }; }); },
    label: () => '',
    decor: G => { const { p, C } = G; p.stroke(C.line); p.strokeWeight(1.4); p.fill(RK.al(p, C.card, 200)); p.circle(G.W / 2, 190, 110); TK.label(p, C, 'mesa', G.W / 2, 190, C.mute, 10, 60); },
    clues: G => ({ x: 16, y: 292, w: G.W - 32 }),
    color: C => C.sky,
  });
  return g;
})();
