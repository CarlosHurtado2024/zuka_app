// Kit de los minijuegos (ejercicios `play`). Cada juego, en js/games/<nombre>.js, registra
//   GAMES['<nombre>'] = { grade(state, params) → { ok, solution }, create(host, params, api) → { getState, lock, destroy } }
// grade es pura (se prueba en Node con tests/); create monta un sketch de p5.js en modo instancia.

const GAMES = {};

// Colores de los juegos en cada tema: un tono por familia de números y los del lienzo.
// Estilo «estudio» (spec 2026-11-25-juegos-sobrios): tinta azul profunda o papel azul muy claro, con los papeles
// de los videos (sol, coral, menta, cielo, violeta) menos saturados y bien separados; la ficha neutra es blanco frío. En el tema claro el papel es frío (azul muy claro, no crema: sobre crema las piezas amarillas
// se perdían; spec 2026-11-16-guia-y-colores) y los mismos tonos van más oscuros para leerse.
// sun, coral, mint, sky, cream, night: rellenos (fichas, confeti); star: líneas tenues; halo: superficie tenue.
const PALETTES = {
  dark: {
    N: '#F7C85A', Z: '#6CC6FF', Q: '#5EE0C1', I: '#FF7A7A', R: '#B79CFF',
    brand: '#6C8CFF', bg: '#121633', card: '#1C2249', line: '#3B4480',
    ink: '#EEF1FF', mute: '#9AA2D0', ok: '#4ADE9B', bad: '#FF6B81',
    sun: '#F7C85A', coral: '#FF6B6B', mint: '#5EE0C1', sky: '#6C9CFF', cream: '#E9ECF8', creamD: '#AEB5D3', night: '#121633',
    star: '#2E3668', halo: '#20264F',
  },
  light: {
    N: '#9A6400', Z: '#1466B8', Q: '#0B7D5C', I: '#C9403A', R: '#5B44D2',
    brand: '#3C5BD8', bg: '#F2F4F9', card: '#FFFFFF', line: '#D2D8EA',
    ink: '#141833', mute: '#59608A', ok: '#0F9A5C', bad: '#D23A55',
    sun: '#F2BC3B', coral: '#EC5F68', mint: '#2BB894', sky: '#4C7FF0', cream: '#FFFFFF', creamD: '#CBD2E6', night: '#141833',
    star: '#D9DFEE', halo: '#E6EAF4',
  },
};
// `api.palette` de todos los juegos: el mismo objeto cambia de valores con el tema, y como los
// juegos leen sus colores al dibujar cada cuadro, uno abierto se repinta solo al cambiar de tema.
const PALETTE = { ...PALETTES.dark };
// Paleta del curso: lo que cambia sobre la del tema cuando se juega una lección de ese curso (setGameCourse, que llaman
// startLesson y startExam), una por curso. Álgebra es morado: fondo y tarjetas teñidos de morado y, en vez de menta y azul cielo,
// orquídea, rosa e índigo; el dorado se queda porque es el complemento del morado, y el verde y el rojo de acertar y
// fallar no cambian en ningún curso. Un curso sin paleta propia usa la del tema.
const COURSE_PALETTES = {
  algebra: {
    dark: {
      N: '#F7C85A', Z: '#7FB2FF', Q: '#FF8FD0', I: '#FF8466', R: '#B79CFF',
      brand: '#8B7BFF', bg: '#14122E', card: '#1F1B45', line: '#40397F', ink: '#F0EEFF', mute: '#A29DD0',
      coral: '#FF7A8A', mint: '#E08BFF', sky: '#7C8CFF', cream: '#ECEAF8', creamD: '#B3AED6', night: '#14122E',
      star: '#322B66', halo: '#221E4D',
    },
    light: {
      N: '#9A6400', Z: '#2B5FC4', Q: '#B0338A', I: '#C9403A', R: '#5B44D2',
      brand: '#5B44D2', bg: '#F4F2FB', card: '#FFFFFF', line: '#D6D0EC', ink: '#17143A', mute: '#5E5A8C',
      coral: '#EC5F7A', mint: '#B565E0', sky: '#6A6FF0', creamD: '#CFC9E8', night: '#17143A',
      star: '#DDD8F0', halo: '#E9E5F6',
    },
  },
  // Trigonometría: cian, con azul cielo y menta.
  trig: {
    dark: {
      Z: '#5FB4FF', R: '#A9A4FF', brand: '#22D3EE', bg: '#0E1A2B', card: '#16273F', line: '#2F4A72', ink: '#EAF6FF', mute: '#93AECB',
      sky: '#38BDF8', cream: '#E6F1F8', creamD: '#A9BFD3', night: '#0E1A2B', star: '#22385C', halo: '#182C48',
    },
    light: {
      brand: '#0E7490', bg: '#F0F7FB', card: '#FFFFFF', line: '#CBDDEA', ink: '#0F2233', mute: '#4F6A80',
      sky: '#0EA5C9', creamD: '#C5D6E3', night: '#0F2233', star: '#D5E4EE', halo: '#E3EEF5',
    },
  },
  // Cálculo Diferencial: rosa, con violeta y dorado.
  calc: {
    dark: {
      Z: '#8FB4FF', Q: '#C79BFF', I: '#FF8466', R: '#FF8FD0', brand: '#F472B6', bg: '#1F1028', card: '#2E1A3B', line: '#5A3570',
      ink: '#FFEEF8', mute: '#C4A3C4', mint: '#F78BC8', sky: '#B79CFF', cream: '#F6EAF3', creamD: '#CDB3C9', night: '#1F1028',
      star: '#472A59', halo: '#33203F',
    },
    light: {
      Z: '#2B5FC4', Q: '#7A44C9', R: '#B0338A', brand: '#BE2A7C', bg: '#FBF2F7', card: '#FFFFFF', line: '#EBD3E2', ink: '#2A1230',
      mute: '#7A5578', mint: '#E0559F', sky: '#8B63E0', creamD: '#E3CCDB', night: '#2A1230', star: '#F0DDE8', halo: '#F6E8F0',
    },
  },
  // Geometría Vectorial: azul, con turquesa.
  geo: {
    dark: {
      Q: '#5EEAD4', R: '#A99CFF', brand: '#60A5FA', bg: '#0F1730', card: '#192448', line: '#33467F', ink: '#EEF3FF', mute: '#98A8D0',
      mint: '#5EEAD4', sky: '#60A5FA', cream: '#E8EEF9', creamD: '#ACB8D6', night: '#0F1730', star: '#293A6B', halo: '#1C2950',
    },
    light: {
      Q: '#0B7D6C', brand: '#2563EB', bg: '#F1F5FC', card: '#FFFFFF', line: '#CFDAEE', ink: '#101C3A', mute: '#55648A',
      mint: '#2BB8A8', sky: '#3B82F6', creamD: '#C7D3E8', night: '#101C3A', star: '#D8E1F0', halo: '#E5ECF6',
    },
  },
  // Física Mecánica: ámbar sobre un fondo cálido, con naranja; el azul se queda de contraste.
  fis: {
    dark: {
      I: '#FF7A5A', brand: '#FFB020', bg: '#1A1710', card: '#2A2518', line: '#5A4E2A', ink: '#FFF8E6', mute: '#C2B48E',
      mint: '#FF9F5A', cream: '#F6F0DF', creamD: '#CFC4A3', night: '#1A1710', star: '#3D3520', halo: '#2A2416',
    },
    light: {
      N: '#8A5A00', brand: '#A16207', bg: '#FBF8EE', card: '#FFFFFF', line: '#E8DFC3', ink: '#2A2208', mute: '#756A45',
      mint: '#F08A3C', creamD: '#E0D6B8', night: '#2A2208', star: '#EFE8D2', halo: '#F5F0E0',
    },
  },
  // Cálculo Integral: verde, con verde azulado.
  int: {
    dark: {
      brand: '#34D399', bg: '#0D1F1C', card: '#16302B', line: '#2E5A50', ink: '#EAFBF5', mute: '#94BDB0',
      mint: '#34D399', sky: '#5ED4E0', cream: '#E6F4EF', creamD: '#A9CABF', night: '#0D1F1C', star: '#234840', halo: '#17332D',
    },
    light: {
      brand: '#0B7D5C', bg: '#F0F8F5', card: '#FFFFFF', line: '#CDE3DB', ink: '#0D2A22', mute: '#4C6F64',
      sky: '#22A9B8', creamD: '#C4DCD3', night: '#0D2A22', star: '#D6E9E2', halo: '#E3F1EC',
    },
  },
  // Preuniversitario UdeA: el lima solo como acento. Fondo, fichas y bordes neutros (grafito / gris muy claro) y sin brillo de
  // fondo (flat): el verde teñido detrás de los juegos tapaba botones y gráficas (pedido del usuario, 2026-11-19).
  preuda: {
    dark: {
      brand: '#A3E635', bg: '#11141B', card: '#1B2029', line: '#363E4C', ink: '#F3F5F8', mute: '#A4ADBC',
      mint: '#BEF264', sky: '#38BDF8', cream: '#EEF1F5', creamD: '#B9C0CC', night: '#11141B', star: '#262C38', halo: '#181C24',
    },
    light: {
      brand: '#4D7C0F', bg: '#F7F8FA', card: '#FFFFFF', line: '#D9DEE6', ink: '#161B24', mute: '#5A6273',
      mint: '#65A30D', sky: '#0284C7', creamD: '#D3D8E0', night: '#161B24', star: '#E8EBF0', halo: '#EFF1F4',
    },
  },
  lin: {
    dark: {
      brand: '#FB923C', bg: '#1E130C', card: '#2E1F15', line: '#5E4029', ink: '#FFF3EA', mute: '#C9AD98',
      mint: '#FF9F5A', cream: '#F8ECE2', creamD: '#D3BBA8', night: '#1E130C', star: '#45301F', halo: '#2E2016',
    },
    light: {
      brand: '#C2540A', bg: '#FCF5EF', card: '#FFFFFF', line: '#EBD9C8', ink: '#2E1708', mute: '#7C5F49',
      mint: '#F08A3C', creamD: '#E3D0BF', night: '#2E1708', star: '#F1E3D6', halo: '#F7ECE2',
    },
  },
};
let gameTheme = 'dark', gameCourse = null;
// Cursos con fondo plano (sin el brillo de su color detrás del juego).
const FLAT_COURSES = new Set(['preuda']);
function paintGamePalette() {
  Object.assign(PALETTE, PALETTES[gameTheme], COURSE_PALETTES[gameCourse]?.[gameTheme]);
  // El marco del juego (.play, la guía) usa el mismo fondo: css/styles.css trae el del tema y aquí se pone el del curso.
  if (typeof document !== 'undefined') document.documentElement?.style?.setProperty?.('--play-bg', PALETTE.bg);
}
function setGameTheme(theme) { gameTheme = PALETTES[theme] ? theme : 'dark'; paintGamePalette(); }
function setGameCourse(id) { gameCourse = id || null; paintGamePalette(); }
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
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2] > 0.215 ? '#141833' : '#FFFFFF';   // 0.215: donde el azul noche empieza a contrastar más que el blanco
}

