// Factores opuestos (Álgebra, alg-25a; spec 2026-11-18-algebra-revision): 2 − x y x − 2 no son iguales sino opuestos:
// 2 − x = −(x − 2). Para cancelarlos hay que sacar el signo menos de uno de los dos; queda un −1. Se arrastra la ficha
// «−1» sobre un factor para escribirlo al revés; cuando arriba y abajo hay dos factores iguales, se cancelan solos.
// params = { rounds: [{ top: [..], bottom: [..], pairs: [[t, b]], res }] }   (factores 'a-b')   state = { rounds: [{ flip: ['t0', 'b1', …] }] }
GAMES['signo-afuera'] = (() => {
  const rev = f => { const [a, b] = f.split('-'); return `${b}-${a}`; };
  const ok = (s, r) => s.flip.length === r.pairs.length && r.pairs.every(([t, b]) => s.flip.includes(`t${t}`) !== s.flip.includes(`b${b}`));
  const answer = r => ({ flip: r.pairs.map(([t]) => `t${t}`) });
  const shown = (r, s, side, i) => { const f = r[side === 't' ? 'top' : 'bottom'][i]; return s.flip.includes(`${side}${i}`) ? rev(f) : f; };
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ flip: [] }),
    ok,
    answered: s => s.flip.length > 0,
    solution: r => r.res.replace(/\\[a-z]+|[{}]/g, ''),
    prompt: () => 'Simplifica: saca el signo de un factor opuesto',
    foot: () => 'Arrastra el −1 sobre un factor para escribirlo al revés',
    layout(G) { G.yt = 130; G.yb = 200; G.src = { x: 20, y: G.H * 0.62, w: 54, h: 36 }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s;
      const T = r.top.map((_, i) => shown(r, s, 't', i)), B = r.bottom.map((_, i) => shown(r, s, 'b', i)), gone = new Set();
      T.forEach((f, i) => { const j = B.findIndex((g, k) => g === f && !gone.has(`b${k}`)); if (j >= 0) { gone.add(`t${i}`); gone.add(`b${j}`); } });
      p.stroke(C.ink); p.strokeWeight(2.4); p.line(30, (G.yt + G.yb) / 2 + 8, G.W - 30, (G.yt + G.yb) / 2 + 8);
      G.boxes = [];
      [['t', T, G.yt - 18], ['b', B, G.yb - 6]].forEach(([side, L, y]) => { const w = Math.min(80, (G.W - 40) / L.length - 8); L.forEach((f, i) => { const id = `${side}${i}`, b = { id, x: G.W / 2 - (L.length * (w + 8) - 8) / 2 + i * (w + 8), y, w, h: 36 }; G.boxes.push(b); const fl = s.flip.includes(id), tex = fl ? `-(${f.replace('-', ' - ')})` : `(${f.replace('-', ' - ')})`; if (gone.has(id)) { p.noFill(); p.stroke(C.ok); p.strokeWeight(1.4); p.rect(b.x, b.y, w, 36, 8); TK.label(p, C, `$${tex}$`, b.x + w / 2, y + 18, RK.al(p, C.mute, 140), 12, w - 4); p.stroke(C.ok); p.line(b.x + 6, y + 30, b.x + w - 6, y + 6); } else RK.chip(p, C, b, `$${tex}$`, { on: true, col: fl ? C.mint : side === 't' ? C.sky : C.coral, size: 12 }); }); });
      RK.chip(p, C, G.src, '$-1$', { on: true, col: C.brand, size: 15 });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 27, y: G.drag.y - 18, w: 54, h: 36 }, '$-1$', { on: true, col: C.brand, size: 15 });
      RK.strip(p, C, G.fb, ok(s, r) ? `$= ${r.res}$` : '$\\text{busca factores opuestos}$', { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (hitBox(G.src, x, y)) { G.drag = { x, y }; return true; } return false; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; const b = (G.boxes || []).find(b => hitBox({ x: b.x - 4, y: b.y - 8, w: b.w + 8, h: b.h + 16 }, x, y)); const fac = b && G.r[b.id[0] === 't' ? 'top' : 'bottom'][+b.id.slice(1)]; if (b && fac.includes('-')) { const f = G.s.flip, k = f.indexOf(b.id); if (k >= 0) f.splice(k, 1); else f.push(b.id); G.touch(); } },
    demo: G => ({ from: { x: G.src.x + 27, y: G.src.y + 18 }, to: { x: G.W - 50, y: (G.yt + G.yb) / 2 + 8 }, text: 'Arrastra el −1 a un factor', ty: G.src.y + 54 }),
    peek: G => ({ boxes: G.boxes, src: G.src }),
  });
  return Object.assign(game, { answer });
})();
