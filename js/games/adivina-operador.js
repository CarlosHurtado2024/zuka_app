// ¿Cuál es la regla del operador? (Preuniversitario, pu-op-1; spec 2026-11-18-preuda-razonamiento-completo): unos ejemplos de
// a ★ b ya calculados. Se arrastra una regla (como 2a − b o a·b − 1) a la casilla y el juego la prueba con cada ejemplo, en
// vivo; la buena sirve para todos.
// params = { rounds: [{ sym, ex: [[a, b, resultado]], rules: [{ tex, f }], ok: índice de la regla buena }] }   state = { rounds: [{ f: [regla | −1] }] }
GAMES['adivina-operador'] = CODK.fillGame({
  aspect: 1.55,
  chipW: 76,
  perRow: 2,
  prompt: () => 'Descubre la regla del operador',
  foot: 'Arrastra una regla a la casilla',
  tray: r => r.rules.map(x => `$${x.tex}$`),
  need: r => [r.ok],
  over: r => `$a ${r.sym} b =$`,
  done: r => `$a ${r.sym} b = ${r.rules[r.ok].tex}$`,
  decor(G) {
    const { p, C, r, s } = G, k = s.f[0], cw = Math.min(80, (G.W - 30) / 3), x0 = (G.W - 3 * cw) / 2;
    ['ejemplo', 'da', 'la regla da'].forEach((h, j) => TK.label(p, C, h, x0 + (j + 0.5) * cw, 96, C.mute, 9, cw));
    r.ex.forEach(([a, b, c], i) => {
      const y = 118 + i * 22, got = k >= 0 ? r.rules[k].f(a, b) : null;
      TK.label(p, C, `$${a} ${r.sym} ${b}$`, x0 + 0.5 * cw, y, C.ink, 12, cw);
      TK.label(p, C, String(c), x0 + 1.5 * cw, y, C.ink, 12, cw);
      TK.label(p, C, got === null ? '·' : String(got), x0 + 2.5 * cw, y, got === null ? C.mute : got === c ? C.ok : C.bad, 12, cw);
    });
  },
});
