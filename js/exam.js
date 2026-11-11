// Evaluaciones de fin de unidad (spec 2026-11-12-evaluaciones-algebra-u1-u3).
// unit.exam = { id, title, minutes, items: [{ lesson, review, ex }] }. Durante la evaluación corre un
// cronómetro, no se dice si cada respuesta es correcta, se puede saltar y la pista hace que la pregunta
// valga la mitad. Al final, examReport arma el informe: lo que se domina y lo que hay que repasar.

const EXAM_LEVELS = [
  { key: 'top', min: 90, title: '¡Dominas la unidad!', msg: 'Tus respuestas muestran que entiendes las ideas de esta unidad.' },
  { key: 'good', min: 70, title: '¡Vas muy bien!', msg: 'Entiendes casi todo. Repasa los temas marcados para afianzarlos.' },
  { key: 'mid', min: 50, title: 'Vas por buen camino', msg: 'Ya tienes una base. Repasa las lecciones marcadas y vuelve a intentarlo.' },
  { key: 'low', min: 0, title: 'Necesitas repasar', msg: 'Vuelve a las lecciones marcadas, mira sus videos y repite la evaluación cuando estés listo.' },
];
const HINT_NOTE = 'Lo resolviste con pista: inténtalo de nuevo sin ella.';

// results[i] = { ok, hint, blank }. Correcta = 1 punto; con pista = ½; mal o en blanco = 0.
function examReport(exam, results) {
  const items = exam.items.map((it, i) => {
    const r = results[i] || {};
    const state = r.ok ? (r.hint ? 'hint' : 'ok') : r.blank ? 'blank' : 'bad';
    return { lesson: it.lesson, review: it.review, state, pts: state === 'ok' ? 1 : state === 'hint' ? 0.5 : 0 };
  });
  const n = items.length, pts = items.reduce((s, x) => s + x.pts, 0);
  const pct = n ? Math.round((100 * pts) / n) : 0;
  const lessons = [...new Set(items.map(x => x.lesson))];
  const mastered = lessons.filter(l => items.filter(x => x.lesson === l).every(x => x.state === 'ok'));
  const review = lessons.filter(l => !mastered.includes(l)).map(l => ({
    lesson: l,
    notes: [...new Set(items.filter(x => x.lesson === l && x.state !== 'ok').map(x => (x.state === 'hint' ? HINT_NOTE : x.review)))],
  }));
  return { pct, n, correct: items.filter(x => x.pts > 0).length, items, mastered, review, level: EXAM_LEVELS.find(lv => pct >= lv.min) };
}

const fmtClock = s => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

// Respuesta correcta de una pregunta, sin necesidad de haberla mostrado.
function examSolution(ex) {
  if (ex.type === 'play') return GAMES[ex.game]?.grade({}, ex.params).solution || '';
  if (ex.type === 'input') return ex.answerText || `$${ex.answer}$${ex.suffix ? ' ' + ex.suffix : ''}`;
  if (ex.type === 'mc') return ex.options[ex.answer];
  return ex.answerText || '';
}

const examUnlocked = u => S.unlockAll || u.lessons.every(isDone);

function openExamSheet(c, u) {
  const E = u.exam, best = S.exams[E.id]?.best, open = examUnlocked(u);
  openSheet(`<div class="ls exam-sheet" style="--c:${c.color}">
    <p class="eyebrow">Evaluación del mundo</p><h3>${esc(E.title)}</h3>
    <p class="ls-meta"><span>${ICON.clock} ${E.minutes} min</span><span>${ICON.target} ${E.items.length} preguntas</span>${best != null ? `<span>${ICON.trophy} Mejor: ${best}%</span>` : ''}</p>
    <ul class="exam-rules">
      <li>No verás si aciertas hasta el final: ahí recibes tu informe.</li>
      <li>Puedes saltar una pregunta y volver a ella después.</li>
      <li>Cada pregunta tiene pista, pero si la usas esa pregunta vale la mitad.</li>
      <li>Cuando se acaba el tiempo, la evaluación se entrega sola.</li>
    </ul>
    ${open ? `<button class="btn" data-go>${best != null ? 'Repetir evaluación' : 'Empezar evaluación'}</button>`
      : '<p class="muted">Completa todas las lecciones del mundo para abrir la evaluación.</p><button class="btn" disabled>Bloqueada</button>'}
  </div>`, sh => sh.querySelector('[data-go]')?.addEventListener('click', () => { closeSheet(); startExam(c, u); }));
}

