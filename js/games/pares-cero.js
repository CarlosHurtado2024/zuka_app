// Pares cero (Álgebra, alg-11; spec 2026-11-18-algebra-revision): sumar y restar enteros con fichas. Cada ficha + vale 1
// y cada ficha − vale −1; una + sobre una − se anulan (un par cero). Para restar se QUITAN fichas; si no hay de las que
// hay que quitar, se agregan pares cero (no cambian el valor) y luego se quitan. Así se ve por qué 3 − (−4) = 7.
// params = { rounds: [{ op: '+' | '-', a, b }] }   state = { rounds: [{ P, N, rem }] }   (fichas + y − en la mesa; quitadas)
GAMES['pares-cero'] = (() => {
  const start = r => (r.op === '+' ? { P: Math.max(r.a, 0) + Math.max(r.b, 0), N: Math.max(-r.a, 0) + Math.max(-r.b, 0), rem: 0 } : { P: Math.max(r.a, 0), N: Math.max(-r.a, 0), rem: 0 });
  const res = r => (r.op === '+' ? r.a + r.b : r.a - r.b);
  const ok = (s, r) => Math.min(s.P, s.N) === 0 && (r.op === '+' || s.rem === Math.abs(r.b)) && s.P - s.N === res(r);
  // Una manera de llegar (para la solución y las pruebas).
  function answer(r) {
    const s = start(r);
    if (r.op === '-') { const need = Math.abs(r.b), have = r.b > 0 ? s.P : s.N; if (have < need) { s.P += need - have; s.N += need - have; } if (r.b > 0) s.P -= need; else s.N -= need; s.rem = need; }
    const m = Math.min(s.P, s.N); s.P -= m; s.N -= m; return s;
  }
  const expr = r => `${RK.num(r.a)} ${r.op} ${RK.par(r.b)}`;
  const game = roundsGame({
    aspect: 1.25,
    init: start,
    ok,
    solution: r => `${expr(r).replace(/\\tfrac\{(\d+)\}\{(\d+)\}/g, '$1/$2')} = ${res(r)}`,
    prompt: r => `Calcula $${expr(r)}$ con fichas`,
    foot: r => (r.op === '-' ? 'Restar es quitar. Si no hay qué quitar, agrega pares cero' : 'Arrastra una ficha sobre una de signo contrario: se anulan'),
    layout(G) {
      const W = G.W, H = G.H; G.mat = { x: 12, y: 96, w: W - 24, h: H * 0.42 };
      G.pair = { x: 16, y: G.mat.y + G.mat.h + 14, w: 70, h: 40 }; G.bin = { x: W - 96, y: G.pair.y, w: 80, h: 40 }; G.fb = { x: 12, y: H - 86, w: W - 24, h: 52 };
    },
    enter(G) { G.drag = null; G.msg = null; },
    draw(G) {
      const { p, C, r, mat } = G, good = ok(G.s, r), s = G.locked && !good ? answer(r) : G.s;
      p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.card, 200)); p.rect(mat.x, mat.y, mat.w, mat.h, 14);
      // Fichas: arriba las +, abajo las −.
      const t = 24, gap = 5, per = Math.floor((mat.w - 16) / (t + gap));
      G.tiles = [];
      const row = (n, sign, y0) => { for (let i = 0; i < n; i++) { const x = mat.x + 10 + (i % per) * (t + gap), y = y0 + Math.floor(i / per) * (t + gap); G.tiles.push({ sign, x, y }); } };
      row(s.P, 1, mat.y + 12); row(s.N, -1, mat.y + mat.h / 2 + 6);
      G.tiles.forEach((q, i) => { if (G.drag?.i === i) return; game.tile(p, C, q.x, q.y, t, q.sign); });
      // Par cero para agregar y papelera para quitar (solo al restar).
      p.stroke(C.line); p.strokeWeight(1); p.fill(C.card); p.rect(G.pair.x, G.pair.y, G.pair.w, G.pair.h, 10);
      game.tile(p, C, G.pair.x + 8, G.pair.y + 8, t, 1); game.tile(p, C, G.pair.x + 38, G.pair.y + 8, t, -1);
      TK.label(p, C, 'par cero', G.pair.x + G.pair.w / 2, G.pair.y + G.pair.h + 10, C.mute, 10, 80);
      if (r.op === '-') { p.stroke(C.coral); p.strokeWeight(1.4); p.fill(RK.al(p, C.coral, 30)); p.rect(G.bin.x, G.bin.y, G.bin.w, G.bin.h, 10); TK.label(p, C, `quitar · ${s.rem} de ${Math.abs(r.b)}`, G.bin.x + G.bin.w / 2, G.bin.y + G.bin.h / 2, C.ink, 11, 76); }
      if (G.drag) game.tile(p, C, G.drag.x - t / 2, G.drag.y - t / 2, t, G.drag.sign, true);
      if (G.msg && G.t - G.msg.t < 2.4) TK.label(p, C, G.msg.text, G.W / 2, G.pair.y + G.pair.h + 26, C.bad, 11, G.W - 30);
      RK.strip(p, C, G.fb, `$${expr(r)}\\quad\\to\\quad ${s.P} - ${s.N} = ${s.P - s.N}$`, { kicker: 'En la mesa', col: G.locked ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      const i = (G.tiles || []).findIndex(q => x > q.x - 3 && x < q.x + 27 && y > q.y - 3 && y < q.y + 27);
      if (i >= 0) { G.drag = { i, sign: G.tiles[i].sign, x, y }; return true; }
      if (hitBox(G.pair, x, y)) { G.drag = { i: -1, sign: 0, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; if (!d) return; G.drag = null;
      const s = G.s, r = G.r, inMat = hitBox(G.mat, x, y), say = text => { G.msg = { t: G.t, text }; };
      if (d.i === -1) { if (inMat) { s.P++; s.N++; G.touch(); } return; }
      if (r.op === '-' && hitBox(G.bin, x, y)) {
        if (Math.sign(r.b) !== d.sign) return say(`Hay que quitar fichas ${r.b > 0 ? '+' : '−'}`);
        if (s.rem >= Math.abs(r.b)) return say('Ya quitaste todas las que resta la cuenta');
        if (d.sign > 0) s.P--; else s.N--; s.rem++; G.touch(); return;
      }
      const other = G.tiles.find((q, k) => k !== d.i && q.sign === -d.sign && x > q.x - 6 && x < q.x + 30 && y > q.y - 6 && y < q.y + 30);
      if (other) { s.P--; s.N--; G.touch(); }
    },
    demo(G) { const a = G.tiles?.find(q => q.sign > 0), b = G.tiles?.find(q => q.sign < 0); return a && b ? { from: { x: a.x + 12, y: a.y + 12 }, to: { x: b.x + 12, y: b.y + 12 }, text: 'Una + sobre una −: se anulan', ty: G.mat.y + G.mat.h - 14 } : { from: { x: G.pair.x + 35, y: G.pair.y + 20 }, to: { x: G.mat.x + G.mat.w / 2, y: G.mat.y + 40 }, text: 'Agrega un par cero', ty: G.mat.y + G.mat.h - 14 }; },
    peek: G => ({ tiles: G.tiles, mat: G.mat, pair: G.pair, bin: G.bin }),
  });
  game.tile = (p, C, x, y, t, sign, lift) => {
    const col = sign > 0 ? C.sky : C.coral;
    p.stroke(col); p.strokeWeight(lift ? 2.4 : 1.6); p.fill(RK.al(p, col, lift ? 120 : 70)); p.rect(x, y, t, t, 6);
    p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(15); p.text(sign > 0 ? '+' : '−', x + t / 2, y + t / 2 + 1);
  };
  return Object.assign(game, { answer, res, start });
})();
