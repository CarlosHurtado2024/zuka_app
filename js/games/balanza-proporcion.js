// Balanza de la proporción (lección 1.2): en a/b = x/d, los productos cruzados a·d y b·x van en
// los platos; deslizando x la balanza se inclina en vivo y queda horizontal cuando a·d = b·x.
// params = { a, b, d, min, max }   state = { x: entero }

GAMES['balanza-proporcion'] = (() => {
  function grade(state, params) {
    const ok = params.a * params.d === params.b * state.x;
    const x = (params.a * params.d) / params.b;
    return { ok, solution: `$\\dfrac{${params.a}}{${params.b}} = \\dfrac{x}{${params.d}} \\Rightarrow ${params.b}x = ${params.a}\\cdot${params.d} \\Rightarrow x = ${x}$` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { x: Math.round((params.min + params.max) / 2) };
    let locked = false, W = 0, H = 0, map = null, slY = 0, drag = false, tilt = 0;

    function layout(w, h) { W = w; H = h; slY = h * 0.86; map = lineMap(params.min, params.max, 30, w - 30); }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function pan(cx, cy, label, value, color) {
        p.stroke(color); p.strokeWeight(3); p.noFill(); p.arc(cx, cy, 70, 30, 0, Math.PI);
        p.noStroke(); p.fill(color); p.textAlign(p.CENTER, p.BOTTOM); p.textStyle(p.BOLD); p.textSize(20);
        p.text(value, cx, cy - 4);
        p.fill(C.mute); p.textSize(12); p.textAlign(p.CENTER, p.TOP); p.text(label, cx, cy + 20);
      }

      p.draw = () => {
        p.background(C.bg);
        const L = params.a * params.d, R = params.b * st.x;
        const target = p.constrain((R - L) / Math.max(L, 1), -1, 1) * 0.28;
        tilt = p.lerp(tilt, target, 0.15);
        const bal = Math.abs(L - R) < 1e-9;
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(13);
        p.text('Encuentra x para equilibrar la proporción', W / 2, 10);
        p.fill(C.ink); p.textSize(24); p.text(`${params.a}/${params.b} = x/${params.d}`, W / 2, 28);
        // Balanza: pivote, brazo inclinado y dos platos.
        const px = W / 2, py = H * 0.6, arm = W * 0.36;
        const col = locked ? (bal ? C.ok : C.bad) : bal ? C.ok : C.brand;
        p.stroke(C.line); p.strokeWeight(6); p.line(px, py, px, py + 46);
        p.noStroke(); p.fill(C.line); p.rect(px - 40, py + 46, 80, 8, 4);
        p.push(); p.translate(px, py); p.rotate(tilt);
        p.stroke(col); p.strokeWeight(5); p.line(-arm, 0, arm, 0);
        p.stroke(C.mute); p.strokeWeight(2); p.line(-arm, 0, -arm, 40); p.line(arm, 0, arm, 40);
        pan(-arm, 40, `${params.a} · ${params.d}`, L, C.R);
        pan(arm, 40, `${params.b} · x`, R, col);
        p.pop();
        p.noStroke(); p.fill(col); p.circle(px, py, 14);
        p.textAlign(p.CENTER, p.CENTER); p.textSize(14);
        p.text(bal ? '¡Equilibrada! a·d = b·x' : L > R ? 'Pesa más la izquierda: sube x' : 'Pesa más la derecha: baja x', W / 2, H * 0.19 + 10);
        // Deslizador de x.
        p.stroke(C.line); p.strokeWeight(4); p.line(map.toPx(params.min), slY, map.toPx(params.max), slY);
        p.stroke(col); p.strokeWeight(3); p.fill(C.card); p.circle(map.toPx(st.x), slY, 28);
        p.noStroke(); p.fill(C.ink); p.textSize(13); p.text(st.x, map.toPx(st.x), slY + 1);
        p.fill(C.mute); p.textSize(12); p.textAlign(p.LEFT, p.TOP); p.text(params.min, map.toPx(params.min) - 4, slY + 18);
        p.textAlign(p.RIGHT, p.TOP); p.text(params.max, map.toPx(params.max) + 4, slY + 18);
        p.textAlign(p.CENTER, p.BOTTOM); p.text('x', W / 2, slY - 20);
      };

      p.mousePressed = () => {
        if (locked) return;
        if (Math.abs(p.mouseY - slY) < 26) { drag = true; setX(p.mouseX); return false; }
      };
      const setX = mx => {
        const v = Math.round(p.constrain(map.toVal(mx), params.min, params.max));
        if (v !== st.x) { st.x = v; api.sfx?.tap?.(); }
        api.ready(true);
      };
      p.mouseDragged = () => { if (drag) { setX(p.mouseX); return false; } };
      p.mouseReleased = () => { if (drag) { drag = false; return false; } };
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
