// «El arroz del rey»: datos, tiempos y textos (la única fuente). Se prueba en Node (tests/arroz-ajedrez.test.js).
// Cuentas exactas con BigInt; masas con 25 mg por grano y la cosecha mundial de 520 Mt (ver FACTS.md).
export const BPM = 96, BEAT = 60 / BPM, BAR = BEAT * 4;
export const q = (bar, beat = 0) => +(bar * BAR + beat * BEAT).toFixed(4);
export const DUR = q(29);                                  // 72.5 s

export const MG = 25, HARVEST_T = 520e6;                   // mg por grano; toneladas por año de cosecha mundial
export const grains = n => 1n << BigInt(n - 1);           // casilla n → 2ⁿ⁻¹
export const total = (1n << 64n) - 1n;
// 1 234 567 (espacio entre miles, como en el resto de la app)
export const fmt = b => String(b).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
export const tonnes = b => Number(b) * MG / 1e9;          // granos → toneladas
export const PLATES64 = Math.round(tonnes(grains(64)) / HARVEST_T);              // 443
export const PLATES_REST = Math.round(tonnes(grains(64) - 1n) / HARVEST_T);      // 443
export const YEARS_ALL = Math.round(tonnes(total) / HARVEST_T);                  // 887
export const BRASS_EVERY = 10;

// cuándo empieza cada casilla (1–10 tienen granos de verdad)
export const SQ_T = { 1: .25 };
for (let n = 2; n <= 8; n++) SQ_T[n] = q(3) + (n - 2) * BEAT * 2;   // 7.5 … 15.0
SQ_T[9] = q(7); SQ_T[10] = q(8);                                      // montones: 17.5 y 20.0
export const POUR = 1.8;

export const T = {
  read: { 20: 26.3, 30: 29.0, 40: 31.7, 50: 34.4 },
  hero: q(15, 0) + .2,             // casilla 64
  towerA: q(18, 1), towerB: q(20, 0), towerLen: 3.75,
  unit: [q(18, 1) + 1.2, q(20, 0) + .6],
  hold: q(21, 3) - .25,            // las dos lecturas de las torres
  suck: q(22, 3) - .45, verdict: q(22, 3),
  crane: q(23),
  totalRead: q(24, 1),
  suck2: q(26, 2) - .45, puck: q(26, 2),
  grain1: q(26, 3) + .2,
  end: q(27, 0),
};

// narración = subtítulos de un renglón (y .srt). Duración = letras ÷ 15 + 1.6 s.
const C = [
  [0.4, 'Un rey quiso premiar al inventor del ajedrez.'],
  [4.8, 'Pidió un grano en la primera casilla,'],
  [8.6, 'y en cada una, el doble que en la anterior.'],
  [12.7, 'El rey se rió y aceptó.'],
  [20.0, 'En la casilla 10 el arroz ya no cabe.'],
  [24.2, 'Y el tablero tiene 64 casillas.'],
  [28.0, 'Cada 10 casillas hay unas mil veces más.'],
  [32.4, 'Espera a la última: guarda una sorpresa.'],
  [37.6, 'Casilla 64: más de 9 trillones de granos.'],
  [42.0, 'Unos 230 000 millones de toneladas.'],
  [46.3, 'Cada placa: el arroz del mundo de un año.'],
  [50.7, 'Una torre: la 64. La otra: las 63 restantes.'],
  [54.9, 'Cada una: unos 443 años de cosecha.'],
  [58.9, 'La 64: un grano más que las otras 63 juntas.'],
  [63.5, 'Duplicar y duplicar: crecimiento exponencial.'],
  [68.2, 'Todo empezó con un solo grano.'],
];
export const hold = s => s.replace(/\s/g, '').length / 15 + 1.6;
export const NARR = C.map(([t0, text], i) => ({ id: 'n' + (i + 1), t0, t1: +(t0 + hold(text)).toFixed(2), text }));

const sup = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export const pow2 = e => '2' + String(e).split('').map(d => sup[d]).join('');
export const READ = {
  20: ['casilla 20', fmt(grains(20)) + ' granos', '≈ 13 kg'],
  30: ['casilla 30', fmt(grains(30)) + ' granos', '≈ 13 toneladas'],
  40: ['casilla 40', fmt(grains(40)) + ' granos', '≈ 13 700 toneladas'],
  50: ['casilla 50', fmt(grains(50)), 'granos ≈ 14 millones de toneladas'],
};
export const LABELS = {
  sq1: 'casilla 1 · 1 grano',
  unitGrain: '1 grano ≈ 25 mg',
  sq10: ['casilla 10', '512 granos', 'ya no cabe en su casilla'],
  hero: ['casilla 64', fmt(grains(64)), 'granos = ' + pow2(63) + ' ≈ 9.2 trillones', '≈ 230 000 millones de toneladas'],
  unit1: '1 placa = un año de arroz', unit1b: 'de todo el mundo (≈ 520 Mt)', unit2: 'latón = 10 años',
  towerA: ['casilla 64', '≈ ' + PLATES64 + ' años', 'de cosecha mundial'],
  towerB: ['casillas 1 a 63', '≈ ' + PLATES_REST + ' años', 'de cosecha mundial'],
  verdict: ['casilla 64 =', 'casillas 1 a 63 + 1 grano'],
  total: ['todo el tablero', fmt(total), 'granos = ' + pow2(64) + ' − 1 ≈ 18.4 trillones', '≈ ' + YEARS_ALL + ' años de cosecha mundial'],
  puck: pow2(64) + ' − 1',
  source: ['granos = 2ⁿ⁻¹ · 1 grano ≈ 25 mg', 'cosecha mundial ≈ 520 Mt (USDA, 2023/24)'],
  title: 'El arroz del rey', sub: 'crecer de forma exponencial', style: 'DATA PHYSICALIZATION · ZUKA',
};
