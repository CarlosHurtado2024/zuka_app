// La nota que falta (Preuniversitario, pu-ar-2; spec 2026-11-18-preuda-razonamiento-completo): en un promedio ponderado cada
// nota pesa su porcentaje. Cada nota es una barra tan ancha como su peso y tan alta como la nota; la línea de la definitiva es
// la altura que tendría todo parejo. Se sube la barra de la nota que falta hasta que la definitiva llegue a la meta.
// params = { rounds: [{ items: [[rótulo, peso %, nota | null]], target }] }   state = { rounds: [{ g }] }   (de 0 a 5, de 0.1 en 0.1)
GAMES['nota-ponderada'] = (() => {
  const def = (r, g) => r.items.reduce((a, [, w, n]) => a + w / 100 * (n ?? g), 0);
  const r2 = v => Math.round(v * 100) / 100;
  const need = r => { for (let k = 0; k <= 50; k++) if (Math.abs(def(r, k / 10) - r.target) < 1e-9) return k / 10; return null; };
  const ok = (s, r) => Math.abs(def(r, s.g) - r.target) < 1e-9;
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ g: need(r) === 0 ? 1 : 0 }),
    ok,
    solution: r => `le falta un ${need(r)}`,
    prompt: r => `¿Qué nota necesita para que la definitiva sea ${r.target}?`,
    foot: () => 'Sube la barra de la nota que falta',
    layout(G) { G.b = { x: 40, y: 104, w: G.W - 60, h: G.H - 250 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { g: need(r) } : G.s, good = ok(s, r), b = G.b, Y = v => b.y + b.h - v / 5 * b.h;
      GRAF.axes(p, C, b, 0, 5, 1);
      let x = b.x; G.miss = null;
      r.items.forEach(([lab, w, n]) => {
        const bw = b.w * w / 100, v = n ?? s.g, miss = n === null;
        p.noStroke(); p.fill(miss ? (good ? C.ok : C.brand) : RK.al(p, C.sky, 170)); p.rect(x + 2, Y(v), bw - 4, Y(0) - Y(v), 3, 3, 0, 0);
        TK.label(p, C, `${lab} · ${w} %`, x + bw / 2, b.y + b.h + 13, C.ink, 9, bw);
        TK.label(p, C, String(v), x + bw / 2, Y(v) - 10, miss ? C.brand : C.ink, 11, bw);
        if (miss) { G.miss = { x: x + bw / 2, x0: x, x1: x + bw }; RK.knob(p, C, x + bw / 2, Y(v), C.brand); }
        x += bw;
      });
      const d = def(r, s.g), y = Y(d); p.stroke(C.coral); p.strokeWeight(2); p.drawingContext.setLineDash([6, 4]); p.line(b.x, y, b.x + b.w, y); p.drawingContext.setLineDash([]);
      TK.label(p, C, `definitiva ${r2(d)}`, b.x + b.w - 50, y - 10, C.coral, 10, 100);
      RK.strip(p, C, G.fb, `$${r.items.map(([, w, n]) => `${w / 100}\\cdot ${n ?? s.g}`).join(' + ')} = ${r2(d)}$`, { kicker: good ? 'llega justo a la meta' : `meta ${r.target}`, col: G.locked || good ? C.ok : C.brand, size: 14 });
    },
    // Arrastre relativo: 10 px por décima desde donde se tocó; un toque sin arrastrar sube o baja una décima.
    press(G, x, y) { const m = G.miss; if (!m || x < m.x0 - 6 || x > m.x1 + 6 || y < G.b.y - 20 || y > G.b.y + G.b.h + 10) return false; G.grab = { y0: y, g0: G.s.g, moved: false }; return true; },
    drag(G, x, y) { if (!G.grab) return false; if (Math.abs(y - G.grab.y0) > 4) G.grab.moved = true; game.set(G, G.grab.g0 * 10 + Math.round((G.grab.y0 - y) / 10)); return true; },
    release(G, x, y) { if (G.grab && !G.grab.moved) { const b = G.b, top = b.y + b.h - G.s.g / 5 * b.h; game.set(G, G.s.g * 10 + (y < top ? 1 : -1)); } G.grab = null; },
    demo: G => (G.miss ? { from: { x: G.miss.x, y: G.b.y + G.b.h - 10 }, to: { x: G.miss.x, y: G.b.y + G.b.h - 90 }, text: 'Sube la barra', ty: G.b.y + 10 } : null),
    peek: G => ({ b: G.b, miss: G.miss }),
  });
  game.set = (G, tenths) => { const g = Math.max(0, Math.min(50, Math.round(tenths))) / 10; if (g !== G.s.g || !G.touched[G.cur]) { G.s.g = g; G.touch(); } };
  return Object.assign(game, { answer: r => ({ g: need(r) }) });
})();
