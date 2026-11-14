// «La IA está hecha de álgebra»: la neurona de juguete, la montaña del error, el dibujo de Mishi, tiempos y textos.
// Es la única fuente de números del clip. Se prueba en Node (tests/ia-algebra.test.js).
export const BPM = 120, BEAT = 60 / BPM, BAR = 4 * BEAT;   // compás = 2 s
export const DUR = 45 * BAR;                                // 90 s

// ---------- La neurona (los valores del texto del usuario) ----------
export const X = [2, 3];          // lo que llega de la capa anterior (salidas de ReLU)
export const W0 = [0.4, -0.2];    // pesos de partida
export const B = 0.1;             // sesgo (fijo: solo se entrenan los dos pesos)
export const Y = 1;               // respuesta correcta: «gato»
export const ETA = 0.25;          // tasa de aprendizaje
export const STEPS = 12;
export const sigma = s => 1 / (1 + Math.exp(-s));
export const z = w => w[0] * X[0] + w[1] * X[1] + B;
export const yhat = w => sigma(z(w));
export const loss = w => (Y - yhat(w)) ** 2;
export function grad(w) {          // ∂L/∂wᵢ = −2(1 − ŷ) · ŷ(1 − ŷ) · xᵢ
  const y = yhat(w), k = -2 * (Y - y) * y * (1 - y);
  return [k * X[0], k * X[1]];
}
export const PATH = [];
{ let w = W0.slice();
  for (let k = 0; k <= STEPS; k++) {
    PATH.push({ w: w.slice(), y: yhat(w), L: loss(w), g: grad(w) });
    const g = grad(w); w = [w[0] - ETA * g[0], w[1] - ETA * g[1]];
  } }
// ventana de la montaña L(w₁, w₂)
export const WIN = { w1: [0, 1.2], w2: [-0.8, 0.6] };
export const LMAX = Math.max(loss([WIN.w1[0], WIN.w2[0]]), loss([WIN.w1[1], WIN.w2[1]]));

// ---------- Mishi en 16 × 16 píxeles (0 = negro, 255 = blanco) ----------
const ART = [
  '................',
  '.#............#.',
  '.##..........##.',
  '.#+#........#+#.',
  '.#++########++#.',
  '.##############.',
  '.##############.',
  '.##oo######oo##.',
  '.##oo######oo##.',
  '.##############.',
  '.+#####nn#####+.',
  '..#####ww#####..',
  '...##########...',
  '....########....',
  '......####......',
  '................',
];
const GRAY = { '.': 14, '#': 226, '+': 150, 'o': 24, 'n': 96, 'w': 70 };
const jit = (r, c) => { const h = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453; return Math.round((h - Math.floor(h) - .5) * 18); };
export const PATCH = [[0, 120, 240], [30, 180, 255], [10, 90, 200]];   // la tabla del texto
export const PATCH_AT = [8, 0];                                          // fila 8, columna 0: el borde de la mejilla
export const MISHI = ART.map((row, r) => [...row].map((ch, c) => Math.max(0, Math.min(255, GRAY[ch] + (ch === '.' ? 0 : jit(r, c))))));
PATCH.forEach((row, i) => row.forEach((v, j) => { MISHI[PATCH_AT[0] + i][PATCH_AT[1] + j] = v; }));

// ---------- Tiempos (s) ----------
export const T = {
  scanIn: [0, 3.6], title: [1.0, 9.4], outBox: 4.2, outRoll: [4.6, 5.6],
  down: [9.2, 12.2], loupe: [12.2, 21.2], matRoll: [14.4, 16.0],
  up: [21.2, 24.0], h1: 24.0, formula: [24.4, 28.0],
  whip: [27.5, 28.1], open: [28.2, 29.2], xs: 29.4, ws: 31.0, bias: 32.0, zRoll: [32.2, 32.9],
  sig: [36.2, 45.0], sigRoll: [37.0, 37.6], lossRoll: [41.4, 42.2],
  erase: [45.0, 46.5], silence: [46.5, 47.0], mtn: [47.0, 50.0], ball: 50.0, arrow: 51.6, rule: [54.6, 64.0], etaRoll: [55.2, 56.0],
  steps: [56.0, 62.0], final: 62.0,
  mtnOff: [64.0, 65.4], back: [65.4, 67.4], solid: [67.6, 69.8], outRoll2: [69.0, 70.0],
  off2: [73.6, 75.0], tokens: [75.2, 77.2], vecs: [77.2, 79.2], attn: [79.4, 83.0], tokOff: [82.8, 84.2],
  end: [84.2, 90],
};
export const stepT = k => T.steps[0] + (k - 1) * (T.steps[1] - T.steps[0]) / (STEPS - 1);   // paso k (1…12) cae en un pulso

