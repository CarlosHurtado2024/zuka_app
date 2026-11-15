// El cruce de las curvas (Álgebra, sistemas no lineales; juego dinámico de alg-102; spec
// 2026-11-21-dinamicos-mundos-altos): la orilla curva y = x² y un puente recto y = mx + b están tapados por la niebla
// del río. Con ◀ ▶ se mueve una mira por el eje x: en cada x se ven las dos alturas, la de la orilla y la del puente.
// Donde son iguales, las curvas se cortan: ahí se toca «Marcar». Cuando están todos los cruces, «Listo». Puede haber
// dos cruces, uno solo (el puente apenas toca la orilla) o ninguno.
// params = { rounds: [{ title, items: [{ m, b }] }], lives? }   (cruces enteros entre −3 y 3)   state = { done: [n] }

GAMES['cruce-curvas'] = (() => {
  const line = it => `${it.m === 0 ? '' : `${it.m === 1 ? '' : it.m === -1 ? '-' : it.m}x`}${it.b ? `${it.b < 0 ? ' - ' : it.m ? ' + ' : ''}${Math.abs(it.b)}` : it.m ? '' : '0'}`;
  const cuts = it => [-3, -2, -1, 0, 1, 2, 3].filter(x => x * x === it.m * x + it.b);
  return questGame({
    aspect: 1.35,
    init: () => ({ x: 0, marks: [], end: false }),
    ok: (s, it) => !!s.end && [...s.marks].sort((a, b) => a - b).join() === cuts(it).join(),
    answer: it => ({ x: 0, marks: cuts(it), end: true }),
    solution: it => `$x^2 = ${line(it)}$: ${cuts(it).length ? cuts(it).map(x => `(${negTxt(x)}, ${x * x})`).join(' y ') : 'no se cortan'}`,
    prompt: it => `Orilla $y = x^2$ y puente $y = ${line(it)}$: ¿dónde se cortan?`,
    foot: (it, s) => `Cruces marcados: ${s.marks.length}`,
    layout(G) {
      const w = (G.W - 24 - 3 * 8) / 4, y = G.bottom - 42; G.btn = [0, 1, 2, 3].map(i => ({ x: 12 + i * (w + 8), y, w, h: 36 }));
      const top = G.top + 6, h = y - top - 40; G.X = x => 30 + (x + 3) * (G.W - 60) / 6; G.Y = v => top + h - 6 - Math.max(-1, Math.min(10, v)) * (h - 12) / 11; G.ax = top + h + 8;
    },
    draw(G) {
      const { p, C, W, s, item: it } = G, hx = G.X(s.x), yo = s.x * s.x, yp = it.m * s.x + it.b;
      p.stroke(C.ink); p.strokeWeight(2); p.line(20, G.Y(0), W - 20, G.Y(0));
      for (let x = -3; x <= 3; x++) { p.stroke(C.line); p.strokeWeight(1); p.line(G.X(x), G.Y(10), G.X(x), G.Y(-1)); p.noStroke(); p.fill(x === s.x ? C.N : C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER); p.text(negTxt(x), G.X(x), G.ax); }
      if (G.solved) {   // al acertar se despeja la niebla
        p.noFill(); p.stroke(C.sky); p.strokeWeight(3); p.beginShape(); for (let x = -3; x <= 3.001; x += 0.1) p.vertex(G.X(x), G.Y(x * x)); p.endShape();
        // El puente, recortado al cuadro (si se recortara solo la altura, la recta se torcería).
        p.stroke(C.coral); p.beginShape(); for (let x = -3; x <= 3.001; x += 0.05) { const v = it.m * x + it.b; if (v >= -1 && v <= 10) p.vertex(G.X(x), G.Y(v)); } p.endShape();
      }
      for (const x of s.marks) { p.noStroke(); p.fill(G.solved ? C.ok : C.sun); p.circle(G.X(x), G.Y(x * x), 16); }
      // La mira: las dos alturas en el x actual.
      p.stroke(C.N); p.strokeWeight(1.5); p.drawingContext.setLineDash([4, 4]); p.line(hx, G.Y(10), hx, G.Y(-1)); p.drawingContext.setLineDash([]);
      drawDot(p, C, hx, G.Y(yo), 10, C.sky); drawDot(p, C, hx, G.Y(yp), 10, C.coral);
      p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
      p.fill(C.Z); fitText(p, `orilla: ${yo}`, W * 0.27, G.top + 12, W / 2 - 16, 13); p.fill(C.I); fitText(p, `puente: ${negTxt(yp)}`, W * 0.73, G.top + 12, W / 2 - 16, 13);
      drawBtn(p, C, G.btn[0], '◀', false, C.cream); drawBtn(p, C, G.btn[1], '▶', false, C.cream); drawBtn(p, C, G.btn[2], 'Marcar', false, C.sun); drawBtn(p, C, G.btn[3], 'Listo', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, it = G.item, i = G.btn.findIndex(b => hitBox(b, x, y));
      if (i < 0) return false;
      if (i < 2) { s.x = Math.max(-3, Math.min(3, s.x + (i ? 1 : -1))); G.api.sfx?.tap?.(); return true; }
      if (i === 2) {
        if (s.x * s.x !== it.m * s.x + it.b) { G.bad('Aquí las dos alturas no son iguales'); return true; }
        if (!s.marks.includes(s.x)) s.marks.push(s.x);
        G.api.sfx?.tap?.(); return true;
      }
      s.end = true; if (!G.submit(cuts(it).length ? 'Falta marcar un cruce' : 'Revisa: no hay ningún cruce')) s.end = false;
      return true;
    },
    peek: G => { const it = G.item, s = G.s, seq = []; let x = s.x; for (const c of cuts(it).filter(c => !s.marks.includes(c))) { while (x < c) { seq.push(G.btn[1]); x++; } while (x > c) { seq.push(G.btn[0]); x--; } seq.push(G.btn[2]); } return { solve: [...seq, G.btn[3]], wrong: cuts(it).length > s.marks.length ? G.btn[3] : null }; },
  });
})();
