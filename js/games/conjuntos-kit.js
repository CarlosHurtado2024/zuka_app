// Piezas de dibujo del mundo «Teoría de Conjuntos» (spec 2026-11-26-conjuntos-lamina). Todos los juegos del mundo
// usan el lenguaje de su lámina: el universo es un panel, cada conjunto una membrana (curva con brillo y relleno
// translúcido), cada elemento una píldora, y abajo una franja con la escritura formal en letra de libro.
// Va después de kit.js (usa fitText, drawTile, inkOn).
const SK = (() => {
  const SERIF = 'serif';   // una sola familia: p5 pone comillas a los nombres con espacios
  const al = (p, col, a) => { const c = p.color(col); c.setAlpha(a); return c; };
  // Colores de los conjuntos A, B y C: `line` para la curva y el relleno, `ink` para escribir su nombre.
  const sets = C => [{ line: C.mint, ink: C.Q }, { line: C.coral, ink: C.I }, { line: C.sky, ink: C.Z }];
  // Valor dibujado que se acerca suave a su destino (solo para dibujar; la lógica usa el valor real).
  const ease = (o, k, to, dt, sp = 13) => { const v = o[k] ?? to; return (o[k] = Math.abs(to - v) < 0.4 ? to : v + (to - v) * Math.min(1, dt * sp)); };
  const dash = (p, on) => p.drawingContext.setLineDash?.(on ? [5, 4] : []);

  // Texto en cursiva de libro (nombres de conjuntos, notación corta). Deja puesta la letra del juego.
  function serif(p, txt, x, y, size, col, maxW) {
    p.noStroke(); p.fill(col); p.textFont(SERIF); p.textStyle(p.BOLDITALIC); p.textAlign(p.CENTER, p.CENTER); p.textSize(size);
    if (maxW) while (size > 9 && p.textWidth(txt) > maxW) p.textSize(--size);
    p.text(txt, x, y);
    p.textFont('system-ui'); p.textStyle(p.BOLD);
  }
  // Panel (el universo, una pizarra): tarjeta translúcida con borde fino. o = { col, r, u (rótulo U), alpha }.
  function panel(p, C, b, o = {}) {
    p.stroke(o.col ?? C.line); p.strokeWeight(o.col ? 1.6 : 1); p.fill(al(p, C.card, o.alpha ?? 225)); p.rect(b.x, b.y, b.w, b.h, o.r ?? 14);
    if (o.u) serif(p, 'U', b.x + 14, b.y + 14, 14, C.mute);
  }
  // Membrana: la curva de un conjunto, con brillo por fuera y relleno translúcido. o = { fill (alfa), w, dash }.
  function membrane(p, C, cx, cy, rx, ry, col, o = {}) {
    p.noFill(); p.stroke(al(p, col, 36)); p.strokeWeight(9); p.ellipse(cx, cy, 2 * rx, 2 * ry);
    p.fill(al(p, col, o.fill ?? 34)); p.stroke(col); p.strokeWeight(o.w ?? 2);
    if (o.dash) dash(p, true);
    p.ellipse(cx, cy, 2 * rx, 2 * ry);
    dash(p, false); p.noStroke();
  }
  // Nombre de un conjunto: letra en cursiva dentro de un disco con el borde de su color.
  function tag(p, C, txt, x, y, set, size = 15) {
    p.stroke(set.line); p.strokeWeight(1.5); p.fill(C.card); p.circle(x, y, size + 13);
    serif(p, txt, x, y, size, set.ink);
  }
  // Píldora de un elemento. o = { state: 'idle' | 'on' | 'ok' | 'bad' | 'ghost', col (color del conjunto), sel, k, size, ink }.
  function chip(p, C, b, txt, o = {}) {
    const k = o.k ?? 1, w = b.w * k, h = b.h * k, x = b.x + (b.w - w) / 2, y = b.y + (b.h - h) / 2, r = Math.min(h / 2, o.r ?? 99);
    const st = o.state ?? 'idle', col = st === 'bad' ? C.bad : st === 'ok' ? C.ok : o.col ?? C.mint;
    if (st === 'ghost') { p.noFill(); p.stroke(C.line); p.strokeWeight(1.2); dash(p, true); p.rect(x, y, w, h, r); dash(p, false); p.noStroke(); return; }
    if (o.sel) { p.noFill(); p.stroke(C.brand); p.strokeWeight(2); p.rect(x - 3, y - 3, w + 6, h + 8, r + 3); }
    p.noStroke(); p.fill(st === 'idle' ? C.line : al(p, col, 150)); p.rect(x, y + 2, w, h, r);
    p.fill(C.halo); p.rect(x, y, w, h, r);
    if (st !== 'idle') { p.fill(al(p, col, 56)); p.rect(x, y, w, h, r); }
    p.noFill(); p.stroke(st === 'idle' ? C.line : col); p.strokeWeight(st === 'idle' ? 1 : 1.6); p.rect(x, y, w, h, r);
    p.noStroke();
    if (txt != null && txt !== '') {
      p.fill(o.ink ?? C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
      fitText(p, String(txt), b.x + b.w / 2, b.y + b.h / 2 + 1, w - 12, o.size ?? 13, h - 4);
    }
  }
  // Franja de escritura formal: tarjeta con barra de color, rótulo pequeño y la fórmula (TeX entre $…$).
  // o = { kicker, raw (rótulo sin pasar a mayúsculas), col, ink, size, right (ancho reservado a la derecha) }.
  function formal(p, C, b, tex, o = {}) {
    panel(p, C, b, { r: 12 });
    p.noStroke(); p.fill(o.col ?? C.mint); p.rect(b.x + 1, b.y + 9, 3, b.h - 18, 2);
    const w = b.w - 26 - (o.right ?? 0), cx = b.x + 16 + w / 2;
    if (o.kicker) {
      const ctx = p.drawingContext;
      p.fill(C.mute); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.CENTER); p.textSize(10);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
      p.text(o.raw ? String(o.kicker) : String(o.kicker).toUpperCase(), b.x + 14, b.y + 13);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    }
    p.fill(o.ink ?? C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
    fitText(p, tex, cx, b.y + b.h / 2 + (o.kicker ? 8 : 1), w, o.size ?? 19, b.h - (o.kicker ? 24 : 10));
  }
  // Rótulo del enunciado: barrita del color del mundo y texto en versalitas.
  function kicker(p, C, txt, x, y) { drawKicker(p, C, txt, x, y, { bar: C.mint, col: C.Q }); p.noStroke(); }
  // Zonas de un Venn de círculos (máscara de bits: 1 = A, 2 = B, 4 = C; 0 = fuera de todos), recortadas con su borde
  // exacto. o = { col, alpha } rellena; con o.hatch, raya en diagonal (marca una zona sin taparla). Se pinta con el
  // contexto del lienzo y no con p.fill: al salir del recorte el contexto vuelve a su color anterior, y p5, que recuerda
  // el último relleno, se saltaría el siguiente p.fill del mismo color.
  function zones(p, box, circles, masks, o = {}) {
    const css = al(p, o.col, o.alpha ?? 255).toString();
    const ctx = p.drawingContext;
    for (const m of masks) {
      ctx.save(); ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(box.x, box.y, box.w, box.h, 14); else ctx.rect(box.x, box.y, box.w, box.h);
      ctx.clip();
      circles.forEach((c, k) => {
        const inn = !!(m & (1 << k));
        ctx.beginPath(); if (!inn) ctx.rect(box.x, box.y, box.w, box.h);
        ctx.moveTo(c.x + c.r, c.y); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.clip(inn ? 'nonzero' : 'evenodd');
      });
      if (o.hatch) {
        ctx.strokeStyle = css; ctx.lineWidth = 1.6; ctx.setLineDash([]); ctx.beginPath();
        for (let i = -box.h; i < box.w; i += o.gap ?? 9) { ctx.moveTo(box.x + i, box.y + box.h); ctx.lineTo(box.x + i + box.h, box.y); }
        ctx.stroke();
      } else { ctx.fillStyle = css; ctx.fillRect(box.x, box.y, box.w, box.h); }
      ctx.restore();
    }
  }
  // Zona de un punto en un Venn de círculos (máscara de bits).
  const maskAt = (circles, x, y) => circles.reduce((m, c, k) => m | (Math.hypot(x - c.x, y - c.y) < c.r ? 1 << k : 0), 0);
  // Dos círculos cruzados dentro de una caja.
  function venn2(box, k = 0.6, dy = 0) {
    const r = Math.min(box.w / (2 + 2 * k + 0.5), box.h / 2.35), cx = box.x + box.w / 2, cy = box.y + box.h / 2 + dy;
    return [{ x: cx - r * k, y: cy, r }, { x: cx + r * k, y: cy, r }];
  }
  // Lista por extensión en TeX: setTex('V', ['a', 'e']) → «$V = \{\text{a}, \text{e}\}$»; vacía → llaves vacías.
  const setTex = (name, xs) => `$${name} = \\{${xs.length ? xs.map(x => `\\text{${x}}`).join(', ') : '\\ \\ '}\\}$`;

  return { al, sets, ease, serif, panel, membrane, tag, chip, formal, kicker, zones, maskAt, venn2, setTex };
})();
