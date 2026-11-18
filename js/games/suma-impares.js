// La suma de los impares (Álgebra, alg-14b; spec 2026-11-18-algebra-revision): 1 + 3 + 5 + … + (2n − 1) = n²: cada impar es
// una escuadra que agranda el cuadrado en una fila y una columna. Se arrastra cuántas escuadras se ponen; el cuadrado
// crece y se lee la suma. Hay que llegar a la suma pedida.
// params = { rounds: [{ S }] }   state = { rounds: [{ n }] }   (n de 1 a 10)
GAMES['suma-impares'] = (() => {
  const ok = (s, r) => s.n * s.n === r.S;
  const answer = r => ({ n: Math.round(Math.sqrt(r.S)) });
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ n: 1 }),
    ok,
    solution: r => `${answer(r).n} impares: ${answer(r).n}² = ${r.S}`,
    prompt: r => `¿Cuántos impares seguidos, desde el 1, suman ${r.S}?`,
    foot: () => 'Arrastra cuántas escuadras de impares pones',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, n = s.n, c = Math.min(22, (G.tY - 140) / 10), ox = G.W / 2 - 5 * c, oy = 104;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const k = Math.max(i, j); p.stroke(C.bg); p.strokeWeight(1.2); p.fill(ok(s, r) ? C.ok : k % 2 ? C.coral : C.sky); p.rect(ox + i * c, oy + j * c, c, c, 2); }
      const terms = Array.from({ length: n }, (_, k) => 2 * k + 1);
      TK.label(p, C, n <= 6 ? `${terms.join(' + ')} = ${n * n}` : `1 + 3 + … + ${2 * n - 1} = ${n * n}`, G.W / 2, oy + 10 * c + 14, C.ink, 12, G.W - 30);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 10, n - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, `$${n}^2 = ${n * n}\\ ${ok(s, r) ? '=' : '\\ne'}\\ ${r.S}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X(2), y: G.tY }, text: 'Arrastra cuántas escuadras', ty: G.tY + 24 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 10) + 1; if (v !== G.s.n || !G.touched[G.cur]) { G.s.n = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
