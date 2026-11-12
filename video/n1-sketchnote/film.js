// «Los números naturales y los enteros» (Álgebra · unidad 1 · lección alg-11) en estilo Sketchnote (Lemo-Opuscar).
// Una sola página de apuntes en papel punteado (2200 × 4300 unidades, dos columnas) que se escribe mientras se mira;
// la cámara vertical (1080×1920) va bloque por bloque y al final se aleja hasta ver la página entera como un póster.
// Mismo contenido y mismo orden que el video anterior (video/clase_alg_u1_n1_naturales). Sin voz: la imagen sigue
// el ritmo de la narración NARR, que se entrega como guion (.md) y subtítulos (.srt) para grabarla encima.
//
// Colores: los de cada conjunto en Zuka (js/games/kit.js): ℕ amarillo, ℤ azul, ℚ verde, 𝕀 rojo, ℝ violeta.
// El amarillo sigue a los naturales por toda la página y el azul a los enteros; el resto es tinta y gris.

// ---------- paleta propia sobre el motor ----------
const MK = { N: 'rgba(255,190,30,0.80)', Z: 'rgba(70,150,255,0.52)', Q: 'rgba(40,190,130,0.50)', I: 'rgba(255,90,110,0.50)',
  R: 'rgba(150,120,255,0.50)', RED: 'rgba(240,80,70,0.62)', LEAF: 'rgba(90,170,90,0.55)', BAND_N: 'rgba(255,190,30,0.55)', BAND_Z: 'rgba(70,150,255,0.40)' };
const RED_INK = '#c8352b', BLUE_INK = '#1d5fc4';

// ---------- narración (guion). Cada frase empieza cuando aparece lo que nombra ----------
const NARR = [
  ['conj', 'Los números forman conjuntos', 'En la unidad anterior aprendimos qué es un conjunto: una agrupación bien definida de elementos. Pues bien: los números también son elementos, y se agrupan en conjuntos.'],
  ['conj', '', 'Algunos conjuntos de números son tan importantes que tienen nombre propio, escrito con letras de doble trazo: una línea extra en la letra. Así no se confunden con cualquier otro conjunto.'],
  ['conj', '', 'En estas tres partes los conoceremos uno por uno, y veremos cómo cada uno nació para resolver un problema que el anterior no podía.'],
  ['nat', 'Los naturales: para contar', 'Los primeros números que aprendemos sirven para contar. Una manzana, dos manzanas, tres manzanas.'],
  ['nat', '', 'Esos números forman el conjunto de los naturales. Se escribe por extensión con una letra ene de doble trazo.'],
  ['nat', '', 'Los tres puntos significan que la lista sigue para siempre: a cada natural le sigue otro, sumándole uno. Es un conjunto infinito, como los de la unidad anterior.'],
  ['per', '¿Quién pertenece a ℕ?', 'Con los símbolos de pertenencia podemos decir quién está y quién no. El cinco pertenece a los naturales.'],
  ['per', '', 'Menos dos no pertenece: no se pueden contar menos dos manzanas.'],
  ['per', '', 'Un medio tampoco: media manzana es un pedazo, no un conteo.'],
  ['per', '', 'Y en este curso, el cero tampoco es natural: los naturales empiezan en uno.'],
  ['res', 'Restar puede escaparse de ℕ', 'Si sumas dos naturales, obtienes otro natural. Si los multiplicas, también. Se dice que los naturales están cerrados para la suma y la multiplicación.'],
  ['res', '', 'Pero con la resta hay un problema. Un termómetro marca dos grados y la temperatura baja cinco. ¿Dónde termina?'],
  ['res', '', 'Baja de dos a cero, y sigue bajando tres grados más: menos tres. Ese número no está en los naturales. La resta se escapó del conjunto.'],
  ['ent', 'Los enteros', 'Para que la resta siempre tenga respuesta se crearon los números enteros: los naturales, el cero y los negativos. Se escriben con una zeta de doble trazo.'],
  ['ent', '', 'Ahora los tres puntos aparecen a los dos lados: la lista sigue para siempre hacia la derecha y también hacia la izquierda.'],
  ['ent', '', 'En la recta, el cero queda en el centro. A la derecha están los positivos, que son los naturales; a la izquierda, los negativos.'],
  ['ent', '', 'Los negativos aparecen en la vida diaria: temperaturas bajo cero, los sótanos de un edificio, o una deuda. Si debes tres mil pesos, tu saldo es menos tres mil.'],
  ['ent', '', 'Con los enteros, la resta que se escapaba ya tiene respuesta: dos menos cinco es menos tres, y menos tres pertenece a los enteros.'],
  ['op', 'El opuesto: un espejo en el cero', 'Cada entero tiene un opuesto. Imagina un espejo parado en el cero: el opuesto es el reflejo, a la misma distancia del cero pero del otro lado.'],
  ['op', '', 'El opuesto de un número se escribe poniéndole un signo menos adelante. El opuesto de cuatro es menos cuatro, y el opuesto de menos cuatro es cuatro: menos de menos cuatro es cuatro.'],
  ['op', '', 'Y un número más su opuesto siempre da cero: avanzar cuatro y retroceder cuatro te deja donde empezaste.'],
  ['op', '', 'El cero es el único número que es su propio opuesto: su reflejo es él mismo.'],
  ['sub', 'ℕ está contenido en ℤ', 'Ahora usemos lo que sabemos de conjuntos. Todo número natural es también entero. Eso quiere decir que los naturales son un subconjunto de los enteros.'],
  ['sub', '', '¿Y qué tienen los enteros que no tengan los naturales? Es la diferencia que vimos en la unidad de conjuntos: zeta menos ene. Quedan el cero y los negativos.'],
  ['sub', '', 'Así crecen los números: cada conjunto nuevo contiene al anterior y agrega lo que faltaba. En la próxima parte veremos qué pasa al dividir.'],
  ['rep', 'Repasemos', 'Los naturales sirven para contar y los enteros resuelven todas las restas. Los naturales viven dentro de los enteros.'],
];
const WPS = 2.5, LINE_GAP = 0.45, SEC_GAP = 1.4, T_FIRST = 6.0;
const LINES = []; const SEC = {};
(() => { let t = T_FIRST, prev = null;
  for (const [sec, head, text] of NARR) {
    if (prev && sec !== prev) t += SEC_GAP;
    const words = text.split(/\s+/).length, d = Math.max(2.6, words / WPS);
    if (!(sec in SEC)) SEC[sec] = t;
    LINES.push({ sec, head, text, t0: +t.toFixed(2), t1: +(t + d).toFixed(2) }); t += d + LINE_GAP; prev = sec;
  } })();
