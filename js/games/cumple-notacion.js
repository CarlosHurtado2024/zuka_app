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
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], bag = null, spots = [], pos = [], fb = null, listH = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length, w);
      placeAll();
    }
    function placeAll() {
      const r = R[cur], n = r.tokens.length;
      listH = Math.ceil(n / 2) * 26 + 12;
      const top = 48 + listH + 8;
      fb = { x: 12, y: H - 60, w: W - 24, h: 50 };
      const rows = Math.ceil(n / Math.min(4, n)), trayH = rows * 38;
      bag = { x: W / 2, rx: (W - 44) / 2 };
      bag.ry = Math.max(46, (fb.y - 10 - trayH - 8 - top) / 2 - 4); bag.y = top + bag.ry + 4;
      // Lugares dentro de la membrana (dos columnas) y afuera (fila de abajo, dentro del universo).
      const half = Math.ceil(n / 2), step = Math.min(36, (bag.ry * 1.56) / Math.max(1, half));
      const cols = Math.min(4, n), tw = (W - 24 - 16 - (cols - 1) * 6) / cols, y0 = fb.y - 10 - trayH + 4;
      const cw = Math.min(tw, bag.rx * 0.78);
      spots = r.tokens.map((_, k) => ({
        inn: { x: bag.x + (k % 2 ? 1 : -1) * bag.rx * 0.42, y: bag.y + (Math.floor(k / 2) - (half - 1) / 2) * step + 6 },
        out: { x: 20 + (k % cols) * (tw + 6) + tw / 2, y: y0 + Math.floor(k / cols) * 38 + 15 }, w: cw,
      }));
      pos = spots.map((s, k) => ({ ...(st.inside[cur][k] ? s.inn : s.out) }));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], ins = st.inside[cur], dt = frameDt(p), A = locked ? (good(ins, r) ? { line: C.ok, ink: C.ok } : { line: C.bad, ink: C.bad }) : SK.sets(C)[0];
        drawTabs(p, C, tabs, cur, i => (locked ? (good(st.inside[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        // Las frases que deben cumplirse, con su marca.
        SK.panel(p, C, { x: 12, y: 46, w: W - 24, h: listH }, { r: 12 });
        r.tokens.forEach((tok, k) => {
          const x = 24 + (k % 2) * (W - 24) / 2, y = 65 + Math.floor(k / 2) * 26, ok = ins[k] === r.inside[k];
          if (ok) { p.noStroke(); p.fill(C.ok); p.circle(x, y, 9); } else { p.noFill(); p.stroke(C.mute); p.strokeWeight(1.3); p.circle(x, y, 8); p.noStroke(); }
          p.fill(ok ? C.ink : C.mute); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.CENTER);
          fitText(p, sentence(tok, r.set, r.inside[k]), x + 12, y + 1, (W - 24) / 2 - 30, 14);
        });
        // El universo, con la membrana del conjunto.
        const U = { x: 12, y: 48 + listH + 8, w: W - 24, h: fb.y - 10 - (48 + listH + 8) };
        SK.panel(p, C, U, { u: true });
        SK.membrane(p, C, bag.x, bag.y, bag.rx, bag.ry, A.line);
        SK.tag(p, C, r.set, bag.x - bag.rx * 0.74, bag.y - bag.ry * 0.82, A);
        // Píldoras: se deslizan entre adentro y afuera.
        r.tokens.forEach((tok, k) => {
          const s = spots[k], t = ins[k] ? s.inn : s.out, b = pos[k], bad = locked && ins[k] !== r.inside[k];
          SK.ease(b, 'x', t.x, dt); SK.ease(b, 'y', t.y, dt);
          SK.chip(p, C, { x: b.x - s.w / 2, y: b.y - 13, w: s.w, h: 26 }, tok, { state: bad ? 'bad' : ins[k] ? (locked ? 'ok' : 'on') : 'idle', size: 13 });
        });
        const list = r.tokens.filter((_, k) => ins[k]);
        SK.formal(p, C, fb, SK.setTex(r.set, list), { kicker: 'Así queda escrito', col: A.line, size: 17 });
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; placeAll(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const ins = st.inside[cur];
        const k = spots.findIndex((s, k) => { const pt = ins[k] ? s.inn : s.out; return Math.abs(p.mouseX - pt.x) < s.w / 2 && Math.abs(p.mouseY - pt.y) < 16; });
        if (k >= 0) { ins[k] = !ins[k]; touched[cur] = true; api.ready(touched.every(Boolean)); api.sfx?.tap?.(); return false; }
      };
    }, 1.45);

    return {
      loaded: m.ready,
      getState: () => ({ inside: st.inside.map(x => [...x]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, sentence };
})();
