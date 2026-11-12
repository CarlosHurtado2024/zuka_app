// Pestaña Tutorías: el estudiante separa una asesoría virtual uno a uno con un tutor.
// Diseño: docs/superpowers/specs/2026-11-12-tutorias.md.
//
// La app no tiene servidor: la reserva se guarda en el celular (S.tutorias). Con `whatsapp` puesto, la
// confirmación ofrece avisar a coordinación con el mensaje ya escrito.
const TUTORIAS = {
  demo: true,      // true: los tutores de abajo son de ejemplo y la pestaña lo avisa. Poner false con tutores reales.
  whatsapp: '',    // WhatsApp de coordinación, solo dígitos con indicativo (p. ej. '573001234567'); vacío = sin aviso
  leadMin: 60,     // anticipación mínima para separar, en minutos
  days: 7,         // cuántos días hacia adelante se ofrecen
  max: 3,          // asesorías pendientes a la vez
};

// `hours`: día de la semana (0 = domingo … 6 = sábado) → horas de inicio, en la hora local del celular.
// `mins`: duración. `link`: sala fija de videollamada del tutor (https://…); sin ella no sale «Entrar».
const TUTORS = [
  { id: 'tut-laura', name: 'Laura Gómez', role: 'Tutora de Álgebra y Trigonometría', courses: ['algebra', 'trig'], color: '#8b7bff', mins: 45,
    bio: 'Empieza por un ejemplo de la vida diaria y solo después escribe la fórmula.',
    hours: { 1: ['16:00', '17:00', '18:00'], 3: ['16:00', '17:00', '18:00'], 5: ['14:00', '15:00'], 6: ['09:00', '10:00'] } },
  { id: 'tut-andres', name: 'Andrés Ríos', role: 'Tutor de Cálculo y Álgebra', courses: ['calc', 'algebra'], color: '#f472b6', mins: 45,
    bio: 'Resuelve contigo, paso a paso, los ejercicios que te tienen trabado.',
    hours: { 2: ['18:00', '19:00', '20:00'], 4: ['18:00', '19:00', '20:00'], 6: ['10:00', '11:00'] } },
  { id: 'tut-camila', name: 'Camila Torres', role: 'Tutora de Geometría y Trigonometría', courses: ['geo', 'trig'], color: '#22d3ee', mins: 30,
    bio: 'Todo lo dibuja: vectores, triángulos y gráficas antes que cuentas.',
    hours: { 1: ['10:00', '11:00'], 2: ['10:00', '11:00'], 4: ['15:00', '16:00'], 5: ['10:00', '11:00'] } },
  { id: 'tut-mateo', name: 'Mateo Vargas', role: 'Tutor de Física y Cálculo', courses: ['fis', 'calc'], color: '#facc15', mins: 45,
    bio: 'Te ayuda a plantear el problema: qué te dan, qué te piden y por dónde empezar.',
    hours: { 1: ['19:00', '20:00'], 3: ['19:00', '20:00'], 5: ['17:00', '18:00'], 0: ['10:00', '11:00'] } },
];

// ---- lógica pura (se prueba en Node; `now` es un número de milisegundos) ----
const TU_DOW = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const TU_MON = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const tuPad = n => String(n).padStart(2, '0');
const tuKey = d => `${d.getFullYear()}-${tuPad(d.getMonth() + 1)}-${tuPad(d.getDate())}`;
function tuDate(date, time = '00:00') {
  const [y, m, d] = date.split('-').map(Number), [h, mi] = time.split(':').map(Number);
  return new Date(y, m - 1, d, h, mi);
}
const tuStart = b => tuDate(b.date, b.time).getTime();
const tuEnd = b => tuStart(b) + (b.mins || 45) * 60000;

// Asesorías que no han terminado, de la más cercana a la más lejana. Lo que venga dañado del
// almacenamiento (no es lista, falta el día o la hora) se descarta en vez de romper la pestaña.
const tuValid = b => !!b && typeof b === 'object' && /^\d{4}-\d\d-\d\d$/.test(b.date) && /^\d\d:\d\d$/.test(b.time);
function activeTutorias(mine, now) {
  return (Array.isArray(mine) ? mine : []).filter(b => tuValid(b) && tuEnd(b) > now).sort((a, b) => tuStart(a) - tuStart(b));
}

