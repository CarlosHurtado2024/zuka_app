// Los dos bancos (Álgebra, interés simple y compuesto; juego dinámico de alg-13b; spec
// 2026-11-21-dinamicos-mundos-altos): como Beto en el video, se quiere saber en qué año un ahorro llega a su meta
// (duplicarse, por ejemplo). Se dan el tipo de interés y la tasa, y cómo va el ahorro los tres primeros años. Se toca
// en el calendario el año en que se cree que llega y luego «Correr los años»: el juego hace crecer el ahorro año por
// año y se ve si la apuesta era el primer año en que alcanza la meta. Con interés simple cada año suma lo mismo; con
// compuesto, cada año multiplica.
// params = { rounds: [{ title, items: [{ kind: 'simple' | 'comp', rate (%), goal (factor, p. ej. 2) }] }], lives? }
// state = { done: [n] }

GAMES['dos-bancos'] = (() => {
  const amount = (it, n) => (it.kind === 'simple' ? 1 + (it.rate / 100) * n : (1 + it.rate / 100) ** n);
  const yearOf = it => { for (let n = 1; n <= 16; n++) if (amount(it, n) >= it.goal - 1e-9) return n; return 0; };
  const goalTxt = it => (it.goal === 2 ? 'se duplica' : it.goal === 3 ? 'se triplica' : `llega a ${it.goal} veces`);
  const fmt = v => String(+v.toFixed(2));
  return questGame({
    aspect: 1.3,
    init: () => ({ year: 0 }),
    ok: (s, it) => s.year === yearOf(it),
    answer: it => ({ year: yearOf(it) }),
    solution: it => `${it.kind === 'simple' ? 'Simple' : 'Compuesto'} al ${it.rate} %: ${goalTxt(it)} en el año ${yearOf(it)}`,
    prompt: it => `Interés ${it.kind === 'simple' ? 'simple' : 'compuesto'} del ${it.rate} % anual: ¿en qué año ${goalTxt(it)}?`,
    foot: it => (it.kind === 'simple' ? 'Simple: cada año suma lo mismo' : 'Compuesto: cada año multiplica lo que ya había'),
    no: (it, s) => (s.year < yearOf(it) ? 'Ese año todavía no alcanza la meta' : 'Ya había llegado un año antes'),
    layout(G) {
      G.btn = { x: G.W / 2 - 84, y: G.bottom - 40, w: 168, h: 34 };
      const w = (G.W - 24 - 7 * 6) / 8, y0 = G.btn.y - 92; G.cell = n => ({ x: 12 + ((n - 1) % 8) * (w + 6), y: y0 + Math.floor((n - 1) / 8) * 40, w, h: 34 });
      G.chart = { y: G.top + 8, h: y0 - G.top - 34 };
    },
    draw(G) {
      const { p, C, W, s, item: it } = G, ch = G.chart, shown = G.solved ? yearOf(it) : Math.max(3, s.ran || 0), bw = (W - 40) / 17, top = it.goal * 1.15, Y = v => ch.y + ch.h - (v / top) * ch.h;
      p.stroke(C.coral); p.strokeWeight(2); p.drawingContext.setLineDash([6, 5]); p.line(14, Y(it.goal), W - 14, Y(it.goal)); p.drawingContext.setLineDash([]);
      p.noStroke(); p.fill(C.I); p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.RIGHT, p.CENTER); p.text(`meta ×${it.goal}`, W - 14, Y(it.goal) - 8);
      for (let n = 0; n <= shown; n++) { const v = Math.min(top, amount(it, n)); p.noStroke(); p.fill(n === shown && G.solved ? C.ok : n ? C.sky : C.mute); p.rect(20 + n * bw, Y(v), bw - 4, ch.y + ch.h - Y(v), 3); }
      p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
      fitText(p, `Por cada peso: ${[0, 1, 2, 3].map(n => fmt(amount(it, n))).join(' → ')} → …`, W / 2, ch.y + ch.h + 16, W - 20, 13);
      for (let n = 1; n <= 16; n++) drawTile(p, C, G.cell(n), n, { fill: s.year === n ? (G.solved ? C.ok : C.sun) : C.cream, size: 14, r: 8, lift: 2 });
      drawBtn(p, C, G.btn, 'Correr los años', G.solved, G.solved ? C.ok : s.year ? C.coral : C.line);
    },
    press(G, x, y) {
      if (hitBox(G.btn, x, y)) { if (G.s.year) { G.s.ran = G.s.year; G.submit(); } return true; }   // aun fallando, los años corren hasta la apuesta
      for (let n = 1; n <= 16; n++) if (hitBox(G.cell(n), x, y)) { G.s.year = n; G.api.sfx?.tap?.(); return true; }
      return false;
    },
    peek: G => { const n = yearOf(G.item); return { solve: [G.cell(n), G.btn], wrongs: [G.cell(n === 16 ? 15 : n + 1), G.btn] }; },
  });
})();
