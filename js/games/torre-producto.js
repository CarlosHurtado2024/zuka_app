// La torre del producto (lecciones 1.4 y 1.5): cada paso multiplica el valor (por una razón fija,
// como las bacterias que se duplican, o por el siguiente entero, el factorial) y la torre crece.
// Meta: llegar exactamente a `target`.
// params = { kind: 'ratio' | 'factorial', start, r, target, max, unit, period }   state = { n }

GAMES['torre-producto'] = (() => {
  const valueAt = (n, p) => (p.kind === 'factorial' ? Array.from({ length: n }, (_, k) => k + 1).reduce((a, b) => a * b, 1) : p.start * p.r ** n);
  const answerOf = p => { for (let n = 1; n <= p.max; n++) if (valueAt(n, p) === p.target) return n; return null; };
  const fmt = n => Math.round(n).toLocaleString('es-CO');

  function grade(state, params) {
    const ok = state.n > 0 && valueAt(state.n, params) === params.target;
    const n = answerOf(params);
    const how = params.kind === 'factorial' ? `$${n}! = ${fmt(params.target)}$` : `$${params.start} \\cdot ${params.r}^{${n}} = ${fmt(params.target)}$`;
    return { ok, solution: n === null ? `Ningún paso llega justo a ${fmt(params.target)}` : `${how}: ${n} ${params.period}${n === 1 ? '' : 's'}` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const fact = params.kind === 'factorial';
    const st = { n: 0 };
    let locked = false, W = 0, H = 0, buttons = [], tower = null;

    function layout(w, h) {
      W = w; H = h;
      tower = { x: 24, y: 52, w: w - 48, h: h - 52 - 120 };
      const bw = (w - 36) / 2, by = h - 100;
      buttons = [
        { v: -1, x: 12, y: by, w: bw, h: 44, t: '÷ atrás', col: C.I },
        { v: 1, x: 24 + bw, y: by, w: bw, h: 44, t: fact ? '× siguiente' : `× ${params.r}`, col: C.Q },
      ];
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.n > 0);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const v = valueAt(st.n, params), good = v === params.target;
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text(fact ? `Multiplica 1 · 2 · 3 · … hasta llegar a ${fmt(params.target)}` : `${params.start} ${params.unit}; cada ${params.period} se multiplican por ${params.r} · meta ${fmt(params.target)}`, 12, 8, W - 24, 40);
        // Torre: un bloque por paso, el ancho crece con el logaritmo del valor (para que quepa).
        const rowH = Math.min(26, tower.h / Math.max(params.max + 1, 1)), lg = Math.log(Math.max(params.target, valueAt(params.max, params)));
        for (let k = 0; k <= st.n; k++) {
          const val = valueAt(k, params), bw = Math.max(26, (Math.log(Math.max(val, 1.0001)) / lg) * tower.w), y = tower.y + tower.h - (k + 1) * rowH;
          p.stroke(C.bg); p.strokeWeight(1); p.fill(k === st.n ? C.Q : k % 2 ? C.Z : '#3B7FD6'); p.rect(W / 2 - bw / 2, y, bw, rowH - 2, 4);
          p.noStroke(); p.fill(C.ink); p.textSize(11); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
          p.text(fact && k ? `${k}! = ${fmt(val)}` : fmt(val), W / 2, y + (rowH - 2) / 2);
          p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(10); p.textAlign(p.LEFT, p.CENTER); p.text(fact ? (k ? `× ${k}` : '') : `${params.period} ${k}`, tower.x, y + (rowH - 2) / 2);
        }
        p.noStroke(); p.fill(locked ? (good ? C.ok : C.bad) : C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(18);
        p.text(fact ? (st.n ? `${st.n}! = ${fmt(v)}` : '1') : `${st.n} ${params.period}${st.n === 1 ? '' : 's'} · ${fmt(v)} ${params.unit}`, W / 2, H - 126);
        buttons.forEach(b => {
          const dim = locked || (b.v < 0 ? st.n === 0 : st.n >= params.max);
          p.stroke(dim ? C.line : b.col); p.strokeWeight(2); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 12);
          p.noStroke(); p.fill(dim ? C.mute : b.col); p.textSize(15); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.text(b.t, b.x + b.w / 2, b.y + b.h / 2 + 1);
        });
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked ? (good ? '¡Justo la meta!' : `Eran ${answerOf(params)} ${params.period}s`) : `Multiplica hasta llegar exactamente a ${fmt(params.target)}`, 12, H - 30, W - 24, 24);
      };

      p.mousePressed = () => {
        if (locked) return;
        const b = buttons.find(b => inside(b, p.mouseX, p.mouseY));
        if (!b) return;
        const next = st.n + b.v;
        if (next < 0 || next > params.max) return false;
        st.n = next; api.sfx?.tap?.(); ready();
        return false;
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ n: st.n }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, valueAt };
})();
