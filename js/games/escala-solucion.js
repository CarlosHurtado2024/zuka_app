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
  const center = b => [b.x + b.w / 2, b.y + b.h / 2];
  const pending = pick => pick.indexOf(-1) < 0 ? pick.length : pick.indexOf(-1);
  function traceStep(pick, level, option) {
    if (level < 0 || option < 0 || level > pending(pick) || level >= pick.length || pick[level] === option) return false;
    pick[level] = option;
    pick.fill(-1, level + 1);
    return true;
  }
  const choose = (G, level, option) => {
    if (traceStep(G.s.pick, level, option)) G.touch();
  };
  const origin = G => [G.W / 2, G.H - 45];
  const game = roundsGame({
    aspect: 1.3,
    init: r => ({ pick: r.levels.map(() => -1) }),
    ok: (s, r) => r.levels.every((_, l) => s.pick?.[l] === 0),
    answered: (s, r) => r.levels.every((_, l) => (s.pick?.[l] ?? -1) >= 0),
    // Para la respuesta (HTML con KaTeX y pie del juego): cada paso con matemática va como TeX.
    solution: r => r.levels.map(l => stepTex(l[0])).join('  →  '),
    prompt: () => 'Traza los pasos del razonamiento',
    keyboard: 'Usa las flechas izquierda y derecha para elegir un paso, arriba y abajo para cambiar de nivel y espacio para unirlo.',
    enter(G) { G.trace = null; delete G.focus; },
    foot: (r, s) => (s.pick.some(v => v < 0) ? 'Une una estación por nivel desde la base' : 'Toca un paso anterior para corregir la ruta'),
    layout(G) {
      const { W, H } = G, units = Math.max(...G.params.rounds.map(r => r.levels.reduce((t, lv) => t + rowsOf(lv), 0))), top = 91, bottom = H - 63, u = (bottom - top) / units, h = Math.min(48, u - 5);
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
      const start = origin(G), pts = [start];
      for (let l = 0; l < n; l++) {
        const o = orderOf(r, l), want = G.locked ? 0 : s.pick[l], k = o.indexOf(want);
        if (want >= 0 && k >= 0) pts.push(center(G.hold(r, l, k))); else break;
      }
      if (pts.length > 1) { p.noFill(); p.stroke(G.locked ? C.ok : C.brand); p.strokeWeight(3); p.beginShape(); pts.forEach(q => p.vertex(q[0], q[1])); p.endShape(); }
      if (G.trace && !G.locked) {
        p.drawingContext.setLineDash([4, 5]); p.stroke(C.brand); p.strokeWeight(2);
        p.line(...pts.at(-1), ...G.trace);
        p.drawingContext.setLineDash([]);
      }
      p.fill(C.card); p.stroke(C.brand); p.strokeWeight(2); p.circle(...start, 21);
      p.noStroke(); p.fill(C.brand); p.circle(...start, 6);
      for (let l = 0; l < n; l++) {
        const o = orderOf(r, l), b0 = G.hold(r, l, 0);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text(l + 1, 18, b0.y + b0.h / 2 + (rowsOf(r.levels[l]) === 2 ? (G.hold(r, l, 2).y - b0.y) / 2 : 0));
        o.forEach((opt, k) => {
          const b = G.hold(r, l, k), sel = s.pick[l] === opt, good = opt === 0;
          const fill = G.locked ? (good ? C.ok : sel ? C.bad : C.card) : C.card;
          const active = !G.locked && (sel || (G.focus?.level === l && G.focus.option === k));
          drawPracticePanel(p, b, fill, active ? C.brand : C.line, 8, active ? 2 : 1);
          p.noStroke(); p.fill(inkOn(fill, C.ink)); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
          // Un paso largo se parte en dos renglones.
          const txt = r.levels[l][opt], tx = stepTex(txt); p.textSize(13);
          const parts = typeof stepLines === 'function' ? stepLines(txt) : [txt];
          if (parts.length === 2 && typeof drawFormulaCtx === 'function') parts.forEach((q, j) => { const f = stepTex(q); if (f !== q) drawFormulaCtx(p.drawingContext, f, b.x + b.w / 2, b.y + b.h / 2 + (j ? 9 : -8), { size: 13, maxW: b.w - 10, maxH: b.h / 2 - 2, weight: 700 }); else {
            // Frase corrida que no cabe en un renglón de la ficha: va en dos renglones más chicos (antes se salía y pisaba la ficha vecina).
            p.textSize(12);
            if (p.textWidth(q) <= b.w - 8 || j) fitText(p, q, b.x + b.w / 2, b.y + b.h / 2 + (j ? 9 : -8), b.w - 8, 12);
            else {
              let size = 10.5, lines;
              do { p.textSize(size); lines = wrapWords(q, b.w - 10, t => p.textWidth(t)); } while ((lines.length > 2 || lines.some(t => p.textWidth(t) > b.w - 8)) && (size -= 0.5) > 6);
              lines.slice(0, 2).forEach((t, i) => p.text(t, b.x + b.w / 2, b.y + b.h / 2 - (lines.length > 1 ? 15 - i * (size + 1) : 8)));
            }
          } });
          else if (tx !== txt) drawFormulaCtx(p.drawingContext, tx, b.x + b.w / 2, b.y + b.h / 2 + 1, { size: 15, maxW: b.w - 10, maxH: b.h - 6, weight: 700 });
          else {
            // Texto corrido: se parte en los renglones que hagan falta y se encoge hasta caber en la ficha, a lo ancho y
            // a lo alto (antes una frase larga se salía de su ficha y pisaba la de al lado en celulares angostos).
            let size = 13, lines;
            do { p.textSize(size); lines = wrapWords(txt, b.w - 12, t => p.textWidth(t)); }
            while ((lines.length * size * 1.15 > b.h - 6 || lines.some(t => p.textWidth(t) > b.w - 8)) && --size > 7);
            const lh = size * 1.15, y0 = b.y + b.h / 2 - ((lines.length - 1) * lh) / 2 + 1;
            lines.forEach((t, j) => p.text(t, b.x + b.w / 2, y0 + j * lh));
          }
        });
      }
    },
    press(G, x, y) {
      const r = G.r;
      delete G.focus;
      if (Math.hypot(x - origin(G)[0], y - origin(G)[1]) <= 22) { G.trace = [x, y]; return true; }
      for (let l = 0; l <= Math.min(pending(G.s.pick), r.levels.length - 1); l++) {
        const o = orderOf(r, l), k = o.findIndex((_, j) => hitBox(G.hold(r, l, j), x, y));
        if (k >= 0) { choose(G, l, o[k]); G.trace = [x, y]; return true; }
      }
      return false;
    },
    drag(G, x, y) {
      if (!G.trace) return false;
      G.trace = [x, y];
      const l = pending(G.s.pick);
      if (l < G.r.levels.length) {
        const o = orderOf(G.r, l), k = o.findIndex((_, j) => hitBox(G.hold(G.r, l, j), x, y));
        if (k >= 0) choose(G, l, o[k]);
      }
      return true;
    },
    release(G, x, y) { this.drag(G, x, y); G.trace = null; },
    cancel(G) { G.trace = null; },
    key(G, key) {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Enter'].includes(key)) return false;
      const end = Math.min(pending(G.s.pick), G.r.levels.length - 1);
      const f = G.focus ??= { level: end, option: 0 };
      const size = G.r.levels[f.level].length;
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        f.level = Math.max(0, Math.min(end, f.level + (key === 'ArrowUp' ? 1 : -1)));
        f.option = 0;
      } else if (key === 'ArrowLeft' || key === 'ArrowRight') {
        f.option = (size + f.option + (key === 'ArrowRight' ? 1 : -1)) % size;
      } else {
        choose(G, f.level, orderOf(G.r, f.level)[f.option]);
        f.level = Math.min(pending(G.s.pick), G.r.levels.length - 1);
        f.option = 0;
      }
      return true;
    },
    demo(G) {
      const l = pending(G.s.pick);
      if (l >= G.r.levels.length) {
        const option = orderOf(G.r, 0).findIndex(i => i !== G.s.pick[0]);
        const [x, y] = center(G.hold(G.r, 0, option));
        return { from: { x, y } };
      }
      const before = l ? center(G.hold(G.r, l - 1, orderOf(G.r, l - 1).indexOf(G.s.pick[l - 1]))) : origin(G);
      const end = center(G.hold(G.r, l, 0));
      return { from: { x: before[0], y: before[1] }, to: { x: (before[0] + end[0]) / 2, y: (before[1] + end[1]) / 2 } };
    },
    peek: G => ({ holds: G.r.levels.map((_, l) => orderOf(G.r, l).map((opt, k) => ({ opt, ...G.hold(G.r, l, k) }))) }),
  });
  return { ...game, orderOf, traceStep };
})();
