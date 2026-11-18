// Órbita (Álgebra 0, relaciones entre conjuntos; spec 2026-11-26-conjuntos-lamina): el conjunto A está en el centro
// y seis conjuntos giran quietos a su alrededor. Cada reto pide una relación: subconjunto de A, igual a A, disjunto
// de A o unitario. Se marcan TODOS los que la cumplen y se toca «Listo». Nada se mueve solo ni hay reloj: cada
// conjunto se revisa elemento por elemento.
// params = { rounds: [{ title, items: [{ kind: 'sub' | 'igual' | 'disj' | 'unit', A?, sets: [6 listas] }] }] }
// estado del reto: { pick: [índices marcados] }

GAMES['orbita-conjuntos'] = (() => {
  const uniq = x => [...new Set(x)];
  const REL = {
    sub: (X, A) => X.every(v => A.includes(v)),
    igual: (X, A) => uniq(X).length === uniq(A).length && X.every(v => A.includes(v)),
    disj: (X, A) => !X.some(v => A.includes(v)),
    unit: X => uniq(X).length === 1,
  };
  const MISSION = {
    sub: ['Marca todos los subconjuntos de A', '$X \\subseteq A$'],
    igual: ['Marca todos los conjuntos iguales a A', '$X = A$'],
    disj: ['Marca todos los disjuntos de A', '$X \\cap A = \\varnothing$'],
    unit: ['Marca todos los conjuntos unitarios', '$n(X) = 1$'],
  };
  const goods = it => it.sets.map((X, i) => (REL[it.kind](X, it.A || []) ? i : -1)).filter(i => i >= 0);
  const ok = (s, it) => [...s.pick].sort().join() === goods(it).join();
  const txt = X => (X.length ? `{${X.join(', ')}}` : '∅');

  function layout(G) {
    const W = G.W, fb = { x: 12, y: G.bottom - 56, w: W - 24, h: 54 }, top = 94, cy = (top + fb.y - 8) / 2;
    const rx = W / 2 - 62, ry = Math.min(122, (fb.y - 8 - top) / 2 - 20), cw = Math.min(100, W / 2 - 20);
    G.L = { fb, c: { x: W / 2, y: cy }, rx, ry, btn: { x: fb.x + fb.w - 76, y: fb.y + 10, w: 66, h: 32 },
      cap: i => { const an = -Math.PI / 2 + i * Math.PI / 3; return { x: W / 2 + Math.cos(an) * rx - cw / 2, y: cy + Math.sin(an) * ry - 16, w: cw, h: 32 }; } };
  }

  function draw(G) {
    const { p, C, s, item: it, L } = G, A = SK.sets(C)[0];
    // La órbita y los lazos de los conjuntos marcados hacia A.
    p.noFill(); p.stroke(C.line); p.strokeWeight(1); p.drawingContext.setLineDash([3, 5]); p.ellipse(L.c.x, L.c.y, 2 * L.rx, 2 * L.ry); p.drawingContext.setLineDash([]);
    it.sets.forEach((_, i) => {
      if (!s.pick.includes(i)) return;
      const b = L.cap(i); p.stroke(G.solved ? C.ok : A.line); p.strokeWeight(1.6); p.line(b.x + b.w / 2, b.y + b.h / 2, L.c.x, L.c.y);
    });
    // A en el centro (en «unitario» no hace falta: se muestra lo que se busca).
    p.fill(C.bg); p.noStroke(); p.ellipse(L.c.x, L.c.y, 132, 80); SK.membrane(p, C, L.c.x, L.c.y, 66, 40, A.line);
    if (it.A) { SK.tag(p, C, 'A', L.c.x, L.c.y - 41, A); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, it.A.join(', '), L.c.x, L.c.y + 4, 104, 15); }
    else SK.serif(p, 'n(X) = 1', L.c.x, L.c.y, 17, A.ink);
    it.sets.forEach((X, i) => {
      const b = L.cap(i), on = s.pick.includes(i), bob = reducedMotion() ? 0 : Math.sin(G.t * 1.3 + i * 1.7) * 2;
      SK.chip(p, C, { ...b, y: b.y + bob }, txt(X), { state: !on ? 'idle' : G.solved ? 'ok' : 'on', size: 14, r: 12 });
    });
    SK.formal(p, C, L.fb, MISSION[it.kind][1], { kicker: `Se busca · marcados: ${s.pick.length}`, right: 74, col: G.solved ? C.ok : A.line });
    drawBtn(p, C, L.btn, 'Listo', true);
  }

  function press(G, x, y) {
    const { s, item: it, L } = G;
    if (hitBox(L.btn, x, y)) {
      if (!s.pick.length) { G.a.say('Marca al menos un conjunto', G.C.mute); return true; }
      G.submit(s.pick.some(i => !goods(it).includes(i)) ? 'Uno de los marcados no cumple' : 'Falta marcar alguno');
      return true;
    }
    const i = it.sets.findIndex((_, k) => hitBox(L.cap(k), x, y));
    if (i < 0) return false;
    const k = s.pick.indexOf(i); if (k >= 0) s.pick.splice(k, 1); else s.pick.push(i);
    G.api.sfx?.tap?.(); return true;
  }

  return Object.assign(questGame({
    aspect: 1.5,
    init: () => ({ pick: [] }),
    ok,
    answer: it => ({ pick: goods(it) }),
    solution: it => `${MISSION[it.kind][0].replace('Marca todos los ', '')}: ${goods(it).map(i => txt(it.sets[i])).join(', ')}`,
    prompt: it => MISSION[it.kind][0],
    foot: () => 'Toca un conjunto para marcarlo o desmarcarlo',
    idle: 'Sin prisa: revisa elemento por elemento',
    layout, draw, press,
    demo(G) { const b = G.L.cap(0); return { from: { x: b.x + b.w / 2, y: b.y + b.h / 2 } }; },
    peek: G => { const g = goods(G.item); return { solve: [...G.item.sets.map((_, i) => (G.s.pick.includes(i) !== g.includes(i) ? G.L.cap(i) : null)).filter(Boolean), G.L.btn] }; },
  }), { REL, goods });
})();
