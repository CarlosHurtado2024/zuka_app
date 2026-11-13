// El candado de la fracción (Álgebra 1.1, decimal ↔ fracción): el candado se abre con una fracción. Tiene
// cuatro ruedas (decenas y unidades del numerador y del denominador) que se giran con ▲ / ▼; el visor
// muestra en vivo el decimal de la fracción armada (con «…» si no termina). Cuando el visor marca el
// decimal pedido, el arco del candado salta. Sirve cualquier fracción equivalente.
// params = { rounds: [{ dec: '0.35', num: 7, den: 20 }] }   state = { fr: [[n, d]] }

GAMES['candado-fraccion'] = (() => {
  // Decimal por división larga: hasta 6 cifras; si no terminó, «…» (las 4 primeras si se repiten).
  function decimalText(n, d) {
    if (!d) return '—';
    const whole = Math.floor(n / d);
    let rem = n % d, digits = '';
    for (let k = 0; k < 6 && rem; k++) { rem *= 10; digits += Math.floor(rem / d); rem %= d; }
    if (!digits) return String(whole);
    if (!rem) return `${whole}.${digits}`;
    return `${whole}.${digits.slice(0, 4)}…`;
  }
  const same = (fr, r) => !!fr && fr[1] > 0 && fr[0] * r.den === fr[1] * r.num;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.fr?.[i], r));
    const solution = params.rounds.map(r => `${r.dec} = ${r.num}/${r.den}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { fr: R.map(() => [1, 1]) };
    const touched = R.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], wheels = [], open = R.map(() => 0);

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length, w);
      const ww = Math.min(52, (w - 80) / 4), gap = 10, total = 4 * ww + 3 * gap + 30, x0 = w / 2 - total / 2, y = h * 0.6;
      // ruedas: 0 decenas num, 1 unidades num, 2 decenas den, 3 unidades den
      wheels = [0, 1, 2, 3].map(k => {
        const x = x0 + k * (ww + gap) + (k >= 2 ? 30 : 0);
        return { x, y, w: ww, h: 62, up: { x, y: y - 36, w: ww, h: 30 }, dn: { x, y: y + 68, w: ww, h: 30 } };
      });
    }
    const digit = (k, fr) => (k === 0 ? Math.floor(fr[0] / 10) : k === 1 ? fr[0] % 10 : k === 2 ? Math.floor(fr[1] / 10) : fr[1] % 10);
    function spin(k, dir) {
      const fr = st.fr[cur], d = [0, 1, 2, 3].map(j => digit(j, fr));
      d[k] = (d[k] + dir + 10) % 10;
      fr[0] = d[0] * 10 + d[1]; fr[1] = d[2] * 10 + d[3];
      touched[cur] = true; api.ready(touched.every(Boolean));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], fr = st.fr[cur], good = same(fr, r);
        open[cur] += ((good ? 1 : 0) - open[cur]) * 0.15;
        drawTabs(p, C, tabs, cur, i => (locked ? (same(st.fr[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : same(st.fr[i], R[i]) ? C.Q : touched[i] ? C.Z : C.line));
        drawKicker(p, C, 'Se abre con la fracción de', 14, 56);
        p.noStroke(); p.textAlign(p.LEFT, p.CENTER);
        p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(26); p.text(r.dec, 14, 82);

        // El candado: arco que sube al abrirse y cuerpo con el visor.
        const cx = W / 2, bodyY = H * 0.34, bw = Math.min(W - 40, 260), bh = H * 0.48;
        const lift = open[cur] * 22, sw = bw * 0.42;
        p.noFill(); p.stroke(good ? C.ok : C.mute); p.strokeWeight(10);
        p.arc(cx, bodyY - lift, sw, sw * 0.9, Math.PI, 0);
        p.line(cx - sw / 2, bodyY - lift, cx - sw / 2, bodyY + 10 - lift);
        p.line(cx + sw / 2, bodyY - lift, cx + sw / 2, bodyY + 10 - lift * 0.2);
        // Cuerpo del candado: bloque color sol con relieve (menta cuando abre); el visor es una pantalla azul noche.
        const body = good ? C.mint : C.sun, onBody = inkOn(body, C.ink);
        p.noStroke(); p.fill(shade(body, 0.74)); p.rect(cx - bw / 2, bodyY + 9, bw, bh, 18);
        p.fill(body); p.rect(cx - bw / 2, bodyY + 4, bw, bh, 18);
        // Visor
        const vy = bodyY + 18;
        p.fill(C.night); p.rect(cx - bw / 2 + 16, vy, bw - 32, 40, 8);
        p.fill(good ? C.sun : inkOn(C.night)); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${fr[0]}/${fr[1]} = ${decimalText(fr[0], fr[1])}`, cx, vy + 21, bw - 44, 20);
        // Ruedas
        wheels.forEach((wh, k) => {
          // Rueda: ficha crema con la cifra; flechas en fichas azul noche.
          drawTile(p, C, wh, digit(k, fr), { size: 30, r: 8, lift: 2 });
          [[wh.up, '▲'], [wh.dn, '▼']].forEach(([b, s]) => drawTile(p, C, b, s, { fill: C.night, ink: locked ? '#8A8FB8' : '#FFFFFF', size: 13, r: 8, lift: 2 }));
        });
        p.noStroke(); p.fill(onBody); p.textSize(30); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        p.text('/', (wheels[1].x + wheels[1].w + wheels[2].x) / 2, wheels[0].y + 31);
        // Los rótulos pueden caer dentro del cuerpo (lienzo alto) o debajo, sobre el fondo (celular): la tinta sigue al sitio.
        p.fill(wheels[0].dn.y + 52 < bodyY + 4 + bh ? onBody : C.mute); p.textStyle(p.BOLD); p.textSize(11);
        p.text('numerador', (wheels[0].x + wheels[1].x + wheels[1].w) / 2, wheels[0].dn.y + 44);
        p.text('denominador', (wheels[2].x + wheels[3].x + wheels[3].w) / 2, wheels[0].dn.y + 44);
        p.textSize(12);
        if (locked && !good) { p.fill(C.ok); p.textStyle(p.BOLD); p.text(`Abre con ${r.num}/${r.den} = ${r.dec}`, W / 2, H - 14); }
        else if (good) { p.fill(C.ok); p.textStyle(p.BOLD); p.text('¡Clic! El candado se abrió', W / 2, H - 14); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        for (let k = 0; k < 4; k++) {
          if (hitBox(wheels[k].up, p.mouseX, p.mouseY)) { spin(k, 1); api.sfx?.tap?.(); return false; }
          if (hitBox(wheels[k].dn, p.mouseX, p.mouseY)) { spin(k, -1); api.sfx?.tap?.(); return false; }
        }
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ fr: st.fr.map(f => [...f]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, decimalText };
})();
