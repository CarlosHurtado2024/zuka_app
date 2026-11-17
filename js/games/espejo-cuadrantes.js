// Espejo de cuadrantes (Trigonometría, trig-43b): reflejar en el eje x cambia el signo del seno; en el eje y, el del coseno. El
// ángulo de referencia es el del reflejo que cae en el cuadrante I: el estudiante lleva el punto allí y dice cuánto mide
// (el juego no lo escribe hasta comprobar). Con `cond` se parte del cuadrante I y se busca el cuadrante que cumple los signos.
// item = { deg, to (1–4), max?, cond? }
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
GAMES['espejo-cuadrantes'] = (() => {
  const OPS = [d => TK.mod(-d, 360), d => TK.mod(180 - d, 360)], ROM = ['', 'I', 'II', 'III', 'IV'];
  const quad = d => Math.floor(TK.mod(d, 360) / 90) + 1, run = (it, ops) => ops.reduce((d, k) => OPS[k](d), it.deg);
  const route = it => [[], [0], [1], [0, 1]].find(o => o.length <= (it.max ?? 2) && quad(run(it, o)) === it.to);
  const there = (s, it) => s.ops.length <= (it.max ?? 2) && quad(run(it, s.ops)) === it.to;
  return questGame({
    aspect: 1.4,
    init: () => ({ ops: [], ref: 9 }),
    ok: (s, it) => there(s, it) && (!!it.cond || 5 * s.ref === run(it, s.ops)),
    answer: it => ({ ops: route(it), ref: it.cond ? 9 : run(it, route(it)) / 5 }),
    solution: it => (it.cond ? `${it.deg}° → ${run(it, route(it))}° (cuadrante ${ROM[it.to]})` : `Ángulo de referencia de ${it.deg}°: ${run(it, route(it))}°`),
    prompt: it => (it.cond ? `Lleva ${it.deg}° adonde ${it.cond}` : `Lleva ${it.deg}° al cuadrante I y di su ángulo de referencia`),
    foot: (it, s) => (!it.cond && there(s, it) ? 'El ángulo de referencia es el que forma con el eje x' : `Espejos usados: ${s.ops.length} de ${it.max ?? 2}`),
    retry: G => { if (!there(G.s, G.item)) G.s.ops = []; },
    layout(G) {
      G.btn = TK.row(G, 2); const y = G.btn[0].y;
      G.st = { x: 12, y, w: G.W * 0.56, h: 38 }; G.chk = { x: G.st.x + G.st.w + 10, y, w: G.W - 34 - G.st.w, h: 38 };
      const h = y - G.top - 62; G.R = Math.min(G.W * 0.27, h / 2 - 2); G.cx = G.W / 2; G.cy = G.top + 10 + G.R;
    },
    draw(G) {
      const { p, C, s, item: it, cx, cy, R } = G, d = run(it, s.ops), [tx, ty] = TK.at(cx, cy, R, d), x = TK.glide(G, 'x', tx), y = TK.glide(G, 'y', ty), [ox, oy] = TK.at(cx, cy, R, it.deg), r = TK.rad(d), ask = !it.cond && there(s, it);
      TK.ring(p, C, cx, cy, R);
      p.stroke(C.mute); p.strokeWeight(1.5); p.line(cx, cy, ox, oy); p.noStroke(); p.fill(C.mute); p.circle(ox, oy, 8);
      TK.label(p, C, `${it.deg}°`, ox + (ox >= cx ? 22 : -22), oy + (oy <= cy ? -11 : 13), C.mute, 12, 50);
      p.noStroke(); p.fill(C.card); p.triangle(cx, cy, x, cy, x, y);
      p.strokeWeight(4); p.stroke(C.sky); p.line(cx, cy, x, cy); p.stroke(C.coral); p.line(x, cy, x, y); p.stroke(C.ink); p.strokeWeight(2.5); p.line(cx, cy, x, y);
      drawDot(p, C, x, y, 12, G.solved ? C.ok : C.N);
      if (s.ops.length) TK.label(p, C, G.solved ? `${d}°` : '¿?°', x + (x >= cx ? 24 : -24), y + (y <= cy ? -12 : 14), G.solved ? C.ok : C.ink, 14, 60);
      const sg = [['sen', Math.sin(r)], ['cos', Math.cos(r)], ['tan', Math.tan(r)]], w = (G.W - 24) / 3, py = G.btn[0].y - 36;
      sg.forEach(([n, v], i) => drawPill(p, C, `${n} ${v > 0 ? '+' : '−'}`, 12 + w * (i + 0.5), py, v > 0 ? C.mint : C.coral, 12));
      if (ask) { drawStepper(p, C, G.st, `${5 * s.ref}°`, 'ángulo de referencia'); drawBtn(p, C, G.chk, 'Comprobar', G.solved, G.solved ? C.ok : C.coral); }
      else { drawBtn(p, C, G.btn[0], 'Espejo ↕', false, C.cream); drawBtn(p, C, G.btn[1], 'Espejo ↔', false, C.cream); }
    },
    press(G, x, y) {
      const s = G.s, it = G.item;
      if (!it.cond && there(s, it)) {
        const d = stepHit(G.st, x, y);
        if (d) { s.ref = Math.max(1, Math.min(17, s.ref + d)); G.api.sfx?.tap?.(); return true; }
        if (!hitBox(G.chk, x, y)) return false;
        G.submit('Ese no es: mira cuánto le falta al ángulo para llegar al eje x más cercano');
        return true;
      }
      const i = G.btn.findIndex(b => hitBox(b, x, y));
      if (i < 0) return false;
      s.ops.push(i); G.api.sfx?.tap?.();
      if (there(s, it)) { if (it.cond) G.good(`Llegaste a ${run(it, s.ops)}°`); }
      else if (s.ops.length >= (it.max ?? 2)) G.bad('Se acabaron los espejos: empieza de nuevo');
      return true;
    },
    peek: G => {
      const it = G.item, r = route(it), on = there(G.s, it);
      const tail = it.cond ? [] : [...TK.steps(G.st, G.s.ref, run(it, r) / 5), G.chk];
      return { solve: [...(on ? [] : r.slice(G.s.ops.length).map(k => G.btn[k])), ...tail], wrong: on && !it.cond ? (5 * G.s.ref === run(it, G.s.ops) ? null : G.chk) : (it.max ?? 2) === 1 && !G.s.ops.length ? G.btn[1 - r[0]] : null };
    },
  });
})();
