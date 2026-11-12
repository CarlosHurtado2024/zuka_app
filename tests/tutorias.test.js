// Pestaña Tutorías: el estudiante separa una asesoría eligiendo materia, temas (del contenido de la app),
// día y hora. Sin nombres de tutores. Diseño: docs/superpowers/specs/2026-11-12-tutorias.md.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const ctx = loadScripts(['js/tutorias.js']);
const g = n => get(ctx, n);
const CFG = g('TUTORIAS');
const tutoriaDays = g('tutoriaDays'), nextFree = g('nextFree'), bookTutoria = g('bookTutoria');
const activeTutorias = g('activeTutorias'), cancelTutoria = g('cancelTutoria'), toggleTopic = g('toggleTopic');
const dayLabel = g('dayLabel'), hourLabel = g('hourLabel'), tutoriaText = g('tutoriaText'), tutoriaLink = g('tutoriaLink');

// Jueves 12 de noviembre de 2026, 3:30 p. m. (hora local).
const at = (d, h, m = 0) => new Date(2026, 10, d, h, m).getTime();
const NOW = at(12, 15, 30);
// Horario de prueba: jueves (4) a las 4, 5 y 6 p. m.; lunes (1) a las 9 a. m.
const H = { 4: ['16:00', '17:00', '18:00'], 1: ['09:00'] };
// Contenido de prueba: qué lecciones tiene cada materia.
const CAT = { algebra: ['alg-1', 'alg-2', 'alg-3', 'alg-4', 'alg-5'], trig: ['trig-1'] };
const req = (o = {}) => ({ course: 'algebra', topics: ['alg-2'], date: '2026-11-12', time: '17:00', note: '', ...o });
const book = (mine, o, now = NOW) => bookTutoria(mine, req(o), now, CAT, H);

test('tutoriaDays da los próximos 7 días con sus cupos', () => {
  const days = tutoriaDays(NOW, [], H);
  assert.equal(days.map(d => d.date).join(), '2026-11-12,2026-11-13,2026-11-14,2026-11-15,2026-11-16,2026-11-17,2026-11-18');
  assert.equal(days[4].slots.map(s => s.time).join(), '09:00', 'el lunes');
  assert.equal(days[1].slots.length, 0, 'el viernes no hay');
});

test('hoy solo quedan los cupos con una hora de anticipación', () => {
  assert.equal(tutoriaDays(NOW, [], H)[0].slots.map(s => s.time).join(), '17:00,18:00');
  assert.equal(tutoriaDays(at(12, 15, 0), [], H)[0].slots.map(s => s.time).join(), '16:00,17:00,18:00', 'justo una hora antes sí');
  assert.equal(tutoriaDays(at(12, 20), [], H)[0].slots.length, 0);
});

test('el choque con otra asesoría del estudiante es por intervalo: pegadas no chocan, montadas sí', () => {
  const free = mine => tutoriaDays(NOW, mine, H)[0].slots.map(s => s.free).join();
  const b = (time, mins) => [{ id: 'a', course: 'trig', topics: ['trig-1'], date: '2026-11-12', time, mins }];
  assert.equal(free(b('17:00', 45)), 'false,true');
  assert.equal(free(b('16:30', 30)), 'true,true', 'termina justo a las 5:00');
  assert.equal(free(b('17:30', 45)), 'false,false', '5:30 a 6:15 toca los dos cupos');
});

test('nextFree es el primer cupo libre', () => {
  assert.equal(JSON.stringify(nextFree(NOW, [], H)), JSON.stringify({ date: '2026-11-12', time: '17:00' }));
  assert.equal(nextFree(at(12, 20), [], H).date, '2026-11-16');
  assert.equal(nextFree(NOW, [], {}), null);
});

test('separar guarda materia, temas, día y hora, y no cambia la lista original', () => {
  const mine = [];
  const r = book(mine, { topics: ['alg-2', 'alg-4'], note: '  factorizar  ' });
  assert.equal(r.ok, true);
  assert.equal(mine.length, 0);
  const b = r.booking;
  assert.equal([b.course, b.topics.join('+'), b.date, b.time, b.mins, b.note, b.made].join('|'), `algebra|alg-2+alg-4|2026-11-12|17:00|${CFG.mins}|factorizar|${NOW}`);
  assert.ok(b.id);
  assert.equal(r.list.length, 1);
});