// ---------- Rótulos ----------
const f3 = v => v.toFixed(3);
export const LABELS = {
  title: 'LA IA ES ÁLGEBRA', code: 'ZK-25 // RED NEURONAL', tag: 'MISHI EN NÚMEROS',
  out: 'SALIDA · «GATO»', out0: String(Math.round(PATH[0].y * 100)), out1: String(Math.round(PATH[STEPS].y * 100)),
  input: 'ENTRADA · 16 × 16 PÍXELES', matrix: 'BRILLO DE 9 PÍXELES', black: '0 = NEGRO', white: '255 = BLANCO',
  h1: 'CAPA 1 · 8 NEURONAS', formula: 'z = Wx + b', formulaSub: 'multiplicar y sumar',
  last: 'ÚLTIMA NEURONA',
  x: ['x₁ = ' + X[0], 'x₂ = ' + X[1]], w: ['w₁ = ' + W0[0], 'w₂ = −' + Math.abs(W0[1])], b: 'b = ' + B,
  zCalc: '2 · 0.4 + 3 · (−0.2) + 0.1', zName: 'z', zVal: String(+z(W0).toFixed(3)),
  sigName: 'SIGMOIDE', sigF: 'σ(z) = 1 / (1 + e⁻ᶻ)', sigVal: f3(PATH[0].y),
  lossName: 'ERROR', lossF: 'L = (1 − ŷ)²', lossVal: f3(PATH[0].L),
  mtn: 'MONTAÑA DEL ERROR', axW1: 'w₁', axW2: 'w₂', axL: 'L',
  ball: 'PESOS (0.4, −0.2)', rule: 'w nuevo = w − η · ∂L/∂w', eta: 'η = ' + ETA, step: 'PASO',
  lossNow: f3(PATH[STEPS].L), zNew: z(PATH[STEPS].w).toFixed(3), sigNew: f3(PATH[STEPS].y),
  tokens: ['MISHI', 'ES', 'UN', 'GATO'], vec: 'CADA PALABRA, UN VECTOR', attn: 'ATENCIÓN = PRODUCTOS ESCALARES',
  endTitle: 'LA IA ES ÁLGEBRA', endSub: 'multiplicar · sumar · bajar la montaña',
  endNote: 'Red y neurona de ejemplo, no un clasificador real', endStyle: 'SCI-FI HOLOGRAM HUD · ZUKA',
};

// ---------- Narración = subtítulos (y .srt). Duración = letras ÷ 15 + 1.6 s ----------
const C = [
  [0.5, 'Sofía le enseña a una IA la foto de su gato, Mishi.'],
  [5.6, 'La IA duda: «gato», pero solo al ' + LABELS.out0 + ' %.'],
  [10.2, 'Para la IA, Mishi no es una foto: es una tabla de números.'],
  [15.3, 'Cada número es el brillo de un píxel: 0 es negro; 255, blanco.'],
  [20.2, 'Lo sorprendente: aprenderá bajando una montaña.'],
  [24.6, 'Cada capa multiplica y suma: z = Wx + b.'],
  [28.6, 'La última neurona recibe dos números: 2 y 3.'],
  [32.9, 'Los multiplica por sus pesos y suma el sesgo: z = ' + LABELS.zVal + '.'],
  [37.6, 'La sigmoide lo vuelve un número entre 0 y 1: ' + LABELS.sigVal + '.'],
  [42.2, 'Debía dar 1. Su error: (1 − ' + LABELS.sigVal + ')² ≈ ' + LABELS.lossVal + '.'],
  [46.6, 'Ese error depende de los pesos: es una montaña.'],
  [51.2, 'La derivada señala la subida; el paso va al revés.'],
  [55.0, 'Cada paso: w nuevo = w − ' + ETA + ' · ∂L/∂w.'],
  [62.2, 'Doce pasos después, el error bajó a ' + LABELS.lossNow + '.'],
  [66.2, 'La misma foto de Mishi, con los pesos nuevos:'],
  [70.4, 'ahora dice «gato» al ' + LABELS.out1 + ' %.'],
  [74.6, 'ChatGPT hace lo mismo con palabras: cada una se vuelve un vector.'],
  [80.0, 'Sin magia: multiplicar, sumar y bajar la montaña.'],
  [84.6, 'Mishi es un gato. Y la IA, álgebra.'],
];
export const hold = s => s.replace(/\s/g, '').length / 15 + 1.6;
export const NARR = [];
for (const [t, text] of C) { const t0 = +Math.max(t, (NARR.at(-1)?.t1 ?? 0) + .1).toFixed(2); NARR.push({ id: 'n' + (NARR.length + 1), t0, t1: +(t0 + hold(text)).toFixed(2), text }); }
