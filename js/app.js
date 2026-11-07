// Zuka: estado persistente, navegación por pestañas, ruta de aprendizaje, feed de clips,
// lecciones con vidas/XP/racha y perfil.

const KEY = 'zuka-v1';
const HEART_MS = 20 * 60 * 1000; // una vida cada 20 minutos
const DEFAULTS = () => ({
  name: '', xp: 0, done: {}, watched: {}, likes: {}, saved: {}, course: 'algebra',
  streak: 0, lastDay: null, hearts: 5, heartsAt: Date.now(), today: { day: null, xp: 0 },
  goal: 30, correct: 0, answered: 0, voice: false, sfx: true, theme: 'system', hideInstall: false, videoQuality: 'auto', videoMuted: false, videoSpeed: 1,
});

let S = (() => {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* almacenamiento no disponible */ }
  return Object.assign(DEFAULTS(), s || {});
})();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* idem */ } }

const $ = (s, r = document) => r.querySelector(s);
const view = $('#view');

// ---- tema claro / oscuro ----
const darkQuery = matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
  const t = S.theme === 'system' ? (darkQuery.matches ? 'dark' : 'light') : S.theme;
  document.documentElement.dataset.theme = t;
  $('meta[name="theme-color"]').content = t === 'dark' ? '#0c0f1f' : '#f5f7fc';
  setGameTheme(t);   // los minijuegos abiertos se repintan con la paleta del tema
}
darkQuery.addEventListener('change', () => S.theme === 'system' && applyTheme());

// ---- instalación (PWA) ----
let installEvt = null;
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  installEvt = e;
  if (tab !== 'clips') go(tab);
});
addEventListener('appinstalled', () => {
  installEvt = null;
  toast('¡Zuka quedó instalada!');
  if (tab !== 'clips') go(tab);
});
async function promptInstall() {
  if (!installEvt) return;
  installEvt.prompt();
  await installEvt.userChoice;
  installEvt = null;
  if (tab !== 'clips') go(tab);
}
function installHelp() {
  if (isIOS) return 'En Safari toca <b>Compartir</b> y luego <b>Añadir a pantalla de inicio</b>.';
  return 'Abre el menú del navegador y elige <b>Instalar app</b> o <b>Añadir a pantalla de inicio</b>.';
}
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js')
    .then(reg => watchUpdates(reg, navigator.serviceWorker, showUpdateBar))
    .catch(() => {}));
}
// Barra encima del menú inferior: «Actualizar» recarga con la versión nueva; «Más tarde» la
// oculta hasta la próxima vez que se abra la app.
function showUpdateBar(apply, dismiss) {
  if ($('.update-bar')) return;
  const bar = document.createElement('div');
  bar.className = 'update-bar';
  bar.setAttribute('role', 'status');
  bar.innerHTML = `<img src="brand/mascota.png" alt=""><div class="ub-text"><b>Hay una versión nueva de Zuka</b><span>Actualiza para tener lo último.</span></div>
    <div class="ub-actions"><button class="btn small" data-later type="button">Más tarde</button><button class="btn small main" data-update type="button">Actualizar</button></div>`;
  $('[data-update]', bar).onclick = () => { $('[data-update]', bar).textContent = 'Actualizando…'; apply(); };
  $('[data-later]', bar).onclick = () => { bar.remove(); dismiss(); };
  document.body.appendChild(bar);
}

// ---- fechas, XP, racha y vidas ----
const dayStr = d => d.toLocaleDateString('en-CA');
const today = () => dayStr(new Date());
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); };
const streakNow = () => (S.lastDay === today() || S.lastDay === yesterday() ? S.streak : 0);
const todayXP = () => (S.today.day === today() ? S.today.xp : 0);

function addXP(n) {
  if (S.today.day !== today()) S.today = { day: today(), xp: 0 };
  S.today.xp += n; S.xp += n; save();
}
function markStreak() {
  if (S.lastDay === today()) return false;
  S.streak = S.lastDay === yesterday() ? S.streak + 1 : 1;
  S.lastDay = today(); save();
  return true;
}
function syncHearts() {
  if (S.hearts >= 5) { S.heartsAt = Date.now(); return; }
  const n = Math.floor((Date.now() - S.heartsAt) / HEART_MS);
  if (n > 0) { S.hearts = Math.min(5, S.hearts + n); S.heartsAt += n * HEART_MS; save(); }
}
function loseHeart() {
  if (S.hearts >= 5) S.heartsAt = Date.now();
  S.hearts = Math.max(0, S.hearts - 1); save();
}
const minsToHeart = () => Math.max(1, Math.ceil((S.heartsAt + HEART_MS - Date.now()) / 60000));

