// Elegir un comité (Álgebra, alg-24c; spec 2026-11-18-algebra-revision): las maneras de escoger k personas entre n son
// C(n, k), el coeficiente del binomio: de cada paréntesis (1 + x) se toma o no se toma la x. Se arrastra el tamaño del
// comité y se ven todos los comités posibles (si caben) y cuántos son. Hay que llegar a la cantidad pedida.
// params = { rounds: [{ n, ways }] }   state = { rounds: [{ k }] }   (k de 0 a n)
GAMES['elige-comite'] = (() => {
  const C_ = (n, k) => { let v = 1; for (let i = 1; i <= k; i++) v = v * (n - k + i) / i; return Math.round(v); };
  const ok = (s, r) => C_(r.n, s.k) === r.ways;
  const answer = r => ({ k: [...Array(r.n + 1).keys()].find(k => C_(r.n, k) === r.ways) });
  const groups = (n, k) => { const out = []; for (let m = 0; m < 2 ** n && out.length < 40; m++) { let c = 0; for (let i = 0; i < n; i++) if (m & (1 << i)) c++; if (c === k) out.push(m); } return out; };
  const L = 'ABCDEFGH';
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ k: C_(r.n, 0) === r.ways ? 1 : 0 }),
    ok,
    solution: r => `comités de ${answer(r).k} (o de ${r.n - answer(r).k}): C(${r.n}, ${answer(r).k}) = ${r.ways}`,
    prompt: r => `De ${r.n} personas, ¿de qué tamaño es el comité que se puede formar de ${r.ways} maneras?`,
    foot: () => 'Arrastra cuántas personas tiene el comité',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, list = groups(r.n, s.k), cw = Math.max(26, s.k * 9 + 14), cols = Math.max(1, Math.floor((G.W - 20) / cw));
      list.forEach((m, j) => { const x = 12 + (j % cols) * cw, y = 102 + Math.floor(j / cols) * 16; const txt = [...L.slice(0, r.n)].filter((_, i) => m & (1 << i)).join(''); TK.label(p, C, txt || '∅', x + cw / 2, y + 6, C.sky, 10, cw - 4); });
      const tot = C_(r.n, s.k);
      TK.label(p, C, `${tot} comité${tot === 1 ? '' : 's'} de ${s.k}${tot > 40 ? ' (se ven 40)' : ''}`, G.W / 2, G.tY - 40, ok(s, r) ? C.ok : C.ink, 12, G.W - 30);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, r.n + 1, s.k, i => String(i));
      RK.strip(p, C, G.fb, `$C(${r.n}, ${s.k}) = ${tot}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X(1), y: G.tY }, text: 'Arrastra el tamaño', ty: G.tY - 60 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, G.r.n + 1); if (v !== G.s.k || !G.touched[G.cur]) { G.s.k = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
