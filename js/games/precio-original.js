// El precio de antes (Álgebra, alg-13c; spec 2026-11-18-algebra-revision): para volver al precio original se divide entre
// el factor, no se resta el porcentaje. La barra del precio de antes se estira con la manija; el cambio la recorta (o la
// alarga) y el precio de ahora queda al lado. Hay que encontrar el precio de antes que da el precio que se ve en la
// etiqueta.
// params = { rounds: [{ r, now, step, max }] }   (r: cambio en %, negativo = descuento)   state = { rounds: [{ old }] }
GAMES['precio-original'] = (() => {
  const need = r => r.now / (1 + r.r / 100);
  const ok = (s, r) => Math.abs(s.old - need(r)) < 1e-9;
  const game = roundsGame({
    aspect: 1,
    init: r => ({ old: r.now }),
    ok,
    solution: r => `${need(r)}: ${need(r)} × ${1 + r.r / 100} = ${r.now}`,
    prompt: r => `Ahora cuesta ${r.now} mil tras ${r.r < 0 ? 'un descuento' : 'un aumento'} del ${Math.abs(r.r)} %. ¿Y antes?`,
    foot: () => 'Arrastra la manija del precio de antes',
    layout(G) { G.y1 = 132; G.y2 = 200; G.tY = G.H - 120; G.fb = { x: 12, y: G.H - 76, w: G.W - 24, h: 48 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, old = G.locked && !ok(G.s, r) ? need(r) : G.s.old, nw = old * (1 + r.r / 100), u = (G.W - 60) / (r.max * 1.25);
      TK.label(p, C, 'antes', 30, G.y1 - 18, C.mute, 10, 50); TK.label(p, C, 'ahora', 30, G.y2 - 18, C.mute, 10, 50);
      p.noStroke(); p.fill(C.sky); p.rect(20, G.y1, old * u, 28, 5); TK.label(p, C, `${+old.toFixed(2)}`, 20 + old * u + 22, G.y1 + 14, C.ink, 12, 50);
      p.fill(r.r < 0 ? C.coral : C.mint); p.rect(20, G.y2, nw * u, 28, 5); TK.label(p, C, `${+nw.toFixed(2)}`, 20 + nw * u + 22, G.y2 + 14, C.ink, 12, 50);
      p.stroke(C.ok); p.strokeWeight(2); p.line(20 + r.now * u, G.y2 - 8, 20 + r.now * u, G.y2 + 36); TK.label(p, C, `etiqueta: ${r.now}`, Math.min(G.W - 50, 20 + r.now * u), G.y2 + 48, C.ok, 11, 90);
      const n = Math.round(r.max / r.step);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, n, Math.round(old / r.step) - 1, k => ((k + 1) % 4 === 0 ? String((k + 1) * r.step) : null));
      RK.strip(p, C, G.fb, `$${+old.toFixed(2)} \\times ${1 + r.r / 100} = ${+nw.toFixed(2)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(Math.round(G.s.old / G.r.step) - 1), y: G.tY }, to: { x: G.X(Math.round(G.s.old / G.r.step) + 3), y: G.tY }, text: 'Arrastra el precio de antes', ty: G.tY - 36 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const r = G.r, v = (RK.pick(x, 30, G.W - 30, Math.round(r.max / r.step)) + 1) * r.step; if (v !== G.s.old || !G.touched[G.cur]) { G.s.old = v; G.touch(); } };
  return Object.assign(game, { need });
})();