// ---- cursos ----
const courseById = id => COURSES.find(c => c.id === id) || COURSES[0];
const lessonsOf = c => c.units.flatMap(u => u.lessons);
const isDone = l => !!S.done[l.id];
function isUnlocked(c, l) {
  const ls = lessonsOf(c), i = ls.indexOf(l);
  return i <= 0 || isDone(l) || isDone(ls[i - 1]);
}
function findLesson(id) {
  for (const c of COURSES) for (const l of lessonsOf(c)) if (l.id === id) return { c, l };
}
// clipsOf y buildQueue (orden de videos y ejercicios) viven en content.js.
const clipSecs = l => clipsOf(l).reduce((t, c) => t + (c.duration ?? c.scenes.reduce((s, x) => s + x.d, 0)), 0);

// ---- navegación ----
let tab = 'learn', cleanup = null;
// Cierra la clase abierta (pide confirmación si hay progreso); null cuando no hay clase.
let lessonClose = null;
function go(t) {
  cleanup?.(); cleanup = null;
  tab = t;
  document.body.dataset.tab = t;
  document.querySelectorAll('#tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
  renderTop();
  ({ learn: renderLearn, clips: renderClips, profile: renderProfile })[t]();
}

function renderTop() {
  syncHearts();
  const c = courseById(S.course);
  $('#topbar').innerHTML = `
    <button class="tb-course" style="--c:${c.color}" aria-label="Cambiar de curso">
      ${courseArt(c, 'sm')}<span class="tb-name">${esc(c.name)}</span>${ICON.down}</button>
    <div class="tb-stats">
      <span class="tb-stat streak${S.lastDay === today() ? ' lit' : ''}" title="Racha de días">${ICON.flame}<b>${streakNow()}</b></span>
      <span class="tb-stat xp" title="Experiencia">${ICON.bolt}<b>${S.xp}</b></span>
      <button class="tb-stat hearts" title="Vidas">${ICON.heart}<b>${S.hearts}</b></button>
    </div>`;
  $('.tb-course').onclick = openCoursePicker;
  $('#topbar .hearts').onclick = () => toast(S.hearts >= 5
    ? 'Tienes todas tus vidas. Cada error cuesta una.'
    : `Recuperas una vida en ${minsToHeart()} min.`);
}

// ---- hojas inferiores ----
function openSheet(html, bind) {
  const sh = $('#sheet');
  sh.innerHTML = `<div class="sheet-bg"></div><div class="sheet-card" role="dialog"><div class="grabber"></div>${html}</div>`;
  requestAnimationFrame(() => sh.classList.add('open'));
  sh.querySelector('.sheet-bg').onclick = closeSheet;
  bind?.(sh);
}
function closeSheet() { $('#sheet').classList.remove('open'); }

function openCoursePicker() {
  openSheet(`<h3 class="sheet-title">Elige un curso</h3><div class="course-list">${COURSES.map(c => {
    const ls = lessonsOf(c), d = ls.filter(isDone).length;
    return `<button class="course-row${c.id === S.course ? ' on' : ''}" data-id="${c.id}" style="--c:${c.color}">
      ${courseArt(c, 'lg')}
      <span class="cr-body"><span class="eyebrow">${esc(c.level)} · ${ls.length} lecciones</span><b>${esc(c.name)}</b>
      <span class="mini-bar"><i style="width:${(d / ls.length) * 100}%"></i></span></span>
      ${d === ls.length ? `<span class="cr-done">${ICON.check}</span>` : ''}</button>`;
  }).join('')}</div>`, sh => sh.querySelectorAll('.course-row').forEach(b => b.onclick = () => {
    S.course = b.dataset.id; save(); closeSheet(); go('learn'); view.scrollTop = 0;
  }));
}

function openLessonSheet(c, l) {
  const locked = !isUnlocked(c, l);
  openSheet(`<div class="ls" style="--c:${c.color}">
    <p class="eyebrow">${esc(c.name)}</p><h3>${esc(l.title)}</h3>
    <p class="ls-meta"><span>${ICON.clips} ${clipSecs(l) >= 90 ? `Video de ${Math.round(clipSecs(l) / 60)} min` : `Clip de ${clipSecs(l)} s`}</span><span>${ICON.target} ${l.ex.length} ejercicios</span></p>
    ${locked
      ? '<p class="muted">Completa la lección anterior para desbloquear esta.</p><button class="btn" disabled>Bloqueada</button>'
      : `<button class="btn" data-go>${isDone(l) ? 'Repasar · +5 XP' : 'Empezar · +10 XP'}</button>`}
  </div>`, sh => sh.querySelector('[data-go]')?.addEventListener('click', () => { closeSheet(); startLesson(c, l); }));
}

// ---- pestaña Aprender ----
const OFFSETS = [0, 52, 78, 52, 0, -52, -78, -52];
function renderLearn() {
  const c = courseById(S.course), ls = lessonsOf(c), doneN = ls.filter(isDone).length;
  const cur = ls.find(l => !isDone(l)), goalP = Math.min(1, todayXP() / S.goal);
  let k = 0;
  view.innerHTML = `<div class="learn" style="--c:${c.color}">
    <section class="hero">
      <div class="hero-body"><p class="eyebrow">${esc(c.level)}</p><h1>${esc(c.name)}</h1><p class="sub">${esc(c.tagline)}</p>
        <div class="hero-prog"><span class="mini-bar"><i style="width:${(doneN / ls.length) * 100}%"></i></span><small>${doneN}/${ls.length}</small></div></div>
      ${courseArt(c, 'xl')}
    </section>
    <section class="goal">
      ${ICON.target}<div class="goal-body"><p><b>Meta diaria</b><span>${todayXP()} / ${S.goal} XP</span></p>
      <div class="bar"><i style="width:${goalP * 100}%"></i></div></div>
    </section>
    ${installEvt && !S.hideInstall ? `<section class="install-banner">
      <img src="icons/icon-192.png" alt="" width="44" height="44">
      <div><b>Instala Zuka</b><p>Ábrela como app, incluso sin conexión.</p></div>
      <button class="btn brand sm" data-install>Instalar</button>
      <button class="icon-btn" data-hide-install aria-label="Ocultar">${ICON.x}</button>
    </section>` : ''}
    ${c.units.map((u, ui) => `<section class="unit">
      <header class="unit-banner"><p>Unidad ${ui + 1}</p><h2>${esc(u.title)}</h2></header>
      <div class="path">${u.lessons.map(l => {
        const st = isDone(l) ? 'done' : l === cur ? 'current' : 'locked';
        const icon = st === 'done' ? ICON.check : st === 'locked' ? ICON.lock : ICON.play;
        return `<div class="node-wrap" style="--x:${OFFSETS[k++ % OFFSETS.length]}px">
          ${st === 'current' ? '<span class="start-bubble">EMPIEZA</span>' : ''}
          <button class="node ${st}" data-id="${l.id}" aria-label="${esc(l.title)}">${icon}</button>
          <span class="node-label">${esc(l.title)}</span></div>`;
      }).join('')}</div></section>`).join('')}
    ${cur ? '' : `<div class="course-done">${ICON.star}<div><b>¡Curso completado!</b><p>Repasa cualquier lección o prueba otro curso.</p></div></div>`}
  </div>`;
  view.querySelectorAll('.node').forEach(b => b.onclick = () => openLessonSheet(c, findLesson(b.dataset.id).l));
  $('[data-install]', view)?.addEventListener('click', promptInstall);
  $('[data-hide-install]', view)?.addEventListener('click', () => { S.hideInstall = true; save(); renderLearn(); });
  if (doneN) view.querySelector('.node.current')?.scrollIntoView({ block: 'center' });
}

// ---- pestaña Clips (feed vertical) ----
let feedFilter = 'all';
function feedItems() {
  if (feedFilter !== 'all') { const c = courseById(feedFilter); return lessonsOf(c).map(l => ({ c, l })); }
  const lists = COURSES.map(c => lessonsOf(c).map(l => ({ c, l }))), out = [];
  for (let i = 0; i < Math.max(...lists.map(x => x.length)); i++) lists.forEach(x => x[i] && out.push(x[i]));
  return out;
}
function likeCount(l) {
  const base = [...l.id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % 4800 + 200;
  const n = base + (S.likes[l.id] ? 1 : 0);
  return n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + ' k' : String(n);
}

function renderClips() {
  const items = feedItems();
  view.innerHTML = `<div class="feed-wrap">
    <div class="chips">${[{ id: 'all', name: 'Para ti' }, ...COURSES].map(c =>
      `<button class="chip${feedFilter === c.id ? ' on' : ''}" data-f="${c.id}">${esc(c.name)}</button>`).join('')}</div>
    <div class="feed">${items.map(({ c, l }) => `<section class="feed-item" data-id="${l.id}">
      <div class="clip-host"></div>
      <aside class="rail" style="--c:${c.color}">
        <button class="rail-btn like${S.likes[l.id] ? ' on' : ''}" data-act="like" aria-label="Me gusta">${ICON.heart}<small>${likeCount(l)}</small></button>
        <button class="rail-btn save${S.saved[l.id] ? ' on' : ''}" data-act="save" aria-label="Guardar">${ICON.bookmark}<small>Guardar</small></button>
        <button class="rail-btn voice" data-act="voice" aria-label="Narración">${S.voice ? ICON.sound : ICON.mute}<small>Voz</small></button>
        <button class="rail-btn practice" data-act="practice" aria-label="Practicar">${ICON.bolt}<small>Practicar</small></button>
      </aside></section>`).join('')}</div></div>`;

  const feed = $('.feed', view), players = new Map();
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    const id = e.target.dataset.id;
    if (e.isIntersecting) {
      let p = players.get(id);
      if (!p) {
        const { c, l } = findLesson(id);
        p = makePlayer(e.target.querySelector('.clip-host'), l, c, { loop: true, feed: true, onEnd: () => watched(l) });
        players.set(id, p);
      }
      p.play();
    } else players.get(id)?.pause();
  }), { root: feed, threshold: 0.65 });
  feed.querySelectorAll('.feed-item').forEach(el => io.observe(el));

  view.querySelectorAll('.chip').forEach(b => b.onclick = () => { feedFilter = b.dataset.f; go('clips'); });
  feed.addEventListener('click', e => {
    const b = e.target.closest('.rail-btn');
    if (!b) return;
    const id = b.closest('.feed-item').dataset.id, { c, l } = findLesson(id);
    const act = b.dataset.act;
    if (act === 'like') {
      S.likes[id] = !S.likes[id]; b.classList.toggle('on', S.likes[id]);
      b.querySelector('small').textContent = likeCount(l); Sfx.tap();
    } else if (act === 'save') {
      S.saved[id] = !S.saved[id]; b.classList.toggle('on', S.saved[id]);
      toast(S.saved[id] ? 'Guardado en tu perfil' : 'Eliminado de guardados');
    } else if (act === 'voice') {
      S.voice = !S.voice;
      feed.querySelectorAll('.rail-btn.voice').forEach(x => { x.innerHTML = `${S.voice ? ICON.sound : ICON.mute}<small>Voz</small>`; });
      if (S.voice) players.get(id)?.speak?.(); else Narrator.stop();
      toast(S.voice ? 'Narración activada' : 'Narración desactivada');
    } else if (act === 'practice') {
      if (isUnlocked(c, l)) startLesson(c, l);
      else toast(`Primero completa las lecciones anteriores de ${esc(c.name)}.`);
    }
    save();
  });

  cleanup = () => { io.disconnect(); players.forEach(p => p.destroy()); Narrator.stop(); };
}

