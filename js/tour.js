// Recorrido guiado de bienvenida: la primera vez que se abre la app, una capa oscurece la pantalla,
// deja un hueco iluminado sobre el elemento real del que se habla y lo explica en una tarjeta.
// Diseño: docs/superpowers/specs/2026-11-12-recorrido-guiado.md.

// `target`: selectores que se prueban en orden (el primero que exista); sin target, la tarjeta va centrada
// con su arte (`mascot`, `video` o `ex`). `review`: texto para el modo revisión (`S.unlockAll`). `view`: lo que debe verse detrás (mapa de mundos o un mundo).
const TOUR_STEPS = [
  { id: 'hola', view: 'map', art: 'mascot', title: '¡Hola! Soy Zuka',
    text: 'Te muestro en un minuto cómo se usa la app: elegir tu curso, ver los videos y resolver los ejercicios.' },
  { id: 'curso', view: 'map', target: ['.tb-course'], title: 'Elige tu curso',
    text: 'Toca aquí para cambiar de curso: Álgebra, Trigonometría, Cálculo y más. Tu avance se guarda aparte en cada uno.' },
  { id: 'mundos', view: 'map', target: ['.wnode.current', '.wnode'], title: 'El camino de mundos',
    text: 'Cada curso es un camino y cada mundo, un tema. Toca un mundo para entrar y ver sus niveles.' },
  { id: 'niveles', view: 'world', target: ['.path .node.current', '.path .node'], title: 'Cada nivel es una lección',
    text: 'Toca un nivel y luego «Empezar». Cada lección trae un video corto y después ejercicios para practicar lo que viste.' },
  { id: 'video', view: 'world', art: 'video', title: 'Primero, el video',
    text: 'Toca la pantalla para pausar y arrastra la barra de abajo para repetir una parte. Para pasar a los ejercicios, desliza hacia arriba, como en Clips.' },
  { id: 'ejercicios', view: 'world', art: 'ex', title: 'Después, los ejercicios',
    text: 'Casi todos son juegos: arrastra, toca o escribe tu respuesta y pulsa «Comprobar». Si te trabas, busca «Ver pista»: te orienta sin darte la respuesta.' },
  { id: 'progreso', view: 'world', target: ['.tb-stats'], title: 'Racha, experiencia y vidas',
    text: 'La llama cuenta tus días seguidos, el rayo tu experiencia (XP) y el corazón tus vidas: cada error cuesta una y vuelven solas con el tiempo.',
    review: 'La llama cuenta tus días seguidos, el rayo tu experiencia (XP) y el corazón tus vidas. En modo revisión, como ahora, no las pierdes al fallar.' },
  { id: 'clips', view: 'world', target: ['#tabbar [data-tab="clips"]'], title: 'Clips: datos curiosos',
    text: 'Videos cortos con curiosidades de matemáticas y ciencia. Desliza hacia arriba para ver el siguiente y guarda los que te gusten.' },
  { id: 'tutorias', view: 'world', target: ['#tabbar [data-tab="tutorias"]'], title: 'Tutorías: ayuda en vivo',
    text: '¿Te trabaste? Separa una asesoría virtual: eliges la materia, los temas que quieres reforzar, el día y la hora.' },
  { id: 'perfil', view: 'world', target: ['#tabbar [data-tab="profile"]'], title: 'Tu perfil',
    text: 'Aquí pones tu nombre, tu meta diaria y el tema claro u oscuro. También puedes repetir este recorrido cuando quieras.' },
  { id: 'fin', view: 'world', target: ['.path .node.current', '.path .node'], art: 'mascot', title: '¡Todo listo!',
    text: 'Toca este nivel para empezar la lección y avanza a tu ritmo. ¡Mucho éxito!' },
];

// Solo para quien abre la app por primera vez: sin recorrido hecho y sin ningún progreso.
function tourShouldStart(s) {
  return !s.tourDone && !s.xp && !Object.keys(s.done || {}).length;
}

// Hueco iluminado alrededor del elemento (con margen), sin salirse de la pantalla. Sin elemento se
// cierra en el centro: la sombra del hueco oscurece todo.
function tourHole(rect, vw, vh, pad = 6, edge = 4) {
  if (!rect) return { left: vw / 2, top: vh / 2, width: 0, height: 0 };
  const cl = (v, max) => Math.max(edge, Math.min(max - edge, v));
  const l = cl(rect.left - pad, vw), t = cl(rect.top - pad, vh);
  const r = cl(rect.left + rect.width + pad, vw), b = cl(rect.top + rect.height + pad, vh);
  return { left: l, top: t, width: Math.max(0, r - l), height: Math.max(0, b - t) };
}

