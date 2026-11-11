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

// ---------- Ayudas para juegos de funciones (plano cartesiano) ----------
// Vista de un plano en el rectángulo `box` (píxeles) con rangos xr, yr: X/Y pasan a píxeles, toX/toY vuelven.
function planeView(box, xr, yr) {
  const mx = lineMap(xr[0], xr[1], box.x, box.x + box.w), my = lineMap(yr[0], yr[1], box.y + box.h, box.y);
  return { box, xr, yr, X: mx.toPx, Y: my.toPx, toX: mx.toVal, toY: my.toVal };
}

// Tarjeta con cuadrícula entera, ejes y números (cada 1 o cada 2 según el espacio).
function drawPlane(p, C, v) {
  const { box, xr, yr } = v;
  p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 10);
  const ux = box.w / (xr[1] - xr[0]), uy = box.h / (yr[1] - yr[0]);
  for (let x = Math.ceil(xr[0]); x <= xr[1]; x++) { p.stroke(x === 0 ? C.mute : C.line); p.strokeWeight(x === 0 ? 1.6 : 0.6); p.line(v.X(x), box.y + 2, v.X(x), box.y + box.h - 2); }
  for (let y = Math.ceil(yr[0]); y <= yr[1]; y++) { p.stroke(y === 0 ? C.mute : C.line); p.strokeWeight(y === 0 ? 1.6 : 0.6); p.line(box.x + 2, v.Y(y), box.x + box.w - 2, v.Y(y)); }
  p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(10);
  const sx = ux < 22 ? 2 : 1, sy = uy < 22 ? 2 : 1;
  const ax = Math.min(Math.max(v.Y(0), box.y + 2), box.y + box.h - 14), ay = Math.min(Math.max(v.X(0), box.x + 12), box.x + box.w - 2);
  p.textAlign(p.CENTER, p.TOP);
  for (let x = Math.ceil(xr[0] / sx) * sx; x <= xr[1]; x += sx) if (x !== 0 && x > xr[0] && x < xr[1]) p.text(String(x).replace('-', '−'), v.X(x), ax + 2);
  p.textAlign(p.RIGHT, p.CENTER);
  for (let y = Math.ceil(yr[0] / sy) * sy; y <= yr[1]; y += sy) if (y !== 0 && y > yr[0] && y < yr[1]) p.text(String(y).replace('-', '−'), ay - 3, v.Y(y));
  p.textAlign(p.CENTER, p.CENTER);
}

// Curva y = f(x) entre x0 y x1, recortada a la tarjeta; corta el trazo en saltos y donde f no existe.
function drawCurve(p, v, f, x0 = v.xr[0], x1 = v.xr[1], n = 240) {
  const lo = v.yr[0] - (v.yr[1] - v.yr[0]), hi = v.yr[1] + (v.yr[1] - v.yr[0]);
  p.noFill(); let open = false, prev = null;
  const ctx = p.drawingContext; ctx.save(); ctx.beginPath(); ctx.rect(v.box.x, v.box.y, v.box.w, v.box.h); ctx.clip();
  for (let k = 0; k <= n; k++) {
    const x = x0 + (x1 - x0) * k / n, y = f(x);
    const good = Number.isFinite(y) && y > lo && y < hi && !(prev != null && Math.abs(y - prev) > (v.yr[1] - v.yr[0]));
    if (good && !open) { p.beginShape(); open = true; }
    if (!good && open) { p.endShape(); open = false; }
    if (good) p.vertex(v.X(x), v.Y(y));
    prev = Number.isFinite(y) ? y : null;
  }
  if (open) p.endShape();
  ctx.restore();
}

// Pestañas de rondas (44 × 30 px arriba a la izquierda) y su dibujo; colorOf(i) da el borde.
// Con `w` (ancho del lienzo) las pestañas se encogen si no caben: así 5 o 6 rondas entran en 256 px.
function roundTabs(n, w) {
  const step = w ? Math.min(52, (w - 20) / n) : 52;
  return Array.from({ length: n }, (_, i) => ({ x: 12 + i * step, y: 8, w: step - 8, h: 30 }));
}
function drawTabs(p, C, tabs, cur, colorOf) {
  tabs.forEach((tb, i) => {
    p.stroke(colorOf(i)); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(tb.x, tb.y, tb.w, tb.h, 8);
    p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, tb.x + tb.w / 2, tb.y + tb.h / 2);
  });
}
const hitBox = (b, x, y) => !!b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
// Texto de un número con el signo menos tipográfico y fracciones simples (½, ⅓…).
function numTxt(v) {
  const s = v < 0 ? '−' : '', a = Math.abs(v), fr = { 0.5: '½', 0.25: '¼', 0.75: '¾' }, w = Math.floor(a), d = +(a - w).toFixed(4);
  if (fr[d]) return s + (w ? w : '') + fr[d];
  return s + String(+a.toFixed(3));
}
// Escribe `txt` centrado, encogiendo la letra hasta que quepa en `maxW`.
function fitText(p, txt, x, y, maxW, size) {
  p.textSize(size); while (size > 9 && p.textWidth(txt) > maxW) { size -= 1; p.textSize(size); }
  p.text(txt, x, y);
}