function watched(l) {
  if (S.watched[l.id]) return;
  S.watched[l.id] = 1; addXP(1);
  toast(`${ICON.bolt} +1 XP por ver el clip`);
}

// ---- lección: clip + ejercicios ----
const PRAISE = ['¡Correcto!', '¡Excelente!', '¡Muy bien!', '¡Así se hace!', '¡Perfecto!'];

function startLesson(c, l) {
  syncHearts();
  if (S.hearts <= 0) return toast(`Sin vidas. Recuperas una en ${minsToHeart()} min.`);
  const back = tab;
  cleanup?.(); cleanup = null;

  const clips = clipsOf(l);
  const queue = buildQueue(l);
  const total = queue.length, t0 = Date.now();
  let pos = 0, solved = 0, mistakes = 0, handle = null, player = null, finished = false, clipTimer = null;

  const ov = $('#overlay');
  ov.innerHTML = `<div class="lesson" style="--c:${c.color}">
    <div class="lesson-top">
      <button class="icon-btn" data-close aria-label="Salir">${ICON.x}</button>
      <div class="pbar"><i></i></div>
      <span class="tb-stat hearts">${ICON.heart}<b>${S.hearts}</b></span>
    </div>
    <div class="lesson-body"></div>
    <div class="lesson-foot"><button class="btn main">Comprobar</button></div>
    <div class="feedback" role="status"></div>
    <button class="icon-btn clip-close" data-close aria-label="Salir">${ICON.x}</button>
    <button class="clip-skip" type="button">Ejercicios →</button>
    <span class="clip-part"></span>
  </div>`;
  ov.classList.add('open');
  const root = $('.lesson', ov), body = $('.lesson-body', ov), btn = $('.btn.main', ov), fb = $('.feedback', ov);
  const bar = $('.pbar i', ov), hearts = $('.lesson-top .hearts b', ov);

  const updateBar = () => { bar.style.width = (solved / total) * 100 + '%'; hearts.textContent = S.hearts; };
  const teardown = () => { clearTimeout(clipTimer); clipTimer = null; player?.destroy(); player = null; handle?.destroy?.(); handle = null; };

  // `to`: pestaña a la que ir al salir (al tocar el menú inferior); si no, la de origen.
  function close(to) {
    if (!finished && pos > 0 && !confirm('¿Salir de la lección? Perderás el progreso de esta lección.')) return;
    teardown(); Narrator.stop();
    document.removeEventListener('keydown', onKey);
    ov.classList.remove('open'); ov.innerHTML = '';
    lessonClose = null;
    go(typeof to === 'string' ? to : back);
  }
  lessonClose = close;
  ov.querySelectorAll('[data-close]').forEach(b => { b.onclick = () => close(); });

  // `pos` es la tarea actual. `review` es el video que se vuelve a ver al deslizar hacia
  // atrás (−1 si no se está repasando) y `reviewPos` su lugar en la cola; repasar no cambia el progreso.
  let review = -1, reviewPos = -1;

  function reset() {
    teardown(); updateBar();
    root.classList.remove('fb-open', 'clip-mode', 'clip-ended', 'clip-fresh');
    body.className = 'lesson-body';
    body.scrollTop = 0;
  }

  // El clip se ve a pantalla completa, como en Clips; la barra y los corazones vuelven en los ejercicios.
  function showClip(n, forward) {
    root.classList.add('clip-mode');
    body.classList.add('is-clip');
    body.innerHTML = '';
    // El botón de saltar se ve los primeros segundos y mientras el video está en pausa (CSS);
    // al terminar, la lección sigue sola a lo que venga.
    const advance = () => { btn.classList.remove('pulse'); forward(); };
    root.classList.add('clip-fresh');
    clipTimer = setTimeout(() => root.classList.remove('clip-fresh'), 2500);
    player = makePlayer(body, l, c, { clip: clips[n], onEnd: () => {
      root.classList.add('clip-ended'); btn.classList.add('pulse');
      clearTimeout(clipTimer); clipTimer = setTimeout(advance, 600);
    } });
    // El botón anuncia lo que sigue: otro video (en repaso, el siguiente video ya visto) o los ejercicios.
    const clipAt = i => (queue[i]?.k === 'clip' ? queue[i] : null);
    const after = review >= 0 ? queue.find((t, i) => i > reviewPos && i < pos && t.k === 'clip') ?? clipAt(pos) : clipAt(pos + 1);
    $('.clip-skip', root).textContent = after ? `Parte ${after.n + 1} →` : review >= 0 && queue[pos]?.k === 'ex' ? 'Al ejercicio →' : 'Ejercicios →';
    $('.clip-part', root).textContent = clips.length > 1 ? `Parte ${n + 1} de ${clips.length}` : '';
    player.play();
    btn.textContent = 'Continuar'; btn.disabled = false;
    btn.onclick = advance;
    $('.clip-skip', root).onclick = advance;
  }

  function showReview(n) {
    review = n;
    reviewPos = queue.findIndex(t => t.k === 'clip' && t.n === n);
    reset();
    showClip(n, next);
  }

  // Siguiente: entre videos repasados, o de vuelta a la tarea actual; en la tarea actual,
  // avanza el video o continúa tras responder. Un ejercicio sin responder no se salta.
  function next() {
    if (finished) return;
    if (review >= 0) {
      const q = queue.findIndex((t, i) => i > reviewPos && i < pos && t.k === 'clip');
      return q >= 0 ? showReview(queue[q].n) : step();
    }
    if (queue[pos].k === 'clip') return $('.clip-skip', root).click();
    if (fb.classList.contains('show')) return $('.btn', fb).click();
    toast('Responde el ejercicio para continuar');
    body.classList.remove('nudge'); void body.offsetWidth; body.classList.add('nudge');
  }

  // Anterior: vuelve a ver el último video que hay en la cola antes de la posición actual.
  function prev() {
    if (finished || fb.classList.contains('show')) return;
    for (let i = (review >= 0 ? reviewPos : pos) - 1; i >= 0; i--) {
      if (queue[i].k === 'clip') return showReview(queue[i].n);
    }
  }

  // Deslizar con el dedo: a la izquierda avanza, a la derecha retrocede.
  let touch = null;
  root.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' || e.target.closest('.seek, .v-q-menu, input, .sim, .play, .feedback')) { touch = null; return; }
    touch = { x: e.clientX, y: e.clientY, t: Date.now() };
  });
  root.addEventListener('pointerup', e => {
    if (!touch) return;
    const dx = e.clientX - touch.x, dy = e.clientY - touch.y, fast = Date.now() - touch.t < 700;
    touch = null;
    if (fast && Math.abs(dx) > 60 && Math.abs(dx) > 1.5 * Math.abs(dy)) dx < 0 ? next() : prev();
  });
  root.addEventListener('pointercancel', () => { touch = null; });

  function step() {
    review = -1;
    reset();
    if (pos >= queue.length) return finish();
    const item = queue[pos];
    if (item.k === 'clip') {
      showClip(item.n, () => { solved++; pos++; step(); });
    } else {
      const ex = l.ex[item.i];
      btn.textContent = 'Comprobar'; btn.disabled = true;
      handle = renderExercise(body, ex, ok => { btn.disabled = !ok; });
      btn.onclick = () => check(ex, item);
    }
  }

  function check(ex, item) {
    const r = handle.check();
    handle.lock(r.ok);
    S.answered++;
    if (r.ok) { S.correct++; solved++; Sfx.ok(); }
    else { mistakes++; loseHeart(); queue.push(item); Sfx.bad(); }
    save(); updateBar();
    fb.className = `feedback show ${r.ok ? 'ok' : 'bad'}`;
    fb.innerHTML = `<div class="fb-in">
      <h4>${r.ok ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : 'Respuesta correcta:'}</h4>
      ${r.ok ? '' : `<div class="fb-sol">${tex(r.solution)}</div>`}
      ${ex.explain ? `<p class="fb-exp">${tex(ex.explain)}</p>` : ''}
      <button class="btn">${r.ok ? 'Continuar' : 'Entendido'}</button></div>`;
    root.classList.add('fb-open');
    $('.btn', fb).onclick = () => {
      fb.classList.remove('show');
      if (S.hearts <= 0) return outOfHearts();
      pos++; step();
    };
  }

  function finish() {
    finished = true;
    const first = !isDone(l), perfect = mistakes === 0;
    const xp = (first ? 10 : 5) + (perfect ? 5 : 0);
    S.done[l.id] = true; addXP(xp);
    const newStreak = markStreak();
    const exN = l.ex.length, acc = Math.round((100 * exN) / (exN + mistakes));
    const secs = Math.round((Date.now() - t0) / 1000);
    bar.style.width = '100%';
    body.className = 'lesson-body';
    body.innerHTML = `<div class="done-screen"><canvas class="confetti"></canvas>
      <img class="mascot" src="brand/mascota.png" alt="Zuka celebrando" width="150" height="155">
      <h2>${perfect ? '¡Lección perfecta!' : '¡Lección completada!'}</h2>
      <p class="muted">${esc(l.title)}</p>
      <div class="done-stats">
        <div class="ds xp"><small>XP</small><b>${ICON.bolt}+${xp}</b></div>
        <div class="ds acc"><small>Precisión</small><b>${acc}%</b></div>
        <div class="ds time"><small>Tiempo</small><b>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</b></div>
      </div>
      ${newStreak ? `<p class="streak-up">${ICON.flame} ¡Racha de ${S.streak} ${S.streak === 1 ? 'día' : 'días'}!</p>` : ''}
    </div>`;
    btn.textContent = 'Continuar'; btn.disabled = false; btn.onclick = close;
    Sfx.win();
    requestAnimationFrame(() => confetti($('.confetti', body)));
  }

  function outOfHearts() {
    finished = true;
    body.className = 'lesson-body';
    body.innerHTML = `<div class="done-screen">
      <div class="trophy sad">${ICON.heartLine}</div>
      <h2>Te quedaste sin vidas</h2>
      <p class="muted">Recuperas una vida cada 20 minutos. Mientras tanto, mira clips para repasar.</p></div>`;
    root.classList.remove('fb-open');
    btn.textContent = 'Salir'; btn.disabled = false; btn.onclick = close;
  }

  function onKey(e) {
    if (e.key === 'Enter') {
      const target = fb.classList.contains('show') ? $('.btn', fb) : !btn.disabled && btn;
      if (target) { e.preventDefault(); target.click(); }
    } else if (/^[1-9]$/.test(e.key) && e.target.tagName !== 'INPUT' && !fb.classList.contains('show')) {
      handle?.key?.(e.key);
    } else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.tagName !== 'INPUT') {
      // En computador, las flechas hacen lo mismo que deslizar.
      e.key === 'ArrowRight' ? next() : prev();
    }
  }
  document.addEventListener('keydown', onKey);
  step();
}

