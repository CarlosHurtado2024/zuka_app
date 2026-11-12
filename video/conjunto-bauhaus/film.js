// «¿Qué es un conjunto? Notación y pertenencia» (Álgebra · unidad 0 · alg-0a) en estilo Bauhaus Shapes (Lemo-Opuscar).
// Vertical 1080×1920, 30 fps. Mismo contenido y orden que el video anterior (video/clase_alg_u0_v1_que_es).
// Solo círculos, cuadrados, triángulos, arcos y rectas, en tinta opaca sobre cartulina mate.
//   · círculo = elemento (los del semáforo, en su color: rojo, amarillo, verde)
//   · cuadrado azul = el conjunto (el único campo grande de cada cuadro)
//   · triángulo = quien decide (dos personas que miran el mismo objeto; la máquina que filtra)
//   · los signos se construyen con figuras: ∈ es un medio anillo y una barra, = son dos barras, ✕ y ✓ son barras.
// Sin voz: la imagen sigue el ritmo de la narración NARR, que se entrega como guion (.md) y .srt para grabarla encima.
import { mulberry, clamp, lerp } from '/core/lib.js';

export function setupFilm(g, W, H) {
const C = { paper: '#F8F7F3', ink: '#161C3A', blue: '#2138C8', red: '#E5483B', yel: '#F4C430', grn: '#1E9E6A' };
const SANS = '"BH Sans"', TAU = Math.PI * 2;

// ---------------- narración ----------------
const NARR = [
  ['agr', 'Agrupar cosas', 'Todos los días agrupamos cosas sin darnos cuenta. Los útiles que van en la maleta, las canciones de una lista, los jugadores de un equipo.'],
  ['agr', '', 'En matemáticas, a una agrupación así se le llama conjunto, y a cada cosa que está adentro se le llama elemento.'],
  ['def', 'Bien definido', 'Pero no cualquier agrupación sirve. Un conjunto tiene que estar bien definido: cualquier persona, mirando un objeto, debe poder decir sin dudar si está o no está.'],
  ['def', '', 'Los colores del semáforo están bien definidos: son rojo, amarillo y verde, y todo el mundo está de acuerdo. Nadie discute si el morado está o no está: no está.'],
  ['def', '', 'En cambio, «los colores bonitos» no es un conjunto: a una persona le encanta el morado y a otra no. Depende de quién opine, así que no se puede decidir.'],
  ['def', '', 'Una prueba sencilla: si dos personas cualesquiera, revisando el mismo objeto, siempre deciden lo mismo, el conjunto está bien definido.'],
  ['not', 'Cómo se escribe un conjunto', 'Ahora aprendamos a escribirlo. Vamos a armar, pieza por pieza, el conjunto de los colores del semáforo.'],
  ['not', '', 'Primero el nombre del conjunto. Se usa una letra mayúscula; aquí, ese de semáforo.'],
  ['not', '', 'Luego el signo igual, que se lee «es».'],
  ['not', '', 'Después una llave que abre. Las llaves son la marca de los conjuntos: no se usan paréntesis ni corchetes.'],
  ['not', '', 'Adentro van los elementos, separados por comas. Los elementos se escriben normalmente en minúscula.'],
  ['not', '', 'Y al final, la llave que cierra.'],
  ['not', '', 'Todo junto se lee así: «ese es el conjunto cuyos elementos son rojo, amarillo y verde».'],
  ['err', 'Errores comunes', 'Tres errores que hay que evitar al escribir un conjunto.', 8.5],
  ['per', 'Pertenece y no pertenece', 'Para decir que un objeto está dentro de un conjunto hay un símbolo especial, parecido a una e redondeada. Se lee «pertenece a».'],
  ['per', '', 'Si el objeto no está, el mismo símbolo se tacha con una rayita: «no pertenece a». El azul no pertenece a ese.'],
  ['per', '', 'Fíjate en el orden: a la izquierda del símbolo va el objeto, y a la derecha va el conjunto. Nunca al revés.'],
  ['fin', 'Otro ejemplo: el fin de semana', 'Otro ejemplo. Sea efe el conjunto de los días del fin de semana: sábado y domingo.'],
  ['fin', '', 'Domingo pertenece a efe. Lunes no pertenece a efe. Y así con cada día: cada uno está o no está, sin dudas.'],
  ['ext', 'Por extensión', 'Hay dos maneras de describir un conjunto. La primera, por extensión, es escribir la lista completa de sus elementos. Como las vocales.'],
  ['com', 'Por comprensión: la máquina que filtra', 'La segunda, por comprensión, es dar la condición que cumplen los elementos. Imagina una máquina que revisa cada objeto y solo deja pasar los que cumplen la condición.', 1.5],
  ['com', '', 'Se escribe así. La equis representa a cualquier objeto que estemos revisando, y los dos puntos se leen «tal que».'],
  ['com', '', 'La comprensión es muy útil cuando la lista sería larguísima, como los estudiantes de todo un colegio: basta con decir la condición.'],
  ['ord', 'El orden no importa', 'En un conjunto solo importa qué elementos están. El orden en que se escriben no cambia nada.'],
  ['ord', '', 'Es como una bolsa: da igual qué metiste primero, lo que hay adentro es lo mismo.'],
  ['rep', 'No se repite', 'Además, ningún elemento se repite. Mira las letras de la palabra oso.'],
  ['rep', '', 'La palabra tiene tres letras, pero la o aparece dos veces. Como elemento, la o es una sola: estar dos veces no la hace dos elementos.'],
  ['car', 'El cardinal', 'A veces queremos saber cuántos elementos distintos tiene un conjunto. Ese número se llama cardinal, y se escribe ene de A.'],
  ['car', '', 'El fin de semana tiene dos días: ene de efe es dos.'],
  ['car', '', 'Con las letras de papaya hay que tener cuidado: la palabra tiene seis letras, pero solo tres letras distintas.'],
  ['dib', 'Dibujar un conjunto', 'Un conjunto también se puede dibujar: una línea cerrada, como una bolsa, con sus elementos adentro. Lo que no pertenece queda afuera.'],
  ['dib', '', 'Este dibujo y la escritura con llaves dicen exactamente lo mismo. Más adelante dibujaremos varios conjuntos a la vez para compararlos.'],
  ['res', 'Repasemos', 'Un conjunto es una agrupación bien definida. Se escribe con mayúscula, llaves y comas, y cada elemento pertenece o no pertenece.'],
];
const WPS = 2.5, GAP = 0.45, SEC_GAP = 1.5, T_FIRST = 6.5;
const LINES = [], SEC = {}, ORDER = [];
{ let t = T_FIRST, prev = null;
  for (const [sec, head, text, hold = 0] of NARR) {
    if (prev && sec !== prev) t += SEC_GAP;
    const d = Math.max(2.6, text.split(/\s+/).length / WPS);
    if (!(sec in SEC)) { SEC[sec] = t; ORDER.push(sec); }
    LINES.push({ sec, head, text, t0: +t.toFixed(2), t1: +(t + d).toFixed(2) }); t += d + GAP + hold; prev = sec;
  } }
const L = k => LINES[k].t0;
const LAST = LINES[LINES.length - 1];
const OUTRO = LAST.t1 + 1.6, FULL = +(OUTRO + 5.5).toFixed(2);
const TR = 0.75;                                        // latigazo entre escenas
const START = [['por', 0], ...ORDER.map(s => [s, SEC[s] - 0.85]), ['fin2', OUTRO]];

// ---------------- suavizados ----------------
let EVREC = null;                                       // al barrer la película para el sonido: aquí se anotan los arranques
const k01 = (t, a, d) => { if (EVREC && !EVREC.has('k' + a.toFixed(2))) EVREC.set('k' + a.toFixed(2), { t: a, type: 'tick' }); return clamp((t - a) / d); };
const eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eo = x => 1 - Math.pow(1 - clamp(x), 3);
const back = (x, s = 1.7) => { x = clamp(x) - 1; return 1 + x * x * ((s + 1) * x + s); };

// ---------------- dibujo ----------------
function disc(x, y, r, col) { if (r <= 0) return; g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
function rect(x, y, w, h, col) { if (w <= 0 || h <= 0) return; g.fillStyle = col; g.fillRect(x, y, w, h); }
function poly(pts, col) { g.fillStyle = col; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fill(); }
function line(pts, col = C.ink, w = 5) { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'butt'; g.lineJoin = 'round'; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); }
function ring(x, y, r, col = C.ink, w = 5, a0 = -Math.PI / 2, k = 1) { if (k <= 0) return; g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'butt'; g.beginPath(); g.arc(x, y, r, a0, a0 + TAU * k); g.stroke(); }
function cross(x, y, s = 14) { line([[x - s, y], [x + s, y]], C.ink, 2); line([[x, y - s], [x, y + s]], C.ink, 2); }
// barra girada (para ✕, ✓, la rayita de ∉ y el =)
function bar(cx, cy, len, w, ang, col) { g.save(); g.translate(cx, cy); g.rotate(ang); rect(-len / 2, -w / 2, len, w, col); g.restore(); }
function xMark(x, y, s, col, k) { if (k <= 0) return; const a = eo(k); bar(x, y, s * a, s * 0.2, Math.PI / 4, col); bar(x, y, s * eo(k * 1.4 - 0.4), s * 0.2, -Math.PI / 4, col); }
function check(x, y, s, col, k) { if (k <= 0) return; const a = eo(k * 1.6), b = eo(k * 1.6 - 0.6);
  bar(x - s * 0.22, y + s * 0.12, s * 0.5 * a, s * 0.2, Math.PI / 4, col); if (b > 0) { g.save(); g.translate(x - s * 0.06, y + s * 0.28); g.rotate(-Math.PI / 3.2); rect(0, -s * 0.1, s * 0.9 * b, s * 0.2, col); g.restore(); } }
function triangle(cx, cy, s, ang, col) { const P = [0, 1, 2].map(i => { const a = ang + i * TAU / 3; return [cx + Math.cos(a) * s, cy + Math.sin(a) * s]; }); poly(P, col); }

// texto: sube desde una ranura en su renglón; los que se leen quedan anotados para la comprobación de lectura
let REC = null;
function T(str, x, y, o = {}, k = 1, read = true) {
  if (k <= 0) return 0;
  const { size = 44, weight = 800, col = C.ink, align = 'left', track = 0 } = o;
  g.save(); g.font = `${weight} ${size}px ${SANS}`; g.letterSpacing = track ? `${track}px` : '0px';
  const w = g.measureText(str).width, x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  if (k < 1) { g.beginPath(); g.rect(x0 - 20, y - size * 1.05, w + 40, size * 1.32); g.clip(); }
  g.fillStyle = col; g.textBaseline = 'alphabetic'; g.textAlign = 'left';
  g.fillText(str, x0, y + (1 - eo(k)) * size * 1.25);
  if (REC && read && k >= 1) { const m = g.getTransform(); REC.push({ id: str, text: str, x0: m.e + x0, y0: m.f + y - size * 0.78, x1: m.e + x0 + w, y1: m.f + y + size * 0.2 }); }
  g.restore(); return w;
}
const mw = (str, size, weight = 800, track = 0) => { g.save(); g.font = `${weight} ${size}px ${SANS}`; g.letterSpacing = track ? `${track}px` : '0px'; const w = g.measureText(str).width; g.restore(); return w; };
const caps = (str, x, y, k, o = {}) => T(str, x, y, { size: 30, weight: 700, track: 5, ...o }, k);
const light = (str, x, y, k, o = {}) => T(str, x, y, { size: 44, weight: 300, track: 2, ...o }, k);
// ∈ hecho de figuras: medio anillo abierto a la derecha + una barra; ∉ lleva además una rayita
function inSym(x, y, s, col, k, not = false) {
  if (k <= 0) return; const r = s * 0.31, cx = x + r + s * 0.1, cy = y - s * 0.35, a = eo(k);
  ring(cx, cy, r, col, s * 0.13, Math.PI / 2, 0.5 * a);
  rect(cx - r - s * 0.065, cy - s * 0.06, (r * 1.9) * eo(k * 1.4 - 0.3), s * 0.12, col);
  if (not) bar(cx + r * 0.1, cy, s * 1.0 * eo(k * 1.5 - 0.6), s * 0.11, -1.15, col);
}
// fila de fórmula: piezas de texto y símbolos que suben una tras otra
function formula(parts, x, y, size, t, t0, step, o = {}) {
  const ws = parts.map(p => typeof p === 'string' ? mw(p, size, o.weight || 800) : p.sym === 'eq' ? size * 0.7 : size * 0.86);
  const tot = ws.reduce((a, b) => a + b, 0) + (parts.length - 1) * size * 0.18;
  let cx = o.align === 'center' ? x - tot / 2 : o.align === 'right' ? x - tot : x; const pos = [];
  parts.forEach((p, i) => {
    const k = k01(t, t0 + i * step, 0.4);
    if (typeof p === 'string') T(p, cx, y, { size, weight: o.weight || 800, col: (o.cols && o.cols[i]) || o.col || C.ink }, k);
    else if (p.sym === 'eq') { if (k > 0) { const a = eo(k); rect(cx, y - size * 0.46, size * 0.6 * a, size * 0.09, C.ink); rect(cx, y - size * 0.25, size * 0.6 * a, size * 0.09, C.ink); } }
    else inSym(cx, y, size, p.col || C.ink, k, p.sym === 'notin');
    pos.push([cx, cx + ws[i]]); cx += ws[i] + size * 0.18;
  });
  return { pos, x0: pos[0][0], x1: cx - size * 0.18 };
}
// línea de construcción que crece de un extremo y se recoge hacia el otro
function cline(x0, y0, x1, y1, t, tin, tout, d = 0.5) {
  const a = eio(k01(t, tin, d)), b = eio(k01(t, tout, d)); if (a <= 0 || b >= 1) return;
  line([[lerp(x0, x1, b), lerp(y0, y1, b)], [lerp(x0, x1, a), lerp(y0, y1, a)]], C.ink, 2);
}
// un círculo que cae a su sitio y se aplasta una vez
function drop(x, y, r, col, t, t0, h = 360) {
  const k = k01(t, t0, 0.42); if (k <= 0) return;
  if (EVREC) EVREC.set('d' + t0.toFixed(2) + x, { t: t0 + 0.3, type: 'drop', r });
  const fall = k < 0.72 ? Math.pow(k / 0.72, 2) : 1, sq = k < 0.72 ? 0 : Math.sin(Math.PI * (k - 0.72) / 0.28) * 0.18;
  g.save(); g.translate(x, y - (1 - fall) * h + r * sq * 0.5); g.scale(1 + sq, 1 - sq); disc(0, 0, r, col); g.restore();
}
// un cuadrado que entra deslizando por la retícula y encaja con un pequeño rebote
function slideRect(x, y, w, h, col, t, t0, dx = -700, d = 0.7) { if (EVREC) EVREC.set('b' + t0.toFixed(2), { t: t0 + d * 0.8, type: 'block' }); const k = k01(t, t0, d); if (k <= 0) return; rect(x + dx * (1 - back(k, 1.2)), y, w, h, col); }
const growRect = (x, y, w, h, col, t, t0, d = 0.6) => { if (EVREC) EVREC.set('b' + t0.toFixed(2), { t: t0 + d * 0.7, type: 'block' }); const k = eo(k01(t, t0, d)); rect(x, y + h * (1 - k), w, h * k, col); };
// mantiene algo solo durante una ventana [a, b) de la escena, saliendo por su ranura
const win = (t, a, b) => b == null ? k01(t, a, 0.45) : Math.min(k01(t, a, 0.45), 1 - k01(t, b, 0.35));
const labelDisc = (x, y, r, col, letter, k, size) => { if (k <= 0) return; disc(x, y, r * back(k), col); T(letter, x, y + size * 0.36, { size, weight: 800, col: C.paper, align: 'center' }, k, false); };

// =================== escenas ===================
// portada: la retícula se traza, cae el cuadrado azul, caen tres círculos, sube el título
function sPor(t) {
  cline(96, 0, 96, H, t, 0.1, 5.4, 0.7); cline(0, 1180, W, 1180, t, 0.3, 5.5, 0.7); cline(0, 410, W, 410, t, 0.45, 5.6, 0.7);
  cross(540, 690);
  slideRect(250, 410, 580, 560, C.blue, t, 0.8, -900, 0.8);
  drop(410, 690, 82, C.red, t, 1.7); drop(560, 690, 82, C.yel, t, 2.0); drop(710, 690, 82, C.grn, t, 2.3);
  caps('ÁLGEBRA · CONJUNTOS', 150, 360, k01(t, 1.2, 0.45));
  T('¿Qué es un', 150, 1310, { size: 96 }, k01(t, 2.8, 0.45));
  T('conjunto?', 150, 1440, { size: 132 }, k01(t, 3.1, 0.45));
  light('NOTACIÓN Y PERTENENCIA', 150, 1520, k01(t, 3.6, 0.45), { size: 38, track: 14 });
}
// agrupar: figuras sueltas; el cuadrado azul abarca unas cuantas: eso es un conjunto, cada una es un elemento
const LOOSE = [[230, 700, 'd', C.red], [380, 640, 's', C.yel], [520, 780, 't', C.grn], [300, 880, 'd', C.yel], [470, 930, 's', C.red],
  [760, 620, 't', C.yel], [880, 800, 'd', C.grn], [720, 900, 's', C.red], [900, 1010, 't', C.red]];
function shapeAt(x, y, kind, col, k) { if (k <= 0) return; const s = back(k);
  if (kind === 'd') disc(x, y, 46 * s, col); else if (kind === 's') rect(x - 40 * s, y - 40 * s, 80 * s, 80 * s, col); else triangle(x, y, 52 * s, -Math.PI / 2, col); }
function sAgr(t) {
  const a = L(0), b = L(1);
  caps('ÚTILES · CANCIONES · JUGADORES', 120, 380, win(t, a + 0.6));
  growRect(140, 560, 470, 480, C.blue, t, b + 0.4, 0.7);
  LOOSE.forEach(([x, y, kd, col], i) => shapeAt(x, y, kd, col, k01(t, a + 1.2 + i * 0.35, 0.4)));
  caps('CONJUNTO', 165, 610, k01(t, b + 1.1, 0.45), { col: C.paper });
  const ke = k01(t, b + 4.6, 0.5); if (ke > 0) { line([[300, 880], [300 + 360 * eo(ke), 1180]], C.ink, 2); }
  caps('ELEMENTO', 640, 1220, k01(t, b + 5.0, 0.45));
  T('conjunto', 120, 1440, { size: 108 }, k01(t, b + 1.4, 0.45)); light('la agrupación', 130, 1510, k01(t, b + 1.8, 0.45));
  T('elemento', 120, 1680, { size: 108 }, k01(t, b + 4.8, 0.45)); light('cada cosa de adentro', 130, 1750, k01(t, b + 5.2, 0.45));
}
// bien definido: el semáforo sí; «los colores bonitos» no; la prueba de las dos personas
function observer(x, y, ang, col, say, sayCol, k, kSay) { if (k <= 0) return; triangle(x, y, 58 * back(k), ang, col); T(say, x, y + 120, { size: 48, weight: 800, col: sayCol, align: 'center' }, kSay); }
function sDef(t) {
  T('bien definido', 120, 330, { size: 100 }, win(t, L(2) + 0.3)); light('¿está o no está? sin dudar', 125, 400, win(t, L(2) + 1.4));
  // el semáforo
  const k3 = L(3);
  growRect(120, 500, 300, 760, C.blue, t, k3 + 0.2, 0.7);
  [['rojo', C.red], ['amarillo', C.yel], ['verde', C.grn]].forEach(([w, c], i) => { drop(270, 630 + i * 250, 98, c, t, k3 + 0.9 + i * 0.5, 280); T(w, 470, 650 + i * 250, { size: 52, weight: 600 }, k01(t, k3 + 1.2 + i * 0.5, 0.4)); });
  check(860, 300, 90, C.grn, k01(t, k3 + 3.0, 0.5));
  // el morado: no está
  ring(800, 1420, 62, C.ink, 5, -Math.PI / 2, eo(k01(t, k3 + 6.0, 0.6)));
  T('morado: no está', 800, 1540, { size: 40, weight: 500, align: 'center' }, k01(t, k3 + 6.6, 0.45));
  // los colores bonitos: dos personas, dos respuestas
  const k4 = L(4), k5 = L(5), out4 = k5 - 0.2;
  T('«los colores bonitos»', 120, 1650, { size: 60 }, win(t, k4 + 0.4, out4)); xMark(960, 1630, 70, C.red, win(t, k4 + 2.0, out4));
  observer(330, 1780, -Math.PI / 2, C.ink, 'sí', C.grn, win(t, k4 + 3.4, out4), win(t, k4 + 4.6, out4));
  observer(690, 1780, -Math.PI / 2, C.ink, 'no', C.red, win(t, k4 + 3.8, out4), win(t, k4 + 5.4, out4));
  // la prueba: las dos personas deciden lo mismo
  T('la prueba', 120, 1650, { size: 60 }, k01(t, k5 + 0.3, 0.45));
  observer(330, 1780, -Math.PI / 2, C.ink, 'sí', C.grn, k01(t, k5 + 1.4, 0.4), k01(t, k5 + 3.4, 0.4));
  observer(690, 1780, -Math.PI / 2, C.ink, 'sí', C.grn, k01(t, k5 + 1.8, 0.4), k01(t, k5 + 3.8, 0.4));
  check(960, 1630, 80, C.grn, k01(t, k5 + 5.0, 0.5));
}
// notación: S = {rojo, amarillo, verde}, pieza por pieza, sobre un renglón
function sNot(t) {
  const base = 640, sz = 62;
  cline(60, base + 14, 1020, base + 14, t, L(6) + 0.2, L(12) + 3.0, 0.6);
  cline(60, base - sz * 0.72, 1020, base - sz * 0.72, t, L(6) + 0.35, L(12) + 3.1, 0.6);
  const parts = ['S', { sym: 'eq' }, '{', 'rojo,', 'amarillo,', 'verde', '}'];
  const times = [L(7) + 0.6, L(8) + 0.4, L(9) + 0.5, L(10) + 0.8, L(10) + 1.6, L(10) + 2.4, L(11) + 0.4];
  const ws = parts.map(p => typeof p === 'string' ? mw(p, sz) : sz * 0.7), gap = sz * 0.2;
  const tot = ws.reduce((a, b) => a + b, 0) + gap * (parts.length - 1); let cx = 540 - tot / 2;
  const cols = [C.blue, C.ink, C.ink, C.ink, C.ink, C.ink, C.ink];
  parts.forEach((p, i) => {
    const k = k01(t, times[i], 0.45);
    if (typeof p === 'string') T(p, cx, base, { size: sz, col: cols[i] }, k, i !== 0);
    else if (k > 0) { const a = eo(k); rect(cx, base - sz * 0.46, sz * 0.6 * a, sz * 0.09, C.ink); rect(cx, base - sz * 0.25, sz * 0.6 * a, sz * 0.09, C.ink); }
    if (i >= 3 && i <= 5) drop(cx + mw(p.replace(',', ''), sz) / 2, base - 120, 26, [C.red, C.yel, C.grn][i - 3], t, times[i] + 0.1, 160);
    cx += ws[i] + gap;
  });
  caps('ARMEMOS EL CONJUNTO DEL SEMÁFORO', 90, 420, win(t, L(6) + 0.5, L(7)));
  const notes = [['1', 'el nombre: una letra mayúscula', C.blue, L(7) + 1.2], ['2', 'el signo = se lee «es»', C.ink, L(8) + 0.9],
    ['3', 'una llave que abre', C.yel, L(9) + 0.9], ['4', 'los elementos, separados por comas', C.grn, L(10) + 3.0], ['5', 'una llave que cierra', C.yel, L(11) + 0.8]];
  notes.forEach(([n, s, c, t0], i) => { const y = 850 + i * 112, k = k01(t, t0, 0.45);
    if (k > 0) rect(90, y - 44, 12 * eo(k), 56, c); T(n, 125, y, { size: 44, weight: 800 }, k, false); T(s, 180, y, { size: 42, weight: 500 }, k); });
  // ni paréntesis ni corchetes
  T('( )   [ ]', 640, 1080, { size: 46, weight: 500 }, win(t, L(9) + 3.0, L(10)), false); xMark(860, 1062, 52, C.red, win(t, L(9) + 3.6, L(10)));
  T('«S es el conjunto cuyos elementos', 90, 1530, { size: 44, weight: 300, track: 1 }, k01(t, L(12) + 0.8, 0.45));
  T('son rojo, amarillo y verde»', 90, 1595, { size: 44, weight: 300, track: 1 }, k01(t, L(12) + 1.4, 0.45));
}
// errores comunes: tres maneras de escribirlo mal y una bien
function sErr(t) {
  const a = L(13);
  T('tres errores', 90, 330, { size: 92 }, k01(t, a + 0.2, 0.45));
  const rows = [['S = (rojo, verde)', 'paréntesis en vez de llaves'], ['S = {rojo  verde}', 'faltan las comas'], ['s = {rojo, verde}', 'el nombre va en mayúscula']];
  rows.forEach(([f, why], i) => { const y = 560 + i * 260, t0 = a + 1.4 + i * 2.2;
    T(f, 90, y, { size: 60, weight: 800 }, k01(t, t0, 0.45)); xMark(930, y - 22, 64, C.red, k01(t, t0 + 0.5, 0.45));
    T(why, 90, y + 70, { size: 40, weight: 500 }, k01(t, t0 + 0.7, 0.45)); });
  const tg = a + 8.6; growRect(60, 1290, 960, 200, C.blue, t, tg - 0.3, 0.5);
  T('S = {rojo, verde}', 110, 1418, { size: 64, col: C.paper }, k01(t, tg, 0.45)); check(910, 1390, 80, C.grn, k01(t, tg + 0.5, 0.5));
}
// pertenencia: rojo ∈ S, azul ∉ S; a la izquierda el objeto, a la derecha el conjunto
function sPer(t) {
  const a = L(14), b = L(15), c = L(16);
  growRect(330, 330, 440, 440, C.blue, t, a - 0.4, 0.6); T('S', 230, 430, { size: 96, col: C.blue }, k01(t, a - 0.1, 0.45), false);
  [[C.red, 430, 470], [C.yel, 640, 520], [C.grn, 500, 660]].forEach(([col, x, y], i) => drop(x, y, 56, col, t, a + 0.2 + i * 0.25, 220));
  ring(880, 700, 54, C.ink, 5, -Math.PI / 2, eo(k01(t, b + 0.4, 0.5))); T('azul', 880, 810, { size: 38, weight: 500, align: 'center' }, k01(t, b + 0.8, 0.45));
  formula(['rojo', { sym: 'in', col: C.grn }, 'S'], 540, 1010, 92, t, a + 3.0, 0.45, { align: 'center' });
  light('«rojo pertenece a S»', 540, 1090, k01(t, a + 5.0, 0.45), { align: 'center' });
  const f2 = formula(['azul', { sym: 'notin', col: C.red }, 'S'], 540, 1300, 92, t, b + 3.2, 0.45, { align: 'center' });
  light('«azul no pertenece a S»', 540, 1380, k01(t, b + 5.4, 0.45), { align: 'center' });
  const ko = k01(t, c + 2.0, 0.5), kc = k01(t, c + 3.4, 0.5), x0 = (f2.pos[0][0] + f2.pos[0][1]) / 2, x2 = (f2.pos[2][0] + f2.pos[2][1]) / 2;
  if (ko > 0) line([[x0, 1405], [x0, 1405 + 120 * eo(ko)]], C.ink, 2); caps('OBJETO', x0, 1570, ko, { align: 'center' });
  if (kc > 0) line([[x2, 1405], [x2, 1405 + 120 * eo(kc)]], C.ink, 2); caps('CONJUNTO', x2, 1570, kc, { align: 'center' });
  const fr = formula(['S', { sym: 'in' }, 'azul'], 500, 1720, 52, t, c + 5.0, 0.15, { align: 'center', weight: 500 }); xMark(fr.x1 + 50, 1700, 48, C.red, k01(t, c + 5.6, 0.4));
  caps('NUNCA AL REVÉS', 540, 1790, k01(t, c + 5.8, 0.45), { align: 'center' });
}
// fin de semana: siete cuadrados, dos son de F
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
function sFin(t) {
  const a = L(17), b = L(18);
  formula(['F', { sym: 'eq' }, '{sábado, domingo}'], 540, 430, 66, t, a + 1.0, 0.4, { align: 'center', cols: [C.blue] });
  DAYS.forEach((d, i) => { const x = 85 + i * 132, y = 600, k = k01(t, a + 2.4 + i * 0.12, 0.4), inF = i >= 5;
    if (k <= 0) return; const s = back(k);
    if (inF) rect(x + 56 - 56 * s, y + 56 - 56 * s, 112 * s, 112 * s, C.yel);
    else { g.strokeStyle = C.ink; g.lineWidth = 3; g.strokeRect(x + 56 - 54 * s, y + 56 - 54 * s, 108 * s, 108 * s); }
    T(d, x + 56, y + 76, { size: 52, align: 'center' }, k, false); });
  const kb = k01(t, a + 4.0, 0.6); if (kb > 0) { g.strokeStyle = C.blue; g.lineWidth = 6; g.strokeRect(85 + 5 * 132 - 18, 582, (244 + 36) * eo(kb), 148); }
  caps('F', 85 + 5 * 132 + 120, 790, kb, { col: C.blue, size: 40 });
  formula(['domingo', { sym: 'in', col: C.grn }, 'F'], 540, 1060, 84, t, b + 0.4, 0.4, { align: 'center' });
  formula(['lunes', { sym: 'notin', col: C.red }, 'F'], 540, 1280, 84, t, b + 2.6, 0.4, { align: 'center' });
  light('cada día está o no está', 540, 1480, k01(t, b + 5.4, 0.45), { align: 'center' });
}
// por extensión: la lista completa
function sExt(t) {
  const a = L(19);
  T('por extensión', 90, 380, { size: 96 }, k01(t, a + 2.2, 0.45)); light('la lista completa', 95, 450, k01(t, a + 3.0, 0.45));
  formula(['V', { sym: 'eq' }, '{a, e, i, o, u}'], 540, 760, 92, t, a + 4.2, 0.4, { align: 'center', cols: [C.blue] });
  ['a', 'e', 'i', 'o', 'u'].forEach((v, i) => labelDisc(180 + i * 180, 1050, 70, C.red, v, k01(t, a + 5.4 + i * 0.25, 0.45), 70));
}
// por comprensión: la máquina deja pasar solo las vocales
const MLET = ['b', 'a', 'c', 'e', 'd', 'i'];
function sCom(t) {
  const a = L(20), b = L(21), c = L(22);
  T('por comprensión', 90, 330, { size: 92 }, win(t, a + 0.4, b - 0.1)); light('la condición que cumplen', 95, 400, win(t, a + 1.2, b - 0.1));
  // la máquina: un cuadrado azul con su pregunta; la banda pasa por debajo
  growRect(390, 560, 300, 300, C.blue, t, a + 2.6, 0.6); caps('¿ES VOCAL?', 540, 725, k01(t, a + 3.2, 0.45), { col: C.paper, align: 'center', size: 32 });
  cline(0, 905, W, 905, t, a + 2.8, FULL + 9, 0.6);
  ring(950, 1100, 110, C.ink, 5, -Math.PI / 2, eo(k01(t, a + 3.6, 0.6))); caps('V', 1060, 1000, k01(t, a + 4.0, 0.4), { col: C.blue, size: 40 });
  MLET.forEach((ch, i) => {
    const t0 = a + 4.6 + i * 1.3, vow = 'aeiou'.includes(ch), u = clamp((t - t0) / 1.25); if (t < t0) return;
    let x, y = 860;
    if (u < 0.5) x = lerp(-60, 540, eio(u / 0.5));
    else if (vow) { const v = eio((u - 0.5) / 0.5), slot = 'aei'.indexOf(ch); x = lerp(540, 900 + slot * 50, v); y = lerp(860, 1090 + (slot % 2) * 20, v); }
    else { const v = (u - 0.5) / 0.5; x = 540 + 60 * v; y = 860 + 1300 * v * v; }
    if (y < H + 60) labelDisc(x, y, 40, vow ? C.red : C.ink, ch, 1, 44);
  });
  const fb = formula(['V', { sym: 'eq' }, '{x : x es una vocal}'], 540, 1380, 64, t, b + 0.4, 0.4, { align: 'center', cols: [C.blue] });
  const xs = fb.pos[2][0] + mw('{', 64) + mw('x', 64) / 2, xc = fb.pos[2][0] + mw('{x ', 64) + mw(':', 64) / 2;
  const k1 = k01(t, b + 2.0, 0.45), k2 = k01(t, b + 4.0, 0.45);
  if (k1 > 0) line([[xs, 1400], [xs, 1400 + 110 * eo(k1)]], C.ink, 2); caps('CUALQUIER OBJETO', Math.max(70, xs - 60), 1555, k1);
  if (k2 > 0) line([[xc, 1400], [xc, 1400 + 50 * eo(k2)]], C.ink, 2); caps('TAL QUE', xc + 18, 1458, k2);
  T('E = {x : x estudia en este colegio}', 540, 1790, { size: 44, weight: 500, align: 'center' }, k01(t, c + 3.0, 0.45));
}
// el orden no importa: dos bolsas con lo mismo
function sOrd(t) {
  const a = L(23), b = L(24);
  ring(300, 700, 200, C.ink, 5, -Math.PI / 2, eo(k01(t, a + 0.3, 0.6))); ring(780, 700, 200, C.ink, 5, -Math.PI / 2, eo(k01(t, a + 0.5, 0.6)));
  drop(240, 700, 64, C.red, t, a + 1.2); drop(370, 700, 64, C.grn, t, a + 1.5); drop(710, 700, 64, C.grn, t, a + 1.8); drop(840, 700, 64, C.red, t, a + 2.1);
  const ke = eo(k01(t, a + 3.0, 0.4)); rect(510, 670, 60 * ke, 12, C.ink); rect(510, 710, 60 * ke, 12, C.ink);
  T('{rojo, verde} = {verde, rojo}', 540, 1080, { size: 56, align: 'center' }, k01(t, a + 4.0, 0.45));
  light('solo importa qué está', 540, 1160, k01(t, a + 5.4, 0.45), { align: 'center' });
  T('como una bolsa', 540, 1420, { size: 76, align: 'center' }, k01(t, b + 0.6, 0.45));
}
// no se repite: o-s-o → {o, s}
function sRep(t) {
  const a = L(25), b = L(26), km = eio(k01(t, b + 3.6, 1.0));
  [['o', 270, C.red], ['s', 540, C.yel], ['o', 810, C.red]].forEach(([ch, x, col], i) => {
    const k = k01(t, a + 1.8 + i * 0.4, 0.45); let xx = x;
    if (i === 2) xx = lerp(810, 270, km); else if (i === 1) xx = lerp(540, 600, km); else xx = lerp(270, 330, km);
    if (i === 2 && km >= 1) return; labelDisc(i === 0 ? lerp(270, 330, km) : xx, 640, 110, col, ch.toUpperCase(), k, 120); });
  T('oso', 540, 400, { size: 96, align: 'center' }, k01(t, a + 1.0, 0.45));
  caps('3 LETRAS', 540, 860, k01(t, b + 0.6, 0.45), { align: 'center' });
  T('{O, S, O} = {O, S}', 540, 1130, { size: 72, align: 'center' }, k01(t, b + 5.2, 0.45));
  light('la O es un solo elemento', 540, 1220, k01(t, b + 6.4, 0.45), { align: 'center' });
}
// el cardinal: cuántos elementos distintos
function sCar(t) {
  const a = L(27), b = L(28), c = L(29);
  T('cardinal', 90, 340, { size: 100 }, k01(t, a + 3.0, 0.45)); light('cuántos elementos distintos', 95, 410, k01(t, a + 3.6, 0.45));
  formula(['n(A)'], 1000, 340, 72, t, a + 5.4, 0.3, { align: 'right', cols: [C.blue] });
  ring(300, 700, 170, C.ink, 5, -Math.PI / 2, eo(k01(t, b + 0.2, 0.6))); caps('F', 140, 560, k01(t, b + 0.4, 0.4), { col: C.blue, size: 40 });
  labelDisc(240, 700, 60, C.yel, 'S', k01(t, b + 0.8, 0.4), 60); labelDisc(360, 700, 60, C.yel, 'D', k01(t, b + 1.1, 0.4), 60);
  growRect(580, 560, 400, 280, C.blue, t, b + 1.8, 0.5); T('n(F) = 2', 780, 740, { size: 82, col: C.paper, align: 'center' }, k01(t, b + 2.2, 0.45));
  const word = ['p', 'a', 'p', 'a', 'y', 'a'], kc = eio(k01(t, c + 4.0, 1.0)), colOf = { p: C.red, a: C.yel, y: C.grn }, dest = { p: 300, a: 540, y: 780 };
  word.forEach((ch, i) => { const x0 = 140 + i * 160, x = lerp(x0, dest[ch], kc), k = k01(t, c + 0.8 + i * 0.25, 0.4);
    labelDisc(x, 1120, 62, colOf[ch], ch.toUpperCase(), k, 64); });
  caps('6 LETRAS', 540, 1260, win(t, c + 2.4, c + 4.0), { align: 'center' }); caps('3 DISTINTAS', 540, 1260, k01(t, c + 5.0, 0.45), { align: 'center' });
  T('L = {P, A, Y}', 90, 1500, { size: 68 }, k01(t, c + 5.6, 0.45)); T('n(L) = 3', 990, 1500, { size: 68, col: C.blue, align: 'right' }, k01(t, c + 6.2, 0.45));
}
// dibujar un conjunto: una línea cerrada con los elementos adentro
function sDib(t) {
  const a = L(30), b = L(31);
  cross(540, 760); ring(540, 760, 340, C.ink, 6, -Math.PI / 2, eo(k01(t, a + 0.8, 1.4)));
  T('S', 230, 470, { size: 96, col: C.blue }, k01(t, a + 2.0, 0.45), false);
  [[C.red, 'rojo', 430, 680], [C.yel, 'amarillo', 650, 690], [C.grn, 'verde', 540, 880]].forEach(([col, w, x, y], i) => {
    drop(x, y, 60, col, t, a + 3.0 + i * 0.4, 260); T(w, x, y + 112, { size: 36, weight: 600, align: 'center' }, k01(t, a + 3.4 + i * 0.4, 0.4)); });
  [[C.ink, 'azul', 200, 1280], [C.ink, 'morado', 880, 1280]].forEach(([c, w, x, y], i) => { ring(x, y, 54, c, 5, -Math.PI / 2, eo(k01(t, a + 6.0 + i * 0.4, 0.5))); T(w, x, y + 110, { size: 36, weight: 500, align: 'center' }, k01(t, a + 6.4 + i * 0.4, 0.4)); });
  caps('AFUERA', 540, 1300, k01(t, a + 7.2, 0.45), { align: 'center' });
  growRect(60, 1500, 960, 170, C.blue, t, b + 0.5, 0.5);
  T('S = {rojo, amarillo, verde}', 540, 1610, { size: 58, col: C.paper, align: 'center' }, k01(t, b + 0.9, 0.45));
  caps('DICEN LO MISMO', 540, 1760, k01(t, b + 2.6, 0.45), { align: 'center' });
}
// repaso
function sRes(t) {
  const a = L(32);
  caps('REPASEMOS', 90, 300, k01(t, a - 0.3, 0.45));
  const rows = [[C.blue, 'una agrupación', 'bien definida'], [C.yel, 'mayúscula, llaves', 'y comas'], [C.grn, 'cada elemento pertenece', 'o no pertenece']];
  rows.forEach(([c, l1, l2], i) => { const y = 520 + i * 360, t0 = a + 0.6 + i * 2.6, k = k01(t, t0, 0.5);
    if (k > 0) rect(90, y - 70, 24, 190 * eo(k), c);
    T(l1, 150, y, { size: 64 }, k01(t, t0 + 0.1, 0.45)); T(l2, 150, y + 86, { size: 64, weight: 300 }, k01(t, t0 + 0.4, 0.45)); });
  formula([{ sym: 'in', col: C.grn }], 860, 1400, 120, t, a + 6.4, 0.2); formula([{ sym: 'notin', col: C.red }], 860, 1600, 120, t, a + 6.8, 0.2);
}
// cierre: el cuadrado azul crece hasta salir del cuadro; el último círculo cae en medio
function sFin2(t) {
  const u = t - OUTRO, k = eio(clamp(u / 1.4));
  rect(lerp(250, -200, k), lerp(560, -200, k), lerp(580, W + 400, k), lerp(560, H + 400, k), C.blue);
  drop(410, 840, 82, C.red, t, OUTRO + 1.4); drop(560, 840, 82, C.yel, t, OUTRO + 1.7); drop(710, 840, 82, C.grn, t, OUTRO + 2.0);
  T('conjunto', 540, 1150, { size: 120, col: C.paper, align: 'center' }, k01(t, OUTRO + 2.3, 0.45));
  caps('ÁLGEBRA · ZUKA', 540, 1240, k01(t, OUTRO + 2.8, 0.45), { col: C.paper, align: 'center' });
}
const SCENES = { por: sPor, agr: sAgr, def: sDef, not: sNot, err: sErr, per: sPer, fin: sFin, ext: sExt, com: sCom, ord: sOrd, rep: sRep, car: sCar, dib: sDib, res: sRes, fin2: sFin2 };

// ---------------- cuadro: escenas que entran y salen con un latigazo lateral ----------------

function draw(t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = C.paper; g.fillRect(0, 0, W, H);
  for (let i = 0; i < START.length; i++) {
    const [key, s0] = START[i], s1 = i + 1 < START.length ? START[i + 1][1] : FULL + 99;
    if (t < s0 || t >= s1 + TR) continue;
    const kin = i === 0 || key === 'fin2' ? 1 : eio(k01(t, s0, TR)), kout = key === 'fin2' ? 0 : eio(k01(t, s1, TR));
    const dx = (1 - kin) * W - kout * W;
    g.save(); g.translate(dx, 0); SCENES[key](t); g.restore();
  }
  // durante el latigazo pasan líneas de construcción largas
  for (let i = 1; i < START.length - 1; i++) { const s = START[i][1], k = k01(t, s, TR); if (k <= 0 || k >= 1) continue;
    [260, 780, 1300, 1700].forEach((y, j) => { const x = W * (1.2 - 2.4 * eio(k)) + j * 140; line([[x, y], [x + W * 0.9, y]], C.ink, 2); }); }
}

// ---------------- sucesos de sonido: se detectan barriendo la película una vez ----------------
function events() {
  EVREC = new Map(); for (let t = 0; t < FULL; t += 1 / 15) draw(t); const rec = [...EVREC.values()]; EVREC = null;
  const ev = rec.filter(e => e.t >= 0 && e.t < FULL).map(e => ({ ...e, t: +e.t.toFixed(3) }));
  START.forEach(([k, s], i) => { if (i > 0 && k !== 'fin2') ev.push({ t: +s.toFixed(3), type: 'whip', d: TR }); });
  ev.push({ t: OUTRO, type: 'grow', d: 1.4 }, { t: OUTRO + 2.3, type: 'final' });
  ev.push({ t: 0, type: 'narr', lines: LINES, sec: SEC, outro: OUTRO, dur: FULL });
  return ev;
}
return {
  FULL, LINES, SEC,
  render(t) { draw(t); },
  texts(t) {
    if (START.some(([k, s], i) => i > 0 && t >= s && t < s + TR + 0.2)) return [];
    REC = []; draw(t); const out = REC; REC = null;
    return out.filter(o => o.x0 > -40 && o.x1 < W + 40).map(o => ({ id: o.id, text: o.text, x0: Math.round(o.x0), y0: Math.round(o.y0), x1: Math.round(o.x1), y1: Math.round(o.y1) }));
  },
  events,
  // sonidos ligados a la imagen: se registran comparando dos cuadros seguidos (qué aparece en cada uno)
};
}
