// Haz que se cumpla (Álgebra 0, pertenece ∈ / no pertenece ∉): arriba hay frases escritas con símbolos,
// como «perro ∈ M» o «pez ∉ M». Abajo está la bolsa del conjunto M y, afuera, las fichas. Tocar una ficha la
// mete a la bolsa o la saca. Meta: que todas las frases sean ciertas. Al lado de cada frase se ve en vivo si ya
// se cumple, para aprender a leer los símbolos.
// params = { rounds: [{ set, tokens: [etiquetas], inside: [bool por ficha] }] }   state = { inside: [[bool]] }

GAMES['cumple-notacion'] = (() => {
  const sentence = (tok, set, inn) => `${tok} ${inn ? '∈' : '∉'} ${set}`;
  const good = (ins, r) => !!ins && r.inside.every((v, k) => ins[k] === v);
  const setText = r => `${r.set} = {${r.tokens.filter((_, k) => r.inside[k]).join(', ')}}`;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => good(state.inside?.[i], r));
    return { ok, solution: params.rounds.map(setText).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { inside: R.map(r => r.tokens.map(() => false)) };
    const touched = R.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], bag = null, spots = [];

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length, w);
      placeAll();
    }
    function placeAll() {
      const r = R[cur], n = r.tokens.length, listH = Math.ceil(n / 2) * 24 + 8;
      const top = 50 + listH;
      bag = { x: W / 2, y: top + (H - top - 70) * 0.42, rx: (W - 40) / 2, ry: (H - top - 70) * 0.36 };
      // Lugares dentro de la bolsa (en dos columnas) y afuera (fila de abajo).
      const insideSpots = r.tokens.map((_, k) => ({ x: bag.x + (k % 2 ? 1 : -1) * bag.rx * 0.42, y: bag.y - bag.ry * 0.55 + Math.floor(k / 2) * (bag.ry * 1.1 / Math.max(1, Math.ceil(n / 2) - 1 || 1)) }));
      const cols = Math.min(4, n), tw = (W - 28 - (cols - 1) * 8) / cols, rows = Math.ceil(n / cols), y0 = H - rows * 40 - 12;
      const outsideSpots = r.tokens.map((_, k) => ({ x: 14 + (k % cols) * (tw + 8) + tw / 2, y: y0 + Math.floor(k / cols) * 40 + 16 }));
      spots = r.tokens.map((_, k) => ({ inn: insideSpots[k], out: outsideSpots[k], w: Math.min(tw, bag.rx * 0.8) }));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);
      const tint = (col, a) => { const c = p.color(col); c.setAlpha(a); return c; };

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], ins = st.inside[cur];
        drawTabs(p, C, tabs, cur, i => (locked ? (good(st.inside[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        // Frases
        p.textStyle(p.BOLD); p.textSize(14); p.textAlign(p.LEFT, p.CENTER);
        r.tokens.forEach((tok, k) => {
          const x = 14 + (k % 2) * (W - 28) / 2, y = 56 + Math.floor(k / 2) * 24, ok = ins[k] === r.inside[k];
          p.noStroke(); p.fill(ok ? C.ok : C.mute); p.text(ok ? '✓' : '·', x, y);
          p.fill(C.ink); p.text(sentence(tok, r.set, r.inside[k]), x + 16, y);
        });
        // Bolsa
        p.stroke(locked ? (good(ins, r) ? C.ok : C.bad) : C.R); p.strokeWeight(3); p.fill(tint(C.R, 35));
        p.ellipse(bag.x, bag.y, 2 * bag.rx, 2 * bag.ry);
        p.noStroke(); p.fill(C.R); p.textStyle(p.BOLD); p.textSize(22); p.textAlign(p.LEFT, p.CENTER);
        p.text(r.set, bag.x - bag.rx * 0.72, bag.y - bag.ry * 0.62);
        // Fichas
        r.tokens.forEach((tok, k) => {
          const s = spots[k], pt = ins[k] ? s.inn : s.out, bad = locked && ins[k] !== r.inside[k];
          p.stroke(bad ? C.bad : ins[k] ? C.R : C.mute); p.strokeWeight(1.8); p.fill(C.card);
          p.rect(pt.x - s.w / 2, pt.y - 15, s.w, 30, 9);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, tok, pt.x, pt.y + 1, s.w - 8, 14);
        });
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; placeAll(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const ins = st.inside[cur];
        const k = spots.findIndex((s, k) => { const pt = ins[k] ? s.inn : s.out; return Math.abs(p.mouseX - pt.x) < s.w / 2 && Math.abs(p.mouseY - pt.y) < 16; });
        if (k >= 0) { ins[k] = !ins[k]; touched[cur] = true; api.ready(touched.every(Boolean)); api.sfx?.tap?.(); return false; }
      };
    }, 1.35);

    return {
      loaded: m.ready,
      getState: () => ({ inside: st.inside.map(x => [...x]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, sentence };
})();
