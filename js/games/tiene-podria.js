// Tiene que, podría o no puede (Preuniversitario, pu-or-4; spec 2026-11-18-preuda-razonamiento-completo): con varias
// soluciones posibles, una afirmación es necesaria si pasa en todas, posible si pasa en alguna e imposible si no pasa en
// ninguna. Arriba hay un banco de pruebas: se arrastran personas al comité y se ve si cumple las reglas (así se exploran
// los casos). Abajo, cada afirmación se arrastra a su zona: «tiene que», «podría» o «no puede».
// params = { rounds: [{ names, k, rules, claims: [{ t: 'in' | 'out' | 'both', a, b?, say }] }] }   (reglas como en comite-reglas)
// state = { rounds: [{ in: [nombres], zone: [0 | 1 | 2 | null por afirmación] }] }   (0 tiene que · 1 podría · 2 no puede)
GAMES['tiene-podria'] = (() => {
  const CR = () => GAMES['comite-reglas'];
  const cases = r => CR().combos(r.names, r.k).filter(S => CR().valid(r, S));
  const holds = (c, S) => (c.t === 'in' ? S.includes(c.a) : c.t === 'out' ? !S.includes(c.a) : S.includes(c.a) && S.includes(c.b));
  const kind = (r, c) => { const L = cases(r), n = L.filter(S => holds(c, S)).length; return n === L.length ? 0 : n > 0 ? 1 : 2; };
  const ok = (s, r) => r.claims.every((c, i) => s.zone[i] === kind(r, c));
  const answer = r => ({ in: [], zone: r.claims.map(c => kind(r, c)) });
  const ZN = ['tiene que', 'podría', 'no puede'];
  const lay = G => { const n = G.r.names.length, w = Math.min(50, (G.W - 20) / n - 4); const y0 = 106 + G.r.rules.length * 13; G.home = G.r.names.map((nm, i) => ({ nm, x: G.W / 2 - (n * (w + 4) - 4) / 2 + i * (w + 4), y: y0, w, h: 26 })); G.box = { x: 24, y: y0 + 34, w: G.W - 48, h: 40 }; const zw = (G.W - 32) / 3; G.zones = ZN.map((t, z) => ({ z, x: 16 + z * zw, y: G.H - 190, w: zw - 6, h: 76 })); };
  const game = roundsGame({
    aspect: 1.75,
    init: r => ({ in: [], zone: r.claims.map(() => null) }),
    ok,
    answered: s => s.zone.some(z => z != null),
    solution: r => r.claims.map(c => `${c.say}: ${ZN[kind(r, c)]}`).join('; '),
    prompt: r => `Comités de ${r.k}: ¿tiene que pasar, podría o no puede?`,
    foot: () => 'Prueba casos arriba; arrastra cada afirmación a su zona',
    layout(G) { lay(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, w = G.home[0].w;
      G.home.forEach(b => { if (!s.in.includes(b.nm) && G.drag?.nm !== b.nm) RK.chip(p, C, b, b.nm, { size: 11, col: C.sky }); });
      const v = CR().valid(r, s.in);
      p.stroke(s.in.length === r.k ? (v ? C.ok : C.bad) : C.line); p.strokeWeight(1.4); p.fill(RK.al(p, C.brand, 16)); p.rect(G.box.x, G.box.y, G.box.w, G.box.h, 10);
      G.inBoxes = s.in.map((nm, i) => ({ nm, x: G.box.x + 8 + i * (w + 4), y: G.box.y + 7, w, h: 26 }));
      G.inBoxes.forEach(b => { if (G.drag?.nm !== b.nm) RK.chip(p, C, b, b.nm, { on: true, size: 11, col: C.mint }); });
      TK.label(p, C, s.in.length < r.k ? `prueba un caso (${s.in.length} de ${r.k})` : v ? 'este caso cumple las reglas' : 'este caso no cumple', G.W / 2, G.box.y + G.box.h + 10, s.in.length < r.k ? C.mute : v ? C.ok : C.bad, 10, G.W - 30);
      r.rules.forEach((c, i) => TK.label(p, C, c.say, G.W / 2, 100 + i * 13, C.ink, 10, G.W - 30));
      G.zones.forEach(z => { p.stroke(C.line); p.strokeWeight(1.2); p.fill(RK.al(p, C.card, 170)); p.rect(z.x, z.y, z.w, z.h, 8); TK.label(p, C, ZN[z.z], z.x + z.w / 2, z.y + 10, C.ink, 10, z.w); });
      const cw = G.W - 40, n = r.claims.length;
      G.claimBoxes = r.claims.map((c, i) => { const zi = s.zone[i]; if (zi == null) return { i, x: 20, y: G.box.y + G.box.h + 24 + i * 25, w: cw, h: 22 }; const z = G.zones[zi], k = r.claims.slice(0, i).filter((_, j) => s.zone[j] === zi).length; return { i, x: z.x + 3, y: z.y + 20 + k * 18, w: z.w - 6, h: 16 }; });
      G.claimBoxes.forEach(b => { if (G.drag?.ci !== b.i) RK.chip(p, C, b, r.claims[b.i].say, { on: s.zone[b.i] != null, size: s.zone[b.i] == null ? 10 : 8, col: G.locked ? (s.zone[b.i] === kind(r, r.claims[b.i]) ? C.ok : C.bad) : C.coral }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 70, y: G.drag.y - 11, w: 140, h: 22 }, G.drag.nm ?? r.claims[G.drag.ci].say, { on: true, col: C.brand, size: 10 });
      RK.strip(p, C, G.fb, `$\\text{${s.zone.filter(z => z != null).length} de ${n} afirmaciones ubicadas}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 14 });
    },
    press(G, x, y) {
      const c = (G.claimBoxes || []).find(b => hitBox(b, x, y)); if (c) { G.drag = { ci: c.i, x, y }; return true; }
      const b = [...(G.inBoxes || []), ...G.home.filter(b => !G.s.in.includes(b.nm))].find(b => hitBox(b, x, y)); if (b) { G.drag = { nm: b.nm, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      if (d.ci != null) { const z = G.zones.find(z => hitBox(z, x, y)); G.s.zone[d.ci] = z ? z.z : null; G.touch(); return; }
      const S = G.s.in, inside = hitBox({ x: G.box.x - 6, y: G.box.y - 10, w: G.box.w + 12, h: G.box.h + 20 }, x, y);
      if (inside && !S.includes(d.nm) && S.length < G.r.k) S.push(d.nm); else if (!inside && S.includes(d.nm)) S.splice(S.indexOf(d.nm), 1);
    },
    demo(G) { const c = G.claimBoxes?.find(b => G.s.zone[b.i] == null); if (!c) return null; const z = G.zones[(kind(G.r, G.r.claims[c.i]) + 1) % 3]; return { from: { x: c.x + c.w / 2, y: c.y + 11 }, to: { x: z.x + z.w / 2, y: z.y + 40 }, text: 'Arrastra a una zona', ty: z.y - 10 }; },
    peek: G => ({ zones: G.zones, claims: G.claimBoxes }),
  });
  return Object.assign(game, { answer, kind, cases });
})();