// Anima los valores de un objeto con anime.js (js/vendor/anime.min.js). Sin anime (pruebas) o con
// «reducir movimiento», deja el valor final de una vez.
function fxTween(target, props, opts = {}) {
  if (typeof anime !== 'function' || reducedMotion()) { Object.assign(target, props); opts.complete?.(); return null; }
  return anime({ targets: target, duration: 420, easing: 'easeOutCubic', ...props, ...opts });
}

// Fondo de los juegos: liso, del color del tema y del curso, con un brillo suave del color del curso arriba y un poco
// más de fondo abajo. Sin cuadrícula (el usuario la quitó el 2026-11-27) y sin nada que se mueva.
function drawBackdrop(p) {
  const ctx = p.drawingContext, W = p.width, H = p.height, C = PALETTE;
  if (FLAT_COURSES.has(gameCourse) || !ctx?.save || !ctx.createRadialGradient) return;
  const d = typeof p.pixelDensity === 'function' ? p.pixelDensity() : 1;
  ctx.save(); ctx.setTransform(d, 0, 0, d, 0, 0);
  const g = ctx.createRadialGradient(W / 2, -H * 0.1, 10, W / 2, -H * 0.1, H * 0.9);
  g.addColorStop(0, C.brand); g.addColorStop(1, C.bg);
  ctx.globalAlpha = 0.16; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const v = ctx.createLinearGradient(0, H * 0.55, 0, H);
  v.addColorStop(0, C.bg); v.addColorStop(1, C.halo);
  ctx.globalAlpha = 0.5; ctx.fillStyle = v; ctx.fillRect(0, H * 0.55, W, H * 0.45);
  ctx.restore();
}