const L = k => LINES[k].t0;
const PULL0 = LINES[LINES.length - 1].t1 + 0.8, PULL1 = PULL0 + 3.2, FILM_DUR = +(PULL1 + 4.8).toFixed(2);

// ---------- letras de doble trazo y símbolos que la letra manuscrita no trae ----------
const SYM = { 'ℕ': 'N', 'ℤ': 'Z', 'ℚ': 'Q', 'ℝ': 'R', '𝕀': 'I', '∈': 'in', '∉': 'notin', '⊆': 'sub' };
const SYMW = { N: 0.68, Z: 0.66, Q: 0.72, R: 0.66, I: 0.5, in: 0.6, notin: 0.6, sub: 0.66 };
function symStrokes(k, x, y, s) {
  const P = (u, v) => [x + u * s, y + v * s], seg = (a, b, c, d) => [P(a, b), P(c, d)];
  switch (k) {
    case 'N': return [seg(0.05, 0, 0.05, -0.7), seg(0.05, -0.7, 0.46, 0), seg(0.62, 0, 0.62, -0.7), { x: true, p: seg(0.22, -0.7, 0.62, -0.02) }];
    case 'Z': return [seg(0.03, -0.7, 0.6, -0.7), seg(0.4, -0.7, 0.03, 0), seg(0.03, 0, 0.62, 0), { x: true, p: seg(0.6, -0.7, 0.22, 0) }];
    case 'Q': return [ell(x + 0.34 * s, y - 0.36 * s, 0.3 * s, 0.37 * s, -Math.PI / 2, 1.5 * Math.PI, 50), { x: true, p: ell(x + 0.36 * s, y - 0.36 * s, 0.14 * s, 0.3 * s, Math.PI * 0.6, Math.PI * 1.4, 24) }, seg(0.4, -0.14, 0.68, 0.1)];
    case 'R': return [seg(0.07, 0, 0.07, -0.7), { x: true, p: seg(0.22, -0.04, 0.22, -0.66) }, bez(P(0.07, -0.7), P(0.62, -0.74), P(0.62, -0.32), P(0.1, -0.36), 24), seg(0.34, -0.36, 0.6, 0)];
    case 'I': return [seg(0.02, -0.7, 0.46, -0.7), seg(0.14, -0.7, 0.14, 0), { x: true, p: seg(0.32, -0.66, 0.32, -0.04) }, seg(0.02, 0, 0.46, 0)];
    case 'in': return [bez(P(0.54, -0.55), P(0.02, -0.6), P(0.02, -0.02), P(0.54, -0.04), 30), seg(0.1, -0.3, 0.5, -0.3)];
    case 'notin': return [bez(P(0.54, -0.55), P(0.02, -0.6), P(0.02, -0.02), P(0.54, -0.04), 30), seg(0.1, -0.3, 0.5, -0.3), seg(0.46, -0.72, 0.16, 0.14)];
    case 'sub': return [bez(P(0.6, -0.64), P(0.02, -0.68), P(0.02, -0.16), P(0.6, -0.2), 30), seg(0.08, 0.04, 0.6, 0.04)];
  }
}
function symDraw(k, x, y, s, o, t0) {
  const w = (GLY[o.f || 'KB'].hw * s * 2) / 1.2 * 0.9;
  let t = t0;
  // la «línea extra» del doble trazo va más fina, separada del trazo grueso
  for (const st of symStrokes(k, x, y, s)) { const pts = st.x ? st.p : st; t = INK_(pts, { w: st.x ? w * 0.42 : w, amp: Math.min(1.2, s * 0.012), passes: 1, col: o.col || INK }, t, 0.07 + plen(pts) / 2600) + 0.015; }
  return t;
}
// texto con símbolos: los trozos normales se escriben con la letra; los símbolos, a mano con el estilógrafo
function MT(s, x, y, size, o, t0) {
  const f = o.f || 'KB', toks = []; let buf = '';
  for (const c of [...s]) { if (SYM[c]) { if (buf) toks.push(buf); buf = ''; toks.push({ sym: SYM[c] }); } else buf += c; }
  if (buf) toks.push(buf);
  ctx.save(); ctx.font = `${size}px ${f}`;
  const wid = toks.map(k => typeof k === 'string' ? ctx.measureText(k).width * 0.98 : (SYMW[k.sym] + 0.08) * size); ctx.restore();
  const tot = wid.reduce((a, b) => a + b, 0), x0 = o.align === 'center' ? x - tot / 2 : o.align === 'right' ? x - tot : x;
  let cx = x0, t = t0; const pos = {};
  toks.forEach((k, i) => {
    if (typeof k === 'string') t = TXT(k, cx, y, size, { ...o, f, align: 'left', noread: true }, t);
    else { pos[k.sym] = pos[k.sym] || [cx + size * 0.04, cx + size * (0.04 + SYMW[k.sym])]; t = symDraw(k.sym, cx + size * 0.04, y, size, { ...o, f }, t); }
    cx += wid[i];
  });
  if (!o.noread) PAGE_TEXTS.push({ T: { s, x: x0, y, size, chars: [{ ox: 0 }], tot }, t0 });
  return { t, x0, x1: x0 + tot, pos };
}
// subrayado de marcador bajo un tramo de texto (el color dice de qué conjunto se habla)
const swash = (x0, x1, y, col, t0, w = 22) => MST([[x0, y], [(x0 + x1) / 2, y + 3], [x1, y - 2]], { col, w, amp: 1.4 }, t0, 0.18);
function banner(label, cx, cy, size, col, t0) {
  ctx.save(); ctx.font = `${size}px KB`; const w = ctx.measureText(label).width + 70; ctx.restore();
  return ribbon(cx, cy, w, size * 1.3, label, size, t0, { fill: col });
}
const note = (s, x, y, size, t0, o = {}) => MT(s, x, y, size, { f: 'PH', col: INK2, cps: 2000, ...o }, t0).t;
function box2(x, y, w, h, t0, d = 0.3, r = 26) { const p = rrect(x, y, w, h, r); dropShadow(p, 8, 9, t0 + d * 0.9); FILL(p, t0); return INK_(p, { closed: true, w: 3, amp: 1.4 }, t0, d); }

