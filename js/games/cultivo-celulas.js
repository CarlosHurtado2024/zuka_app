// El cultivo (Álgebra, alg-14c; spec 2026-11-18-algebra-revision): una colonia que se multiplica por r en cada
// generación. Se arrastra la generación; las células se dibujan (de a una mientras caben, luego en bloques de 10) y se
// escribe aₙ = a₁ · rⁿ⁻¹. Hay que encontrar la generación con la cantidad pedida.
// params = { rounds: [{ a1, r, target }] }   state = { rounds: [{ n }] }   (generación, de 1 a 8)
GAMES['cultivo-celulas'] = (() => {
  const MAX = 8;
  const val = (q, n) => q.a1 * q.r ** (n - 1);
  const need = q => { for (let n = 1; n <= MAX; n++) if (val(q, n) === q.target) return n; return -1; };
  const ok = (s, q) => val(q, s.n) === q.target;
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ n: 1 }),
    ok,
    solution: q => `generación ${need(q)}: ${q.a1} · ${q.r}^${need(q) - 1} = ${q.target}`,
    prompt: q => `Empieza con ${q.a1} y se multiplica por ${q.r}. ¿Qué generación tiene ${q.target}?`,
    foot: () => 'Arrastra las generaciones',
    layout(G) { G.box = { x: 16, y: 100, w: G.W - 32, h: G.H * 0.46 }; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r: q, box } = G, n = G.locked && !ok(G.s, q) ? need(q) : G.s.n, v = val(q, n);
      p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.card, 200)); p.rect(box.x, box.y, box.w, box.h, 14);
      const big = v > 120, units = big ? Math.ceil(v / 10) : v, cols = Math.ceil(Math.sqrt(units * box.w / box.h)), cs = Math.min(18, box.w / cols - 2);
      for (let i = 0; i < Math.min(units, 400); i++) { const x = box.x + 10 + (i % cols) * (cs + 2), y = box.y + 10 + Math.floor(i / cols) * (cs + 2); if (y + cs > box.y + box.h - 6) break; p.noStroke(); p.fill(big ? C.coral : C.mint); p.circle(x + cs / 2, y + cs / 2, cs); }
      if (big) TK.label(p, C, 'cada punto = 10 células', box.x + box.w / 2, box.y + box.h - 12, C.mute, 10, 160);
      G.X = RK.track(p, C, 34, G.W - 34, G.tY, MAX, n - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, `$a_{${n}} = ${q.a1}\\cdot ${q.r}^{${n - 1}} = ${v}$`, { col: G.locked || ok(G.s, q) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.n - 1), y: G.tY }, to: { x: G.X(G.s.n + 2), y: G.tY }, text: 'Arrastra las generaciones', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = RK.pick(x, 34, G.W - 34, MAX) + 1; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { need });
})();
