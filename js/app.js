// Zuka: estado persistente, navegación por pestañas, ruta de aprendizaje, feed de clips,
// lecciones con vidas/XP/racha y perfil.

const KEY = 'zuka-v1';
const HEART_MS = 20 * 60 * 1000; // una vida cada 20 minutos
const DEFAULTS = () => ({
  name: '', xp: 0, done: {}, exams: {}, watched: {}, likes: {}, saved: {}, course: 'algebra',
  streak: 0, maxStreak: 0, days: {}, lastDay: null, hearts: 5, heartsAt: Date.now(), today: { day: null, xp: 0 },
  goal: 30, correct: 0, answered: 0, voice: false, sfx: true, theme: 'system', hideInstall: false, videoQuality: 'auto', videoMuted: false, videoSpeed: 1,
  // Modo revisión: todas las lecciones abiertas y sin perder vidas, para revisar el contenido mientras
  // se construye. Se apaga en Perfil → Ajustes (o aquí, con false, antes de abrirla a estudiantes).
  unlockAll: true,
  tourDone: false,   // recorrido guiado de bienvenida (js/tour.js): ya visto o saltado
  guides: {}, guideAuto: true,   // guías «Cómo se juega» ya vistas, por juego o tipo de ejercicio (js/guia.js)
  tutorias: [],      // asesorías separadas en la pestaña Tutorías (js/tutorias.js)
  guest: false,      // eligió «Explorar sin cuenta» en la pantalla de entrada (js/cuenta.js)
  cuenta: null,      // última copia de la cuenta y su plan (js/cuenta.js), para abrir sin conexión
  secs: {},          // segundos vistos del video de cada lección
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
  // Mientras se ve la animación de entrada (data-intro), la barra del celular sigue oscura como la portada.
  $('meta[name="theme-color"]').content = document.documentElement.dataset.intro ? '#07080f' : t === 'dark' ? '#07080f' : '#f4f6fb';
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
  bar.innerHTML = `${brainTile()}<div class="ub-text"><b>Hay una versión nueva de Zuka</b><span>Actualiza para tener lo último.</span></div>
    <div class="ub-actions"><button class="btn small main" data-update type="button">Actualizar</button><button class="btn small" data-later type="button">Más tarde</button></div>`;
  $('[data-update]', bar).onclick = () => { $('[data-update]', bar).textContent = 'Actualizando…'; apply(); };
  $('[data-later]', bar).onclick = () => { bar.remove(); dismiss(); };
  document.body.appendChild(bar);
}

// ---- fechas, XP, racha y vidas ----
const dayStr = d => dayKey(d);   // 'AAAA-MM-DD' local, igual que el calendario de actividad (js/ui.js)
const today = () => dayStr(new Date());
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); };
const streakNow = () => (S.lastDay === today() || S.lastDay === yesterday() ? S.streak : 0);
const todayXP = () => (S.today.day === today() ? S.today.xp : 0);

function addXP(n) {
  if (S.today.day !== today()) S.today = { day: today(), xp: 0 };
  S.today.xp += n; S.xp += n;
  // XP de cada día, para el calendario de actividad (hoja de racha). Se guardan los 400 días más recientes.
  const days = S.days || (S.days = {});
  days[today()] = (days[today()] || 0) + n;
  const keys = Object.keys(days);
  if (keys.length > 400) keys.sort().slice(0, keys.length - 400).forEach(k => delete days[k]);
  save();
}
function markStreak() {
  if (S.lastDay === today()) return false;
  // La mejor racha anterior se guarda antes de reiniciarla (quien ya usaba la app llega con maxStreak en 0).
  S.maxStreak = Math.max(S.maxStreak || 0, S.streak || 0);
  S.streak = S.lastDay === yesterday() ? S.streak + 1 : 1;
  S.maxStreak = Math.max(S.maxStreak || 0, S.streak);
  S.lastDay = today(); save();
  return true;
}
function syncHearts() {
  if (S.hearts >= 5) { S.heartsAt = Date.now(); return; }
  const n = Math.floor((Date.now() - S.heartsAt) / HEART_MS);
  if (n > 0) { S.hearts = Math.min(5, S.hearts + n); S.heartsAt += n * HEART_MS; save(); }
}
function loseHeart() {
  if (S.unlockAll) return;   // en modo revisión no se pierden vidas
  if (S.hearts >= 5) S.heartsAt = Date.now();
  S.hearts = Math.max(0, S.hearts - 1); save();
}
const minsToHeart = () => Math.max(1, Math.ceil((S.heartsAt + HEART_MS - Date.now()) / 60000));

// ---- cursos ----
// Solo entre los cursos que esta cuenta puede ver (js/cuenta.js): los estudiantes, los habilitados.
const courseById = id => cursosVisibles().find(c => c.id === id) || cursosVisibles()[0];
const lessonsOf = c => c.units.flatMap(u => u.lessons);
const isDone = l => !!S.done[l.id];
// Componentes (c.blocks, curso Preuniversitario UdeA): cada uno se abre por su cuenta, así que la primera lección
// de cada componente está abierta aunque el anterior no se haya terminado.
const blockStart = (c, l) => !!c.blocks && c.units.some((u, i) => u.lessons[0] === l && u.block && (i === 0 || c.units[i - 1].block !== u.block));
function isUnlocked(c, l) {
  if (S.unlockAll) return true;   // modo revisión: todo abierto
  const ls = lessonsOf(c), i = ls.indexOf(l);
  return i <= 0 || blockStart(c, l) || isDone(l) || isDone(ls[i - 1]);
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
  ({ learn: renderLearn, clips: renderClips, tutorias: renderTutorias, profile: renderProfile })[t]();
}

// Números largos de la barra de arriba: 12450 → «12.4 k», para que quepa el nombre del curso.
const shortNum = n => (n >= 10000 ? `${Math.floor(n / 100) / 10} k` : String(n));
function renderTop() {
  syncHearts();
  const c = courseById(S.course);
  $('#topbar').innerHTML = `
    <button class="tb-course" style="--c:${c.color}" aria-label="Cambiar de curso">
      ${courseArt(c, 'sm')}<span class="tb-name">${esc(c.name)}</span>${ICON.down}</button>
    <div class="tb-stats">
      <button class="tb-stat streak${S.lastDay === today() ? ' lit' : ''}" data-streak aria-label="Racha: ${streakNow()} ${streakNow() === 1 ? 'día' : 'días'}. Ver tu actividad">${ICON.flame}<b>${streakNow()}</b></button>
      <span class="tb-stat xp" title="Experiencia: ${S.xp} XP">${ICON.bolt}<b>${shortNum(S.xp)}</b></span>
      <button class="tb-stat hearts" title="Vidas">${ICON.heart}<b>${S.hearts}</b></button>
    </div>`;
  $('.tb-course').onclick = openCoursePicker;
  $('#topbar [data-streak]').onclick = openStreakSheet;
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
  openSheet(`<h3 class="sheet-title">Elige un curso</h3><div class="course-list">${cursosVisibles().map(c => {
    const ls = lessonsOf(c), d = ls.filter(isDone).length;
    return `<button class="course-row${c.id === S.course ? ' on' : ''}" data-id="${c.id}" style="--c:${c.color}">
      ${courseArt(c, 'lg')}
      <span class="cr-body"><span class="eyebrow">${cursoBorrador(c) ? 'Borrador · ' : ''}${esc(c.level)} · ${ls.length} lecciones</span><b>${esc(c.name)}</b>
      <span class="mini-bar"><i style="width:${(d / ls.length) * 100}%"></i></span></span>
      ${d === ls.length ? `<span class="cr-done">${ICON.check}</span>` : ''}</button>`;
  }).join('')}</div>`, sh => sh.querySelectorAll('.course-row').forEach(b => b.onclick = () => {
    S.course = b.dataset.id; openWorld = null; openBlock = null; save(); closeSheet(); go('learn'); view.scrollTop = 0;
  }));
}