// ---------- dibujos ----------
function apple(cx, cy, r, t0) {
  const body = bez([cx, cy - r * 0.72], [cx + r * 1.25, cy - r * 1.25], [cx + r * 1.25, cy + r * 1.05], [cx, cy + r * 0.82], 30)
    .concat(bez([cx, cy + r * 0.82], [cx - r * 1.25, cy + r * 1.05], [cx - r * 1.25, cy - r * 1.25], [cx, cy - r * 0.72], 30));
  const leaf = bez([cx + 2, cy - r * 0.8], [cx + r * 0.3, cy - r * 1.35], [cx + r * 0.85, cy - r * 1.2], [cx + r * 0.9, cy - r * 1.05], 14)
    .concat(bez([cx + r * 0.9, cy - r * 1.05], [cx + r * 0.6, cy - r * 0.7], [cx + r * 0.2, cy - r * 0.7], [cx + 2, cy - r * 0.8], 14));
  dropShadow(body, 7, 8, t0 + 0.28, 0.06);
  FILL(body, t0); INK_(body, { closed: true, w: 2.8, amp: 0.8 }, t0, 0.22);
  MRK([body], { col: MK.RED, w: 14, ang: -0.6 }, t0 + 0.2, 0.12);
  MRK([body, shift(body, -r * 0.22, -r * 0.2)], { col: GRY2, w: 10 }, t0 + 0.3, 0.06);
  INK_([[cx, cy - r * 0.7], [cx - 3, cy - r * 1.15]], { w: 3, amp: 0.3, passes: 1 }, t0 + 0.22, 0.05);
  FILL(leaf, t0 + 0.26); MRK([leaf], { col: MK.LEAF, w: 8 }, t0 + 0.32, 0.05); return INK_(leaf, { closed: true, w: 2.2, amp: 0.4, passes: 1 }, t0 + 0.26, 0.07);
}
// recta numérica: devuelve la posición de cada valor
function numLine(x0, x1, y, a, b, t0, o = {}) {
  const X = v => x0 + 40 + (x1 - x0 - 80) * (v - a) / (b - a);
  let t = INK_([[x0, y], [x1, y]], { w: 3, amp: 0.8 }, t0, 0.35);
  arrowHead(x1, y, 0, 16, {}, t); if (o.both) arrowHead(x0, y, Math.PI, 16, {}, t);
  for (let v = a; v <= b; v++) {
    const big = v === 0 && o.zero;
    INK_([[X(v), y - (big ? 22 : 13)], [X(v), y + (big ? 22 : 13)]], { w: big ? 3.4 : 2.6, amp: 0.2, passes: 1 }, t0 + 0.15 + (v - a) * 0.03, 0.04);
    TXT(String(v).replace('-', '−'), X(v), y + 52, o.ls || 38, { f: big ? 'KB' : 'PH', align: 'center', col: big ? INK : INK2, noread: true, cps: 3000 }, t0 + 0.25 + (v - a) * 0.05);
  }
  return { X, end: t0 + 0.35 + (b - a) * 0.05 };
}
function dot(x, y, col, t0, r = 13) { const c = ell(x, y, r, r, 0, TAU, 24); FILL(c, t0); MRK([c], { col, w: 10 }, t0 + 0.05, 0.06); return INK_(c, { closed: true, w: 2.6, amp: 0.3, passes: 1 }, t0, 0.08); }
function check(x, y, s, t0) { MST([[x - s * 0.5, y - s * 0.1], [x - s * 0.1, y + s * 0.3], [x + s * 0.6, y - s * 0.55]], { col: MK.Q, w: 16 }, t0 + 0.12, 0.12);
  return INK_([[x - s * 0.5, y - s * 0.1], [x - s * 0.1, y + s * 0.3], [x + s * 0.6, y - s * 0.55]], { w: 3.6, amp: 0.4, passes: 1 }, t0, 0.14); }
