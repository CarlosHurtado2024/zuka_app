// Los cambios de la bici (Álgebra, alg-12; juego en movimiento; spec 2026-11-18-algebra-revision): la razón entre dientes.
// El plato tiene `front` dientes; atrás hay piñones de varios tamaños. Por cada pedalada la rueda da front : piñón
// vueltas. Se arrastra la cadena al piñón y al soltar la bici pedalea `turns` veces: debe parar en la bandera, a
// `target` vueltas de rueda. Sin prisa: solo se mueve al soltar.
// params = { rounds: [{ title, items: [{ front, cogs: [..], turns, target }] }] }   s = { c, shot }
GAMES['bici-cambios'] = (() => {
  const need = it => it.cogs.findIndex(c => (it.turns * it.front) / c === it.target);
  const game = questGame({
    aspect: 1.05,
    idle: 'Elige el piñón con calma; la bici sale al soltar',
    init: () => ({ c: 0, shot: null }),
    ok: (s, it) => (it.turns * it.front) / it.cogs[s.c] === it.target,
    answer: it => ({ c: need(it), shot: null }),
    solution: it => `piñón de ${it.cogs[need(it)]}: ${it.front} : ${it.cogs[need(it)]} = ${it.front / it.cogs[need(it)]} vueltas por pedalada`,
    prompt: it => `Plato de ${it.front}. Con ${it.turns} pedaladas, ${it.target} vueltas`,
    foot: (it, s) => (s.missed ? 'Divide los dientes del plato entre los del piñón' : 'Arrastra la cadena a un piñón y suelta'),
    layout(G) { G.road = G.top + 110; G.cogY = G.bottom - 60; },
    draw(G) {
      const { p, C, s, item: it } = G, per = it.front / it.cogs[s.c], total = it.turns * per, maxT = it.target * 1.6;
      const X = v => 30 + (G.W - 60) * Math.min(v, maxT) / maxT;
      p.stroke(C.line); p.strokeWeight(2); p.line(24, G.road, G.W - 24, G.road);
      for (let v = 0; v <= maxT; v += Math.max(1, Math.round(maxT / 8))) { p.line(X(v), G.road, X(v), G.road + 5); TK.label(p, C, String(v), X(v), G.road + 16, C.mute, 10, 24); }
      p.stroke(C.ok); p.strokeWeight(2); p.line(X(it.target), G.road, X(it.target), G.road - 40); p.noStroke(); p.fill(C.ok); p.triangle(X(it.target), G.road - 40, X(it.target) + 13, G.road - 34, X(it.target), G.road - 28);
      let d = 0;
      if (s.shot != null) { d = Math.min(1, (G.t - s.shot) / 1.6) * total; if (d >= total && !G.solved) { if (total === it.target) G.good('¡A la bandera!'); else { s.shot = null; s.missed = true; G.bad(`Dio ${+total.toFixed(2)} vueltas`); } } }
      const bx = X(G.solved ? it.target : d);
      p.noFill(); p.stroke(C.ink); p.strokeWeight(2); p.circle(bx - 14, G.road - 12, 22); p.circle(bx + 14, G.road - 12, 22); p.line(bx - 14, G.road - 12, bx, G.road - 26); p.line(bx, G.road - 26, bx + 14, G.road - 12);
      // Plato y piñones.
      const fx = 60, fr = 30;
      p.stroke(C.brand); p.strokeWeight(3); p.fill(RK.al(p, C.brand, 40)); p.circle(fx, G.cogY, 2 * fr); TK.label(p, C, String(it.front), fx, G.cogY, C.ink, 13, 40);
      G.cx = it.cogs.map((c, i) => 140 + i * (G.W - 170) / Math.max(1, it.cogs.length - 1));
      it.cogs.forEach((c, i) => { const r = 8 + c * 0.6; p.stroke(i === s.c ? C.brand : C.line); p.strokeWeight(i === s.c ? 3 : 1.5); p.fill(C.card); p.circle(G.cx[i], G.cogY, 2 * r); TK.label(p, C, String(c), G.cx[i], G.cogY, C.ink, 11, 30); });
      const cr = 8 + it.cogs[s.c] * 0.6; p.noFill(); p.stroke(RK.al(p, C.ink, 120)); p.strokeWeight(1.5); p.line(fx, G.cogY - fr, G.cx[s.c], G.cogY - cr); p.line(fx, G.cogY + fr, G.cx[s.c], G.cogY + cr);
      TK.label(p, C, `${it.front} : ${it.cogs[s.c]}`, G.W / 2, G.cogY - 46, C.mute, 11, 100);
    },
    press(G, x, y) { if (G.s.shot != null || Math.abs(y - G.cogY) > 50) return false; G.grab = true; game.pick(G, x); return true; },
    drag(G, x) { if (!G.grab || G.s.shot != null) return false; game.pick(G, x); return true; },
    release(G) { if (G.grab && G.s.shot == null && !G.solved) { G.s.shot = G.t; G.api.sfx?.tap?.(); } G.grab = false; },
    demo: G => (G.cx ? { from: { x: G.cx[0], y: G.cogY }, to: { x: G.cx.at(-1), y: G.cogY }, text: 'Arrastra la cadena y suelta', ty: G.cogY - 66 } : null),
    peek: G => ({ cx: G.cx, cogY: G.cogY, need: need(G.item), flying: G.s.shot != null }),
  });
  game.pick = (G, x) => { let b = 0; G.cx.forEach((cx, i) => { if (Math.abs(cx - x) < Math.abs(G.cx[b] - x)) b = i; }); G.s.c = b; };
  return Object.assign(game, { need });
})();
