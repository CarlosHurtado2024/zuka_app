// Kit de los minijuegos (ejercicios `play`). Cada juego, en js/games/<nombre>.js, registra
//   GAMES['<nombre>'] = { grade(state, params) → { ok, solution }, create(host, params, api) → { getState, lock, destroy } }
// grade es pura (se prueba en Node con tests/); create monta un sketch de p5.js en modo instancia.

const GAMES = {};

// Colores de los juegos en cada tema: un tono por familia de números y los del lienzo.
// Son los de los videos zoom de las lecciones (video/*-zoom/flat.js): azul noche, crema, sol, coral,
// menta y azul. En el tema claro el papel es crema y los mismos tonos van más oscuros para leerse.
// sun, coral, mint, sky, cream, night: rellenos de adorno (fichas, confeti); star y halo: el fondo.
const PALETTES = {
  dark: {
    N: '#FFC84A', Z: '#56CCF2', Q: '#3FD8AE', I: '#FF6B5E', R: '#C3A6FF',
    brand: '#5B8CFF', bg: '#1D2052', card: '#272C68', line: '#444B96',
    ink: '#FFF4E2', mute: '#A7ACE0', ok: '#2FE08F', bad: '#FF5A74',
    sun: '#FFC84A', coral: '#FF6B5E', mint: '#3FD8AE', sky: '#4D7CFE', cream: '#FFF4E2', creamD: '#E6CFA8', night: '#1D2052',
    star: '#9298D4', halo: '#252A63',
  },
  light: {
    N: '#A86F00', Z: '#1479C9', Q: '#0B8A61', I: '#E0453A', R: '#6A4BE6',
    brand: '#3A5FD9', bg: '#FFF6E6', card: '#FFFFFF', line: '#E2CFAE',
    ink: '#1D2052', mute: '#5B6090', ok: '#0F9A5C', bad: '#D8314F',
    sun: '#FFB627', coral: '#FF6B5E', mint: '#22B38C', sky: '#4D7CFE', cream: '#FFFFFF', creamD: '#E2CFAE', night: '#1D2052',
    star: '#F3CE96', halo: '#FBE8C8',
  },
};
// `api.palette` de todos los juegos: el mismo objeto cambia de valores con el tema, y como los
// juegos leen sus colores al dibujar cada cuadro, uno abierto se repinta solo al cambiar de tema.
const PALETTE = { ...PALETTES.dark };
function setGameTheme(theme) { Object.assign(PALETTE, PALETTES[theme] || PALETTES.dark); }
setGameTheme(typeof document !== 'undefined' ? document.documentElement?.dataset?.theme : 'dark');

// ---------- Estilo «video» (spec 2026-11-13-juegos-estilo-video) ----------
// Letra de los videos (Jost); mientras carga, o sin conexión, se ve la del sistema.
// p5 toma el nombre como una sola familia (no admite lista de respaldo): se da Jost solo si ya cargó.
// `document.fonts.check` dice «sí» aunque Jost no esté declarada (sin conexión): hay que ver una cara ya cargada.
let jostReady = false;
function jostLoaded(fonts) {
  try { return [...(fonts || [])].some(f => /Jost/i.test(f.family) && f.status === 'loaded'); } catch { return false; }
}
const gameFont = () => ((jostReady ||= typeof document !== 'undefined' && jostLoaded(document.fonts)) ? 'Jost' : 'system-ui');
const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// Tinta que se lee sobre un relleno: azul noche sobre tonos claros, blanca sobre oscuros.
function inkOn(hex, fallback = '#FFFFFF') {
  if (typeof hex !== 'string' || !/^#[0-9a-f]{6}$/i.test(hex)) return fallback;
  const v = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2] > 0.215 ? '#1D2052' : '#FFFFFF';   // 0.215: donde el azul noche empieza a contrastar más que el blanco
}

// Anima los valores de un objeto con anime.js (js/vendor/anime.min.js). Sin anime (pruebas) o con
// «reducir movimiento», deja el valor final de una vez.
function fxTween(target, props, opts = {}) {
  if (typeof anime !== 'function' || reducedMotion()) { Object.assign(target, props); opts.complete?.(); return null; }
  return anime({ targets: target, duration: 420, easing: 'easeOutCubic', ...props, ...opts });
}

