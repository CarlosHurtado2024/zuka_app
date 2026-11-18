// La fila con pistas (Preuniversitario, pu-or-1; spec 2026-11-18-preuda-razonamiento-completo): personas en fila, numeradas de
// izquierda a derecha, y pistas de orden. Se arrastran los nombres a los puestos; cada pista se marca ✓ cuando ya se cumple.
// Hay que acomodarlos a todos cumpliendo todas las pistas (la solución es única).
// params = { rounds: [{ names, clues: [{ t, a, b?, i?, k?, say }] }] }   state = { rounds: [{ arr }] }   (pistas: orden-kit.js)
GAMES['fila-pistas'] = ORD.slotGame({
  aspect: 1.3,
  prompt: r => `Acomoda a las ${r.names.length} personas en la fila`,
  slots: G => { const n = G.r.names.length, w = Math.min(64, (G.W - 30) / n - 6); return G.r.names.map((_, i) => ({ x: G.W / 2 - (n * (w + 6) - 6) / 2 + i * (w + 6), y: 116, w, h: 50 })); },
  label: i => `${i + 1}.º`,
  decor: G => { const { p, C } = G; p.stroke(C.line); p.strokeWeight(1); p.line(16, 172, G.W - 16, 172); TK.label(G.p, C, 'izquierda', 40, 182, C.mute, 9, 70); TK.label(G.p, C, 'derecha', G.W - 40, 182, C.mute, 9, 70); },
  clues: G => ({ x: 16, y: 200, w: G.W - 32 }),
});
