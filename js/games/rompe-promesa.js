// ¿Cuándo es falsa? (Preuniversitario, pu-lo-1 y pu-lo-3; spec 2026-11-18-preuda-razonamiento-completo): una frase con dos
// partes («si llueve, llevo paraguas») y un tablero de 2 × 2 con los cuatro casos posibles. Se tocan las casillas donde la
// frase queda falsa (o verdadera, según se pida). El condicional solo se rompe en un caso.
// params = { rounds: [{ say, p, q, f(p, q) → bool, want: bool }] }   state = { rounds: [{ m: [4 marcas] }] }   (casillas: p V/F × q V/F)
GAMES['rompe-promesa'] = (() => {
  const CASES = [[true, true], [true, false], [false, true], [false, false]];
  const need = r => CASES.map(([a, b]) => !!r.f(a, b) === r.want);
  const ok = (s, r) => need(r).every((v, i) => s.m[i] === v);
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ m: [false, false, false, false] }),
    answered: s => s.m.some(Boolean),
    ok,
    solution: r => CASES.filter((_, i) => need(r)[i]).map(([a, b]) => `${a ? '' : 'no '}${r.p} y ${b ? '' : 'no '}${r.q}`).join('; '),
    prompt: r => `«${r.say}». Marca los casos en que es ${r.want ? 'verdad' : 'falsa'}`,
    foot: () => 'Toca las casillas para marcarlas',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { m: need(r) } : G.s, good = ok(s, r), lw = 76, cw = (G.W - 30 - lw) / 2, ch = 72, x0 = 15 + lw, y0 = 136;
      TK.label(p, C, r.q, x0 + cw, y0 - 40, C.ink, 11, 2 * cw);
      ['sí', 'no'].forEach((t, j) => TK.label(p, C, t, x0 + (j + 0.5) * cw, y0 - 18, C.mute, 10, cw));
      ['sí', 'no'].forEach((t, i) => { const yy = y0 + (i + 0.5) * ch; TK.label(p, C, t, 15 + lw / 2, yy - 9, C.ink, 11, lw - 4); TK.label(p, C, r.p, 15 + lw / 2, yy + 8, C.mute, 9, lw - 4); });
      G.cells = CASES.map((_, k) => {
        const i = Math.floor(k / 2), j = k % 2, x = x0 + j * cw, y = y0 + i * ch, on = s.m[k];
        p.stroke(C.line); p.strokeWeight(1); p.fill(on ? RK.al(p, r.want ? C.ok : C.coral, 110) : RK.al(p, C.card, 200)); p.rect(x + 3, y + 3, cw - 6, ch - 6, 8);
        if (on) TK.label(p, C, r.want ? 'verdad' : 'falsa', x + cw / 2, y + ch / 2, C.ink, 12, cw - 10);
        return { x: x + 3, y: y + 3, w: cw - 6, h: ch - 6, k };
      });
      const n = s.m.filter(Boolean).length;
      RK.strip(p, C, G.fb, good ? `$\\text{${n === 1 ? 'un solo caso' : n + ' casos'}}$` : `$\\text{${n} marcadas}$`, { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { const c = (G.cells || []).find(b => hitBox(b, x, y)); if (!c) return false; G.s.m[c.k] = !G.s.m[c.k]; G.touch(); return true; },
    demo: G => (G.cells ? { from: { x: G.cells[0].x + 30, y: G.cells[0].y + 30 }, to: { x: G.cells[0].x + 30, y: G.cells[0].y + 30 }, text: 'Toca un caso', ty: G.cells[3].y + G.cells[3].h + 20 } : null),
    peek: G => ({ cells: G.cells }),
  });
  return Object.assign(game, { answer: r => ({ m: need(r) }) });
})();