function cross(x, y, s, t0) { let t = MST([[x - s * 0.45, y - s * 0.45], [x + s * 0.45, y + s * 0.45]], { col: MK.RED, w: 12 }, t0, 0.08);
  return MST([[x + s * 0.45, y - s * 0.45], [x - s * 0.45, y + s * 0.45]], { col: MK.RED, w: 12 }, t + 0.03, 0.08); }
// termómetro; `drop` = [t0, t1] en que el nivel baja de 2 a −3 (antes sube de 0 a 2)
function thermo(cx, top, bot, t0, o) {
  const V = v => (top + bot) / 2 + 30 - v * (bot - top) / 10, tw = 46, br = 44;
  const tube = rrect(cx - tw / 2, top, tw, bot - top, tw / 2), bulb = ell(cx, bot + br * 0.7, br, br, 0, TAU, 40);
  FILL(tube, t0); FILL(bulb, t0);
  INK_(tube, { closed: true, w: 3, amp: 0.7 }, t0, 0.3); INK_(bulb, { closed: true, w: 3, amp: 0.7 }, t0 + 0.25, 0.15);
  MRK([bulb], { col: MK.RED, w: 14 }, t0 + 0.4, 0.1);
  for (let v = 4; v >= -4; v--) INK_([[cx + tw / 2 + 2, V(v)], [cx + tw / 2 + (v % 2 ? 12 : 22), V(v)]], { w: 2.2, amp: 0.1, passes: 1 }, t0 + 0.45 + (4 - v) * 0.02, 0.03);
  for (const v of [2, 0, -3]) TXT(String(v).replace('-', '−'), cx + tw / 2 + 32, V(v) + 12, 34, { f: 'PH', col: INK2, noread: true, cps: 3000 }, t0 + 0.6);
  const [r0, r1, d0, d1] = o.times, lvl = t => t < r1 ? lerp(0, 2, eio((t - r0) / (r1 - r0))) : lerp(2, -3, eio((t - d0) / (d1 - d0)));
  // el líquido es un marcador que cambia de altura con el tiempo (sube a 2, luego baja a −3)
  addEl(r0, d1 - r0, 'marker', p => {
    const tt = r0 + p * (d1 - r0), yl = V(lvl(tt));
    markerDraw([rrect(cx - tw / 2 + 9, yl, tw - 18, bot + br * 0.4 - yl, 10)], { col: MK.RED, w: 12, edge: false }, 1);
  }, cx);
  return { V };
}
function building(cx, gy, t0) {   // edificio con un sótano bajo la línea del suelo
  let t = INK_([[cx - 110, gy], [cx + 110, gy]], { w: 3, amp: 0.6 }, t0, 0.15);
  const b = [[cx - 60, gy], [cx - 60, gy - 150], [cx + 60, gy - 150], [cx + 60, gy]];
  FILL(b.concat([[cx - 60, gy]]), t); t = INK_(b, { w: 3, amp: 0.7 }, t, 0.25);
  MRK([b], { col: GRY, w: 12 }, t, 0.08);
  for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) INK_(rrect(cx - 40 + i * 48, gy - 130 + j * 50, 32, 30, 4), { closed: true, w: 2, amp: 0.2, passes: 1 }, t + 0.02 * (i + j), 0.05);
  const s = rrect(cx - 60, gy + 6, 120, 70, 6); MRK([s], { col: MK.Z, w: 12 }, t + 0.15, 0.08);
  t = INK_(s, { closed: true, w: 2.6, amp: 0.5, dash: [10, 7] }, t + 0.1, 0.2);
  return TXT('−1', cx, gy + 54, 40, { f: 'KB', align: 'center', noread: true }, t);
}
function wallet(cx, cy, t0) {
  const w = rrect(cx - 85, cy - 60, 170, 120, 18), flap = [[cx - 85, cy - 26], [cx + 85, cy - 26]];
  FILL(w, t0); dropShadow(w, 7, 8, t0 + 0.25, 0.06);
  let t = INK_(w, { closed: true, w: 3, amp: 0.6 }, t0, 0.25); MRK([w], { col: GRY, w: 12 }, t, 0.08);
  INK_(flap, { w: 2.4, amp: 0.4, passes: 1 }, t, 0.06);
  const c = ell(cx + 52, cy + 10, 14, 14, 0, TAU, 20); FILL(c, t + 0.06); MRK([c], { col: MK.RED, w: 8 }, t + 0.1, 0.04); return INK_(c, { closed: true, w: 2.2, amp: 0.2, passes: 1 }, t + 0.06, 0.06);
}
function badge(sym, cx, cy, col, label, t0) {
  const t = box2(cx - 100, cy - 100, 200, 200, t0, 0.24, 24);
  MRK([rrect(cx - 100, cy - 100, 200, 200, 24)], { col, w: 18 }, t - 0.02, 0.14);
  const e = symDraw(sym, cx - SYMW[sym] * 110 / 2, cy + 12, 110, {}, t + 0.1);
  return TXT(label, cx, cy + 74, 34, { f: 'PH', align: 'center', col: INK2, noread: true, cps: 2600 }, e);
}

