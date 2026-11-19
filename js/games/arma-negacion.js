// Arma la frase (Preuniversitario, pu-lo-2 y pu-lo-3; spec 2026-11-18-preuda-razonamiento-completo): arriba está una frase o una
// fórmula y lo que se pide de ella (su negación, su contrarrecíproco…). Se arrastran fichas a las casillas para escribirla; las
// fichas pueden ser símbolos ($\neg p$, $\wedge$) o palabras («algún», «no»). Sobran fichas para que no se arme sola.
// params = { rounds: [{ ask, show, tray: [fichas], need: [índice de ficha por casilla] }] }   state = { rounds: [{ f: [ficha | −1] }] }
GAMES['arma-negacion'] = CODK.fillGame({
  aspect: 1.5,
  chipW: 66,
  perRow: 4,
  prompt: r => r.ask,
  foot: 'Arrastra las fichas a las casillas',
  tray: r => r.tray,
  need: r => r.need,
  alt: r => r.alt,
  done: () => 'bien escrita',
  col: C => C.mint,
  decor(G) {
    const { p, C, r } = G;
    p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.card, 200)); p.rect(20, 110, G.W - 40, 56, 10);
    TK.label(p, C, r.show, G.W / 2, 138, C.ink, 15, G.W - 56);
  },
});
