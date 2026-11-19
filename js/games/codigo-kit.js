// Kit de los códigos (Preuniversitario, mundo «Codificación»; spec 2026-11-18-preuda-razonamiento-completo): una fila de
// casillas que se llena arrastrando fichas de una bandeja (las fichas no se gastan: se pueden usar varias veces). Cada juego da
// lo que se ve arriba (la clave, los ejemplos) y qué ficha va en cada casilla.
// o = { aspect, prompt(r), foot, tray(r) → [rótulos], need(r) → [índice de ficha por casilla], over(r, i) → rótulo sobre la
//       casilla i, decor(G), done(r) → texto al acertar, col(C), alt(r) → [[otras respuestas igual de válidas]] (p. ej. ¬q ∨ ¬p) }
const CODK = (() => {
  function fillGame(o) {
    const ok = (s, r) => [o.need(r), ...(o.alt ? o.alt(r) || [] : [])].some(nd => nd.every((k, i) => s.f[i] === k));
    const answer = r => ({ f: o.need(r).slice() });
    const game = roundsGame({
      aspect: o.aspect || 1.25,
      init: r => ({ f: o.need(r).map(() => -1) }),
      answered: s => s.f.some(k => k >= 0),
      ok,
      solution: r => o.need(r).map(k => o.tray(r)[k]).join(' '),
      prompt: o.prompt,
      foot: () => o.foot || 'Arrastra fichas de la bandeja a las casillas',
      layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
      enter(G) { G.drag = null; },
      draw(G) {
        const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r), n = o.need(r).length, T = o.tray(r);
        o.decor?.({ ...G, s });
        const sw = Math.min(o.chipW || 46, (G.W - 32) / n - 6), sy = G.slotY || 232, x0 = (G.W - n * (sw + 6) + 6) / 2;
        G.slots = Array.from({ length: n }, (_, i) => ({ x: x0 + i * (sw + 6), y: sy, w: sw, h: 40 }));
        G.slots.forEach((b, i) => {
          if (o.over) TK.label(p, C, o.over(r, i), b.x + b.w / 2, b.y - 12, C.ink, 13, b.w + 4);
          const k = s.f[i];
          if (k >= 0) RK.chip(p, C, b, T[k], { on: true, col: good ? C.ok : (o.col?.(C) || C.sky), size: 14 });
          else { p.noFill(); p.stroke(C.line); p.strokeWeight(1.2); p.drawingContext.setLineDash([4, 3]); p.rect(b.x, b.y, b.w, b.h, 8); p.drawingContext.setLineDash([]); }
        });
        const per = Math.min(T.length, o.perRow || 7), tw = Math.min(o.chipW || 44, (G.W - 24) / per - 6), rows = Math.ceil(T.length / per), ty0 = G.H - 80 - rows * 46;
        G.tray = T.map((t, i) => { const row = Math.floor(i / per), inRow = Math.min(per, T.length - row * per), tx0 = (G.W - inRow * (tw + 6) + 6) / 2; return { x: tx0 + (i % per) * (tw + 6), y: ty0 + row * 46, w: tw, h: 38, k: i }; });
        G.tray.forEach(b => RK.chip(p, C, b, T[b.k], { on: false, size: 14 }));
        if (G.drag) RK.chip(p, C, { x: G.drag.x - tw / 2, y: G.drag.y - 19, w: tw, h: 38 }, T[G.drag.k], { on: true, col: C.brand, size: 14 });
        RK.strip(p, C, G.fb, good ? ((d => (d.includes('$') ? d : `$\\text{${d}}$`))(o.done ? o.done(r) : 'código correcto')) : '$\\text{completa todas las casillas}$', { col: G.locked || good ? C.ok : C.brand, size: 15 });
      },
      press(G, x, y) {
        const t = (G.tray || []).find(b => hitBox(b, x, y));
        if (t) { G.drag = { k: t.k, x, y }; return true; }
        const i = (G.slots || []).findIndex(b => hitBox(b, x, y));
        if (i >= 0 && G.s.f[i] >= 0) { G.drag = { k: G.s.f[i], x, y }; G.s.f[i] = -1; G.touch(); return true; }
        return false;
      },
      drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
      release(G, x, y) { if (!G.drag) return; const i = (G.slots || []).findIndex(b => hitBox({ x: b.x - 6, y: b.y - 10, w: b.w + 12, h: b.h + 20 }, x, y)); if (i >= 0) { G.s.f[i] = G.drag.k; G.touch(); } G.drag = null; },
      // La mano arrastra una ficha que NO es la de la respuesta (así la demostración no regala nada).
      demo(G) { const need = o.need(G.r), n = (G.tray || []).length, k = [...Array(n).keys()].find(i => !need.includes(i)) ?? (need[0] + 1) % Math.max(n, 1), t = G.tray?.[k], sl = G.slots?.[0]; if (!t || !sl) return null; return { from: { x: t.x + t.w / 2, y: t.y + 19 }, to: { x: sl.x + sl.w / 2, y: sl.y + 20 }, text: 'Arrastra una ficha', ty: Math.min(sl.y + 58, (sl.y + 40 + Math.min(...G.tray.map(b => b.y))) / 2) }; },
      peek: G => ({ slots: G.slots, tray: G.tray }),
    });
    return Object.assign(game, { answer });
  }
  return { fillGame };
})();
