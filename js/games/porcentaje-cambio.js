// El porcentaje de cambio (Álgebra, aumentos y descuentos). Una cantidad pasa de un valor viejo a uno nuevo (dos barras).
// Con −10, −1, +1, +10 se fija cuánto cambió en porcentaje: (nuevo − viejo) / viejo · 100. Una regla marca cada 10 %
// de la cantidad vieja, que es el 100 %. Enseña que el cambio se mide sobre el valor de antes y que subir y bajar no son
// simétricos (de 40 a 50 es +25 %, pero de 50 a 40 es −20 %).
// params = { rounds: [{ from, to, unit }] }   state = { pcts: [número | null por ronda] }

GAMES['porcentaje-cambio'] = (() => {
  const changeOf = r => Math.round(((r.to - r.from) / r.from) * 100 * 1e6) / 1e6;
  const okRound = (v, r) => v === changeOf(r);
  const sign = v => (v > 0 ? `+${v}` : String(v).replace('-', '−'));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okRound(state.pcts?.[i], r));
    return { ok, solution: params.rounds.map(r => `${r.from} → ${r.to}: ${sign(changeOf(r))} %`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const V = R.map(() => 0), touched = R.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], B = [];

    function layout(w, h) {
      W = w; H = h; tabs = roundTabs(R.length, w);
      const bw = (w - 24 - 18) / 4;
      B = [-10, -1, 1, 10].map((d, k) => ({ d, x: 12 + k * (bw + 6), y: h - 48, w: bw, h: 36 }));
    }
    function step(d) {
      if (locked) return;
      V[cur] = Math.max(-100, Math.min(300, V[cur] + d)); touched[cur] = true;
      api.ready(touched.every(Boolean)); api.sfx?.tap?.();
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], good = okRound(V[cur], r), v = locked && !good ? changeOf(r) : V[cur];
        drawTabs(p, C, tabs, cur, i => (locked ? (okRound(V[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Q : C.line));
        p.textAlign(p.CENTER, p.CENTER); p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD);
        fitText(p, `Pasó de ${r.from} a ${r.to}${r.unit ? ' ' + r.unit : ''}`, W / 2, 56, W - 24, 15);
        p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, '¿En qué porcentaje cambió?', W / 2, 78, W - 24, 12);
        // Barras: antes (el 100 %) y después
        const base = H - 112, top = 100, mx = Math.max(r.from, r.to) * 1.08;
        const hh = val => ((base - top) * Math.max(0, val)) / mx, bw = Math.min(64, (W - 60) / 2);
        const xa = W / 2 - bw - 12, xb = W / 2 + 12;
        // Regla de porcentajes de «antes»: una raya cada 10 % (más marcada cada 50 %), para medir sin dar la respuesta.
        for (let k = 1; r.from * k / 10 <= mx; k++) {
          const y = base - hh(r.from * k / 10), big = k % 5 === 0;
          p.stroke(C.line); p.strokeWeight(big ? 1.5 : 0.8); p.line(xa - (big ? 10 : 5), y, xb + bw, y);
          if (big) { p.noStroke(); p.fill(C.mute); p.textSize(9); p.textAlign(p.RIGHT, p.CENTER); p.text(`${k * 10} %`, xa - 12, y); p.textAlign(p.CENTER, p.CENTER); }
        }
        p.noStroke(); p.fill(C.sky); p.rect(xa, base - hh(r.from), bw, hh(r.from), 6, 6, 0, 0);
        p.fill(C.sun); p.rect(xb, base - hh(r.to), bw, hh(r.to), 6, 6, 0, 0);
        if (locked && !good) {   // al fallar: lo elegido (rojo) y lo correcto (verde) aplicados a «antes»
          const mine = r.from * (1 + V[cur] / 100);
          p.drawingContext.setLineDash([5, 4]); p.noFill(); p.strokeWeight(2);
          p.stroke(C.bad); p.rect(xb - 4, base - hh(mine), bw + 8, hh(mine));
          p.stroke(C.ok); p.rect(xb - 7, base - hh(r.to), bw + 14, hh(r.to));
          p.drawingContext.setLineDash([]);
        }
        p.stroke(C.mute); p.strokeWeight(2); p.line(16, base, W - 16, base);
        // Los valores van dentro de las barras: arriba de ellas cruzaría la regla.
        p.noStroke(); p.fill(C.bg); p.textStyle(p.BOLD); p.textSize(13);
        p.fill(inkOn(C.sky, C.bg)); p.text(String(r.from), xa + bw / 2, base - hh(r.from) + 12); p.fill(inkOn(C.sun, C.bg)); p.text(String(r.to), xb + bw / 2, base - hh(r.to) + 12);
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11);
        p.text('antes (100 %)', xa + bw / 2, base + 12); p.text('después', xb + bw / 2, base + 12);
        // Lectura del cambio elegido
        p.fill(locked ? C.ok : C.brand); p.textStyle(p.BOLD);
        drawPill(p, C, `cambio: ${sign(v)} %`, W / 2, base + 38, locked ? C.ok : C.sun, 16);
        for (const b of B) {
          drawTile(p, C, b, b.d > 0 ? `+${b.d}` : `−${-b.d}`, { fill: b.d > 0 ? C.mint : C.coral, r: 9, lift: 2, size: 15 });
        }
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY;
        const tb = tabs.findIndex(b => hitBox(b, x, y));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        const b = B.find(b => hitBox(b, x, y));
        if (b) { step(b.d); return false; }
      };
    }, 1.35);

    return {
      loaded: m.ready,
      getState: () => ({ pcts: V.map((v, i) => (touched[i] ? v : null)) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, changeOf };
})();
