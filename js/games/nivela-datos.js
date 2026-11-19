// Nivelar los datos (Preuniversitario, pu-gr-2; spec 2026-11-18-preuda-razonamiento-completo): el promedio es la altura que
// tendrían todas las barras si se repartiera parejo. Se arrastra la línea de nivel: lo que sobresale por encima se pinta de un
// color y lo que falta por debajo de otro, con su cuenta. Cuando sobra lo mismo que falta, la línea está en el promedio.
// params = { rounds: [{ data: [números], labs?, hi, step }] }   state = { rounds: [{ h }] }   (de medio en medio)
GAMES['nivela-datos'] = (() => {
  const mean = r => r.data.reduce((a, b) => a + b, 0) / r.data.length;
  const ok = (s, r) => s.h === mean(r);
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ h: mean(r) === 0.5 ? 1 : 0.5 }),
    ok,
    solution: r => `${r.data.join(' + ')} = ${r.data.reduce((a, b) => a + b, 0)}; ÷ ${r.data.length} = ${mean(r)}`,
    prompt: () => 'Lleva la línea al promedio: que sobre lo mismo que falta',
    foot: () => 'Arrastra la línea de nivel',
    layout(G) { G.b = { x: 44, y: 96, w: G.W - 92, h: G.H - 224 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { h: mean(r) } : G.s, good = ok(s, r);
      const Y = GRAF.axes(p, C, G.b, 0, r.hi, r.step); G.Y = Y;
      const cols = GRAF.bars(p, C, G.b, r.data, r.labs || r.data.map(String), Y, { col: () => RK.al(p, C.sky, 160) });
      let over = 0, under = 0;
      cols.forEach((c, i) => {
        const v = r.data[i];
        if (v > s.h) { over += v - s.h; p.noStroke(); p.fill(RK.al(p, C.coral, 200)); p.rect(c.x, Y(v), c.w, Y(s.h) - Y(v)); }
        else if (v < s.h) { under += s.h - v; p.noStroke(); p.fill(RK.al(p, C.mint, 120)); p.rect(c.x, Y(s.h), c.w, Y(v) - Y(s.h)); }
      });
      const y = Y(s.h); p.stroke(good ? C.ok : C.brand); p.strokeWeight(2.5); p.line(G.b.x, y, G.b.x + G.b.w, y); RK.knob(p, C, G.b.x + G.b.w + 14, y, C.brand);
      TK.label(p, C, String(s.h), G.b.x + G.b.w + 14, y - 14, C.brand, 11, 30);
      RK.strip(p, C, G.fb, `$\\text{sobra}\\ ${over}\\ \\cdot\\ \\text{falta}\\ ${under}$`, { kicker: good ? `promedio ${s.h}` : over > under ? 'sobra más: sube la línea' : 'falta más: baja la línea', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.Y(G.s.h)) > 26 || x < G.b.x - 10) return false; G.grab = true; game.move(G, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, y); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.b.x + G.b.w + 14, y: G.Y(G.s.h) }, to: { x: G.b.x + G.b.w + 14, y: G.Y(G.s.h) - 60 }, text: 'Sube la línea', ty: G.b.y + 10 }),
    peek: G => ({ b: G.b }),
  });
  game.move = (G, y) => { const r = G.r, b = G.b, v = Math.max(0, Math.min(r.hi, Math.round((b.y + b.h - y) / b.h * r.hi * 2) / 2)); if (v !== G.s.h || !G.touched[G.cur]) { G.s.h = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ h: mean(r) }) });
})();
