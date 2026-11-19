// Las diferencias de las diferencias (Preuniversitario, pu-se-1; spec 2026-11-18-preuda-razonamiento-completo): si las
// diferencias no son iguales, a veces lo son las diferencias de las diferencias (como en los cuadrados). Se arrastra el
// término que sigue; abajo se ven en vivo la fila de diferencias y la de segundas diferencias.
// params = { rounds: [{ seq: [términos conocidos], hi }] }   state = { rounds: [{ v }] }
GAMES['diferencias-escalera'] = SUC.nextGame({
  prompt: () => '¿Qué número sigue? Mira las diferencias de las diferencias',
  terms: r => [...r.seq, null],
  need: r => { const s = r.seq, n = s.length, d1 = s[n - 1] - s[n - 2], d2 = d1 - (s[n - 2] - s[n - 3]); return s[n - 1] + d1 + d2; },
  range: r => [0, r.hi],
  extra: G => {
    const { p, C, T } = G, b = G.b, w = b.w / T.length, y = b.y + b.h + 14;
    T.slice(1).forEach((t, i) => { const d = t - T[i]; TK.label(p, C, `${d >= 0 ? '+' : ''}${d}`, b.x + (i + 1) * w, y, C.coral, 10, w); });
    const D = T.slice(1).map((t, i) => t - T[i]);
    D.slice(1).forEach((t, i) => { const d = t - D[i]; TK.label(p, C, `${d >= 0 ? '+' : ''}${d}`, b.x + (i + 1.5) * w, y + 16, C.mute, 9, w); });
  },
});
