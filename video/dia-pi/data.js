// «¿Por qué el 14 de marzo?» (Caption News, vertical): cortes, subtítulos grandes, números y fechas.
// Es la única fuente del clip; se prueba en Node (tests/dia-pi.test.js).
export const W = 1080, H = 1920, FPS = 30, BPM = 120;
export const DUR = 77;

// ---------- números ----------
export const PI = '3.14159265';
export const MUG = { C: 26.1, d: 8.3 };                       // lo que escribe la mano en el video de Terra X
export const ratio = MUG.C / MUG.d;                          // 3.1446…
export const DATES = { shaw: 1988, house: 2009, houseDay: '12 mar 2009', unesco: '26 nov 2019', first: '14 mar 2020' };

// ---------- planos (cada corte en la rejilla de medio pulso: múltiplos de 0.5 s) ----------
// k: tipo de plano; fr: secuencia de cuadros preparada (assets/fr/<fr>_NNN.jpg); o: segundo de la secuencia en el que empieza
export const SHOTS = [
  { a: 0.0, b: 3.0, k: 'vid', fr: 'tb', o: 0, z: [1.0, 1.05], cr: 'Video: Lycée Georges Baptiste · CC BY 3.0' },
  { a: 3.0, b: 4.5, k: 'vid', fr: 'kb', o: 0, z: [1.0, 1.03], cr: 'Video: ZDF/Terra X · CC BY 4.0' },
  { a: 4.5, b: 5.0, k: 'vid', fr: 'tb', o: 3, z: [1.0, 1.0], cr: 'Video: Lycée Georges Baptiste · CC BY 3.0' },
  { a: 5.0, b: 8.5, k: 'sting', fr: 'tb', o: 3.5, cr: 'Video: Lycée Georges Baptiste · CC BY 3.0' },
  { a: 8.5, b: 12.0, k: 'photo', im: 'pie', z: [1.0, 1.05], cr: 'Foto: Shisma · CC BY 4.0' },
  { a: 12.0, b: 15.5, k: 'freeze', fr: 'ta', o: 0, tf: 12.5, cr: 'Video: Lycée Georges Baptiste · CC BY 3.0' },
  { a: 15.5, b: 20.5, k: 'split', cr: 'Video: Lycée Georges Baptiste · CC BY 3.0' },
  { a: 20.5, b: 25.5, k: 'digits' },
  { a: 25.5, b: 28.5, k: 'inset', fr: 'k1', o: 0, z: [1.0, 1.04], cr: 'Video: ZDF/Terra X · CC BY 4.0' },
  { a: 28.5, b: 30.5, k: 'inset', fr: 'k1', o: 2.0, z: [1.0, 1.04], cr: 'Video: ZDF/Terra X · CC BY 4.0' },
  { a: 30.5, b: 34.0, k: 'mug' },
  { a: 34.0, b: 39.0, k: 'unroll' },
  { a: 39.0, b: 43.0, k: 'grid' },
  { a: 43.0, b: 47.0, k: 'year' },
  { a: 47.0, b: 52.0, k: 'doc' },
  { a: 52.0, b: 56.5, k: 'photo', im: 'unesco', z: [1.0, 1.04], cr: 'Foto: Fred Romero · CC BY 2.0', lt: ['Sede de la UNESCO', 'París'] },
  { a: 56.5, b: 60.5, k: 'vid', fr: 'ef', o: 0, z: [1.0, 1.04], cr: 'Video: Mythomen · CC0' },
  { a: 60.5, b: 65.0, k: 'vid', fr: 'tb', o: 6.5, z: [1.04, 1.0], cr: 'Video: Lycée Georges Baptiste · CC BY 3.0' },
  { a: 65.0, b: 68.5, k: 'vid', fr: 'ta', o: 0, z: [1.06, 1.0], cr: 'Video: Lycée Georges Baptiste · CC BY 3.0' },
  { a: 68.5, b: 72.0, k: 'vid', fr: 'tb', o: 9.6, z: [1.0, 1.04], cr: 'Video: Lycée Georges Baptiste · CC BY 3.0' },
  { a: 72.0, b: 77.0, k: 'end', fr: 'tb', o: 8.1 },
];
// secuencias de cuadros: archivo de origen (raw/), segundo de inicio, duración, recorte (x del centro en el cuadro de 1920)
export const CLIPS = {
  tb: { src: 'tarte_b.mp4', ss: 4, t: 13.2, cx: 960 },
  kb: { src: 'kreis_b.mp4', ss: 1.5, t: 1.55, cx: 1000 },
  ta: { src: 'tarte_a.mp4', ss: 3.5, t: 3.6, cx: 900 },
  k1: { src: 'kreis_a.mp4', ss: 0, t: 4.6, crop: [600, 600, 100, 180], size: [900, 900] },   // sin el papel, el logo ni la marca de agua
  ef: { src: 'eiffel.mp4', ss: 2.0, t: 4.1, cx: 1060 },
};

