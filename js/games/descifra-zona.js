// Descifra la zona (Álgebra 0, operaciones entre conjuntos; spec 2026-11-26-conjuntos-lamina): el diagrama de Venn
// muestra una zona RAYADA. Con tres ruedas (conjunto, operación, conjunto) se arma una operación, y el juego pinta
// en vivo la zona que esa operación significa. Se ajusta hasta que lo pintado coincide con lo rayado y se toca
// «Listo». Vale cualquier operación que dé esa zona (A − B o A ∩ Bᶜ). Las cuentas las hace el juego; sin reloj.
// params = { rounds: [{ title, items: [{ zones: [máscaras] }] }] }   máscaras: 1 solo A, 2 solo B, 3 A ∩ B, 0 fuera
// estado del reto: { l, op, r }   l, r: 0 A, 1 B, 2 Aᶜ, 3 Bᶜ   op: 0 ∪, 1 ∩, 2 −, 3 △

GAMES['descifra-zona'] = (() => {
  const SETS = ['A', 'B', 'Aᶜ', 'Bᶜ'], OPS = ['∪', '∩', '−', '△'];
  const TS = ['A', 'B', 'A^c', 'B^c'], TO = ['\\cup', '\\cap', '-', '\\triangle'];
  const has = (k, m) => [!!(m & 1), !!(m & 2), !(m & 1), !(m & 2)][k];
  const apply = (op, a, b) => [a || b, a && b, a && !b, a !== b][op];
  // Zonas (máscaras) que pinta la operación armada.
  const region = s => [0, 1, 2, 3].filter(m => apply(s.op, has(s.l, m), has(s.r, m)));
  const ok = (s, it) => region(s).join() === [...it.zones].sort().join();
  const tex = s => `$${TS[s.l]} ${TO[s.op]} ${TS[s.r]}$`;
  // La operación más sencilla que da la zona (primero sin complementos).
  function answer(it) {
    const all = [];
    for (let l = 0; l < 4; l++) for (let r = 0; r < 4; r++) for (let op = 0; op < 4; op++) if (l !== r && ok({ l, op, r }, it)) all.push({ l, op, r });
    return all.sort((a, b) => (a.l > 1) + (a.r > 1) - (b.l > 1) - (b.r > 1))[0] || null;
  }
  // Se empieza en una operación que NO da la zona pedida.
  const init = it => [{ l: 0, op: 0, r: 1 }, { l: 0, op: 1, r: 1 }, { l: 0, op: 2, r: 1 }].find(s => !ok(s, it));

  function layout(G) {
    const W = G.W, fb = { x: 12, y: G.bottom - 56, w: W - 24, h: 54 }, wy = fb.y - 62;
    const box = { x: 12, y: 94, w: W - 24, h: wy - 10 - 94 }, ww = Math.min(88, (W - 24 - 16) / 3);
    G.L = { fb, box, circles: SK.venn2(box, 0.6, 6), btn: { x: fb.x + fb.w - 76, y: fb.y + 10, w: 66, h: 32 },
      wheel: i => ({ x: W / 2 + (i - 1) * (ww + 8) - ww / 2, y: wy, w: ww, h: 52 }) };
  }

  function draw(G) {
    const { p, C, s, item: it, L } = G, [A, B] = SK.sets(C), hit = G.solved, mine = region(s);
    SK.panel(p, C, L.box, { u: true });
    // Lo que pinta la operación armada; encima, el rayado de la zona pedida.
    SK.zones(p, L.box, L.circles, mine, { col: hit ? C.ok : C.brand, alpha: hit ? 120 : 105 });
    if (!hit) SK.zones(p, L.box, L.circles, it.zones, { col: C.N, hatch: true });
    L.circles.forEach((c, k) => { p.noFill(); p.stroke([A, B][k].line); p.strokeWeight(2.2); p.circle(c.x, c.y, 2 * c.r); });
    p.noStroke();
    SK.tag(p, C, 'A', L.circles[0].x - L.circles[0].r * 0.74, L.circles[0].y - L.circles[0].r * 0.8, A);
    SK.tag(p, C, 'B', L.circles[1].x + L.circles[1].r * 0.74, L.circles[1].y - L.circles[1].r * 0.8, B);
    // Las tres ruedas se deslizan a los lados y se ajustan a cada símbolo.
    [[SETS, s.l], [OPS, s.op], [SETS, s.r]].forEach(([opts, v], i) => {
      const b = L.wheel(i);
      SK.panel(p, C, b, { r: 12, col: hit ? C.ok : null });
      // Con el motor de fórmulas: el complemento va como exponente (la letra ᶜ no está en todas las tipografías).
      p.noStroke(); p.fill(i === 1 ? C.ink : [A, B][v % 2].ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
      fitText(p, `$${(i === 1 ? TO : TS)[v]}$`, b.x + b.w / 2, b.y + b.h / 2 - 5, b.w - 34, 22, 30);
      p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(15); p.textAlign(p.CENTER, p.CENTER);
      p.text('‹', b.x + 10, b.y + b.h / 2 - 5); p.text('›', b.x + b.w - 10, b.y + b.h / 2 - 5);
      opts.forEach((_, j) => { p.fill(j === v ? C.brand : C.line); p.circle(b.x + b.w / 2 + (j - 1.5) * 9, b.y + b.h - 9, j === v ? 6 : 4); });
    });
    SK.formal(p, C, L.fb, tex(s), { kicker: hit ? 'Coincide con lo rayado' : 'Tu operación', right: 74, col: hit ? C.ok : C.brand });
    drawBtn(p, C, L.btn, 'Listo', true);
  }

  function press(G, x, y) {
    const { L } = G;
    if (hitBox(L.btn, x, y)) { G.submit('Lo pintado no coincide con lo rayado'); return true; }
    const i = [0, 1, 2].findIndex(k => hitBox(L.wheel(k), x, y));
    if (i < 0) return false;
    G.roll = { i, key: ['l', 'op', 'r'][i], x, moved: false };
    return true;
  }
  function roll(G, d) {
    const k = G.roll.key;
    G.s[k] = (G.s[k] + d + 4) % 4;
    G.api.sfx?.tap?.();
  }
  function drag(G, x) {
    if (!G.roll) return false;
    const d = Math.trunc((x - G.roll.x) / 26);
    if (d) { roll(G, d % 4); G.roll.x += d * 26; G.roll.moved = true; }
    return true;
  }
  function release(G, x, y) {
    if (!G.roll) return;
    const b = G.L.wheel(G.roll.i);
    if (!G.roll.moved && hitBox(b, x, y)) roll(G, x < b.x + b.w / 2 ? -1 : 1);
    G.roll = null;
  }
  const right = b => ({ x: b.x + b.w / 2 + 4, y: b.y + 4, w: b.w / 2 - 8, h: b.h - 8 });

  return Object.assign(questGame({
    aspect: 1.5, init, ok, answer,
    solution: it => tex(answer(it)).replace(/\$/g, '').replace('\\cup', '∪').replace('\\cap', '∩').replace('\\triangle', '△').replace(/\^c/g, 'ᶜ').replace('-', '−'),
    prompt: () => 'Arma la operación que pinta la zona rayada',
    yes: (it, s) => `¡Eso! ${SETS[s.l]} ${OPS[s.op]} ${SETS[s.r]}`,
    foot: () => 'Compara lo rayado con lo pintado antes de tocar Listo',
    idle: 'Sin prisa: compara las dos zonas',
    layout, draw, press, drag, release,
    cancel(G) { G.roll = null; },
    demo(G) {
      const b = G.L.wheel(1), x = b.x + b.w / 2 - 12, y = b.y + b.h / 2 - 5;
      return { from: { x, y }, to: { x: x + 28, y } };
    },
    peek: G => { const a = answer(G.item), out = []; ['l', 'op', 'r'].forEach((k, i) => { for (let n = (a[k] - G.s[k] + 4) % 4; n > 0; n--) out.push(right(G.L.wheel(i))); }); return { solve: [...out, G.L.btn] }; },
  }), { region, tex });
})();
