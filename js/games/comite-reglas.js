// El comité con reglas (Preuniversitario, pu-or-4; spec 2026-11-18-preuda-razonamiento-completo): se elige un grupo de k
// personas con condiciones como «si F está, G no», «H va solo si J va», «L tiene que ir». Se arrastran personas al comité
// (y de vuelta) y cada regla se marca ✓ o ✗ en vivo. Hay que armar un comité válido que cumpla lo que pide la ronda.
// params = { rounds: [{ names, k, rules: [{ t, a, b?, say }], need?: [nombres] }] }
//   t: 'ifNot' (si a, no b) · 'onlyIf' (a solo si b) · 'must' (a va) · 'out' (a no va) · 'either' (va a o va b)
// state = { rounds: [{ in: [nombres] }] }
GAMES['comite-reglas'] = (() => {
  const rule = (c, S) => { const A = S.includes(c.a), B = S.includes(c.b); switch (c.t) {
    case 'ifNot': return !(A && B); case 'onlyIf': return !A || B; case 'must': return A; case 'out': return !A; case 'either': return A || B; default: return false; } };
  const valid = (r, S) => S.length === r.k && r.rules.every(c => rule(c, S));
  const ok = (s, r) => valid(r, s.in) && (r.need || []).every(n => s.in.includes(n));
  const combos = (list, k) => (k === 0 ? [[]] : list.flatMap((x, i) => combos(list.slice(i + 1), k - 1).map(c => [x, ...c])));
  const answer = r => ({ in: combos(r.names, r.k).find(S => ok({ in: S }, r)) });
  const lay = G => { const n = G.r.names.length, w = Math.min(54, (G.W - 20) / n - 4); G.home = G.r.names.map((nm, i) => ({ nm, x: G.W / 2 - (n * (w + 4) - 4) / 2 + i * (w + 4), y: 108, w, h: 30 })); G.box = { x: 24, y: 152, w: G.W - 48, h: 54 }; };
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ in: [] }),
    ok,
    answered: s => s.in.length > 0,
    solution: r => answer(r).in.join(', '),
    prompt: r => `Arma un comité de ${r.k}${r.need ? ` con ${r.need.join(' y ')}` : ''} que cumpla las reglas`,
    foot: () => 'Arrastra personas al comité y de vuelta',
    layout(G) { lay(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r);
      G.home.forEach(b => { if (!s.in.includes(b.nm) && G.drag?.nm !== b.nm) RK.chip(p, C, b, b.nm, { size: 12, col: C.sky }); });
      p.stroke(good ? C.ok : C.brand); p.strokeWeight(1.4); p.fill(RK.al(p, C.brand, 20)); p.rect(G.box.x, G.box.y, G.box.w, G.box.h, 12);
      TK.label(p, C, `comité (${s.in.length} de ${r.k})`, G.box.x + 60, G.box.y - 8, C.mute, 10, 120);
      const w = G.home[0].w; G.inBoxes = s.in.map((nm, i) => ({ nm, x: G.box.x + 10 + i * (w + 6), y: G.box.y + 12, w, h: 30 }));
      G.inBoxes.forEach(b => { if (G.drag?.nm !== b.nm) RK.chip(p, C, b, b.nm, { on: true, size: 12, col: good ? C.ok : C.mint }); });
      r.rules.forEach((c, i) => { const v = rule(c, s.in); TK.label(p, C, `${v ? '✓' : '✗'} ${c.say}`, G.W / 2, 226 + i * 15, v ? C.ok : C.bad, 10, G.W - 30); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 15, w, h: 30 }, G.drag.nm, { on: true, col: C.brand, size: 12 });
      RK.strip(p, C, G.fb, good ? `$\\text{${s.in.join(', ')}}$` : `$\\text{faltan ${Math.max(0, r.k - s.in.length)}}$`, { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) {
      const b = [...(G.inBoxes || []), ...G.home.filter(b => !G.s.in.includes(b.nm))].find(b => hitBox(b, x, y)); if (!b) return false;
      G.drag = { nm: b.nm, x, y }; return true;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return; const S = G.s.in, inside = hitBox({ x: G.box.x - 6, y: G.box.y - 10, w: G.box.w + 12, h: G.box.h + 20 }, x, y);
      if (inside && !S.includes(d.nm) && S.length < G.r.k) S.push(d.nm); else if (!inside && S.includes(d.nm)) S.splice(S.indexOf(d.nm), 1);
      G.touch();
    },
    demo(G) { const b = G.home[G.home.length - 1]; return { from: { x: b.x + b.w / 2, y: b.y + 15 }, to: { x: G.box.x + 40, y: G.box.y + 27 }, text: 'Arrastra al comité', ty: G.box.y + G.box.h + 12 }; },
    peek: G => ({ home: G.home, box: G.box }),
  });
  return Object.assign(game, { answer, rule, combos, valid });
})();
