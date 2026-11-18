// Kit de los acertijos de orden y asignación (Preuniversitario, mundo «Acertijos de orden»; spec
// 2026-11-18-preuda-razonamiento-completo). Va después de kit.js y recta-kit.js.
// Un acomodo es una lista: arr[i] = nombre en la casilla i (o null). Las pistas son objetos:
//   en línea: at {a, i} · notAt {a, i} · before {a, b} (a antes que b) · justBefore {a, b} (a justo antes de b) · adj {a, b} ·
//   notAdj {a, b} · end {a} · notEnd {a} · gap {a, b, k} (b está k casillas después de a)
//   en círculo (circ = true): opp {a, b} · adj / notAdj (dando la vuelta) · right {a, b} (b justo a la derecha de a, horario)
// Cada pista trae su texto (`say`) para mostrarla tal como la diría el enunciado.
const ORD = (() => {
  const pos = (arr, a) => arr.indexOf(a);
  function sat(arr, c, circ) {
    const n = arr.length, A = pos(arr, c.a), B = c.b != null ? pos(arr, c.b) : -1;
    if (A < 0 || (c.b != null && B < 0)) return null;               // aún no se puede juzgar
    const d = circ ? (B - A + n) % n : B - A;
    switch (c.t) {
      case 'at': return A === c.i;
      case 'notAt': return A !== c.i;
      case 'before': return A < B;
      case 'justBefore': return B - A === 1;
      case 'gap': return B - A === c.k;
      case 'adj': return circ ? d === 1 || d === n - 1 : Math.abs(A - B) === 1;
      case 'notAdj': return circ ? !(d === 1 || d === n - 1) : Math.abs(A - B) !== 1;
      case 'end': return A === 0 || A === n - 1;
      case 'notEnd': return A !== 0 && A !== n - 1;
      case 'opp': return d === n / 2;
      case 'right': return d === 1;
      default: return false;
    }
  }
  const perms = list => (list.length <= 1 ? [list] : list.flatMap((x, i) => perms([...list.slice(0, i), ...list.slice(i + 1)]).map(p => [x, ...p])));
  // Soluciones de un acertijo. En círculo, la primera persona queda fija en la casilla 0 (girar no cambia nada).
  function solutions(names, clues, circ, fixFirst = circ) {
    const base = fixFirst ? perms(names.slice(1)).map(p => [names[0], ...p]) : perms(names);
    return base.filter(arr => clues.every(c => sat(arr, c, circ)));
  }
  // Iguales salvo un giro (para la mesa redonda).
  const sameRing = (a, b) => a.length === b.length && a.some((_, k) => a.every((x, i) => x === b[(i + k) % b.length]));
  // Fichas que se arrastran a casillas. G.slots = [{x, y, w, h}], G.tray = [{x, y, w, h}] (una por nombre).
  // Devuelve el índice de casilla bajo (x, y) o -1.
  const slotAt = (G, x, y) => (G.slots || []).findIndex(b => hitBox({ x: b.x - 6, y: b.y - 8, w: b.w + 12, h: b.h + 16 }, x, y));
  // press/drag/release comunes: se arrastra un nombre desde la bandeja o desde una casilla; al soltar en una casilla ocupada,
  // los dos se cambian de lugar; al soltar fuera, vuelve a la bandeja.
  function press(G, x, y) {
    const k = slotAt(G, x, y); if (k >= 0 && G.s.arr[k] != null) { G.drag = { name: G.s.arr[k], from: k, x, y }; return true; }
    const t = (G.trayBoxes || []).find(b => hitBox(b, x, y)); if (t) { G.drag = { name: t.name, from: -1, x, y }; return true; }
    return false;
  }
  function drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; }
  function release(G, x, y) {
    const d = G.drag; G.drag = null; if (!d) return;
    const arr = G.s.arr, k = slotAt(G, x, y);
    if (d.from >= 0) arr[d.from] = null;
    if (k >= 0) { const prev = arr[k]; arr[k] = d.name; if (prev != null && d.from >= 0) arr[d.from] = prev; }
    G.touch();
  }
  // Dibuja la bandeja con los nombres que faltan por ubicar (abajo, sobre la franja) y la ficha que se arrastra.
  function drawTray(G, y, col) {
    const { p, C, r } = G, free = r.names.filter(n => !G.s.arr.includes(n) && G.drag?.name !== n), w = Math.min(64, (G.W - 20) / Math.max(1, r.names.length) - 6);
    G.trayBoxes = free.map((name, i) => ({ name, x: G.W / 2 - (free.length * (w + 6) - 6) / 2 + i * (w + 6), y, w, h: 32 }));
    G.trayBoxes.forEach(b => RK.chip(p, C, b, b.name, { size: 12, col }));
    if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 16, w, h: 32 }, G.drag.name, { on: true, col: C.brand, size: 12 });
  }
  // Lista de pistas con ✓ cuando ya se cumplen (en gris si todavía no se pueden juzgar).
  function drawClues(G, x, y, w, circ) {
    const { p, C, r } = G;
    r.clues.forEach((c, i) => { const v = sat(G.s.arr, c, circ); TK.label(p, C, `${v === true ? '✓' : v === false ? '✗' : '·'} ${c.say}`, x + w / 2, y + i * 15, v === true ? C.ok : v === false ? C.bad : C.mute, 10, w); });
  }
  // Juego de acomodar nombres en casillas con pistas. o = { circ, fixFirst (la primera persona ya está en la casilla 0), aspect, slots(G) → [{x, y, w, h}], label(i, r) → rótulo de la
  // casilla, decor(G) (dibujo de la escena, debajo de las fichas), cluesY(G), prompt(r), foot, color }.
  function slotGame(o) {
    const circ = !!o.circ;
    const ok = (s, r) => s.arr.every(x => x != null) && r.clues.every(c => sat(s.arr, c, circ));
    const sols = r => solutions(r.names, r.clues, circ, !!o.fixFirst);
    // En círculo cualquier giro de la solución también vale: se muestra la que deja a la primera persona en la casilla 0.
    const answer = r => ({ arr: sols(r)[0] });
    const game = roundsGame({
      aspect: o.aspect || 1.3,
      init: r => ({ arr: r.names.map((n, i) => (o.fixFirst && i === 0 ? n : null)) }),
      ok,
      answered: (s, r) => s.arr.some((x, i) => x != null && !(o.fixFirst && i === 0)),
      solution: r => answer(r).arr.map((n, i) => `${o.label(i, r)}: ${n}`).join(', '),
      prompt: o.prompt,
      foot: () => o.foot || 'Arrastra cada nombre a su lugar; suéltalo sobre otro para cambiarlos',
      layout(G) { G.slots = o.slots(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
      enter(G) { G.drag = null; G.slots = o.slots(G); },
      draw(G) {
        const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r);
        o.decor?.({ ...G, s });
        G.slots.forEach((b, i) => {
          TK.label(p, C, o.label(i, r), b.lx ?? b.x + b.w / 2, b.ly ?? b.y - 8, C.mute, 9, 60);
          const v = s.arr[i];
          if (v != null && G.drag?.name !== v) RK.chip(p, C, b, v, { on: true, col: good ? C.ok : o.color?.(C) || C.sky, size: 12 });
          else { p.noFill(); p.stroke(C.line); p.strokeWeight(1.2); p.drawingContext.setLineDash([4, 3]); p.rect(b.x, b.y, b.w, b.h, 8); p.drawingContext.setLineDash([]); }
        });
        const cb = o.clues ? o.clues(G) : { x: 16, y: 200, w: G.W - 32 };
        drawClues({ ...G, s }, cb.x, cb.y, cb.w, circ);
        drawTray(G, G.H - 108, C.mint);
        RK.strip(p, C, G.fb, good ? '$\\text{todas las pistas se cumplen}$' : '$\\text{cumple todas las pistas}$', { col: G.locked || good ? C.ok : C.brand, size: 15 });
      },
      press: (G, x, y) => { if (o.fixFirst && slotAt(G, x, y) === 0) return false; return press(G, x, y); }, drag, release: (G, x, y) => { if (o.fixFirst && slotAt(G, x, y) === 0) { G.drag = null; return; } release(G, x, y); },
      demo(G) { const b = G.trayBoxes?.[0]; if (!b) return null; const sol = answer(G.r).arr, k = G.slots.findIndex((_, i) => sol[i] !== b.name), sl = G.slots[k]; return { from: { x: b.x + b.w / 2, y: b.y + 16 }, to: { x: sl.x + sl.w / 2, y: sl.y + sl.h / 2 }, text: 'Arrastra un nombre', ty: b.y - 14 }; },
      peek: G => ({ slots: G.slots, tray: G.trayBoxes }),
    });
    return Object.assign(game, { answer, solutions: sols });
  }
  return { sat, perms, solutions, sameRing, slotAt, press, drag, release, drawTray, drawClues, slotGame };
})();
