// Cuadrado de la media (lección 1.2): un rectángulo w × h a escala y un cuadrado que crece al
// arrastrar su esquina. Correcto cuando ambas áreas coinciden: el lado es la media proporcional √(w·h).
// params = { w, h, tol }   state = { side: número }

GAMES['cuadrado-media'] = (() => {
  function grade(state, params) {
    const side = Math.sqrt(params.w * params.h);
    const ok = Math.abs(state.side - side) <= params.tol;
    return { ok, solution: `$\\dfrac{${params.w}}{x} = \\dfrac{x}{${params.h}} \\Rightarrow x^2 = ${params.w * params.h} \\Rightarrow x = ${+side.toFixed(2)}$` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { side: Math.min(params.w, params.h) };
    let locked = false, W = 0, H = 0, scale = 1, rect = null, sq = null, drag = false;
    const target = Math.sqrt(params.w * params.h);

    function layout(w, h) {
      W = w; H = h;
      // Escala: el rectángulo (de pie) y el cuadrado máximo caben uno al lado del otro.
      const maxSide = Math.max(params.h, target * 1.3);
      scale = Math.min((h - 90) / maxSide, (w - 48) / (params.w + target * 1.3 + 24));
      rect = { x: 16, y: h - 36 };
      sq = { x: 16 + params.w * scale + 28, y: h - 36 };
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);
      const corner = () => ({ x: sq.x + st.side * scale, y: sq.y - st.side * scale });

      p.draw = () => {
        p.background(C.bg);
        const area = st.side * st.side, want = params.w * params.h;
        const good = Math.abs(st.side - target) <= params.tol;
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(13);
        drawKicker(p, C, 'Iguala el área con un cuadrado', W / 2, 14, { center: true });
        p.noStroke(); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD);
        p.fill(C.ink); p.textSize(18); p.text(`${params.w}/x = x/${params.h}`, W / 2, 26);
        // Rectángulo w × h.
        p.noStroke(); p.fill(C.sky);   // el rectángulo, relleno
        p.rect(rect.x, rect.y - params.h * scale, params.w * scale, params.h * scale, 4);
        p.noStroke(); p.fill(C.R); p.textSize(12); p.textAlign(p.CENTER, p.TOP);
        p.text(`${params.w} × ${params.h}`, rect.x + params.w * scale / 2, rect.y + 6);
        p.text(`área ${want}`, rect.x + params.w * scale / 2, rect.y + 20);
        // Cuadrado x × x.
        const col = locked ? (good ? C.ok : C.bad) : good ? C.ok : C.brand;
        p.stroke(col); p.strokeWeight(2.5); p.fill(p.red(p.color(col)), p.green(p.color(col)), p.blue(p.color(col)), 120);
        p.rect(sq.x, sq.y - st.side * scale, st.side * scale, st.side * scale, 4);
        if (locked) { p.noFill(); p.stroke(C.ok); p.strokeWeight(2); p.drawingContext.setLineDash([5, 4]); p.rect(sq.x, sq.y - target * scale, target * scale, target * scale, 4); p.drawingContext.setLineDash([]); }
        const c = corner();
        drawDot(p, C, c.x, c.y, 20, drag ? C.ink : col);
        p.fill(C.bg); p.textAlign(p.CENTER, p.CENTER); p.textSize(12); p.text('⤡', c.x, c.y);
        p.fill(col); p.textSize(12); p.textAlign(p.CENTER, p.TOP);
        p.text(`x = ${st.side.toFixed(1)}`, sq.x + Math.max(st.side * scale / 2, 30), sq.y + 6);
        p.text(`área ${area.toFixed(1)}`, sq.x + Math.max(st.side * scale / 2, 30), sq.y + 20);
        p.textAlign(p.CENTER, p.CENTER); p.textSize(14); p.fill(col);
        drawPill(p, C, good ? '¡Las áreas coinciden!' : area < want ? 'Al cuadrado le falta área' : 'Al cuadrado le sobra área', W / 2, 62, col, 13);
      };

      p.mousePressed = () => {
        if (locked) return;
        const c = corner();
        if (Math.hypot(p.mouseX - c.x, p.mouseY - c.y) < 26 || (p.mouseX > sq.x && p.mouseX < c.x && p.mouseY < sq.y && p.mouseY > c.y)) { drag = true; api.sfx?.tap?.(); return false; }
      };
      p.mouseDragged = () => {
        if (!drag) return;
        // El lado sigue a la esquina (promedio de ambas direcciones) con pasos de 0.1.
        const s = ((p.mouseX - sq.x) + (sq.y - p.mouseY)) / 2 / scale;
        st.side = Math.round(p.constrain(s, 1, (H - 90) / scale) * 10) / 10;
        return false;
      };
      p.mouseReleased = () => { if (drag) { drag = false; api.ready(true); return false; } };
    }, 0.95);

    return {
      loaded: m.ready,
      getState: () => ({ ...st }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
