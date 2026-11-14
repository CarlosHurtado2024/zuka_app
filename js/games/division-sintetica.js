// La división sintética (Álgebra, teorema del residuo y del factor; mundo Cordillera Cúbica; spec 2026-11-19-mundos-altos):
// arriba van los coeficientes de P(x). Se elige el número r con − y + y el juego hace la división entre (x − r) paso
// a paso: baja el primero, multiplica por r, suma, y así hasta el final. El último número es el residuo, que es P(r).
//   goal 'zero':  hallar un r que deje residuo 0 (entonces x − r es factor y r es una raíz). Vale cualquier raíz.
//   goal 'value': hallar el r cuyo residuo es `value`.
// La tabla se ve completa: el juego hace las cuentas; pensar es saber qué r probar (divisores del término
// independiente, el signo de r frente al de «x − r») y leer el residuo.
// params = { rounds: [{ coef: [a_n, …, a_0], goal, value?, min?, max? }] }   state = { rounds: [{ r }] }

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
  const rootsOf = r => { const o = []; for (let v = r.min ?? -6; v <= (r.max ?? 6); v++) if (remOf(r.coef, v) === want(r)) o.push(v); return o; };
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ r: 0, moved: false }),
    ok: (s, r) => remOf(r.coef, s.r) === want(r),
    answered: s => !!s.moved,
    solution: r => { const v = rootsOf(r)[0]; return `$P(${v}) = ${remOf(r.coef, v)}$: divide entre $x ${v < 0 ? '+' : '-'} ${Math.abs(v)}$`; },
    prompt: r => `$P(x) = ${polyTex(r.coef)}$`,
    foot: r => (r.goal === 'zero' ? 'Busca un r que deje residuo 0: ese r es una raíz' : `Busca el r que deja residuo ${negTxt(r.value)}`),
    layout(G) { G.box = { x: G.W / 2 - 80, y: G.H - 66, w: 160, h: 32 }; },
    draw(G) {
      const { p, C, W, s, r } = G, n = r.coef.length, row = rowOf(r.coef, s.r), cw = Math.min(54, (W - 76) / n), x0 = W / 2 - (n * cw) / 2 + 22, y0 = 108, rh = 40;
      const num = (v, x, y, col) => { p.noStroke(); p.fill(col); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, negTxt(v), x, y, cw - 6, 17); };
      // El número r, en su casilla de la izquierda.
      drawTile(p, C, { x: x0 - 50, y: y0 + rh - 16, w: 38, h: 32 }, negTxt(s.r), { fill: C.sky, size: 16, r: 8, lift: 2 });
      p.stroke(C.ink); p.strokeWeight(2); p.line(x0 - 6, y0 - 16, x0 - 6, y0 + 2 * rh + 14); p.line(x0 - 6, y0 + 2 * rh - 22, x0 + n * cw, y0 + 2 * rh - 22);
      for (let i = 0; i < n; i++) {
        const x = x0 + i * cw + cw / 2, last = i === n - 1;
        num(r.coef[i], x, y0, C.ink);
        if (i) num(row[i - 1] * s.r, x, y0 + rh, C.mute);
        if (last) { const good = row[i] === want(r); p.noStroke(); p.fill(G.locked ? (good ? C.ok : C.bad) : C.card); p.stroke(G.locked ? (good ? C.ok : C.bad) : C.N); p.strokeWeight(2); p.rect(x - cw / 2 + 4, y0 + 2 * rh - 16, cw - 8, 32, 8); }
        num(row[i], x, y0 + 2 * rh, last ? (G.locked ? inkOn(row[i] === want(r) ? C.ok : C.bad, C.ink) : C.N) : C.Z);
      }
      p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER); fitText(p, 'baja · multiplica por r · suma', W / 2, y0 + 3 * rh - 4, W - 24, 11);
      p.fill(C.ink); p.textStyle(p.BOLD); fitText(p, `$P(${s.r}) = ${row[n - 1]}$  ·  residuo al dividir entre ${s.r === 0 ? '$x$' : `$x ${s.r < 0 ? '+' : '-'} ${Math.abs(s.r)}$`}`, W / 2, y0 + 3 * rh + 22, W - 20, 14);
      drawStepper(p, C, G.box, negTxt(s.r), 'r', C.Z);
    },
    press(G, x, y) {
      const d = stepHit(G.box, x, y);
      if (!d) return false;
      G.s.r = Math.max(G.r.min ?? -6, Math.min(G.r.max ?? 6, G.s.r + d)); G.s.moved = true; G.touch();
      return true;
    },
    peek: G => ({ box: G.box, want: rootsOf(G.r)[0], rem: remOf(G.r.coef, G.s.r) }),
  });
  return { ...game, rowOf, remOf, polyTex, rootsOf };
})();
