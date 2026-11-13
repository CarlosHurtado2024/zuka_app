// Grafica la relación (lección 1.2): en una cuadrícula hay un punto dado fijo; se arrastran en
// vertical los puntos de otras x para que la relación sea directa (y = kx) o inversa (xy = k).
// Al bloquear se dibuja la recta o la hipérbola correcta.
// params = { kind: 'directa'|'inversa', k, given: [[x, y]], xs: number[], tol, xmax, ymax }
// state = { ys: [número | null] }  (altura del punto sobre cada x de xs)

GAMES['grafica-relacion'] = (() => {
  const f = (params, x) => (params.kind === 'directa' ? params.k * x : params.k / x);

  function grade(state, params) {
    const ok = params.xs.every((x, i) => state.ys[i] !== null && Math.abs(state.ys[i] - f(params, x)) <= params.tol);
    const rule = params.kind === 'directa' ? `y = ${params.k}x` : `xy = ${params.k}`;
    return { ok, solution: `$${rule}$: ${params.xs.map(x => `$(${x}, ${+f(params, x).toFixed(2)})$`).join(', ')}` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const ys = params.xs.map(() => null);
    let locked = false, W = 0, H = 0, mx = null, my = null, drag = -1;
    const STEP = 0.25;

    function layout(w, h) {
      W = w; H = h;
      mx = lineMap(0, params.xmax, 40, w - 16);
      my = lineMap(0, params.ymax, h - 34, 44);
    }
    const px = (x, y) => [mx.toPx(x), my.toPx(y)];
    // Un punto sin colocar descansa en el eje x; así se ve dónde falta.
    const yOf = i => (ys[i] === null ? 0 : ys[i]);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(13);
        drawKicker(p, C, params.kind === 'directa' ? 'Mueve los puntos: que sea directa' : 'Mueve los puntos: que sea inversa', W / 2, 14, { center: true });
        p.noStroke(); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD);
        p.fill(C.ink); p.textSize(12);
        p.text(params.kind === 'directa' ? 'y/x constante · recta por el origen' : 'x·y constante · si x se duplica, y se reduce a la mitad', W / 2, 25);
        // Cuadrícula y ejes.
        for (let x = 0; x <= params.xmax; x++) { p.stroke(x ? C.line + '66' : C.mute); p.strokeWeight(x ? 1 : 2); p.line(...px(x, 0), ...px(x, params.ymax)); }
        for (let y = 0; y <= params.ymax; y++) { p.stroke(y ? C.line + '66' : C.mute); p.strokeWeight(y ? 1 : 2); p.line(...px(0, y), ...px(params.xmax, y)); }
        p.noStroke(); p.fill(C.mute); p.textSize(10); p.textAlign(p.CENTER, p.TOP);
        for (let x = 0; x <= params.xmax; x += 2) p.text(x, mx.toPx(x), my.toPx(0) + 5);
        p.textAlign(p.RIGHT, p.CENTER);
        for (let y = 0; y <= params.ymax; y += 2) p.text(y, mx.toPx(0) - 6, my.toPx(y));
        if (locked) {
          // Curva correcta.
          p.noFill(); p.stroke(C.ok); p.strokeWeight(2.5); p.beginShape();
          for (let x = params.kind === 'directa' ? 0 : params.k / params.ymax; x <= params.xmax; x += 0.05) { const y = f(params, x); if (y <= params.ymax) p.vertex(...px(x, y)); }
          p.endShape();
        }
        // Punto dado (fijo) y puntos movibles.
        params.given.forEach(([x, y]) => {
          drawDot(p, C, ...px(x, y), 14, C.sun);
          p.fill(C.ink); p.textSize(11); p.textAlign(p.LEFT, p.BOTTOM); p.text(`(${x}, ${y})`, mx.toPx(x) + 10, my.toPx(y) - 6);
        });
        params.xs.forEach((x, i) => {
          const [cx, cy] = px(x, yOf(i));
          const good = ys[i] !== null && Math.abs(ys[i] - f(params, x)) <= params.tol;
          const col = locked ? (good ? C.ok : C.bad) : (i === drag ? C.ink : ys[i] === null ? C.mute : C.brand);
          p.stroke(col); p.strokeWeight(1.5); p.line(cx, my.toPx(0), cx, cy);
          p.noStroke(); p.fill(col); p.circle(cx, cy, 18);
          p.fill(C.bg); p.textSize(10); p.textAlign(p.CENTER, p.CENTER); p.text(x, cx, cy + 1);
          if (ys[i] !== null) { p.fill(C.ink); p.textSize(11); p.textAlign(p.LEFT, p.BOTTOM); p.text(`(${x}, ${ys[i]})`, cx + 10, cy - 6); }
        });
      };

      p.mousePressed = () => {
        if (locked) return;
        drag = nearest(params.xs.map((x, i) => ({ x: mx.toPx(x), y: my.toPx(yOf(i)) })), p.mouseX, p.mouseY, 22);
        if (drag >= 0) { api.sfx?.tap?.(); return false; }
      };
      p.mouseDragged = () => {
        if (drag < 0) return;
        ys[drag] = Math.round(p.constrain(my.toVal(p.mouseY), 0, params.ymax) / STEP) * STEP;
        return false;
      };
      p.mouseReleased = () => {
        if (drag < 0) return;
        drag = -1;
        api.ready(ys.every(y => y !== null));
        return false;
      };
    }, 1.0);

    return {
      loaded: m.ready,
      getState: () => ({ ys: [...ys] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
