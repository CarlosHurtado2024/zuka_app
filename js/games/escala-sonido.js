// Los decibeles (Álgebra, alg-72; spec 2026-11-18-algebra-revision): el nivel de un sonido es 10·log(I/I₀) decibeles: un
// logaritmo que convierte intensidades de 1 a un billón de veces la mínima audible en números de 0 a 120. Cada 10 dB más
// es diez veces más intensidad. Se arrastra el sonido por la escala hasta su nivel.
// params = { rounds: [{ tex, db }] }   (tex: intensidad relativa I/I₀)   state = { rounds: [{ v }] }   (de 0 a 140, de 10 en 10)
GAMES['escala-sonido'] = (() => {
  const N = 15;
  const ok = (s, r) => s.v === r.db;
  const game = roundsGame({
    aspect: 1,
    init: r => ({ v: r.db === 70 ? 60 : 70 }),
    ok,
    solution: r => `${r.db} dB`,
    prompt: r => `Un sonido de intensidad $${r.tex}$ veces la mínima: ¿cuántos decibeles?`,
    foot: () => 'Arrastra el sonido por la escala',
    layout(G) { G.tY = G.H * 0.5; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, v = G.locked && !ok(G.s, r) ? r.db : G.s.v, x0 = 24, w = (G.W - 48) / N;
      for (let k = 0; k < N; k++) { p.noStroke(); p.fill(RK.al(p, k < 9 ? C.sky : C.coral, 50 + k * 13)); p.rect(x0 + k * w, G.tY, w - 2, 28, 3); if (k % 2 === 0) TK.label(p, C, String(k * 10), x0 + (k + 0.5) * w, G.tY + 40, C.mute, 9, w * 2); }
      TK.label(p, C, 'susurro', x0 + 2 * w, G.tY - 14, C.mute, 10, 70); TK.label(p, C, 'dolor', x0 + 13 * w, G.tY - 14, C.coral, 10, 60);
      const cx = x0 + (v / 10 + 0.5) * w; G.cx = cx;
      p.noFill(); p.stroke(ok({ v }, r) ? C.ok : C.brand); p.strokeWeight(2.4); [6, 11, 16].forEach(d => p.arc(cx, G.tY - 40, d * 2, d * 2, -0.9, 0.9)); p.noStroke(); p.fill(ok({ v }, r) ? C.ok : C.brand); p.circle(cx - 6, G.tY - 40, 10);
      RK.strip(p, C, G.fb, ok({ v }, r) ? `$${v}\\ \\text{dB} = 10 \\cdot \\log ${r.tex}$` : `$${v}\\ \\text{dB}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (y < G.tY - 64 || y > G.tY + 50) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.cx, y: G.tY - 40 }, to: { x: G.cx - ((G.W - 48) / N) * 3, y: G.tY - 40 }, text: 'Arrastra el sonido', ty: G.tY + 70 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = Math.max(0, Math.min(N - 1, Math.floor((x - 24) / ((G.W - 48) / N)))) * 10; if (v !== G.s.v || !G.touched[G.cur]) { G.s.v = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ v: r.db }) });
})();
