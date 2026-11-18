// La torre del producto (lecciones 1.4 y 1.5): cada paso multiplica el valor (por una razón fija,
// como las bacterias que se duplican, o por el siguiente entero, el factorial) y la torre crece.
// Meta: llegar exactamente a `target`.
// params = { kind: 'ratio' | 'factorial', start, r, target, max, unit, period }   state = { n }

GAMES['torre-producto'] = (() => {
  const valueAt = (n, p) => (p.kind === 'factorial' ? Array.from({ length: n }, (_, k) => k + 1).reduce((a, b) => a * b, 1) : p.start * p.r ** n);
  const answerOf = p => { for (let n = 1; n <= p.max; n++) if (valueAt(n, p) === p.target) return n; return null; };
  const fmt = n => Math.round(n).toLocaleString('es-CO');
  // «1 doblez», «9 dobleces»; «1 día», «3 días».
  const plural = (w, n) => (n === 1 ? w : /z$/.test(w) ? `${w.slice(0, -1)}ces` : /[aeiouáéíóú]$/.test(w) ? `${w}s` : `${w}es`);
  const tex = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');   // miles con \, dentro de TeX

  function grade(state, params) {
    const ok = state.n > 0 && valueAt(state.n, params) === params.target;
    const n = answerOf(params);
    const how = params.kind === 'factorial' ? `$${n}! = ${tex(params.target)}$` : `$${params.start} \\cdot ${params.r}^{${n}} = ${tex(params.target)}$`;
    return { ok, solution: n === null ? `Ningún paso llega justo a ${fmt(params.target)}` : `${how}: ${n} ${plural(params.period, n)}` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const unitOf = v => (v === 1 ? String(params.unit).replace(/s$/, '') : params.unit);   // «1 capa», «2 capas»
    const fact = params.kind === 'factorial';
    const st = { n: 0 };
    let locked = false, W = 0, H = 0, tower = null, rail, drag = false;

    function layout(w, h) {
      W = w; H = h;
      tower = { x: 12, y: 59, w: w - 82, h: h - 136 };
      rail = lineMap(0, params.max, h - 73, 70);
    }
    const ready = () => api.ready(st.n > 0);
    const handle = () => ({ x: W - 28, y: rail.toPx(st.n) });

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const v = valueAt(st.n, params), good = v === params.target;
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text(fact ? `Multiplica 1 · 2 · 3 · … hasta llegar a ${fmt(params.target)}` : `Empiezas con ${params.start} ${unitOf(params.start)}; cada ${params.period} se multiplica por ${params.r} · meta ${fmt(params.target)}`, 12, 8, W - 24, 40);
        // Torre: un bloque por paso, el ancho crece con el logaritmo del valor (para que quepa).
        const rowH = Math.min(26, tower.h / Math.max(params.max + 1, 1)), lg = Math.log(Math.max(params.target, valueAt(params.max, params)));
        for (let k = 0; k <= st.n; k++) {
          const val = valueAt(k, params), bw = Math.max(40, (Math.log(Math.max(val, 1.0001)) / lg) * tower.w), y = tower.y + tower.h - (k + 1) * rowH;
          const cx = tower.x + tower.w / 2;
          p.stroke(C.bg); p.strokeWeight(1); p.fill(k === st.n ? C.sun : k % 2 ? C.sky : shade(C.sky, 0.9)); p.rect(cx - bw / 2, y, bw, rowH - 2, 4);
          p.noStroke(); p.fill(inkOn(k === st.n ? C.sun : C.sky, C.ink)); p.textSize(11); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
          fitText(p, fact && k ? `${k}! = ${fmt(val)}` : fmt(val), cx, y + (rowH - 2) / 2, bw - 6, 11);
        }
        p.noStroke(); p.fill(locked ? (good ? C.ok : C.bad) : C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(18);
        p.text(fact ? (st.n ? `${st.n}! = ${fmt(v)}` : '1') : `${st.n} ${plural(params.period, st.n)} · ${fmt(v)} ${unitOf(v)}`, W / 2, H - 48);
        const { x, y } = handle();
        p.stroke(C.line); p.strokeWeight(3); p.line(x, rail.toPx(0), x, rail.toPx(params.max));
        p.fill(C.card); p.stroke(C.brand); p.strokeWeight(2); p.circle(x, y, 23);
        p.noStroke(); p.fill(C.ink); p.textSize(12); p.text(st.n, x, y);
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        const ans = answerOf(params);
        p.text(locked ? (good ? '¡Justo la meta!' : ans === null ? `Ningún paso llega justo a ${fmt(params.target)}` : `${ans === 1 ? 'Era' : 'Eran'} ${ans} ${plural(params.period, ans)}`) : 'Arrastra la manija para construir la torre', 12, H - 26, W - 24, 24);
      };

      const move = () => {
        const next = Math.max(0, Math.min(params.max, Math.round(rail.toVal(p.mouseY))));
        if (next !== st.n) { st.n = next; api.sfx?.tap?.(); ready(); }
      };
      p.mousePressed = () => {
        if (locked || !inCanvas(p) || Math.abs(p.mouseX - handle().x) > 24 || p.mouseY < 50 || p.mouseY > H - 55) return;
        drag = true; move(); return false;
      };
      p.mouseDragged = () => { if (drag && !locked) { move(); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.12, () => {
      if (locked || !rail) return null;
      return { from: handle(), to: { x: handle().x, y: rail.toPx(st.n ? st.n - 1 : 1) } };
    });

    return {
      loaded: m.ready,
      getState: () => ({ n: st.n }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      demo: m.demo,
    };
  }

  return { grade, create, valueAt, demo: true };
})();
