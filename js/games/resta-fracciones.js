// El signo menos de la resta (Álgebra, alg-25b; spec 2026-11-18-algebra-revision): al restar una fracción, el menos
// afecta a TODO su numerador. Arriba está A − (numerador de B) sobre el común denominador; se arrastra el signo menos sobre
// cada término del numerador de B para cambiarle el signo. Si falta alguno, la resta queda mal.
// params = { rounds: [{ A: [términos], B: [términos], den }] }   (términos con signo: '3x', '-2')   state = { rounds: [{ flip: [índices] }] }
GAMES['resta-fracciones'] = (() => {
  const ok = (s, r) => s.flip.length === r.B.length;
  const neg = t => (t.startsWith('-') ? `+${t.slice(1)}` : `-${t.replace(/^\+/, '')}`);
  const join = ts => ts.map((t, i) => (i === 0 ? t.replace(/^\+/, '') : t.startsWith('-') ? ` - ${t.slice(1)}` : ` + ${t.replace(/^\+/, '')}`)).join('');
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ flip: [] }),
    ok,
    answered: s => s.flip.length > 0,
    solution: r => `(${join([...r.A, ...r.B.map(neg)])}) / (${r.den})`,
    prompt: r => `Resta: $\\dfrac{${join(r.A)}}{${r.den}} - \\dfrac{${join(r.B)}}{${r.den}}$`,
    foot: () => 'Arrastra el signo menos sobre cada término de la segunda fracción',
    layout(G) { G.ty = 150; G.src = { x: 20, y: 214, w: 44, h: 36 }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { flip: r.B.map((_, i) => i) } : G.s, w = Math.min(60, (G.W - 84) / (r.A.length + r.B.length) - 4);
      let x = 20; G.bt = [];
      r.A.forEach(t => { RK.chip(p, C, { x, y: G.ty, w, h: 36 }, `$${t}$`, { on: true, col: C.sky, size: 13 }); x += w + 4; });
      // Los términos que ya recibieron el menos salen del paréntesis con su signo nuevo; los demás siguen dentro de −( … ).
      r.B.forEach((t, i) => { if (!s.flip.includes(i)) return; const b = { i, x, y: G.ty, w, h: 36 }; G.bt.push(b); RK.chip(p, C, b, `$${neg(t)}$`, { on: true, col: C.ok, size: 13 }); x += w + 4; });
      const rest = r.B.map((t, i) => i).filter(i => !s.flip.includes(i));
      if (rest.length) {
        TK.label(p, C, '−(', x + 8, G.ty + 18, C.ink, 16, 30); x += 22;
        rest.forEach(i => { const b = { i, x, y: G.ty, w, h: 36 }; G.bt.push(b); RK.chip(p, C, b, `$${r.B[i]}$`, { on: true, col: C.coral, size: 13 }); x += w + 4; });
        TK.label(p, C, ')', x + 4, G.ty + 18, C.ink, 16, 20);
      }
      TK.label(p, C, `sobre ${r.den}`, G.W / 2, G.ty + 54, C.mute, 11, 120);
      RK.chip(p, C, G.src, '−', { on: true, col: C.brand, size: 20 });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 18, y: G.drag.y - 18, w: 36, h: 36 }, '−', { on: true, col: C.brand, size: 20 });
      const res = [...r.A, ...r.B.map((t, i) => (s.flip.includes(i) ? neg(t) : t))];
      RK.strip(p, C, G.fb, `$\\dfrac{${join(res)}}{${r.den}}$`, { kicker: ok(s, r) ? 'El menos llegó a todos' : 'Al menos un término no cambió de signo', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (hitBox(G.src, x, y)) { G.drag = { x, y }; return true; } return false; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; const b = (G.bt || []).find(b => hitBox({ x: b.x - 4, y: b.y - 8, w: b.w + 8, h: b.h + 16 }, x, y)); if (b) { const f = G.s.flip, k = f.indexOf(b.i); if (k >= 0) f.splice(k, 1); else f.push(b.i); G.touch(); } },
    demo(G) { const b = G.bt?.[0]; return b ? { from: { x: G.src.x + 22, y: G.src.y + 18 }, to: { x: b.x + b.w / 2, y: b.y + 18 }, text: 'Arrastra el menos', ty: G.src.y + 54 } : null; },
    peek: G => ({ bt: G.bt, src: G.src }),
  });
  return game;
})();
