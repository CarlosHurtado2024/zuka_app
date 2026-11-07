// Pon la rayita (lección 1.1, decimales periódicos): la división de una fracción aparece cifra por
// cifra, con el residuo de cada paso debajo. Se toca la primera cifra que se repite y luego la última
// del bloque: la rayita cubre ese bloque. Tocar una cifra resalta las que tienen el mismo residuo:
// cuando el residuo se repite, las cifras se repiten. Vale la rayita más corta, desde donde empieza.
// params = { rounds: [{ num, den }] }   state = { marks: [{ start, len } | null] }

GAMES['pon-la-rayita'] = (() => {
  // División larga de num/den: parte entera, `n` cifras decimales con sus residuos, cuántas cifras
  // van antes del período (pre) y cuántas tiene el período (0 si el decimal termina).
  function expand(num, den, n) {
    const int = Math.floor(num / den);
    const seen = new Map();
    let r = num % den, i = 0;
    while (r !== 0 && !seen.has(r)) { seen.set(r, i); r = (r * 10) % den; i++; }
    const pre = r === 0 ? i : seen.get(r), period = r === 0 ? 0 : i - pre;
    const digits = [], rems = [];
    r = num % den;
    for (let k = 0; k < n; k++) { rems.push(r); r *= 10; digits.push(Math.floor(r / den)); r %= den; }
    return { int, digits, rems, pre, period };
  }
  const shown = r => { const e = expand(r.num, r.den, 0); return Math.min(15, Math.max(10, e.pre + 2 * e.period + 2)); };
  const notation = r => {
    const e = expand(r.num, r.den, 30);
    const fixed = e.digits.slice(0, e.pre).join(''), rep = e.digits.slice(e.pre, e.pre + e.period).join('');
    return `${e.int}.${fixed}${rep ? `\\overline{${rep}}` : ''}`;
  };

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => {
      const e = expand(r.num, r.den, 0), m = state.marks[i];
      return !!m && m.start === e.pre && m.len === e.period;
    });
    return { ok, solution: params.rounds.map(r => `$\\tfrac{${r.num}}{${r.den}} = ${notation(r)}$`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { marks: params.rounds.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], tiles = [], open = false, focus = -1, ex = null;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      const r = params.rounds[cur], n = shown(r);
      ex = expand(r.num, r.den, n);
      const x0 = 46, tw = Math.min(30, (w - x0 - 12) / n);
      tiles = ex.digits.map((_, i) => ({ x: x0 + i * tw, y: h * 0.42, w: tw - 2, h: 40 }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.marks.every(Boolean));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], mk = st.marks[cur];
        const good = !!mk && mk.start === ex.pre && mk.len === ex.period;
        tabs.forEach((t, i) => {
          const ri = params.rounds[i], ei = expand(ri.num, ri.den, 0), mi = st.marks[i], ok = !!mi && mi.start === ei.pre && mi.len === ei.period;
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : mi ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        // La fracción y la instrucción.
        p.noStroke(); p.fill(C.Q); p.textStyle(p.BOLD); p.textSize(24); p.textAlign(p.LEFT, p.CENTER);
        p.text(`${r.num}/${r.den} =`, 12, 62);
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.LEFT, p.TOP);
        p.text(open ? 'Ahora toca la última cifra del bloque que se repite' : 'Toca la primera cifra que se repite para siempre', 12, 82, W - 24, 32);
        // Las cifras de la división, con la rayita sobre el bloque elegido.
        const t0 = tiles[0], y = t0.y;
        p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(22); p.textAlign(p.RIGHT, p.CENTER); p.text(`${ex.int}.`, t0.x - 4, y + t0.h / 2);
        const inMark = i => mk && i >= mk.start && i < mk.start + mk.len;
        tiles.forEach((b, i) => {
          const same = focus >= 0 && ex.rems[i] === ex.rems[focus];
          const col = inMark(i) ? (locked ? (good ? C.ok : C.bad) : C.brand) : same ? C.N : C.line;
          p.stroke(col); p.strokeWeight(inMark(i) || same ? 2.5 : 1.2); p.fill(inMark(i) ? col + '22' : C.card); p.rect(b.x, b.y, b.w, b.h, 6);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(Math.min(18, b.w * 0.75)); p.text(ex.digits[i], b.x + b.w / 2, b.y + b.h / 2 + 1);
          p.fill(same ? C.N : C.mute); p.textStyle(p.NORMAL); p.textSize(Math.min(10, b.w * 0.5)); p.text(ex.rems[i], b.x + b.w / 2, b.y + b.h + 12); p.textStyle(p.BOLD);
        });
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(10); p.textAlign(p.RIGHT, p.CENTER); p.text('residuo', t0.x - 4, y + t0.h + 12);
        if (mk) {
          const a = tiles[mk.start], z = tiles[mk.start + mk.len - 1];
          p.stroke(locked ? (good ? C.ok : C.bad) : C.brand); p.strokeWeight(4); p.line(a.x + 2, y - 9, z.x + z.w - 2, y - 9);
        }
        if (locked && !good && ex.period) {
          const a = tiles[ex.pre], z = tiles[ex.pre + ex.period - 1];
          p.stroke(C.ok); p.strokeWeight(3); p.drawingContext.setLineDash([5, 4]); p.line(a.x + 2, y - 17, z.x + z.w - 2, y - 17); p.drawingContext.setLineDash([]);
        }
        // Cómo queda escrito: cifras fijas y, con rayita, el bloque.
        if (mk) {
          const fixed = `${ex.int}.${ex.digits.slice(0, mk.start).join('')}`, rep = ex.digits.slice(mk.start, mk.start + mk.len).join('');
          p.textSize(28); p.textStyle(p.BOLD);
          const wf = p.textWidth(fixed), wr = p.textWidth(rep), xs = W / 2 - (wf + wr) / 2, yn = y + t0.h + 64;
          p.noStroke(); p.fill(locked ? (good ? C.ok : C.bad) : C.ink); p.textAlign(p.LEFT, p.CENTER); p.text(fixed + rep, xs, yn);
          p.stroke(locked ? (good ? C.ok : C.bad) : C.brand); p.strokeWeight(3); p.line(xs + wf + 1, yn - 19, xs + wf + wr - 1, yn - 19);
        }
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        const pend = st.marks.findIndex((v, i) => !v && i !== cur);
        p.text(locked ? (grade(st, params).ok ? '¡Rayitas perfectas!' : 'La rayita correcta va punteada en verde') : mk && !open && pend >= 0 ? `Toca la pestaña ${pend + 1} para la siguiente fracción` : 'Cuando un residuo se repite, las cifras empiezan a repetirse', 12, H - 18, W - 24, 28);
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; open = false; focus = -1; layout(W, H); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const i = tiles.findIndex(b => inside({ ...b, y: b.y - 14, h: b.h + 34 }, p.mouseX, p.mouseY));
        if (i < 0) return;
        const mk = st.marks[cur];
        if (open && mk && i >= mk.start) { mk.len = i - mk.start + 1; open = false; }
        else { st.marks[cur] = { start: i, len: 1 }; open = true; }
        focus = i; api.sfx?.tap?.(); ready();
        return false;
      };
    }, 0.95);

    return {
      loaded: m.ready,
      getState: () => ({ marks: st.marks.map(mk => (mk ? { start: mk.start, len: mk.len } : null)) }),
      lock() { locked = true; open = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, expand };
})();
