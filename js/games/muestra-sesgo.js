// La muestra que representa (Preuniversitario, pu-gr-3; spec 2026-11-18-preuda-razonamiento-completo): un pueblo de 100
// personas en una cuadrícula; las que dicen «sí» están pintadas, pero no repartidas parejo. Se arrastra el marco de la muestra:
// el juego cuenta qué porcentaje dice «sí» adentro. Una muestra tomada en un solo rincón engaña; hay que encontrar un lugar
// donde la muestra se parezca al pueblo entero (a no más de `tol` puntos).
// params = { rounds: [{ grid: [filas de '0'/'1'], w, h, tol }] }   state = { rounds: [{ x, y }] }   (esquina del marco)
GAMES['muestra-sesgo'] = (() => {
  const tot = r => { const all = r.grid.join(''); return Math.round([...all].filter(c => c === '1').length / all.length * 100); };
  const pct = (r, x, y) => { let k = 0; for (let j = y; j < y + r.h; j++) for (let i = x; i < x + r.w; i++) k += r.grid[j][i] === '1'; return Math.round(k / (r.w * r.h) * 100); };
  const ok = (s, r) => Math.abs(pct(r, s.x, s.y) - tot(r)) <= r.tol;
  const best = r => { let b = null; for (let y = 0; y + r.h <= r.grid.length; y++) for (let x = 0; x + r.w <= r.grid[0].length; x++) { const d = Math.abs(pct(r, x, y) - tot(r)); if (!b || d < b.d) b = { x, y, d }; } return { x: b.x, y: b.y }; };
  const game = roundsGame({
    aspect: 1.4,
    init: () => ({ x: 0, y: 0 }),
    ok,
    solution: r => { const b = best(r); return `una muestra con ${pct(r, b.x, b.y)} % de «sí», cerca del ${tot(r)} % del pueblo`; },
    prompt: r => `En el pueblo, el ${tot(r)} % dice «sí». Busca una muestra que se le parezca`,
    foot: () => 'Arrastra el marco de la muestra',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? best(r) : G.s, good = ok(s, r), cols = r.grid[0].length, rows = r.grid.length;
      const cs = Math.min((G.W - 40) / cols, 22), gx = (G.W - cols * cs) / 2, gy = 100; G.g = { gx, gy, cs };
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const yes = r.grid[j][i] === '1'; p.noStroke(); p.fill(yes ? C.coral : RK.al(p, C.line, 120)); p.circle(gx + (i + 0.5) * cs, gy + (j + 0.5) * cs, cs * 0.55); }
      p.noFill(); p.stroke(good ? C.ok : C.brand); p.strokeWeight(2.5); p.rect(gx + s.x * cs, gy + s.y * cs, r.w * cs, r.h * cs, 5);
      const v = pct(r, s.x, s.y);
      TK.label(p, C, `muestra: ${v} % sí`, G.W / 2, gy + rows * cs + 18, good ? C.ok : C.brand, 12, G.W - 30);
      RK.strip(p, C, G.fb, `$\\text{muestra}\\ ${v}\\%\\ \\text{frente a pueblo}\\ ${tot(r)}\\%$`, { kicker: good ? 'esta muestra se parece al pueblo' : 'esta muestra no se parece al pueblo', col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { const { gx, gy, cs } = G.g, r = G.r; if (x < gx + G.s.x * cs - 10 || x > gx + (G.s.x + r.w) * cs + 10 || y < gy + G.s.y * cs - 10 || y > gy + (G.s.y + r.h) * cs + 10) return false; G.grab = { dx: x - (gx + G.s.x * cs), dy: y - (gy + G.s.y * cs) }; return true; },
    drag(G, x, y) {
      if (!G.grab) return false;
      const { gx, gy, cs } = G.g, r = G.r, nx = Math.max(0, Math.min(r.grid[0].length - r.w, Math.round((x - G.grab.dx - gx) / cs))), ny = Math.max(0, Math.min(r.grid.length - r.h, Math.round((y - G.grab.dy - gy) / cs)));
      if (nx !== G.s.x || ny !== G.s.y) { G.s.x = nx; G.s.y = ny; G.touch(); }
      return true;
    },
    release(G) { G.grab = null; },
    demo: G => { const { gx, gy, cs } = G.g || { gx: 20, gy: 100, cs: 20 }, r = G.r; const c = { x: gx + (G.s.x + r.w / 2) * cs, y: gy + (G.s.y + r.h / 2) * cs }; return { from: c, to: { x: c.x + 3 * cs, y: c.y + cs }, text: 'Arrastra el marco', ty: gy + r.grid.length * cs + 40 }; },
    peek: G => ({ g: G.g }),
  });
  return Object.assign(game, { answer: r => best(r) });
})();
