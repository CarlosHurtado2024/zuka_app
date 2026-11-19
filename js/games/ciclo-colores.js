// El collar que se repite (Preuniversitario, pu-se-3; spec 2026-11-18-preuda-razonamiento-completo): un collar repite siempre
// el mismo grupo de cuentas de colores. Se ven las primeras con su número; se arrastra desde la bandeja la cuenta del color que
// va en la posición pedida y se suelta en su hueco.
// params = { rounds: [{ cyc: ['coral', 'sky', …] (colores distintos de la paleta), N }] }   state = { rounds: [{ c }] }   (c: índice en cyc o −1)
GAMES['ciclo-colores'] = (() => {
  const need = r => (r.N - 1) % r.cyc.length;
  const ok = (s, r) => s.c === need(r);
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ c: -1 }),
    answered: s => s.c >= 0,
    ok,
    solution: r => `${r.N} deja residuo ${r.N % r.cyc.length} al dividir entre ${r.cyc.length}: la cuenta ${need(r) + 1} del grupo`,
    prompt: r => `¿De qué color es la cuenta número ${r.N}?`,
    foot: () => 'Arrastra una cuenta de la bandeja al hueco',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; G.slot = { x: G.W / 2, y: 236 }; G.trayY = Math.max(G.H - 112, 300); },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { c: need(r) } : G.s, good = ok(s, r), k = r.cyc.length, shown = Math.min(2 * k + 1, 9), w = (G.W - 40) / shown;
      p.stroke(C.line); p.strokeWeight(1.5); p.noFill(); p.line(20, 128, G.W - 20, 128);
      for (let i = 0; i < shown; i++) { const x = 20 + (i + 0.5) * w; p.stroke(C.ink); p.strokeWeight(1); p.fill(C[r.cyc[i % k]]); p.circle(x, 128, Math.min(w * 0.7, 28)); TK.label(p, C, String(i + 1), x, 156, C.mute, 10, w); }
      TK.label(p, C, '…', G.W / 2, 190, C.mute, 16, 40);
      const sl = G.slot; p.stroke(good ? C.ok : C.brand); p.strokeWeight(2); p.fill(s.c >= 0 && G.grab < 0 ? C[r.cyc[s.c]] : RK.al(p, C.card, 120)); p.circle(sl.x, sl.y, 40);
      TK.label(p, C, `cuenta ${r.N}`, sl.x, sl.y + 34, C.ink, 12, 120);
      const tw = (G.W - 40) / k; G.tray = r.cyc.map((col, i) => ({ x: 20 + (i + 0.5) * tw, y: G.trayY, col }));
      G.tray.forEach((t, i) => { p.stroke(C.ink); p.strokeWeight(1); p.fill(C[t.col]); p.circle(t.x, t.y, 32); });
      if (G.grab >= 0) { p.stroke(C.ink); p.fill(C[r.cyc[G.grab]]); p.circle(G.gx, G.gy, 36); }
      RK.strip(p, C, G.fb, !good ? `$\\text{grupos de}\\ ${k}\\ \\text{cuentas}$` : `$${r.N} = ${k}\\cdot ${Math.floor((r.N - 1) / k)} + ${(r.N - 1) % k + 1}$`, { kicker: good ? `es la cuenta ${(r.N - 1) % k + 1} de su grupo` : '', col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { const i = (G.tray || []).findIndex(t => Math.hypot(x - t.x, y - t.y) < 24); if (i < 0) return false; G.grab = i; G.gx = x; G.gy = y; return true; },
    drag(G, x, y) { if (G.grab < 0) return false; G.gx = x; G.gy = y; return true; },
    release(G) { if (G.grab < 0) return; if (Math.hypot(G.gx - G.slot.x, G.gy - G.slot.y) < 40) { G.s.c = G.grab; G.touch(); } G.grab = -1; },
    demo: G => ({ from: G.tray ? G.tray[0] : { x: 40, y: G.trayY }, to: G.slot, text: 'Arrastra al hueco', ty: G.slot.y - 34 }),
    peek: G => ({ tray: G.tray, slot: G.slot }),
  });
  return Object.assign(game, { answer: r => ({ c: need(r) }) });
})();
