// «La curva más corta»: geometría, tiempos y textos (la única fuente). Se prueba en Node (tests/curva-corta.test.js).
export const BPM = 96, BEAT = 60 / BPM, BAR = BEAT * 4;
export const q = (bar, beat = 0) => +(bar * BAR + beat * BEAT).toFixed(4);
export const DUR = q(33);                                   // 82.5 s

export const R = 6371;                                      // radio medio de la Tierra, km
export const NYC = { lat: 40.6413, lon: -73.7781, name: 'NUEVA YORK' };   // aeropuerto JFK
export const TYO = { lat: 35.7720, lon: 140.3929, name: 'TOKIO' };        // aeropuerto de Narita
export const LON0 = -165;                                   // centro del mapa plano (el Pacífico)
const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
export const wrapLon = l => ((l + 540) % 360) - 180;
export const mercY = lat => Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2));
const invMerc = y => deg(2 * Math.atan(Math.exp(y)) - Math.PI / 2);

export function centralAngle(a, b) {                       // haversine
  const p1 = rad(a.lat), p2 = rad(b.lat), dp = p2 - p1, dl = rad(b.lon - a.lon);
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
export const chord = (a, b) => 2 * R * Math.sin(centralAngle(a, b) / 2);
const vec = p => [Math.cos(rad(p.lat)) * Math.cos(rad(p.lon)), Math.cos(rad(p.lat)) * Math.sin(rad(p.lon)), Math.sin(rad(p.lat))];
export function gcPoint(a, b, f) {                         // punto en el arco del círculo máximo (slerp)
  if (f <= 0) return { lat: a.lat, lon: a.lon }; if (f >= 1) return { lat: b.lat, lon: b.lon };
  const d = centralAngle(a, b), A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
  const va = vec(a), vb = vec(b), v = va.map((x, i) => A * x + B * vb[i]);
  return { lat: deg(Math.atan2(v[2], Math.hypot(v[0], v[1]))), lon: deg(Math.atan2(v[1], v[0])) };
}
// loxodrómica hacia el oeste (la línea recta del mapa de Mercator centrado en el Pacífico)
const westDl = (a, b) => { let dl = b.lon - a.lon; if (dl > 0) dl -= 360; return dl; };
export function rhumbPoint(a, b, f) {
  const y = mercY(a.lat) + f * (mercY(b.lat) - mercY(a.lat));
  return { lat: invMerc(y), lon: wrapLon(a.lon + f * westDl(a, b)) };
}
export function rhumb(a, b) {
  const dp = rad(b.lat - a.lat), dpsi = mercY(b.lat) - mercY(a.lat), qq = Math.abs(dpsi) > 1e-12 ? dp / dpsi : Math.cos(rad(a.lat));
  return R * Math.hypot(dp, qq * rad(westDl(a, b)));
}

const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
export const TH = centralAngle(NYC, TYO);                  // 1.6998 rad
export const D_GC = R * TH, D_RH = rhumb(NYC, TYO), D_CH = chord(NYC, TYO);
export const SLAB_GC = D_GC / 1000, SLAB_RH = D_RH / 1000;   // 1 placa = 1 000 km
export const NORTH = (() => { let b = { lat: -90 }; for (let i = 0; i <= 400; i++) { const p = gcPoint(NYC, TYO, i / 400); if (p.lat > b.lat) b = p; } return b; })();

// tiempos (s)
export const T = {
  pinNY: .8, pinTY: 2.4, title: [3.0, 7.4],
  rhDraw: [7.7, 9.7], rhLabel: 9.9,
  gcDraw: [11.2, 14.2], gcLabel: 14.4,
  morph: [17.6, 23.0],
  cut: [28.0, 29.2], center: 29.6, radii: [30.2, 31.4], angle: 32.6, arc: 36.0, calc: 39.4, chordT: 43.0, uncut: [46.4, 47.6],
  north: 51.0,
  slabs: [58.2, 63.2], holdGc: 62.3, hold: 63.6, verdict: 67.2,
  routes: 71.0, end: 76.6,
};
export const SLAB_DT = (T.slabs[1] - T.slabs[0]) / Math.ceil(SLAB_RH);

// narración = subtítulos de un renglón (y .srt). Duración = letras ÷ 15 + 1.6 s.
const C = [
  [0.5, 'Ana vuela de Nueva York a Tokio.'],
  [4.3, 'En el mapa, lo directo es esta línea recta.'],
  [10.6, 'Pero su avión sube hasta Alaska.'],
  [14.1, '¿Un rodeo? Espera: al final, la curva gana.'],
  [18.1, 'El mapa es plano. La Tierra no.'],
  [21.4, 'Enrollado, la curva se endereza…'],
  [24.9, '…y la «recta» se va al sur.'],
  [28.6, 'Cortemos la Tierra por su centro'],
  [31.8, 'y por las dos ciudades: un círculo máximo.'],
  [35.6, 'Su arco es el camino más corto en la esfera.'],
  [39.5, 'Radio por ángulo, en radianes: d = R·θ.'],
  [43.1, 'Por dentro es más corto, pero no se vuela.'],
  [47.2, 'Así, la ruta pasa por Alaska:'],
  [50.8, 'su punto más al norte está a 69.6° N.'],
  [62.3, 'El arco: 10 829 km.'],
  [63.6, 'La recta del mapa: 12 745 km.'],
  [66.9, 'Casi 2 000 km más: unas 2 horas de vuelo.'],
  [70.9, 'Ningún mapa plano guarda todas las distancias.'],
  [78.4, 'Ana mira por la ventana: abajo, Alaska.'],
];
export const hold = s => s.replace(/\s/g, '').length / 15 + 1.6;
// cada línea empieza en su marca o, si la anterior sigue en pantalla, 0.1 s después de que se va
export const NARR = [];
for (const [t, text] of C) { const t0 = +Math.max(t, (NARR.at(-1)?.t1 ?? 0) + .1).toFixed(2); NARR.push({ id: 'n' + (NARR.length + 1), t0, t1: +(t0 + hold(text)).toFixed(2), text }); }

export const LABELS = {
  title: 'LA CURVA MÁS CORTA', titleSub: 'Nueva York → Tokio',
  rh: 'LÍNEA RECTA EN EL MAPA', gc: 'RUTA DEL AVIÓN',
  sea: ['OCÉANO PACÍFICO', 'OCÉANO ATLÁNTICO', 'OCÉANO ÁRTICO', 'MAR DE BERING'],
  land: ['ALASKA', 'CANADÁ', 'JAPÓN', 'RUSIA', 'ESTADOS UNIDOS'],
  cutCap: 'CORTE POR EL CENTRO DE LA TIERRA', cutHead: 'UN CÍRCULO MÁXIMO',
  radius: 'R = 6 371 km', angle: 'θ = 97.4° = 1.70 rad',
  arc: 'd = R · θ', calc: '6 371 km × 1.6998 ≈ ' + fmt(D_GC) + ' km',
  chord: 'POR DENTRO: ' + fmt(D_CH) + ' km', chordSub: 'atraviesa la Tierra',
  north: '69.6° N · EL PUNTO MÁS AL NORTE', relief: 'RELIEVE ×20',
  slab: '1 PLACA = 1 000 km',
  gcKm: fmt(D_GC) + ' km', gcName: 'ARCO DE CÍRCULO MÁXIMO',
  rhKm: fmt(D_RH) + ' km', rhName: 'RECTA DEL MAPA',
  diff: '+' + fmt(Math.round(D_RH) - Math.round(D_GC)) + ' km ≈ 2 h de vuelo',
  equator: 'EL ECUADOR TAMBIÉN ES UN CÍRCULO MÁXIMO',
  endTitle: 'LA CURVA MÁS CORTA', endSub: ['En una esfera, lo más corto', 'es un arco de círculo máximo.'],
  endStyle: '3D MAP EXPLAINER · ZUKA',
  source: ['Imagen: Sentinel-2 cloudless 2016, EOX (CC BY 4.0) · Relieve: AWS Terrain Tiles',
    'Rutas teóricas: los vuelos reales se desvían por vientos y espacio aéreo'],
};
