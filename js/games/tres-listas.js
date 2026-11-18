// Tres listas que se cruzan (Preuniversitario, pu-or-3; spec 2026-11-18-preuda-razonamiento-completo): cada persona tiene un
// color y una mascota distintos. Las pistas mezclan las tres listas: «el del perro viste de rojo», «Ana no tiene gato», «la
// persona de azul no es Beto». Cada persona tiene dos casillas (color y mascota); se arrastran las fichas hasta cumplir todo.
// params = { rounds: [{ people, A: [colores], B: [mascotas], clues: [{ t, ... , say }] }] }
//   t: 'isA' {p, v} · 'notA' {p, v} · 'isB' {p, v} · 'notB' {p, v} · 'link' {a, b} (el del color a tiene la mascota b) · 'unlink' {a, b}
// state = { rounds: [{ a: [color | null por persona], b: [mascota | null por persona] }] }
GAMES['tres-listas'] = (() => {
  const holds = (c, a, b) => { const pa = a.indexOf(c.a), pb = b.indexOf(c.b); switch (c.t) {
    case 'isA': return a[c.p] === c.v; case 'notA': return a[c.p] !== c.v; case 'isB': return b[c.p] === c.v; case 'notB': return b[c.p] !== c.v;
    case 'link': return pa >= 0 && pa === pb; case 'unlink': return pa < 0 || pb < 0 || pa !== pb; default: return false; } };
  const full = (s, r) => s.a.every(x => x != null) && s.b.every(x => x != null);
  const ok = (s, r) => full(s, r) && r.clues.every(c => holds(c, s.a, s.b));
  const solutions = r => { const out = []; for (const a of ORD.perms(r.A)) for (const b of ORD.perms(r.B)) if (r.clues.every(c => holds(c, a, b))) out.push({ a, b }); return out; };
  const answer = r => solutions(r)[0];
  const lay = G => { const n = G.r.people.length, w = Math.min(84, (G.W - 30) / n - 8); G.slotA = G.r.people.map((_, i) => ({ x: G.W / 2 - (n * (w + 8) - 8) / 2 + i * (w + 8), y: 122, w, h: 30 })); G.slotB = G.slotA.map(b => ({ ...b, y: 158 })); };
  const game = roundsGame({
    aspect: 1.4,
    init: r => ({ a: r.people.map(() => null), b: r.people.map(() => null) }),
    ok,
    answered: s => s.a.some(x => x != null) || s.b.some(x => x != null),
    solution: r => { const s = answer(r); return r.people.map((p, i) => `${p}: ${s.a[i]} y ${s.b[i]}`).join('; '); },
    prompt: () => 'Color y mascota de cada persona',
    foot: () => 'Arrastra los colores a la fila de arriba y las mascotas a la de abajo',
    layout(G) { lay(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r);
      r.people.forEach((nm, i) => TK.label(p, C, nm, G.slotA[i].x + G.slotA[i].w / 2, 110, C.ink, 11, G.slotA[i].w));
      [['a', G.slotA, C.coral], ['b', G.slotB, C.mint]].forEach(([k, boxes, col]) => boxes.forEach((b, i) => { const v = s[k][i]; if (v != null && !(G.drag && G.drag.k === k && G.drag.v === v)) RK.chip(p, C, b, v, { on: true, col: good ? C.ok : col, size: 11 }); else { p.noFill(); p.stroke(C.line); p.drawingContext.setLineDash([4, 3]); p.rect(b.x, b.y, b.w, b.h, 8); p.drawingContext.setLineDash([]); } }));
      r.clues.forEach((c, i) => { const v = full(s, r) ? holds(c, s.a, s.b) : null; TK.label(p, C, `${v === true ? '✓' : v === false ? '✗' : '·'} ${c.say}`, G.W / 2, 206 + i * 15, v === true ? C.ok : v === false ? C.bad : C.mute, 10, G.W - 30); });
      const ty = G.H - 110, all = [...r.A.filter(v => !s.a.includes(v)).map(v => ['a', v]), ...r.B.filter(v => !s.b.includes(v)).map(v => ['b', v])].filter(([k, v]) => !(G.drag && G.drag.k === k && G.drag.v === v)), w = Math.min(60, (G.W - 20) / Math.max(1, all.length) - 4);
      G.tray = all.map(([k, v], i) => ({ k, v, x: G.W / 2 - (all.length * (w + 4) - 4) / 2 + i * (w + 4), y: ty, w, h: 28 }));
      G.tray.forEach(b => RK.chip(p, C, b, b.v, { size: 10, col: b.k === 'a' ? C.coral : C.mint }));
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 30, y: G.drag.y - 14, w: 60, h: 28 }, G.drag.v, { on: true, col: C.brand, size: 10 });
      RK.strip(p, C, G.fb, good ? '$\\text{todo encaja}$' : '$\\text{cumple todas las pistas}$', { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) {
      const t = (G.tray || []).find(b => hitBox(b, x, y)); if (t) { G.drag = { k: t.k, v: t.v, from: -1, x, y }; return true; }
      for (const [k, boxes] of [['a', G.slotA], ['b', G.slotB]]) { const i = boxes.findIndex(b => hitBox(b, x, y)); if (i >= 0 && G.s[k][i] != null) { G.drag = { k, v: G.s[k][i], from: i, x, y }; return true; } }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const boxes = d.k === 'a' ? G.slotA : G.slotB, row = G.s[d.k], i = boxes.findIndex(b => hitBox({ x: b.x - 4, y: b.y - 6, w: b.w + 8, h: b.h + 12 }, x, y));
      if (d.from >= 0) row[d.from] = null;
      if (i >= 0) { const prev = row[i]; row[i] = d.v; if (prev != null && d.from >= 0) row[d.from] = prev; }
      G.touch();
    },
    demo(G) { const b = G.tray?.[0]; if (!b) return null; const sol = answer(G.r)[b.k], i = sol.findIndex(v => v !== b.v), t = (b.k === 'a' ? G.slotA : G.slotB)[i]; return { from: { x: b.x + b.w / 2, y: b.y + 14 }, to: { x: t.x + t.w / 2, y: t.y + 15 }, text: 'Arrastra a una casilla', ty: b.y - 12 }; },
    peek: G => ({ slotA: G.slotA, slotB: G.slotB, tray: G.tray }),
  });
  return Object.assign(game, { answer, solutions });
})();