// Dónde va la tarjeta: debajo del hueco si cabe, si no arriba, y si no donde haya más espacio.
// `bounds` son los bordes izquierdo y derecho de la columna de la app. `arrow`: posición horizontal
// de la flecha dentro de la tarjeta, apuntando al centro del hueco.
function tourTipPos(hole, tipW, tipH, vw, vh, bounds, gap = 14, edge = 8) {
  const bw = bounds.right - bounds.left;
  const clampX = x => (tipW > bw - 2 * edge ? bounds.left + (bw - tipW) / 2
    : Math.max(bounds.left + edge, Math.min(bounds.right - tipW - edge, x)));
  const clampY = y => Math.max(edge, Math.min(vh - tipH - edge, y));
  if (!hole.width && !hole.height) {
    return { side: 'center', left: clampX(bounds.left + (bw - tipW) / 2), top: Math.max(edge, (vh - tipH) / 2), arrow: tipW / 2 };
  }
  const cx = hole.left + hole.width / 2, below = hole.top + hole.height + gap, above = hole.top - gap - tipH;
  let side, top;
  if (below + tipH <= vh - edge) { side = 'below'; top = clampY(below); }
  else if (above >= edge) { side = 'above'; top = clampY(above); }
  else if (vh - (hole.top + hole.height) >= hole.top) { side = 'below'; top = clampY(below); }
  else { side = 'above'; top = clampY(above); }
  const left = clampX(cx - tipW / 2);
  return { side, left, top, arrow: Math.max(18, Math.min(tipW - 18, cx - left)) };
}

const TOUR_ART = {
  mascot: () => '<img class="tour-mascot" src="brand/mascota.png" alt="" width="96" height="99">',
  // Los videos siempre son oscuros: la ilustración usa colores fijos, como el reproductor.
  video: () => `<div class="tour-video" aria-hidden="true"><span class="tv-skip">Ejercicios →</span>
    <span class="tv-play">${ICON.play}</span><span class="tv-seek"><b></b></span></div>`,
  ex: () => `<div class="tour-ex" aria-hidden="true">
    <div class="te-row"><span class="te-chip">3</span><span class="te-chip drag">5</span><span class="te-slot"></span></div>
    <div class="te-row"><span class="te-hint">${ICON.bulb}Ver pista</span><span class="te-check">Comprobar</span></div></div>`,
};

let tourEnd = null;
const tourOpen = () => !!tourEnd;
function endTour() { tourEnd?.(); }

// Deja detrás la vista que el paso necesita: el mapa de mundos o el mundo donde va el estudiante.
function tourView(v) {
  if ($('#sheet').classList.contains('open')) closeSheet();
  const c = courseById(S.course);
  if (v === 'map') {
    if (tab !== 'learn' || openWorld) { openWorld = null; go('learn'); }
    return;
  }
  if (tab === 'learn' && openWorld?.course === c.id) return;
  const cur = lessonsOf(c).find(l => !isDone(l));
  openWorld = { course: c.id, i: Math.max(0, c.units.findIndex(u => u.lessons.includes(cur))) };
  go('learn');
}

