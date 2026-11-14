// Escala la solución (todos los cursos; reemplaza a ejercicios de escribir un número; spec 2026-11-17-sin-escribir):
// la solución es una pared que se escala de abajo hacia arriba. En cada nivel hay dos o tres agarres, cada uno con un
// paso posible del razonamiento; solo uno es válido. El estudiante elige un agarre por nivel y la cuerda une su ruta
// hasta la bandera. No hay que escribir ni calcular rápido: hay que decidir qué paso se justifica. Nada se revela
// hasta comprobar; entonces se ve la ruta buena.
// params = { rounds: [{ levels: [[paso válido, paso falso, paso falso?], …] }] }   (el válido se escribe primero; el
//   juego los baraja)      state = { rounds: [{ pick: [opción elegida por nivel, −1 si falta] }] }

GAMES['escala-solucion'] = (() => {
  // Orden de los agarres de un nivel, siempre igual para la misma ronda. shuffledOrder nunca da el orden original, y con
  // dos agarres eso dejaría el válido siempre a la derecha: aquí se rota según el texto del nivel.
  const orderOf = (r, l) => {
    const n = r.levels[l].length, seed = `${l}:${r.levels[l].join('|')}`;
    let h = 2166136261;
    for (const c of seed) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
    const k = h % n;   // rotación: el válido cae parejo en cada lugar
    return Array.from({ length: n }, (_, i) => (i + k) % n);
  };
  // Un nivel de tres agarres con textos largos ocupa dos renglones (dos arriba y uno abajo): así se leen en 300 px.
  const rowsOf = lv => (lv.length === 3 && lv.some(t => t.length > 14) ? 2 : 1);
  // Cada paso que es una ecuación o una cuenta se dibuja (y se muestra en la respuesta) como fórmula.
  const stepTex = t => (typeof mathStep === 'function' ? mathStep(t) : t);
  const game = roundsGame({
    aspect: 1.3,
    init: r => ({ pick: r.levels.map(() => -1) }),
    ok: (s, r) => r.levels.every((_, l) => s.pick?.[l] === 0),
    answered: (s, r) => r.levels.every((_, l) => (s.pick?.[l] ?? -1) >= 0),
    // Para la respuesta (HTML con KaTeX y pie del juego): cada paso con matemática va como TeX.
    solution: r => r.levels.map(l => stepTex(l[0])).join('  →  '),
    prompt: () => 'Escala la solución: elige el paso válido en cada nivel',
    foot: (r, s) => (s.pick.some(v => v < 0) ? 'Empieza abajo y sube: un agarre por nivel' : 'Puedes cambiar cualquier agarre antes de comprobar'),
    layout(G) {
      const { W, H } = G, units = Math.max(...G.params.rounds.map(r => r.levels.reduce((t, lv) => t + rowsOf(lv), 0))), top = 96, bottom = H - 34, u = (bottom - top) / units, h = Math.min(46, u - 8);
      // Nivel 0 abajo; cada nivel ocupa uno o dos renglones.
      G.hold = (r, l, k) => {
        const lv = r.levels[l], rows = rowsOf(lv), below = r.levels.slice(0, l).reduce((t, x) => t + rowsOf(x), 0);
        const yTop = bottom - (below + rows) * u + (u - h) / 2;
        if (rows === 2) { const w = (W - 44 - 8) / 2; return k < 2 ? { x: 32 + k * (w + 8), y: yTop, w, h } : { x: 32 + (W - 44 - w) / 2, y: yTop + u, w, h }; }
        const m = lv.length, w = (W - 44 - (m - 1) * 8) / m;
        return { x: 32 + k * (w + 8), y: yTop, w, h };
      };
    },
    draw(G) {
      const { p, C, W, s, r } = G, n = r.levels.length;
      // Bandera en la cima.
      const topB = G.hold(r, n - 1, 0), fy = topB.y - 16;
      p.stroke(C.ink); p.strokeWeight(2); p.line(W / 2, fy - 12, W / 2, fy + 8);
      p.noStroke(); p.fill(C.coral); p.triangle(W / 2, fy - 12, W / 2 + 15, fy - 6, W / 2, fy);
      // La cuerda une los agarres elegidos, de abajo hacia arriba.
      const pts = [];
      for (let l = 0; l < n; l++) {
        const o = orderOf(r, l), want = G.locked ? 0 : s.pick[l], k = o.indexOf(want);
        if (want >= 0 && k >= 0) { const b = G.hold(r, l, k); pts.push([b.x + b.w / 2, b.y + b.h / 2]); } else break;
      }
      if (pts.length > 1) { p.noFill(); p.stroke(G.locked ? C.ok : C.sky); p.strokeWeight(4); p.beginShape(); pts.forEach(q => p.vertex(q[0], q[1])); p.endShape(); }
      for (let l = 0; l < n; l++) {
        const o = orderOf(r, l), b0 = G.hold(r, l, 0);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text(l + 1, 18, b0.y + b0.h / 2 + (rowsOf(r.levels[l]) === 2 ? (G.hold(r, l, 2).y - b0.y) / 2 : 0));
        o.forEach((opt, k) => {
          const b = G.hold(r, l, k), sel = s.pick[l] === opt, good = opt === 0;
          const fill = G.locked ? (good ? C.ok : sel ? C.bad : C.cream) : sel ? C.sky : C.cream;
          drawTile(p, C, b, '', { fill, r: 12, lift: 3, ring: sel && !G.locked ? C.brand : null });
          p.noStroke(); p.fill(inkOn(fill, C.ink)); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
          // Un paso largo se parte en dos renglones.
          const txt = r.levels[l][opt], tx = stepTex(txt); p.textSize(13);
          if (tx !== txt) drawFormulaCtx(p.drawingContext, tx, b.x + b.w / 2, b.y + b.h / 2 + 1, { size: 15, maxW: b.w - 10, maxH: b.h - 6, weight: 700 });
          else if (p.textWidth(txt) > b.w - 10 && txt.includes(' ')) {
            const words = txt.split(' '); let cut = 1, best = 1e9;
            for (let c = 1; c < words.length; c++) { const d = Math.abs(p.textWidth(words.slice(0, c).join(' ')) - p.textWidth(words.slice(c).join(' '))); if (d < best) { best = d; cut = c; } }
            fitText(p, words.slice(0, cut).join(' '), b.x + b.w / 2, b.y + b.h / 2 - 8, b.w - 8, 12); fitText(p, words.slice(cut).join(' '), b.x + b.w / 2, b.y + b.h / 2 + 8, b.w - 8, 12);
          } else fitText(p, txt, b.x + b.w / 2, b.y + b.h / 2 + 1, b.w - 8, 13);
        });
      }
    },
    press(G, x, y) {
      const r = G.r;
      for (let l = 0; l < r.levels.length; l++) {
        const o = orderOf(r, l), k = o.findIndex((_, j) => hitBox(G.hold(r, l, j), x, y));
        if (k >= 0) { G.s.pick[l] = G.s.pick[l] === o[k] ? -1 : o[k]; G.touch(); return true; }
      }
      return false;
    },
    peek: G => ({ holds: G.r.levels.map((_, l) => orderOf(G.r, l).map((opt, k) => ({ opt, ...G.hold(G.r, l, k) }))) }),
  });
  return { ...game, orderOf };
})();