function startExam(c, u) {
  const E = u.exam, n = E.items.length, back = tab;
  cleanup?.(); cleanup = null;
  const results = E.items.map(() => ({ ok: false, hint: false, blank: true }));
  const queue = E.items.map((_, i) => i), skipped = new Set();
  const t0 = Date.now(), deadline = t0 + E.minutes * 60000;
  let handle = null, finished = false, timer = null;

  const ov = $('#overlay');
  ov.innerHTML = `<div class="lesson exam" style="--c:${c.color}">
    <div class="lesson-top">
      <button class="icon-btn" data-close aria-label="Salir">${ICON.x}</button>
      <div class="exam-dots" aria-hidden="true">${E.items.map(() => '<i></i>').join('')}</div>
      <span class="exam-clock" role="timer" aria-label="Tiempo restante">${ICON.clock}<b>${fmtClock(E.minutes * 60)}</b></span>
    </div>
    <div class="lesson-body"></div>
    <div class="lesson-foot exam-foot"><button class="btn ghost skip" type="button">Saltar</button><button class="btn main" type="button">Responder</button></div>
  </div>`;
  ov.classList.add('open');
  document.body.classList.add('in-lesson');
  const root = $('.lesson', ov), body = $('.lesson-body', ov), btn = $('.btn.main', ov), skip = $('.btn.skip', ov);
  const clock = $('.exam-clock', ov), dots = [...ov.querySelectorAll('.exam-dots i')];

  function teardown() { handle?.destroy?.(); handle = null; }
  function close(to) {
    if (!finished && !confirm('¿Salir de la evaluación? No se guardará tu resultado.')) return;
    finished = true; clearInterval(timer); teardown();
    document.removeEventListener('keydown', onKey);
    ov.classList.remove('open'); ov.innerHTML = '';
    document.body.classList.remove('in-lesson');
    lessonClose = null;
    go(typeof to === 'string' ? to : back);
  }
  lessonClose = close;
  ov.querySelectorAll('[data-close]').forEach(b => { b.onclick = () => close(); });

  function paintDots() {
    dots.forEach((d, i) => {
      d.className = i === queue[0] && !finished ? 'cur' : !results[i].blank ? 'done' : skipped.has(i) && queue.includes(i) ? 'skip' : queue.includes(i) ? '' : 'blank';
    });
  }

  function tick() {
    const left = (deadline - Date.now()) / 1000;
    clock.querySelector('b').textContent = fmtClock(left);
    clock.classList.toggle('low', left <= 60);
    if (left <= 0) finish(true);
  }

  function step() {
    teardown();
    body.scrollTop = 0;
    if (!queue.length) return finish(false);
    const i = queue[0], it = E.items[i];
    handle = renderExercise(body, it.ex, ok => { btn.disabled = !ok; });
    $('.ex-kind', body).textContent = `Pregunta ${i + 1} de ${n} · ${EX_KIND[it.ex.type]}`;
    const hb = $('.hint-btn', body);
    if (hb) {
      $('span', hb).textContent = results[i].hint ? 'Ver pista' : 'Ver pista · la pregunta vale la mitad';
      if (results[i].hint) { hb.hidden = true; $('.hint-text', body).hidden = false; }
      hb.addEventListener('click', () => { results[i].hint = true; });
    }
    btn.textContent = 'Responder'; btn.disabled = true;
    skip.textContent = skipped.has(i) || queue.length === 1 ? 'Dejar en blanco' : 'Saltar';
    paintDots();
  }

  btn.onclick = () => {
    if (finished || btn.disabled) return;
    const i = queue.shift(), r = handle.check();
    results[i] = { ok: r.ok, hint: results[i].hint, blank: false };
    Sfx.tap(); step();
  };
  skip.onclick = () => {
    if (finished) return;
    const i = queue.shift();
    if (skipped.has(i) || !queue.length) results[i].blank = true;
    else { skipped.add(i); queue.push(i); }
    Sfx.tap(); step();
  };

  function finish(timeUp) {
    if (finished) return;
    finished = true; clearInterval(timer); teardown();
    const used = Math.min(E.minutes * 60, Math.round((Date.now() - t0) / 1000));
    const rep = examReport(E, results), prev = S.exams[E.id];
    // Primera vez: hasta 25 XP según el resultado. Al repetir, solo lo que se mejore (y 2 XP por practicar).
    const xp = prev ? 2 + Math.max(0, Math.round((rep.pct - (prev.best ?? 0)) / 5)) : (rep.pct > 0 ? 5 : 0) + Math.round(rep.pct / 5);
    S.exams[E.id] = { best: Math.max(prev?.best ?? 0, rep.pct), last: rep.pct, at: Date.now() };
    addXP(xp); markStreak(); save();
    const title = id => findLesson(id)?.l.title || id;
    const lessonNo = id => { const k = u.lessons.findIndex(l => l.id === id); return k >= 0 ? `Nivel ${c.units.indexOf(u) + 1}-${k + 1}` : ''; };
    const ICONS = { ok: ICON.check, hint: '½', bad: ICON.x, blank: '–' };
    const LABEL = { ok: 'Correcta', hint: 'Correcta con pista', bad: 'Incorrecta', blank: 'Sin responder' };
    const R = 54, L = 2 * Math.PI * R;
    root.classList.add('exam-done');
    clock.classList.remove('low');
    dots.forEach((d, i) => { d.className = rep.items[i].state; });
    body.innerHTML = `<div class="exam-report lv-${rep.level.key}">
      ${rep.pct >= 70 ? '<canvas class="confetti"></canvas>' : ''}
      ${timeUp ? `<p class="er-timeup">${ICON.clock} Se acabó el tiempo: lo que faltaba cuenta como sin responder.</p>` : ''}
      <div class="er-ring" role="img" aria-label="Resultado: ${rep.pct}%">
        <svg viewBox="0 0 128 128"><circle cx="64" cy="64" r="${R}" class="er-track"/><circle cx="64" cy="64" r="${R}" class="er-val"
          stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - rep.pct / 100)}"/></svg><b>${rep.pct}%</b></div>
      <h2>${rep.level.title}</h2><p class="muted">${rep.level.msg}</p>
      <div class="done-stats">
        <div class="ds acc"><small>Correctas</small><b>${rep.correct}/${rep.n}</b></div>
        <div class="ds time"><small>Tiempo</small><b>${fmtClock(used)}</b></div>
        <div class="ds xp"><small>XP</small><b>${ICON.bolt}+${xp}</b></div>
      </div>
      ${rep.mastered.length ? `<section class="er-sec er-good"><h3>${ICON.check} Lo que dominas</h3><ul>
        ${rep.mastered.map(id => `<li><small>${lessonNo(id)}</small>${esc(title(id))}</li>`).join('')}</ul></section>` : ''}
      ${rep.review.length ? `<section class="er-sec er-rev"><h3>${ICON.bulb} Para repasar</h3>
        ${rep.review.map(r => `<div class="er-card"><p><small>${lessonNo(r.lesson)}</small><b>${esc(title(r.lesson))}</b></p>
          <ul>${r.notes.map(t => `<li>${tex(t)}</li>`).join('')}</ul>
          <button class="btn sm ghost" type="button" data-lesson="${r.lesson}">Repasar esta lección ${ICON.right}</button></div>`).join('')}</section>` : ''}
      <section class="er-sec"><h3>${ICON.target} Pregunta por pregunta</h3>
        ${E.items.map((it, i) => { const s = rep.items[i].state; return `<details class="er-q ${s}">
          <summary><span class="er-ic">${ICONS[s]}</span><span><small>Pregunta ${i + 1} · ${LABEL[s]}</small>${esc(title(it.lesson))}</span></summary>
          <div class="er-q-body"><p>${tex(it.ex.q)}</p>
            <p class="fb-label">Respuesta correcta:</p><div class="fb-sol">${tex(examSolution(it.ex))}</div>
            ${it.ex.explain ? `<p class="fb-exp">${tex(it.ex.explain)}</p>` : ''}</div></details>`; }).join('')}
      </section>
      <button class="btn ghost er-again" type="button">Repetir evaluación</button>
    </div>`;
    skip.hidden = true;
    btn.textContent = 'Continuar'; btn.disabled = false; btn.onclick = () => close();
    body.querySelectorAll('[data-lesson]').forEach(b => b.onclick = () => {
      const found = findLesson(b.dataset.lesson); close(); if (found) startLesson(found.c, found.l);
    });
    $('.er-again', body).onclick = () => { close(); startExam(c, u); };
    rep.pct >= 70 ? Sfx.win() : Sfx.tap();
    const cv = $('.confetti', body);
    if (cv) requestAnimationFrame(() => confetti(cv));
  }

  function onKey(e) {
    // En el informe Enter no cierra (sirve para abrir cada pregunta); tampoco cuando el foco está en otro botón.
    if (e.key === 'Enter' && !finished && !btn.disabled && !e.target.closest?.('button, summary, a, details')) { e.preventDefault(); btn.click(); }
  }
  document.addEventListener('keydown', onKey);
  timer = setInterval(tick, 500);
  step();
}
