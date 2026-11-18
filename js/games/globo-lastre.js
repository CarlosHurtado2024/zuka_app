// Globo y lastre (Preuniversitario UdeA, pu-cm-1; spec 2026-11-18-preuda-enteros): sumar y restar enteros se ve y se
// toca. Un canasto flota a la altura g − s: cada globo vale +1 y lo sube, cada saco de arena vale −1 y lo baja. En cada
// ronda solo se permite una acción, arrastrando: amarrar globos (sumar positivos), colgar sacos (sumar negativos),
// soltar globos (restar positivos) o soltar sacos (restar negativos: el canasto SUBE). El canasto se mueve en vivo y la
// cuenta se escribe sola; hay que dejarlo a la altura de la bandera. Estilo de «limonada»: sin vidas ni reloj.
// params = { rounds: [{ g, s, act: 'addG' | 'addS' | 'remG' | 'remS', target }] }   state = { rounds: [{ k }] }
GAMES['globo-lastre'] = (() => {
  const m = TK.minusTxt, LO = -8, HI = 8;
  const SIGN = { addG: 1, addS: -1, remG: -1, remS: 1 };
  const start = r => r.g - r.s;
  const alt = (r, k) => start(r) + SIGN[r.act] * k;
  const need = r => (r.target - start(r)) * SIGN[r.act];
  const maxK = r => (r.act === 'remG' ? r.g : r.act === 'remS' ? r.s : 8);
  const opTxt = (r, k) => (r.act === 'addG' ? `+ ${k}` : r.act === 'addS' ? `+ (−${k})` : r.act === 'remG' ? `− ${k}` : `− (−${k})`);
  const expr = (r, k) => `${m(start(r))} ${opTxt(r, k)} = ${m(alt(r, k))}`;
  const counts = (r, k) => ({ g: r.g + (r.act === 'addG' ? k : r.act === 'remG' ? -k : 0), s: r.s + (r.act === 'addS' ? k : r.act === 'remS' ? -k : 0) });
  const PROMPT = {
    addG: 'Llega a la bandera amarrando globos al canasto', addS: 'Llega a la bandera colgando sacos de arena',
    remG: 'Llega a la bandera soltando globos', remS: 'Llega a la bandera soltando sacos de arena',
  };
  const isAdd = r => r.act.startsWith('add'), isG = r => r.act.endsWith('G');
  function balloon(p, C, x, y, d = 22) { p.stroke(shade(C.sky, 0.7)); p.strokeWeight(1.5); p.fill(C.sky); p.ellipse(x, y, d, d * 1.15); p.noStroke(); p.fill(shade(C.sky, 0.7)); p.triangle(x - 3, y + d * 0.6, x + 3, y + d * 0.6, x, y + d * 0.48); }
  function bag(p, C, x, y, s = 15) { p.stroke(shade(C.coral, 0.7)); p.strokeWeight(1.5); p.fill(C.coral); p.rect(x - s / 2, y - s / 2, s, s, 3, 3, 6, 6); p.line(x - 3, y - s / 2, x + 3, y - s / 2); }
  const game = roundsGame({
    aspect: 1.5,
    init: () => ({ k: 0 }),
    ok: (s, r) => alt(r, s.k) === r.target,
    answered: s => s.k > 0,
    solution: r => expr(r, need(r)),
    prompt: r => PROMPT[r.act],
    foot: (r, s) => (s.k ? (alt(r, s.k) === r.target ? 'Está a la altura de la bandera' : 'Todavía no está a la altura de la bandera') : 'Globo: +1 (sube). Saco de arena: −1 (baja)'),
    layout(G) {
      const top = 138, bot = G.H - 128;
      G.Y = v => top + (HI - v) / (HI - LO) * (bot - top);
      G.cx = G.W * 0.57;
      G.src = { x: 14, y: G.H - 84, w: 76, h: 52 };
      G.reset = { x: G.W - 104, y: G.H - 76, w: 92, h: 36 };
    },
    enter(G) { G.tok = null; },
    draw(G) {
      const { p, C, r, s, Y, cx } = G, c = counts(r, s.k), a = alt(r, s.k), ok = a === r.target;
      if (G.tok && !isAdd(r)) c[isG(r) ? 'g' : 's']--;   // el que va en el dedo ya no cuelga del canasto
      TK.label(p, C, expr(r, s.k), G.W / 2, 104, G.locked ? (ok ? C.ok : C.bad) : ok && s.k ? C.ok : C.ink, 19, G.W - 24);
      // Escala de altura a la izquierda, con el 0 marcado.
      p.stroke(C.line); p.strokeWeight(2); p.line(34, Y(HI), 34, Y(LO));
      for (let v = LO; v <= HI; v++) {
        p.stroke(v ? C.line : C.mute); p.strokeWeight(v ? 1.5 : 2.5); p.line(v % 2 ? 31 : 28, Y(v), 37, Y(v));
        if (v % 2 === 0) { p.noStroke(); p.fill(v < 0 ? C.I : v ? C.Z : C.N); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.RIGHT, p.CENTER); p.text(m(v), 25, Y(v)); }
      }
      p.stroke(C.mute); p.strokeWeight(1); p.drawingContext.setLineDash([4, 5]); p.line(40, Y(0), G.W - 12, Y(0)); p.drawingContext.setLineDash([]);
      // La bandera: una línea a la altura pedida.
      const ty = Y(r.target);
      p.stroke(C.ok); p.strokeWeight(2); p.drawingContext.setLineDash([7, 5]); p.line(40, ty, G.W - 34, ty); p.drawingContext.setLineDash([]);
      p.line(G.W - 30, ty, G.W - 30, ty - 24); p.noStroke(); p.fill(C.ok); p.triangle(G.W - 30, ty - 24, G.W - 14, ty - 18, G.W - 30, ty - 12);
      TK.label(p, C, m(r.target), G.W - 22, ty + 12, C.ok, 13, 34);
      // El canasto, con sus globos arriba y sus sacos abajo; se desliza a su altura.
      const cy = G.cy = Y(TK.glide(G, 'a' + G.cur, a, 6));
      for (let i = 0; i < c.g; i++) { const bx = cx + ((i % 4) - 1.5) * 25, by = cy - 44 - Math.floor(i / 4) * 26; p.stroke(C.mute); p.strokeWeight(1); p.line(bx, by + 13, cx + ((i % 4) - 1.5) * 9, cy - 11); balloon(p, C, bx, by); }
      for (let i = 0; i < c.s; i++) { const bx = cx + ((i % 4) - 1.5) * 21, by = cy + 30 + Math.floor(i / 4) * 21; p.stroke(C.mute); p.strokeWeight(1); p.line(bx, by - 8, cx + ((i % 4) - 1.5) * 10, cy + 11); bag(p, C, bx, by); }
      drawTile(p, C, { x: cx - 26, y: cy - 11, w: 52, h: 22 }, m(a), { fill: ok && s.k ? C.mint : C.cream, size: 13, r: 5 });
      // Abajo: de dónde se toma lo que se añade, o qué hacer para soltar; y «Reiniciar».
      if (isAdd(r)) {
        drawTile(p, C, G.src, '', { fill: C.card, r: 10 });
        (isG(r) ? balloon : bag)(p, C, G.src.x + G.src.w / 2, G.src.y + G.src.h / 2 - 2, isG(r) ? 24 : 18);
        TK.label(p, C, isG(r) ? 'Arrastra globos al canasto' : 'Arrastra sacos al canasto', G.src.x + G.src.w + 62, G.src.y + G.src.h / 2, C.mute, 12, 116);
      } else TK.label(p, C, isG(r) ? 'Arrastra un globo lejos del canasto' : 'Arrastra un saco lejos del canasto', 14 + 86, G.H - 58, C.mute, 12, 172);
      drawTile(p, C, G.reset, 'Reiniciar', { fill: C.cream, size: 13 });
      if (G.tok) (isG(r) ? balloon : bag)(p, C, G.tok.x, G.tok.y, isG(r) ? 24 : 18);
    },
    press(G, x, y) {
      const { r, s, cx, cy } = G;
      if (hitBox(G.reset, x, y)) { if (s.k) { s.k = 0; G.touch(); } return true; }
      if (isAdd(r)) { if (hitBox(G.src, x, y)) { G.tok = { x, y }; return true; } return false; }
      // Soltar: se agarra un globo (arriba del canasto) o un saco (abajo).
      const c = counts(r, s.k), up = isG(r), n = up ? c.g : c.s;
      const inZone = Math.abs(x - cx) < 62 && (up ? y < cy - 8 && y > cy - 70 - Math.floor((n - 1) / 4) * 26 : y > cy + 8 && y < cy + 50 + Math.floor((n - 1) / 4) * 21);
      if (n > 0 && inZone) { G.tok = { x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.tok) return false; G.tok.x = x; G.tok.y = y; return true; },
    release(G, x, y) {
      if (!G.tok) return;
      const { r, s } = G; G.tok = null;
      const done = isAdd(r) ? y < G.src.y - 8 : Math.hypot(x - G.cx, y - G.cy) > 78;
      if (!done || s.k >= maxK(r)) return;
      const a = alt(r, s.k + 1);
      if (a < LO || a > HI) return;
      s.k++; G.touch();
    },
    // La mano muestra el gesto de esta ronda: del tarro al canasto, o del canasto hacia afuera.
    demo(G) {
      const { p, C, r, cx, cy } = G, what = isG(r) ? 'un globo' : 'un saco', carry = (x, y) => (isG(r) ? balloon : bag)(p, C, x, y - 4, isG(r) ? 24 : 18);
      if (isAdd(r)) return { from: { x: G.src.x + G.src.w / 2, y: G.src.y + G.src.h / 2 }, to: { x: cx, y: cy - 6 }, text: `Arrastra ${what} hasta el canasto`, ty: G.H - 106, carry };
      const from = { x: cx - 12, y: isG(r) ? cy - 44 : cy + 30 };
      return { from, to: { x: Math.max(44, cx - 112), y: from.y + (isG(r) ? -40 : 56) }, text: `Arrastra ${what} lejos del canasto para soltarlo`, ty: G.H - 106, carry };
    },
    peek: G => ({ src: G.src, craft: { x: G.cx, y: G.cy }, reset: G.reset, need: need(G.r) }),
  });
  return Object.assign(game, { alt, need, expr, maxK, start });
})();