// Onda que sale donde el juego agarra o toca algo (la dibuja mountSketch encima de cada cuadro).
function drawRipples(p, list) {
  if (!list.length) return;
  const ctx = p.drawingContext, d = typeof p.pixelDensity === 'function' ? p.pixelDensity() : 1;
  ctx.save(); ctx.setTransform(d, 0, 0, d, 0, 0); ctx.strokeStyle = PALETTE.brand; ctx.lineWidth = 1.5;
  for (const r of list) { ctx.globalAlpha = Math.max(0, r.a); ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 6.2832); ctx.stroke(); }
  ctx.restore();
}

// Trozos de confeti (círculos, cuadrados y triángulos planos, como las formas de los videos): hacia
// dónde vuela cada uno, cuánto gira, su color (clave de la paleta) y su forma.
function confettiBits(n) {
  const colors = ['sun', 'coral', 'mint', 'sky'], shapes = ['dot', 'sq', 'tri'];
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI + (Math.random() - 0.5) * 0.5, d = 60 + Math.random() * 120;
    return { dx: Math.round(Math.cos(a) * d), dy: Math.round(Math.sin(a) * d * 0.85 - 10), rot: Math.round((Math.random() - 0.5) * 540), size: 4 + Math.round(Math.random() * 4), color: colors[i % colors.length], shape: shapes[(i * 7 + (i >> 2)) % shapes.length] };
  });
}
// Celebración sobre el recuadro del juego al acertar: un aro que crece y confeti que sale del centro.
function playFx(box, ok) {
  if (!ok || !box || typeof anime !== 'function' || reducedMotion()) return;
  const layer = document.createElement('div');
  layer.className = 'play-fx';
  const ring = document.createElement('i'); ring.className = 'fx-ring'; layer.appendChild(ring);
  const bits = confettiBits(14).map(b => {
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
// Si el contenedor cambia de ancho, el lienzo se redimensiona y se llama p.onResize() para que el juego reacomode todo.
// **El ejercicio cabe en una pantalla**: si el enunciado, la pista y el juego no caben en el alto de la lección, el
// lienzo se muestra más chico (fitScale: hasta FIT_MIN de su tamaño) cambiando su ancho y alto de CSS, nunca con
// `transform` (p5 corrige la lectura del dedo con el tamaño de CSS, no con una transformación). El juego sigue
// dibujando en su tamaño de diseño.
// Los juegos se diseñaron para un lienzo de unos 328 px de ancho (celular de 375) y colocan muchas
// piezas con medidas fijas: en un celular más angosto el lienzo conserva el alto de ese diseño
// (heightFor), así lo que va apilado no se encima ni se sale por abajo.
const DESIGN_W = 328;
const heightFor = (w, aspect) => Math.round(Math.max(w, DESIGN_W) * aspect);
// Cuánto se achica el lienzo (de alto h) para caber en `room` px: 1 si cabe; nunca menos de FIT_MIN (ahí ya se desliza).
const FIT_MIN = 0.66;
const fitScale = (h, room) => (room > 0 && h > 0 ? Math.max(FIT_MIN, Math.min(1, room / h)) : 1);
function mountSketch(host, sketch, aspect = 1.25, gesture) {
  let inst = null, removed = false, ro = null, grabbed = false;
  let seenGesture = false, gestureTime = 0, gestureUntil = 0;
  const autoGuide = host.dataset?.guideAuto !== 'false';
  // Alto libre para el lienzo dentro de la lección: el del cuerpo menos lo demás del ejercicio (enunciado, pista, márgenes).
  const fit = size => {
    const cv = inst?.canvas, body = host.closest?.('.lesson-body'), ex = body?.firstElementChild;
    if (!cv?.style) return;
    let k = 1;
    if (body && ex && typeof getComputedStyle === 'function') {
      const cs = getComputedStyle(body), pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      k = fitScale(size.h, body.clientHeight - pad - (ex.offsetHeight - cv.offsetHeight) - 2);
    }
    cv.style.width = `${Math.round(size.w * k)}px`; cv.style.height = `${Math.round(size.h * k)}px`;
  };
  const ripples = [];
  const widthOf = () => Math.max(240, Math.floor(host.clientWidth || 320));
  const ready = loadP5().then(P5 => {
    if (removed) return;
    const size = { w: widthOf(), h: 0 };
    size.h = heightFor(size.w, aspect);
    inst = new P5(p => {
      sketch(p, size);
      // El lienzo comparte la tipografía y la superficie de práctica del curso.
      const rawFont = p.textFont?.bind(p), rawBg = p.background?.bind(p);
      if (rawFont) p.textFont = (f, ...a) => rawFont(f === 'system-ui' ? gameFont() : f, ...a);
      if (rawBg) p.background = (...a) => { const r = rawBg(...a); if (a.length === 1 && a[0] === PALETTE.bg) drawBackdrop(p); return r; };
      const draw0 = p.draw, press0 = p.mousePressed;
      if (draw0) p.draw = () => {
        draw0();
        drawRipples(p, ripples);
        if (gesture) {
          gestureTime += frameDt(p);
          if ((autoGuide && !seenGesture && !grabbed) || gestureTime < gestureUntil) {
            const start = gestureTime < gestureUntil ? gestureUntil - 2 * DEMO_T : 0;
            drawDemo(p, PALETTE, gestureTime - start, gesture(p));
          }
        }
      };
      if (press0) p.mousePressed = (...a) => {
        const guided = gesture && !!gesture(p);
        const r = press0(...a);
        if (r === false && guided) { seenGesture = true; gestureUntil = 0; }
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
      if (!inst) return;
      if (w !== size.w) {
        size.w = w; size.h = heightFor(w, aspect);
        inst.resizeCanvas(size.w, size.h);
        inst.onResize?.();
      }
      fit(size);
    });
    ro.observe(host);
    // También cuando cambia el alto disponible (gira el celular) o lo demás del ejercicio (se abre la pista).
    const body = host.closest?.('.lesson-body');
    if (body) { ro.observe(body); if (body.firstElementChild) ro.observe(body.firstElementChild); }
    fit(size);
    // Si Jost aún no había cargado, el juego arrancó con la letra del sistema: al llegar, se cambia.
    if (typeof document !== 'undefined' && gameFont() !== 'Jost') {
      Promise.all([document.fonts?.load?.('700 14px Jost'), document.fonts?.load?.('400 14px Jost')])
        .then(() => { if (inst && gameFont() === 'Jost') inst.textFont('system-ui'); }).catch(() => {});
    }
    // p5 no escucha touchcancel (llamada entrante, gesto del sistema): se suelta lo que el juego tenía agarrado.
    host.addEventListener?.('touchcancel', e => { if (grabbed) { grabbed = false; inst?.mouseReleased?.(e); } });
  });
  return {
    ready,
    demo() { gestureUntil = gestureTime + 2 * DEMO_T; },
    remove() { removed = true; ro?.disconnect(); inst?.remove(); inst = null; },
  };
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
// Alto que puede ocupar una fórmula de un renglón centrada en `y`: las pestañas de rondas llegan hasta TABS_BOTTOM
// (roundTabs: de 8 a 38), así que un rótulo que va debajo de ellas no pasa de ahí; arriba y abajo, el borde del lienzo.
const TABS_BOTTOM = 40;
const formulaRoom = (y, H) => 2 * Math.max(6, Math.min(y > TABS_BOTTOM && y < 90 ? y - TABS_BOTTOM : y - 1, H - 1 - y));
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
    // Un renglón con matemática (x², 3/4, √12, o TeX entre $…$), centrado en vertical: va como fórmula (formula.js).
    // Una fracción apilada es más alta que su renglón: el rótulo que va justo debajo de las pestañas (y entre 40 y 90)
    // se encoge lo necesario para no meterse en ellas (formulaRoom), y ninguna fórmula se sale del lienzo.
    if (base === 'center' && typeof drawFormula === 'function' && !s.includes('\n') && formulaWanted(s)) { drawFormula(p, s, x, y, W - 8, size0, formulaRoom(y, H)); return; }
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
// La pestaña actual conserva su posición al cambiar de ronda.
function drawTabs(p, C, tabs, cur, colorOf) {
  tabs.forEach((tb, i) => {
    const col = colorOf(i), on = i === cur, plain = col === C.line;
    drawPracticePanel(p, tb, plain ? C.card : col, on ? C.brand : C.line, 7, on ? 2 : 1);
    p.fill(plain ? C.mute : inkOn(col, C.ink)); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(14); p.text(i + 1, tb.x + tb.w / 2, tb.y + tb.h / 2);
  });
}
const hitBox = (b, x, y) => !!b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
// Texto de un número con el signo menos tipográfico y fracciones simples (½, ⅓…).
function numTxt(v) {
  const s = v < 0 ? '−' : '', a = Math.abs(v), fr = { 0.5: '½', 0.25: '¼', 0.75: '¾' }, w = Math.floor(a), d = +(a - w).toFixed(4);
  if (fr[d]) return s + (w ? w : '') + fr[d];
  return s + String(+a.toFixed(3));
}
// Escribe `txt` (con la alineación que tenga p), encogiendo la letra hasta que quepa en `maxW`.
// Si el texto trae matemática (TeX entre $…$, o símbolos como x², 3/4, √12) y el dibujo está centrado en vertical,
// se dibuja como fórmula (js/games/formula.js): fracciones apiladas, exponentes y raíces de verdad.
function fitText(p, txt, x, y, maxW, size, maxH) {
  if (typeof drawFormula === 'function' && formulaWanted(txt) && p.drawingContext?.save && p._renderer?._textBaseline === 'center') { drawFormula(p, txt, x, y, maxW, size, maxH); return; }
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
function drawPracticePanel(p, b, fill, border, r = 10, weight = 1) {
  p.stroke(border); p.strokeWeight(weight); p.fill(fill); p.rect(b.x, b.y, b.w, b.h, r); p.noStroke();
}

function drawPracticeHandle(p, C, x, y, tone = C.brand, active = false) {
  p.noFill(); p.stroke(tone); p.strokeWeight(1); p.circle(x, y, active ? 29 : 25);
  p.fill(C.card); p.strokeWeight(2); p.circle(x, y, 17);
  p.noStroke(); p.fill(tone); p.circle(x, y, 5);
}

function practiceTrack(x0, x1, y, min, max, step) {
  const map = lineMap(min, max, x0, x1), middle = (min + max) / 2;
  return {
    x0, x1, y, x: map.toPx,
    hit: (x, yy) => x >= x0 - 14 && x <= x1 + 14 && Math.abs(y - yy) <= 16,
    value: x => +Math.min(max, Math.max(min, min + Math.round((map.toVal(x) - min) / step) * step)).toFixed(6),
    gesture: v => ({ from: { x: map.toPx(v), y }, to: { x: map.toPx(v > middle ? middle - (max - min) * .16 : middle + (max - min) * .16), y } }),
  };
}

function drawPracticeTrack(p, C, rail, value, label, readout, tone = C.brand, active = false) {
  const { x0, x1, y } = rail;
  p.stroke(C.line); p.strokeWeight(3); p.line(x0, y, x1, y);
  p.stroke(tone); p.strokeWeight(2); p.line(x0, y, rail.x(value), y);
  drawPracticeHandle(p, C, rail.x(value), y, tone, active);
  p.noStroke(); p.fill(C.ink); p.textStyle(p.NORMAL); p.textAlign(p.LEFT, p.CENTER);
  fitText(p, label, 13, y, x0 - 28, 13);
  p.textAlign(p.RIGHT, p.CENTER);
  fitText(p, readout, p.width - 12, y, Math.max(28, p.width - x1 - 25), 13);
}

// El relleno conserva el significado que le da el juego. El contorno marca la pieza activa.
function drawTile(p, C, b, txt, o = {}) {
  const fill = o.fill ?? C.card, r = o.r ?? 8, k = o.k ?? 1;
  const w = b.w * k, h = b.h * k, x = b.x + (b.w - w) / 2, y = b.y + (b.h - h) / 2;
  drawPracticePanel(p, { x, y, w, h }, fill, o.ring ?? C.line, r, o.ring ? 2 : 1);
  if (txt != null && txt !== '') {
    p.fill(o.ink ?? (fill === C.card ? C.ink : inkOn(fill, C.ink))); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
    fitText(p, String(txt), b.x + b.w / 2, b.y + b.h / 2, w - 8, o.size ?? 17, h - 6);
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
    const cx = x - 7 - (max - 1 - i) * 17, s = 0.78, on = i < left;
    // Corazón con dos arcos y una punta; la vida perdida queda hueca y tachada: no depende solo del color.
    if (on) { p.noStroke(); p.fill(C.coral); } else { p.noFill(); p.stroke(C.mute); p.strokeWeight(1.3); }
    p.beginShape(); p.vertex(cx, y + 9 * s);
    p.bezierVertex(cx - 11 * s, y + 1 * s, cx - 9 * s, y - 9 * s, cx, y - 4 * s); p.bezierVertex(cx + 9 * s, y - 9 * s, cx + 11 * s, y + 1 * s, cx, y + 9 * s);
    p.endShape(p.CLOSE);
    if (!on) { p.stroke(C.mute); p.strokeWeight(1.3); p.line(cx - 6, y + 6, cx + 6, y - 6); }
    p.noStroke();
  }
}
// Cartel centrado sobre el juego («Toca para empezar», «¡Ronda lista!», «Otra vez»): tarjeta con borde fino y una
// barra de color a la izquierda, como los rótulos de los videos.
function drawBanner(p, C, title, sub, cy, col) {
  const w = Math.min(p.width - 36, 270), h = sub ? 74 : 52, x = (p.width - w) / 2, y = cy - h / 2;
  const sh = p.color('#000000'); sh.setAlpha(60); p.noStroke(); p.fill(sh); p.rect(x + 2, y + 6, w - 4, h, 14);
  p.stroke(C.line); p.strokeWeight(1); p.fill(C.card); p.rect(x, y, w, h, 14);
  p.noStroke(); p.fill(col ?? C.brand); p.rect(x + 12, y + 14, 3, h - 28, 2);
  p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
  fitText(p, title, p.width / 2 + 4, sub ? cy - 12 : cy, w - 44, 17);
  if (sub) { p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, sub, p.width / 2 + 4, cy + 14, w - 44, 12); }
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

// ---------- Demostración sobre el juego (spec 2026-11-18-demo-en-juego) ----------
// La explicación de cómo se juega va encima del lienzo, no en una ventana: una mano hace el gesto en el lugar real.
// Un juego la pide con def.demo(G) → { from: {x, y}, to?: {x, y}, text, ty?, carry?(x, y) } (sin `to` es un toque;
// `carry` dibuja lo que la mano lleva agarrado). Los armazones
// (roundsGame, questGame) la dibujan en bucle hasta el primer toque y la repiten con inst.demo() («Cómo se juega»).
const DEMO_T = 2.6;
// Dónde está la mano en el momento u (0 a 1) del bucle: entra, presiona en `a`, viaja a `b`, suelta y sale.
function demoPose(u, a, b) {
  const ease = k => (k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
  const k = b ? ease(Math.max(0, Math.min(1, (u - .25) / .5))) : 0;
  const alpha = u < .1 ? u / .1 : u > .88 ? Math.max(0, (1 - u) / .12) : 1;
  return { x: a.x + ((b ? b.x : a.x) - a.x) * k, y: a.y + ((b ? b.y : a.y) - a.y) * k, down: u >= .15 && u < .85, alpha, k };
}
// Mano que señala: la punta del índice queda en (x, y). Presionada se encoge un poco y deja un aro.
function drawHand(p, C, x, y, down, alpha) {
  const g = p.drawingContext;
  g.save(); g.globalAlpha = alpha;
  if (down) { p.noFill(); p.stroke(C.brand); p.strokeWeight(2.5); p.circle(x, y, 26); }
  p.translate(x, y); p.rotate(-0.3); p.scale(down ? 0.92 : 1);
  p.stroke(C.night ?? C.ink); p.strokeWeight(2); p.fill(C.cream);
  p.rect(-6, 0, 12, 30, 6);            // índice
  p.rect(-8, 20, 30, 26, 8);           // palma
  p.rect(6, 12, 9, 18, 4.5); p.rect(14, 15, 8, 16, 4);   // dedos doblados
  p.rect(-16, 22, 12, 9, 4.5);         // pulgar
  p.noStroke(); p.fill(C.cream); p.rect(-5, 16, 10, 12); p.rect(-6, 22, 26, 10);   // tapa las uniones
  p.resetMatrix?.();
  g.restore();
}
function drawDemo(p, C, t, d) {
  if (!d || !d.from) return;
  const still = reducedMotion(), u = still ? .8 : (t % DEMO_T) / DEMO_T, g = p.drawingContext;
  const path = d.path || (d.to ? [d.from, d.to] : null);
  const h = demoPose(u, d.from, path?.at(-1));
  if (d.path) {
    const k = h.k * (path.length - 1), i = Math.min(path.length - 2, Math.floor(k));
    const a = path[i], b = path[i + 1], f = k - i;
    h.x = a.x + (b.x - a.x) * f; h.y = a.y + (b.y - a.y) * f;
  }
  // El camino del gesto, punteado, y lo que la mano lleva.
  if (path) {
    g.save(); g.globalAlpha = .7 * h.alpha; p.stroke(C.brand); p.noFill(); p.strokeWeight(2.5); g.setLineDash([6, 6]);
    p.beginShape(); path.forEach(q => p.vertex(q.x, q.y)); p.endShape(); g.setLineDash([]);
    const end = path.at(-1);
    p.circle(end.x, end.y, 18); g.restore();
  }
  // Lo que la mano lleva agarrado (un globo, una ficha), si el juego lo dibuja.
  if (d.carry && h.down) { g.save(); g.globalAlpha = h.alpha; d.carry(h.x, h.y); g.restore(); }
  p.push(); drawHand(p, C, h.x, h.y, h.down, h.alpha); p.pop();
  if (d.text) drawPill(p, C, d.text, d.tx ?? p.width / 2, d.ty ?? 124, C.brand, 12);
}

// ---------- Juegos por rondas con pestañas (spec 2026-11-15-torres-de-potencias) ----------
// Exponente en superíndice: sup(-3) → «⁻³».
const sup = n => String(n).replace(/-/g, '⁻').replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
// Control «− valor +» dentro de la caja b: la dibuja (con un rótulo pequeño encima) y dice qué botón se tocó.
function drawStepper(p, C, b, value, label, col) {
  drawTile(p, C, { x: b.x, y: b.y, w: 40, h: b.h }, '−', { fill: C.cream, size: 20, r: 8, lift: 2 });
  drawTile(p, C, { x: b.x + b.w - 40, y: b.y, w: 40, h: b.h }, '+', { fill: C.cream, size: 20, r: 8, lift: 2 });
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
    const G = { C, api, params, W: 0, H: 0, cur: 0, locked: false, t: 0, dt: 0, tabs: [], p: null, st: R.map(r => def.init(r, params)), touched: R.map(() => false), down: false, demoUntil: 0, demoT0: 0,
      get r() { return R[this.cur]; }, get s() { return this.st[this.cur]; },
      touch() { this.touched[this.cur] = true; api.ready(R.every((r, i) => (def.answered ? def.answered(G.st[i], r) : G.touched[i]))); api.sfx?.tap?.(); } };
    const answered = i => (def.answered ? def.answered(G.st[i], R[i]) : G.touched[i]);
    const m = mountSketch(host, (p, size) => {
      G.p = p;
      const lay = () => { G.W = size.w; G.H = size.h; G.tabs = roundTabs(R.length, size.w); def.layout?.(G); };
      p.setup = () => {
        p.createCanvas(size.w, size.h); p.textFont('system-ui'); lay(); def.enter?.(G);
        if (def.key && p.canvas) {
          p.canvas.tabIndex = 0;
          p.canvas.setAttribute('aria-label', def.keyboard);
          p.canvas.addEventListener('keydown', e => {
            if (G.locked || !def.key(G, e.key)) return;
            e.preventDefault(); e.stopPropagation();
          });
          p.canvas.addEventListener('blur', () => { delete G.focus; });
        }
      };
      p.onResize = lay;
      p.draw = () => {
        p.background(C.bg);
        G.dt = frameDt(p); G.t += G.dt;
        drawTabs(p, C, G.tabs, G.cur, i => (G.locked ? (def.ok(G.st[i], R[i], params) ? C.ok : C.bad) : i === G.cur ? C.brand : answered(i) ? C.Z : C.line));
        p.noStroke(); p.fill(C.ink); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(14);
        // Un enunciado con matemática va en un renglón, como fórmula; si no, en su caja de dos renglones.
        const pr = def.prompt(G.r, G.s, G);
        if (typeof formulaWanted === 'function' && formulaWanted(pr)) fitText(p, pr, 12, 63, G.W - 24, 15, 34); else p.text(pr, 12, 46, G.W - 24, 36);
        def.draw(G);
        // La mano que muestra el gesto: hasta que se toca esta ronda, o un rato si se pidió con «Cómo se juega».
        const autoDemo = api.guideAuto !== false && !G.touched[G.cur] && G.focus == null;
        if (def.demo && !G.locked && !G.down && (autoDemo || G.t < G.demoUntil)) drawDemo(p, C, G.t - G.demoT0, def.demo(G));
        const good = def.ok(G.s, G.r, params), pend = R.findIndex((_, i) => !answered(i) && i !== G.cur);
        const foot = G.locked ? (good ? '¡Bien!' : 'La respuesta correcta quedó marcada') : answered(G.cur) && pend >= 0 ? `Sigue con la pestaña ${pend + 1}` : def.foot?.(G.r, G.s, G) ?? '';
        p.noStroke(); p.fill(G.locked ? (good ? C.ok : C.bad) : C.mute); p.textStyle(G.locked ? p.BOLD : p.NORMAL); p.textAlign(p.CENTER, p.CENTER); fitText(p, foot, G.W / 2, G.H - 14, G.W - 20, 11);
      };
      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tb = G.tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (tb >= 0) { G.cur = tb; G.demoT0 = G.t; def.enter?.(G); api.sfx?.tap?.(); return false; }
        if (G.locked || !def.press) return;
        if (!def.press(G, p.mouseX, p.mouseY)) return;
        G.down = true; G.demoUntil = 0;   // mientras el dedo está abajo no se dibuja la demostración
        return false;
      };
      p.mouseDragged = () => { if (G.locked || !def.drag) return; return def.drag(G, p.mouseX, p.mouseY) ? false : undefined; };
      p.mouseReleased = e => {
        G.down = false;
        if (!G.locked) {
          if (e?.type === 'touchcancel' && def.cancel) def.cancel(G);
          else def.release?.(G, p.mouseX, p.mouseY);
        }
      };
    }, def.aspect ?? 1.2);
    return {
      loaded: m.ready,
      getState: () => ({ rounds: JSON.parse(JSON.stringify(G.st)) }),
      lock() { G.locked = true; },
      destroy: () => m.remove(),
      // «Cómo se juega»: repite la demostración sobre el juego durante dos vueltas.
      demo() { G.demoT0 = G.t; G.demoUntil = G.t + 2 * DEMO_T; },
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ cur: G.cur, W: G.W, H: G.H, tabs: G.tabs, s: JSON.parse(JSON.stringify(G.s)), ...(def.peek?.(G) || {}) }),
    };
  }
  return { grade, create, demo: !!def.demo };
}

// ---------- Juegos dinámicos por retos (spec 2026-11-21-dinamicos-mundos-altos) ----------
// Armazón de un juego de acción sin prisa: rondas con varios retos, tres vidas, cartel «Toca para empezar», pausa
// corta tras cada acierto (el reto resuelto se queda en pantalla) y resumen al terminar. Usa makeArcade.
// params = { rounds: [{ title, items: [reto, …] }], lives? }      state = { done: [retos resueltos por ronda] }
// def = { aspect?, init(item, round, G) → s, ok(s, item, round) → bool (pura), answer(item, round) → s que gana (pura),
//   solution(item, round) → texto, prompt(item, round, G), draw(G), press(G, x, y) → bool, drag?, release?, layout?(G),
//   foot?(item, s, G), yes?(item, s) / no?(item, s) → mensajes, retry?(G), idle?, lost?, peek?(G) → { solve: [cajas por tocar], … } }
// G = { p, C, api, params, a (makeArcade), W, H, top, bottom, t, dt, s, item, round, solved, wait,
//   good(texto), bad(texto) → true si se perdió la ronda, submit(textoSiFalla) → califica s con def.ok }
function questGame(def) {
  const grade = (state, params) => ({
    ok: params.rounds.every((r, i) => (state?.done?.[i] ?? 0) >= r.items.length),
    solution: params.rounds.map(r => r.items.map(it => def.solution(it, r)).join(' · ')).join(' · '),
  });
  function create(host, params, api) {
    const C = api.palette, R = params.rounds, st = { done: R.map(() => 0) };
    let locked = false, p5 = null, demoSeen = false, demoUntil = 0, demoT0 = 0, down = false;
    const a = makeArcade(R.length, params.lives ?? 3, api, { start: i => { st.done[i] = 0; fresh(); }, lost: i => { st.done[i] = 0; fresh(); } });
    const G = { C, api, params, a, W: 0, H: 0, p: null, t: 0, dt: 0, s: null, wait: 0, solved: false, top: 100, bottom: 0,
      get round() { return R[a.cur]; },
      get item() { const r = R[a.cur]; return r.items[Math.min(st.done[a.cur], r.items.length - 1)]; },
      get locked() { return locked; },
      good(text) { if (G.wait > 0) return; a.hit(); a.say(text || '¡Bien!', C.ok); G.wait = 1.2; G.solved = true; burst(); },
      bad(text) { a.say(text || 'Piénsalo otra vez', C.bad); const lost = a.miss(); if (!lost) def.retry?.(G); return lost; },
      submit(text) { if (def.ok(G.s, G.item, G.round)) { G.good(def.yes?.(G.item, G.s)); return true; } G.bad(text ?? def.no?.(G.item, G.s)); return false; },
    };
    // Chispas de colores al acertar un reto (no salen con «reducir movimiento»).
    const bits = [];
    const burst = () => { if (reducedMotion() || !G.dt) return; const cols = [C.sun, C.coral, C.mint, C.sky]; for (let i = 0; i < 18; i++) { const an = Math.random() * Math.PI * 2, v = 90 + Math.random() * 170; bits.push({ x: G.W / 2, y: (G.top + G.bottom) / 2, vx: Math.cos(an) * v, vy: Math.sin(an) * v - 120, col: cols[i % 4], t: 0 }); } };
    function fresh() { G._gl = null; G._shot = null; G.solved = false; G.wait = 0; G.s = def.init(G.item, G.round, G); def.layout?.(G); }
    const m = mountSketch(host, (p, size) => {
      G.p = p; p5 = p;
      const lay = () => { G.W = size.w; G.H = size.h; G.bottom = size.h - 34; def.layout?.(G); };
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); G.W = size.w; G.H = size.h; G.bottom = size.h - 34; G.s = def.init(G.item, G.round, G); lay(); };
      p.onResize = () => { lay(); if (a.stopped) p.redraw(); };
      p.draw = () => {
        p.background(C.bg);
        G.dt = frameDt(p) * a.slow; G.t += G.dt;
        if (!locked) {
          // Al cambiar de ronda el reto nuevo empieza limpio (si no, se vería resuelto con el estado del anterior).
          const was = a.cur; a.tick(G.dt); if (a.cur !== was && a.cur < R.length) fresh();
          // Pausa tras un acierto: después pasa al reto siguiente (o gana la ronda).
          if (G.wait > 0 && a.phase === 'play' && (G.wait -= G.dt) <= 0) { st.done[a.cur]++; if (st.done[a.cur] >= R[a.cur].items.length) a.win(); else fresh(); }
        }
        const all = locked || a.phase === 'all', mid = (G.top + G.bottom) / 2;
        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, G.round.title, G.W / 2, 40, G.W - 24, 11);
        if (all) drawArcadeSummary(p, C, R.map((r, i) => ({ text: r.title, ok: st.done[i] >= r.items.length })), mid);
        else {
          p.noStroke(); p.fill(C.N); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, def.prompt(G.item, G.round, G), G.W / 2, 68, G.W - 20, 16, 36);
          def.draw(G);
          // La mano que muestra el gesto, hasta el primer movimiento (o un rato si se pidió con «Cómo se juega»).
          if (def.demo && !locked && !down && a.phase === 'play' && G.wait <= 0 && ((!demoSeen && api.guideAuto !== false) || G.t < demoUntil)) drawDemo(p, C, G.t - demoT0, def.demo(G));
          for (const b of bits) { b.t += G.dt; b.vy += 520 * G.dt; b.x += b.vx * G.dt; b.y += b.vy * G.dt; p.noStroke(); p.fill(b.col); p.rect(b.x, b.y, 6, 6, 2); }
          while (bits.length && bits[0].t > 1) bits.shift();
          drawArcadeBanner(p, C, a, mid, { idle: def.idle || 'Sin prisa: piensa y luego toca', lost: def.lost });
        }
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        if (a.toast && !all) arcadeToast(p, C, a, G.W / 2, G.H - 17, locked);
        else fitText(p, all ? '¡Completado! Ya puedes comprobar' : def.foot?.(G.item, G.s, G) ?? '', G.W / 2, G.H - 15, G.W - 20, 11);
        arcadeStop(p, a, locked);
      };
      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const t = a.tap(locked);
        if (t === 'off') return;
        if (t === 'start') { demoT0 = G.t; return false; }
        if (t !== 'play' || G.wait > 0 || !def.press) return;
        // Un toque en zona vacía no agarra nada: deja desplazar la lección.
        if (!def.press(G, p.mouseX, p.mouseY)) return;
        down = true; demoSeen = true; demoUntil = 0;
        return false;
      };
      p.mouseDragged = () => { if (locked || a.phase !== 'play' || G.wait > 0 || !def.drag) return; return def.drag(G, p.mouseX, p.mouseY) ? false : undefined; };
      p.mouseReleased = e => {
        down = false;
        if (!locked && a.phase === 'play' && G.wait <= 0) {
          if (e?.type === 'touchcancel' && def.cancel) def.cancel(G);
          else def.release?.(G, p.mouseX, p.mouseY);
        }
      };
    }, def.aspect ?? 1.3);
    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; if (p5 && a.stopped) p5.redraw(); },
      destroy: () => m.remove(),
      // «Cómo se juega»: repite la demostración sobre el juego durante dos vueltas.
      demo() { demoT0 = G.t; demoUntil = G.t + 2 * DEMO_T; },
      // Para el robot del navegador: en juego y sin pausa, `solve` trae las cajas que resuelven el reto actual.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, done: [...st.done], wait: G.wait, W: G.W, H: G.H, ...(a.phase === 'play' && G.wait <= 0 ? def.peek?.(G) : {}) }),
    };
  }
  return { grade, create, ok: def.ok, answer: def.answer, init: def.init, demo: !!def.demo };
}
// Botón de un juego (ficha con texto); `on`: resaltado.
function drawBtn(p, C, b, txt, on, col) { drawTile(p, C, b, txt, { fill: col ?? (on ? C.mint : C.sky), size: 14, r: 10 }); }

