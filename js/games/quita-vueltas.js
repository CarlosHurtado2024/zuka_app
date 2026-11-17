// Quita vueltas (Trigonometría, trig-41a): un ángulo grande o negativo y su coterminal. El lado terminal no se mueve al quitar o poner
// vueltas completas. item = { deg, lo? (0), rad? }
GAMES['quita-vueltas'] = (() => {
  const fmt = (it, d) => (it.rad ? `$${TK.piTex(d / 15, 12)}$` : `${TK.minusTxt(d)}°`);
  const lo = it => it.lo ?? 0, need = it => -Math.floor((it.deg - lo(it)) / 360);
  return questGame({
    aspect: 1.3,
    init: () => ({ k: 0 }),
    ok: (s, it) => { const d = it.deg + 360 * s.k; return d >= lo(it) && d < lo(it) + 360; },
    answer: it => ({ k: need(it) }),
    solution: it => `${fmt(it, it.deg)} → ${fmt(it, it.deg + 360 * need(it))}`,
    prompt: it => `Quita o pon vueltas hasta dejar ${fmt(it, it.deg)} entre ${fmt(it, lo(it))} y ${fmt(it, lo(it) + 360)}`,
    foot: () => 'El lado terminal no se mueve: todos esos ángulos son coterminales',
    layout(G) { G.btn = TK.row(G, 3); const h = G.btn[0].y - G.top - 34; G.R = Math.min(G.W * 0.3, h / 2 - 4); G.cx = G.W / 2; G.cy = G.top + 8 + h / 2; },
    draw(G) {
      const { p, C, s, item: it, cx, cy, R } = G, d = it.deg + 360 * s.k, [tx, ty] = TK.at(cx, cy, R, d);
      TK.ring(p, C, cx, cy, R);
      // La espiral cuenta las vueltas; el lado terminal queda quieto.
      p.noFill(); p.stroke(G.solved ? C.ok : C.coral); p.strokeWeight(3); p.beginShape();
      const ds = TK.glide(G, 'd', d, 6), n = Math.max(8, Math.ceil(Math.abs(ds) / 6));
      for (let i = 0; i <= n; i++) { const a = ds * i / n, r = R * 0.2 + Math.min(R * 0.62, Math.abs(a) / 360 * R * 0.17); p.vertex(...TK.at(cx, cy, r, a)); }
      p.endShape();
      p.stroke(C.sky); p.strokeWeight(4); p.line(cx, cy, tx, ty); drawDot(p, C, tx, ty, 11, C.sky);
      TK.label(p, C, G.solved ? fmt(it, d) : `${fmt(it, it.deg)} ${s.k < 0 ? '−' : '+'} ${Math.abs(s.k)} ${Math.abs(s.k) === 1 ? 'vuelta' : 'vueltas'}`, cx, cy + R + 20, G.solved ? C.ok : C.ink, 17, 220);
      drawBtn(p, C, G.btn[0], '− 1 vuelta', false, C.cream); drawBtn(p, C, G.btn[1], '+ 1 vuelta', false, C.cream); drawBtn(p, C, G.btn[2], 'Listo', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, i = G.btn.findIndex(b => hitBox(b, x, y));
      if (i < 0) return false;
      if (i === 2) { G.submit('Todavía no está en ese intervalo'); return true; }
      const k = s.k + (i ? 1 : -1);
      if (Math.abs(G.item.deg + 360 * k) <= 2160) { s.k = k; G.api.sfx?.tap?.(); }
      return true;
    },
    peek: G => { const n = need(G.item) - G.s.k; return { solve: [...Array(Math.abs(n)).fill(G.btn[n > 0 ? 1 : 0]), G.btn[2]], wrong: n ? G.btn[2] : null }; },
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