// Estrellas del fondo: puntos fijos (siempre los mismos para un tamaño de lienzo), con su fase de titileo.
function backdropDots(w, h) {
  let s = 20261113;
  const rnd = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const n = Math.round(w * h / 5200);
  return Array.from({ length: n }, () => ({ x: +(rnd() * w).toFixed(1), y: +(rnd() * h).toFixed(1), r: +(0.7 + rnd() * 1.5).toFixed(2), ph: +(rnd() * 6.28).toFixed(2) }));
}
// Fondo de los videos: color del tema, dos halos de círculos en las esquinas y estrellas que titilan.
const BACKDROPS = new WeakMap();
function drawBackdrop(p) {
  const ctx = p.drawingContext, W = p.width, H = p.height, C = PALETTE;
  if (!ctx?.save) return;
  let b = BACKDROPS.get(p);
  if (!b || b.w !== W || b.h !== H) BACKDROPS.set(p, b = { w: W, h: H, dots: backdropDots(W, H), still: reducedMotion() });
  const d = typeof p.pixelDensity === 'function' ? p.pixelDensity() : 1, t = b.still ? 0 : performance.now() / 1000;
  const disc = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); };
  ctx.save(); ctx.setTransform(d, 0, 0, d, 0, 0);
  ctx.fillStyle = C.halo;
  ctx.globalAlpha = 0.55; disc(W + 6, H * 0.2, 116); disc(-10, H + 6, 96);
  ctx.globalAlpha = 0.5; disc(W + 6, H * 0.2, 72); disc(-10, H + 6, 56);
  ctx.fillStyle = C.star;
  for (const o of b.dots) { ctx.globalAlpha = b.still ? 0.45 : 0.3 + 0.3 * (1 + Math.sin(t * 1.4 + o.ph)) / 2 + 0.1; disc(o.x, o.y, o.r); }
  ctx.restore();
}

// Onda que sale donde el juego agarra o toca algo (la dibuja mountSketch encima de cada cuadro).
function drawRipples(p, list) {
  if (!list.length) return;
  const ctx = p.drawingContext, d = typeof p.pixelDensity === 'function' ? p.pixelDensity() : 1;
  ctx.save(); ctx.setTransform(d, 0, 0, d, 0, 0); ctx.strokeStyle = inkOn(PALETTE.bg) === '#FFFFFF' ? PALETTE.sun : PALETTE.coral; ctx.lineWidth = 2.5;   // sol sobre la noche, coral sobre el crema
  for (const r of list) { ctx.globalAlpha = Math.max(0, r.a); ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 6.2832); ctx.stroke(); }
  ctx.restore();
}

// Trozos de confeti (círculos, cuadrados y triángulos planos, como las formas de los videos): hacia
// dónde vuela cada uno, cuánto gira, su color (clave de la paleta) y su forma.
function confettiBits(n) {
  const colors = ['sun', 'coral', 'mint', 'sky'], shapes = ['dot', 'sq', 'tri'];
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI + (Math.random() - 0.5) * 0.5, d = 60 + Math.random() * 120;
    return { dx: Math.round(Math.cos(a) * d), dy: Math.round(Math.sin(a) * d * 0.85 - 10), rot: Math.round((Math.random() - 0.5) * 540), size: 7 + Math.round(Math.random() * 7), color: colors[i % colors.length], shape: shapes[(i * 7 + (i >> 2)) % shapes.length] };
  });
}
// Celebración sobre el recuadro del juego al acertar: un aro que crece y confeti que sale del centro.
function playFx(box, ok) {
  if (!ok || !box || typeof anime !== 'function' || reducedMotion()) return;
  const layer = document.createElement('div');
  layer.className = 'play-fx';
  const ring = document.createElement('i'); ring.className = 'fx-ring'; layer.appendChild(ring);
  const bits = confettiBits(20).map(b => {
    const el = document.createElement('i');
    el.className = `fx-bit ${b.shape}`;
    el.style.width = el.style.height = b.size + 'px';
    el.style.color = PALETTE[b.color];
    layer.appendChild(el);
    return { el, b };
  });
  box.appendChild(layer);
  anime({ targets: ring, scale: [0.2, 3.2], opacity: [0.9, 0], duration: 700, easing: 'easeOutCubic' });
  anime({
    targets: bits.map(x => x.el), duration: 1100, easing: 'easeOutExpo', delay: anime.stagger(12),
    translateX: (_, i) => bits[i].b.dx, translateY: (_, i) => [0, bits[i].b.dy], rotate: (_, i) => bits[i].b.rot,
    scale: [{ value: [0, 1.15], duration: 220 }, { value: 0, duration: 520, delay: 360, easing: 'easeInCubic' }],
    complete: () => layer.remove(),
  });
}