let TITLE_END = 0, LOOP = null;
function buildPage() {
  // ===== título (columna izquierda arriba) =====
  let t = banner('Los naturales y los enteros', 560, 190, 62, MK.N, 0.3);
  TITLE_END = note('Álgebra · Sistemas numéricos · Parte 1', 560, 330, 44, t + 0.2, { align: 'center' });

  // ===== 1 · los números forman conjuntos =====
  let s = SEC.conj;
  t = banner('Los números forman conjuntos', 560, 480, 52, GRY2, s - 0.6);
  t = note('conjunto: una agrupación bien definida', 560, 610, 46, s + 1.6, { align: 'center' });
  const ov = ell(560, 760, 330, 100, 0, TAU, 80); FILL(ov, s + 4.0); t = INK_(ov, { closed: true, w: 3, amp: 1.2 }, s + 4.0, 0.4);
  MRK([ov], { col: GRY, w: 16 }, t, 0.15);
  t = TXT('1      2      3', 560, 784, 66, { f: 'KB', align: 'center' }, t + 0.1);
  note('los números también son elementos', 560, 905, 40, Math.max(t + 0.2, s + 7.2), { align: 'center' });
  s = L(1);
  const BAD = [['N', 230, 1060, MK.N, 'naturales'], ['Z', 560, 1060, MK.Z, 'enteros'], ['Q', 890, 1060, MK.Q, 'racionales'], ['I', 395, 1290, MK.I, 'irracionales'], ['R', 725, 1290, MK.R, 'reales']];
  BAD.forEach(([k, x, y, c, lab], i) => badge(k, x, y, c, lab, s + 0.4 + i * 0.9));
  // la línea extra: el doble trazo, resaltado en el ℕ
  MST([[230 - 37 + 0.22 * 110, 1072 - 77], [230 - 37 + 0.62 * 110, 1070]], { col: 'rgba(245,150,0,0.55)', w: 14 }, s + 6.0, 0.25);
  note('doble trazo: una línea extra', 560, 1440, 42, s + 6.3, { align: 'center' });
  inkArrow(bez([380, 1405], [300, 1390], [250, 1300], [236, 1180], 20), { w: 2.6, amp: 0.6, col: INK2, head: 12 }, s + 7.6, 0.35);
  s = L(2);
  for (const [a, b] of [[[340, 1060], [450, 1060]], [[670, 1060], [780, 1060]], [[860, 1170], [470, 1210]], [[500, 1290], [620, 1290]]]) inkArrow([a, b], { w: 2.6, amp: 0.5, col: INK2, head: 12 }, s + 0.5 + Math.abs(a[0]) * 0.002, 0.25);
  note('cada uno resuelve lo que el anterior no podía', 560, 1530, 40, s + 3.4, { align: 'center' });

  // ===== 2 · los naturales: para contar =====
  s = SEC.nat;
  t = banner('Los naturales: para contar', 560, 1650, 52, MK.N, s - 0.6);
  const AP = [[[190, 1810]], [[410, 1810], [500, 1810]], [[700, 1810], [790, 1810], [880, 1810]]];
  const APT = [s + 2.0, s + 2.8, s + 3.8];
  AP.forEach((g, gi) => { g.forEach(([x, y], k) => apple(x, y, 40, APT[gi] + k * 0.22)); TXT(String(gi + 1), gi === 0 ? 190 : gi === 1 ? 455 : 790, 1935, 72, { f: 'KB', align: 'center' }, APT[gi] + g.length * 0.22 + 0.1); });
  s = L(4);
  let m = MT('ℕ = {1, 2, 3, 4, 5, …}', 560, 2085, 78, { align: 'center' }, s + 2.4);
  swash(m.pos.N[0] - 8, m.pos.N[1] + 8, 2096, MK.N, m.t + 0.1, 30);
  s = L(5);
  const nl = numLine(90, 1030, 2230, 1, 8, s + 0.4);
  for (let v = 1; v <= 7; v++) {
    const a = nl.X(v), b = nl.X(v + 1), tt = s + 1.6 + (v - 1) * 0.35;
    MST(bez([a + 6, 2212], [a + 30, 2160], [b - 30, 2160], [b - 6, 2212], 16), { col: MK.N, w: 9 }, tt, 0.2);
    if (v <= 3) TXT('+1', (a + b) / 2, 2150, 32, { f: 'PH', align: 'center', col: INK2, noread: true }, tt + 0.1);
  }
  note('sigue para siempre: conjunto infinito', 560, 2360, 44, s + 5.4, { align: 'center' });

  // ===== 3 · ¿quién pertenece a ℕ? =====
  s = SEC.per;
  const bp = MT('¿Quién pertenece a ℕ?', 560, 2505, 54, { align: 'center' }, s - 0.2);
  swash(bp.pos.N[0] - 6, bp.pos.N[1] + 6, 2518, MK.N, bp.t + 0.05, 26);
  const ROWS = [['5 ∈ ℕ', 'sirve para contar', true, L(6) + 4.0], ['−2 ∉ ℕ', 'no se cuentan −2 manzanas', false, L(7) + 0.3], ['½ ∉ ℕ', 'media manzana es un pedazo', false, L(8) + 0.3], ['0 ∉ ℕ', 'en este curso ℕ empieza en 1', false, L(9) + 0.6]];
  ROWS.forEach(([f, n, ok, tt], i) => {
    const y = 2650 + i * 145, r = MT(f, 110, y, 80, {}, tt);
    (ok ? check : cross)(Math.max(440, r.x1 + 40), y - 28, 46, r.t + 0.05);
    note(n, 520, y - 6, 40, r.t + 0.4);
  });

  // ===== 4 · restar puede escaparse (columna derecha arriba) =====
  s = SEC.res;
  banner('Restar puede escaparse', 1640, 190, 52, MK.I, s - 0.6);
  let r1 = MT('4 + 3 = 7 ∈ ℕ', 1200, 370, 70, {}, s + 1.4); swash(r1.pos.N[0] - 6, r1.pos.N[1] + 6, 382, MK.N, r1.t, 24);
  let r2 = MT('4 · 3 = 12 ∈ ℕ', 1200, 480, 70, {}, s + 4.0); swash(r2.pos.N[0] - 6, r2.pos.N[1] + 6, 492, MK.N, r2.t, 24);
  const cn = note('cerrados para la suma y el producto', 1200, 575, 42, s + 6.4);
  s = L(11);
  thermo(1290, 660, 980, s + 0.6, { times: [s + 2.4, s + 3.4, L(12) + 0.3, L(12) + 3.0] });
  note('marca 2 °C', 1420, 730, 46, s + 2.4);
  note('y baja 5 °C', 1420, 800, 46, s + 4.2);
  inkArrow([[1600, 820], [1600, 900]], { w: 3, amp: 0.4, col: RED_INK, head: 14 }, s + 5.0, 0.25);
  s = L(12);
  MT('2 − 5 = −3', 1420, 935, 70, {}, s + 2.6);
  const es = MT('−3 ∉ ℕ', 1420, 1040, 70, { col: RED_INK }, s + 5.6);
  swash(es.x0 - 6, es.x1 + 6, 1052, MK.RED, es.t, 24);
  note('¡se escapó de ℕ!', 1700, 1040, 42, es.t + 0.3);

  // ===== 5 · los enteros =====
  s = SEC.ent;
  banner('Los enteros', 1640, 1230, 56, MK.Z, s - 0.6);
  m = MT('ℤ = {…, −3, −2, −1, 0, 1, 2, 3, …}', 1640, 1385, 56, { align: 'center' }, s + 3.0);
  swash(m.pos.Z[0] - 6, m.pos.Z[1] + 6, 1396, MK.Z, m.t + 0.1, 26);
  note('naturales + cero + negativos', 1640, 1470, 42, s + 7.2, { align: 'center' });
  s = L(14);
  MST([[m.x0 - 4, 1340], [m.x0 + 60, 1340]], { col: MK.Z, w: 10 }, s + 2.0, 0.15); MST([[m.x1 - 60, 1340], [m.x1 + 4, 1340]], { col: MK.Z, w: 10 }, s + 2.6, 0.15);
  s = L(15);
  const zl = numLine(1170, 2110, 1650, -5, 5, s + 0.3, { both: true, zero: true });
  MST([[zl.X(0.5), 1622], [zl.X(5.3), 1622]], { col: MK.BAND_N, w: 16 }, s + 3.6, 0.35);
  MT('positivos = ℕ', zl.X(2.9), 1590, 40, { f: 'PH', col: INK2, align: 'center' }, s + 3.9);
  MST([[zl.X(-0.5), 1622], [zl.X(-5.3), 1622]], { col: MK.BAND_Z, w: 16 }, s + 6.2, 0.35);
  note('negativos', zl.X(-2.9), 1590, 40, s + 6.5, { align: 'center' });
  s = L(16);
  thermo(1300, 1745, 1905, s + 1.6, { times: [s + 2.2, s + 2.25, s + 2.4, s + 3.2] });
  note('−3 °C', 1300, 2075, 40, s + 3.0, { align: 'center' });
  building(1640, 1905, s + 3.8); note('sótano', 1640, 2075, 40, s + 4.8, { align: 'center' });
  wallet(1975, 1840, s + 6.6); note('saldo −3 000', 1975, 2075, 40, s + 8.2, { align: 'center' });
  s = L(17);
  const ze = MT('2 − 5 = −3 ∈ ℤ', 1640, 2195, 68, { align: 'center' }, s + 3.6);
  swash(ze.pos.Z[0] - 6, ze.pos.Z[1] + 6, 2206, MK.Z, ze.t, 26);

  // ===== 6 · el opuesto =====
  s = SEC.op;
  banner('El opuesto: un espejo en el cero', 1640, 2320, 48, GRY2, s - 0.6);
  const ol = numLine(1170, 2110, 2520, -5, 5, s + 0.6, { both: true, zero: true });
  INK_([[ol.X(0), 2385], [ol.X(0), 2590]], { w: 2.6, amp: 0.5, dash: [12, 9], col: INK2 }, s + 3.0, 0.4);
  note('espejo', ol.X(0), 2370, 34, s + 3.3, { align: 'center' });
  dot(ol.X(4), 2520, MK.N, s + 5.2); dot(ol.X(-4), 2520, MK.Z, s + 6.4);
  inkArrow(bez([ol.X(4), 2496], [ol.X(3), 2410], [ol.X(-3), 2410], [ol.X(-4), 2496], 40), { w: 2.6, amp: 0.8, col: INK2, head: 13 }, s + 6.0, 0.6);
  for (const [a, b] of [[-4, 0], [0, 4]]) INK_(bez([ol.X(a) + 6, 2600], [ol.X(a) + 10, 2622], [ol.X(b) - 10, 2622], [ol.X(b) - 6, 2600], 20), { w: 2.2, amp: 0.4, passes: 1, col: INK2 }, s + 8.0 + (a === 0 ? 0.3 : 0), 0.25);
  note('misma distancia', ol.X(0), 2665, 34, s + 8.6, { align: 'center' });
  s = L(19);
  MT('−(4) = −4', 1200, 2775, 62, {}, s + 4.4);
  m = MT('−(−4) = 4', 1690, 2775, 62, {}, s + 8.4);
  swash(m.x0 - 6, m.x1 + 6, 2786, MK.N, m.t + 0.1, 22);
  s = L(20);
  MT('4 + (−4) = 0', 1640, 2895, 66, { align: 'center' }, s + 0.6);
  note('avanzar y retroceder: vuelves al inicio', 1640, 2975, 40, s + 3.0, { align: 'center' });
  s = L(21);
  m = MT('0 es su propio opuesto', 1640, 3090, 56, { align: 'center' }, s + 0.6);
  swash(m.x0 - 8, m.x1 + 8, 3100, GRY2, m.t + 0.1, 22);

  // ===== 7 · ℕ está contenido en ℤ (columna izquierda abajo) =====
  s = SEC.sub;
  const bs = MT('ℕ está dentro de ℤ', 560, 3330, 56, { align: 'center' }, s - 0.3);
  swash(bs.pos.N[0] - 6, bs.pos.N[1] + 6, 3342, MK.N, bs.t, 24); swash(bs.pos.Z[0] - 6, bs.pos.Z[1] + 6, 3342, MK.Z, bs.t + 0.2, 24);
  const OUT = ell(560, 3590, 450, 215, 0, TAU, 90), IN = ell(690, 3590, 215, 128, 0, TAU, 70);
  FILL(OUT, s + 1.4); t = INK_(OUT, { closed: true, w: 3.2, amp: 1.4 }, s + 1.4, 0.45);
  MRK([OUT, IN], { col: MK.Z, w: 18 }, t, 0.25);
  symDraw('Z', 150, 3480, 70, {}, t + 0.1);
  t = INK_(IN, { closed: true, w: 3.2, amp: 1.2 }, s + 3.4, 0.35); MRK([IN], { col: MK.N, w: 16 }, t, 0.2);
  symDraw('N', 662, 3528, 54, {}, t + 0.1);
  TXT('1   2   3  …', 690, 3625, 56, { f: 'KB', align: 'center' }, t + 0.5);
  m = MT('ℕ ⊆ ℤ', 560, 3905, 96, { align: 'center' }, s + 6.8);
  LOOP = { x: 560, y: 3875, w: m.x1 - m.x0 };
  s = L(23);
  TXT('0   −1   −2  …', 300, 3625, 52, { f: 'KB', align: 'center' }, s + 7.6);
  m = MT('ℤ − ℕ = {…, −2, −1, 0}', 560, 4040, 60, { align: 'center' }, s + 5.0);
  swash(m.pos.Z[0] - 6, m.pos.Z[1] + 6, 4052, MK.Z, m.t, 22);
  s = L(24);
  note('cada conjunto nuevo contiene al anterior', 560, 4150, 40, s + 0.6, { align: 'center' });

  // ===== 8 · repasemos (columna derecha abajo) =====
  s = SEC.rep;
  banner('Repasemos', 1640, 3330, 56, MK.N, s - 0.6);
  const REP = [['ℕ sirve para contar', MK.N], ['ℤ resuelve todas las restas', MK.Z], ['ℕ vive dentro de ℤ', GRY2]];
  REP.forEach(([txt, col], i) => { const y = 3500 + i * 140; bullet(1205, y - 20, s + 0.4 + i * 2.2); const r = MT(txt, 1240, y, 56, {}, s + 0.5 + i * 2.2); swash(r.x0 - 4, r.x0 + 70, y + 12, col, r.t, 18); });
  note('próxima parte: dividir', 1220, 3960, 42, s + 7.2);
  inkArrow([[1660, 3946], [1780, 3946]], { w: 2.8, amp: 0.4, col: INK2, head: 13 }, s + 8.2, 0.25);
  badge('Q', 1900, 3950, MK.Q, 'racionales', s + 8.5);

  // ===== cierre: con la página entera a la vista, el estilógrafo rodea ℕ ⊆ ℤ =====
  const lp = ell(LOOP.x, LOOP.y - 30, LOOP.w / 2 + 50, 78, -2.2, -2.2 + TAU * 1.08, 80);
  MST(lp, { col: 'rgba(245,150,0,0.75)', w: 9 }, PULL1 + 0.4, 0.9);
}

