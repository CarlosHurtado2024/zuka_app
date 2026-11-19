// El dato que falta (Preuniversitario, pu-gr-2; spec 2026-11-18-preuda-razonamiento-completo): se conoce el promedio de todos
// los datos pero falta uno. La línea del promedio pedido está marcada; se arrastra la barra que falta y el juego muestra en
// vivo el promedio que da con ese valor. Para que el promedio sea el pedido, la suma tiene que ser promedio × cantidad.
// params = { rounds: [{ data: [números con null en el que falta], mean, hi, step }] }   state = { rounds: [{ v }] }
GAMES['dato-faltante'] = (() => {
  const need = r => r.mean * r.data.length - r.data.reduce((a, b) => a + (b ?? 0), 0);
  const ok = (s, r) => s.v === need(r);
  const cur = (r, v) => r.data.map(d => d ?? v);
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ v: need(r) === r.step ? 2 * r.step : r.step }),
    ok,
    solution: r => `${r.mean} · ${r.data.length} = ${r.mean * r.data.length}; falta ${need(r)}`,
    prompt: r => `El promedio de los ${r.data.length} datos es ${r.mean}. ¿Cuál falta?`,
    foot: () => 'Arrastra la barra que falta',
    layout(G) { G.b = { x: 44, y: 96, w: G.W - 60, h: G.H - 224 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { v: need(r) } : G.s, good = ok(s, r), D = cur(r, s.v), k = r.data.indexOf(null);
      const Y = GRAF.axes(p, C, G.b, 0, r.hi, r.step); G.Y = Y;
      G.cols = GRAF.bars(p, C, G.b, D, D.map(String), Y, { col: i => (i === k ? (good ? C.ok : C.brand) : C.sky) });
      const y = Y(r.mean); p.stroke(C.coral); p.strokeWeight(1.5); p.drawingContext.setLineDash([6, 4]); p.line(G.b.x, y, G.b.x + G.b.w, y); p.drawingContext.setLineDash([]);
      TK.label(p, C, `promedio ${r.mean}`, G.b.x + 46, y - 10, C.coral, 9, 90);
      const c = G.cols[k]; RK.knob(p, C, c.cx, c.top, C.brand);
      const sum = D.reduce((a, b) => a + b, 0), m = Math.round(sum / D.length * 100) / 100;
      RK.strip(p, C, G.fb, `$${sum} \\div ${D.length} = ${m}$`, { kicker: good ? 'el promedio da justo' : 'el promedio con este dato', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const k = G.r.data.indexOf(null), c = G.cols?.[k]; if (!c || x < c.x - 14 || x > c.x + c.w + 14 || y < G.b.y - 20 || y > G.b.y + G.b.h + 10) return false; G.grab = true; game.move(G, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, y); return true; },
    release(G) { G.grab = false; },
    demo: G => { const c = G.cols?.[G.r.data.indexOf(null)]; return c ? { from: { x: c.cx, y: c.top }, to: { x: c.cx, y: c.top - 60 }, text: 'Sube la barra', ty: G.b.y + 10 } : null; },
    peek: G => ({ b: G.b, cols: G.cols }),
  });
  game.move = (G, y) => { const r = G.r, b = G.b, v = Math.max(0, Math.min(r.hi, Math.round((b.y + b.h - y) / b.h * r.hi / r.step) * r.step)); if (v !== G.s.v || !G.touched[G.cur]) { G.s.v = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ v: need(r) }) });
})();
