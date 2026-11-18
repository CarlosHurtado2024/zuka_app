// ¿De qué número es? (Álgebra, alg-13; spec 2026-11-18-algebra-revision): si una parte es el p % de un total, el total
// es la parte ÷ p · 100. La barra es el total, con una regla de 0 % a 100 %; se arrastra el largo del total y la marca del
// p % se mueve con él. Hay que lograr que esa marca caiga justo en la parte conocida.
// params = { rounds: [{ part, p, step, max }] }   state = { rounds: [{ w }] }   (w múltiplo de step)
GAMES['estira-todo'] = (() => {
  const ok = (s, r) => Math.abs(s.w * r.p / 100 - r.part) < 1e-9;
  const answer = r => ({ w: r.part * 100 / r.p });
  const game = roundsGame({
    aspect: 1,
    init: r => ({ w: answer(r).w === r.step * 10 ? r.step * 12 : r.step * 10 }),
    ok,
    solution: r => `${r.part} es el ${r.p} % de ${answer(r).w}`,
    prompt: r => `${r.part} es el ${r.p} % de un número. ¿De cuál?`,
    foot: () => 'Arrastra el final de la barra: es el total, el 100 %',
    layout(G) { G.y = 150; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, x0 = 24, u = (G.W - 60) / Math.max(r.max, r.part * 1.2), y = G.y, end = x0 + s.w * u, mk = x0 + s.w * r.p / 100 * u, pt = x0 + r.part * u;
      p.noStroke(); p.fill(RK.al(p, C.sky, 90)); p.rect(x0, y, s.w * u, 30, 4);
      p.fill(ok(s, r) ? C.ok : C.sky); p.rect(x0, y, Math.min(s.w, s.w * r.p / 100) * u, 30, 4);
      (s.w * u > 170 ? [0, 25, 50, 75, 100] : s.w * u > 80 ? [0, 50, 100] : [100]).forEach(q => { const x = x0 + s.w * q / 100 * u; p.stroke(C.ink); p.strokeWeight(1); p.line(x, y + 30, x, y + 38); TK.label(p, C, `${q} %`, x, y + 48, C.mute, 9, 34); });
      p.stroke(C.coral); p.strokeWeight(2); p.drawingContext.setLineDash([4, 3]); p.line(pt, y - 30, pt, y + 30); p.drawingContext.setLineDash([]);
      TK.label(p, C, `parte: ${r.part}`, pt, y - 40, C.coral, 11, 80);
      p.stroke(C.brand); p.strokeWeight(2); p.line(mk, y - 6, mk, y + 36);
      RK.knob(p, C, end, y + 15, C.brand); G.end = end;
      TK.label(p, C, `total: ${s.w}`, Math.min(G.W - 40, end), y + 74, C.ink, 12, 90);
      RK.strip(p, C, G.fb, `$${r.p}\\%\\ \\text{de}\\ ${s.w} = ${+(s.w * r.p / 100).toFixed(2)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.y - 15) > 50) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.end, y: G.y + 15 }, to: { x: G.end + 40, y: G.y + 15 }, text: 'Estira el total', ty: G.y + 96 }),
    peek: G => ({ y: G.y }),
  });
  game.move = (G, x) => { const r = G.r, u = (G.W - 60) / Math.max(r.max, r.part * 1.2), w = Math.max(r.step, Math.min(r.max, Math.round((x - 24) / u / r.step) * r.step)); if (w !== G.s.w || !G.touched[G.cur]) { G.s.w = w; G.touch(); } };
  return Object.assign(game, { answer });
})();
