// Kit de los minijuegos (ejercicios `play`). Cada juego, en js/games/<nombre>.js, registra
//   GAMES['<nombre>'] = { grade(state, params) → { ok, solution }, create(host, params, api) → { getState, lock, destroy } }
// grade es pura (se prueba en Node con tests/); create monta un sketch de p5.js en modo instancia.

const GAMES = {};

// Colores de los juegos en cada tema: un tono por familia de números y los del lienzo.
const PALETTES = {
  dark: {
    N: '#FFC53D', Z: '#4FA8FF', Q: '#34D399', I: '#FF6B7A', R: '#B9A6FF',
    brand: '#8B7BFF', bg: '#0f1226', card: '#1B2144', line: '#3A4170',
    ink: '#EEF0FF', mute: '#9AA3C7', ok: '#2FD68F', bad: '#FF5A74',
  },
  light: {
    N: '#A86F00', Z: '#1C64D6', Q: '#0B8A61', I: '#D42F4F', R: '#6A4BE6',
    brand: '#5B47F5', bg: '#FFFFFF', card: '#F1F3FA', line: '#C3CADF',
    ink: '#0B1533', mute: '#5D6688', ok: '#0F9A5C', bad: '#D8314F',
  },
};
// `api.palette` de todos los juegos: el mismo objeto cambia de valores con el tema, y como los
// juegos leen sus colores al dibujar cada cuadro, uno abierto se repinta solo al cambiar de tema.
const PALETTE = { ...PALETTES.dark };
function setGameTheme(theme) { Object.assign(PALETTE, PALETTES[theme] || PALETTES.dark); }
setGameTheme(typeof document !== 'undefined' ? document.documentElement?.dataset?.theme : 'dark');

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

// Monta un sketch en `host` con lienzo al ancho del contenedor y alto = ancho × aspect
// (4:5 por defecto). sketch(p, size) recibe la instancia y { w, h }. Devuelve { ready: Promise, remove() }.
// El lienzo nunca se escala con CSS (p5 no corrige esa escala al leer el dedo): si el contenedor
// cambia de ancho, se redimensiona y se llama p.onResize() para que el juego reacomode todo.
function mountSketch(host, sketch, aspect = 1.25) {
  let inst = null, removed = false, ro = null;
  const widthOf = () => Math.max(240, Math.floor(host.clientWidth || 320));
  const ready = loadP5().then(P5 => {
    if (removed) return;
    const size = { w: widthOf(), h: 0 };
    size.h = Math.round(size.w * aspect);
    inst = new P5(p => {
      sketch(p, size);
      // p5 1.9 no cae de touchstart/touchend a mousePressed/mouseReleased (solo touchmove cae en
      // mouseDragged), así que en el celular el toque nunca agarraba nada. Los juegos escriben solo
      // los manejadores de ratón; aquí se enlazan los táctiles, devolviendo el mismo valor
      // (false cancela el toque y evita el clic emulado que el móvil dispara después).
      p.touchStarted ??= (...a) => p.mousePressed?.(...a);
      p.touchMoved ??= (...a) => p.mouseDragged?.(...a);
      p.touchEnded ??= (...a) => p.mouseReleased?.(...a);
    }, host);
    ro = new ResizeObserver(() => {
      const w = widthOf();
      if (!inst || w === size.w) return;
      size.w = w; size.h = Math.round(w * aspect);
      inst.resizeCanvas(size.w, size.h);
      inst.onResize?.();
    });
    ro.observe(host);
  });
  return { ready, remove() { removed = true; ro?.disconnect(); inst?.remove(); inst = null; } };
}

// Permutación determinista de 0..n−1 a partir de una semilla de texto (nunca la identidad si n > 1):
// las opciones de un ejercicio salen barajadas, pero siempre en el mismo orden al reabrirlo.
function shuffledOrder(n, seed) {
  let h = 2166136261;
  for (const ch of String(seed)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  const rnd = () => { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 4294967296; };
  const o = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) { const k = Math.floor(rnd() * (i + 1)); [o[i], o[k]] = [o[k], o[i]]; }
  if (n > 1 && o.every((v, i) => v === i)) o.push(o.shift());
  return o;
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
