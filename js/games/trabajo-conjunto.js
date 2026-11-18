// El trabajo conjunto (Preuniversitario, pu-pr-3; spec 2026-11-18-preuda-razonamiento-completo): si uno hace un trabajo en a
// horas y otro en b, en cada hora hacen 1/a y 1/b: juntos se suman las rapideces, no los tiempos. Se arrastran las horas y el
// tanque se llena con dos colores (lo que aporta cada uno). Hay que dejarlo lleno justo.
// params = { rounds: [{ who: [a, b], a, b }] }   state = { rounds: [{ t }] }   (horas, de media en media)
GAMES['trabajo-conjunto'] = (() => {
  const need = r => r.a * r.b / (r.a + r.b);
  const ok = (s, r) => Math.abs(s.t - need(r)) < 1e-9;
  const max = r => Math.min(r.a, r.b);
  const N = r => Math.round(max(r) * 2);
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ t: 0.5 }),
    ok,
    solution: r => `${RK.num(need(r))} horas`,
    prompt: r => `${r.who[0]} solo tarda ${r.a} h y ${r.who[1]} solo ${r.b} h. ¿Cuánto tardan juntos?`,
    foot: () => 'Arrastra las horas que trabajan juntos',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { t: need(r) } : G.s, fa = s.t / r.a, fb = s.t / r.b, tot = fa + fb, good = ok(s, r), x0 = G.W / 2 - 50, y0 = 110, h = G.tY - 180;
      p.noFill(); p.stroke(C.ink); p.strokeWeight(1.6); p.rect(x0, y0, 100, h, 4);
      const ha = Math.min(1, fa) * h, hb = Math.min(1 - Math.min(1, fa), fb) * h;
      p.noStroke(); p.fill(good ? C.ok : C.sky); p.rect(x0 + 2, y0 + h - ha, 96, ha); p.fill(good ? C.ok : C.coral); p.rect(x0 + 2, y0 + h - ha - hb, 96, hb);
      if (tot > 1) TK.label(p, C, 'se rebosa', G.W / 2, y0 - 10, C.bad, 11, 100);
      TK.label(p, C, `${r.who[0]}: ${RK.num(Math.round(fa * 1000) / 1000)}`, x0 - 50, y0 + h - ha / 2, C.sky, 10, 90);
      TK.label(p, C, `${r.who[1]}: ${RK.num(Math.round(fb * 1000) / 1000)}`, x0 + 150, y0 + h - ha - hb / 2, C.coral, 10, 90);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, N(r), Math.round(s.t * 2) - 1, i => ((i + 1) % 2 === 0 ? String((i + 1) / 2) : null));
      RK.strip(p, C, G.fb, `$\\tfrac{${RK.num(s.t)}}{${r.a}} + \\tfrac{${RK.num(s.t)}}{${r.b}} ${good ? '= 1' : tot > 1 ? '> 1' : '< 1'}$`, { kicker: 'Lo que hace cada uno se suma', col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X(1), y: G.tY }, text: 'Arrastra las horas', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = (RK.pick(x, 30, G.W - 30, N(G.r)) + 1) / 2; if (v !== G.s.t || !G.touched[G.cur]) { G.s.t = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ t: need(r) }) });
})();
