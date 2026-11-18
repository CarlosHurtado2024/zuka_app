// El árbol de las partes (Álgebra 0, alg-0b; spec 2026-11-18-algebra-revision): por qué un conjunto de n elementos
// tiene 2ⁿ subconjuntos. Cada elemento que se arrastra al árbol agrega un piso: cada rama se parte en dos, «sin» y «con»
// ese elemento, y las hojas (los subconjuntos) se duplican. Sacar el último elemento quita su piso. Hay que dejar el
// árbol con las hojas que pide la ronda; con ningún elemento queda una sola hoja: el vacío.
// params = { rounds: [{ target, pool: [etiquetas] }] }   state = { rounds: [{ n }] }   (n: elementos en el árbol)
GAMES['arbol-partes'] = (() => {
  const need = r => Math.round(Math.log2(r.target));
  const leaves = (pool, n) => { let L = [[]]; for (let k = 0; k < n; k++) L = L.flatMap(x => [x, [...x, pool[k]]]); return L; };
  const txt = X => (X.length ? `{${X.join(',')}}` : '∅');
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ n: 1 }),
    ok: (s, r) => 2 ** s.n === r.target,
    solution: r => `${need(r)} elemento${need(r) === 1 ? '' : 's'}: 2^${need(r)} = ${r.target} subconjuntos`,
    prompt: r => (r.target === 1 ? 'Haz el árbol de A = ∅: ¿cuántos subconjuntos tiene?' : `Haz crecer el árbol hasta tener ${r.target} subconjuntos`),
    foot: () => 'Arrastra un elemento al árbol para agregar un piso; sácalo para quitarlo',
    layout(G) { const W = G.W, H = G.H; G.top = 104; G.bot = H * 0.56; G.trayY = H - 124; G.fb = { x: 12, y: H - 84, w: W - 24, h: 52 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, good = 2 ** G.s.n === r.target, n = G.locked && !good ? need(r) : G.s.n, A = SK.sets(C)[0];
      const levels = Math.max(n, 1), dy = (G.bot - G.top) / levels, xAt = (lev, k) => 16 + (k + 0.5) * (G.W - 32) / 2 ** lev;
      // Las ramas: a la izquierda «sin», a la derecha «con».
      for (let lev = 0; lev < n; lev++) for (let k = 0; k < 2 ** lev; k++) {
        const x = xAt(lev, k), y = G.top + lev * dy;
        p.strokeWeight(lev < 3 ? 2 : 1.2); p.stroke(C.line); p.line(x, y, xAt(lev + 1, 2 * k), y + dy); p.stroke(A.line); p.line(x, y, xAt(lev + 1, 2 * k + 1), y + dy);
      }
      for (let lev = 0; lev < n; lev++) TK.label(p, C, r.pool[lev], 12, G.top + (lev + 0.5) * dy, A.ink, 12, 20);
      // Las hojas.
      const L = leaves(r.pool, n), y = G.top + n * dy;
      L.forEach((X, k) => {
        const x = xAt(n, k);
        if (n <= 3) SK.chip(p, C, { x: x - 18 * (n > 2 ? 0.9 : 1.3), y: y + 4, w: 36 * (n > 2 ? 0.9 : 1.3), h: 22 }, txt(X), { state: G.locked ? 'ok' : 'on', size: 10, r: 7 });
        else { p.noStroke(); p.fill(G.locked ? C.ok : A.line); p.circle(x, y + 8, n > 4 ? 6 : 9); }
      });
      if (!n) SK.chip(p, C, { x: G.W / 2 - 22, y: G.top - 4, w: 44, h: 26 }, '∅', { state: 'on', size: 13 });
      else { p.noStroke(); p.fill(C.ink); p.circle(xAt(0, 0), G.top, 8); }
      // La bandeja de elementos que aún no están en el árbol.
      G.tok = {};
      r.pool.forEach((v, k) => { if (k < n) return; const x = G.W / 2 - (r.pool.length - n - 1) * 22 + (k - n) * 44; G.tok[k] = { x, y: G.trayY }; if (G.drag?.k !== k) SK.chip(p, C, { x: x - 18, y: G.trayY - 14, w: 36, h: 28 }, v, { state: 'idle', size: 14 }); });
      if (G.drag) SK.chip(p, C, { x: G.drag.x - 18, y: G.drag.y - 14, w: 36, h: 28 }, r.pool[G.drag.k], { state: 'on', col: C.brand, size: 14 });
      SK.formal(p, C, G.fb, `$n(A) = ${n}\\qquad n(P(A)) = 2^{${n}} = ${2 ** n}$`, { kicker: 'Subconjuntos de A', col: G.locked ? C.ok : A.line, size: 17 });
    },
    press(G, x, y) {
      const hit = Object.entries(G.tok || {}).find(([, q]) => Math.abs(x - q.x) < 22 && Math.abs(y - q.y) < 18);
      if (hit && +hit[0] === G.s.n) { G.drag = { k: +hit[0], x, y, from: 'tray' }; return true; }
      if (hit) { G.drag = { k: G.s.n, x, y, from: 'tray' }; return true; }
      if (G.s.n > 0 && y > G.top - 20 && y < G.bot + 30) { G.drag = { k: G.s.n - 1, x, y, from: 'tree' }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; if (!d) return; G.drag = null;
      const onTree = y < G.bot + 30 && y > G.top - 30;
      if (d.from === 'tray' && onTree && G.s.n < G.r.pool.length) { G.s.n++; G.touch(); }
      else if (d.from === 'tree' && !onTree) { G.s.n--; G.touch(); }
    },
    demo(G) { const q = G.tok?.[G.s.n]; return q ? { from: q, to: { x: G.W / 2, y: (G.top + G.bot) / 2 }, text: 'Arrastra un elemento al árbol', ty: G.bot + 12 } : null; },
    peek: G => ({ tok: G.tok, top: G.top, bot: G.bot, need: need(G.r) }),
  });
  return Object.assign(game, { need, leaves });
})();
