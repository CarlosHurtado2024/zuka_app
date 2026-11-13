// La cadena de sellos (Álgebra 1.3, cambios porcentuales sucesivos): una etiqueta de precio 100 recorre una
// banda con dos estaciones de sello. Se tocan dos sellos de la bandeja (+10 %, −50 %…) para ponerlos en las
// estaciones y la etiqueta muestra el precio tras cada uno. Meta: que el efecto total sea el pedido. Los
// cambios se multiplican: +10 % y +10 % suben 21 %, no 20 %; +50 % y −50 % dejan el 75 %.
// params = { stamps: [porcentajes], rounds: [{ goal: factor total, text }] }   state = { picks: [[i, j]] }

GAMES['cadena-cambios'] = (() => {
  const fac = s => 1 + s / 100;
  const factorOf = (stamps, pk) => pk.reduce((f, i) => f * fac(stamps[i]), 1);
  const good = (stamps, pk, r) => !!pk && pk.length === 2 && pk[0] !== pk[1] && Math.abs(factorOf(stamps, pk) - r.goal) < 1e-9;
  const pct = s => `${s > 0 ? '+' : '−'}${Math.abs(s)} %`;
  const num = v => String(+v.toFixed(2));
  function example(stamps, r) {
    for (let i = 0; i < stamps.length; i++) for (let j = 0; j < stamps.length; j++) if (good(stamps, [i, j], r)) return [i, j];
    return null;
  }

  function grade(state, params) {
    const S = params.stamps;
    const ok = params.rounds.every((r, i) => good(S, state.picks?.[i], r));
    const solution = params.rounds.map(r => { const e = example(S, r); return e ? `${pct(S[e[0]])} y ${pct(S[e[1]])}: ×${num(fac(S[e[0]]))} · ×${num(fac(S[e[1]]))} = ×${num(r.goal)}` : ''; }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, S = params.stamps;
    const st = { picks: R.map(() => []) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], tray = [], stations = [], tagX = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      const sw = Math.min(90, (w - 60) / 3);
      stations = [0, 1].map(k => ({ x: w * (k ? 0.68 : 0.32) - sw / 2, y: 110, w: sw, h: 44 }));
      const cols = 4, tw = (w - 28 - (cols - 1) * 8) / cols, th = 40, rows = Math.ceil(S.length / cols), y0 = h - rows * (th + 8) - 26;
      tray = S.map((_, i) => ({ x: 14 + (i % cols) * (tw + 8), y: y0 + Math.floor(i / cols) * (th + 8), w: tw, h: th }));
    }
    const ready = () => api.ready(st.picks.every(pk => pk.length === 2));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function stamp(b, s, col) {
        // Sello relleno: menta si sube, coral si baja.
        drawTile(p, C, b, pct(s), { fill: s > 0 ? C.mint : C.coral, size: 17, ring: col === C.brand ? C.sun : null });
      }
      function tag(x, y, v, col) {
        p.stroke(col); p.strokeWeight(2.5); p.fill(C.cream);
        p.beginShape(); p.vertex(x - 30, y - 18); p.vertex(x + 22, y - 18); p.vertex(x + 34, y); p.vertex(x + 22, y + 18); p.vertex(x - 30, y + 18); p.endShape(p.CLOSE);
        p.noStroke(); p.fill(col); p.circle(x + 20, y, 5);
        p.fill(inkOn(C.cream, C.ink)); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, num(v), x - 5, y + 1, 50, 15);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], pk = st.picks[cur], ok = good(S, pk, r);
        drawTabs(p, C, tabs, cur, i => (locked ? (good(S, st.picks[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.picks[i].length === 2 ? C.Z : C.line));
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(15); p.textAlign(p.LEFT, p.TOP);
        p.text(r.text, 14, 48, W - 28, 48);
        // Banda transportadora con las dos estaciones
        const beltY = 200;
        p.stroke(C.mute); p.strokeWeight(3); p.line(14, beltY + 22, W - 14, beltY + 22);
        for (let k = 0; k < 14; k++) { const x = 14 + ((k * 28 + (locked ? 0 : p.frameCount * 0.6)) % (W - 28)); p.strokeWeight(1.5); p.line(x, beltY + 26, x - 6, beltY + 34); }
        stations.forEach((b, k) => {
          p.stroke(C.mute); p.strokeWeight(2); p.line(b.x + b.w / 2, b.y + b.h, b.x + b.w / 2, beltY - 22);
          if (pk[k] != null) stamp(b, S[pk[k]], C.brand);
          else { p.noFill(); p.stroke(C.line); p.strokeWeight(1.5); p.drawingContext.setLineDash([4, 4]); p.rect(b.x, b.y, b.w, b.h, 10); p.drawingContext.setLineDash([]); p.noStroke(); p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER); p.text(`sello ${k + 1}`, b.x + b.w / 2, b.y + b.h / 2); }
        });
        // Etiquetas: al inicio, tras el sello 1 y tras el sello 2
        const v1 = pk[0] != null ? 100 * fac(S[pk[0]]) : null, v2 = pk.length === 2 ? v1 * fac(S[pk[1]]) : null;
        tag(44, beltY, 100, C.mute);
        if (v1 != null) tag(W / 2, beltY, v1, C.Z);
        if (v2 != null) tag(W - 50, beltY, v2, ok ? C.ok : C.N);
        // Efecto total
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER);
        if (v2 != null) {
          const d = +(v2 - 100).toFixed(2);
          p.fill(ok ? C.ok : C.ink); p.textStyle(p.BOLD); p.textSize(16);
          p.text(`total: ×${num(v2 / 100)}  (${d === 0 ? 'igual' : d > 0 ? `sube ${num(d)} %` : `baja ${num(-d)} %`})`, W / 2, beltY + 54);
        } else { p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.text('Toca dos sellos de la bandeja', W / 2, beltY + 54); }
        tray.forEach((b, i) => {
          if (pk.includes(i)) drawSlot(p, C, b);
          else stamp(b, S[i], locked ? C.line : C.mute);
        });
        p.noStroke(); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        const e = locked && !ok ? example(S, r) : null;
        if (e) { p.fill(C.ok); p.textStyle(p.BOLD); p.text(`Por ejemplo: ${pct(S[e[0]])} y luego ${pct(S[e[1]])}`, W / 2, H - 12); }
        else { p.fill(C.mute); p.textStyle(p.NORMAL); p.text('Toca un sello puesto para quitarlo', W / 2, H - 12); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const pk = st.picks[cur];
        const s = stations.findIndex((b, k) => pk[k] != null && hitBox(b, p.mouseX, p.mouseY));
        if (s >= 0) { pk.splice(s, 1); api.sfx?.tap?.(); ready(); return false; }
        const i = tray.findIndex((b, i) => !pk.includes(i) && hitBox(b, p.mouseX, p.mouseY));
        if (i >= 0 && pk.length < 2) { pk.push(i); api.sfx?.tap?.(); ready(); return false; }
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ picks: st.picks.map(pk => [...pk]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, factorOf };
})();
