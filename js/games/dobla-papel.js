// Doblar y perforar (Preuniversitario, pu-es-4; spec 2026-11-18-preuda-razonamiento-completo): cada doblez duplica las capas
// del papel, así que un agujero hecho con el papel doblado n veces atraviesa 2ⁿ capas y al abrir hay 2ⁿ agujeros (por cada
// agujero que se hizo). Se ve el papel doblado; se arrastra cuántos agujeros habrá al desdoblarlo y el juego lo abre.
// params = { rounds: [{ folds, holes }] }   state = { rounds: [{ n }] }   (de 1 a 32)
GAMES['dobla-papel'] = (() => {
  const total = r => 2 ** r.folds * r.holes;
  const ok = (s, r) => s.n === total(r);
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ n: 1 }),
    ok,
    solution: r => `${total(r)} agujeros`,
    prompt: r => `Se dobla una hoja por la mitad ${r.folds} ${r.folds === 1 ? 'vez' : 'veces'} y se hace${r.holes > 1 ? 'n' : ''} ${r.holes} agujero${r.holes > 1 ? 's' : ''}. ¿Cuántos hay al abrirla?`,
    foot: () => 'Arrastra cuántos agujeros quedan al abrir la hoja',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { n: total(r) } : G.s, good = ok(s, r), x0 = 30, y0 = 110;
      // Capas del papel doblado, una sobre otra.
      const L = 2 ** r.folds, W = 90, H = 70;
      for (let i = Math.min(L, 8) - 1; i >= 0; i--) { p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.card, 220 - i * 18)); p.rect(x0 + i * 3, y0 + i * 3, W, H, 3); }
      for (let h = 0; h < r.holes; h++) { p.noStroke(); p.fill(C.ink); p.circle(x0 + 30 + h * 22, y0 + 34, 9); }
      TK.label(p, C, `${L} capas`, x0 + W / 2, y0 + H + 30, C.mute, 10, 90);
      if (G.locked || good) {        // la hoja abierta: la cuadrícula de capas, con un agujero por capa y por perforación
        const cols = 2 ** Math.ceil(r.folds / 2), rows = 2 ** Math.floor(r.folds / 2), cw = Math.min(28, (G.W - 170) / cols), ch = Math.min(28, 120 / rows), ox = G.W - 30 - cols * cw;
        for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { p.stroke(C.line); p.fill(RK.al(p, C.card, 200)); p.rect(ox + i * cw, y0 + j * ch, cw, ch); for (let h = 0; h < r.holes; h++) { p.noStroke(); p.fill(C.ok); p.circle(ox + i * cw + (h + 1) * cw / (r.holes + 1), y0 + j * ch + ch / 2, 5); } }
        TK.label(p, C, 'abierta', ox + cols * cw / 2, y0 + rows * ch + 14, C.mute, 10, 80);
      }
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 32, s.n - 1, i => ((i + 1) % 4 === 0 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$\\text{${s.n} agujeros}$`, { kicker: 'Cada doblez duplica las capas', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X(2), y: G.tY }, text: 'Arrastra los agujeros', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 32) + 1; if (v !== G.s.n || !G.touched[G.cur]) { G.s.n = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ n: total(r) }) });
})();
