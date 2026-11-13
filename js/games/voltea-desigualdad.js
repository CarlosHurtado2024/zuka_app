// La desigualdad que voltea (lección 1.2b): dos puntos a < b sobre una recta; en cada paso se
// aplica la misma operación a los dos (sumar o multiplicar por k) y los puntos se mueven (al
// multiplicar por un negativo la recta se refleja). El alumno elige «<» o «>» para el nuevo orden.
// params = { a, b, steps: [{ op: '+' | '×', k }] }   state = { signs: ['<' | '>' | null] }

GAMES['voltea-desigualdad'] = (() => {
  const fmt = n => String(+n.toFixed(2));
  // Estados tras cada paso: valores y el signo correcto (a < b al inicio).
  function apply(p) {
    let a = p.a, b = p.b;
    return p.steps.map(s => {
      if (s.op === '+') { a += s.k; b += s.k; } else { a *= s.k; b *= s.k; }
      return { a, b, sign: a < b ? '<' : '>' };
    });
  }

  function grade(state, params) {
    const want = apply(params);
    const ok = want.every((w, i) => state.signs[i] === w.sign);
    const solution = want.map((w, i) => { const s = params.steps[i]; return `${s.op === '+' ? (s.k < 0 ? '− ' + fmt(-s.k) : '+ ' + fmt(s.k)) : '× (' + fmt(s.k) + ')'}: ${fmt(w.a)} ${w.sign} ${fmt(w.b)}${s.op === '×' && s.k < 0 ? ' (se voltea)' : ''}`; }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { signs: params.steps.map(() => null) };
    const want = apply(params);
    const range = (() => { const all = [params.a, params.b, ...want.flatMap(w => [w.a, w.b])]; const lo = Math.min(...all), hi = Math.max(...all); const pad = Math.max(1, (hi - lo) * 0.15); return [Math.floor(lo - pad), Math.ceil(hi + pad)]; })();
    let locked = false, W = 0, H = 0, line = null, buttons = [], cur = 0, shown = { a: params.a, b: params.b }, target = { a: params.a, b: params.b };

    function layout(w, h) {
      W = w; H = h;
      line = { x0: 24, x1: w - 24, y: h * 0.42 };
      const bw = (w - 36) / 2, by = h - 92;
      buttons = [
        { v: '<', x: 12, y: by, w: bw, h: 44, col: C.Q },
        { v: '>', x: 24 + bw, y: by, w: bw, h: 44, col: C.I },
      ];
    }
    const toPx = v => line.x0 + ((v - range[0]) / (range[1] - range[0])) * (line.x1 - line.x0);
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.signs.every(s => s !== null));
    const stepText = s => (s.op === '+' ? (s.k < 0 ? `restar ${fmt(-s.k)}` : `sumar ${fmt(s.k)}`) : `multiplicar por ${fmt(s.k)}`);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        shown.a += (target.a - shown.a) * 0.15; shown.b += (target.b - shown.b) * 0.15;
        const done = cur >= params.steps.length;
        const prev = cur === 0 ? { a: params.a, b: params.b, sign: '<' } : want[cur - 1];
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text(done ? 'Todos los pasos respondidos' : `Paso ${cur + 1} de ${params.steps.length}: a los dos números, ${stepText(params.steps[cur])}`, 12, 8, W - 24, 40);
        // Lo que se sabe antes del paso.
        drawPill(p, C, `${fmt(prev.a)} ${prev.sign} ${fmt(prev.b)}`, W / 2, 68, C.sun, 20);
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.TOP); p.text(done ? '' : '¿y después de la operación?', W / 2, 88);
        // Recta y puntos.
        p.stroke(C.ink); p.strokeWeight(3); p.line(line.x0 - 6, line.y, line.x1 + 6, line.y);
        for (let v = range[0]; v <= range[1]; v++) { const x = toPx(v); p.stroke(v === 0 ? C.sun : C.ink); p.strokeWeight(v === 0 ? 3 : 1.5); p.line(x, line.y - 5, x, line.y + 5); if ((range[1] - range[0]) <= 24 || v % 5 === 0) { p.noStroke(); p.fill(C.mute); p.textSize(10); p.textAlign(p.CENTER, p.TOP); p.text(v, x, line.y + 8); } }
        const xa = toPx(shown.a), xb = toPx(shown.b);
        drawDot(p, C, xa, line.y, 14, C.sun); drawDot(p, C, xb, line.y, 14, C.sky);
        p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.BOTTOM); p.fill(C.N); p.text(`a = ${fmt(target.a)}`, xa, line.y - 12); p.fill(C.Z); p.text(`b = ${fmt(target.b)}`, xb, line.y - (Math.abs(xa - xb) < 60 ? 30 : 12));
        // Historial de respuestas.
        p.textAlign(p.LEFT, p.TOP); p.textStyle(p.NORMAL); p.textSize(12);
        params.steps.forEach((s, i) => {
          const y = line.y + 40 + i * 20, ans = st.signs[i];
          const good = ans === want[i].sign;
          p.fill(ans === null ? C.mute : locked ? (good ? C.ok : C.bad) : C.ink);
          p.text(`${i + 1}. ${stepText(s)} → ${ans === null ? '?' : `${fmt(want[i].a)} ${ans} ${fmt(want[i].b)}`}${locked && !good ? `  (era ${want[i].sign})` : ''}`, 14, y, W - 28, 20);
        });
        buttons.forEach(b => {
          const dim = locked || done;
          drawTile(p, C, b, `a ${b.v} b`, { fill: dim ? C.card : b.col, ink: dim ? C.mute : undefined, r: 12, size: 22, lift: dim ? 1 : 3 });
        });
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked ? (grade(st, params).ok ? '¡Ni un volteo perdido!' : 'En rojo, los pasos que se voltearon mal') : 'Mira cómo se mueven los puntos y elige el signo', 12, H - 36, W - 24, 28);
      };

      p.mousePressed = () => {
        if (locked || cur >= params.steps.length) return;
        const b = buttons.find(b => inside(b, p.mouseX, p.mouseY));
        if (!b) return;
        st.signs[cur] = b.v;
        target = { a: want[cur].a, b: want[cur].b };   // ahora sí se mueven los puntos
        cur += 1; api.sfx?.tap?.(); ready();
        return false;
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ signs: [...st.signs] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, apply };
})();