test('hay que elegir una materia de la app y al menos un tema suyo (máximo 4)', () => {
  assert.equal(book([], { course: 'quimica' }).error, 'course');
  assert.equal(book([], { topics: [] }).error, 'topics');
  assert.equal(book([], { topics: undefined }).error, 'topics');
  assert.equal(book([], { topics: ['trig-1'] }).error, 'topics', 'ese tema es de otra materia');
  assert.equal(book([], { topics: ['alg-1', 'alg-2', 'alg-3', 'alg-4', 'alg-5'] }).error, 'topics');
  assert.equal(book([], { topics: ['alg-1', 'alg-1'] }).booking.topics.join(), 'alg-1', 'sin repetidos');
  assert.equal(CFG.maxTopics, 4);
});

test('no se separa un cupo que no existe o ya pasó, ni chocando, ni más del tope', () => {
  assert.equal(book([], { time: '15:00' }).error, 'slot');
  assert.equal(book([], { time: '16:00' }).error, 'slot', 'falta menos de una hora');
  assert.equal(book([], { date: '2026-11-19' }).error, 'slot', 'más allá de los 7 días');
  const one = book([]).list;
  assert.equal(book(one).error, 'busy');
  const three = [0, 1, 2].map(i => ({ id: 'x' + i, course: 'trig', topics: ['trig-1'], date: '2026-11-14', time: `1${i}:00`, mins: 45 }));
  assert.equal(book(three).error, 'max');
  assert.equal(CFG.max, 3);
  const old = three.map(b => ({ ...b, date: '2026-11-10' }));
  assert.equal(book(old).ok, true, 'las que ya terminaron no cuentan');
});

test('la nota se recorta a 140 letras', () => {
  assert.equal(book([], { note: 'x'.repeat(300) }).booking.note.length, 140);
  assert.equal(book([], { note: undefined }).booking.note, '');
});

test('toggleTopic marca y desmarca temas sin pasar del máximo', () => {
  assert.equal(toggleTopic([], 'a').join(), 'a');
  assert.equal(toggleTopic(['a', 'b'], 'a').join(), 'b');
  assert.equal(toggleTopic(['a', 'b', 'c', 'd'], 'e').join(), 'a,b,c,d', 'el quinto no entra');
  assert.equal(toggleTopic(['a', 'b', 'c', 'd'], 'd').join(), 'a,b,c');
});

test('las asesorías pendientes salen en orden y desaparecen cuando terminan', () => {
  const b = (id, date, time) => ({ id, course: 'algebra', topics: ['alg-1'], date, time, mins: 45 });
  const mine = [b('b', '2026-11-16', '09:00'), b('a', '2026-11-12', '15:00'), b('c', '2026-11-11', '17:00')];
  assert.equal(activeTutorias(mine, NOW).map(x => x.id).join(), 'a,b', 'la que está en curso sigue visible');
  assert.equal(activeTutorias(mine, at(12, 15, 45)).map(x => x.id).join(), 'b');
});

test('datos dañados o del formato viejo (con tutor, sin temas) se descartan sin romper nada', () => {
  const bad = [null, 'x', { id: 'a' }, { id: 'c', date: 'ayer', time: '17:00', topics: [] },
    { id: 'viejo', tutor: 'tut-laura', date: '2026-11-13', time: '10:00', mins: 45, course: 'algebra', topic: 'x' },
    { id: 'ok', course: 'algebra', topics: ['alg-1'], date: '2026-11-13', time: '10:00' }];
  const fine = { course: 'algebra', topics: ['alg-1'], date: '2026-11-13', time: '10:00' };
  bad.push({ ...fine }, { ...fine, id: 'eterna', mins: 1e9 }, { ...fine, id: 'neg', mins: -5 });   // sin id no se podría cancelar
  assert.equal(activeTutorias(bad, NOW).map(b => b.id).join(), 'ok', 'sin mins dura lo normal');
  for (const junk of [{}, 'x', 7, null, undefined]) {
    assert.equal(activeTutorias(junk, NOW).length, 0);
    assert.equal(tutoriaDays(NOW, junk, H)[0].slots.length, 2);
    assert.equal(book(junk).list.length, 1);
    assert.equal(cancelTutoria(junk, 'a').length, 0);
  }
  assert.equal(book(bad).list.length, 2, 'al separar solo queda lo válido');
});

test('cancelar quita solo esa asesoría', () => {
  const mine = [{ id: 'a' }, { id: 'b' }];
  assert.equal(cancelTutoria(mine, 'a').map(b => b.id).join(), 'b');
  assert.equal(mine.length, 2);
});

