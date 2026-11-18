// Cancela factores (Álgebra, simplificar expresiones racionales; mundo Río de Asíntotas; spec 2026-11-19-mundos-altos):
// una fracción con fichas arriba y abajo de la raya. Si las fichas están MULTIPLICANDO (factores), una de arriba se
// cancela con una igual de abajo: se puede arrastrar desde arriba. Si están SUMANDO (términos), nada se cancela: esa es la
// trampa de siempre, (x + 2)/x no es 2. Cuando ya no queda nada por cancelar se toca «Listo».
// Lo cancelado sigue contando para el dominio: el juego lo recuerda al comprobar.
// params = { rounds: [{ top: [etiquetas], bottom: [etiquetas], sumTop?: true, sumBottom?: true }] }
// state = { rounds: [{ pairs: [[i, j]], done }] }

GAMES['cancela-factores'] = (() => {
  const M = t => (typeof mathStep === 'function' ? `$${plainToTex(t)}$` : t);
  // Parejas que se pueden cancelar: solo entre factores (nunca si un piso es una suma).
  function bestPairs(r) {
    if (r.sumTop || r.sumBottom) return 0;
    const left = [...r.bottom]; let n = 0;
    for (const t of r.top) { const k = left.indexOf(t); if (k >= 0) { left.splice(k, 1); n++; } }
    return n;
  }
  const valid = (s, r) => (s.pairs || []).every(([i, j]) => !r.sumTop && !r.sumBottom && r.top[i] === r.bottom[j]);
  const restOf = (list, used, sum) => { const k = list.filter((_, i) => !used.includes(i)); return k.length ? k.map(t => (sum || k.length === 1 ? t : `(${t})`)).join(sum ? ' + ' : '') : '1'; };
  const resultTex = (s, r) => { const a = restOf(r.top, s.pairs.map(q => q[0]), r.sumTop), b = restOf(r.bottom, s.pairs.map(q => q[1]), r.sumBottom); return b === '1' ? plainToTex(a) : `\\frac{${plainToTex(a)}}{${plainToTex(b)}}`; };
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ pairs: [], done: false, pick: -1 }),
    ok: (s, r) => !!s.done && valid(s, r) && (s.pairs || []).length === bestPairs(r),
    answered: s => !!s.done,
    solution: r => { const n = bestPairs(r), top = [...r.top.keys()], pairs = []; const left = r.bottom.map((t, j) => [t, j]); if (n) for (const i of top) { const k = left.findIndex(q => q[0] === r.top[i]); if (k >= 0) { pairs.push([i, left[k][1]]); left.splice(k, 1); } } return n ? `Queda $${resultTex({ pairs }, r)}$` : 'No se cancela nada: son términos que se suman, no factores'; },
    // El mismo enunciado en todas las rondas: no delata cuáles son la trampa.
    prompt: () => 'Simplifica: cancela solo lo que multiplica a todo su piso',
    foot: () => 'Lleva un factor sobre su igual del otro piso',
    layout(G) {
      const { W, H } = G, mid = 96 + (H - 96 - 110) / 2;
      G.tile = (side, i, n) => { const w = Math.min(96, (W - 28 - (n - 1) * 18) / n), x0 = W / 2 - (n * w + (n - 1) * 18) / 2; return { x: x0 + i * (w + 18), y: side ? mid + 16 : mid - 56, w, h: 40 }; };
      G.mid = mid; G.btn = { x: W / 2 - 60, y: H - 78, w: 120, h: 36 };
    },
    draw(G) {
      const { p, C, W, s, r } = G;
      p.stroke(C.ink); p.strokeWeight(3); p.line(24, G.mid, W - 24, G.mid);
      [[r.top, 0, r.sumTop], [r.bottom, 1, r.sumBottom]].forEach(([list, side, sum]) => list.forEach((t, i) => {
        const b = G.tile(side, i, list.length), cut = s.pairs.some(q => q[side] === i), sel = !side && s.pick === i;
        drawTile(p, C, b, M(t), { fill: cut ? C.line : C.cream, ink: cut ? C.mute : undefined, size: 15, ring: sel ? C.brand : null });
        if (cut) { p.stroke(C.coral); p.strokeWeight(3); p.line(b.x + 6, b.y + b.h - 6, b.x + b.w - 6, b.y + 6); }
        if (i < list.length - 1) { p.noStroke(); p.fill(sum ? C.I : C.mute); p.textStyle(p.BOLD); p.textSize(16); p.textAlign(p.CENTER, p.CENTER); p.text(sum ? '+' : '·', b.x + b.w + 9, b.y + b.h / 2); }
      }));
      if (G.locked && !(r.sumTop || r.sumBottom) && bestPairs(r)) { p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER); fitText(p, 'Lo cancelado sigue fuera del dominio', W / 2, G.btn.y - 14, W - 24, 11); }
      if (G.follow) {
        const b = G.tile(0, s.pick, r.top.length), { x, y } = G.follow;
        p.stroke(C.brand); p.strokeWeight(2); p.line(b.x + b.w / 2, b.y + b.h / 2, x, y);
        drawTile(p, C, { x: x - b.w / 2, y: y - 19, w: b.w, h: 38 }, M(r.top[s.pick]), { size: 15 });
      }
      if (!G.locked) drawTile(p, C, G.btn, s.done ? '✓ Listo' : 'Listo', { fill: s.done ? C.mint : C.sky, size: 15, r: 12 });
    },
    press(G, x, y) {
      const s = G.s, r = G.r;
      if (hitBox(G.btn, x, y)) { s.done = !s.done; s.pick = -1; G.touch(); return true; }
      const ti = r.top.findIndex((_, i) => hitBox(G.tile(0, i, r.top.length), x, y)), bi = r.bottom.findIndex((_, j) => hitBox(G.tile(1, j, r.bottom.length), x, y));
      if (ti < 0 && bi < 0) return false;
      s.done = false;
      // Tocar una ficha ya tachada deshace su pareja.
      const k = s.pairs.findIndex(q => (ti >= 0 ? q[0] === ti : q[1] === bi));
      if (k >= 0) { s.pairs.splice(k, 1); s.pick = -1; }
      else if (ti >= 0) s.pick = s.pick === ti ? -1 : ti;
      else if (s.pick >= 0) { s.pairs.push([s.pick, bi]); s.pick = -1; }
      G.touch();
      return true;
    },
    drag(G, x, y) {
      if (G.s.pick < 0) return false;
      G.follow = { x, y };
      return true;
    },
    release(G, x, y) {
      if (!G.follow) return;
      G.follow = null;
      const { r, s } = G, j = r.bottom.findIndex((_, i) => hitBox(G.tile(1, i, r.bottom.length), x, y));
      if (j >= 0 && !s.pairs.some(q => q[1] === j)) {
        s.pairs.push([s.pick, j]); s.pick = -1; G.touch();
      }
    },
    cancel(G) { G.follow = null; },
    demo(G) {
      const { r } = G;
      const i = r.top.findIndex(t => r.bottom.includes(t)), j = r.bottom.indexOf(r.top[i]);
      const a = G.tile(0, Math.max(0, i), r.top.length), from = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
      if (i < 0 || r.sumTop || r.sumBottom) return { from, to: { x: from.x, y: G.mid }, text: 'Revisa los signos entre las piezas', ty: G.btn.y - 16 };
      const b = G.tile(1, j, r.bottom.length);
      return { from, to: { x: b.x + b.w / 2, y: b.y + b.h / 2 } };
    },
    peek: G => ({ top: G.r.top.map((_, i) => G.tile(0, i, G.r.top.length)), bottom: G.r.bottom.map((_, j) => G.tile(1, j, G.r.bottom.length)), btn: G.btn, best: bestPairs(G.r) }),
  });
  return { ...game, bestPairs, valid, resultTex };
})();
