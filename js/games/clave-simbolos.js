// Clave de símbolos (Preuniversitario, pu-cd-1 y pu-cd-2; spec 2026-11-18-preuda-razonamiento-completo): cada letra se cambia
// siempre por el mismo símbolo. Arriba está la tabla de la clave (o, si hay `ex`, unos ejemplos ya cifrados de donde hay que
// sacarla); se arrastran fichas para cifrar una palabra (mode 'code') o para descifrar un mensaje (mode 'decode').
// params = { rounds: [{ key: [[letra, símbolo], …], word, mode, ex?: [[palabra, cifrada], …] }] }   state = { rounds: [{ f: [ficha | −1] }] }
GAMES['clave-simbolos'] = (() => {
  const L = r => r.key.map(k => k[0]), S = r => r.key.map(k => k[1]);
  const coded = r => [...r.word].map(c => S(r)[L(r).indexOf(c)]);
  return CODK.fillGame({
    aspect: 1.3,
    prompt: r => (r.mode === 'decode' ? 'Descifra el mensaje con la clave' : `Cifra la palabra ${r.word}`),
    tray: r => (r.mode === 'decode' ? L(r) : S(r)),
    need: r => [...r.word].map(c => L(r).indexOf(c)),
    over: (r, i) => (r.mode === 'decode' ? coded(r)[i] : r.word[i]),
    done: r => (r.mode === 'decode' ? `dice ${r.word}` : `${r.word} se cifra ${coded(r).join(' ')}`),
    decor(G) {
      const { p, C, r } = G;
      if (r.ex) {
        TK.label(p, C, 'Ejemplos de la clave:', G.W / 2, 94, C.mute, 10, G.W - 30);
        r.ex.forEach(([w, c], i) => TK.label(p, C, `${w}  →  ${c}`, G.W / 2, 118 + i * 22, C.ink, 14, G.W - 30));
        return;
      }
      const n = r.key.length, cw = Math.min(40, (G.W - 30) / n);
      const x0 = (G.W - n * cw) / 2;
      p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.card, 200)); p.rect(x0 - 4, 96, n * cw + 8, 74, 8);
      r.key.forEach(([l, s], i) => {
        const x = x0 + (i + 0.5) * cw;
        TK.label(p, C, l, x, 114, C.ink, 14, cw);
        TK.label(p, C, '↓', x, 133, C.mute, 10, cw);
        TK.label(p, C, s, x, 152, C.coral, 15, cw);
      });
    },
  });
})();
