// Arma la mesa (Álgebra, productos notables; juego dinámico de alg-3; spec 2026-11-21-dinamicos-mundos-altos): como
// en el video, una mesa cuadrada de lado x crece `a` por cada lado. Para completarla no basta con la esquina a²:
// hacen falta las dos tablas de a por x (el doble producto). En la bandeja hay piezas con su área; se tocan las que
// completan la mesa y luego «Listo». Sobran piezas trampa.
// params = { rounds: [{ title, items: [{ a, pieces: [áreas como texto: '3x', '9', …] }] }], lives? }   state = { done: [n] }

GAMES['arma-la-mesa'] = (() => {
  const need = it => [`${it.a}x`, `${it.a}x`, `${it.a * it.a}`];
  // Índices de las piezas que completan la mesa (las dos tablas y la esquina).
  const answerIdx = it => { const used = []; for (const t of need(it)) { const k = it.pieces.findIndex((q, i) => q === t && !used.includes(i)); used.push(k); } return used.sort((a, b) => a - b); };
  const picked = s => s.on.map((v, i) => (v ? i : -1)).filter(i => i >= 0);
  return questGame({
    aspect: 1.3,
    init: it => ({ on: it.pieces.map(() => false) }),
    ok: (s, it) => { const got = picked(s).map(i => it.pieces[i]).sort().join('|'); return got === [...need(it)].sort().join('|'); },
    answer: it => ({ on: it.pieces.map((_, i) => answerIdx(it).includes(i)) }),
    solution: it => `$(x + ${it.a})^2 = x^2 + ${2 * it.a}x + ${it.a * it.a}$`,
    prompt: it => `La mesa crece ${it.a} por lado: complétala`,
    foot: () => 'Toca las piezas que hacen falta y luego «Listo»',
    no: (it, s) => { const got = picked(s).map(i => it.pieces[i]), bars = got.filter(t => t === `${it.a}x`).length; return bars < 2 ? `Faltan tablas de ${it.a} por x` : !got.includes(`${it.a * it.a}`) ? 'Falta la esquina' : 'Sobra una pieza que no cabe'; },
    layout(G) {
      const n = G.item.pieces.length, cols = Math.min(4, n), w = (G.W - 24 - (cols - 1) * 8) / cols, rows = Math.ceil(n / cols), y0 = G.bottom - 46 - rows * 46;
      G.tile = i => ({ x: 12 + (i % cols) * (w + 8), y: y0 + Math.floor(i / cols) * 46, w, h: 38 });
      G.btn = { x: G.W / 2 - 60, y: G.bottom - 40, w: 120, h: 34 };
      G.area = { y: G.top + 4, h: y0 - G.top - 14 };
    },
    draw(G) {
      const { p, C, W, s, item: it } = G, got = picked(s).map(i => it.pieces[i]);
      // Lo elegido se pone en la mesa tal cual, encaje o no: el juego no avisa cuál pieza es la buena antes de «Listo».
      const xs = got.filter(t => /x$/.test(t)), nums = got.filter(t => !/x$/.test(t));
      const side = Math.min(G.area.h - 22, W - 120), X = side * 0.68, a = side - X, x0 = W / 2 - side / 2, y0 = G.area.y + 20;
      p.noStroke(); p.fill(C.sky); p.rect(x0, y0, X - 2, X - 2, 4);
      p.fill(inkOn(C.sky, C.ink)); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, '$x^2$', x0 + X / 2, y0 + X / 2, X - 8, 18);
      const part = (x, y, w, h, on, col, txt) => {
        if (on) { p.noStroke(); p.fill(col); p.rect(x, y, w - 2, h - 2, 4); p.fill(inkOn(col, C.ink)); p.textStyle(p.BOLD); fitText(p, txt, x + w / 2, y + h / 2, w - 4, 13); }
        else { p.noFill(); p.stroke(C.mute); p.strokeWeight(1.5); p.drawingContext.setLineDash([4, 4]); p.rect(x, y, w - 2, h - 2, 4); p.drawingContext.setLineDash([]); }
      };
      part(x0 + X, y0, a, X, xs.length >= 1, C.mint, `$${xs[0]}$`); part(x0, y0 + X, X, a, xs.length >= 2, C.mint, `$${xs[1]}$`); part(x0 + X, y0 + X, a, a, nums.length >= 1, C.sun, nums[0]);
      p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); fitText(p, `$x + ${it.a}$`, x0 + side / 2, y0 - 11, W - 40, 13);
      it.pieces.forEach((t, i) => drawTile(p, C, G.tile(i), `$${t}$`, { fill: s.on[i] ? C.mint : C.cream, size: 16, ring: s.on[i] ? C.ok : null }));
      drawBtn(p, C, G.btn, 'Listo', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      if (hitBox(G.btn, x, y)) { G.submit(); return true; }
      const i = G.item.pieces.findIndex((_, k) => hitBox(G.tile(k), x, y));
      if (i < 0) return false;
      G.s.on[i] = !G.s.on[i]; G.api.sfx?.tap?.();
      return true;
    },
    peek: G => { const want = answerIdx(G.item), off = G.s.on.map((v, i) => (v !== want.includes(i) ? i : -1)).filter(i => i >= 0); return { solve: [...off.map(i => G.tile(i)), G.btn], wrong: G.btn }; },
  });
})();
