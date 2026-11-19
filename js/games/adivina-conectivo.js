// ¿Qué conectivo es? (Preuniversitario, pu-lo-1; spec 2026-11-18-preuda-razonamiento-completo): una tabla de verdad con la
// columna de resultados ya escrita. Se arrastra un conectivo (∧, ∨, →, ↔) a la casilla de «p ? q» y el juego escribe al lado,
// en vivo, la columna que da ese conectivo: hay que dejar el que coincide fila por fila.
// params = { rounds: [{ out: [4 valores: VV, VF, FV, FF] }] }   state = { rounds: [{ f: [conectivo | −1] }] }
GAMES['adivina-conectivo'] = (() => {
  const OPS = [['\\wedge', (a, b) => a && b], ['\\vee', (a, b) => a || b], ['\\to', (a, b) => !a || b], ['\\leftrightarrow', (a, b) => a === b]];
  const CASES = [[true, true], [true, false], [false, true], [false, false]];
  const need = r => OPS.findIndex(([, f]) => CASES.every(([a, b], i) => f(a, b) === r.out[i]));
  return CODK.fillGame({
    aspect: 1.3,
    prompt: () => '¿Qué conectivo da esta columna?',
    foot: 'Arrastra un conectivo a la casilla',
    tray: () => OPS.map(o => `$${o[0]}$`),
    need: r => [need(r)],
    over: () => '$p \\;?\\; q$',
    done: r => `es $p ${OPS[need(r)][0]} q$`,
    decor(G) {
      const { p, C, r, s } = G, cw = Math.min(64, (G.W - 30) / 4), x0 = (G.W - 4 * cw) / 2, rh = 22, y0 = 90, k = s.f[0];
      ['p', 'q', 'pide', 'da'].forEach((h, j) => TK.label(p, C, h, x0 + (j + 0.5) * cw, y0 + rh / 2, j === 2 ? C.coral : j === 3 ? C.brand : C.mute, 11, cw));
      CASES.forEach(([a, b], i) => {
        const y = y0 + (i + 1) * rh + rh / 2, got = k >= 0 ? OPS[k][1](a, b) : null, hit = got === r.out[i];
        [a, b, r.out[i]].forEach((v, j) => TK.label(p, C, v ? 'V' : 'F', x0 + (j + 0.5) * cw, y, j === 2 ? C.ink : C.mute, 12, cw));
        TK.label(p, C, got === null ? '·' : got ? 'V' : 'F', x0 + 3.5 * cw, y, got === null ? C.mute : hit ? C.ok : C.bad, 12, cw);
      });
    },
  });
})();
