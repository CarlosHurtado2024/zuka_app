// La alcancía (Preuniversitario, pu-ec-2; spec 2026-11-18-preuda-razonamiento-completo): hay N monedas de dos valores y se sabe
// cuánto suman. Las monedas están en fila; se arrastra la divisoria: las de la izquierda son de un valor y las de la derecha
// del otro. El juego cuenta cuánto suman y lo compara con el total.
// params = { rounds: [{ n, v: [valor izq, valor der], total }] }   state = { rounds: [{ k }] }   (monedas del primer valor)
GAMES['alcancia-monedas'] = (() => {
  const sum = (r, k) => k * r.v[0] + (r.n - k) * r.v[1];
  const need = r => { for (let k = 0; k <= r.n; k++) if (sum(r, k) === r.total) return k; return null; };
  const ok = (s, r) => sum(r, s.k) === r.total;
  const fm = v => v.toLocaleString('es-CO');
  const game = roundsGame({
    aspect: 1.05,
    init: r => ({ k: need(r) === 0 ? 1 : 0 }),
    ok,
    solution: r => `${need(r)} de ${fm(r.v[0])} y ${r.n - need(r)} de ${fm(r.v[1])}`,
    prompt: r => `${r.n} monedas de ${fm(r.v[0])} y ${fm(r.v[1])} suman ${fm(r.total)}. ¿Cuántas de cada una?`,
    foot: () => 'Arrastra la divisoria entre las monedas',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { k: need(r) } : G.s, good = ok(s, r), per = Math.min(r.n, 10), d = Math.min(28, (G.W - 40) / per), rows = Math.ceil(r.n / per), x0 = (G.W - per * d) / 2, y0 = 120;
      G.pos = [];
      for (let i = 0; i < r.n; i++) {
        const x = x0 + (i % per + 0.5) * d, y = y0 + Math.floor(i / per) * (d + 6), a = i < s.k, col = a ? C.sun : RK.al(p, C.line, 230);
        p.stroke(C.ink); p.strokeWeight(1); p.fill(col); p.circle(x, y, d * 0.86);
        TK.label(p, C, a ? String(r.v[0]) : String(r.v[1]), x, y, a ? inkOn(C.sun) : C.ink, 8, d * 0.8);
        G.pos.push({ x, y });
      }
      const at = i => (i < r.n ? G.pos[i] : { x: G.pos[r.n - 1].x + d, y: G.pos[r.n - 1].y }), q = s.k < r.n ? at(s.k) : at(r.n);
      G.div = { x: q.x - d / 2, y: q.y };
      p.stroke(C.brand); p.strokeWeight(3); p.line(G.div.x, q.y - d * 0.6, G.div.x, q.y + d * 0.6); RK.knob(p, C, G.div.x, q.y + d * 0.6 + 4, C.brand);
      const S = sum(r, s.k);
      TK.label(p, C, `${s.k} · ${fm(r.v[0])} + ${r.n - s.k} · ${fm(r.v[1])}`, G.W / 2, y0 + rows * (d + 6) + 18, C.ink, 12, G.W - 30);
      RK.strip(p, C, G.fb, `$\\text{suman ${fm(S)}}$`, { kicker: good ? 'justo el total' : S < r.total ? 'falta' : 'sobra', col: G.locked || good ? C.ok : C.brand, size: 17 });
      G.d = d;
    },
    press(G, x, y) { if (!G.pos || y < G.pos[0].y - 30 || y > G.pos.at(-1).y + 40) return false; G.grab = true; game.move(G, x, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, x, y); return true; },
    release(G) { G.grab = false; },
    demo: G => (G.div ? { from: G.div, to: { x: G.div.x + 3 * G.d, y: G.div.y }, text: 'Arrastra la divisoria', ty: G.div.y - 34 } : null),
    peek: G => ({ pos: G.pos }),
  });
  game.move = (G, x, y) => {
    const r = G.r; let best = 0, bd = 1e9;
    for (let k = 0; k <= r.n; k++) { const q = k < r.n ? G.pos[k] : { x: G.pos[r.n - 1].x + G.d, y: G.pos[r.n - 1].y }, dx = q.x - G.d / 2 - x, dy = q.y - y, dd = dx * dx + dy * dy * 4; if (dd < bd) { bd = dd; best = k; } }
    if (best !== G.s.k || !G.touched[G.cur]) { G.s.k = best; G.touch(); }
  };
  return Object.assign(game, { answer: r => ({ k: need(r) }) });
})();
