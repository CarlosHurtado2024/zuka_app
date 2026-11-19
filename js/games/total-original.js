// ¿Cuánto había al principio? (Preuniversitario, pu-ar-1; spec 2026-11-18-preuda-razonamiento-completo): se sabe lo que quedó
// después de unas compras con fracciones, y se busca lo que había. Se desliza el total; el juego aplica las compras a ese total,
// dibuja la barra de lo que queda y la compara con lo que se sabe que quedó.
// params = { rounds: [{ steps: [[num, den, 'total' | 'resto']], left, step, max }] }   state = { rounds: [{ t }] }
GAMES['total-original'] = (() => {
  const rest = (r, t) => { let rem = t; r.steps.forEach(([n, d, of]) => { rem -= (of === 'total' ? t : rem) * n / d; }); return rem; };
  const need = r => { for (let t = r.step; t <= r.max; t += r.step) if (Math.abs(rest(r, t) - r.left) < 1e-9) return t; return null; };
  const ok = (s, r) => Math.abs(rest(r, s.t) - r.left) < 1e-9;
  const N = r => Math.round(r.max / r.step);
  const fmt = v => (Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v).toLocaleString('es-CO') : v.toFixed(1));
  const game = roundsGame({
    aspect: 1.15,
    init: r => ({ t: need(r) === r.step ? 2 * r.step : r.step }),
    ok,
    solution: r => `había ${fmt(need(r))}`,
    prompt: r => `Al final le quedan ${fmt(r.left)}. ¿Cuánto tenía?`,
    foot: () => 'Desliza el total hasta que quede lo que se sabe',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { t: need(r) } : G.s, good = ok(s, r), x0 = 20, Wt = G.W - 40, sc = Wt / r.max, rem = rest(r, s.t);
      p.noStroke(); p.fill(RK.al(p, C.line, 80)); p.rect(x0, 130, s.t * sc, 34, 6);
      p.fill(good ? C.ok : C.sky); p.rect(x0 + (s.t - rem) * sc, 130, rem * sc, 34, 6);
      r.steps.forEach(([n, d, of], k) => TK.label(p, C, `${k ? 'luego ' : ''}gastó $\\tfrac{${n}}{${d}}$ ${of === 'total' ? 'del total' : 'de lo que quedaba'}`, G.W / 2, 92 + k * 18, C.ink, 11, G.W - 30));
      TK.label(p, C, `total ${fmt(s.t)}`, x0 + 50, 122, C.mute, 10, 100);
      p.stroke(C.coral); p.strokeWeight(2); p.drawingContext.setLineDash([5, 4]); p.noFill(); p.rect(x0 + (s.t - r.left) * sc, 182, r.left * sc, 26, 5); p.drawingContext.setLineDash([]);
      TK.label(p, C, `debe quedar ${fmt(r.left)}`, G.W / 2, 226, C.coral, 10, G.W - 40);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, N(r), s.t / r.step - 1, k => null, good ? C.ok : C.brand);
      RK.strip(p, C, G.fb, `$\\text{con ${fmt(s.t)} quedan ${fmt(rem)}}$`, { kicker: good ? 'coincide' : rem < r.left ? 'queda poco: sube el total' : 'queda mucho: baja el total', col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 28) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.t / G.r.step - 1), y: G.tY }, to: { x: G.X(G.s.t / G.r.step - 1) + 70, y: G.tY }, text: 'Desliza el total', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const r = G.r, t = (RK.pick(x, 30, G.W - 30, N(r)) + 1) * r.step; if (t !== G.s.t || !G.touched[G.cur]) { G.s.t = t; G.touch(); } };
  return Object.assign(game, { answer: r => ({ t: need(r) }) });
})();
