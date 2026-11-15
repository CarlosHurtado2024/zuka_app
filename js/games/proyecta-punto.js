// Proyecta el punto (Trigonometría, trig-3; en el primer cuadrante, trig-2): un punto de la circunferencia unitaria es (cos t, sen t).
// Se eligen los dos valores, con su signo, y se proyecta. item = { deg, rad? }
GAMES['proyecta-punto'] = (() => {
  const idx = v => TK.VAL.findIndex(q => Math.abs(q - v) < 1e-6), ci = it => idx(Math.cos(TK.rad(it.deg))), si = it => idx(Math.sin(TK.rad(it.deg)));
  const name = it => (it.rad ? TK.piTex(it.deg / 15, 12) : `${it.deg}^\\circ`);
  return questGame({
    aspect: 1.4,
    init: () => ({ c: 4, s: 4, miss: null }),
    ok: (s, it) => s.c === ci(it) && s.s === si(it),
    answer: it => ({ c: ci(it), s: si(it), miss: null }),
    solution: it => `$${name(it)}$: $(${TK.VTEX[ci(it)]},\\ ${TK.VTEX[si(it)]})$`,
    prompt: it => `Pon el coseno y el seno del punto de $${name(it)}$ y proyecta`,
    foot: () => 'El punto es (cos t, sen t): el coseno va de lado y el seno, hacia arriba',
    layout(G) {
      const w = (G.W - 36) / 2, y = G.bottom - 98; G.bc = { x: 12, y, w, h: 36 }; G.bs = { x: 24 + w, y, w, h: 36 }; G.go = { x: G.W / 2 - 80, y: G.bottom - 46, w: 160, h: 38 };
      G.R = Math.min(G.W * 0.27, (y - G.top - 44) / 2); G.cx = G.W / 2; G.cy = G.top + 12 + G.R;
    },
    draw(G) {
      const { p, C, s, item: it, cx, cy, R } = G, [x, y] = TK.at(cx, cy, R, it.deg);
      TK.ring(p, C, cx, cy, R);
      p.stroke(C.mute); p.strokeWeight(2); p.line(cx, cy, x, y);
      if (G.solved) { p.strokeWeight(5); p.stroke(C.sky); p.line(cx, cy, x, cy); p.stroke(C.coral); p.line(x, cy, x, y); }
      if (s.miss && !G.solved) { const mx = cx + TK.VAL[s.miss[0]] * R, my = cy - TK.VAL[s.miss[1]] * R; p.stroke(C.bad); p.strokeWeight(3); p.line(mx - 6, my - 6, mx + 6, my + 6); p.line(mx - 6, my + 6, mx + 6, my - 6); TK.label(p, C, 'tu punto', mx, my + 16, C.bad, 11, 70); }
      drawDot(p, C, x, y, 12, G.solved ? C.ok : C.N);
      TK.label(p, C, `$${name(it)}$`, x + (x >= cx ? 26 : -26), y + (y <= cy ? -12 : 14), C.ink, 14, 60);
      drawStepper(p, C, G.bc, `$${TK.VTEX[s.c]}$`, 'coseno (de lado)', C.Z); drawStepper(p, C, G.bs, `$${TK.VTEX[s.s]}$`, 'seno (arriba o abajo)', C.I);
      drawBtn(p, C, G.go, 'Proyectar', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, dc = stepHit(G.bc, x, y), ds = stepHit(G.bs, x, y);
      if (dc || ds) { if (dc) s.c = Math.max(0, Math.min(8, s.c + dc)); else s.s = Math.max(0, Math.min(8, s.s + ds)); G.api.sfx?.tap?.(); return true; }
      if (!hitBox(G.go, x, y)) return false;
      const shot = [s.c, s.s];
      if (!G.submit('Ese no es el punto: mira dónde cayó el tuyo')) G.s.miss = shot;
      return true;
    },
    peek: G => ({ solve: [...TK.steps(G.bc, G.s.c, ci(G.item)), ...TK.steps(G.bs, G.s.s, si(G.item)), G.go], wrong: G.go }),
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
