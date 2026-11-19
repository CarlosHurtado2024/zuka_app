// Sucesiones tipo Fibonacci (Preuniversitario, pu-se-1; spec 2026-11-18-preuda-razonamiento-completo): cada término es la suma
// de los dos anteriores. Falta uno en el medio; se arrastra su barra hasta el valor que hace que la regla se cumpla en todo
// el resto. Debajo de cada término se ve la suma de los dos anteriores y si coincide.
// params = { rounds: [{ seq: [términos con null en el que falta], hi }] }   state = { rounds: [{ v }] }
GAMES['fibonacci-suma'] = SUC.nextGame({
  prompt: () => 'Cada término es la suma de los dos anteriores. ¿Cuál falta?',
  foot: 'Arrastra la barra que falta; abajo se comprueba cada suma',
  terms: r => r.seq,
  need: r => { const k = r.seq.indexOf(null); return k >= 2 ? r.seq[k - 1] + r.seq[k - 2] : r.seq[k + 1] - r.seq[k - 1]; },
  range: r => [0, r.hi],
  extra: G => {
    const { p, C, T } = G, b = G.b, w = b.w / T.length, y = b.y + b.h + 14;
    T.forEach((t, i) => { if (i < 2) return; const sum = T[i - 1] + T[i - 2]; TK.label(p, C, `${T[i - 2]}+${T[i - 1]}`, b.x + (i + 0.5) * w, y, sum === t ? C.ok : C.bad, 9, w); });
  },
});
