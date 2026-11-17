// Parientes polares (Trigonometría, trig-151): en forma polar, el conjugado, el opuesto, i·z y el inverso se leen en el módulo y el
// ángulo. Se mueve un punto w con dos perillas. item = { r (0–4: ½, 1, 2, 3, 4), deg (múltiplo de 15), rel }
GAMES['parientes-polares'] = (() => {
  const RS = [0.5, 1, 2, 3, 4], RT = ['\\tfrac12', '1', '2', '3', '4'], RP = ['½', '1', '2', '3', '4'];
  const REL = {
    conj: { name: 'su conjugado', rule: 'El conjugado es el reflejo en el eje real: ángulo opuesto', to: it => [it.r, -it.deg] },
    op: { name: 'su opuesto $-z$', rule: 'El opuesto queda a media vuelta: ángulo + 180°', to: it => [it.r, it.deg + 180] },
    i: { name: '$i \\cdot z$', rule: 'Multiplicar por i es un cuarto de vuelta: ángulo + 90°', to: it => [it.r, it.deg + 90] },
    inv: { name: 'su inverso $\\tfrac{1}{z}$', rule: 'El inverso invierte el módulo y cambia el signo del ángulo', to: it => [RS.indexOf(1 / RS[it.r]), -it.deg] },
  };
  const goal = it => { const [r, d] = REL[it.rel].to(it); return [r, TK.mod(d, 360)]; };
  const cis = (r, d) => `${r === 1 ? '' : `${RT[r]}\\,`}\\mathrm{cis}\\,${d}^\\circ`;
  return questGame({
    aspect: 1.4,
    init: it => ({ r: it.r, d: it.deg / 15 }),
    ok: (s, it) => s.r === goal(it)[0] && TK.mod(15 * s.d, 360) === goal(it)[1],
    answer: it => ({ r: goal(it)[0], d: goal(it)[1] / 15 }),
    solution: it => `$${cis(...goal(it))}$`,
    prompt: it => `$z = ${cis(it.r, it.deg)}$. Lleva el punto $w$ hasta ${REL[it.rel].name}`,
    foot: (it, s) => `$w = ${cis(s.r, TK.mod(15 * s.d, 360))}$`,
    yes: it => REL[it.rel].rule,
    layout(G) {
      const w = (G.W - 36) / 2, y = G.bottom - 98; G.br = { x: 12, y, w, h: 36 }; G.bd = { x: 24 + w, y, w, h: 36 }; G.go = { x: G.W / 2 - 80, y: G.bottom - 46, w: 160, h: 38 };
      G.R = Math.min(G.W * 0.3, (y - G.top - 40) / 2); G.cx = G.W / 2; G.cy = G.top + 10 + G.R;
    },
    draw(G) {
      const { p, C, s, item: it, cx, cy, R } = G, u = R / 4, z = TK.at(cx, cy, RS[it.r] * u, it.deg), wt = TK.at(cx, cy, RS[s.r] * u, 15 * s.d), w = [TK.glide(G, 'wx', wt[0]), TK.glide(G, 'wy', wt[1])];
      for (let k = 1; k <= 4; k++) { p.noFill(); p.stroke(C.line); p.strokeWeight(1.2); p.circle(cx, cy, 2 * k * u); }
      for (let a = 0; a < 180; a += 30) { const [x1, y1] = TK.at(cx, cy, R, a), [x2, y2] = TK.at(cx, cy, R, a + 180); p.stroke(C.line); p.strokeWeight(a % 90 ? 0.8 : 1.8); p.line(x1, y1, x2, y2); }
      p.stroke(C.sky); p.strokeWeight(3); p.line(cx, cy, ...z); drawDot(p, C, z[0], z[1], 11, C.sky); TK.label(p, C, 'z', z[0] + (z[0] >= cx ? 13 : -13), z[1] - 12, C.sky, 15, 20);
      const col = G.solved ? C.ok : C.coral;
      p.stroke(col); p.strokeWeight(3); p.line(cx, cy, ...w); drawDot(p, C, w[0], w[1], 11, col); TK.label(p, C, 'w', w[0] + (w[0] >= cx ? 13 : -13), w[1] + 14, col, 15, 20);
      drawStepper(p, C, G.br, RP[s.r], 'módulo de w'); drawStepper(p, C, G.bd, `${TK.mod(15 * s.d, 360)}°`, 'ángulo de w');
      drawBtn(p, C, G.go, 'Fijar', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, dr = stepHit(G.br, x, y), dd = stepHit(G.bd, x, y);
      if (dr || dd) { if (dr) s.r = Math.max(0, Math.min(4, s.r + dr)); else s.d = TK.mod(s.d + dd, 24); G.api.sfx?.tap?.(); return true; }
      if (!hitBox(G.go, x, y)) return false;
      const [r, d] = goal(G.item);
      G.submit(s.r !== r ? 'El módulo no es ese' : TK.mod(15 * s.d, 360) === G.item.deg ? 'Ahí está z: su pariente queda en otro lado' : 'El ángulo no es ese: piensa qué le pasa al girar o reflejar');
      return true;
    },
    peek: G => {
      const [r, d] = goal(G.item), n = TK.mod(d / 15 - G.s.d, 24), box = n <= 12 ? TK.plus(G.bd) : TK.minus(G.bd);
      return { solve: [...TK.steps(G.br, G.s.r, r), ...Array(n <= 12 ? n : 24 - n).fill(box), G.go], wrong: G.go };
    },
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
