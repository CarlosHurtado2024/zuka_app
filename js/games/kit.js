// Kit de los minijuegos (ejercicios `play`). Cada juego, en js/games/<nombre>.js, registra
//   GAMES['<nombre>'] = { grade(state, params) → { ok, solution }, create(host, params, api) → { getState, lock, destroy } }
// grade es pura (se prueba en Node con tests/); create monta un sketch de p5.js en modo instancia.

const GAMES = {};

const PALETTE = {
  N: '#FFC53D', Z: '#4FA8FF', Q: '#34D399', I: '#FF6B7A', R: '#B9A6FF',
  brand: '#8B7BFF', bg: '#0f1226', card: '#1B2144', line: '#3A4170',
  ink: '#EEF0FF', mute: '#9AA3C7', ok: '#2FD68F', bad: '#FF5A74',
};

const P5_URL = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js';
let p5Promise = null;

// Carga p5.js una sola vez; si falla (sin conexión), la próxima llamada lo reintenta.
function loadP5() {
  if (window.p5) return Promise.resolve(window.p5);
  p5Promise ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = P5_URL;
    s.onload = () => resolve(window.p5);
    s.onerror = () => { p5Promise = null; reject(new Error('p5.js no cargó')); };
    document.head.appendChild(s);
  });
  return p5Promise;
}

// Monta un sketch en `host` con lienzo 4:5 al ancho del contenedor.
// sketch(p, size) recibe la instancia y { w, h }. Devuelve { ready: Promise, remove() }.
function mountSketch(host, sketch) {
  let inst = null, removed = false;
  const ready = loadP5().then(P5 => {
    if (removed) return;
    const w = Math.max(240, Math.round(host.clientWidth || 320));
    const size = { w, h: Math.round(w * 1.25) };
    inst = new P5(p => sketch(p, size), host);
  });
  return { ready, remove() { removed = true; inst?.remove(); inst = null; } };
}

// Escala lineal entre valores y píxeles (rectas numéricas, ejes).
function lineMap(min, max, x0, x1) {
  const k = (x1 - x0) / (max - min);
  return { toPx: v => x0 + (v - min) * k, toVal: px => min + (px - x0) / k };
}

// Índice del punto más cercano a (x, y) dentro de `radius`, o -1.
function nearest(points, x, y, radius) {
  let best = -1, bestD = radius;
  points.forEach((pt, i) => {
    const d = Math.hypot(pt.x - x, pt.y - y);
    if (d <= bestD) { best = i; bestD = d; }
  });
  return best;
}
