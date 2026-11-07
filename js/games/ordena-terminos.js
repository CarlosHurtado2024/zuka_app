// Ordena los términos (lección 1.5): una expresión (en KaTeX, fuera del lienzo) y una fila de
// cajas vacías unidas por «+»; se arrastran fichas (con distractores) a las cajas en el orden
// de la expansión. Sirve para desplegar una sigma y para armar una cadena telescópica.
// params = { tex, chips: [etiqueta], order: [índices correctos], result }   state = { boxes: [índice | null] }

GAMES['ordena-terminos'] = (() => {
  // `sep` une las cajas: '+' para desplegar una suma (por defecto) o '=' para encadenar pasos.
  function grade(state, params) {
    const sep = params.sep || '+';
    const ok = params.order.every((j, i) => state.boxes[i] === j) && state.boxes.length === params.order.length;
    return { ok, solution: `${params.order.map(j => params.chips[j]).join(` ${sep} `)}${sep === '+' ? ` = ${params.result}` : ''}` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const n = params.order.length;
    const st = { boxes: Array.from({ length: n }, () => null) };
    let locked = false, W = 0, H = 0, boxes = [], tray = [], drag = null, caption = null;

    // La expresión va en HTML (KaTeX) arriba del lienzo.
    caption = document.createElement('div');
    caption.style.cssText = 'text-align:center;padding:4px 0 8px;font-size:18px';
    caption.innerHTML = window.tex ? tex(`$${params.tex}$`) : params.tex;
    host.appendChild(caption);

    function layout(w, h) {
      W = w; H = h;
      // Con etiquetas largas (pasos de una simplificación) van dos por fila y más anchas.
      const long = params.chips.some(c => c.length > 12), maxW = long ? 150 : 96;
      const cols = Math.min(n, long ? 2 : 3), rows = Math.ceil(n / cols), bw = Math.min(maxW, (w - 34 - (cols - 1) * 22) / cols), gap = (w - 34 - cols * bw) / Math.max(1, cols - 1);
      const top = 20, left = n > cols ? 22 : 12;
      boxes = Array.from({ length: n }, (_, i) => ({ x: left + (i % cols) * (bw + gap), y: top + Math.floor(i / cols) * 54, w: bw, h: 40 }));
      const tcols = Math.min(params.chips.length, long ? 2 : 3), tw = Math.min(maxW, (w - 24 - (tcols - 1) * 8) / tcols), tgap = (w - 24 - tcols * tw) / Math.max(1, tcols - 1), trows = Math.ceil(params.chips.length / tcols);
      tray = params.chips.map((_, j) => ({ x: 12 + (j % tcols) * (tw + tgap), y: h - 30 - trows * 42 + Math.floor(j / tcols) * 42, w: tw, h: 34 }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const placedAt = j => st.boxes.indexOf(j);
    const ready = () => api.ready(st.boxes.every(j => j !== null));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function chip(b, label, col, fill = C.card, dashed = false) {
        if (dashed) p.drawingContext.setLineDash([5, 4]);
        p.stroke(col); p.strokeWeight(2); p.fill(fill); p.rect(b.x, b.y, b.w, b.h, 9);
        p.drawingContext.setLineDash([]);
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(label.length > 18 ? 9 : label.length > 7 ? 11 : 14);
        p.text(label, b.x + b.w / 2, b.y + b.h / 2);
      }

      const sep = params.sep || '+';
      p.draw = () => {
        p.background(C.bg);
        boxes.forEach((b, i) => {
          const j = st.boxes[i], good = j !== null && j === params.order[i];
          const col = locked ? (good ? C.ok : C.bad) : j !== null ? C.brand : C.line;
          if (j === null) chip(b, '', col, C.bg, true); else chip(b, params.chips[j], col);
          // El «+» va entre cajas; si la siguiente cae en otra fila, va al inicio de esa fila.
          if (i < n - 1) { p.noStroke(); p.fill(C.mute); p.textSize(16); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); const nb = boxes[i + 1]; if (nb.y === b.y) p.text(sep, (b.x + b.w + nb.x) / 2, b.y + b.h / 2); else p.text(sep, nb.x - 11, nb.y + nb.h / 2); }
          if (locked && !good) { p.noStroke(); p.fill(C.ok); p.textSize(11); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.TOP); p.text(`→ ${params.chips[params.order[i]]}`, b.x + b.w / 2, b.y + b.h + 2); }
        });
        const last = boxes[n - 1];
        p.noStroke(); p.fill(locked ? (grade(st, params).ok ? C.ok : C.mute) : C.mute); p.textSize(14); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.CENTER);
        if (sep === '+') p.text(locked ? `= ${params.result}` : '= ?', last.x + last.w + 10, last.y + last.h / 2);
        if (!locked) params.chips.forEach((v, j) => { if (placedAt(j) < 0 && !(drag && drag.j === j)) chip(tray[j], v, C.Z); });   // bloqueado, la bandeja sobra
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked ? (grade(st, params).ok ? '¡En orden!' : 'Mira los términos en verde') : `Arrastra los términos en orden · sobran ${params.chips.length - n}`, 12, H - 22, W - 24, 20);
        if (drag) chip({ x: p.mouseX - tray[0].w / 2, y: p.mouseY - 17, w: tray[0].w, h: 34 }, params.chips[drag.j], C.brand);
      };

      p.mousePressed = () => {
        if (locked) return;
        const i = boxes.findIndex((b, i) => st.boxes[i] !== null && inside(b, p.mouseX, p.mouseY));
        if (i >= 0) { drag = { j: st.boxes[i] }; st.boxes[i] = null; ready(); return false; }
        const j = tray.findIndex((b, j) => placedAt(j) < 0 && inside(b, p.mouseX, p.mouseY));
        if (j >= 0) { drag = { j }; return false; }
      };
      p.mouseDragged = () => (drag ? false : undefined);
      p.mouseReleased = () => {
        if (!drag) return;
        const i = boxes.findIndex(b => inside({ x: b.x - 6, y: b.y - 8, w: b.w + 12, h: b.h + 16 }, p.mouseX, p.mouseY));
        if (i >= 0) { st.boxes[i] = drag.j; api.sfx?.tap?.(); }
        drag = null;
        ready();
        return false;
      };
    }, 1.0);

    return {
      loaded: m.ready,
      getState: () => ({ boxes: [...st.boxes] }),
      lock() { locked = true; drag = null; },
      destroy: () => { caption.remove(); m.remove(); },
    };
  }

  return { grade, create };
})();
