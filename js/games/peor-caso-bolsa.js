// El peor caso (Preuniversitario, pu-ar-4; spec 2026-11-18-preuda-razonamiento-completo): en una bolsa hay bolas de colores y se
// sacan sin mirar. ¿Cuántas hay que sacar para estar SEGUROS de algo? Se desliza cuántas sacar y el juego las saca con la peor
// suerte posible (la que más retrasa lo pedido). Hay que hallar el menor número con el que, aun con esa mala suerte, se cumple.
// params = { rounds: [{ bag: [[color, cantidad]], kind: 'iguales' | 'color', k, color? }] }   state = { rounds: [{ n }] }
GAMES['peor-caso-bolsa'] = (() => {
  const total = r => r.bag.reduce((a, b) => a + b[1], 0);
  const worst = r => {
    const out = [];
    if (r.kind === 'iguales') { const left = r.bag.map(b => Math.min(b[1], r.k - 1)); let more = true; while (more) { more = false; r.bag.forEach((b, i) => { if (left[i] > 0) { out.push(b[0]); left[i]--; more = true; } }); } r.bag.forEach(b => { for (let j = Math.min(b[1], r.k - 1); j < b[1]; j++) out.push(b[0]); }); }
    else { r.bag.forEach(b => { if (b[0] !== r.color) for (let j = 0; j < b[1]; j++) out.push(b[0]); }); const c = r.bag.find(b => b[0] === r.color); for (let j = 0; j < c[1]; j++) out.push(r.color); }
    return out;
  };
  const meets = (r, drawn) => { const cnt = {}; drawn.forEach(c => (cnt[c] = (cnt[c] || 0) + 1)); return r.kind === 'iguales' ? Object.values(cnt).some(v => v >= r.k) : (cnt[r.color] || 0) >= r.k; };
  const need = r => { const w = worst(r); for (let n = 1; n <= w.length; n++) if (meets(r, w.slice(0, n))) return n; return null; };
  const ok = (s, r) => s.n === need(r);
  const NAME = { coral: 'rojas', sky: 'azules', mint: 'verdes', sun: 'amarillas', brand: 'moradas' };
  const ask = r => (r.kind === 'iguales' ? `¿Cuántas sacar para tener seguro ${r.k} del mismo color?` : `¿Cuántas sacar para tener seguro ${r.k} ${NAME[r.color]}?`);
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ n: 1 }),
    ok,
    solution: r => `${need(r)} bolas`,
    prompt: ask,
    foot: () => 'Desliza cuántas sacar; el juego saca con la peor suerte',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { n: need(r) } : G.s, good = ok(s, r), w = worst(r), T = total(r), per = Math.min(T, 10), d = Math.min(24, (G.W - 40) / per);
      TK.label(p, C, `En la bolsa: ${r.bag.map(([c, n]) => `${n} ${NAME[c]}`).join(', ')}`, G.W / 2, 96, C.ink, 11, G.W - 24);
      w.forEach((c, i) => {
        const x = (G.W - per * d) / 2 + (i % per + 0.5) * d, y = 130 + Math.floor(i / per) * d, out = i < s.n;
        p.stroke(C.ink); p.strokeWeight(out ? 1.5 : 0.6); p.fill(out ? C[c] : RK.al(p, C[c], 50)); p.circle(x, y, d * 0.8);
      });
      const m = meets(r, w.slice(0, s.n)), prev = s.n > 1 && meets(r, w.slice(0, s.n - 1));
      TK.label(p, C, m ? (prev ? 'se cumple, pero con menos también' : 'aun con la peor suerte, se cumple') : 'con mala suerte, todavía no', G.W / 2, 130 + Math.ceil(T / per) * d + 10, m ? (prev ? C.coral : C.ok) : C.bad, 11, G.W - 24);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, T, s.n - 1, k => ((k + 1) % 5 === 0 || k === 0 ? String(k + 1) : null), good ? C.ok : C.brand);
      RK.strip(p, C, G.fb, `$\\text{sacar ${s.n}}$`, { kicker: good ? 'el menor número seguro' : '', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 28) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.n - 1), y: G.tY }, to: { x: G.X(G.s.n + 3), y: G.tY }, text: 'Desliza cuántas sacar', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = RK.pick(x, 30, G.W - 30, total(G.r)) + 1; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { answer: r => ({ n: need(r) }) });
})();