// Los próximos días del tutor: [{ date, slots: [{ time, free }] }]. Solo cupos que aún se pueden separar;
// `free` es false si choca con otra asesoría del estudiante.
function tutorDays(tutor, now, mine) {
  const busy = activeTutorias(mine, now), first = new Date(now), out = [];
  for (let i = 0; i < TUTORIAS.days; i++) {
    const d = new Date(first.getFullYear(), first.getMonth(), first.getDate() + i), date = tuKey(d);
    const slots = (tutor.hours[d.getDay()] || []).map(time => {
      const s = { date, time, mins: tutor.mins };
      return { time, start: tuStart(s), free: !busy.some(b => tuStart(b) < tuEnd(s) && tuStart(s) < tuEnd(b)) };
    }).filter(s => s.start - now >= TUTORIAS.leadMin * 60000).map(({ time, free }) => ({ time, free }));
    out.push({ date, slots });
  }
  return out;
}

function nextFree(tutor, now, mine) {
  for (const d of tutorDays(tutor, now, mine)) {
    const s = d.slots.find(x => x.free);
    if (s) return { date: d.date, time: s.time };
  }
  return null;
}

// Separa una asesoría. Errores: 'tutor', 'course', 'slot' (no existe o ya no se alcanza), 'max', 'busy'.
function bookTutoria(mine, req, now, tutors = TUTORS) {
  const list = Array.isArray(mine) ? mine.filter(tuValid) : [], tutor = tutors.find(t => t.id === req.tutor);
  if (!tutor) return { ok: false, error: 'tutor' };
  if (!tutor.courses.includes(req.course)) return { ok: false, error: 'course' };
  const slot = tutorDays(tutor, now, list).find(d => d.date === req.date)?.slots.find(s => s.time === req.time);
  if (!slot) return { ok: false, error: 'slot' };
  if (activeTutorias(list, now).length >= TUTORIAS.max) return { ok: false, error: 'max' };
  if (!slot.free) return { ok: false, error: 'busy' };
  const booking = {
    id: `tu-${now.toString(36)}-${list.length}`, tutor: tutor.id, date: req.date, time: req.time, mins: tutor.mins,
    course: req.course, topic: String(req.topic ?? '').trim().slice(0, 140), made: now,
  };
  return { ok: true, booking, list: [...list, booking] };
}

const cancelTutoria = (mine, id) => (Array.isArray(mine) ? mine : []).filter(b => b && b.id !== id);

// «Hoy», «Mañana» o «lun 16 nov».
function dayLabel(date, now) {
  const d = tuDate(date), t = new Date(now);
  const diff = Math.round((d - new Date(t.getFullYear(), t.getMonth(), t.getDate())) / 86400000);
  return diff === 0 ? 'Hoy' : diff === 1 ? 'Mañana' : `${TU_DOW[d.getDay()]} ${d.getDate()} ${TU_MON[d.getMonth()]}`;
}
// '16:00' → «4:00 p. m.»
function hourLabel(time) {
  const [h, m] = time.split(':').map(Number);
  return `${h % 12 || 12}:${tuPad(m)} ${h < 12 ? 'a. m.' : 'p. m.'}`;
}

const tutorsFor = course => TUTORS.filter(t => course === 'all' || t.courses.includes(course));

// Mensaje para coordinación y su enlace de WhatsApp ('' si no hay número).
function tutoriaText(b, tutor, name, courseName, now) {
  return `Hola, soy ${name || 'estudiante de Zuka'}. Separé una asesoría virtual con ${tutor.name}: `
    + `${dayLabel(b.date, now)} (${b.date}) a las ${hourLabel(b.time)}, ${b.mins} min. Curso: ${courseName}.`
    + (b.topic ? ` Quiero repasar: ${b.topic}.` : '');
}
function tutoriaLink(text, phone = TUTORIAS.whatsapp) {
  const n = String(phone || '').replace(/\D/g, '');
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : '';
}

// ---- interfaz (usa S, view, save, openSheet, ask, toast, esc, ICON y COURSES de la app) ----
let tuFilter = null;   // curso del filtro; null = aún no se ha elegido (arranca en el curso que se estudia)
const tuCourse = id => COURSES.find(c => c.id === id);
const tuInitials = name => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
const TU_ERRORS = {
  slot: 'Ese cupo ya no está disponible. Elige otra hora.',
  busy: 'Ya tienes una asesoría a esa hora.',
  max: `Puedes tener hasta ${TUTORIAS.max} asesorías pendientes. Cancela una para separar otra.`,
};