// Hoja de racha = actividad: el mes en una cuadrícula con los días con actividad (S.days y la racha viva),
// flechas para ver meses anteriores y tres fichas (racha, XP de hoy, racha máxima).
function openStreakSheet() {
  const n = streakNow(), lit = S.lastDay === today(), now = new Date();
  const active = new Set([...Object.keys(S.days || {}), ...streakDays(S.lastDay, n, now)]);
  let off = 0;   // meses hacia atrás: 0 es el actual, −11 el más viejo que se muestra
  const cal = () => {
    const d = new Date(now.getFullYear(), now.getMonth() + off, 1);
    return `<div class="act-nav">
        <button class="icon-btn" data-month="-1" aria-label="Mes anterior"${off > -11 ? '' : ' disabled'}>${ICON.back}</button>
        <b>${d.toLocaleDateString('es', { month: 'long', year: 'numeric' })}</b>
        <button class="icon-btn" data-month="1" aria-label="Mes siguiente"${off ? '' : ' disabled'}>${ICON.right}</button></div>
      <ol class="act-grid" aria-label="Días con actividad">${[...'LMXJVSD'].map(l => `<li class="act-dow" aria-hidden="true">${l}</li>`).join('')}${
        monthGrid(d.getFullYear(), d.getMonth(), active, now).map(c =>
          `<li class="${c.out ? 'out' : ''}${c.lit ? ' lit' : ''}${c.today ? ' today' : ''}"${c.lit ? ` aria-label="${c.d}, con actividad"` : c.today ? ` aria-label="${c.d}, hoy"` : ''}><span>${c.d}</span></li>`).join('')}</ol>`;
  };
  openSheet(`<div class="act-sheet">
    <h3 class="sheet-title">Actividad</h3>
    <p class="muted">${lit ? '¡Hoy ya sumaste! Vuelve mañana para seguir tu racha.' : n ? 'Completa una lección hoy para no perder tu racha.' : 'Completa una lección para empezar tu racha.'}</p>
    <div class="act-cal">${cal()}</div>
    <div class="act-tiles">
      <p class="fire${lit ? ' lit' : ''}">${ICON.flame}<b>${n}</b><span>${n === 1 ? 'Día de racha' : 'Días de racha'}</span></p>
      <p class="gold">${ICON.bolt}<b>${todayXP()}</b><span>XP hoy</span></p>
      <p class="brand">${ICON.trophy}<b>${Math.max(S.maxStreak || 0, n)}</b><span>Racha máxima</span></p>
    </div>
  </div>`, sh => {
    const box = $('.act-cal', sh);
    box.onclick = e => {
      const b = e.target.closest('[data-month]');
      if (!b || b.disabled) return;
      off = Math.max(-11, Math.min(0, off + +b.dataset.month));
      box.innerHTML = cal();
      ($(`[data-month="${b.dataset.month}"]:not(:disabled)`, box) || $('[data-month]:not(:disabled)', box))?.focus();   // en el tope, a la otra flecha
    };
  });
}

function openLessonSheet(c, l) {
  if (planMotivo(l.id)) return openBloqueo(l.id);   // candado por plan (js/cuenta.js)
  const locked = !isUnlocked(c, l);
  clipsOf(l).forEach(k => k.bunny && cuentaVideoBase(k.bunny).catch(() => {}));   // adelanta el enlace del video
  openSheet(`<div class="ls" style="--c:${c.color}">
    <p class="eyebrow">${esc(c.name)}</p><h3>${esc(l.title)}</h3>
    <p class="ls-meta"><span>${ICON.clips} ${clipSecs(l) >= 90 ? `Video de ${Math.round(clipSecs(l) / 60)} min` : `Clip de ${clipSecs(l)} s`}</span><span>${ICON.target} ${l.ex.length} ejercicios</span></p>
    ${locked
      ? '<p class="muted">Completa la lección anterior para desbloquear esta.</p><button class="btn" disabled>Bloqueada</button>'
      : `<button class="btn" data-go>${isDone(l) ? 'Repasar · +5 XP' : 'Empezar · +10 XP'}</button>`}
  </div>`, sh => sh.querySelector('[data-go]')?.addEventListener('click', () => { closeSheet(); startLesson(c, l); }));
}

// Jefe final de un mundo (unit.boss): una batalla que usa todo lo del mundo. Se abre al terminar sus lecciones.
const bossUnlocked = u => S.unlockAll || u.lessons.every(isDone);
function openBossSheet(c, u) {
  if (planMotivo(u.boss.id)) return openBloqueo(u.boss.id);
  const b = u.boss, open = bossUnlocked(u);
  openSheet(`<div class="ls" style="--c:${c.color}">
    <p class="eyebrow">Jefe final · ${esc((WORLDS[u.world] || {}).name || u.title)}</p><h3>${esc(b.title)}</h3>
    <p class="ls-meta"><span>${ICON.crown} Batalla por turnos</span><span>${ICON.clock} Sin reloj: se gana pensando</span></p>
    ${open
      ? `<button class="btn" data-go>${isDone(b) ? 'Volver a pelear · +5 XP' : 'Pelear · +10 XP'}</button>`
      : '<p class="muted">Completa las lecciones de este mundo para enfrentar al jefe.</p><button class="btn" disabled>Bloqueado</button>'}
  </div>`, sh => sh.querySelector('[data-go]')?.addEventListener('click', () => { closeSheet(); startLesson(c, b); }));
}

