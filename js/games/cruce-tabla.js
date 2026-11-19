// El cruce de la tabla (Preuniversitario, pu-op-1 y pu-op-2; spec 2026-11-18-preuda-razonamiento-completo): una operación dada
// por tabla. El resultado de x ∘ y está en el cruce de la FILA de x con la COLUMNA de y. Se toca la casilla; con una cadena
// (x ∘ y) ∘ z, lo que salió primero pasa a ser la fila del segundo paso.
// params = { rounds: [{ set: [elementos], tab: [[resultado]], chain: [x, y, z?] }] }   state = { rounds: [{ picks: [[fila, col]] }] }
GAMES['cruce-tabla'] = (() => {
  const idx = (r, v) => r.set.indexOf(v);
  const steps = r => { const out = []; let cur = r.chain[0]; for (let k = 1; k < r.chain.length; k++) { const i = idx(r, cur), j = idx(r, r.chain[k]); out.push([i, j]); cur = r.tab[i][j]; } return out; };
  const ok = (s, r) => { const st = steps(r); return s.picks.length === st.length && st.every(([i, j], k) => s.picks[k][0] === i && s.picks[k][1] === j); };
  const expr = r => r.chain.length === 2 ? `${r.chain[0]} \\circ ${r.chain[1]}` : `(${r.chain[0]} \\circ ${r.chain[1]}) \\circ ${r.chain[2]}`;
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ picks: [] }),
    answered: s => s.picks.length > 0,
    ok,
    solution: r => { let cur = r.chain[0]; const parts = []; for (let k = 1; k < r.chain.length; k++) { const v = r.tab[idx(r, cur)][idx(r, r.chain[k])]; parts.push(`${cur} ∘ ${r.chain[k]} = ${v}`); cur = v; } return parts.join('; '); },
    prompt: r => `Usa la tabla: ¿cuánto es $${expr(r)}$?`,
    foot: () => 'Toca el cruce: fila del primero, columna del segundo',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { picks: steps(r) } : G.s, good = ok(s, r), n = r.set.length, cs = Math.min(46, (G.W - 60) / (n + 1)), x0 = (G.W - (n + 1) * cs) / 2, y0 = 100;
      p.noStroke(); p.fill(RK.al(p, C.brand, 70)); p.rect(x0, y0, cs, cs, 6); TK.label(p, C, '$\\circ$', x0 + cs / 2, y0 + cs / 2, C.ink, 14, cs);
      r.set.forEach((v, k) => { TK.label(p, C, String(v), x0 + (k + 1.5) * cs, y0 + cs / 2, C.coral, 13, cs); TK.label(p, C, String(v), x0 + cs / 2, y0 + (k + 1.5) * cs, C.sky, 13, cs); });
      const last = s.picks.at(-1), cols = [C.brand, C.mint];
      G.cells = [];
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const x = x0 + (j + 1) * cs, y = y0 + (i + 1) * cs, k = s.picks.findIndex(q => q[0] === i && q[1] === j);
        p.stroke(C.line); p.strokeWeight(1); p.fill(k >= 0 ? RK.al(p, good ? C.ok : cols[k % 2], 120) : RK.al(p, C.card, 200)); p.rect(x + 1, y + 1, cs - 2, cs - 2, 5);
        TK.label(p, C, String(r.tab[i][j]), x + cs / 2, y + cs / 2, C.ink, 13, cs);
        G.cells.push({ x, y, w: cs, h: cs, i, j });
      }
      if (last) { const [i, j] = last; p.noStroke(); p.fill(RK.al(p, C.sky, 40)); p.rect(x0, y0 + (i + 1) * cs, cs, cs); p.fill(RK.al(p, C.coral, 40)); p.rect(x0 + (j + 1) * cs, y0, cs, cs); }
      const txt = s.picks.map(([i, j]) => `${r.set[i]} \\circ ${r.set[j]} = ${r.tab[i][j]}`).join(';\\ ');
      RK.strip(p, C, G.fb, txt ? `$${txt}$` : '$\\text{toca un cruce}$', { kicker: `paso ${Math.min(s.picks.length + 1, r.chain.length - 1)} de ${r.chain.length - 1}`, col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) {
      const c = (G.cells || []).find(b => hitBox(b, x, y)); if (!c) return false;
      const need = G.r.chain.length - 1, P = G.s.picks;
      const k = P.findIndex(q => q[0] === c.i && q[1] === c.j);
      if (k >= 0) P.splice(k); else if (P.length < need) P.push([c.i, c.j]); else P[need - 1] = [c.i, c.j];
      G.touch(); return true;
    },
    demo: G => { const c = G.cells?.[0]; return c ? { from: { x: c.x + c.w / 2, y: c.y + c.h / 2 }, to: { x: c.x + c.w / 2, y: c.y + c.h / 2 }, text: 'Toca el cruce', ty: G.cells.at(-1).y + G.cells.at(-1).h + 22 } : null; },
    peek: G => ({ cells: G.cells }),
  });
  return Object.assign(game, { answer: r => ({ picks: steps(r) }) });
})();