// ---------- cámara: una sola función mundo → pantalla ----------
const BLK = { title: [560, 300, 1.55], conj: [560, 990, 1.0], nat: [560, 2000, 1.0], per: [560, 2820, 1.0], res: [1640, 640, 1.0], ent: [1640, 1700, 1.0],
  op: [1640, 2720, 1.0], sub: [560, 3740, 1.0], rep: [1640, 3700, 1.0] };
const PAGE = [1100, 2170, 0.44];
const MOVE = 1.15;
const CAM = [];
function buildCam() {
  const shots = [[0, ...BLK.title], [3.6, 560, 330, 1.42]];
  const order = ['conj', 'nat', 'per', 'res', 'ent', 'op', 'sub', 'rep'];
  for (const k of order) shots.push([SEC[k] - 0.15, ...BLK[k], ['res', 'sub'].includes(k) ? 'whip' : '']);
  // acercamientos dentro de un bloque: las manzanas, el termómetro, los ejemplos de la vida diaria
  const extra = [[L(3) + 1.4, 540, 1830, 1.45], [L(4) + 1.0, ...BLK.nat], [L(11) + 0.2, 1500, 830, 1.32], [L(12) + 6.4, ...BLK.res],
    [L(16) + 1.0, 1640, 1900, 1.32], [L(17) + 1.6, ...BLK.ent], [L(18) + 0.4, 1640, 2560, 1.28], [L(19) + 2.4, ...BLK.op]];
  for (const e of extra) shots.push(e);
  shots.sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < shots.length; i++) {
    const [t, x, y, z, ease] = shots[i];
    if (i) { const p = CAM[CAM.length - 1]; CAM.push([Math.max(p[0] + 0.05, t - MOVE), p[1], p[2], p[3]]); }
    CAM.push([t, x, y, z, ease]);
  }
  CAM.push([PULL0, ...BLK.rep]); CAM.push([PULL1, ...PAGE]); CAM.push([FILM_DUR, PAGE[0], PAGE[1] + 6, PAGE[2] * 1.012]);
}
const toScreen = (c, x, y) => [(x - c.x) * c.z + W / 2, (y - c.y) * c.z + H / 2];
function cam(t) {
  let i = 0; while (i < CAM.length - 2 && t >= CAM[i + 1][0]) i++;
  const a = CAM[i], b = CAM[i + 1];
  if (b[0] <= a[0]) return { x: b[1], y: b[2], z: b[3] };
  let u = clamp((t - a[0]) / (b[0] - a[0]));
  u = b[4] === 'whip' ? (u < 0.5 ? 16 * u ** 5 : 1 - Math.pow(-2 * u + 2, 5) / 2) : eio(u);
  const z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u));
  const wa = 1 / a[3], wb = 1 / b[3], k = Math.abs(wa - wb) < 1e-6 ? u : (1 / z - wa) / (wb - wa);
  const kk = Math.abs(Math.log(a[3] / b[3])) > 0.5 ? k : u;
  return { x: lerp(a[1], b[1], kk), y: lerp(a[2], b[2], kk), z };
}

