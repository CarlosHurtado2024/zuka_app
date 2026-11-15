// Empaca en filas (Álgebra, división de polinomios; juego dinámico de alg-23b; spec 2026-11-21-dinamicos-mundos-altos):
// dividir es empacar, como los caramelos en bolsas del video. Aquí se empaca un montón de bloques (un cuadrado x²,
// barras x y cuadritos) en filas de ancho x + a. Una fila de alto x gasta el cuadrado y a barras; una fila de alto 1
// gasta una barra y a cuadritos. Cuando ya no se puede armar otra fila completa, «Listo»: las filas dicen el cociente
// y lo que sobra es el residuo (siempre más pequeño que una fila). Pedir una fila sin tener las piezas quita una vida.
// params = { rounds: [{ title, items: [{ a, s, p }] }], lives? }   ((x² + s·x + p) ÷ (x + a), con s ≥ a y p ≥ a(s − a))
// state = { done: [n] }

GAMES['empaca-filas'] = (() => {
  const quot = it => it.s - it.a, rest = it => it.p - it.a * (it.s - it.a);
  return questGame({
    aspect: 1.35,
    init: it => ({ sq: 1, bars: it.s, units: it.p, big: 0, small: 0, end: false }),
    ok: (s, it) => !!s.end && s.sq === 0 && s.bars === 0 && s.small === quot(it) && s.units === rest(it),
    answer: it => ({ sq: 0, bars: 0, units: rest(it), big: 1, small: quot(it), end: true }),
    solution: it => `$(x^2 + ${it.s}x + ${it.p}) \\div (x + ${it.a})$: cociente $x + ${quot(it)}$, residuo ${rest(it)}`,
    prompt: it => `Empaca $x^2 + ${it.s}x + ${it.p}$ en filas de ancho $x + ${it.a}$`,
    foot: () => 'Una fila completa necesita todas sus piezas; lo que no alcance, sobra',
    layout(G) { const w = (G.W - 24 - 2 * 8) / 3, y = G.bottom - 44; G.btn = [0, 1, 2].map(i => ({ x: 12 + i * (w + 8), y, w, h: 38 })); G.area = { y: G.top + 4, h: y - G.top - 34 }; },
    draw(G) {
      const { p, C, W, s, item: it } = G, k = Math.min(13, G.area.h / (6 + Math.max(4, quot(it) + 1)), (W - 150) / (6 + it.a)), X = 6 * k, x0 = 16, y0 = G.area.y + 4;
      const cell = (x, y, w, h, col) => { p.noStroke(); p.fill(col); p.rect(x + 1, y + 1, w - 2, h - 2, 3); };
      // Las filas ya empacadas (a la izquierda).
      if (s.big) { cell(x0, y0, X, X, C.sky); for (let i = 0; i < it.a; i++) cell(x0 + X + i * k, y0, k, X, C.mint); }
      for (let j = 0; j < s.small; j++) { cell(x0, y0 + (s.big ? X : 0) + j * k, X, k, C.mint); for (let i = 0; i < it.a; i++) cell(x0 + X + i * k, y0 + (s.big ? X : 0) + j * k, k, k, C.sun); }
      p.noFill(); p.stroke(C.mute); p.strokeWeight(1.5); p.drawingContext.setLineDash([4, 4]); p.rect(x0, y0, X + it.a * k, Math.max(X, (s.big ? X : 0) + s.small * k), 4); p.drawingContext.setLineDash([]);
      p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, `ancho $x + ${it.a}$`, x0 + (X + it.a * k) / 2, y0 + Math.max(X, (s.big ? X : 0) + s.small * k) + 12, X + it.a * k + 30, 12);
      // Lo que queda sin empacar (a la derecha).
      const rx = W - 118, rows = [[`${s.sq}`, 'cuadrado x²', C.sky], [`${s.bars}`, 'barras x', C.mint], [`${s.units}`, 'cuadritos', C.sun]];
      p.fill(C.mute); p.textSize(11); p.textAlign(p.LEFT, p.CENTER); p.text('Quedan:', rx, y0 + 8);
      rows.forEach(([n, t, col], i) => { const y = y0 + 30 + i * 26; p.noStroke(); p.fill(col); p.rect(rx, y - 9, 18, 18, 4); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.LEFT, p.CENTER); p.text(`${n} ${t}`, rx + 24, y); });
      p.fill(G.solved ? C.ok : C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
      fitText(p, G.solved ? `Cociente $x + ${quot(it)}$ · residuo ${rest(it)}` : `Filas: ${s.big ? `una de alto $x$` : 'ninguna de alto x'} y ${s.small} de alto 1`, W / 2, G.btn[0].y - 16, W - 20, 13);
      drawBtn(p, C, G.btn[0], 'Fila de alto x', false, C.cream); drawBtn(p, C, G.btn[1], 'Fila de alto 1', false, C.cream); drawBtn(p, C, G.btn[2], 'Listo', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, it = G.item, i = G.btn.findIndex(b => hitBox(b, x, y));
      if (i < 0) return false;
      if (i === 0) { if (!s.sq) { G.bad('Ya no hay cuadrado para una fila de alto x'); return true; } if (s.bars < it.a) { G.bad('No alcanzan las barras para esa fila'); return true; } s.sq = 0; s.bars -= it.a; s.big = 1; }
      else if (i === 1) { if (s.sq) { G.bad('Empieza por lo más grande: la fila de alto x'); return true; } if (s.bars < 1) { G.bad('Ya no quedan barras: lo demás es el residuo'); return true; } if (s.units < it.a) { G.bad('No alcanzan los cuadritos para otra fila'); return true; } s.bars--; s.units -= it.a; s.small++; }
      else { if (s.sq || s.bars) { G.bad('Todavía se puede armar otra fila'); return true; } s.end = true; G.good(`Sobran ${s.units}: es el residuo`); return true; }
      G.api.sfx?.tap?.();
      return true;
    },
    peek: G => ({ solve: [...(G.s.sq ? [G.btn[0]] : []), ...Array(G.s.bars - (G.s.sq ? G.item.a : 0)).fill(G.btn[1]), G.btn[2]], wrong: G.s.sq || G.s.bars ? G.btn[2] : null }),
  });
})();
