// Crestas y faroles (Trigonometría, trig-44b): y = cos(b(x − h)) tiene periodo 2π/b y la cresta en x = h. Se eligen b y el
// corrimiento para que cada cresta caiga en un farol. item = { b (0–3: ½, 1, 2, 4), h (en cuartos de π) }
GAMES['crestas-faroles'] = (() => {
  const BS = [0.5, 1, 2, 4], BT = ['½', '1', '2', '4'], per = bi => 8 / BS[bi];
  return questGame({
    aspect: 1.4,
    init: () => ({ bi: 1, h: 0, sb: 1, sh: 0 }),
    ok: (s, it) => s.bi === it.b && TK.mod(s.h - it.h, per(it.b)) === 0,
    answer: it => ({ bi: it.b, h: it.h, sb: it.b, sh: it.h }),
    solution: it => `$b = ${BS[it.b]}$ (periodo $${TK.piTex(per(it.b), 4)}$), corrida $${TK.piTex(it.h, 4)}$`,
    prompt: () => 'Suelta una ola cuyas crestas caigan justo en los faroles',
    foot: (it, s) => `Periodo de tu ola: $\\tfrac{2\\pi}{b} = ${TK.piTex(per(s.bi), 4)}$`,
    layout(G) {
      const w = (G.W - 36) / 2, y = G.bottom - 98; G.bb = { x: 12, y, w, h: 36 }; G.bh = { x: 24 + w, y, w, h: 36 }; G.go = { x: G.W / 2 - 80, y: G.bottom - 46, w: 160, h: 38 };
      G.box = { x: 16, y: G.top + 6, w: G.W - 32, h: y - G.top - 30 };
    },
    draw(G) {
      const { p, C, s, item: it, box } = G, X = q => box.x + 8 + q / 16 * (box.w - 16), y0 = box.y + box.h * 0.58, amp = box.h * 0.24;
      p.noStroke(); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 10);
      p.stroke(C.line); p.strokeWeight(1.5); p.line(box.x, y0, box.x + box.w, y0);
      for (let k = 0; k <= 4; k++) { p.stroke(C.mute); p.strokeWeight(1.5); p.line(X(4 * k), y0 - 4, X(4 * k), y0 + 4); TK.label(p, C, `$${TK.piTex(k)}$`, X(4 * k), box.y + box.h - 12, C.mute, 12, 40); }
      // Faroles en las crestas pedidas.
      for (let q = TK.mod(it.h, per(it.b)); q <= 16; q += per(it.b)) { p.stroke(C.mute); p.strokeWeight(2); p.line(X(q), y0, X(q), y0 - amp - 22); drawDot(p, C, X(q), y0 - amp - 22, G.solved ? 13 : 9, C.sun); }
      p.noFill(); p.stroke(G.solved ? C.ok : C.mint); p.strokeWeight(3.5); p.beginShape();
      for (let i = 0, kk = Math.round(200 * TK.prog(G, 0.45)); i <= kk; i++) { const q = i / 200 * 16; p.vertex(X(q), y0 - amp * Math.cos(BS[s.sb] * (q - s.sh) * Math.PI / 4)); }
      p.endShape();
      drawStepper(p, C, G.bb, BT[s.bi], 'ondas en 2π (b)'); drawStepper(p, C, G.bh, `$${TK.piTex(s.h, 4)}$`, 'corrida a la derecha');
      drawBtn(p, C, G.go, 'Soltar la ola', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, db = stepHit(G.bb, x, y), dh = stepHit(G.bh, x, y);
      if (db || dh) { if (db) s.bi = Math.max(0, Math.min(3, s.bi + db)); else s.h = Math.max(0, Math.min(8, s.h + dh)); G.api.sfx?.tap?.(); return true; }
      if (!hitBox(G.go, x, y)) return false;
      s.sb = s.bi; s.sh = s.h; TK.fire(G);
      G.submit(s.bi !== G.item.b ? 'Las crestas no están a la distancia de los faroles' : 'La distancia está bien, pero la ola quedó corrida');
      return true;
    },
    peek: G => ({ solve: [...TK.steps(G.bb, G.s.bi, G.item.b), ...TK.steps(G.bh, G.s.h, G.item.h), G.go], wrong: G.go }),
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
