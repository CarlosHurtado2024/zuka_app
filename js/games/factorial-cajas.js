// Las filas posibles (Álgebra, alg-15; spec 2026-11-18-algebra-revision): el factorial cuenta de cuántas maneras se pone
// en fila un grupo. Hay n casillas; para la primera hay n opciones, para la segunda n − 1… Se arrastra cuántos objetos
// hay y se ven las opciones de cada casilla multiplicándose: n! = Π k. Hay que llegar al número de filas pedido.
// params = { rounds: [{ target }] }   state = { rounds: [{ n }] }   (de 1 a 7)
GAMES['factorial-cajas'] = (() => {
  const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
  const need = q => { for (let n = 1; n <= 7; n++) if (fact(n) === q.target) return n; return -1; };
  const ok = (s, q) => fact(s.n) === q.target;
  const game = roundsGame({
    aspect: 1,
    init: () => ({ n: 2 }),
    ok,
    solution: q => `${need(q)}! = ${q.target}`,
    prompt: q => `¿Cuántos objetos se ponen en fila de ${q.target} maneras?`,
    foot: () => 'Arrastra cuántos objetos hay',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r: q } = G, n = G.locked && !ok(G.s, q) ? need(q) : G.s.n, w = Math.min(44, (G.W - 30) / n - 6);
      for (let i = 0; i < n; i++) {
        const x = G.W / 2 - (n * (w + 6) - 6) / 2 + i * (w + 6);
        p.stroke(C.line); p.strokeWeight(1.4); p.noFill(); p.rect(x, 150, w, w, 8);
        TK.label(p, C, String(n - i), x + w / 2, 150 + w / 2, C.ink, 16, w);
        TK.label(p, C, `opciones`, x + w / 2, 150 + w + 12, C.mute, 8, w + 6);
        if (i) TK.label(p, C, '×', x - 3, 150 + w / 2, C.mute, 12, 10);
      }
      G.X = RK.track(p, C, 40, G.W - 40, G.tY, 7, n - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, `$${n}! = ${Array.from({ length: n }, (_, i) => n - i).join(' \\cdot ')} = ${fact(n)}$`, { col: G.locked || ok(G.s, q) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.n - 1), y: G.tY }, to: { x: G.X(G.s.n + 1), y: G.tY }, text: 'Arrastra cuántos objetos', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = RK.pick(x, 40, G.W - 40, 7) + 1; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { need, fact });
})();
