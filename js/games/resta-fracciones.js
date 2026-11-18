// El signo menos de la resta (Álgebra, alg-25b; spec 2026-11-18-algebra-revision): al restar una fracción, el menos afecta
// a TODO su numerador; la que se suma no cambia. Sobre el común denominador están A − (B) + (C); se arrastra el signo menos
// sobre los términos que deben cambiar de signo. Un término que ya cambió sale de su paréntesis con el signo nuevo.
// params = { rounds: [{ A: [términos], B: [términos], C?: [términos], den }] }   (términos con signo: '3x', '-2')
// state = { rounds: [{ flip: ['b0', 'c1', …] }] }
GAMES['resta-fracciones'] = (() => {
  const ok = (s, r) => s.flip.length === r.B.length && r.B.every((_, i) => s.flip.includes(`b${i}`));
  const neg = t => (t.startsWith('-') ? `+${t.slice(1)}` : `-${t.replace(/^\+/, '')}`);
  const join = ts => ts.map((t, i) => (i === 0 ? t.replace(/^\+/, '') : t.startsWith('-') ? ` - ${t.slice(1)}` : ` + ${t.replace(/^\+/, '')}`)).join('');
  const result = (r, s) => [...r.A, ...r.B.map((t, i) => (s.flip.includes(`b${i}`) ? neg(t) : t)), ...(r.C || []).map((t, i) => (s.flip.includes(`c${i}`) ? neg(t) : t))];
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ flip: [] }),
    ok,
    answered: s => s.flip.length > 0,
    solution: r => `(${join(result(r, { flip: r.B.map((_, i) => `b${i}`) }))}) / (${r.den})`,
    prompt: r => `Opera: $\\dfrac{${join(r.A)}}{${r.den}} - \\dfrac{${join(r.B)}}{${r.den}}${r.C ? ` + \\dfrac{${join(r.C)}}{${r.den}}` : ''}$`,
    foot: () => 'Arrastra el signo menos sobre los términos que cambian de signo',
    layout(G) { G.ty = 150; G.src = { x: 20, y: 214, w: 44, h: 36 }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { flip: r.B.map((_, i) => `b${i}`) } : G.s, Cs = r.C || [], n = r.A.length + r.B.length + Cs.length, w = Math.min(58, (G.W - 40 - 44 * (Cs.length ? 2 : 1)) / n - 4);
      let x = 16; G.bt = [];
      const put = (id, tex, col) => { const b = { id, x, y: G.ty, w, h: 36 }; if (id) G.bt.push(b); RK.chip(p, C, b, `$${tex}$`, { on: true, col, size: 12 }); x += w + 4; };
      r.A.forEach(t => put(null, t, C.sky));
      const group = (key, list, sign, col) => {
        list.forEach((t, i) => { if (s.flip.includes(`${key}${i}`)) put(`${key}${i}`, neg(t), C.mint); });
        const rest = list.map((_, i) => i).filter(i => !s.flip.includes(`${key}${i}`));
        if (!rest.length) return;
        TK.label(p, C, `${sign}(`, x + 9, G.ty + 18, C.ink, 15, 26); x += 22;
        rest.forEach(i => put(`${key}${i}`, list[i], col));
        TK.label(p, C, ')', x + 2, G.ty + 18, C.ink, 15, 16); x += 12;
      };
      group('b', r.B, '−', C.coral); group('c', Cs, '+', C.sky);
      TK.label(p, C, `sobre ${r.den}`, G.W / 2, G.ty + 54, C.mute, 11, 120);
      RK.chip(p, C, G.src, '−', { on: true, col: C.brand, size: 20 });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 18, y: G.drag.y - 18, w: 36, h: 36 }, '−', { on: true, col: C.brand, size: 20 });
      RK.strip(p, C, G.fb, `$\\dfrac{${join(result(r, s))}}{${r.den}}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (hitBox(G.src, x, y)) { G.drag = { x, y }; return true; } return false; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; const b = (G.bt || []).find(b => hitBox({ x: b.x - 3, y: b.y - 8, w: b.w + 6, h: b.h + 16 }, x, y)); if (b) { const f = G.s.flip, k = f.indexOf(b.id); if (k >= 0) f.splice(k, 1); else f.push(b.id); G.touch(); } },
    demo(G) { const b = G.bt?.[G.bt.length - 1]; return b ? { from: { x: G.src.x + 22, y: G.src.y + 18 }, to: { x: b.x + b.w / 2, y: b.y + 18 }, text: 'Arrastra el menos', ty: G.src.y + 54 } : null; },
    peek: G => ({ bt: G.bt, src: G.src }),
  });
  return game;
})();
