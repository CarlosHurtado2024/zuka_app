// La pelota que rebota (Álgebra, progresiones geométricas). Una pelota cae desde h₀ y cada rebote sube la fracción r
// del rebote anterior: h₁ = h₀ r, h₂ = h₁ r, … Se ajusta la altura de los tres primeros rebotes arrastrando la pelota o
// con − / +. Restar siempre lo mismo no sirve: la pelota pierde cada vez menos altura.
// params = { rounds: [{ h0, r, rTex }], max }   state = { hs: [[h1, h2, h3] | null por ronda] }

GAMES['rebota-pelota'] = (() => {
  const want = r => [1, 2, 3].map(k => Math.round(r.h0 * r.r ** k * 1e6) / 1e6);
  const okRound = (h, r) => Array.isArray(h) && want(r).every((v, k) => h[k] === v);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okRound(state.hs?.[i], r));
    return { ok, solution: params.rounds.map(r => `desde ${r.h0}: ${want(r).join(', ')}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, MAX = params.max || 140;
    const S = R.map(r => ({ h: [1, 2, 3].map(() => Math.round(r.h0 / 2)), touched: false }));
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], G = null, drag = null;

    function layout(w, h) { W = w; H = h; tabs = roundTabs(R.length, w); }
    const geo = () => {
      const ground = H - 70, v = (ground - 116) / MAX, L = [0, 1, 2, 3].map(k => 46 + (k * (W - 62)) / 3);
      const peaks = [0, 1, 2].map(k => (L[k] + L[k + 1]) / 2);
      const btn = peaks.map(x => ({ m: { x: x - 29, y: H - 52, w: 26, h: 34 }, p: { x: x + 3, y: H - 52, w: 26, h: 34 } }));
      return { ground, v, L, peaks, btn };
    };
    function set(k, val) {
      if (locked) return;
      const s = S[cur]; s.h[k] = Math.min(MAX, Math.max(0, Math.round(val))); s.touched = true;
      api.ready(S.every(x => x.touched));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function dashed(pts) {
        for (let i = 0; i + 1 < pts.length; i += 2) p.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], s = S[cur], good = okRound(s.h, r), hv = locked && !good ? want(r) : s.h;
        G = geo();
        const { ground, v, L, peaks, btn } = G;
        drawTabs(p, C, tabs, cur, i => (locked ? (okRound(S[i].h, R[i]) ? C.ok : C.bad) : i === cur ? C.brand : S[i].touched ? C.Q : C.line));
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(W < 300 ? 13 : 14); p.textAlign(p.CENTER, p.TOP); p.textLeading(17);
        p.text(`Cae desde ${r.h0} cm y cada rebote sube ${r.rTex} de la altura anterior`, 14, 44, W - 28, 54);
        p.textAlign(p.CENTER, p.CENTER);
        // Suelo y caída inicial
        p.stroke(C.mint); p.strokeWeight(4); p.line(8, ground, W - 8, ground);
        p.stroke(C.line); p.strokeWeight(1.5); dashed(Array.from({ length: 12 }, (_, i) => [L[0], ground - (r.h0 * v * i) / 11]));
        p.noStroke(); p.fill(C.coral); p.circle(L[0], ground - r.h0 * v, 16);
        p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.RIGHT, p.CENTER); p.text(`${r.h0}`, L[0] - 10, ground - r.h0 * v);
        p.textAlign(p.CENTER, p.CENTER);
        // Rebotes: parábolas punteadas entre los puntos de bote
        for (let k = 0; k < 3; k++) {
          const hk = hv[k] * v, a = L[k], b = L[k + 1], pts = [];
          for (let i = 0; i <= 24; i++) { const t = i / 24; pts.push([a + (b - a) * t, ground - 4 * hk * t * (1 - t)]); }
          p.stroke(locked ? C.ok : C.sky); p.strokeWeight(2); dashed(pts);
          p.noStroke(); p.fill(locked ? C.ok : C.coral); p.circle(peaks[k], ground - hk, 16);
          p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(12); p.text(String(hv[k]), peaks[k], ground - hk - 16);
          p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(10); p.text(`rebote ${k + 1}`, peaks[k], ground + 10);
          for (const [bb, t] of [[btn[k].m, '−'], [btn[k].p, '+']]) {
            drawTile(p, C, bb, t, { fill: C.sky, r: 8, lift: 2, size: 17 });
          }
        }
        if (locked && !good) { p.noStroke(); p.fill(C.ok); p.textStyle(p.BOLD); fitText(p, `Eran ${want(r).join(', ')}`, W / 2, 106, W - 24, 12); }
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY;
        const tb = tabs.findIndex(b => hitBox(b, x, y));
        if (tb >= 0) { cur = tb; drag = null; api.sfx?.tap?.(); return false; }
        if (locked || !G) return;
        for (let k = 0; k < 3; k++) {
          if (hitBox(G.btn[k].m, x, y)) { set(k, S[cur].h[k] - 1); api.sfx?.tap?.(); return false; }
          if (hitBox(G.btn[k].p, x, y)) { set(k, S[cur].h[k] + 1); api.sfx?.tap?.(); return false; }
        }
        const k = G.peaks.findIndex(px => Math.abs(x - px) < 26);
        if (k >= 0 && y < G.ground + 4 && y > 90) { drag = k; set(k, (G.ground - y) / G.v); return false; }
      };
      p.mouseDragged = () => { if (drag != null && G) { set(drag, (G.ground - p.mouseY) / G.v); return false; } };
      p.mouseReleased = () => { drag = null; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ hs: S.map(s => (s.touched ? [...s.h] : null)) }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
