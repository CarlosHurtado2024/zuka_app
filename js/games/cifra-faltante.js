// La cifra que falta (Preuniversitario, pu-nu-1; spec 2026-11-18-preuda-razonamiento-completo): a un número le falta una cifra
// y tiene que ser divisible por algo. Se arrastra la rueda de la cifra; el juego aplica el criterio en vivo (la suma de cifras
// para 3 y 9, las dos últimas para 4, la suma alternada para 11) y dice si ya es divisible.
// params = { rounds: [{ tpl: '4_72', by: 3 | 4 | 9 | 11 | 6 }] }   state = { rounds: [{ d }] }   (cualquier cifra que cumpla vale)
GAMES['cifra-faltante'] = (() => {
  const num = (r, d) => +r.tpl.replace('_', d);
  const ok = (s, r) => s.d !== null && num(r, s.d) % r.by === 0;
  const first = r => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find(d => num(r, d) % r.by === 0);
  const test = (r, d) => {
    const ds = String(num(r, d)).split('').map(Number), sum = ds.reduce((a, b) => a + b, 0);
    if (r.by === 3 || r.by === 9) return `suma de cifras: ${ds.join(' + ')} = ${sum}`;
    if (r.by === 4) return `dos últimas cifras: ${ds.slice(-2).join('')}`;
    if (r.by === 11) { const alt = ds.reduce((a, b, i) => a + (i % 2 ? -b : b), 0); return `suma alternada: ${ds.map((b, i) => (i ? (i % 2 ? '− ' : '+ ') : '') + b).join(' ')} = ${alt}`; }
    return `par: ${ds.at(-1) % 2 === 0 ? 'sí' : 'no'} · suma de cifras ${sum}`;
  };
  const game = roundsGame({
    aspect: 1.05,
    init: r => ({ d: num(r, 0) % r.by === 0 ? 1 : 0 }),
    ok,
    solution: r => `con ${first(r)}: ${num(r, first(r))}`,
    prompt: r => `¿Qué cifra va en el hueco de ${r.tpl.replace('_', '□')} para que sea divisible por ${r.by}?`,
    foot: () => 'Arrastra la rueda arriba o abajo',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { d: first(r) } : G.s, good = ok(s, r), chars = [...r.tpl], cw = Math.min(46, (G.W - 40) / chars.length), x0 = (G.W - chars.length * cw) / 2, y = 170;
      chars.forEach((ch, i) => {
        const x = x0 + (i + 0.5) * cw, gap = ch === '_';
        p.stroke(gap ? (good ? C.ok : C.brand) : C.line); p.strokeWeight(gap ? 2 : 1); p.fill(RK.al(p, C.card, 230)); p.rect(x - cw * 0.42, y - 30, cw * 0.84, 60, 8);
        if (gap) { TK.label(p, C, String((s.d + 9) % 10), x, y - 44, C.mute, 10, cw); TK.label(p, C, String((s.d + 1) % 10), x, y + 44, C.mute, 10, cw); G.wheel = { x, y, w: cw }; }
        TK.label(p, C, gap ? String(s.d) : ch, x, y, gap ? C.brand : C.ink, 22, cw * 0.8);
      });
      TK.label(p, C, test(r, s.d), G.W / 2, 246, C.ink, 11, G.W - 24);
      RK.strip(p, C, G.fb, `$${num(r, s.d)} \\div ${r.by} = ${Math.floor(num(r, s.d) / r.by)}\\ \\text{residuo}\\ ${num(r, s.d) % r.by}$`, { kicker: good ? 'divisible' : 'aún no es divisible', col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { const w = G.wheel; if (!w || Math.abs(x - w.x) > w.w / 2 + 6 || Math.abs(y - w.y) > 56) return false; G.grab = true; G.y0 = y; G.d0 = G.s.d; return true; },
    drag(G, x, y) { if (!G.grab) return false; const d = ((G.d0 + Math.round((G.y0 - y) / 20)) % 10 + 10) % 10; if (d !== G.s.d) { G.s.d = d; G.touch(); } return true; },
    release(G, x, y) { if (G.grab && Math.abs(y - G.y0) < 5) { G.s.d = (G.s.d + (y < G.wheel.y ? 9 : 1)) % 10; G.touch(); } G.grab = false; },
    demo: G => (G.wheel ? { from: { x: G.wheel.x, y: G.wheel.y + 20 }, to: { x: G.wheel.x, y: G.wheel.y - 30 }, text: 'Arrastra la rueda', ty: G.wheel.y - 74 } : null),
    peek: G => ({ wheel: G.wheel }),
  });
  return Object.assign(game, { answer: r => ({ d: first(r) }) });
})();
