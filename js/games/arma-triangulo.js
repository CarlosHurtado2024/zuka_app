// Arma el triángulo (trigonometría, razones): un triángulo rectángulo sobre una cuadrícula con el
// ángulo θ abajo a la izquierda; se arrastran la esquina del cateto adyacente y la punta del opuesto
// (números enteros) hasta que la razón pedida (sen, cos, tan, csc, sec o cot) valga lo que se pide.
// La hipotenusa y la razón se ven en vivo. Rondas con pestañas.
// params = { max, rounds: [{ fn, num, den }] }   state = { legs: [{ a, b }] }  (a: adyacente, b: opuesto)

GAMES['arma-triangulo'] = (() => {
  const NAMES = { sen: 'sen', cos: 'cos', tan: 'tan', csc: 'csc', sec: 'sec', cot: 'cot' };
  const FRAC = { sen: 'op/hip', cos: 'ady/hip', tan: 'op/ady', csc: 'hip/op', sec: 'hip/ady', cot: 'ady/op' };
  function ratio(fn, a, b) {
    const h = Math.hypot(a, b);
    return { sen: b / h, cos: a / h, tan: b / a, csc: h / b, sec: h / a, cot: a / b }[fn];
  }
  // Catetos enteros: la razón tiene que ser exacta (con 0.005 de tolerancia, 7 y 3 «daban» cos = 12/13).
  const hit = (leg, r) => !!leg && Math.abs(ratio(r.fn, leg.a, leg.b) - r.num / r.den) < 1e-9;
  const tex = fn => (fn === 'sen' ? '\\operatorname{sen}' : `\\${fn}`);
  // Catetos más pequeños (enteros, hasta max) que dan la razón pedida.
  function example(r, max) {
    for (let s = 2; s <= 2 * max; s++) for (let a = 1; a < s && a <= max; a++) { const b = s - a; if (b <= max && hit({ a, b }, r)) return { a, b }; }
    return null;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => hit(state.legs[i], r));
    const solution = params.rounds.map(r => {
      const e = example(r, params.max);
      return `$${tex(r.fn)}\\theta = \\frac{${r.num}}{${r.den}}$${e ? ` (adyacente ${e.a}, opuesto ${e.b})` : ''}`;
    }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, max = params.max;
    const st = { legs: params.rounds.map(() => ({ a: 3, b: 2 })) };
    const touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], ox = 0, oy = 0, u = 0, drag = null;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      u = Math.min((w - 70) / max, (h - 190) / max);
      ox = 34; oy = 76 + u * max;
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(touched.every(Boolean));
    const hypTxt = (a, b) => { const s = a * a + b * b, r = Math.round(Math.sqrt(s)); return r * r === s ? String(r) : `√${s}`; };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], { a, b } = st.legs[cur], good = hit(st.legs[cur], r);
        tabs.forEach((t, i) => {
          const ok = hit(st.legs[i], params.rounds[i]);
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.LEFT, p.CENTER); p.text('Meta:', 12, 54);
        p.fill(C.N); p.textStyle(p.BOLD); p.textSize(20); p.text(`${NAMES[r.fn]} θ = ${r.num}/${r.den}`, 54, 54);

        // Cuadrícula.
        p.stroke(C.line); p.strokeWeight(1);
        for (let k = 0; k <= max; k++) { p.line(ox + k * u, oy, ox + k * u, oy - max * u); p.line(ox, oy - k * u, ox + max * u, oy - k * u); }
        // El triángulo: adyacente (abajo), opuesto (derecha) e hipotenusa.
        const A = [ox, oy], B = [ox + a * u, oy], T = [ox + a * u, oy - b * u];
        p.noStroke(); p.fill(C.Z + '22'); p.triangle(...A, ...B, ...T);
        const col = locked ? (good ? C.ok : C.bad) : null;
        p.strokeWeight(5);
        p.stroke(col || C.Z); p.line(...A, ...B);
        p.stroke(col || C.I); p.line(...B, ...T);
        p.stroke(col || C.N); p.line(...A, ...T);
        p.noFill(); p.stroke(C.mute); p.strokeWeight(1.5); p.rect(B[0] - 10, B[1] - 10, 10, 10);
        p.stroke(C.N); p.strokeWeight(2.5); p.arc(ox, oy, 46, 46, -Math.atan2(b, a), 0);
        p.noStroke(); p.fill(C.N); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.LEFT, p.BOTTOM); p.text('θ', ox + 26, oy - 3);
        // Asas.
        p.fill(C.Z); p.circle(...B, 18); p.fill(C.I); p.circle(...T, 18);
        // Rótulos de los lados.
        p.textSize(12); p.textAlign(p.CENTER, p.TOP); p.fill(C.Z); p.text(`ady ${a}`, ox + a * u / 2, oy + 6);
        p.textAlign(p.LEFT, p.CENTER); p.fill(C.I); p.text(`op ${b}`, B[0] + 12, oy - b * u / 2);
        p.textAlign(p.RIGHT, p.BOTTOM); p.fill(C.N); p.text(`hip ${hypTxt(a, b)}`, ox + a * u / 2 - 6, oy - b * u / 2 - 6);
        // Lectura de la razón.
        const val = ratio(r.fn, a, b);
        p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(16); p.fill(good ? C.ok : C.ink);
        p.text(`${NAMES[r.fn]} θ = ${FRAC[r.fn]} = ${val.toFixed(3)}`, W / 2, oy + 34);
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12);
        p.text(`meta: ${r.num}/${r.den} = ${(r.num / r.den).toFixed(3)}`, W / 2, oy + 54);
        if (locked && !good) { const e = example(r, max); if (e) { p.fill(C.ok); p.textStyle(p.BOLD); p.text(`por ejemplo: adyacente ${e.a} y opuesto ${e.b}`, W / 2, oy + 74); } }
        else { p.fill(C.mute); p.text('Arrastra la esquina azul y la punta coral', W / 2, oy + 74); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const { a, b } = st.legs[cur];
        const dB = Math.hypot(p.mouseX - (ox + a * u), p.mouseY - oy), dT = Math.hypot(p.mouseX - (ox + a * u), p.mouseY - (oy - b * u));
        if (Math.min(dB, dT) < 30) { drag = dT <= dB ? 'b' : 'a'; return false; }
      };
      p.mouseDragged = () => {
        if (!drag) return;
        const leg = st.legs[cur];
        if (drag === 'a') leg.a = Math.max(1, Math.min(max, Math.round((p.mouseX - ox) / u)));
        else leg.b = Math.max(1, Math.min(max, Math.round((oy - p.mouseY) / u)));
        touched[cur] = true; ready();
        return false;
      };
      p.mouseReleased = () => { if (!drag) return; drag = null; api.sfx?.tap?.(); return false; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ legs: st.legs.map(l => ({ ...l })) }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, ratio };
})();