// ---------- papel: blanco cálido con grano y retícula de puntos, anclados a la página ----------
let GRAIN = null; const GX0 = -500, GY0 = -500, GW = 3200, GH = 5400;
function makeGrain() {
  GRAIN = document.createElement('canvas'); GRAIN.width = GW; GRAIN.height = GH;
  const g = GRAIN.getContext('2d'); SEED = 9;
  for (let i = 0; i < 90000; i++) { g.fillStyle = `rgba(90,80,60,${rr(0.015, 0.05)})`; g.fillRect(rr(0, GW), rr(0, GH), rr(0.8, 2.6), rr(0.8, 2.6)); }
}
function paper(c) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(c.z, 0, 0, c.z, W / 2 - c.x * c.z, H / 2 - c.y * c.z);
  ctx.drawImage(GRAIN, GX0, GY0, GW, GH);
  const x0 = c.x - W / 2 / c.z, x1 = c.x + W / 2 / c.z, y0 = c.y - H / 2 / c.z, y1 = c.y + H / 2 / c.z;
  ctx.fillStyle = DOT; const st = 26;
  for (let y = Math.floor((y0 - 13) / st) * st + 13; y < y1 + st; y += st) for (let x = Math.floor((x0 - 13) / st) * st + 13; x < x1 + st; x += st) { ctx.beginPath(); ctx.arc(x, y, 1.3, 0, TAU); ctx.fill(); }
}