// ---- pestaña Perfil ----
function renderProfile() {
  const all = COURSES.flatMap(lessonsOf), doneN = all.filter(isDone).length;
  const acc = S.answered ? Math.round((100 * S.correct) / S.answered) : 0;
  const saved = Object.keys(S.saved).filter(id => S.saved[id]).map(findLesson).filter(Boolean);
  const installed = isStandalone();
  view.innerHTML = `<div class="profile">
    <div class="brand-row">
      <img class="logo logo-light" src="brand/logo-light.png" alt="Zuka" width="128" height="44">
      <img class="logo logo-dark" src="brand/logo-dark.png" alt="Zuka" width="128" height="44">
    </div>
    <section class="me">
      <div class="avatar">${esc((S.name || 'Z')[0].toUpperCase())}</div>
      <div class="me-body">
        <input class="name-input" value="${esc(S.name)}" placeholder="Tu nombre" maxlength="24" aria-label="Tu nombre">
        <p class="muted">Fundamentos de ingeniería</p>
      </div>
    </section>
    <section class="stats">
      <div class="stat fire">${ICON.flame}<b>${streakNow()}</b><small>Días de racha</small></div>
      <div class="stat gold">${ICON.bolt}<b>${S.xp}</b><small>XP total</small></div>
      <div class="stat brand">${ICON.check}<b>${doneN}/${all.length}</b><small>Lecciones</small></div>
      <div class="stat ok">${ICON.target}<b>${acc}%</b><small>Precisión</small></div>
    </section>
    <section class="card">
      <h3>Meta diaria</h3>
      <p class="muted">${todayXP()} de ${S.goal} XP hoy</p>
      <div class="seg">${[10, 20, 30, 50].map(g => `<button data-goal="${g}" class="${S.goal === g ? 'on' : ''}">${g} XP</button>`).join('')}</div>
    </section>
    <section class="card">
      <h3>Progreso por curso</h3>
      ${COURSES.map(c => {
        const ls = lessonsOf(c), d = ls.filter(isDone).length;
        return `<button class="prog-row" data-course="${c.id}" style="--c:${c.color}">${courseArt(c, 'md')}
          <span class="pr-body"><b>${esc(c.name)}</b><span class="mini-bar"><i style="width:${(d / ls.length) * 100}%"></i></span></span>
          <span class="cr-count">${d}/${ls.length}</span></button>`;
      }).join('')}
    </section>
    ${saved.length ? `<section class="card"><h3>Clips guardados</h3>${saved.map(({ c, l }) =>
      `<button class="saved-row" data-lesson="${l.id}" style="--c:${c.color}">${ICON.bookmark}<span><b>${esc(l.title)}</b><small>${esc(c.name)}</small></span></button>`).join('')}</section>` : ''}
    <section class="card">
      <h3>Apariencia</h3>
      <div class="seg seg-3">${[['light', 'Claro'], ['dark', 'Oscuro'], ['system', 'Sistema']].map(([v, l]) =>
        `<button data-theme-opt="${v}" class="${S.theme === v ? 'on' : ''}">${l}</button>`).join('')}</div>
    </section>
    <section class="card install-card">
      <img src="icons/icon-192.png" alt="" width="56" height="56">
      <div>
        <h3>${installed ? 'Zuka está instalada' : 'Instala Zuka'}</h3>
        <p class="muted">${installed ? 'Ya la estás usando como app.' : installEvt ? 'En tu celular o computador, como una app más.' : installHelp()}</p>
      </div>
      ${!installed && installEvt ? '<button class="btn brand sm" data-install>Instalar</button>' : ''}
    </section>
    <section class="card">
      <h3>Ajustes</h3>
      <button class="toggle-row" data-set="voice"><span>Narración por voz en los clips</span><span class="toggle${S.voice ? ' on' : ''}"></span></button>
      <button class="toggle-row" data-set="sfx"><span>Efectos de sonido</span><span class="toggle${S.sfx ? ' on' : ''}"></span></button>
      <button class="btn ghost danger" data-reset>Reiniciar progreso</button>
    </section>
  </div>`;
  const nameInp = $('.name-input', view);
  nameInp.onchange = () => { S.name = nameInp.value.trim(); save(); renderProfile(); };
  view.querySelectorAll('[data-goal]').forEach(b => b.onclick = () => { S.goal = +b.dataset.goal; save(); renderProfile(); });
  view.querySelectorAll('[data-course]').forEach(b => b.onclick = () => { S.course = b.dataset.course; save(); go('learn'); });
  view.querySelectorAll('[data-lesson]').forEach(b => b.onclick = () => {
    const { c, l } = findLesson(b.dataset.lesson);
    if (isUnlocked(c, l)) startLesson(c, l); else { feedFilter = c.id; go('clips'); }
  });
  view.querySelectorAll('[data-theme-opt]').forEach(b => b.onclick = () => { S.theme = b.dataset.themeOpt; save(); applyTheme(); renderProfile(); });
  $('[data-install]', view)?.addEventListener('click', promptInstall);
  view.querySelectorAll('[data-set]').forEach(b => b.onclick = () => { S[b.dataset.set] = !S[b.dataset.set]; save(); renderProfile(); });
  $('[data-reset]', view).onclick = () => {
    if (!confirm('¿Borrar todo tu progreso, XP y racha?')) return;
    S = DEFAULTS(); save(); applyTheme(); go('learn');
  };
}

// ---- arranque ----
document.querySelectorAll('#tabbar button').forEach(b => {
  b.insertAdjacentHTML('afterbegin', ICON[b.dataset.tab === 'learn' ? 'learn' : b.dataset.tab === 'clips' ? 'clips' : 'user']);
  b.onclick = () => (lessonClose ? lessonClose(b.dataset.tab) : go(b.dataset.tab));
});
// El menú inferior sigue visible durante la clase (como en Clips): la clase ocupa el resto.
const setTabbarHeight = () => document.documentElement.style.setProperty('--tabbar-h', `${$('#tabbar').offsetHeight}px`);
setTabbarHeight();
addEventListener('resize', setTabbarHeight);
document.addEventListener('visibilitychange', () => { if (document.hidden) Narrator.stop(); });
applyTheme();
go('learn');