// ---------- subtítulos grandes (con bloques |, palabra clave {…}) y renglón pequeño ----------
// el renglón pequeño es la narración (y el .srt); null = solo el subtítulo grande
export const HOOK = { t0: 0.13, t1: 5.0, kicker: 'DÍA INTERNACIONAL DE LAS MATEMÁTICAS', num: '14', unit: 'DE MARZO', small: 'Cada año, el mundo celebra las matemáticas.' };
export const CAPS = [
  { t0: 8.6, t1: 12.0, big: 'En Colombia|se escribe {14/3}', small: 'Día primero, mes después.' },
  { t0: 12.1, t1: 15.5, big: '¿Qué tiene|de {matemático}?', small: null },
  { t0: 15.6, t1: 20.5, big: 'En EE. UU.|el mes va {primero}', small: 'En Estados Unidos, el 14 de marzo se escribe 3/14.' },
  { t0: 20.6, t1: 25.5, big: '3/14 se parece|a {π}', small: 'Son los primeros dígitos de pi: 3.14159…' },
  { t0: 25.6, t1: 29.0, big: '¿Y qué es {π}?', small: 'Sale de medir un círculo.' },
  { t0: 29.1, t1: 34.0, big: 'Contorno|entre {diámetro}', small: 'Esta taza: 26.1 cm de contorno y 8.3 cm de diámetro.' },
  { t0: 34.1, t1: 39.0, big: 'Siempre da|{3.14…}', small: 'El contorno mide un poco más de 3 diámetros.' },
  { t0: 39.1, t1: 43.0, big: 'Sin importar|el {tamaño}', small: 'Todo círculo da el mismo número.' },
  { t0: 43.1, t1: 47.0, big: '1988: el primer|{Día de Pi}', small: 'Larry Shaw, museo de San Francisco.' },
  { t0: 47.1, t1: 52.0, big: '2009: la Cámara|de EE. UU. lo {apoya}', small: 'Pi ≈ 3.14: el 14 de marzo es «un día apropiado».' },
  { t0: 52.1, t1: 56.5, big: '2019: la {UNESCO}|elige el 14/3', small: 'Lo proclama Día Internacional de las Matemáticas.' },
  { t0: 56.6, t1: 60.5, big: 'Primera fiesta:|{14/3/2020}', small: '14 de marzo de 2020, en todo el mundo.' },
  { t0: 60.6, t1: 65.0, big: 'No es el|{cumpleaños} de π', small: 'La fecha sale de escribir 3/14.' },
  { t0: 65.5, t1: 68.5, big: 'No celebra|un número:', small: null, big2: true },
  { t0: 68.5, t1: 72.0, big: 'celebra|{las matemáticas}.', small: null, big2: true },
];
export const SILENCES = [[12.1, 15.5], [65.0, 65.5]];
export const TITLE = { main: '¿Por qué el|14 de marzo?', sub: 'EL DÍA DE π', chip: 'UNESCO · 2019' };
export const BUG = { ch: 'ZUKA', topic: 'EL DÍA DE π' };
export const END = {
  title: 'EL DÍA DE π', line: '14/3  →  3/14  →  3.14…', style: 'CAPTION NEWS · ZUKA',
  credits: [
    'Datos: idm314.org (UNESCO, 40.ª Conferencia General, 26 nov 2019) · Exploratorium · H. Res. 224 (EE. UU., 2009, dominio público)',
    'Video: «Was sich hinter der Kreiszahl pi verbirgt», ZDF/Terra X/Bilderfest/Lena Paul/Dirk Hagen/Saba Bussmann/Jochen Schmidt, CC BY 4.0',
    'Video: «Ma première tarte abricot», Lycée Georges Baptiste, CC BY 3.0',
    'Video: «Sunset on Eiffel Tower in Paris», Mythomen, CC0',
    'Fotos: «Pi Day pie», Shisma, CC BY 4.0 · «Paris - UNESCO», Fred Romero, CC BY 2.0',
    'Todo el material de video y foto está recortado y con el color ajustado.',
  ],
};
// el .srt: el subtítulo grande y luego el renglón pequeño
export const plain = s => s.replace(/[|{}]/g, m => (m === '|' ? ' ' : '')).replace(/\s+/g, ' ').trim();
export const CUES = [{ t0: HOOK.t0, t1: HOOK.t1, text: HOOK.small }, ...CAPS.map(c => ({ t0: c.t0, t1: c.t1, text: c.small ? (/[?!…]$/.test(plain(c.big)) ? plain(c.big) + ' ' : plain(c.big).replace(/[.:]$/, '') + '. ') + c.small : plain(c.big) }))];
