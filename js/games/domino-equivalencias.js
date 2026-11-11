// Dominó de equivalencias (evaluaciones). Arriba está la cara de salida y abajo la de llegada; en la bandeja,
// fichas de dominó con dos caras. Se tocan fichas para ponerlas en la cadena: la cara izquierda de cada
// ficha debe valer lo mismo que la cara derecha de la anterior (escrita de otra forma: 0.25 y 1/4), y la
// última debe llegar a la cara final. Sobran fichas trampa. Tocar una ficha de la cadena la devuelve a la
// bandeja junto con las que van después.
// params = { rounds: [{ start: { t, v }, end: { t, v }, need, tiles: [{ a, av, b, bv }] }] }
// state = { chains: [[índice de ficha, …] por ronda] }

GAMES['domino-equivalencias'] = (() => {
  const same = (x, y) => (typeof x === 'number' && typeof y === 'number' ? Math.abs(x - y) < 1e-9 : String(x) === String(y));
  const valid = (c, r) => Array.isArray(c) && c.length === r.need && new Set(c).size === c.length && c.every(k => r.tiles[k])
    && same(r.start.v, r.tiles[c[0]].av) && c.every((k, i) => i === 0 || same(r.tiles[c[i - 1]].bv, r.tiles[k].av))
    && same(r.tiles[c[c.length - 1]].bv, r.end.v);

  function chainOf(r) {
    const walk = (c, last) => {
      if (c.length === r.need) return same(last, r.end.v) ? c : null;
      for (let k = 0; k < r.tiles.length; k++) {
        if (c.includes(k) || !same(r.tiles[k].av, last)) continue;
        const got = walk([...c, k], r.tiles[k].bv);
        if (got) return got;
      }
      return null;
    };
    return walk([], r.start.v);
  }

  function solve(params) {
    const chains = params.rounds.map(chainOf);
    return chains.every(Boolean) ? { chains } : null;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => valid(state.chains?.[i], r));
    const solution = params.rounds.map(r => [r.start.t, ...(chainOf(r) || []).map(k => `[${r.tiles[k].a} | ${r.tiles[k].b}]`), r.end.t].join(' → ')).join(' · ');
    return { ok, solution };
  }

  // Alto del lienzo según el contenido (no según el ancho): así cabe igual en un celular de 300 px.
  const aspectFor = (host, px) => Math.max(1, px / Math.max(240, Math.floor(host.clientWidth || 320)));

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const CH = R.map(() => []);
    // Columnas de la bandeja: se deciden una vez, con el ancho inicial, igual que el alto del lienzo.
    const cols = Math.floor(host.clientWidth || 320) < 340 ? 1 : 2;
    const TRAY = R.map((r, i) => shuffledOrder(r.tiles.length, `dom${i}${r.tiles.map(t => t.a).join()}`));
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], hits = [];

    function layout(w, h) { W = w; H = h; tabs = R.length > 1 ? roundTabs(R.length, w) : []; }

    // Cara con texto: si no cabe a 12 px y tiene espacios, va en dos líneas (corte cerca del centro).
    function faceText(p, t, cx, cy, maxW) {
      p.textSize(12);
      const sp = [...t].reduce((best, ch, i) => (ch === ' ' && (best < 0 || Math.abs(i - t.length / 2) < Math.abs(best - t.length / 2)) ? i : best), -1);
      if (p.textWidth(t) > maxW && sp > 0) { fitText(p, t.slice(0, sp), cx, cy - 7, maxW, 13); fitText(p, t.slice(sp + 1), cx, cy + 8, maxW, 13); }
      else fitText(p, t, cx, cy, maxW, 16);
    }
    function tile(p, x, y, w, h, a, b, col, fillCol) {
      p.stroke(col); p.strokeWeight(2.5); p.fill(fillCol || C.card); p.rect(x, y, w, h, 9);
      p.strokeWeight(1.5); p.line(x + w / 2, y + 6, x + w / 2, y + h - 6);
      p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD);
      faceText(p, a, x + w / 4, y + h / 2, w / 2 - 10); faceText(p, b, x + 3 * w / 4, y + h / 2, w / 2 - 10);
    }
    function face(p, x, y, w, h, t, col, dashed) {
      p.stroke(col); p.strokeWeight(2.5); p.fill(C.card);
      if (dashed) p.drawingContext.setLineDash([6, 5]);
      p.rect(x, y, w, h, 9); p.drawingContext.setLineDash([]);
      p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); faceText(p, t, x + w / 2, y + h / 2, w - 12);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg); hits = [];
        const r = R[cur], chain = locked && !valid(CH[cur], r) ? (chainOf(r) || []) : CH[cur], good = valid(CH[cur], r);
        if (tabs.length) drawTabs(p, C, tabs, cur, i => (locked ? (valid(CH[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : CH[i].length ? C.R : C.line));
        const top = tabs.length ? 50 : 10, tw = Math.min(W - 40, 250), th = 38, hw = tw / 2, x0 = (W - tw) / 2;
        const col = locked ? C.ok : C.brand;
        p.textAlign(p.CENTER, p.CENTER);
        // Cara de salida: ocupa la mitad derecha, para que la primera ficha se enganche debajo por la izquierda.
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(10); p.text('SALIDA', x0 + hw / 2, top + th / 2);
        face(p, x0 + hw, top, hw, th, r.start.t, C.ok, false);
        // Cada unión va en diagonal de la cara derecha de arriba a la cara izquierda de abajo: esas son las que valen lo mismo.
        const link = (y1, y2) => { p.stroke(C.mute); p.strokeWeight(2); p.line(x0 + 3 * hw / 2, y1, x0 + hw / 2, y2); p.noStroke(); p.fill(C.mute); p.circle(x0 + hw / 2, y2, 5); };
        let y = top + th + 16;
        chain.forEach((k, i) => {
          const t = r.tiles[k];
          link(y - 16, y);
          tile(p, x0, y, tw, th, t.a, t.b, col);
          hits.push({ x: x0, y, w: tw, h: th, chain: i });
          y += th + 16;
        });
        // Cara de llegada
        const done = chain.length === r.need;
        if (done) link(y - 16, y);
        p.noStroke(); p.fill(C.mute); p.textSize(10); p.textStyle(p.BOLD); p.text('LLEGADA', x0 + 3 * hw / 2, y + th / 2);
        face(p, x0, y, hw, th, r.end.t, locked && done ? C.ok : C.N, !done);
        y += th + 18;
        // Bandeja
        p.stroke(C.line); p.strokeWeight(1); p.line(12, y - 8, W - 12, y - 8);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12);
        p.text(locked ? (good ? '¡Cadena completa!' : 'Así se encadenaban') : 'Toca una ficha para ponerla en la cadena', W / 2, y + 2);
        y += 16;
        const free = TRAY[cur].filter(k => !CH[cur].includes(k)), bw = cols === 1 ? Math.min(W - 24, 260) : (W - 36) / 2;
        free.forEach((k, j) => {
          const x = cols === 1 ? (W - bw) / 2 : 12 + (j % 2) * (bw + 12), yy = y + Math.floor(j / cols) * (th + 10), t = r.tiles[k];
          tile(p, x, yy, bw, th, t.a, t.b, locked ? C.line : C.R);
          hits.push({ x, y: yy, w: bw, h: th, tray: k });
        });
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY;
        const tb = tabs.findIndex(b => hitBox(b, x, y));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const h = hits.find(b => hitBox(b, x, y));
        if (!h) return;
        const c = CH[cur];
        if (h.tray != null) { if (c.length < R[cur].need) c.push(h.tray); else return api.sfx?.bad?.(), false; }
        else c.length = h.chain;
        api.sfx?.tap?.();
        api.ready(CH.every((ch, i) => ch.length === R[i].need));
        return false;
      };
    }, aspectFor(host, Math.max(...R.map(r => (R.length > 1 ? 50 : 10) + 54 * (r.need + 1) + 38 + 34 + 48 * Math.ceil(r.tiles.length / cols) + 6))));

    return {
      loaded: m.ready,
      getState: () => ({ chains: CH.map(c => [...c]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, solve };
})();
