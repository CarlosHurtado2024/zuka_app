// La pareja opuesta (Trigonometría, trig-46a): un triángulo se resuelve tocando lo que ya se puede calcular. Un ángulo sale de los otros
// dos; un lado (o un ángulo con su lado) sale de la ley de senos si hay una pareja completa: lado y ángulo opuesto.
// item = { ang: [A, B, C], base: [i, valor del lado i], know: ['A', 'B', 'a'], want: 'c' }
GAMES['pareja-opuesta'] = (() => {
  const ANG = ['A', 'B', 'C'], SIDE = ['a', 'b', 'c'], idx = el => (ANG.includes(el) ? ANG.indexOf(el) : SIDE.indexOf(el));
  const sides = it => it.ang.map(a => it.base[1] * Math.sin(TK.rad(a)) / Math.sin(TK.rad(it.ang[it.base[0]])));
  const r1 = v => Math.round(v * 10) / 10;
  const value = (it, el) => (ANG.includes(el) ? `${r1(it.ang[idx(el)])}°` : numTxt(r1(sides(it)[idx(el)])));
  // ¿Se puede calcular `el` con lo conocido? 'sum' (tercer ángulo), 'sines' (ley de senos) o un motivo en texto.
  function can(known, el) {
    const i = idx(el), has = e => known.includes(e), pair = ANG.some((A, k) => k !== i && has(A) && has(SIDE[k]));
    if (ANG.includes(el)) {
      if (ANG.filter(A => A !== el && has(A)).length === 2) return 'sum';
      return has(SIDE[i]) && pair ? 'sines' : 'Para un ángulo necesitas los otros dos, o su lado y una pareja completa';
    }
    if (!has(ANG[i])) return 'Te falta el ángulo opuesto a ese lado';
    return pair ? 'sines' : 'No tienes una pareja completa: un lado con su ángulo opuesto';
  }
  const good = r => r === 'sum' || r === 'sines';
  function route(it, known) {
    const k = [...known], taps = [];
    for (let n = 0; n < 6 && !k.includes(it.want); n++) {
      const el = good(can(k, it.want)) ? it.want : [...ANG, ...SIDE].find(e => !k.includes(e) && good(can(k, e)));
      if (!el) break;
      k.push(el); taps.push(el);
    }
    return { known: k, taps };
  }
  function note(it, el, how, known) {
    const i = idx(el), k = ANG.findIndex((A, q) => q !== i && known.includes(A) && known.includes(SIDE[q]));
    if (how === 'sum') return `$${el} = 180^\\circ - ${ANG.filter(A => A !== el).join(' - ')} = ${r1(it.ang[i])}^\\circ$`;
    return ANG.includes(el) ? `Ley de senos: $${el} \\approx ${r1(it.ang[i])}^\\circ$` : `Ley de senos: $${el} = \\tfrac{${SIDE[k]}\\,\\operatorname{sen} ${ANG[i]}}{\\operatorname{sen} ${ANG[k]}}$ da $${numTxt(r1(sides(it)[i]))}$`;
  }
  return questGame({
    aspect: 1.35,
    init: it => ({ known: [...it.know], taps: [], note: '' }),
    ok: (s, it) => s.known.includes(it.want),
    answer: it => ({ ...route(it, it.know), note: '' }),
    solution: it => `${route(it, it.know).taps.join(' → ')}: $${it.want} ${ANG.includes(it.want) ? '=' : '\\approx'} ${value(it, it.want).replace('°', '^\\circ')}$`,
    prompt: it => `Halla $${it.want}$: toca, en orden, lo que ya se puede calcular`,
    foot: (it, s) => s.note || 'Pareja completa: un lado y su ángulo opuesto, los dos conocidos',
    layout(G) {
      const it = G.item, [a, b, c] = sides(it), Cx = b * Math.cos(TK.rad(it.ang[0])), Cy = b * Math.sin(TK.rad(it.ang[0]));
      const minX = Math.min(0, Cx), maxX = Math.max(c, Cx), u = Math.min((G.W - 120) / (maxX - minX), (G.bottom - G.top - 96) / Cy), x0 = (G.W - (maxX - minX) * u) / 2 - minX * u, yb = G.bottom - 44;
      const V = [[x0, yb], [x0 + c * u, yb], [x0 + Cx * u, yb - Cy * u]], cen = [(V[0][0] + V[1][0] + V[2][0]) / 3, (V[0][1] + V[1][1] + V[2][1]) / 3];
      const out = (pt, d) => { const n = Math.hypot(pt[0] - cen[0], pt[1] - cen[1]) || 1; return [pt[0] + (pt[0] - cen[0]) / n * d, pt[1] + (pt[1] - cen[1]) / n * d]; };
      G.V = V; G.pos = {};
      ANG.forEach((A, i) => { G.pos[A] = out(V[i], 20); });
      SIDE.forEach((sd, i) => { const [q, w] = [V[(i + 1) % 3], V[(i + 2) % 3]]; G.pos[sd] = out([(q[0] + w[0]) / 2, (q[1] + w[1]) / 2], 18); });
      for (const el in G.pos) G.pos[el][0] = Math.max(40, Math.min(G.W - 40, G.pos[el][0]));
      G.hit = el => ({ x: G.pos[el][0] - 38, y: G.pos[el][1] - 15, w: 76, h: 30 });
    },
    draw(G) {
      const { p, C, s, item: it, V } = G;
      p.fill(C.card); p.stroke(C.ink); p.strokeWeight(3); p.triangle(...V[0], ...V[1], ...V[2]);
      for (const el of [...ANG, ...SIDE]) {
        const has = s.known.includes(el), given = it.know.includes(el), [x, y] = G.pos[el];
        drawPill(p, C, `${el} = ${has ? value(it, el) : '?'}`, x, y, has ? (given ? C.sky : G.solved && el === it.want ? C.ok : C.mint) : el === it.want ? C.coral : C.cream, 13);
      }
    },
    press(G, x, y) {
      const s = G.s, it = G.item, el = [...ANG, ...SIDE].find(e => hitBox(G.hit(e), x, y));
      if (!el) return false;
      if (s.known.includes(el)) return true;
      const r = can(s.known, el);
      if (!good(r)) { G.bad(r); return true; }
      s.note = note(it, el, r, s.known); s.known.push(el); s.taps.push(el); G.api.sfx?.tap?.();
      if (el === it.want) G.good(`${el} = ${value(it, el)}`);
      return true;
    },
    peek: G => { const bad = [...ANG, ...SIDE].find(e => !G.s.known.includes(e) && !good(can(G.s.known, e))); return { solve: route(G.item, G.s.known).taps.map(G.hit), wrong: bad ? G.hit(bad) : null }; },
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