// ---- pestaña Aprender ----
const OFFSETS = [0, 52, 78, 52, 0, -52, -78, -52];
const PATH_STEP = 196;   // alto de cada fila de nivel (igual a .node-wrap en styles.css)
const W_OFFSETS = [0, 62, 0, -62];   // zigzag del camino de mundos
const WORLD_STEP = 236;  // alto de cada fila de mundo (igual a .wnode-wrap; el botón mide 128 px)
let openWorld = null;    // { course, i }: mundo abierto en la pestaña Aprender (null = mapa de mundos)
// Cursos con componentes (c.blocks, Preuniversitario UdeA): al entrar se elige primero el componente y luego se ven solo
// sus mundos. openBlock = { course, id } es el componente abierto; null = la pantalla para elegirlo.
let openBlock = null;
// Número del mundo para mostrar: dentro de su componente (el primer mundo de Lectura es el 1); sin componentes, el de siempre.
const worldNo = (c, ui) => (c.blocks ? c.units.slice(0, ui + 1).filter(u => u.block === c.units[ui].block).length : ui + 1);
function worldInfo(c, u) {
  const wDone = u.lessons.filter(isDone).length;
  return { w: WORLDS[u.world] || { name: u.title, art: '' }, wDone, all: wDone === u.lessons.length,
    closed: u.lessons.every(l => !isUnlocked(c, l)) };
}
// Lección que toca: la primera sin terminar. En un curso con componentes, la del componente que se estudió por
// última vez (S.lastLesson), para que quien va por Lectura no vea «Sigue aquí» en Razonamiento.
const blockOf = (c, l) => c.units.find(u => u.lessons.includes(l))?.block;
function currentLesson(c, block) {
  const ls = lessonsOf(c);
  if (block) return ls.find(l => !isDone(l) && blockOf(c, l) === block);   // la que toca dentro de un componente
  if (c.blocks) {
    const last = ls.find(l => l.id === S.lastLesson), b = last && blockOf(c, last);
    const inBlock = b && ls.find(l => !isDone(l) && blockOf(c, l) === b);
    if (inBlock) return inBlock;
  }
  return ls.find(l => !isDone(l));
}
// Pantalla de entrada de un curso con componentes: la portada del curso y una tarjeta por componente, con sus mundos,
// sus lecciones, el avance y la lección que sigue. Tocar una tarjeta abre los mundos de ese componente.
function renderComponents(c) {
  const ls = lessonsOf(c), doneN = ls.filter(isDone).length, goalP = Math.min(1, todayXP() / S.goal);
  const lastL = ls.find(l => l.id === S.lastLesson), last = lastL && blockOf(c, lastL);
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
    <h2 class="comp-title">Elige un componente</h2>
    <div class="comp-list">${c.blocks.map((b, k) => {
      const bl = ls.filter(l => blockOf(c, l) === b.id), d = bl.filter(isDone).length, nw = c.units.filter(u => u.block === b.id).length;
      const nxt = currentLesson(c, b.id), here = b.id === last;
      return `<button class="comp-card${here ? ' here' : ''}" data-block="${b.id}" type="button"
        aria-label="Componente ${k + 1}: ${esc(b.name)}. ${nw} mundos, ${d} de ${bl.length} lecciones${here ? ', aquí ibas' : ''}">
        <span class="comp-n" aria-hidden="true">${k + 1}</span>
        <span class="comp-body"><small>Componente ${k + 1}${here ? ' · aquí ibas' : ''}</small><b>${esc(b.name)}</b><span class="comp-desc">${esc(b.desc)}</span>
          <span class="comp-stats">${nw} mundos · ${bl.length} lecciones</span>
          <span class="comp-prog"><span class="mini-bar"><i style="width:${(d / bl.length) * 100}%"></i></span><small>${d}/${bl.length}</small></span>
          <span class="comp-next">${nxt ? `${d ? 'Sigue' : 'Empieza'}: ${esc(nxt.title)}` : 'Componente completado'}</span></span>
        <span class="comp-go" aria-hidden="true">${ICON.right}</span></button>`;
    }).join('')}</div>
    ${doneN === ls.length ? `<div class="course-done">${ICON.star}<div><b>¡Curso completado!</b><p>Repasa cualquier lección o prueba otro curso.</p></div></div>` : ''}
  </div>`;
  view.querySelectorAll('[data-block]').forEach(b => b.onclick = () => {
    openBlock = { course: c.id, id: b.dataset.block }; renderLearn(); $('[data-back]', view)?.focus({ preventScroll: true });
  });
  view.scrollTop = 0;
}
function renderLearn() {
  const c = courseById(S.course);
  if (openWorld?.course === c.id && c.units[openWorld.i]) return renderWorld(c, openWorld.i);
  openWorld = null;
  if (c.blocks && openBlock?.course !== c.id) return renderComponents(c);
  // Con componentes, todo lo de esta vista (avance, «Sigue aquí», mapa) es solo del componente abierto.
  const block = c.blocks ? c.blocks.find(b => b.id === openBlock.id) || c.blocks[0] : null, bn = block ? c.blocks.indexOf(block) + 1 : 0;
  const ls = block ? lessonsOf(c).filter(l => blockOf(c, l) === block.id) : lessonsOf(c), doneN = ls.filter(isDone).length;
  const idx = c.units.map((u, i) => (!block || u.block === block.id ? i : -1)).filter(i => i >= 0);
  const cur = block ? currentLesson(c, block.id) : currentLesson(c), goalP = Math.min(1, todayXP() / S.goal);
  view.innerHTML = `<div class="learn" style="--c:${c.color}">
    ${block ? `<button class="world-back" data-back>${ICON.back}<span>Componentes</span></button>` : ''}
    <section class="hero">
      <div class="hero-body"><p class="eyebrow">${block ? `Componente ${bn} · ${esc(c.name)}` : esc(c.level)}</p><h1>${esc(block ? block.name : c.name)}</h1><p class="sub">${esc(block ? block.desc : c.tagline)}</p>
        <div class="hero-prog"><span class="mini-bar"><i style="width:${(doneN / ls.length) * 100}%"></i></span><small>${doneN}/${ls.length}</small></div></div>
      ${courseArt(c, 'xl')}
    </section>
    ${cur ? (() => {
      // «Sigue aquí»: la lección que toca y la que viene, con un botón que la abre de un toque.
      const ui = c.units.findIndex(u => u.lessons.includes(cur)), li = c.units[ui].lessons.indexOf(cur), n1 = ls[ls.indexOf(cur) + 1], nxt = n1 && blockOf(c, n1) === blockOf(c, cur) ? n1 : null;
      return `<section class="next-card" aria-label="Sigue aquí">
      <p class="eyebrow">Sigue aquí · ${esc((WORLDS[c.units[ui].world] || {}).name || c.units[ui].title)}</p>
      <p class="nc-row cur"><span class="nc-dot">${ICON.play}</span><span><small>Nivel ${worldNo(c, ui)}-${li + 1}</small><b>${esc(cur.title)}</b></span></p>
      ${nxt ? `<p class="nc-row"><span class="nc-dot"></span><span>${esc(nxt.title)}</span></p>` : ''}
      <button class="btn" data-continue>${doneN ? 'Continuar' : 'Empezar'} · +10 XP</button>
    </section>`;
    })() : ''}
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
    <div class="world-map" role="list">
      <svg class="trail" width="1" height="1" overflow="visible" aria-hidden="true"><path d="${worldTrail(idx.map((_, k) => W_OFFSETS[k % W_OFFSETS.length]), WORLD_STEP, 64)}"/></svg>
      ${idx.map((ui, k) => {
        const u = c.units[ui], { w, wDone, all, closed } = worldInfo(c, u), here = !!cur && u.lessons.includes(cur);
        return `<div class="wnode-wrap${closed ? ' closed' : ''}${all ? ' complete' : ''}" role="listitem" style="--x:${W_OFFSETS[k % W_OFFSETS.length]}px">
          ${here ? '<span class="start-bubble" aria-hidden="true">AQUÍ VAS</span>' : ''}
          <button class="wnode${here ? ' current' : ''}" data-world="${ui}" style="--p:${wDone / u.lessons.length}"
            aria-label="Mundo ${worldNo(c, ui)}: ${esc(w.name)}, ${wDone} de ${u.lessons.length} niveles${here ? ', aquí vas' : ''}">
            <span class="wnode-art">${w.art}</span>
            ${all ? `<span class="wnode-badge">${ICON.star}</span>` : closed ? `<span class="wnode-badge">${ICON.lock}</span>` : ''}
          </button>
          <span class="wnode-label" aria-hidden="true"><small>Mundo ${worldNo(c, ui)} · ${wDone}/${u.lessons.length}</small>${esc(w.name)}</span></div>`;
      }).join('')}
    </div>
    ${cur ? '' : block ? `<div class="course-done">${ICON.star}<div><b>¡Componente completado!</b><p>Repasa cualquier lección o vuelve a los componentes.</p></div></div>`
      : `<div class="course-done">${ICON.star}<div><b>¡Curso completado!</b><p>Repasa cualquier lección o prueba otro curso.</p></div></div>`}
  </div>`;
  view.querySelectorAll('.wnode').forEach(b => b.onclick = () => {
    openWorld = { course: c.id, i: +b.dataset.world }; renderLearn(); $('[data-back]', view).focus({ preventScroll: true });
  });
  $('[data-continue]', view)?.addEventListener('click', () => startLesson(c, cur));
  $('[data-back]', view)?.addEventListener('click', () => {
    openBlock = null; renderLearn();
    const card = view.querySelector(`[data-block="${block.id}"]`);
    card?.scrollIntoView({ block: 'center' }); card?.focus({ preventScroll: true });
  });
  $('[data-install]', view)?.addEventListener('click', promptInstall);
  $('[data-hide-install]', view)?.addEventListener('click', () => { S.hideInstall = true; save(); renderLearn(); });
  view.scrollTop = 0;   // arriba queda «Sigue aquí»; el mapa de mundos está debajo
}

// Vista de un mundo: su tarjeta y el camino de sus niveles (lecciones).
function renderWorld(c, ui) {
  const u = c.units[ui], cur = currentLesson(c, u.block);   // la que toca en el componente de este mundo
  const { w, wDone, all, closed } = worldInfo(c, u);
  // El jefe final y la evaluación del mundo (si tiene) son nodos más al final del camino; no cuentan como lecciones.
  const xs = [...u.lessons, ...(u.boss ? [u.boss] : []), ...(u.exam ? [u.exam] : [])].map((_, i) => OFFSETS[i % OFFSETS.length]);
  view.innerHTML = `<div class="learn" style="--c:${c.color}">
    <button class="world-back" data-back>${ICON.back}<span>Mundos</span></button>
    <section class="world${closed ? ' closed' : ''}${all ? ' complete' : ''}">
      <header class="world-card">
        <div class="world-art">${w.art}
          <span class="world-tag">Mundo ${worldNo(c, ui)}</span>
          <span class="world-prog" aria-label="${wDone} de ${u.lessons.length} completadas">${all ? ICON.star : closed ? ICON.lock : ''}${wDone}/${u.lessons.length}</span></div>
        <div class="world-body"><h2>${esc(w.name)}</h2><p>${esc(u.title)}</p>
          <p class="world-stats"><span>${ICON.clips} ${u.lessons.length} lecciones</span><span>${ICON.target} ${u.lessons.reduce((t, l) => t + l.ex.length, 0)} ejercicios</span></p></div>
      </header>
      <div class="path">
        <svg class="trail" width="1" height="1" overflow="visible" aria-hidden="true"><path d="${worldTrail(xs, PATH_STEP)}"/></svg>
        ${u.lessons.map((l, li) => {
        // 'open': desbloqueada pero no es la siguiente (en modo revisión, todas las demás).
        const st = planMotivo(l.id) ? 'locked plan' : isDone(l) ? 'done' : l === cur ? 'current' : isUnlocked(c, l) ? 'open' : 'locked';
        const icon = st === 'done' ? ICON.check : st.startsWith('locked') ? ICON.lock : `<b class="node-n">${li + 1}</b>`;
        return `<div class="node-wrap" style="--x:${xs[li]}px">
          ${st === 'current' ? '<span class="start-bubble">EMPIEZA</span>' : ''}
          <button class="node ${st}" data-id="${l.id}" aria-label="Nivel ${worldNo(c, ui)}-${li + 1}: ${esc(l.title)}">${icon}</button>
          <span class="node-label"><small>Nivel ${worldNo(c, ui)}-${li + 1}</small>${esc(l.title)}</span></div>`;
      }).join('')}
        ${u.boss ? (() => {
          const st = planMotivo(u.boss.id) ? 'locked' : isDone(u.boss) ? 'done' : bossUnlocked(u) ? 'open' : 'locked';
          return `<div class="node-wrap" style="--x:${xs[u.lessons.length]}px">
          ${st === 'open' && u.lessons.every(isDone) ? '<span class="start-bubble">JEFE FINAL</span>' : ''}
          <button class="node boss ${st}" data-boss aria-label="Jefe final del mundo ${worldNo(c, ui)}: ${esc(u.boss.title)}">${st === 'locked' ? ICON.lock : ICON.crown}</button>
          <span class="node-label"><small>Jefe final</small>${esc(u.boss.title)}</span></div>`;
        })() : ''}
        ${u.exam ? (() => {
          const best = S.exams[u.exam.id]?.best, st = planMotivo(u.exam.id) ? 'locked' : best != null ? 'done' : examUnlocked(u) ? 'open' : 'locked';
          return `<div class="node-wrap" style="--x:${xs[xs.length - 1]}px">
          ${st === 'open' && u.lessons.every(isDone) ? '<span class="start-bubble">EVALÚATE</span>' : ''}
          <button class="node exam ${st}" data-exam aria-label="Evaluación del mundo ${worldNo(c, ui)}${best != null ? `, mejor resultado ${best}%` : ''}">${st === 'locked' ? ICON.lock : ICON.trophy}</button>
          <span class="node-label"><small>Evaluación · ${u.exam.minutes} min</small>${best != null ? `Mejor resultado: ${best}%` : 'Pon a prueba el mundo'}</span></div>`;
        })() : ''}</div></section>
    ${summaryOf(u) && planMotivo(`resumen-${u.world}`) ? `<button class="world-summary locked" data-summary-lock type="button">
      <span class="ws-icon">${ICON.lock}</span><span class="ws-text"><b>Resumen del mundo</b><small>PDF con la teoría, gráficas y un taller de 10 ejercicios · plan ${NIVEL_NOMBRE[nivelDe(`resumen-${u.world}`)]}</small></span></button>`
    : summaryOf(u) ? `<a class="world-summary" href="${summaryOf(u)}" download="Zuka - ${esc(w.name)} (resumen).pdf" target="_blank" rel="noopener">
      <span class="ws-icon">${ICON.doc}</span><span class="ws-text"><b>Resumen del mundo</b><small>PDF con la teoría, gráficas y un taller de 10 ejercicios · se descarga con conexión</small></span>${ICON.download}</a>` : ''}
    ${ui + 1 < c.units.length && c.units[ui + 1].block === u.block ? `<button class="world-next" data-next>Siguiente: Mundo ${worldNo(c, ui + 1)} · ${esc((WORLDS[c.units[ui + 1].world] || c.units[ui + 1]).name || c.units[ui + 1].title)} ${ICON.right}</button>` : ''}
  </div>`;
  view.querySelectorAll('.node[data-id]').forEach(b => b.onclick = () => openLessonSheet(c, findLesson(b.dataset.id).l));
  $('[data-exam]', view)?.addEventListener('click', () => (planMotivo(u.exam.id) ? openBloqueo(u.exam.id) : openExamSheet(c, u)));
  $('[data-summary-lock]', view)?.addEventListener('click', () => openBloqueo(`resumen-${u.world}`));
  $('[data-boss]', view)?.addEventListener('click', () => openBossSheet(c, u));
  $('[data-back]', view).onclick = () => {
    openWorld = null; renderLearn();
    const wb = view.querySelector(`.wnode[data-world="${ui}"]`);
    wb?.scrollIntoView({ block: 'center' }); wb?.focus({ preventScroll: true });
  };
  $('[data-next]', view)?.addEventListener('click', () => {
    openWorld = { course: c.id, i: ui + 1 }; renderLearn(); $('[data-back]', view).focus({ preventScroll: true });
  });
  view.scrollTop = 0;   // el mundo empieza arriba, o centrado en su nivel actual
  // Solo se baja hasta el nivel actual si queda fuera de la pantalla: así la tarjeta del mundo no se corta arriba.
  const curNode = view.querySelector('.node.current');
  if (curNode && curNode.getBoundingClientRect().bottom > view.getBoundingClientRect().bottom - 48) curNode.scrollIntoView({ block: 'center' });
}

// ---- pestaña Clips (feed vertical de curiosidades; ver js/curiosidades.js) ----
let feedFilter = 'all', feedStart = null;   // feedStart: id del clip en el que debe abrirse el feed
function likeCount(l) {
  const base = [...l.id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % 4800 + 200;
  const n = base + (S.likes[l.id] ? 1 : 0);
  return n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + ' k' : String(n);
}

function renderClips() {
  const topics = curioTopics();
  if (!topics.some(t => t.id === feedFilter)) feedFilter = 'all';
  const items = curioFeed(feedFilter);
  // Con un solo tema no hay nada que filtrar: sin chips.
  const chips = topics.length > 1 ? `<div class="chips">${[{ id: 'all', name: 'Para ti' }, ...topics].map(c =>
    `<button class="chip${feedFilter === c.id ? ' on' : ''}" data-f="${c.id}">${esc(c.name)}</button>`).join('')}</div>` : '';
  view.innerHTML = `<div class="feed-wrap">${chips}
    <div class="feed">${items.map(({ c, l }) => `<section class="feed-item" data-id="${l.id}">
      <div class="clip-host"></div>
      <div class="feed-cap"><small style="--c:${c.color}">${esc(c.name)}</small><b>${esc(l.title)}</b><span>${esc(l.fact)}</span></div>
      <aside class="rail" style="--c:${c.color}">
        <button class="rail-btn like${S.likes[l.id] ? ' on' : ''}" data-act="like" aria-label="Me gusta">${ICON.heart}<small>${likeCount(l)}</small></button>
        <button class="rail-btn save${S.saved[l.id] ? ' on' : ''}" data-act="save" aria-label="Guardar">${ICON.bookmark}<small>Guardar</small></button>
      </aside></section>`).join('')}</div></div>`;

  const feed = $('.feed', view), players = new Map();
  if (feedStart) { feed.querySelector(`.feed-item[data-id="${feedStart}"]`)?.scrollIntoView(); feedStart = null; }
  const onScreen = new Set();
  // Si el video de un clip no carga (sin conexión, archivo ausente), se cambia por sus escenas animadas.
  function mountClip(host, c, l, clip = l.clip) {
    const p = makePlayer(host, { ...l, clip }, c, { loop: true, feed: true, onEnd: () => watched(l),
      onFail: () => {
        if (!clip.scenes?.length || !(clip.video || clip.bunny) || players.get(l.id) !== p) return;
        p.destroy();
        const q = mountClip(host, c, l, { scenes: clip.scenes }); players.set(l.id, q);
        if (onScreen.has(l.id)) q.play();
      } });
    return p;
  }
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    const id = e.target.dataset.id;
    if (e.isIntersecting) {
      onScreen.add(id);
      if (!players.has(id)) { const { c, l } = findCurio(id); players.set(id, mountClip(e.target.querySelector('.clip-host'), c, l)); }
      players.get(id).play();
    } else { onScreen.delete(id); players.get(id)?.pause(); }
  }), { root: feed, threshold: 0.65 });
  feed.querySelectorAll('.feed-item').forEach(el => io.observe(el));

  view.querySelectorAll('.chip').forEach(b => b.onclick = () => { feedFilter = b.dataset.f; go('clips'); });
  feed.addEventListener('click', e => {
    const b = e.target.closest('.rail-btn');
    if (!b) return;
    const id = b.closest('.feed-item').dataset.id, { l } = findCurio(id);
    const act = b.dataset.act;
    if (act === 'like') {
      S.likes[id] = !S.likes[id]; b.classList.toggle('on', S.likes[id]);
      b.querySelector('small').textContent = likeCount(l); Sfx.tap();
    } else if (act === 'save') {
      S.saved[id] = !S.saved[id]; b.classList.toggle('on', S.saved[id]);
      toast(S.saved[id] ? 'Guardado en tu perfil' : 'Eliminado de guardados');
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
  if (planMotivo(l.id)) return openBloqueo(l.id);   // candado por plan: también si se llega por otro camino
  setGameCourse(c.id);   // los juegos toman la paleta del curso (COURSE_PALETTES, js/games/kit.js)
  S.lastLesson = l.id; save();   // el componente que se estudia (currentLesson)
  syncHearts();
  if (S.hearts <= 0 && !S.unlockAll) return toast(`Sin vidas. Recuperas una en ${minsToHeart()} min.`);
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
      ${S.unlockAll ? `<div class="rev-nav" title="Modo revisión: saltar entre ejercicios">
        <button type="button" data-jump="-1" aria-label="Ejercicio anterior">‹</button><b class="rev-pos"></b><button type="button" data-jump="1" aria-label="Ejercicio siguiente">›</button></div>` : ''}
      <span class="tb-stat hearts">${ICON.heart}<b>${S.hearts}</b></span>
    </div>
    <div class="lesson-body"></div>
    <div class="lesson-foot"><button class="btn main">Comprobar</button></div>
    <div class="feedback" role="status"></div>
    <button class="icon-btn clip-close" data-close aria-label="Salir">${ICON.x}</button>
    <button class="clip-skip" type="button">Ejercicios ↓</button>
    <span class="clip-part"></span>
  </div>`;
  ov.classList.add('open');
  document.body.classList.add('in-lesson');   // sin menú inferior: la lección ocupa toda la pantalla
  const root = $('.lesson', ov), body = $('.lesson-body', ov), btn = $('.btn.main', ov), fb = $('.feedback', ov);
  const bar = $('.pbar i', ov), hearts = $('.lesson-top .hearts b', ov);

  const revPos = $('.rev-pos', ov);
  const updateBar = () => {
    bar.style.width = (solved / total) * 100 + '%'; hearts.textContent = S.hearts;
    if (revPos) revPos.textContent = `${Math.min(pos + 1, queue.length)}/${queue.length}`;
  };
  const teardown = () => { clearTimeout(clipTimer); clipTimer = null; player?.destroy(); player = null; handle?.destroy?.(); handle = null; };

  // `to`: pestaña a la que ir al salir (al tocar el menú inferior); si no, la de origen.
  function close(to) {
    if (!finished && pos > 0) {
      return ask({ title: '¿Salir de la lección?', text: 'Perderás el progreso de esta lección.', ok: 'Salir', cancel: 'Seguir aprendiendo', danger: true })
        .then(yes => { if (yes && lessonClose === close) { finished = true; close(to); } });
    }
    teardown(); Narrator.stop();
    document.removeEventListener('keydown', onKey);
    ov.classList.remove('open'); ov.innerHTML = '';
    document.body.classList.remove('in-lesson');
    lessonClose = null;
    go(typeof to === 'string' ? to : back);
  }
  lessonClose = close;
  ov.querySelectorAll('[data-close]').forEach(b => { b.onclick = () => close(); });

  // `pos` es la tarea actual. `review` es el video que se vuelve a ver al deslizar hacia
  // atrás (−1 si no se está repasando) y `reviewPos` su lugar en la cola; repasar no cambia el progreso.
  let review = -1, reviewPos = -1;
  let enterDir = 1;   // por dónde entra lo siguiente: 1 desde abajo (avanzar), −1 desde arriba (volver)

  function reset() {
    teardown(); updateBar();
    root.classList.remove('fb-open', 'clip-mode', 'clip-ended', 'clip-fresh');
    body.className = 'lesson-body';
    void body.offsetWidth; body.classList.add(enterDir < 0 ? 'enter-down' : 'enter-up'); enterDir = 1;
    body.scrollTop = 0;
    body.style.paddingBottom = '';
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
    $('.clip-skip', root).textContent = after ? `Parte ${after.n + 1} ↓` : review >= 0 && queue[pos]?.k === 'ex' ? 'Al ejercicio ↓' : 'Ejercicios ↓';
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
      if (queue[i].k === 'clip') { enterDir = -1; return showReview(queue[i].n); }
    }
  }

  // Modo revisión: ‹ › saltan al ejercicio (o video) anterior o siguiente sin responder, para revisar
  // el contenido. No cuenta como resuelto ni quita vidas.
  function jump(d) {
    if (finished) return;
    fb.classList.remove('show');
    review = -1;
    pos = Math.max(0, Math.min(queue.length - 1, pos + d));
    step();
  }
  ov.querySelectorAll('[data-jump]').forEach(b => { b.onclick = () => jump(+b.dataset.jump); });

  // Deslizar con el dedo en vertical, como al hacer scroll: el dedo sube y viene lo que sigue; baja y vuelve
  // el video anterior (lessonSwipe, en content.js). Con eventos de toque: el desplazamiento del navegador
  // no los cancela, así que en un ejercicio se sabe si el contenido ya estaba arriba o al final.
  let touch = null;
  const edges = () => ({ atTop: body.scrollTop <= 0, atBottom: body.scrollHeight - body.clientHeight - body.scrollTop <= 2 });
  root.addEventListener('touchstart', e => {
    if (e.touches.length !== 1 || e.target.closest('.seek, .v-q-menu, input, textarea, .sim, .play, .feedback')) { touch = null; return; }
    touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now(), ...edges() };
  }, { passive: true });
  root.addEventListener('touchend', e => {
    if (!touch) return;
    const p = e.changedTouches[0], now = edges(), t0 = touch;
    touch = null;
    const act = lessonSwipe({ dx: p.clientX - t0.x, dy: p.clientY - t0.y, ms: Date.now() - t0.t, clip: root.classList.contains('clip-mode'),
      atTop: t0.atTop && now.atTop, atBottom: t0.atBottom && now.atBottom, answered: fb.classList.contains('show') });
    if (act === 'next') next(); else if (act === 'prev') prev();
  }, { passive: true });
  root.addEventListener('touchcancel', () => { touch = null; }, { passive: true });

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
      <div class="fb-head"><span class="fb-icon">${r.ok ? ICON.check : ICON.x}</span><h4>${r.ok ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : 'Incorrecto'}</h4></div>
      ${r.ok ? '' : `<p class="fb-label">La respuesta correcta es:</p><div class="fb-sol">${tex(window.katex && typeof texify === 'function' ? texify(r.solution) : r.solution)}</div>`}
      ${ex.explain ? `<p class="fb-exp">${tex(ex.explain)}</p>` : ''}
      <button class="btn">${r.ok ? 'Continuar' : 'Entendido'}</button></div>`;
    root.classList.add('fb-open');
    // La retroalimentación tapa la parte de abajo: se deja ese espacio para poder desplazar el
    // ejercicio y verlo completo (en un juego largo, lo que quedó mal puede estar abajo).
    body.style.paddingBottom = `${Math.max(0, fb.offsetHeight - $('.lesson-foot', ov).offsetHeight) + 24}px`;
    $('.btn', fb).onclick = () => {
      fb.classList.remove('show');
      if (S.hearts <= 0 && !S.unlockAll) return outOfHearts();
      pos++; step();
    };
  }

  function finish() {
    finished = true;
    const first = !isDone(l), perfect = mistakes === 0;
    const xp = (first ? 10 : 5) + (perfect ? 5 : 0);
    S.done[l.id] = true; addXP(xp);
    cuentaProgreso(l.id, { completada: true });   // avance en la nube (js/cuenta.js)
    const newStreak = markStreak();
    const exN = l.ex.length, acc = Math.round((100 * exN) / (exN + mistakes));
    const secs = Math.round((Date.now() - t0) / 1000);
    bar.style.width = '100%';
    body.className = 'lesson-body';
    body.innerHTML = `<div class="done-screen"><canvas class="confetti"></canvas>
      <span class="brain-tile done-brain">${brainSVG('lit')}</span>
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
      <p class="muted">Recuperas una vida cada 20 minutos. Mientras tanto, mira clips de curiosidades.</p></div>`;
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
    } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && root.classList.contains('clip-mode')) {
      // Sobre el video, abajo y arriba también: como al hacer scroll.
      e.preventDefault();
      e.key === 'ArrowDown' ? next() : prev();
    }
  }
  document.addEventListener('keydown', onKey);
  step();
}

// ---- pestaña Perfil ----
// Lo que «Reiniciar progreso» no toca.
const RESET_KEEP = ['tourDone', 'tutorias', 'cuenta', 'guest', 'unlockAll', 'theme', 'name', 'goal', 'voice', 'sfx', 'videoQuality', 'videoMuted', 'videoSpeed', 'hideInstall', 'guides'];
let profileSub = null;   // 'settings': pantalla de Ajustes dentro de la pestaña Perfil (null = el perfil)
function renderProfile() {
  if (profileSub === 'settings') return renderSettings();
  const all = cursosVisibles().flatMap(lessonsOf), doneN = all.filter(isDone).length;
  const acc = S.answered ? Math.round((100 * S.correct) / S.answered) : 0;
  const saved = Object.keys(S.saved).filter(id => S.saved[id]).map(id => findCurio(id) || findLesson(id)).filter(x => x && (x.l.fact || cursoVisible(x.c)));   // nada guardado de un curso oculto
  view.innerHTML = `<div class="profile">
    <section class="me">
      <div class="avatar">${esc((S.name || 'Z')[0].toUpperCase())}</div>
      <div class="me-body">
        <input class="name-input" value="${esc(S.name)}" placeholder="Tu nombre" maxlength="24" aria-label="Tu nombre">
        <p class="muted">Fundamentos de ingeniería</p>
      </div>
      <button class="icon-btn prof-gear" data-settings aria-label="Ajustes">${ICON.gear}</button>
    </section>
    ${cuentaCard()}
    <section class="stats">
      <div class="stat fire">${ICON.flame}<b>${streakNow()}</b><small>Días de racha</small></div>
      <div class="stat gold">${ICON.bolt}<b>${S.xp}</b><small>XP total</small></div>
      <div class="stat brand">${ICON.check}<b>${doneN}/${all.length}</b><small>Lecciones</small></div>
      <div class="stat ok">${ICON.target}<b>${acc}%</b><small>Precisión</small></div>
    </section>
    <section class="card">
      <h3>Meta de hoy</h3>
      <p class="muted">${todayXP()} de ${S.goal} XP</p>
      <div class="bar"><i style="width:${Math.min(1, todayXP() / S.goal) * 100}%"></i></div>
    </section>
    <section class="card">
      <h3>Progreso por curso</h3>
      ${cursosVisibles().map(c => {
        const ls = lessonsOf(c), d = ls.filter(isDone).length;
        return `<button class="prog-row" data-course="${c.id}" style="--c:${c.color}">${courseArt(c, 'md')}
          <span class="pr-body"><b>${esc(c.name)}</b><span class="mini-bar"><i style="width:${(d / ls.length) * 100}%"></i></span></span>
          <span class="cr-count">${d}/${ls.length}</span></button>`;
      }).join('')}
    </section>
    ${saved.length ? `<section class="card"><h3>Clips guardados</h3>${saved.map(({ c, l }) =>
      `<button class="saved-row" data-${l.fact ? 'curio' : 'lesson'}="${l.id}" style="--c:${c.color}">${ICON.bookmark}<span><b>${esc(l.title)}</b><small>${esc(c.name)}</small></span></button>`).join('')}</section>` : ''}
  </div>`;
  const nameInp = $('.name-input', view);
  nameInp.onchange = () => { S.name = nameInp.value = nameInp.value.trim(); save(); $('.avatar', view).textContent = (S.name || 'Z')[0].toUpperCase(); };
  cuentaBind(view);
  $('[data-settings]', view).onclick = () => { profileSub = 'settings'; renderProfile(); view.scrollTop = 0; $('[data-back]', view).focus({ preventScroll: true }); };
  view.querySelectorAll('[data-course]').forEach(b => b.onclick = () => { S.course = b.dataset.course; openWorld = null; openBlock = null; save(); go('learn'); });
  view.querySelectorAll('[data-lesson]').forEach(b => b.onclick = () => {
    const { c, l } = findLesson(b.dataset.lesson);
    if (isUnlocked(c, l)) startLesson(c, l); else toast(`Primero completa las lecciones anteriores de ${esc(c.name)}.`);
  });
  view.querySelectorAll('[data-curio]').forEach(b => b.onclick = () => { feedFilter = 'all'; feedStart = b.dataset.curio; go('clips'); });
}

// Ajustes: pantalla propia dentro de Perfil (se entra por el piñón). Filas con icono, en grupos.
function renderSettings() {
  const installed = isStandalone();
  const themes = [['system', 'Según el sistema', 'auto'], ['light', 'Claro', 'sun'], ['dark', 'Oscuro', 'moon']];
  const row = (icon, title, sub, end = '') => `<span class="set-ico">${ICON[icon]}</span><span class="set-body"><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>${end}`;
  const toggle = k => `<span class="toggle${S[k] ? ' on' : ''}"></span>`;
  const conCuenta = typeof Cuenta !== 'undefined' && !!Cuenta.user;   // con sesión, las lecciones hechas viven en la nube y vuelven
  view.innerHTML = `<div class="settings">
    <header class="set-head"><button class="icon-btn" data-back aria-label="Volver al perfil">${ICON.back}</button><h2>Ajustes</h2></header>
    <section class="set-group">
      <h3 class="eyebrow">Aprendizaje</h3>
      <div class="set-row">${row('target', 'Meta diaria', `${todayXP()} de ${S.goal} XP hoy`)}</div>
      <div class="seg" role="group" aria-label="Meta diaria">${[10, 20, 30, 50].map(g => `<button data-goal="${g}" class="${S.goal === g ? 'on' : ''}" aria-pressed="${S.goal === g}">${g} XP</button>`).join('')}</div>
    </section>
    <section class="set-group">
      <h3 class="eyebrow">Sonido</h3>
      <button class="set-row" data-set="voice" role="switch" aria-checked="${!!S.voice}">${row('voice', 'Narración por voz', 'En las lecciones sin video', toggle('voice'))}</button>
      <button class="set-row" data-set="sfx" role="switch" aria-checked="${!!S.sfx}">${row('sound', 'Efectos de sonido', '', toggle('sfx'))}</button>
    </section>
    <section class="set-group">
      <h3 class="eyebrow">Apariencia</h3>
      <div class="set-row">${row('moon', 'Tema', themes.find(t => t[0] === S.theme)?.[1] || 'Según el sistema',
        `<span class="theme-seg" role="group" aria-label="Tema">${themes.map(([v, l, ic]) => `<button data-theme-opt="${v}" aria-label="${l}" aria-pressed="${S.theme === v}">${ICON[ic]}</button>`).join('')}</span>`)}</div>
    </section>
    ${SIN_CANDADOS ? `<section class="set-group">
      <h3 class="eyebrow">Administración</h3>
      <button class="set-row" data-set="unlockAll" role="switch" aria-checked="${!!S.unlockAll}">${row('lock', 'Modo revisión', 'Todas las lecciones abiertas y sin perder vidas', toggle('unlockAll'))}</button>
    </section>` : cuentaEsAdmin() ? `<section class="set-group">
      <h3 class="eyebrow">Administración</h3>
      <div class="set-row">${row('lock', 'Acceso total', 'Cuenta administradora: todos los cursos, mundos y lecciones abiertos, sin perder vidas')}</div>
    </section>` : ''}
    <section class="set-group">
      <h3 class="eyebrow">App</h3>
      ${!installed && installEvt
        ? `<button class="set-row" data-install>${row('download', 'Instalar Zuka', 'En tu celular o computador, como una app más', ICON.right)}</button>`
        : `<div class="set-row">${row('download', installed ? 'Zuka está instalada' : 'Instalar Zuka', installed ? 'Ya la estás usando como app.' : installHelp())}</div>`}
      <button class="set-row" data-tour>${row('play', 'Ver el recorrido otra vez', 'Un paseo corto por la app', ICON.right)}</button>
    </section>
    <section class="set-group">
      <button class="set-row danger" data-reset>${row('trash', 'Reiniciar progreso', conCuenta ? 'Borra tu XP y tu racha en este celular. Las lecciones guardadas en tu cuenta se conservan' : 'Borra tu XP, tu racha y las lecciones completadas')}</button>
    </section>
  </div>`;
  // Tras un cambio se repinta: se conservan el desplazamiento y el foco (mismo control, por su atributo data-).
  const repaint = b => {
    const y = view.scrollTop, k = ['goal', 'themeOpt', 'set'].find(n => n in b.dataset);
    const sel = `[data-${k === 'themeOpt' ? 'theme-opt' : k}="${b.dataset[k]}"]`;
    renderSettings(); view.scrollTop = y; $(sel, view)?.focus({ preventScroll: true });
  };
  $('[data-back]', view).onclick = () => { profileSub = null; renderProfile(); view.scrollTop = 0; $('[data-settings]', view).focus({ preventScroll: true }); };
  view.querySelectorAll('[data-goal]').forEach(b => b.onclick = () => { S.goal = +b.dataset.goal; save(); repaint(b); });
  view.querySelectorAll('[data-theme-opt]').forEach(b => b.onclick = () => { S.theme = b.dataset.themeOpt; save(); applyTheme(); repaint(b); });
  view.querySelectorAll('[data-set]').forEach(b => b.onclick = () => { S[b.dataset.set] = !S[b.dataset.set]; save(); repaint(b); });
  $('[data-install]', view)?.addEventListener('click', promptInstall);
  $('[data-tour]', view).onclick = () => { profileSub = null; startTour(); };
  $('[data-reset]', view).onclick = () => {
    ask({ title: '¿Borrar todo tu progreso?', text: `${conCuenta ? 'Se borran tu XP, tu racha y tu actividad en este celular; las lecciones guardadas en tu cuenta se conservan.' : 'Se borran tu XP, tu racha y las lecciones completadas.'} Tus ajustes y tus asesorías separadas se conservan. No se puede deshacer.`, ok: 'Borrar todo', cancel: 'Cancelar', danger: true })
      .then(yes => {
        if (!yes) return;
        // Se conserva lo que no es progreso: cuenta, asesorías y preferencias (tema, nombre, meta, sonido, video, guías vistas).
        const keep = Object.fromEntries(RESET_KEEP.filter(k => k in S).map(k => [k, S[k]]));
        S = Object.assign(DEFAULTS(), keep); openWorld = null; openBlock = null; profileSub = null; save(); applyTheme(); go('learn');
      });
  };
}

// ---- arranque ----
document.querySelectorAll('#tabbar button').forEach(b => {
  b.insertAdjacentHTML('afterbegin', ICON[{ learn: 'learn', clips: 'clips', tutorias: 'calendar' }[b.dataset.tab] || 'user']);
  b.onclick = () => {
    if (lessonClose) return lessonClose(b.dataset.tab);
    if (tab === 'learn' && b.dataset.tab === 'learn') { if (openWorld) openWorld = null; else openBlock = null; }   // tocar Aprender otra vez: un paso arriba (mundo → mapa → componentes)
    profileSub = null;   // el menú siempre lleva al Perfil, no a Ajustes
    go(b.dataset.tab);
  };
});
// Altura del menú inferior para lo que se acomoda encima de él. Durante una lección el menú se
// esconde (body.in-lesson pone --tabbar-h en 0): no se guarda esa altura 0.
const setTabbarHeight = () => { const h = $('#tabbar').offsetHeight; if (h) document.documentElement.style.setProperty('--tabbar-h', `${h}px`); };
setTabbarHeight();
addEventListener('resize', setTabbarHeight);
document.addEventListener('visibilitychange', () => { if (document.hidden) Narrator.stop(); });
// Quita la portada (#boot de index.html) cuando la app ya está pintada y con su fuente, para que
// aparezca completa de una vez; si la fuente tarda (o no hay conexión), no espera más de 300 ms (abrir rápido pesa más que la fuente).
// La espera se arma antes de pintar: si el arranque fallara, la portada igual se va.
function hideBoot() {
  const b = $('#boot');
  if (!b || b.classList.contains('out')) return;
  b.classList.add('out');
  setTimeout(() => b.remove(), 400);
  // Se acabó la entrada: el documento y la barra del celular vuelven al color del tema.
  if (document.documentElement.dataset.intro) { delete document.documentElement.dataset.intro; applyTheme(); }
}
// Animación de entrada: vive en la portada misma (bloque .intro de index.html, estilos en css/styles.css), así se ve
// desde el primer cuadro, mientras la app carga, sin esperar a este archivo. El script del <head> pone data-intro la
// primera vez de cada sesión (y no con «reducir movimiento»). Aquí solo se espera a que termine antes de quitar la
// portada: INTRO_MS desde que empezó a verse (zukaIntroT0); un toque la salta. Sin data-intro no se espera nada.
const INTRO_MS = 3100;
function introWait() {
  const b = $('#boot');
  if (!document.documentElement.dataset.intro || !b) return Promise.resolve();
  return new Promise(done => {
    const t = setTimeout(done, Math.max(0, INTRO_MS - (performance.now() - (window.zukaIntroT0 ?? performance.now()))));
    b.addEventListener('click', () => { clearTimeout(t); done(); }, { once: true });
  });
}
const fontsReady = document.fonts?.load
  ? Promise.all(['400', '600', '700'].map(w => document.fonts.load(`${w} 1em "Plus Jakarta Sans"`))).catch(() => {})
  : null;
Promise.all([Promise.race([fontsReady, new Promise(r => setTimeout(r, 300))]), introWait()])
  .then(() => requestAnimationFrame(() => requestAnimationFrame(hideBoot)));
applyTheme();
cuentaInit();   // cuenta guardada y modo revisión solo para el administrador (js/cuenta.js), antes de pintar
go(tabFromURL(location.search));   // los atajos del icono instalado abren ?tab=clips, etc. (js/pwa.js)
watchConnection(window, document.body, toast);
if (isStandalone()) keepData(navigator);   // instalada: que el navegador no borre el progreso
setupBack();   // botón «atrás» del celular (js/back.js)
// Primera vez en la app: recorrido guiado (js/tour.js).
// Sin sesión sale primero la pantalla de entrada; el recorrido empieza al cerrarla.
if (!cuentaPideEntrar() && tourShouldStart(S)) startTour();
