// La división sintética (Álgebra, teorema del residuo y del factor; mundo Cordillera Cúbica; spec 2026-11-19-mundos-altos):
// arriba van los coeficientes de P(x). Se elige el número r con − y + y, al tocar «Dividir», el juego hace la división
// entre (x − r) paso a paso: baja el primero, multiplica por r, suma, y así hasta el final. El último número es el
// residuo, que es P(r).
//   goal 'zero':  hallar un r que deje residuo 0 (entonces x − r es factor y r es una raíz). Vale cualquier raíz.
//   goal 'value': hallar el r cuyo residuo es `value`.
// Hay pocas divisiones por ronda (4 por defecto): no alcanza para probar todos los números, así que hay que pensar
// cuáles valen la pena: los divisores del término independiente y, sobre todo, el SIGNO de los residuos ya vistos (si
// P(1) es negativo y P(3) positivo, entre los dos hay una raíz). Las divisiones hechas quedan anotadas. La respuesta es
// el r que queda elegido al comprobar, se haya dividido con él o no (spec 2026-11-21-dinamicos-mundos-altos).
// params = { rounds: [{ coef: [a_n, …, a_0], goal, value?, min?, max?, probes? }] }   state = { rounds: [{ r, tried: [r…] }] }

GAMES['division-sintetica'] = (() => {
  // Fila de abajo de la división sintética de coef entre (x − r).
  const rowOf = (coef, r) => { const out = []; coef.forEach((c, i) => out.push(i ? c + out[i - 1] * r : c)); return out; };
  const remOf = (coef, r) => rowOf(coef, r)[coef.length - 1];
  const polyTex = coef => {
    const n = coef.length - 1;
    return coef.map((c, i) => {
      if (!c) return '';
      const e = n - i, a = Math.abs(c), v = e === 0 ? `${a}` : `${a === 1 ? '' : a}x${e > 1 ? `^{${e}}` : ''}`;
      return `${i === 0 ? (c < 0 ? '-' : '') : c < 0 ? ' - ' : ' + '}${v}`;
    }).join('');
  };
  const want = r => (r.goal === 'zero' ? 0 : r.value);
  const maxOf = r => r.probes ?? 4;
  const rootsOf = r => { const o = []; for (let v = r.min ?? -6; v <= (r.max ?? 6); v++) if (remOf(r.coef, v) === want(r)) o.push(v); return o; };
  const divisor = v => (v === 0 ? 'x' : `x ${v < 0 ? '+' : '-'} ${Math.abs(v)}`);
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ r: 0, tried: [] }),
    ok: (s, r) => (s.tried?.length || s.moved) && remOf(r.coef, s.r) === want(r),
    answered: s => s.tried.length > 0,
    solution: r => { const v = rootsOf(r)[0]; return `$P(${v}) = ${remOf(r.coef, v)}$: divide entre $${divisor(v)}$`; },
    prompt: r => `$P(x) = ${polyTex(r.coef)}$`,
    foot: (r, s) => (s.tried.length >= maxOf(r) ? 'Ya no quedan divisiones: deja elegido el r que crees correcto' : r.goal === 'zero' ? 'Pocas divisiones: fíjate en el signo de cada residuo' : `Busca el r que deja residuo ${negTxt(r.value)}: mira si te pasas o te falta`),
    layout(G) { G.box = { x: 12, y: G.H - 66, w: 150, h: 32 }; G.btn = { x: G.W - 12 - 132, y: G.H - 68, w: 132, h: 36 }; },
    draw(G) {
      const { p, C, W, s, r } = G, n = r.coef.length, seen = G.locked || s.tried.includes(s.r), row = rowOf(r.coef, s.r), cw = Math.min(54, (W - 76) / n), x0 = W / 2 - (n * cw) / 2 + 22, y0 = 108, rh = 40, left = maxOf(r) - s.tried.length;
      const num = (v, x, y, col) => { p.noStroke(); p.fill(col); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, seen || col === C.ink ? negTxt(v) : '?', x, y, cw - 6, 17); };
      // El número r, en su casilla de la izquierda.
      drawTile(p, C, { x: x0 - 50, y: y0 + rh - 16, w: 38, h: 32 }, negTxt(s.r), { fill: C.sky, size: 16, r: 8, lift: 2 });
      p.stroke(C.ink); p.strokeWeight(2); p.line(x0 - 6, y0 - 16, x0 - 6, y0 + 2 * rh + 14); p.line(x0 - 6, y0 + 2 * rh - 22, x0 + n * cw, y0 + 2 * rh - 22);
      for (let i = 0; i < n; i++) {
        const x = x0 + i * cw + cw / 2, last = i === n - 1, good = row[i] === want(r);
        num(r.coef[i], x, y0, C.ink);
        if (i) num(row[i - 1] * s.r, x, y0 + rh, C.mute);
        if (last) { p.fill(G.locked ? (good ? C.ok : C.bad) : C.card); p.stroke(G.locked ? (good ? C.ok : C.bad) : C.N); p.strokeWeight(2); p.rect(x - cw / 2 + 4, y0 + 2 * rh - 16, cw - 8, 32, 8); }
        num(row[i], x, y0 + 2 * rh, last ? (G.locked ? inkOn(good ? C.ok : C.bad, C.ink) : C.N) : C.Z);
      }
      p.noStroke(); p.textAlign(p.CENTER, p.CENTER);
      p.fill(C.ink); p.textStyle(p.BOLD);
      fitText(p, seen ? `$P(${s.r}) = ${row[n - 1]}$  ·  residuo al dividir entre $${divisor(s.r)}$` : `Toca «Dividir» para dividir entre $${divisor(s.r)}$`, W / 2, y0 + 3 * rh - 2, W - 20, 14);
      // Lo que ya se dividió, en orden de r: ahí se ve dónde cambia el signo del residuo.
      const hist = [...s.tried].sort((a, b) => a - b).map(v => `P(${negTxt(v)}) = ${negTxt(remOf(r.coef, v))}`).join('   ');
      p.fill(C.mute); p.textStyle(p.BOLD); fitText(p, hist || 'Aquí quedan anotadas tus divisiones', W / 2, y0 + 3 * rh + 22, W - 20, 12);
      drawStepper(p, C, G.box, negTxt(s.r), 'r', C.Z);
      if (!G.locked) {
        const can = left > 0 && !s.tried.includes(s.r);
        drawTile(p, C, G.btn, left > 0 ? `Dividir (${left})` : 'Sin divisiones', { fill: can ? C.coral : C.line, ink: can ? undefined : C.mute, size: 14, r: 12 });
      }
    },
    press(G, x, y) {
      const s = G.s, r = G.r, d = stepHit(G.box, x, y);
      if (d) { s.r = Math.max(r.min ?? -6, Math.min(r.max ?? 6, s.r + d)); G.touch(); return true; }
      if (hitBox(G.btn, x, y)) { if (s.tried.length < maxOf(r) && !s.tried.includes(s.r)) { s.tried.push(s.r); G.touch(); } return true; }
      return false;
    },
    peek: G => ({ box: G.box, btn: G.btn, want: rootsOf(G.r)[0], left: maxOf(G.r) - G.s.tried.length, rem: remOf(G.r.coef, G.s.r) }),
  });
  return { ...game, rowOf, remOf, polyTex, rootsOf, maxOf };
})();
