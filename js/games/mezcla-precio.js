// La mezcla (Preuniversitario, pu-ec-2; spec 2026-11-18-preuda-razonamiento-completo): se mezclan dos productos de precios
// distintos para tener un total de kilos a un precio dado. Se desliza cuántos kilos van del primero (el resto es del segundo);
// el juego suma lo que cuesta cada montón y da el precio por kilo de la mezcla en una aguja.
// params = { rounds: [{ a: [nombre, precio], b: [nombre, precio], total, target, step }] }   state = { rounds: [{ ka }] }
GAMES['mezcla-precio'] = (() => {
  const price = (r, ka) => (ka * r.a[1] + (r.total - ka) * r.b[1]) / r.total;
  const need = r => { for (let k = 0; k <= r.total; k += r.step) if (Math.abs(price(r, k) - r.target) < 1e-9) return k; return null; };
  const ok = (s, r) => Math.abs(price(r, s.ka) - r.target) < 1e-9;
  const N = r => Math.round(r.total / r.step) + 1;
  const fm = v => Math.round(v).toLocaleString('es-CO');
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ ka: need(r) === 0 ? r.step : 0 }),
    ok,
    solution: r => `${need(r)} kg de ${r.a[0]} y ${r.total - need(r)} kg de ${r.b[0]}`,
    prompt: r => `${r.total} kg de mezcla a ${fm(r.target)} el kilo: ¿cuánto de cada uno?`,
    foot: () => 'Desliza cuántos kilos van del primero',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { ka: need(r) } : G.s, good = ok(s, r), kb = r.total - s.ka, cx = [G.W * 0.25, G.W * 0.75], base = 230, u = Math.min(14, 120 / r.total * 2);
      [[r.a, s.ka, C.coral], [r.b, kb, C.sky]].forEach(([[name, pr], kg, col], i) => {
        const per = 5;
        for (let k = 0; k < kg; k++) { p.noStroke(); p.fill(col); p.rect(cx[i] - per * u / 2 + (k % per) * u, base - (Math.floor(k / per) + 1) * u, u - 1, u - 1, 2); }
        TK.label(p, C, `${name}: ${kg} kg`, cx[i], base + 14, C.ink, 11, G.W * 0.45);
        TK.label(p, C, `a ${fm(pr)} = ${fm(kg * pr)}`, cx[i], base + 30, C.mute, 9, G.W * 0.45);
      });
      const pm = price(r, s.ka), lo = Math.min(r.a[1], r.b[1]), hi = Math.max(r.a[1], r.b[1]), gx = x => 30 + (x - lo) / (hi - lo) * (G.W - 60), gy = 104;
      p.stroke(C.line); p.strokeWeight(3); p.line(30, gy, G.W - 30, gy);
      p.noStroke(); p.fill(C.coral); p.circle(gx(r.target), gy, 8);
      TK.label(p, C, `meta ${fm(r.target)}`, gx(r.target), gy - 12, C.coral, 9, 80);
      RK.knob(p, C, gx(pm), gy, good ? C.ok : C.brand);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, N(r), s.ka / r.step, k => (k % 2 === 0 ? String(k * r.step) : null), good ? C.ok : C.brand);
      RK.strip(p, C, G.fb, `$\\tfrac{${fm(s.ka * r.a[1])} + ${fm(kb * r.b[1])}}{${r.total}} = ${fm(pm)}$`, { kicker: good ? 'precio justo' : 'precio por kilo de la mezcla', col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 28) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.ka / G.r.step), y: G.tY }, to: { x: G.X(G.s.ka / G.r.step) + 60, y: G.tY }, text: 'Desliza los kilos', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const r = G.r, v = RK.pick(x, 30, G.W - 30, N(r)) * r.step; if (v !== G.s.ka || !G.touched[G.cur]) { G.s.ka = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ ka: need(r) }) });
})();
