// Une los rectángulos (Álgebra, alg-12b; spec 2026-11-18-algebra-revision): la distributiva al revés (factor común).
// Un rectángulo base y otros sueltos; cada producto es un rectángulo de alto × ancho. Arrastrar uno junto a la base solo
// pega si tienen el mismo alto: entonces forman un solo rectángulo y la suma se escribe como un solo producto,
// a·b + a·c = a·(b + c). Hay que juntar todos los que comparten el alto, y ninguno más.
// params = { rounds: [{ base: [alto, ancho], others: [[alto, ancho], …] }] }   state = { rounds: [{ on: [índices pegados] }] }
GAMES['une-rectangulos'] = (() => {
  const goods = r => r.others.map((o, i) => (o[0] === r.base[0] ? i : -1)).filter(i => i >= 0);
  const ok = (s, r) => [...s.on].sort().join() === goods(r).join();
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ on: [] }),
    ok,
    answered: s => s.on.length > 0,
    solution: r => { const g = goods(r), [h, w] = r.base; return `${h}·(${[w, ...g.map(i => r.others[i][1])].join(' + ')})`; },
    prompt: r => `Junta con la base $${r.base[0]}\\cdot ${r.base[1]}$ los que comparten su alto`,
    foot: () => 'Arrastra junto a la base los que tienen su mismo alto',
    layout(G) { G.top = 104; G.fb = { x: 12, y: G.H - 84, w: G.W - 24, h: 52 }; },
    enter(G) { G.drag = null; G.msg = null; },
    draw(G) {
      const { p, C, r } = G, good = ok(G.s, r), s = G.locked && !good ? { on: goods(r) } : G.s;
      const maxH = Math.max(r.base[0], ...r.others.map(o => o[0])), totW = r.base[1] + r.others.reduce((a, o) => a + o[1], 0);
      const u = Math.min((G.W - 40) / totW, (G.H * 0.26) / maxH), [h0, w0] = r.base, x0 = 18, y0 = G.top + 8;
      const rect = (x, y, h, w, col, txt) => { p.stroke(col); p.strokeWeight(2); p.fill(RK.al(p, col, 60)); p.rect(x, y, w * u, h * u, 3); TK.label(p, C, txt, x + w * u / 2, y + h * u / 2, C.ink, 13, w * u - 4); };
      rect(x0, y0, h0, w0, C.mint, `${h0}·${w0}`);
      let x = x0 + w0 * u;
      s.on.forEach(i => { const [h, w] = r.others[i]; rect(x, y0, h, w, G.locked ? C.ok : C.mint, `${h}·${w}`); x += w * u; });
      p.stroke(C.ink); p.strokeWeight(1.5); p.line(x0 - 8, y0, x0 - 8, y0 + h0 * u); TK.label(p, C, String(h0), x0 - 2 - 8, y0 + h0 * u / 2, C.ink, 12, 20);
      G.dock = { x: x - 10, y: y0 - 10, w: 60, h: h0 * u + 20 };
      // Los sueltos, abajo.
      const rest = r.others.map((_, i) => i).filter(i => !s.on.includes(i)), by = G.H * 0.56;
      let bx = 18; G.spots = [];
      rest.forEach(i => { const [h, w] = r.others[i]; G.spots.push({ i, x: bx, y: by, w: w * u, h: h * u }); if (G.drag?.i !== i) rect(bx, by, h, w, C.sky, `${h}·${w}`); bx += w * u + 14; });
      if (G.drag) { const [h, w] = r.others[G.drag.i]; rect(G.drag.x - w * u / 2, G.drag.y - h * u / 2, h, w, C.brand, `${h}·${w}`); }
      if (G.msg && G.t - G.msg.t < 2.4) TK.label(p, C, G.msg.text, G.W / 2, by - 16, C.bad, 12, G.W - 30);
      const ws = [w0, ...s.on.map(i => r.others[i][1])], terms = [r.base, ...s.on.map(i => r.others[i])].map(([a, b]) => `${a}\\cdot ${b}`).join(' + ');
      RK.strip(p, C, G.fb, `$${terms} = ${h0}\\cdot(${ws.join(' + ')}) = ${h0 * ws.reduce((a, b) => a + b, 0)}$`, { kicker: 'Factor común', col: G.locked ? C.ok : C.mint, size: 16 });
    },
    press(G, x, y) {
      const q = (G.spots || []).find(q => hitBox({ x: q.x - 4, y: q.y - 4, w: q.w + 8, h: q.h + 8 }, x, y));
      if (q) { G.drag = { i: q.i, x, y, from: 'tray' }; return true; }
      if (G.s.on.length && hitBox({ x: 0, y: G.top, w: G.W, h: G.H * 0.3 }, x, y)) { G.drag = { i: G.s.on.at(-1), x, y, from: 'dock' }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; if (!d) return; G.drag = null;
      const s = G.s, near = y < G.H * 0.5 && y > G.top - 20;
      if (d.from === 'dock') { if (!near) { s.on.pop(); G.touch(); } return; }
      if (!near) return;
      if (G.r.others[d.i][0] !== G.r.base[0]) { G.msg = { t: G.t, text: `Alto ${G.r.others[d.i][0]} y alto ${G.r.base[0]}: no forman un rectángulo` }; return; }
      s.on.push(d.i); G.msg = null; G.touch();
    },
    demo(G) { const q = G.spots?.[0]; return q ? { from: { x: q.x + q.w / 2, y: q.y + q.h / 2 }, to: { x: G.dock.x + 20, y: G.dock.y + G.dock.h / 2 }, text: 'Arrastra junto a la base', ty: G.H * 0.5 } : null; },
    peek: G => ({ spots: G.spots, dock: G.dock }),
  });
  return Object.assign(game, { goods });
})();
