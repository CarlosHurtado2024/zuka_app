// Sondea la niebla (Álgebra, teorema del residuo y del factor; juego dinámico de alg-92; spec
// 2026-11-21-dinamicos-mundos-altos): la cordillera está tapada por la niebla, como en la apuesta de Beto. La altura
// del terreno en x es P(x) (el residuo de dividir entre x − x). Con una linterna se ve la altura en un punto; hay
// pocas linternas. Donde la altura es 0, la vía cruza: ahí va una bandera. No hace falta alumbrar todo: si en un
// punto el terreno está arriba de la vía y en otro abajo, entre los dos hay un cruce (todos los cruces son enteros).
// Se cambia entre «Linterna» y «Bandera» con los botones y se toca la columna. «Listo» comprueba las banderas.
// params = { rounds: [{ title, items: [{ roots: [enteros distintos entre −4 y 4], a: 1 | −1, lamps? }] }], lives? }
// state = { done: [n] }

GAMES['sondea-niebla'] = (() => {
  const f = (it, x) => it.a * it.roots.reduce((t, r) => t * (x - r), 1);
  const lampsOf = it => it.lamps ?? 5;
  const sortN = a => [...a].sort((x, y) => x - y);
  return questGame({
    aspect: 1.3,
    init: () => ({ seen: [], flags: [], flag: false }),
    ok: (s, it) => sortN(s.flags).join() === sortN(it.roots).join(),
    answer: it => ({ seen: [], flags: sortN(it.roots), flag: true }),
    solution: it => `Cruces en ${sortN(it.roots).map(negTxt).join(', ')}: $P(x) = ${it.a < 0 ? '-' : ''}${sortN(it.roots).map(r => `(x ${r < 0 ? '+' : '-'} ${Math.abs(r)})`).join('').replace(/\(x - 0\)/, 'x')}$`,
    prompt: it => `La vía cruza ${it.roots.length} veces: pon las banderas`,
    foot: (it, s) => (s.flag ? 'Toca una columna para poner o quitar una bandera' : `Linternas: ${lampsOf(it) - s.seen.length} · arriba y abajo de la vía: hay un cruce en medio`),
    no: () => 'Las banderas no están en los cruces',
    layout(G) {
      const w = (G.W - 24 - 2 * 8) / 3, y = G.bottom - 42; G.btn = [0, 1, 2].map(i => ({ x: 12 + i * (w + 8), y, w, h: 36 }));
      const cw = (G.W - 24) / 9, top = G.top + 8, h = y - top - 26;
      G.col = x => ({ x: 12 + (x + 4) * cw, y: top, w: cw, h }); G.mid = top + h / 2; G.amp = h / 2 - 12;
    },
    draw(G) {
      const { p, C, W, s, item: it } = G, scale = v => Math.max(-1, Math.min(1, v / 12)) * G.amp;
      p.stroke(C.ink); p.strokeWeight(3); p.line(12, G.mid, W - 12, G.mid);
      for (let x = -4; x <= 4; x++) {
        const b = G.col(x), cx = b.x + b.w / 2, v = f(it, x), seen = s.seen.includes(x) || G.solved;
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.CENTER, p.CENTER); p.text(negTxt(x), cx, b.y + b.h + 9);
        if (seen) {
          if (v === 0) { p.fill(C.N); p.circle(cx, G.mid, 11); }
          else { p.fill(v > 0 ? C.mint : C.coral); p.rect(cx - 7, v > 0 ? G.mid - scale(v) : G.mid, 14, Math.abs(scale(v)), 3); p.fill(C.ink); p.textSize(10); p.text(negTxt(v), cx, v > 0 ? G.mid - scale(v) - 8 : G.mid - scale(v) + 8); }
        } else { p.fill(C.line); p.circle(cx - 5, G.mid - 14, 22); p.circle(cx + 6, G.mid - 4, 20); p.circle(cx - 3, G.mid + 12, 22); }
        if (s.flags.includes(x)) { p.stroke(C.ink); p.strokeWeight(2); p.line(cx, G.mid, cx, G.mid - 30); p.noStroke(); p.fill(G.solved ? C.ok : C.coral); p.triangle(cx, G.mid - 30, cx + 13, G.mid - 24, cx, G.mid - 18); }
      }
      drawBtn(p, C, G.btn[0], `Linterna (${lampsOf(it) - s.seen.length})`, !s.flag, !s.flag ? C.sun : C.cream);
      drawBtn(p, C, G.btn[1], 'Bandera', s.flag, s.flag ? C.sun : C.cream);
      drawBtn(p, C, G.btn[2], 'Listo', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, it = G.item, i = G.btn.findIndex(b => hitBox(b, x, y));
      if (i === 0 || i === 1) { s.flag = i === 1; return true; }
      if (i === 2) { G.submit(); return true; }
      for (let c = -4; c <= 4; c++) if (hitBox(G.col(c), x, y)) {
        if (s.flag) { const k = s.flags.indexOf(c); if (k >= 0) s.flags.splice(k, 1); else s.flags.push(c); }
        else if (!s.seen.includes(c)) { if (s.seen.length >= lampsOf(it)) { G.a.say('Ya no quedan linternas: razona con lo que viste', G.C.mute); return true; } s.seen.push(c); }
        G.api.sfx?.tap?.();
        return true;
      }
      return false;
    },
    peek: G => { const it = G.item, s = G.s, diff = [-4, -3, -2, -1, 0, 1, 2, 3, 4].filter(x => s.flags.includes(x) !== it.roots.includes(x)); return { solve: [...(s.flag ? [] : [G.btn[1]]), ...diff.map(x => { const b = G.col(x); return { x: b.x + b.w / 2 - 2, y: G.mid - 2, w: 4, h: 4 }; }), G.btn[2]], wrong: G.btn[2] }; },
  });
})();
