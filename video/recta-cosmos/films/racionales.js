// «La cuerda de Pitágoras» · escenas de la lección alg-11b. Motor en kit.js y recta.js; guion en racionales.data.js.
// La cuerda es la imagen que se repite: un monocordio horizontal con un puente móvil.
const SX0 = 140, SX1 = 940, SY0 = 720;
// La cuerda: de SX0 a SX1, pisada en la fracción f (0–1 desde la izquierda, la parte que vibra es la izquierda).
// amp: amplitud de la vibración; col: color de la parte que suena.
function monochord(t, f, o = {}) {
  const xb = lerp(SX0, SX1, f), amp = o.amp ?? 0, col = o.col || C.cyan, w = 18 * (o.speed || 1) / Math.max(.3, f);
  stroke('rgba(200,210,245,.55)', 3, () => X.roundRect(SX0 - 40, SY0 + 30, SX1 - SX0 + 80, 50, 12), { g: 0 });
  stroke('#ffd9a0', 4, () => { X.moveTo(SX0 - 10, SY0 - 20); X.lineTo(SX0 - 10, SY0 + 30); X.moveTo(SX1 + 10, SY0 - 20); X.lineTo(SX1 + 10, SY0 + 30); }, { g: 8 });
  stroke(col, 3, () => { for (let i = 0; i <= 60; i++) { const u = i / 60, x = lerp(SX0, xb, u), y = SY0 + amp * Math.sin(Math.PI * u) * Math.sin(t * w); i ? X.lineTo(x, y) : X.moveTo(x, y); } }, { g: 16 });
  if (f < .999) { stroke('rgba(200,210,245,.45)', 2, () => { X.moveTo(xb, SY0); X.lineTo(SX1, SY0); }, { g: 0 }); stroke(C.amber, 4, () => { X.moveTo(xb - 14, SY0 + 30); X.lineTo(xb, SY0 - 6); X.lineTo(xb + 14, SY0 + 30); }, { g: 14 }); }
  return xb;
}
// Ondas que salen de la cuerda (cuando suena).
function waves(t, x, y, col, a) { for (let i = 0; i < 3; i++) { const r = ((t * 70 + i * 40) % 120) + 20; fade(a * (1 - r / 140), () => ring(x, y, r, col, 2, 1, { g: 6 })); } }
const S = {
  // 1 · La cuerda entera suena; pisada a la mitad suena la octava.
  cuerda(t) {
    stars(t, .5);
    const f = t < 9.8 ? 1 : lerp(1, .5, eio(seg(t, 10, 12))), amp = 26 * (seg(t, 2, 2.5) * (1 - seg(t, 7, 9.6)) + seg(t, 12.2, 12.8) * (1 - seg(t, 17.4, 18)) + seg(t, 19, 19.5));
    const xb = monochord(t, f, { amp, col: t > 18.6 ? C.green : C.cyan });
    waves(t, (SX0 + xb) / 2, SY0 - 120, C.cyan, amp / 26 * .8);
    fade(A(t, 2, .6), () => T('cuerda entera · 1', 96, 1196, { k: 'mono', s: 26, c: C.cyan }));
    fade(A(t, 12, .6), () => { FR(1, 2, xb, 900, 64, C.amber); T('la mitad', xb, 1010, { k: 'mono', s: 23, c: C.mute, a: 'c' }); T('nota: una octava más aguda', 96, 1240, { k: 'mono', s: 26, c: C.amber, g: 8 }); });
    fade(A(t, 19.4, .6), () => { [[1, 2], [2, 3], [3, 4]].forEach(([n, d], i) => FR(n, d, 300 + i * 240, 470, 56, [C.amber, C.green, C.violet][i])); });
  },
  // 2 · Papiro de Rhind: siete panes, diez trabajadores; cada uno recibe 7/10.
  rhind(t) {
    stars(t, .4);
    fade(win(t, .5, 10), () => {
      const g = X.createLinearGradient(160, 0, 920, 0); g.addColorStop(0, 'rgba(255,214,150,.10)'); g.addColorStop(1, 'rgba(255,214,150,.22)');
      X.save(); X.fillStyle = g; X.beginPath(); X.roundRect(160, 470, 760, 420, 18); X.fill(); X.restore();
      stroke('#ffd9a0', 3, () => X.roundRect(160, 470, 760, 420, 18), { g: 10 });
      for (let r = 0; r < 6; r++) stroke('rgba(255,217,160,.5)', 2, () => { X.moveTo(220, 540 + r * 58); X.lineTo(220 + 640 * eio(seg(t, 1 + r * .4, 2.6 + r * .4)), 540 + r * 58); }, { g: 0 });
      T('papiro de Rhind · hacia 1650 a. C.', CX, 960, { k: 'it', s: 38, a: 'c', c: '#ffd9a0' });
    });
    fade(A(t, 10, .6), () => {
      // siete panes, cada uno partido en diez
      const cut = seg(t, 13, 16);
      for (let i = 0; i < 7; i++) { const x = 160 + i * 128, y = 520; stroke('#ffd9a0', 3, () => X.roundRect(x - 50, y - 34, 100, 68, 30), { g: 8 }); for (let j = 1; j < 10; j++) if (j / 10 < cut) stroke('rgba(255,217,160,.6)', 1.5, () => { X.moveTo(x - 50 + j * 10, y - 30); X.lineTo(x - 50 + j * 10, y + 30); }, { g: 0 }); }
      // diez trabajadores con su parte
      for (let p = 0; p < 10; p++) { const x = 140 + p * 89, y = 820, k = A(t, 16 + p * .25, .4); fade(k, () => { dot(x, y - 50, 14, C.cyan, 14); stroke(C.cyan, 3, () => { X.moveTo(x, y - 34); X.lineTo(x, y + 10); }, { g: 6 }); X.save(); X.fillStyle = hexA(C.amber, .5); X.fillRect(x - 35, y + 30, 70 * .7, 16); X.restore(); stroke(C.amber, 2, () => X.rect(x - 35, y + 30, 70, 16), { g: 4 }); }); }
      T('panes = 7 · trabajadores = 10', 96, 1196, { k: 'mono', s: 26, c: C.amber, g: 8 });
      fade(A(t, 19.6, .6), () => { const px = nline(200, 880, 1010, 0, 1, { step: .1, lab: v => v === 0 || v === 1 }); dot(px(.7), 1010, 12, C.amber, 26); fade(A(t, 21, .5), () => FR(7, 10, px(.7), 1120, 52, C.amber)); });
    });
  },
  // 3 · ℚ: la definición se escribe parte por parte; numerador y denominador; nunca dividir en 0 partes.
  q(t) {
    stars(t, .4);
    fade(A(t, .6, .6), () => { T('ℚ', CX, 620, { k: 'r', s: 210, a: 'c', c: C.green, g: 30 }); T('«cu» · de quoziente, «cociente»', CX, 690, { k: 'mono', s: 23, c: C.mute, a: 'c' }); });
    fade(A(t, 3, .6), () => F([['ℚ', 'r', C.green], [' = { ', 'r'], ['m', 'i', C.amber], ['/', 'r'], ['n', 'i', C.cyan], [' : ', 'r'], ['m', 'i', C.amber], [', ', 'r'], ['n', 'i', C.cyan], [' ∈ ', 'r'], ['ℤ', 'r', C.cyan], [', ', 'r'], ['n', 'i', C.cyan], [' ≠ 0', 'r', C.red], [' }', 'r']], CX, 830, 56, { rev: seg(t, 3.2, 7.4), max: 940 }));
    fade(win(t, 10, 19.8), () => {
      FR(7, 10, CX, 1080, 120, C.ink);
      arrow(CX + 120, 1000, CX + 260, 990, C.amber, eio(seg(t, 10.6, 11.6)), 2.5); fade(A(t, 11.4, .4), () => { T('numerador', CX + 290, 1000, { k: 'mono', s: 26, c: C.amber }); T('cuántas se toman', CX + 290, 1036, { k: 'mono', s: 21, c: C.mute }); });
      arrow(CX - 120, 1160, CX - 260, 1180, C.cyan, eio(seg(t, 13.4, 14.4)), 2.5); fade(A(t, 14.2, .4), () => { T('denominador', CX - 290, 1190, { k: 'mono', s: 26, c: C.cyan, a: 'r' }); T('en cuántas se parte', CX - 290, 1226, { k: 'mono', s: 21, c: C.mute, a: 'r' }); });
    });
    fade(A(t, 20, .6), () => {
      FR(7, 0, CX, 1080, 120, C.red);
      stroke(C.red, 5, () => { X.moveTo(CX - 120, 960); X.lineTo(CX + 120, 1220); }, { g: 16 });
      T('partir en 0 partes: no existe', CX, 1290, { k: 'mono', s: 26, c: C.red, a: 'c', g: 8 });
    });
  },
  // 4 · Muchos nombres: 2/3, 4/6 y 6/9 marcan el mismo punto de la cuerda; −5 = −5/1; ℤ ⊆ ℚ.
  nombres(t) {
    stars(t, .4);
    const rows = [[3, 2, C.green], [6, 4, C.cyan], [9, 6, C.violet]];
    fade(win(t, .5, 18.8), () => {
      rows.forEach(([d, n, col], r) => fade(A(t, .8 + r * 2.2, .6), () => {
        const y = 520 + r * 150, w = 760, x0 = 160;
        for (let i = 0; i < d; i++) { const x = x0 + i * w / d; X.save(); X.fillStyle = i < n ? hexA(col, .3) : 'rgba(0,0,0,0)'; X.fillRect(x + 3, y - 30, w / d - 6, 60); X.restore(); stroke(col, 2.5, () => X.rect(x + 3, y - 30, w / d - 6, 60), { g: i < n ? 10 : 0 }); }
        FR(n, d, x0 + w + 70, y - 2, 40, col);
      }));
      fade(A(t, 7.6, .6), () => { const x = 160 + 760 * 2 / 3; stroke(C.amber, 3, () => { X.moveTo(x, 460); X.lineTo(x, 900); }, { dash: [8, 8], g: 14 }); T('el mismo punto', x, 950, { k: 'mono', s: 24, c: C.amber, a: 'c', g: 8 }); });
      fade(A(t, 10, .6), () => F([['−5', 'r', C.cyan], [' = ', 'r']], CX - 60, 1150, 96, { a: 'r' }));
      fade(A(t, 10.6, .6), () => FR('−5', 1, CX + 40, 1120, 80, C.green));
    });
    fade(A(t, 19, .6), () => {
      family(CX, 760, 450, 320, 'ℚ', C.green, eio(seg(t, 19, 21)), { lx: CX + 380, ly: 490 });
      family(CX + 90, 780, 270, 200, 'ℤ', C.cyan, eio(seg(t, 19.6, 21.4)), { lx: CX + 300, ly: 620, fill: .12 });
      [['−5', CX + 30, 760], ['0', CX + 150, 700], ['4', CX + 200, 860], ['2/3', CX - 290, 640], ['7/10', CX - 320, 860], ['−1/2', CX - 230, 950]].forEach(([s, x, y], i) => fade(A(t, 21 + i * .3, .4), () => { dot(x, y, 9, i < 3 ? C.cyan : C.green, 14); T(s, x + 18, y + 12, { k: 'r', s: 36, c: C.ink }); }));
      fade(A(t, 22.4, .6), () => F([['ℤ', 'r', C.cyan], [' ⊆ ', 'r', C.amber], ['ℚ', 'r', C.green]], CX, 1240, 100));
    });
  },
  // 5 · Octava, quinta y cuarta: el puente salta a 1/2, 2/3 y 3/4; la frecuencia sube al revés.
  escala(t) {
    stars(t, .4);
    const steps = [[1 / 2, '1/2', 'octava', C.amber, 880], [2 / 3, '2/3', 'quinta', C.green, 660], [3 / 4, '3/4', 'cuarta', C.violet, 586.7]];
    const i = t < 3.6 ? 0 : t < 6.4 ? 1 : 2, cur = t < 10 ? steps[i] : steps[1];
    const f = t < 10 ? cur[0] : 2 / 3, amp = 24;
    const xb = monochord(t, f, { amp, col: cur[3], speed: 1.2 });
    waves(t, (SX0 + xb) / 2, SY0 - 120, cur[3], .8);
    steps.forEach(([v, s, name, col], j) => fade(A(t, .8 + j * 2.8, .5), () => { const x = lerp(SX0, SX1, v); stroke(col, 2, () => { X.moveTo(x, SY0 + 90); X.lineTo(x, SY0 + 120); }, { g: 6 }); const [n, d] = s.split('/'); FR(n, d, x, SY0 + 170, 40, col); T(name, x, SY0 + 270 + (j === 2 ? 36 : 0), { k: 'mono', s: 22, c: col, a: 'c' }); }));
    fade(A(t, 10.4, .6), () => {
      F([['cuerda × ', 'it'], ['2/3', 'r', C.green], ['   ⟹   ', 'r'], ['vibración × ', 'it'], ['3/2', 'r', C.green]], CX, 1120, 52, { max: 940 });
      F([['440 Hz', 'r', C.cyan], [' · ', 'r'], ['3/2', 'r', C.green], [' = ', 'r'], ['660 Hz', 'r', C.green]], CX, 1220, 64, { rev: seg(t, 13, 15) });
    });
    // dos ondas que coinciden cada pocas vueltas
    fade(A(t, 20, .6), () => {
      const y = 520, x0 = 140, w = 800, k = eio(seg(t, 20.2, 23));
      [[2, C.cyan], [3, C.green]].forEach(([n, col]) => stroke(col, 3, () => { for (let i = 0; i <= 200 * k; i++) { const u = i / 200, x = x0 + u * w, yy = y - 70 * Math.sin(2 * Math.PI * n * u * 2); i ? X.lineTo(x, yy) : X.moveTo(x, yy); } }, { g: 12 }));
      for (let c = 0; c <= 2; c++) fade(A(t, 23 + c * .4, .4), () => { const x = x0 + c * w / 2; ring(x, y, 22, C.amber, 3); });
      fade(A(t, 24.4, .5), () => T('coinciden cada 2 y 3 vueltas', CX, 640, { k: 'mono', s: 24, c: C.amber, a: 'c', g: 8 }));
    });
  },
  // 6 · Decimales: la división se hace sola; 7/10 = 0.7 y 5/16 = 0.3125 terminan.
  decimales(t) {
    stars(t, .4);
    const div = (n, d, x, y, t0, k) => { const r = D.longDiv(n, d, k), m = clamp(Math.floor((t - t0) / .7), 0, k); FR(n, d, x - 230, y - 26, 64, C.ink); F([['=', 'r']], x - 120, y, 72); T('0.' + r.digits.slice(0, m).join(''), x - 70, y + 4, { k: 'r', s: 84, c: C.green, g: 12 }); return { r, m }; };
    fade(A(t, .8, .6), () => { const { m } = div(7, 10, CX, 620, 2, 1); fade(A(t, 3.4, .5), () => T('termina', CX + 260, 600, { k: 'mono', s: 24, c: C.green, g: 8 })); });
    fade(A(t, 10, .6), () => {
      const { r, m } = div(5, 16, CX, 900, 11, 4);
      fade(A(t, 14.4, .5), () => T('termina', CX + 260, 880, { k: 'mono', s: 24, c: C.green, g: 8 }));
      T('residuos: ' + r.rests.slice(0, Math.max(1, m)).concat(m >= 4 ? [0] : []).join(' → '), 96, 1196, { k: 'mono', s: 26, c: C.amber, g: 8 });
      fade(A(t, 16, .6), () => { F([['16 = 2 · 2 · 2 · 2', 'r']], CX, 1100, 56); F([['10 = 2 · 5', 'r']], CX, 1180, 48); });
    });
  },
  // 7 · Periódicos: 1/7 se divide; los residuos recorren un reloj de 6 posiciones y vuelven a empezar.
  periodo(t) {
    stars(t, .4);
    const { digits, rests } = D.longDiv(1, 7, 14), m = clamp(Math.floor((t - 1.2) / .55), 0, 14);
    // el decimal escribiéndose
    FR(1, 7, 180, 470, 64, C.ink); F([['=', 'r']], 280, 494, 72);
    const str = '0.' + digits.slice(0, m).join('');
    T(str, 330, 500, { k: 'r', s: 72, c: C.green, g: 12, max: 700 });
    // el reloj de residuos
    const cx = CX, cy = 860, R = 210, pos = r => { const a = -Math.PI / 2 + (r - 1) * Math.PI * 2 / 6; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; };
    fade(A(t, 9.8, .6), () => {
      stroke('rgba(200,210,245,.35)', 2, () => X.arc(cx, cy, R, 0, 7), { g: 0 });
      for (let r = 1; r <= 6; r++) { const [x, y] = pos(r); ring(x, y, 34, 'rgba(200,210,245,.7)', 2, 1, { g: 0 }); T(String(r), x, y + 13, { k: 'r', s: 38, a: 'c', c: C.ink }); }
      const step = clamp(Math.floor((t - 10.4) / .8), 0, 12), pathR = rests.slice(0, step + 1);
      for (let j = 1; j < pathR.length; j++) { const [a1, b1] = pos(pathR[j - 1]), [a2, b2] = pos(pathR[j]); arrow(a1, b1, a2, b2, j > 6 ? C.mag : C.cyan, 1, 2.5, { h: 12 }); }
      const [x, y] = pos(pathR[pathR.length - 1]); dot(x, y, 14, step >= 6 ? C.mag : C.amber, 30);
      T('residuo = ' + pathR[pathR.length - 1], 96, 1196, { k: 'mono', s: 26, c: C.amber, g: 8 });
      fade(A(t, 15.4, .5), () => T('se repite: vuelta ' + (step >= 6 ? 2 : 1), 984, 1196, { k: 'mono', s: 26, c: step >= 6 ? C.mag : C.mute, a: 'r' }));
    });
    // la rayita
    fade(A(t, 22.2, .6), () => {
      const w = F([['0.', 'r'], ['142857', 'r', C.green]], CX, 1280, 96);
      const x1 = w.x0 + w.w * .22, x2 = w.x0 + w.w; stroke(C.amber, 5, () => { X.moveTo(x1, 1196); X.lineTo(lerp(x1, x2, eio(seg(t, 22.6, 24))), 1196); }, { g: 16 });
      fade(A(t, 24, .5), () => T('período: 6 cifras', CX, 1340, { k: 'mono', s: 24, c: C.amber, a: 'c' }));
    });
  },
  // 8 · De decimal a fracción: x = 0.8181…; 100x corre el período; la resta borra la cola; x = 9/11.
  vuelta(t) {
    stars(t, .4);
    const tail = '8181818181…', sh = eio(seg(t, 5, 7.6));
    F([['x', 'i', C.amber], ['      = ', 'r'], ['0.', 'r'], [tail, 'r', C.green]], 140, 560, 64, { a: 'l', rev: seg(t, .8, 2.6) });
    fade(A(t, 4.6, .6), () => F([['100', 'r', C.cyan], ['x', 'i', C.amber], [' = ', 'r'], ['81.', 'r'], [tail, 'r', C.green]], 140 + lerp(120, 0, sh), 680, 64, { a: 'l' }));
    fade(A(t, 6, .5), () => arrow(560, 600, 460, 640, C.cyan, eio(seg(t, 6, 7.4)), 2.5));
    // las colas alineadas se tachan
    fade(A(t, 10.2, .6), () => { stroke(C.mag, 3, () => { X.moveTo(470, 548); X.lineTo(lerp(470, 980, eio(seg(t, 10.4, 12))), 548); X.moveTo(470, 668); X.lineTo(lerp(470, 980, eio(seg(t, 10.4, 12))), 668); }, { g: 12 }); T('colas iguales: se cancelan', CX, 760, { k: 'mono', s: 24, c: C.mag, a: 'c', g: 8 }); });
    fade(A(t, 12.6, .6), () => F([['100', 'r', C.cyan], ['x', 'i', C.amber], [' − ', 'r'], ['x', 'i', C.amber], [' = ', 'r'], ['81', 'r', C.green]], CX, 900, 80, { rev: seg(t, 12.8, 14.8) }));
    fade(A(t, 15.4, .6), () => F([['99', 'r', C.cyan], ['x', 'i', C.amber], [' = ', 'r'], ['81', 'r', C.green]], CX, 1010, 80));
    fade(A(t, 20.2, .6), () => {
      F([['x', 'i', C.amber], [' =', 'r']], CX - 250, 1180, 96);
      FR(81, 99, CX - 70, 1150, 72, C.ink); F([['=', 'r']], CX + 60, 1180, 96); FR(9, 11, CX + 180, 1150, 72, C.green);
      fade(A(t, 23, .5), () => T('81 = 9 · 9   y   99 = 9 · 11', CX, 1300, { k: 'mono', s: 24, c: C.mute, a: 'c' }));
    });
  },
  // 9 · La huella de ℚ: dos cajas, termina / se repite, y una tercera vacía con signo de interrogación.
  huella(t) {
    stars(t, .4);
    const boxes = [['termina', '0.3125', C.green, 400], ['se repite', '0.142857…', C.cyan, 640], ['ni termina ni se repite', '1.41421356…', C.mag, 880]];
    boxes.forEach(([lab, ex, col, y], i) => fade(A(t, i < 2 ? .8 + i * 1.2 : 19.2, .6), () => {
      stroke(col, 2.5, () => X.roundRect(140, y - 80, 800, 160, 22), { g: 10 });
      T(lab, 190, y - 20, { k: 'mono', s: 28, c: col }); T(ex, 190, y + 50, { k: 'r', s: 52, c: C.ink });
      T(i < 2 ? '∈ ℚ' : '∉ ℚ', 890, y + 20, { k: 'r', s: 64, a: 'r', c: i < 2 ? C.green : C.red, g: 12 });
    }));
    fade(A(t, 10.2, .6), () => { arrow(CX - 160, 1100, CX + 160, 1100, C.amber, 1, 3); arrow(CX + 160, 1140, CX - 160, 1140, C.amber, 1, 3); T('racional', CX - 240, 1132, { k: 'it', s: 40, a: 'r', c: C.green }); T('termina o se repite', CX + 240, 1132, { k: 'it', s: 40, c: C.cyan, max: 270 }); });
  },
  // 10 · Cierre: la cuerda suena con sus tres fracciones; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { const f = [1 / 2, 2 / 3, 3 / 4][Math.floor(t / 3) % 3]; const xb = monochord(t, f, { amp: 20, col: C.green }); waves(t, (SX0 + xb) / 2, SY0 - 120, C.green, .7); T('«todo es número»', CX, 1040, { k: 'it', s: 56, a: 'c', c: '#ffd9a0', g: 12 }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['ℚ', 'r', C.green], [' = { ', 'r'], ['m', 'i'], ['/', 'r'], ['n', 'i'], [' : ', 'r'], ['n', 'i'], [' ≠ 0 }', 'r']], 'racionales'], [[['ℕ ⊆ ℤ ⊆ ℚ', 'r']], 'cada familia dentro de la otra'], [[['3/4', 'r'], [' = 0.75', 'r', C.green]], 'termina'], [[['1/7', 'r'], [' = 0.142857…', 'r', C.cyan]], 'se repite']], 420, 170, 50);
      endCard(t, 19.6, D.TITLE, D.LINE, [C.amber, C.green, C.violet]);
    });
  },
};
