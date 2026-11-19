// Tumbar la frase con lo mínimo (Preuniversitario, pu-lo-2; spec 2026-11-18-preuda-razonamiento-completo): una fila de luces y
// una frase que hoy es verdad («todas están prendidas», «ninguna está prendida», «alguna está prendida»). Se tocan luces para
// cambiarlas hasta volver falsa la frase, cambiando lo menos posible. Así se ve que «todas» cae con una sola, y que «alguna»
// solo cae si se apagan todas: su negación es «ninguna».
// params = { rounds: [{ kind: 'todas' | 'ninguna' | 'alguna', on: [estado inicial] }] }   state = { rounds: [{ on: [...] }] }
GAMES['niega-todos'] = (() => {
  const SAY = { todas: 'Todas las luces están prendidas', ninguna: 'Ninguna luz está prendida', alguna: 'Alguna luz está prendida' };
  const NEG = { todas: 'alguna está apagada', ninguna: 'alguna está prendida', alguna: 'ninguna está prendida' };
  const truth = (k, on) => (k === 'todas' ? on.every(Boolean) : k === 'ninguna' ? !on.some(Boolean) : on.some(Boolean));
  const changes = (s, r) => s.on.filter((v, i) => v !== r.on[i]).length;
  const minCh = r => (r.kind === 'alguna' ? r.on.filter(Boolean).length : 1);
  const ok = (s, r) => !truth(r.kind, s.on) && changes(s, r) === minCh(r);
  const answer = r => { const on = r.on.slice(); if (r.kind === 'alguna') on.fill(false); else on[0] = !on[0]; return { on }; };
  const game = roundsGame({
    aspect: 1.05,
    init: r => ({ on: r.on.slice() }),
    answered: (s, r) => changes(s, r) > 0,
    ok,
    solution: r => `basta que ${NEG[r.kind]}: ${minCh(r)} cambio${minCh(r) > 1 ? 's' : ''}`,
    prompt: r => `«${SAY[r.kind]}». Vuélvela falsa cambiando lo menos posible`,
    foot: () => 'Toca una luz para prenderla o apagarla',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r), n = s.on.length, w = (G.W - 30) / n, y = 180, d = Math.min(w * 0.7, 44);
      G.bulbs = s.on.map((b, i) => {
        const x = 15 + (i + 0.5) * w, ch = b !== r.on[i];
        if (b) { p.noStroke(); p.fill(RK.al(p, C.sun, 70)); p.circle(x, y, d * 1.5); }
        p.stroke(ch ? C.brand : C.ink); p.strokeWeight(ch ? 2.5 : 1.4); p.fill(b ? C.sun : RK.al(p, C.card, 200)); p.circle(x, y, d);
        return { x, y, d, i };
      });
      const t = truth(r.kind, s.on), c = changes(s, r);
      TK.label(p, C, `la frase es ${t ? 'verdad' : 'falsa'}`, G.W / 2, 246, t ? C.mute : C.coral, 12, G.W - 30);
      RK.strip(p, C, G.fb, `$\\text{${c} cambio${c === 1 ? '' : 's'}}$`, { kicker: good ? `cae: ${NEG[r.kind]}` : t ? 'sigue siendo verdad' : 'falsa, pero ¿con menos cambios?', col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const i = (G.bulbs || []).findIndex(b => Math.hypot(x - b.x, y - b.y) < b.d / 2 + 8); if (i < 0) return false; G.s.on[i] = !G.s.on[i]; G.touch(); return true; },
    demo: G => (G.bulbs ? { from: G.bulbs[0], to: G.bulbs[0], text: 'Toca una luz', ty: G.bulbs[0].y + 50 } : null),
    peek: G => ({ bulbs: G.bulbs }),
  });
  return Object.assign(game, { answer });
})();
