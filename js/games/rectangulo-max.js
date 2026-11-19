// La cerca más rendidora (Preuniversitario, pu-ar-4; spec 2026-11-18-preuda-razonamiento-completo): con una cerca de largo fijo
// se encierra un rectángulo. Se arrastra la esquina: si el ancho crece, el largo se achica, porque la cerca no alcanza para más.
// El área se ve en cuadritos y en un registro de las que se han probado; la mayor sale cuando el rectángulo es un cuadrado.
// params = { rounds: [{ P, step }] }   state = { rounds: [{ w }] }
GAMES['rectangulo-max'] = (() => {
  const need = r => r.P / 4;
  const ok = (s, r) => s.w === need(r);
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ w: r.step }),
    ok,
    solution: r => `${need(r)} × ${need(r)}: área ${need(r) ** 2}`,
    prompt: r => `Con ${r.P} m de cerca, ¿qué rectángulo encierra más área?`,
    foot: () => 'Arrastra la esquina del rectángulo',
    layout(G) { G.o = { x: 30, y: G.H - 150 }; G.u = G.r ? Math.min((G.W - 60) / (G.r.P / 2), (G.H - 300) / (G.r.P / 2) * 1.6, 22) : 14; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; G.u = Math.min((G.W - 60) / (G.r.P / 2), (G.H - 300) / (G.r.P / 2) * 1.6, 22); G.tried = []; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { w: need(r) } : G.s, good = ok(s, r), h = r.P / 2 - s.w, u = G.u, o = G.o;
      p.noStroke(); p.fill(RK.al(p, good ? C.ok : C.sky, 90)); p.rect(o.x, o.y - h * u, s.w * u, h * u);
      p.stroke(RK.al(p, C.line, 120)); p.strokeWeight(1);
      for (let i = 1; i < s.w; i++) p.line(o.x + i * u, o.y, o.x + i * u, o.y - h * u);
      for (let j = 1; j < h; j++) p.line(o.x, o.y - j * u, o.x + s.w * u, o.y - j * u);
      p.noFill(); p.stroke(C.sun); p.strokeWeight(3); p.rect(o.x, o.y - h * u, s.w * u, h * u);
      G.corner = { x: o.x + s.w * u, y: o.y - h * u }; RK.knob(p, C, G.corner.x, G.corner.y, C.brand);
      TK.label(p, C, `${s.w}`, o.x + s.w * u / 2, o.y + 12, C.ink, 10, 40); TK.label(p, C, `${h}`, o.x - 12, o.y - h * u / 2, C.ink, 10, 20);
      if (!G.tried.some(t => t[0] === s.w)) G.tried.push([s.w, s.w * h]);
      const best = G.tried.reduce((a, t) => (t[1] > a[1] ? t : a), [0, -1]);
      TK.label(p, C, `mejor probado: ${best[0]} × ${r.P / 2 - best[0]} = ${best[1]}`, G.W - 90, 104, C.mute, 9, 170);
      RK.strip(p, C, G.fb, `$${s.w} \\cdot ${h} = ${s.w * h}$`, { kicker: good ? 'la mayor área: un cuadrado' : `cerca: 2 · (${s.w} + ${h}) = ${r.P}`, col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.hypot(x - G.corner.x, y - G.corner.y) > 30) return false; G.grab = true; return true; },
    drag(G, x, y) { if (!G.grab) return false; const r = G.r, w = Math.max(r.step, Math.min(r.P / 2 - r.step, Math.round((x - G.o.x) / G.u / r.step) * r.step)); if (w !== G.s.w) { G.s.w = w; G.touch(); } return true; },
    release(G) { G.grab = false; },
    demo: G => (G.corner ? { from: G.corner, to: { x: G.corner.x + 3 * G.u, y: G.corner.y + 3 * G.u }, text: 'Arrastra la esquina', ty: G.o.y + 30 } : null),
    peek: G => ({ corner: G.corner, o: G.o, u: G.u }),
  });
  return Object.assign(game, { answer: r => ({ w: need(r) }) });
})();
