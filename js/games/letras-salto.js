// Letras que saltan (Preuniversitario, pu-se-2; spec 2026-11-18-preuda-razonamiento-completo): cada letra vale su posición en
// el alfabeto sin Ñ (A = 1 … Z = 26). Las letras se ven como barras de esa altura; se arrastra la barra de la que sigue y
// abajo se leen las posiciones y los saltos entre ellas.
// params = { rounds: [{ seq: ['B', 'D', …], need: 'X' }] }   state = { rounds: [{ v }] }   (v de 1 a 26)
GAMES['letras-salto'] = (() => {
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', pos = l => ABC.indexOf(l) + 1;
  return SUC.nextGame({
    prompt: () => '¿Qué letra sigue? (sin Ñ: A = 1, …, Z = 26)',
    foot: 'Arrastra la barra: su altura es la posición de la letra',
    terms: r => [...r.seq.map(pos), null],
    need: r => pos(r.need),
    range: () => [1, 26],
    fmt: v => ABC[v - 1] || '?',
    extra: G => {
      const { p, C, T } = G, b = G.b, w = b.w / T.length, y = b.y + b.h + 14;
      T.forEach((t, i) => TK.label(p, C, String(t), b.x + (i + 0.5) * w, y, C.mute, 10, w));
      T.slice(1).forEach((t, i) => { const d = t - T[i]; TK.label(p, C, `${d >= 0 ? '+' : ''}${d}`, b.x + (i + 1) * w, y + 16, C.coral, 9, w); });
    },
  });
})();
