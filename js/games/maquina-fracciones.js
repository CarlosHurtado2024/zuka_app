// Máquina de fracciones (lección 1.1): con dos ruedas se arma numerador/denominador de un decimal
// periódico; la máquina simplifica la fracción y calcula su decimal para comparar.
// params = { decimal (TeX), label (texto), target: [p, q], max }   state = { num, den }

GAMES['maquina-fracciones'] = (() => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

  function grade(state, params) {
    const [tp, tq] = params.target;
    const ok = state.den > 0 && state.num * tq === tp * state.den;
    return { ok, solution: `$${params.decimal} = \\dfrac{${tp}}{${tq}}$` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { num: 0, den: 0 };
    let locked = false, wheels = [], buttons = [], drag = null, W = 0, H = 0;

    function layout(w, h) {
      W = w; H = h;
      const ww = w * 0.36, top = h * 0.3, wh = h * 0.34;
      wheels = [
        { key: 'num', name: 'numerador', x: w * 0.25 - ww / 2, y: top, w: ww, h: wh },
        { key: 'den', name: 'denominador', x: w * 0.75 - ww / 2, y: top, w: ww, h: wh },
      ];
      // Botones: +1 y +10 arriba de cada rueda, −1 y −10 abajo.
      buttons = [];
      wheels.forEach(wl => {
        const bw = (wl.w - 6) / 2, bh = 30;
        [[1, 0, wl.y - bh - 6], [10, 1, wl.y - bh - 6], [-1, 0, wl.y + wl.h + 6], [-10, 1, wl.y + wl.h + 6]].forEach(([d, col, y]) =>
          buttons.push({ key: wl.key, d, x: wl.x + col * (bw + 6), y, w: bw, h: bh }));
      });
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    function setVal(key, v) {
      const nv = Math.max(0, Math.min(params.max, Math.round(v)));
      st[key] = nv;
      api.ready(st.den > 0);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function wheel(wl) {
        const v = st[wl.key];
        p.stroke(drag?.key === wl.key ? C.brand : C.line); p.strokeWeight(2.5); p.fill(C.card); p.rect(wl.x, wl.y, wl.w, wl.h, 16);
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        const cy = wl.y + wl.h / 2;
        // Vecinos tenues arriba y abajo, como en una rueda de combinación.
        p.fill(C.mute + '66'); p.textSize(22);
        if (v + 1 <= params.max) p.text(v + 1, wl.x + wl.w / 2, cy - wl.h * 0.3);
        if (v - 1 >= 0) p.text(v - 1, wl.x + wl.w / 2, cy + wl.h * 0.3);
        p.fill(C.ink); p.textSize(Math.min(44, wl.w / 2.6)); p.text(v, wl.x + wl.w / 2, cy);
        p.fill(C.mute); p.textSize(12); p.text(wl.name, wl.x + wl.w / 2, wl.y + wl.h + 48);
      }

      p.draw = () => {
        p.background(C.bg);
        // Pantalla del objetivo.
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textSize(13); p.textStyle(p.BOLD);
        p.text('Arma una fracción igual a', W / 2, 10);
        p.fill(C.Q); p.textSize(26); p.text(params.label, W / 2, 28);
        wheels.forEach(wheel);
        p.noStroke(); p.fill(C.ink); p.textSize(48); p.textAlign(p.CENTER, p.CENTER);
        p.text('/', W / 2, wheels[0].y + wheels[0].h / 2);
        buttons.forEach(b => {
          p.stroke(C.line); p.strokeWeight(2); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 9);
          p.noStroke(); p.fill(C.ink); p.textSize(15); p.textAlign(p.CENTER, p.CENTER);
          p.text((b.d > 0 ? '+' : '−') + Math.abs(b.d), b.x + b.w / 2, b.y + b.h / 2 + 1);
        });
        // La máquina: simplifica y divide.
        const my = H * 0.82, mh = H * 0.15;
        const [tp, tq] = params.target, good = st.den > 0 && st.num * tq === tp * st.den;
        p.stroke(locked ? (good ? C.ok : C.bad) : C.brand); p.strokeWeight(2.5); p.fill(C.card); p.rect(12, my, W - 24, mh, 14);
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textSize(Math.min(20, W / 17)); p.fill(C.ink);
        let out;
        if (locked && !good) out = `${params.label} = ${tp}/${tq}`;
        else if (st.den === 0) out = 'El denominador no puede ser 0';
        else {
          const g = gcd(st.num, st.den) || 1, s = `${st.num / g}/${st.den / g}`;
          out = `${st.num}/${st.den}${g > 1 ? ' = ' + s : ''} = ${(st.num / st.den).toFixed(6).replace(/0+$/, '').replace(/\.$/, '')}…`;
        }
        p.text(out, W / 2, my + mh / 2);
      };

      p.mousePressed = () => {
        if (locked) return;
        const b = buttons.find(b => inside(b, p.mouseX, p.mouseY));
        if (b) { api.sfx?.tap?.(); setVal(b.key, st[b.key] + b.d); return false; }
        const wl = wheels.find(w => inside(w, p.mouseX, p.mouseY));
        if (wl) { drag = { key: wl.key, y: p.mouseY, v: st[wl.key] }; return false; }
      };
      // Arrastrar hacia arriba sube el número; cuanto más lejos, más rápido.
      p.mouseDragged = () => {
        if (!drag) return;
        const dy = drag.y - p.mouseY;
        setVal(drag.key, drag.v + Math.sign(dy) * Math.floor(Math.pow(Math.abs(dy) / 10, 1.5)));
        return false;
      };
      p.mouseReleased = () => { if (drag) { drag = null; return false; } };
    }, 1.05);

    return {
      loaded: m.ready,
      getState: () => ({ ...st }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