window.TEXTS = t => {
  const c = cam(t), out = [];
  PAGE_TEXTS.forEach(({ T, t0 }, i) => {
    if (t < t0) return;
    const x0 = T.x + T.chars[0].ox, x1 = x0 + T.tot, y0 = T.y - T.size * 0.85, y1 = T.y + T.size * 0.3;
    const [a0, b0] = toScreen(c, x0, y0), [a1, b1] = toScreen(c, x1, y1);
    out.push({ id: 'p' + i, text: T.s, x0: a0, y0: b0, x1: a1, y1: b1 });
  });
  return out;
};
window.render = function (t) {
  const f = Math.round(t * FPS); BOIL = Math.floor(f / 2) % 3;
  const c = cam(t);
  paper(c);
  for (const e of EL) { if (t < e.t0) continue; SEED = e.seed; e.draw(clamp((t - e.t0) / e.d)); }
};
window.CAMAT = cam;

async function boot() {
  document.documentElement.style.background = document.body.style.background = PAPER;
  GLY = await (await fetch('glyphs.json')).json();
  await Promise.all(['KB', 'PH'].map(f => document.fonts.load(`40px ${f}`, 'Agñá')));
  makeGrain();
  buildPage(); buildCam();
  window.DUR = FILM_DUR;
  const ev = EL.filter(e => e.kind !== 'fill').map(e => { const c = cam(e.t0 + e.d / 2), x = toScreen(c, e.wx, 0)[0]; return { t: +e.t0.toFixed(4), type: e.kind, d: +e.d.toFixed(4), pan: +clamp((x / W) * 2 - 1, -1, 1).toFixed(3) }; });
  for (let i = 1; i < CAM.length; i++) { const a = CAM[i - 1], b = CAM[i]; if (b[0] > a[0] && (Math.hypot(b[1] - a[1], b[2] - a[2]) > 120 || Math.abs(Math.log(b[3] / a[3])) > 0.2)) ev.push({ t: a[0], type: b[4] === 'whip' ? 'whip' : 'move', d: +(b[0] - a[0]).toFixed(3), pan: 0 }); }
  ev.push({ t: 0, type: 'narr', lines: LINES, sec: SEC, pull: [PULL0, PULL1], dur: FILM_DUR });
  window.EV = ev.sort((a, b) => a.t - b.t);
  if (new URLSearchParams(location.search).has('dbg')) console.warn('DUR ' + FILM_DUR + ' SEC ' + JSON.stringify(SEC) + ' marcas ' + EL.length);
  window.render(+(new URLSearchParams(location.search).get('t') || 0));
  window.READY = true;
}
boot();
