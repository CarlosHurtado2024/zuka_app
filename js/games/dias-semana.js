// La agenda de la semana (Preuniversitario, pu-or-1 y pu-or-3; spec 2026-11-18-preuda-razonamiento-completo): cada actividad
// va un día distinto de lunes a viernes (o de lunes a sábado), con pistas como «Arte es antes que Cine», «Danza es el
// miércoles», «Economía es al principio o al final». Se arrastran las actividades a los días hasta cumplir todas las pistas.
// params = { rounds: [{ names, clues }] }   state = { rounds: [{ arr }] }   (pistas: orden-kit.js; la casilla 0 es el lunes)
GAMES['dias-semana'] = (() => {
  const DAYS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
  return ORD.slotGame({
    aspect: 1.3,
    prompt: () => '¿Qué día va cada actividad?',
    slots: G => { const n = G.r.names.length, w = Math.min(60, (G.W - 30) / n - 4); return G.r.names.map((_, i) => ({ x: G.W / 2 - (n * (w + 4) - 4) / 2 + i * (w + 4), y: 124, w, h: 54 })); },
    label: i => DAYS[i],
    decor: G => { const { p, C, r } = G, n = r.names.length, w = Math.min(60, (G.W - 30) / n - 4), x0 = G.W / 2 - (n * (w + 4) - 4) / 2; p.noStroke(); p.fill(RK.al(p, C.card, 180)); p.rect(x0 - 6, 100, n * (w + 4) + 8, 86, 8); p.fill(C.coral); p.rect(x0 - 6, 100, n * (w + 4) + 8, 8, 8, 8, 0, 0); },
    clues: G => ({ x: 16, y: 204, w: G.W - 32 }),
    color: C => C.mint,
  });
})();
