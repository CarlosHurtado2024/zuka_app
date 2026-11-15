// Gira el complejo (Álgebra, números complejos; juego dinámico de alg-23c; spec 2026-11-21-dinamicos-mundos-altos):
// como en el video, multiplicar por i es dar un cuarto de vuelta; por −1, media vuelta; y el conjugado es reflejar en
// el eje real. Hay un complejo z en el plano y una estrella. Se llega a la estrella tocando «× i», «× (−1)» o
// «conjugado», sin pasarse del número de movimientos. «↶» deshace el último.
// params = { rounds: [{ title, items: [{ z: [a, b], w: [a, b], max }] }], lives? }   state = { done: [n] }

GAMES['gira-complejos'] = (() => {
  const OPS = [z => [-z[1], z[0]], z => [-z[0], -z[1]], z => [z[0], -z[1]]], NAMES = ['× i', '× (−1)', 'conjugado'];
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  const cx = z => `${z[0] || (z[1] ? '' : 0)}${z[1] ? `${z[1] < 0 ? ' − ' : z[0] ? ' + ' : ''}${Math.abs(z[1]) === 1 ? '' : Math.abs(z[1])}i` : ''}`.trim().replace(/^− /, '−').replace(/-/g, '−');
  // La cadena más corta de movimientos que lleva z a w (o null si no cabe en `max`).
  function route(it) {
    let layer = [{ z: it.z, ops: [] }];
    for (let d = 0; d <= it.max; d++) {
      const hit = layer.find(n => same(n.z, it.w));
      if (hit) return hit.ops;
      layer = layer.flatMap(n => OPS.map((f, k) => ({ z: f(n.z), ops: [...n.ops, k] })));
    }
    return null;
  }
  const apply = (z, ops) => ops.reduce((q, k) => OPS[k](q), z);
  return questGame({
    aspect: 1.35,
    init: it => ({ ops: [] }),
    ok: (s, it) => s.ops.length <= it.max && same(apply(it.z, s.ops), it.w),
    answer: it => ({ ops: route(it) }),
    solution: it => `${cx(it.z)} → ${route(it).map(k => NAMES[k]).join(', ')} → ${cx(it.w)}`,
    prompt: it => `Lleva $z = ${cx(it.z).replace(/−/g, '-')}$ a la estrella en ${it.max} ${it.max === 1 ? 'movimiento' : 'movimientos'} o menos`,
    foot: (it, s) => `Movimientos: ${s.ops.length} de ${it.max}`,
    retry: G => { G.s.ops = []; },
    layout(G) {
      const w = (G.W - 24 - 3 * 8) / 4, y = G.bottom - 40;
      G.btn = [0, 1, 2, 3].map(i => ({ x: 12 + i * (w + 8), y, w, h: 34 }));
      const side = Math.min(G.W - 40, y - G.top - 16);
      G.plane = { cx: G.W / 2, cy: G.top + 6 + side / 2, u: side / 10 };
    },
    draw(G) {
      const { p, C, s, item: it } = G, { cx: ox, cy: oy, u } = G.plane, P = z => [ox + z[0] * u, oy - z[1] * u], z = apply(it.z, s.ops);
      p.stroke(C.line); p.strokeWeight(1);
      for (let i = -5; i <= 5; i++) { p.line(ox + i * u, oy - 5 * u, ox + i * u, oy + 5 * u); p.line(ox - 5 * u, oy + i * u, ox + 5 * u, oy + i * u); }
      p.stroke(C.ink); p.strokeWeight(2); p.line(ox - 5 * u, oy, ox + 5 * u, oy); p.line(ox, oy - 5 * u, ox, oy + 5 * u);
      p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.CENTER, p.CENTER); p.text('real', ox + 5 * u - 14, oy + 9); p.text('imaginario', ox + 30, oy - 5 * u + 6);
      // El camino recorrido, la estrella y el punto.
      let q = it.z; p.stroke(C.line); p.strokeWeight(2); p.noFill();
      for (const k of s.ops) { const n = OPS[k](q); p.line(...P(q), ...P(n)); q = n; }
      const [sx, sy] = P(it.w); p.noStroke(); p.fill(C.N); p.textSize(24); p.text('★', sx, sy + 1);
      const [zx, zy] = P(z); p.stroke(C.sky); p.strokeWeight(3); p.line(ox, oy, zx, zy);
      drawDot(p, C, zx, zy, 13, G.solved ? C.ok : C.sky);
      drawPill(p, C, cx(z), zx, zy - 20, G.solved ? C.ok : C.sky, 12);
      NAMES.forEach((t, i) => drawBtn(p, C, G.btn[i], t, false, C.cream));
      drawBtn(p, C, G.btn[3], '↶', false, C.coral);
    },
    press(G, x, y) {
      const s = G.s, it = G.item, i = G.btn.findIndex(b => hitBox(b, x, y));
      if (i < 0) return false;
      if (i === 3) { s.ops.pop(); return true; }
      s.ops.push(i); G.api.sfx?.tap?.();
      if (same(apply(it.z, s.ops), it.w)) G.good('¡Llegaste a la estrella!');
      else if (s.ops.length >= it.max) G.bad('Se acabaron los movimientos: empieza de nuevo');
      return true;
    },
    peek: G => { const r = route(G.item), pre = G.s.ops.map(() => G.btn[3]); return { solve: [...pre, ...r.map(k => G.btn[k])], wrong: G.item.max === 1 ? G.btn[OPS.findIndex((f, k) => !same(f(G.item.z), G.item.w))] : null }; },
  });
})();
