// La cinta de la ecuación (Preuniversitario, pu-ec-1 y pu-ec-2; spec 2026-11-18-preuda-razonamiento-completo): un problema de
// texto se dibuja como una cinta: cada cantidad es un tramo hecho de x y de un pedazo fijo («Sara tiene 4 más que su
// hermano»: x y x + 4). Se desliza x y la cinta crece; hay que dejarla justo del largo del total.
// params = { rounds: [{ parts: [[coef, constante, rótulo]], total, lo, hi }] }   state = { rounds: [{ x }] }
GAMES['cinta-ecuacion'] = (() => {
  const len = (r, x) => r.parts.reduce((a, [c, k]) => a + c * x + k, 0);
  const need = r => { for (let x = r.lo; x <= r.hi; x++) if (len(r, x) === r.total) return x; return null; };
  const ok = (s, r) => len(r, s.x) === r.total;
  const N = r => r.hi - r.lo + 1;
  const term = (c, k) => { if (c === -1 && k > 0) return `${k} - x`; const a = c === 1 ? 'x' : c === -1 ? '-x' : c === 0 ? '' : `${c}x`; return k ? (a ? `${a} ${k > 0 ? '+' : '-'} ${Math.abs(k)}` : `${k}`) : a; };
  const game = roundsGame({
    aspect: 1.15,
    init: r => ({ x: need(r) === r.lo ? r.lo + 1 : r.lo }),
    ok,
    solution: r => `x = ${need(r)}`,
    prompt: r => r.say || `${r.parts.map(p => p[2]).join(" + ")} = ${r.total}`,
    foot: () => 'Desliza x hasta que la cinta llegue al total',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { x: need(r) } : G.s, good = ok(s, r), x0 = 20, Wt = G.W - 40, top = r.total * 1.25, sc = Wt / top, cols = [C.sky, C.coral, C.mint, C.sun];
      p.stroke(C.ink); p.strokeWeight(1.5); p.drawingContext.setLineDash([6, 4]); p.noFill(); p.rect(x0, 112, r.total * sc, 40, 6); p.drawingContext.setLineDash([]);
      TK.label(p, C, `total ${r.total}`, x0 + r.total * sc / 2, 102, C.ink, 10, 120);
      let x = x0;
      const segs = r.parts.map(([c, k, lab], i) => {
        const v = c * s.x + k, w = Math.max(0, Math.min(v * sc, x0 + Wt - x)), seg = { x, w, v, c, k, lab, i };
        p.noStroke(); p.fill(RK.al(p, cols[i % 4], 200)); p.rect(x, 116, w, 32, 4);
        x += w; return seg;
      });
      segs.forEach(({ x, w, v, c, k, lab, i }) => {
        if (w > 34) TK.label(p, C, `$${term(c, k)}$`, x + w / 2, 132, inkOn(cols[i % 4]), 11, w - 4);
        TK.label(p, C, `${lab}: ${v}`, x + w / 2, 166 + i * 15, C.mute, 9, Math.max(w, 70));
      });
      const L = len(r, s.x), cs = r.parts.reduce((a, p) => a + p[0], 0), ks = r.parts.reduce((a, p) => a + p[1], 0);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, N(r), s.x - r.lo, k => ((r.lo + k) % 5 === 0 ? String(r.lo + k) : null), good ? C.ok : C.brand);
      RK.strip(p, C, G.fb, `$${term(cs, ks)} = ${L}$`, { kicker: good ? `x = ${s.x}: llega justo` : L < r.total ? 'le falta' : 'se pasa', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 28) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.x - G.r.lo), y: G.tY }, to: { x: G.X(G.s.x - G.r.lo) + 60, y: G.tY }, text: 'Desliza x', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const r = G.r, v = r.lo + RK.pick(x, 30, G.W - 30, N(r)); if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ x: need(r) }) });
})();
