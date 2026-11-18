// El retículo de las partes (Álgebra 0, subconjuntos y conjunto de partes; spec 2026-11-26-conjuntos-lamina): los
// subconjuntos de A forman un retículo: abajo el vacío, arriba A, y en cada nivel los de un mismo tamaño, unidos
// con los que se diferencian en un solo elemento. Todos empiezan apagados y sin nombre («?»). Con los interruptores
// (uno por elemento, gratis) se arma un subconjunto y «Encender» lo prende en su lugar del retículo. Hay que
// encender TODOS sin repetir: encender uno que ya estaba cuesta una vida, así que hay que llevar la cuenta de cuáles
// faltan (el retículo ayuda: un «?» unido a {1} y a {3} tiene que ser {1, 3}). Sin reloj.
// params = { rounds: [{ title, items: [{ name?, elements: [2 o 3], start?: máscara de los interruptores al empezar }] }] }
// estado del reto: { cur: máscara de los interruptores, seen: [máscaras encendidas] }

GAMES['cubo-partes'] = (() => {
  const N = it => 1 << it.elements.length;
  const label = (m, els) => (m ? `{${els.filter((_, k) => m & (1 << k)).join(', ')}}` : '∅');
  const ok = (s, it) => s.seen.length === N(it) && new Set(s.seen).size === N(it);
  // El primer subconjunto que falta (para el robot y la respuesta).
  const missing = (s, it) => Array.from({ length: N(it) }, (_, m) => m).find(m => !s.seen.includes(m));
  const pop = m => { let c = 0; for (; m; m >>= 1) c += m & 1; return c; };

  function layout(G) {
    const W = G.W, n = G.item.elements.length, fb = { x: 12, y: G.bottom - 56, w: W - 24, h: 54 };
    const P = { x: 12, y: 94, w: W - 24, h: fb.y - 58 - 94 }, sp = Math.min(92, (W - 24) / n), nw = Math.min(88, (P.w - 20) / 3 - 8);
    const node = m => {
      const lv = pop(m), row = Array.from({ length: 1 << n }, (_, v) => v).filter(v => pop(v) === lv), j = row.indexOf(m);
      return { x: P.x + P.w / 2 + (j - (row.length - 1) / 2) * (nw + 10) - nw / 2, y: P.y + P.h - 44 - lv * (P.h - 74) / n, w: nw, h: 30 };
    };
    G.L = { P, fb, node, sw: k => ({ x: W / 2 + (k - (n - 1) / 2) * sp - sp / 2 + 4, y: fb.y - 50, w: sp - 8, h: 42 }), btn: { x: fb.x + fb.w - 96, y: fb.y + 10, w: 86, h: 32 } };
  }

  function draw(G) {
    const { p, C, s, item: it, L } = G, els = it.elements, n = els.length, A = G.solved ? { line: C.ok, ink: C.ok } : SK.sets(C)[0];
    const mid = b => [b.x + b.w / 2, b.y + b.h / 2];
    SK.panel(p, C, L.P);
    SK.serif(p, `P(${it.name || 'A'})`, L.P.x + 26, L.P.y + 16, 14, C.mute);
    // Aristas: dos subconjuntos unidos se diferencian en un solo elemento. En color, las que unen dos encendidos.
    for (let m = 0; m < 1 << n; m++) for (let k = 0; k < n; k++) if (!(m & (1 << k))) {
      const a = mid(L.node(m)), b = mid(L.node(m | (1 << k))), lit = s.seen.includes(m) && s.seen.includes(m | (1 << k));
      p.stroke(lit ? A.line : C.line); p.strokeWeight(lit ? 2 : 1.2); p.line(a[0], a[1], b[0], b[1]);
    }
    p.noStroke();
    const hop = (s.hop = Math.max(0, (s.hop ?? 0) - G.dt * 4)), last = s.seen[s.seen.length - 1];
    for (let m = 0; m < 1 << n; m++) {
      const b = L.node(m);
      if (s.seen.includes(m)) SK.chip(p, C, b, label(m, els), { state: G.solved ? 'ok' : 'on', k: m === last ? 1 + 0.16 * hop : 1, size: 13 });
      else { p.fill(C.bg); p.rect(b.x, b.y, b.w, b.h, 15); SK.chip(p, C, b, '', { state: 'ghost' }); p.fill(C.mute); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.textSize(13); p.text('?', b.x + b.w / 2, b.y + b.h / 2 + 1); }
    }
    // Interruptores: uno por elemento; prendido = el elemento está en el subconjunto que se está armando.
    els.forEach((e, k) => {
      const b = L.sw(k), on = !!(s.cur & (1 << k)), tw = 40, tx = b.x + b.w - tw - 6, ty = b.y + b.h / 2 - 11;
      const kx = SK.ease((s.knob ||= {}), k, on ? 1 : 0, G.dt, 18);
      SK.panel(p, C, b, { r: 12 });
      SK.serif(p, e, b.x + (b.w - tw - 6) / 2 + 2, b.y + b.h / 2, 17, on ? A.ink : C.mute);
      p.stroke(on ? A.line : C.line); p.strokeWeight(1.4); p.fill(on ? SK.al(p, A.line, 70) : C.bg); p.rect(tx, ty, tw, 22, 11);
      p.noStroke(); p.fill(on ? A.line : C.mute); p.circle(tx + 11 + kx * (tw - 22), ty + 11, 16);
    });
    const done = s.seen.length === N(it), tex = label(s.cur, els).replace('{', '\\{').replace('}', '\\}').replace('∅', '\\varnothing');
    SK.formal(p, C, L.fb, done ? `$n(P(${it.name || 'A'})) = 2^{${n}} = ${N(it)}$` : `$${tex} \\subseteq ${it.name || 'A'}$`,
      { kicker: `Encendidos: ${s.seen.length} de ${N(it)}`, col: A.line, right: done ? 0 : 94 });
    if (!done) drawBtn(p, C, L.btn, 'Encender', true);
  }

  function press(G, x, y) {
    const { s, item: it, L } = G;
    if (hitBox(L.btn, x, y)) {
      if (s.seen.includes(s.cur)) { G.bad(`${label(s.cur, it.elements)} ya estaba encendido`); return true; }
      s.seen.push(s.cur); s.hop = 1; G.api.sfx?.tap?.();
      if (ok(s, it)) G.good(`¡Los ${N(it)} subconjuntos!`);
      return true;
    }
    const k = it.elements.findIndex((_, i) => hitBox(L.sw(i), x, y));
    if (k < 0) return false;
    s.cur ^= 1 << k; G.api.sfx?.tap?.();
    return true;
  }

  return Object.assign(questGame({
    aspect: 1.5, ok,
    init: it => ({ cur: it.start ?? 0, seen: [] }),
    answer: it => ({ cur: N(it) - 1, seen: Array.from({ length: N(it) }, (_, m) => m) }),
    solution: it => `${it.name || 'A'} = {${it.elements.join(', ')}} tiene ${N(it)} subconjuntos`,
    prompt: it => `Enciende los ${N(it)} subconjuntos, sin repetir`,
    foot: () => 'Arma un subconjunto con los interruptores y enciéndelo',
    idle: 'Sin prisa: lleva la cuenta de los que faltan',
    layout, draw, press,
    // Para el robot: los interruptores que llevan al primer subconjunto que falta, y «Encender».
    demo(G) { const b = G.L.sw(0); return { from: { x: b.x + b.w / 2, y: b.y + b.h / 2 } }; },
    peek: G => { const m = missing(G.s, G.item), d = m ^ G.s.cur; return { solve: [...G.item.elements.map((_, k) => (d & (1 << k) ? G.L.sw(k) : null)).filter(Boolean), G.L.btn] }; },
  }), { label, missing });
})();
