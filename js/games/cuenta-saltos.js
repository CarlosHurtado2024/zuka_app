// Saltos, no términos (Álgebra, progresiones; lecciones alg-14, alg-14b y alg-14c): la trampa de siempre es contar
// términos cuando hay que contar saltos. Del término 1 al término n hay n − 1 saltos (como los postes de una cerca).
// Se eligen los saltos con − y + y el juego dibuja los postes y hace la cuenta; los postes no llevan número hasta
// comprobar: contarlos es justo la idea.
//   mode 'value': hay que caer justo en el término pedido (su valor lo calcula el juego).
//   mode 'count': hay que llegar al último número de la lista y decir además cuántos términos son.
// kind 'arit' suma `step` en cada salto; 'geo' multiplica por `step`.
// params = { rounds: [{ kind, mode, a1, step, n? (value), last? (count) }] }   state = { rounds: [{ j, t }] }
// Spec 2026-11-15-escalera-de-sigma.

GAMES['cuenta-saltos'] = (() => {
  const at = (r, j) => (r.kind === 'geo' ? r.a1 * r.step ** j : r.a1 + j * r.step);
  // Saltos que hacen falta: n − 1 para el término n; en 'count', los que llevan del primero al último.
  function jumpsOf(r) {
    if (r.mode === 'value') return r.n - 1;
    for (let j = 0; j <= 40; j++) if (Math.abs(at(r, j) - r.last) < 1e-9) return j;
    return -1;
  }
  const opTxt = r => (r.kind === 'geo' ? `× ${numTxt(r.step)}` : r.step < 0 ? `− ${-r.step}` : `+ ${r.step}`);
  const listTxt = r => `${[0, 1, 2].map(j => numTxt(at(r, j))).join(', ')}, …`;

  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ j: 0, t: 1 }),
    ok: (s, r) => s.j === jumpsOf(r) && (r.mode === 'value' || s.t === s.j + 1),
    solution: r => { const j = jumpsOf(r); return r.mode === 'value' ? `término ${r.n}: ${j} saltos desde ${numTxt(r.a1)} → ${numTxt(at(r, j))}` : `de ${numTxt(r.a1)} a ${numTxt(r.last)} hay ${j} saltos y ${j + 1} términos`; },
    prompt: r => (r.mode === 'value' ? `${listTxt(r)} Da los saltos justos para caer en el término ${r.n}` : `${listTxt(r)} hasta ${numTxt(r.last)}: ¿cuántos saltos y cuántos términos?`),
    foot: r => (r.mode === 'value' ? 'Cuenta los postes: el primero ya está puesto' : 'Entre dos postes hay un salto: cuenta los postes'),
    layout(G) { const w = (G.W - 36) / 2; G.box = [{ x: G.r.mode === 'count' ? 12 : G.W / 2 - w / 2, y: G.H - 66, w, h: 32 }, { x: 24 + w, y: G.H - 66, w, h: 32 }]; },
    enter(G) { const w = (G.W - 36) / 2; G.box[0].x = G.r.mode === 'count' ? 12 : G.W / 2 - w / 2; },
    draw(G) {
      const { p, C, W, H, s, r } = G, n = s.j + 1, show = n, y = 168, x0 = 26, x1 = W - 26;
      const X = i => (show === 1 ? W / 2 : x0 + (i / (show - 1)) * (x1 - x0)), few = show <= 7;
      // Los postes (términos) y los saltos entre ellos.
      p.stroke(C.line); p.strokeWeight(3); p.line(x0 - 8, y + 14, x1 + 8, y + 14);
      for (let i = 0; i < show; i++) {
        if (i > 0) { p.noFill(); p.stroke(C.sky); p.strokeWeight(2); p.arc((X(i - 1) + X(i)) / 2, y - 12, X(i) - X(i - 1), Math.min(40, (X(i) - X(i - 1)) * 0.9), Math.PI, 0); if (few) { p.noStroke(); p.fill(C.sky); p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.CENTER, p.CENTER); p.text(opTxt(r), (X(i - 1) + X(i)) / 2, y - 12 - Math.min(40, (X(i) - X(i - 1)) * 0.9) / 2 - 8); } }
        const last = i === show - 1;
        p.stroke(last ? C.sun : C.ink); p.strokeWeight(4); p.line(X(i), y - 12, X(i), y + 14);
        p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        if (G.locked) { p.fill(last ? C.N : C.mute); p.textSize(few ? 11 : 9); p.text(i + 1, X(i), y + 26); }
        if (few || last || i === 0) { p.fill(last ? C.ink : C.mute); p.textSize(few ? 12 : 10); p.text(numTxt(at(r, i)), X(i), y + 42); }
      }
      p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(16); p.textAlign(p.CENTER, p.CENTER);
      const v = at(r, s.j);
      const word = r.kind === 'geo' ? (s.j === 1 ? 'multiplicación' : 'multiplicaciones') : s.j === 1 ? 'salto' : 'saltos';
      fitText(p, `${s.j} ${word}: llegas a ${numTxt(v)}${G.locked ? `, el término ${n}` : ''}`, W / 2, y + 86, W - 20, 16);
      drawStepper(p, C, G.box[0], s.j, r.kind === 'geo' ? 'multiplicaciones' : 'saltos');
      if (r.mode === 'count') drawStepper(p, C, G.box[1], s.t, 'términos de la lista');
    },
    press(G, x, y) {
      const a = stepHit(G.box[0], x, y), b = G.r.mode === 'count' ? stepHit(G.box[1], x, y) : 0;
      if (!a && !b) return false;
      G.s.j = Math.max(0, Math.min(14, G.s.j + a)); G.s.t = Math.max(1, Math.min(16, G.s.t + b)); G.touch();
      return true;
    },
    peek: G => ({ box: G.box, want: jumpsOf(G.r), mode: G.r.mode }),
  });
  return { ...game, at, jumpsOf };
})();
