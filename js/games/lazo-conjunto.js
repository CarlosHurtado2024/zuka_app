// Lazo (Álgebra 0, notación y pertenencia; spec 2026-11-26-conjuntos-lamina): arriba está el conjunto por
// comprensión. Sus elementos y varias trampas están sueltos en el universo U. Se rodean con el dedo (un lazo) o se
// tocan, y entran a la membrana; tocar uno de adentro lo saca. Abajo se escribe en vivo el conjunto por extensión
// y su cardinal. «Listo» comprueba: adentro deben quedar exactamente los que cumplen la condición. Sin reloj.
// params = { rounds: [{ title, items: [{ name, rule, members, others }] }] }   (máximo 9 elementos por reto)
// estado del reto: { in: [elementos dentro de la membrana] }

GAMES['lazo-conjunto'] = (() => {
  const all = it => [...it.members, ...it.others];
  // Orden fijo en que salen los elementos en el universo: mezcla los que pertenecen con las trampas.
  const order = it => { const v = all(it); return shuffledOrder(v.length, it.name + it.rule).map(i => v[i]); };
  const ok = (s, it) => s.in.length === it.members.length && it.members.every(x => s.in.includes(x));
  // ¿El punto está dentro del lazo? (el lazo se cierra solo, del último punto al primero)
  function inPoly(x, y, poly) {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }

  function layout(G) {
    const W = G.W, U = { x: 12, y: 134, w: W - 24, h: G.bottom - 62 - 134 }, cw = (U.w - 32) / 3;
    const fb = { x: 12, y: G.bottom - 56, w: W - 24, h: 54 };
    G.L = {
      U, cw, fb, mem: { x: W / 2, y: U.y + U.h - 62, rx: U.w / 2 - 12, ry: 54 },
      btn: { x: fb.x + fb.w - 76, y: fb.y + 10, w: 66, h: 32 },
      cell: i => ({ x: U.x + 10 + (i % 3) * (cw + 6), y: U.y + 29 + Math.floor(i / 3) * 35, w: cw, h: 29 }),
    };
  }
  // Caja de un elemento: su celda del universo o su sitio dentro de la membrana (filas de a tres).
  function target(G, lab, i) {
    const { mem, cw, cell } = G.L, k = G.s.in.indexOf(lab);
    if (k < 0) return cell(i);
    // De a tres por fila (de a dos en un celular angosto, para que las palabras se lean).
    const per = G.W < 300 ? 2 : 3, n = G.s.in.length, rows = Math.ceil(n / per), h = Math.min(28, Math.max(20, 96 / rows - 5)), row = Math.floor(k / per);
    const inRow = Math.min(per, n - row * per), w = Math.min(cw + 8, (2 * mem.rx - 44) / per - 6);
    return { x: mem.x + ((k % per) - (inRow - 1) / 2) * (w + 6) - w / 2, y: mem.y + (row - (rows - 1) / 2) * (h + 5) - h / 2, w, h };
  }

  function draw(G) {
    const { p, C, s, item: it, L } = G, A = G.solved ? { line: C.ok, ink: C.ok } : SK.sets(C)[0], els = order(it);
    SK.kicker(p, C, 'Por comprensión', 14, 94);
    p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
    fitText(p, `${it.name} = {x : ${it.rule}}`, G.W / 2, 115, G.W - 28, 15);
    SK.panel(p, C, L.U, { u: true });
    SK.membrane(p, C, L.mem.x, L.mem.y, L.mem.rx, L.mem.ry, A.line);
    SK.tag(p, C, it.name, L.mem.x - L.mem.rx * 0.76, L.mem.y - L.mem.ry * 0.9, A);
    const list = els.filter(x => s.in.includes(x));
    SK.serif(p, `n(${it.name}) = ${list.length}`, L.mem.x + L.mem.rx * 0.6, L.mem.y - L.mem.ry - 3, 13, A.ink);
    if (!list.length) { p.fill(C.mute); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER); p.textSize(12); p.text('aún no tiene elementos', L.mem.x, L.mem.y); }
    // Las celdas vacías del universo quedan marcadas; encima, las píldoras, que se deslizan a su sitio.
    els.forEach((lab, i) => { if (s.in.includes(lab)) SK.chip(p, C, L.cell(i), '', { state: 'ghost' }); });
    els.forEach((lab, i) => {
      const t = target(G, lab, i), b = (s.pos[lab] ||= { ...t });
      for (const k of ['x', 'y', 'w', 'h']) SK.ease(b, k, t[k], G.dt);
      SK.chip(p, C, b, lab, { state: !s.in.includes(lab) ? 'idle' : G.solved ? 'ok' : 'on', size: 13 });
    });
    // El lazo mientras se dibuja, y un instante después de soltarlo.
    if (G.locked) s.path = s.fade = null;
    const path = s.path || s.fade?.path;
    if (path && path.length > 1) {
      const a = s.path ? 1 : Math.max(0, s.fade.t / 0.45);
      p.fill(SK.al(p, A.line, 46 * a)); p.stroke(SK.al(p, A.line, 255 * a)); p.strokeWeight(2);
      p.drawingContext.setLineDash([6, 5]); p.beginShape(); path.forEach(([x, y]) => p.vertex(x, y)); p.endShape(p.CLOSE); p.drawingContext.setLineDash([]); p.noStroke();
      if (!s.path && (s.fade.t -= G.dt) <= 0) s.fade = null;
    }
    SK.formal(p, C, L.fb, SK.setTex(it.name, list), { kicker: 'Por extensión', right: 74, col: A.line });
    drawBtn(p, C, L.btn, 'Listo', true);
  }

  function press(G, x, y) {
    const { s, item: it, L } = G, els = order(it);
    if (hitBox(L.btn, x, y)) {
      if (!s.in.length) { G.a.say('Primero encierra algún elemento', G.C.mute); return true; }
      G.submit(s.in.some(v => !it.members.includes(v)) ? 'Adentro hay uno que no cumple la condición' : 'Afuera quedó alguno que sí la cumple');
      return true;
    }
    const i = els.findIndex((lab, k) => hitBox(target(G, lab, k), x, y));
    if (i >= 0) { const k = s.in.indexOf(els[i]); if (k >= 0) s.in.splice(k, 1); else s.in.push(els[i]); G.api.sfx?.tap?.(); return true; }
    if (hitBox(L.U, x, y)) { s.path = [[x, y]]; return true; }
    return false;
  }
  function drag(G, x, y) {
    const q = G.s.path; if (!q) return false;
    const l = q[q.length - 1]; if (Math.hypot(x - l[0], y - l[1]) > 4) q.push([x, y]);
    return true;
  }
  function release(G) {
    const s = G.s, path = s.path; if (!path) return;
    s.path = null;
    if (path.length < 6) return;
    const got = order(G.item).filter((lab, i) => { if (s.in.includes(lab)) return false; const c = G.L.cell(i); return inPoly(c.x + c.w / 2, c.y + c.h / 2, path); });
    if (got.length) { s.in.push(...got); G.api.sfx?.tap?.(); }
    s.fade = { path, t: 0.45 };
  }

  return Object.assign(questGame({
    aspect: 1.5,
    init: () => ({ in: [], pos: {}, path: null, fade: null }),
    ok,
    answer: it => ({ in: [...it.members] }),
    solution: it => `${it.name} = {${it.members.join(', ')}}`,
    prompt: it => `Encierra los elementos de ${it.name}`,
    yes: it => `¡Eso! n(${it.name}) = ${it.members.length}`,
    foot: () => 'Rodea con el dedo o toca · adentro: toca para sacar',
    idle: 'Sin prisa: lee la condición entera',
    layout, draw, press, drag, release,
    demo(G) {
      const b = G.L.cell(1);
      const path = Array.from({ length: 21 }, (_, i) => {
        const a = -Math.PI / 2 + i * Math.PI / 10;
        return { x: b.x + b.w / 2 + (b.w / 2 + 3) * Math.cos(a), y: b.y + b.h / 2 + 18 * Math.sin(a) };
      });
      return { from: path[0], path };
    },
    // Para el robot: de a un toque (al sacar un elemento, los de adentro se reacomodan); con todo en su sitio, «Listo».
    peek: G => { const els = order(G.item), i = els.findIndex(lab => G.s.in.includes(lab) !== G.item.members.includes(lab)); return { solve: [i >= 0 ? target(G, els[i], i) : G.L.btn] }; },
  }), { inPoly, order });
})();