function startTour() {
  if (tourEnd || typeof lessonClose === 'function') return;
  const n = TOUR_STEPS.length;
  const layer = document.createElement('div');
  layer.className = 'tour';
  layer.innerHTML = `<div class="tour-hole"></div>
    <div class="tour-tip" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-text">
      <button class="icon-btn tour-x" type="button" aria-label="Saltar el recorrido">${ICON.x}</button>
      <div class="tour-art"></div>
      <p class="eyebrow tour-count"></p>
      <h3 id="tour-title"></h3><p id="tour-text"></p>
      <div class="tour-dots" aria-hidden="true">${TOUR_STEPS.map(() => '<i></i>').join('')}</div>
      <div class="tour-actions"><button class="btn ghost" type="button" data-prev></button><button class="btn" type="button" data-next></button></div>
      <i class="tour-arrow" aria-hidden="true"></i>
    </div>`;
  const hole = $('.tour-hole', layer), tip = $('.tour-tip', layer);
  const prevBtn = $('[data-prev]', layer), nextBtn = $('[data-next]', layer);
  const inert = ['#app', '#overlay', '#sheet'].map(q => $(q)).filter(el => el && !el.inert);
  const before = document.activeElement;
  let i = 0, timer = null;

  const targetOf = step => (step.target || []).map(q => document.querySelector(q)).find(Boolean) || null;

  // Coloca el hueco y la tarjeta según dónde está el elemento ahora (la app puede volver a pintarse
  // o cambiar de tamaño mientras el recorrido está abierto).
  function place() {
    const el = targetOf(TOUR_STEPS[i]);
    let r = el?.getBoundingClientRect();
    // Si la app se volvió a pintar o la pantalla giró y el elemento quedó fuera de la vista, se trae de vuelta.
    if (r && r.width && (r.bottom < 0 || r.top > innerHeight)) { el.scrollIntoView({ block: 'center', inline: 'nearest' }); r = el.getBoundingClientRect(); }
    const h = tourHole(r && r.width ? r : null, innerWidth, innerHeight);
    const centered = !h.width && !h.height;
    layer.classList.toggle('center', centered);
    let radius = '50%';
    if (!centered) {
      const br = getComputedStyle(el).borderTopLeftRadius;
      radius = br.endsWith('%') ? br : `${Math.max(14, (parseFloat(br) || 0) + 6)}px`;
    }
    Object.assign(hole.style, { left: `${h.left}px`, top: `${h.top}px`, width: `${h.width}px`, height: `${h.height}px`, borderRadius: radius });
    const app = $('#app').getBoundingClientRect();
    const p = tourTipPos(h, tip.offsetWidth, tip.offsetHeight, innerWidth, innerHeight, { left: app.left, right: app.right });
    tip.dataset.side = p.side;
    Object.assign(tip.style, { left: `${p.left}px`, top: `${p.top}px` });
    tip.style.setProperty('--arrow', `${p.arrow}px`);
    // ¿La tarjeta quedó sin tapar el hueco?
    return centered || (p.side === 'below' ? p.top >= h.top + h.height : p.top + tip.offsetHeight <= h.top);
  }

  function show(k) {
    i = Math.max(0, Math.min(n - 1, k));
    const step = TOUR_STEPS[i];
    tourView(step.view);
    $('.tour-art', layer).innerHTML = step.art ? TOUR_ART[step.art]() : '';
    $('.tour-count', layer).textContent = `Paso ${i + 1} de ${n}`;
    $('#tour-title', layer).textContent = step.title;
    $('#tour-text', layer).textContent = S.unlockAll && step.review ? step.review : step.text;
    layer.querySelectorAll('.tour-dots i').forEach((d, j) => d.classList.toggle('on', j === i));
    prevBtn.textContent = i === 0 ? 'Saltar' : 'Atrás';
    nextBtn.textContent = i === 0 ? 'Empezar' : i === n - 1 ? '¡A aprender!' : 'Siguiente';
    // El elemento va al centro; si en una pantalla baja la tarjeta lo taparía, se lleva al fondo
    // para dejarle sitio arriba.
    targetOf(step)?.scrollIntoView({ block: 'center', inline: 'nearest' });
    if (!place()) { targetOf(step).scrollIntoView({ block: 'end', inline: 'nearest' }); place(); }
    nextBtn.focus({ preventScroll: true });
  }

  const next = () => (i === n - 1 ? finish() : show(i + 1));
  const prev = () => (i === 0 ? finish() : show(i - 1));

  // Ninguna tecla llega a la app de atrás: flechas y Enter recorren los pasos, Esc lo salta.
  function key(e) {
    if (dialogOpen()) return;
    e.stopPropagation();
    const onButton = document.activeElement?.tagName === 'BUTTON';
    if (e.key === 'Escape') { e.preventDefault(); finish(); }
    else if (e.key === 'ArrowRight' || (e.key === 'Enter' && !onButton)) { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); prev(); }
    else if (e.key === 'Tab') {
      const bs = [...tip.querySelectorAll('button')], at = bs.indexOf(document.activeElement);
      e.preventDefault(); bs[(at + (e.shiftKey ? bs.length - 1 : 1)) % bs.length].focus();
    }
  }

  function finish() {
    if (tourEnd !== finish) return;
    tourEnd = null;
    S.tourDone = true; save();
    clearInterval(timer);
    document.removeEventListener('keydown', key, true);
    removeEventListener('resize', place);
    inert.forEach(el => { el.inert = false; });
    layer.classList.remove('open');
    setTimeout(() => layer.remove(), 250);
    (document.querySelector('.path .node.current') || (before?.isConnected ? before : null))?.focus?.({ preventScroll: true });
  }

  // Los toques se quedan en la capa (la app de atrás no se mueve); tocar el hueco avanza.
  ['mousedown', 'mouseup', 'touchstart', 'touchend', 'pointerdown', 'pointerup']
    .forEach(t => layer.addEventListener(t, e => e.stopPropagation()));
  // En el último paso el hueco está sobre el primer nivel: tocarlo cierra el recorrido y abre ese nivel.
  hole.onclick = () => {
    const el = i === n - 1 && targetOf(TOUR_STEPS[i]);
    next();
    if (el) el.click();
  };
  nextBtn.onclick = next;
  prevBtn.onclick = prev;
  $('.tour-x', layer).onclick = finish;

  tourEnd = finish;
  inert.forEach(el => { el.inert = true; });
  document.addEventListener('keydown', key, true);
  addEventListener('resize', place);
  document.body.appendChild(layer);
  show(0);
  timer = setInterval(place, 400);
  requestAnimationFrame(() => layer.classList.add('open'));
}
