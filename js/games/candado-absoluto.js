// El candado del valor absoluto (cálculo): en la recta está pintado un conjunto (un intervalo centrado o
// dos semirrectas). El candado tiene tres ruedas, centro c, símbolo (<, ≤, >, ≥) y radio r, que escriben
// |x − c| □ r. Se giran tocando ▲ / ▼ hasta que la desigualdad describa justo ese conjunto: entonces el
// candado se abre.
// params = { rounds: [{ c, rel, r }] }   state = { vals: [{ c, rel, r }] }

GAMES['candado-absoluto'] = (() => {
  const RELS = ['<', '<=', '>', '>='];
  const TEX = { '<': '<', '<=': '\\le', '>': '>', '>=': '\\ge' };
  const SYM = { '<': '<', '<=': '≤', '>': '>', '>=': '≥' };
  const num = v => String(v);
  function texOf(v) {
    const abs = v.c === 0 ? '|x|' : v.c > 0 ? `|x - ${num(v.c)}|` : `|x + ${num(-v.c)}|`;
    return `${abs} ${TEX[v.rel]} ${num(v.r)}`;
  }
  const txtOf = v => texOf(v).replace(/\\le/, '≤').replace(/\\ge/, '≥').replace(/ - /, ' − ');
  const same = (a, b) => !!a && a.c === b.c && a.r === b.r && a.rel === b.rel;
  const WHEELS = [
    { key: 'c', step: 0.5, min: -6, max: 6, name: 'centro' },
    { key: 'rel', name: 'símbolo' },
    { key: 'r', step: 0.5, min: 0.5, max: 8, name: 'radio' },
  ];

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.vals[i], r));
    return { ok, solution: params.rounds.map(r => `$${texOf(r)}$`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, lo = params.min ?? -10, hi = params.max ?? 10;
    const vals = params.rounds.map(() => ({ c: 0, rel: '<', r: 1 })), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], wheels = [], open = 0;
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const X = v => 22 + (v - lo) / (hi - lo) * (W - 44);

    function layout() {
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      const bw = Math.min(250, W - 60), bx = (W - bw) / 2, by = 210, ww = (bw - 40) / 3;
      wheels = WHEELS.map((wh, i) => {
        const x = bx + 14 + i * (ww + 6);
        return { ...wh, x, y: by + 28, w: ww, h: 92, up: { x, y: by + 28, w: ww, h: 28 }, down: { x, y: by + 92, w: ww, h: 28 } };
      });
      wheels.body = { x: bx, y: by, w: bw, h: 150 };
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };
      function fit(s, x, y, sz, maxW) { p.textSize(sz); while (sz > 9 && p.textWidth(s) > maxW) { sz -= 1; p.textSize(sz); } p.text(s, x, y); }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], v = vals[cur], good = same(v, r);
        tabs.forEach((tb, i) => {
          const ok = same(vals[i], params.rounds[i]);
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(tb.x, tb.y, tb.w, tb.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, tb.x + tb.w / 2, tb.y + tb.h / 2);
        });
        // El conjunto pedido (dibujado desde la combinación correcta).
        const ly = 70, inn = r.rel[0] === '<', cl = r.rel.includes('='), L = X(r.c - r.r), R = X(r.c + r.r), col = C.Z;
        p.stroke(C.line); p.strokeWeight(2); p.line(14, ly, W - 14, ly);
        for (let k = Math.ceil(lo); k <= hi; k++) {
          p.stroke(C.line); p.strokeWeight(1); p.line(X(k), ly - 4, X(k), ly + 4);
          if (k % 2 === 0) { p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(10); p.textAlign(p.CENTER, p.TOP); p.text(String(k).replace('-', '−'), X(k), ly + 8); }
        }
        p.stroke(col); p.strokeWeight(8);
        if (inn) p.line(L, ly, R, ly); else { p.line(14, ly, L, ly); p.line(R, ly, W - 14, ly); }
        [L, R].forEach(x => { p.stroke(col); p.strokeWeight(2.5); p.fill(cl ? col : C.bg); p.circle(x, ly, 15); });
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.TOP); p.text('¿qué desigualdad describe este conjunto?', W / 2, ly + 24);

        // La desigualdad que escriben las ruedas.
        p.fill(good && !locked ? C.ok : C.ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(26); fit(txtOf(v), W / 2, 124, 26, W - 24);

        // Candado: arco (se levanta cuando abre) y cuerpo con las ruedas.
        const b = wheels.body;
        open += ((good ? 1 : 0) - open) * 0.15;
        const sh = 26 * open;
        p.noFill(); p.stroke(locked ? (good ? C.ok : C.bad) : good ? C.ok : C.mute); p.strokeWeight(10);
        p.arc(b.x + b.w / 2, b.y - sh, b.w * 0.55, 70, Math.PI, 2 * Math.PI);
        p.line(b.x + b.w * 0.225, b.y - sh, b.x + b.w * 0.225, b.y + 6 - sh * 0.3);
        p.line(b.x + b.w * 0.775, b.y - sh, b.x + b.w * 0.775, b.y + 6);
        p.stroke(locked ? (good ? C.ok : C.bad) : good ? C.ok : C.N); p.strokeWeight(3); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 18);
        wheels.forEach(wh => {
          const val = v[wh.key];
          p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.bg); p.rect(wh.x, wh.y, wh.w, wh.h, 10);
          p.noStroke(); p.fill(locked ? C.mute : C.Z); p.textAlign(p.CENTER, p.CENTER); p.textSize(14); p.textStyle(p.BOLD);
          p.text('▲', wh.up.x + wh.w / 2, wh.up.y + 14); p.text('▼', wh.down.x + wh.w / 2, wh.down.y + 14);
          p.fill(C.ink); p.textSize(22); p.text(wh.key === 'rel' ? SYM[val] : String(val).replace('-', '−'), wh.x + wh.w / 2, wh.y + wh.h / 2);
          p.fill(C.mute); p.textSize(11); p.text(wh.name, wh.x + wh.w / 2, wh.y + wh.h + 10);
        });
        if (good && !locked) { p.noStroke(); p.fill(C.ok); p.textSize(14); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.text('¡abierto!', W / 2, b.y + b.h + 24); }
        if (locked && !good) { p.noStroke(); p.fill(C.ok); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fit(`era ${txtOf(r)}`, W / 2, b.y + b.h + 24, 14, W - 24); }
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const v = vals[cur];
        for (const wh of wheels) {
          const d = inside(wh.up, p.mouseX, p.mouseY) ? 1 : inside(wh.down, p.mouseX, p.mouseY) ? -1 : 0;
          if (!d) continue;
          if (wh.key === 'rel') v.rel = RELS[(RELS.indexOf(v.rel) + d + RELS.length) % RELS.length];
          else { const n = +(v[wh.key] + d * wh.step).toFixed(2); v[wh.key] = n > wh.max ? wh.min : n < wh.min ? wh.max : n; }
          touched[cur] = true; api.sfx?.tap?.(); api.ready(touched.every(Boolean));
          return false;
        }
      };
    }, 1.35);

    return {
      loaded: m.ready,
      getState: () => ({ vals: vals.map(v => ({ ...v })) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, texOf };
})();