test('etiquetas de día y de hora en español, también al cruzar fin de año', () => {
  assert.equal(dayLabel('2026-11-12', NOW), 'Hoy');
  assert.equal(dayLabel('2026-11-13', NOW), 'Mañana');
  assert.equal(dayLabel('2026-11-16', NOW), 'lun 16 nov');
  assert.equal(dayLabel('2026-11-12', at(12, 23, 59)), 'Hoy');
  const dec = new Date(2026, 11, 29, 8).getTime();
  assert.equal(tutoriaDays(dec, [], H).map(x => x.date).slice(2, 5).join(), '2026-12-31,2027-01-01,2027-01-02');
  assert.equal(dayLabel('2027-01-04', dec), 'lun 4 ene');
  assert.equal(hourLabel('09:00'), '9:00 a. m.');
  assert.equal(hourLabel('12:30'), '12:30 p. m.');
  assert.equal(hourLabel('16:00'), '4:00 p. m.');
  assert.equal(hourLabel('00:15'), '12:15 a. m.');
});

test('el aviso por WhatsApp lleva materia, temas, día y hora; sin número no hay enlace', () => {
  const b = book([], { note: 'voy perdido' }).booking;
  const txt = tutoriaText(b, 'Sara', 'Álgebra', ['Regla de tres', 'Porcentajes'], NOW);
  for (const part of ['Sara', 'Hoy', '5:00 p. m.', 'Álgebra', 'Regla de tres; Porcentajes', 'voy perdido']) assert.ok(txt.includes(part), part);
  assert.equal(tutoriaLink(txt, ''), '');
  assert.equal(tutoriaLink('hola & chao', '57 300-123'), 'https://wa.me/57300123?text=hola%20%26%20chao');
});

test('el horario de la app está bien escrito y siempre hay cupos en la semana', () => {
  const days = Object.entries(CFG.hours);
  assert.ok(days.length >= 3);
  for (const [dow, hs] of days) {
    assert.ok(+dow >= 0 && +dow <= 6);
    assert.ok(hs.length && hs.every(h => /^([01]\d|2[0-3]):[0-5]\d$/.test(h)), `horas del día ${dow}`);
    assert.equal(hs.join(), [...hs].sort().join(), 'horas en orden');
    for (let i = 1; i < hs.length; i++) {
      const min = t => +t.slice(0, 2) * 60 + +t.slice(3);
      assert.ok(min(hs[i]) - min(hs[i - 1]) >= CFG.mins, 'los cupos no se montan');
    }
  }
  assert.ok(nextFree(NOW, []));
  assert.equal(CFG.leadMin, 60);
  assert.equal(CFG.days, 7);
});

test('no hay nombres de tutores en la app', () => {
  const src = read('js/tutorias.js');
  assert.doesNotMatch(src, /TUTORS|Laura|Andrés Ríos|Camila|Mateo/);
});

test('las materias y los temas salen del contenido real de la app', () => {
  const c = loadScripts(['js/ui.js', 'js/content.js', 'js/courses/algebra.js', 'js/courses/trig.js', 'js/tutorias.js']);
  const catalog = get(c, 'tutoriaCatalog')([get(c, 'COURSE_ALGEBRA'), get(c, 'COURSE_TRIG')]);
  assert.ok(catalog.algebra.includes('alg-0a') && catalog.trig.length > 5);
  const r = bookTutoria([], req({ topics: ['alg-0a'] }), NOW, catalog, H);
  assert.equal(r.ok, true);
});

test('los títulos de unidades y lecciones son texto simple (la pestaña los muestra sin KaTeX)', () => {
  const c = loadScripts(['js/ui.js', 'js/content.js', 'js/courses/algebra.js', 'js/courses/trig.js', 'js/courses/calculo.js', 'js/courses/geometria.js', 'js/data.js']);
  for (const course of get(c, 'COURSES')) for (const u of course.units) {
    for (const t of [u.title, ...u.lessons.map(l => l.title)]) assert.doesNotMatch(t, /[$\\*<>]/, `${course.id}: ${t}`);
  }
});

test('Tutorías está en el menú, en index.html, en el service worker y en el recorrido', () => {
  const index = read('index.html'), sw = read('sw.js'), app = read('js/app.js');
  assert.match(index, /<button data-tab="clips">Clips<\/button>\s*<button data-tab="tutorias">Tutorías<\/button>\s*<button data-tab="profile">/);
  assert.ok(index.indexOf('js/tutorias.js') > 0 && index.indexOf('js/tutorias.js') < index.indexOf('js/app.js'));
  assert.match(sw, /'js\/tutorias\.js'/);
  assert.match(app, /tutorias: renderTutorias/);
  assert.match(app, /tutorias: \[\]/);
  assert.match(app, /tutorias: S\.tutorias/, 'reiniciar el progreso no borra las citas');
  const step = get(loadScripts(['js/tour.js']), 'TOUR_STEPS').find(s => s.id === 'tutorias');
  assert.match(step.target.join(), /data-tab="tutorias"/);
  assert.match(step.text, /materia/);
});
