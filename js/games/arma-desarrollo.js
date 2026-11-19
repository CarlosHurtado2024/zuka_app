// Armar un desarrollo del cubo (Preuniversitario, pu-es-3; spec 2026-11-18-preuda-razonamiento-completo): un desarrollo son
// seis cuadrados unidos por sus lados que al doblarlos cierran el cubo sin que dos caigan en la misma cara. Algunos cuadrados
// ya están; se arrastran los que faltan a la cuadrícula hasta que el desarrollo cierre (el juego lo dobla y lo comprueba).
// params = { rounds: [{ fixed: [[col, fila]], free: n }] }   (cuadrícula de 5 × 4)   state = { rounds: [{ cells: [[col, fila]] }] }
GAMES['arma-desarrollo'] = (() => {
  const all = (r, s) => [...r.fixed, ...s.cells];
  const ok = (s, r) => s.cells.length === r.free && CUBO.fold(all(r, s)) !== null;
  const answer = r => { const free = []; for (let x = 0; x < 5; x++) for (let y = 0; y < 4; y++) if (!r.fixed.some(c => c[0] === x && c[1] === y)) free.push([x, y]); for (let i = 0; i < free.length; i++) for (let j = i + 1; j < free.length; j++) { const s = { cells: r.free === 1 ? [free[i]] : [free[i], free[j]] }; if (ok(s, r)) return s; } return null; };
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ cells: [] }),
    ok,
    answered: s => s.cells.length > 0,
    solution: r => answer(r).cells.map(c => `(${c.join(', ')})`).join(' y '),
    prompt: r => `Pon ${r.free === 1 ? 'el cuadrado que falta' : `los ${r.free} cuadrados que faltan`} para que el cubo cierre`,
    foot: () => 'Arrastra cuadrados a la cuadrícula; sácalos para quitarlos',
    layout(G) { G.u = Math.min(48, (G.W - 40) / 5); G.o = { x: (G.W - 5 * G.u) / 2, y: 104 }; G.src = { x: G.W / 2 - 24, y: 104 + 4 * G.u + 18, w: 48, h: 40 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, u = G.u, o = G.o, good = ok(s, r);
      p.stroke(RK.al(p, C.line, 120)); p.strokeWeight(1); for (let i = 0; i <= 5; i++) p.line(o.x + i * u, o.y, o.x + i * u, o.y + 4 * u); for (let j = 0; j <= 4; j++) p.line(o.x, o.y + j * u, o.x + 5 * u, o.y + j * u);
      r.fixed.forEach(c => { p.stroke(C.ink); p.strokeWeight(1.4); p.fill(good ? C.ok : C.sky); p.rect(o.x + c[0] * u, o.y + c[1] * u, u, u); });
      s.cells.forEach(c => { p.stroke(C.ink); p.strokeWeight(1.4); p.fill(good ? C.ok : C.coral); p.rect(o.x + c[0] * u, o.y + c[1] * u, u, u); });
      if (s.cells.length < r.free) RK.chip(p, C, G.src, '+', { on: true, col: C.coral, size: 18 });
      if (G.drag) { p.noStroke(); p.fill(RK.al(p, C.coral, 200)); p.rect(G.drag.x - u / 2, G.drag.y - u / 2, u, u); }
      const n = all(r, s).length;
      RK.strip(p, C, G.fb, n < 6 ? `$\\text{${n} de 6 cuadrados}$` : good ? '$\\text{cierra: es un desarrollo}$' : '$\\text{no cierra: dos caras chocan}$', { col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      if (G.s.cells.length < G.r.free && hitBox(G.src, x, y)) { G.drag = { from: -1, x, y }; return true; }
      const k = G.s.cells.findIndex(c => hitBox({ x: G.o.x + c[0] * G.u, y: G.o.y + c[1] * G.u, w: G.u, h: G.u }, x, y)); if (k >= 0) { G.s.cells.splice(k, 1); G.drag = { from: k, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return; const cx = Math.floor((x - G.o.x) / G.u), cy = Math.floor((y - G.o.y) / G.u);
      if (cx >= 0 && cx < 5 && cy >= 0 && cy < 4 && ![...G.r.fixed, ...G.s.cells].some(c => c[0] === cx && c[1] === cy)) G.s.cells.push([cx, cy]);
      G.touch();
    },
    demo: G => ({ from: { x: G.src.x + 24, y: G.src.y + 20 }, to: { x: G.o.x + 4.5 * G.u, y: G.o.y + 3.5 * G.u }, text: 'Arrastra un cuadrado', ty: G.src.y + 54 }),
    peek: G => ({ o: G.o, u: G.u, src: G.src }),
  });
  return Object.assign(game, { answer });
})();
