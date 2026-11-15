// Espejo de cuadrantes (Trigonometría, trig-43b): reflejar en el eje x cambia el signo del seno; en el eje y, el del coseno. El
// ángulo de referencia es el del reflejo que cae en el cuadrante I. item = { deg, to (1–4), max?, cond? }
GAMES['espejo-cuadrantes'] = (() => {
  const OPS = [d => TK.mod(-d, 360), d => TK.mod(180 - d, 360)], ROM = ['', 'I', 'II', 'III', 'IV'];
  const quad = d => Math.floor(TK.mod(d, 360) / 90) + 1, run = (it, ops) => ops.reduce((d, k) => OPS[k](d), it.deg);
  const route = it => [[], [0], [1], [0, 1]].find(o => o.length <= (it.max ?? 2) && quad(run(it, o)) === it.to);
  return questGame({
    aspect: 1.35,
    init: () => ({ ops: [] }),
    ok: (s, it) => s.ops.length <= (it.max ?? 2) && quad(run(it, s.ops)) === it.to,
    answer: it => ({ ops: route(it) }),
    solution: it => `${it.deg}° → ${run(it, route(it))}° (cuadrante ${ROM[it.to]})`,
    prompt: it => (it.cond ? `Lleva ${it.deg}° adonde ${it.cond}` : `Lleva ${it.deg}° al cuadrante I: verás su ángulo de referencia`),
    foot: (it, s) => `Espejos usados: ${s.ops.length} de ${it.max ?? 2}`,
    retry: G => { G.s.ops = []; },
    layout(G) { G.btn = TK.row(G, 3); const h = G.btn[0].y - G.top - 46; G.R = Math.min(G.W * 0.27, h / 2 - 2); G.cx = G.W / 2; G.cy = G.top + 10 + G.R; },
    draw(G) {
      const { p, C, s, item: it, cx, cy, R } = G, d = run(it, s.ops), [x, y] = TK.at(cx, cy, R, d), [ox, oy] = TK.at(cx, cy, R, it.deg), r = TK.rad(d);
      TK.ring(p, C, cx, cy, R);
      p.stroke(C.mute); p.strokeWeight(1.5); p.line(cx, cy, ox, oy); p.noStroke(); p.fill(C.mute); p.circle(ox, oy, 8);
      p.noStroke(); p.fill(C.card); p.triangle(cx, cy, x, cy, x, y);
      p.strokeWeight(4); p.stroke(C.sky); p.line(cx, cy, x, cy); p.stroke(C.coral); p.line(x, cy, x, y); p.stroke(C.ink); p.strokeWeight(2.5); p.line(cx, cy, x, y);
      drawDot(p, C, x, y, 12, G.solved ? C.ok : C.N);
      TK.label(p, C, `${d}°`, x + (x >= cx ? 24 : -24), y + (y <= cy ? -12 : 14), C.ink, 14, 60);
      // Signos del punto actual.
      const sg = [['sen', Math.sin(r)], ['cos', Math.cos(r)], ['tan', Math.tan(r)]], w = (G.W - 24) / 3, py = G.btn[0].y - 22;
      sg.forEach(([n, v], i) => drawPill(p, C, `${n} ${v > 0 ? '+' : '−'}`, 12 + w * (i + 0.5), py, v > 0 ? C.mint : C.coral, 12));
      drawBtn(p, C, G.btn[0], 'Espejo ↕', false, C.cream); drawBtn(p, C, G.btn[1], 'Espejo ↔', false, C.cream); drawBtn(p, C, G.btn[2], '↶ deshacer', false, C.sky);
    },
    press(G, x, y) {
      const s = G.s, it = G.item, i = G.btn.findIndex(b => hitBox(b, x, y));
      if (i < 0) return false;
      if (i === 2) { s.ops.pop(); return true; }
      s.ops.push(i); G.api.sfx?.tap?.();
      const d = run(it, s.ops);
      if (quad(d) === it.to) G.good(it.to === 1 ? `Ángulo de referencia: ${d}°` : `Llegaste a ${d}°`);
      else if (s.ops.length >= (it.max ?? 2)) G.bad('Se acabaron los espejos: empieza de nuevo');
      return true;
    },
    peek: G => ({ solve: [...G.s.ops.map(() => G.btn[2]), ...route(G.item).map(k => G.btn[k])], wrong: (G.item.max ?? 2) === 1 && !G.s.ops.length ? G.btn[1 - route(G.item)[0]] : null }),
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
