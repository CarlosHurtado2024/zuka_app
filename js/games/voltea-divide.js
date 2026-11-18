// Dividir fracciones (Álgebra, alg-25b; spec 2026-11-18-algebra-revision): dividir entre una fracción es multiplicar por
// su recíproca; se voltea SOLO el divisor (la de la derecha), y una expresión sola, como x + 1, es (x + 1)/1. Las dos
// fracciones se pueden arrastrar al volteador (que cambia arriba por abajo); al soltar una encima de la otra se
// multiplican. El resultado sale de lo que se haya volteado: si se voltea la que no era, sale otra cosa.
// params = { rounds: [{ a: [num, den], b: [num, den], res, wrong }] }   state = { rounds: [{ fa, fb, mult }] }
GAMES['voltea-divide'] = (() => {
  const ok = s => !s.fa && s.fb && s.mult;
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ fa: false, fb: false, mult: false }),
    ok,
    answered: s => s.mult,
    solution: r => r.res.replace(/\\[a-z]+|[{}]/g, ''),
    prompt: r => `Divide: $\\dfrac{${r.a[0]}}{${r.a[1]}} \\div ${r.b[1] === '1' ? `(${r.b[0]})` : `\\dfrac{${r.b[0]}}{${r.b[1]}}`}$`,
    foot: () => 'Usa el volteador y junta las dos fracciones para multiplicar',
    layout(G) { G.f = [{ x: 16, y: 110, w: G.W / 2 - 24, h: 80 }, { x: G.W / 2 + 8, y: 110, w: G.W / 2 - 24, h: 80 }]; G.flipB = { x: G.W / 2 - 60, y: 222, w: 120, h: 40 }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s) ? { fa: false, fb: true, mult: true } : G.s;
      const fr = (q, fl) => (fl ? [q[1], q[0]] : q), A = fr(r.a, s.fa), B = fr(r.b, s.fb);
      [A, B].forEach((q, k) => { if (G.drag?.k === k) return; RK.chip(p, C, G.f[k], `$\\dfrac{${q[0]}}{${q[1]}}$`, { on: true, col: (k ? s.fb : s.fa) ? C.mint : k ? C.coral : C.sky, size: 16 }); });
      TK.label(p, C, s.mult ? '×' : '÷', G.W / 2, 150, C.ink, 20, 20);
      p.stroke(C.brand); p.strokeWeight(1.4); p.fill(RK.al(p, C.brand, 22)); p.rect(G.flipB.x, G.flipB.y, G.flipB.w, G.flipB.h, 10); TK.label(p, C, 'volteador', G.flipB.x + 60, G.flipB.y + 20, C.ink, 11, 100);
      if (G.drag) { const q = G.drag.k ? B : A; RK.chip(p, C, { x: G.drag.x - G.f[0].w / 2, y: G.drag.y - 40, w: G.f[0].w, h: 80 }, `$\\dfrac{${q[0]}}{${q[1]}}$`, { on: true, size: 16 }); }
      const msg = !s.mult ? '$\\text{todavía es una división}$' : ok(s) ? `$${r.res}$` : s.fa && s.fb ? '$\\text{volteaste las dos: el dividendo no se voltea}$' : s.fa ? `$\\text{volteaste el dividendo:}\\ ${r.wrong}$` : '$\\text{sin voltear no es dividir}$';
      RK.strip(p, C, G.fb, msg, { col: G.locked || ok(G.s) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const k = G.f.findIndex(b => hitBox(b, x, y)); if (k < 0) return false; G.drag = { k, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      if (hitBox(G.flipB, x, y)) { if (d.k) G.s.fb = !G.s.fb; else G.s.fa = !G.s.fa; G.s.mult = false; G.touch(); return; }
      const o = G.f[1 - d.k]; if (hitBox({ x: o.x - 10, y: o.y - 10, w: o.w + 20, h: o.h + 20 }, x, y)) { G.s.mult = true; G.touch(); }
    },
    demo: G => ({ from: { x: G.f[0].x + G.f[0].w / 2, y: G.f[0].y + 40 }, to: { x: G.f[1].x + G.f[1].w / 2, y: G.f[1].y + 40 }, text: 'Junta las dos para multiplicar', ty: G.flipB.y - 14 }),
    peek: G => ({ f: G.f, flipB: G.flipB }),
  });
  return game;
})();
