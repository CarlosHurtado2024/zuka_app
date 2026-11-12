// Pestaña Tutorías: el estudiante separa una asesoría virtual eligiendo la materia, los temas que quiere
// reforzar (las lecciones de esa materia en la app), el día y la hora. No hay nombres de tutores.
// Diseño: docs/superpowers/specs/2026-11-12-tutorias.md.
//
// La app no tiene servidor: la reserva se guarda en el celular (S.tutorias). Con `whatsapp` puesto, la
// confirmación ofrece avisar a coordinación con el mensaje ya escrito.
const TUTORIAS = {
  whatsapp: '',    // WhatsApp de coordinación, solo dígitos con indicativo (p. ej. '573001234567'); vacío = sin aviso
  mins: 45,        // duración de una asesoría
  leadMin: 60,     // anticipación mínima para separar, en minutos
  days: 7,         // cuántos días hacia adelante se ofrecen
  max: 3,          // asesorías pendientes a la vez
  maxTopics: 4,    // temas por asesoría
  // Horario de atención: día de la semana (0 = domingo … 6 = sábado) → horas de inicio, hora local del celular.
  hours: {
    1: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
    2: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
    3: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
    4: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
    5: ['14:00', '15:00', '16:00', '17:00', '18:00'],
    6: ['09:00', '10:00', '11:00'],
  },
};

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
const tuEnd = b => tuStart(b) + (b.mins || TUTORIAS.mins) * 60000;
// Lo que venga dañado del almacenamiento (o del formato viejo, sin temas) se descarta en vez de romper la pestaña.
const tuValid = b => !!b && typeof b === 'object' && /^\d{4}-\d\d-\d\d$/.test(b.date) && /^\d\d:\d\d$/.test(b.time)
  && typeof b.course === 'string' && Array.isArray(b.topics) && typeof b.id === 'string'
  && (b.mins == null || (Number.isFinite(b.mins) && b.mins > 0 && b.mins <= 240));
const tuList = mine => (Array.isArray(mine) ? mine.filter(tuValid) : []);

// Asesorías que no han terminado, de la más cercana a la más lejana.
function activeTutorias(mine, now) {
  return tuList(mine).filter(b => tuEnd(b) > now).sort((a, b) => tuStart(a) - tuStart(b));
}

// Los próximos días: [{ date, slots: [{ time, free }] }]. Solo cupos que aún se pueden separar; `free` es
// false si choca con otra asesoría del estudiante.
function tutoriaDays(now, mine, hours = TUTORIAS.hours) {
  const busy = activeTutorias(mine, now), first = new Date(now), out = [];
  for (let i = 0; i < TUTORIAS.days; i++) {
    const d = new Date(first.getFullYear(), first.getMonth(), first.getDate() + i), date = tuKey(d);
    const slots = (hours[d.getDay()] || []).map(time => {
      const s = { date, time, mins: TUTORIAS.mins };
      return { time, start: tuStart(s), free: !busy.some(b => tuStart(b) < tuEnd(s) && tuStart(s) < tuEnd(b)) };
    }).filter(s => s.start - now >= TUTORIAS.leadMin * 60000).map(({ time, free }) => ({ time, free }));
    out.push({ date, slots });
  }
  return out;
}

function nextFree(now, mine, hours = TUTORIAS.hours) {
  for (const d of tutoriaDays(now, mine, hours)) {
    const s = d.slots.find(x => x.free);
    if (s) return { date: d.date, time: s.time };
  }
  return null;
}

// Qué temas (ids de lección) tiene cada materia: { algebra: ['alg-0a', …], … }.
function tutoriaCatalog(courses) {
  return Object.fromEntries(courses.map(c => [c.id, c.units.flatMap(u => u.lessons.map(l => l.id))]));
}

// Marca o desmarca un tema; el que pasaría del máximo no entra.
function toggleTopic(topics, id) {
  if (topics.includes(id)) return topics.filter(t => t !== id);
  return topics.length >= TUTORIAS.maxTopics ? topics : [...topics, id];
}

