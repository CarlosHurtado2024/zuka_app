// Reflejar una figura (Preuniversitario, pu-es-4; spec 2026-11-18-preuda-razonamiento-completo): en un espejo cada casilla queda
// a la misma distancia del eje, del otro lado; un espejo vertical cambia izquierda por derecha pero no arriba por abajo. Se
// pinta arrastrando el dedo por las casillas del otro lado del eje (arrastrar sobre una pintada la borra) hasta dibujar el reflejo.
// params = { rounds: [{ n, axis: 'v' | 'h', cells: [[col, fila]] }] }   (eje en la mitad de una cuadrícula de n × n)
// state = { rounds: [{ on: ['col,fila'] }] }
GAMES['espejo-figura'] = (() => {
  const mirror = (r, [x, y]) => (r.axis === 'v' ? [r.n - 1 - x, y] : [x, r.n - 1 - y]);
  const want = r => r.cells.map(c => mirror(r, c).join(',')).sort();
  const ok = (s, r) => [...s.on].sort().join('|') === want(r).join('|');
  const lay = G => { const r = G.r; G.u = Math.min(38, (G.W - 40) / r.n); G.o = { x: (G.W - r.n * G.u) / 2, y: 106 }; };
  const side = (r, x, y) => (r.axis === 'v' ? x >= r.n / 2 : y >= r.n / 2);
  const game = roundsGame({
    aspect: 1.45,
    init: () => ({ on: [] }),
    ok,
    answered: s => s.on.length > 0,
    solution: r => `${want(r).length} casillas reflejadas`,
    prompt: r => `Dibuja el reflejo en el espejo ${r.axis === 'v' ? 'vertical' : 'horizontal'}`,
    foot: () => 'Arrastra el dedo por las casillas del otro lado del espejo',
    layout(G) { lay(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.paint = null; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { on: want(r) } : G.s, u = G.u, o = G.o, good = ok(s, r);
      for (let x = 0; x < r.n; x++) for (let y = 0; y < r.n; y++) {
        const k = `${x},${y}`, fig = r.cells.some(c => c[0] === x && c[1] === y), on = s.on.includes(k);
        p.stroke(RK.al(p, C.line, 140)); p.strokeWeight(1); p.fill(fig ? C.sky : on ? (good ? C.ok : C.coral) : side(r, x, y) ? RK.al(p, C.card, 200) : RK.al(p, C.card, 90)); p.rect(o.x + x * u, o.y + y * u, u, u);
      }
      p.stroke(C.brand); p.strokeWeight(3); if (r.axis === 'v') p.line(o.x + r.n * u / 2, o.y - 6, o.x + r.n * u / 2, o.y + r.n * u + 6); else p.line(o.x - 6, o.y + r.n * u / 2, o.x + r.n * u + 6, o.y + r.n * u / 2);
      RK.strip(p, C, G.fb, good ? '$\\text{es su reflejo}$' : `$\\text{${s.on.length} casillas pintadas}$`, { col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const c = [Math.floor((x - G.o.x) / G.u), Math.floor((y - G.o.y) / G.u)]; if (c[0] < 0 || c[1] < 0 || c[0] >= G.r.n || c[1] >= G.r.n || !side(G.r, ...c)) return false; const k = c.join(','); G.paint = !G.s.on.includes(k); game.apply(G, k); return true; },
    drag(G, x, y) { if (G.paint == null) return false; const c = [Math.floor((x - G.o.x) / G.u), Math.floor((y - G.o.y) / G.u)]; if (c[0] >= 0 && c[1] >= 0 && c[0] < G.r.n && c[1] < G.r.n && side(G.r, ...c)) game.apply(G, c.join(',')); return true; },
    release(G) { G.paint = null; },
    demo: G => { const r = G.r, a = r.axis === 'v' ? [r.n - 1, 0] : [0, r.n - 1], b = r.axis === 'v' ? [r.n - 1, 2] : [2, r.n - 1]; return { from: { x: G.o.x + (a[0] + 0.5) * G.u, y: G.o.y + (a[1] + 0.5) * G.u }, to: { x: G.o.x + (b[0] + 0.5) * G.u, y: G.o.y + (b[1] + 0.5) * G.u }, text: 'Pinta arrastrando', ty: G.o.y + r.n * G.u + 18 }; },
    peek: G => ({ o: G.o, u: G.u }),
  });
  game.apply = (G, k) => { const on = G.s.on, i = on.indexOf(k); if (G.paint && i < 0) { on.push(k); G.touch(); } else if (!G.paint && i >= 0) { on.splice(i, 1); G.touch(); } };
  return Object.assign(game, { answer: r => ({ on: want(r) }) });
})();