// ---------- Ayudas de los juegos de Trigonometría (spec 2026-11-22-trigonometria-juegos) ----------
// Ángulos, fracciones de π en TeX, valores notables, circunferencia, filas de botones, toques de − / + y lados de triángulos.
const TK = (() => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const rad = d => d * Math.PI / 180, mod = (a, n) => ((a % n) + n) % n;
  // k·π/d en TeX, sin los signos de dólar: piTex(3, 2) → \tfrac{3\pi}{2}.
  const piTex = (k, d = 1) => {
    const g = gcd(k, d) || 1; k /= g; d /= g;
    if (!k) return '0';
    const top = `${Math.abs(k) === 1 ? '' : Math.abs(k)}\\pi`;
    return `${k < 0 ? '-' : ''}${d === 1 ? top : `\\tfrac{${top}}{${d}}`}`;
  };
  const FN = { sen: '\\operatorname{sen}', cos: '\\cos', tan: '\\tan', csc: '\\csc', sec: '\\sec', cot: '\\cot' };
  const F = { sen: Math.sin, cos: Math.cos, tan: Math.tan, csc: x => 1 / Math.sin(x), sec: x => 1 / Math.cos(x), cot: x => 1 / Math.tan(x) };
  // Valores notables de seno y coseno, de −1 a 1.
  const VAL = [-1, -Math.sqrt(3) / 2, -Math.SQRT1_2, -0.5, 0, 0.5, Math.SQRT1_2, Math.sqrt(3) / 2, 1];
  const VTEX = ['-1', '-\\tfrac{\\sqrt3}{2}', '-\\tfrac{\\sqrt2}{2}', '-\\tfrac12', '0', '\\tfrac12', '\\tfrac{\\sqrt2}{2}', '\\tfrac{\\sqrt3}{2}', '1'];
  const at = (cx, cy, R, deg) => [cx + R * Math.cos(rad(deg)), cy - R * Math.sin(rad(deg))];
  function ring(p, C, cx, cy, R) {
    p.stroke(C.line); p.strokeWeight(1.5); p.line(cx - R - 10, cy, cx + R + 10, cy); p.line(cx, cy - R - 10, cx, cy + R + 10);
    p.noFill(); p.stroke(C.mute); p.strokeWeight(2); p.circle(cx, cy, 2 * R);
  }
  // n botones en fila, pegados abajo.
  const row = (G, n, h = 38, gap = 8, y = G.bottom - h - 6) => { const w = (G.W - 24 - (n - 1) * gap) / n; return Array.from({ length: n }, (_, i) => ({ x: 12 + i * (w + gap), y, w, h })); };
  const minus = b => ({ x: b.x, y: b.y, w: 40, h: b.h }), plus = b => ({ x: b.x + b.w - 40, y: b.y, w: 40, h: b.h });
  // Los toques de − / + que llevan un control de `from` a `to` (para el robot).
  const steps = (b, from, to) => Array(Math.abs(to - from)).fill(to > from ? plus(b) : minus(b));
  const segDist = (x, y, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy); };
  const mid = (a, b, s = 14) => ({ x: (a[0] + b[0]) / 2 - s / 2, y: (a[1] + b[1]) / 2 - s / 2, w: s, h: s });
  const inkOf = (C, col) => (col === C.sky ? C.Z : col === C.coral ? C.I : col === C.mint ? C.Q : col);
  function label(p, C, txt, x, y, col, size = 13, w = 110) { p.noStroke(); p.fill(inkOf(C, col)); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, String(txt), x, y, w, size); }
  // Lado más cercano al toque (índice en `segs`), o −1.
  const hitSeg = (segs, x, y, r = 22) => { let best = -1, bd = r; segs.forEach(([a, b], i) => { const d = segDist(x, y, a, b); if (d < bd) { bd = d; best = i; } }); return best; };
  // Rótulo de un lado, corrido hacia afuera del triángulo.
  function sideLabel(p, C, txt, a, b, c, col, size = 14) { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, d = Math.hypot(mx - c[0], my - c[1]) || 1; label(p, C, txt, mx + (mx - c[0]) / d * 17, my + (my - c[1]) / d * 15, col, size, 70); }
  const minusTxt = v => String(v).replace('-', '−');
  // Movimiento: `glide` acerca poco a poco un valor dibujado a su destino; `fire` marca el inicio de una animación y
  // `prog` dice cuánto va (0 a 1). Sin cuadros (Node) o con «reducir movimiento», todo salta al final.
  const glide = (G, key, target, rate = 9) => { const m = (G._gl ||= {}); if (m[key] == null || !G.dt || reducedMotion()) m[key] = target; else { m[key] += (target - m[key]) * Math.min(1, G.dt * rate); if (Math.abs(m[key] - target) < 1e-3) m[key] = target; } return m[key]; };
  const fire = G => { G._shot = G.t; };
  const prog = (G, dur) => (G._shot == null || !G.dt || reducedMotion() ? 1 : Math.max(0, Math.min(1, (G.t - G._shot) / dur)));
  return { gcd, rad, mod, piTex, FN, F, VAL, VTEX, at, ring, row, minus, plus, steps, segDist, mid, label, hitSeg, sideLabel, minusTxt, glide, fire, prog };
})();
