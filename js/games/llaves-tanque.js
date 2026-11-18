// Las llaves del tanque (Álgebra, alg-12e; juego en movimiento; spec 2026-11-18-algebra-revision): proporción inversa.
// Con más llaves abiertas el tanque se llena en menos tiempo, y lo que se conserva es el producto llaves × horas. Se
// arrastra cuántas llaves abrir y al soltar el agua corre mientras el reloj cuenta las horas: el tanque debe llenarse
// justo cuando el reloj marca la meta.
// params = { rounds: [{ title, items: [{ taps, hours, target }] }] }   (dato: `taps` llaves tardan `hours` horas)   s = { n, shot }
GAMES['llaves-tanque'] = (() => {
  const need = it => (it.taps * it.hours) / it.target;
  const game = questGame({
    aspect: 1.05,
    idle: 'Elige las llaves con calma; el agua sale al soltar',
    init: it => ({ n: it.taps, shot: null }),
    ok: (s, it) => s.n * it.target === it.taps * it.hours,
    answer: it => ({ n: need(it), shot: null }),
    solution: it => `${need(it)} llaves: ${it.taps} · ${it.hours} = ${need(it)} · ${it.target}`,
    prompt: it => `${it.taps} llaves lo llenan en ${it.hours} h. Llénalo en ${it.target} h`,
    foot: (it, s) => (s.missed ? 'Lo que se conserva es llaves × horas' : 'Arrastra cuántas llaves abrir y suelta'),
    layout(G) { G.tank = { x: G.W / 2 - 60, y: G.top + 50, w: 120, h: 130 }; G.tY = G.bottom - 36; },
    draw(G) {
      const { p, C, s, item: it, tank } = G, time = (it.taps * it.hours) / s.n;
      let fill = 0, clock = 0;
      if (s.shot != null) { const t = Math.min(1, (G.t - s.shot) / 1.8); clock = t * Math.max(time, it.target) ; fill = Math.min(1, clock / time); if (t >= 1 && !G.solved) { if (Math.abs(time - it.target) < 1e-9) G.good('¡Lleno a tiempo!'); else { s.shot = null; s.missed = true; G.bad(time > it.target ? `Tardó ${+time.toFixed(2)} h` : `Se llenó en ${+time.toFixed(2)} h`); } } }
      if (G.solved) { fill = 1; clock = it.target; }
      p.stroke(C.ink); p.strokeWeight(2); p.fill(C.card); p.rect(tank.x, tank.y, tank.w, tank.h, 4);
      p.noStroke(); p.fill(RK.al(p, C.sky, 170)); p.rect(tank.x + 2, tank.y + tank.h * (1 - fill), tank.w - 4, tank.h * fill - 2, 2);
      for (let i = 0; i < s.n; i++) { const x = tank.x + 10 + i * (tank.w - 20) / Math.max(1, s.n - 1); p.stroke(C.ink); p.strokeWeight(3); p.line(x, tank.y - 22, x, tank.y - 10); if (s.shot != null && fill < 1) { p.stroke(RK.al(p, C.sky, 200)); p.strokeWeight(2); p.line(x, tank.y - 8, x, tank.y + tank.h * (1 - fill)); } }
      TK.label(p, C, `reloj: ${+clock.toFixed(1)} h`, tank.x + tank.w + 52, tank.y + 20, C.ink, 13, 96);
      TK.label(p, C, `meta: ${it.target} h`, tank.x + tank.w + 52, tank.y + 44, C.ok, 12, 96);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 12, s.n - 1, i => String(i + 1));
      TK.label(p, C, `${s.n} llave${s.n === 1 ? '' : 's'}`, G.W / 2, G.tY - 22, C.ink, 13, 100);
    },
    press(G, x, y) { if (G.s.shot != null || Math.abs(y - G.tY) > 34) return false; G.grab = true; G.s.n = RK.pick(x, 30, G.W - 30, 12) + 1; return true; },
    drag(G, x) { if (!G.grab || G.s.shot != null) return false; G.s.n = RK.pick(x, 30, G.W - 30, 12) + 1; return true; },
    release(G) { if (G.grab && G.s.shot == null && !G.solved) { G.s.shot = G.t; G.api.sfx?.tap?.(); } G.grab = false; },
    demo: G => (G.X ? { from: { x: G.X(G.s.n - 1), y: G.tY }, to: { x: G.X(G.s.n + 2), y: G.tY }, text: 'Arrastra y suelta', ty: G.tY - 50 } : null),
    peek: G => ({ tY: G.tY, need: need(G.item), flying: G.s.shot != null }),
  });
  return Object.assign(game, { need });
})();
