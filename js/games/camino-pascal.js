// Caminos de Pascal (Álgebra, binomio de Newton; juego dinámico de alg-24c; spec 2026-11-21-dinamicos-mundos-altos):
// cada número del triángulo de Pascal cuenta de cuántas maneras se llega a su casilla bajando desde la punta, un paso
// a la izquierda o a la derecha cada vez (es elegir de cuáles paréntesis sale la b). Se trazan los caminos tocando
// casilla por casilla hasta la casilla de la estrella; el juego los va contando y avisa si uno ya se había contado.
// Cuando están todos, dice el número: ese es el coeficiente. No hay vidas que perder por explorar.
// params = { rounds: [{ title, items: [{ row, k }] }], lives? }   state = { done: [n] }

GAMES['camino-pascal'] = (() => {
  const binom = (n, k) => { let v = 1; for (let i = 0; i < k; i++) v = (v * (n - i)) / (i + 1); return Math.round(v); };
  // Todos los caminos de la punta a la casilla (row, k): la posición en cada fila.
  function paths(row, k) {
    const out = [];
    (function go(path) { const r = path.length - 1, j = path[r]; if (r === row) { if (j === k) out.push(path.join('')); return; } go([...path, j]); go([...path, j + 1]); })([0]);
    return out;
  }
  return questGame({
    aspect: 1.35,
    init: () => ({ path: [0], found: [] }),
    ok: (s, it) => s.found.length === binom(it.row, it.k) && new Set(s.found).size === s.found.length,
    answer: it => ({ path: [0], found: paths(it.row, it.k) }),
    solution: it => `$C(${it.row}, ${it.k}) = ${binom(it.row, it.k)}$ caminos`,
    prompt: it => `Encuentra todos los caminos hasta la estrella`,
    foot: (it, s) => `Llevas ${s.found.length} ${s.found.length === 1 ? 'camino' : 'caminos'} · baja un paso a la izquierda o a la derecha`,
    idle: 'Sin prisa: cuenta con orden',
    layout(G) {
      const rows = G.item.row + 1, dy = Math.min(52, (G.bottom - G.top - 30) / rows), dx = Math.min(56, (G.W - 30) / rows), y0 = G.top + 26;
      G.cell = (r, j) => ({ x: G.W / 2 + (j - r / 2) * dx - 17, y: y0 + r * dy - 17, w: 34, h: 34 });
    },
    draw(G) {
      const { p, C, s, item: it } = G, c = (r, j) => { const b = G.cell(r, j); return [b.x + b.w / 2, b.y + b.h / 2]; };
      // Caminos ya contados (tenues) y el que se está trazando.
      p.noFill(); p.strokeWeight(3);
      for (const key of s.found) { p.stroke(C.line); p.beginShape(); [...key].forEach((j, r) => p.vertex(...c(r, +j))); p.endShape(); }
      p.stroke(C.sky); p.strokeWeight(5); p.beginShape(); s.path.forEach((j, r) => p.vertex(...c(r, j))); p.endShape();
      for (let r = 0; r <= it.row; r++) for (let j = 0; j <= r; j++) {
        const b = G.cell(r, j), on = s.path[r] === j, goal = r === it.row && j === it.k, last = s.path.length - 1, next = r === last + 1 && (j === s.path[last] || j === s.path[last] + 1);
        p.stroke(goal ? C.N : next ? C.sky : C.line); p.strokeWeight(goal || next ? 2.5 : 1.5); p.fill(on ? C.sky : C.card); p.circle(b.x + b.w / 2, b.y + b.h / 2, 30);
        p.noStroke(); p.fill(on ? inkOn(C.sky, C.ink) : goal ? C.N : C.mute); p.textStyle(p.BOLD); p.textSize(goal ? 15 : 12); p.textAlign(p.CENTER, p.CENTER);
        p.text(goal ? (G.solved ? binom(it.row, it.k) : '★') : r === 0 ? '▼' : '', b.x + b.w / 2, b.y + b.h / 2 + 1);
      }
    },
    press(G, x, y) {
      const it = G.item, s = G.s, r = s.path.length, last = s.path[r - 1];
      for (const j of [last, last + 1]) if (r <= it.row && hitBox(G.cell(r, j), x, y)) {
        s.path.push(j); G.api.sfx?.tap?.();
        if (s.path.length === it.row + 1) {
          const key = s.path.join('');
          if (j !== it.k) G.a.say('Ese camino llega a otra casilla', G.C.mute);
          else if (s.found.includes(key)) G.a.say('Ese camino ya lo contaste', G.C.mute);
          else { s.found.push(key); if (s.found.length === binom(it.row, it.k)) G.good(`${s.found.length} caminos: ese es el coeficiente`); else G.a.say(`Van ${s.found.length}`, G.C.Z); }
          s.path = [0];
        }
        return true;
      }
      // Tocar la punta empieza el camino de nuevo.
      if (hitBox(G.cell(0, 0), x, y)) { s.path = [0]; return true; }
      return false;
    },
    peek: G => { const left = paths(G.item.row, G.item.k).filter(k => !G.s.found.includes(k)); return { solve: left.flatMap(key => [G.cell(0, 0), ...[...key].slice(1).map((j, i) => G.cell(i + 1, +j))]) }; },
  });
})();
