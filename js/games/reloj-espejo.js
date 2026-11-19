// El reloj en el espejo (Preuniversitario, pu-es-4; spec 2026-11-18-preuda-razonamiento-completo): en un espejo vertical las
// agujas se ven al otro lado del 12: la hora del espejo y la real suman 12:00. A la izquierda está el reflejo; a la derecha,
// un reloj normal: se arrastra el minutero (y el horario lo sigue) hasta mostrar la hora real.
// params = { rounds: [{ seen: minutos desde las 12:00 }] }   state = { rounds: [{ t }] }   (minutos, de 5 en 5, de 0 a 715)
GAMES['reloj-espejo'] = (() => {
  const real = r => (720 - r.seen) % 720;
  const ok = (s, r) => s.t === real(r);
  const hm = t => `${Math.floor(t / 60) || 12}:${String(t % 60).padStart(2, '0')}`;
  const face = (p, C, c, R, t, mirror, col) => {
    p.stroke(C.ink); p.strokeWeight(2); p.fill(RK.al(p, C.card, 220)); p.circle(c.x, c.y, 2 * R);
    for (let k = 0; k < 12; k++) { const a = -Math.PI / 2 + k * Math.PI / 6; p.strokeWeight(k % 3 ? 1 : 2.5); p.line(c.x + R * 0.85 * Math.cos(a), c.y + R * 0.85 * Math.sin(a), c.x + R * 0.95 * Math.cos(a), c.y + R * 0.95 * Math.sin(a)); }
    const sx = mirror ? -1 : 1, am = -Math.PI / 2 + (t % 60) / 60 * 2 * Math.PI, ah = -Math.PI / 2 + (t % 720) / 720 * 2 * Math.PI;
    p.stroke(col); p.strokeWeight(3); p.line(c.x, c.y, c.x + sx * R * 0.5 * Math.cos(ah), c.y + R * 0.5 * Math.sin(ah));
    p.strokeWeight(2); p.line(c.x, c.y, c.x + sx * R * 0.8 * Math.cos(am), c.y + R * 0.8 * Math.sin(am));
    return { mx: c.x + sx * R * 0.8 * Math.cos(am), my: c.y + R * 0.8 * Math.sin(am) };
  };
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ t: r.seen }),
    ok,
    solution: r => `son las ${hm(real(r))}`,
    prompt: () => 'Este reloj se ve en un espejo. ¿Qué hora es en realidad?',
    foot: () => 'Arrastra el minutero del reloj de la derecha',
    layout(G) { G.R = Math.min(G.W * 0.21, 72); G.cL = { x: G.W * 0.27, y: 190 }; G.cR = { x: G.W * 0.73, y: 190 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { t: real(r) } : G.s, good = ok(s, r);
      face(p, C, G.cL, G.R, r.seen, true, C.coral); TK.label(p, C, 'en el espejo', G.cL.x, G.cL.y + G.R + 16, C.mute, 10, 100);
      G.hand = face(p, C, G.cR, G.R, s.t, false, good ? C.ok : C.brand); TK.label(p, C, `real: ${hm(s.t)}`, G.cR.x, G.cR.y + G.R + 16, C.ink, 11, 100);
      RK.knob(p, C, G.hand.mx, G.hand.my, C.brand);
      RK.strip(p, C, G.fb, good ? '$\\text{espejo + real} = 12{:}00$' : `$\\text{${hm(s.t)}}$`, { col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.hypot(x - G.cR.x, y - G.cR.y) > G.R + 20) return false; G.grab = true; G.prevA = Math.atan2(y - G.cR.y, x - G.cR.x); return true; },
    drag(G, x, y) {
      if (!G.grab) return false;
      const a = Math.atan2(y - G.cR.y, x - G.cR.x); let d = a - G.prevA; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; G.prevA = a;
      G.acc = (G.acc || 0) + d / (2 * Math.PI) * 60; const steps = Math.trunc(G.acc / 5);
      if (steps) { G.acc -= steps * 5; G.s.t = ((G.s.t + steps * 5) % 720 + 720) % 720; G.touch(); }
      return true;
    },
    release(G) { G.grab = false; G.acc = 0; },
    demo: G => ({ from: { x: G.hand?.mx ?? G.cR.x, y: G.hand?.my ?? G.cR.y - 50 }, to: { x: G.cR.x + G.R * 0.8, y: G.cR.y }, text: 'Gira el minutero', ty: G.cR.y + G.R + 36 }),
    peek: G => ({ cR: G.cR, R: G.R }),
  });
  return Object.assign(game, { answer: r => ({ t: real(r) }) });
})();
