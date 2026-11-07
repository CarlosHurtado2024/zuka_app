// El tanque pitagórico (trigonometría, identidades fundamentales): un tanque transparente muestra una
// identidad como líquidos apilados. Con sen²θ + cos²θ = 1, el rosa (el cuadrado del dato) ya está y hay
// que ajustar la otra razón para que el cian llene justo hasta la marca 1. Con 1 + tan²θ = sec²θ, la
// capa gris es el 1 y la marca de arriba es sec²θ. Si te pasas, el tanque se rebosa. La perilla da el
// valor (de 0.01 en 0.01, con − / + y arrastre) y el botón ± el signo, que decide el cuadrante.
// params = { rounds: [{ id: 'sc' | 'ts', given, value, ask, q }] }   state = { vals: [número | null] }

GAMES['tanque-pitagorico'] = (() => {
  const MAX = { sc: 1, ts: 3 };
  const POS = { sen: [1, 2], cos: [1, 4], tan: [1, 3], sec: [1, 4] };
  const sq = v => v * v;
  function target(r) {
    const v = r.value;
    const mag = r.id === 'sc' ? Math.sqrt(Math.max(0, 1 - sq(v))) : r.ask === 'sec' ? Math.sqrt(1 + sq(v)) : Math.sqrt(Math.max(0, sq(v) - 1));
    const sign = POS[r.ask].includes(r.q) ? 1 : -1;
    return Math.round(sign * mag * 1e9) / 1e9;
  }
  const good = (v, r) => v != null && Math.abs(v - target(r)) < 0.005;
  const f2 = v => (+v.toFixed(2)).toString().replace('-', '−');

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => good(state.vals[i], r));
    const solution = params.rounds.map(r => `${r.ask} θ = ${f2(target(r))}`).join(' · ');
    return { ok, solution };
  }

  // Capas del tanque y nivel de la marca para un valor elegido v.
  function layers(r, v) {
    const w = v ?? 0, cap = Math.max(1 + sq(r.value), sq(target(r)), sq(r.value)) * 1.4;
    if (r.id === 'sc') return { stack: [[r.given, sq(r.value)], [r.ask, sq(w)]], mark: 1, cap: 1.25 };
    if (r.ask === 'sec') return { stack: [['1', 1], ['tan', sq(r.value)]], mark: sq(w), cap };
    return { stack: [['1', 1], ['tan', sq(w)]], mark: sq(r.value), cap };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { vals: params.rounds.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], tank = null, dial = null, minus = null, plus = null, sign = null, drag = false, slosh = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      tank = { x: 30, y: 112, w: Math.min(150, w - 214), h: h - 250 };
      dial = { x: w - 64, y: tank.y, w: 30, h: tank.h };
      const by = h - 112, bx = Math.min(tank.x + tank.w + 14, w - 166);
      minus = { x: bx, y: by, w: 46, h: 40 }; plus = { x: bx + 54, y: by, w: 46, h: 40 };
      sign = { x: bx, y: by - 52, w: 100, h: 40 };
    }
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const mag = () => Math.abs(st.vals[cur] ?? 0);
    const neg = () => (st.vals[cur] ?? 0) < 0 || Object.is(st.vals[cur], -0);
    const setVal = (m, negative) => {
      const r = params.rounds[cur], mm = Math.round(Math.min(MAX[r.id], Math.max(0, m)) * 100) / 100;
      st.vals[cur] = negative ? -mm : mm; slosh = 1;
      api.ready(st.vals.every(v => v !== null));
    };
    const COL = name => ({ sen: C.I, cos: C.Z, tan: C.Q, sec: C.R, 1: C.line })[name];

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], v = st.vals[cur], L = layers(r, v);
        slosh = Math.max(0, slosh - 0.04);
        tabs.forEach((t, i) => {
          const col = locked ? (good(st.vals[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.vals[i] !== null ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        const quad = ['', 'I', 'II', 'III', 'IV'][r.q];
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        let ts = 17; p.textSize(ts);
        const ask = `${r.given} θ = ${f2(r.value)}  ·  θ en el cuadrante ${quad}  ·  ¿${r.ask} θ?`;
        while (p.textWidth(ask) > W - 20 && ts > 11) p.textSize(--ts);
        p.fill(C.N); p.text(ask, W / 2, 54);
        p.textSize(14); p.fill(C.mute); p.text(r.id === 'sc' ? 'sen²θ + cos²θ = 1' : '1 + tan²θ = sec²θ', W / 2, 82);

        // El tanque: capas apiladas y la marca.
        const Y = val => tank.y + tank.h - (Math.min(val, L.cap) / L.cap) * tank.h;
        let base = 0, total = 0;
        L.stack.forEach(([name, amt]) => {
          const top = Math.min(base + amt, L.cap);
          const wob = slosh * 4 * Math.sin(p.frameCount * 0.3);
          p.noStroke(); p.fill(COL(name) + (name === '1' ? 'cc' : 'bb'));
          p.rect(tank.x, Y(top) + (top === base + amt ? wob : 0), tank.w, Y(base) - Y(top));
          if (Y(base) - Y(top) > 16) { p.fill(name === '1' ? C.ink : C.bg); p.textSize(12); p.textStyle(p.BOLD); p.text(name === '1' ? '1' : `${name}²θ = ${f2(amt)}`, tank.x + tank.w / 2, (Y(base) + Y(top)) / 2); }
          base += amt; total = base;
        });
        const over = v !== null && total - L.mark > 0.0001, full = v !== null && Math.abs(total - L.mark) < 0.0001;
        // Marca (en sc es fija en 1; en ts puede ser lo que el jugador elige).
        p.stroke(full ? C.ok : C.N); p.strokeWeight(3); p.line(tank.x - 12, Y(L.mark), tank.x + tank.w + 12, Y(L.mark));
        p.noStroke(); p.fill(full ? C.ok : C.N); p.textSize(12); p.textAlign(p.LEFT, p.CENTER);
        p.text(r.id === 'sc' ? '1' : `sec²θ = ${f2(L.mark)}`, tank.x + tank.w + 14, Y(L.mark) - 10);
        if (over) {   // rebosa: gotas que caen por el borde
          p.fill(C.bad);
          for (let k = 0; k < 4; k++) { const yy = (p.frameCount * 3 + k * 28) % (tank.h * 0.6); p.circle(tank.x + tank.w + 4, Y(L.mark) + yy, 6); }
        }
        p.noFill(); p.stroke(C.ink + '99'); p.strokeWeight(3); p.line(tank.x, tank.y - 10, tank.x, tank.y + tank.h); p.line(tank.x, tank.y + tank.h, tank.x + tank.w, tank.y + tank.h); p.line(tank.x + tank.w, tank.y + tank.h, tank.x + tank.w, tank.y - 10);
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textSize(13); p.fill(over ? C.bad : full ? C.ok : C.mute);
        p.text(over ? '¡se rebosa!' : full ? '¡lleno justo!' : 'falta llenar', tank.x + tank.w / 2, tank.y + tank.h + 18);

        // Perilla vertical del valor (magnitud).
        const mx = MAX[r.id], dy = dial.y + dial.h - (mag() / mx) * dial.h;
        p.stroke(C.line); p.strokeWeight(6); p.line(dial.x + dial.w / 2, dial.y, dial.x + dial.w / 2, dial.y + dial.h);
        p.noStroke(); p.fill(COL(r.ask)); p.circle(dial.x + dial.w / 2, dy, 26);
        p.fill(C.mute); p.textSize(11); p.text(String(mx), dial.x + dial.w / 2, dial.y - 12); p.text('0', dial.x + dial.w / 2, dial.y + dial.h + 12);

        // Valor elegido, signo y botones.
        const vx = (tank.x + tank.w + dial.x - 16) / 2;
        p.textStyle(p.BOLD); p.fill(v === null ? C.mute : COL(r.ask));
        p.textSize(15); p.text(`${r.ask} θ =`, vx, sign.y - 72);
        p.textSize(24); p.text(v === null ? '?' : `${neg() ? '−' : ''}${mag().toFixed(2)}`, vx, sign.y - 46);
        if (locked && !good(v, r)) { p.fill(C.ok); p.textSize(13); p.text(`era ${f2(target(r))}`, vx, sign.y - 18); }
        [[sign, neg() ? 'signo −' : 'signo +'], [minus, '−'], [plus, '+']].forEach(([b, s]) => { p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10); p.noStroke(); p.fill(C.ink); p.textSize(b === sign ? 15 : 22); p.text(s, b.x + b.w / 2, b.y + b.h / 2); });
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (inside(minus, p.mouseX, p.mouseY)) { setVal(mag() - 0.01, neg()); api.sfx?.tap?.(); return false; }
        if (inside(plus, p.mouseX, p.mouseY)) { setVal(mag() + 0.01, neg()); api.sfx?.tap?.(); return false; }
        if (inside(sign, p.mouseX, p.mouseY)) { setVal(mag(), !neg()); api.sfx?.tap?.(); return false; }
        if (inside({ x: dial.x - 16, y: dial.y - 14, w: dial.w + 32, h: dial.h + 28 }, p.mouseX, p.mouseY)) { drag = true; p.mouseDragged(); return false; }
      };
      p.mouseDragged = () => {
        if (!drag) return;
        const mx = MAX[params.rounds[cur].id];
        setVal((dial.y + dial.h - p.mouseY) / dial.h * mx, neg()); return false;
      };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.35);

    return {
      loaded: m.ready,
      getState: () => ({ vals: [...st.vals] }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, target, layers, MAX };
})();