const P5_URL ='https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js';
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
// Los juegos se diseñaron para un lienzo de unos 328 px de ancho (celular de 375) y colocan muchas
// piezas con medidas fijas: en un celular más angosto el lienzo conserva el alto de ese diseño
// (heightFor), así lo que va apilado no se encima ni se sale por abajo.
const DESIGN_W = 328;
const heightFor = (w, aspect) => Math.round(Math.max(w, DESIGN_W) * aspect);
function mountSketch(host, sketch, aspect = 1.25) {
  let inst = null, removed = false, ro = null, grabbed = false;
  const ripples = [];
  const widthOf = () => Math.max(240, Math.floor(host.clientWidth || 320));
  const ready = loadP5().then(P5 => {
    if (removed) return;
    const size = { w: widthOf(), h: 0 };
    size.h = heightFor(size.w, aspect);
    inst = new P5(p => {
      sketch(p, size);
      // Estilo de los videos en todos los juegos: la letra, el fondo con estrellas (cada vez que el
      // juego limpia el lienzo con C.bg) y una onda donde el juego agarra o toca algo.
      const rawFont = p.textFont?.bind(p), rawBg = p.background?.bind(p);
      if (rawFont) p.textFont = (f, ...a) => rawFont(f === 'system-ui' ? gameFont() : f, ...a);
      if (rawBg) p.background = (...a) => { const r = rawBg(...a); if (a.length === 1 && a[0] === PALETTE.bg) drawBackdrop(p); return r; };
      const draw0 = p.draw, press0 = p.mousePressed;
      if (draw0) p.draw = () => { draw0(); drawRipples(p, ripples); };
      if (press0) p.mousePressed = (...a) => {
        const r = press0(...a);
        if (r === false && p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height && !reducedMotion() && typeof anime === 'function') {
          const rp = { x: p.mouseX, y: p.mouseY, r: 6, a: 0.8 };
          ripples.push(rp);
          fxTween(rp, { r: 30, a: 0 }, { duration: 460, complete: () => ripples.splice(ripples.indexOf(rp), 1) });
        }
        return r;
      };
      // Red de seguridad para celulares angostos: ningún texto se sale del lienzo ni queda cortado.
      if (typeof p.text === 'function') { const raw = p.text.bind(p); p.text = (...a) => safeText(p, raw, ...a); }
      // p5 1.9 no cae de touchstart/touchend a mousePressed/mouseReleased (solo touchmove cae en
      // mouseDragged), así que en el celular el toque nunca agarraba nada. Los juegos escriben solo
      // los manejadores de ratón; aquí se enlazan los táctiles, devolviendo el mismo valor
      // (false cancela el toque y evita el clic emulado que el móvil dispara después).
      // El lienzo deja desplazar la lección con el dedo (touch-action: pan-y): un toque es del juego
      // solo si su mousePressed devuelve false (agarró algo); si no, es un desplazamiento y el juego
      // no recibe ni el arrastre ni el final de ese toque.
      // p5 escucha los toques en toda la ventana: los que no empiezan en el lienzo no son del juego.
      const outside = e => !!(e && e.target && p.canvas && e.target !== p.canvas);
      p.touchStarted ??= (...a) => { if (outside(a[0])) { grabbed = false; return undefined; } const r = p.mousePressed?.(...a); grabbed = r === false; return r; };
      p.touchMoved ??= (...a) => (grabbed ? p.mouseDragged?.(...a) : undefined);
      p.touchEnded ??= (...a) => { const mine = grabbed; grabbed = false; return mine ? p.mouseReleased?.(...a) : undefined; };
    }, host);
    ro = new ResizeObserver(() => {
      const w = widthOf();
      if (!inst || w === size.w) return;
      size.w = w; size.h = heightFor(w, aspect);
      inst.resizeCanvas(size.w, size.h);
      inst.onResize?.();
    });
    ro.observe(host);
    // El lienzo entra subiendo (solo se traslada: escalarlo con CSS descuadraría la lectura del dedo).
    if (typeof anime === 'function' && !reducedMotion() && inst?.canvas) anime({ targets: inst.canvas, translateY: [16, 0], opacity: [0, 1], duration: 520, easing: 'easeOutCubic' });
    // Si Jost aún no había cargado, el juego arrancó con la letra del sistema: al llegar, se cambia.
    if (typeof document !== 'undefined' && gameFont() !== 'Jost') {
      Promise.all([document.fonts?.load?.('700 14px Jost'), document.fonts?.load?.('400 14px Jost')])
        .then(() => { if (inst && gameFont() === 'Jost') inst.textFont('system-ui'); }).catch(() => {});
    }
    // p5 no escucha touchcancel (llamada entrante, gesto del sistema): se suelta lo que el juego tenía agarrado.
    host.addEventListener?.('touchcancel', () => { if (grabbed) { grabbed = false; inst?.mouseReleased?.(); } });
  });
  return { ready, remove() { removed = true; ro?.disconnect(); inst?.remove(); inst = null; } };
}

