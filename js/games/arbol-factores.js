// El árbol de factores (Preuniversitario, pu-nu-1 y pu-nu-2; spec 2026-11-18-preuda-razonamiento-completo): un número arriba.
// Se arrastra un primo de la bandeja sobre una hoja del árbol: si la divide, la hoja se abre en dos ramas (el primo y lo que
// queda); si no, no pasa nada. Cuando todas las hojas son primos, el juego escribe la descomposición con exponentes.
// params = { rounds: [{ n }] }   state = { rounds: [{ splits: [[índice de hoja, primo]] }] }
GAMES['arbol-factores'] = (() => {
  const PR = [2, 3, 5, 7, 11];
  const isP = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  // El árbol se guarda como lista de nodos { v, kids, depth }; las hojas en orden de izquierda a derecha.
  const build = (r, splits) => {
    const nodes = [{ v: r.n, kids: null, depth: 0 }];
    const leaves = () => { const out = []; const walk = i => { const nd = nodes[i]; if (!nd.kids) out.push(i); else nd.kids.forEach(walk); }; walk(0); return out; };
    splits.forEach(([li, pr]) => { const L = leaves(), i = L[li]; if (i === undefined) return; const nd = nodes[i]; if (nd.v % pr || nd.v === pr) return; nodes.push({ v: pr, kids: null, depth: nd.depth + 1 }, { v: nd.v / pr, kids: null, depth: nd.depth + 1 }); nd.kids = [nodes.length - 2, nodes.length - 1]; });
    return { nodes, leaves: leaves() };
  };
  const ok = (s, r) => build(r, s.splits).leaves.every(i => isP(build(r, s.splits).nodes[i].v));
  const answer = r => { const splits = []; let li = 0, v = r.n; while (!isP(v)) { const pr = PR.find(q => v % q === 0) || v; splits.push([li, pr]); li += 1; v /= pr; } return { splits }; };
  const fact = n => { const f = {}; let v = n; for (let d = 2; v > 1; d++) while (v % d === 0) { f[d] = (f[d] || 0) + 1; v /= d; } return Object.entries(f).map(([b, e]) => (e > 1 ? `${b}^{${e}}` : b)).join(' \\cdot '); };
  const game = roundsGame({
    aspect: 1.35,
    init: () => ({ splits: [] }),
    answered: s => s.splits.length > 0,
    ok,
    solution: r => `$${r.n} = ${fact(r.n)}$`,
    prompt: r => `Descompón ${r.n} en primos`,
    foot: () => 'Arrastra un primo sobre una hoja que divida',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r), T = build(r, s.splits), top = 104, dy = Math.min(42, (G.H - 250) / Math.max(1, ...T.nodes.map(q => q.depth)));
      const pos = {}; let col = 0; const nLeaves = T.leaves.length, cw = (G.W - 40) / Math.max(nLeaves, 1);
      const place = i => { const nd = T.nodes[i]; if (!nd.kids) { pos[i] = { x: 20 + (col + 0.5) * cw, y: top + nd.depth * dy }; col++; } else { nd.kids.forEach(place); pos[i] = { x: (pos[nd.kids[0]].x + pos[nd.kids[1]].x) / 2, y: top + nd.depth * dy }; } };
      place(0);
      T.nodes.forEach((nd, i) => { if (nd.kids) nd.kids.forEach(k => { p.stroke(C.line); p.strokeWeight(1.5); p.line(pos[i].x, pos[i].y, pos[k].x, pos[k].y); }); });
      G.leafBoxes = [];
      T.nodes.forEach((nd, i) => {
        const q = pos[i], leaf = !nd.kids, pr = leaf && isP(nd.v);
        p.stroke(pr ? C.ok : C.line); p.strokeWeight(pr ? 2 : 1); p.fill(leaf ? (pr ? RK.al(p, C.ok, 70) : RK.al(p, C.card, 230)) : RK.al(p, C.line, 60)); p.circle(q.x, q.y, 34);
        TK.label(p, C, String(nd.v), q.x, q.y, C.ink, 12, 32);
        if (leaf) G.leafBoxes.push({ x: q.x, y: q.y, li: T.leaves.indexOf(i), v: nd.v });
      });
      const tw = (G.W - 40) / PR.length; G.tray = PR.map((v, i) => ({ x: 20 + i * tw + 4, y: G.H - 120, w: tw - 8, h: 36, v }));
      G.tray.forEach(b => RK.chip(p, C, b, String(b.v), { on: false, size: 14 }));
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 20, y: G.drag.y - 18, w: 40, h: 36 }, String(G.drag.v), { on: true, col: C.brand, size: 14 });
      const leavesTxt = T.leaves.map(i => T.nodes[i].v).sort((a, b) => a - b).join(' \\cdot ');
      RK.strip(p, C, G.fb, good ? `$${r.n} = ${fact(r.n)}$` : `$${r.n} = ${leavesTxt}$`, { kicker: good ? 'todas las hojas son primos' : '', col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const t = (G.tray || []).find(b => hitBox(b, x, y)); if (!t) return false; G.drag = { v: t.v, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      if (!G.drag) return; const l = (G.leafBoxes || []).find(q => Math.hypot(x - q.x, y - q.y) < 26);
      if (l && l.v % G.drag.v === 0 && l.v !== G.drag.v) { G.s.splits.push([l.li, G.drag.v]); G.touch(); }
      G.drag = null;
    },
    demo: G => { const t = G.tray?.[0], l = G.leafBoxes?.[0]; return t && l ? { from: { x: t.x + t.w / 2, y: t.y + 18 }, to: l, text: 'Arrastra un primo', ty: t.y - 20 } : null; },
    peek: G => ({ tray: G.tray, leaves: G.leafBoxes }),
  });
  return Object.assign(game, { answer });
})();