function renderTutorias() {
  const now = Date.now(), mine = activeTutorias(S.tutorias, now);
  if (!Array.isArray(S.tutorias) || mine.length !== S.tutorias.length) { S.tutorias = mine; save(); }   // las que ya pasaron se van
  const courses = COURSES.filter(c => tutorsFor(c.id).length);
  if (tuFilter === null) tuFilter = tutorsFor(S.course).length ? S.course : 'all';
  const full = mine.length >= TUTORIAS.max;
  view.innerHTML = `<div class="tutorias">
    <header class="tu-head"><h1>Tutorías</h1>
      <p class="muted">Separa una asesoría virtual, uno a uno, con un tutor. Eliges el día, la hora y qué quieres repasar.</p></header>
    ${mine.length ? `<section class="card tu-mine-card"><h2>Tus asesorías</h2>${mine.map(b => {
      const t = TUTORS.find(x => x.id === b.tutor), c = tuCourse(b.course);
      return `<div class="tu-mine" style="--c:${t?.color || 'var(--brand)'}">
        <span class="tu-when"><b>${esc(dayLabel(b.date, now))}</b><small>${hourLabel(b.time)}</small></span>
        <span class="tu-what"><b>${esc(t?.name || 'Tutor')}</b><small>${esc(c?.name || '')}${b.topic ? ` · ${esc(b.topic)}` : ''}</small></span>
        <span class="tu-acts">${/^https:\/\//.test(t?.link || '') ? `<a class="tu-join" href="${esc(t.link)}" target="_blank" rel="noopener">Entrar</a>` : ''}
          <button class="tu-cancel" data-cancel="${esc(b.id)}" aria-label="Cancelar la asesoría con ${esc(t?.name || 'el tutor')}">Cancelar</button></span>
      </div>`;
    }).join('')}</section>` : ''}
    <div class="tu-chips" role="group" aria-label="Filtrar tutores por curso">${[{ id: 'all', name: 'Todos' }, ...courses].map(c =>
      `<button class="tu-chip${tuFilter === c.id ? ' on' : ''}" data-f="${c.id}" aria-pressed="${tuFilter === c.id}">${esc(c.name)}</button>`).join('')}</div>
    <div class="tu-list">${tutorsFor(tuFilter).map(t => {
      const nx = nextFree(t, now, S.tutorias);
      return `<article class="tu-card" style="--c:${t.color}">
        <div class="tu-top"><span class="tu-av" aria-hidden="true">${esc(tuInitials(t.name))}</span>
          <div class="tu-who"><h3>${esc(t.name)}</h3><p class="muted">${esc(t.role)}</p></div></div>
        <p class="tu-bio">${esc(t.bio)}</p>
        <div class="tu-foot">
          <span class="tu-next">${ICON.calendar}<span><small>${nx ? 'Próximo cupo' : 'Esta semana'}</small><b>${nx ? `${esc(dayLabel(nx.date, now))} · ${hourLabel(nx.time)}` : 'Sin cupos'}</b></span></span>
          <button class="btn brand sm" data-book="${t.id}"${nx && !full ? '' : ' disabled'} aria-label="Agendar con ${esc(t.name)}">Agendar</button>
        </div></article>`;
    }).join('')}</div>
    ${full ? `<p class="tu-note">Ya tienes ${TUTORIAS.max} asesorías pendientes. Cancela una para separar otra.</p>` : ''}
    ${TUTORIAS.demo ? '<p class="tu-note">Tutores de ejemplo: por ahora la asesoría se guarda solo en este celular.</p>' : ''}
  </div>`;
  view.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { tuFilter = b.dataset.f; renderTutorias(); });
  view.querySelectorAll('[data-book]').forEach(b => b.onclick = () => openBooking(TUTORS.find(t => t.id === b.dataset.book)));
  view.querySelectorAll('[data-cancel]').forEach(b => b.onclick = () => {
    const bk = S.tutorias.find(x => x.id === b.dataset.cancel);
    if (!bk) return renderTutorias();
    ask({ title: '¿Cancelar esta asesoría?', text: `${dayLabel(bk.date, Date.now())}, ${hourLabel(bk.time)} Puedes separar otra cuando quieras.`, ok: 'Sí, cancelar', cancel: 'Conservarla', danger: true })
      .then(yes => { if (yes) { S.tutorias = cancelTutoria(S.tutorias, bk.id); save(); if (tab === 'tutorias') renderTutorias(); toast('Asesoría cancelada.'); } });
  });
}