// Separa una asesoría. `req`: { course, topics: [ids de lección], date, time, note }.
// Errores: 'course', 'topics', 'slot' (no existe o ya no se alcanza), 'max', 'busy'.
function bookTutoria(mine, req, now, catalog, hours = TUTORIAS.hours) {
  const list = tuList(mine), lessons = catalog[req.course];
  if (!lessons) return { ok: false, error: 'course' };
  const topics = [...new Set(Array.isArray(req.topics) ? req.topics : [])];
  if (!topics.length || topics.length > TUTORIAS.maxTopics || !topics.every(t => lessons.includes(t))) return { ok: false, error: 'topics' };
  const slot = tutoriaDays(now, list, hours).find(d => d.date === req.date)?.slots.find(s => s.time === req.time);
  if (!slot) return { ok: false, error: 'slot' };
  if (activeTutorias(list, now).length >= TUTORIAS.max) return { ok: false, error: 'max' };
  if (!slot.free) return { ok: false, error: 'busy' };
  const booking = {
    id: `tu-${now.toString(36)}-${list.length}`, course: req.course, topics, date: req.date, time: req.time, mins: TUTORIAS.mins,
    note: String(req.note ?? '').trim().slice(0, 140), made: now,
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

// Mensaje para coordinación y su enlace de WhatsApp ('' si no hay número).
function tutoriaText(b, name, courseName, topicTitles, now) {
  return `Hola, soy ${name || 'estudiante de Zuka'}. Quiero una asesoría virtual de ${courseName}: `
    + `${dayLabel(b.date, now)} (${b.date}) a las ${hourLabel(b.time)}, ${b.mins} min. Temas: ${topicTitles.join('; ')}.`
    + (b.note ? ` Nota: ${b.note}.` : '');
}
function tutoriaLink(text, phone = TUTORIAS.whatsapp) {
  const n = String(phone || '').replace(/\D/g, '');
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : '';
}

// ---- interfaz (usa S, view, save, openSheet, ask, toast, esc, ICON, COURSES, courseArt y findLesson de la app) ----
const tuCourse = id => COURSES.find(c => c.id === id);
const tuTitles = b => b.topics.map(id => findLesson(id)?.l.title).filter(Boolean);
const TU_ERRORS = {
  slot: 'Ese cupo ya no está disponible. Elige otra hora.',
  busy: 'Ya tienes una asesoría a esa hora.',
  max: `Puedes tener hasta ${TUTORIAS.max} asesorías pendientes. Cancela una para separar otra.`,
  topics: 'Elige al menos un tema para reforzar.',
};

function renderTutorias() {
  const now = Date.now(), mine = activeTutorias(S.tutorias, now);
  if (!Array.isArray(S.tutorias) || mine.length !== S.tutorias.length) { S.tutorias = mine; save(); }   // las que ya pasaron se van
  const full = mine.length >= TUTORIAS.max, nx = nextFree(now, mine);
  // Primero la materia que se está estudiando.
  const courses = [...COURSES].sort((a, b) => (b.id === S.course) - (a.id === S.course));
  view.innerHTML = `<div class="tutorias">
    <header class="tu-head"><h1>Tutorías</h1>
      <p class="muted">Separa una asesoría virtual para reforzar lo que más te cuesta. Eliges la materia, los temas, el día y la hora.</p></header>
    ${mine.length ? `<section class="card tu-mine-card"><h2>Tus asesorías</h2>${mine.map(b => {
      const c = tuCourse(b.course), titles = tuTitles(b);
      return `<div class="tu-mine" style="--c:${c?.color || 'var(--brand)'}">
        <span class="tu-when"><b>${esc(dayLabel(b.date, now))}</b><small>${hourLabel(b.time)}</small></span>
        <span class="tu-what"><b>${esc(c?.name || 'Asesoría')}</b><small>${esc(titles.join(' · '))}${b.note ? `${titles.length ? ' · ' : ''}«${esc(b.note)}»` : ''}</small></span>
        <span class="tu-acts"><button class="tu-cancel" data-cancel="${esc(b.id)}" aria-label="Cancelar la asesoría de ${esc(c?.name || 'la materia')}">Cancelar</button></span>
      </div>`;
    }).join('')}</section>` : ''}
    <section class="tu-pick">
      <h2>¿En qué materia quieres reforzar?</h2>
      <p class="tu-nextfree">${ICON.calendar}<span>${full ? `Ya tienes ${TUTORIAS.max} asesorías pendientes. Cancela una para separar otra.`
        : nx ? `Próximo cupo: <b>${esc(dayLabel(nx.date, now))} · ${hourLabel(nx.time)}</b>` : 'No quedan cupos esta semana.'}</span></p>
      <div class="course-list">${courses.map(c => `<button class="course-row tu-course" data-book="${c.id}" style="--c:${c.color}"${full || !nx ? ' disabled' : ''}>
        ${courseArt(c, 'lg')}
        <span class="cr-body"><b>${esc(c.name)}</b><small>${c.units.length} ${c.units.length === 1 ? 'unidad' : 'unidades'} · ${lessonsOf(c).length} temas</small></span>
        ${ICON.right}</button>`).join('')}</div>
    </section>
    ${tutoriaLink('x') ? '' : '<p class="tu-note">Por ahora la asesoría se guarda solo en este celular.</p>'}
  </div>`;
  view.querySelectorAll('[data-book]').forEach(b => b.onclick = () => openBooking(tuCourse(b.dataset.book)));
  view.querySelectorAll('[data-cancel]').forEach(b => b.onclick = () => {
    const bk = S.tutorias.find(x => x.id === b.dataset.cancel);
    if (!bk) return renderTutorias();
    ask({ title: '¿Cancelar esta asesoría?', text: `${tuCourse(bk.course)?.name || 'Asesoría'}: ${dayLabel(bk.date, Date.now())}, ${hourLabel(bk.time)} Puedes separar otra cuando quieras.`, ok: 'Sí, cancelar', cancel: 'Conservarla', danger: true })
      .then(yes => { if (yes) { S.tutorias = cancelTutoria(S.tutorias, bk.id); save(); if (tab === 'tutorias') renderTutorias(); toast('Asesoría cancelada.'); } });
  });
}

// Hoja para separar: temas → día → hora → nota → confirmar. Al confirmar, la misma hoja dice qué quedó.
function openBooking(c) {
  const now = Date.now(), days = tutoriaDays(now, S.tutorias);
  let date = days.find(d => d.slots.some(s => s.free))?.date || null, time = null, topics = [];
  // Arranca en la unidad donde va el estudiante (la de su primera lección sin terminar).
  let unit = Math.max(0, c.units.findIndex(u => u.lessons.some(l => !S.done[l.id])));
  openSheet(`<div class="ag" style="--c:${c.color}">
    <div class="ag-head">${courseArt(c, 'lg')}<div><h3>${esc(c.name)}</h3><p class="muted">Asesoría virtual · ${TUTORIAS.mins} min</p></div></div>
    <h4 id="ag-l1"><i>1</i>¿Qué temas quieres reforzar? <span class="ag-count"></span></h4>
    ${c.units.length > 1 ? `<div class="ag-units" role="group" aria-label="Unidad">${c.units.map((u, i) =>
      `<button class="tu-chip" data-unit="${i}">${esc(u.title)}</button>`).join('')}</div>` : ''}
    <div class="ag-topics" role="group" aria-labelledby="ag-l1"></div>
    <h4 id="ag-l2"><i>2</i>Elige el día</h4>
    <div class="ag-days" role="group" aria-labelledby="ag-l2">${days.map(d => {
      const dt = tuDate(d.date), open = d.slots.some(s => s.free);
      return `<button class="ag-day" data-day="${d.date}"${open ? '' : ' disabled'} aria-label="${TU_DOW[dt.getDay()]} ${dt.getDate()}, ${esc(dayLabel(d.date, now))}${open ? '' : ', sin cupos'}">
        <small>${TU_DOW[dt.getDay()]}</small><b>${dt.getDate()}</b></button>`;
    }).join('')}</div>
    <h4 id="ag-l3"><i>3</i>Elige la hora <span class="ag-daytxt"></span></h4>
    <div class="ag-slots" role="group" aria-labelledby="ag-l3"></div>
    <h4><i>4</i><label for="ag-note">¿Algo más? (opcional)</label></h4>
    <textarea id="ag-note" class="ag-topic" rows="2" maxlength="140" placeholder="Ej.: tengo parcial el viernes y me enredo con los signos"></textarea>
    <div class="ag-foot"><p class="ag-sum" role="status"></p>
      <button class="btn brand" data-ok disabled>Separar asesoría</button></div>
  </div>`, sh => {
    const q = s => sh.querySelector(s), qa = s => sh.querySelectorAll(s);
    const press = (b, on) => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); };
    const paint = () => {
      qa('[data-unit]').forEach(b => {
        const i = +b.dataset.unit, n = c.units[i].lessons.filter(l => topics.includes(l.id)).length;
        press(b, i === unit);
        b.textContent = c.units[i].title + (n ? ` (${n})` : '');
      });
      const fullT = topics.length >= TUTORIAS.maxTopics;
      q('.ag-topics').innerHTML = c.units[unit].lessons.map(l => {
        const on = topics.includes(l.id);
        return `<button class="ag-topic-chip${on ? ' on' : ''}" data-topic="${l.id}" aria-pressed="${on}"${!on && fullT ? ' disabled' : ''}>${on ? ICON.check : ''}<span>${esc(l.title)}</span></button>`;
      }).join('');
      qa('[data-topic]').forEach(b => b.onclick = () => { topics = toggleTopic(topics, b.dataset.topic); paint(); q(`[data-topic="${b.dataset.topic}"]`)?.focus({ preventScroll: true }); });
      q('.ag-count').textContent = topics.length ? `· ${topics.length} de ${TUTORIAS.maxTopics}` : `· hasta ${TUTORIAS.maxTopics}`;
      qa('.ag-day').forEach(b => press(b, b.dataset.day === date));
      q('.ag-daytxt').textContent = date ? `· ${dayLabel(date, now)}` : '';
      q('.ag-slots').innerHTML = (days.find(d => d.date === date)?.slots || []).map(s =>
        `<button class="ag-slot${s.time === time ? ' on' : ''}" data-time="${s.time}" aria-pressed="${s.time === time}"${s.free ? '' : ' disabled title="Ya tienes una asesoría a esa hora"'}>${hourLabel(s.time)}</button>`).join('');
      qa('.ag-slot').forEach(b => b.onclick = () => { time = b.dataset.time; paint(); q(`[data-time="${time}"]`)?.focus({ preventScroll: true }); });
      q('.ag-sum').textContent = !topics.length ? 'Elige al menos un tema.' : !time ? 'Elige una hora para continuar.'
        : `${dayLabel(date, now)}, ${hourLabel(time)} · ${topics.length} ${topics.length === 1 ? 'tema' : 'temas'} de ${c.name}`;
      q('[data-ok]').disabled = !time || !topics.length;
    };
    qa('[data-unit]').forEach(b => b.onclick = () => { unit = +b.dataset.unit; paint(); });
    qa('.ag-day').forEach(b => b.onclick = () => { date = b.dataset.day; time = null; paint(); });
    q('[data-ok]').onclick = () => {
      const n = Date.now(), r = bookTutoria(S.tutorias, { course: c.id, topics, date, time, note: q('#ag-note').value }, n, tutoriaCatalog(COURSES));
      if (!r.ok) { toast(TU_ERRORS[r.error] || TU_ERRORS.slot); if (r.error === 'slot' || r.error === 'busy') { closeSheet(); renderTutorias(); } return; }
      S.tutorias = r.list; save();
      const b = r.booking, titles = tuTitles(b), wa = tutoriaLink(tutoriaText(b, S.name, c.name, titles, n));
      q('.ag').innerHTML = `<div class="ag-done">${ICON.check}</div>
        <h3 class="ag-done-title" tabindex="-1">¡Asesoría separada!</h3>
        <div class="ag-done-when"><b>${esc(dayLabel(b.date, n))}, ${hourLabel(b.time)}</b><span>${esc(c.name)} · ${b.mins} min</span>
          <ul>${titles.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
        <p class="muted ag-done-next">${wa ? 'Avísale a coordinación por WhatsApp para confirmar tu cupo y recibir el enlace.'
          : 'Quedó guardada en este celular, en «Tus asesorías». Todavía no le avisa a ningún tutor.'}</p>
        ${wa ? `<a class="btn brand" href="${esc(wa)}" target="_blank" rel="noopener">Avisar por WhatsApp</a>` : ''}
        <button class="btn ${wa ? 'ghost' : 'brand'}" data-close>Listo</button>`;
      q('[data-close]').onclick = closeSheet;
      q('.ag-done-title').focus({ preventScroll: true });
      if (tab === 'tutorias') renderTutorias();
    };
    paint();
    // La unidad elegida queda a la vista en la fila de unidades (se desplaza de lado).
    const u0 = q('[data-unit].on');
    if (u0) u0.parentNode.scrollLeft = u0.offsetLeft - 18;
  });
}
