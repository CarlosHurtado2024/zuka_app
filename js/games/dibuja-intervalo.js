// Dibuja el intervalo (lección 1.1): dos asas sobre la recta que se arrastran (ajuste a enteros);
// tocar un asa alterna extremo lleno (incluido) / vacío (excluido). El conjunto se muestra en notación.
// params = { min, max, a, b, aClosed, bClosed, set (texto) }
// state = { left, right, leftClosed, rightClosed }  (las asas pueden cruzarse; se normalizan al calificar)

GAMES['dibuja-intervalo'] = (() => {
  const norm = s => (s.left <= s.right
    ? s
    : { left: s.right, right: s.left, leftClosed: s.rightClosed, rightClosed: s.leftClosed });

  function grade(state, params) {
    const s = norm(state);
    const ok = s.left === params.a && s.right === params.b && s.leftClosed === params.aClosed && s.rightClosed === params.bClosed;
    const br = (c, side) => (side === 'l' ? (c ? '[' : '(') : (c ? ']' : ')'));
    return { ok, solution: `$${br(params.aClosed, 'l')}${params.a},\\ ${params.b}${br(params.bClosed, 'r')}$` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { left: params.min + 1, right: params.max - 1, leftClosed: true, rightClosed: true };
    let locked = false, map = null, lineY = 0, W = 0, drag = null, moved = false;
    const R = 13;

    function layout(w, h) { W = w; lineY = h * 0.55; map = lineMap(params.min, params.max, 26, w - 26); }
    const handleX = k => map.toPx(st[k]);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => {
        p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h);
        // Las asas ya forman un intervalo válido: se puede comprobar desde que el lienzo existe.
        api.ready(true);
      };
      p.onResize = () => layout(size.w, size.h);

      function handle(x, closed, color) {
        p.stroke(color); p.strokeWeight(3); p.fill(closed ? color : C.bg); p.circle(x, lineY, R * 2);
      }

      p.draw = () => {
        p.background(C.bg);
        const lo = Math.min(st.left, st.right), hi = Math.max(st.left, st.right);
        // Enunciado y notación que se va armando.
        drawKicker(p, C, 'Dibuja el conjunto', W / 2, 16, { center: true });
        p.noStroke(); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD);
        p.fill(C.ink); p.textSize(22); p.text(params.set, W / 2, 28);
        const s = norm(st), br = (c, side) => (side === 'l' ? (c ? '[' : '(') : (c ? ']' : ')'));
        drawPill(p, C, `${br(s.leftClosed, 'l')}${s.left}, ${s.right}${br(s.rightClosed, 'r')}`.replace(/-/g, '−'), W / 2, 78, C.sun, 18);
        // Segmento sombreado y recta.
        p.noStroke(); p.fill(C.sun + '73'); p.rect(map.toPx(lo), lineY - 12, map.toPx(hi) - map.toPx(lo), 24, 6);
        p.stroke(C.ink); p.strokeWeight(3); p.line(map.toPx(params.min) - 6, lineY, map.toPx(params.max) + 6, lineY);
        p.textAlign(p.CENTER, p.TOP); p.textSize(13); p.textStyle(p.BOLD);
        for (let v = params.min; v <= params.max; v++) {
          p.stroke(v === 0 ? C.sun : C.ink); p.strokeWeight(2); p.line(map.toPx(v), lineY - 7, map.toPx(v), lineY + 7);
          p.noStroke(); p.fill(v === 0 ? C.N : v < 0 ? C.I : C.ink); p.text(String(v).replace('-', '−'), map.toPx(v), lineY + 14);
        }
        if (locked) {
          // La respuesta correcta en verde, bajo las asas del estudiante.
          p.stroke(C.ok); p.strokeWeight(5); p.line(map.toPx(params.a), lineY + 40, map.toPx(params.b), lineY + 40);
          p.stroke(C.ok); p.strokeWeight(3); p.fill(params.aClosed ? C.ok : C.bg); p.circle(map.toPx(params.a), lineY + 40, 18);
          p.fill(params.bClosed ? C.ok : C.bg); p.circle(map.toPx(params.b), lineY + 40, 18);
        }
        p.stroke(C.brand); p.strokeWeight(5); p.line(map.toPx(lo), lineY, map.toPx(hi), lineY);
        const good = grade(st, params).ok;
        handle(handleX('left'), st.leftClosed, locked ? (good ? C.ok : C.bad) : (drag === 'left' ? C.ink : C.brand));
        handle(handleX('right'), st.rightClosed, locked ? (good ? C.ok : C.bad) : (drag === 'right' ? C.ink : C.brand));
        p.noStroke(); p.fill(C.mute); p.textSize(12); p.textAlign(p.CENTER, p.TOP);
        p.text('Arrastra las asas · toca una para llenarla o vaciarla', W / 2, lineY + 60 + (locked ? 10 : 0));
      };

      p.mousePressed = () => {
        if (locked) return;
        const k = ['left', 'right'].sort((a, b) => Math.abs(p.mouseX - handleX(a)) - Math.abs(p.mouseX - handleX(b)))
          .find(k => Math.hypot(p.mouseX - handleX(k), p.mouseY - lineY) < R + 10);
        if (k) { drag = k; moved = false; return false; }
      };
      p.mouseDragged = () => {
        if (!drag) return;
        const v = Math.round(Math.max(params.min, Math.min(params.max, map.toVal(p.mouseX))));
        if (v !== st[drag]) { st[drag] = v; moved = true; }
        return false;
      };
      p.mouseReleased = () => {
        if (!drag) return;
        if (!moved) { st[drag + 'Closed'] = !st[drag + 'Closed']; api.sfx?.tap?.(); }
        drag = null;
        return false;
      };
    }, 0.8);

    return {
      loaded: m.ready,
      getState: () => ({ ...st }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
