// La mediana pide orden (Preuniversitario, pu-gr-2; spec 2026-11-18-preuda-razonamiento-completo): los datos llegan
// revueltos. Se arrastran fichas a las casillas para escribirlos de menor a mayor (cada dato tantas veces como aparezca); la
// casilla del medio (o las dos del medio) está marcada, y al quedar en orden el juego dice la mediana.
// params = { rounds: [{ data: [números] }] }   state = { rounds: [{ f: [ficha | −1] }] }
GAMES['ordena-mediana'] = (() => {
  const tray = r => [...new Set(r.data)];
  const sorted = r => r.data.slice().sort((a, b) => a - b);
  const med = r => { const s = sorted(r), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const mid = (r, i) => { const n = r.data.length; return n % 2 ? i === (n - 1) / 2 : i === n / 2 - 1 || i === n / 2; };
  return CODK.fillGame({
    aspect: 1.4,
    prompt: () => 'Ordena los datos de menor a mayor',
    foot: 'Arrastra los valores en orden; cada uno tantas veces como aparezca',
    tray,
    need: r => sorted(r).map(v => tray(r).indexOf(v)),
    over: (r, i) => (mid(r, i) ? 'medio' : ''),
    done: r => `la mediana es ${med(r)}`,
    col: C => C.mint,
    decor(G) {
      const { p, C, r } = G;
      TK.label(p, C, 'Datos:', G.W / 2, 100, C.mute, 10, 80);
      TK.label(p, C, r.data.join('   '), G.W / 2, 128, C.ink, 16, G.W - 30);
      TK.label(p, C, `${r.data.length} datos`, G.W / 2, 156, C.mute, 10, 120);
    },
  });
})();