// Hoja para separar: día → hora → qué repasar → confirmar. Al confirmar, la misma hoja dice qué quedó.
function openBooking(t) {
  const now = Date.now(), days = tutorDays(t, now, S.tutorias);
  let date = days.find(d => d.slots.some(s => s.free))?.date || null, time = null;
  let course = t.courses.includes(S.course) ? S.course : t.courses[0];
  const head = `<div class="ag-head"><span class="tu-av" aria-hidden="true">${esc(tuInitials(t.name))}</span>
    <div><h3>${esc(t.name)}</h3><p class="muted">Asesoría virtual · ${t.mins} min</p></div></div>`;
  openSheet(`<div class="ag" style="--c:${t.color}">${head}
    <h4 id="ag-l1"><i>1</i>Elige el día</h4>
    <div class="ag-days" role="group" aria-labelledby="ag-l1">${days.map(d => {
      const dt = tuDate(d.date), open = d.slots.some(s => s.free);
      return `<button class="ag-day" data-day="${d.date}"${open ? '' : ' disabled'} aria-label="${esc(dayLabel(d.date, now))}${open ? '' : ', sin cupos'}">
        <small>${TU_DOW[dt.getDay()]}</small><b>${dt.getDate()}</b></button>`;
    }).join('')}</div>
    <h4 id="ag-l2"><i>2</i>Elige la hora <span class="ag-daytxt"></span></h4>
    <div class="ag-slots" role="group" aria-labelledby="ag-l2"></div>
    <h4><i>3</i><label for="ag-topic">¿Qué quieres repasar?</label></h4>
    ${t.courses.length > 1 ? `<div class="ag-courses" role="group" aria-label="Curso">${t.courses.map(id =>
      `<button class="tu-chip" data-course="${id}">${esc(tuCourse(id)?.name || id)}</button>`).join('')}</div>` : ''}
    <textarea id="ag-topic" class="ag-topic" rows="2" maxlength="140" placeholder="Ej.: no entiendo cuándo la regla de tres es inversa (opcional)"></textarea>
    <div class="ag-foot"><p class="ag-sum" role="status"></p>
      <button class="btn brand" data-ok disabled>Separar asesoría</button></div>
  </div>`, sh => {
    const q = s => sh.querySelector(s), qa = s => sh.querySelectorAll(s);
    const paint = () => {
      qa('.ag-day').forEach(b => { const on = b.dataset.day === date; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      qa('[data-course]').forEach(b => { const on = b.dataset.course === course; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      q('.ag-daytxt').textContent = date ? `· ${dayLabel(date, now)}` : '';
      q('.ag-slots').innerHTML = (days.find(d => d.date === date)?.slots || []).map(s =>
        `<button class="ag-slot${s.time === time ? ' on' : ''}" data-time="${s.time}" aria-pressed="${s.time === time}"${s.free ? '' : ' disabled title="Ya tienes una asesoría a esa hora"'}>${hourLabel(s.time)}</button>`).join('');
      qa('.ag-slot').forEach(b => b.onclick = () => { time = b.dataset.time; paint(); });
      q('.ag-sum').textContent = time ? `${dayLabel(date, now)}, ${hourLabel(time)} · ${tuCourse(course)?.name || ''} con ${t.name}` : 'Elige una hora para continuar.';
      q('[data-ok]').disabled = !time;
    };
    qa('.ag-day').forEach(b => b.onclick = () => { date = b.dataset.day; time = null; paint(); });
    qa('[data-course]').forEach(b => b.onclick = () => { course = b.dataset.course; paint(); });
    q('[data-ok]').onclick = () => {
      const r = bookTutoria(S.tutorias, { tutor: t.id, date, time, course, topic: q('.ag-topic').value }, Date.now());
      if (!r.ok) { toast(TU_ERRORS[r.error] || TU_ERRORS.slot); if (r.error !== 'max') { closeSheet(); renderTutorias(); } return; }
      S.tutorias = r.list; save();
      const b = r.booking, n = Date.now();
      const wa = tutoriaLink(tutoriaText(b, t, S.name, tuCourse(b.course)?.name || b.course, n));
      const next = TUTORIAS.demo ? 'Quedó guardada en este celular. Los tutores son de ejemplo: todavía no le avisa a nadie.'
        : wa ? 'Avísale a coordinación por WhatsApp para confirmar tu cupo.'
        : `La encuentras arriba, en «Tus asesorías»${t.link ? ', con el botón para entrar a la videollamada' : ''}.`;
      q('.ag').innerHTML = `<div class="ag-done">${ICON.check}</div>
        <h3 class="ag-done-title" tabindex="-1">¡Asesoría separada!</h3>
        <p class="ag-done-when"><b>${esc(dayLabel(b.date, n))}, ${hourLabel(b.time)}</b><span>${esc(tuCourse(b.course)?.name || '')} con ${esc(t.name)} · ${b.mins} min</span></p>
        <p class="muted ag-done-next">${next}</p>
        ${wa && !TUTORIAS.demo ? `<a class="btn brand" href="${esc(wa)}" target="_blank" rel="noopener">Avisar por WhatsApp</a>` : ''}
        <button class="btn ${wa && !TUTORIAS.demo ? 'ghost' : 'brand'}" data-close>Listo</button>`;
      q('[data-close]').onclick = closeSheet;
      q('.ag-done-title').focus({ preventScroll: true });
      if (tab === 'tutorias') renderTutorias();
    };
    paint();
  });
}
