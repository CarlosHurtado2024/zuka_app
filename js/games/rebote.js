// Sube y baja (lección 1.3, ejercicio 1.6): un precio baja un 10 %; se arrastra el «% de subida»
// y la barra responde en vivo. Hay que volver exactamente al precio original: la subida se calcula
// sobre el precio rebajado, así que no basta con un 10 %.
// params = { base, drop, max, step, tol }   state = { up: % | null }

GAMES['rebote'] = (() => {
  const answerOf = p => (100 * p.drop) / (100 - p.drop);
  const fmt1 = n => String(+n.toFixed(1)).replace('.', ',');
  const tex1 = n => String(+n.toFixed(1)).replace('.', '{,}');

  function grade(state, params) {
    const ok = state.up !== null && Math.abs(state.up - answerOf(params)) <= params.tol;
    return { ok, solution: `$\\dfrac{${params.drop}}{${100 - params.drop}} = ${tex1(answerOf(params))}\\%$: se sube sobre ${100 - params.drop}, no sobre ${params.base}` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { up: null };
    const low = params.base * (1 - params.drop / 100);
    let locked = false, W = 0, H = 0, bars = [], rail = null, drag = false;

    function layout(w, h) {
      W = w; H = h;
      const bw = Math.min(64, (w * 0.6) / 3 - 10), x0 = 24;
      bars = [0, 1, 2].map(i => ({ x: x0 + i * (bw + 14), w: bw }));
      rail = { x: w - 56, y: 90, h: h * 0.58 };
    }
    const top = 90, floor = () => top + rail.h;
    const yOf = v => floor() - (v / (params.base * 1.15)) * rail.h;
    const upOf = () => (st.up === null ? 0 : st.up);
    function setUp(y) {
      const v = ((rail.y + rail.h - y) / rail.h) * params.max;
      st.up = Math.max(0, Math.min(params.max, Math.round(v / params.step) * params.step));
      st.up = +st.up.toFixed(1);
      api.ready(true);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function bar(b, v, col, name, extra) {
        p.noStroke(); p.fill(col); p.rect(b.x, yOf(v), b.w, floor() - yOf(v), 6, 6, 0, 0);
        p.fill(C.ink); p.textAlign(p.CENTER, p.BOTTOM); p.textStyle(p.BOLD); p.textSize(13); p.text(fmt1(v), b.x + b.w / 2, yOf(v) - 4);
        p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textSize(10); p.textStyle(p.NORMAL); p.text(name, b.x + b.w / 2, floor() + 6);
        if (extra) p.text(extra, b.x + b.w / 2, floor() + 19);
      }

      p.draw = () => {
        p.background(C.bg);
        const now = low * (1 + upOf() / 100), ans = answerOf(params);
        const good = st.up !== null && Math.abs(st.up - ans) <= params.tol;
        const col = locked ? (good ? C.ok : C.bad) : good ? C.ok : C.brand;
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text(`El precio bajó ${params.drop} %. ¿Qué % hay que subirlo para volver al original?`, 12, 8, W - 24, 44);
        p.stroke(C.line); p.strokeWeight(1); p.line(16, floor(), rail.x - 24, floor());
        // Línea del precio original cruzando las tres barras.
        p.drawingContext.setLineDash([5, 4]); p.stroke(C.ok); p.strokeWeight(1.5); p.line(16, yOf(params.base), rail.x - 24, yOf(params.base)); p.drawingContext.setLineDash([]);
        bar(bars[0], params.base, C.mute, 'original');
        bar(bars[1], low, C.I, 'rebajado', `−${params.drop} %`);
        bar(bars[2], now, col, 'nuevo', st.up === null ? '' : `+${fmt1(st.up)} %`);
        // Manija vertical del % de subida.
        p.stroke(C.line); p.strokeWeight(6); p.line(rail.x, rail.y, rail.x, rail.y + rail.h);
        const hy = rail.y + rail.h - (upOf() / params.max) * rail.h;
        if (st.up !== null) { p.stroke(col); p.line(rail.x, hy, rail.x, rail.y + rail.h); }
        p.fill(C.card); p.stroke(col); p.strokeWeight(3); p.circle(rail.x, hy, 28);
        p.noStroke(); p.fill(col); p.textAlign(p.CENTER, p.BOTTOM); p.textStyle(p.BOLD); p.textSize(15);
        p.text(st.up === null ? '— %' : `${fmt1(st.up)} %`, rail.x, rail.y - 8);
        p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL); p.text('% de subida', rail.x, rail.y - 26);
        p.textAlign(p.CENTER, p.TOP); p.text(`0 – ${params.max}`, rail.x, rail.y + rail.h + 6);
        if (locked) { const ay = rail.y + rail.h - (ans / params.max) * rail.h; p.stroke(C.ok); p.strokeWeight(2); p.line(rail.x - 14, ay, rail.x + 14, ay); }
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked && !good ? `Hacía falta subir ${fmt1(ans)} %` : 'Arrastra la manija: la barra «nuevo» debe llegar a la línea', W / 2, H - 12);
      };

      p.mousePressed = () => {
        if (locked) return;
        if (Math.abs(p.mouseX - rail.x) <= 30 && p.mouseY >= rail.y - 20 && p.mouseY <= rail.y + rail.h + 20) { drag = true; setUp(p.mouseY); return false; }
      };
      p.mouseDragged = () => { if (!drag) return; setUp(p.mouseY); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.15);

    return {
      loaded: m.ready,
      getState: () => ({ ...st }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
