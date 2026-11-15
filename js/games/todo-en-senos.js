// Todo en senos y cosenos (Trigonometría, trig-47b): cada función se escribe como fracción de senos y cosenos (la arma el
// estudiante: qué va arriba y qué va abajo) y después se cancela lo igual de arriba con lo de abajo. Lo que queda es la
// forma simple. item = { f: ['sec', 'cot', …] }  (un producto; 'ps' = 1 − sen², 'pc' = 1 − cos²)
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
GAMES['todo-en-senos'] = (() => {
  const TOK = { sen: [['s'], []], cos: [['c'], []], tan: [['s'], ['c']], cot: [['c'], ['s']], sec: [[], ['c']], csc: [[], ['s']], ps: [['c', 'c'], []], pc: [['s', 's'], []] };
  const NAME = { ps: '(1 - \\operatorname{sen}^2 x)', pc: '(1 - \\cos^2 x)' }, tname = f => NAME[f] || `${TK.FN[f]} x`, plain = f => f === 'sen' || f === 'cos';
  // Opciones para armar la fracción de una ficha y la clave de cada lista de factores.
  const UP = ['1', 's', 'c', 'ss', 'cc'], DN = ['1', 's', 'c'], key = l => l.join('') || '1';
  const OPT = { 1: '1', s: '\\operatorname{sen} x', c: '\\cos x', ss: '\\operatorname{sen}^2 x', cc: '\\cos^2 x' };
  const chips = it => it.f.flatMap((f, t) => [...TOK[f][0].map(k => ({ k, up: true, tok: t })), ...TOK[f][1].map(k => ({ k, up: false, tok: t }))]).map((c, id) => ({ ...c, id }));
  const alive = (it, s) => chips(it).filter(c => !s.dead.includes(c.id));
  const count = (list, k, up) => list.filter(c => c.k === k && c.up === up).length;
  const pow = (n, e) => (e === 1 ? `${n} x` : `${n}^${e} x`);
  function result(list) {
    const e = [count(list, 's', true) - count(list, 's', false), count(list, 'c', true) - count(list, 'c', false)];
    const one = { '1,-1': '\\tan x', '-1,1': '\\cot x', '0,-1': '\\sec x', '-1,0': '\\csc x', '0,0': '1' }[e.join()];
    if (one) return one;
    const part = sg => [e[0] * sg > 0 ? pow('\\operatorname{sen}', Math.abs(e[0])) : '', e[1] * sg > 0 ? pow('\\cos', Math.abs(e[1])) : ''].filter(Boolean).join('\\,');
    return part(-1) ? `\\tfrac{${part(1) || 1}}{${part(-1)}}` : part(1);
  }
  const done = (it, s) => { const l = alive(it, s); return ['s', 'c'].every(k => !(count(l, k, true) && count(l, k, false))); };
  const fair = (it, s) => { const d = chips(it).filter(c => s.dead.includes(c.id)); return ['s', 'c'].every(k => count(d, k, true) === count(d, k, false)); };
  function pairs(it, s) {
    const l = alive(it, s), out = [];
    for (const k of ['s', 'c']) { const u = l.filter(c => c.k === k && c.up), d = l.filter(c => c.k === k && !c.up); for (let i = 0; i < Math.min(u.length, d.length); i++) out.push([u[i], d[i]]); }
    return out;
  }
  return questGame({
    aspect: 1.5,
    init: it => ({ open: it.f.map(plain), dead: [], sel: null, cur: null, up: null, dn: null }),
    ok: (s, it) => s.open.every(Boolean) && fair(it, s) && done(it, s),
    answer: it => { const s = { open: it.f.map(() => true), dead: [], sel: null, cur: null, up: null, dn: null }; s.dead = pairs(it, s).flat().map(c => c.id); return s; },
    solution: it => `$${it.f.map(tname).join(' \\cdot ')} = ${result(chips(it))}$`,
    prompt: it => `Simplifica $${it.f.map(tname).join(' \\cdot ')}$ con senos y cosenos`,
    foot: (it, s) => (s.cur != null ? 'Elige qué va arriba y qué va abajo de esa ficha' : s.open.every(Boolean) ? 'Toca una ficha de arriba y una igual de abajo; al terminar, «Listo»' : 'Toca una ficha amarilla para escribirla con senos y cosenos'),
    layout(G) {
      const it = G.item, n = it.f.length, tw = Math.min(112, (G.W - 24 - (n - 1) * 8) / n), x0 = (G.W - n * tw - (n - 1) * 8) / 2;
      G.tok = it.f.map((f, i) => ({ x: x0 + i * (tw + 8), y: G.top + 4, w: tw, h: 38 }));
      G.go = { x: G.W / 2 - 70, y: G.bottom - 46, w: 140, h: 38 };
      const cs = chips(it), mid = G.top + 112;
      G.bar = mid; G.chip = {};
      for (const up of [true, false]) { const r = cs.filter(c => c.up === up), w = Math.min(58, (G.W - 30) / Math.max(1, r.length) - 6), a = (G.W - r.length * (w + 6) + 6) / 2; r.forEach((c, i) => { G.chip[c.id] = { x: a + i * (w + 6), y: up ? mid - 44 : mid + 10, w, h: 34 }; }); }
      const rowOf = (list, y) => { const w = (G.W - 78 - (list.length - 1) * 5) / list.length; return list.map((k, i) => ({ k, x: 66 + i * (w + 5), y, w, h: 34 })); };
      G.upT = rowOf(UP, G.go.y - 96); G.dnT = rowOf(DN, G.go.y - 52);
    },
    draw(G) {
      const { p, C, s, item: it } = G, cs = chips(it), l = alive(it, s);
      it.f.forEach((f, i) => drawTile(p, C, G.tok[i], `$${tname(f)}$`, s.open[i] ? { fill: C.card, ink: C.mute, size: 14, lift: 0 } : { fill: C.sun, size: 15, ring: s.cur === i ? C.N : null }));
      p.stroke(C.ink); p.strokeWeight(3); p.line(30, G.bar, G.W - 30, G.bar);
      for (const c of cs) {
        if (!s.open[c.tok]) continue;
        const b = G.chip[c.id], gone = s.dead.includes(c.id);
        drawTile(p, C, b, c.k === 's' ? '$\\operatorname{sen} x$' : '$\\cos x$', gone ? { fill: C.card, ink: C.mute, size: 13, lift: 0 } : { fill: c.k === 's' ? C.sky : C.mint, size: 13, ring: s.sel === c.id ? C.N : null });
        if (gone) { p.stroke(C.bad); p.strokeWeight(2.5); p.line(b.x + 4, b.y + b.h - 4, b.x + b.w - 4, b.y + 4); }
      }
      if (s.open.every(Boolean) && !l.some(c => c.up)) TK.label(p, C, '1', G.W / 2, G.bar - 26, C.ink, 20, 40);
      if (G.solved) TK.label(p, C, `$= ${result(l)}$`, G.W / 2, G.bar + 70, C.ok, 22, G.W - 40);
      // Para abrir una ficha: se arma su fracción.
      if (s.cur != null) {
        TK.label(p, C, `$${tname(it.f[s.cur])} = \\tfrac{?}{?}$`, G.W / 2, G.upT[0].y - 26, C.ink, 17, G.W - 40);
        TK.label(p, C, 'arriba', 36, G.upT[0].y + 17, C.mute, 11, 50); TK.label(p, C, 'abajo', 36, G.dnT[0].y + 17, C.mute, 11, 50);
        G.upT.forEach(b => drawTile(p, C, b, `$${OPT[b.k]}$`, { fill: s.up === b.k ? C.coral : C.cream, size: 12, r: 8, lift: 2 }));
        G.dnT.forEach(b => drawTile(p, C, b, `$${OPT[b.k]}$`, { fill: s.dn === b.k ? C.coral : C.cream, size: 12, r: 8, lift: 2 }));
      }
      drawBtn(p, C, G.go, 'Listo', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, it = G.item, t = G.tok.findIndex(b => hitBox(b, x, y));
      if (t >= 0) { if (!s.open[t]) { s.cur = t; s.up = s.dn = null; G.api.sfx?.tap?.(); } return true; }
      if (s.cur != null) {
        const u = G.upT.find(b => hitBox(b, x, y)), d = G.dnT.find(b => hitBox(b, x, y));
        if (u || d) {
          if (u) s.up = u.k; else s.dn = d.k;
          if (s.up && s.dn) {
            const f = it.f[s.cur], good = s.up === key(TOK[f][0]) && s.dn === key(TOK[f][1]);
            if (good) { s.open[s.cur] = true; s.cur = null; G.api.sfx?.tap?.(); } else { s.up = s.dn = null; G.bad('Esa fracción no es esa función: repasa su definición'); }
          }
          return true;
        }
      }
      if (hitBox(G.go, x, y)) {
        if (!s.open.every(Boolean)) G.a.say('Abre primero todas las fichas amarillas', G.C.N); else G.submit('Todavía hay algo igual arriba y abajo');
        return true;
      }
      const c = alive(it, s).find(q => s.open[q.tok] && hitBox(G.chip[q.id], x, y));
      if (!c) return false;
      if (s.sel == null || s.sel === c.id) { s.sel = s.sel === c.id ? null : c.id; G.api.sfx?.tap?.(); return true; }
      const o = chips(it)[s.sel]; s.sel = null;
      if (o.k === c.k && o.up !== c.up) { s.dead.push(o.id, c.id); G.api.sfx?.tap?.(); } else G.bad('Solo se cancela lo mismo: uno arriba y otro abajo');
      return true;
    },
    peek: G => {
      const it = G.item, all = { ...G.s, open: G.s.open.map(() => true) };
      const opens = it.f.flatMap((f, i) => (G.s.open[i] ? [] : [G.tok[i], G.upT.find(b => b.k === key(TOK[f][0])), G.dnT.find(b => b.k === key(TOK[f][1]))]));
      return { solve: [...opens, ...pairs(it, all).flat().map(c => G.chip[c.id]), G.go] };
    },
  });
})();
