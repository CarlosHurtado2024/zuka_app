// «¿Cómo se mide el universo?»: números, tiempos, textos en pantalla y narración. Única fuente de cifras del clip.
// Se prueba en Node (tests/distancias-radar.test.js). Fuentes de cada dato en FACTS.md.
export const W = 1080, H = 1920, FPS = 24;
export const DUR = 97;

// ---------- datos ----------
export const C_KMS = 299792;               // velocidad de la luz, km/s (299 792.458)
export const LY_PER_PC = 3.2616;           // años luz en un pársec
export const KM_PER_LY = 9.4607e12;        // km en un año luz
export const LASER = { t: 2.56, d: 384000 };                     // ida y vuelta Tierra–Luna, s; distancia media, km
export const PARALLAX = { star: 'Próxima Centauri', p: 0.768, pc: '1.30', ly: '4.2', km: '40 billones' };   // Gaia DR3: 768.07 mas
export const CANDLE = { L: 1, cells: [1, 4] };
export const CEPHEID = { name: 'Delta Cephei', period: 5.37 };   // días (5.366)
export const ANDROMEDA = '2.5 millones de años luz';
export const REDSHIFT = { lab: 656.3, obs: 669.4, H0: 70 };      // Hα en nm; H₀ en km/s por Mpc

// ---------- tomas ----------
export const T = {
  // 1 · apertura: ping desde la Tierra
  ping: 0.3, title: 1.2, mateo: 2.6, target: 3.6, noRuler: 4.6,
  // 2 · la Luna
  c2: 9.0, l2: 9.6, fire: 11.4, hit: 12.68, back: 13.96, cR: 14.6, cF: 15.4, cN: 16.2, cD: 17.2, cHalf: 18.2, omen1: 20.2, omen2: 20.8, sil2: 23.5,
  // 3 · paralaje
  c3: 24.2, l3: 24.8, jan: 26.4, sightJ: 27.0, move0: 28.4, move1: 30.4, sightL: 30.6, shift: 31.6, tri: 34.2, base: 34.8, ang: 36.0, exag: 36.6,
  coin: 38.0, coinEnd: 42.0, f1: 42.2, f2: 43.2, f3: 44.4, f4: 45.6, f5: 46.8,
  // 4 · velas estándar
  c4: 50.0, l4: 50.6, cone: 51.0, frame1: 52.2, frame2: 53.2, quarter: 53.9, inv: 54.6, fl: 55.2, cCep: 59.0, cepName: 59.4, trace: 59.8, period: 61.0, leavitt: 61.8, calibCep: 62.6, compare: 63.4, andro: 64.4,
  // 5 · corrimiento al rojo
  c5: 68.5, l5: 69.1, wave0: 69.9, stretch: 70.4, wave1: 73.3, spec: 73.5, labLine: 73.9, obsLine: 74.7, z: 75.6, v: 76.4, hub: 77.2, d: 77.9, dly: 78.7, note: 79.4, mpc: 79.9,
  // 6 · la escalera
  c6: 84.5, r1: 84.8, r2: 85.3, r3: 85.8, r4: 86.3, calib: 87.0, mateoEnd: 87.6, out: 91.6, card: 91.7, fade: 95.5,
};
export const WIPES = [T.c2, T.c3, T.c4, T.c5, T.c6], WIPE = 0.7;
export const SILENCES = [[23.5, 24.2], [38.0, 38.6]];