// ---------- Texto que siempre cabe ----------
// Parte `txt` en renglones que caben en maxW (por palabras); measure(s) da el ancho de s.
function wrapWords(txt, maxW, measure) {
  const out = [];
  for (const para of String(txt).split('\n')) {
    let cur = '';
    for (const w of para.split(' ')) {
      const t = cur ? `${cur} ${w}` : w;
      if (cur && measure(t) > maxW) { out.push(cur); cur = w; } else cur = t;
    }
    out.push(cur);
  }
  return out;
}
// Cuánto hay que correr un tramo [start, start + len] para que quede dentro de [lo, hi]. Si no cabe,
// se centra; si casi todo está fuera (algo escondido a propósito o que entra animado), no se toca.
function spanShift(start, len, lo, hi) {
  const seen = Math.min(start + len, hi) - Math.max(start, lo);
  if (seen < len * 0.4) return 0;
  if (len > hi - lo) return (lo + hi) / 2 - (start + len / 2);
  if (start < lo) return lo - start;
  if (start + len > hi) return hi - (start + len);
  return 0;
}
// p.text de todos los juegos pasa por aquí (lo enlaza mountSketch). Un texto suelto más ancho que el
// lienzo se encoge (hasta 9 px) y, si se sale por un borde, se corre hacia adentro. Un texto en caja
// (x, y, ancho, alto) que no cabe en su alto, o cuya caja se sale por abajo, se encoge y se dibuja
// renglón a renglón dentro del lienzo: p5 solo cortaría los renglones que sobran. Con el lienzo
// trasladado o girado (cartas, rótulos girados) no se toca nada: ahí las coordenadas son otras.
function safeText(p, raw, str, x, y, bw, bh) {
  const r = p._renderer, W = p.width, H = p.height;
  const m = p.drawingContext?.getTransform?.();
  if (!r || str == null || !m || Math.abs(m.b) > 1e-6 || Math.abs(m.c) > 1e-6 || Math.abs(m.e) > 0.5 || Math.abs(m.f) > 0.5) return raw(str, x, y, bw, bh);
  const s = String(str), size0 = r._textSize, align = r._textAlign, base = r._textBaseline;
  const measure = t => p.textWidth(t);
  if (bw == null) {
    const lines = s.split('\n'), width = () => Math.max(...lines.map(measure));
    let size = size0, tw = width();
    while (tw > W - 8 && size > 9) { size -= 0.5; p.textSize(size); tw = width(); }
    const left = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
    const top = base === 'center' ? y - size / 2 : base === 'top' ? y : y - size;
    const dx = spanShift(left, tw, 4, W - 4), dy = lines.length === 1 ? spanShift(top, size, 1, H - 1) : 0;
    raw(s, x + dx, y + dy);
    if (size !== size0) p.textSize(size0);
    return;
  }
  if (bh == null) return raw(str, x, y, bw);
  // Interlineado: el del juego si lo fijó (textLeading), si no el de p5 (1.25 × letra); se encoge con la letra.
  const k = r._leadingSet && r._textLeading ? r._textLeading / size0 : 1.25;
  let size = size0, lines = wrapWords(s, bw, measure);
  const need = () => (lines.length - 1) * size * k + size;
  while (need() > bh + 1 && size > 9) { size -= 0.5; p.textSize(size); lines = wrapWords(s, bw, measure); }
  const total = need(), lead = size * k;
  let top = base === 'center' ? y + (bh - total) / 2 : base === 'bottom' ? y + bh - total : base === 'alphabetic' ? y - size : y;
  top = Math.max(2, Math.min(H - 3 - total, top));
  const lx = align === 'center' ? x + bw / 2 : align === 'right' ? x + bw : x;
  p.textAlign(align, 'top');
  lines.forEach((ln, i) => raw(ln, lx, top + i * lead));
  p.textAlign(align, base);
  if (size !== size0) p.textSize(size0);
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
// Son fichas como las de los videos: la que falta va apagada (tarjeta y número gris); la respondida,
// la actual y las calificadas se rellenan con su color. La actual lleva un aro color sol y rebota al cambiar.
const TAB_FX = new WeakMap();
function drawTabs(p, C, tabs, cur, colorOf) {
  let fx = TAB_FX.get(p);
  if (!fx) TAB_FX.set(p, fx = { cur, k: 1 });
  if (fx.cur !== cur) { fx.cur = cur; fx.k = 0.7; fxTween(fx, { k: 1 }, { duration: 560, easing: 'easeOutElastic(1, .55)' }); }
  tabs.forEach((tb, i) => {
    const col = colorOf(i), on = i === cur, plain = col === C.line, k = on ? fx.k : 1;
    const w = tb.w * k, h = tb.h * k, x = tb.x + (tb.w - w) / 2, y = tb.y + (tb.h - h) / 2;
    if (on) { p.noFill(); p.stroke(C.sun); p.strokeWeight(2.5); p.rect(x - 3, y - 3, w + 6, h + 6, 11); }
    if (plain) { p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); } else { p.noStroke(); p.fill(col); }
    p.rect(x, y, w, h, 8);
    p.noStroke(); p.fill(plain ? C.mute : inkOn(col, C.ink)); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(14); p.text(i + 1, tb.x + tb.w / 2, tb.y + tb.h / 2);
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

// ---------- Piezas con el estilo de los videos (fichas, casillas, rótulos, puntos, rectas) ----------
// Oscurece (k < 1) o aclara hacia el blanco (k > 1) un color hex.
function shade(hex, k) {
  if (typeof hex !== 'string' || !/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  const f = v => Math.round(k <= 1 ? v * k : v + (255 - v) * Math.min(1, k - 1));
  return '#' + [1, 3, 5].map(i => f(parseInt(hex.slice(i, i + 2), 16)).toString(16).padStart(2, '0')).join('').toUpperCase();
}
// Ficha: bloque relleno con un labio más oscuro abajo (relieve plano) y el texto encima, con la tinta
// que se lee sobre el relleno. o = { fill, ink, r, lift, size, ring (aro de selección), k (escala) }.
function drawTile(p, C, b, txt, o = {}) {
  const fill = o.fill ?? C.cream, r = o.r ?? 10, lift = o.lift ?? 3, k = o.k ?? 1;
  const w = b.w * k, h = b.h * k, x = b.x + (b.w - w) / 2, y = b.y + (b.h - h) / 2;
  if (o.ring) { p.noFill(); p.stroke(o.ring); p.strokeWeight(2.5); p.rect(x - 3, y - 3, w + 6, h + 6 + lift, r + 3); }
  p.noStroke(); p.fill(o.lip ?? (fill === C.cream ? C.creamD : shade(fill, 0.74))); p.rect(x, y + lift, w, h, r);
  p.fill(fill); p.rect(x, y, w, h, r);
  if (txt != null && txt !== '') {
    p.fill(o.ink ?? inkOn(fill, C.ink)); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
    fitText(p, String(txt), b.x + b.w / 2, b.y + b.h / 2 + 1, w - 8, o.size ?? 17);
  }
}
// Casilla vacía (donde va una ficha): borde punteado.
function drawSlot(p, C, b, r = 10, col) {
  p.noFill(); p.stroke(col ?? C.mute); p.strokeWeight(1.5);
  p.drawingContext.setLineDash([4, 4]); p.rect(b.x, b.y, b.w, b.h, r); p.drawingContext.setLineDash([]);
}
// Rótulo de los videos: barrita y texto en versalitas. Centrado en x con o.center; si no, empieza en x.
function drawKicker(p, C, txt, x, y, o = {}) {
  const s = String(txt).toUpperCase(), ctx = p.drawingContext;
  p.textStyle(p.BOLD); p.textSize(o.size ?? 11);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
  const tw = Math.min(p.textWidth(s), p.width - 30), x0 = o.center ? x - (tw + 9) / 2 : x;
  p.noStroke(); p.fill(o.bar ?? C.sun); p.rect(x0, y - 7, 3, 14, 2);
  p.fill(o.col ?? C.N); p.textAlign(p.LEFT, p.CENTER); fitText(p, s, x0 + 9, y + 1, p.width - x0 - 14, o.size ?? 11);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
}
// Punto con halo (el punto elegido en una recta o en un plano).
function drawDot(p, C, x, y, d, col) {
  const halo = p.color(col); halo.setAlpha(70);
  p.noStroke(); p.fill(halo); p.circle(x, y, d * 1.9); p.fill(col); p.circle(x, y, d);
}
// Píldora rellena con texto (etiquetas como «bajo el mar: −10 m»); no se sale del lienzo. Devuelve su ancho.
function drawPill(p, C, txt, cx, cy, col, size = 12) {
  p.textStyle(p.BOLD); p.textSize(size);
  const w = Math.min(p.width - 8, p.textWidth(txt) + 18), h = size + 11;
  cx = Math.max(w / 2 + 4, Math.min(p.width - w / 2 - 4, cx));
  p.noStroke(); p.fill(col); p.rect(cx - w / 2, cy - h / 2, w, h, h / 2);
  p.fill(inkOn(col, C.ink)); p.textAlign(p.CENTER, p.CENTER); fitText(p, txt, cx, cy + 1, w - 10, size);
  return w;
}
// Recta numérica de los videos: línea gruesa con puntas redondas, marcas, y números con el color de su
// signo (negativos coral, el cero sol, positivos tinta). L = { x0, x1, y, min, max }; o = { step, every, label }.
function drawNumLine(p, C, L, o = {}) {
  const X = v => L.x0 + (v - L.min) / (L.max - L.min) * (L.x1 - L.x0), step = o.step ?? 1;
  const every = o.every ?? ((L.x1 - L.x0) / ((L.max - L.min) / step) < 25 ? 2 : 1);
  p.stroke(C.ink); p.strokeWeight(3); p.line(L.x0 - 8, L.y, L.x1 + 8, L.y);
  const n = Math.round((L.max - L.min) / step);
  for (let i = 0; i <= n; i++) {
    const v = +(L.min + i * step).toFixed(6), zero = Math.abs(v) < 1e-9;
    p.stroke(zero ? C.sun : C.ink); p.strokeWeight(zero ? 3 : 2); p.line(X(v), L.y - (zero ? 9 : 6), X(v), L.y + (zero ? 9 : 6));
    if (o.label !== false && i % every === 0) {
      p.noStroke(); p.fill(zero ? C.N : v < 0 ? C.I : C.ink); p.textStyle(p.BOLD); p.textSize(o.size ?? 12); p.textAlign(p.CENTER, p.CENTER);
      p.text(o.label ? o.label(v) : numTxt(v), X(v), L.y + 21);
    }
  }
  return X;
}

// ---------- Juegos dinámicos (de acción): vidas y cartel ----------
// Vidas como corazones, alineados a la derecha en (x, y): los que quedan en coral, los perdidos apagados.
function drawHearts(p, C, x, y, left, max = 3) {
  p.noStroke();
  for (let i = 0; i < max; i++) {
    const cx = x - 9 - (max - 1 - i) * 21;
    p.fill(i < left ? C.coral : C.line);
    p.circle(cx - 4, y - 2, 9.5); p.circle(cx + 4, y - 2, 9.5); p.triangle(cx - 8.6, y + 0.4, cx + 8.6, y + 0.4, cx, y + 9.5);
    // La vida perdida va además tachada: no depende solo del color.
    if (i >= left) { p.stroke(C.mute); p.strokeWeight(2); p.line(cx - 8, y + 8, cx + 8, y - 6); p.noStroke(); }
  }
}
// Cartel centrado sobre el juego («Toca para empezar», «¡Ronda lista!», «Otra vez»): tarjeta con borde de color.
function drawBanner(p, C, title, sub, cy, col) {
  const w = Math.min(p.width - 36, 270), h = sub ? 78 : 54, x = (p.width - w) / 2, y = cy - h / 2;
  p.noStroke(); p.fill(shade(C.card, 0.8)); p.rect(x, y + 4, w, h, 16);
  p.stroke(col ?? C.sun); p.strokeWeight(3); p.fill(C.card); p.rect(x, y, w, h, 16);
  p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
  fitText(p, title, p.width / 2, sub ? cy - 13 : cy, w - 24, 18);
  if (sub) { p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, sub, p.width / 2, cy + 15, w - 24, 12); }
}

// Base de un juego dinámico por rondas (spec 2026-11-13-juegos-dinamicos-valle). Lleva la fase («idle» espera el
// toque de empezar, «play», «won» pausa corta antes de la ronda siguiente, «lost» sin vidas: se reintenta, «all»
// todo terminado), la ronda, las vidas y el aviso. on = { start(ronda), lost(ronda) }.
function makeArcade(n, lives, api, on = {}) {
  const a = {
    phase: 'idle', cur: 0, lives, max: lives, wait: 0, toast: null, stopped: false, slow: reducedMotion() ? 0.6 : 1,
    start() { a.phase = 'play'; a.lives = lives; on.start?.(a.cur); },
    say(text, col) { a.toast = { text, col, t: 1.6 }; },
    hit() { api.sfx?.ok?.(); },
    win() { a.phase = 'won'; a.wait = 1.3; api.sfx?.win?.(); },
    // Un error: quita una vida. Devuelve true si la ronda se perdió (hay que reintentarla).
    miss() { a.lives--; api.sfx?.bad?.(); if (a.lives <= 0) { a.phase = 'lost'; on.lost?.(a.cur); return true; } return false; },
    tick(dt) {
      if (a.toast && (a.toast.t -= dt) <= 0) a.toast = null;
      if (a.phase === 'won' && (a.wait -= dt) <= 0) { if (a.cur < n - 1) { a.cur++; a.phase = 'idle'; } else { a.phase = 'all'; api.ready(true); } }
    },
    // Toque común: 'off' no es del juego (terminado), 'start' empezó la ronda, 'play' está jugando, 'wait' en pausa.
    tap(locked) {
      if (locked || a.phase === 'all') return 'off';
      if (a.phase === 'idle' || a.phase === 'lost') { a.start(); api.sfx?.tap?.(); return 'start'; }
      return a.phase === 'play' ? 'play' : 'wait';
    },
  };
  return a;
}
function drawArcadeHead(p, C, a, n) {
  drawKicker(p, C, `Ronda ${a.cur + 1} de ${n}`, 14, 18);
  drawHearts(p, C, p.width - 12, 18, a.phase === 'play' || a.phase === 'won' ? a.lives : a.max, a.max);
}
function drawArcadeBanner(p, C, a, cy, t = {}) {
  if (a.phase === 'idle') drawBanner(p, C, 'Toca para empezar', t.idle, cy);
  else if (a.phase === 'lost') drawBanner(p, C, t.lost || 'Se acabaron las vidas', 'Toca para intentar otra vez', cy, C.coral);
  else if (a.phase === 'won') drawBanner(p, C, t.won || '¡Ronda lista!', null, cy, C.ok);
}
function arcadeToast(p, C, a, x, y, locked) {
  if (a.toast && !locked && (a.phase === 'play' || a.phase === 'won' || a.phase === 'lost')) drawPill(p, C, a.toast.text, x, y, a.toast.col, 13);
}
// Terminado o calificado: se deja de dibujar (no gasta batería); queda el último cuadro.
function arcadeStop(p, a, locked) { if ((locked || a.phase === 'all') && !a.stopped) { a.stopped = true; p.noLoop(); } }
// Resumen al terminar: una línea por ronda, verde si se completó.
function drawArcadeSummary(p, C, lines, cy, w) {
  p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
  lines.forEach((ln, i) => { p.fill(ln.ok ? C.ok : C.mute); fitText(p, ln.text, p.width / 2, cy - (lines.length - 1) * 13 + i * 26, w ?? p.width - 28, 14); });
}
const inCanvas = p => p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
const frameDt = p => Math.min(0.05, (p.deltaTime || 16) / 1000);
const negTxt = v => String(v).replace('-', '−');

// ---------- Juegos por rondas con pestañas (spec 2026-11-15-torres-de-potencias) ----------
// Exponente en superíndice: sup(-3) → «⁻³».
const sup = n => String(n).replace(/-/g, '⁻').replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
// Control «− valor +» dentro de la caja b: la dibuja (con un rótulo pequeño encima) y dice qué botón se tocó.
function drawStepper(p, C, b, value, label, col) {
  drawTile(p, C, { x: b.x, y: b.y, w: 40, h: b.h }, '−', { fill: C.cream, size: 20, r: 9, lift: 2 });
  drawTile(p, C, { x: b.x + b.w - 40, y: b.y, w: 40, h: b.h }, '+', { fill: C.cream, size: 20, r: 9, lift: 2 });
  p.noStroke(); p.fill(col ?? C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, String(value), b.x + b.w / 2, b.y + b.h / 2 + 1, b.w - 92, 20);
  if (label) { p.fill(C.mute); p.textStyle(p.BOLD); fitText(p, label, b.x + b.w / 2, b.y - 10, b.w, 11); }
}
const stepHit = (b, x, y) => (y < b.y - 4 || y > b.y + b.h + 6 ? 0 : x >= b.x - 4 && x <= b.x + 44 ? -1 : x >= b.x + b.w - 44 && x <= b.x + b.w + 4 ? 1 : 0);
// Armazón de un juego por rondas: pestañas arriba, enunciado, pie y estado por ronda.
// def = { aspect, init(r, params) → estado de la ronda (serializable), ok(s, r, params), answered?(s, r), solution(r, params),
//   prompt(r, s), foot?(r, s), layout?(G), enter?(G), draw(G), press?(G, x, y) → bool, drag?(G, x, y) → bool, release?(G, x, y), peek?(G) }
// G = { p, C, api, params, W, H, cur, locked, st, r, s, t, dt, touch() }. Estado del juego: { rounds: [estado de cada ronda] }.
function roundsGame(def) {
  const grade = (state, params) => ({
    ok: params.rounds.every((r, i) => !!def.ok(state.rounds?.[i] ?? def.init(r, params), r, params)),
    solution: params.rounds.map(r => def.solution(r, params)).join(' · '),
  });
  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const G = { C, api, params, W: 0, H: 0, cur: 0, locked: false, t: 0, dt: 0, tabs: [], p: null, st: R.map(r => def.init(r, params)), touched: R.map(() => false),
      get r() { return R[this.cur]; }, get s() { return this.st[this.cur]; },
      touch() { this.touched[this.cur] = true; api.ready(R.every((r, i) => (def.answered ? def.answered(G.st[i], r) : G.touched[i]))); api.sfx?.tap?.(); } };
    const answered = i => (def.answered ? def.answered(G.st[i], R[i]) : G.touched[i]);
    const m = mountSketch(host, (p, size) => {
      G.p = p;
      const lay = () => { G.W = size.w; G.H = size.h; G.tabs = roundTabs(R.length, size.w); def.layout?.(G); };
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); lay(); def.enter?.(G); };
      p.onResize = lay;
      p.draw = () => {
        p.background(C.bg);
        G.dt = frameDt(p); G.t += G.dt;
        drawTabs(p, C, G.tabs, G.cur, i => (G.locked ? (def.ok(G.st[i], R[i], params) ? C.ok : C.bad) : i === G.cur ? C.brand : answered(i) ? C.Z : C.line));
        p.noStroke(); p.fill(C.N); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(14); p.text(def.prompt(G.r, G.s, G), 12, 46, G.W - 24, 36);
        def.draw(G);
        const good = def.ok(G.s, G.r, params), pend = R.findIndex((_, i) => !answered(i) && i !== G.cur);
        const foot = G.locked ? (good ? '¡Bien!' : def.solution(G.r, params)) : answered(G.cur) && pend >= 0 ? `Sigue con la pestaña ${pend + 1}` : def.foot?.(G.r, G.s, G) ?? '';
        p.noStroke(); p.fill(G.locked ? (good ? C.ok : C.bad) : C.mute); p.textStyle(G.locked ? p.BOLD : p.NORMAL); p.textAlign(p.CENTER, p.CENTER); fitText(p, foot, G.W / 2, G.H - 14, G.W - 20, 11);
      };
      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tb = G.tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (tb >= 0) { G.cur = tb; def.enter?.(G); api.sfx?.tap?.(); return false; }
        if (G.locked || !def.press) return;
        return def.press(G, p.mouseX, p.mouseY) ? false : undefined;
      };
      p.mouseDragged = () => { if (G.locked || !def.drag) return; return def.drag(G, p.mouseX, p.mouseY) ? false : undefined; };
      p.mouseReleased = () => { if (!G.locked) def.release?.(G, p.mouseX, p.mouseY); };
    }, def.aspect ?? 1.2);
    return {
      loaded: m.ready,
      getState: () => ({ rounds: JSON.parse(JSON.stringify(G.st)) }),
      lock() { G.locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ cur: G.cur, W: G.W, H: G.H, tabs: G.tabs, s: JSON.parse(JSON.stringify(G.s)), ...(def.peek?.(G) || {}) }),
    };
  }
  return { grade, create };
}
