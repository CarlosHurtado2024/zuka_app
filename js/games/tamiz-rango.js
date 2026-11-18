// El tamiz (Álgebra 0, alg-0a; spec 2026-11-18-algebra-revision): de la comprensión a la extensión, con palabras. Una
// tira ordenada (los días de la semana, los meses, las letras) y dos corchetes que se arrastran por los huecos: lo que
// queda adentro se enciende y abajo se escribe el conjunto por extensión con su cardinal. Hay que dejar adentro justo lo
// que cumple la regla («desde», «hasta», «después de», «antes de»). Si los corchetes se juntan no queda nada: el vacío.
// Esta unidad aún no usa números ni desigualdades (spec 2026-11-11-conjuntos-desde-cero).
// params = { rounds: [{ text, name, labels: [..], lo, hi }] }   (cumplen labels[lo..hi]; lo > hi = vacío)
// state = { rounds: [{ L, R }] }   (corchetes en medios: quedan adentro las posiciones k con L < k < R)
GAMES['tamiz-rango'] = (() => {
  const inside = s => { const o = []; for (let k = Math.ceil(s.L); k < s.R; k++) if (k > s.L) o.push(k); return o; };
  const want = r => { const o = []; for (let k = r.lo; k <= r.hi; k++) o.push(k); return o; };
  const answer = r => ({ L: r.lo - 0.5, R: Math.max(r.lo, r.hi + 1) - 0.5 });
  const tset = (r, ks) => (ks.length ? `\\{${ks.map(k => `\\text{${r.labels[k]}}`).join(', ')}\\}` : '\\varnothing');
  const last = r => r.labels.length - 1;
  const game = roundsGame({
    aspect: 1.1,
    init: r => ({ L: -0.5, R: last(r) + 0.5 }),
    ok: (s, r) => inside(s).join() === want(r).join(),
    solution: r => `${r.name} = ${want(r).length ? `{${want(r).map(k => r.labels[k]).join(', ')}}` : '∅'}`,
    prompt: r => `${r.name}: ${r.text}`,
    foot: () => 'Arrastra los corchetes por los huecos de la tira',
    layout(G) { game.layoutFor(G); },
    enter(G) { G.grab = null; game.layoutFor(G); },
    draw(G) {
      game.layoutFor(G);
      const { p, C, r } = G, ok = game.isOk(G), s = G.locked && !ok ? answer(r) : G.s, inn = inside(s), A = SK.sets(C)[0];
      const X = v => G.x0 + (v + 0.5) * G.u;
      // La banda del conjunto, entre los dos corchetes.
      p.noStroke(); p.fill(SK.al(p, A.line, 40)); p.rect(X(s.L), G.y - 26, X(s.R) - X(s.L), 52, 8);
      r.labels.forEach((lab, k) => {
        const on = inn.includes(k), w = Math.min(44, G.u - 4);
        SK.chip(p, C, { x: X(k) - w / 2, y: G.y - 15, w, h: 30 }, lab, { state: on ? (G.locked ? 'ok' : 'on') : 'idle', size: 12, r: 8 });
      });
      // Los corchetes con su manija.
      [['L', '['], ['R', ']']].forEach(([key, ch]) => {
        const x = X(s[key]), c = G.grab === key ? C.brand : A.line;
        p.stroke(c); p.strokeWeight(3); p.noFill();
        const d = key === 'L' ? 7 : -7; p.line(x + d, G.y - 34, x, G.y - 34); p.line(x, G.y - 34, x, G.y + 34); p.line(x, G.y + 34, x + d, G.y + 34);
        p.stroke(c); p.fill(C.card); p.circle(x, G.y + 52, 22); p.noStroke(); p.fill(c); p.textAlign(p.CENTER, p.CENTER); p.textSize(13); p.text(ch, x, G.y + 52);
      });
      SK.formal(p, C, G.fb, `$${r.name} = ${tset(r, inn)}\\qquad n(${r.name}) = ${inn.length}$`, { kicker: 'Por extensión', col: G.locked ? C.ok : A.line, size: 16 });
    },
    press(G, x, y) {
      if (y < G.y - 50 || y > G.y + 70) return false;
      const X = v => G.x0 + (v + 0.5) * G.u, dl = Math.abs(x - X(G.s.L)), dr = Math.abs(x - X(G.s.R));
      G.grab = dl < dr || (dl === dr && x < X(G.s.L)) ? 'L' : 'R'; game.move(G, x); return true;
    },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = null; },
    demo(G) { const X = v => G.x0 + (v + 0.5) * G.u; return { from: { x: X(G.s.L), y: G.y + 52 }, to: { x: X(G.s.L + 2), y: G.y + 52 }, text: 'Arrastra cada corchete', ty: G.y - 62 }; },
    peek: G => ({ y: G.y, u: G.u, x0: G.x0, want: want(G.r) }),
  });
  game.layoutFor = G => { G.u = (G.W - 28) / G.r.labels.length; G.x0 = 14; G.y = G.H * 0.44; G.fb = { x: 12, y: G.H - 92, w: G.W - 24, h: 58 }; };
  game.isOk = G => inside(G.s).join() === want(G.r).join();
  // El dedo lleva el corchete al hueco más cercano; los dos corchetes no se cruzan.
  game.move = (G, x) => {
    const v = Math.max(-0.5, Math.min(last(G.r) + 0.5, Math.round((x - G.x0) / G.u) - 0.5)), s = G.s, nv = G.grab === 'L' ? Math.min(v, s.R) : Math.max(v, s.L);
    if (nv !== s[G.grab] || !G.touched[G.cur]) { s[G.grab] = nv; G.touch(); }
  };
  return Object.assign(game, { inside, want, answer });
})();
