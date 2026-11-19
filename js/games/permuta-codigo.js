// El código que reordena (Preuniversitario, pu-cd-2; spec 2026-11-18-preuda-razonamiento-completo): un código que no cambia
// las letras, solo su orden. Con los ejemplos se descubre a qué lugar va cada letra, y se arrastran las letras de la palabra
// nueva a las casillas en el orden del código.
// params = { rounds: [{ ex: [[palabra, cifrada], …] (letras distintas), word }] }   state = { rounds: [{ f: [ficha | −1] }] }
GAMES['permuta-codigo'] = (() => {
  const perm = r => { const [a, b] = r.ex[0]; return [...b].map(c => a.indexOf(c)); };
  const out = r => perm(r).map(i => r.word[i]).join('');
  const tray = r => [...new Set(r.word)].sort();
  return CODK.fillGame({
    aspect: 1.3,
    prompt: r => `¿Cómo se escribe ${r.word} en este código?`,
    foot: 'Arrastra las letras en el orden del código',
    tray,
    need: r => [...out(r)].map(c => tray(r).indexOf(c)),
    over: (r, i) => `${i + 1}`,
    done: r => `${r.word} se escribe ${out(r)}`,
    col: C => C.mint,
    decor(G) {
      const { p, C, r } = G;
      TK.label(p, C, 'Ejemplos:', G.W / 2, 94, C.mute, 10, G.W - 30);
      r.ex.forEach(([w, c], i) => TK.label(p, C, `${w}  →  ${c}`, G.W / 2, 118 + i * 24, C.ink, 15, G.W - 30));
      TK.label(p, C, `${r.word}  →  ?`, G.W / 2, 118 + r.ex.length * 24 + 8, C.brand, 15, G.W - 30);
    },
  });
})();
