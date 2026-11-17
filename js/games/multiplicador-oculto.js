// El multiplicador oculto (Trigonometría, trig-152): multiplicar por w = r cis θ gira la figura θ y la estira r veces. Se ve una
// banderita (en gris) y su imagen después de multiplicarla por w una o dos veces (en color); hay que tocar en la telaraña el
// punto w. Con dos veces (w²) hay dos respuestas: las dos raíces cuadradas. item = { r (½, 1, 1.5 o 2), deg (múltiplo de 30), k? }
GAMES['multiplicador-oculto'] = (() => {
  const RS = [0.5, 1, 1.5, 2], RP = { 0.5: '½', 1: '1', 1.5: '1.5', 2: '2' };
  const FLAG = [[0.45, 0], [1, 0], [1, 0.32], [0.8, 0.5], [0.6, 0.32]];        // una banderita junto al 1
  const mul = (pt, r, deg) => { const a = TK.rad(deg), [x, y] = pt; return [r * (x * Math.cos(a) - y * Math.sin(a)), r * (x * Math.sin(a) + y * Math.cos(a))]; };
  const kOf = it => it.k || 1;
  const fits = (r, deg, it) => Math.abs(r ** kOf(it) - it.r ** kOf(it)) < 1e-9 && TK.mod(kOf(it) * deg, 360) === TK.mod(kOf(it) * it.deg, 360);
  const nodes = () => RS.flatMap(r => Array.from({ length: 12 }, (_, j) => [r, 30 * j]));
  const answers = it => nodes().filter(([r, d]) => fits(r, d, it));
  return questGame({
    aspect: 1.35,
    init: () => ({ pick: null, found: [] }),
    ok: (s, it) => s.found.length >= answers(it).length,
    answer: it => ({ pick: null, found: answers(it) }),
    solution: it => answers(it).map(([r, d]) => `$w = ${r === 1 ? '' : RP[r] + '\\,'}\\mathrm{cis}\\,${d}^\\circ$`).join(' o '),
    prompt: it => kOf(it) === 1 ? 'La bandera gris se multiplicó por $w$. Toca $w$' : 'La bandera gris se multiplicó dos veces por $w$. Toca cada $w$ posible',
    foot: (it, s) => kOf(it) === 1 ? 'El ángulo de $w$ es el giro; su módulo, cuántas veces se estiró' : `Encontrados: ${s.found.length} de ${answers(it).length}. Gira el doble y se estira el cuadrado`,
    layout(G) {
      G.R = Math.min(G.W * 0.4, (G.bottom - G.top - 30) / 2); G.cx = G.W / 2; G.cy = (G.top + G.bottom) / 2 + 6; G.u = G.R / 2.15;
      G.node = ([r, d]) => { const [x, y] = TK.at(G.cx, G.cy, r * G.u, d); const h = r < 1 ? 7 : 9; return { x: x - h, y: y - h, w: 2 * h, h: 2 * h }; };
    },
    draw(G) {
      const { p, C, s, item: it, cx, cy, u } = G, k = kOf(it);
      for (const r of RS) { p.noFill(); p.stroke(C.line); p.strokeWeight(r === 1 ? 2 : 1); p.circle(cx, cy, 2 * r * u); }
      for (let a = 0; a < 180; a += 30) { const [x1, y1] = TK.at(cx, cy, 2 * u, a), [x2, y2] = TK.at(cx, cy, 2 * u, a + 180); p.stroke(C.line); p.strokeWeight(a % 90 ? 0.8 : 1.6); p.line(x1, y1, x2, y2); }
      const scr = ([x, y]) => [cx + x * u, cy - y * u];
      const poly = (pts, col, w) => { p.stroke(col); p.strokeWeight(w); p.fill(col); p.beginShape(); pts.forEach(q => p.vertex(...scr(q))); p.endShape(p.CLOSE); };
      let img = FLAG; for (let j = 0; j < k; j++) img = img.map(q => mul(q, it.r, it.deg));
      poly(FLAG, C.mute, 2);
      poly(img, G.solved ? C.ok : C.coral, 2);
      // Los nodos van encima de las banderas (con borde), para que la respuesta siempre se vea.
      for (const n of nodes()) { const [x, y] = TK.at(cx, cy, n[0] * u, n[1]); p.stroke(C.bg); p.strokeWeight(1.5); p.fill(C.ink); p.circle(x, y, 6); }
      TK.label(p, C, 'antes', ...scr([1.15, -0.18]), C.mute, 11, 50);
      const [lx, ly] = scr(mul([1.2, 0.2], it.r ** k, k * it.deg)); TK.label(p, C, k === 1 ? 'después' : 'después de 2 veces', lx, ly, G.solved ? C.ok : C.coral, 11, 110);
      for (const [r, d] of s.found) { const [x, y] = TK.at(cx, cy, r * u, d); p.stroke(C.ok); p.strokeWeight(3); p.line(cx, cy, x, y); drawDot(p, C, x, y, 12, C.ok); TK.label(p, C, `${RP[r]} cis ${d}°`, x, y - 16, C.ok, 11, 90); }
      if (s.pick) { const [x, y] = TK.at(cx, cy, s.pick[0] * u, s.pick[1]); drawDot(p, C, x, y, 12, C.bad); }
    },
    press(G, x, y) {
      const s = G.s, it = G.item, hit = nodes().find(n => hitBox(G.node(n), x, y));
      if (!hit) return false;
      if (s.found.some(f => f[0] === hit[0] && f[1] === hit[1])) return true;
      if (!fits(hit[0], hit[1], it)) {
        s.pick = hit;
        const [r] = hit, k = kOf(it);
        G.bad(Math.abs(r ** k - it.r ** k) > 1e-9 ? 'Ese no estira lo que se estiró: mira el tamaño' : 'El tamaño sí, pero el giro no: mira hacia dónde apunta');
        return true;
      }
      s.pick = null; s.found.push(hit); G.api.sfx?.tap?.();
      if (s.found.length >= answers(it).length) G.good(kOf(it) === 1 ? 'Multiplicar es girar y estirar' : 'Dos raíces cuadradas: a media vuelta una de otra');
      return true;
    },
    peek: G => ({ solve: answers(G.item).filter(a => !G.s.found.some(f => f[0] === a[0] && f[1] === a[1])).map(G.node), wrong: G.node(nodes().find(n => !fits(n[0], n[1], G.item))) }),
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
