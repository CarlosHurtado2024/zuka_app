// Dos sucesiones intercaladas (Preuniversitario, pu-se-1 y pu-se-2; spec 2026-11-18-preuda-razonamiento-completo): a veces
// los términos de las posiciones impares siguen una regla y los de las pares otra. Las barras se pintan de dos colores según
// la posición; se arrastra el término que sigue (que pertenece a una de las dos).
// params = { rounds: [{ seq: [términos conocidos], need, hi }] }   state = { rounds: [{ v }] }
GAMES['alterna-dos'] = SUC.nextGame({
  prompt: () => '¿Qué sigue? Hay dos sucesiones intercaladas',
  terms: r => [...r.seq, null],
  need: r => r.need,
  range: r => [0, r.hi],
  color: (C, i) => (i % 2 ? C.coral : C.sky),
});