// ---------- textos en pantalla ----------
export const TX = {
  title: '¿Cómo se mide el universo?',
  mateo: 'MATEO BUSCA LA MÁS CERCANA AL SOL',
  target: 'PRÓXIMA CENTAURI · DISTANCIA: ?',
  noRuler: 'NADIE HA IDO · NO HAY REGLA QUE LLEGUE',
  l2: '1 · LA LUNA: LUZ DE IDA Y VUELTA',
  refl: 'REFLECTOR · APOLO 11 · 1969',
  earth: 'TIERRA · LÁSER',
  timerUnit: 'SEGUNDOS, IDA Y VUELTA',
  cR: 'c = 299 792 KM/S',
  cF: 'd = c · t ÷ 2',
  cN: '= 299 792 × 2.56 ÷ 2',
  cD: '≈ 384 000 km',
  cHalf: '÷ 2: LA LUZ FUE Y VOLVIÓ',
  scale: 'SIN ESCALA',
  omen1: 'DE UNA ESTRELLA, LA LUZ NO VUELVE',
  omen2: 'LA PISTA: UN ÁNGULO DIMINUTO',
  l3: '2 · PARALAJE: UN ÁNGULO',
  sun: 'SOL',
  jan: 'TIERRA · ENERO',
  jul: 'TIERRA · JULIO',
  star: 'PRÓXIMA CENTAURI',
  far: 'ESTRELLAS LEJANAS',
  shift: 'PARECE CORRERSE FRENTE A LAS LEJANAS',
  base: '1 UA = 150 MILLONES DE KM',
  radar: 'MEDIDA CON ECOS DE RADAR',
  half: 'p = LA MITAD DEL CORRIMIENTO',
  eye: 'OJO',
  coinL: 'MONEDA · 2.3 CM',
  pcU: 'p EN SEGUNDOS DE ARCO → d EN PÁRSECS',
  ang: 'p = 0.768″',
  exag: 'ÁNGULO EXAGERADO EN EL DIBUJO',
  coin1: 'MENOS QUE UNA MONEDA',
  coin2: 'VISTA A 5 KM',
  f1: 'd = 1 ÷ p',
  f2: '= 1 ÷ 0.768 ≈ 1.30 PÁRSECS',
  f3: '1 PÁRSEC ≈ 3.26 AÑOS LUZ',
  f4: '≈ 4.2 años luz',
  f5: '≈ 40 BILLONES DE KM',
  l4: '3 · VELAS ESTÁNDAR: EL BRILLO',
  src: 'MISMA LUZ',
  frame1a: 'DISTANCIA d',
  frame1b: '1 CUADRO',
  frame2a: 'DISTANCIA 2d',
  frame2b: '4 CUADROS',
  quarter: '2 × LEJOS → 1/4 DEL BRILLO',
  inv: 'F = L ÷ (4π d²)',
  fl: 'F: BRILLO · L: LUZ REAL',
  cepName: 'CEFEIDA · DELTA CEPHEI',
  traceLab: 'BRILLO',
  period: 'LATE CADA 5.37 DÍAS',
  leavitt1: 'LEAVITT, 1912:',
  leavitt2: 'CUANTO MÁS LENTO LATE, MÁS LUZ DA',
  calibCep: 'REGLA CALIBRADA CON PARALAJE',
  compare: 'LUZ REAL ÷ LUZ QUE LLEGA = 4π d²',
  andro: 'ANDRÓMEDA ≈ 2.5 MILLONES DE AÑOS LUZ',
  l5: '4 · CORRIMIENTO AL ROJO',
  gal: 'GALAXIA',
  stretch: 'EL ESPACIO SE ESTIRA · LA LUZ TAMBIÉN',
  labLine: 'LABORATORIO · 656.3 NM',
  obsLine: 'LLEGA · 669.4 NM',
  red: 'HACIA EL ROJO →',
  z: 'z = (669.4 − 656.3) ÷ 656.3 ≈ 0.02',
  v: 'v ≈ c · z ≈ 6 000 KM/S',
  hub: 'v = H₀ · d · H₀ ≈ 70 KM/S POR Mpc',
  d: 'd = v ÷ H₀ ≈ 6 000 ÷ 70 ≈ 86 Mpc',
  mpc: '1 Mpc = 1 MILLÓN DE PÁRSECS',
  dly: '≈ 280 millones de años luz',
  note: 'VALE PARA GALAXIAS CERCANAS',
  exag2: 'ESTIRAMIENTO EXAGERADO',
  r1a: 'Ecos de luz', r1b: 'LUNA 384 000 KM · 1 UA',
  r2a: 'Paralaje', r2b: '4.2 AÑOS LUZ',
  r3a: 'Velas estándar', r3b: '2.5 MILLONES DE AÑOS LUZ',
  r4a: 'Corrimiento al rojo', r4b: '280 MILLONES DE AÑOS LUZ',
  calib: 'CADA ESCALÓN CALIBRA EL SIGUIENTE',
  mateoEnd1: 'MATEO YA TIENE SU NÚMERO:',
  mateoEnd2: '4.2 AÑOS LUZ, DESDE SU CASA',
  cardT: 'Cómo se mide el universo',
  cardS: 'ZUKA · CURIOSIDADES',
  cardD: 'DATOS: NASA · ESA GAIA · NIST · CFA HARVARD',
};
export const ALL_TEXT = Object.values(TX);

