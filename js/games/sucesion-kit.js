// Kit de las sucesiones (Preuniversitario, mundo «Secuencias y patrones»; spec 2026-11-18-preuda-razonamiento-completo): un
// juego de «el término que sigue»: se ven los términos como barras y fichas, y se arrastra la altura de la barra que falta
// (el valor que se propone). Cada juego da su propia escena de ayuda (diferencias, sumas, colores por posición).
// o = { aspect, prompt(r), foot, terms(r) → [números] (con null en el que falta), need(r), range(r) → [mín, máx] del valor, extra(G), fmt(v) → rótulo, noBars }
const SUC = (() => {
  function nextGame(o) {
    const ok = (s, r) => s.v === o.need(r);
    const game = roundsGame({
      aspect: o.aspect || 1.25,
      init: r => { const [lo] = o.range(r); return { v: o.need(r) === lo ? lo + 1 : lo }; },
      ok,
      solution: r => (o.fmt ? o.fmt(o.need(r)) : `${o.need(r)}`),
      prompt: o.prompt,
      foot: () => o.foot || 'Arrastra la barra que falta hasta su valor',
      layout(G) { G.b = { x: 20, y: 110, w: G.W - 40, h: G.H - 270 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
      enter(G) { G.grab = false; },
      draw(G) {
        const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { v: o.need(r) } : G.s, good = ok(s, r), T = o.terms(r), n = T.length, b = G.b, [lo0, hi] = o.range(r), lo = Math.min(0, lo0), Y = v => b.y + b.h - (v - lo) / (hi - lo) * b.h, w = b.w / n, y0 = Y(0);
        G.miss = T.indexOf(null); G.Y = Y; G.lo = lo; G.hi = hi; G.vlo = lo0;
        p.stroke(C.line); p.strokeWeight(1); p.line(b.x, y0, b.x + b.w, y0);
        T.forEach((t, i) => {
          const v = t == null ? s.v : t, x = b.x + i * w + w * 0.2, col = o.color ? o.color(C, i, r) : C.sky;
          if (!o.noBars) { p.noStroke(); p.fill(t == null ? (good ? C.ok : C.brand) : col); p.rect(x, Math.min(y0, Y(v)), w * 0.6, Math.abs(Y(v) - y0), 3); }
          TK.label(p, C, o.fmt ? o.fmt(v) : String(v), x + w * 0.3, Y(v) + (v >= 0 ? -10 : 10), t == null ? C.brand : C.ink, 11, w);
        });
        o.extra?.({ ...G, s, T: T.map(t => (t == null ? s.v : t)) });
        const mx = b.x + G.miss * w + w / 2; RK.knob(p, C, mx, Y(s.v), C.brand); G.kx = mx;
        RK.strip(p, C, G.fb, good ? `$\\text{sigue: ${o.fmt ? o.fmt(o.need(r)) : o.need(r)}}$` : `$\\text{¿${o.fmt ? o.fmt(s.v) : s.v}?}$`, { col: G.locked || good ? C.ok : C.brand, size: 17 });
      },
      // Arrastre relativo: cada 8 px desde donde se tocó es una unidad (en el celular la barra es corta y las unidades, muchas);
      // un toque sin arrastrar sube o baja una unidad según se toque por encima o por debajo de la punta.
      press(G, x, y) { const w = G.b.w / o.terms(G.r).length; if (Math.abs(x - G.kx) > w * 0.6 + 10 || !hitBox({ x: G.b.x, y: G.b.y - 20, w: G.b.w, h: G.b.h + 40 }, x, y)) return false; G.grab = { y0: y, v0: G.s.v, moved: false }; return true; },
      drag(G, x, y) { if (!G.grab) return false; if (Math.abs(y - G.grab.y0) > 4) G.grab.moved = true; game.set(G, G.grab.v0 + Math.round((G.grab.y0 - y) / 8)); return true; },
      release(G, x, y) { if (G.grab && !G.grab.moved) game.set(G, G.s.v + (y < G.Y(G.s.v) ? 1 : -1)); G.grab = null; },
      demo: G => ({ from: { x: G.kx, y: G.Y(G.s.v) }, to: { x: G.kx, y: G.Y(G.s.v) - 40 }, text: 'Arrastra la barra', ty: G.b.y + 10 }),
      peek: G => ({ b: G.b, kx: G.kx }),
    });
    game.set = (G, raw) => { const v = Math.max(G.vlo, Math.min(G.hi, raw)); if (v !== G.s.v || !G.touched[G.cur]) { G.s.v = v; G.touch(); } };
    return Object.assign(game, { answer: r => ({ v: o.need(r) }) });
  }
  return { nextGame };
})();
