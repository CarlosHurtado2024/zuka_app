// El collar de cuentas (Preuniversitario, pu-or-2; spec 2026-11-18-preuda-razonamiento-completo): cuentas de colores en un
// collar cerrado. Como en la mesa redonda, girar el collar no cambia nada: la primera cuenta ya está puesta arriba. Pistas:
// «la roja está junto a la azul», «la verde no toca a la amarilla», «la blanca está justo después de la negra» (sentido del
// reloj), «frente a». Se arrastran las cuentas a los huecos del hilo hasta cumplir todas.
// params = { rounds: [{ names, clues }] }   (names: colores; names[0] fija)   state = { rounds: [{ arr }] }
GAMES['collar-cuentas'] = ORD.slotGame({
  circ: true,
  fixFirst: true,
  aspect: 1.6,
  prompt: r => `Ensarta las ${r.names.length} cuentas en el collar`,
  slots: G => { const n = G.r.names.length, cx = G.W / 2, cy = 185, R = 74, w = 54; return G.r.names.map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return { x: cx + R * Math.cos(a) - w / 2, y: cy + R * Math.sin(a) - 14, w, h: 28, lx: -100, ly: -100 }; }); },
  label: () => '',
  decor: G => { const { p, C } = G; p.noFill(); p.stroke(C.mute); p.strokeWeight(2); p.circle(G.W / 2, 185, 148); TK.label(p, C, 'sentido del reloj ↻', G.W / 2, 185, C.mute, 9, 110); },
  clues: G => ({ x: 16, y: 284, w: G.W - 32 }),
  color: C => C.coral,
});