// ---------- narración (va al .srt; el video no lleva voz) ----------
const C = [
  [0.5, 'Mateo busca con su telescopio la estrella más cercana al Sol y quiere saber a qué distancia está.'],
  [5.2, 'Nadie ha ido hasta allá y no hay regla que alcance. Pero hay luz.'],
  [9.4, 'Primer escalón, la Luna: un láser rebota en el espejo que dejó el Apolo 11 y vuelve en 2.56 segundos.'],
  [15.4, 'La luz recorre 299 792 km por segundo. Fue y volvió: la distancia es la mitad, unos 384 000 km.'],
  [20.6, 'De una estrella la luz no vuelve. La pista será un ángulo diminuto.'],
  [24.4, 'Segundo escalón, el paralaje: en seis meses la Tierra mira desde el otro lado de su órbita.'],
  [30.2, 'Desde ahí, una estrella cercana parece correrse frente a las lejanas, como un dedo visto con un ojo y luego con el otro.'],
  [36.4, 'La mitad de ese corrimiento es el ángulo p. Para Próxima Centauri, 0.768 segundos de arco: menos que una moneda vista a 5 kilómetros.'],
  [42.4, 'Y alcanza. Un pársec es la distancia desde la que 1 UA se ve con 1 segundo de arco: d = 1 ÷ p da 1.30 pársecs, unos 4.2 años luz. Cuarenta billones de kilómetros, medidos con un ángulo.'],
  [50.2, 'Tercer escalón, el brillo: al doble de distancia, la misma luz se reparte en cuatro veces más área y se ve cuatro veces más débil.'],
  [59.0, 'En 1912 Henrietta Leavitt descubrió que las cefeidas que laten más despacio dan más luz; esa regla se calibró con cefeidas cercanas medidas por paralaje.'],
  [64.4, 'Comparando su luz real con la que llega se despeja la distancia: así se midió Andrómeda, a unos 2.5 millones de años luz.'],
  [68.9, 'Cuarto escalón: el universo se expande y estira la luz que viaja por él. La línea del hidrógeno llega corrida hacia el rojo.'],
  [75.6, 'Corrida un 2 %: para un corrimiento pequeño el estiramiento se lee como una velocidad, unos 6 000 km/s. Las galaxias más lejanas se alejan más rápido; con la ley de Hubble y Lemaître, esta está a unos 280 millones de años luz.'],
  [84.7, 'Cada escalón calibra el siguiente. Y Mateo ya tiene su número: 4.2 años luz, sin salir de casa.'],
  [90.6, 'Lo que no podemos alcanzar lo medimos con luz y geometría.'],
];
// cada línea dura lo que tarda en leerse (o hasta la siguiente, lo que llegue antes)
export const hold = s => s.replace(/\s/g, '').length / 17 + .8;
export const NARR = C.map(([t0, text], i) => ({ id: 'n' + (i + 1), t0, t1: +Math.min(C[i + 1]?.[0] - .1 || DUR, t0 + hold(text)).toFixed(2), text }));
